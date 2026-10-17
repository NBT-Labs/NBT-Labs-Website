import { createTransport } from "nodemailer";
import { toOdoo } from "./odooLead";
import { summarize, type Submission } from "./submission";

/**
 * Where a completed scorecard goes.
 *
 * Three sinks, all driven by environment variables:
 *
 *   0. ODOO_BASE_URL + ODOO_API_KEY_WEBSITE: creates a crm.lead in Odoo with the
 *      contact, every question and answer, and the report (see ./odooLead.ts).
 *   1. SCORECARD_WEBHOOK_URL — when set, the submission is POSTed there as
 *      JSON, for any other system that wants the raw submission.
 *   2. SMTP_* — emails the scored summary to SCORECARD_TO (default
 *      info@nbtlabs.ca).
 *
 * Every configured sink runs, and the call succeeds if ANY succeeds. Keep the
 * email running alongside Odoo until leads are confirmed landing in the CRM.
 *
 * If none is configured, delivery reports failure and the route returns a
 * 500. That is on purpose. A cheerful 200 with nowhere to put the lead is the
 * worst possible behaviour with ad spend attached.
 */

export type DeliveryOutcome = {
  delivered: boolean;
  via: string[];
  failures: { sink: string; reason: string }[];
};

const TIMEOUT_MS = 8000;

async function toWebhook(submission: Submission): Promise<void> {
  const url = process.env.SCORECARD_WEBHOOK_URL;
  if (!url) throw new Error("not configured");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const headers: Record<string, string> = {
      "content-type": "application/json",
    };
    // Optional shared secret, for whatever ends up on the other end.
    if (process.env.SCORECARD_WEBHOOK_SECRET) {
      headers["x-nbt-signature"] = process.env.SCORECARD_WEBHOOK_SECRET;
    }
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(submission),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`webhook responded ${response.status}`);
    }
  } finally {
    clearTimeout(timer);
  }
}

async function toEmail(submission: Submission): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) throw new Error("not configured");

  const to = process.env.SCORECARD_TO ?? "info@nbtlabs.ca";
  const from = process.env.SCORECARD_FROM ?? user;

  // Imported statically at the top of this file rather than with a dynamic
  // import(), simply because it is clearer.
  //
  // Worth recording for whoever checks the Docker image: nodemailer does NOT
  // appear in .next/standalone/node_modules, which looks like a missing
  // dependency. It isn't. Turbopack bundles it into the server chunk
  // (.next/server/chunks), so it resolves at runtime with no node_modules
  // entry. Verified by finding the minified nodemailer source inside that
  // chunk. Don't "fix" this by adding outputFileTracingIncludes.
  const transport = createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  const { contact, score } = submission;
  await transport.sendMail({
    to,
    from,
    replyTo: contact.email,
    subject: `Scorecard ${Math.round(score.index)}/100 — ${contact.company} (${contact.name})`,
    text: summarize(submission),
  });
}

export async function deliver(submission: Submission): Promise<DeliveryOutcome> {
  const sinks: { name: string; run: () => Promise<void> }[] = [];
  if (process.env.ODOO_BASE_URL && process.env.ODOO_API_KEY_WEBSITE) {
    sinks.push({ name: "odoo", run: () => toOdoo(submission) });
  }
  if (process.env.SCORECARD_WEBHOOK_URL) {
    sinks.push({ name: "webhook", run: () => toWebhook(submission) });
  }
  if (process.env.SMTP_HOST) {
    sinks.push({ name: "email", run: () => toEmail(submission) });
  }

  if (sinks.length === 0) {
    return { delivered: false, via: [], failures: [] };
  }

  const results = await Promise.allSettled(sinks.map((s) => s.run()));
  const via: string[] = [];
  const failures: DeliveryOutcome["failures"] = [];

  results.forEach((result, i) => {
    const sink = sinks[i].name;
    if (result.status === "fulfilled") {
      via.push(sink);
    } else {
      failures.push({
        sink,
        reason:
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
      });
    }
  });

  // Log the partial failure even when another sink succeeded — a webhook that
  // has started failing silently while email still works is exactly the thing
  // you want to find out about before cutover, not after.
  for (const failure of failures) {
    console.error(`[scorecard] sink ${failure.sink} failed: ${failure.reason}`);
  }

  return { delivered: via.length > 0, via, failures };
}
