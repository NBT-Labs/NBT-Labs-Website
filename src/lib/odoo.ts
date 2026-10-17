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
  /** Studio text field "Audit answers": the scorecard report as plain text. */
  x_studio_audit_scorecard?: string;
  /** Studio boolean "Marketing Consent": opted in to marketing (scorecard only). */
  x_studio_marketing_consent?: boolean;
};

/** UTM sources (crm.lead.source_id) that must already exist in Odoo, looked up by name. */
export type LeadSource = "Site web Audit" | "Site web Contact";

const sourceIds = new Map<string, number>();

async function odooCall(baseUrl: string, apiKey: string, path: string, body: unknown) {
  return fetch(`${baseUrl}/json/2/${path}`, {
    method: "POST",
    headers: {
      Authorization: `bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// Missing source is logged, not fatal: a lead without a source beats a lost lead.
async function findSourceId(baseUrl: string, apiKey: string, name: string): Promise<number | false> {
  const cached = sourceIds.get(name);
  if (cached) return cached;
  const response = await odooCall(baseUrl, apiKey, "utm.source/search", { domain: [["name", "=", name]], limit: 1 });
  const ids = response.ok ? ((await response.json()) as number[]) : [];
  if (!ids.length) {
    console.error(`Odoo: UTM source "${name}" not found; lead created without a source.`);
    return false;
  }
  sourceIds.set(name, ids[0]);
  return ids[0];
}

// Creates a crm.lead through Odoo's JSON-2 API. Returns null on success, or an error response.
export async function createOdooLead(values: LeadValues, source: LeadSource) {
  const baseUrl = process.env.ODOO_BASE_URL?.replace(/\/+$/, "");
  const apiKey = process.env.ODOO_API_KEY_WEBSITE;

  if (!baseUrl || !apiKey) {
    console.error("Odoo: ODOO_BASE_URL or ODOO_API_KEY_WEBSITE is not set.");
    return errorResponse("This form is not configured yet. Please email info@nbtlabs.ca.", 500);
  }

  const source_id = await findSourceId(baseUrl, apiKey, source);
  const response = await odooCall(baseUrl, apiKey, "crm.lead/create", {
    vals_list: [{ type: "lead", source_id, ...values }],
  });

  if (!response.ok) {
    console.error("Odoo: lead creation failed", response.status, await response.text());
    return errorResponse("We couldn't send your submission. Please try again or email info@nbtlabs.ca.", 502);
  }

  return null;
}
