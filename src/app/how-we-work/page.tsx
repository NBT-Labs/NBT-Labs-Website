import type { Metadata } from "next";
import { CTASection } from "../_components/CTASection";
import { PageHero } from "../_components/PageHero";
import { processSteps } from "../_data/site";
import { ViewportReveal } from "../_components/ViewportReveal";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { Highlighter } from "@/registry/magicui/highlighter";
import { createPageMetadata } from "../_data/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Our Odoo Implementation Process",
  description:
    "See NBT Labs' five-step process: discovery, process audit, fixed-price Odoo implementation, go-live support, and continuous improvement.",
  path: "/how-we-work",
});

export default function HowWeWorkPage() {
  return (
    <>
      <PageHero
        eyebrow="How we work · Five clear steps"
        variant="blueprint"
        title={
          <>
            <span className="hero-line">A clear process,</span>{" "}
            <span className="hero-line">from first call to{" "}
              <Highlighter
                action="underline"
                animationDuration={900}
                drawDelay={430}
                color="#6f9f38"
                strokeWidth={7}
                isView
                className="hero-word-highlight"
              >
                live system.
              </Highlighter>
            </span>
          </>
        }
        description="You know what comes next, what it costs, and what each step is meant to produce. No vague discovery phase. No black-box handoff."
        secondary={{ href: "/pricing", label: "See typical pricing" }}
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
            From first call to live system
          </TextAnimate>
          <TextAnimate as="h2" animation="slideUp" by="word" once>
            Each step earns the next one.
          </TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {"The audit has value on its own. The implementation has a clear finish line. Improvement continues only when there is another result worth pursuing."}
          </TextAnimate>
        </div>
        <div className="timeline-steps">
          {processSteps.map((step, index) => (
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
                  <span>Output</span>
                  <strong>{step.output}</strong>
                </div>
              </div>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <section className="working-principles section-pad">
        <div>
          <p className="eyebrow eyebrow-light">What working together feels like</p>
          <TextAnimate as="h2" animation="scaleUp" by="text" once>
            Your team understands what was built, why it works, and how to use it.
          </TextAnimate>
        </div>
        <div className="principle-grid">
          {[
            ["Visible", "A shared plan, clear decisions, and a plain-language view of progress."],
            ["Measured", "A before-and-after baseline tied to the operational result."],
            ["Owned", "Documentation and training that leave your team in control."],
            ["Incremental", "A working core first, then additional leverage in sensible steps."],
          ].map(([title, copy], index) => (
            <ViewportReveal as="article" delay={index * 0.08} key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Step one · 20 minutes"
        title="Let’s find the costliest bottleneck."
        copy="No deck. No obligation. Just a focused conversation about your current process, tools, and what is costing you time."
        label="Book a Free Process Audit"
      />
    </>
  );
}
