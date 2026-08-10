import NextLink from 'next/link';
import type { ReactNode } from 'react';
import styles from './interactive.module.css';

/**
 * Underlined by default and not removable by prop. The underline is the non-colour cue
 * that marks a link as a link (WCAG 1.4.1), and on Digital the accent clears AA by only
 * 0.37 — colour alone would not carry it.
 *
 * External links get rel="noopener" and an accessible-name suffix so screen reader users
 * are told the destination opens elsewhere.
 */
export function Link({
  href,
  tone = 'accent',
  external = false,
  className,
  children,
}: {
  href: string;
  tone?: 'accent' | 'quiet';
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const cls = [styles.link, tone === 'quiet' ? styles.linkQuiet : '', styles.focusable, className]
    .filter(Boolean)
    .join(' ');

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <NextLink href={href} className={cls}>
      {children}
    </NextLink>
  );
}
