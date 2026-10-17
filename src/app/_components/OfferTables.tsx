import { ViewportReveal } from "./ViewportReveal";
import type { Locale } from "@/lib/audit/types";

type OfferRow = {
  name: string;
  details: string;
  timing?: string;
  price: string;
};

type OfferGroup = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  rows: OfferRow[];
};

const LABELS = {
  fr: {
    package: "Forfait",
    scope: "Portée",
    timeline: "Échéancier",
    price: "Prix",
    scopedToEngagement: "Selon le mandat",
    /** Template with {title}. */
    tableLabel: "Forfaits et prix — {title}",
  },
  en: {
    package: "Package",
    scope: "Scope",
    timeline: "Timeline",
    price: "Price",
    scopedToEngagement: "Scoped to engagement",
    tableLabel: "{title} packages and pricing",
  },
} as const;

const offerGroups: Record<Locale, OfferGroup[]> = {
  fr: [
    {
      id: "odoo-foundation",
      eyebrow: "Fondation",
      title: "Fondation Odoo : implantation de l'ERP",
      description:
        "Chaque implantation commence par une passe d'amélioration des processus, pas par une liste de modules à cocher. On cartographie la façon dont le travail se fait vraiment, puis on configure Odoo comme colonne vertébrale de vos opérations autour du processus amélioré.",
      rows: [
        {
          name: "Démarrage",
          details: "1 à 10 utilisateurs · Base ventes, stock et comptabilité",
          timing: "3 à 5 semaines",
          price: "À partir de 7 000 $",
        },
        {
          name: "Croissance",
          details:
            "11 à 30 utilisateurs · Déploiement multi-applications avec 1 ou 2 intégrations",
          timing: "6 à 10 semaines",
          price: "À partir de 15 000 $",
        },
        {
          name: "Entreprise",
          details:
            "30 utilisateurs et plus · Multisociété ou processus opérationnels complexes",
          timing: "10 semaines et plus",
          price: "Soumission sur mesure",
        },
      ],
    },
    {
      id: "automation-integrations",
      eyebrow: "Efficacité",
      title: "Automatisation et intégrations",
      description:
        "Repérer le travail manuel qui vous coûte du temps, puis l'éliminer sans créer une autre solution ponctuelle fragile.",
      rows: [
        {
          name: "Audit de processus et d'automatisation",
          details: "Diagnostic d'une semaine avec un plan chiffré et priorisé",
          price: "À partir de 1 200 $",
        },
        {
          name: "Sprint d'intégration",
          details:
            "Commerce en ligne, comptabilité, paiements ou autres outils d'affaires",
          price: "À partir de 3 000 $",
        },
        {
          name: "Automatisation des processus",
          details:
            "Flux d'approbation, traitement des documents, reconnaissance de texte (OCR) et transferts entre équipes",
          price: "À partir de 2 000 $",
        },
      ],
    },
    {
      id: "agentic-ai",
      eyebrow: "Intelligence",
      title: "IA agentique et intelligence sur mesure",
      description:
        "De l'IA ciblée qui travaille sur des données d'affaires encadrées, qui passe à l'action et qui gagne sa place dans les opérations.",
      rows: [
        {
          name: "Agent IA (un cas d'usage)",
          details:
            "Un agent en production pour les soumissions, la planification ou les opérations",
          price: "À partir de 5 000 $ + forfait de gestion",
        },
        {
          name: "Assistant de connaissances (RAG)",
          details:
            "Un assistant ancré dans vos connaissances internes et vos données Odoo",
          price: "À partir de 6 000 $ + forfait",
        },
        {
          name: "Modèle sur mesure / ajustement fin",
          details:
            "Travail de modèle à portée définie pour un besoin opérationnel spécialisé",
          price: "Soumission sur mesure",
        },
        {
          name: "Exploitation IA gérée",
          details:
            "Surveillance continue, évaluations, mises à jour et garde-fous",
          price: "À partir de 500 $/mois",
        },
      ],
    },
  ],
  en: [
    {
      id: "odoo-foundation",
      eyebrow: "Foundation",
      title: "Odoo Foundation: ERP Implementation",
      description:
        "Every implementation starts with a process improvement pass, not a module checklist. We map how work actually happens, then configure Odoo as your operational backbone around that improved process.",
      rows: [
        {
          name: "Starter",
          details: "1–10 users · Sales, inventory, and accounting foundation",
          timing: "3–5 weeks",
          price: "From $7,000",
        },
        {
          name: "Growth",
          details: "11–30 users · Multi-app rollout with 1–2 integrations",
          timing: "6–10 weeks",
          price: "From $15,000",
        },
        {
          name: "Enterprise",
          details: "30+ users · Multi-company or complex operational workflows",
          timing: "10+ weeks",
          price: "Custom quote",
        },
      ],
    },
    {
      id: "automation-integrations",
      eyebrow: "Efficiency",
      title: "Automation & Integrations",
      description:
        "Find the manual work that is costing you time, then remove it without creating another fragile point solution.",
      rows: [
        {
          name: "Process & automation audit",
          details: "1-week diagnostic with a quantified, prioritized roadmap",
          price: "From $1,200",
        },
        {
          name: "Integration sprint",
          details: "E-commerce, accounting, payments, or other business tools",
          price: "From $3,000",
        },
        {
          name: "Workflow automation",
          details:
            "Approval flows, document handling, OCR, and operational handoffs",
          price: "From $2,000",
        },
      ],
    },
    {
      id: "agentic-ai",
      eyebrow: "Intelligence",
      title: "Agentic AI & Custom Intelligence",
      description:
        "Focused AI that works on governed business data, takes useful actions, and earns its place in the operation.",
      rows: [
        {
          name: "AI Agent (single use case)",
          details: "One production agent for quoting, scheduling, or operations",
          price: "From $5,000 + managed retainer",
        },
        {
          name: "RAG knowledge assistant",
          details:
            "An assistant grounded in your internal knowledge and Odoo data",
          price: "From $6,000 + retainer",
        },
        {
          name: "Custom model / fine-tuning",
          details: "Scoped model work for a specialized operational need",
          price: "Custom quote",
        },
        {
          name: "Managed AI Ops",
          details: "Ongoing monitoring, evaluations, updates, and guardrails",
          price: "From $500/month",
        },
      ],
    },
  ],
};

