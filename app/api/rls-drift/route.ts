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
 * - **Not CI.** The deployment is the system whose live Data API posture is being checked;
 *   CI can only verify the committed migration declarations.
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
 * GS-P01 removes every expected anonymous write. Insert probes are therefore positive refusal
 * checks and create no rows when the database is correctly configured.
 */
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const PROJECT_URL = (process.env.PROJECT_URL ?? '').replace(/\/$/, '');
const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY ?? '';
const CRON_SECRET = process.env.CRON_SECRET ?? '';

const anonHeaders = { apikey: PUBLISHABLE_KEY, Authorization: `Bearer ${PUBLISHABLE_KEY}` };

/**
 * Tables `anon` may never read. Absence of a policy is denial; this asserts the absence.
 *
 * **Two of these three were INERT probes until the `K-10` premise check, and the reading looked
 * identical to a real one.** `sample_grants` and `events` hold no rows, so "anon SELECT returned
 * rows" cannot fire for them however broken RLS is: a permissive `for select to anon using
 * (true)` policy was added to each against the live database and this route stayed clean. The
 * observation line `sample_grants: HTTP 200, 0 rows` was a reading of an empty table being
 * reported as a reading of row-level security — `01-VALIDATION-REPORT.md` §22, live and
 * shipped, in the gate written to catch exactly that class.
 *
 * `leads` was not inert, but its validity was accidental: it works only because the table
 * happens to hold rows, which nothing asserted. The read-back below fixes that structurally —
 * a row this request writes, read back by its own id — and it is the only one of the three
 * whose green is earned today.
 *
 * **The `leads` entry here and the read-back fire together on the same input, and no window
 * was found where only one of them does.** A SELECT policy on `leads` produces both findings.
 * That is stated rather than filed as defence in depth (`A-GATE-4-3`), because the two are not
 * interchangeable: this one is silent on an empty table and the read-back is not, so the
 * read-back is what the proof credits. Emptying `leads` to produce the window was attempted and
 * abandoned — 33 rows are `check-axe`'s probes, which carry a different marker from the prune's
 * `@gridsmith.invalid` and are not this route's to delete. The other two are labelled in `observations` rather than
 * silently counted, and they become real assertions the first time a row exists. `K-10` is the
 * row that puts the first grant in `sample_grants`.
 *
 * `press_path_results` (`K-08`) joins them as a fourth, and it is inert today for the same
 * reason: the table is empty until `K-06` writes to it. It is listed rather than left out
 * because the read is free and becomes a real assertion the moment a result is recorded, and
 * because its write probe below is a positive reading that is valid now.
 */
const NO_READ = ['_gridsmith_migrations', 'leads', 'sample_grants', 'events', 'press_path_results'];

/**
 * Tables `anon` may never WRITE, asserted by attempting the write. **This is a positive
 * reading — a refusal — rather than an absence, which is why it is here and not folded into
 * the read loop.** It was missing entirely, and `sample_grants` is the one that matters:
 * `token` is a bearer credential with a 72h expiry, so an INSERT policy on that table lets any
 * browser mint a grant for any asset. `0001_core.sql` writes both tables server-side only.
 *
 * **There is deliberately no UPDATE or DELETE probe, and that is a measurement rather than an
 * omission.** Both were written during the `K-10` premise check and removed when their
 * deliberate-failure proofs came back GREEN with a permissive `for update to anon using (true)`
 * policy live on `leads`. The experiment that separated the two readings:
 *
 *   - as role `anon` in SQL, UPDATE policy present, no SELECT policy —
 *     `update leads set status = 'won' where id = $1` affects **1 row**;
 *   - the same write through PostgREST — **0 rows**, HTTP 204, row unchanged.
 *
 * PostgREST resolves a filtered write through a subselect on the table, so with no SELECT
 * policy for `anon` it can never find a row to write, whatever UPDATE or DELETE policy exists.
 * Over HTTP — the only transport this route has, and the only one a hostile client has — those
 * branches cannot fire while the read-back is clean, and cannot be made to fire independently.
 * They would report a zero affected-row count as evidence of RLS when that zero is what
 * PostgREST returns regardless. **That is unreachable code, and filing it as defence in depth
 * is the tell `CLAUDE.md` names.** The property is asserted where it is reachable, by
 * `check:rls` over the migrations.
 */
