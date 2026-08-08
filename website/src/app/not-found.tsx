
/* eslint-disable @next/next/no-html-link-for-pages -- keep full document navigation. */

export default function NotFound() {
  return (
    <section className="not-found-page">
      <p className="eyebrow eyebrow-light">404 · Wrong turn</p>
      <h1>This process has no next step.</h1>
      <p>The page you were looking for moved, changed, or never existed.</p>
      <a className="button button-light" href="/">
        Return home <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
