"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type HighlighterAction = "highlight" | "underline";

type HighlighterProps = {
  children: ReactNode;
  action?: HighlighterAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  drawDelay?: number;
  padding?: number;
  isView?: boolean;
  className?: string;
};

type HighlighterStyle = CSSProperties & {
  "--highlighter-color": string;
  "--highlighter-delay": string;
  "--highlighter-delay-secondary": string;
  "--highlighter-duration": string;
  "--highlighter-padding": string;
  "--highlighter-stroke": string;
};

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 2,
  animationDuration = 700,
  drawDelay = 0,
  padding = 2,
  isView = false,
  className = "",
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isDrawn, setIsDrawn] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (!isView) {
      const frame = window.requestAnimationFrame(() => setIsDrawn(true));
      return () => window.cancelAnimationFrame(frame);
    }

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setIsDrawn(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsDrawn(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12%", threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isView]);

  const style: HighlighterStyle = {
    "--highlighter-color": color,
    "--highlighter-delay": `${drawDelay}ms`,
    "--highlighter-delay-secondary": `${drawDelay + Math.round(animationDuration * 0.16)}ms`,
    "--highlighter-duration": `${animationDuration}ms`,
    "--highlighter-padding": `${padding}px`,
    "--highlighter-stroke": `${strokeWidth}px`,
  };

  return (
    <span
      ref={elementRef}
      className={`magic-highlighter${isDrawn ? " is-drawn" : ""}${className ? ` ${className}` : ""}`}
      data-action={action}
      style={style}
    >
      {children}
    </span>
  );
}
