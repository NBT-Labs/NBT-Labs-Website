import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE,
  isLocale,
} from "@/i18n/config";
import type { Locale } from "@/lib/audit/types";

/**
 * Every page lives under /fr or /en. A request without a locale prefix is
 * redirected to one, chosen by: an explicit cookie first (the visitor used the
 * switcher), then Accept-Language, then French.
 *
 * The redirect is permanent so that the authority on already-indexed URLs like
 * /services transfers to /en/services. Expect a short re-crawl dip.
 */

const PUBLIC_FILE = /\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml|json|webmanifest|css|js|map|woff2?)$/i;

function fromAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) return undefined;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      return {
        tag: tag.trim().toLowerCase(),
        q: q ? Number(q.slice(2)) || 0 : 1,
      };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (primary === "fr") return "fr";
    if (primary === "en") return "en";
  }
  return undefined;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const first = pathname.split("/").filter(Boolean)[0];
  if (first && isLocale(first)) {
    // Already localized. Remember the choice so the next bare-path visit and
    // any shared link from this person lands in the same language.
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== first) {
      response.cookies.set(LOCALE_COOKIE, first, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale: Locale =
    (cookie && isLocale(cookie) ? cookie : undefined) ??
    fromAcceptLanguage(request.headers.get("accept-language")) ??
    DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    // Everything except Next internals, the API, and files with an extension.
    "/((?!_next|api|.*\\.).*)",
  ],
};

export const SUPPORTED = LOCALES;
