import type { Metadata } from "next";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { AuditForm } from "../../_components/AuditForm";
import { PageHero } from "../../_components/PageHero";
import { ViewportReveal } from "../../_components/ViewportReveal";
import { Highlighter } from "@/registry/magicui/highlighter";
import { createPageMetadata } from "../../_data/seo";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

const COPY = {
  fr: {
    title: "Réservez un audit de processus et d'automatisation gratuit",
    description:
      "Réservez un appel gratuit de 20 minutes sur vos processus et votre automatisation avec NBT Labs pour cerner le goulot d'étranglement qui coûte le plus de temps à votre entreprise.",
    heroEyebrow: "Audit gratuit · 20 minutes",
    heroLead: "Trouvons ce qui vous coûte le",
    heroHighlight: "plus de temps.",
    heroDescription:
      "Réservez un appel gratuit de 20 minutes. On vous posera quelques questions sur la façon dont votre entreprise fonctionne aujourd'hui. Aucune présentation de vente, aucune obligation. Si ça clique, on définira ensuite la portée d'un audit de processus.",
    heroPrimary: "Remplir le court formulaire",
    expectEyebrow: "À quoi vous attendre",
    expect1: "Une conversation ciblée sur un goulot d'étranglement opérationnel.",
    expect2:
      "Un avis franc : ça clique, ça ne clique pas, et la meilleure prochaine étape.",
    expect3:
      "Si ça clique, on définit la portée d'un audit de processus et d'automatisation comme prochaine étape.",
    foundingBadge: "Partenaire fondateur",
    foundingTitle: "Les 2 ou 3 premiers clients seulement",
    foundingCopy:
      "Les places sont limitées. Les clients fondateurs reçoivent un audit de processus et d'automatisation gratuit et de 25 à 30 % de rabais sur n'importe quel forfait d'implantation ou d'automatisation. En échange, on demande une étude de cas approuvée et un témoignage une fois que vous êtes en service.",
    emailPrompt: "Vous préférez le courriel?",
    place: "Montréal · français et anglais",
  },
  en: {
    title: "Book a Free Process & Automation Audit",
    description:
      "Book a free 20-minute process and automation call with NBT Labs to identify the operational bottleneck costing your business the most time.",
    heroEyebrow: "Free audit · 20 minutes",
    heroLead: "Let’s find out what’s costing you the",
    heroHighlight: "most time.",
    heroDescription:
      "Book a free 20-minute call. We’ll ask a few questions about how your business runs today. There is no pitch and no obligation. If it is a fit, we’ll scope a process audit next.",
    heroPrimary: "Start the short form",
    expectEyebrow: "What to expect",
    expect1: "A focused conversation about one operational bottleneck.",
    expect2: "A candid view on fit, no-fit, and the best next step.",
    expect3:
      "If there is a fit, we scope a Process & Automation Audit as the next step.",
    foundingBadge: "Founding Partner",
    foundingTitle: "First 2–3 clients only",
    foundingCopy:
      "Spots are limited. Founding clients receive a free Process & Automation Audit and 25–30% off any implementation or automation package. In exchange, we ask for an approved case study and testimonial once you are live.",
    emailPrompt: "Prefer email?",
    place: "Montréal · French & English",
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
    path: "/contact",
    locale: active,
  });
}

export default async function ContactPage({
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
        variant="inquiry"
        title={
          <>
            {copy.heroLead}{" "}
            <Highlighter
              action="highlight"
              animationDuration={980}
              drawDelay={620}
              color="#ff9a3e"
              isView
              className="hero-word-highlight"
            >
              {copy.heroHighlight}
            </Highlighter>
          </>
        }
        description={copy.heroDescription}
        primary={{ href: "#audit-form", label: copy.heroPrimary }}
        compact
      />

      <section className="contact-section section-pad">
        <div className="contact-aside">
          <TextAnimate
            as="p"
            animation="slideLeft"
            by="character"
            className="eyebrow"
            once
          >
            {copy.expectEyebrow}
          </TextAnimate>
          <ol>
            <ViewportReveal as="li">
              <TextAnimate as="span" animation="wavy" by="character" once>01</TextAnimate>
              <p>{copy.expect1}</p>
            </ViewportReveal>
            <ViewportReveal as="li" delay={0.08}>
              <TextAnimate as="span" animation="wavy" by="character" once>02</TextAnimate>
              <p>{copy.expect2}</p>
            </ViewportReveal>
            <ViewportReveal as="li" delay={0.16}>
              <TextAnimate as="span" animation="wavy" by="character" once>03</TextAnimate>
              <p>{copy.expect3}</p>
            </ViewportReveal>
          </ol>
          <ViewportReveal className="founding-note" variant="scale">
            <span>{copy.foundingBadge}</span>
            <strong>{copy.foundingTitle}</strong>
            <p>{copy.foundingCopy}</p>
          </ViewportReveal>
          <ViewportReveal className="direct-email" delay={0.08}>
            <span>{copy.emailPrompt}</span>
            <a href="mailto:info@nbtlabs.ca">info@nbtlabs.ca</a>
            <small>{copy.place}</small>
          </ViewportReveal>
        </div>
        <ViewportReveal className="contact-form-reveal" variant="scale">
          <AuditForm locale={locale} />
        </ViewportReveal>
      </section>
    </>
  );
}
