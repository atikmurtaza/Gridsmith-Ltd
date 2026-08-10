import type { ReactNode } from 'react';
import styles from './structure.module.css';

export type SectionRhythm = 'default' | 'tight' | 'loose';
export type SectionSurface = 'canvas' | 'raised' | 'sunken';

const RHYTHM: Record<SectionRhythm, string> = {
  default: '',
  tight: styles.tight,
  loose: styles.loose,
};

const SURFACE: Record<SectionSurface, string> = {
  canvas: '',
  raised: styles.raised,
  sunken: styles.sunken,
};

export function Section({
  rhythm = 'default',
  surface = 'canvas',
  labelledBy,
  className,
  children,
}: {
  rhythm?: SectionRhythm;
  surface?: SectionSurface;
  /** id of the heading naming this section — a <section> without one is a <div>. */
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={[styles.section, RHYTHM[rhythm], SURFACE[surface], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </section>
  );
}
