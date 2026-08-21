import styles from './content.module.css';

/**
 * URL-state pagination — real links, so a page is shareable and works without JS
 * (FOUNDATION §7: grids paginate at 24 with URL-state pagination).
 *
 * The current page carries three cues, not colour alone: filled background,
 * `aria-current="page"`, and an underline. FOUNDATION §3 / WCAG 1.4.1.
 * Targets are 2.75rem to clear the 24×24 minimum in WCAG 2.2 SC 2.5.8 comfortably.
 *
 * The gap marker is its own <li> rather than a second child of the page's <li>. That
 * arrangement needed `display: contents` on the <li> to keep the two side by side, and
 * `display: contents` removes the element's box — with it, the `listitem` role, so
 * several browsers announced an <ol> of nothing. One item per <li>, no override needed.
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
export function Pagination({
  current,
  total,
  hrefFor,
  label = 'Pagination',
  className,
}: {
  current: number;
  total: number;
  hrefFor: (page: number) => string;
  /** Overridable — a grid paginated at both top and bottom needs two distinct names. */
  label?: string;
  className?: string;
}) {
  if (total <= 1) return null;

  // First, last, and a window around the current page. Gaps become an ellipsis.
  const window = new Set<number>([1, total, current - 1, current, current + 1]);
  const pages = [...window].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  return (
    <nav aria-label={label} className={[styles.pagination, className].filter(Boolean).join(' ')}>
      <ol className={styles.paginationList}>
        {pages.flatMap((page, i) => {
          const gap = i > 0 && page - pages[i - 1]! > 1;
          return [
            gap ? (
              <li key={`gap-${page}`} className={styles.pageEllipsis} aria-hidden="true">
                …
              </li>
            ) : null,
            <li key={page}>
              {page === current ? (
                <span className={`${styles.page} ${styles.pageCurrent}`} aria-current="page">
                  {page}
                </span>
              ) : (
                <a className={styles.page} href={hrefFor(page)} aria-label={`Page ${page}`}>
                  {page}
                </a>
              )}
            </li>,
          ].filter(Boolean);
        })}
      </ol>
    </nav>
  );
}
