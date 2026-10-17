import { NextResponse, type NextRequest } from "next/server";
import { deliver } from "@/lib/audit/leadSink";
import type { Submission } from "@/lib/audit/submission";
import { parseSubmission } from "@/lib/audit/submission";

/**
 * Receives a completed scorecard.
 *
 * Node runtime, not edge: the email sink opens an SMTP connection, which the
 * edge runtime cannot do.
 */
export const runtime = "nodejs";

/**
 * Crude in-memory rate limit, keyed on IP. Enough to stop a bored person
 * hammering the form; not a substitute for a real limiter. It resets on every
 * cold start, which on a serverless host means often — that is fine, because
 * the thing it protects is an outbound email, not a database.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    // Keep the map from growing without bound on a long-lived instance.
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = parseSubmission(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: "invalid_submission", detail: parsed.errors },
      { status: 400 },
    );
  }

  const submission: Submission = {
    ...parsed.value,
    receivedAt: new Date().toISOString(),
    // Not stored with the submission, only used for the rate limit above.
    // A scorecard answer set plus an email address is personal information;
    // an IP would add nothing we need and one more thing to justify keeping.
  };

  try {
    const outcome = await deliver(submission);
    if (!outcome.delivered) {
      // Nothing is configured to receive this. Say so loudly in the logs
      // rather than returning a cheerful 200 while leads evaporate — if ads
      // are running, a silent drop here is money burned.
      console.error(
        "[scorecard] no delivery target configured — submission dropped. " +
          "Set SCORECARD_WEBHOOK_URL or the SMTP_* variables. See .env.example.",
      );
      return NextResponse.json({ error: "no_delivery_target" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, via: outcome.via });
  } catch (error) {
    console.error("[scorecard] delivery failed", error);
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }
}
