#!/usr/bin/env node
/**
 * GS-R13-H4B step 3: apply exactly migration 20261004184828_gs_host_h4b_private_intake.sql
 * (sha b807e3ed6d4f) to Production dqiutgmxillhsbzgnlsx, through the authenticated Supabase CLI
 * session (runs as postgres, like the migration runner), with no database password.
 *
 * Refuses unless: the file hash matches; scripts/gs-r13-require-backup.mjs passes; Production
 * holds exactly ledger 0001–0004 and no gridsmith_private schema; and
 * GS_R13_MIGRATE_CONFIRM=apply-b807e3ed6d4f is set. The migration and its ledger row run as ONE
 * transaction (begin … commit), so a failure leaves Production unchanged. Afterwards it verifies:
 * ledger 5, private schema present, the 4 RPCs, no anon/authenticated routine grants, RLS on all
 * tables, and the lead count unchanged.
 *   node scripts/gs-r13-apply-h4b-migration.mjs --plan       read-only checks; nothing written
 *   node scripts/gs-r13-apply-h4b-migration.mjs --emit-sql   print the transaction (local proof)
 *   node scripts/gs-r13-apply-h4b-migration.mjs              apply (owner-approved only)
 */
import { createHash } from 'node:crypto';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { supabase, PRODUCTION_REF } from './reconcile-preview-outbox.mjs';

const NAME = '20261004184828_gs_host_h4b_private_intake.sql', SHA = 'b807e3ed6d4f';
const PRE = ['0001_core.sql:39647b54ac55', '0002_view_security_invoker.sql:97012e3e15c4',
  '0003_press_path_results.sql:375b08ff1cab', '20260911203125_gs_p01_security_hardening.sql:bd761ff9b9e4'];
const fail = (message) => { console.error(`REFUSED: ${message}. Production was not changed.`); process.exit(1); };

const sql = readFileSync(join('supabase/migrations', NAME), 'utf8');
if (createHash('sha256').update(sql).digest('hex').slice(0, 12) !== SHA) fail(`${NAME} does not hash to ${SHA}`);
export const transaction = `begin;\n${sql}\ninsert into public._gridsmith_migrations(name, sha) values ('${NAME}', '${SHA}');\ncommit;\n`;
if (process.argv.includes('--emit-sql')) { process.stdout.write(transaction); process.exit(0); }

const STATE = `begin transaction read only;
select json_build_object(
  'ledger', (select json_agg(name || ':' || sha order by name) from public._gridsmith_migrations),
  'privateSchema', (select count(*) from pg_namespace where nspname = 'gridsmith_private'),
  'routines', (select json_agg(proname order by proname) from pg_proc where pronamespace = 'public'::regnamespace and proname like 'gs\\_%'),
  'anonRoutineGrants', (select count(*) from information_schema.role_routine_grants where grantee in ('anon', 'authenticated', 'PUBLIC') and routine_name like 'gs\\_%'),
  'rlsOff', (select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace where c.relkind = 'r' and n.nspname in ('public', 'gridsmith_private') and not c.relrowsecurity),
  'leads', (select count(*) from public.leads)) as state;
commit;`;
const query = (file) => {
  const out = supabase(['db', 'query', '--linked', '--project-ref', PRODUCTION_REF, '--output', 'json', '--file', file]);
  const rows = JSON.parse(out.slice(out.indexOf('{'))).rows ?? [];
  const value = rows.find((row) => row.state)?.state;
  return typeof value === 'string' ? JSON.parse(value) : value;
};
const withFile = (text, use) => { const file = join(tmpdir(), `gs-r13-${process.pid}-${Date.now()}.sql`); writeFileSync(file, text, { mode: 0o600 }); try { return use(file); } finally { rmSync(file, { force: true }); } };

const gate = spawnSync(process.execPath, ['scripts/gs-r13-require-backup.mjs'], { encoding: 'utf8' });
process.stdout.write(gate.stdout); process.stderr.write(gate.stderr);
if (gate.status !== 0) fail('the backup gate did not pass');
const before = withFile(STATE, query);
if (JSON.stringify(before.ledger) !== JSON.stringify(PRE)) fail('Production ledger is not exactly 0001-0004');
if (before.privateSchema !== 0 || before.routines) fail('H4-B objects already exist on Production');
console.log(`pre-state OK: ledger 0001-0004, no H4-B objects, leads ${before.leads}`);
if (process.argv.includes('--plan')) { console.log(`PLAN: would apply ${NAME} (${SHA}) and its ledger row in one transaction. Nothing written.`); process.exit(0); }
if (process.env.GS_R13_MIGRATE_CONFIRM !== `apply-${SHA}`) fail(`GS_R13_MIGRATE_CONFIRM=apply-${SHA} is not set`);

withFile(transaction, (file) => supabase(['db', 'query', '--linked', '--project-ref', PRODUCTION_REF, '--output', 'json', '--file', file]));
const after = withFile(STATE, query);
const problems = [];
if (JSON.stringify(after.ledger) !== JSON.stringify([...PRE, `${NAME}:${SHA}`].sort())) problems.push('ledger is not 0001-0004 plus H4-B');
if (after.privateSchema !== 1) problems.push('gridsmith_private schema missing');
if (JSON.stringify(after.routines) !== JSON.stringify(['gs_intake_admit', 'gs_notification_claim', 'gs_notification_finish', 'gs_notification_health'])) problems.push('the 4 H4-B routines are not exactly present');
if (after.anonRoutineGrants !== 0) problems.push('anon/authenticated/PUBLIC can execute an H4-B routine');
if (after.rlsOff !== 0) problems.push('a table has RLS off');
if (after.leads !== before.leads) problems.push(`lead count changed ${before.leads} -> ${after.leads}`);
if (problems.length) { console.error(problems.map((p) => `POST-CHECK FAILED: ${p}`).join('\n')); process.exit(2); }
console.log(`APPLIED ${NAME} (${SHA}): ledger 5, private schema, 4 invoker RPCs, no public execute, RLS on, leads ${after.leads} unchanged.`);
