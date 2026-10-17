
/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element -- keep full document navigation; brand asset is already optimized. */

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/who-we-help", label: "Who we help" },
  { href: "/why-nbt", label: "Why NBT" },
  { href: "/case-studies", label: "Results" },
  { href: "/get-in-touch", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <a className="brand brand-light" href="/">
            <span className="brand-mark" aria-hidden="true">
              <img src="/nbt-logo-mark.png" alt="" />
            </span>
            <span className="brand-wordmark">NBT LABS</span>
          </a>
          <p>
            Process-led digital transformation for Quebec and Canadian SMBs.
          </p>
        </div>
        <div className="footer-links" aria-label="Footer navigation">
          {footerLinks.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="footer-contact">
          <span>Start with the bottleneck.</span>
          <a href="mailto:info@nbtlabs.ca">info@nbtlabs.ca</a>
          <p>Montréal, Québec · French & English</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NBT Labs</span>
        <span>Built around better work.</span>
      </div>
    </footer>
  );
}
