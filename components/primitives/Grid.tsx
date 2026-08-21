import type { CSSProperties, ReactNode } from 'react';
import styles from './structure.module.css';

/**
 * The shared 12-column grid. Column spans are set by the caller via CSS, not by a prop
 * per breakpoint — a `span={{sm,md,lg}}` API would put layout decisions in TypeScript
 * where a media query already expresses them better.
 */
export function Grid({
  as: Tag = 'div',
  className,
  style,
  children,
}: {
  as?: 'div' | 'ul' | 'ol' | 'section';
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Tag className={[styles.grid, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </Tag>
  );
}
