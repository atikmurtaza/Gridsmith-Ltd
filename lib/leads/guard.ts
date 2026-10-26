/**
 * Form bot protection, server side (`GS-PROD-001`).
 *
 * **A honeypot, checked by both Server Action adapters before anything else runs.** The field is
 * rendered inside a `hidden` container (`components/leads/Honeypot.tsx`), so no person, keyboard
 * or screen reader ever reaches it and browsers do not autofill it, while scripts that fill
 * every input in the HTML do. A filled trap is discarded **silently**: the caller answers as if
 * the enquiry landed, no row is written and no mail is sent, so a bot learns nothing to adapt to.
 *
 * Deliberately not here, and why:
 * - **A timing check.** Every form page is static, so the server has no per-visitor render time,
 *   and a client timestamp is the visitor's clock — skew would reject real people. A trap that
 *   can fire on a human is worse than none.
 * - **A rate limit.** No store in this stack can hold one reliably across serverless instances
 *   without recording visitor IPs, which `PROJECT-RULES.md` §6 and the privacy notice exclude.
 *   It is a Vercel Firewall rule on the two form routes, set at cutover (`GS-PROD-001.md`).
 * - **Turnstile.** A third-party script with CSP, privacy-notice and key consequences; the
 *   escalation if observed spam gets past the layers above, not the default.
 *
 * Imported by the client field for the name only, so it must stay free of server imports.
 */
export const HONEYPOT_FIELD = 'website';

/** True when the trap holds anything at all — a string or a file. An absent field is not a trap. */
export function isTrapped(form: FormData): boolean {
  const value = form.get(HONEYPOT_FIELD);
  return value !== null && value !== '';
}
