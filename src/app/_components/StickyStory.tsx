"use client";

import { TextAnimate } from "@/registry/magicui/text-animate";
import { AnimatedGridPattern } from "@/registry/magicui/animated-grid-pattern";
import { Ripple } from "@/registry/magicui/ripple";
import { PulsatingButton } from "@/registry/magicui/pulsating-button";
import { useEffect, useId, useRef, useState } from "react";

const steps = [
  {
    eyebrow: "01 / Free · 20 min",
    title: "Discovery call",
    description:
      "We ask about your current process, tools, and what’s actually costing you time. There is no pitch. We simply figure out if we’re a fit.",
    outcome: "A clear fit and the right next step",
  },
  {
    eyebrow: "02 / Audit",
    title: "Process & automation audit",
    description:
      "We map your current process, quantify the manual work, and hand you a prioritized roadmap, whether or not you hire us for the next step. The audit is free for founding clients.",
    outcome: "Your process map and prioritized roadmap",
  },
  {
    eyebrow: "03 / Fixed scope",
    title: "Implementation",
    description:
      "Fixed-price, fixed-timeline build: Odoo configured around your process, plus any automation or integrations from the audit. You know the cost and the date before we start.",
    outcome: "A tested system with a fixed cost and date",
  },
  {
    eyebrow: "04 / Launch",
    title: "Go live",
    description:
      "Training and go-live support are included. We launch the improved process, support your team through the transition, and make sure the system works in the real world.",
    outcome: "A live system your team can use with confidence",
  },
  {
    eyebrow: "05 / Grow",
    title: "Grow",
    description:
      "Once the core is working, most clients add automation and AI incrementally, with a workflow here and an agent there. We handle this through a monthly retainer, not another big project.",
    outcome: "An incremental path to more automation and intelligence",
  },
] as const;

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const smooth = (value: number) => value * value * (3 - 2 * value);

