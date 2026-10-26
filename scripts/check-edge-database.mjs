/** Disposable loopback-only SQL proofs. Never points at Supabase or an existing database. */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdirSync, writeFileSync, cpSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import pg from 'pg';

const url='postgresql://postgres:h4b-local-disposable@127.0.0.1:5449/gridsmith_h4b_v3';
const db=new pg.Client({connectionString:url});await db.connect();
const ids=[];
const newRequest=()=>crypto.randomUUID();
const lead={division:'design',lead_type:'enquiry',full_name:'GS-HOST-H4-B Synthetic SQL',
  email:'sql@gridsmith.invalid',payload:{},is_ai_referral:false};
const query=(text,values=[])=>db.query(text,values);
let proofs=0;
try{
  assert.equal((await query('select current_database() name')).rows[0].name,'gridsmith_h4b_v3');
  await query(`do $$begin
    if not exists(select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
    if not exists(select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
    if not exists(select 1 from pg_roles where rolname='service_role') then create role service_role nologin bypassrls; end if;
  end $$;
  create table if not exists public._gridsmith_migrations(name text primary key,sha text not null,applied_at timestamptz default now());`);
  for(const name of readdirSync('supabase/migrations').filter(name=>name.endsWith('.sql')).sort()){
    const sql=readFileSync('supabase/migrations/'+name,'utf8'), sha=createHash('sha256').update(sql).digest('hex').slice(0,12);
    const previous=await query('select sha from public._gridsmith_migrations where name=$1',[name]);
    if(previous.rows.length){assert.equal(previous.rows[0].sha,sha);continue;}
    await query('begin');try{await query(sql);await query('insert into public._gridsmith_migrations(name,sha) values($1,$2)',[name,sha]);await query('commit');}
    catch(error){await query('rollback');throw error;}
  }
  // Model Supabase's existing privileged public-leads capability, only in this new local DB.
  await query('grant usage on schema public to anon,authenticated,service_role; grant select,insert,update on public.leads to service_role');
  assert.equal((await query('select count(*)::int n from public.leads')).rows[0].n,0,'proof starts only with an empty owned disposable DB');
  await query('update gridsmith_private.intake_state set window_started=now(),window_count=0,day_count=0,window_limit=5,day_limit=40,queue_limit=50');
  const roles=['anon','authenticated'];
  for(const role of roles){
    for(const relation of ['public.leads','gridsmith_private.intake_state','gridsmith_private.notification_outbox']){
      assert.equal((await query('select has_table_privilege($1,$2,\'SELECT,INSERT,UPDATE,DELETE\') allowed',[role,relation])).rows[0].allowed,false);proofs++;
    }
    for(const signature of ['public.gs_intake_admit(uuid,text,jsonb)','public.gs_notification_claim(integer)',
      'public.gs_notification_finish(uuid,uuid,text)','public.gs_notification_health()']){
      assert.equal((await query('select has_function_privilege($1,$2,\'EXECUTE\') allowed',[role,signature])).rows[0].allowed,false);proofs++;
    }
    await query(`set role ${role}`);
    try{await assert.rejects(query('select public.gs_intake_admit($1,\'contact\',$2)',[newRequest(),lead]),{code:'42501'});proofs++;}
    finally{await query('reset role');}
  }
  const properties=await query(`select proname,prosecdef,proconfig,pg_get_userbyid(proowner) owner from pg_proc
    where proname in ('gs_intake_admit','gs_notification_claim','gs_notification_finish','gs_notification_health')`);
  assert.equal(properties.rows.length,4);for(const fn of properties.rows){assert.equal(fn.prosecdef,false);
    assert(fn.proconfig.includes('search_path=pg_catalog'));assert.equal(fn.owner,'postgres');}
  const rls=await query(`select relname,relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='gridsmith_private' and c.relkind='r'`);
  assert.equal(rls.rows.length,2);assert(rls.rows.every(row=>row.relrowsecurity));
  const admit=async(requestId,input=lead)=>{
    const result=(await query('select public.gs_intake_admit($1,\'contact\',$2) result',[requestId,input])).rows[0].result;
    if(result.id&&!ids.includes(result.id))ids.push(result.id);return result;
  };
  await query('set role service_role');
  const firstId=newRequest(), first=await admit(firstId);assert.equal(first.outcome,'accepted');
  assert.deepEqual(await admit(firstId),first);
  assert.equal((await admit(firstId,{...lead,company:'changed'})).outcome,'conflict');proofs+=3;
  assert.equal((await query('select count(*)::int n from gridsmith_private.notification_outbox')).rows[0].n,1);
  let claim=(await query('select public.gs_notification_claim(5) result')).rows[0].result;assert.equal(claim.length,1);
  assert(!JSON.stringify(claim).includes('payload'));assert(!JSON.stringify(claim).includes('message'));
  assert.equal((await query('select public.gs_notification_claim(5) result')).rows[0].result.length,0);
  const finish=async(job,outcome,lease=job.lease_token)=>(await query('select public.gs_notification_finish($1,$2,$3) result',[job.id,lease,outcome])).rows[0].result;
  assert.equal(await finish(claim[0],'sent',newRequest()),null);
  assert.equal(await finish(claim[0],'temporary'),'retry');
  assert.equal((await query('select state,attempts,failure_category,next_attempt>now() delayed from gridsmith_private.notification_outbox')).rows[0].state,'retry');
  assert.equal((await query('select public.gs_notification_claim(5) result')).rows[0].result.length,0);proofs+=5;
  await query('reset role');
  await query('update gridsmith_private.notification_outbox set next_attempt=now() where lead_id=$1',[first.id]);
  await query('set role service_role');claim=(await query('select public.gs_notification_claim(5) result')).rows[0].result;
  assert.equal(claim[0].attempts,2);assert.equal(await finish(claim[0],'sent'),'sent');assert.equal(await finish(claim[0],'sent'),null);
  assert((await query('select notified_at from public.leads where id=$1',[first.id])).rows[0].notified_at);proofs+=3;
  await query('reset role');
  await query('update gridsmith_private.intake_state set window_count=0,day_count=0,queue_limit=1');
  await query('set role service_role');const second=await admit(newRequest());assert.equal(second.outcome,'accepted');
  assert.equal((await admit(newRequest())).outcome,'capacity');proofs+=2;
  await query('reset role');
  await query('update gridsmith_private.intake_state set window_count=0,day_count=0,queue_limit=50');
  // A real outbox insert failure after lead insertion must roll the entire function back.
  await query(`create function pg_temp.reject_h4b_outbox() returns trigger language plpgsql as $$begin raise exception 'outbox failure specimen'; end$$;
    create trigger h4b_reject_outbox before insert on gridsmith_private.notification_outbox for each row execute function pg_temp.reject_h4b_outbox();`);
  const before=(await query('select count(*)::int n from public.leads')).rows[0].n;
  try{await query('set role service_role');await assert.rejects(admit(newRequest()),{code:'P0001'});proofs++;}
  finally{await query('reset role');await query('drop trigger h4b_reject_outbox on gridsmith_private.notification_outbox');}
  assert.equal((await query('select count(*)::int n from public.leads')).rows[0].n,before);
  // Expired leases recover; stale owners cannot finish; attempts/time become terminal.
  await query('set role service_role');let job=(await query('select public.gs_notification_claim(5) result')).rows[0].result[0];
  await query('reset role');await query("update gridsmith_private.notification_outbox set lease_until=now()-interval '1 second' where id=$1",[job.id]);
  await query('set role service_role');const reclaimed=(await query('select public.gs_notification_claim(5) result')).rows[0].result[0];
  assert.equal(reclaimed.attempts,2);assert.equal(await finish(job,'sent'),null);
  assert.equal(await finish(reclaimed,'ambiguous'),'retry');proofs+=3;
  await query('reset role');await query('update gridsmith_private.notification_outbox set attempts=5,next_attempt=now() where id=$1',[job.id]);
  await query('set role service_role');assert.equal((await query('select public.gs_notification_claim(5) result')).rows[0].result.length,0);
  assert.equal((await query('select state from gridsmith_private.notification_outbox where id=$1',[job.id])).rows[0].state,'dead');proofs++;
  await query('reset role');await query('update gridsmith_private.intake_state set window_count=0,day_count=0,window_limit=2,queue_limit=50');
  const racers=await Promise.all(Array.from({length:10},async()=>{
    const connection=new pg.Client({connectionString:url});await connection.connect();
    try{await connection.query('set role service_role');return(await connection.query('select public.gs_intake_admit($1,\'contact\',$2) result',[newRequest(),lead])).rows[0].result;}
    finally{await connection.end();}
  }));
  assert.equal(racers.filter(result=>result.outcome==='accepted').length,2);assert.equal(racers.filter(result=>result.outcome==='capacity').length,8);
  for(const result of racers)if(result.id)ids.push(result.id);proofs++;
  await query('set role service_role');const health=(await query('select public.gs_notification_health() result')).rows[0].result;
  assert.equal(health.pending,2);assert.equal(health.dead,1);assert.equal(health.sent,1);await query('reset role');
  await query('update gridsmith_private.intake_state set window_count=0,day_count=0');
  const escapedLead = { ...lead, full_name: 'GS-HOST-H4-B ' + 'x'.repeat(180), company: 'x'.repeat(200),
    phone: 'x'.repeat(40), budget_band: 'x'.repeat(80), message: '\u0001'.repeat(5000),
    payload: { triedElsewhere: 'x'.repeat(2000), genre: 'x'.repeat(120) } };
  assert(Buffer.byteLength(JSON.stringify(escapedLead)) > 32_768, 'SQL escaped specimen must reach old cap');
  await query('set role service_role');
  assert.equal((await admit(newRequest(), escapedLead)).outcome, 'accepted'); proofs++;
  await query('reset role');
  // Qualified/unqualified source-gate branches are permanent specimens in disposable copies.
  const fixture='build/h4b-rls-specimens';mkdirSync(fixture+'/supabase/migrations',{recursive:true});
  for(const name of readdirSync('supabase/migrations').filter(name=>name.endsWith('.sql')))cpSync('supabase/migrations/'+name,fixture+'/supabase/migrations/'+name);
  const command=()=>spawnSync(process.execPath,[process.cwd()+'/scripts/check-rls.mjs'],{cwd:fixture,encoding:'utf8',windowsHide:true});
  assert.equal(command().status,0);
  const latest=readdirSync('supabase/migrations').find(name=>name.includes('gs_host_h4b'));
  const original=readFileSync('supabase/migrations/'+latest,'utf8');
  for(const name of ['gridsmith_private.intake_state','gridsmith_private.notification_outbox']){
    writeFileSync(fixture+'/supabase/migrations/'+latest,original.replace(`alter table ${name} enable row level security;`,''));
    const red=command();assert.notEqual(red.status,0);assert(red.stderr.includes(`table "${name}"`));proofs++;
  }
  writeFileSync(fixture+'/supabase/migrations/'+latest,original);
  const core=readFileSync('supabase/migrations/0001_core.sql','utf8');
  for(const spelling of ['leads','public.leads']){
    writeFileSync(fixture+'/supabase/migrations/0001_core.sql',core.replace('create table leads (',`create table ${spelling} (`).replace('alter table leads         enable row level security;',''));
    const hardening=readFileSync('supabase/migrations/20260911203125_gs_p01_security_hardening.sql','utf8');
    writeFileSync(fixture+'/supabase/migrations/20260911203125_gs_p01_security_hardening.sql',hardening);
    const red=command();assert.notEqual(red.status,0);assert(red.stderr.includes('table "leads"'));proofs++;
  }
  console.log(`H4-B disposable PostgreSQL proof PASS: ${proofs} privilege/admission/lease/retry/atomic-failure/race/RLS adverse assertions; 10 concurrent admissions -> 2 accepted/8 capacity; no production access.`);
}finally{
  await query('reset role');
  if(ids.length)await query('delete from public.leads where id=any($1::uuid[]) and email=$2',[ids,lead.email]);
  assert.equal((await query('select count(*)::int n from public.leads')).rows[0].n,0);
  assert.equal((await query('select count(*)::int n from gridsmith_private.notification_outbox')).rows[0].n,0);
  await db.end();
}
