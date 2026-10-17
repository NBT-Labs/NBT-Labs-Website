import type { Metadata } from "next";
import { CTASection } from "../../_components/CTASection";
import { PageHero } from "../../_components/PageHero";
import { processSteps } from "../../_data/site";
import { ViewportReveal } from "../../_components/ViewportReveal";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { Highlighter } from "@/registry/magicui/highlighter";
import { createPageMetadata } from "../../_data/seo";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

const COPY = {
  fr: {
    title: "Notre processus d'implantation Odoo",
    description:
      "Découvrez le processus en cinq étapes de NBT Labs : découverte, audit de processus, implantation Odoo à prix fixe, soutien à la mise en service et amélioration continue.",
    heroEyebrow: "Notre approche · Cinq étapes claires",
    heroLine1: "Un processus clair,",
    heroLine2Lead: "du premier appel au",
    heroLine2Highlight: "système en service.",
    heroDescription:
      "Vous savez ce qui s'en vient, ce que ça coûte et ce que chaque étape doit produire. Pas de phase de découverte vague. Aucune livraison en boîte noire.",
    heroSecondary: "Voir les tarifs typiques",
    timelineEyebrow: "Du premier appel au système en service",
    timelineHead: "Chaque étape mérite la suivante.",
    timelineIntro:
      "L'audit a de la valeur en soi. L'implantation a une ligne d'arrivée claire. L'amélioration se poursuit seulement quand il y a un autre résultat qui vaut la peine.",
    outputLabel: "Résultat",
    principlesEyebrow: "À quoi ressemble le travail avec nous",
    principlesHead:
      "Votre équipe comprend ce qui a été bâti, pourquoi ça marche et comment l'utiliser.",
    principles: [
      [
        "Visible",
        "Un plan partagé, des décisions claires et un suivi d'avancement en langage clair.",
      ],
      ["Mesuré", "Une mesure avant-après liée au résultat opérationnel."],
      [
        "Approprié",
        "De la documentation et de la formation qui laissent votre équipe aux commandes.",
      ],
      [
        "Graduel",
        "Un noyau fonctionnel d'abord, puis du levier additionnel par étapes sensées.",
      ],
    ],
    ctaEyebrow: "Première étape · 20 minutes",
    ctaTitle: "Trouvons le goulot d'étranglement le plus coûteux.",
    ctaCopy:
      "Pas de présentation. Aucune obligation. Juste une conversation ciblée sur votre processus actuel, vos outils et ce qui vous coûte du temps.",
    ctaLabel: "Audit gratuit",
  },
  en: {
    title: "Our Odoo Implementation Process",
    description:
      "See NBT Labs' five-step process: discovery, process audit, fixed-price Odoo implementation, go-live support, and continuous improvement.",
    heroEyebrow: "How we work · Five clear steps",
    heroLine1: "A clear process,",
    heroLine2Lead: "from first call to",
    heroLine2Highlight: "live system.",
    heroDescription:
      "You know what comes next, what it costs, and what each step is meant to produce. No vague discovery phase. No black-box handoff.",
    heroSecondary: "See typical pricing",
    timelineEyebrow: "From first call to live system",
    timelineHead: "Each step earns the next one.",
    timelineIntro:
      "The audit has value on its own. The implementation has a clear finish line. Improvement continues only when there is another result worth pursuing.",
    outputLabel: "Output",
    principlesEyebrow: "What working together feels like",
    principlesHead:
      "Your team understands what was built, why it works, and how to use it.",
    principles: [
      [
        "Visible",
        "A shared plan, clear decisions, and a plain-language view of progress.",
      ],
      ["Measured", "A before-and-after baseline tied to the operational result."],
      ["Owned", "Documentation and training that leave your team in control."],
      [
        "Incremental",
        "A working core first, then additional leverage in sensible steps.",
      ],
    ],
    ctaEyebrow: "Step one · 20 minutes",
    ctaTitle: "Let’s find the costliest bottleneck.",
    ctaCopy:
      "No deck. No obligation. Just a focused conversation about your current process, tools, and what is costing you time.",
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
    path: "/how-we-work",
    locale: active,
  });
}

export default async function HowWeWorkPage({
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
        variant="blueprint"
        title={
          <>
            <span className="hero-line">{copy.heroLine1}</span>{" "}
            <span className="hero-line">{copy.heroLine2Lead}{" "}
              <Highlighter
                action="underline"
                animationDuration={900}
                drawDelay={430}
                color="#6f9f38"
                strokeWidth={7}
                isView
                className="hero-word-highlight"
              >
                {copy.heroLine2Highlight}
              </Highlighter>
            </span>
          </>
        }
        description={copy.heroDescription}
        secondary={{ href: "/pricing", label: copy.heroSecondary }}
      />

      <section className="process-timeline section-pad">
        <div className="timeline-intro">
          <TextAnimate
            as="p"
            animation="slideLeft"
            by="character"
            className="eyebrow"
            once
          >
            {copy.timelineEyebrow}
          </TextAnimate>
          <TextAnimate as="h2" animation="slideUp" by="word" once>
            {copy.timelineHead}
          </TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {copy.timelineIntro}
          </TextAnimate>
        </div>
        <div className="timeline-steps">
          {processSteps[locale].map((step, index) => (
            <ViewportReveal
              as="article"
              delay={Math.min(index * 0.06, 0.18)}
              key={step.number}
            >
              <div className="timeline-marker">
                <span>{step.number}</span>
                <i aria-hidden="true" />
              </div>
              <div className="timeline-step-copy">
                <div>
                  <p>{step.timing}</p>
                  <h3>{step.title}</h3>
                </div>
                <p>{step.copy}</p>
                <div className="timeline-output">
                  <span>{copy.outputLabel}</span>
                  <strong>{step.output}</strong>
                </div>
              </div>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <section className="working-principles section-pad">
        <div>
          <p className="eyebrow eyebrow-light">{copy.principlesEyebrow}</p>
          <TextAnimate as="h2" animation="scaleUp" by="text" once>
            {copy.principlesHead}
          </TextAnimate>
        </div>
        <div className="principle-grid">
          {copy.principles.map(([title, principleCopy], index) => (
            <ViewportReveal as="article" delay={index * 0.08} key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{principleCopy}</p>
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
