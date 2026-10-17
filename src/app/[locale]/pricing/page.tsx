import type { Metadata } from "next";
import { CTASection } from "../../_components/CTASection";
import { OfferTables } from "../../_components/OfferTables";
import { PageHero } from "../../_components/PageHero";
import { ViewportReveal } from "../../_components/ViewportReveal";
import { Highlighter } from "@/registry/magicui/highlighter";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { createPageMetadata } from "../../_data/seo";
import { isLocale, localePath } from "@/i18n/config";
import { notFound } from "next/navigation";

const COPY = {
  fr: {
    title: "Tarifs d'implantation Odoo et d'automatisation",
    description:
      "Consultez les tarifs à prix fixe typiques, en dollars canadiens, pour les audits de processus, l'implantation d'Odoo, l'automatisation des processus, les intégrations et l'exploitation gérée de l'IA.",
    heroEyebrow: "Tarifs · CAD",
    heroLine1: "Des tarifs clairs.",
    heroLine2: "Aucune surprise.",
    heroDescription:
      "On fixe le prix de tout ce qui peut l'être, pour que vous connaissiez le montant avant de vous engager. Si une hypothèse change, vous approuvez le changement avant que le travail commence.",
    heroSecondary: "Voir comment on définit la portée",
    packagesEyebrow: "Mandats typiques à honoraires fixes",
    packagesHead: "Un montant sur lequel vous pouvez planifier.",
    packagesIntro:
      "Les honoraires exacts suivent une courte discussion sur la portée. Les fourchettes ci-dessous sont des repères de planification honnêtes, pas des prix d'appel.",
    pricingNote:
      "Tous les prix sont en dollars canadiens et excluent la TPS et la TVQ, les licences logicielles et les frais de tiers. La portée, les honoraires et l'échéancier finaux sont convenus avant le début des travaux.",
    methodEyebrow: "Comment on fixe les prix",
    methodHead: "Y voir clair avant de s'engager.",
    methodSteps: [
      [
        "01",
        "Audit gratuit",
        "On trouve la vraie question et on voit si on est les bonnes personnes.",
      ],
      [
        "02",
        "Portée définie",
        "On s'entend sur le processus, les hypothèses, les résultats attendus et les limites.",
      ],
      [
        "03",
        "Soumission à prix fixe",
        "Vous voyez les honoraires, l'échéancier, les inclusions et les exclusions avant le démarrage.",
      ],
      [
        "04",
        "Changements écrits",
        "Tout ajout est chiffré et approuvé avant qu'on l'entreprenne.",
      ],
    ],
    foundingNumber: "25–30 %",
    foundingEyebrow:
      "Programme de partenaires fondateurs · Les 2 ou 3 premiers clients",
    foundingHead: "On est nouveaux, et on ne va pas faire semblant du contraire.",
    foundingIntro:
      "À la place, les 2 ou 3 premiers clients obtiennent des conditions de premiers adoptants qui reflètent la confiance qu'ils accordent à un nouveau studio.",
    foundingBenefits: [
      ["01", "Audit gratuit", "Un audit de processus et d'automatisation gratuit."],
      [
        "02",
        "25 à 30 % de rabais",
        "Sur n'importe quel forfait d'implantation ou d'automatisation.",
      ],
      [
        "03",
        "En échange",
        "Une étude de cas approuvée et un témoignage une fois que vous êtes en service.",
      ],
    ],
    foundingClosing:
      "Ce n'est pas un rabais permanent. C'est comme ça qu'on bâtit le dossier qui nous permettra de charger le plein tarif plus tard. Les premiers clients ont le prix des premiers adoptants, et rien n'est publié sans leur approbation.",
    foundingCta: "Postuler pour une place de partenaire fondateur",
    faqEyebrow: "FAQ",
    faqHead: "Les détails pratiques.",
    faqs: [
      {
        question: "Exigez-vous un dépôt?",
        answer:
          "Les conditions habituelles pour un mandat à prix fixe sont 50 % au démarrage et 50 % à la mise en service.",
      },
      {
        question: "Et si la portée change en cours de projet?",
        answer:
          "Tout ce qui sort de la portée convenue est facturé à nos taux horaires courants, chiffrés avant qu'on commence.",
      },
      {
        question: "Revendez-vous les licences Odoo?",
        answer:
          "Oui. Odoo est refacturé au prix courant, sans majoration de notre part.",
      },
      {
        question: "Qu'est-ce que la migration de données comprend?",
        answer:
          "La soumission nomme les données sources, l'historique, les hypothèses de nettoyage et les responsabilités de validation incluses. Les données inconnues ou de mauvaise qualité sont évaluées avant l'import.",
      },
      {
        question: "Qu'est-ce qui se passe après la mise en service?",
        answer:
          "Les forfaits de lancement Odoo incluent 30 jours de soutien. La surveillance, les améliorations, l'automatisation et l'IA peuvent se poursuivre par un forfait d'amélioration mensuel.",
      },
    ],
    ctaEyebrow: "Commencez par une portée réelle",
    ctaTitle: "Comprenez le problème avant d'acheter la solution.",
    ctaCopy:
      "La première conversation est gratuite. Vous saurez en sortant s'il y a un processus qui vaut la peine d'être audité et quelle devrait être la prochaine étape.",
  },
  en: {
    title: "Odoo Implementation & Automation Pricing",
    description:
      "See typical fixed-fee pricing in CAD for process audits, Odoo implementation, workflow automation, integrations, and managed AI operations.",
    heroEyebrow: "Pricing · CAD",
    heroLine1: "Straightforward pricing.",
    heroLine2: "No surprises.",
    heroDescription:
      "We fix price everything we can, so you know the number before you commit. If an assumption changes, you approve the change before work begins.",
    heroSecondary: "See how scoping works",
    packagesEyebrow: "Typical fixed-fee engagements",
    packagesHead: "A number you can plan around.",
    packagesIntro:
      "The exact fee follows a short scope conversation. The ranges below are honest planning guides, not teaser prices.",
    pricingNote:
      "All prices are in CAD and exclude GST/QST, software licenses, and third-party fees. Final scope, fee, and timeline are agreed before work begins.",
    methodEyebrow: "How pricing works",
    methodHead: "Clarity before commitment.",
    methodSteps: [
      [
        "01",
        "Free audit",
        "We find the real question and decide whether there is a fit.",
      ],
      [
        "02",
        "Defined scope",
        "We agree on the workflow, assumptions, outcomes, and boundaries.",
      ],
      [
        "03",
        "Fixed proposal",
        "You see the fee, timeline, inclusions, and exclusions before kickoff.",
      ],
      [
        "04",
        "Written changes",
        "Anything new is priced and approved before we start it.",
      ],
    ],
    foundingNumber: "25–30%",
    foundingEyebrow: "Founding Partner Program · First 2–3 clients",
    foundingHead: "We’re new, and we’re not going to pretend otherwise.",
    foundingIntro:
      "Instead, the first 2–3 clients get early-adopter terms that reflect the trust they place in a new studio.",
    foundingBenefits: [
      ["01", "Free audit", "A free Process & Automation Audit."],
      ["02", "25–30% off", "Any implementation or automation package."],
      [
        "03",
        "In exchange",
        "An approved case study and testimonial once you are live.",
      ],
    ],
    foundingClosing:
      "This isn’t a permanent discount. It is how we build the track record that lets us charge full rate later. Early clients get the early-adopter price, and nothing is published without their approval.",
    foundingCta: "Apply for a Founding Partner spot",
    faqEyebrow: "FAQ",
    faqHead: "The practical details.",
    faqs: [
      {
        question: "Do you require a deposit?",
        answer:
          "Standard terms are 50% to start and 50% at go-live for fixed-price work.",
      },
      {
        question: "What if scope changes mid-project?",
        answer:
          "Anything outside the agreed scope is billed at our standard hourly rates, quoted before we start.",
      },
      {
        question: "Do you resell Odoo licenses?",
        answer:
          "Yes. Odoo is billed pass-through at standard rates; we do not mark it up.",
      },
      {
        question: "What does data migration include?",
        answer:
          "The proposal names the source data, history, cleanup assumptions, and validation responsibilities included. Unknown or poor-quality data is scoped before import.",
      },
      {
        question: "What happens after go-live?",
        answer:
          "Odoo launch packages include 30 days of support. Ongoing monitoring, enhancements, automation, and AI can continue through a monthly improvement plan.",
      },
    ],
    ctaEyebrow: "Start with a real scope",
    ctaTitle: "Know the problem before you buy the solution.",
    ctaCopy:
      "The first conversation is free. You will leave knowing whether there is a process worth auditing and what the next step should be.",
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
    path: "/pricing",
    locale: active,
  });
}

