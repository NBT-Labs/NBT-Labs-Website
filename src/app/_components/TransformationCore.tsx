"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Locale } from "@/lib/audit/types";

type Vector3 = readonly [x: number, y: number, z: number];

type ProjectedPoint = {
  x: number;
  y: number;
  scale: number;
  depth: number;
};

type Palette = {
  background: string;
  cream: string;
  mint: string;
  muted: string;
  line: string;
};

export type TransformationCoreProps = {
  locale: Locale;
  className?: string;
};

const COPY = {
  fr: {
    title: "Noyau de transformation",
    instruction: "Bougez ou touchez pour explorer",
    pause: "Pause",
    resume: "Reprendre",
    pauseLabel: "Mettre l’animation en pause",
    resumeLabel: "Reprendre l’animation",
    sequenceLabel: "Séquence de transformation NBT Labs",
    stages: [
      ["01", "Processus", "Cartographier, améliorer"],
      ["02", "Odoo", "Faire rouler le système"],
      ["03", "Agents", "Agir et optimiser"],
    ],
    description:
      "Le visuel interactif montre NBT Labs qui améliore un processus d’affaires, établit Odoo comme système de référence et branche des agents IA qui agissent sur les données d’exploitation en temps réel.",
  },
  en: {
    title: "Transformation core",
    instruction: "Move or touch to explore",
    pause: "Pause",
    resume: "Resume",
    pauseLabel: "Pause hero animation",
    resumeLabel: "Resume hero animation",
    sequenceLabel: "NBT Labs transformation sequence",
    stages: [
      ["01", "Process", "Map & improve"],
      ["02", "Odoo", "Run the system"],
      ["03", "Agents", "Act & optimize"],
    ],
    description:
      "The interactive visual shows NBT Labs improving a business process, establishing Odoo as the system of record, and connecting AI agents that act on live operational data.",
  },
} as const;

const TAU = Math.PI * 2;
const STAGES: Vector3[] = [
  [-2.18, 0.05, -0.08],
  [0, -0.08, 0.35],
  [2.18, 0.02, -0.04],
];

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const random = seededRandom(2411);
const FIELD_POINTS = Array.from({ length: 54 }, () => ({
  point: [
    (random() - 0.5) * 7.2,
    (random() - 0.5) * 4.25,
    (random() - 0.5) * 3.8,
  ] as Vector3,
  radius: 0.55 + random() * 1.35,
  opacity: 0.12 + random() * 0.3,
}));

const PROCESS_NODES: Vector3[] = [
  [-3.02, -0.78, -0.18],
  [-3.05, 0.02, 0.52],
  [-2.82, 0.8, -0.25],
  [-2.12, -0.92, 0.18],
];

const AGENT_NODES: Vector3[] = [
  [2.98, -0.85, -0.16],
  [3.2, -0.2, 0.38],
  [3.06, 0.62, -0.28],
  [2.35, 0.94, 0.24],
  [2.65, 0.12, 0.82],
];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function project(
  point: Vector3,
  yaw: number,
  pitch: number,
  width: number,
  height: number,
): ProjectedPoint {
  const [x, y, z] = point;
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const yawX = x * cosYaw + z * sinYaw;
  const yawZ = -x * sinYaw + z * cosYaw;
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const pitchY = y * cosPitch - yawZ * sinPitch;
  const pitchZ = y * sinPitch + yawZ * cosPitch;
  const perspective = 4.9 / Math.max(2.4, 4.9 - pitchZ);
  const sceneScale = Math.min(width / 7.45, height / 5.35);

  return {
    x: width * 0.5 + yawX * sceneScale * perspective,
    y: height * 0.44 + pitchY * sceneScale * perspective,
    scale: perspective,
    depth: pitchZ,
  };
}

function curvePoint(from: Vector3, to: Vector3, t: number): Vector3 {
  const arch = Math.sin(t * Math.PI);
  return [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t - arch * 0.2,
    from[2] + (to[2] - from[2]) * t + arch * 0.24,
  ];
}

