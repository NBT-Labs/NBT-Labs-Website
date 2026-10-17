/**
 * Parity test: the TypeScript engine must agree with the Python reference in
 * content/audit/validate.py, to the decimal.
 *
 * The expected numbers below are the output of a real `python3 validate.py`
 * run, not hand-derived. If this file fails after you touch score.ts, run the
 * Python reference and find out which one is wrong before changing the
 * expectations — the cap rules are the easiest thing in this codebase to break
 * subtly, and a wrong cap produces a plausible-looking score.
 *
 * Runs on the Node test runner with type stripping, so no test framework
 * dependency:  npm test
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { score, bandLevel, itemScore, isComplete } from "./score.ts";
import type {
  Answers,
  DimensionId,
  Level,
  Question,
  QuizBundle,
} from "./types.ts";

const AUDIT = join(process.cwd(), "content", "audit");
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));

const scoring = read(join(AUDIT, "scoring", "scoring.v1.json"));
const base = read(join(AUDIT, "banks", "base.v1.json"));

/**
 * The real quiz bundle carries 12 questions. For parity with the Python
 * reference we need all 60 from the base bank, so build a bundle-shaped
 * object over the whole bank. Same shape, wider question set.
 */
function fullBaseBundle(): QuizBundle {
  const questions: Question[] = base.questions
    .filter((q: { type: string }) => q.type !== "text")
    .map((q: Record<string, unknown>) => {
      const numeric = q.numeric as Record<string, unknown> | undefined;
      return {
        id: q.id,
        dimension: q.dimension,
        type: q.type,
        stem: q.stem,
        weight: (q.weight as number) ?? 1,
        options: q.options,
        numeric: numeric
          ? {
              unit: numeric.unit,
              min: numeric.min,
              max: numeric.max,
              integer: numeric.integer ?? false,
              direction: numeric.direction ?? "lower_is_better",
              allowUnknown: numeric.allow_unknown ?? true,
              unknownLevel: numeric.unknown_level ?? 1,
              bands: numeric.bands,
            }
          : undefined,
        reveals: q.reveals,
      } as Question;
    });

  return {
    instrumentVersion: scoring.instrument_version,
    bankVersion: base.bank_version,
    generated: "test",
    generatedBy: "score.test.ts",
    name: scoring.name,
    promise: scoring.instruments.quiz.promise,
    coverageDisclosure: scoring.instruments.quiz.coverage_disclosure,
    gate: { ungated: [], gated: [], alsoCollected: [] },
    ladder: scoring.ladder.levels,
    dimensions: scoring.dimensions,
    pillars: scoring.pillars,
    bands: scoring.bands.ranges,
    capRules: {
      floor: scoring.cap_rules.floor_principle.value,
      rules: scoring.cap_rules.rules,
    },
    minimumCoverage: scoring.aggregation.minimum_coverage,
    redFlags: { answerTriggered: scoring.red_flags.answer_triggered },
    questions,
    gateQuestions: [],
  } as QuizBundle;
}

const bundle = fullBaseBundle();

/**
 * Mirrors the `synthetic` helper in validate.py exactly, including its band
 * value choices. Any divergence here invalidates the comparison.
 */
function synthetic(pick: (q: Question) => Level): Answers {
  const answers: Answers = {};
  for (const q of bundle.questions) {
    const want = pick(q);
    if (q.type === "number" && q.numeric) {
      const bands = q.numeric.bands;
      const target = bands.filter((b) => b.level === want);
      const b = target.length > 0 ? target[0] : bands[0];
      if (b.lte !== undefined) answers[q.id] = b.lte;
      else if (b.lt !== undefined) answers[q.id] = b.lt - 1;
      else if (b.gt !== undefined) answers[q.id] = b.gt + 1;
      else if (b.gte !== undefined) answers[q.id] = b.gte;
    } else {
      const options = q.options ?? [];
      const scored = options.filter((o) => o.level !== undefined);
      if (scored.length === 0) {
        const info = options.filter((o) => o.informational);
        if (info.length > 0) answers[q.id] = info[0].value;
        continue;
      }
      let best = scored[0];
      for (const o of scored) {
        if (Math.abs((o.level as number) - want) < Math.abs((best.level as number) - want)) {
          best = o;
        }
      }
      answers[q.id] = best.value;
    }
  }
  return answers;
}

