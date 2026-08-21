#!/usr/bin/env node
/**
 * Applies `supabase/migrations/*.sql` in filename order, once each (`A-07`).
 *
 * **Not a gate and never in `verify`.** It writes to a database, and a check that mutates its
 * subject is not a check. `npm run migrate` is run deliberately.
 *
 * Connects with `DIRECT_CONNECTION_STRING` from `.env.local`, by name only — the value is a
 * database password and is never printed, including on failure. `lint:secrets` fails if that
 * variable's name or its value ever reaches a client chunk.
 *
 * Applied migrations are recorded in `_gridsmith_migrations`, so re-running is a no-op rather
 * than an error. The file's SHA is stored too: an already-applied migration that has since
 * been edited is a hard failure, because the database and the repository would otherwise
 * disagree with nothing saying so.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';

const DIR = 'supabase/migrations';
const url = process.env.DIRECT_CONNECTION_STRING;
if (!url) {
  console.error('\nmigrate: DIRECT_CONNECTION_STRING is not set. It lives in .env.local.\n');
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
await client.connect();

await client.query(`
  create table if not exists _gridsmith_migrations (
    name       text primary key,
    sha        text not null,
    applied_at timestamptz not null default now()
  )
`);

const applied = new Map(
  (await client.query('select name, sha from _gridsmith_migrations')).rows.map((r) => [r.name, r.sha]),
);

let ran = 0;
for (const name of readdirSync(DIR).filter((f) => f.endsWith('.sql')).sort()) {
  const sql = readFileSync(join(DIR, name), 'utf8');
  const sha = createHash('sha256').update(sql).digest('hex').slice(0, 12);

  if (applied.has(name)) {
    if (applied.get(name) !== sha) {
      console.error(`\nmigrate: ${name} was applied as ${applied.get(name)} and is now ${sha}.`);
      console.error('An applied migration must not be edited — add a new one.\n');
      await client.end();
      process.exit(1);
    }
    console.log(`  ${name}  already applied`);
    continue;
  }

  await client.query('begin');
  try {
    await client.query(sql);
    await client.query('insert into _gridsmith_migrations (name, sha) values ($1, $2)', [name, sha]);
    await client.query('commit');
    console.log(`  ${name}  applied`);
    ran += 1;
  } catch (error) {
    await client.query('rollback');
    // `error.message` is Postgres's, not the connection string's — but the stack can carry
    // connection details, so only the message is printed.
    console.error(`\nmigrate: ${name} failed and was rolled back.\n  ${error.message}\n`);
    await client.end();
    process.exit(1);
  }
}

await client.end();
console.log(`migrate: ${ran} migration(s) applied`);
