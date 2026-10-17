import type { Metadata } from "next";
import { alternatesFor, OG_LOCALE } from "@/i18n/config";
import type { Locale } from "@/lib/audit/types";

export const SITE_NAME = "NBT Labs";
export const SITE_URL = "https://www.nbtlabs.ca";

/**
 * Site-level description and social image alt text, per locale.
 *
 * These feed the root layout and every page that does not override them, so
 * leaving them English-only would put an English <meta description> and an
 * English og:image alt on every French page — invisible on screen, very
 * visible in a search result and to a screen reader.
 */
export const SITE_DESCRIPTION: Record<Locale, string> = {
  fr: "NBT Labs aide les PME du Québec et du Canada à améliorer leurs opérations, à implanter Odoo, à automatiser leurs flux de travail et à appliquer une IA agentique concrète à leurs données d'affaires.",
  en: "NBT Labs helps Quebec and Canadian SMBs improve operations, implement Odoo, automate workflows, and apply practical agentic AI to live business data.",
};

/** Kept for any caller that has not been given a locale yet. */
export const DEFAULT_DESCRIPTION = SITE_DESCRIPTION.fr;

const SOCIAL_IMAGE_ALT: Record<Locale, string> = {
  fr: "NBT Labs, transformation numérique axée sur les processus : processus, Odoo, automatisation et IA agentique.",
  en: "NBT Labs process-first digital transformation: process, Odoo, automation, and agentic AI.",
};

const socialImage = (locale: Locale) => ({
  url: "/og.png",
  width: 1731,
  height: 909,
  alt: SOCIAL_IMAGE_ALT[locale],
});

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  /**
   * Which language this page's copy is in. Defaults to French, matching the
   * site default. The seven marketing pages still pass nothing because their
   * copy is being translated in a separate pass — once a page has a French
   * version this should be set from the route's params.
   */
  locale?: Locale;
};

export function createPageMetadata({
  title,
  description,
  path,
  locale = "fr",
}: PageMetadataInput): Metadata {
  const alt = alternatesFor(path);
  const canonical = new URL(
    locale === "fr" ? alt.canonical : `/${locale}${path === "/" ? "" : path}`,
    SITE_URL,
  ).toString();
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      // hreflang for both locales. Required for a bilingual site to be
      // indexed correctly, and cheap to get right at the source.
      languages: Object.fromEntries(
        Object.entries(alt.languages).map(([tag, p]) => [
          tag,
          new URL(p, SITE_URL).toString(),
        ]),
      ),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      type: "website",
      images: [socialImage(locale)],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/og.png"],
    },
  };
}

export const organizationSchemaFor = (locale: Locale) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/nbt-logo-mark.png`,
      email: "info@nbtlabs.ca",
      description: SITE_DESCRIPTION[locale],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Montréal",
        addressRegion: "QC",
        addressCountry: "CA",
      },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Quebec" },
        { "@type": "Country", name: "Canada" },
      ],
      knowsLanguage: ["en", "fr"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: "NBT",
      inLanguage: locale === "fr" ? "fr-CA" : "en-CA",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
});
