import type { ReactNode } from "react";
import { ShimmerButton } from "@/registry/magicui/shimmer-button";
import {
  TextAnimate,
  type TextAnimateAnimation,
  type TextAnimateBy,
} from "@/registry/magicui/text-animate";
import { ViewportReveal } from "./ViewportReveal";

type PageHeroVariant =
  | "default"
  | "editorial"
  | "poster"
  | "manifesto"
  | "blueprint"
  | "audience"
  | "inquiry"
  | "proof";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  compact?: boolean;
  variant?: PageHeroVariant;
};

const heroMotion: Record<
  PageHeroVariant,
  { animation: TextAnimateAnimation; by: TextAnimateBy; duration: number }
> = {
  default: { animation: "slideUp", by: "word", duration: 0.9 },
  editorial: { animation: "slideUp", by: "word", duration: 1.05 },
  poster: { animation: "scaleUp", by: "text", duration: 0.9 },
  manifesto: { animation: "slideLeft", by: "word", duration: 1.05 },
  blueprint: { animation: "blurInUp", by: "word", duration: 1.05 },
  audience: { animation: "wavy", by: "word", duration: 0.8 },
  inquiry: { animation: "slideLeft", by: "character", duration: 1.2 },
  proof: { animation: "scaleUp", by: "text", duration: 0.95 },
};

export function PageHero({
  eyebrow,
  title,
  description,
  primary = { href: "/contact", label: "Book a Free Audit" },
  secondary,
  compact = false,
  variant = "default",
}: PageHeroProps) {
  const titleMotion = heroMotion[variant];

  return (
    <section
      className={`page-hero page-hero-${variant}${compact ? " page-hero-compact" : ""}`}
    >
      <div className="page-hero-grid" />
      <div className="page-hero-copy">
        <TextAnimate
          as="p"
          animation="slideLeft"
          by="character"
          className="eyebrow"
          duration={0.65}
          once
        >
          {eyebrow}
        </TextAnimate>
        <TextAnimate
          as="h1"
          animation={titleMotion.animation}
          by={titleMotion.by}
          duration={titleMotion.duration}
          once
        >
          {title}
        </TextAnimate>
        <TextAnimate
          as="p"
          animation="fadeIn"
          by="line"
          className="page-hero-description"
          delay={0.08}
          duration={0.8}
          once
        >
          {description}
        </TextAnimate>
        <ViewportReveal className="button-row" delay={0.14}>
          <ShimmerButton href={primary.href}>
            {primary.label} <span aria-hidden="true">↗</span>
          </ShimmerButton>
          {secondary ? (
            <a className="text-link" href={secondary.href}>
              {secondary.label} <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </ViewportReveal>
      </div>
      <div className="page-hero-index" aria-hidden="true">
        <span>NBT</span>
        <span>PROCESS / SYSTEM / LEVERAGE</span>
      </div>
    </section>
  );
}
