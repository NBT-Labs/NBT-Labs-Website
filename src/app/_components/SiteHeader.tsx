/* eslint-disable @next/next/no-img-element -- brand asset is already optimized. */

"use client";


import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShimmerButton } from "@/registry/magicui/shimmer-button";
import { LOCALE_COOKIE, localePath, otherLocale, stripLocale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/audit/types";
import { AnimatedThemeToggler } from "./AnimatedThemeToggler";

type Props = {
  locale: Locale;
  nav: Dictionary["nav"];
  chrome: Dictionary["chrome"];
};

export function SiteHeader({ locale, nav, chrome }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const href = (path: string) => localePath(locale, path);
  const bare = stripLocale(pathname ?? "/");
  const other = otherLocale(locale);

  /**
   * The switcher lands on the same page in the other language and records the
   * choice, so a bare-path visit later resolves the same way. It is a plain
   * link rather than a client transition on purpose — the rest of this site
   * navigates with full document loads.
   */
  const onSwitch = () => {
    try {
      document.cookie = `${LOCALE_COOKIE}=${other}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    } catch {
      // Cookies can be blocked; the link still works, the preference just
      // isn't remembered.
    }
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        {chrome.skipToContent}
      </a>
      <header className="site-header">
        <div className="header-shell">
          <a className="brand" href={href("/")} aria-label={chrome.brandHome}>
            <span className="brand-mark" aria-hidden="true">
              <img src="/nbt-logo-mark.png" alt="" />
            </span>
            <span className="brand-wordmark">NBT LABS</span>
          </a>

          <nav className="desktop-nav" aria-label={chrome.primaryNav}>
            {nav.map((item) => (
              <a
                key={item.href}
                href={href(item.href)}
                className={bare === item.href ? "is-active" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a
              className="locale-switch"
              href={localePath(other, bare)}
              hrefLang={other}
              aria-label={chrome.switchToLabel}
              onClick={onSwitch}
            >
              {chrome.switchTo}
            </a>
            <AnimatedThemeToggler />
            <ShimmerButton
              className="shimmer-button-accent shimmer-button-compact header-cta"
              href={href("/scorecard")}
              background="#b9f45d"
            >
              {chrome.headerCta} <span aria-hidden="true">↗</span>
            </ShimmerButton>

            <button
              className="menu-toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? chrome.closeNav : chrome.openNav}
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
        <nav aria-label={chrome.mobileNav}>
          {nav.map((item, index) => (
            <a
              key={item.href}
              href={href(item.href)}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
          <a
            href={localePath(other, bare)}
            hrefLang={other}
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => {
              onSwitch();
              setMenuOpen(false);
            }}
          >
            <span>{String(nav.length + 1).padStart(2, "0")}</span>
            {chrome.switchTo}
          </a>
          <ShimmerButton
            className="shimmer-button-accent"
            href={href("/scorecard")}
            background="#b9f45d"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            {chrome.mobileCta} <span aria-hidden="true">↗</span>
          </ShimmerButton>
        </nav>
      </div>
    </>
  );
}
