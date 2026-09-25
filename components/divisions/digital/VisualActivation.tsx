'use client';
// A small leaf marks a chapter's first entrance; server HTML is already complete.
import { useEffect } from 'react';

export function VisualActivation() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const chapters = document.querySelectorAll<HTMLElement>('.dg-chapter');
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('dg-entered');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.18 });
    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  return null;
}
