"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

type TextAnimateTag =
  | "article"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "li"
  | "p"
  | "section"
  | "span";

export type TextAnimateAnimation =
  | "blurInUp"
  | "fadeIn"
  | "scaleUp"
  | "slideLeft"
  | "slideUp"
  | "wavy";

export type TextAnimateBy = "character" | "line" | "text" | "word";

export type TextAnimateProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> & {
  children: ReactNode;
  animation?: TextAnimateAnimation;
  by?: TextAnimateBy;
  once?: boolean;
  scrub?: boolean;
  scrubEnd?: number;
  as?: TextAnimateTag;
  delay?: number;
  /** Total time, in seconds, over which the units are staggered. */
  duration?: number;
  /** Delay between units. Overrides the automatically calculated stagger. */
  stagger?: number;
  startOnView?: boolean;
  accessible?: boolean;
};

type ElementWithChildren = ReactElement<{ children?: ReactNode }>;

type UnitStyle = CSSProperties & {
  "--text-animate-delay": string;
};

const clampProgress = (value: number) => Math.min(Math.max(value, 0), 1);

const smoothProgress = (value: number) =>
  value * value * (3 - 2 * value);

function getText(node: ReactNode): string {
  let text = "";

  Children.forEach(node, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      text += String(child);
      return;
    }

    if (isValidElement<{ children?: ReactNode }>(child)) {
      text += getText(child.props.children);
    }
  });

  return text.replace(/\s+/g, " ").trim();
}

function countUnits(node: ReactNode, by: TextAnimateBy): number {
  if (by === "text") return getText(node) ? 1 : 0;

  let total = 0;

  Children.forEach(node, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      const value = String(child);

      if (by === "character") {
        total += Array.from(value).filter(
          (character) => !/^\s$/.test(character),
        ).length;
      } else if (by === "word" || by === "line") {
        total += value.match(/\S+/g)?.length ?? 0;
      }
      return;
    }

    if (isValidElement<{ children?: ReactNode }>(child)) {
      total += countUnits(child.props.children, by);
    }
  });

  return total;
}

function getUnitStyle(
  index: number,
  delay: number,
  stagger: number,
): UnitStyle {
  return {
    "--text-animate-delay": `${delay + index * stagger}s`,
  };
}

function getUnitProps(
  kind: TextAnimateBy,
  cursor: { value: number },
  delay: number,
  stagger: number,
) {
  const index = cursor.value;
  cursor.value += 1;

  return {
    className: `text-animate-unit text-animate-${kind}`,
    "data-text-animate-index": index,
    style: getUnitStyle(index, delay, stagger),
  };
}

function animateCharacters(
  node: ReactNode,
  cursor: { value: number },
  delay: number,
  stagger: number,
): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return String(child)
        .split(/(\s+)/)
        .map((part, partIndex) => {
          if (!part || /^\s+$/.test(part)) return part;

          const wordStart = cursor.value;
          const characters = Array.from(part).map((character) => {
            const unitProps = getUnitProps(
              "character",
              cursor,
              delay,
              stagger,
            );

            return (
              <span
                {...unitProps}
                key={`animated-character-${unitProps["data-text-animate-index"]}`}
              >
                {character}
              </span>
            );
          });

          return (
            <span
              className="text-animate-word"
              key={`animated-word-${wordStart}-${partIndex}`}
            >
              {characters}
            </span>
          );
        });
    }

    if (isValidElement<{ children?: ReactNode }>(child)) {
      const element = child as ElementWithChildren;
      if (element.props.children === undefined) return element;

      return cloneElement(
        element,
        undefined,
        animateCharacters(element.props.children, cursor, delay, stagger),
      );
    }

    return child;
  });
}

function animateWords(
  node: ReactNode,
  cursor: { value: number },
  delay: number,
  stagger: number,
): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return String(child)
        .split(/(\s+)/)
        .map((part) => {
          if (!part || /^\s+$/.test(part)) return part;
          const unitProps = getUnitProps("word", cursor, delay, stagger);

          return (
            <span
              {...unitProps}
              key={`animated-word-${unitProps["data-text-animate-index"]}`}
            >
              {part}
            </span>
          );
        });
    }

    if (isValidElement<{ children?: ReactNode }>(child)) {
      const element = child as ElementWithChildren;
      if (element.props.children === undefined) return element;

      return cloneElement(
        element,
        undefined,
        animateWords(element.props.children, cursor, delay, stagger),
      );
    }

    return child;
  });
}

