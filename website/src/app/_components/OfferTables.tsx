import { ViewportReveal } from "./ViewportReveal";

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

const offerGroups: OfferGroup[] = [
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
        details: "Approval flows, document handling, OCR, and operational handoffs",
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
        details: "An assistant grounded in your internal knowledge and Odoo data",
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
];

export function OfferTables() {
  return (
    <div className="offer-catalog">
      {offerGroups.map((group, groupIndex) => {
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
                aria-label={`${group.title} packages and pricing`}
                aria-describedby={descriptionId}
              >
                <thead className="offer-table-head">
                  <tr>
                    <th scope="col">Package</th>
                    <th scope="col">Scope</th>
                    {showsTimeline ? <th scope="col">Timeline</th> : null}
                    <th scope="col">Price</th>
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
                      <td className="offer-table-details" data-label="Scope">
                        {row.details}
                      </td>
                      {showsTimeline ? (
                        <td className="offer-table-timing" data-label="Timeline">
                          {row.timing ?? "Scoped to engagement"}
                        </td>
                      ) : null}
                      <td className="offer-table-price" data-label="Price">
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
