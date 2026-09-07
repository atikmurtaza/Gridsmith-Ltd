'use client';
// Five steps and a recommendation is step state, and step state is client state. The static
// table below this island is the no-JS answer (`K-05`), so this boundary buys the interaction
// and costs nothing to a reader who never gets it.

import { useEffect, useRef, useState } from 'react';
import { Heading } from '@/components/primitives/Heading';
import { Link } from '@/components/primitives/Link';
import { Prose } from '@/components/primitives/Prose';
import { RadioGroup } from '@/components/primitives/RadioGroup';
import { recommend, type PathRule } from '@/lib/path/recommend';
import type { SeedOutcome, SeedQuestion } from '@/lib/path/seedConfig';
import controls from '@/components/primitives/interactive.module.css';
import styles from './pathFinder.module.css';

/**
 * The Path Finder island — `K-06` (the five steps) and `K-07` (the result view).
 *
 * `press/APP-FLOW.md` §5. Five questions, then one of six outcomes, two of which recommend
 * against Gridsmith.
 *
 * ## The CTA is read from the outcome, never decided here
 *
 * `ETH-04` and non-negotiable #9: the tool must be able to recommend against Gridsmith, and an
 * honest outcome carries no call to action. **That is a property of the outcome record**
 * (`showCta`), and this component renders a CTA if and only if the record says so. There is no
 * second condition, no `isGridsmithService` test alongside it and no positional assumption —
 * one guard, one source. `check:path:selftest` asserts the shipped data has the right shape;
 * `check:path:live` drives this component in a browser and asserts the rendered result, because
 * data being right is not evidence that the render reads it.
 *
 * ## The honest outcomes are drawn identically to the other four
 *
 * Same panel, same border, same type, same position. Nothing in the styling makes *"you should
 * not hire us"* read as the consolation answer — see `pathFinder.module.css` `.result`.
 *
 * ## No result is a real result, and it is handled
 *
 * `recommend()` has **no fallback** — `check:path:selftest`'s NO FALLBACK case proves a
 * complete, plausible five-answer set can return `null`. That is a state a visitor can reach,
 * so it is rendered as itself: no recommendation, no invented outcome, and a pointer to the
 * criteria table and the contact form. An `unknownOutcome` is treated the same way, because an
 * outcome key this component cannot resolve is a content error and not something to guess at.
 *
 * ## Nothing is logged
 *
 * `APP-FLOW.md` §5 says every outcome logs to `press_path_results`, and `K-08` built the table
 * with the audit constraint. **The write path is not built here and that is deliberate**: the
 * table has zero policies, and `app/api/rls-drift/route.ts` asserts against the live database
 * that `anon` can neither read nor write it. Adding an `anon` insert policy would break a
 * standing live assertion, and a service-role route is a credential decision of the same shape
 * the owner already took separately for `K-10`. It is an owner decision, not a session's.
 *
 * ## The rules are `[SEED]`
 *
 * Everything the result panel says beyond the outcome's title comes from
 * `lib/path/seedConfig.ts` and is unapproved. The panel says so, in the visitor's own view, for
 * the reason the page already says it about the table: a recommendation read as final is worse
 * than no recommendation when the rules behind it are placeholders.
 */
