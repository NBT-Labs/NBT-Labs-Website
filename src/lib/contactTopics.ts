import type { I18nString } from "@/lib/audit/types";

/** Topics on the general contact form. The key is what is submitted; the English label goes into the Odoo lead. */
export const CONTACT_TOPICS: Record<string, I18nString> = {
  general: { en: "General question", fr: "Question générale" },
  partnership: { en: "Partnership", fr: "Partenariat" },
  careers: { en: "Careers", fr: "Carrières" },
  other: { en: "Other", fr: "Autre" },
};
