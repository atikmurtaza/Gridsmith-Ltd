import type { ReactNode } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import styles from './chrome.module.css';

export type Division = 'master' | 'design' | 'digital' | 'press';

/**
 * The document shell, shared by all four root layouts.
 *
 * `data-division` is rendered here, server-side, into the static HTML. It is never set,
 * changed or read by client JavaScript — that is what makes the theme correct in the
 * first paint rather than after hydration (master/PROJECT-RULES.md §3).
 *
 * Four near-identical root layouts would drift the moment Epic M adds the skip link,
 * header, footer and consent banner to all of them. They compose here instead.
 *
 * **The skip link is here; `<main id="main">` is not** (`M-02`, closing `A11Y-21`). Wrapping
 * `children` in a `<main>` here was tried first and is wrong: `global-not-found` renders
 * *inside* this shell — its own `<html>`/`<body>` are dropped as nested tags and its `<main>`
 * survives — so the 404 served two `main` landmarks, one inside the other. axe caught it on
 * the committed 404 probe (`landmark-no-duplicate-main`, `landmark-main-is-top-level`,
 * `landmark-unique`, ×4 route/viewport combinations), which is what that probe is for.
 *
 * So the target stays with the document that owns the landmark, and `check-axe` asserts on
 * every themed route that the first focusable element is a same-page link, that its target
 * exists, that it takes focus and that it is on screen once focused. A page that adds a
 * `<main>` without the id fails there rather than shipping a bypass link to nowhere.
 */
export function RootShell({
  division,
  fontVariables,
  children,
}: {
  division: Division;
  fontVariables: string;
  children: ReactNode;
}) {
  return (
    <html lang="en-GB" className={fontVariables}>
      <body data-division={division}>
        <a href="#main" className={styles.skipLink}>
          Skip to content
        </a>
        <Header division={division} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
