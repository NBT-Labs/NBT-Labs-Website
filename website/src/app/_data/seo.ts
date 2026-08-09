import type { Metadata } from "next";

export const SITE_NAME = "NBT Labs";
export const SITE_URL = "https://www.nbtlabs.ca";

export const DEFAULT_DESCRIPTION =
  "NBT Labs helps Quebec and Canadian SMBs improve operations, implement Odoo, automate workflows, and apply practical agentic AI to live business data.";

const SOCIAL_IMAGE = {
  url: "/og.png",
  width: 1731,
  height: 909,
  alt: "NBT Labs process-first digital transformation: process, Odoo, automation, and agentic AI.",
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_CA",
      type: "website",
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [SOCIAL_IMAGE.url],
    },
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/nbt-logo-mark.png`,
      email: "hello@nbtlabs.ca",
      description: DEFAULT_DESCRIPTION,
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
      inLanguage: "en-CA",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
};
