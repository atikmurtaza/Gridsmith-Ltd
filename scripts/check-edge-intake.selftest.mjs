/** Permanent local parity/HTTP/worker adverse specimens. No provider traffic or app mutation. */
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { createIntake, INTAKE_BODY_BYTES } from '../lib/leads/edge-intake.ts';
import { validateForm } from '../lib/leads/form-domain.ts';
import { createWorker, notificationEmail, sendNotification } from '../lib/leads/edge-worker.ts';

register('data:text/javascript,' + encodeURIComponent(
  "const MAP={'next/server':'next/server.js','next/navigation':'next/dist/client/components/navigation.react-server.js'};"+
  'export async function resolve(s,c,n){return n(MAP[s]??s,c)}'));
process.env.PROJECT_URL='https://h4b-parity.invalid';
process.env.SUPABASE_SERVICE_ROLE_KEY='h4b-parity-not-a-credential';
const inserts=[];
globalThis.fetch=async (_url, options) => { inserts.push(JSON.parse(options.body)); return new Response(null,{status:599}); };
const { submitLeadAction }=await import('../lib/leads/action.ts');
const { submitPressLeadAction }=await import('../lib/leads/pressAction.ts');
const origin='http://localhost:3236', id=()=>crypto.randomUUID();
const base={full_name:'GS-HOST-H4-B Synthetic',email:'Synthetic@gridsmith.invalid'};
const formOf=fields=>{const form=new FormData();for(const [key,value] of Object.entries(fields))
  for(const entry of Array.isArray(value)?value:[value])form.append(key,entry);return form;};
const post=(formType,fields,extra={})=>new Request('http://intake.invalid',{method:'POST',headers:{Origin:origin,
  'Content-Type':'application/json'},body:JSON.stringify({formType,requestId:id(),fields}),...extra});
let cases=0;
const checkParity=async(formType,fields)=>{
  inserts.length=0;const fd=formOf(fields), domain=validateForm(formType,fd);
  const action=formType==='contact'?submitLeadAction:submitPressLeadAction;
  let normal;try{normal=await action({status:'idle'},fd);}catch(error){
    assert.match(String(error.digest??error),/\/press\/contact\/thank-you/);normal={status:'ok'};}
  const admitted=[];let wakes=0;
  const handler=createIntake([origin],async(_id,_type,lead)=>{admitted.push(JSON.parse(JSON.stringify(lead)));
    return {outcome:'accepted',id:id()};},()=>wakes++);
  const response=await handler(post(formType,fields)), edge=await response.json();
  if(domain.status==='valid'){
    assert.equal(normal.status,'error');assert.equal(inserts.length,1);assert.equal(admitted.length,1);
    const normalLead={...inserts[0]};delete normalLead.id;assert.deepEqual(admitted[0],normalLead);
    assert.equal(edge.status,'ok');assert.equal(response.status,202);assert.equal(wakes,1);
  }else if(domain.status==='invalid'){
    assert.deepEqual(normal,domain);assert.deepEqual(edge,domain);assert.equal(response.status,422);
    assert.equal(admitted.length,0);assert.equal(inserts.length,0);assert.equal(wakes,0);
  }else{
    assert.equal(normal.status,'ok');assert.equal(edge.status,'ok');assert.equal(admitted.length,0);
    assert.equal(inserts.length,0);assert.equal(wakes,0);
  }cases++;
};
await checkParity('contact',base);
await checkParity('contact',{...base,division:'digital',service_slug:'websites',company:' Company ',role:' Role ',
  phone:' 123 ',message:' message ',budget_band:'free text',timeline:'free text',source:'source',medium:'medium',
  campaign:'campaign',referrer:'referrer',landing_page:'/contact',is_ai_referral:'true',notes:'discard',payload:'discard'});
for(const fields of [{full_name:'',email:base.email},{...base,email:'bad'},
  {...base,division:'unknown'},{...base,message:'x'.repeat(5001)},
  ...['http://','https://','www.'].map(prefix=>({...base,full_name:prefix+'spam.invalid'})),
  {...base,website:'x'},{...base,website:' '},{...base,website:''}]) await checkParity('contact',fields);
