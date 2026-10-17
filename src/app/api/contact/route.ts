import { NextResponse } from "next/server";
import { contactTopics } from "../../_data/site";
import { createOdooLead, EMAIL_PATTERN, errorResponse, escapeHtml, field } from "../../_lib/odoo";

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
  const topic = contactTopics.includes(field(data, "topic", 60)) ? field(data, "topic", 60) : "Other";
  const message = field(data, "message", 5000);

  if (!name || !EMAIL_PATTERN.test(email) || message.length < 10) {
    return errorResponse("Please add your name, a valid email, and a short message.", 400);
  }

  const failure = await createOdooLead({
    name: `Website inquiry (${topic}): ${company || name}`,
    contact_name: name,
    email_from: email,
    partner_name: company || false,
    description: `<p><strong>Source:</strong> Contact form</p><p><strong>Topic:</strong> ${escapeHtml(topic)}</p><p>${escapeHtml(message)}</p>`,
  });

  return failure ?? NextResponse.json({ ok: true });
}
