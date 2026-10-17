import type { Metadata } from "next";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { CTASection } from "../../_components/CTASection";
import { PageHero } from "../../_components/PageHero";
import { ViewportReveal } from "../../_components/ViewportReveal";
import { team } from "../../_data/site";
import { Highlighter } from "@/registry/magicui/highlighter";
import { createPageMetadata } from "../../_data/seo";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

const COPY = {
  fr: {
    title: "Consultants Odoo axés sur les processus à Montréal",
    description:
      "Rencontrez NBT Labs, une équipe bilingue de Montréal qui améliore les processus d'affaires avant d'implanter Odoo, l'automatisation et l'IA agentique.",
    heroEyebrow: "Pourquoi NBT Labs · Montréal",
    heroLine1: "On ne vend pas de logiciel.",
    heroLine2Lead: "On vend de",
    heroLine2Highlight: "l'amélioration des processus.",
    heroDescription:
      "NBT Labs est un studio de transformation numérique bâti sur une seule idée : la transformation est un problème de processus avant d'être un problème de technologie.",
    heroSecondary: "Voir notre processus",
    originIndex: "POURQUOI ON A COMMENCÉ",
    originHead: "L'écart était toujours en dessous du logiciel.",
    originBody1:
      "On a lancé NBT Labs parce qu'on voyait toujours le même écart : des entreprises achètent un ERP ou greffent de l'« IA » générique et appellent ça de la transformation, sans jamais corriger le processus en dessous.",
    originBody2:
      "On fait d'abord le travail d'amélioration des processus, puis on implante Odoo et l'IA pour faire rouler ce qu'on a amélioré. C'est ce qui en fait une vraie transformation plutôt qu'un statu quo repeinturé.",
    differenceEyebrow: "Ce qui nous distingue",
    differenceHead: "L'ordre change le résultat.",
    differenceIntro:
      "La meilleure décision technologique est souvent celle qui devient évidente une fois le processus compris.",
    differences: [
      [
        "01",
        "L'amélioration des processus d'abord, la technologie ensuite.",
        "La transformation numérique, faite dans le bon ordre. On corrige le processus, puis on bâtit le système autour. Pas l'inverse.",
      ],
      [
        "02",
        "Odoo d'abord, pas l'IA d'abord.",
        "On implante le système de référence comme il faut, puis on bâtit l'IA par-dessus.",
      ],
      [
        "03",
        "De l'IA agentique, pas un gadget de clavardage.",
        "Nos agents posent de vrais gestes sur de vraies données, par la couche d'automatisation et de connecteurs d'Odoo. Ce ne sont pas des assistants déconnectés qui ne savent que répondre à des questions.",
      ],
      [
        "04",
        "Locaux et bilingues.",
        "Basés à Montréal, en français et en anglais, dans votre fuseau horaire, avec une vraie responsabilité sur la conformité propre au Québec, dont la TVQ et le RRQ/RQAP.",
      ],
    ],
    teamEyebrow: "L'équipe",
    teamHead: "Processus, produit et génie à la même table.",
    promiseEyebrow: "Notre promesse",
    promiseHead: "On mesure le succès comme vous le mesurez.",
    promiseBody:
      "On mesure le succès en heures sauvées, en erreurs éliminées et en revenus protégés. Si un projet ne fait pas bouger un de ces chiffres, on n'a pas fait notre travail.",
    metricHours: "Heures",
    metricHoursTail: "sauvées",
    metricErrors: "Erreurs",
    metricErrorsTail: "éliminées",
    metricRevenue: "Revenus",
    metricRevenueTail: "protégés",
    ctaEyebrow: "Parlez à l'équipe",
    ctaTitle: "Apportez-nous la version mêlée.",
    ctaCopy:
      "Vous n'avez pas besoin d'un mandat bien ficelé. Dites-nous où le travail bloque et on va en faire une première question claire.",
    ctaLabel: "Parlez-nous",
  },
  en: {
    title: "Process-First Odoo Consultants in Montreal",
    description:
      "Meet NBT Labs, a Montreal-based bilingual team that improves business processes before implementing Odoo, automation, and agentic AI.",
    heroEyebrow: "Why NBT Labs · Montreal",
    heroLine1: "We don’t sell software.",
    heroLine2Lead: "We sell",
    heroLine2Highlight: "process improvement.",
    heroDescription:
      "NBT Labs is a digital transformation studio built around one idea: transformation is a process problem before it is a technology problem.",
    heroSecondary: "See our process",
    originIndex: "WHY WE STARTED",
    originHead: "The gap was always underneath the software.",
    originBody1:
      "We started NBT Labs because we kept seeing the same gap: businesses buy an ERP or bolt on generic “AI” and call it transformation, without ever fixing the process underneath.",
    originBody2:
      "We do the process improvement work first, then implement Odoo and AI to run what we improved. That is what makes it a real transformation instead of a reskinned status quo.",
    differenceEyebrow: "How we are different",
    differenceHead: "The order changes the outcome.",
    differenceIntro:
      "The best technology decision is often the one that becomes obvious after the process is understood.",
    differences: [
      [
        "01",
        "Process improvement first, technology second.",
        "Digital transformation, done in the right order. We fix the process, then build the system around it, not the other way around.",
      ],
      [
        "02",
        "Odoo-first, not AI-first.",
        "We implement the system of record properly, then build AI on top of it.",
      ],
      [
        "03",
        "Agentic AI, not a chatbot widget.",
        "Our agents take real actions on real data via Odoo's own automation and connector layer. They are not disconnected assistants that can only answer questions.",
      ],
      [
        "04",
        "Local and bilingual.",
        "Montreal-based, French and English, in your time zone, with real accountability for Quebec-specific compliance, including QST and QPP/QPIP.",
      ],
    ],
    teamEyebrow: "Meet the team",
    teamHead: "Process, product, and engineering at one table.",
    promiseEyebrow: "Our promise",
    promiseHead: "We measure success the way you do.",
    promiseBody:
      "We measure success in hours saved, errors removed, and revenue protected. If a project doesn’t move one of those numbers, we didn’t do our job.",
    metricHours: "Hours",
    metricHoursTail: "saved",
    metricErrors: "Errors",
    metricErrorsTail: "removed",
    metricRevenue: "Revenue",
    metricRevenueTail: "protected",
    ctaEyebrow: "Talk to the team",
    ctaTitle: "Bring us the messy version.",
    ctaCopy:
      "You do not need a polished brief. Tell us where the work gets stuck, and we will help turn that into a clear first question.",
    ctaLabel: "Talk to us",
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
    path: "/why-nbt",
    locale: active,
  });
}