const branches={
  author:{segment:'author',manuscriptStage:'idea',genre:' Nonfiction ',wordCount:'unknown',previouslyPublished:'no',timeline:'no-deadline'},
  business:{segment:'business',bookPurpose:'credibility',whoWrites:'ghostwritten',companyName:' Synthetic ',approvalNeeded:'no',timeline:'no-deadline'},
  memoir:{segment:'memoir',manuscriptStage:'idea',intendedReadership:'family-only',expectationsAcknowledged:'yes',timeline:'no-deadline'},
  content:{segment:'content',formats:[' Articles '],volumePerMonth:' One ',turnaroundNeeded:' Flexible ',procurementProcess:'no'},
  production:{segment:'production',workType:'editing',currentMaterial:' Synthetic material '},
};
for(const [segment,branch] of Object.entries(branches)){
  await checkParity('press',{...base,...branch,manuscriptLink:'',triedElsewhere:'',notes:'discard'});
  await checkParity('press',{...base,...branch,manuscriptLink:'https://example.invalid/synthetic',triedElsewhere:'Synthetic only'});
  await checkParity('press',{...base,...branch,website:'x'});
  const required={author:'genre',business:'companyName',memoir:'expectationsAcknowledged',content:'formats',production:'currentMaterial'}[segment];
  const missing={...base,...branch};delete missing[required];await checkParity('press',missing);
}
for(const fields of [{...base,segment:'unknown'},{...base,...branches.author,genre:'x'.repeat(121)},
  {...base,...branches.author,email:'bad'},{...base,...branches.author,full_name:'www.spam.invalid'},
  {...base,...branches.memoir,expectationsAcknowledged:'no'},
  {...base,...branches.content,formats:Array(400).fill('x'.repeat(60))}])await checkParity('press',fields);
const escaped = { ...base, ...branches.author, full_name: 'GS-HOST-H4-B ' + 'x'.repeat(180),
  company: 'x'.repeat(200), phone: 'x'.repeat(40), budget_band: 'x'.repeat(80),
  message: '\u0001'.repeat(5000), triedElsewhere: 'x'.repeat(2000) };
assert(JSON.stringify({formType:'press',requestId:id(),fields:escaped}).length > 32_768,
  'escaped parity specimen must reach the original too-small transport cap');
await checkParity('press',escaped);
assert.equal(validateForm('contact',formOf({...base,email:' Case@gridsmith.invalid '})).lead.email,'Case@gridsmith.invalid');

