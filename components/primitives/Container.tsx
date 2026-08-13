import type { ReactNode } from 'react';
import styles from './structure.module.css';

export type ContainerWidth = 'default' | 'narrow' | 'full';

const WIDTHS: Record<ContainerWidth, string> = {
  default: '',
  narrow: styles.narrow,
  full: styles.full,
};

/**
 * `as` can produce a landmark, so this has to be able to name one.
 *
 * With only `width`, `as`, `className` and `children`, a second `<nav>` or `<header>` on
 * a page could not be told apart from the first (WCAG 1.3.1, 4.1.2), and a `<main>` could
 * not be given the id a skip link has to target — which Epic M needs. `Breadcrumb` and
 * `Pagination` both already take an overridable `label` for exactly this reason; the
 * primitive that renders the landmark itself was the one that could not.
 *
 * The three attributes are declared rather than spread. A rest spread would also admit
 * `role`, `tabIndex` and every `aria-*`, and this is the primitive four route groups
 * build their page structure from.
 */
export function Container({
  width = 'default',
  as: Tag = 'div',
  id,
  ariaLabel,
  ariaLabelledBy,
  className,
  children,
}: {
  width?: ContainerWidth;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'nav';
  /** Skip-link and in-page-anchor target. */
  id?: string;
  /** Names the landmark. Required by 1.3.1 where two of the same landmark appear on one page. */
  ariaLabel?: string;
  /** Names the landmark from existing visible text — prefer this over `ariaLabel` when a heading already says it. */
  ariaLabelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={[styles.container, WIDTHS[width], className].filter(Boolean).join(' ')}
    >
      {children}
    </Tag>
  );
}
