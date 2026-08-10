'use client';
// IntersectionObserver has no server equivalent. Kept to this one small component so the
// cost is one observer, not a motion library — FOUNDATION §2 rejects those outright.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './motion.module.css';

/**
 * Fades and lifts content into place once, on first intersection.
 *
 * Two deliberate choices:
 *  - Content starts visible in the markup and is only hidden once the observer is
 *    attached, so a JS failure leaves the page readable rather than blank.
 *  - `prefers-reduced-motion` is checked here as well as in the global CSS. The global
 *    block collapses the duration; this skips the animation entirely, which is the
 *    difference between "instant" and "not animated".
 */
export function RevealOnScroll({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setArmed(true);
    setVisible(false);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[armed ? styles.reveal : '', visible ? styles.revealVisible : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
