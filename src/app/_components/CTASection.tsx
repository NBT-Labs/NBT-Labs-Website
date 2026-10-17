import { ShimmerButton } from "@/registry/magicui/shimmer-button";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { localePath } from "@/i18n/config";
import type { Locale } from "@/lib/audit/types";

type CTASectionProps = {
  locale: Locale;
  eyebrow?: string;
  title?: string;
  copy?: string;
  label?: string;
  animateText?: boolean;
};

const DEFAULTS = {
  fr: {
    eyebrow: "Commencez par y voir clair",
    title: "Trouvons le goulot d'étranglement qui vaut la peine d'être réglé en premier.",
    copy: "Un audit gratuit de 20 minutes suffit pour cerner la prochaine étape la plus utile, qu'on la fasse avec vous ou non.",
    label: "Audit gratuit",
  },
  en: {
    eyebrow: "Start with clarity",
    title: "Find the bottleneck worth fixing first.",
    copy: "A free 20-minute audit is enough to identify the most useful next step, whether or not that step is with us.",
    label: "Free audit",
  },
} as const;

export function CTASection({
  locale,
  eyebrow,
  title,
  copy,
  label,
  animateText = true,
}: CTASectionProps) {
  const fallback = DEFAULTS[locale];
  const resolvedEyebrow = eyebrow ?? fallback.eyebrow;
  const resolvedTitle = title ?? fallback.title;
  const resolvedCopy = copy ?? fallback.copy;
  const resolvedLabel = label ?? fallback.label;

  return (
    <section className="cta-section">
      <div className="cta-orbit" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="cta-content">
        <p className="eyebrow eyebrow-light">{resolvedEyebrow}</p>
        {animateText ? (
          <TextAnimate as="h2" animation="scaleUp" by="text" once>
            {resolvedTitle}
          </TextAnimate>
        ) : (
          <h2>{resolvedTitle}</h2>
        )}
        {animateText ? (
          <TextAnimate
            as="p"
            animation="fadeIn"
            by="line"
            once
          >
            {resolvedCopy}
          </TextAnimate>
        ) : (
          <p>{resolvedCopy}</p>
        )}
        <ShimmerButton
          className="shimmer-button-accent"
          href={localePath(locale, "/contact")}
          background="#b9f45d"
        >
          {resolvedLabel} <span aria-hidden="true">↗</span>
        </ShimmerButton>
      </div>
    </section>
  );
}
