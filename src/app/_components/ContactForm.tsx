"use client";

import { FormEvent, useState } from "react";
import { CONTACT_TOPICS } from "@/lib/contactTopics";
import type { Locale } from "@/lib/audit/types";

const COPY = {
  fr: {
    name: "Nom",
    email: "Courriel",
    company: "Entreprise",
    optional: "Facultatif",
    topicLegend: "De quoi s'agit-il?",
    message: "Message",
    submit: "Envoyer le message",
    sending: "Envoi…",
    note: "On utilise vos coordonnées uniquement pour répondre à ce message.",
    sent: "Merci! Votre message est bien parti. On vous répond en un jour ouvrable.",
    invalid: "Ajoutez votre nom, un courriel valide et un court message.",
    error: "Votre message n'a pas pu être envoyé. Réessayez ou écrivez à info@nbtlabs.ca.",
  },
  en: {
    name: "Name",
    email: "Email",
    company: "Company",
    optional: "Optional",
    topicLegend: "What is this about?",
    message: "Message",
    submit: "Send message",
    sending: "Sending…",
    note: "We only use your details to reply to this message.",
    sent: "Thanks! Your message is on its way. We reply within one business day.",
    invalid: "Please add your name, a valid email, and a short message.",
    error: "We couldn't send your message. Please try again or email info@nbtlabs.ca.",
  },
} as const;

type Status = { kind: "idle" | "sending" | "sent" | "error"; message: string };

export function ContactForm({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ kind: "sending", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), locale }),
      });
      if (!response.ok) {
        throw new Error(response.status === 400 ? copy.invalid : copy.error);
      }
      form.reset();
      setStatus({ kind: "sent", message: copy.sent });
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error && error.message ? error.message : copy.error });
    }
  };

  return (
    <form id="contact-form" className="audit-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          <span>{copy.name}</span>
          <input name="name" autoComplete="name" maxLength={120} required />
        </label>
        <label>
          <span>{copy.email}</span>
          <input name="email" type="email" autoComplete="email" maxLength={200} required />
        </label>
      </div>
      <label>
        <span>{copy.company} <em>{copy.optional}</em></span>
        <input name="company" autoComplete="organization" maxLength={160} />
      </label>
      <fieldset>
        <legend>{copy.topicLegend}</legend>
        <div className="radio-row radio-row-wrap">
          {Object.entries(CONTACT_TOPICS).map(([key, label], index) => (
            <label key={key}>
              <input name="topic" type="radio" value={key} defaultChecked={index === 0} />
              <span>{label[locale]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        <span>{copy.message}</span>
        <textarea name="message" rows={6} minLength={10} maxLength={5000} required />
      </label>
      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form-submit-row">
        <button className="button" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? copy.sending : copy.submit} <span aria-hidden="true">↗</span>
        </button>
        <small>{copy.note}</small>
      </div>
      <p className={`form-status${status.kind === "error" ? " is-error" : ""}`} aria-live="polite">
        {status.message}
      </p>
    </form>
  );
}
