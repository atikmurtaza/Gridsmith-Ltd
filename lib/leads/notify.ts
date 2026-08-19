import 'server-only';
import type { Lead } from './schema.ts';

/**
 * Notification fan-out for a captured lead (`A-08`).
 *
 * `FOUNDATION` §6: Supabase insert -> Resend internal notification and applicant auto-reply
 * -> Slack webhook. **The insert is the commitment; these are the follow-up.** A lead that
 * reached the database and failed to notify is a lead we still have. A lead that notified and
 * failed to insert is one we will lose the moment someone closes the tab, which is why
 * `submitLead` inserts first and never lets a notification failure roll it back.
 *
 * ## The "<60s" figure is a target, and nothing measures it
 *
 * `FOUNDATION` §6 says "internal notification (<60s)" and `SCHEMA-CORE.md` §3 says "alert if
 * p95 exceeds 60 seconds". **Neither has ever been measured, and this file does not pretend
 * otherwise.** What exists is the column the measurement will use: `notified_at` is stamped
 * when the internal notification is accepted, so `notified_at - created_at` becomes real data
 * the first time a lead is captured. The alert is not built — it needs production traffic and
 * an alerting destination, neither of which exists. Recorded as `M-P2-13`.
 *
 * ## Credentials
 *
 * `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL` and `SLACK_LEADS_WEBHOOK` are unset (`Q-M20`).
 * **Unset is a skip; set-but-broken is a failure.** That distinction is the whole design: a
 * provider nobody has configured yet must not fail a build, and a provider that has been
 * configured and does not work must not pass silently — that is how a lead pipeline is
 * discovered to have been dropping notifications for a month.
 */
export type NotifyOutcome = {
  channel: 'resend-internal' | 'resend-reply' | 'slack';
  status: 'sent' | 'skipped' | 'failed';
  detail?: string;
};

const RESEND_KEY = process.env.RESEND_API_KEY ?? '';
const NOTIFY_TO = process.env.LEAD_NOTIFICATION_EMAIL ?? '';
const NOTIFY_FROM = process.env.LEAD_NOTIFICATION_FROM ?? '';
const SLACK_WEBHOOK = process.env.SLACK_LEADS_WEBHOOK ?? '';

async function resend(payload: Record<string, unknown>): Promise<Response> {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * **Never the message body, and never the applicant's own words.** The internal notification
 * carries who and what, and a link to the record. Copying free text into Slack puts whatever
 * someone typed into a public form into a channel history, which is a different retention
 * regime from the database it was meant for.
 */
export async function notifyLead(lead: Lead, id: string): Promise<NotifyOutcome[]> {
  const out: NotifyOutcome[] = [];

  const internal =
    !RESEND_KEY || !NOTIFY_TO || !NOTIFY_FROM
      ? { channel: 'resend-internal' as const, status: 'skipped' as const, detail: 'Q-M20: Resend not configured' }
      : await resend({
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
        })
          .then((r) =>
            r.ok
              ? { channel: 'resend-internal' as const, status: 'sent' as const }
              : { channel: 'resend-internal' as const, status: 'failed' as const, detail: `HTTP ${r.status}` },
          )
          .catch((e: unknown) => ({
            channel: 'resend-internal' as const,
            status: 'failed' as const,
            detail: e instanceof Error ? e.message : 'unknown',
          }));
  out.push(internal);

  if (SLACK_WEBHOOK) {
    out.push(
      await fetch(SLACK_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `New ${lead.division} lead: ${lead.full_name} (${lead.lead_type})` }),
      })
        .then((r) =>
          r.ok
            ? { channel: 'slack' as const, status: 'sent' as const }
            : { channel: 'slack' as const, status: 'failed' as const, detail: `HTTP ${r.status}` },
        )
        .catch((e: unknown) => ({
          channel: 'slack' as const,
          status: 'failed' as const,
          detail: e instanceof Error ? e.message : 'unknown',
        })),
    );
  } else {
    out.push({ channel: 'slack', status: 'skipped', detail: 'Q-M20: webhook not configured' });
  }

  return out;
}
