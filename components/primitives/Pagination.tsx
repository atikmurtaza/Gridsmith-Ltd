import Link from 'next/link';
import styles from './content.module.css';

/**
 * URL-state pagination — real links, so a page is shareable and works without JS
 * (FOUNDATION §7: grids paginate at 24 with URL-state pagination).
 *
 * The current page carries three cues, not colour alone: filled background,
 * `aria-current="page"`, and an underline. FOUNDATION §3 / WCAG 1.4.1.
 * Targets are 2.75rem to clear the 24×24 minimum in WCAG 2.2 SC 2.5.8 comfortably.
 */
export function Pagination({
  current,
  total,
  hrefFor,
  className,
}: {
  current: number;
  total: number;
  hrefFor: (page: number) => string;
  className?: string;
}) {
  if (total <= 1) return null;

  // First, last, and a window around the current page. Gaps become an ellipsis.
  const window = new Set<number>([1, total, current - 1, current, current + 1]);
  const pages = [...window].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  return (
    <nav aria-label="Pagination" className={[styles.pagination, className].filter(Boolean).join(' ')}>
      <ol className={styles.paginationList}>
        {pages.map((page, i) => {
          const gap = i > 0 && page - pages[i - 1]! > 1;
          return (
            <li key={page} style={{ display: 'contents' }}>
              {gap ? <span className={styles.pageEllipsis} aria-hidden="true">…</span> : null}
              {page === current ? (
                <span className={`${styles.page} ${styles.pageCurrent}`} aria-current="page">
                  {page}
                </span>
              ) : (
                <Link className={styles.page} href={hrefFor(page)} aria-label={`Page ${page}`}>
                  {page}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
