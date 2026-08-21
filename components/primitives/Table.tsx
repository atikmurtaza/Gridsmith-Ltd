import type { ReactNode } from 'react';
import styles from './content.module.css';
import interactive from './interactive.module.css';

/**
 * A real <table> — the drawing matrix and the package matrix are data, and a grid of
 * divs is unusable with a screen reader.
 *
 * `caption` is required rather than optional: an uncaptioned data table gives a screen
 * reader user no way to know what they have landed in. The horizontal scroll container
 * is focusable so it can be reached and scrolled by keyboard, and carries the shared
 * `.focusable` treatment, so keyboard users do not reach a tab stop with no visible
 * indication they are on it (WCAG 2.4.7).
 *
 * This used to claim it was "the one focusable element in the primitive layer drawing no
 * focus ring". It was not: Tabs' tabpanel had the identical defect and kept it through
 * that fix. Per-instance fixes read like completed sweeps afterwards, which is what makes
 * them expensive — the claim is removed rather than re-scoped.
 *
 * `tabIndex` is unconditional. Whether the table actually overflows is only knowable at
 * layout time, and a tab stop that is sometimes there is worse than one that always is.
 */
export function Table({
  caption,
  captionHidden = false,
  className,
  children,
}: {
  caption: string;
  captionHidden?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${styles.tableWrap} ${interactive.focusable}`}
      tabIndex={0}
      role="region"
      aria-label={caption}
    >
      <table className={[styles.table, className].filter(Boolean).join(' ')}>
        <caption className={captionHidden ? 'sr-only' : undefined}>{caption}</caption>
        {children}
      </table>
    </div>
  );
}

/* `Numeric` moved to its own file — see `Numeric.tsx`. Importing it from here pulled
   `interactive.module.css` in with it, +5,591 B of CSS measured on a route with no table. */
