import type { Division } from './RootShell';
import { NAV, WORDMARK } from './nav';
import styles from './chrome.module.css';

/**
 * The shared header (`M-03`, FR-M11). Server Component — nothing here has state.
 *
 * **Plain `<a>`, deliberately, not the `Link` primitive.** Two reasons and both are
 * binding. `TECH-SPEC.md` §3 requires navigation between route groups to be a full
 * document load — it is what makes the theme change flash-free and removes any window
 * for a client-side theme swap — and `next/link` would defeat that. And every link here
 * is in a shared layout, so importing the primitive puts `next/link`'s client runtime in
 * a chunk every route loads: measured once at 3.3KB gz shared, against Master's 15KB
 * delta budget that `M-06` already expects to overrun. Route-group links must not be
 * prefetched, so the correct component is the one that does less.
 *
 * No division switcher here: `TECH-SPEC.md` §3 puts it in the footer only, because a
 * header-level switcher pulls buyers sideways mid-funnel. That is `M-04`.
 */
export function Header({ division }: { division: Division }) {
  const items = NAV[division];

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a href={WORDMARK.href} className={styles.wordmark}>
          {WORDMARK.label}
        </a>
        {items.length > 0 && (
          <nav aria-label="Primary">
            <ul className={styles.navList}>
              {items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={styles.navLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
