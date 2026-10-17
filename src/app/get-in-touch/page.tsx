import type { Metadata } from "next";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { Highlighter } from "@/registry/magicui/highlighter";
import { ContactForm } from "../_components/ContactForm";
import { PageHero } from "../_components/PageHero";
import { ViewportReveal } from "../_components/ViewportReveal";
import { createPageMetadata } from "../_data/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact NBT Labs",
  description:
    "Questions, partnerships, or careers: send NBT Labs a message and we will reply within one business day, in French or English.",
  path: "/get-in-touch",
});

export default function GetInTouchPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact · Montréal"
        variant="inquiry"
        title={
          <>
            Questions, ideas, or{" "}
            <Highlighter
              action="highlight"
              animationDuration={980}
              drawDelay={620}
              color="#b9f45d"
              isView
              className="hero-word-highlight"
            >
              just saying hi.
            </Highlighter>
          </>
        }
        description="Not ready for an audit yet? Send us a note about anything: a question, a partnership idea, or a role you'd like to discuss. A real person reads every message."
        primary={{ href: "#contact-form", label: "Write to us" }}
        secondary={{ href: "/contact", label: "Book a free audit instead" }}
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
            How we reply
          </TextAnimate>
          <ol>
            <ViewportReveal as="li">
              <TextAnimate as="span" animation="wavy" by="character" once>01</TextAnimate>
              <p>Your message goes straight to the founders, not a ticket queue.</p>
            </ViewportReveal>
            <ViewportReveal as="li" delay={0.08}>
              <TextAnimate as="span" animation="wavy" by="character" once>02</TextAnimate>
              <p>We reply within one business day, in French or English.</p>
            </ViewportReveal>
            <ViewportReveal as="li" delay={0.16}>
              <TextAnimate as="span" animation="wavy" by="character" once>03</TextAnimate>
              <p>If it turns into a project, we&apos;ll suggest a free process audit as the next step.</p>
            </ViewportReveal>
          </ol>
          <ViewportReveal className="direct-email" delay={0.08}>
            <span>Prefer email?</span>
            <a href="mailto:info@nbtlabs.ca">info@nbtlabs.ca</a>
            <small>Montréal · French & English</small>
          </ViewportReveal>
        </div>
        <ViewportReveal className="contact-form-reveal" variant="scale">
          <ContactForm />
        </ViewportReveal>
      </section>
    </>
  );
}
