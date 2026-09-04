'use client';
// Multi-step means step state, and step state is client state. This is Press's only client
// boundary besides the shared chrome. The alternative — a step per route with the answers in
// the URL — puts a memoir author's manuscript stage in their browser history and in every
// referrer header the next page sends, which is the wrong trade for a form whose whole subject
// is discretion.

import { useActionState, useEffect, useRef, useState } from 'react';
import { Field } from '@/components/primitives/Field';
import { Heading } from '@/components/primitives/Heading';
import { Link } from '@/components/primitives/Link';
import { RadioGroup } from '@/components/primitives/RadioGroup';
import { Select } from '@/components/primitives/Select';
import type { FormState } from '@/lib/leads/action';
import { submitPressLeadAction } from '@/lib/leads/pressAction';
import { pressSegmentOptions, pressSegmentTerms, type PressSegment } from '@/lib/leads/pressSegments';
import controls from '@/components/primitives/interactive.module.css';
import styles from './pressContact.module.css';

/**
 * The Press contact flow — `K-13`, `press/APP-FLOW.md` §6.
 *
 * Four steps: who you are, the branch questions for that answer, budget and manuscript link,
 * then contact details. One `<form>`, one submit, one row in `leads`.
 *
 * ## Every step stays mounted
 *
 * Steps that are not current carry the `hidden` attribute rather than being unmounted. A
 * wizard that unmounts a step loses its answers on every back-and-forth, and rebuilding them
 * from React state means holding a second copy of the form — which is how a field ends up
 * submitted with a value the person never sees. `hidden` inputs still submit, so the form's
 * value *is* the state. The exception is the branch fieldsets: only the selected segment's is
 * mounted, because an unselected branch's answers must not travel with the submission.
 *
 * ## No progress bar, no step counter styled as a completion meter
 *
 * ETH-01 bans urgency and pressure mechanics, and a filling bar on an enquiry form is one. The
 * position is stated in words in an `aria-live` region, which is also what makes it reach a
 * screen reader at all.
 *
 * ## The memoir branch depends on copy that does not exist yet
 *
 * `expectationsStatement` is ETH-07's commercial-expectations statement and belongs to `R-09`
 * (design) and `O-09` (copy). It is **not authored here** — non-negotiable #2. Until it is
 * supplied, `pressSegmentOptions` withholds the memoir option, because an acknowledgement
 * checkbox next to a statement that is not on the page is a consent record of nothing. The
 * schema gate is in place regardless: `pressLeadPayload` will not accept a memoir submission
 * without `expectationsAcknowledged: true`, whatever a browser sends.
 *
 * ## Consent is not collected here, deliberately
 *
 * `press/PROJECT-RULES.md` §7 and `master/PROJECT-RULES.md` §6: handling an enquiry someone
 * submitted is contract and legitimate interest, not analytics. The published privacy notice
 * §2 lists *"your enquiry, project requirements, budget and timeline"* on that footing and §11
 * says submitting an enquiry does not subscribe anyone to marketing. So there is no consent
 * control, no marketing opt-in, and a link to the notice instead. The consumer cancellation
 * notice is `K-17` and belongs at **order confirmation**, not at enquiry — a free enquiry is
 * not a contract, so nothing in `CONSUMER-TERMS.md` §6 is engaged on this page.
 */
const INITIAL: FormState = { status: 'idle' };

const btn = (variant: 'primary' | 'secondary') =>
  [controls.button, controls[variant], controls.focusable].join(' ');

/**
 * **Shaped, not priced.** Identical reasoning to `components/leads/ContactForm.tsx`, and the
 * same four values, so the `leads.budget_band` column carries one vocabulary across the site.
 * `press/SCHEMA.md` §6 lists money bands; every one of them would be the first hard money
 * figure on a site whose prices are `[SEED] INDICATIVE`, `check:content` rejects them, and the
 * master form settled the question in August. Recorded as an open question rather than
 * resolved quietly — see the `K-13` row.
 */
const BUDGETS = [
  { value: 'not-sure', label: 'Not sure yet' },
  { value: 'small', label: 'A small, well-defined piece of work' },
  { value: 'project', label: 'A full book project' },
  { value: 'programme', label: 'An ongoing programme or retainer' },
];

/**
 * `K-16` — the sentence beside each terms destination.
 *
 * Keyed by slug rather than by segment, because two segments share a destination and the
 * reader is being told which instrument applies, not which box they ticked. The wording states
 * the test each instrument states for itself — purpose of purchase — and claims nothing beyond
 * it; `pressSegmentTerms` carries the routing and the reasoning.
 */
