import type { Metadata } from "next";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { CTASection } from "../../_components/CTASection";
import { PageHero } from "../../_components/PageHero";
import { ViewportReveal } from "../../_components/ViewportReveal";
import { Highlighter } from "@/registry/magicui/highlighter";
import { createPageMetadata } from "../../_data/seo";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

const COPY = {
  fr: {
    title: "Consultation Odoo pour les PME du Québec et du Canada",
    description:
      "Implantation d'Odoo et automatisation des processus pour les PME de 10 à 150 employés du Québec et du Canada, en services, distribution, fabrication et service sur la route.",
    heroEyebrow: "Qui nous aidons · Québec et Canada",
    heroLine1: "Conçu pour les entreprises",
    heroLine2Lead: "qui ont de",
    heroLine2Highlight: "vraies opérations.",
    heroDescription:
      "On travaille mieux avec les PME du Québec et du Canada qui ont un vrai processus opérationnel à faire rouler, pas juste un site web à entretenir. Si vous évaluez une transformation numérique et que vous voulez corriger le processus, pas seulement le numériser, c'est pour vous qu'on bâtit.",
    heroSecondary: "Découvrir les services",
    fitEyebrow: "Est-ce que ça vous ressemble?",
    fitHead: "Vous sentez les contournements parce que c'est vous qui menez le travail.",
    fitIntro:
      "Si une semaine de vacances d'une seule personne peut bloquer les soumissions, la planification, la facturation ou les rapports, il y a probablement un processus à revoir.",
    fitSignals: [
      "10 à 150 employés",
      "Services, distribution, fabrication légère ou service sur la route",
      "Vous êtes présentement sur des chiffriers, QuickBooks, des outils déconnectés ou un ERP que vous avez dépassé",
      "Vous sentez le travail manuel directement parce que vous êtes le propriétaire ou la personne qui mène les opérations",
      "Vous voulez un système qui devient plus intelligent avec le temps, pas un autre outil ponctuel",
    ],
    workflowEyebrow: "Familles de processus courantes",
    workflowHead: "Là où les opérations connectées cassent habituellement.",
    workflowIntro:
      "Ce ne sont pas des modèles prêts-à-porter. Ce sont les endroits où le coût du travail déconnecté devient vite visible.",
    workflows: [
      [
        "De la soumission à l'encaissement",
        "Soumissions, approbations, commandes, livraison, factures et recouvrement devraient avancer comme un seul processus.",
      ],
      [
        "Stock et expédition",
        "Achats, stock, demande, préparation des commandes et livraison ont besoin d'une seule vue fiable.",
      ],
      [
        "Planification et service sur la route",
        "Capacité, affectations, mises à jour et facturation ne devraient pas dépendre du chiffrier d'un seul coordonnateur.",
      ],
      [
        "Transferts vers la comptabilité",
        "Les événements d'opération devraient devenir des données financières exactes sans double saisie.",
      ],
    ],
    notFitEyebrow: "Probablement pas le bon match",
    notFitHead: "La clarté va dans les deux sens.",
    notFit: [
      "Vous avez seulement besoin d'un site web de marketing.",
      "Vous voulez une démo d'IA sans corriger la fondation de données ou de processus.",
      "Personne à l'interne ne peut participer au projet.",
      "Vous ne voulez standardiser aucune partie du processus.",
    ],
    ctaEyebrow: "Le moyen le plus rapide de le savoir",
    ctaTitle: "Si ça vous ressemble, trouvons le premier goulot d'étranglement.",
    ctaCopy:
      "Le moyen le plus rapide de savoir ce qu'on ferait pour vous, c'est un audit gratuit. Aucune présentation de vente, aucune obligation.",
  },
  en: {
    title: "Odoo Consulting for Quebec & Canadian SMBs",
    description:
      "Odoo implementation and process automation for 10–150 employee Quebec and Canadian SMBs in services, distribution, manufacturing, and field work.",
    heroEyebrow: "Who we help · Quebec & Canada",
    heroLine1: "Built for businesses",
    heroLine2Lead: "with",
    heroLine2Highlight: "real operations.",
    heroDescription:
      "We work best with Quebec and Canadian SMBs that have a real operational process to run, not just a website to maintain. If you are evaluating a digital transformation and want the process fixed, not just digitized, this is who we build for.",
    heroSecondary: "Explore services",
    fitEyebrow: "Is this you?",
    fitHead: "You feel the workarounds because you run the work.",
    fitIntro:
      "If one person taking a week off can stall quoting, scheduling, invoicing, or reporting, there is probably a process worth reviewing.",
    fitSignals: [
      "10–150 employees",
      "Services, distribution, light manufacturing, or field services",
      "Currently on spreadsheets, QuickBooks, disconnected tools, or an ERP you have outgrown",
      "You feel the manual work directly because you are the owner or the person running operations",
      "You want a system that gets smarter over time, not another point tool",
    ],
    workflowEyebrow: "Common process families",
    workflowHead: "Where connected operations usually break.",
    workflowIntro:
      "These are not off-the-shelf templates. They are places where the cost of disconnected work becomes visible quickly.",
    workflows: [
      [
        "Quote to cash",
        "Quotes, approvals, orders, delivery, invoices, and collection should move as one process.",
      ],
      [
        "Inventory & fulfillment",
        "Purchasing, stock, demand, picking, and delivery need one reliable view.",
      ],
      [
        "Scheduling & field service",
        "Capacity, assignments, updates, and billing should not depend on one coordinator’s spreadsheet.",
      ],
      [
        "Finance handoffs",
        "Operational events should become accurate financial data without duplicate entry.",
      ],
    ],
    notFitEyebrow: "Probably not the right fit",
    notFitHead: "Clarity works both ways.",
    notFit: [
      "You only need a marketing website.",
      "You want an AI demo without fixing the data or process foundation.",
      "No internal owner can participate in the work.",
      "You are unwilling to standardize any part of the workflow.",
    ],
    ctaEyebrow: "The fastest way to find out",
    ctaTitle: "If that’s you, let’s find the first bottleneck.",
    ctaCopy:
      "The fastest way to find out what we would do for you is a free audit. No pitch and no obligation.",
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
    path: "/who-we-help",
    locale: active,
  });
}

