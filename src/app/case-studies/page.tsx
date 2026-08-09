import type { Metadata } from "next";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { CTASection } from "../_components/CTASection";
import { PageHero } from "../_components/PageHero";
import { ViewportReveal } from "../_components/ViewportReveal";
import { Highlighter } from "@/registry/magicui/highlighter";
import { createPageMetadata } from "../_data/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Upcoming Odoo & Automation Case Studies",
  description:
    "Follow NBT Labs case studies as founding clients go live, with results measured in hours saved, errors removed, and revenue protected.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Results · Case studies"
        variant="proof"
        title={
          <>
            <span className="hero-line hero-line-display">
              <Highlighter
                action="highlight"
                animationDuration={840}
                drawDelay={120}
                color="#b9f45d"
                isView
                className="hero-word-highlight"
              >
                Proof,
              </Highlighter>
            </span>{" "}
            <span className="hero-line hero-line-caption">as we build it.</span>
          </>
        }
        description="We’re a new studio. Our case studies are being written right now, not pulled from a back catalog. When a founding client goes live, their measured result gets published here with their permission."
        secondary={{ href: "/why-nbt", label: "Meet the team" }}
      />

      <section className="proof-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">What proof will look like</p>
            <TextAnimate as="h2" animation="slideUp" by="word" once>
              Specific enough to be useful.
            </TextAnimate>
          </div>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {"Every published story will show the starting point, what changed, time to launch, and the result that could actually be measured."}
          </TextAnimate>
        </div>
        <div className="proof-grid">
          <ViewportReveal as="article">
            <span>01</span>
            <h3>The baseline</h3>
            <p>How the process worked before, where it broke, and what that cost.</p>
          </ViewportReveal>
          <ViewportReveal as="article" delay={0.09}>
            <span>02</span>
            <h3>The intervention</h3>
            <p>What we changed in the process, Odoo, automation, or AI, and the reasoning behind it.</p>
          </ViewportReveal>
          <ViewportReveal as="article" delay={0.18}>
            <span>03</span>
            <h3>The measured result</h3>
            <p>Hours saved, errors removed, revenue protected, and the client’s perspective.</p>
          </ViewportReveal>
        </div>
      </section>

      <section className="result-metrics section-pad">
        <TextAnimate
          as="p"
          animation="slideLeft"
          by="character"
          className="eyebrow eyebrow-light"
          once
        >
          The numbers we care about
        </TextAnimate>
        <div className="result-metric-grid">
          <ViewportReveal>
            <strong><TextAnimate as="span" animation="wavy" by="character" once>Hours</TextAnimate></strong>
            <span>saved from repetitive work</span>
          </ViewportReveal>
          <ViewportReveal delay={0.09}>
            <strong><TextAnimate as="span" animation="wavy" by="character" once>Errors</TextAnimate></strong>
            <span>removed from the process</span>
          </ViewportReveal>
          <ViewportReveal delay={0.18}>
            <strong><TextAnimate as="span" animation="wavy" by="character" once>Revenue</TextAnimate></strong>
            <span>protected or unlocked</span>
          </ViewportReveal>
        </div>
      </section>

      <section className="openings-section section-pad">
        <div className="openings-intro">
          <p className="eyebrow">Founding Partner openings</p>
          <TextAnimate as="h2" animation="scaleUp" by="text" once>
            The first case studies are open.
          </TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" once>
            {"The first 2–3 Founding Partners receive a Process & Automation Audit at no charge and 25–30% off any implementation or automation package. In exchange, we ask for an approved case study and testimonial once the work is live."}
          </TextAnimate>
          <a className="button" href="/contact">
            Become a Founding Partner <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="opening-cards">
          {[1, 2, 3].map((number, index) => (
            <ViewportReveal as="article" delay={index * 0.1} key={number}>
              <span>0{number}</span>
              <div className="opening-pulse" aria-hidden="true"><i /></div>
              <strong>Case study 0{number}</strong>
              <small>Coming soon</small>
            </ViewportReveal>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Your result could be first"
        title="Build the result before the case study."
        copy="We will agree on the number worth moving at the start. The story only gets written after the work has earned it."
        label="Book a Free Process Audit"
      />
    </>
  );
}
