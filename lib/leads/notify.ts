import 'server-only';
import type { Lead } from './schema.ts';

/**
 * Notification fan-out for a captured lead (`A-08`).
 *
 * `FOUNDATION` §6: Supabase insert -> Resend internal notification -> Slack webhook.
 * **The insert is the commitment; these are the follow-up.** A lead that reached the database
 * and failed to notify is a lead we still have. `submitLead` inserts first, schedules this
 * afterwards, and never lets a failure here roll the insert back or reach the visitor.
 *
 * ## ⚠ The development sender proves the pipeline, not deliverability
 *
 * `onboarding@resend.dev` is Resend's shared sender and needs no DNS verification, which is
 * why development can send at all. **It can only deliver to the Resend account owner's own
 * address.** A green dev run therefore demonstrates that the pipeline composes, authenticates
 * and is accepted — and says **nothing** about delivery to an arbitrary recipient. Reading a
 * passing dev test as a verified production path is the mistake this paragraph exists to
 * prevent, and `check-axe` prints the same limit next to the assertion rather than leaving it
 * here where only an author would find it.
 *
 * ## ⚠ At deployment: MERGE the SPF include, never add a second record
 *
 * The sender becomes `notifications@gridsmith.uk` once DNS is done. **`gridsmith.uk` already
 * has an SPF record serving the live site's mail, and it is not being touched until then.**
 *
 * A domain may have exactly one SPF record. Publishing a second does not add to the first —
 * RFC 7208 §4.5 makes multiple records a `permerror`, and receivers treat that as no SPF at
 * all, so the *existing* mail starts failing authentication. The failure is silent from the
 * sending side: nothing bounces locally, and delivery degrades wherever the receiver enforces
 * it. Resend's `include:` must be merged into the existing record's single string.
 *
 * This is a recorded constraint, not an oversight: the domain is deliberately unverified in
 * Resend until deployment. `Q-M20`, and the deployment checklist.
 *
 * ## Credentials, and why unset differs from broken
 *
 * `RESEND_API_KEY`, `LEAD_NOTIFICATION_FROM` and `LEAD_NOTIFICATION_EMAIL` are set in
 * development. `SLACK_LEADS_WEBHOOK` is deliberately unused.
 *
 * **Unset is a skip; set-but-broken is a failure.** A provider nobody has configured must not
 * fail a build. A provider that has been configured and does not work must not pass silently —
 * that is how a pipeline is discovered to have been dropping notifications for a month.
 */
export type NotifyOutcome = {
  channel: 'resend-internal' | 'slack';
  status: 'sent' | 'skipped' | 'failed';
  detail?: string;
};

const RESEND_KEY = process.env.RESEND_API_KEY ?? '';
const NOTIFY_TO = process.env.LEAD_NOTIFICATION_EMAIL ?? '';
const NOTIFY_FROM = process.env.LEAD_NOTIFICATION_FROM ?? '';
const SLACK_WEBHOOK = process.env.SLACK_LEADS_WEBHOOK ?? '';

/**
 * **Never the message body.** The notification carries who, which division, and the record id.
 * The enquiry's own text stays in the database it was submitted to: copying it into an email
 * thread — or a Slack channel — puts it under a different retention regime than the one the
 * privacy notice describes.
 */
function internalEmail(lead: Lead, id: string): Record<string, unknown> {
  return {
    from: NOTIFY_FROM,
    to: [NOTIFY_TO],
    subject: `New ${lead.division} lead — ${lead.full_name}`,
    text: [
      `Division: ${lead.division}`,
      `Type: ${lead.lead_type}`,
      lead.service_slug ? `Service: ${lead.service_slug}` : null,
      `Name: ${lead.full_name}`,
      `Email: ${lead.email}`,
      lead.company ? `Company: ${lead.company}` : null,
      lead.phone ? `Phone: ${lead.phone}` : null,
      '',
      `Record: ${id}`,
    ]
      .filter(Boolean)
      .join('\n'),
  };
}

/**
 * What the **server** is configured with. The gate asks rather than inferring from its own
 * environment: `check-axe` runs in one process and the app in another, and a gate that decides
 * "configured" from its own `process.env` is asserting against a state it does not observe.
 * That mismatch produced a real false message during A-08's proof — the gate reported "not
 * configured" for a server that was configured and failing.
 */
export function notifyConfigured(): boolean {
  return Boolean(RESEND_KEY && NOTIFY_TO && NOTIFY_FROM);
}

export async function notifyLead(lead: Lead, id: string): Promise<NotifyOutcome[]> {
  const out: NotifyOutcome[] = [];

  if (!RESEND_KEY || !NOTIFY_TO || !NOTIFY_FROM) {
    out.push({ channel: 'resend-internal', status: 'skipped', detail: 'Resend not configured' });
  } else {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(internalEmail(lead, id)),
      });
      // The body can echo the recipient, so only the status is carried forward.
      out.push(
        res.ok
          ? { channel: 'resend-internal', status: 'sent' }
          : { channel: 'resend-internal', status: 'failed', detail: `HTTP ${res.status}` },
      );
    } catch (error) {
      out.push({
        channel: 'resend-internal',
        status: 'failed',
        detail: error instanceof Error ? error.message : 'unknown',
      });
    }
  }

  if (!SLACK_WEBHOOK) {
    out.push({ channel: 'slack', status: 'skipped', detail: 'not used in development' });
  } else {
    try {
      const res = await fetch(SLACK_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `New ${lead.division} lead: ${lead.full_name} (${lead.lead_type})` }),
      });
      out.push(
        res.ok
          ? { channel: 'slack', status: 'sent' }
          : { channel: 'slack', status: 'failed', detail: `HTTP ${res.status}` },
      );
    } catch (error) {
      out.push({ channel: 'slack', status: 'failed', detail: error instanceof Error ? error.message : 'unknown' });
    }
  }

  return out;
}