export default async function WhoWeHelpPage({
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
        variant="audience"
        title={
          <>
            <span className="hero-line">{copy.heroLine1}</span>{" "}
            <span className="hero-line hero-line-offset">{copy.heroLine2Lead}{" "}
              <Highlighter
                action="underline"
                animationDuration={940}
                drawDelay={420}
                color="#b9f45d"
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
        secondary={{ href: "/services", label: copy.heroSecondary }}
      />

      <section className="fit-check-section section-pad">
        <div className="fit-check-copy">
          <p className="eyebrow">{copy.fitEyebrow}</p>
          <TextAnimate as="h2" animation="slideUp" by="word" once>
            {copy.fitHead}
          </TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {copy.fitIntro}
          </TextAnimate>
        </div>
        <div className="fit-check-list">
          {copy.fitSignals.map((signal, index) => (
            <ViewportReveal delay={index * 0.065} key={signal}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{signal}</p>
              <i aria-hidden="true">✓</i>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <section className="workflow-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.workflowEyebrow}</p>
            <TextAnimate as="h2" animation="scaleUp" by="text" once>
              {copy.workflowHead}
            </TextAnimate>
          </div>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {copy.workflowIntro}
          </TextAnimate>
        </div>
        <div className="workflow-grid">
          {copy.workflows.map(([title, workflowCopy], index) => (
            <ViewportReveal as="article" delay={index * 0.08} key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className="workflow-line" aria-hidden="true"><i /></div>
              <h3>{title}</h3>
              <p>{workflowCopy}</p>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <section className="not-fit-section section-pad">
        <div>
          <p className="eyebrow eyebrow-light">{copy.notFitEyebrow}</p>
          <TextAnimate as="h2" animation="slideLeft" by="character" once>
            {copy.notFitHead}
          </TextAnimate>
        </div>
        <ul>
          {copy.notFit.map((item, index) => (
            <ViewportReveal as="li" delay={index * 0.065} key={item}>
              {item}
            </ViewportReveal>
          ))}
        </ul>
      </section>

      <CTASection locale={locale}
        eyebrow={copy.ctaEyebrow}
        title={copy.ctaTitle}
        copy={copy.ctaCopy}
      />
    </>
  );
}
