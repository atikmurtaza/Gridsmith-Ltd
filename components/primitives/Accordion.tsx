import { useId, type ReactNode } from 'react';
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
 * `exclusive` groups the items so only one is open at a time where the browser supports
 * `<details name>`, and degrades to independently-open panels where it does not.
 *
 * Two things are deliberately not caller-supplied:
 *
 *  - **The group name is generated.** It used to be an `exclusiveName` string prop. A
 *    `<details name>` carries no server contract — unlike a radio `name` it is never
 *    submitted — so nothing is lost by generating it, and a shared string silently merged
 *    two unrelated accordions into one exclusive group. Three of the four theme frames on
 *    `/_kitchen-sink` rendered closed for exactly that reason.
 *  - **`item.id` is not emitted as a DOM id.** Nothing read it: `defaultOpenId` compares
 *    against the item key, not the attribute. It existed only to collide. An id nobody
 *    resolves is not an anchor, it is a hazard.
 */
export function Accordion({
  items,
  exclusive = false,
  defaultOpenId,
  className,
}: {
  items: AccordionItem[];
  exclusive?: boolean;
  defaultOpenId?: string;
  className?: string;
}) {
  const group = useId();
  return (
    <div className={[styles.accordion, className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <details
          key={item.id}
          name={exclusive ? group : undefined}
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
