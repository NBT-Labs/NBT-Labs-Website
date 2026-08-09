import type { CSSProperties, HTMLAttributes } from "react";

type RippleStyle = CSSProperties & {
  "--ripple-delay"?: string;
  "--ripple-main-opacity"?: string;
  "--ripple-main-size"?: string;
};

export type RippleProps = HTMLAttributes<HTMLDivElement> & {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
};

export function Ripple({
  className = "",
  mainCircleSize = 148,
  mainCircleOpacity = 0.36,
  numCircles = 7,
  style,
  ...props
}: RippleProps) {
  const rootStyle: RippleStyle = {
    "--ripple-main-opacity": String(mainCircleOpacity),
    "--ripple-main-size": `${mainCircleSize}px`,
    ...style,
  };

  return (
    <div
      {...props}
      aria-hidden="true"
      className={`magic-ripple${className ? ` ${className}` : ""}`}
      style={rootStyle}
    >
      {Array.from({ length: numCircles }, (_, index) => (
        <span
          className="magic-ripple-ring"
          key={index}
          style={
            {
              "--ripple-delay": `${index * -0.78}s`,
            } as RippleStyle
          }
        />
      ))}
    </div>
  );
}
