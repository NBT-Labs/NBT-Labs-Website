import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "../../_data/seo";
import { isLocale } from "@/i18n/config";

/**
 * ⚠️ INCOMPLETE — must be finished before this branch merges.
 *
 * The footer links here, and the scorecard gate relies on it, so the page has
 * to exist. The structure below is right; four things in it are decisions the
 * team has to make, not text I can invent. They are marked TODO in the copy
 * and will be visible on the rendered page, deliberately, so this cannot ship
 * half-done by accident:
 *
 *   1. Who is named as the person in charge of personal information, and
 *      their contact details. Quebec has required this to be published since
 *      September 2022 and the default holder is the person with the highest
 *      authority in the business.
 *   2. Where submissions are actually stored and processed, and in which
 *      country. If anything leaves Quebec — hosting region, an email
 *      provider, offshore support — that needs its own assessment and a
 *      written agreement with the provider, and the CRA separately expects
 *      records kept in Canada.
 *   3. How long answers and contact details are kept, and what happens at the
 *      end of that period.
 *   4. Whether a lawyer has read it. This page is a description of what the
 *      business actually does with the data; it is not legal advice and I am
 *      not in a position to give any.
 *
 * Worth noting the irony and using it: the audit this page supports asks
 * prospects whether they have a named privacy officer, a published contact,
 * and a written retention schedule. Having all three is both the right thing
 * and a sales asset.
 */

const TODO = "[[À COMPLÉTER / TO COMPLETE]]";

const COPY = {
  fr: {
    title: "Confidentialité",
    description:
      "Comment NBT Labs recueille, utilise et conserve les renseignements personnels, et comment y accéder ou les faire supprimer.",
    heading: "Confidentialité",
    intro:
      "Cette page décrit ce que nous faisons réellement avec les renseignements que vous nous confiez. Elle est écrite en langage clair, sans formules juridiques inutiles.",
    sections: [
      {
        h: "Ce que nous recueillons",
        p: [
          "Lorsque vous remplissez la fiche d'évaluation des opérations, vos réponses restent dans votre navigateur. Rien ne nous est transmis tant que vous ne demandez pas l'analyse détaillée.",
          "Si vous la demandez, nous recevons : votre nom, le nom de votre entreprise, votre courriel professionnel, votre téléphone si vous le donnez, vos réponses aux douze questions, votre résultat, le secteur, la province et votre rôle, ainsi que la provenance de votre visite (campagne publicitaire ou site référent).",
        ],
      },
      {
        h: "Pourquoi",
        p: [
          "Deux usages distincts, et vous consentez à chacun séparément : produire et vous envoyer votre analyse, et — seulement si vous l'avez accepté — vous écrire occasionnellement au sujet de nos services. Vous pouvez accepter le premier et refuser le second.",
          "Nous ne vendons pas ces renseignements et ne les partageons pas à des fins publicitaires.",
        ],
      },
      {
        h: "Où c'est conservé",
        p: [`${TODO} — hébergement, fournisseur de courriel, pays.`],
      },
      {
        h: "Combien de temps",
        p: [`${TODO} — durée de conservation et destruction.`],
      },
      {
        h: "Décisions automatisées",
        p: [
          "Votre résultat est calculé par une formule publiée, à partir de vos propres réponses. Aucune décision à votre sujet n'est prise automatiquement : un humain lit votre analyse avant tout suivi.",
        ],
      },
      {
        h: "Accès, correction, suppression",
        p: [
          "Écrivez-nous et nous vous enverrons ce que nous détenons, le corrigerons ou le supprimerons.",
        ],
      },
      {
        h: "Responsable de la protection des renseignements personnels",
        p: [`${TODO} — nom, titre et coordonnées.`],
      },
    ],
  },
  en: {
    title: "Privacy",
    description:
      "How NBT Labs collects, uses and keeps personal information, and how to see it or have it deleted.",
    heading: "Privacy",
    intro:
      "This page describes what we actually do with the information you give us. It is written in plain language, without unnecessary legal formulas.",
    sections: [
      {
        h: "What we collect",
        p: [
          "When you fill in the operations scorecard, your answers stay in your browser. Nothing reaches us until you ask for the detailed analysis.",
          "If you do ask for it, we receive: your name, your company name, your work email, your phone if you give it, your answers to the twelve questions, your score, your industry, province and role, and where your visit came from (ad campaign or referring site).",
        ],
      },
      {
        h: "Why",
        p: [
          "Two separate purposes, and you consent to each separately: to produce and send your analysis, and — only if you agreed — to write to you occasionally about our services. You can say yes to the first and no to the second.",
          "We do not sell this information and do not share it for advertising.",
        ],
      },
      {
        h: "Where it is kept",
        p: [`${TODO} — hosting, email provider, country.`],
      },
      {
        h: "For how long",
        p: [`${TODO} — retention period and destruction.`],
      },
      {
        h: "Automated decisions",
        p: [
          "Your score is calculated by a published formula from your own answers. No decision about you is made automatically: a person reads your analysis before any follow-up.",
        ],
      },
      {
        h: "Access, correction, deletion",
        p: [
          "Write to us and we will send you what we hold, correct it, or delete it.",
        ],
      },
      {
        h: "Person in charge of personal information",
        p: [`${TODO} — name, title and contact details.`],
      },
    ],
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : "fr";
  const { title, description } = COPY[active];
  return createPageMetadata({
    title,
    description,
    path: "/privacy",
    locale: active,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = COPY[locale];

  return (
    <section className="prose-page">
      <h1>{copy.heading}</h1>
      <p>{copy.intro}</p>
      {copy.sections.map((section) => (
        <div key={section.h}>
          <h2>{section.h}</h2>
          {section.p.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ))}
      <p>
        <a href="mailto:info@nbtlabs.ca">info@nbtlabs.ca</a>
      </p>
    </section>
  );
}
