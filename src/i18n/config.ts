import type { Locale } from "@/lib/audit/types";

export const LOCALES: readonly Locale[] = ["fr", "en"] as const;

/**
 * French is listed first and is the fallback when a visitor expresses no
 * preference. This is a Montreal company selling into Quebec, and commercial
 * publications available to the public must be in French with any other
 * language on terms no more favourable. Both locales are prefixed (/fr, /en)
 * rather than giving English the bare root, so neither is structurally
 * privileged.
 *
 * Trade-off worth knowing: existing indexed URLs like /services now redirect
 * to /en/services. The middleware issues a permanent redirect so the
 * authority transfers, but expect a short dip while search engines re-crawl.
 */
export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Build a locale-prefixed path. `localePath("fr", "/services")` → "/fr/services". */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Strip the locale prefix back off, for the language switcher. */
export function stripLocale(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length > 0 && isLocale(parts[0])) {
    const rest = parts.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "fr" ? "en" : "fr";
}

/** html lang attribute. */
export const HTML_LANG: Record<Locale, string> = {
  fr: "fr-CA",
  en: "en-CA",
};

/** Open Graph locale. */
export const OG_LOCALE: Record<Locale, string> = {
  fr: "fr_CA",
  en: "en_CA",
};

/**
 * hreflang map for a given path. x-default points at French, matching the
 * default above.
 */
export function alternatesFor(path: string): {
  canonical: string;
  languages: Record<string, string>;
} {
  const bare = stripLocale(path);
  return {
    canonical: localePath(DEFAULT_LOCALE, bare),
    languages: {
      "fr-CA": localePath("fr", bare),
      "en-CA": localePath("en", bare),
      "x-default": localePath(DEFAULT_LOCALE, bare),
    },
  };
}

export const LOCALE_COOKIE = "nbt-locale";
