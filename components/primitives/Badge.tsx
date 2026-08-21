import type { ReactNode } from 'react';
import styles from './content.module.css';

/**
 * Mono uppercase label with a hairline border.
 *
 * `tone="accent"` colours the *border* only; the text stays `--ink`. On the master theme
 * the division accents include amber at 2.16:1, which may be a border and never a glyph
 * — master/PROJECT-RULES.md §1.2, enforced by scripts/check-no-hardcoded-colors.mjs.
 *
 * A badge is a label, not a state indicator. If it is the only thing marking a state,
 * that state also needs a non-colour cue (FOUNDATION §3).
 */
export function Badge({
  tone = 'default',
  className,
  children,
}: {
  tone?: 'default' | 'accent';
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={[styles.badge, tone === 'accent' ? styles.badgeAccent : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
