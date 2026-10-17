"use client";

import { FormEvent, useState } from "react";

const BOTTLENECK_QUESTION = "What is the biggest manual or slow part of your operations right now?";

export function AuditForm() {
  const [status, setStatus] = useState({ error: false, message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSending(true);
    setStatus({ error: false, message: "Sending your request…" });

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          phone: data.get("phone"),
          language: data.get("language"),
          website: data.get("website"),
          answers: [{ question: BOTTLENECK_QUESTION, answer: data.get("bottleneck") }],
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong. Please try again.");
      }
      form.reset();
      setStatus({ error: false, message: "Thanks! We received your request and will reply within one business day to book your call." });
    } catch (error) {
      setStatus({ error: true, message: error instanceof Error ? error.message : "Something went wrong. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <form id="audit-form" className="audit-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>Company</span>
          <input name="company" autoComplete="organization" required />
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>Work email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>Phone <em>Optional</em></span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>
      <fieldset>
        <legend>Preferred language</legend>
        <div className="radio-row">
          <label>
            <input name="language" type="radio" value="English" defaultChecked />
            <span>English</span>
          </label>
          <label>
            <input name="language" type="radio" value="Français" />
            <span>Français</span>
          </label>
        </div>
      </fieldset>
      <label>
        <span>{BOTTLENECK_QUESTION}</span>
        <textarea name="bottleneck" rows={5} maxLength={2000} required />
      </label>
      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form-submit-row">
        <button className="button" type="submit" disabled={sending}>
          {sending ? "Sending…" : "Book my Free Audit"} <span aria-hidden="true">↗</span>
        </button>
        <small>We only use your details to prepare and book your audit call.</small>
      </div>
      <p className={`form-status${status.error ? " is-error" : ""}`} aria-live="polite">
        {status.message}
      </p>
    </form>
  );
}
