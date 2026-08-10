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
 * `aria-current="step"`. Completed steps differ in border weight, not colour alone.
 */
export function Stepper({
  steps,
  current,
  label,
  className,
}: {
  steps: Step[];
  /** 1-based index of the active step. */
  current: number;
  label: string;
  className?: string;
}) {
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
                <p className={styles.stepTitle}>
                  <span className="sr-only">{`Step ${n}: `}</span>
                  {step.title}
                </p>
                {step.body ? <div className={styles.stepBody}>{step.body}</div> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
