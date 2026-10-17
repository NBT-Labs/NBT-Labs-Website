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
 *
 * The report is written twice: as plain text into the Studio field
 * x_studio_audit_scorecard ("Audit answers", a text field), and as HTML into
 * the lead's Notes (description).
 */

const DONT_KNOW = { en: "I don't know", fr: "Je ne sais pas" } as const;

/** A report section: a heading plus either paragraphs or a list. */
type Section = {
  heading: string;
  level: "title" | "group";
  lines?: string[];
  items?: { label: string; value?: string }[];
  ordered?: boolean;
};

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

function buildReport(submission: Submission): Section[] {
  const { score, locale, firmographics } = submission;
  const band = bundle.bands.find((b) => b.key === score.band);
  const label = <T extends { id: string; label: Record<string, string> }>(list: T[], id: string) =>
    list.find((item) => item.id === id)?.label[locale] ?? id;
  const percent = (value: number | undefined) => `${Math.round(value ?? 0)}/100`;

  const sections: Section[] = [
    {
      heading: `Report: ${Math.round(score.index)}/100${band ? ` · ${band.label[locale]}` : ""}`,
      level: "title",
      lines: band ? [band.headline[locale]] : [],
    },
    {
      heading: "Pillars",
      level: "group",
      items: Object.entries(score.pillars).map(([id, value]) => ({
        label: `${label(bundle.pillars, id)}: ${percent(value)}`,
      })),
    },
    {
      heading: "Dimensions (weakest first)",
      level: "group",
      items: Object.entries(score.dimensions)
        .sort((a, b) => (a[1] ?? 0) - (b[1] ?? 0))
        .map(([id, value]) => ({ label: `${label(bundle.dimensions, id)}: ${percent(value)}` })),
    },
  ];

  if (score.flags.length) {
    sections.push({ heading: `Flags: ${score.flags.join(", ")}`, level: "group" });
  }

  sections.push(
    {
      heading: "Company profile",
      level: "title",
      items: bundle.gateQuestions
        .filter((q) => firmographics[q.id])
        .map((q) => ({ label: q.stem[locale], value: answerText(q, firmographics[q.id], submission) })),
    },
    {
      heading: "Questions & answers",
      level: "title",
      ordered: true,
      items: bundle.questions.map((q) => ({
        label: q.stem[locale],
        value: answerText(q, submission.answers[q.id], submission),
      })),
    },
  );

  return sections.filter((s) => s.lines?.length || s.items?.length || !("items" in s));
}

function toText(sections: Section[]): string {
  return sections
    .map((section) => {
      const body = [
        ...(section.lines ?? []),
        ...(section.items ?? []).map((item, i) => {
          const bullet = section.ordered ? `${i + 1}. ` : "- ";
          return item.value ? `${bullet}${item.label}\n   ${item.value}` : `${bullet}${item.label}`;
        }),
      ];
      return [section.heading, ...body].join("\n");
    })
    .join("\n\n");
}

function toHtml(sections: Section[]): string {
  return sections
    .map((section) => {
      const heading =
        section.level === "title"
          ? `<h3>${escapeHtml(section.heading)}</h3>`
          : `<p><strong>${escapeHtml(section.heading)}</strong></p>`;
      const lines = (section.lines ?? []).map((line) => `<p>${escapeHtml(line)}</p>`).join("");
      const items = (section.items ?? [])
        .map((item) =>
          item.value
            ? `<li><strong>${escapeHtml(item.label)}</strong><br>${escapeHtml(item.value)}</li>`
            : `<li>${escapeHtml(item.label)}</li>`,
        )
        .join("");
      const tag = section.ordered ? "ol" : "ul";
      return heading + lines + (items ? `<${tag}>${items}</${tag}>` : "");
    })
    .join("");
}

export async function toOdoo(submission: Submission): Promise<void> {
  const { contact, score, locale } = submission;
  const report = buildReport(submission);
  const source = `Audit scorecard (${submission.instrumentVersion}, ${locale.toUpperCase()})`;

  const failure = await createOdooLead({
    name: `Scorecard ${Math.round(score.index)}/100: ${contact.company}`,
    contact_name: contact.name,
    email_from: contact.email,
    partner_name: contact.company,
    phone: contact.phone || false,
    x_studio_audit_scorecard: `Source: ${source}\n\n${toText(report)}`,
    description:
      `<p><strong>Source:</strong> ${escapeHtml(source)}</p>` +
      `<p><strong>Marketing consent:</strong> ${submission.consent.marketing ? "Yes" : "No"}</p>` +
      toHtml(report),
  }, "Site web Audit");
  if (failure) throw new Error(`Odoo lead creation failed (${failure.status})`);
}
