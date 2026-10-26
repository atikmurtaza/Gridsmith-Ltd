'use client';
// Two small jobs the server HTML cannot do: mark each chapter's first entrance so its one
// movement plays and finishes, and mark which project stage is in view in the stage bar.
// Without this island every visual is already in its settled state and the bar is plain links.
import { useEffect } from 'react';

export function PressMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.pr-home');
    if (!root || !('IntersectionObserver' in window)) return;
    const observers: IntersectionObserver[] = [];

    // Stage bar: state, not motion — runs under reduced motion too.
    const links = new Map([...root.querySelectorAll<HTMLAnchorElement>('[data-pr-step]')].map((a) => [a.dataset.prStep, a]));
    const bar = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        // Above the journey (the hero) no stage is current.
        if (!links.has(entry.target.id)) { links.forEach((a) => a.removeAttribute('aria-current')); continue; }
        links.forEach((a, id) => (id === entry.target.id ? a.setAttribute('aria-current', 'step') : a.removeAttribute('aria-current')));
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((_, id) => { const el = id ? document.getElementById(id) : null; if (el) bar.observe(el); });
    const hero = root.querySelector('.pr-hero');
    if (hero) bar.observe(hero);
    observers.push(bar);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!reduce && !saveData) {
      const enter = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('pr-entered');
          enter.unobserve(entry.target);
        }
      }, { threshold: 0.2 });
      // Anything already on screen is shown settled rather than hidden and replayed.
      root.querySelectorAll<HTMLElement>('[data-pr-motion]').forEach((target) => {
        if (target.getBoundingClientRect().top < window.innerHeight * 0.8) target.classList.add('pr-entered');
        else enter.observe(target);
      });
      root.classList.add('pr-motion');
      observers.push(enter);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return null;
}
