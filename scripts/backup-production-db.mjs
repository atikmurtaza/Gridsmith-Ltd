#!/usr/bin/env node
/**
 * GS-R13-H4B: restore-proven backup of the Production Supabase database. Operator-run, never CI.
 *
 * Reads only. `pg_dump --format=custom` of the `public` and `gridsmith_private` schemas through the
 * IPv4 session pooler (the direct host is IPv6-only), written outside the repository with an
 * owner-only ACL, then restored into a disposable local Supabase Postgres and compared with the
 * source: per-table row counts, the migration ledger, and an md5 fingerprint of every lead row.
 * Nothing about the data is printed; the receipt holds counts, hashes and the file path.
 *
 * Required: GS_PRODUCTION_DB_URL (session pooler URL, owner-supplied, never argv) and
 * GS_PRODUCTION_BACKUP_CONFIRM=read-production. Docker with postgres:17-alpine and the local
 * Supabase Postgres image; `--pull never`, so nothing is downloaded.
 * `--selftest` accepts only a loopback URL, for proving this script against a disposable database.
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const REF = 'dqiutgmxillhsbzgnlsx';
const CLIENT = 'postgres:17-alpine', RESTORE = 'public.ecr.aws/supabase/postgres:17.6.1.167';
const selftest = process.argv.includes('--selftest');

/** Every reason the URL is not the Production session pooler (or, in selftest, loopback). */
export function urlProblems(value, allowLoopback = false) {
  let url; try { url = new URL(value); } catch { return ['GS_PRODUCTION_DB_URL is not a URL']; }
  const problems = [];
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) problems.push('not a postgres URL');
  if (allowLoopback ? !['127.0.0.1', 'localhost'].includes(url.hostname) : !/^aws-\d+-eu-west-1\.pooler\.supabase\.com$/.test(url.hostname)) {
    problems.push(allowLoopback ? 'selftest requires a loopback database' : 'host is not the eu-west-1 session pooler');
  }
  if (!allowLoopback && (url.port || '5432') !== '5432') problems.push('port is not the session pooler (5432); the transaction pooler cannot run pg_dump');
  if (!allowLoopback && decodeURIComponent(url.username) !== `postgres.${REF}`) problems.push(`user is not postgres.${REF}`);
  if (!url.password) problems.push('no password');
  return problems;
}

const run = (args, env = {}) => {
  const result = spawnSync('docker', args, { encoding: 'buffer', windowsHide: true, maxBuffer: 1 << 30, env: { ...process.env, ...env } });
  if (result.status !== 0) throw new Error(`docker ${args[0]} failed (${result.status}); output suppressed`);
  return result.stdout;
};
// libpq reads these from the container environment; values never appear in a command line.
const libpq = (value) => { const url = new URL(value); return { PGHOST: selftest ? 'host.docker.internal' : url.hostname,
  PGPORT: url.port || '5432', PGUSER: decodeURIComponent(url.username), PGPASSWORD: decodeURIComponent(url.password),
  PGDATABASE: url.pathname.slice(1) || 'postgres', PGSSLMODE: selftest ? 'disable' : 'require' }; };
const ENV = ['PGHOST', 'PGPORT', 'PGUSER', 'PGPASSWORD', 'PGDATABASE', 'PGSSLMODE'].flatMap((name) => ['-e', name]);
const SUMMARY = `begin transaction read only;
select json_build_object(
  'tables', (select json_object_agg(n.nspname || '.' || c.relname, (xpath('/row/n/text()', query_to_xml(format('select count(*) n from %I.%I', n.nspname, c.relname), false, true, '')))[1]::text::bigint order by n.nspname, c.relname)
    from pg_class c join pg_namespace n on n.oid = c.relnamespace where c.relkind = 'r' and n.nspname in ('public', 'gridsmith_private')),
  'ledger', (select json_agg(name || ':' || sha order by name) from public._gridsmith_migrations),
  'leadFingerprint', (select md5(coalesce(string_agg(md5(l::text), '' order by l.id), '')) from public.leads l));
commit;`;
const summarise = (env, container) => JSON.parse(run(container
  ? ['exec', container, 'psql', '-U', 'postgres', '-d', 'postgres', '-Atqc', SUMMARY]
  : ['run', '--rm', '--pull', 'never', ...ENV, CLIENT, 'psql', '-Atqc', SUMMARY], env).toString().trim().split('\n').find((line) => line.startsWith('{')));

