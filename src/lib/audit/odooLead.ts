import bundleJson from "@/app/_data/quiz.bundle.json";
import { createOdooLead, escapeHtml } from "@/lib/odoo";
import type { Answer, Question, QuizBundle } from "./types";
import type { Submission } from "./submission";

const bundle = bundleJson as unknown as QuizBundle;

/**
 * Turns a scorecard submission into an Odoo crm.lead, so the CRM holds the
 * contact, every question with the answer they picked, and the report they saw.
 *
 * Answers arrive as option values keyed by question id; they are resolved back
 * to the wording from the quiz bundle, in the language the visitor used, so the
 * lead reads exactly like the quiz did.
 */

const DONT_KNOW = { en: "I don't know", fr: "Je ne sais pas" } as const;

function answerText(question: Question, answer: Answer | undefined, submission: Submission): string {
  const { locale } = submission;
  if (answer === undefined || answer === "") return "—";
  if (answer === null) return DONT_KNOW[locale];
  if (question.type === "number") {
    const unit = question.numeric?.unit[locale] ?? "";
    return `${answer} ${unit}`.trim();
  }
  const label = (value: string) =>
    question.options?.find((option) => option.value === value)?.label[locale] ?? value;
  return Array.isArray(answer) ? answer.map(label).join(", ") : label(String(answer));
}

function listItem(heading: string, body: string): string {
  return `<li><strong>${escapeHtml(heading)}</strong><br>${escapeHtml(body)}</li>`;
}

export async function toOdoo(submission: Submission): Promise<void> {
  const { contact, score, locale, firmographics } = submission;

  const band = bundle.bands.find((b) => b.key === score.band);
  const label = <T extends { id: string; label: Record<string, string> }>(list: T[], id: string) =>
    list.find((item) => item.id === id)?.label[locale] ?? id;

  const profile = bundle.gateQuestions
    .filter((q) => firmographics[q.id])
    .map((q) => listItem(q.stem[locale], answerText(q, firmographics[q.id], submission)))
    .join("");

  const answers = bundle.questions
    .map((q) => listItem(q.stem[locale], answerText(q, submission.answers[q.id], submission)))
    .join("");

  const pillars = Object.entries(score.pillars)
    .map(([id, value]) => `<li>${escapeHtml(label(bundle.pillars, id))}: ${Math.round(value ?? 0)}/100</li>`)
    .join("");

  const dimensions = Object.entries(score.dimensions)
    .sort((a, b) => (a[1] ?? 0) - (b[1] ?? 0))
    .map(([id, value]) => `<li>${escapeHtml(label(bundle.dimensions, id))}: ${Math.round(value ?? 0)}/100</li>`)
    .join("");

  const description = [
    `<p><strong>Source:</strong> Audit scorecard (${escapeHtml(submission.instrumentVersion)}, ${locale.toUpperCase()})</p>`,
    `<p><strong>Marketing consent:</strong> ${submission.consent.marketing ? "Yes" : "No"}</p>`,
    `<h3>Report: ${Math.round(score.index)}/100${band ? ` · ${escapeHtml(band.label[locale])}` : ""}</h3>`,
    band ? `<p>${escapeHtml(band.headline[locale])}</p>` : "",
    pillars && `<p><strong>Pillars</strong></p><ul>${pillars}</ul>`,
    dimensions && `<p><strong>Dimensions (weakest first)</strong></p><ul>${dimensions}</ul>`,
    score.flags.length ? `<p><strong>Flags:</strong> ${escapeHtml(score.flags.join(", "))}</p>` : "",
    profile && `<h3>Company profile</h3><ul>${profile}</ul>`,
    `<h3>Questions &amp; answers</h3><ol>${answers}</ol>`,
  ].join("");

  const failure = await createOdooLead({
    name: `Scorecard ${Math.round(score.index)}/100: ${contact.company}`,
    contact_name: contact.name,
    email_from: contact.email,
    partner_name: contact.company,
    phone: contact.phone || false,
    description,
  });
  if (failure) throw new Error(`Odoo lead creation failed (${failure.status})`);
}