function animateLines(
  node: ReactNode,
  cursor: { value: number },
  delay: number,
  stagger: number,
): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      const lines = String(child).split(/\r?\n/);

      return lines.map((line, lineIndex) => {
        const words = line.split(/(\s+)/).map((part) => {
          if (!part || /^\s+$/.test(part)) return part;
          const unitProps = getUnitProps("line", cursor, delay, stagger);

          return (
            <span
              {...unitProps}
              key={`animated-line-word-${unitProps["data-text-animate-index"]}`}
            >
              {part}
            </span>
          );
        });

        return (
          <span
            className="text-animate-line-row"
            key={`animated-line-row-${cursor.value}-${lineIndex}`}
          >
            {line.trim() ? (
              words
            ) : (
              <span className="text-animate-line-spacer" aria-hidden="true">
                {"\u00a0"}
              </span>
            )}
          </span>
        );
      });
    }

    if (isValidElement<{ children?: ReactNode }>(child)) {
      const element = child as ElementWithChildren;
      if (element.props.children === undefined) return element;

      return cloneElement(
        element,
        undefined,
        animateLines(element.props.children, cursor, delay, stagger),
      );
    }

    return child;
  });
}

function animateBy(
  node: ReactNode,
  by: TextAnimateBy,
  cursor: { value: number },
  delay: number,
  stagger: number,
): ReactNode {
  if (by === "text") {
    const unitProps = getUnitProps("text", cursor, delay, stagger);
    return <span {...unitProps}>{node}</span>;
  }

  if (by === "line") {
    return animateLines(node, cursor, delay, stagger);
  }

  if (by === "word") {
    return animateWords(node, cursor, delay, stagger);
  }

  return animateCharacters(node, cursor, delay, stagger);
}

function applyScrubProgress(
  element: HTMLElement,
  animation: TextAnimateAnimation,
  progress: number,
) {
  const remaining = 1 - progress;
  element.style.opacity = progress.toFixed(4);

  if (animation === "blurInUp") {
    element.style.filter = `blur(${(remaining * 8).toFixed(2)}px)`;
    element.style.transform = `translate3d(0, ${(remaining * 18).toFixed(2)}px, 0)`;
    return;
  }

  element.style.filter = "none";

  if (animation === "slideUp") {
    element.style.transform = `translate3d(0, ${(remaining * 24).toFixed(2)}px, 0)`;
  } else if (animation === "scaleUp") {
    element.style.transform = `scale(${(0.72 + progress * 0.28).toFixed(4)})`;
  } else if (animation === "slideLeft") {
    element.style.transform = `translate3d(${(remaining * 24).toFixed(2)}px, 0, 0)`;
  } else if (animation === "wavy") {
    element.style.transform = `translate3d(0, ${(remaining * 30).toFixed(2)}px, 0) rotate(${(remaining * 45).toFixed(2)}deg) scale(${(0.5 + progress * 0.5).toFixed(4)})`;
  } else {
    element.style.transform = "none";
  }
}

