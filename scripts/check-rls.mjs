#!/usr/bin/env node
/**
 * check-rls
 *
 * **Row-level security is the only thing standing between a publishable key and every lead in
 * the database.** The key is designed to be public; RLS is what makes that safe. Nothing
 * checked it.
 *
 * This reads the committed migrations, which is a deliberate limitation stated up front:
 * **it asserts what the repository declares, not what the database currently is.** A live
 * check would need the connection string, which is a secret that must not be in CI. The two
 * are complementary and neither substitutes for the other — `M-P2-12` is the live-drift
 * check, which belongs where the credential already exists.
 *
 * ## The view rule is here because a spec-perfect view leaked
 *
 * `0001` created `v_lead_funnel` exactly as `SCHEMA-CORE.md` §4 specifies. A Postgres view
 * runs with its **owner's** privileges unless `security_invoker` is set, the owner is
 * `postgres`, and Supabase grants `anon` SELECT on `public` by default — so the view read
 * `leads` as a superuser and handed the result to anyone with the publishable key. Measured:
 * `GET /leads` returned `[]` while `GET /v_lead_funnel` returned the aggregate of the same
 * rows.
 *
 * That is why the rule is about **every** view rather than that one: the mechanism is a
 * Postgres default, so the next view inherits it, and the next author will be reading the same
 * spec that produced the first one.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'supabase/migrations';

if (!existsSync(DIR)) {
  console.error(`\ncheck-rls: ${DIR} does not exist — nothing was checked.\n`);
  process.exit(1);
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.sql')).sort();
if (files.length === 0) {
  console.error(`\ncheck-rls: no .sql migrations in ${DIR} — nothing was checked.\n`);
  process.exit(1);
}

/** Comments are stripped first: a rule written in prose is not a rule the database enforces. */
const sql = files
  .map((f) => readFileSync(join(DIR, f), 'utf8'))
  .join('\n')
  .replace(/--[^\n]*/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');

const problems = [];
const lower = sql.toLowerCase();

/**
 * **Counted inside each loop, not taken from the parse.** `tables.length` and `views.length`
 * describe the SQL; they say nothing about whether the loop that checks them ran. The audit
 * disabled all three loops here and the summary line did not change by one character —
 * "RLS on all 3 table(s) … security_invoker on all 1 view(s)" with nothing checked. `M-P1-4`.
 */
const counted = { tables: 0, policies: 0, views: 0 };

const tables = [...lower.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?([a-z0-9_]+)/g)].map((m) => m[1]);
const views = [...lower.matchAll(/create\s+(?:or\s+replace\s+)?view\s+([a-z0-9_]+)/g)].map((m) => m[1]);
const rlsEnabled = new Set(
  [...lower.matchAll(/alter\s+table\s+([a-z0-9_]+)\s+enable\s+row\s+level\s+security/g)].map((m) => m[1]),
);

// 1. Every table has RLS. Without it PostgREST serves the table to anon by default, so a
//    table nobody remembered to guard is a table anybody can read.
for (const table of tables) {
  if (table.startsWith('_')) continue;
  counted.tables += 1; // migration bookkeeping, created by scripts/migrate.mjs
  if (!rlsEnabled.has(table)) {
    problems.push(`table "${table}" never gets "enable row level security" — PostgREST serves it to anon by default`);
  }
}

// 2. No read or write policy for anon or public. Absence is denial under RLS, and the only
//    anon capability the schema is meant to have is inserting a lead.
for (const m of sql.matchAll(
  // The role list stops at `using` / `with check` / `;`. Two bugs lived in this one line and
  // **both were found by the deliberate-failure proof, neither by reading it**:
  //
  //   1. Without the boundary the greedy class swallowed the next keyword — `to anon using
  //      (true)` captured the role as "anon using", which matched no role name, so a
  //      deliberate anon SELECT policy went green.
  //   2. The fix for (1) was written with a literal backspace (U+0008) where a word boundary
  //      was intended, so the lookahead could never match and the SELECT case
  //      STILL went green while the DELETE case — which ends in `;` and takes the other
  //      branch — fired correctly. A half-working alternation looks exactly like a working
  //      one from the one case you happen to test.
  /create\s+policy\s+("[^"]+"|[a-z0-9_]+)\s+on\s+([a-z0-9_]+)\s+for\s+([a-z]+)\s+to\s+([a-z0-9_,\s]+?)(?=\s+(?:using|with)|\s*;)/gi,
)) {
  counted.policies += 1;
  const [, name, table, cmd, roles] = m;
  const to = roles.toLowerCase().split(',').map((r) => r.trim());
  if (!to.some((r) => r === 'anon' || r === 'public')) continue;
  if (cmd.toLowerCase() !== 'insert') {
    problems.push(
      `policy ${name} on "${table}" grants ${cmd.toUpperCase()} to ${to.join(', ')} — ` +
        'anon may insert a lead and nothing else. Reads are service-role only',
    );
  }
}

// 3. Every view sets security_invoker. See the docstring: this is the defect that shipped.
for (const view of views) {
  counted.views += 1;
  const declared = new RegExp(
    `(?:create\\s+(?:or\\s+replace\\s+)?view\\s+${view}\\s+with\\s*\\([^)]*security_invoker` +
      `|alter\\s+view\\s+${view}\\s+set\\s*\\([^)]*security_invoker\\s*=\\s*true)`,
    's',
  ).test(lower);
  if (!declared) {
    problems.push(
      `view "${view}" never sets security_invoker — it would run as its owner, which is not ` +
        'subject to RLS, and Supabase grants anon SELECT on public by default',
    );
  }
}

for (const [what, n] of Object.entries(counted)) {
  // Policies legitimately can be zero only if there are no policies at all, which for this
  // schema would itself be the finding: `anon insert only` is the one policy that must exist.
  if (n === 0) problems.push(`the ${what} check iterated zero times — it did not run`);
}

if (problems.length > 0) {
  console.error(`\ncheck-rls: ${problems.length} problem(s) across ${files.length} migration(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('\nThis reads the migrations, not the live database. A green result means the');
  console.error('repository declares the right thing — M-P2-12 is the drift check.\n');
  process.exit(1);
}

console.log(
  `check-rls: ${files.length} migration(s) — RLS checked on ${counted.tables} table(s), ` +
    `${counted.policies} policy(ies) checked for anon read/write, security_invoker checked on ` +
    `${counted.views} view(s). ` +
    'Declared, not live — see M-P2-12',
);
