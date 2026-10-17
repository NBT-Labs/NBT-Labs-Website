/* eslint-disable @next/next/no-img-element -- brand asset is already optimized. */


import { localePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/lib/audit/types";

type Props = {
  locale: Locale;
  nav: Dictionary["nav"];
  footer: Dictionary["footer"];
};

export function SiteFooter({ locale, nav, footer }: Props) {
  const href = (path: string) => localePath(locale, path);

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <a className="brand brand-light" href={href("/")}>
            <span className="brand-mark" aria-hidden="true">
              <img src="/nbt-logo-mark.png" alt="" />
            </span>
            <span className="brand-wordmark">NBT LABS</span>
          </a>
          <p>{footer.tagline}</p>
        </div>
        <div className="footer-links" aria-label={footer.navLabel}>
          {nav.map((item) => (
            <a key={item.href} href={href(item.href)}>
              {item.label}
            </a>
          ))}
          <a href={href("/get-in-touch")}>{footer.contact}</a>
          <a href={href("/privacy")}>{footer.privacy}</a>
        </div>
        <div className="footer-contact">
          <span>{footer.contactLead}</span>
          <a href="mailto:info@nbtlabs.ca">info@nbtlabs.ca</a>
          <p>{footer.place}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {footer.rights}
        </span>
        <span>{footer.closing}</span>
      </div>
    </footer>
  );
}
