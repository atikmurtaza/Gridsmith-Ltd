/** Bounded private notification processor; message/manuscript content never leaves leads. */
export type NotificationWork = {
  id: string; lead_id: string; lease_token: string; attempts: number; form_type: string;
  lead: { division: string; lead_type: string; service_slug?: string; full_name: string;
    email: string; company?: string; phone?: string };
};
export type MailOutcome = 'sent' | 'temporary' | 'permanent' | 'ambiguous';
export type WorkerStore = {
  claim: () => Promise<NotificationWork[]>;
  finish: (work: NotificationWork, outcome: MailOutcome) => Promise<'sent' | 'retry' | 'dead' | null>;
  health: () => Promise<unknown>;
};
export type MailConfig = { key: string; from: string; to: string; synthetic: boolean };

export function notificationEmail(work: NotificationWork, config: MailConfig) {
  const lead = work.lead;
  return { from: config.from, to: [config.to],
    subject: `${config.synthetic ? '[SYNTHETIC H4-B TEST] ' : ''}New ${lead.division} lead — ${lead.full_name}`,
    text: [config.synthetic ? 'SYNTHETIC GS-HOST-H4-B TEST — no customer data.' : null,
      `Division: ${lead.division}`, `Type: ${lead.lead_type}`,
      lead.service_slug ? `Service: ${lead.service_slug}` : null,
      `Name: ${lead.full_name}`, `Email: ${lead.email}`,
      lead.company ? `Company: ${lead.company}` : null, lead.phone ? `Phone: ${lead.phone}` : null,
      '', `Record: ${work.lead_id}`].filter((line) => line !== null).join('\n') };
}

export async function sendNotification(work: NotificationWork, config: MailConfig,
  transport: typeof fetch = fetch): Promise<MailOutcome> {
  try {
    const response = await transport('https://api.resend.com/emails', { method: 'POST',
      headers: { Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json',
        'Idempotency-Key': `gridsmith-notification/${work.id}` },
      body: JSON.stringify(notificationEmail(work, config)), signal: AbortSignal.timeout(8000) });
    if (response.ok) return 'sent';
    // Rate/provider failure is retryable. Never keep raw provider bodies or errors.
    return response.status === 409 || response.status === 429 || response.status >= 500 ? 'temporary' : 'permanent';
  } catch { return 'ambiguous'; }
}

export function createWorker(token: string | ((request: Request) => Promise<boolean>), store: WorkerStore, config: MailConfig,
  transport: typeof fetch = fetch) {
  if (typeof token === 'string' && token.length < 32) throw new Error('Private worker credential required');
  return async (request: Request) => {
    const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), {
      status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff' } });
    // Gateway verifies the JWT as well; an authenticated visitor is not a worker.
    if (!(typeof token === 'string' ? request.headers.get('Authorization') === `Bearer ${token}` : await token(request))) {
      return reply(401, { status: 'rejected' });
    }
    if (request.method !== 'POST') return reply(405, { status: 'rejected' });
    if ((request.headers.get('Content-Type') ?? '').split(';')[0] !== 'application/json') return reply(415, { status: 'rejected' });
    let operation: unknown;
    try {
      const reader = request.body?.getReader(); let size = 0, text = '';
      if (!reader) return reply(400, { status: 'rejected' });
      const decoder = new TextDecoder('utf-8', { fatal: true });
      for (;;) { const { done, value } = await reader.read(); if (done) break;
        size += value.length; if (size > 256) { await reader.cancel(); return reply(413, { status: 'rejected' }); }
        text += decoder.decode(value, { stream: true }); }
      text += decoder.decode(); const body = JSON.parse(text);
      if (!body || Array.isArray(body) || Object.keys(body).length !== 1) return reply(400, { status: 'rejected' });
      operation = body.operation;
    } catch { return reply(400, { status: 'rejected' }); }
    try {
      if (operation === 'health') return reply(200, { status: 'ok', queue: await store.health(), mailConfigured:
        Boolean(config.key && config.from && config.to) });
      if (operation !== 'drain') return reply(400, { status: 'rejected' });
      // Unconfigured mail never consumes attempts or causes terminal loss.
      if (!config.key || !config.from || !config.to) return reply(503, { status: 'unavailable' });
      const jobs = await store.claim();
      if (jobs.length > 5) throw new Error('Oversized worker batch');
      const counts: Record<string, number> = { claimed: jobs.length, sent: 0, retry: 0, dead: 0, unconfirmed: 0 };
      for (const work of jobs) {
        const outcome = await sendNotification(work, config, transport);
        const state = await store.finish(work, outcome);
        if (state === 'sent' || state === 'retry' || state === 'dead') counts[state]++;
        else counts.unconfirmed++;
      }
      return reply(200, { status: 'ok', ...counts });
    } catch { return reply(503, { status: 'unavailable' }); }
  };
}
