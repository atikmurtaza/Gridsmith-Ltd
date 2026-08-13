import type { ReactNode } from 'react';
import styles from './interactive.module.css';

export type Step = { id: string; title: string; body?: ReactNode };

/**
 * Presentational only — it renders progress, it does not own it. The multi-step contact
 * flows drive it from the server, so no client state is needed here.
 *
 * Used for the canonical six process stages (`_shared/00-PROCESS.md`) as well as form
 * progress, which is why numbering is zero-padded mono: `01`–`06`.
 *
 * The current step carries three cues — a filled marker, a heavier title, and
 * `aria-current="step"`. Completed steps differ in border weight, not colour alone, and
 * say so in the sr-only prefix: the marker is `aria-hidden`, so without that a screen
 * reader user hears "Step 2:" for a done step and "Step 2:" for a pending one.
 *
 * That sentence about border weight was in this docstring while `.stepDone` changed
 * border-*colour* and text colour and nothing else — WCAG 1.4.1 failed in the shared
 * primitive layer and two comments asserted it did not. The code was changed to match
 * the claim rather than the claim to match the code; the cue is worth having.
 */
export function Stepper({
  steps,
  current,
  label,
  headingLevel = 3,
  className,
}: {
  steps: Step[];
  /** 1-based index of the active step. */
  current: number;
  label: string;
  /**
   * Step titles are real headings — WCAG 1.3.1, and the same fix `EmptyState` and
   * `ErrorState` took at A11Y-2. A step title sits in the display face above `step.body`,
   * so it heads content and a reader navigating by heading should reach it. `Heading`
   * separates level from size for exactly this reason, so the visual result is unchanged.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}) {
  const Title = `h${headingLevel}` as const;
  return (
    <nav aria-label={label}>
      <ol className={[styles.stepper, className].filter(Boolean).join(' ')}>
        {steps.map((step, i) => {
          const n = i + 1;
          const state = n === current ? styles.stepCurrent : n < current ? styles.stepDone : '';
          return (
            <li
              key={step.id}
              className={[styles.step, state].filter(Boolean).join(' ')}
              aria-current={n === current ? 'step' : undefined}
            >
              <span className={styles.stepMarker} aria-hidden="true">
                {String(n).padStart(2, '0')}
              </span>
              <div>
                <Title className={styles.stepTitle}>
                  <span className="sr-only">{n < current ? `Step ${n}, completed: ` : `Step ${n}: `}</span>
                  {step.title}
                </Title>
                {step.body ? <div className={styles.stepBody}>{step.body}</div> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
