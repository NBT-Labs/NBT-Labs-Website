import { NextResponse } from "next/server";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const field = (data: Record<string, unknown>, key: string, max: number) =>
  String(data[key] ?? "").trim().slice(0, max);

// crm.lead.description is an HTML field, so escape anything a visitor typed.
export const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`).replace(/\n/g, "<br>");

export const errorResponse = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

type LeadValues = {
  name: string;
  contact_name: string;
  email_from: string;
  partner_name?: string | false;
  phone?: string | false;
  description: string;
};

// Creates a crm.lead through Odoo's JSON-2 API. Returns null on success, or an error response.
export async function createOdooLead(values: LeadValues) {
  const baseUrl = process.env.ODOO_BASE_URL?.replace(/\/+$/, "");
  const apiKey = process.env.ODOO_API_KEY_WEBSITE;

  if (!baseUrl || !apiKey) {
    console.error("Odoo: ODOO_BASE_URL or ODOO_API_KEY_WEBSITE is not set.");
    return errorResponse("This form is not configured yet. Please email info@nbtlabs.ca.", 500);
  }

  const response = await fetch(`${baseUrl}/json/2/crm.lead/create`, {
    method: "POST",
    headers: {
      Authorization: `bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vals_list: [{ type: "lead", ...values }] }),
  });

  if (!response.ok) {
    console.error("Odoo: lead creation failed", response.status, await response.text());
    return errorResponse("We couldn't send your submission. Please try again or email info@nbtlabs.ca.", 502);
  }

  return null;
}
