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
                <a
                  href={item.href}
                  className={`${styles.breadcrumbLink} ${interactive.focusable}`}
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
