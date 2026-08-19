import { z } from 'zod';

/**
 * The lead payload, validated at the trust boundary (`A-08`).
 *
 * **This is the only thing between a public form and the database.** `anon` may insert into
 * `leads` and nothing else — that is the whole RLS posture — so `with check (true)` on the
 * policy is safe precisely because the shape is enforced here, before the insert. Loosening
 * this schema loosens the database.
 *
 * The enums mirror the Postgres types in `supabase/migrations/0001_core.sql`. They are
 * duplicated rather than generated, and that is the `check:tokens` division again: the
 * question is *does the application send what the database accepts?*, so an expectation
 * derived from the migration would move with any mistake made there. `check:leads` asserts
 * the two lists agree.
 */
export const DIVISIONS = ['design', 'digital', 'press', 'unsure'] as const;
export const LEAD_TYPES = ['enquiry', 'sample_request', 'estimate', 'assessment', 'newsletter'] as const;

/**
 * **No PII beyond what the form asks for, and nothing derived.** `PROJECT-RULES.md` §6 bans
 * IP addresses and raw user agents from `consent_events`; the same reasoning applies here.
 * Attribution fields are campaign metadata, not identity.
 */
export const leadSchema = z.object({
  division: z.enum(DIVISIONS),
  lead_type: z.enum(LEAD_TYPES).default('enquiry'),
  track: z.string().max(80).optional(),
  service_slug: z.string().max(200).optional(),

  // `full_name` and `email` are the table's only NOT NULL text columns.
  full_name: z.string().trim().min(1, 'Tell us your name').max(200),
  email: z.email('That does not look like an email address').max(320),

  company: z.string().max(200).optional(),
  role: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  message: z.string().max(5000).optional(),
  budget_band: z.string().max(80).optional(),
  timeline: z.string().max(80).optional(),

  /**
   * Division-specific answers. Capped, because `payload` is `jsonb` with a GIN index and an
   * unbounded object from a public endpoint is a denial-of-service shape, not just untidy.
   */
  payload: z.record(z.string().max(120), z.unknown()).default({}),

  source: z.string().max(120).optional(),
  medium: z.string().max(120).optional(),
  campaign: z.string().max(200).optional(),
  referrer: z.string().max(500).optional(),
  landing_page: z.string().max(500).optional(),
  is_ai_referral: z.boolean().default(false),
});

export type Lead = z.infer<typeof leadSchema>;
