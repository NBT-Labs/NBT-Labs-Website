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
    note: "Ceci ouvre votre application de courriel. Aucune donnée n'est conservée sur ce site.",
    status:
      "Votre application de courriel s'ouvre avec vos informations prêtes à envoyer.",
    mailSubject: "Demande d'audit gratuit",
    mailName: "Nom",
    mailCompany: "Entreprise",
    mailEmail: "Courriel",
    mailPhone: "Téléphone",
    mailLanguage: "Langue préférée",
    mailBottleneck: "Principal goulot d'étranglement :",
    notProvided: "Non fourni",
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
    submit: "Book my free audit",
    note: "This opens your email app. No data is stored on this website.",
    status: "Your email app is opening with your details ready to send.",
    mailSubject: "Free audit request",
    mailName: "Name",
    mailCompany: "Company",
    mailEmail: "Email",
    mailPhone: "Phone",
    mailLanguage: "Preferred language",
    mailBottleneck: "Biggest operational bottleneck:",
    notProvided: "Not provided",
  },
} as const;

export function AuditForm({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const company = String(data.get("company") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const language = String(data.get("language") ?? "English");
    const bottleneck = String(data.get("bottleneck") ?? "");
    const subject = encodeURIComponent(
      `${copy.mailSubject}: ${company || name}`,
    );
    const body = encodeURIComponent(
      `${copy.mailName}: ${name}\n${copy.mailCompany}: ${company}\n${copy.mailEmail}: ${email}\n${copy.mailPhone}: ${phone || copy.notProvided}\n${copy.mailLanguage}: ${language}\n\n${copy.mailBottleneck}\n${bottleneck}`,
    );

    setStatus(copy.status);
    window.location.href = `mailto:info@nbtlabs.ca?subject=${subject}&body=${body}`;
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
        <textarea name="bottleneck" rows={5} required />
      </label>
      <div className="form-submit-row">
        <button className="button" type="submit">
          {copy.submit} <span aria-hidden="true">↗</span>
        </button>
        <small>{copy.note}</small>
      </div>
      <p className="form-status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
