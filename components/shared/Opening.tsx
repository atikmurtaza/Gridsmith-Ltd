import type { ReactNode } from 'react';
import styles from './opening.module.css';

/**
 * The shared-page opening — `GS-SHARED-001-B2` (local prototype). Server Component.
 *
 * One family, not one template: the same structural label, H1 and lead on the Master frame, with
 * `spacious` for About and Approach and the compact default for Legal, Contact, Insights and the
 * 404, which should reach their content quickly. `before` sits above the label (a breadcrumb);
 * `children` follows the lead (status, metadata, links).
 *
 * The label is `aria-hidden`: it restates the site and the page, both of which the header and the
 * H1 already say, so a screen reader hears it once rather than twice.
 */
export function Opening({
  place,
  title,
  lead,
  size = 'compact',
  before,
  children,
}: {
  place: string;
  title: ReactNode;
  lead?: ReactNode | ReactNode[];
  size?: 'compact' | 'spacious';
  before?: ReactNode;
  children?: ReactNode;
}) {
  const leads = lead == null ? [] : Array.isArray(lead) ? lead : [lead];
  return (
    <div className={`${styles.frame} ${styles.opening}`} data-size={size}>
      <div className={styles.wrap}>
        {before ? <div className={styles.before}>{before}</div> : null}
        <p className={styles.label} aria-hidden="true">
          <span>Gridsmith Ltd</span>
          <span className={styles.rule} />
          <span>{place}</span>
        </p>
        <h1 className={styles.title}>{title}</h1>
        {leads.map((l, i) => (
          <p key={i} className={styles.lead}>
            {l}
          </p>
        ))}
        {children ? <div className={styles.openingExtra}>{children}</div> : null}
      </div>
    </div>
  );
}
