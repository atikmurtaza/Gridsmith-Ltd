import type { ReactNode } from 'react';
import styles from './structure.module.css';

/**
 * Mono uppercase kicker. Renders a <p> by default; pass `as="span"` when it sits inside
 * a heading or another block that cannot contain a paragraph.
 */
export function Eyebrow({
  as: Tag = 'p',
  className,
  children,
}: {
  as?: 'p' | 'span' | 'div';
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={[styles.eyebrow, className].filter(Boolean).join(' ')}>{children}</Tag>
  );
}
