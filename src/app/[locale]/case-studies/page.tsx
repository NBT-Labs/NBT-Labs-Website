import type { Metadata } from "next";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { CTASection } from "../../_components/CTASection";
import { PageHero } from "../../_components/PageHero";
import { ViewportReveal } from "../../_components/ViewportReveal";
import { Highlighter } from "@/registry/magicui/highlighter";
import { createPageMetadata } from "../../_data/seo";
import { isLocale, localePath } from "@/i18n/config";
import { notFound } from "next/navigation";

const COPY = {
  fr: {
    title: "Études de cas Odoo et automatisation à venir",
    description:
      "Suivez les études de cas de NBT Labs à mesure que les clients fondateurs passent en service, avec des résultats mesurés en heures sauvées, en erreurs éliminées et en revenus protégés.",
    heroEyebrow: "Résultats · Études de cas",
    heroHighlight: "La preuve,",
    heroCaption: "au fur et à mesure.",
    heroDescription:
      "On est un nouveau studio. Nos études de cas s'écrivent en ce moment, elles ne sortent pas d'un vieux catalogue. Quand un client fondateur passe en service, son résultat mesuré est publié ici avec sa permission.",
    heroSecondary: "Rencontrer l'équipe",
    proofEyebrow: "À quoi ressemblera la preuve",
    proofHead: "Assez précise pour être utile.",
    proofIntro:
      "Chaque histoire publiée montrera le point de départ, ce qui a changé, le délai de livraison et le résultat qu'on a vraiment pu mesurer.",
    proof1Title: "Le point de départ",
    proof1Copy:
      "Comment le processus fonctionnait avant, où il cassait et ce que ça coûtait.",
    proof2Title: "L'intervention",
    proof2Copy:
      "Ce qu'on a changé dans le processus, Odoo, l'automatisation ou l'IA, et le raisonnement derrière.",
    proof3Title: "Le résultat mesuré",
    proof3Copy:
      "Heures sauvées, erreurs éliminées, revenus protégés, et le point de vue du client.",
    metricsEyebrow: "Les chiffres qui nous intéressent",
    metricHours: "Heures",
    metricHoursTail: "sauvées sur le travail répétitif",
    metricErrors: "Erreurs",
    metricErrorsTail: "éliminées du processus",
    metricRevenue: "Revenus",
    metricRevenueTail: "protégés ou débloqués",
    openingsEyebrow: "Places de partenaires fondateurs",
    openingsHead: "Les premières études de cas sont ouvertes.",
    openingsBody:
      "Les 2 ou 3 premiers partenaires fondateurs reçoivent un audit de processus et d'automatisation sans frais et de 25 à 30 % de rabais sur n'importe quel forfait d'implantation ou d'automatisation. En échange, on demande une étude de cas approuvée et un témoignage une fois le travail en service.",
    openingsCta: "Devenir partenaire fondateur",
    /** Template with {n}. */
    openingCard: "Étude de cas 0{n}",
    openingSoon: "À venir",
    ctaEyebrow: "Votre résultat pourrait être le premier",
    ctaTitle: "Bâtissons le résultat avant l'étude de cas.",
    ctaCopy:
      "On s'entendra au départ sur le chiffre qui vaut la peine de bouger. L'histoire s'écrit seulement quand le travail l'a méritée.",
    ctaLabel: "Audit gratuit",
  },
  en: {
    title: "Upcoming Odoo & Automation Case Studies",
    description:
      "Follow NBT Labs case studies as founding clients go live, with results measured in hours saved, errors removed, and revenue protected.",
    heroEyebrow: "Results · Case studies",
    heroHighlight: "Proof,",
    heroCaption: "as we build it.",
    heroDescription:
      "We’re a new studio. Our case studies are being written right now, not pulled from a back catalog. When a founding client goes live, their measured result gets published here with their permission.",
    heroSecondary: "Meet the team",
    proofEyebrow: "What proof will look like",
    proofHead: "Specific enough to be useful.",
    proofIntro:
      "Every published story will show the starting point, what changed, time to launch, and the result that could actually be measured.",
    proof1Title: "The baseline",
    proof1Copy: "How the process worked before, where it broke, and what that cost.",
    proof2Title: "The intervention",
    proof2Copy:
      "What we changed in the process, Odoo, automation, or AI, and the reasoning behind it.",
    proof3Title: "The measured result",
    proof3Copy:
      "Hours saved, errors removed, revenue protected, and the client’s perspective.",
    metricsEyebrow: "The numbers we care about",
    metricHours: "Hours",
    metricHoursTail: "saved from repetitive work",
    metricErrors: "Errors",
    metricErrorsTail: "removed from the process",
    metricRevenue: "Revenue",
    metricRevenueTail: "protected or unlocked",
    openingsEyebrow: "Founding Partner openings",
    openingsHead: "The first case studies are open.",
    openingsBody:
      "The first 2–3 Founding Partners receive a Process & Automation Audit at no charge and 25–30% off any implementation or automation package. In exchange, we ask for an approved case study and testimonial once the work is live.",
    openingsCta: "Become a Founding Partner",
    openingCard: "Case study 0{n}",
    openingSoon: "Coming soon",
    ctaEyebrow: "Your result could be first",
    ctaTitle: "Build the result before the case study.",
    ctaCopy:
      "We will agree on the number worth moving at the start. The story only gets written after the work has earned it.",
    ctaLabel: "Free audit",
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
    path: "/case-studies",
    locale: active,
  });
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = COPY[locale];

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={copy.heroEyebrow}
        variant="proof"
        title={
          <>
            <span className="hero-line hero-line-display">
              <Highlighter
                action="highlight"
                animationDuration={840}
                drawDelay={120}
                color="#b9f45d"
                isView
                className="hero-word-highlight"
              >
                {copy.heroHighlight}
              </Highlighter>
            </span>{" "}
            <span className="hero-line hero-line-caption">{copy.heroCaption}</span>
          </>
        }
        description={copy.heroDescription}
        secondary={{ href: "/why-nbt", label: copy.heroSecondary }}
      />

      <section className="proof-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.proofEyebrow}</p>
            <TextAnimate as="h2" animation="slideUp" by="word" once>
              {copy.proofHead}
            </TextAnimate>
          </div>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {copy.proofIntro}
          </TextAnimate>
        </div>
        <div className="proof-grid">
          <ViewportReveal as="article">
            <span>01</span>
            <h3>{copy.proof1Title}</h3>
            <p>{copy.proof1Copy}</p>
          </ViewportReveal>
          <ViewportReveal as="article" delay={0.09}>
            <span>02</span>
            <h3>{copy.proof2Title}</h3>
            <p>{copy.proof2Copy}</p>
          </ViewportReveal>
          <ViewportReveal as="article" delay={0.18}>
            <span>03</span>
            <h3>{copy.proof3Title}</h3>
            <p>{copy.proof3Copy}</p>
          </ViewportReveal>
        </div>
      </section>

      <section className="result-metrics section-pad">
        <TextAnimate
          as="p"
          animation="slideLeft"
          by="character"
          className="eyebrow eyebrow-light"
          once
        >
          {copy.metricsEyebrow}
        </TextAnimate>
        <div className="result-metric-grid">
          <ViewportReveal>
            <strong><TextAnimate as="span" animation="wavy" by="character" once>{copy.metricHours}</TextAnimate></strong>
            <span>{copy.metricHoursTail}</span>
          </ViewportReveal>
          <ViewportReveal delay={0.09}>
            <strong><TextAnimate as="span" animation="wavy" by="character" once>{copy.metricErrors}</TextAnimate></strong>
            <span>{copy.metricErrorsTail}</span>
          </ViewportReveal>
          <ViewportReveal delay={0.18}>
            <strong><TextAnimate as="span" animation="wavy" by="character" once>{copy.metricRevenue}</TextAnimate></strong>
            <span>{copy.metricRevenueTail}</span>
          </ViewportReveal>
        </div>
      </section>

      <section className="openings-section section-pad">
        <div className="openings-intro">
          <p className="eyebrow">{copy.openingsEyebrow}</p>
          <TextAnimate as="h2" animation="scaleUp" by="text" once>
            {copy.openingsHead}
          </TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {copy.openingsBody}
          </TextAnimate>
          <a className="button" href={localePath(locale, "/contact")}>
            {copy.openingsCta} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="opening-cards">
          {[1, 2, 3].map((number, index) => (
            <ViewportReveal as="article" delay={index * 0.1} key={number}>
              <span>0{number}</span>
              <div className="opening-pulse" aria-hidden="true"><i /></div>
              <strong>{copy.openingCard.replace("{n}", String(number))}</strong>
              <small>{copy.openingSoon}</small>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <CTASection locale={locale}
        eyebrow={copy.ctaEyebrow}
        title={copy.ctaTitle}
        copy={copy.ctaCopy}
        label={copy.ctaLabel}
      />
    </>
  );
}
