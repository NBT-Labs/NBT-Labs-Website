"use client";

import { FormEvent, useState } from "react";
import type { Locale } from "@/lib/audit/types";

const COPY = {
  fr: {
    name: "Nom",
    company: "Entreprise",
    workEmail: "Courriel professionnel",
    phone: "Téléphone",
    optional: "Facultatif",
    languageLegend: "Langue préférée",
    bottleneck:
      "Quelle est la partie la plus manuelle ou la plus lente de vos opérations en ce moment?",
    submit: "Réserver mon audit gratuit",
    sending: "Envoi…",
    note: "On utilise vos coordonnées uniquement pour préparer et réserver votre appel d'audit.",
    sent: "Merci! On a bien reçu votre demande et on vous répond en un jour ouvrable pour fixer l'appel.",
    error: "Votre demande n'a pas pu être envoyée. Réessayez ou écrivez à info@nbtlabs.ca.",
  },
  en: {
    name: "Name",
    company: "Company",
    workEmail: "Work email",
    phone: "Phone",
    optional: "Optional",
    languageLegend: "Preferred language",
    bottleneck:
      "What is the biggest manual or slow part of your operations right now?",
    submit: "Book my Free Audit",
    sending: "Sending…",
    note: "We only use your details to prepare and book your audit call.",
    sent: "Thanks! We received your request and will reply within one business day to book your call.",
    error: "We couldn't send your request. Please try again or email info@nbtlabs.ca.",
  },
} as const;

export function AuditForm({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const [status, setStatus] = useState({ error: false, message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSending(true);
    setStatus({ error: false, message: "" });

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
          answers: [{ question: copy.bottleneck, answer: data.get("bottleneck") }],
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus({ error: false, message: copy.sent });
    } catch {
      setStatus({ error: true, message: copy.error });
    } finally {
      setSending(false);
    }
  };

  return (
    <form id="audit-form" className="audit-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          <span>{copy.name}</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>{copy.company}</span>
          <input name="company" autoComplete="organization" required />
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>{copy.workEmail}</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>{copy.phone} <em>{copy.optional}</em></span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>
      <fieldset>
        <legend>{copy.languageLegend}</legend>
        <div className="radio-row">
          <label>
            <input name="language" type="radio" value="English" defaultChecked={locale === "en"} />
            <span>English</span>
          </label>
          <label>
            <input name="language" type="radio" value="Français" defaultChecked={locale === "fr"} />
            <span>Français</span>
          </label>
        </div>
      </fieldset>
      <label>
        <span>{copy.bottleneck}</span>
        <textarea name="bottleneck" rows={5} maxLength={2000} required />
      </label>
      <label className="form-honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form-submit-row">
        <button className="button" type="submit" disabled={sending}>
          {sending ? copy.sending : copy.submit} <span aria-hidden="true">↗</span>
        </button>
        <small>{copy.note}</small>
      </div>
      <p className={`form-status${status.error ? " is-error" : ""}`} aria-live="polite">
        {status.message}
      </p>
    </form>
  );
}
