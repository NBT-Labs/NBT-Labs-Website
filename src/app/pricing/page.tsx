import type { Metadata } from "next";
import { CTASection } from "../_components/CTASection";
import { OfferTables } from "../_components/OfferTables";
import { PageHero } from "../_components/PageHero";
import { ViewportReveal } from "../_components/ViewportReveal";
import { Highlighter } from "@/registry/magicui/highlighter";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { createPageMetadata } from "../_data/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Odoo Implementation & Automation Pricing",
  description:
    "See typical fixed-fee pricing in CAD for process audits, Odoo implementation, workflow automation, integrations, and managed AI operations.",
  path: "/pricing",
});

const faqs = [
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
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing · CAD"
        variant="poster"
        title={
          <>
            <span className="hero-line">Straightforward pricing.</span>{" "}
            <span className="hero-line">
              <Highlighter
                action="highlight"
                animationDuration={880}
                drawDelay={260}
                color="#ff9a3e"
                isView
                className="hero-word-highlight"
              >
                No surprises.
              </Highlighter>
            </span>
          </>
        }
        description="We fix price everything we can, so you know the number before you commit. If an assumption changes, you approve the change before work begins."
        secondary={{ href: "/how-we-work", label: "See how scoping works" }}
      />

      <section className="packages-section section-pad packages-page">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Typical fixed-fee engagements</p>
            <TextAnimate as="h2" animation="slideUp" by="word" once>
              A number you can plan around.
            </TextAnimate>
          </div>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {"The exact fee follows a short scope conversation. The ranges below are honest planning guides, not teaser prices."}
          </TextAnimate>
        </div>
        <OfferTables />
        <p className="pricing-note">
          All prices are in CAD and exclude GST/QST, software licenses, and
          third-party fees. Final scope, fee, and timeline are agreed before work begins.
        </p>
      </section>

      <section className="pricing-method section-pad">
        <div className="section-heading section-heading-tight">
          <div>
            <p className="eyebrow">How pricing works</p>
            <TextAnimate as="h2" animation="scaleUp" by="text" once>
              Clarity before commitment.
            </TextAnimate>
          </div>
        </div>
        <div className="method-steps">
          {[
            ["01", "Free process audit", "We find the real question and decide whether there is a fit."],
            ["02", "Defined scope", "We agree on the workflow, assumptions, outcomes, and boundaries."],
            ["03", "Fixed proposal", "You see the fee, timeline, inclusions, and exclusions before kickoff."],
            ["04", "Written changes", "Anything new is priced and approved before we start it."],
          ].map(([number, title, copy], index) => (
            <ViewportReveal as="article" delay={index * 0.08} key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
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
          25–30%
        </TextAnimate>
        <div className="founding-copy">
          <p className="eyebrow eyebrow-light">Founding Partner Program · First 2–3 clients</p>
          <TextAnimate as="h2" animation="slideUp" by="word" once>
            We’re new, and we’re not going to pretend otherwise.
          </TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {"Instead, the first 2–3 clients get early-adopter terms that reflect the trust they place in a new studio."}
          </TextAnimate>
          <ul className="founding-benefits">
            {[
              ["01", "Free audit", "A free Process & Automation Audit."],
              ["02", "25–30% off", "Any implementation or automation package."],
              ["03", "In exchange", "An approved case study and testimonial once you are live."],
            ].map(([number, title, copy], index) => (
              <ViewportReveal as="li" delay={index * 0.08} key={number}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{copy}</p>
              </ViewportReveal>
            ))}
          </ul>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {"This isn’t a permanent discount. It is how we build the track record that lets us charge full rate later. Early clients get the early-adopter price, and nothing is published without their approval."}
          </TextAnimate>
          <a className="button button-light" href="/contact">
            Apply for a Founding Partner spot <span aria-hidden="true">↗</span>
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
            FAQ
          </TextAnimate>
          <TextAnimate as="h2" animation="scaleUp" by="text" once>
            The practical details.
          </TextAnimate>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
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

      <CTASection
        eyebrow="Start with a real scope"
        title="Know the problem before you buy the solution."
        copy="The first conversation is free. You will leave knowing whether there is a process worth auditing and what the next step should be."
      />
    </>
  );
}
