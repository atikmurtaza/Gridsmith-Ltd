'use client';
// Needs to know how far down the document the visitor is, which has no server or CSS
// equivalent. Kept to one passive, rAF-throttled listener.

import { useEffect, useState, type ReactNode } from 'react';
import styles from './motion.module.css';

const TRIGGER = 0.4;

/**
 * Mobile-only conversion bar, appearing once the visitor is 40% down the page
 * (Design FR-D19). Hidden at >=768px in CSS, where the CTA has room in the page itself.
 *
 * It slides rather than appears, and it is `position: fixed`, so it never shifts layout —
 * CLS is budgeted at 0.05, and 0.02 on Digital.
 *
 * A scroll listener rather than an IntersectionObserver: "40% of the scrollable document"
 * needs a sentinel positioned against document height, which cannot be expressed in CSS
 * without measuring it in JS first. One passive listener, coalesced into a single rAF,
 * is the smaller and more predictable of the two.
 */
export function StickyCta({
  children,
  label,
  className,
}: {
  children: ReactNode;
  /** Names the region — a bar of unlabelled buttons is disorienting out of context. */
  label: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      // A page too short to scroll never reaches 40% and must not show the bar.
      setVisible(scrollable > 0 && window.scrollY / scrollable >= TRIGGER);
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      role="region"
      aria-label={label}
      aria-hidden={!visible}
      inert={!visible}
      className={[styles.stickyCta, visible ? styles.stickyVisible : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
