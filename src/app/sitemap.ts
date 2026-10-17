import type { MetadataRoute } from "next";
import { LOCALES, localePath } from "@/i18n/config";
import { SITE_URL } from "./_data/seo";

/**
 * Generated sitemap, replacing the old static public/sitemap.xml.
 *
 * That file had to go: it listed only the unprefixed URLs (/services,
 * /pricing …), and every one of those now 308-redirects to a locale. A
 * sitemap full of redirects is worse than no sitemap, and it was missing
 * /scorecard and /privacy entirely.
 *
 * Generating it also means adding a page can't silently leave the sitemap
 * stale — the route list below is the one place to edit.
 *
 * Each entry carries `alternates.languages`, which is how a search engine is
 * told that /fr/services and /en/services are the same page in two
 * languages rather than duplicates competing with each other. That matters
 * more here than on a monolingual site.
 *
 * Served at /sitemap.xml. The proxy matcher excludes paths containing a dot,
 * so this is not redirected into a locale.
 */

type Route = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

const ROUTES: Route[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  // The scorecard is the top of the funnel and the ad landing page, so it
  // ranks alongside the home page rather than with the brochure pages.
  { path: "/scorecard", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
  { path: "/get-in-touch", priority: 0.7, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/how-we-work", priority: 0.8, changeFrequency: "monthly" },
  { path: "/who-we-help", priority: 0.8, changeFrequency: "monthly" },
  { path: "/why-nbt", priority: 0.7, changeFrequency: "monthly" },
  { path: "/case-studies", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: new URL(localePath(locale, route.path), SITE_URL).toString(),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((alt) => [
            alt === "fr" ? "fr-CA" : "en-CA",
            new URL(localePath(alt, route.path), SITE_URL).toString(),
          ]),
        ),
      },
    })),
  );
}
