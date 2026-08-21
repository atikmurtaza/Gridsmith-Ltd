import type { ReactNode } from 'react';
import styles from './states.module.css';

/**
 * Something failed. `role="alert"` so it is announced when it appears after an action;
 * pass `announce={false}` where it is part of the initial render (a 500 page), because
 * an alert that was always there is noise rather than information.
 *
 * `reference` is for a support code the visitor can quote — never a stack trace, and
 * never anything derived from personal data (master/PROJECT-RULES.md §6).
 *
 * **The title is a real heading** — see the note in EmptyState.tsx; both had the same
 * WCAG 1.3.1 F2 defect and neither gave a caller any way to correct it.
 */
export function ErrorState({
  title,
  headingLevel = 3,
  children,
  actions,
  reference,
  announce = true,
  className,
}: {
  title: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  children?: ReactNode;
  actions?: ReactNode;
  reference?: string;
  announce?: boolean;
  className?: string;
}) {
  const Title = `h${headingLevel}` as const;
  return (
    <div
      className={[styles.state, className].filter(Boolean).join(' ')}
      role={announce ? 'alert' : undefined}
    >
      <Title className={styles.title}>{title}</Title>
      {children ? <div className={styles.body}>{children}</div> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
      {reference ? <p className={styles.reference}>Reference: {reference}</p> : null}
    </div>
  );
}