export default async function WhyNbtPage({
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
        variant="manifesto"
        title={
          <>
            <span className="hero-line">{copy.heroLine1}</span>{" "}
            <span className="hero-line hero-line-offset">{copy.heroLine2Lead}{" "}
              <Highlighter
                action="underline"
                animationDuration={980}
                drawDelay={520}
                color="#ff9a3e"
                strokeWidth={8}
                isView
                className="hero-word-highlight"
              >
                {copy.heroLine2Highlight}
              </Highlighter>
            </span>
          </>
        }
        description={copy.heroDescription}
        secondary={{ href: "/how-we-work", label: copy.heroSecondary }}
      />

      <section className="origin-section section-pad">
        <p className="section-index">{copy.originIndex}</p>
        <div className="origin-grid">
          <TextAnimate as="h2" animation="slideUp" by="word" once>
            {copy.originHead}
        </TextAnimate>
          <div className="body-copy">
            <TextAnimate as="p" animation="fadeIn" by="line" once>
              {copy.originBody1}
            </TextAnimate>
            <TextAnimate as="p" animation="fadeIn" by="line" once>
              {copy.originBody2}
            </TextAnimate>
          </div>
        </div>
      </section>

      <section className="difference-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.differenceEyebrow}</p>
            <TextAnimate as="h2" animation="scaleUp" by="text" once>
              {copy.differenceHead}
            </TextAnimate>
          </div>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {copy.differenceIntro}
          </TextAnimate>
        </div>
        <div className="difference-grid">
          {copy.differences.map(([number, title, differenceCopy], index) => (
            <ViewportReveal as="article" delay={index * 0.08} key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{differenceCopy}</p>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <section className="team-section section-pad">
        <div className="section-heading section-heading-tight">
          <div>
            <p className="eyebrow">{copy.teamEyebrow}</p>
            <TextAnimate as="h2" animation="slideUp" by="word" once>
              {copy.teamHead}
            </TextAnimate>
          </div>
        </div>
        <div className="team-grid">
          {team[locale].map((member, index) => (
            <ViewportReveal as="article" delay={index * 0.1} key={member.name}>
              <div className="team-portrait" aria-hidden="true">
                <span>{member.initials}</span>
                <i>{String(index + 1).padStart(2, "0")}</i>
              </div>
              <p className="team-role">{member.role}</p>
              <h3>{member.name}</h3>
              <p>{member.bio}</p>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <section className="promise-section section-pad">
        <div>
          <TextAnimate
            as="p"
            animation="slideLeft"
            by="character"
            className="eyebrow eyebrow-light"
            once
          >
            {copy.promiseEyebrow}
          </TextAnimate>
          <TextAnimate as="h2" animation="scaleUp" by="text" once>
            {copy.promiseHead}
          </TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {copy.promiseBody}
          </TextAnimate>
        </div>
        <div className="outcome-metrics">
          <ViewportReveal>
            <strong><TextAnimate as="span" animation="wavy" by="character" once>{copy.metricHours}</TextAnimate></strong>
            <span>{copy.metricHoursTail}</span>
          </ViewportReveal>
          <ViewportReveal delay={0.08}>
            <strong><TextAnimate as="span" animation="wavy" by="character" once>{copy.metricErrors}</TextAnimate></strong>
            <span>{copy.metricErrorsTail}</span>
          </ViewportReveal>
          <ViewportReveal delay={0.16}>
            <strong><TextAnimate as="span" animation="wavy" by="character" once>{copy.metricRevenue}</TextAnimate></strong>
            <span>{copy.metricRevenueTail}</span>
          </ViewportReveal>
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
