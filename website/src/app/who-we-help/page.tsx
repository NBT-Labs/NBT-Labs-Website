import type { Metadata } from "next";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { CTASection } from "../_components/CTASection";
import { PageHero } from "../_components/PageHero";
import { ViewportReveal } from "../_components/ViewportReveal";
import { Highlighter } from "@/registry/magicui/highlighter";
import { createPageMetadata } from "../_data/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Odoo Consulting for Quebec & Canadian SMBs",
  description:
    "Odoo implementation and process automation for 10–150 employee Quebec and Canadian SMBs in services, distribution, manufacturing, and field work.",
  path: "/who-we-help",
});

const fitSignals = [
  "10–150 employees",
  "Services, distribution, light manufacturing, or field services",
  "Currently on spreadsheets, QuickBooks, disconnected tools, or an ERP you have outgrown",
  "You feel the manual work directly because you are the owner or the person running operations",
  "You want a system that gets smarter over time, not another point tool",
];

const workflows = [
  ["Quote to cash", "Quotes, approvals, orders, delivery, invoices, and collection should move as one process."],
  ["Inventory & fulfillment", "Purchasing, stock, demand, picking, and delivery need one reliable view."],
  ["Scheduling & field service", "Capacity, assignments, updates, and billing should not depend on one coordinator’s spreadsheet."],
  ["Finance handoffs", "Operational events should become accurate financial data without duplicate entry."],
];

export default function WhoWeHelpPage() {
  return (
    <>
      <PageHero
        eyebrow="Who we help · Quebec & Canada"
        variant="audience"
        title={
          <>
            <span className="hero-line">Built for businesses</span>{" "}
            <span className="hero-line hero-line-offset">with{" "}
              <Highlighter
                action="underline"
                animationDuration={940}
                drawDelay={420}
                color="#b9f45d"
                strokeWidth={8}
                isView
                className="hero-word-highlight"
              >
                real operations.
              </Highlighter>
            </span>
          </>
        }
        description="We work best with Quebec and Canadian SMBs that have a real operational process to run, not just a website to maintain. If you are evaluating a digital transformation and want the process fixed, not just digitized, this is who we build for."
        secondary={{ href: "/services", label: "Explore services" }}
      />

      <section className="fit-check-section section-pad">
        <div className="fit-check-copy">
          <p className="eyebrow">Is this you?</p>
          <TextAnimate as="h2" animation="slideUp" by="word" once>
            You feel the workarounds because you run the work.
          </TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {"If one person taking a week off can stall quoting, scheduling, invoicing, or reporting, there is probably a process worth reviewing."}
          </TextAnimate>
        </div>
        <div className="fit-check-list">
          {fitSignals.map((signal, index) => (
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
            <p className="eyebrow">Common process families</p>
            <TextAnimate as="h2" animation="scaleUp" by="text" once>
              Where connected operations usually break.
            </TextAnimate>
          </div>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {"These are not off-the-shelf templates. They are places where the cost of disconnected work becomes visible quickly."}
          </TextAnimate>
        </div>
        <div className="workflow-grid">
          {workflows.map(([title, copy], index) => (
            <ViewportReveal as="article" delay={index * 0.08} key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className="workflow-line" aria-hidden="true"><i /></div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <section className="not-fit-section section-pad">
        <div>
          <p className="eyebrow eyebrow-light">Probably not the right fit</p>
          <TextAnimate as="h2" animation="slideLeft" by="character" once>
            Clarity works both ways.
          </TextAnimate>
        </div>
        <ul>
          {[
            "You only need a marketing website.",
            "You want an AI demo without fixing the data or process foundation.",
            "No internal owner can participate in the work.",
            "You are unwilling to standardize any part of the workflow.",
          ].map((item, index) => (
            <ViewportReveal as="li" delay={index * 0.065} key={item}>
              {item}
            </ViewportReveal>
          ))}
        </ul>
      </section>

      <CTASection
        eyebrow="The fastest way to find out"
        title="If that’s you, let’s find the first bottleneck."
        copy="The fastest way to find out what we would do for you is a free process audit. No pitch and no obligation."
      />
    </>
  );
}
