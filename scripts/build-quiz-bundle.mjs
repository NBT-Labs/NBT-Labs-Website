#!/usr/bin/env node
/**
 * Emits src/app/_data/quiz.bundle.json from the authored question banks.
 *
 * Why this exists: content/audit/banks/base.v1.json is 80KB and the public
 * scorecard needs 12 of its 60 questions. Shipping the whole bank to every
 * visitor would be wasteful, and hand-copying the 12 into a component would
 * let the website's copy drift from the authored one — which, given that
 * scores are only comparable within an instrument_version, would silently
 * corrupt the benchmark later.
 *
 * So: one source of truth in content/audit, one generated artifact, and a
 * build that fails loudly if they disagree.
 *
 * Run: node scripts/build-quiz-bundle.mjs
 * Wired into `npm run prebuild` and `npm run predev`.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AUDIT = join(ROOT, "content", "audit");
const OUT = join(ROOT, "src", "app", "_data", "quiz.bundle.json");

const read = (p) => JSON.parse(readFileSync(p, "utf8"));

const scoring = read(join(AUDIT, "scoring", "scoring.v1.json"));
const base = read(join(AUDIT, "banks", "base.v1.json"));

const fail = (msg) => {
  console.error(`\n  build-quiz-bundle: ${msg}\n`);
  process.exit(1);
};

/* ---------------------------------------------------------------- collect */

const byId = new Map(base.questions.map((q) => [q.id, q]));
const order = scoring.instruments.quiz.order;

if (!Array.isArray(order) || order.length === 0) {
  fail("scoring.v1.json has no instruments.quiz.order");
}

const questions = order.map((id) => {
  const q = byId.get(id);
  if (!q) {
    fail(
      `quiz order references ${id}, which is not in base.v1.json. ` +
        `The quiz can only draw on the base bank — layer questions are audit-only.`,
    );
  }
  if (!q.instruments.includes("quiz")) {
    fail(`${id} is in the quiz order but is not tagged for the quiz instrument`);
  }
  if (q.type === "text") {
    fail(
      `${id} is open-ended and cannot be in the quiz. An open-ended question ` +
        `costs roughly 12.5 percentage points of completion.`,
    );
  }
  return q;
});

/* Strip the fields the browser has no use for. notes and artifact_probe are
   internal: notes explains a design decision to whoever edits the bank, and
   artifact_probe is what the consultant asks to see in the live session.
   Neither should ship to a prospect. */
const slim = (q) => {
  const out = {
    id: q.id,
    dimension: q.dimension,
    type: q.type,
    stem: q.stem,
    weight: q.weight ?? 1,
  };
  if (q.help) out.help = q.help;
  if (q.reveals) out.reveals = q.reveals;
  if (q.options) {
    out.options = q.options.map((o) => {
      const opt = { value: o.value, label: o.label };
      if (typeof o.level === "number") opt.level = o.level;
      if (o.na) opt.na = true;
      if (o.informational) opt.informational = true;
      if (o.flag) opt.flag = o.flag;
      if (o.reveals) opt.reveals = o.reveals;
      return opt;
    });
  }
  if (q.numeric) {
    out.numeric = {
      unit: q.numeric.unit,
      min: q.numeric.min,
      max: q.numeric.max,
      integer: q.numeric.integer ?? false,
      direction: q.numeric.direction ?? "lower_is_better",
      allowUnknown: q.numeric.allow_unknown ?? true,
      unknownLevel: q.numeric.unknown_level ?? 1,
      bands: q.numeric.bands.map((b) => ({
        lt: b.lt,
        lte: b.lte,
        gt: b.gt,
        gte: b.gte,
        level: b.level,
      })),
    };
  }
  if (q.routes) out.routes = q.routes;
  return out;
};

/* The gate form collects three more firmographics alongside the email —
   industry, province and role. They are unscored, they route the layers in a
   later audit, and province decides whether the Quebec compliance questions
   ever get asked. Pull them from the bank so the gate form is bilingual from
   the same source rather than hand-written in a component. */
const GATE_IDS = ["base.firmo.q04", "base.firmo.q05", "base.firmo.q06"];
const gateQuestions = GATE_IDS.map((id) => {
  const q = byId.get(id);
  if (!q) fail(`gate question ${id} is missing from base.v1.json`);
  if (q.dimension !== "firmographic") {
    fail(`gate question ${id} must be firmographic — it is unscored by design`);
  }
  return q;
});

/* -------------------------------------------------------------- integrity */

/* Every pillar must get at least two questions, or its bar on the result
   screen is noise dressed up as a measurement. */
const dimToPillar = new Map(scoring.dimensions.map((d) => [d.id, d.pillar]));
const perPillar = {};
for (const q of questions) {
  const pillar = dimToPillar.get(q.dimension);
  if (pillar) perPillar[pillar] = (perPillar[pillar] ?? 0) + 1;
}
const thin = scoring.pillars
  .map((p) => p.id)
  .filter((id) => (perPillar[id] ?? 0) < 2);
if (thin.length) {
  fail(
    `these pillars have fewer than 2 quiz questions and cannot be shown as ` +
      `bars: ${thin.join(", ")}. Fix the quiz order in scoring.v1.json.`,
  );
}

const openEnded = questions.filter((q) => q.type === "text").length;
if (openEnded > 0) fail("the quiz contains an open-ended question");

if (questions.length > 13) {
  console.warn(
    `  build-quiz-bundle: warning — ${questions.length} questions. ` +
      `The defensible design point is 8-12; total word count costs about ` +
      `2.5x more completion than question count.`,
  );
}

/* --------------------------------------------------------------- assemble */

const bundle = {
  instrumentVersion: scoring.instrument_version,
  bankVersion: base.bank_version,
  generated: new Date().toISOString().slice(0, 10),
  generatedBy: "scripts/build-quiz-bundle.mjs — do not edit by hand",
  name: scoring.name,
  promise: scoring.instruments.quiz.promise,
  coverageDisclosure: scoring.instruments.quiz.coverage_disclosure,
  gate: {
    ungated: scoring.instruments.quiz.gate.ungated,
    gated: scoring.instruments.quiz.gate.gated_behind_email,
    alsoCollected: scoring.instruments.quiz.gate.also_collected_at_the_gate,
  },
  ladder: scoring.ladder.levels.map((l) => ({
    level: l.level,
    key: l.key,
    label: l.label,
    description: l.description,
  })),
  dimensions: scoring.dimensions,
  pillars: scoring.pillars,
  bands: scoring.bands.ranges,
  capRules: {
    floor: scoring.cap_rules.floor_principle.value,
    rules: scoring.cap_rules.rules.map((r) => ({
      id: r.id,
      statement: r.statement,
      exempt: r.exempt ?? [],
    })),
  },
  minimumCoverage: scoring.aggregation.minimum_coverage,
  redFlags: {
    answerTriggered: scoring.red_flags.answer_triggered,
  },
  questions: questions.map(slim),
  gateQuestions: gateQuestions.map(slim),
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(bundle, null, 2) + "\n");

const bytes = Buffer.byteLength(JSON.stringify(bundle));
const numeric = questions.filter((q) => q.type === "number").length;

console.log(
  `  build-quiz-bundle: ${questions.length} questions ` +
    `(${numeric} numeric, ${openEnded} open-ended), ` +
    `instrument ${bundle.instrumentVersion}, ` +
    `${(bytes / 1024).toFixed(1)}KB -> src/app/_data/quiz.bundle.json`,
);
console.log(
  `  pillar coverage: ` +
    scoring.pillars.map((p) => `${p.id}=${perPillar[p.id] ?? 0}`).join("  "),
);
