/**
 * The shared event taxonomy (`A-09`, FOUNDATION §"Analytics events").
 *
 * **Eleven names, closed.** A union rather than a string means a typo is a build error
 * instead of an event that silently never appears in a report — which is the failure mode
 * that makes analytics untrustworthy months later, when nobody can tell a missing event
 * from a missing behaviour.
 *
 * **Unreferenced since round 8, deliberately.** The analytics injection was deleted with the
 * consent categories (OQ-7 option 2 — `lib/consent/state.ts`), so nothing imports this file
 * today. It is kept because it is design work the specs name, not because it runs: wiring
 * analytics up is `docs/_shared/BEFORE-LAUNCH.md` §"Analytics" and starts from here.
 */
export const EVENTS = [
  'page_view',
  'division_view',
  'service_view',
  'case_study_view',
  'estimator_start',
  'estimator_complete',
  'cta_click',
  'form_step',
  'form_submit',
  'form_error',
  'sample_request',
  'outbound_click',
] as const;
export type EventName = (typeof EVENTS)[number];

/** Every event carries these four — FOUNDATION, verbatim. */
export type EventContext = {
  division: 'master' | 'design' | 'digital' | 'press';
  service_slug: string | null;
  traffic_source: string;
  is_ai_referral: boolean;
};

/**
 * No PII, ever — `PROJECT-RULES.md` §6, all four route groups. Event properties are a
 * `string | number | boolean` map by type so an object carrying a form field cannot be
 * passed without someone noticing.
 */
export type EventProps = Record<string, string | number | boolean | null>;
