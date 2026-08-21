import type { ReactNode } from 'react';
import styles from './structure.module.css';

/**
 * Long-form copy. Styles descendants, so it is the one primitive that reaches into its
 * children — everything inside comes from portable text and cannot carry class names.
 */
export function Prose({
  measure = 'default',
  className,
  children,
}: {
  measure?: 'default' | 'narrow';
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={[styles.prose, measure === 'narrow' ? styles.proseNarrow : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
