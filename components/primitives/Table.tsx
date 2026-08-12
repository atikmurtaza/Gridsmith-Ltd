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
 * `.focusable` treatment — it was the one focusable element in the primitive layer
 * drawing no focus ring, so keyboard users reached a tab stop with no visible indication
 * they were on it (WCAG 2.4.7).
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

/** Wrap any verifiable figure — price, date, dimension, revision — in monospace. */
export function Numeric({ children }: { children: ReactNode }) {
  return <span className={styles.numeric}>{children}</span>;
}
