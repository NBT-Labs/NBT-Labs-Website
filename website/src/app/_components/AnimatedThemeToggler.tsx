"use client";

import { useEffect, useState, type MouseEvent } from "react";

type Theme = "light" | "dark";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => {
    ready: Promise<void>;
  };
};

const STORAGE_KEY = "nbt-theme";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function setThemeMeta(theme: Theme) {
  const meta = document.querySelector<HTMLMetaElement>("meta[data-theme-color]");
  if (meta) meta.content = theme === "dark" ? "#07100d" : "#f5f0e6";
}

export function AnimatedThemeToggler() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const syncFrame = window.requestAnimationFrame(() => {
      const currentTheme = readTheme();
      setTheme(currentTheme);
      setThemeMeta(currentTheme);
    });

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystemTheme = (mediaEvent: MediaQueryListEvent) => {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
      const nextTheme: Theme = mediaEvent.matches ? "dark" : "light";
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
      setTheme(nextTheme);
      setThemeMeta(nextTheme);
    };

    systemTheme.addEventListener("change", followSystemTheme);
    return () => {
      window.cancelAnimationFrame(syncFrame);
      systemTheme.removeEventListener("change", followSystemTheme);
    };
  }, []);

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const nextTheme: Theme = readTheme() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const buttonBounds = event.currentTarget.getBoundingClientRect();
    const x = buttonBounds.left + buttonBounds.width / 2;
    const y = buttonBounds.top + buttonBounds.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const applyTheme = () => {
      root.dataset.theme = nextTheme;
      root.style.colorScheme = nextTheme;
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      setTheme(nextTheme);
      setThemeMeta(nextTheme);
    };

    const transitionDocument = document as ViewTransitionDocument;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!transitionDocument.startViewTransition || reduceMotion) {
      applyTheme();
      return;
    }

    const transition = transitionDocument.startViewTransition(applyTheme);

    void transition.ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 720,
          easing: "cubic-bezier(.22, 1, .36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  const nextThemeLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      className="theme-toggle"
      data-theme={theme}
      type="button"
      aria-label={nextThemeLabel}
      aria-pressed={theme === "dark"}
      title={nextThemeLabel}
      onClick={toggleTheme}
    >
      <span className="theme-toggle-icon theme-toggle-sun" aria-hidden="true" />
      <span className="theme-toggle-icon theme-toggle-moon" aria-hidden="true" />
      <span className="theme-toggle-thumb" aria-hidden="true" />
    </button>
  );
}
