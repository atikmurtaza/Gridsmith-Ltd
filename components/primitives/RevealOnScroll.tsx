'use client';
// IntersectionObserver has no server equivalent. Kept to this one small component so the
// cost is one observer, not a motion library — FOUNDATION §2 rejects those outright.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './motion.module.css';

/**
 * Fades and lifts content into place once, on first intersection.
 *
 * Three deliberate choices:
 *  - Content starts visible in the markup and is only hidden once the observer is
 *    attached, so a JS failure leaves the page readable rather than blank.
 *  - The hidden state is armed ONLY when the element is below the viewport at mount, so
 *    it is certain to be scrolled into view. Arming unconditionally meant content already
 *    on screen was painted, then hidden by hydration, then revealed again — a flash — and
 *    content in the bottom 10% of a page too short to scroll never intersected the
 *    observer's -10% margin and stayed at opacity 0 permanently. No path ends hidden.
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

    // Already on screen, or above it, or on a page that cannot scroll far enough to
    // reach it: there is no reveal to perform, so it stays visible and untouched.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setArmed(true);
    setVisible(false);

    // No negative rootMargin. A -10% bottom margin means an element that the page can
    // only just scroll to never enters the shrunken root and never fires — hidden
    // forever, for a tenth of a viewport of visual timing.
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    });

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