if (process.argv[1]?.endsWith('backup-production-db.mjs')) {
  const value = process.env.GS_PRODUCTION_DB_URL ?? '';
  const problems = [...urlProblems(value, selftest), ...(process.env.GS_PRODUCTION_BACKUP_CONFIRM === 'read-production' ? [] : ['GS_PRODUCTION_BACKUP_CONFIRM=read-production is not set'])];
  if (problems.length) { console.error(problems.map((p) => `REFUSED: ${p}. Nothing was read.`).join('\n')); process.exit(1); }
  const env = libpq(value), stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  // Selftest output never lands beside real backups.
  const folder = selftest ? process.env.GS_BACKUP_SELFTEST_DIR : join(homedir(), 'gridsmith-backups');
  if (!folder) { console.error('REFUSED: --selftest requires GS_BACKUP_SELFTEST_DIR. Nothing was read.'); process.exit(1); }
  mkdirSync(folder, { recursive: true });
  const file = join(folder, `supabase-production-${selftest ? 'SELFTEST-' : ''}${stamp}.dump`);
  const source = summarise(env);
  const dump = run(['run', '--rm', '--pull', 'never', ...ENV, CLIENT, 'pg_dump', '--format=custom', '--schema=public', '--schema=gridsmith_private'], env);
  writeFileSync(file, dump, { mode: 0o600 });
  if (process.platform === 'win32') spawnSync('icacls', [file, '/inheritance:r', '/grant:r', `${process.env.USERNAME}:F`], { windowsHide: true });
  const sha256 = createHash('sha256').update(readFileSync(file)).digest('hex');
  const name = `gs-backup-restore-${stamp.toLowerCase()}`;
  let restored;
  try {
    run(['run', '-d', '--rm', '--pull', 'never', '--name', name, '-e', 'POSTGRES_PASSWORD=restore-disposable', RESTORE]);
    for (let i = 0; i < 60 && spawnSync('docker', ['exec', name, 'pg_isready', '-h', '127.0.0.1', '-U', 'postgres', '-q']).status !== 0; i++) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2000);
    spawnSync('docker', ['exec', '-i', name, 'pg_restore', '-h', '127.0.0.1', '-U', 'postgres', '-d', 'postgres', '--no-owner'], { input: readFileSync(file), windowsHide: true });
    // An unreadable restore is a failed proof, reported as a mismatch rather than a crash.
    try { restored = summarise({}, name); } catch { restored = { unreadable: true }; }
  } finally { spawnSync('docker', ['stop', name], { windowsHide: true }); }
  const equal = JSON.stringify(restored) === JSON.stringify(source);
  const receipt = { phase: 'GS-R13-H4B', selftest, project: selftest ? 'loopback' : REF, file, bytes: dump.length, sha256,
    source, restoredEqual: equal, restoredTables: Object.keys(restored.tables ?? {}).length, createdAt: new Date().toISOString() };
  writeFileSync(`${file}.receipt.json`, JSON.stringify(receipt, null, 2) + '\n', { mode: 0o600 });
  console.log(JSON.stringify({ ...receipt, source: { tables: source.tables, ledger: source.ledger, leadFingerprint: source.leadFingerprint.slice(0, 12) } }));
  if (!equal) { console.error('RESTORE MISMATCH: the backup is not proven. Do not proceed.'); process.exit(1); }
}
