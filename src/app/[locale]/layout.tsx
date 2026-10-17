import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "../_components/SiteFooter";
import { SiteHeader } from "../_components/SiteHeader";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../_data/seo";
import { HTML_LANG, LOCALES, OG_LOCALE, alternatesFor, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/audit/types";
import { notFound } from "next/navigation";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const themeInitializationScript = `
  (function () {
    try {
      var savedTheme = window.localStorage.getItem("nbt-theme");
      var preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      var theme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : preferredTheme;
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (error) {
      document.documentElement.dataset.theme = "light";
      document.documentElement.style.colorScheme = "light";
    }
  })();
`;

/**
 * Site-wide title, per locale. This is the fallback used anywhere a page does
 * not set its own, and it feeds the Open Graph and Twitter cards. Leaving it
 * English would put an English title on the French share card.
 */
const SITE_TITLE: Record<Locale, string> = {
  fr: "Consultation Odoo et automatisation des processus à Montréal | NBT Labs",
  en: "Odoo Consulting & Process Automation in Montreal | NBT Labs",
};

const SOCIAL_ALT: Record<Locale, string> = {
  fr: "NBT Labs, transformation numérique axée sur les processus : processus, Odoo, automatisation et IA agentique.",
  en: "NBT Labs process-first digital transformation: process, Odoo, automation, and agentic AI.",
};

function baseMetadataFor(locale: Locale): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_TITLE[locale],
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION[locale],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: SITE_TITLE[locale],
      description: SITE_DESCRIPTION[locale],
      type: "website",
      locale: OG_LOCALE[locale],
      siteName: SITE_NAME,
      images: [
        { url: "/og.png", width: 1731, height: 909, alt: SOCIAL_ALT[locale] },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE[locale],
      description: SITE_DESCRIPTION[locale],
      images: ["/og.png"],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={HTML_LANG[locale]} data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f5f0e6" data-theme-color />
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteHeader locale={locale} nav={dict.nav} chrome={dict.chrome} />
        <main id="main-content" className="page-shell">
          {children}
        </main>
        <SiteFooter locale={locale} nav={dict.nav} footer={dict.footer} />
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : "fr";
  const alt = alternatesFor("/");
  const base = baseMetadataFor(active);

  return {
    ...base,
    alternates: {
      canonical: new URL(alt.canonical, SITE_URL).toString(),
      languages: Object.fromEntries(
        Object.entries(alt.languages).map(([tag, path]) => [
          tag,
          new URL(path, SITE_URL).toString(),
        ]),
      ),
    },
    openGraph: {
      ...base.openGraph,
      locale: OG_LOCALE[active],
      url: new URL(alt.canonical, SITE_URL).toString(),
    },
  };
}
