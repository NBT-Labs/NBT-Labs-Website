"use client";

import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type ScrollScrubGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  spotlight?: boolean;
  variant: "cards" | "stack";
};

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const smooth = (value: number) => value * value * (3 - 2 * value);

export function ScrollScrubGroup({
  children,
  className = "",
  spotlight = false,
  variant,
  ...props
}: ScrollScrubGroupProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const items = Array.from(root.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement,
    );
    const spotlightCleanups: Array<() => void> = [];
    let frame = 0;

    if (spotlight && variant === "cards") {
      const clearActiveCard = (item: HTMLElement, force = false) => {
        if (!force && item.matches(":focus-within")) return;

        item.removeAttribute("data-spotlight-active");
        item.style.setProperty("--spotlight-opacity", "0");
        item.style.setProperty("--spotlight-rotate-x", "0deg");
        item.style.setProperty("--spotlight-rotate-y", "0deg");
        item.style.setProperty("--spotlight-lift", "0px");

        if (!root.querySelector('[data-spotlight-active="true"]')) {
          root.removeAttribute("data-spotlight-active");
        }
      };

      const activateCard = (item: HTMLElement) => {
        items.forEach((candidate) => {
          if (candidate !== item) {
            candidate.removeAttribute("data-spotlight-active");
            candidate.style.setProperty("--spotlight-opacity", "0");
          }
        });
        root.setAttribute("data-spotlight-active", "true");
        item.setAttribute("data-spotlight-active", "true");
        item.style.setProperty("--spotlight-opacity", "1");
        item.style.setProperty("--spotlight-lift", "-6px");
      };

      items.forEach((item) => {
        const handlePointerEnter = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          activateCard(item);
        };
        const handlePointerMove = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const rect = item.getBoundingClientRect();
          const x = clamp((event.clientX - rect.left) / Math.max(rect.width, 1));
          const y = clamp((event.clientY - rect.top) / Math.max(rect.height, 1));
          const tilt = motionPreference.matches ? 0 : 5;

          item.style.setProperty("--spotlight-x", `${(x * 100).toFixed(2)}%`);
          item.style.setProperty("--spotlight-y", `${(y * 100).toFixed(2)}%`);
          item.style.setProperty(
            "--spotlight-rotate-x",
            `${((0.5 - y) * tilt * 2).toFixed(2)}deg`,
          );
          item.style.setProperty(
            "--spotlight-rotate-y",
            `${((x - 0.5) * tilt * 2).toFixed(2)}deg`,
          );
        };
        const handlePointerLeave = () => clearActiveCard(item);
        const handleFocusIn = () => {
          item.style.setProperty("--spotlight-x", "50%");
          item.style.setProperty("--spotlight-y", "46%");
          activateCard(item);
        };
        const handleFocusOut = (event: FocusEvent) => {
          if (
            event.relatedTarget instanceof Node
            && item.contains(event.relatedTarget)
          ) return;
          clearActiveCard(item, true);
        };

        item.addEventListener("pointerenter", handlePointerEnter);
        item.addEventListener("pointermove", handlePointerMove);
        item.addEventListener("pointerleave", handlePointerLeave);
        item.addEventListener("focusin", handleFocusIn);
        item.addEventListener("focusout", handleFocusOut);
        spotlightCleanups.push(() => {
          item.removeEventListener("pointerenter", handlePointerEnter);
          item.removeEventListener("pointermove", handlePointerMove);
          item.removeEventListener("pointerleave", handlePointerLeave);
          item.removeEventListener("focusin", handleFocusIn);
          item.removeEventListener("focusout", handleFocusOut);
        });
      });
    }

    const render = () => {
      frame = 0;
      const viewportHeight = window.innerHeight || 1;
      const rect = root.getBoundingClientRect();
      const reduceMotion = motionPreference.matches;
      const startLine = viewportHeight * (variant === "stack" ? 0.9 : 0.92);
      const endLine = viewportHeight * (variant === "stack" ? 0.36 : 0.52);
      const firstOffset = items[0]?.offsetTop ?? 0;
      const rowMembers = new Map<number, HTMLElement[]>();

      if (variant === "cards") {
        items.forEach((item) => {
          const rowTop = Math.round(item.offsetTop - firstOffset);
          const members = rowMembers.get(rowTop) ?? [];
          members.push(item);
          rowMembers.set(rowTop, members);
        });
      }

      items.forEach((item, index) => {
        const relativeTop = Math.round(item.offsetTop - firstOffset);
        const members = rowMembers.get(relativeTop) ?? [item];
        const lane = members.indexOf(item);
        const laneCount = members.length;
        const order = items.length - 1 - index;
        const rawProgress = reduceMotion
          ? 1
          : variant === "cards"
            ? clamp(
                (startLine - (rect.top + relativeTop))
                  / Math.max(startLine - endLine, 1),
              )
            : clamp(
                (startLine - rect.top) / Math.max(startLine - endLine, 1),
              );
        const itemStart = variant === "stack" ? order * 0.11 : lane * 0.08;
        const itemDuration = variant === "stack" ? 0.56 : 0.72;
        const itemProgress = smooth(clamp(
          (rawProgress - itemStart) / itemDuration,
        ));
        const hidden = 1 - itemProgress;
        const lanePosition = laneCount > 1
          ? lane / (laneCount - 1) - 0.5
          : 0;
        const opacityFloor = variant === "stack" ? 0.1 : 0.15;

        item.style.setProperty(
          "--card-scrub-opacity",
          (opacityFloor + itemProgress * (1 - opacityFloor)).toFixed(4),
        );
        item.style.setProperty(
          "--card-scrub-y",
          `${(hidden * (variant === "stack" ? 34 : 48)).toFixed(2)}px`,
        );
        item.style.setProperty(
          "--card-scrub-x",
          `${(hidden * (variant === "cards" ? lanePosition * 36 : 0)).toFixed(2)}px`,
        );
        item.style.setProperty(
          "--card-scrub-scale",
          ((variant === "stack" ? 0.98 : 0.965)
            + itemProgress * (variant === "stack" ? 0.02 : 0.035)
          ).toFixed(4),
        );
        item.style.setProperty(
          "--card-scrub-blur",
          `${(hidden * (variant === "stack" ? 4 : 6)).toFixed(2)}px`,
        );
      });
    };

    const scheduleRender = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    scheduleRender();
    window.addEventListener("scroll", scheduleRender, { passive: true });
    window.addEventListener("resize", scheduleRender);
    motionPreference.addEventListener("change", scheduleRender);

    const resizeObserver = "ResizeObserver" in window
      ? new ResizeObserver(scheduleRender)
      : null;
    resizeObserver?.observe(root);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleRender);
      window.removeEventListener("resize", scheduleRender);
      motionPreference.removeEventListener("change", scheduleRender);
      resizeObserver?.disconnect();
      spotlightCleanups.forEach((cleanup) => cleanup());
    };
  }, [spotlight, variant]);

  return (
    <div
      {...props}
      ref={rootRef}
      className={className}
      data-scroll-scrub={variant}
      data-spotlight={spotlight || undefined}
    >
      {children}
    </div>
  );
}
