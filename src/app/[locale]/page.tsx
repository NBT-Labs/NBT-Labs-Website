import type { Metadata } from "next";
import { Highlighter } from "@/registry/magicui/highlighter";
import { ShimmerButton } from "@/registry/magicui/shimmer-button";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { CTASection } from "../_components/CTASection";
import { PillarMark } from "../_components/PillarMark";
import { ScrollScrubGroup } from "../_components/ScrollScrubGroup";
import StickyStory from "../_components/StickyStory";
import { TransformationCore } from "../_components/TransformationCore";
import { createPageMetadata, organizationSchemaFor } from "../_data/seo";
import { isLocale, localePath } from "@/i18n/config";
import { notFound } from "next/navigation";

const COPY = {
  fr: {
    title: "Consultation Odoo et automatisation des processus à Montréal",
    description:
      "NBT Labs aide les PME du Québec et du Canada à améliorer leurs opérations, à implanter Odoo, à automatiser leurs processus et à appliquer une IA agentique concrète à leurs données d'affaires.",
    heroEyebrow: "Transformation numérique axée sur les processus · Montréal",
    heroTitleLead: "La transformation numérique qui commence par le processus et",
    heroTitleEm: "se paie d'elle-même.",
    heroLede:
      "On améliore d'abord votre processus, puis on implante Odoo et l'IA agentique pour le faire rouler. Pas l'inverse.",
    heroPrimary: "Audit gratuit",
    heroSecondary: "Voir notre approche",
    heroTrustLabel: "Détails du service",
    heroTrust: [
      "Français et anglais",
      "Livraison à portée fixe",
      "PME du Québec et du Canada",
    ],
    manifestoIndex: "01 / L'OCCASION",
    manifestoLead: "Un logiciel ne règle pas un processus brisé.",
    manifestoEmBefore: "Il le ",
    manifestoEmWord: "multiplie",
    manifestoEmAfter: ".",
    manifestoBody1:
      "La plupart des projets de « transformation numérique » commencent par le logiciel en espérant que l'amélioration des processus suivra. Ça arrive rarement. NBT Labs commence par votre processus : on cartographie la façon dont le travail se fait vraiment et on corrige ce qui accroche. Ensuite, on implante Odoo, l'ERP le plus extensible sur le marché, comme système de référence.",
    manifestoBody2:
      "À partir de là, on ajoute de l'automatisation sur mesure et de l'IA agentique qui agit directement sur vos données d'affaires en temps réel. Pas d'intégrations fragiles. Pas de robot conversationnel déconnecté. Un seul système, vraiment transformé, qui devient plus intelligent avec le temps.",
    pillarsEyebrow: "Trois couches connectées",
    pillarsHeadLead: "Un seul système d'exploitation. Plus de",
    pillarsHeadWord: "levier",
    pillarsHeadTail: "à chaque couche.",
    pillarsIntro:
      "La fondation d'abord. L'automatisation ensuite. L'IA quand le processus, les données et les contrôles sont prêts.",
    pillar1Title: "Fondation Odoo",
    pillar1Copy:
      "Vos opérations, implantées comme il faut. Ventes, stock, comptabilité et le reste, configurés selon votre façon de travailler.",
    pillar1Link: "Découvrir la livraison Odoo →",
    pillar2Title: "Automatisation et intégrations",
    pillar2Copy:
      "Audits, automatisation des processus et intégrations pour le commerce en ligne, la comptabilité, les paiements et les autres outils d'affaires, pour éliminer le travail manuel.",
    pillar2Link: "Voir les sprints d'automatisation →",
    pillar3Title: "IA agentique",
    pillar3Copy:
      "Des agents IA sur mesure, des assistants RAG et des modèles ajustés qui agissent sur vos données Odoo, pas un robot conversationnel générique greffé à côté.",
    pillar3Link: "Voir les projets pilotes d'IA →",
    whyNowEyebrow: "Pourquoi maintenant",
    whyNowHead: "Bâtissez sur la plateforme qui s'en va déjà vers l'IA.",
    whyNowBody:
      "La plateforme d'Odoo se standardise sur une infrastructure d'IA : agents, recherche en langage naturel et, à partir de la fin de 2026, un standard de connecteur natif (MCP) qui permet aux assistants IA d'agir directement sur vos données. On bâtit sur cette fondation au lieu de la combattre, ce qui veut dire que ce qu'on construit pour vous gagne en capacité en même temps qu'Odoo.",
    whyNowLink: "Pourquoi on a créé NBT Labs",
    stackLabel: "La pile système de NBT Labs",
    stack: [
      ["03", "Des agents qui agissent", "IA encadrée"],
      ["02", "Des processus qui roulent", "Automatisation"],
      ["01", "Des données fiables", "Noyau Odoo"],
      ["00", "Un processus qui fonctionne", "La fondation"],
    ],
    fitEyebrow: "Qui nous aidons",
    fitHead: "Conçu pour les entreprises qui ont de vraies opérations.",
    fitBody:
      "On aide les PME du Québec et du Canada de 10 à 150 employés qui ont de vrais processus d'opération : stock, soumissions, planification, facturation. Elles sont souvent prises avec des chiffriers, des outils déconnectés ou un ERP qu'elles ont dépassé.",
    fitLink: "Vérifiez si ça vous ressemble",
    fitSignals: [
      "10 à 150 employés",
      "Complexité opérationnelle",
      "Transferts manuels",
      "Un ERP que vous avez dépassé",
    ],
    foundingEyebrow: "Programme de partenaires fondateurs · 2 ou 3 places",
    foundingHead: "On le prouve d'abord avec nos propres chiffres.",
    foundingBody:
      "On est un nouveau studio. On fait la preuve sur nos propres opérations avant de vous demander de nous confier les vôtres. Les 2 ou 3 premiers clients obtiennent un audit gratuit et de 25 à 30 % de rabais sur l'implantation, en échange d'une référence. Si ça vous parle, parlons-nous.",
    foundingCta: "Audit gratuit",
    ctaEyebrow: "Commencez par votre processus",
    ctaTitle: "Trouvons ce qui vous coûte le plus de temps.",
    ctaCopy:
      "Réservez un appel gratuit de 20 minutes. On vous posera quelques questions sur la façon dont votre entreprise fonctionne aujourd'hui. Aucune présentation de vente, aucune obligation.",
    ctaLabel: "Audit gratuit",
  },
  en: {
    title: "Odoo Consulting & Process Automation in Montreal",
    description:
      "NBT Labs helps Quebec and Canadian SMBs improve operations, implement Odoo, automate workflows, and apply practical agentic AI to live business data.",
    heroEyebrow: "Process-led digital transformation · Montréal",
    heroTitleLead: "Process-first digital transformation that",
    heroTitleEm: "pays for itself.",
    heroLede:
      "We improve your process first, then implement Odoo and agentic AI to run it, not the other way around.",
    heroPrimary: "Free audit",
    heroSecondary: "See how we work",
    heroTrustLabel: "Service details",
    heroTrust: [
      "French & English",
      "Fixed-scope delivery",
      "Quebec & Canadian SMBs",
    ],
    manifestoIndex: "01 / THE OPPORTUNITY",
    manifestoLead: "Software doesn’t fix a broken process.",
    manifestoEmBefore: "It ",
    manifestoEmWord: "scales",
    manifestoEmAfter: " it.",
    manifestoBody1:
      "Most “digital transformation” projects start with software and hope the process improvement follows. It rarely does. NBT Labs starts with your process: we map how work actually happens and fix what’s broken. Then we implement Odoo, the most extensible ERP on the market, as your system of record.",
    manifestoBody2:
      "From there, we layer on custom automation and agentic AI that acts directly on your live business data. No fragile integrations. No disconnected chatbot. One system, properly transformed, that gets smarter over time.",
    pillarsEyebrow: "Three connected layers",
    pillarsHeadLead: "One operating system. More",
    pillarsHeadWord: "leverage",
    pillarsHeadTail: "at every layer.",
    pillarsIntro:
      "Foundation first. Automation second. AI when the process, data, and controls are ready.",
    pillar1Title: "Odoo Foundation",
    pillar1Copy:
      "Your operations, properly implemented. Sales, inventory, accounting, and everything else, configured around how you actually work.",
    pillar1Link: "Explore Odoo delivery →",
    pillar2Title: "Automation & Integrations",
    pillar2Copy:
      "Audits, workflow automation, and integrations for e-commerce, accounting, payments, and other business tools that remove manual work.",
    pillar2Link: "See automation sprints →",
    pillar3Title: "Agentic AI",
    pillar3Copy:
      "Custom AI agents, RAG assistants, and fine-tuned models that act on your Odoo data, not a generic chatbot bolted on the side.",
    pillar3Link: "See AI operations pilots →",
    whyNowEyebrow: "Why now",
    whyNowHead: "Build on the platform that is already moving toward AI.",
    whyNowBody:
      "Odoo’s own platform is standardizing on AI infrastructure, including agents, natural-language search, and, from late 2026, a native connector standard (MCP) that lets AI assistants act directly on your data. We build on that foundation instead of fighting it, which means what we build for you keeps getting more capable as Odoo does.",
    whyNowLink: "Why we built NBT Labs",
    stackLabel: "The NBT Labs system stack",
    stack: [
      ["03", "Agents that act", "Governed AI"],
      ["02", "Workflows that run", "Automation"],
      ["01", "Data you can trust", "Odoo core"],
      ["00", "Process that works", "The foundation"],
    ],
    fitEyebrow: "Who we help",
    fitHead: "Built for businesses with real operations.",
    fitBody:
      "We help Quebec and Canadian SMBs with 10–150 employees and real operational processes such as inventory, quoting, scheduling, and invoicing. They are often stuck on spreadsheets, disconnected tools, or an ERP they’ve outgrown.",
    fitLink: "Check your fit",
    fitSignals: [
      "10–150 employees",
      "Operational complexity",
      "Manual handoffs",
      "An ERP you’ve outgrown",
    ],
    foundingEyebrow: "Founding Partner Program · 2–3 openings",
    foundingHead: "We’re proving it with our own numbers first.",
    foundingBody:
      "We’re a new studio, and we’re proving it with our own numbers before we ask you to trust ours. The first 2–3 clients get a free audit and 25–30% off implementation in exchange for being a reference. If that’s you, let’s talk.",
    foundingCta: "Free audit",
    ctaEyebrow: "Start with your process",
    ctaTitle: "Let’s find out what’s costing you the most time.",
    ctaCopy:
      "Book a free 20-minute call. We’ll ask a few questions about how your business runs today. There is no pitch and no obligation.",
    ctaLabel: "Free audit",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : "fr";
  const { title, description } = COPY[active];
  return createPageMetadata({ title, description, path: "/", locale: active });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = COPY[locale];

  return (
    <>
      <section className="home-hero">
        <div className="hero-ambient" aria-hidden="true" />
        <div className="home-hero-copy">
          <p className="eyebrow">{copy.heroEyebrow}</p>
          <h1>
            {copy.heroTitleLead} <em>{copy.heroTitleEm}</em>
          </h1>
          <p className="hero-lede">{copy.heroLede}</p>
          <div className="button-row">
            <ShimmerButton
              className="shimmer-button-accent"
              href={localePath(locale, "/contact")}
              background="#b9f45d"
              shimmerColor="#ff4fa3"
            >
              {copy.heroPrimary} <span aria-hidden="true">↗</span>
            </ShimmerButton>
            <a className="text-link" href={localePath(locale, "/how-we-work")}>
              {copy.heroSecondary} <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-trust" aria-label={copy.heroTrustLabel}>
            {copy.heroTrust.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <TransformationCore locale={locale} className="hero-core-background" />
      </section>

      <StickyStory locale={locale} />

      <section className="manifesto-section section-pad">
        <TextAnimate
          as="p"
          animation="slideLeft"
          by="character"
          scrub
          className="section-index"
        >
          {copy.manifestoIndex}
        </TextAnimate>
        <div className="manifesto-grid">
          <TextAnimate as="h2" animation="slideUp" by="word" scrub>
            {copy.manifestoLead} <em>{copy.manifestoEmBefore}<Highlighter action="highlight" color="#b9f45d" animationDuration={4250} padding={4} isView>{copy.manifestoEmWord}</Highlighter>{copy.manifestoEmAfter}</em>
          </TextAnimate>
          <div className="body-copy">
            <TextAnimate as="p" animation="fadeIn" by="character" scrub>
              {copy.manifestoBody1}
            </TextAnimate>
            <TextAnimate as="p" animation="fadeIn" by="line" scrub>
              {copy.manifestoBody2}
            </TextAnimate>
          </div>
        </div>
      </section>

      <section className="pillars-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.pillarsEyebrow}</p>
            <TextAnimate as="h2" animation="slideUp" by="word" scrub>
              {copy.pillarsHeadLead}{" "}
              <Highlighter action="underline" color="#3f6e2f" strokeWidth={3} animationDuration={3600} padding={3} isView>
                {copy.pillarsHeadWord}
              </Highlighter>{" "}
              {copy.pillarsHeadTail}
            </TextAnimate>
          </div>
          <TextAnimate as="p" animation="fadeIn" by="line" scrub>
            {copy.pillarsIntro}
          </TextAnimate>
        </div>
        <ScrollScrubGroup className="pillar-grid" variant="cards" spotlight>
          <article className="pillar-card pillar-dark">
            <span className="pillar-number">01</span>
            <PillarMark kind="foundation" />
            <h3>{copy.pillar1Title}</h3>
            <p>{copy.pillar1Copy}</p>
            <a href={localePath(locale, "/services#odoo")}>{copy.pillar1Link}</a>
          </article>
          <article className="pillar-card">
            <span className="pillar-number">02</span>
            <PillarMark kind="automation" />
            <h3>{copy.pillar2Title}</h3>
            <p>{copy.pillar2Copy}</p>
            <a href={localePath(locale, "/services#automation")}>{copy.pillar2Link}</a>
          </article>
          <article className="pillar-card pillar-accent">
            <span className="pillar-number">03</span>
            <PillarMark kind="ai" />
            <h3>{copy.pillar3Title}</h3>
            <p>{copy.pillar3Copy}</p>
            <a href={localePath(locale, "/services#ai")}>{copy.pillar3Link}</a>
          </article>
        </ScrollScrubGroup>
      </section>

      <section className="why-now-section section-pad">
        <div className="why-now-copy">
          <p className="eyebrow eyebrow-light">{copy.whyNowEyebrow}</p>
          <TextAnimate as="h2" animation="scaleUp" by="text" scrub>{copy.whyNowHead}</TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" scrub>
            {copy.whyNowBody}
          </TextAnimate>
          <a className="text-link text-link-light" href={localePath(locale, "/why-nbt")}>
            {copy.whyNowLink} <span aria-hidden="true">→</span>
          </a>
        </div>
        <ScrollScrubGroup
          className="system-stack"
          variant="stack"
          aria-label={copy.stackLabel}
        >
          {copy.stack.map(([number, title, detail]) => (
            <div key={number}><span>{number}</span><strong>{title}</strong><small>{detail}</small></div>
          ))}
        </ScrollScrubGroup>
      </section>

      <section className="fit-section section-pad">
        <div className="fit-intro">
          <p className="eyebrow">{copy.fitEyebrow}</p>
          <TextAnimate as="h2" animation="slideUp" by="word" scrub>{copy.fitHead}</TextAnimate>
          <TextAnimate as="p" animation="fadeIn" by="line" scrub>
            {copy.fitBody}
          </TextAnimate>
          <a className="text-link" href={localePath(locale, "/who-we-help")}>
            {copy.fitLink} <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="fit-signals">
          {copy.fitSignals.map((signal, index) => (
            <div key={signal}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{signal}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="founding-band">
        <div>
          <TextAnimate as="p" animation="slideLeft" by="character" scrub className="eyebrow">{copy.foundingEyebrow}</TextAnimate>
          <TextAnimate as="h2" animation="scaleUp" by="text" scrub>{copy.foundingHead}</TextAnimate>
        </div>
        <div>
          <TextAnimate as="p" animation="fadeIn" by="line" scrub>
            {copy.foundingBody}
          </TextAnimate>
          <a className="button" href={localePath(locale, "/contact")}>
            {copy.foundingCta} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <CTASection locale={locale}
        eyebrow={copy.ctaEyebrow}
        title={copy.ctaTitle}
        copy={copy.ctaCopy}
        label={copy.ctaLabel}
        animateText
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchemaFor(locale)).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