const flat = (level: Level) => synthetic(() => level);

/* ------------------------------------------------------------------ units */

test("itemScore maps the five levels onto 0-100", () => {
  assert.deepEqual(
    ([1, 2, 3, 4, 5] as Level[]).map(itemScore),
    [0, 25, 50, 75, 100],
  );
});

test("a numeric 'I don't know' scores at level 1, not as missing data", () => {
  const q = bundle.questions.find((x) => x.id === "base.fin.q01");
  assert.ok(q?.numeric, "base.fin.q01 should be numeric");
  assert.equal(bandLevel(q.numeric, null), 1);
  // And a real answer still bands normally.
  assert.equal(bandLevel(q.numeric, 3), 5);
  assert.equal(bandLevel(q.numeric, 25), 1);
});

test("first matching band wins, so band order is significant", () => {
  const q = bundle.questions.find((x) => x.id === "base.perf.q02");
  assert.ok(q?.numeric);
  // Deliberately non-monotonic: more than ~25 numbers is a dashboard nobody
  // reads, which is level 3 and not level 5.
  assert.equal(bandLevel(q.numeric, 10), 5);
  assert.equal(bandLevel(q.numeric, 40), 3);
});

/* ------------------------------------------- parity with the Python engine */

test("floor: every answer at level 1 scores 0 in the bottom band", () => {
  const r = score(bundle, flat(1));
  assert.equal(r.index, 0);
  assert.equal(r.band.key, "ad_hoc");
  for (const p of Object.values(r.pillars)) assert.equal(p, 0);
});

test("ceiling: every answer at level 5 scores 100 in the top band", () => {
  const r = score(bundle, flat(5));
  assert.equal(r.index, 100);
  assert.equal(r.band.key, "improving");
  assert.equal(r.capsBound.length, 0, "nothing should cap a perfect profile");
  assert.equal(r.flags.length, 0, "a perfect profile raises no flags");
});

test("middle: every answer at level 3 lands exactly mid-scale", () => {
  const r = score(bundle, flat(3));
  assert.equal(r.index, 50);
  assert.equal(r.band.key, "systematized");
});

test("good tooling with nothing written down is capped to mid-scale", () => {
  const answers = synthetic((q) => (q.dimension === "process_documentation" ? 1 : 5));
  const r = score(bundle, answers);

  // Exact value from the Python reference run.
  assert.equal(r.index, 46.6);
  assert.equal(r.band.key, "systematized");

  const docCaps = r.capsBound.filter((c) => c.rule === "documentation_caps_all");
  assert.ok(docCaps.length > 0, "the documentation cap must bind here");
  for (const cap of docCaps) {
    assert.equal(cap.from, 100);
    assert.equal(cap.to, 50, "the cap floor holds every capped dimension at 50");
  }

  // The floor is the whole point: without it this profile collapsed to 22,
  // which read as rigged.
  assert.ok(r.index > 40, "the cap floor must keep this out of the bottom bands");
});

