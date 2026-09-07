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
      /* `P-02`. CSS module class names are hashed, so a gate reading the served page cannot
         select `.prose`. This attribute is the stable handle `check:press-type` uses to assert
         the 52ch measure on every body-copy block in Press, and it is inert otherwise. */
      data-prose=""
      className={[styles.prose, measure === 'narrow' ? styles.proseNarrow : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
