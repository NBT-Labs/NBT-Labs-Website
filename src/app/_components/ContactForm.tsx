"use client";

import { FormEvent, useState } from "react";
import { contactTopics } from "../_data/site";

type Status = { kind: "idle" | "sending" | "sent" | "error"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ kind: "sending", message: "Sending your message…" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong. Please try again.");
      }

      form.reset();
      setStatus({ kind: "sent", message: "Thanks! Your message is on its way. We reply within one business day." });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form id="contact-form" className="audit-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" maxLength={120} required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" maxLength={200} required />
        </label>
      </div>
      <label>
        <span>Company <em>Optional</em></span>
        <input name="company" autoComplete="organization" maxLength={160} />
      </label>
      <fieldset>
        <legend>What is this about?</legend>
        <div className="radio-row radio-row-wrap">
          {contactTopics.map((topic, index) => (
            <label key={topic}>
              <input name="topic" type="radio" value={topic} defaultChecked={index === 0} />
              <span>{topic}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        <span>Message</span>
        <textarea name="message" rows={6} minLength={10} maxLength={5000} required />
      </label>
      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form-submit-row">
        <button className="button" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send message"} <span aria-hidden="true">↗</span>
        </button>
        <small>We only use your details to reply to this message.</small>
      </div>
      <p className={`form-status${status.kind === "error" ? " is-error" : ""}`} aria-live="polite">
        {status.message}
      </p>
    </form>
  );
}