let storageCalls=0;
const storage=async()=>{storageCalls++;return{outcome:'accepted',id:id()};};
for(const [request,status] of [
  [post('contact',base,{method:'PUT'}),405],
  [post('contact',base,{headers:{Origin:'https://attacker.invalid','Content-Type':'application/json'}}),403],
  [post('contact',base,{headers:{'Content-Type':'application/json'}}),403],
  [post('contact',base,{headers:{Origin:origin,'Content-Type':'text/plain'}}),415],
  [post('contact',base,{body:'{'}),400],
  [post('contact',base,{body:'x'.repeat(INTAKE_BODY_BYTES+1)}),413],
  [post('contact',base,{headers:{Origin:origin,'Content-Type':'application/json','Content-Length':String(INTAKE_BODY_BYTES+1)}}),413],
  [post('contact',base,{body:JSON.stringify({formType:'contact',requestId:id(),fields:base,redirect:'https://attacker.invalid'})}),400],
  [post('contact',base,{body:JSON.stringify({formType:'contact',requestId:id(),fields:{full_name:{nested:'no'}}})}),400],
  [post('unknown',base),400],
  ...[['contact'], ['press'], {}, null].map((formType) => [post(formType,base),400]),
]){assert.equal((await createIntake([origin],storage)(request)).status,status);cases++;}
assert.equal(storageCalls,0);
const preflight=new Request('http://intake.invalid',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'}});
const cors=await createIntake([origin],storage)(preflight);assert.equal(cors.status,204);assert.equal(cors.headers.get('Access-Control-Allow-Origin'),origin);
assert.throws(()=>createIntake(['*'],storage));
for(const outcome of ['capacity','conflict'])assert.equal((await createIntake([origin],async()=>({outcome}))(post('contact',base))).status,outcome==='capacity'?503:409);
assert.equal((await createIntake([origin],async()=>{throw Error('SQL private sentinel');})(post('contact',base))).status,503);
assert.equal((await createIntake([origin],storage,()=>{throw Error('wake failure');})(post('contact',base))).status,202);
const burst=createIntake([origin],storage);const burstStatuses=[];for(let n=0;n<25;n++)burstStatuses.push((await burst(post('contact',base))).status);
assert(burstStatuses.includes(429),'isolate burst specimen did not reach the rejection branch');

const work={id:id(),lead_id:id(),lease_token:id(),attempts:1,form_type:'contact',lead:{division:'design',lead_type:'enquiry',...base,message:'PRIVATE MESSAGE',payload:{manuscript:'PRIVATE MANUSCRIPT'}}};
const mail={key:'local-dummy',from:'sender@example.invalid',to:'test@example.invalid',synthetic:true};
const rendered=JSON.stringify(notificationEmail(work,mail));assert(!rendered.includes('PRIVATE'));assert(rendered.includes('SYNTHETIC H4-B TEST'));
for(const [status,outcome] of [[200,'sent'],[400,'permanent'],[401,'permanent'],[409,'temporary'],[429,'temporary'],[503,'temporary']]){
  let key;const result=await sendNotification(work,mail,async(_url,options)=>{key=options.headers['Idempotency-Key'];return new Response('{}',{status});});
  assert.equal(result,outcome);assert.equal(key,`gridsmith-notification/${work.id}`);cases++;
}
assert.equal(await sendNotification(work,mail,async()=>{throw Error('provider secret sentinel');}),'ambiguous');
let claims=0,finishes=0;
const store={claim:async()=>{claims++;return[work];},finish:async(_work,outcome)=>{finishes++;assert.equal(outcome,'sent');return 'sent';},health:async()=>({pending:1})};
const token='local-private-worker-dummy-token-long-enough';
const workerRequest=(operation,auth=token)=>new Request('http://worker.invalid',{method:'POST',headers:{Authorization:`Bearer ${auth}`,'Content-Type':'application/json'},body:JSON.stringify({operation})});
const worker=createWorker(token,store,mail,async()=>new Response('{}',{status:200}));
assert.equal((await worker(workerRequest('drain','wrong'))).status,401);assert.equal(claims,0);
assert.equal((await worker(workerRequest('health'))).status,200);assert.equal(claims,0);
assert.equal((await createWorker(token,store,{...mail,key:''})(workerRequest('drain'))).status,503);assert.equal(claims,0);
const delivered=await(await worker(workerRequest('drain'))).json();assert.equal(delivered.sent,1);assert.equal(claims,1);assert.equal(finishes,1);
const terminal = await (await createWorker(token, { ...store, finish: async () => 'dead' }, mail,
  async () => new Response('{}', { status: 503 }))(workerRequest('drain'))).json();
assert.equal(terminal.dead, 1); assert.equal(terminal.retry, 0, 'worker reports persisted terminal state at the retry-age boundary');
assert.equal((await worker(workerRequest('invalid'))).status,400);

// The real browser adapter is exercised with bounded in-memory transport specimens.
// No provider traffic, cookies, persistence or remote redirect is used by this check.
const { submitContactEdge, submitPressEdge } = await import('../lib/leads/edge-client.ts');
const idle = { status: 'idle' }, requests = [], destination = [];
process.env.NEXT_PUBLIC_LEAD_INTAKE_URL = 'https://h4b-client.invalid/intake';
globalThis.window = { location: { assign: (path) => destination.push(path) } };
let answer = { status: 503, value: { status: 'unavailable' } }, release;
globalThis.fetch = async (_url, options) => {
  requests.push({ body: JSON.parse(options.body), credentials: options.credentials });
  if (release !== undefined) await new Promise((done) => { release = done; });
  if (answer.network) throw Error('network specimen');
  return new Response(JSON.stringify(answer.value), { status: answer.status });
};
assert.equal((await submitContactEdge(idle, formOf(base))).detail, 'temporarily-unavailable');
const originalRequest = requests.at(-1).body.requestId;
answer = { network: true };
assert.equal((await submitContactEdge(idle, formOf(base))).detail, 'network-unavailable');
assert.equal(requests.at(-1).body.requestId, originalRequest, 'ambiguous retry must retain identity');
answer = { status: 422, value: { status: 'invalid', errors: { email: ['Use a valid email'] } } };
assert.equal((await submitContactEdge(idle, formOf(base))).status, 'invalid');
release = true;
const pending = submitContactEdge(idle, formOf(base));
const duplicate = submitContactEdge(idle, formOf(base));
const pendingCount = requests.length;
assert.equal((await submitContactEdge(idle, formOf({ ...base, company: 'changed during submit' }))).detail, 'submission-pending');
assert.equal(requests.length, pendingCount, 'differing in-flight payload must not start another admission');
release(); release = undefined;
assert.deepEqual(await pending, await duplicate);
assert.equal(requests.length, pendingCount, 'duplicate clicks share one network request');
answer = { status: 202, value: { status: 'ok', id: id() } };
assert.equal((await submitContactEdge(idle, formOf({ ...base, company: 'changed' }))).status, 'ok');
assert.notEqual(requests.at(-1).body.requestId, originalRequest);
assert.equal(requests.at(-1).credentials, 'omit');
assert.equal(destination.length, 0);
assert.equal((await submitPressEdge(idle, formOf({ ...base, ...branches.author }))).status, 'ok');
assert.deepEqual(destination, ['/press/contact/thank-you']);
for (const invalid of [{ status: 200, value: { status: 'ok', id: id() } },
  { status: 202, value: { status: 'ok', id: '-'.repeat(36) } },
  { status: 422, value: { status: 'invalid', errors: [] } },
  { status: 422, value: { status: 'invalid', errors: {} } },
  { status: 422, value: { status: 'invalid', errors: { email: [false] } } }]) {
  answer = invalid;
  assert.equal((await submitContactEdge(idle, formOf(base))).status, 'error');
}
answer = { status: 202, value: { status: 'ok', id: id(), excessive: 'x'.repeat(16_384) } };
assert.equal((await submitContactEdge(idle, formOf(base))).status, 'error');
console.log('H4-B client selftest PASS: retry identity, value transport, concurrent identical/differing submissions, fixed Press redirect and bounded malformed responses.');
console.log(`H4-B domain/Edge/worker selftest PASS: ${cases} parity/adverse HTTP/provider cases; all five Press branches; blank optionals; zero-call invalid/trapped subjects; CORS/body/burst/failure/private-worker/idempotency checks.`);
