import type { ReactNode } from 'react';
import styles from './structure.module.css';

export type ContainerWidth = 'default' | 'narrow' | 'full';

const WIDTHS: Record<ContainerWidth, string> = {
  default: '',
  narrow: styles.narrow,
  full: styles.full,
};

export function Container({
  width = 'default',
  as: Tag = 'div',
  className,
  children,
}: {
  width?: ContainerWidth;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'nav';
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={[styles.container, WIDTHS[width], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}
