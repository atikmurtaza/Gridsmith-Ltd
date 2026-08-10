import type { ReactNode } from 'react';
import styles from './states.module.css';

/**
 * Shown when a query legitimately returns nothing — a filter combination with no matches,
 * a division with no published work yet. Distinct from ErrorState: nothing has gone
 * wrong, so it must not read as a failure.
 *
 * A Server Component: no icons, no illustration, no client state.
 */
export function EmptyState({
  title,
  children,
  actions,
  className,
}: {
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={[styles.state, className].filter(Boolean).join(' ')}>
      <p className={styles.title}>{title}</p>
      {children ? <div className={styles.body}>{children}</div> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}
