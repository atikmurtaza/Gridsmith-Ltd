#!/usr/bin/env node
/**
 * **The deliberate-failure procedure for `M-P1-3`, kept because the proof is the evidence.**
 *
 * `app/api/rls-drift/route.ts` asks the live database, as `anon`, whether `A-07`'s leak has
 * come back. A gate nobody has watched fail is not known to work, and this is what makes it
 * fail — it recreates `v_lead_funnel` exactly as `0001` did, without `security_invoker` and
 * with the default grants restored.
 *
 * **It mutates the live database.** `--confirm` is required for anything but `status`, because
 * a script at a guessable path that can disable RLS on one word is a worse defect than the one
 * it proves. `restore` puts `0002` back and is safe to run at any time.
 *
 *   node --env-file=.env.local scripts/rls-drift-proof.mjs status
 *   node --env-file=.env.local scripts/rls-drift-proof.mjs break   --confirm
 *   node --env-file=.env.local scripts/rls-drift-proof.mjs half    --confirm
 *   node --env-file=.env.local scripts/rls-drift-proof.mjs restore --confirm
 *   node --env-file=.env.local scripts/rls-drift-proof.mjs cleanup --confirm
 *
 * `break` reproduces the original leak; `half` restores the grant while leaving
 * `security_invoker` set, which is the other branch of the same assertion and produces a
 * different message. `cleanup` deletes probe rows by their `@gridsmith.invalid` marker — the
 * same prune the cron route does, for use when no service-role key is available.
 */
import pg from 'pg';
const url = process.env.DIRECT_CONNECTION_STRING;
const client = new pg.Client({ connectionString: url });
await client.connect();
const mode = process.argv[2];
if (mode !== 'status' && !process.argv.includes('--confirm')) {
  console.error(`
rls-drift-proof: "${mode}" mutates the LIVE database. Re-run with --confirm.
`);
  process.exit(1);
}
const state = async () => {
  const r = await client.query(`select c.reloptions, has_table_privilege('anon', c.oid, 'SELECT') as anon_select
    from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname='v_lead_funnel'`);
  return JSON.stringify(r.rows[0]);
};
console.log('before:', await state());
if (mode === 'break') {
  // Recreate exactly as 0001 did: no security_invoker, default grants restored.
  await client.query(`create or replace view v_lead_funnel as
    select division, date_trunc('week', created_at) as week, count(*) as leads,
      count(*) filter (where status in ('qualified','proposal','won')) as qualified,
      count(*) filter (where status = 'won') as won,
      count(*) filter (where is_ai_referral) as ai_referral_leads,
      avg(extract(epoch from (notified_at - created_at))) as avg_notify_seconds
    from leads where status <> 'spam' group by 1,2`);
  await client.query(`alter view v_lead_funnel reset (security_invoker)`);
  await client.query(`grant select on v_lead_funnel to anon, authenticated`);
} else if (mode === 'half') {
  await client.query('alter view v_lead_funnel set (security_invoker = true)');
  await client.query('grant select on v_lead_funnel to anon, authenticated');
} else if (mode === 'restore') {
  await client.query(`alter view v_lead_funnel set (security_invoker = true)`);
  await client.query(`revoke all on v_lead_funnel from anon, authenticated`);
} else if (mode === 'cleanup') {
  const r = await client.query(`delete from leads where email like '%@gridsmith.invalid' returning id`);
  console.log('probe rows deleted:', r.rowCount);
}
console.log('after: ', await state());
await client.end();
