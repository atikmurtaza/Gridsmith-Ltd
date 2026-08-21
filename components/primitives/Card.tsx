import type { ReactNode } from 'react';
import styles from './content.module.css';

/**
 * `linked` expands the first descendant link to cover the whole card, so the click
 * target is the card while the accessible name and focus target stay on the real <a>.
 * A click-handled <div> would not be reachable by keyboard — master/PROJECT-RULES.md §7.
 */
export function Card({
  surface = 'canvas',
  flush = false,
  linked = false,
  as: Tag = 'div',
  className,
  children,
}: {
  surface?: 'canvas' | 'raised';
  flush?: boolean;
  linked?: boolean;
  as?: 'div' | 'article' | 'li';
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={[
        styles.card,
        surface === 'raised' ? styles.cardRaised : '',
        flush ? styles.cardFlush : '',
        linked ? styles.cardLinked : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}