function visuallyHiddenStyle(): CSSProperties {
  return {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  };
}

/**
 * A dependency-free, canvas-based model of NBT Labs' transformation sequence.
 * Override --core-bg, --core-cream, --core-mint, --core-muted, and --core-line
 * from the parent to align the illustration with a page theme.
 */
export function TransformationCore({ locale, className }: TransformationCoreProps) {
  const copy = COPY[locale];
  const hostRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(false);
  const requestFrameRef = useRef<(() => void) | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const toggleMotion = () => {
    const nextPaused = !pausedRef.current;
    pausedRef.current = nextPaused;
    setIsPaused(nextPaused);
    requestFrameRef.current?.();
  };

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    let introStartedAt = performance.now();
    let palette: Palette = {
      background: "#07100d",
      cream: "#f6f0df",
      mint: "#b9f45d",
      muted: "#9eaa9d",
      line: "#738078",
    };

    const pointer = {
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      active: false,
    };

    const readPalette = () => {
      const styles = window.getComputedStyle(host);
      const getColor = (property: string, fallback: string) =>
        styles.getPropertyValue(property).trim() || fallback;

      palette = {
        background: getColor("--core-bg", "#07100d"),
        cream: getColor("--core-cream", "#f6f0df"),
        mint: getColor("--core-mint", "#b9f45d"),
        muted: getColor("--core-muted", "#9eaa9d"),
        line: getColor("--core-line", "#738078"),
      };
    };

    const drawGlow = (
      point: ProjectedPoint,
      radius: number,
      color: string,
      opacity: number,
    ) => {
      const glow = context.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        radius,
      );
      glow.addColorStop(0, color);
      glow.addColorStop(0.18, color);
      glow.addColorStop(1, "transparent");
      context.save();
      context.globalAlpha = opacity;
      context.fillStyle = glow;
      context.fillRect(
        point.x - radius,
        point.y - radius,
        radius * 2,
        radius * 2,
      );
      context.restore();
    };

    const drawNode = (
      point: ProjectedPoint,
      radius: number,
      color: string,
      emphasis = 1,
    ) => {
      const scaledRadius = Math.max(1.5, radius * point.scale);
      drawGlow(point, scaledRadius * 4.5, color, 0.1 * emphasis);

      context.save();
      context.beginPath();
      context.arc(point.x, point.y, scaledRadius, 0, TAU);
      context.fillStyle = palette.background;
      context.fill();
      context.globalAlpha = 0.82 * emphasis;
      context.strokeStyle = color;
      context.lineWidth = Math.max(0.8, 1.2 * point.scale);
      context.stroke();
      context.beginPath();
      context.arc(point.x, point.y, Math.max(1, scaledRadius * 0.32), 0, TAU);
      context.fillStyle = color;
      context.fill();
      context.restore();
    };

    const drawWorldLine = (
      from: Vector3,
      to: Vector3,
      yaw: number,
      pitch: number,
      color: string,
      opacity: number,
      lineWidth = 1,
    ) => {
      const first = project(from, yaw, pitch, width, height);
      const second = project(to, yaw, pitch, width, height);
      context.save();
      context.beginPath();
      context.moveTo(first.x, first.y);
      context.lineTo(second.x, second.y);
      context.globalAlpha = opacity;
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.stroke();
      context.restore();
    };

    const drawCurve = (
      from: Vector3,
      to: Vector3,
      yaw: number,
      pitch: number,
      color: string,
      opacity: number,
    ) => {
      context.save();
      context.beginPath();
      for (let index = 0; index <= 32; index += 1) {
        const point = project(
          curvePoint(from, to, index / 32),
          yaw,
          pitch,
          width,
          height,
        );
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
      context.globalAlpha = opacity;
      context.strokeStyle = color;
      context.lineWidth = 1;
      context.setLineDash([2, 7]);
      context.stroke();
      context.restore();
    };

    const drawOrbit = (
      center: Vector3,
      radius: number,
      tilt: number,
      phase: number,
      yaw: number,
      pitch: number,
      color: string,
      opacity: number,
    ) => {
      context.save();
      context.beginPath();
      for (let index = 0; index <= 52; index += 1) {
        const angle = (index / 52) * TAU + phase;
        const point: Vector3 = [
          center[0] + Math.cos(angle) * radius * Math.sin(tilt),
          center[1] + Math.sin(angle) * radius,
          center[2] + Math.cos(angle) * radius * Math.cos(tilt),
        ];
        const projected = project(point, yaw, pitch, width, height);
        if (index === 0) context.moveTo(projected.x, projected.y);
        else context.lineTo(projected.x, projected.y);
      }
      context.globalAlpha = opacity;
      context.strokeStyle = color;
      context.lineWidth = 0.8;
      context.stroke();
      context.restore();
    };

    const draw = (now: number) => {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);

      const elapsed = Math.max(0, now - introStartedAt);
      const introProgress = clamp(elapsed / 4600, 0, 1);
      const introStrength = reduceMotion ? 0 : Math.pow(1 - introProgress, 3);
      const cameraYaw =
        pointer.currentX * 0.26 +
        (reduceMotion ? 0 : Math.cos(elapsed * 0.00022) * 0.075) +
        Math.cos(elapsed * 0.00145) * 0.4 * introStrength;
      const cameraPitch =
        pointer.currentY * -0.17 +
        (reduceMotion ? 0 : Math.sin(elapsed * 0.00018) * 0.035) +
        Math.sin(elapsed * 0.00115) * 0.16 * introStrength;

      const backdrop = context.createRadialGradient(
        width * 0.5,
        height * 0.43,
        0,
        width * 0.5,
        height * 0.43,
        Math.max(width, height) * 0.62,
      );
      backdrop.addColorStop(0, palette.mint);
      backdrop.addColorStop(0.5, palette.background);
      backdrop.addColorStop(1, "transparent");
      context.save();
      context.globalAlpha = 0.055;
      context.fillStyle = backdrop;
      context.fillRect(0, 0, width, height);
      context.restore();

      context.save();
      context.globalCompositeOperation = "lighter";
      FIELD_POINTS.forEach(({ point, radius, opacity }) => {
        const projected = project(point, cameraYaw * 0.62, cameraPitch * 0.62, width, height);
        if (
          projected.x < -12 ||
          projected.x > width + 12 ||
          projected.y < -12 ||
          projected.y > height + 12
        ) {
          return;
        }
        context.beginPath();
        context.arc(
          projected.x,
          projected.y,
          Math.max(0.45, radius * projected.scale),
          0,
          TAU,
        );
        context.globalAlpha = opacity * clamp(projected.scale, 0.55, 1.35);
        context.fillStyle = palette.muted;
        context.fill();
      });
      context.restore();

      drawCurve(
        STAGES[0],
        STAGES[1],
        cameraYaw,
        cameraPitch,
        palette.mint,
        0.34,
      );
      drawCurve(
        STAGES[1],
        STAGES[2],
        cameraYaw,
        cameraPitch,
        palette.mint,
        0.34,
      );

      const orbitPhase = reduceMotion
        ? 0.45
        : elapsed * 0.00011 + elapsed * 0.00036 * introStrength + 0.45;
      drawOrbit(
        STAGES[0],
        0.72,
        0.72,
        orbitPhase,
        cameraYaw,
        cameraPitch,
        palette.cream,
        0.22,
      );
      drawOrbit(
        STAGES[1],
        1.05,
        0.12,
        -orbitPhase * 0.85,
        cameraYaw,
        cameraPitch,
        palette.mint,
        0.32,
      );
      drawOrbit(
        STAGES[1],
        0.72,
        1.4,
        orbitPhase * 1.25,
        cameraYaw,
        cameraPitch,
        palette.cream,
        0.16,
      );
      drawOrbit(
        STAGES[2],
        0.78,
        2.22,
        orbitPhase * 0.7,
        cameraYaw,
        cameraPitch,
        palette.cream,
        0.2,
      );

      PROCESS_NODES.forEach((node, index) => {
        drawWorldLine(
          node,
          STAGES[0],
          cameraYaw,
          cameraPitch,
          index === 1 ? palette.mint : palette.line,
          index === 1 ? 0.42 : 0.25,
        );
        drawNode(
          project(node, cameraYaw, cameraPitch, width, height),
          index === 1 ? 4.2 : 3,
          index === 1 ? palette.mint : palette.cream,
          0.78,
        );
      });

      AGENT_NODES.forEach((node, index) => {
        drawWorldLine(
          STAGES[2],
          node,
          cameraYaw,
          cameraPitch,
          index === 4 ? palette.mint : palette.line,
          index === 4 ? 0.46 : 0.26,
        );
        drawNode(
          project(node, cameraYaw, cameraPitch, width, height),
          index === 4 ? 4.2 : 3,
          index === 4 ? palette.mint : palette.cream,
          0.78,
        );
      });

      const pointerStage = clamp(
        Math.round(((pointer.currentX + 1) / 2) * 2),
        0,
        2,
      );
      STAGES.forEach((node, index) => {
        const emphasis = pointer.active && pointerStage === index ? 1.22 : 1;
        const projected = project(node, cameraYaw, cameraPitch, width, height);
        drawGlow(
          projected,
          (index === 1 ? 48 : 34) * projected.scale,
          palette.mint,
          (index === 1 ? 0.18 : 0.11) * emphasis,
        );
        drawNode(
          projected,
          index === 1 ? 12 : 8,
          index === 1 ? palette.mint : palette.cream,
          emphasis,
        );
      });

      const flow = reduceMotion ? 0.58 : (elapsed / 1650) % 1;
      [
        [STAGES[0], STAGES[1]],
        [STAGES[1], STAGES[2]],
      ].forEach(([from, to], pathIndex) => {
        for (let index = 0; index < 3; index += 1) {
          const offset = (flow + index / 3 + pathIndex * 0.12) % 1;
          const point = project(
            curvePoint(from, to, offset),
            cameraYaw,
            cameraPitch,
            width,
            height,
          );
          drawGlow(point, 10 * point.scale, palette.mint, 0.18 + introStrength * 0.08);
          context.save();
          context.beginPath();
          context.arc(point.x, point.y, Math.max(1.3, 2.1 * point.scale), 0, TAU);
          context.globalAlpha = 0.8;
          context.fillStyle = palette.mint;
          context.fill();
          context.restore();
        }
      });
    };

    const scheduleFrame = () => {
      if (!frame && isVisible) frame = window.requestAnimationFrame(renderFrame);
    };

    const renderFrame = (now: number) => {
      frame = 0;
      if (!isVisible) return;

      if (reduceMotion) {
        pointer.currentX = pointer.targetX;
        pointer.currentY = pointer.targetY;
      } else {
        pointer.currentX += (pointer.targetX - pointer.currentX) * 0.1;
        pointer.currentY += (pointer.targetY - pointer.currentY) * 0.1;
      }

      draw(now);

      if (!reduceMotion && !pausedRef.current) scheduleFrame();
    };

    requestFrameRef.current = scheduleFrame;

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const nextWidth = Math.max(1, bounds.width);
      const nextHeight = Math.max(1, bounds.height);
      const nextRatio = Math.min(window.devicePixelRatio || 1, 1.75);

      if (
        nextWidth === width &&
        nextHeight === height &&
        nextRatio === pixelRatio
      ) {
        return;
      }

      width = nextWidth;
      height = nextHeight;
      pixelRatio = nextRatio;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      readPalette();
      scheduleFrame();
    };

    const setPointerTarget = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointer.targetX = clamp(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -1,
        1,
      );
      pointer.targetY = clamp(
        ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
        -1,
        1,
      );
      pointer.active = true;
      scheduleFrame();
    };

    const resetPointer = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
      pointer.active = false;
      scheduleFrame();
    };

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      if (reduceMotion) {
        introStartedAt = performance.now() - 4800;
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
      } else {
        introStartedAt = performance.now();
      }
      scheduleFrame();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) scheduleFrame();
        else if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "80px 0px", threshold: 0.01 },
    );

    canvas.addEventListener("pointermove", setPointerTarget, { passive: true });
    canvas.addEventListener("pointerdown", setPointerTarget, { passive: true });
    canvas.addEventListener("pointerleave", resetPointer, { passive: true });
    canvas.addEventListener("pointercancel", resetPointer, { passive: true });
    motionQuery.addEventListener("change", handleMotionPreference);
    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    resize();
    scheduleFrame();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", setPointerTarget);
      canvas.removeEventListener("pointerdown", setPointerTarget);
      canvas.removeEventListener("pointerleave", resetPointer);
      canvas.removeEventListener("pointercancel", resetPointer);
      motionQuery.removeEventListener("change", handleMotionPreference);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      requestFrameRef.current = null;
    };
  }, []);

  return (
    <figure
      ref={hostRef}
      className={className}
      aria-labelledby="transformation-core-title"
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(360px, 48vw, 520px)",
        minHeight: 360,
        overflow: "hidden",
        isolation: "isolate",
        border: "1px solid var(--core-border, rgba(246, 240, 223, 0.14))",
        borderRadius: "clamp(22px, 4vw, 34px)",
        background:
          "radial-gradient(circle at 50% 42%, rgba(185, 244, 93, 0.075), transparent 38%), linear-gradient(145deg, var(--core-bg, #07100d), #0a1712)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.05), 0 28px 80px rgba(0,0,0,0.2)",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          touchAction: "pan-y",
          cursor: "crosshair",
        }}
      />

      <figcaption
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "clamp(16px, 3vw, 26px)",
          color: "var(--core-cream, #f6f0df)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <p
            id="transformation-core-title"
            className="core-title"
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {copy.title}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            <p
              className="core-instruction"
              style={{
                margin: 0,
                color: "var(--core-muted, #9eaa9d)",
                fontSize: 11,
                lineHeight: 1.25,
                letterSpacing: "0.02em",
                textAlign: "right",
              }}
            >
              {copy.instruction} <span aria-hidden="true">↗</span>
            </p>
            <button
              className="core-motion-toggle"
              type="button"
              aria-pressed={isPaused}
              aria-label={isPaused ? copy.resumeLabel : copy.pauseLabel}
              onClick={toggleMotion}
            >
              <span aria-hidden="true">{isPaused ? "▶" : "Ⅱ"}</span>
              {isPaused ? copy.resume : copy.pause}
            </button>
          </div>
        </div>

        <ol
          aria-label={copy.sequenceLabel}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "clamp(6px, 1.5vw, 12px)",
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {copy.stages.map(([number, title, detail]) => (
            <li
              key={title}
              style={{
                minWidth: 0,
                padding: "clamp(10px, 2vw, 14px)",
                border: "1px solid var(--core-border, rgba(246, 240, 223, 0.13))",
                borderRadius: 14,
                background: "rgba(5, 13, 10, 0.72)",
                WebkitBackdropFilter: "blur(12px)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  marginBottom: 7,
                  color: "var(--core-mint, #b9f45d)",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                }}
              >
                {number}
              </span>
              <strong
                style={{
                  display: "block",
                  overflow: "hidden",
                  fontSize: "clamp(11px, 2vw, 14px)",
                  fontWeight: 650,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  textOverflow: "ellipsis",
                }}
              >
                {title}
              </strong>
              <span
                style={{
                  display: "block",
                  marginTop: 5,
                  overflow: "hidden",
                  color: "var(--core-muted, #9eaa9d)",
                  fontSize: "clamp(9px, 1.55vw, 11px)",
                  lineHeight: 1.2,
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {detail}
              </span>
            </li>
          ))}
        </ol>
      </figcaption>

      <p style={visuallyHiddenStyle()}>{copy.description}</p>
    </figure>
  );
}

export default TransformationCore;