export function TextAnimate({
  children,
  animation = "blurInUp",
  by = "character",
  once = false,
  scrub = false,
  scrubEnd = 0.38,
  as = "p",
  delay = 0,
  duration = 0.3,
  stagger,
  startOnView = true,
  accessible = true,
  className = "",
  ...props
}: TextAnimateProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(!startOnView);
  const textContent = getText(children);
  const unitCount = countUnits(children, by);
  const unitStagger =
    stagger ??
    (animation === "wavy" ? 0.1 : duration / Math.max(unitCount, 1));
  const cursor = { value: 0 };
  const animatedChildren = animateBy(
    children,
    by,
    cursor,
    delay,
    unitStagger,
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const collectUnits = () => {
      const elements = Array.from(
        root.querySelectorAll<HTMLElement>(".text-animate-unit"),
      );

      if (by !== "line") {
        return elements.map((element) => ({
          element,
          index: Number(element.dataset.textAnimateIndex ?? 0),
        }));
      }

      const lineTops: number[] = [];
      const measured = elements.map((element) => {
        const top = element.getBoundingClientRect().top;
        let index = lineTops.findIndex(
          (lineTop) => Math.abs(lineTop - top) <= 1,
        );

        if (index === -1) {
          lineTops.push(top);
          index = lineTops.length - 1;
        }

        return { element, index };
      });
      const lineStagger =
        stagger ?? duration / Math.max(lineTops.length, 1);

      measured.forEach(({ element, index }) => {
        element.style.setProperty(
          "--text-animate-delay",
          `${delay + index * lineStagger}s`,
        );
      });

      return measured;
    };

    if (scrub) {
      const motionPreference = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      let units = collectUnits();
      let indexByElement = new Map(
        units.map(({ element, index }) => [element, index]),
      );
      let finalIndex = Math.max(
        ...units.map(({ index }) => index),
        1,
      );
      let animationFrame = 0;
      let lastProgress = -1;

      const collectHighlighters = () =>
        Array.from(
          root.querySelectorAll<HTMLElement>(".magic-highlighter"),
        ).map((element) => {
          const indices = Array.from(
            element.querySelectorAll<HTMLElement>(".text-animate-unit"),
          ).map(
            (unit) =>
              indexByElement.get(unit) ??
              Number(unit.dataset.textAnimateIndex ?? 0),
          );

          return {
            element,
            firstIndex: indices.length ? Math.min(...indices) : 0,
          };
        });

      let highlighters = collectHighlighters();

      const renderProgress = () => {
        animationFrame = 0;
        const reduceMotion = motionPreference.matches;
        const viewportHeight = window.innerHeight || 1;
        const rect = root.getBoundingClientRect();
        const startLine = viewportHeight * 0.92;
        const endLine = viewportHeight * clampProgress(scrubEnd);
        const progress = reduceMotion
          ? 1
          : clampProgress(
              (startLine - rect.top) / Math.max(startLine - endLine, 1),
            );

        if (Math.abs(progress - lastProgress) < 0.0005) return;
        lastProgress = progress;
        root.style.setProperty(
          "--text-animate-scroll-progress",
          progress.toFixed(4),
        );

        units.forEach(({ element, index }) => {
          const unitStart = (index / finalIndex) * 0.72;
          const localProgress = clampProgress(
            (progress - unitStart) / 0.28,
          );
          applyScrubProgress(
            element,
            animation,
            smoothProgress(localProgress),
          );
        });

        highlighters.forEach(({ element, firstIndex }) => {
          const decorationStart = (firstIndex / finalIndex) * 0.72;
          const localProgress = clampProgress(
            (progress - decorationStart) / 0.28,
          );
          const primaryProgress = smoothProgress(localProgress);
          const secondaryProgress = smoothProgress(
            clampProgress((localProgress - 0.18) / 0.82),
          );

          element.style.setProperty(
            "--highlighter-scroll-progress",
            primaryProgress.toFixed(4),
          );
          element.style.setProperty(
            "--highlighter-scroll-progress-secondary",
            secondaryProgress.toFixed(4),
          );
        });
      };

      const scheduleRender = () => {
        if (animationFrame) return;
        animationFrame = window.requestAnimationFrame(renderProgress);
      };

      const handleResize = () => {
        units = collectUnits();
        indexByElement = new Map(
          units.map(({ element, index }) => [element, index]),
        );
        finalIndex = Math.max(...units.map(({ index }) => index), 1);
        highlighters = collectHighlighters();
        lastProgress = -1;
        scheduleRender();
      };

      scheduleRender();
      window.addEventListener("scroll", scheduleRender, { passive: true });
      window.addEventListener("resize", handleResize);
      motionPreference.addEventListener("change", scheduleRender);

      return () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener("scroll", scheduleRender);
        window.removeEventListener("resize", handleResize);
        motionPreference.removeEventListener("change", scheduleRender);
        root.style.removeProperty("--text-animate-scroll-progress");
        units.forEach(({ element }) => {
          element.style.removeProperty("opacity");
          element.style.removeProperty("filter");
          element.style.removeProperty("transform");
        });
        highlighters.forEach(({ element }) => {
          element.style.removeProperty("--highlighter-scroll-progress");
          element.style.removeProperty(
            "--highlighter-scroll-progress-secondary",
          );
        });
      };
    }

    if (!startOnView) return;

    collectUnits();

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const revealForMotionPreference = () => {
      if (motionPreference.matches) setIsVisible(true);
    };
    const rect = root.getBoundingClientRect();

    if (motionPreference.matches || rect.top < window.innerHeight * 0.86) {
      setIsVisible(true);
      if (once) return;
    }

    const handleLineResize = () => {
      if (by === "line") collectUnits();
    };

    window.addEventListener("resize", handleLineResize);
    motionPreference.addEventListener("change", revealForMotionPreference);

    if (typeof IntersectionObserver === "undefined") {
      const frame = globalThis.requestAnimationFrame(() =>
        setIsVisible(true),
      );
      return () => {
        globalThis.cancelAnimationFrame(frame);
        window.removeEventListener("resize", handleLineResize);
        motionPreference.removeEventListener(
          "change",
          revealForMotionPreference,
        );
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once && !motionPreference.matches) {
          setIsVisible(false);
        }
      },
      { rootMargin: "0px 0px -12%", threshold: 0.18 },
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleLineResize);
      motionPreference.removeEventListener(
        "change",
        revealForMotionPreference,
      );
    };
  }, [
    animation,
    by,
    delay,
    duration,
    once,
    scrub,
    scrubEnd,
    stagger,
    startOnView,
    textContent,
    unitCount,
  ]);

  const Root = as;

  return (
    <Root
      {...props}
      ref={(element: HTMLElement | null) => {
        rootRef.current = element;
      }}
      className={`text-animate text-animate-${animation} text-animate-by-${by}${scrub ? " is-scrubbed" : ""}${isVisible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
    >
      {accessible ? <span className="sr-only">{textContent}</span> : null}
      <span
        aria-hidden={accessible ? true : undefined}
        className="text-animate-visual"
      >
        {animatedChildren}
      </span>
    </Root>
  );
}
