import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { Highlighter } from "@/registry/magicui/highlighter";
import { isLocale } from "@/i18n/config";
import { ContactForm } from "../../_components/ContactForm";
import { PageHero } from "../../_components/PageHero";
import { ViewportReveal } from "../../_components/ViewportReveal";
import { createPageMetadata } from "../../_data/seo";

const COPY = {
  fr: {
    title: "Nous joindre",
    description:
      "Questions, partenariats ou carrières : écrivez à NBT Labs et on vous répond en un jour ouvrable, en français ou en anglais.",
    heroEyebrow: "Nous joindre · Montréal",
    heroLead: "Une question, une idée, ou",
    heroHighlight: "juste dire bonjour.",
    heroDescription:
      "Pas encore prêt pour un audit? Écrivez-nous pour n'importe quoi : une question, une idée de partenariat ou un poste. Une vraie personne lit chaque message.",
    heroPrimary: "Nous écrire",
    heroSecondary: "Faire plutôt l'audit gratuit",
    replyEyebrow: "Comment on répond",
    reply1: "Votre message va directement aux fondateurs, pas dans une file de billets.",
    reply2: "On répond en un jour ouvrable, en français ou en anglais.",
    reply3: "Si ça devient un projet, on vous proposera l'audit gratuit comme prochaine étape.",
    emailPrompt: "Vous préférez le courriel?",
    place: "Montréal · français et anglais",
  },
  en: {
    title: "Contact NBT Labs",
    description:
      "Questions, partnerships, or careers: send NBT Labs a message and we will reply within one business day, in French or English.",
    heroEyebrow: "Contact · Montréal",
    heroLead: "Questions, ideas, or",
    heroHighlight: "just saying hi.",
    heroDescription:
      "Not ready for an audit yet? Send us a note about anything: a question, a partnership idea, or a role you'd like to discuss. A real person reads every message.",
    heroPrimary: "Write to us",
    heroSecondary: "Take the free audit instead",
    replyEyebrow: "How we reply",
    reply1: "Your message goes straight to the founders, not a ticket queue.",
    reply2: "We reply within one business day, in French or English.",
    reply3: "If it turns into a project, we'll suggest the free audit as the next step.",
    emailPrompt: "Prefer email?",
    place: "Montréal · French & English",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : "fr";
  const { title, description } = COPY[active];
  return createPageMetadata({ title, description, path: "/get-in-touch", locale: active });
}

export default async function GetInTouchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = COPY[locale];

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={copy.heroEyebrow}
        variant="inquiry"
        title={
          <>
            {copy.heroLead}{" "}
            <Highlighter
              action="highlight"
              animationDuration={980}
              drawDelay={620}
              color="#b9f45d"
              isView
              className="hero-word-highlight"
            >
              {copy.heroHighlight}
            </Highlighter>
          </>
        }
        description={copy.heroDescription}
        primary={{ href: "#contact-form", label: copy.heroPrimary }}
        secondary={{ href: "/scorecard", label: copy.heroSecondary }}
        compact
      />

      <section className="contact-section section-pad">
        <div className="contact-aside">
          <TextAnimate as="p" animation="slideLeft" by="character" className="eyebrow" once>
            {copy.replyEyebrow}
          </TextAnimate>
          <ol>
            <ViewportReveal as="li">
              <TextAnimate as="span" animation="wavy" by="character" once>01</TextAnimate>
              <p>{copy.reply1}</p>
            </ViewportReveal>
            <ViewportReveal as="li" delay={0.08}>
              <TextAnimate as="span" animation="wavy" by="character" once>02</TextAnimate>
              <p>{copy.reply2}</p>
            </ViewportReveal>
            <ViewportReveal as="li" delay={0.16}>
              <TextAnimate as="span" animation="wavy" by="character" once>03</TextAnimate>
              <p>{copy.reply3}</p>
            </ViewportReveal>
          </ol>
          <ViewportReveal className="direct-email" delay={0.08}>
            <span>{copy.emailPrompt}</span>
            <a href="mailto:info@nbtlabs.ca">info@nbtlabs.ca</a>
            <small>{copy.place}</small>
          </ViewportReveal>
        </div>
        <ViewportReveal className="contact-form-reveal" variant="scale">
          <ContactForm locale={locale} />
        </ViewportReveal>
      </section>
    </>
  );
}
