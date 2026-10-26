/** Deployed Preview negative probes. Honeypot/invalid requests must write/send nothing. */
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { PREVIEW_REF, supabase, previewServiceKey, reconcile } from './reconcile-preview-outbox.mjs';
import { REVIEW_STAGING_ORIGIN } from '../lib/reviews/public-model.ts';
const project = `https://${PREVIEW_REF}.supabase.co`, endpoint = project+'/functions/v1/gs-lead-intake';
const hosted = process.argv.includes('--hosted');
const origin=hosted ? REVIEW_STAGING_ORIGIN : 'http://localhost:3236';
const receiptFile=`build/${hosted ? 'h4d' : 'h4b'}-preview-negative-receipt.json`;
const fields={full_name:'GS-HOST-H4-B Negative Probe',email:'negative@gridsmith.invalid'};
const envelope=(changes={})=>JSON.stringify({formType:'contact',requestId:crypto.randomUUID(),fields,...changes});
const request=(body=envelope(),extra={})=>new Request(endpoint,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body,...extra});
const receipt={phase:hosted?'GS-HOST-H4-D-R1':'GS-HOST-H4-B',project:PREVIEW_REF,negative:[],health:null};
const insertProbeId=crypto.randomUUID();
receipt.insertProbeId=insertProbeId;
writeFileSync(receiptFile,JSON.stringify(receipt,null,2)+'\n');
const before=JSON.parse(supabase(['db','query','--linked','--project-ref',PREVIEW_REF,'--output','json',
  "select (select count(*) from public.leads) as leads,(select count(*) from gridsmith_private.notification_outbox) as outbox;"])).rows[0];
for (const [name,input,status] of [
  ['GET',new Request(endpoint,{headers:{Origin:origin}}),405],
  ['missing origin',request(envelope(),{headers:{'Content-Type':'application/json'}}),403],
  ['wrong origin',request(envelope(),{headers:{Origin:'https://attacker.invalid','Content-Type':'application/json'}}),403],
  ['wrong content type',request(envelope(),{headers:{Origin:origin,'Content-Type':'text/plain'}}),415],
  ['malformed JSON',request('{'),400],
  ['oversized',request('x'.repeat(65_537)),413],
  ['form type array',request(envelope({formType:['press']})),400],
  ['invalid email',request(envelope({fields:{...fields,email:'invalid',unexpected:'discard'}})),422],
  ['URL name',request(envelope({fields:{...fields,full_name:'www.spam.invalid'}})),422],
  ['honeypot',request(envelope({fields:{...fields,website:'bot'}})),202],
  ['Press invalid branch',request(envelope({formType:'press',fields:{...fields,segment:'unknown'}})),422],
]) {
  const started=performance.now();const response=await fetch(input);assert.equal(response.status,status,name);
  const text=await response.text();assert(!/gridsmith_private|SQL|stack|RESEND|SUPABASE_SERVICE_ROLE/i.test(text),name+' leakage');
  receipt.negative.push({name,status,responseMs:Math.round(performance.now()-started)});
}
const keys=JSON.parse(supabase(['projects','api-keys','--project-ref',PREVIEW_REF,'--output','json']));
const anon=keys.find(key=>key.name==='anon')?.api_key;assert(anon);
const worker=project+'/functions/v1/gs-notification-worker';
for(const [name,key] of [['anonymous JWT',anon],['missing credential',''],['forged service JWT',
  anon.split('.')[0]+'.'+Buffer.from(JSON.stringify({role:'service_role',ref:PREVIEW_REF})).toString('base64url')+'.'+anon.split('.')[2]]]) {
  const response=await fetch(worker,{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:'{"operation":"drain"}'});
  assert.equal(response.status,401,name);receipt.negative.push({name,status:401});await response.body?.cancel();
}
for(const [name,path,method,body] of [['anonymous SELECT','/rest/v1/leads?select=id','GET',undefined],
  ['anonymous INSERT','/rest/v1/leads','POST',JSON.stringify({id:insertProbeId,division:'design',lead_type:'enquiry',...fields})],
  ['anonymous RPC','/rest/v1/rpc/gs_notification_health','POST','{}']]) {
  const response=await fetch(project+path,{method,headers:{apikey:anon,Authorization:'Bearer '+anon,'Content-Type':'application/json'},body});
  assert([401,403].includes(response.status),name);receipt.negative.push({name,status:response.status});await response.body?.cancel();
}
assert(previewServiceKey());receipt.health=await reconcile('health');assert(receipt.health.mailConfigured&&receipt.health.intakeResponsive);
const after=JSON.parse(supabase(['db','query','--linked','--project-ref',PREVIEW_REF,'--output','json',
  "select (select count(*) from public.leads) as leads,(select count(*) from gridsmith_private.notification_outbox) as outbox;"])).rows[0];
assert.deepEqual(after,before,'negative probes changed durable counts');
receipt.unchangedCounts=true;writeFileSync(receiptFile,JSON.stringify(receipt,null,2)+'\n');
console.log(`H4-B deployed Preview negative proof PASS: ${receipt.negative.length} method/origin/body/schema/spam/private-worker/public-privilege probes; lead/outbox counts unchanged.`);
