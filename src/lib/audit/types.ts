/**
 * Types for the Operations Barometer.
 *
 * The authored source of truth is content/audit/ (JSON banks + scoring spec).
 * src/app/_data/quiz.bundle.json is generated from it by
 * scripts/build-quiz-bundle.mjs. These types describe the generated bundle,
 * not the full banks — the live audit instrument reads the banks directly and
 * will need a superset of these.
 */

export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export type I18nString = Record<Locale, string>;

export type DimensionId =
  | "quote_to_cash"
  | "procure_inventory"
  | "scheduling_capacity"
  | "finance_close"
  | "data_reporting"
  | "systems_integration"
  | "process_documentation"
  | "people_continuity"
  | "ai_automation_readiness"
  | "performance_management"
  | "sponsorship_change"
  | "compliance_risk";

export type PillarId =
  | "operating_flow"
  | "financial_control"
  | "data_and_systems"
  | "organization";

/** 1 = ad hoc, 5 = measured and improving. Never a raw opinion scale. */
export type Level = 1 | 2 | 3 | 4 | 5;

export type Band = {
  from: number;
  to: number;
  level: Level;
  key: string;
  label: I18nString;
  headline: I18nString;
};

export type NumericBand = {
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  level: Level;
};

export type NumericSpec = {
  unit: I18nString;
  min?: number;
  max?: number;
  integer: boolean;
  direction: "lower_is_better" | "higher_is_better";
  allowUnknown: boolean;
  unknownLevel: Level;
  bands: NumericBand[];
};

export type Option = {
  value: string;
  label: I18nString;
  /** Absent means unscored — either `na` or `informational`. */
  level?: Level;
  /** "We genuinely don't do this activity." Excluded from the score, not zeroed. */
  na?: boolean;
  /** Routing or cost-model only. */
  informational?: boolean;
  /** Raises a named finding regardless of score. */
  flag?: string;
  reveals?: Record<string, unknown>;
};

export type Question = {
  id: string;
  dimension: DimensionId | "firmographic";
  type: "single" | "multi" | "number";
  stem: I18nString;
  help?: I18nString;
  weight: number;
  options?: Option[];
  numeric?: NumericSpec;
  reveals?: string[];
  routes?: { when_value: string; activates: string[] }[];
};

export type QuizBundle = {
  instrumentVersion: string;
  bankVersion: string;
  generated: string;
  generatedBy: string;
  name: I18nString;
  promise: I18nString;
  coverageDisclosure: { required: boolean } & I18nString;
  gate: { ungated: string[]; gated: string[]; alsoCollected: string[] };
  ladder: {
    level: Level;
    key: string;
    label: I18nString;
    description: I18nString;
  }[];
  dimensions: {
    id: DimensionId;
    pillar: PillarId;
    weight: number;
    label: I18nString;
  }[];
  pillars: { id: PillarId; weight: number; label: I18nString }[];
  bands: Band[];
  capRules: {
    floor: number;
    rules: { id: string; statement: string; exempt: string[] }[];
  };
  minimumCoverage: { dimension_reported: number; pillar_reported: number };
  redFlags: { answerTriggered: string[] };
  questions: Question[];
  gateQuestions: Question[];
};

/** A single answer. `null` on a numeric means the respondent said they don't know. */
export type Answer = string | string[] | number | null;
export type Answers = Record<string, Answer>;

export type CapBinding = {
  rule: string;
  target: DimensionId | "index";
  from: number;
  to: number;
};

export type ScoreResult = {
  instrumentVersion: string;
  /** Operations Maturity Index, 0-100, after caps. */
  index: number;
  band: Band;
  pillars: Partial<Record<PillarId, number>>;
  /** Post-cap dimension scores. */
  dimensions: Partial<Record<DimensionId, number>>;
  /** Pre-cap, kept so the report can show what the cap changed. */
  dimensionsRaw: Partial<Record<DimensionId, number>>;
  /** Dimensions with enough answered questions to be shown as a score. */
  reportable: DimensionId[];
  /** Dimensions answered but below the coverage minimum — show "not enough signal". */
  thin: DimensionId[];
  capsBound: CapBinding[];
  flags: string[];
  /** Cost-model inputs harvested from the answers. */
  reveals: Record<string, unknown>;
};