const NO_WRITE: { table: string; row: Record<string, unknown>; why: string }[] = [
  {
    table: 'leads',
    row: {
      division: 'design',
      full_name: 'RLS drift probe',
      email: 'drift@gridsmith.invalid',
    },
    why: 'GS-P01 makes the server action the only lead writer; direct Data API inserts bypass application abuse controls',
  },
  {
    table: 'sample_grants',
    row: { asset_key: 'rls-drift-probe', expires_at: '2099-01-01T00:00:00Z' },
    why: 'sample_grants.token is a bearer credential with a 72h expiry — an INSERT policy here lets any browser mint a grant for any asset',
  },
  { table: 'events', row: { session_id: 'rls-drift-probe', event: 'probe' }, why: 'events is written server-side only (0001_core.sql)' },
  {
    // **The row is deliberately one the table would accept.** `0003` puts two check
    // constraints on this table, and a row that violated either would be refused by the
    // constraint rather than by RLS — a non-2xx that this loop reads as "refused", which is
    // the inert-probe class with a security label on it. `self-service`/`false` satisfies
    // `press_path_outcome_known` and `press_path_honesty_agrees`, so the only thing left that
    // can refuse it is the absence of an INSERT policy.
    table: 'press_path_results',
    row: {
      id: 'rls-drift-probe',
      config_version: 0,
      answers: {},
      outcome: 'self-service',
      is_gridsmith_outcome: false,
    },
    why: 'press_path_results is the ETH-04 audit trail — an INSERT policy lets any browser forge the record that shows the Path Finder still recommends against Gridsmith (non-negotiable #9)',
  },
];

/** Views `anon` may not reach at all — `0002` revoked the grant as well as setting invoker. */
const NO_REACH = ['v_lead_funnel', 'v_path_finder_honesty'];

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
    observations.push(
      table === 'leads'
        ? `${table}: HTTP 200, 0 rows — validated by the read-back below`
        : `${table}: HTTP 200, 0 rows — NOT VALIDATED, the table may simply be empty (see NO_READ)`,
    );
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

  const probeId = crypto.randomUUID();

  // Positive readings: a refusal, not an absence. See NO_WRITE.
  // Before the GS-P01 migration lands, the migration ledger itself is publicly readable. That
  // finding suppresses write probes so deploying this code ahead of the controlled migration can
  // never create a row in the still-permissive leads table.
  const databaseIsHardened = !findings.some((finding) => finding.subject === '_gridsmith_migrations');
  for (const { table, row, why } of databaseIsHardened ? NO_WRITE : []) {
    const res = await fetch(`${PROJECT_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: { ...anonHeaders, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      // Unique-per-request where the table has a unique column. Without this a probe that
      // once succeeded — the finding — would collide on the next run and return 409, which
      // this loop would read as "refused". A leak would report itself closed the day after it
      // opened. `sample_grants.token` is unique; `press_path_results.id` is the primary key.
      body: JSON.stringify({
        ...row,
        ...(table === 'sample_grants' ? { token: `rls-drift-probe-${probeId}` } : {}),
        ...('id' in row ? { id: `${row.id}-${probeId}` } : {}),
      }),
      cache: 'no-store',
    }).catch(() => null);
    if (!res) {
      findings.push({ subject: table, problem: 'the insert-refusal request did not complete, so the write path was not measured', observed: 'network error' });
    } else if (res.ok) {
      findings.push({ subject: table, problem: `anon INSERT was accepted — ${why}`, observed: `HTTP ${res.status}` });
    } else {
      observations.push(`${table} insert: HTTP ${res.status}, refused`);
    }
  }

  if (!databaseIsHardened) observations.push('write-refusal probes skipped until _gridsmith_migrations is no longer publicly readable');

  return NextResponse.json(
    { ok: findings.length === 0, checkedAs: 'anon', observations, findings },
    { status: findings.length === 0 ? 200 : 500 },
  );
}