test("AI readiness cannot outrun data and documentation", () => {
  const answers = synthetic((q) => {
    if (q.dimension === "ai_automation_readiness") return 5;
    if (q.dimension === "data_reporting" || q.dimension === "process_documentation") return 1;
    return 3;
  });
  const r = score(bundle, answers);

  assert.equal(r.index, 39);
  assert.equal(r.band.key, "repeatable");

  // Answered at level 5, floored to zero by the foundations rule — which has
  // no cap floor, deliberately.
  assert.equal(r.dimensionsRaw.ai_automation_readiness, 100);
  assert.equal(r.dimensions.ai_automation_readiness, 0);
  assert.ok(
    r.capsBound.some((c) => c.rule === "ai_cannot_outrun_foundations"),
    "the foundations rule must bind",
  );

  // The documentation cap takes it 100 -> 50 first, then the foundations rule
  // takes it 50 -> 0. Both are recorded so the report can show the chain.
  const chain = r.capsBound.filter((c) => c.target === "ai_automation_readiness");
  assert.deepEqual(
    chain.map((c) => [c.rule, c.from, c.to]),
    [
      ["documentation_caps_all", 100, 50],
      ["ai_cannot_outrun_foundations", 50, 0],
    ],
  );

  // data_caps_index does NOT bind here, and that is correct: the index is
  // already 39, below the cap floor of 50, so the ceiling max(0 + 15, 50)
  // is not reached. The floor is what keeps a single bad dimension from
  // dragging the headline into the bottom band.
  assert.ok(!r.capsBound.some((c) => c.rule === "data_caps_index"));
});

test("a strong business with no internal owner still raises the sponsor flag", () => {
  const answers = synthetic((q) => (q.dimension === "sponsorship_change" ? 1 : 4));
  const r = score(bundle, answers);

  assert.equal(r.index, 70.4);
  assert.equal(r.band.key, "integrated");
  assert.ok(r.flags.includes("no_sponsor"));
  assert.ok(r.flags.includes("dimension_critical:sponsorship_change"));
  // This is the flag that says: do not sell an implementation yet.
});

/* ----------------------------------------------------------- flag plumbing */

test("answer-level flags fire from the options that carry them", () => {
  const r = score(bundle, flat(1));
  for (const expected of [
    "law25_no_officer",
    "data_location_unknown",
    "casl_no_consent_record",
    "continuity_risk",
  ]) {
    assert.ok(r.flags.includes(expected), `expected flag ${expected}`);
  }
});

test("every base dimension is reportable from the base bank alone", () => {
  const r = score(bundle, flat(3));
  assert.equal(r.reportable.length, scoring.dimensions.length);
  assert.equal(r.thin.length, 0);
});

/* --------------------------------------------------------------- reweight */

test("layer reweighting changes a dimension's influence, not its score", () => {
  // Answer quote-to-cash badly and everything else well, then weight
  // quote-to-cash up the way the construction layer does.
  const answers = synthetic((q) => (q.dimension === "quote_to_cash" ? 1 : 4));
  const plain = score(bundle, answers);
  const weighted = score(bundle, answers, { quote_to_cash: 3 });

  // The dimension's own score is untouched — the questions and answers are
  // identical, so the measurement cannot move.
  assert.equal(plain.dimensions.quote_to_cash, weighted.dimensions.quote_to_cash);

  // But its pillar and the index must drop, because it now carries more of
  // the pillar. This is the assertion that catches the mistake of applying
  // the multiplier to question weights, where it silently cancels out.
  assert.ok(
    (weighted.pillars.operating_flow as number) < (plain.pillars.operating_flow as number),
    "weighting a weak dimension up must pull its pillar down",
  );
  assert.ok(weighted.index < plain.index, "and must pull the index down");

  // Pillars it does not belong to are unaffected.
  assert.equal(plain.pillars.organization, weighted.pillars.organization);
});

/* ------------------------------------------------------------- completion */

test("isComplete is false until every scored question has an answer", () => {
  const answers = flat(3);
  assert.equal(isComplete(bundle, answers), true);
  delete answers[bundle.questions[0].id];
  assert.equal(isComplete(bundle, answers), false);
});

test("a 'don't know' on a numeric still counts as answered", () => {
  const answers = flat(3);
  const numericQuestion = bundle.questions.find((q) => q.type === "number");
  assert.ok(numericQuestion);
  answers[numericQuestion.id] = null;
  assert.equal(isComplete(bundle, answers), true);
  // and it scores at level 1 rather than vanishing
  const r = score(bundle, answers);
  assert.ok(
    (r.dimensions[numericQuestion.dimension as DimensionId] ?? 100) < 50,
    "an unknown count should pull its dimension down, not be dropped",
  );
});
