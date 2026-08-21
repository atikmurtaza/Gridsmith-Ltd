import type { ReactNode } from 'react';
import styles from './structure.module.css';

export type HeadingLevel = 1 | 2 | 3 | 4;
export type HeadingSize = 'display' | 'd2' | 'd3' | 'd4';

const SIZES: Record<HeadingSize, string> = {
  display: styles.d1,
  d2: styles.d2,
  d3: styles.d3,
  d4: styles.d4,
};

const DEFAULT_SIZE: Record<HeadingLevel, HeadingSize> = { 1: 'd2', 2: 'd3', 3: 'd4', 4: 'd4' };

/**
 * `level` sets the element, `size` sets the appearance, and they are deliberately
 * separable: heading order must stay correct for screen readers even where the design
 * wants a small h2 or a large h3. Defaulting `size` from `level` keeps the common case
 * to one prop.
 */
export function Heading({
  level,
  size,
  id,
  className,
  children,
}: {
  level: HeadingLevel;
  size?: HeadingSize;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      id={id}
      className={[styles.heading, SIZES[size ?? DEFAULT_SIZE[level]], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}
