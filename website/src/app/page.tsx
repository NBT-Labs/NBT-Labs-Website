import type { Metadata } from "next";
import { Highlighter } from "@/registry/magicui/highlighter";
import { ShimmerButton } from "@/registry/magicui/shimmer-button";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { CTASection } from "./_components/CTASection";
import { PillarMark } from "./_components/PillarMark";
import { ScrollScrubGroup } from "./_components/ScrollScrubGroup";
import StickyStory from "./_components/StickyStory";
import { TransformationCore } from "./_components/TransformationCore";
import {
  createPageMetadata,
  organizationSchema,
} from "./_data/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Odoo Consulting & Process Automation in Montreal",
  description:
    "NBT Labs helps Quebec and Canadian SMBs improve operations, implement Odoo, automate workflows, and apply practical agentic AI to live business data.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-ambient" aria-hidden="true" />
        <div className="home-hero-copy">
          <p className="eyebrow">Process-led digital transformation · Montréal</p>
          <h1>
            Process-first digital transformation that <em>pays for itself.AAAA</em>
          </h1>
          <p className="hero-lede">
            We improve your process first, then implement Odoo and agentic AI
            to run it, not the other way around.
          </p>
          <div className="button-row">
            <ShimmerButton
              className="shimmer-button-accent"
              href="/contact"
              background="#b9f45d"
              shimmerColor="#ff4fa3"
            >
              Book a Free Process Audit <span aria-hidden="true">↗</span>
            </ShimmerButton>
            <a className="text-link" href="/how-we-work">
              See how we work <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-trust" aria-label="Service details">
            <span>French & English</span>
            <span>Fixed-scope delivery</span>
            <span>Quebec & Canadian SMBs</span>
          </div>
        </div>
        <TransformationCore className="hero-core-background" />
      </section>

      <StickyStory />

      <section className="manifesto-section section-pad">
        <TextAnimate
          as="p"
          animation="slideLeft"
          by="character"
          scrub
          className="section-index"
        >
          01 / THE OPPORTUNITY
        </TextAnimate>
        <div className="manifesto-grid">
          <TextAnimate as="h2" animation="slideUp" by="word" scrub>
            Software doesn’t fix a broken process. <em>It <Highlighter action="highlight" color="#b9f45d" animationDuration={4250} padding={4} isView>scales</Highlighter> it.</em>
          </TextAnimate>
          <div className="body-copy">
            <TextAnimate as="p" animation="fadeIn" by="character" scrub>
              {`Most “digital transformation” projects start with software and hope the process improvement follows. It rarely does. NBT Labs starts with your process: we map how work actually happens and fix what’s broken. Then we implement Odoo, the most extensible ERP on the market, as your system of record.`}
            </TextAnimate>
            <TextAnimate as="p" animation="fadeIn" by="line" scrub>
              {`From there, we layer on custom automation and agentic AI that acts directly on your live business data. No fragile integrations. No disconnected chatbot. One system, properly transformed, that gets smarter over time.`}
            </TextAnimate>
          </div>
        </div>
      </section>

      <section className="pillars-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Three connected layers</p>
            <TextAnimate as="h2" animation="slideUp" by="word" scrub>
              One operating system. More{" "}
              <Highlighter action="underline" color="#3f6e2f" strokeWidth={3} animationDuration={3600} padding={3} isView>
                leverage
              </Highlighter>{" "}
              at every layer.
            </TextAnimate>
          </div>
          <TextAnimate as="p" animation="fadeIn" by="line" scrub>
            {`Foundation first. Automation second. AI when the process, data, and controls are ready.`}
          </TextAnimate>
        </div>
        <ScrollScrubGroup className="pillar-grid" variant="cards" spotlight>
          <article className="pillar-card pillar-dark">
            <span className="pillar-number">01</span>
            <PillarMark kind="foundation" />
            <h3>Odoo Foundation</h3>
            <p>
              Your operations, properly implemented. Sales, inventory,
              accounting, and everything else, configured around how you
              actually work.
            </p>
            <a href="/services#odoo">Explore Odoo delivery →</a>
          </article>
          <article className="pillar-card">
            <span className="pillar-number">02</span>
            <PillarMark kind="automation" />
            <h3>Automation & Integrations</h3>
            <p>
              Audits, workflow automation, and integrations for e-commerce,
              accounting, payments, and other business tools that remove
              manual work.
            </p>
            <a href="/services#automation">See automation sprints →</a>
          </article>
          <article className="pillar-card pillar-accent">
            <span className="pillar-number">03</span>
            <PillarMark kind="ai" />
            <h3>Agentic AI</h3>
            <p>
              Custom AI agents, RAG assistants, and fine-tuned models that act
              on your Odoo data, not a generic chatbot bolted on the side.
            </p>
            <a href="/services#ai">See AI operations pilots →</a>
          </article>
        </ScrollScrubGroup>
      </section>

      <section className="why-now-section section-pad">
        <div className="why-now-copy">
          <p className="eyebrow eyebrow-light">Why now</p>
          <TextAnimate as="h2" animation="scaleUp" by="text" scrub>Build on the platform that is already moving toward AI.</TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" scrub>
            {`Odoo’s own platform is standardizing on AI infrastructure, including agents, natural-language search, and, from late 2026, a native connector standard (MCP) that lets AI assistants act directly on your data. We build on that foundation instead of fighting it, which means what we build for you keeps getting more capable as Odoo does.`}
          </TextAnimate>
          <a className="text-link text-link-light" href="/why-nbt">
            Why we built NBT Labs <span aria-hidden="true">→</span>
          </a>
        </div>
        <ScrollScrubGroup
          className="system-stack"
          variant="stack"
          aria-label="The NBT Labs system stack"
        >
          <div><span>03</span><strong>Agents that act</strong><small>Governed AI</small></div>
          <div><span>02</span><strong>Workflows that run</strong><small>Automation</small></div>
          <div><span>01</span><strong>Data you can trust</strong><small>Odoo core</small></div>
          <div><span>00</span><strong>Process that works</strong><small>The foundation</small></div>
        </ScrollScrubGroup>
      </section>

      <section className="fit-section section-pad">
        <div className="fit-intro">
          <p className="eyebrow">Who we help</p>
          <TextAnimate as="h2" animation="slideUp" by="word" scrub>Built for businesses with real operations.</TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" scrub>
            {`We help Quebec and Canadian SMBs with 10–150 employees and real operational processes such as inventory, quoting, scheduling, and invoicing. They are often stuck on spreadsheets, disconnected tools, or an ERP they’ve outgrown.`}
          </TextAnimate>
          <a className="text-link" href="/who-we-help">
            Check your fit <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="fit-signals">
          {["10–150 employees", "Operational complexity", "Manual handoffs", "An ERP you’ve outgrown"].map((signal, index) => (
            <div key={signal}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{signal}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="founding-band">
        <div>
          <TextAnimate as="p" animation="slideLeft" by="character" scrub className="eyebrow">Founding Partner Program · 2–3 openings</TextAnimate>
          <TextAnimate as="h2" animation="scaleUp" by="text" scrub>We’re proving it with our own numbers first.</TextAnimate>
        </div>
        <div>
          <TextAnimate as="p" animation="fadeIn" by="line" scrub>
            {`We’re a new studio, and we’re proving it with our own numbers before we ask you to trust ours. The first 2–3 clients get a free process audit and 25–30% off implementation in exchange for being a reference. If that’s you, let’s talk.`}
          </TextAnimate>
          <a className="button" href="/contact">
            Book a Free Process Audit <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <CTASection
        eyebrow="Start with your process"
        title="Let’s find out what’s costing you the most time."
        copy="Book a free 20-minute call. We’ll ask a few questions about how your business runs today. There is no pitch and no obligation."
        label="Book a Free Process Audit"
        animateText
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
