import type { ReactNode } from 'react';
import styles from './content.module.css';

/**
 * A real <table> — the drawing matrix and the package matrix are data, and a grid of
 * divs is unusable with a screen reader.
 *
 * `caption` is required rather than optional: an uncaptioned data table gives a screen
 * reader user no way to know what they have landed in. The horizontal scroll container
 * is focusable so it can be reached and scrolled by keyboard.
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
    <div className={styles.tableWrap} tabIndex={0} role="region" aria-label={caption}>
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