const TERMS_COPY: Record<string, { sentence: string; link: string }> = {
  'business-client-terms': {
    sentence: 'Work bought for a business, trade or profession would be covered by our business client terms.',
    link: 'Read the business client terms',
  },
  'consumer-client-terms': {
    sentence:
      'If you are buying as an individual, outside a trade or business, our consumer client terms would cover the work.',
    link: 'Read the consumer client terms',
  },
  'client-terms': {
    sentence: 'Which of our client terms would apply depends on whether you are buying for a business.',
    link: 'Read which client terms apply',
  },
};

const YES_NO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const TIMELINE_OPTIONS = [
  { value: '3-months', label: 'Within three months' },
  { value: '6-months', label: 'Within six months' },
  { value: '12-months', label: 'Within a year' },
  { value: 'no-deadline', label: 'No fixed deadline' },
];

const MEMOIR_TIMELINE_OPTIONS = TIMELINE_OPTIONS.filter((o) => o.value !== '3-months');

const STAGES = [
  { value: 'idea', label: 'An idea, nothing written yet' },
  { value: 'partial-draft', label: 'A partial draft' },
  { value: 'finished-draft', label: 'A finished first draft' },
  { value: 'revised-draft', label: 'A revised draft' },
];

const WORD_COUNTS = [
  { value: 'unknown', label: 'I do not know yet' },
  { value: 'under-20k', label: 'Under 20,000 words' },
  { value: '20k-50k', label: '20,000 to 50,000 words' },
  { value: '50k-80k', label: '50,000 to 80,000 words' },
  { value: '80k-120k', label: '80,000 to 120,000 words' },
  { value: '120k-plus', label: 'Over 120,000 words' },
];

const BOOK_PURPOSES = [
  { value: 'credibility', label: 'Credibility and authority' },
  { value: 'lead-generation', label: 'Generating leads' },
  { value: 'speaking', label: 'Supporting speaking work' },
  { value: 'internal', label: 'Internal or client use' },
  { value: 'launch', label: 'A launch or campaign' },
];

const WHO_WRITES = [
  { value: 'ghostwritten', label: 'You write it from interviews' },
  { value: 'i-write-you-edit', label: 'I write it, you edit' },
  { value: 'team-writes', label: 'My team writes it' },
  { value: 'undecided', label: 'Undecided' },
];

const READERSHIPS = [
  { value: 'family-only', label: 'Family and friends' },
  { value: 'public', label: 'A general readership' },
  { value: 'undecided', label: 'Undecided' },
];

const FORMATS = ['Articles', 'Long-form guides', 'Newsletters', 'Case studies', 'Web copy', 'Scripts'];

/** Which step owns a field, so a server-side rejection moves the person to where the fix is. */
const STEP_OF_FIELD: Record<string, number> = {
  segment: 1,
  manuscriptStage: 2,
  genre: 2,
  wordCount: 2,
  previouslyPublished: 2,
  triedElsewhere: 2,
  timeline: 2,
  bookPurpose: 2,
  whoWrites: 2,
  companyName: 2,
  approvalNeeded: 2,
  intendedReadership: 2,
  expectationsAcknowledged: 2,
  formats: 2,
  volumePerMonth: 2,
  turnaroundNeeded: 2,
  procurementProcess: 2,
  manuscriptLink: 3,
  budget_band: 3,
  full_name: 4,
  email: 4,
  company: 4,
  phone: 4,
  message: 4,
};

const STEP_TITLES = [
  'Which describes you?',
  'About the work',
  'Budget and the manuscript',
  'How to reach you',
];

function Check({
  name,
  value,
  label,
  id,
}: {
  name: string;
  value: string;
  label: string;
  id: string;
}) {
  return (
    <div className={styles.check}>
      <input type="checkbox" id={id} name={name} value={value} />
      <label htmlFor={id} className={styles.checkLabel}>
        {label}
      </label>
    </div>
  );
}