export default function StickyStory() {
  const [activeStep, setActiveStep] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const signalTrailRef = useRef<HTMLDivElement | null>(null);
  const signalDotRef = useRef<HTMLDivElement | null>(null);
  const bubbleRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const mobileCardRefs = useRef<Array<HTMLElement | null>>([]);
  const headingId = useId();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let frame = 0;
    let lastActiveStep = 0;

    const setStep = (index: number) => {
      if (index === lastActiveStep) return;
      lastActiveStep = index;
      setActiveStep(index);
    };

    const renderMobileProgress = () => {
      const viewportCenter = window.innerHeight * 0.5;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      mobileCardRefs.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height * 0.5 - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setStep(closestIndex);
    };

    const renderDesktopProgress = () => {
      const viewportHeight = window.innerHeight || 1;
      const trackRect = track.getBoundingClientRect();
      const scrollDistance = Math.max(track.offsetHeight - viewportHeight, 1);
      const progress = clamp(-trackRect.top / scrollDistance);
      const exactStep = progress * (steps.length - 1);
      const baseStep = Math.min(Math.floor(exactStep), steps.length - 1);
      const nextStep = Math.min(baseStep + 1, steps.length - 1);
      const localProgress = baseStep === steps.length - 1
        ? 0
        : exactStep - baseStep;
      const transitionProgress = smooth(clamp(localProgress));
      const reduceMotion = motionPreference.matches;
      const resolvedTransition = reduceMotion
        ? Number(localProgress >= 0.5)
        : transitionProgress;
      const activeIndex = resolvedTransition >= 0.5 ? nextStep : baseStep;
      const anchorForStep = (index: number) =>
        viewportHeight * (0.5 + (0.12 * index) / (steps.length - 1));
      const baseAnchor = anchorForStep(baseStep);
      const nextAnchor = anchorForStep(nextStep);
      const approachStart = viewportHeight * 0.42;
      const approachProgress = smooth(
        clamp(1 - trackRect.top / approachStart),
      );
      const approachViewportY = approachStart
        + (anchorForStep(0) - approachStart) * approachProgress;
      const signalY = trackRect.top > 0
        ? Math.max(0, approachViewportY - trackRect.top)
        : baseAnchor + (nextAnchor - baseAnchor) * resolvedTransition;
      const signalOpacity = trackRect.top <= approachStart
        ? smooth(
            clamp((approachStart - trackRect.top) / (viewportHeight * 0.06)),
          )
        : 0;
      const offscreenBottom = viewportHeight;
      const offscreenTop = viewportHeight * -0.18;

      setStep(activeIndex);

      const signalDot = signalDotRef.current;
      const signalTrail = signalTrailRef.current;

      if (signalDot && signalTrail) {
        signalDot.style.opacity = signalOpacity.toFixed(4);
        signalDot.style.transform = `translate3d(-50%, ${signalY.toFixed(2)}px, 0) translateY(-50%)`;
        signalTrail.style.opacity = signalOpacity.toFixed(4);
        signalTrail.style.transform = `translate3d(-50%, 0, 0) scaleY(${signalY.toFixed(2)})`;
      }

      bubbleRefs.current.forEach((bubble, index) => {
        if (!bubble) return;

        let y = offscreenBottom;
        let opacity = 0;
        let scale = 0.9;
        const isFirstStepApproach = index === 0 && trackRect.top > 0;

        if (reduceMotion) {
          if (index === activeIndex) {
            y = anchorForStep(activeIndex);
            opacity = 1;
            scale = 1;
          }
        } else if (isFirstStepApproach) {
          y = offscreenBottom
            + (anchorForStep(0) - offscreenBottom) * approachProgress;
          opacity = smooth(clamp((approachProgress - 0.06) / 0.62));
          scale = 0.9 + approachProgress * 0.1;
        } else if (index === baseStep) {
          y = baseAnchor + (offscreenTop - baseAnchor) * resolvedTransition;
          opacity = 1 - smooth(clamp((resolvedTransition - 0.34) / 0.66));
          scale = 1 - resolvedTransition * 0.08;
        } else if (index === nextStep && nextStep !== baseStep) {
          y = offscreenBottom
            + (nextAnchor - offscreenBottom) * resolvedTransition;
          opacity = smooth(clamp((resolvedTransition - 0.06) / 0.62));
          scale = 0.9 + resolvedTransition * 0.1;
        }

        bubble.style.opacity = opacity.toFixed(4);
        bubble.style.visibility = opacity > 0.002 ? "visible" : "hidden";
        bubble.style.transform = `translate3d(-50%, ${y.toFixed(2)}px, 0) translateY(-50%) scale(${scale.toFixed(4)})`;
      });

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        let y = offscreenBottom;
        let opacity = 0;
        let scale = 0.94;
        const isFirstStepApproach = index === 0 && trackRect.top > 0;

        if (reduceMotion) {
          if (index === activeIndex) {
            y = anchorForStep(activeIndex);
            opacity = 1;
            scale = 1;
          }
        } else if (isFirstStepApproach) {
          y = offscreenBottom
            + (anchorForStep(0) - offscreenBottom) * approachProgress;
          opacity = smooth(clamp((approachProgress - 0.12) / 0.58));
          scale = 0.94 + approachProgress * 0.06;
        } else if (index === baseStep) {
          y = baseAnchor + (offscreenTop - baseAnchor) * resolvedTransition;
          opacity = 1 - smooth(clamp((resolvedTransition - 0.2) / 0.72));
          scale = 1 - resolvedTransition * 0.05;
        } else if (index === nextStep && nextStep !== baseStep) {
          y = offscreenBottom
            + (nextAnchor - offscreenBottom) * resolvedTransition;
          opacity = smooth(clamp((resolvedTransition - 0.12) / 0.58));
          scale = 0.94 + resolvedTransition * 0.06;
        }

        card.style.opacity = opacity.toFixed(4);
        card.style.visibility = opacity > 0.002 ? "visible" : "hidden";
        card.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) translateY(-50%) scale(${scale.toFixed(4)})`;
      });
    };

    const render = () => {
      frame = 0;
      if (window.innerWidth < 768 || motionPreference.matches) {
        renderMobileProgress();
      } else {
        renderDesktopProgress();
      }
    };

    const scheduleRender = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    scheduleRender();
    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", scheduleRender);
    motionPreference.addEventListener("change", scheduleRender);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleRender);
      window.removeEventListener("resize", scheduleRender);
      motionPreference.removeEventListener("change", scheduleRender);
    };
  }, []);

  return (
    <section
      id="transformation-story"
      aria-labelledby={headingId}
      className="sticky-story relative isolate -mt-px overflow-clip"
      style={{
        background: "var(--story-background)",
      }}
    >
      <div
        aria-hidden="true"
        className="story-top-transition pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background: "var(--story-transition)",
        }}
      />
      <AnimatedGridPattern
        numSquares={64}
        maxOpacity={0.22}
        duration={3.8}
        repeatDelay={1.1}
        className="story-animated-grid pointer-events-none absolute inset-0"
      />
      <header className="relative z-10 mx-auto max-w-7xl px-5 pb-12 pt-40 sm:px-8 sm:pt-48 lg:px-12 lg:pb-0">
        <p className="story-eyebrow mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]">
          <span className="h-px w-8 bg-current" aria-hidden="true" />
          How we work
        </p>
        <TextAnimate
          as="h2"
          animation="slideUp"
          by="word"
          scrub
          id={headingId}
          className="max-w-4xl text-balance text-4xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl"
        >
          A clear process, from first call to live system.
        </TextAnimate>
        <TextAnimate
          as="p"
          animation="fadeIn"
          by="line"
          scrub
          className="story-intro mt-7 max-w-2xl text-pretty text-base leading-7 sm:text-lg sm:leading-8"
        >
          {`Digital transformation fails when it’s treated as a software purchase. We treat it as a process problem with a technology answer. Every engagement starts with process improvement to understand where time and money actually leak. This happens before a single Odoo module gets configured. That order matters because it’s the difference between digitizing a broken process and fixing it.`}
        </TextAnimate>
      </header>

      <div
        aria-hidden="true"
        className="relative z-10 mx-auto hidden h-36 max-w-[1440px] md:block"
      >
        <div className="story-timeline-line absolute bottom-0 left-[31%] top-5 w-px" />
      </div>

      <div
        ref={trackRef}
        className="relative md:h-[600svh] motion-reduce:md:h-auto"
      >
        <div className="sticky top-0 z-20 hidden h-[100svh] overflow-hidden md:block motion-reduce:md:hidden">
          <div className="relative z-10 mx-auto h-full max-w-[1440px]">
            <div className="story-timeline-line absolute left-[31%] top-0 h-full w-px">
              <div
                ref={signalTrailRef}
                data-story-signal="trail"
                aria-hidden="true"
                className="story-signal-trail absolute left-1/2 top-0 z-10 h-px w-[2px] origin-top rounded-full will-change-[transform,opacity]"
                style={{
                  opacity: 0,
                  transform: "translate3d(-50%, 0, 0) scaleY(0)",
                }}
              />
              <div
                ref={signalDotRef}
                data-story-signal="head"
                aria-hidden="true"
                className="story-signal-head absolute left-1/2 top-0 z-10 h-3 w-3 rounded-full border will-change-[transform,opacity]"
                style={{ opacity: 0 }}
              />
            </div>

            <div className="pointer-events-none absolute left-[31%] top-0 h-full">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  ref={(element) => {
                    bubbleRefs.current[index] = element;
                  }}
                  aria-hidden="true"
                  className="absolute left-0 top-0 z-20 h-28 w-28 will-change-[transform,opacity]"
                  style={{
                    opacity: 0,
                    visibility: "hidden",
                    transform:
                      "translate3d(-50%, 100svh, 0) translateY(-50%) scale(0.9)",
                  }}
                >
                  {activeStep === index ? (
                    <Ripple className="story-number-ripple" />
                  ) : null}
                  <span className="story-number-bubble relative z-10 grid h-full w-full place-items-center rounded-full border border-[#315d2a]/55 bg-[#f8f2e6]/96 font-mono text-2xl font-semibold tracking-[-0.06em] text-[#315d2a] shadow-[0_22px_70px_rgba(45,38,27,0.14),0_0_0_10px_rgba(239,231,216,0.82)]">
                    0{index + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="absolute left-[42%] right-[5%] top-0 z-20 h-full">
              <ol className="relative h-full">
                {steps.map((step, index) => (
                  <li key={step.title}>
                    <article
                      ref={(element) => {
                        cardRefs.current[index] = element;
                      }}
                      aria-labelledby={`story-step-title-${index + 1}`}
                      aria-current={activeStep === index ? "step" : undefined}
                      className="story-card absolute left-0 top-0 w-full max-w-[610px] rounded-[2.25rem] border p-10 will-change-[transform,opacity] xl:p-14"
                      style={{
                        opacity: 0,
                        visibility: "hidden",
                        transform:
                          "translate3d(0, 100svh, 0) translateY(-50%) scale(0.94)",
                      }}
                    >
                      <p className="story-step-label font-mono text-[10px] font-semibold uppercase tracking-[0.22em]">
                        Step 0{index + 1} / {step.eyebrow.split("/")[1]?.trim()}
                      </p>
                      <h3
                        id={`story-step-title-${index + 1}`}
                        className="mt-12 text-4xl font-medium leading-none tracking-[-0.045em] xl:text-5xl"
                      >
                        {step.title}
                      </h3>
                      <p className="story-card-copy mt-6 max-w-[48ch] text-base leading-7 xl:text-lg xl:leading-8">
                        {step.description}
                      </p>
                      <div className="story-card-outcome-wrap mt-10 border-t pt-6">
                        <p className="story-card-outcome text-sm font-medium leading-6">
                          <span className="story-card-arrow mr-2" aria-hidden="true">
                            →
                          </span>
                          {step.outcome}
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ol>
            </div>

            <div className="story-timeline-meta pointer-events-none absolute inset-x-12 top-8 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em]">
              <span>Engagement timeline · scroll to move the signal</span>
              <span className="story-timeline-count">
                {String(activeStep + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        <ol className="relative z-10 grid gap-7 overflow-hidden px-5 pb-24 sm:px-8 md:hidden motion-reduce:md:grid">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative z-10 grid grid-cols-[52px_minmax(0,1fr)] gap-4"
            >
              <div aria-hidden="true" className="relative flex justify-center">
                {index < steps.length - 1 ? (
                  <span className="story-mobile-line absolute bottom-[-1.75rem] top-14 w-px" />
                ) : null}
                <span
                  className={`story-mobile-number relative z-10 mt-7 grid h-12 w-12 place-items-center rounded-full border font-mono text-[10px] font-semibold${activeStep === index ? " is-active" : ""}`}
                >
                  0{index + 1}
                </span>
              </div>
              <article
                ref={(element) => {
                  mobileCardRefs.current[index] = element;
                }}
                aria-labelledby={`mobile-story-step-title-${index + 1}`}
                aria-current={activeStep === index ? "step" : undefined}
                className="story-mobile-card rounded-[1.5rem] border p-6 sm:p-8"
              >
                <p className="story-step-label font-mono text-[9px] font-semibold uppercase tracking-[0.2em]">
                  / {step.eyebrow.split("/")[1]?.trim()}
                </p>
                <h3
                  id={`mobile-story-step-title-${index + 1}`}
                  className="mt-7 text-3xl font-medium leading-none tracking-[-0.035em]"
                >
                  {step.title}
                </h3>
                <p className="story-card-copy mt-5 text-base leading-7">
                  {step.description}
                </p>
                <div className="story-card-outcome-wrap mt-8 border-t pt-5">
                  <p className="story-card-outcome text-sm font-medium leading-6">
                    <span className="story-card-arrow mr-2" aria-hidden="true">
                      →
                    </span>
                    {step.outcome}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl justify-center px-5 pb-28 sm:px-8 lg:px-12">
        <PulsatingButton
          className="story-pulsating-cta"
          href="/contact"
          background="#b9f45d"
        >
          Book a Free Process Audit <span aria-hidden="true">↗</span>
        </PulsatingButton>
      </div>

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        Step {activeStep + 1} of {steps.length}: {steps[activeStep].title}
      </span>
    </section>
  );
}
