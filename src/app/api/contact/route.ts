import { NextResponse } from "next/server";
import { CONTACT_TOPICS } from "@/lib/contactTopics";
import { createOdooLead, EMAIL_PATTERN, errorResponse, escapeHtml, field } from "@/lib/odoo";

/** General contact form (/[locale]/get-in-touch) → Odoo CRM lead. */
export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return errorResponse("Invalid request.", 400);
  }

  // Honeypot: real visitors never see or fill this field.
  if (field(data, "website", 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = field(data, "name", 120);
  const email = field(data, "email", 200);
  const company = field(data, "company", 160);
  const topic = (CONTACT_TOPICS[field(data, "topic", 30)] ?? CONTACT_TOPICS.other).en;
  const language = field(data, "locale", 2) === "en" ? "English" : "Français";
  const message = field(data, "message", 5000);

  if (!name || !EMAIL_PATTERN.test(email) || message.length < 10) {
    return errorResponse("invalid_submission", 400);
  }

  const failure = await createOdooLead({
    name: `Website inquiry (${topic}): ${company || name}`,
    contact_name: name,
    email_from: email,
    partner_name: company || false,
    description:
      `<p><strong>Source:</strong> Contact form</p>` +
      `<p><strong>Topic:</strong> ${escapeHtml(topic)}</p>` +
      `<p><strong>Language:</strong> ${language}</p>` +
      `<p>${escapeHtml(message)}</p>`,
  });

  return failure ?? NextResponse.json({ ok: true });
}
