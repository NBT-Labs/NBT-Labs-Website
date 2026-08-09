"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type RevealTag = "article" | "div" | "li" | "section" | "ul";

type ViewportRevealProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> & {
  as?: RevealTag;
  children: ReactNode;
  delay?: number;
  variant?: "lift" | "scale" | "left";
};

type RevealStyle = CSSProperties & {
  "--viewport-reveal-delay": string;
};

export function ViewportReveal({
  as = "div",
  children,
  className = "",
  delay = 0,
  style,
  variant = "lift",
  ...props
}: ViewportRevealProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (
      motionPreference.matches
      || root.getBoundingClientRect().top < window.innerHeight * 0.9
    ) {
      const frame = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10%", threshold: 0.14 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const Root = as;
  const revealStyle: RevealStyle = {
    ...style,
    "--viewport-reveal-delay": `${delay}s`,
  };

  return (
    <Root
      {...props}
      ref={(element: HTMLElement | null) => {
        rootRef.current = element;
      }}
      className={`viewport-reveal viewport-reveal-${variant}${isVisible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      data-viewport-reveal="once"
      style={revealStyle}
    >
      {children}
    </Root>
  );
}
