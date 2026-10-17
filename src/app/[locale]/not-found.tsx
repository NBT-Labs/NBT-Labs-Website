"use client";

/**
 * Bilingual 404. This sits inside the [locale] segment, so it inherits the
 * right language from the route. The proxy redirects any unprefixed path into
 * a locale first, so a visitor never lands on a 404 without a language.
 *
 * Next does not pass params to not-found, so the copy is chosen client-side
 * from the html lang attribute the layout already set.
 */

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/audit/types";

const COPY = {
  fr: {
    eyebrow: "404 · Mauvais virage",
    title: "Ce processus n'a pas d'étape suivante.",
    body: "La page que vous cherchiez a été déplacée, a changé, ou n'a jamais existé.",
    home: "Retour à l'accueil",
  },
  en: {
    eyebrow: "404 · Wrong turn",
    title: "This process has no next step.",
    body: "The page you were looking for moved, changed, or never existed.",
    home: "Return home",
  },
} as const;

export default function NotFound() {
  const [locale, setLocale] = useState<Locale>("fr");

  // The language is only knowable from the document after mount; Next does
  // not pass route params to not-found. Runs once.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const lang = document.documentElement.lang;
    setLocale(lang.startsWith("en") ? "en" : "fr");
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const copy = COPY[locale];

  return (
    <section className="not-found-page">
      <p className="eyebrow eyebrow-light">{copy.eyebrow}</p>
      <h1>{copy.title}</h1>
      <p>{copy.body}</p>
      <a className="button button-light" href={`/${locale}`}>
        {copy.home} <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
