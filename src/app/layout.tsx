import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "./_components/SiteFooter";
import { SiteHeader } from "./_components/SiteHeader";
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "./_data/seo";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Odoo Consulting & Process Automation in Montreal | NBT Labs",
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
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
    title: "Odoo Consulting & Process Automation in Montreal | NBT Labs",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    type: "website",
    locale: "en_CA",
    siteName: SITE_NAME,
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "NBT Labs process-first digital transformation: process, Odoo, automation, and agentic AI.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Odoo Consulting & Process Automation in Montreal | NBT Labs",
    description: DEFAULT_DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f5f0e6" data-theme-color />
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteHeader />
        <main id="main-content" className="page-shell">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
