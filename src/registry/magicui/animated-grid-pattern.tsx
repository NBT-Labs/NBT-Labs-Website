"use client";

import {
  type CSSProperties,
  type HTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const gridSize = 48;

type AnimatedGridStyle = CSSProperties & {
  "--animated-grid-duration"?: string;
  "--animated-grid-max-opacity"?: number;
  "--animated-grid-repeat-delay"?: string;
};

type AnimatedSquareStyle = CSSProperties & {
  "--grid-square-left"?: string;
  "--grid-square-top"?: string;
  "--grid-square-delay"?: string;
};

export type AnimatedGridPatternProps = HTMLAttributes<HTMLDivElement> & {
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
};

export function AnimatedGridPattern({
  numSquares = 30,
  maxOpacity = 0.1,
  duration = 3,
  repeatDelay = 1,
  className = "",
  style,
  ...props
}: AnimatedGridPatternProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const updateDimensions = () => {
      const bounds = root.getBoundingClientRect();
      const width = Math.round(bounds.width);
      const height = Math.round(bounds.height);

      setDimensions((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      );
    };

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(root);
    updateDimensions();

    return () => observer.disconnect();
  }, []);

  const squares = useMemo(() => {
    if (!dimensions.width || !dimensions.height) return [];

    const columns = Math.ceil(dimensions.width / gridSize) + 2;
    const rows = Math.ceil(dimensions.height / gridSize) + 1;
    const totalCells = columns * rows;
    const squareCount = Math.min(numSquares, totalCells);
    const usedCells = new Set<number>();

    return Array.from({ length: squareCount }, (_, index) => {
      let cell = (index * 7919 + index * index * 104729 + 17) % totalCells;

      while (usedCells.has(cell)) {
        cell = (cell + 37) % totalCells;
      }
      usedCells.add(cell);

      const column = cell % columns;
      const row = Math.floor(cell / columns);
      const centeredColumn = column - Math.floor(columns / 2);

      return {
        left: `calc(50% + ${centeredColumn * gridSize}px)`,
        top: `${row * gridSize + gridSize / 2}px`,
      };
    });
  }, [dimensions.height, dimensions.width, numSquares]);

  const rootStyle: AnimatedGridStyle = {
    "--animated-grid-duration": `${duration}s`,
    "--animated-grid-max-opacity": maxOpacity,
    "--animated-grid-repeat-delay": `${repeatDelay}s`,
    ...style,
  };

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`magic-animated-grid ${className}`.trim()}
      style={rootStyle}
      {...props}
    >
      {squares.map((square, index) => {
        const cycle = duration + repeatDelay;
        const delay = -((index * 0.73) % cycle);

        return (
          <span
            key={index}
            className="magic-animated-grid-square"
            style={
              {
                "--grid-square-left": square.left,
                "--grid-square-top": square.top,
                "--grid-square-delay": `${delay}s`,
              } as AnimatedSquareStyle
            }
          />
        );
      })}
    </div>
  );
}
