import { servicePackages } from "../_data/site";
import { localePath } from "@/i18n/config";
import type { Locale } from "@/lib/audit/types";

type PackageGridProps = {
  locale: Locale;
  limit?: number;
};

const LABELS = {
  fr: {
    popularStart: "Départ populaire",
    typicalTiming: "Délai de livraison typique",
    typicalFee: "Honoraires fixes typiques",
    scopeThis: "Définir la portée de ce forfait",
  },
  en: {
    popularStart: "Popular start",
    typicalTiming: "Typical timing",
    typicalFee: "Typical fixed fee",
    scopeThis: "Scope this package",
  },
} as const;

export function PackageGrid({ locale, limit }: PackageGridProps) {
  const all = servicePackages[locale];
  const packages = limit ? all.slice(0, limit) : all;
  const labels = LABELS[locale];

  return (
    <div className="package-grid">
      {packages.map((item, index) => (
        <article
          className={`package-card${item.featured ? " package-featured" : ""}`}
          key={item.name}
        >
          <div className="package-card-head">
            <span className="package-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            {item.featured ? <span className="mini-badge">{labels.popularStart}</span> : null}
          </div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <div className="package-meta">
            <div>
              <span>{labels.typicalTiming}</span>
              <strong>{item.timing}</strong>
            </div>
            <div>
              <span>{labels.typicalFee}</span>
              <strong>{item.price}</strong>
            </div>
          </div>
          <ul className="check-list">
            {item.includes.map((include) => (
              <li key={include}>{include}</li>
            ))}
          </ul>
          <a className="text-link" href={localePath(locale, "/contact")}>
            {labels.scopeThis} <span aria-hidden="true">→</span>
          </a>
        </article>
      ))}
    </div>
  );
}
