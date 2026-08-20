/**
 * **The RLS drift check — `M-P1-3`. It reads the LIVE database, from outside, as `anon`.**
 *
 * ## Why it exists
 *
 * `A-07`'s leak was in the running system while the migration read correctly. `0001` created
 * `v_lead_funnel` exactly as `SCHEMA-CORE.md` §4 specifies; a Postgres view runs as its owner
 * unless `security_invoker` is set, the owner is `postgres`, and Supabase grants `anon` SELECT
 * on everything in `public` by default. So the SQL was right and the database was leaking. It
 * was found by asking PostgREST with the publishable key, and it could not have been found any
 * other way. `check:rls` reads the migrations and says so in its own output — *"Declared, not
 * live"*. This is the other half.
 *
 * ## Where it runs, and why not the three obvious alternatives
 *
 * **A Vercel Cron hitting this route on the deployment.**
 *
 * - **Not CI.** Pruning needs the service-role key and CI must not hold it — that is the
 *   standing rule, and it is currently also true that CI has not run since 13 Aug (`M-P1-5`),
 *   so a check living there would have been silent for the whole period it was needed.
 * - **Not `pg_cron` inside Supabase.** This is the decisive one. A job running inside the
 *   database runs *as a role*, and every role that can schedule work is privileged enough to
 *   be blind to exactly this class: `postgres` reads `leads` freely and always will. The leak
 *   was visible only from outside, over HTTP, holding nothing but a public key. **The vantage
 *   point is the check.** Moving it inside the database would reproduce the original mistake
 *   in a new place.
 * - **Not a script the owner runs.** Drift is a thing that happens over time — a migration, a
 *   dashboard edit, a restored backup. A check that depends on somebody remembering is not
 *   measuring the interval it exists to measure.
 *
 * The deployment already holds the credentials, is not the repository, and has a network path
 * to PostgREST. That is the whole requirement.
 *
 * ## What it asserts
 *
 * Everything below is asked **as `anon`, with the publishable key as the only credential** —
 * the service role is deliberately not used for any assertion, only for the prune. Using it
 * here would bypass RLS by design and every probe would pass for the wrong reason.
 *
 * The insert probe is not decoration: RLS drift runs both ways, and a tightening that breaks
 * the one capability the public form needs is as much a defect as a leak. It writes a row
 * marked `@gridsmith.invalid` — RFC 2606 reserves `.invalid`, so the marker can never collide
 * with a real address — and the prune then removes those rows, which closes `M-P2-14`.
 *
 * **The prune's configuration is reported, never inferred** (`M-P1-6`, `M-P1-7`): the caller is
 * told whether a service-role key was present rather than being left to read a zero as clean.
 */
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const PROJECT_URL = (process.env.PROJECT_URL ?? '').replace(/\/$/, '');
const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY ?? '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const CRON_SECRET = process.env.CRON_SECRET ?? '';

/** The reserved-TLD marker every probe row carries. RFC 2606: `.invalid` is never routable. */
const PROBE_EMAIL_SUFFIX = '@gridsmith.invalid';

const anonHeaders = { apikey: PUBLISHABLE_KEY, Authorization: `Bearer ${PUBLISHABLE_KEY}` };

/** Tables `anon` may never read. Absence of a policy is denial; this asserts the absence. */
const NO_READ = ['leads', 'sample_grants', 'events'];

/** Views `anon` may not reach at all — `0002` revoked the grant as well as setting invoker. */
const NO_REACH = ['v_lead_funnel'];

type Finding = { subject: string; problem: string; observed: string };

