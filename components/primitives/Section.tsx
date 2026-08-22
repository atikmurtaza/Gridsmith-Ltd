import type { ReactNode } from 'react';
import styles from './structure.module.css';

export type SectionRhythm = 'default' | 'tight' | 'loose';
/**
 * `accent` is a COLOUR surface — the division's `--accent-2` fill with `--accent-ink` on it.
 *
 * The other three are steps on the theme's neutral ramp and carry the ink ramp. This one
 * carries exactly one foreground, which is why it is a separate value rather than a fourth
 * step: the permission matrix measures it as an `ON_ACCENT` fill, not as a `SURFACES` entry.
 */
export type SectionSurface = 'canvas' | 'raised' | 'sunken' | 'accent';

const RHYTHM: Record<SectionRhythm, string> = {
  default: '',
  tight: styles.tight,
  loose: styles.loose,
};

const SURFACE: Record<SectionSurface, string> = {
  canvas: '',
  raised: styles.raised,
  sunken: styles.sunken,
  accent: styles.accent,
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