export function PathFinder({
  questions,
  outcomes,
  rules,
  ctaHref = '/press/contact',
}: {
  questions: SeedQuestion[];
  outcomes: SeedOutcome[];
  rules: PathRule[];
  /**
   * Where a Gridsmith outcome's CTA goes. **A plain path, and `K-14` decided it stays one.**
   *
   * Nothing travels from the result to the contact form — not the five answers, not the
   * outcome key. A query string puts a memoir author's answers in browser history and in the
   * referrer of every page the contact form links to, and `PressContactFlow` already refused
   * that trade once for this audience. `check:path:live`'s CARRIES NOTHING assertion holds it:
   * a search or a hash on this value fails the build.
   */
  ctaHref?: string;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  // Focus what changed, rather than leaving a keyboard or screen reader user on the button they
  // just pressed while the question above it silently swapped (WCAG 2.4.3). Same pattern, same
  // reason, as PressContactFlow — the target is a wrapper because `Heading` is a Server
  // Component with no ref, and a focused container announces the heading it contains.
  useEffect(() => {
    if (!moved.current) return;
    headingRef.current?.focus();
  }, [step, done]);

  const go = (next: number) => {
    moved.current = true;
    setDone(false);
    setStep(next);
  };

  const question = questions[step];
  const answered = question ? answers[question.key] !== undefined : false;
  const last = step === questions.length - 1;

  if (done) {
    const result = recommend(rules, outcomes, answers);
    const outcome =
      result.outcome === null || result.unknownOutcome
        ? undefined
        : outcomes.find((o) => o.key === result.outcome);

    return (
      <div className={styles.flow} data-path-result={outcome ? outcome.key : 'none'}>
        <div ref={headingRef} tabIndex={-1} className={controls.focusable}>
          <Heading level={2}>{outcome ? outcome.title : 'No recommendation'}</Heading>
        </div>

        <div className={styles.result}>
          {outcome ? (
            <>
              <Prose>
                <p>{outcome.explanation}</p>
                {outcome.externalGuidance ? (
                  <p>
                    <strong>What to do instead:</strong> {outcome.externalGuidance}
                  </p>
                ) : null}
              </Prose>
              {/* The one CTA site in this component, and its only condition is the outcome's
                  own `showCta`. ETH-04 lives on this line. */}
              {outcome.showCta ? (
                <p>
                  <Link href={ctaHref}>Talk to us about this</Link>
                </p>
              ) : null}
            </>
          ) : (
            <Prose>
              <p>
                Your answers do not match any of the six routes below. That is a gap in our
                rules rather than a verdict on your book — nothing here is a recommendation
                against you.
              </p>
              <p>
                The table below sets out every outcome and what leads to it. If none of them
                describes your situation, <Link href={ctaHref}>tell us about it</Link> and we
                will answer properly.
              </p>
            </Prose>
          )}

          <p className={styles.answers}>
            {questions
              .map((q) => {
                const chosen = q.options.find((o) => o.key === answers[q.key]);
                return q.question + ' ' + (chosen ? chosen.label : '—');
              })
              .join(' · ')}
          </p>
        </div>

        <p className={styles.seedNote}>
          <strong>This recommendation is a placeholder.</strong> The rules that turned your
          answers into it have not been approved yet.
        </p>

        <div className={styles.nav}>
          <button
            type="button"
            className={[controls.button, controls.secondary, controls.focusable].join(' ')}
            onClick={() => {
              moved.current = true;
              setDone(false);
              setStep(questions.length - 1);
            }}
          >
            Change an answer
          </button>
          <button
            type="button"
            className={[controls.button, controls.secondary, controls.focusable].join(' ')}
            onClick={() => {
              moved.current = true;
              setAnswers({});
              setDone(false);
              setStep(0);
            }}
          >
            Start again
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className={styles.flow} data-path-step={step + 1}>
      <p className={styles.progress} aria-live="polite">
        Question {step + 1} of {questions.length} — {question.question}
      </p>

      <div ref={headingRef} tabIndex={-1} className={controls.focusable}>
        <Heading level={2}>{question.question}</Heading>
      </div>

      {/* The handler is on the wrapper: `RadioGroup` is a Server Component with no `onChange`
          by design, and change events bubble. Unmounting a step is safe because the answers
          live in state rather than in the DOM — `defaultValue` restores the dot on the way
          back, and there is no form here for a hidden input to submit into. */}
      <div
        onChange={(e) =>
          setAnswers((prev) => ({
            ...prev,
            [question.key]: (e.target as HTMLInputElement).value,
          }))
        }
      >
        <RadioGroup
          name={question.key}
          legend={question.question}
          hint={question.helpText}
          options={question.options.map((o) => ({ value: o.key, label: o.label }))}
          defaultValue={answers[question.key]}
        />
      </div>

      <div className={styles.nav}>
        {step > 0 ? (
          <button
            type="button"
            className={[controls.button, controls.secondary, controls.focusable].join(' ')}
            onClick={() => go(step - 1)}
          >
            Back
          </button>
        ) : null}
        <button
          type="button"
          className={[controls.button, controls.primary, controls.focusable].join(' ')}
          disabled={!answered}
          onClick={() => {
            if (last) {
              moved.current = true;
              setDone(true);
            } else {
              go(step + 1);
            }
          }}
        >
          {last ? 'See the recommendation' : 'Next'}
        </button>
      </div>
    </div>
  );
}
