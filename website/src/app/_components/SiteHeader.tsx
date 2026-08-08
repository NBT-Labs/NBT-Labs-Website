"use client";

/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element -- keep full document navigation; brand asset is already optimized. */

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShimmerButton } from "@/registry/magicui/shimmer-button";
import { navItems } from "../_data/site";
import { AnimatedThemeToggler } from "./AnimatedThemeToggler";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-shell">
          <a className="brand" href="/" aria-label="NBT Labs, home">
            <span className="brand-mark" aria-hidden="true">
              <img src="/nbt-logo-mark.png" alt="" />
            </span>
            <span className="brand-wordmark">NBT LABS</span>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "is-active" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
          <AnimatedThemeToggler />
          <ShimmerButton
            className="shimmer-button-accent shimmer-button-compact header-cta"
            href="/contact"
            background="#b9f45d"
          >
            Free process audit <span aria-hidden="true">↗</span>
          </ShimmerButton>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            ))}
          <ShimmerButton
            className="shimmer-button-accent"
            href="/contact"
            background="#b9f45d"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            Book a Free Process Audit <span aria-hidden="true">↗</span>
          </ShimmerButton>
        </nav>
      </div>
    </>
  );
}
