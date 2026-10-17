import { NextResponse } from "next/server";
import { createOdooLead, EMAIL_PATTERN, errorResponse, escapeHtml, field } from "@/lib/odoo";

/*
 * Free audit submissions → Odoo CRM lead.
 *
 * POST /api/audit (JSON):
 * {
 *   name: string, email: string,                 // required
 *   company?: string, phone?: string,
 *   language?: "English" | "Français",
 *   answers?: { question: string; answer: string }[],   // the scorecard's 12 questions
 *   report?: string,                             // the final report shown to the visitor (plain text)
 *   score?: number | string,                     // optional overall score
 *   website?: string                             // honeypot, leave empty
 * }
 */

const MAX_ANSWERS = 30;

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return errorResponse("Invalid request.", 400);
  }

  if (field(data, "website", 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = field(data, "name", 120);
  const email = field(data, "email", 200);
  const company = field(data, "company", 160);
  const phone = field(data, "phone", 60);
  const language = field(data, "language", 30) || "English";
  const score = field(data, "score", 30);
  const report = field(data, "report", 20000);
  const answers = (Array.isArray(data.answers) ? data.answers : [])
    .slice(0, MAX_ANSWERS)
    .map((item) => {
      const entry = (item ?? {}) as Record<string, unknown>;
      return { question: field(entry, "question", 500), answer: field(entry, "answer", 2000) };
    })
    .filter((entry) => entry.question || entry.answer);

  if (!name || !EMAIL_PATTERN.test(email)) {
    return errorResponse("Please add your name and a valid email.", 400);
  }
  if (!answers.length && !report) {
    return errorResponse("Please answer the audit questions before submitting.", 400);
  }

  const answersHtml = answers.length
    ? `<h3>Answers</h3><ol>${answers
        .map((entry) => `<li><strong>${escapeHtml(entry.question)}</strong><br>${escapeHtml(entry.answer) || "<em>No answer</em>"}</li>`)
        .join("")}</ol>`
    : "";

  const failure = await createOdooLead({
    name: `Free audit: ${company || name}${score ? ` (score ${score})` : ""}`,
    contact_name: name,
    email_from: email,
    partner_name: company || false,
    phone: phone || false,
    description:
      `<p><strong>Source:</strong> Free audit</p>` +
      `<p><strong>Preferred language:</strong> ${escapeHtml(language)}</p>` +
      (score ? `<p><strong>Score:</strong> ${escapeHtml(score)}</p>` : "") +
      answersHtml +
      (report ? `<h3>Report</h3><p>${escapeHtml(report)}</p>` : ""),
  }, "Site web Audit");

  return failure ?? NextResponse.json({ ok: true });
}
