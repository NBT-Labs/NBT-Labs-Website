"use client";

import type { CSSProperties, ReactNode } from "react";

type PulsatingButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  pulseColor?: string;
  background?: string;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
};

type PulsatingButtonStyle = CSSProperties & {
  "--pulse-color": string;
  "--pulse-background": string;
};

export function PulsatingButton({
  children,
  href,
  className = "",
  pulseColor = "#315d2a",
  background = "#b9f45d",
  type = "button",
  ariaLabel,
}: PulsatingButtonProps) {
  const style: PulsatingButtonStyle = {
    "--pulse-color": pulseColor,
    "--pulse-background": background,
  };
  const classes = `pulsating-button${className ? ` ${className}` : ""}`;
  const content = <span className="pulsating-button-content">{children}</span>;

  if (href) {
    return (
      <a aria-label={ariaLabel} className={classes} href={href} style={style}>
        {content}
      </a>
    );
  }

  return (
    <button aria-label={ariaLabel} className={classes} style={style} type={type}>
      {content}
    </button>
  );
}
