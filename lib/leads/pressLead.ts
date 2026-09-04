import { z } from 'zod';

/**
 * The Press contact-flow payload (`K-13`, `press/SCHEMA.md` §6, `press/APP-FLOW.md` §6).
 *
 * This is the *branch* half of a Press enquiry. The identity half — name, email, phone,
 * company, message, budget band — is `leadSchema`'s, and stays there: **there is one lead
 * pipeline and one insert**, and this object is what lands in `leads.payload`, the `jsonb`
 * column that already carries `leads_payload_gin`. Nothing here opens a second data path,
 * a second table, or a second RLS surface.
 *
 * ## Why it is a discriminated union rather than four optional groups
 *
 * A flat object with every branch's fields optional accepts a memoir enquiry carrying an
 * author's `wordCount`, and — the part that matters — accepts a memoir enquiry with no
 * `expectationsAcknowledged` at all, because an absent optional is valid. The union makes the
 * segment select the required set, so the ETH-07 gate below cannot be routed around by
 * relabelling the submission.
 *
 * ## `expectationsAcknowledged` is `z.literal(true)`, not `z.boolean()`
 *
 * `press/PROJECT-RULES.md` §7: *"The memoir branch cannot submit without
 * `expectationsAcknowledged: true`. Enforced in the Zod schema, not just the UI."*
 * `press/SCHEMA.md` §6 writes it `z.boolean()` and states the requirement in the prose
 * underneath — a boolean accepts `false`, so the prose was the enforcement and the schema was
 * not. `z.literal(true)` is the same requirement expressed where the rule says it must live.
 * `check:press:contact:selftest` makes it fail.
 *
 * ## The memoir branch is not offered while the ETH-07 statement does not exist
 *
 * The statement itself is `R-09`/`O-09` and is not authored here (non-negotiable #2). A
 * checkbox asking someone to acknowledge a statement that is not on the page is worse than no
 * checkbox, so `pressSegmentOptions()` withholds the memoir option until a statement is
 * supplied — `pressSegmentOptions` lives in `./pressSegments.ts`, which carries no Zod import
 * because importing this file from the client put the route 3.9KB over its 20KB budget. That coupling
 * is asserted in the selftest by reading the returned list, not by looking at a rendered page —
 * the reading is a value rather than an absence.
 */

/** Shared across the author, business and memoir branches. `content` bands differently. */
export const TIMELINES = ['3-months', '6-months', '12-months', 'no-deadline'] as const;

const authorPayload = z.object({
  segment: z.literal('author'),
  manuscriptStage: z.enum(['idea', 'partial-draft', 'finished-draft', 'revised-draft']),
  genre: z.string().trim().min(1).max(120),
  wordCount: z.enum(['under-20k', '20k-50k', '50k-80k', '80k-120k', '120k-plus', 'unknown']),
  previouslyPublished: z.boolean(),
  triedElsewhere: z.string().max(2000).optional(),
  /** A link, never an upload — `press/TECH-SPEC.md` §9 and `PROJECT-RULES.md` §7. */
  manuscriptLink: z.url().max(500).optional(),
  timeline: z.enum(TIMELINES),
});

const businessPayload = z.object({
  segment: z.literal('business'),
  bookPurpose: z.enum(['credibility', 'lead-generation', 'speaking', 'internal', 'launch']),
  whoWrites: z.enum(['ghostwritten', 'i-write-you-edit', 'team-writes', 'undecided']),
  companyName: z.string().trim().min(1).max(200),
  approvalNeeded: z.boolean(),
  timeline: z.enum(TIMELINES),
});

const memoirPayload = z.object({
  segment: z.literal('memoir'),
  manuscriptStage: z.enum(['idea', 'partial-draft', 'finished-draft']),
  intendedReadership: z.enum(['family-only', 'public', 'undecided']),
  /** ETH-07. See the note above on why this is a literal and not a boolean. */
  expectationsAcknowledged: z.literal(true),
  timeline: z.enum(['6-months', '12-months', 'no-deadline']),
  manuscriptLink: z.url().max(500).optional(),
});

const contentPayload = z.object({
  segment: z.literal('content'),
  formats: z.array(z.string().max(60)).min(1),
  volumePerMonth: z.string().trim().min(1).max(120),
  turnaroundNeeded: z.string().trim().min(1).max(120),
  procurementProcess: z.boolean(),
});

export const pressLeadPayload = z.discriminatedUnion('segment', [
  authorPayload,
  businessPayload,
  memoirPayload,
  contentPayload,
]);

export type PressLeadPayload = z.infer<typeof pressLeadPayload>;

const str = (form: FormData, name: string) => {
  const value = form.get(name);
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
};
const bool = (form: FormData, name: string) => str(form, name) === 'yes';

/** Exported for the selftest: the FormData → payload mapping is where a branch silently drops. */
export function pressPayloadFrom(formData: FormData): unknown {
  const segment = str(formData, 'segment');
  switch (segment) {
    case 'author':
      return {
        segment,
        manuscriptStage: str(formData, 'manuscriptStage'),
        genre: str(formData, 'genre'),
        wordCount: str(formData, 'wordCount'),
        previouslyPublished: bool(formData, 'previouslyPublished'),
        triedElsewhere: str(formData, 'triedElsewhere'),
        manuscriptLink: str(formData, 'manuscriptLink'),
        timeline: str(formData, 'timeline'),
      };
    case 'business':
      return {
        segment,
        bookPurpose: str(formData, 'bookPurpose'),
        whoWrites: str(formData, 'whoWrites'),
        companyName: str(formData, 'companyName'),
        approvalNeeded: bool(formData, 'approvalNeeded'),
        timeline: str(formData, 'timeline'),
      };
    case 'memoir':
      return {
        segment,
        manuscriptStage: str(formData, 'manuscriptStage'),
        intendedReadership: str(formData, 'intendedReadership'),
        // Absent when unticked, so the literal(true) gate rejects it rather than reading `false`
        // as a considered answer.
        expectationsAcknowledged: str(formData, 'expectationsAcknowledged') === 'yes',
        timeline: str(formData, 'timeline'),
        manuscriptLink: str(formData, 'manuscriptLink'),
      };
    case 'content':
      return {
        segment,
        formats: formData.getAll('formats').filter((v): v is string => typeof v === 'string'),
        volumePerMonth: str(formData, 'volumePerMonth'),
        turnaroundNeeded: str(formData, 'turnaroundNeeded'),
        procurementProcess: bool(formData, 'procurementProcess'),
      };
    default:
      return { segment };
  }
}
