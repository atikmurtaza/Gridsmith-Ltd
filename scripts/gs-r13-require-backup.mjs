#!/usr/bin/env node
/**
 * GS-R13-H4B gate: the H4-B migration may run only after a restore-proven, pre-migration
 * Production backup. Exits 0 only when the newest real receipt (written by
 * scripts/backup-production-db.mjs, never a selftest) is for Production dqiutgmxillhsbzgnlsx, is
 * younger than --max-age-hours (default 6), matches its dump file's sha256, reports
 * restoredEqual true, and shows the pre-migration ledger: exactly 0001–0004, without H4-B.
 * Reads only local files; prints only names, counts and hashes.
 *   node scripts/gs-r13-require-backup.mjs [--dir <folder>] [--max-age-hours 6]
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const PRODUCTION = 'dqiutgmxillhsbzgnlsx';
const PRE_MIGRATION = ['0001_core.sql:39647b54ac55', '0002_view_security_invoker.sql:97012e3e15c4',
  '0003_press_path_results.sql:375b08ff1cab', '20260911203125_gs_p01_security_hardening.sql:bd761ff9b9e4'];

/** Every reason this receipt does not permit the migration. An empty list is the only pass. */
export function backupProblems(receipt, fileBytes, now = Date.now(), maxAgeHours = 6) {
  const problems = [];
  if (receipt.phase !== 'GS-R13-H4B') problems.push('not a GS-R13-H4B backup receipt');
  if (receipt.selftest !== false) problems.push('selftest receipt, not a real Production backup');
  if (receipt.project !== PRODUCTION) problems.push(`project is ${receipt.project}, not Production ${PRODUCTION}`);
  if (receipt.restoredEqual !== true) problems.push('restore was not proven equal to the source');
  const age = (now - Date.parse(receipt.createdAt)) / 3_600_000;
  if (!(age >= 0 && age <= maxAgeHours)) problems.push(`backup is ${Number.isFinite(age) ? age.toFixed(1) : 'of unknown age'} h old (limit ${maxAgeHours} h)`);
  if (!fileBytes) problems.push('dump file is missing');
  else if (createHash('sha256').update(fileBytes).digest('hex') !== receipt.sha256) problems.push('dump file does not match the receipt sha256');
  if (JSON.stringify(receipt.source?.ledger) !== JSON.stringify(PRE_MIGRATION)) problems.push('ledger is not the pre-migration 0001-0004 state');
  if (!(receipt.source?.tables?.['public.leads'] >= 0)) problems.push('lead count missing from the receipt');
  return problems;
}

if (process.argv[1]?.endsWith('gs-r13-require-backup.mjs')) {
  const arg = (name, fallback) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : fallback; };
  const dir = arg('--dir', join(homedir(), 'gridsmith-backups')), maxAge = Number(arg('--max-age-hours', '6'));
  const receipts = existsSync(dir) ? readdirSync(dir).filter((n) => /^supabase-production-\d{8}T\d{6}Z\.dump\.receipt\.json$/.test(n)).sort() : [];
  if (!receipts.length) { console.error('REFUSED: no real Production backup receipt found; take the backup first. Do not migrate.'); process.exit(1); }
  const name = receipts.at(-1), receipt = JSON.parse(readFileSync(join(dir, name), 'utf8'));
  const dump = join(dir, name.replace(/\.receipt\.json$/, ''));
  const problems = backupProblems(receipt, existsSync(dump) ? readFileSync(dump) : null, Date.now(), maxAge);
  if (problems.length) { console.error(problems.map((p) => `REFUSED: ${p}. Do not migrate.`).join('\n')); process.exit(1); }
  console.log(`BACKUP GATE PASS: ${name}; leads ${receipt.source.tables['public.leads']}; ledger 0001-0004; restore equal; sha256 ${receipt.sha256.slice(0, 12)}`);
}