export function PressContactFlow({
  responseCommitment,
  expectationsStatement = null,
}: {
  responseCommitment: string;
  /** ETH-07's statement. `R-09`/`O-09` own the copy; null withholds the memoir segment. */
  expectationsStatement?: string | null;
}) {
  const [state, formAction, pending] = useActionState(submitPressLeadAction, INITIAL);
  const [step, setStep] = useState(1);
  const [segment, setSegment] = useState<PressSegment | ''>('');
  const headingRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  const errors = state.status === 'invalid' ? state.errors : {};
  const firstError = (name: string) => errors[name]?.[0];

  // A rejection that leaves you on step 4 looking at a clean page is indistinguishable from a
  // rejection that did nothing. Move to the step that owns the first failing field.
  useEffect(() => {
    if (state.status !== 'invalid') return;
    const first = Object.keys(state.errors)[0];
    if (first && STEP_OF_FIELD[first]) setStep(STEP_OF_FIELD[first]);
  }, [state]);

  // Focus the step heading on every move, so a keyboard or screen reader user is put at the top
  // of what changed rather than left wherever the button they pressed used to be (WCAG 2.4.3).
  useEffect(() => {
    if (!moved.current) return;
    headingRef.current?.focus();
  }, [step]);

  const go = (next: number) => {
    moved.current = true;
    setStep(next);
  };

  const segmentOptions = pressSegmentOptions(expectationsStatement !== null);
  const showManuscriptLink = segment === 'author' || segment === 'memoir';

  return (
    <form action={formAction} className={styles.form} noValidate>
      <p className={styles.progress} aria-live="polite">
        Step {step} of 4 — {STEP_TITLES[step - 1]}
      </p>

      {/* The focus target is the wrapper, not the <h2>: `Heading` is a Server Component with
          no ref and adding one to a shared primitive would put every division's headings
          through review for this one page's benefit. A focused container announces the heading
          it contains, which is what WCAG 2.4.3 needs here. */}
      <div ref={headingRef} tabIndex={-1} className={controls.focusable}>
        <Heading level={2}>{STEP_TITLES[step - 1]}</Heading>
      </div>

      {state.status === 'invalid' ? (
        <p className={styles.formError} role="alert">
          There is a problem with {Object.keys(errors).length === 1 ? 'one answer' : 'some answers'}.
          The details are next to each one.
        </p>
      ) : null}
      {state.status === 'error' ? (
        <p className={styles.formError} role="alert">
          We could not send that, and nothing you typed has been lost. Try again, or email{' '}
          <a href="mailto:contact@gridsmith.uk">contact@gridsmith.uk</a> directly.
        </p>
      ) : null}

      {/* The change handler sits on the wrapper rather than on `RadioGroup`: the primitive has
          no `onChange` by design (it is a Server Component), and change events bubble. */}
      <div
        className={styles.step}
        hidden={step !== 1}
        onChange={(e) => setSegment((e.target as HTMLInputElement).value as PressSegment)}
      >
        <RadioGroup
          name="segment"
          legend="Which describes you?"
          options={segmentOptions}
          required
          error={firstError('segment')}
        />
      </div>

      <div className={styles.step} hidden={step !== 2}>
        {segment === 'author' ? (
          <>
            <RadioGroup name="manuscriptStage" legend="Where is the manuscript?" options={STAGES} required error={firstError('manuscriptStage')} />
            <Field name="genre" label="What kind of book is it?" required hint="Fiction, memoir, business, history — whatever you would call it." error={firstError('genre')} />
            <Select name="wordCount" label="Roughly how long is it?" options={WORD_COUNTS} required error={firstError('wordCount')} />
            <RadioGroup name="previouslyPublished" legend="Have you published a book before?" options={YES_NO} required error={firstError('previouslyPublished')} />
            <Field name="triedElsewhere" label="What have you already tried?" multiline hint="Agents, other publishers, doing it yourself — all useful, and none of it counts against you." error={firstError('triedElsewhere')} />
            <Select name="timeline" label="When would you like it published?" options={TIMELINE_OPTIONS} required error={firstError('timeline')} />
          </>
        ) : null}

        {segment === 'business' ? (
          <>
            <Select name="bookPurpose" label="What is the book for?" options={BOOK_PURPOSES} required error={firstError('bookPurpose')} />
            <Select name="whoWrites" label="Who writes it?" options={WHO_WRITES} required error={firstError('whoWrites')} />
            <Field name="companyName" label="Company name" required autoComplete="organization" error={firstError('companyName')} />
            <RadioGroup name="approvalNeeded" legend="Does this need internal approval before it can start?" options={YES_NO} required error={firstError('approvalNeeded')} />
            <Select name="timeline" label="When do you need it?" options={TIMELINE_OPTIONS} required error={firstError('timeline')} />
          </>
        ) : null}

        {segment === 'memoir' && expectationsStatement ? (
          <>
            {/* ETH-07 / PROJECT-RULES §5: before the budget question, never after it. */}
            <p className={styles.expectations}>{expectationsStatement}</p>
            <div className={styles.checks}>
              <Check
                name="expectationsAcknowledged"
                value="yes"
                label="I have read the statement above."
                id="press-expectations-ack"
              />
            </div>
            {firstError('expectationsAcknowledged') ? (
              <p className={styles.formError} role="alert">
                Please confirm you have read the statement above before continuing.
              </p>
            ) : null}
            <RadioGroup name="manuscriptStage" legend="Where is the writing?" options={STAGES.filter((s) => s.value !== 'revised-draft')} required error={firstError('manuscriptStage')} />
            <RadioGroup name="intendedReadership" legend="Who is it for?" options={READERSHIPS} required error={firstError('intendedReadership')} />
            <Select name="timeline" label="When would you like it finished?" options={MEMOIR_TIMELINE_OPTIONS} required error={firstError('timeline')} />
          </>
        ) : null}

        {segment === 'content' ? (
          <>
            <fieldset className={styles.checks}>
              <legend>What formats do you need?</legend>
              {FORMATS.map((f) => (
                <Check key={f} name="formats" value={f} label={f} id={`press-format-${f.toLowerCase().replace(/\W+/g, '-')}`} />
              ))}
            </fieldset>
            {firstError('formats') ? (
              <p className={styles.formError} role="alert">Pick at least one format.</p>
            ) : null}
            <Field name="volumePerMonth" label="How much, per month?" required hint="Two long articles, one newsletter a week — an estimate is fine." error={firstError('volumePerMonth')} />
            <Field name="turnaroundNeeded" label="What turnaround do you need?" required error={firstError('turnaroundNeeded')} />
            <RadioGroup name="procurementProcess" legend="Is there a procurement or contracting process to go through?" options={YES_NO} required error={firstError('procurementProcess')} />
          </>
        ) : null}

        {segment === '' ? <p>Choose an answer on the first step and the questions here will follow it.</p> : null}
      </div>

      <div className={styles.step} hidden={step !== 3}>
        <Select
          name="budget_band"
          label="Rough budget"
          options={BUDGETS}
          required
          hint="An honest not-sure is more useful than a guess."
          error={firstError('budget_band')}
        />
        {showManuscriptLink ? (
          <Field
            name="manuscriptLink"
            label="A link to the manuscript"
            type="url"
            hint="A link only — Google Docs, Dropbox, anything you can share. We do not take uploads, so nothing of yours sits on our servers."
            error={firstError('manuscriptLink')}
          />
        ) : null}
      </div>

      <div className={styles.step} hidden={step !== 4}>
        <Field name="full_name" label="Your name" required autoComplete="name" error={firstError('full_name')} />
        <Field name="email" label="Email" type="email" required autoComplete="email" error={firstError('email')} />
        <Field name="company" label="Company" autoComplete="organization" error={firstError('company')} />
        <Field name="phone" label="Phone" type="tel" autoComplete="tel" error={firstError('phone')} />
        <Field name="message" label="Anything else we should know?" multiline error={firstError('message')} />
        <p className={styles.privacy}>
          {responseCommitment} What we do with what you send is in the{' '}
          <Link href="/legal/privacy">privacy notice</Link>.
        </p>
        {/* K-16 / FR-P24. Here rather than on the confirmation route: the confirmation is a
            plain route with no segment, and the requirement is that the applicable instrument
            is identified before an order is confirmed. An enquiry is not a contract
            (CONSUMER-TERMS.md §3, MSA-BUSINESS.md §1), so this says which terms *would*
            apply and does not present anything as agreed. */}
        {segment !== '' ? (
          <p className={styles.privacy}>
            {TERMS_COPY[pressSegmentTerms(segment)].sentence} Nothing is agreed until we send a
            written order confirmation.{' '}
            <Link href={`/legal/${pressSegmentTerms(segment)}`}>
              {TERMS_COPY[pressSegmentTerms(segment)].link}
            </Link>
            .
          </p>
        ) : null}
      </div>

      <div className={styles.nav}>
        {/* `Button` has no `onClick` — it is a Server Component and its docstring says so.
            These reuse its classes rather than adding a handler to the shared primitive. */}
        {step > 1 ? (
          <button type="button" className={btn('secondary')} onClick={() => go(step - 1)}>
            Back
          </button>
        ) : null}
        {step < 4 ? (
          <button
            type="button"
            className={btn('primary')}
            onClick={() => go(step + 1)}
            disabled={step === 1 && segment === ''}
          >
            Next
          </button>
        ) : (
          <button type="submit" className={btn('primary')} disabled={pending}>
            {pending ? 'Sending…' : 'Send this'}
          </button>
        )}
      </div>
    </form>
  );
}
