import type { Metadata } from "next";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { CTASection } from "../_components/CTASection";
import { PageHero } from "../_components/PageHero";
import { ViewportReveal } from "../_components/ViewportReveal";
import { team } from "../_data/site";
import { Highlighter } from "@/registry/magicui/highlighter";
import { createPageMetadata } from "../_data/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Process-First Odoo Consultants in Montreal",
  description:
    "Meet NBT Labs, a Montreal-based bilingual team that improves business processes before implementing Odoo, automation, and agentic AI.",
  path: "/why-nbt",
});

const differences = [
  [
    "01",
    "Process improvement first, technology second.",
    "Digital transformation, done in the right order. We fix the process, then build the system around it, not the other way around.",
  ],
  [
    "02",
    "Odoo-first, not AI-first.",
    "We implement the system of record properly, then build AI on top of it.",
  ],
  [
    "03",
    "Agentic AI, not a chatbot widget.",
    "Our agents take real actions on real data via Odoo's own automation and connector layer. They are not disconnected assistants that can only answer questions.",
  ],
  [
    "04",
    "Local and bilingual.",
    "Montreal-based, French and English, in your time zone, with real accountability for Quebec-specific compliance, including QST and QPP/QPIP.",
  ],
];

export default function WhyNbtPage() {
  return (
    <>
      <PageHero
        eyebrow="Why NBT Labs · Montreal"
        variant="manifesto"
        title={
          <>
            <span className="hero-line">We don’t sell software.</span>{" "}
            <span className="hero-line hero-line-offset">We sell{" "}
              <Highlighter
                action="underline"
                animationDuration={980}
                drawDelay={520}
                color="#ff9a3e"
                strokeWidth={8}
                isView
                className="hero-word-highlight"
              >
                process improvement.
              </Highlighter>
            </span>
          </>
        }
        description="NBT Labs is a digital transformation studio built around one idea: transformation is a process problem before it is a technology problem."
        secondary={{ href: "/how-we-work", label: "See our process" }}
      />

      <section className="origin-section section-pad">
        <p className="section-index">WHY WE STARTED</p>
        <div className="origin-grid">
          <TextAnimate as="h2" animation="slideUp" by="word" once>
            The gap was always underneath the software.
        </TextAnimate>
          <div className="body-copy">
            <TextAnimate as="p" animation="fadeIn" by="line" once>
              {"We started NBT Labs because we kept seeing the same gap: businesses buy an ERP or bolt on generic “AI” and call it transformation, without ever fixing the process underneath."}
            </TextAnimate>
            <TextAnimate as="p" animation="fadeIn" by="line" once>
              {"We do the process improvement work first, then implement Odoo and AI to run what we improved. That is what makes it a real transformation instead of a reskinned status quo."}
            </TextAnimate>
          </div>
        </div>
      </section>

      <section className="difference-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">How we are different</p>
            <TextAnimate as="h2" animation="scaleUp" by="text" once>
              The order changes the outcome.
            </TextAnimate>
          </div>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {"The best technology decision is often the one that becomes obvious after the process is understood."}
          </TextAnimate>
        </div>
        <div className="difference-grid">
          {differences.map(([number, title, copy], index) => (
            <ViewportReveal as="article" delay={index * 0.08} key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <section className="team-section section-pad">
        <div className="section-heading section-heading-tight">
          <div>
            <p className="eyebrow">Meet the team</p>
            <TextAnimate as="h2" animation="slideUp" by="word" once>
              Process, product, and engineering at one table.
            </TextAnimate>
          </div>
        </div>
        <div className="team-grid">
          {team.map((member, index) => (
            <ViewportReveal as="article" delay={index * 0.1} key={member.name}>
              <div className="team-portrait" aria-hidden="true">
                <span>{member.initials}</span>
                <i>{String(index + 1).padStart(2, "0")}</i>
              </div>
              <p className="team-role">{member.role}</p>
              <h3>{member.name}</h3>
              <p>{member.bio}</p>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <section className="promise-section section-pad">
        <div>
          <TextAnimate
            as="p"
            animation="slideLeft"
            by="character"
            className="eyebrow eyebrow-light"
            once
          >
            Our promise
          </TextAnimate>
          <TextAnimate as="h2" animation="scaleUp" by="text" once>
            We measure success the way you do.
          </TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {"We measure success in hours saved, errors removed, and revenue protected. If a project doesn’t move one of those numbers, we didn’t do our job."}
          </TextAnimate>
        </div>
        <div className="outcome-metrics">
          <ViewportReveal>
            <strong><TextAnimate as="span" animation="wavy" by="character" once>Hours</TextAnimate></strong>
            <span>saved</span>
          </ViewportReveal>
          <ViewportReveal delay={0.08}>
            <strong><TextAnimate as="span" animation="wavy" by="character" once>Errors</TextAnimate></strong>
            <span>removed</span>
          </ViewportReveal>
          <ViewportReveal delay={0.16}>
            <strong><TextAnimate as="span" animation="wavy" by="character" once>Revenue</TextAnimate></strong>
            <span>protected</span>
          </ViewportReveal>
        </div>
      </section>

      <CTASection
        eyebrow="Talk to the team"
        title="Bring us the messy version."
        copy="You do not need a polished brief. Tell us where the work gets stuck, and we will help turn that into a clear first question."
        label="Talk to us"
      />
    </>
  );
}
