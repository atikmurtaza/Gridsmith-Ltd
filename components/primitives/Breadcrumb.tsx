import Link from 'next/link';
import styles from './content.module.css';
import interactive from './interactive.module.css';

export type Crumb = { label: string; href?: string };

/**
 * The final crumb is the current page: rendered as text, not a link, and marked
 * `aria-current="page"`. The separators are CSS `::before` content so they are not
 * announced as list items.
 *
 * **The crumb links carry the tier's own classes.** They were bare `<Link>` with no
 * `className`, and `content.module.css` declared no `.breadcrumb a` rule, so they were the
 * only interactive elements in the primitive layer whose colour and focus ring the layer
 * did not define — they fell through to whatever the document happened to give an `<a>`
 * (WCAG 2.4.7, 1.4.3). `.focusable` comes from interactive.module.css, the same import
 * Table uses for the same reason.
 *
 * Links are `--ink` and underlined; the current crumb stays `--ink-muted` and is not. The
 * two must not be the same colour or the only difference between "you are here" and
 * "you can go here" is the underline.
 */
export function Breadcrumb({
  items,
  label = 'Breadcrumb',
  className,
}: {
  items: Crumb[];
  /** Overridable because two navigation landmarks on one page must be told apart. */
  label?: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={[styles.breadcrumb, className].filter(Boolean).join(' ')}>
      <ol className={styles.breadcrumbList}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href ?? item.label}>
              {isLast || !item.href ? (
                <span className={styles.breadcrumbCurrent} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`${styles.breadcrumbLink} ${interactive.focusable}`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
