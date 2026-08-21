import type { ReactNode } from 'react';
import styles from './states.module.css';

/**
 * Shown when a query legitimately returns nothing — a filter combination with no matches,
 * a division with no published work yet. Distinct from ErrorState: nothing has gone
 * wrong, so it must not read as a failure.
 *
 * A Server Component: no icons, no illustration, no client state.
 *
 * **The title is a real heading.** It was a `<p>` carrying `--font-display` at
 * `--text-lg` above body prose in a bordered panel — text presented as a heading without
 * being one, which is WCAG 1.3.1 failure F2. Someone navigating by headings passed
 * straight over the empty-results state and had no way to know why the list was empty.
 * Tailwind's preflight resets heading margin and size, so the element changed and the
 * appearance did not.
 *
 * `headingLevel` defaults to 3 — the common case is a state inside a section under an
 * `h2` — and is overridable because only the caller knows its own outline. Getting this
 * wrong is a heading-order violation, which `check-axe` reports through axe's
 * `heading-order` rule.
 */
export function EmptyState({
  title,
  headingLevel = 3,
  children,
  actions,
  className,
}: {
  title: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  const Title = `h${headingLevel}` as const;
  return (
    <div className={[styles.state, className].filter(Boolean).join(' ')}>
      <Title className={styles.title}>{title}</Title>
      {children ? <div className={styles.body}>{children}</div> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}
