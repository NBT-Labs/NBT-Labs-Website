/**
 * The barometer. Port of the reference implementation in
 * content/audit/validate.py — keep the two in step, and when they disagree,
 * the Python one plus its synthetic respondents is the arbiter.
 *
 * Runs in the browser: the composite index and the pillar bars are shown
 * before the email gate, so the arithmetic has to be client-side. Nothing
 * here needs the network, and nothing here is secret — the weights are
 * published on the report by design, because a composite index is only
 * defensible when its weighting is visible.
 */

import type {
  Answer,
  Answers,
  Band,
  CapBinding,
  DimensionId,
  Level,
  NumericSpec,
  PillarId,
  Question,
  QuizBundle,
  ScoreResult,
} from "./types";

/** (level - 1) / 4 * 100 → 0, 25, 50, 75, 100. */
export function itemScore(level: Level): number {
  return ((level - 1) / 4) * 100;
}

/**
 * Resolve a numeric answer to a level. First matching band wins, so band
 * order in the bank is significant.
 *
 * `null` means the respondent chose "I don't know". That is not missing data:
 * not knowing how many days your close takes is itself a maturity signal, and
 * it scores at unknownLevel (1) rather than being dropped.
 */
export function bandLevel(spec: NumericSpec, value: number | null): Level {
  if (value === null || Number.isNaN(value)) return spec.unknownLevel;
  for (const b of spec.bands) {
    if (b.lte !== undefined && value <= b.lte) return b.level;
    if (b.lt !== undefined && value < b.lt) return b.level;
    if (b.gte !== undefined && value >= b.gte) return b.level;
    if (b.gt !== undefined && value > b.gt) return b.level;
  }
  return spec.bands[spec.bands.length - 1].level;
}

type WeightedItem = { score: number; weight: number };

