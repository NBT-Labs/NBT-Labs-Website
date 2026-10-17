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
    title: "Implantation Odoo, automatisation et services d'IA",
    description:
      "Amélioration des processus, implantation de l'ERP Odoo, automatisation des processus, intégrations de systèmes et IA agentique concrète pour les PME du Québec et du Canada.",
    heroEyebrow: "Services · Du processus à la production",
    heroLine1: "Réglez le processus.",
    heroLine2: "Bâtissez avec Odoo.",
    heroLine3: "Continuez d'améliorer.",
    heroDescription:
      "Chaque mandat commence par un goulot d'étranglement opérationnel et finit par un système fonctionnel et documenté que votre équipe peut s'approprier.",
    heroSecondary: "Voir les tarifs typiques",
    whatEyebrow: "Ce qu'on fait",
    whatHead: "La transformation, dans le bon ordre.",
    whatIntro:
      "Chaque couche rend la suivante plus sûre et plus payante. Vous pouvez commencer petit sans vous peinturer dans le coin.",
    /** Template with {label}. */
    discussAria: "Discuter de ce service : {label}",
    services: [
      {
        id: "process",
        number: "01",
        label: "Amélioration des processus",
        titleLead: "Commencez par le travail,",
        titleAccent: "pas par le logiciel.",
        headlineStyle: "marker",
        copy: "On cartographie le vrai processus, on chiffre l'effort évitable et on définit l'état cible avant de choisir une réponse technique. Vous partez avec un plan priorisé, même si vous ne nous confiez pas la réalisation.",
        detail:
          "Cartographie de l'état actuel · Mesure de départ · Conception de l'état cible",
      },
      {
        id: "odoo",
        number: "02",
        label: "Implantation d'Odoo",
        titleLead: "Un noyau opérationnel modulaire,",
        titleAccent: "configuré autour du processus amélioré.",
        headlineStyle: "offset",
        copy: "On implante les applications Odoo dont vos opérations ont besoin, on migre les données convenues, on configure les droits d'accès, on teste le processus au complet, on forme l'équipe et on reste jusqu'à la mise en service.",
        detail: "Configuration · Migration · Formation · Soutien au lancement",
      },
      {
        id: "automation",
        number: "03",
        label: "Automatisation et intégrations",
        titleLead: "Éliminez le travail répétitif.",
        titleAccent: "Gardez vos outils essentiels synchronisés.",
        headlineStyle: "underline",
        copy: "On automatise les transferts répétitifs et on connecte le commerce en ligne, la comptabilité, les paiements et les autres outils qui doivent vraiment rester. La surveillance et la gestion des erreurs sont incluses.",
        detail:
          "Automatisation des processus · API · Surveillance · Documentation",
      },
      {
        id: "ai",
        number: "04",
        label: "IA pour les opérations",
        titleLead: "Des agents utiles,",
        titleAccent: "encadrés par de vrais contrôles.",
        headlineStyle: "bracket",
        copy: "On bâtit des agents ciblés et des assistants de connaissances qui travaillent avec des données d'affaires encadrées, des droits d'accès définis, des évaluations, des journaux et une approbation humaine là où il en faut. Tous les problèmes n'ont pas besoin d'IA, et on vous le dira.",
        detail: "Agents · Assistants RAG · Évaluation · Garde-fous",
      },
      {
        id: "improvement",
        number: "05",
        label: "Amélioration continue",
        titleLead: "Ajoutez du levier",
        titleAccent: "sans repartir un autre projet de remplacement.",
        headlineStyle: "mono",
        copy: "Après le lancement, on réserve de la capacité pour des améliorations mesurées : un processus ici, une intégration là, un agent quand la fondation est prête.",
        detail: "Surveillance · Améliorations · Plan trimestriel",
      },
    ],
    packagesEyebrow: "Mandats typiques",
    packagesHead: "Des forfaits clairs. Définis selon le vrai travail.",
    packagesIntro:
      "Ces fourchettes servent à planifier. Chaque client reçoit une soumission à prix fixe une fois la portée, les hypothèses et les mesures de succès convenues.",
    pricingNote:
      "Tous les prix sont en dollars canadiens et excluent les taxes applicables, les licences logicielles et les frais de tiers.",
    includedEyebrow: "Toujours inclus",
    includedHead: "Aucune livraison en boîte noire.",
    included: [
      "Une cible opérationnelle mesurable",
      "Portée, honoraires et échéancier écrits",
      "Tests et documentation",
      "Formation de l'équipe",
      "Soutien à la mise en service",
      "Un plan concret pour la suite",
    ],
    ctaEyebrow: "Définissez le bon premier geste",
    ctaTitle: "Un seul goulot d'étranglement suffit pour commencer.",
    ctaCopy:
      "Dites-nous où le travail ralentit. On vous aidera à décider si la bonne prochaine étape est un audit de processus, un lancement Odoo ou un sprint plus ciblé.",
  },
  en: {
    title: "Odoo Implementation, Automation & AI Services",
    description:
      "Process improvement, Odoo ERP implementation, workflow automation, systems integrations, and practical agentic AI for Quebec and Canadian SMBs.",
    heroEyebrow: "Services · Process to production",
    heroLine1: "Fix the process.",
    heroLine2: "Build with Odoo.",
    heroLine3: "Keep improving.",
    heroDescription:
      "Every engagement starts with an operational bottleneck and ends with a working, documented system your team can own.",
    heroSecondary: "View typical pricing",
    whatEyebrow: "What we do",
    whatHead: "Transformation, in the right sequence.",
    whatIntro:
      "Each layer makes the next one safer and more valuable. You can start small without building yourself into a corner.",
    discussAria: "Discuss {label}",
    services: [
      {
        id: "process",
        number: "01",
        label: "Process improvement",
        titleLead: "Start with the work,",
        titleAccent: "not the software.",
        headlineStyle: "marker",
        copy: "We map the real workflow, quantify avoidable effort, and define the future state before choosing a technical answer. You leave with a prioritized roadmap, even if you do not hire us to build it.",
        detail: "Current-state map · Opportunity baseline · Future-state design",
      },
      {
        id: "odoo",
        number: "02",
        label: "Odoo implementation",
        titleLead: "A modular operating core,",
        titleAccent: "configured around the improved process.",
        headlineStyle: "offset",
        copy: "We implement the Odoo apps your operation needs, migrate agreed data, configure permissions, test the full workflow, train the team, and stay through go-live.",
        detail: "Configuration · Migration · Training · Launch support",
      },
      {
        id: "automation",
        number: "03",
        label: "Automation & integrations",
        titleLead: "Remove repetitive work.",
        titleAccent: "Keep essential tools in sync.",
        headlineStyle: "underline",
        copy: "We automate repeatable handoffs and connect e-commerce, accounting, payments, and other tools that genuinely need to remain. Monitoring and error handling are included.",
        detail: "Workflow automation · APIs · Monitoring · Documentation",
      },
      {
        id: "ai",
        number: "04",
        label: "AI for operations",
        titleLead: "Useful agents,",
        titleAccent: "bounded by real controls.",
        headlineStyle: "bracket",
        copy: "We build focused agents and knowledge assistants that work with governed business data, defined permissions, evaluations, logs, and human approval where needed. Not every problem needs AI, and we will say so.",
        detail: "Agents · RAG assistants · Evaluation · Guardrails",
      },
      {
        id: "improvement",
        number: "05",
        label: "Continuous improvement",
        titleLead: "Add leverage",
        titleAccent: "without another replacement project.",
        headlineStyle: "mono",
        copy: "After launch, we reserve capacity for measured improvements: a workflow here, an integration there, an agent when the foundation is ready.",
        detail: "Monitoring · Enhancements · Quarterly roadmap",
      },
    ],
    packagesEyebrow: "Typical engagements",
    packagesHead: "Clear packages. Scoped to the real work.",
    packagesIntro:
      "These ranges are planning guides. Every client receives a fixed quote after scope, assumptions, and success measures are agreed.",
    pricingNote:
      "All prices are in CAD and exclude applicable taxes, software licenses, and third-party fees.",
    includedEyebrow: "Always included",
    includedHead: "No black-box handoff.",
    included: [
      "A measurable operational target",
      "Written scope, fee, and timeline",
      "Testing and documentation",
      "Team training",
      "Go-live support",
      "A practical next-step roadmap",
    ],
    ctaEyebrow: "Scope the right first move",
    ctaTitle: "One bottleneck is enough to start.",
    ctaCopy:
      "Tell us where work slows down. We will help you decide whether the right next step is a process audit, an Odoo launch, or a smaller focused sprint.",
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
    path: "/services",
    locale: active,
  });
}

