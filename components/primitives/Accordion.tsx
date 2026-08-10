import type { ReactNode } from 'react';
import styles from './interactive.module.css';

export type AccordionItem = { id: string; question: ReactNode; answer: ReactNode };

/**
 * Native <details>/<summary> — zero JavaScript, and the browser already provides the
 * keyboard behaviour, the expanded state and the screen reader announcement that a
 * hand-rolled disclosure widget has to reimplement and usually gets wrong.
 *
 * That also means the FAQ content is in the DOM and indexable whether or not it is open,
 * which the `FAQPage` structured data depends on.
 *
 * `name` groups items into an exclusive accordion where supported, and degrades to
 * independently-open panels where it is not.
 */
export function Accordion({
  items,
  exclusiveName,
  defaultOpenId,
  className,
}: {
  items: AccordionItem[];
  exclusiveName?: string;
  defaultOpenId?: string;
  className?: string;
}) {
  return (
    <div className={[styles.accordion, className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <details
          key={item.id}
          id={item.id}
          name={exclusiveName}
          open={item.id === defaultOpenId}
          className={styles.accordionItem}
        >
          <summary className={`${styles.summary} ${styles.focusable}`}>
            {item.question}
            <span className={styles.marker} aria-hidden="true">
              +
            </span>
          </summary>
          <div className={styles.panel}>{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