export async function GET(request: Request): Promise<Response> {
  // Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. Anything else is refused: this
  // route writes a row and, when configured, deletes rows. 404 rather than 401 so an
  // unauthorised caller cannot confirm the route exists.
  if (!CRON_SECRET || request.headers.get('authorization') !== `Bearer ${CRON_SECRET}`) {
    return new Response(null, { status: 404 });
  }

  if (!PROJECT_URL || !PUBLISHABLE_KEY) {
    return NextResponse.json(
      {
        ok: false,
        findings: [
          {
            subject: 'configuration',
            problem: 'PROJECT_URL or PUBLISHABLE_KEY is not set, so nothing was measured',
            observed: 'unset',
          },
        ],
      },
      { status: 500 },
    );
  }

  const findings: Finding[] = [];
  // What was actually seen. A green result that carries no evidence is the shape this
  // repository has been burned by; the caller gets the observations, not just a verdict.
  const observations: string[] = [];

  // **A status this check does not recognise is a finding, not a pass.** The first draft
  // treated any non-2xx as "no rows" and would have reported clean against an unreachable
  // database — the exact defect this repository keeps finding, written into the gate meant to
  // catch it. Denial (401/403) and an empty 200 are both correct postures; anything else means
  // nothing was measured, and that is never the same as clean.
  const DENIED = [401, 403];

  for (const table of NO_READ) {
    const res = await fetch(`${PROJECT_URL}/rest/v1/${table}?select=*&limit=1`, {
      headers: anonHeaders,
      cache: 'no-store',
    }).catch(() => null);
    if (!res) {
      findings.push({ subject: table, problem: 'the request did not complete, so nothing was measured', observed: 'network error' });
      continue;
    }
    if (DENIED.includes(res.status)) {
      observations.push(`${table}: HTTP ${res.status}, denied outright`);
      continue;
    }
    if (res.status !== 200) {
      findings.push({ subject: table, problem: 'unrecognised status — nothing was measured, which is not the same as clean', observed: `HTTP ${res.status}` });
      continue;
    }
    const rows: unknown = await res.json().catch(() => null);
    if (!Array.isArray(rows)) {
      findings.push({ subject: table, problem: 'the response body was not an array, so the row count below could not be trusted', observed: `HTTP 200, ${JSON.stringify(rows)?.slice(0, 80)}` });
      continue;
    }
    if (rows.length > 0) {
      findings.push({ subject: table, problem: 'anon SELECT returned rows — RLS is not denying reads', observed: `HTTP 200, ${rows.length} row(s)` });
      continue;
    }
    observations.push(`${table}: HTTP 200, 0 rows`);
  }

  for (const view of NO_REACH) {
    const res = await fetch(`${PROJECT_URL}/rest/v1/${view}?select=*&limit=1`, {
      headers: anonHeaders,
      cache: 'no-store',
    }).catch(() => null);
    if (!res) {
      findings.push({ subject: view, problem: 'the request did not complete, so nothing was measured', observed: 'network error' });
      continue;
    }
    if (!res.ok && !DENIED.includes(res.status) && res.status !== 404) {
      findings.push({ subject: view, problem: 'unrecognised status — nothing was measured', observed: `HTTP ${res.status}` });
      continue;
    }
    if (!res.ok) {
      observations.push(`${view}: HTTP ${res.status}, unreachable as intended`);
    }
    if (res.ok) {
      const rows: unknown = await res.json().catch(() => null);
      const count = Array.isArray(rows) ? rows.length : 0;
      // Reachable at all is the finding. `0002` made two changes and either alone leaves a
      // hole, so a reachable-but-empty view is drift before it has returned anything.
      findings.push({
        subject: view,
        problem:
          count > 0
            ? 'anon SELECT returned rows — this is A-07 exactly: the view is running as its owner and bypassing RLS'
            : 'anon can reach the view — the grant revoked in 0002 is back, and only security_invoker is holding the line',
        observed: `HTTP ${res.status}, ${count} row(s)`,
      });
    }
  }

  // The capability that must NOT be lost. Drift runs both ways.
  const insert = await fetch(`${PROJECT_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: { ...anonHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      division: 'design',
      full_name: 'RLS drift probe',
      email: `drift${PROBE_EMAIL_SUFFIX}`,
    }),
    cache: 'no-store',
    // `.catch` for the same reason as the probes above, and this one was missing until the
    // unreachable-host proof crashed the handler: an ENOTFOUND rejected here, escaped, and the
    // route returned an empty 500 with no findings at all. A gate that dies has not reported.
  }).catch(() => null);
  if (!insert) {
    findings.push({
      subject: 'leads',
      problem: 'the insert request did not complete, so the write path was not measured',
      observed: 'network error',
    });
  } else if (insert.ok) {
    observations.push(`leads insert: HTTP ${insert.status}, accepted`);
  }
  if (insert && !insert.ok) {
    findings.push({
      subject: 'leads',
      problem: 'anon INSERT was refused — the public contact form cannot submit',
      observed: `HTTP ${insert.status} ${(await insert.text()).slice(0, 200)}`,
    });
  }

  // Pruning needs the service role, which is why this job does not live in CI (`M-P2-14`).
  const pruneConfigured = Boolean(SERVICE_ROLE_KEY);
  let pruned: number | null = null;
  if (pruneConfigured) {
    const del = await fetch(
      `${PROJECT_URL}/rest/v1/leads?email=like.*${encodeURIComponent(PROBE_EMAIL_SUFFIX)}`,
      {
        method: 'DELETE',
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          Prefer: 'return=representation',
        },
        cache: 'no-store',
      },
    );
    const deleted: unknown = del.ok ? await del.json().catch(() => null) : null;
    pruned = Array.isArray(deleted) ? deleted.length : null;
    if (!del.ok) {
      findings.push({
        subject: 'prune',
        problem: 'the probe-row prune failed',
        observed: `HTTP ${del.status}`,
      });
    }
  }

  return NextResponse.json(
    { ok: findings.length === 0, checkedAs: 'anon', observations, findings, pruneConfigured, pruned },
    { status: findings.length === 0 ? 200 : 500 },
  );
}
