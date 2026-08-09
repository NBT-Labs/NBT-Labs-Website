"use client";

import type { CSSProperties, ReactNode } from "react";

type ShimmerButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  tabIndex?: number;
  onClick?: () => void;
  ariaLabel?: string;
};

type ShimmerButtonStyle = CSSProperties & {
  "--shimmer-color": string;
  "--shimmer-size": string;
  "--shimmer-radius": string;
  "--shimmer-duration": string;
  "--shimmer-background": string;
};

export function ShimmerButton({
  children,
  href,
  className = "",
  shimmerColor,
  shimmerSize = "2px",
  borderRadius = "999px",
  shimmerDuration = "3s",
  background = "var(--theme-button-bg, #07100d)",
  type = "button",
  disabled = false,
  tabIndex,
  onClick,
  ariaLabel,
}: ShimmerButtonProps) {
  const resolvedShimmerColor =
    shimmerColor ??
    (className.split(/\s+/).includes("shimmer-button-accent")
      ? "#315d2a"
      : "var(--theme-button-shimmer, #fffcf4)");
  const style: ShimmerButtonStyle = {
    "--shimmer-color": resolvedShimmerColor,
    "--shimmer-size": shimmerSize,
    "--shimmer-radius": borderRadius,
    "--shimmer-duration": shimmerDuration,
    "--shimmer-background": background,
  };
  const classes = `shimmer-button${className ? ` ${className}` : ""}`;
  const content = (
    <>
      <span className="shimmer-button-border" aria-hidden="true" />
      <span className="shimmer-button-surface" aria-hidden="true" />
      <span className="shimmer-button-content">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        aria-label={ariaLabel}
        className={classes}
        href={href}
        onClick={onClick}
        style={style}
        tabIndex={tabIndex}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      aria-label={ariaLabel}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      style={style}
      tabIndex={tabIndex}
      type={type}
    >
      {content}
    </button>
  );
}
