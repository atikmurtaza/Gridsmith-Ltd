import Link from 'next/link';
import styles from './content.module.css';

export type Crumb = { label: string; href?: string };

/**
 * The final crumb is the current page: rendered as text, not a link, and marked
 * `aria-current="page"`. The separators are CSS `::before` content so they are not
 * announced as list items.
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
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
