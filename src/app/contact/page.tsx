import type { Metadata } from "next";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { AuditForm } from "../_components/AuditForm";
import { PageHero } from "../_components/PageHero";
import { ViewportReveal } from "../_components/ViewportReveal";
import { Highlighter } from "@/registry/magicui/highlighter";
import { createPageMetadata } from "../_data/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Book a Free Process & Automation Audit",
  description:
    "Book a free 20-minute process and automation call with NBT Labs to identify the operational bottleneck costing your business the most time.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Free process audit · 20 minutes"
        variant="inquiry"
        title={
          <>
            Let’s find out what’s costing you the{" "}
            <Highlighter
              action="highlight"
              animationDuration={980}
              drawDelay={620}
              color="#ff9a3e"
              isView
              className="hero-word-highlight"
            >
              most time.
            </Highlighter>
          </>
        }
        description="Book a free 20-minute call. We’ll ask a few questions about how your business runs today. There is no pitch and no obligation. If it is a fit, we’ll scope a process audit next."
        primary={{ href: "#audit-form", label: "Start the short form" }}
        compact
      />

      <section className="contact-section section-pad">
        <div className="contact-aside">
          <TextAnimate
            as="p"
            animation="slideLeft"
            by="character"
            className="eyebrow"
            once
          >
            What to expect
          </TextAnimate>
          <ol>
            <ViewportReveal as="li">
              <TextAnimate as="span" animation="wavy" by="character" once>01</TextAnimate>
              <p>A focused conversation about one operational bottleneck.</p>
            </ViewportReveal>
            <ViewportReveal as="li" delay={0.08}>
              <TextAnimate as="span" animation="wavy" by="character" once>02</TextAnimate>
              <p>A candid view on fit, no-fit, and the best next step.</p>
            </ViewportReveal>
            <ViewportReveal as="li" delay={0.16}>
              <TextAnimate as="span" animation="wavy" by="character" once>03</TextAnimate>
              <p>If there is a fit, we scope a Process & Automation Audit as the next step.</p>
            </ViewportReveal>
          </ol>
          <ViewportReveal className="founding-note" variant="scale">
            <span>Founding Partner</span>
            <strong>First 2–3 clients only</strong>
            <p>
              Spots are limited. Founding clients receive a free Process &
              Automation Audit and 25–30% off any implementation or automation
              package. In exchange, we ask for an approved case study and
              testimonial once you are live.
            </p>
          </ViewportReveal>
          <ViewportReveal className="direct-email" delay={0.08}>
            <span>Prefer email?</span>
            <a href="mailto:info@nbtlabs.ca">info@nbtlabs.ca</a>
            <small>Montréal · French & English</small>
          </ViewportReveal>
        </div>
        <ViewportReveal className="contact-form-reveal" variant="scale">
          <AuditForm />
        </ViewportReveal>
      </section>
    </>
  );
}
