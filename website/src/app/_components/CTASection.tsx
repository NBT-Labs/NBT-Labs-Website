import { ShimmerButton } from "@/registry/magicui/shimmer-button";
import { TextAnimate } from "@/registry/magicui/text-animate";

type CTASectionProps = {
  eyebrow?: string;
  title?: string;
  copy?: string;
  label?: string;
  animateText?: boolean;
};

export function CTASection({
  eyebrow = "Start with clarity",
  title = "Find the bottleneck worth fixing first.",
  copy = "A free 20-minute process audit is enough to identify the most useful next step, whether or not that step is with us.",
  label = "Book a Free Process Audit",
  animateText = true,
}: CTASectionProps) {
  return (
    <section className="cta-section">
      <div className="cta-orbit" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="cta-content">
        <p className="eyebrow eyebrow-light">{eyebrow}</p>
        {animateText ? (
          <TextAnimate as="h2" animation="scaleUp" by="text" once>
            {title}
          </TextAnimate>
        ) : (
          <h2>{title}</h2>
        )}
        {animateText ? (
          <TextAnimate
            as="p"
            animation="fadeIn"
            by="line"
            once
          >
            {copy}
          </TextAnimate>
        ) : (
          <p>{copy}</p>
        )}
        <ShimmerButton
          className="shimmer-button-accent"
          href="/contact"
          background="#b9f45d"
        >
          {label} <span aria-hidden="true">↗</span>
        </ShimmerButton>
      </div>
    </section>
  );
}
