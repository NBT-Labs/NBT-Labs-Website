import type { Answers, CapBinding, DimensionId, Locale, PillarId } from "./types";

/**
 * The shape a completed scorecard arrives in, and a hand-rolled validator for
 * it.
 *
 * Hand-rolled rather than pulling in a schema library: this is one endpoint
 * with one payload, and the repo currently has three runtime dependencies.
 * Adding a validation library to check a dozen fields is not worth the
 * maintenance surface. If a second endpoint appears, revisit.
 */

export type Consent = {
  /** Send me the analysis. Required — it is the purpose of the submission. */
  analysis: boolean;
  /** Write to me about your services. Optional and separate, by design. */
  marketing: boolean;
  at: string;
  method: string;
  instrumentVersion: string;
};

export type Submission = {
  locale: Locale;
  instrumentVersion: string;
  contact: {
    name: string;
    company: string;
    email: string;
    phone: string;
  };
  firmographics: Record<string, string>;
  consent: Consent;
  answers: Answers;
  score: {
    index: number;
    band: string;
    pillars: Partial<Record<PillarId, number>>;
    dimensions: Partial<Record<DimensionId, number>>;
    flags: string[];
    capsBound: CapBinding[];
  };
  reveals: Record<string, unknown>;
  attribution: Record<string, string>;
  complete: boolean;
  receivedAt?: string;
};

type ParseResult =
  | { ok: true; value: Submission }
  | { ok: false; errors: string[] };

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Deliberately permissive: enough structure to catch junk, not a full schema. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function parseSubmission(body: unknown): ParseResult {
  const errors: string[] = [];
  if (!isRecord(body)) return { ok: false, errors: ["body must be an object"] };

  const locale = str(body.locale, 2);
  if (locale !== "fr" && locale !== "en") errors.push("locale must be fr or en");

  const instrumentVersion = str(body.instrumentVersion, 20);
  if (!instrumentVersion) errors.push("instrumentVersion is required");

  const contactRaw = isRecord(body.contact) ? body.contact : {};
  const contact = {
    name: str(contactRaw.name, 120),
    company: str(contactRaw.company, 160),
    email: str(contactRaw.email, 200).toLowerCase(),
    phone: str(contactRaw.phone, 40),
  };
  if (!contact.name) errors.push("contact.name is required");
  if (!contact.company) errors.push("contact.company is required");
  if (!EMAIL.test(contact.email)) errors.push("contact.email is not an email");

  const consentRaw = isRecord(body.consent) ? body.consent : {};
  const consent: Consent = {
    analysis: consentRaw.analysis === true,
    marketing: consentRaw.marketing === true,
    at: str(consentRaw.at, 40) || new Date().toISOString(),
    method: str(consentRaw.method, 40) || "web_form",
    instrumentVersion,
  };
  // Without consent for the analysis there is no lawful basis to send it, and
  // no reason for the submission to exist. Reject rather than quietly send.
  if (!consent.analysis) errors.push("consent.analysis is required");

  const scoreRaw = isRecord(body.score) ? body.score : {};
  const index = typeof scoreRaw.index === "number" ? scoreRaw.index : NaN;
  if (!Number.isFinite(index) || index < 0 || index > 100) {
    errors.push("score.index must be a number from 0 to 100");
  }

  if (errors.length > 0) return { ok: false, errors };

  const firmographics: Record<string, string> = {};
  if (isRecord(body.firmographics)) {
    for (const [key, value] of Object.entries(body.firmographics)) {
      firmographics[str(key, 60)] = str(value, 60);
    }
  }

  const attribution: Record<string, string> = {};
  if (isRecord(body.attribution)) {
    for (const [key, value] of Object.entries(body.attribution)) {
      attribution[str(key, 40)] = str(value, 300);
    }
  }

  return {
    ok: true,
    value: {
      locale: locale as Locale,
      instrumentVersion,
      contact,
      firmographics,
      consent,
      answers: isRecord(body.answers) ? (body.answers as Answers) : {},
      score: {
        index,
        band: str(scoreRaw.band, 40),
        pillars: isRecord(scoreRaw.pillars)
          ? (scoreRaw.pillars as Partial<Record<PillarId, number>>)
          : {},
        dimensions: isRecord(scoreRaw.dimensions)
          ? (scoreRaw.dimensions as Partial<Record<DimensionId, number>>)
          : {},
        flags: Array.isArray(scoreRaw.flags)
          ? scoreRaw.flags.filter((f): f is string => typeof f === "string")
          : [],
        capsBound: Array.isArray(scoreRaw.capsBound)
          ? (scoreRaw.capsBound as CapBinding[])
          : [],
      },
      reveals: isRecord(body.reveals) ? body.reveals : {},
      attribution,
      complete: body.complete === true,
    },
  };
}

/** Plain-text summary. Used as the email body and as a log line. */
export function summarize(submission: Submission): string {
  const { contact, score, firmographics, consent, attribution } = submission;
  const lines: string[] = [
    `Scorecard — ${score.index}/100 (${score.band})`,
    "",
    `Name     : ${contact.name}`,
    `Company  : ${contact.company}`,
    `Email    : ${contact.email}`,
    `Phone    : ${contact.phone || "—"}`,
    `Language : ${submission.locale}`,
    "",
    "Firmographics:",
    ...Object.entries(firmographics).map(([k, v]) => `  ${k} = ${v}`),
    "",
    "Pillars:",
    ...Object.entries(score.pillars).map(([k, v]) => `  ${k.padEnd(20)} ${v}`),
    "",
    "Dimensions (worst first):",
    ...Object.entries(score.dimensions)
      .sort((a, b) => (a[1] as number) - (b[1] as number))
      .map(([k, v]) => `  ${k.padEnd(26)} ${v}`),
  ];

  if (score.capsBound.length > 0) {
    lines.push(
      "",
      "Caps that bound (say which, and by how much, in the report):",
      ...score.capsBound.map(
        (c) => `  ${c.rule}: ${c.target} ${c.from} -> ${c.to}`,
      ),
    );
  }

  if (score.flags.length > 0) {
    lines.push("", "Flags:", ...score.flags.map((f) => `  ${f}`));
  }

  const revealEntries = Object.entries(submission.reveals).filter(
    ([, v]) => v !== undefined && v !== "",
  );
  if (revealEntries.length > 0) {
    lines.push(
      "",
      "Cost-model inputs they gave us:",
      ...revealEntries.map(([k, v]) => `  ${k} = ${String(v)}`),
    );
  }

  lines.push(
    "",
    "Consent:",
    `  analysis  : ${consent.analysis ? "yes" : "no"}`,
    `  marketing : ${consent.marketing ? "yes" : "no"}`,
    `  recorded  : ${consent.at} via ${consent.method}`,
  );

  if (Object.keys(attribution).length > 0) {
    lines.push(
      "",
      "Attribution:",
      ...Object.entries(attribution).map(([k, v]) => `  ${k} = ${v}`),
    );
  }

  lines.push(
    "",
    `Instrument version: ${submission.instrumentVersion}`,
    `All questions answered: ${submission.complete ? "yes" : "no"}`,
    `Received: ${submission.receivedAt ?? "—"}`,
    "",
    "Raw answers:",
    JSON.stringify(submission.answers, null, 2),
  );

  return lines.join("\n");
}
