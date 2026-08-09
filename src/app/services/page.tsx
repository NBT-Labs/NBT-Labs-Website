import type { Metadata } from "next";
import { CTASection } from "../_components/CTASection";
import { OfferTables } from "../_components/OfferTables";
import { PageHero } from "../_components/PageHero";
import { ViewportReveal } from "../_components/ViewportReveal";
import { Highlighter } from "@/registry/magicui/highlighter";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { createPageMetadata } from "../_data/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Odoo Implementation, Automation & AI Services",
  description:
    "Process improvement, Odoo ERP implementation, workflow automation, systems integrations, and practical agentic AI for Quebec and Canadian SMBs.",
  path: "/services",
});

const services = [
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
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services · Process to production"
        variant="editorial"
        title={
          <>
            <span className="hero-line">Fix the process.</span>{" "}
            <span className="hero-line hero-line-offset">
              <Highlighter
                action="highlight"
                animationDuration={920}
                drawDelay={320}
                color="#b9f45d"
                isView
                className="hero-word-highlight"
              >
                Build with Odoo.
              </Highlighter>
            </span>{" "}
            <span className="hero-line">Keep improving.</span>
          </>
        }
        description="Every engagement starts with an operational bottleneck and ends with a working, documented system your team can own."
        secondary={{ href: "/pricing", label: "View typical pricing" }}
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
              What we do
            </TextAnimate>
            <TextAnimate as="h2" animation="slideUp" by="word" once>
              Transformation, in the right sequence.
            </TextAnimate>
          </div>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {"Each layer makes the next one safer and more valuable. You can start small without building yourself into a corner."}
          </TextAnimate>
        </div>
        <div className="service-rows">
          {services.map((service, index) => (
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
              <a href="/contact" aria-label={`Discuss ${service.label}`}>
                ↗
              </a>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <section className="packages-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Typical engagements</p>
            <TextAnimate as="h2" animation="scaleUp" by="text" once>
              Clear packages. Scoped to the real work.
            </TextAnimate>
          </div>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {"These ranges are planning guides. Every client receives a fixed quote after scope, assumptions, and success measures are agreed."}
          </TextAnimate>
        </div>
        <OfferTables />
        <p className="pricing-note">
          All prices are in CAD and exclude applicable taxes, software licenses,
          and third-party fees.
        </p>
      </section>

      <section className="included-section section-pad">
        <div>
          <p className="eyebrow eyebrow-light">Always included</p>
          <TextAnimate as="h2" animation="scaleUp" by="text" once>
            No black-box handoff.
          </TextAnimate>
        </div>
        <div className="included-grid">
          {[
            "A measurable operational target",
            "Written scope, fee, and timeline",
            "Testing and documentation",
            "Team training",
            "Go-live support",
            "A practical next-step roadmap",
          ].map((item, index) => (
            <div key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Scope the right first move"
        title="One bottleneck is enough to start."
        copy="Tell us where work slows down. We will help you decide whether the right next step is a process audit, an Odoo launch, or a smaller focused sprint."
      />
    </>
  );
}
