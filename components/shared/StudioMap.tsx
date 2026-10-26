import { STUDIOS } from '@/components/chrome/nav';
import styles from './shared.module.css';

/**
 * About's structural visual — `GS-SHARED-001-B2`. Server Component, DOM and CSS only.
 *
 * Gridsmith Ltd → a trunk → the three studios, drawn in hairlines and nodes so it reads as a
 * relationship rather than an org chart. It names no people and no reporting lines, because
 * there are none to name (`GS-O004`, no public team). The note on the company node restates the
 * approved Approach copy — one company, one contract covers work that spans the studios.
 *
 * Each studio links to its own home with its one-line description; the full service catalogue
 * stays on the studio pages.
 */
export function StudioMap() {
  return (
    <div className={styles.map}>
      <p className={styles.mapRoot}>
        Gridsmith Ltd <span className={styles.mapNote}>One company · one contract</span>
      </p>
      <ol className={styles.mapStudios} aria-label="The three studios">
        {STUDIOS.map((s, i) => (
          <li key={s.href} className={styles.mapStudio}>
            <a href={s.href} className={styles.mapLink}>
              <span className={styles.mapIndex} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={styles.mapName}>
                Gridsmith {s.label}
              </span>
              <span className={styles.mapSummary}>{s.summary}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
