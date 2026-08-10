import NextLink from 'next/link';
import type { ReactNode } from 'react';
import styles from './interactive.module.css';

type Common = { variant?: 'primary' | 'secondary'; className?: string; children: ReactNode };

/**
 * Renders a <button> or an <a> depending on whether `href` is given — a link that looks
 * like a button must still be a link, or middle-click and "open in new tab" break.
 *
 * No `onClick`, so this stays a Server Component. Anything needing a handler wraps it in
 * its own client component rather than pushing 'use client' into every consumer.
 */
export function Button(
  props: Common &
    (
      | { href: string; type?: never; disabled?: never }
      | { href?: never; type?: 'button' | 'submit' | 'reset'; disabled?: boolean }
    ),
) {
  const { variant = 'primary', className, children } = props;
  const cls = [styles.button, styles[variant], styles.focusable, className]
    .filter(Boolean)
    .join(' ');

  if (props.href !== undefined) {
    return (
      <NextLink href={props.href} className={cls}>
        {children}
      </NextLink>
    );
  }

  return (
    <button type={props.type ?? 'button'} disabled={props.disabled} className={cls}>
      {children}
    </button>
  );
}
