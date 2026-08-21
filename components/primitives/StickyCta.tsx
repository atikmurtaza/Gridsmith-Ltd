'use client';
// Needs to know how far down the document the visitor is, which has no server or CSS
// equivalent. Kept to one passive, rAF-throttled listener.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './motion.module.css';

const TRIGGER = 0.4;

/** Published to CSS so the focus reserve is the bar's real height — see below. */
const RESERVE_VAR = '--sticky-cta-block-size';

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
 *
 * **One mechanism decides whether the bar is active: the `.stickyVisible` class.**
 *
 * This carried `aria-hidden={!visible}` and `inert={!visible}` as props while `position`,
 * `transform` and `display` were CSS. Props and CSS are two mechanisms, so they desynced:
 * `/_kitchen-sink` overrode the CSS to pin four specimens in flow and got four painted
 * bars — eight visible links — that were simultaneously `inert` and out of the
 * accessibility tree. No CSS override can change a prop, so there was no code path by
 * which the two could agree.
 *
 * `visibility` does both jobs in one declaration: the platform removes a
 * `visibility: hidden` subtree from the accessibility tree AND from the tab order, which
 * is exactly what `aria-hidden` + `inert` were hand-rolling. An override that repositions
 * the bar sets `visibility` in the same rule, so presentation and semantics move together
 * or not at all. If a future override forgets it, the bar is invisible *and* unreachable —
 * a failure someone can see, rather than a silent one only a screen reader meets.
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      // A page too short to scroll never reaches 40% and must not show the bar.
      setVisible(scrollable > 0 && window.scrollY / scrollable >= TRIGGER);
    };

    /**
     * WCAG 2.2 SC 2.4.11 Focus Not Obscured. globals.css reserves this much scroll
     * padding so a control tabbed to near the foot of the document is not scrolled under
     * the bar. It used to reserve a *modelled* height — "a 2.75rem control plus
     * var(--space-3) top and bottom", 68px — which describes the bar only while it does
     * not wrap. At 375px the button labels wrap and the real bar is 95px, so the reserve
     * was 27px short of the thing it was reserving for. That is the "number ≠ reality"
     * class from 01-VALIDATION-REPORT §12, inside a fix written for an accessibility
     * criterion. It publishes its measured height instead.
     *
     * Only a `position: fixed` instance occludes anything, so a specimen pinned in flow
     * must not publish. `display: none` above 768px measures 0, which is correct: no bar,
     * no reserve. Measured on resize rather than on scroll — the height changes when the
     * labels rewrap, which is a resize — so the scroll path stays free of layout reads.
     */
    const reserve = () => {
      const el = ref.current;
      if (!el || getComputedStyle(el).position !== 'fixed') return;
      document.documentElement.style.setProperty(RESERVE_VAR, `${el.offsetHeight}px`);
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    const onResize = () => {
      reserve();
      onScroll();
    };

    measure();
    reserve();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      className={[styles.stickyCta, visible ? styles.stickyVisible : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
