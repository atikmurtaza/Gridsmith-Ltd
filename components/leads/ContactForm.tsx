'use client';
// `useActionState` is a client hook. This is the ONE client boundary on the master layer
// besides the consent banner, and it exists because a form that loses everything you typed
// when validation fails is a form people abandon — a server redirect back with `?error=`
// costs nothing to build and costs a lead every time it fires.

import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/primitives/Button';
import { Field } from '@/components/primitives/Field';
import { Heading } from '@/components/primitives/Heading';
import { RadioGroup } from '@/components/primitives/RadioGroup';
import { Select } from '@/components/primitives/Select';
import { submitLeadAction, type FormState } from '@/lib/leads/action';
import { readEnquiryContext } from '@/lib/services/architecture';
import styles from './leads.module.css';

/**
 * The enquiry form (`N-11`) and its confirmation (`N-12`).
 *
 * ## "More than one" is first-class, and it is first
 *
 * `APP-FLOW.md` M-J2 is the highest-value journey on the site: a buyer whose need spans two
 * divisions. `N-11`'s row says *"More than one" first-class*, and the way that is honoured is
 * that it is an option of equal weight in the first question — not an "other" at the bottom of
 * a list, and not a checkbox someone has to find.
 *
 * ## The confirmation renders in place
 *
 * `N-12` wants a confirmation screen carrying `companyDetails.responseCommitment`. It renders
 * here rather than at `/contact/thank-you` because a route would mean either losing the
 * submission id on refresh or making the route dynamic; the commitment string is passed in from
 * the server so that this component holds no copy of it. **There is exactly one source for
 * that sentence** — non-negotiable #5 — and it is the CMS singleton.
 *
 * ## Errors are announced, not merely coloured
 *
 * `role="alert"` on the failure summary, and per-field messages wired through `Field`'s
 * `error` prop, which puts them in `aria-describedby` and sets `aria-invalid`. Colour alone
 * would fail WCAG 1.4.1; a message that only appears visually fails 3.3.1.
 *
 * ## Arriving from a CTA keeps its context (`GS-P03`)
 *
 * Every division CTA points here as `/contact?division=…&service=…`. The page is static, so the
 * query is read after mount: the division is preselected (the visitor can still change it) and
 * the service travels as a hidden `service_slug`, which the Server Action maps by name and
 * `leadSchema` bounds. Without JavaScript nothing is preselected and the form still works.
 * `readEnquiryContext` drops anything malformed rather than repairing it.
 */
const INITIAL: FormState = { status: 'idle' };

const DIVISIONS = [
  { value: 'unsure', label: 'More than one, or I am not sure', hint: 'This goes straight to the founder.' },
  { value: 'design', label: 'Design — brand, 3D, CAD, drawings' },
  { value: 'digital', label: 'Digital — websites, software, AI' },
  { value: 'press', label: 'Press — publishing, writing, content' },
];

/**
 * **Shaped, not priced — and since `GS-D002` that is permanent rather than provisional.**
 *
 * Gridsmith quotes bespoke work and publishes no prices, so money bands here would be the only
 * figures on the site and a reader would reasonably take them as the shape of what we charge.
 * Bands by *shape of engagement* qualify a lead just as well and assert nothing. They are not
 * waiting to be replaced with money bands.
 */
const BUDGETS = [
  { value: 'not-sure', label: 'Not sure yet' },
  { value: 'small', label: 'A small, well-defined piece of work' },
  { value: 'project', label: 'A full project' },
  { value: 'programme', label: 'An ongoing programme or retainer' },
];

const TIMELINES = [
  { value: 'exploring', label: 'Exploring options' },
  { value: 'this-month', label: 'This month' },
  { value: 'this-quarter', label: 'This quarter' },
  { value: 'fixed-date', label: 'I have a fixed date' },
];

export function ContactForm({ responseCommitment }: { responseCommitment: string }) {
  const [state, formAction, pending] = useActionState(submitLeadAction, INITIAL);
  const [context, setContext] = useState<ReturnType<typeof readEnquiryContext>>({});
  useEffect(() => setContext(readEnquiryContext(window.location.search)), []);

  if (state.status === 'ok') {
    return (
      <div className={styles.confirmation} role="status">
        <Heading level={2}>
          Thank you — that has reached us.
        </Heading>
        {/* The single source of truth for what we promise. Non-negotiable #5: nothing on this
            site may promise a response faster than the end of the next business day, and the
            way that is guaranteed is that no page writes the sentence itself. */}
        <p className={styles.commitment}>{responseCommitment}</p>
        <p className={styles.confirmationDetail}>
          If you need to add something, reply to the acknowledgement or write to{' '}
          <a href="mailto:contact@gridsmith.uk">contact@gridsmith.uk</a>.
        </p>
      </div>
    );
  }

  const errors = state.status === 'invalid' ? state.errors : {};
  const firstError = (name: string) => errors[name]?.[0];

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state.status === 'invalid' ? (
        <p className={styles.formError} role="alert">
          There is a problem with {Object.keys(errors).length === 1 ? 'one field' : 'some fields'}.
          The details are next to each one below.
        </p>
      ) : null}
      {state.status === 'error' ? (
        <p className={styles.formError} role="alert">
          We could not send that. Nothing was lost — try again, or email{' '}
          <a href="mailto:contact@gridsmith.uk">contact@gridsmith.uk</a> directly.
        </p>
      ) : null}

      {/* `key` remounts the uncontrolled group once the CTA context has been read. */}
      <RadioGroup
        key={context.division ?? 'none'}
        name="division"
        legend="What do you need?"
        options={DIVISIONS}
        defaultValue={context.division ?? 'unsure'}
        required
        error={firstError('division')}
      />
      {context.service ? <input type="hidden" name="service_slug" value={context.service} /> : null}

      <Field
        name="full_name"
        label="Your name"
        required
        autoComplete="name"
        error={firstError('full_name')}
      />
      <Field
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        error={firstError('email')}
      />
      <Field name="company" label="Company" autoComplete="organization" error={firstError('company')} />
      <Field name="phone" label="Phone" type="tel" autoComplete="tel" error={firstError('phone')} />

      <Field
        name="message"
        label="What are you trying to do?"
        multiline
        hint="A sentence is enough. We will ask the rest."
        error={firstError('message')}
      />

      <Select
        name="budget_band"
        label="Rough budget"
        options={BUDGETS}
        hint="An honest not-sure is more useful than a guess."
        error={firstError('budget_band')}
      />
      <Select name="timeline" label="Timeline" options={TIMELINES} error={firstError('timeline')} />

      <Button type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Send this'}
      </Button>
    </form>
  );
}
