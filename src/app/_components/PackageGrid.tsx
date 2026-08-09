import { servicePackages } from "../_data/site";

type PackageGridProps = {
  limit?: number;
};

export function PackageGrid({ limit }: PackageGridProps) {
  const packages = limit ? servicePackages.slice(0, limit) : servicePackages;

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
            {item.featured ? <span className="mini-badge">Popular start</span> : null}
          </div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <div className="package-meta">
            <div>
              <span>Typical timing</span>
              <strong>{item.timing}</strong>
            </div>
            <div>
              <span>Typical fixed fee</span>
              <strong>{item.price}</strong>
            </div>
          </div>
          <ul className="check-list">
            {item.includes.map((include) => (
              <li key={include}>{include}</li>
            ))}
          </ul>
          <a className="text-link" href="/contact">
            Scope this package <span aria-hidden="true">→</span>
          </a>
        </article>
      ))}
    </div>
  );
}
