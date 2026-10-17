import type { Locale } from "@/lib/audit/types";

/**
 * UI strings for the site chrome and the scorecard.
 *
 * Page body copy is NOT here — it stays in the page components, which are
 * being localized separately so the French marketing copy can be reviewed on
 * its own rather than buried in a diff with middleware changes.
 *
 * The question wording lives in content/audit/banks/ and reaches the UI
 * through the generated quiz bundle. Never duplicate a question string here.
 */

export type Dictionary = {
  nav: { href: string; label: string }[];
  chrome: {
    skipToContent: string;
    brandHome: string;
    primaryNav: string;
    mobileNav: string;
    openNav: string;
    closeNav: string;
    headerCta: string;
    mobileCta: string;
    switchTo: string;
    switchToLabel: string;
  };
  footer: {
    tagline: string;
    navLabel: string;
    contactLead: string;
    place: string;
    rights: string;
    closing: string;
    privacy: string;
    contact: string;
  };
  scorecard: {
    /* Landing */
    eyebrow: string;
    title: string;
    lead: string;
    start: string;
    resume: string;
    restart: string;
    /* Flow */
    /** Template with {n} and {total}. A plain string, not a function:
     *  functions cannot cross the server/client component boundary. */
    questionOf: string;
    back: string;
    next: string;
    seeResult: string;
    dontKnow: string;
    enterNumber: string;
    /* Result */
    resultEyebrow: string;
    yourIndex: string;
    outOf: string;
    pillarHeading: string;
    whatThisMeans: string;
    coverageNote: string;
    cappedBy: string;
    /* Gate */
    gateHeading: string;
    gateLead: string;
    gateBullets: string[];
    name: string;
    company: string;
    workEmail: string;
    phone: string;
    optional: string;
    consentResult: string;
    consentMarketing: string;
    consentNote: string;
    send: string;
    sending: string;
    sent: string;
    sentDetail: string;
    error: string;
    bookInstead: string;
    privacyLine: string;
  };
};

const fr: Dictionary = {
  nav: [
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Tarifs" },
    { href: "/how-we-work", label: "Notre approche" },
    { href: "/who-we-help", label: "Qui nous aidons" },
    { href: "/why-nbt", label: "Pourquoi NBT" },
    { href: "/case-studies", label: "Résultats" },
  ],
  chrome: {
    skipToContent: "Passer au contenu",
    brandHome: "NBT Labs, accueil",
    primaryNav: "Navigation principale",
    mobileNav: "Navigation mobile",
    openNav: "Ouvrir la navigation",
    closeNav: "Fermer la navigation",
    headerCta: "Audit gratuit",
    mobileCta: "Audit gratuit",
    switchTo: "English",
    switchToLabel: "Voir ce site en anglais",
  },
  footer: {
    tagline:
      "Transformation numérique axée sur les processus pour les PME du Québec et du Canada.",
    navLabel: "Navigation du pied de page",
    contactLead: "Commencez par le goulot d'étranglement.",
    place: "Montréal, Québec · français et anglais",
    rights: "NBT Labs",
    closing: "Conçu autour d'un meilleur travail.",
    privacy: "Confidentialité",
    contact: "Nous joindre",
  },
  scorecard: {
    eyebrow: "Fiche d'évaluation · gratuite",
    title: "Où en sont vraiment vos opérations?",
    lead: "Douze questions sur la façon dont le travail se fait réellement chez vous. Pas d'opinions à donner, pas de jargon : on vous demande ce qui se passe concrètement. Votre résultat s'affiche à la fin, sans courriel à fournir.",
    start: "Commencer",
    resume: "Reprendre où j'étais",
    restart: "Recommencer",
    questionOf: "Question {n} sur {total}",
    back: "Retour",
    next: "Suivant",
    seeResult: "Voir mon résultat",
    dontKnow: "Je ne sais pas",
    enterNumber: "Entrez un nombre",
    resultEyebrow: "Votre résultat",
    yourIndex: "Indice de maturité des opérations",
    outOf: "sur 100",
    pillarHeading: "Par domaine",
    whatThisMeans: "Ce que ça veut dire",
    coverageNote: "Portée de ce résultat",
    cappedBy: "Plafonné par",
    gateHeading: "Le détail, et ce que ça vous coûte",
    gateLead:
      "Votre résultat ci-dessus est à vous, peu importe ce que vous faites ensuite. Si vous voulez l'analyse, dites-nous où l'envoyer.",
    gateBullets: [
      "Votre score domaine par domaine, du plus faible au plus fort",
      "Une estimation en fourchette du coût annuel de la façon de travailler actuelle, avec le calcul visible",
      "L'ordre dans lequel nous nous y attaquerions, et ce que nous laisserions tranquille",
    ],
    name: "Nom",
    company: "Entreprise",
    workEmail: "Courriel professionnel",
    phone: "Téléphone",
    optional: "Facultatif",
    consentResult:
      "Envoyez-moi mon analyse détaillée par courriel.",
    consentMarketing:
      "Vous pouvez aussi m'écrire occasionnellement au sujet de vos services. (Facultatif — votre analyse vous sera envoyée dans tous les cas.)",
    consentNote:
      "Deux cases distinctes parce que ce sont deux usages distincts. Vous pouvez accepter le premier et refuser le second.",
    send: "Envoyez-moi l'analyse",
    sending: "Envoi en cours…",
    sent: "C'est parti.",
    sentDetail:
      "Vérifiez votre boîte de réception. Si rien n'arrive dans quelques minutes, écrivez-nous directement à info@nbtlabs.ca.",
    error:
      "L'envoi a échoué. Votre résultat reste affiché ci-dessus — écrivez-nous à info@nbtlabs.ca et nous vous l'enverrons à la main.",
    bookInstead: "Parlons-en plutôt de vive voix",
    privacyLine:
      "Nous conservons vos réponses et vos coordonnées pour produire cette analyse et faire le suivi. Nous ne les vendons pas et ne les partageons pas. Écrivez-nous pour y accéder ou les faire supprimer.",
  },
};