export default async function PricingPage({
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
        variant="poster"
        title={
          <>
            <span className="hero-line">{copy.heroLine1}</span>{" "}
            <span className="hero-line">
              <Highlighter
                action="highlight"
                animationDuration={880}
                drawDelay={260}
                color="#ff9a3e"
                isView
                className="hero-word-highlight"
              >
                {copy.heroLine2}
              </Highlighter>
            </span>
          </>
        }
        description={copy.heroDescription}
        secondary={{ href: "/how-we-work", label: copy.heroSecondary }}
      />

      <section className="packages-section section-pad packages-page">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.packagesEyebrow}</p>
            <TextAnimate as="h2" animation="slideUp" by="word" once>
              {copy.packagesHead}
            </TextAnimate>
          </div>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {copy.packagesIntro}
          </TextAnimate>
        </div>
        <OfferTables locale={locale} />
        <p className="pricing-note">{copy.pricingNote}</p>
      </section>

      <section className="pricing-method section-pad">
        <div className="section-heading section-heading-tight">
          <div>
            <p className="eyebrow">{copy.methodEyebrow}</p>
            <TextAnimate as="h2" animation="scaleUp" by="text" once>
              {copy.methodHead}
            </TextAnimate>
          </div>
        </div>
        <div className="method-steps">
          {copy.methodSteps.map(([number, title, stepCopy], index) => (
            <ViewportReveal as="article" delay={index * 0.08} key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{stepCopy}</p>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <section className="founding-program section-pad" id="founding-partner">
        <TextAnimate
          as="div"
          animation="wavy"
          by="character"
          className="founding-number"
          aria-hidden="true"
          accessible={false}
          once
        >
          {copy.foundingNumber}
        </TextAnimate>
        <div className="founding-copy">
          <p className="eyebrow eyebrow-light">{copy.foundingEyebrow}</p>
          <TextAnimate as="h2" animation="slideUp" by="word" once>
            {copy.foundingHead}
          </TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {copy.foundingIntro}
          </TextAnimate>
          <ul className="founding-benefits">
            {copy.foundingBenefits.map(([number, title, benefitCopy], index) => (
              <ViewportReveal as="li" delay={index * 0.08} key={number}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{benefitCopy}</p>
              </ViewportReveal>
            ))}
          </ul>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {copy.foundingClosing}
          </TextAnimate>
          <a className="button button-light" href={localePath(locale, "/contact")}>
            {copy.foundingCta} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="faq-section section-pad">
        <div>
          <TextAnimate
            as="p"
            animation="slideLeft"
            by="character"
            className="eyebrow"
            once
          >
            {copy.faqEyebrow}
          </TextAnimate>
          <TextAnimate as="h2" animation="scaleUp" by="text" once>
            {copy.faqHead}
          </TextAnimate>
        </div>
        <div className="faq-list">
          {copy.faqs.map((faq, index) => (
            <ViewportReveal delay={index * 0.055} key={faq.question}>
              <details open={index === 0}>
                <summary>
                  <span>{faq.question}</span>
                  <i aria-hidden="true">+</i>
                </summary>
                <p>{faq.answer}</p>
              </details>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <CTASection locale={locale}
        eyebrow={copy.ctaEyebrow}
        title={copy.ctaTitle}
        copy={copy.ctaCopy}
      />
    </>
  );
}