export function OfferTables({ locale }: { locale: Locale }) {
  const labels = LABELS[locale];

  return (
    <div className="offer-catalog">
      {offerGroups[locale].map((group, groupIndex) => {
        const descriptionId = `${group.id}-description`;
        const showsTimeline = group.rows.some((row) => row.timing);

        return (
          <ViewportReveal
            as="section"
            className="offer-group"
            delay={Math.min(groupIndex * 0.08, 0.16)}
            id={group.id}
            key={group.id}
          >
            <header className="offer-group-header">
              <div className="offer-group-heading">
                <span className="offer-group-number" aria-hidden="true">
                  {String(groupIndex + 1).padStart(2, "0")}
                </span>
                <p className="offer-group-eyebrow">{group.eyebrow}</p>
              </div>
              <h3 className="offer-group-title">{group.title}</h3>
              <p className="offer-group-description" id={descriptionId}>
                {group.description}
              </p>
            </header>

            <div className="offer-table-shell">
              <table
                className="offer-table"
                aria-label={labels.tableLabel.replace("{title}", group.title)}
                aria-describedby={descriptionId}
              >
                <thead className="offer-table-head">
                  <tr>
                    <th scope="col">{labels.package}</th>
                    <th scope="col">{labels.scope}</th>
                    {showsTimeline ? <th scope="col">{labels.timeline}</th> : null}
                    <th scope="col">{labels.price}</th>
                  </tr>
                </thead>
                <tbody className="offer-table-body">
                  {group.rows.map((row, rowIndex) => (
                    <tr className="offer-table-row" key={row.name}>
                      <th className="offer-table-package" scope="row">
                        <span className="offer-row-number" aria-hidden="true">
                          {String(rowIndex + 1).padStart(2, "0")}
                        </span>
                        <span>{row.name}</span>
                      </th>
                      <td className="offer-table-details" data-label={labels.scope}>
                        {row.details}
                      </td>
                      {showsTimeline ? (
                        <td className="offer-table-timing" data-label={labels.timeline}>
                          {row.timing ?? labels.scopedToEngagement}
                        </td>
                      ) : null}
                      <td className="offer-table-price" data-label={labels.price}>
                        {row.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ViewportReveal>
        );
      })}
    </div>
  );
}
