import type { ReactNode } from 'react';
import styles from './interactive.module.css';

type Common = { variant?: 'primary' | 'secondary' | 'inverse'; className?: string; children: ReactNode };

/**
 * Renders a <button> or an <a> depending on whether `href` is given — a link that looks
 * like a button must still be a link, or middle-click and "open in new tab" break.
 *
 * No `onClick`, so this stays a Server Component. Anything needing a handler wraps it in
 * its own client component rather than pushing 'use client' into every consumer.
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
export function Button(
  props: Common &
    (
      | { href: string; type?: never; disabled?: never }
      | { href?: never; type?: 'button' | 'submit' | 'reset'; disabled?: boolean }
    ),
) {
  const { variant = 'primary', className, children } = props;
  const cls = [styles.button, styles[variant], styles.focusable, className]
    .filter(Boolean)
    .join(' ');

  if (props.href !== undefined) {
    return (
      <a href={props.href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button type={props.type ?? 'button'} disabled={props.disabled} className={cls}>
      {children}
    </button>
  );
}