const en: Dictionary = {
  nav: [
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/how-we-work", label: "How we work" },
    { href: "/who-we-help", label: "Who we help" },
    { href: "/why-nbt", label: "Why NBT" },
    { href: "/case-studies", label: "Results" },
  ],
  chrome: {
    skipToContent: "Skip to content",
    brandHome: "NBT Labs, home",
    primaryNav: "Primary navigation",
    mobileNav: "Mobile navigation",
    openNav: "Open navigation",
    closeNav: "Close navigation",
    headerCta: "Free Audit",
    mobileCta: "Free Audit",
    switchTo: "Français",
    switchToLabel: "View this site in French",
  },
  footer: {
    tagline: "Process-led digital transformation for Quebec and Canadian SMBs.",
    navLabel: "Footer navigation",
    contactLead: "Start with the bottleneck.",
    place: "Montréal, Québec · French & English",
    rights: "NBT Labs",
    closing: "Built around better work.",
    privacy: "Privacy",
    contact: "Contact us",
  },
  scorecard: {
    eyebrow: "Scorecard · free",
    title: "Where do your operations actually stand?",
    lead: "Twelve questions about how the work really gets done. No opinions to give, no jargon — we ask what actually happens. Your score appears at the end, with no email required.",
    start: "Start",
    resume: "Pick up where I left off",
    restart: "Start over",
    questionOf: "Question {n} of {total}",
    back: "Back",
    next: "Next",
    seeResult: "See my result",
    dontKnow: "I don't know",
    enterNumber: "Enter a number",
    resultEyebrow: "Your result",
    yourIndex: "Operations Maturity Index",
    outOf: "out of 100",
    pillarHeading: "By area",
    whatThisMeans: "What this means",
    coverageNote: "What this score covers",
    cappedBy: "Capped by",
    gateHeading: "The detail, and what it's costing you",
    gateLead:
      "The score above is yours whatever you do next. If you want the analysis behind it, tell us where to send it.",
    gateBullets: [
      "Your score area by area, weakest first",
      "A range estimate of what the current way of working costs you per year, with the arithmetic shown",
      "The order we'd tackle it in, and what we'd leave alone",
    ],
    name: "Name",
    company: "Company",
    workEmail: "Work email",
    phone: "Phone",
    optional: "Optional",
    consentResult: "Email me my detailed analysis.",
    consentMarketing:
      "You can also write to me occasionally about your services. (Optional — your analysis is sent either way.)",
    consentNote:
      "Two separate boxes because these are two separate purposes. You can say yes to the first and no to the second.",
    send: "Send me the analysis",
    sending: "Sending…",
    sent: "On its way.",
    sentDetail:
      "Check your inbox. If nothing arrives in a few minutes, write to info@nbtlabs.ca and we'll send it by hand.",
    error:
      "That didn't send. Your result is still on screen above — write to info@nbtlabs.ca and we'll send the analysis manually.",
    bookInstead: "I'd rather just talk it through",
    privacyLine:
      "We keep your answers and your contact details to produce this analysis and to follow up. We don't sell or share them. Write to us to see them or have them deleted.",
  },
};

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.fr;
}

/** Pull the right side out of an {en, fr} pair from the question bank. */
export function t(
  value: { en: string; fr: string } | undefined,
  locale: Locale,
): string {
  if (!value) return "";
  return value[locale] ?? value.fr ?? value.en;
}

/** Fill {placeholders} in a dictionary template. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}
