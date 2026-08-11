"use client";

import { FormEvent, useState } from "react";

export function AuditForm() {
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
    const subject = encodeURIComponent(`Free process audit request: ${company || name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nPreferred language: ${language}\n\nBiggest operational bottleneck:\n${bottleneck}`,
    );

    setStatus("Your email app is opening with your details ready to send.");
    window.location.href = `mailto:info@nbtlabs.ca?subject=${subject}&body=${body}`;
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
        <span>What is the biggest manual or slow part of your operations right now?</span>
        <textarea name="bottleneck" rows={5} required />
      </label>
      <div className="form-submit-row">
        <button className="button" type="submit">
          Book my free process audit <span aria-hidden="true">↗</span>
        </button>
        <small>This opens your email app. No data is stored on this website.</small>
      </div>
      <p className="form-status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