export default async function ServicesPage({
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
        variant="editorial"
        title={
          <>
            <span className="hero-line">{copy.heroLine1}</span>{" "}
            <span className="hero-line hero-line-offset">
              <Highlighter
                action="highlight"
                animationDuration={920}
                drawDelay={320}
                color="#b9f45d"
                isView
                className="hero-word-highlight"
              >
                {copy.heroLine2}
              </Highlighter>
            </span>{" "}
            <span className="hero-line">{copy.heroLine3}</span>
          </>
        }
        description={copy.heroDescription}
        secondary={{ href: "/pricing", label: copy.heroSecondary }}
      />

      <section className="service-list section-pad">
        <div className="section-heading section-heading-tight">
          <div>
            <TextAnimate
              as="p"
              animation="slideLeft"
              by="character"
              className="eyebrow"
              once
            >
              {copy.whatEyebrow}
            </TextAnimate>
            <TextAnimate as="h2" animation="slideUp" by="word" once>
              {copy.whatHead}
            </TextAnimate>
          </div>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {copy.whatIntro}
          </TextAnimate>
        </div>
        <div className="service-rows">
          {copy.services.map((service, index) => (
            <ViewportReveal
              as="article"
              className="service-row"
              delay={Math.min(index * 0.055, 0.18)}
              id={service.id}
              key={service.id}
            >
              <div className="service-row-index">
                <TextAnimate as="span" animation="scaleUp" by="text" once>
                  {service.number}
                </TextAnimate>
                <small>{service.label}</small>
              </div>
              <div
                className={`service-row-copy service-row-copy-${service.headlineStyle}`}
              >
                <h3>
                  <span>{service.titleLead}</span>{" "}
                  <strong>{service.titleAccent}</strong>
                </h3>
                <p>{service.copy}</p>
                <span className="service-detail">{service.detail}</span>
              </div>
              <a
                href={localePath(locale, "/contact")}
                aria-label={copy.discussAria.replace("{label}", service.label)}
              >
                ↗
              </a>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <section className="packages-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.packagesEyebrow}</p>
            <TextAnimate as="h2" animation="scaleUp" by="text" once>
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

      <section className="included-section section-pad">
        <div>
          <p className="eyebrow eyebrow-light">{copy.includedEyebrow}</p>
          <TextAnimate as="h2" animation="scaleUp" by="text" once>
            {copy.includedHead}
          </TextAnimate>
        </div>
        <div className="included-grid">
          {copy.included.map((item, index) => (
            <div key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </div>
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
