import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Scorecard } from "../../_components/Scorecard";
import { createPageMetadata } from "../../_data/seo";
import { isLocale } from "@/i18n/config";

const COPY = {
  fr: {
    title: "Fiche d'évaluation des opérations — gratuite, 12 questions",
    description:
      "Douze questions sur la façon dont le travail se fait réellement dans votre PME. Résultat immédiat, sans courriel requis. Pour les entreprises du Québec et du Canada de 10 à 150 employés.",
  },
  en: {
    title: "Operations scorecard — free, 12 questions",
    description:
      "Twelve questions about how the work actually gets done in your business. Instant score, no email required. For Quebec and Canadian companies of 10 to 150 people.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : "fr";
  return createPageMetadata({ ...COPY[active], path: "/scorecard", locale: active });
}

export default async function ScorecardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Scorecard locale={locale} />;
}