function meanWeighted(items: WeightedItem[]): number | undefined {
  const total = items.reduce((s, i) => s + i.weight, 0);
  if (total === 0) return undefined;
  return items.reduce((s, i) => s + i.score * i.weight, 0) / total;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function bandFor(bands: Band[], index: number): Band {
  const rounded = Math.round(index);
  const hit = bands.find((b) => rounded >= b.from && rounded <= b.to);
  // Defensive: bands cover 0-100 contiguously, but never throw on a result screen.
  return hit ?? bands[bands.length - 1];
}

/**
 * Score a set of answers.
 *
 * `reweight` carries the layer multipliers on base DIMENSION weights — a
 * construction client's quote_to_cash counts for more inside its pillar than a
 * clinic's does, even though the questions are identical. The public quiz
 * passes nothing, since no layer is active until the full audit.
 *
 * Note where it applies: at the pillar rollup, on the dimension's weight. It
 * deliberately does NOT scale the question weights inside a dimension, because
 * a uniform multiplier there cancels out of a weighted mean and would be a
 * silent no-op.
 */
export function score(
  bundle: QuizBundle,
  answers: Answers,
  reweight: Partial<Record<DimensionId, number>> = {},
): ScoreResult {
  const questions = new Map<string, Question>(
    [...bundle.questions, ...bundle.gateQuestions].map((q) => [q.id, q]),
  );

  const perDimension = new Map<DimensionId, WeightedItem[]>();
  const flags = new Set<string>();
  const reveals: Record<string, unknown> = {};

  const push = (dim: DimensionId, score: number, weight: number) => {
    const list = perDimension.get(dim) ?? [];
    list.push({ score, weight });
    perDimension.set(dim, list);
  };

  for (const [id, raw] of Object.entries(answers)) {
    const q = questions.get(id);
    if (!q) continue;

    const weight = q.weight ?? 1;

    if (q.type === "single" || q.type === "multi") {
      const picked: string[] = Array.isArray(raw)
        ? raw
        : typeof raw === "string"
          ? [raw]
          : [];
      const options = new Map((q.options ?? []).map((o) => [o.value, o]));
      const levels: Level[] = [];

      for (const value of picked) {
        const option = options.get(value);
        if (!option) continue;
        if (option.flag) flags.add(option.flag);
        if (option.reveals) Object.assign(reveals, option.reveals);
        // na and informational are excluded from the score, not scored zero.
        if (option.na || option.informational || option.level === undefined) continue;
        levels.push(option.level);
      }

      if (q.dimension === "firmographic" || weight === 0 || levels.length === 0) continue;
      const mean = levels.reduce((s, l) => s + itemScore(l), 0) / levels.length;
      push(q.dimension, mean, weight);
    } else if (q.type === "number") {
      const value =
        raw === null || raw === undefined || raw === ""
          ? null
          : typeof raw === "number"
            ? raw
            : Number(raw);
      if (q.reveals) {
        for (const key of q.reveals) reveals[key] = value;
      }
      if (q.dimension === "firmographic" || weight === 0 || !q.numeric) continue;
      push(q.dimension, itemScore(bandLevel(q.numeric, value)), weight);
    }
  }

  /* ---------------------------------------------- dimension and pillar rollup */

  const dimensionsRaw: Partial<Record<DimensionId, number>> = {};
  const counts = new Map<DimensionId, number>();
  for (const [dim, items] of perDimension) {
    const mean = meanWeighted(items);
    if (mean === undefined) continue;
    dimensionsRaw[dim] = mean;
    counts.set(dim, items.length);
  }

  const minimum = bundle.minimumCoverage.dimension_reported;
  const answeredDims = Object.keys(dimensionsRaw) as DimensionId[];
  const reportable = answeredDims.filter((d) => (counts.get(d) ?? 0) >= minimum);
  const thin = answeredDims.filter((d) => (counts.get(d) ?? 0) < minimum);

  /* ------------------------------------------------------------- cap rules */

  /**
   * Non-compensatory corrections. Additive scoring hides a catastrophic
   * dimension behind good ones, which is exactly wrong when the catastrophic
   * one is the expensive one.
   *
   * The floor (50) matters: a cap constrains what the good scores MEAN, it is
   * not a claim the good things aren't happening. Without it one zero on
   * documentation crushed an otherwise strong profile into the bottom band and
   * the instrument read as rigged.
   */
  const FLOOR = bundle.capRules.floor;
  const dimensions: Partial<Record<DimensionId, number>> = { ...dimensionsRaw };
  const capsBound: CapBinding[] = [];

  const doc = dimensionsRaw.process_documentation;
  const data = dimensionsRaw.data_reporting;

  if (doc !== undefined) {
    const ceiling = Math.max(doc + 20, FLOOR);
    const exempt = new Set<string>(["process_documentation", "sponsorship_change"]);
    for (const dim of Object.keys(dimensions) as DimensionId[]) {
      if (exempt.has(dim)) continue;
      const current = dimensions[dim];
      if (current !== undefined && current > ceiling) {
        capsBound.push({
          rule: "documentation_caps_all",
          target: dim,
          from: round1(current),
          to: round1(ceiling),
        });
        dimensions[dim] = ceiling;
      }
    }
  }

  // Measured on the UNCAPPED foundations, and deliberately without a floor:
  // telling a prospect their AI readiness is zero because nothing is written
  // down is the message worth delivering.
  if (
    data !== undefined &&
    doc !== undefined &&
    dimensions.ai_automation_readiness !== undefined
  ) {
    const ceiling = Math.min(data, doc);
    if (dimensions.ai_automation_readiness > ceiling) {
      capsBound.push({
        rule: "ai_cannot_outrun_foundations",
        target: "ai_automation_readiness",
        from: round1(dimensions.ai_automation_readiness),
        to: round1(ceiling),
      });
      dimensions.ai_automation_readiness = ceiling;
    }
  }

  const pillars: Partial<Record<PillarId, number>> = {};
  for (const pillar of bundle.pillars) {
    const members: WeightedItem[] = bundle.dimensions
      .filter((d) => d.pillar === pillar.id && dimensions[d.id] !== undefined)
      .map((d) => ({
        score: dimensions[d.id] as number,
        weight: d.weight * (reweight[d.id] ?? 1),
      }));
    const mean = meanWeighted(members);
    if (mean !== undefined) pillars[pillar.id] = mean;
  }

  const pillarItems: WeightedItem[] = bundle.pillars
    .filter((p) => pillars[p.id] !== undefined)
    .map((p) => ({ score: pillars[p.id] as number, weight: p.weight }));
  let index = meanWeighted(pillarItems) ?? 0;

  if (data !== undefined) {
    const ceiling = Math.max(data + 15, FLOOR);
    if (index > ceiling) {
      capsBound.push({
        rule: "data_caps_index",
        target: "index",
        from: round1(index),
        to: round1(ceiling),
      });
      index = ceiling;
    }
  }

  /* ----------------------------------------------------------- red flags */

  for (const [dim, value] of Object.entries(dimensions) as [DimensionId, number][]) {
    if (value < 25) flags.add(`dimension_critical:${dim}`);
  }
  if ((dimensions.sponsorship_change ?? 100) < 30) flags.add("no_sponsor");
  if ((dimensions.people_continuity ?? 100) < 30) flags.add("continuity_risk");

  return {
    instrumentVersion: bundle.instrumentVersion,
    index: round1(index),
    band: bandFor(bundle.bands, index),
    pillars: Object.fromEntries(
      Object.entries(pillars).map(([k, v]) => [k, round1(v as number)]),
    ) as Partial<Record<PillarId, number>>,
    dimensions: Object.fromEntries(
      Object.entries(dimensions).map(([k, v]) => [k, round1(v as number)]),
    ) as Partial<Record<DimensionId, number>>,
    dimensionsRaw: Object.fromEntries(
      Object.entries(dimensionsRaw).map(([k, v]) => [k, round1(v as number)]),
    ) as Partial<Record<DimensionId, number>>,
    reportable,
    thin,
    capsBound,
    flags: [...flags].sort(),
    reveals,
  };
}

/** Has every scored question been answered? Drives the "see result" button. */
export function isComplete(bundle: QuizBundle, answers: Answers): boolean {
  return bundle.questions.every((q) => {
    const value = answers[q.id];
    if (value === undefined) return false;
    if (q.type === "number") return value === null || value !== "";
    if (Array.isArray(value)) return value.length > 0;
    return value !== "";
  });
}

export function answeredCount(bundle: QuizBundle, answers: Answers): number {
  return bundle.questions.filter((q) => answers[q.id] !== undefined).length;
}

/** Normalize a raw form value into an Answer. "" means not answered. */
export function parseAnswer(q: Question, raw: string): Answer {
  if (q.type !== "number") return raw;
  if (raw === "__unknown__") return null;
  if (raw.trim() === "") return "";
  const n = Number(raw);
  return Number.isFinite(n) ? n : "";
}
