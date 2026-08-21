import type { ReactNode } from 'react';
import styles from './interactive.module.css';

/**
 * Underlined by default and not removable by prop. The underline is the non-colour cue
 * that marks a link as a link (WCAG 1.4.1), and on Digital the accent clears AA by only
 * 0.37 — colour alone would not carry it.
 *
 * External links get rel="noopener" and an accessible-name suffix so screen reader users
 * are told the destination opens elsewhere.
 */
/**
 * **Plain `<a>`, not `next/link` — and this was measured, not assumed.**
 *
 * `TECH-SPEC.md` §3 and §9 already require a full document load for navigation between route
 * groups, and `Header`, `Footer` and `DivisionRouting` all say so in their own docstrings.
 * The primitive layer was the last place still importing `next/link`, and because the import is
 * at module scope, **every consumer paid for it whether or not the branch that used it ran** —
 * `Link`'s external branch already returned a plain anchor and still dragged the runtime in.
 *
 * Measured at Epic N: the runtime is a 3,389 B gz shared chunk. With eight new routes using
 * breadcrumbs and links it became a *shared* chunk rather than a per-page one and pushed
 * `/_kitchen-sink` 0.04KB over its 8.6KB budget — a gate failure caused by re-chunking rather
 * than by anything being added. `DivisionRouting` had already measured the other half of the
 * cost on `/`: 33,531 B of RSC payload prefetched and discarded by the document load that
 * followed.
 *
 * The site is fully static and every route is a file on disk. A soft navigation buys a fraction
 * of a document load and costs a runtime plus a prefetch, on a programme whose homepage has ~80ms
 * of LCP headroom. So: no client-side router in the primitive layer.
 */
export function Link({
  href,
  tone = 'accent',
  external = false,
  className,
  children,
}: {
  href: string;
  tone?: 'accent' | 'quiet';
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const cls = [styles.link, tone === 'quiet' ? styles.linkQuiet : '', styles.focusable, className]
    .filter(Boolean)
    .join(' ');

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}
