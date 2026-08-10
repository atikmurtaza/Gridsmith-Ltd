import type { ReactNode } from 'react';
import styles from './states.module.css';

/**
 * Something failed. `role="alert"` so it is announced when it appears after an action;
 * pass `announce={false}` where it is part of the initial render (a 500 page), because
 * an alert that was always there is noise rather than information.
 *
 * `reference` is for a support code the visitor can quote — never a stack trace, and
 * never anything derived from personal data (master/PROJECT-RULES.md §6).
 */
export function ErrorState({
  title,
  children,
  actions,
  reference,
  announce = true,
  className,
}: {
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  reference?: string;
  announce?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[styles.state, className].filter(Boolean).join(' ')}
      role={announce ? 'alert' : undefined}
    >
      <p className={styles.title}>{title}</p>
      {children ? <div className={styles.body}>{children}</div> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
      {reference ? <p className={styles.reference}>Reference: {reference}</p> : null}
    </div>
  );
}
