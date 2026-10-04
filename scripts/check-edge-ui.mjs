/** Real static UI proof. Default: in-memory Edge transport. --live: two approved synthetic Preview enquiries only. */
import assert from 'node:assert/strict';
import { writeFileSync, existsSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { AxePuppeteer } from '@axe-core/puppeteer';
import { createIntake } from '../lib/leads/edge-intake.ts';
import { launch } from './browser-launch.mjs';
const base = 'http://localhost:3236';
const endpoint = 'https://qfgpwumvvtizeamkynes.supabase.co/functions/v1/gs-lead-intake';
const live = process.argv.includes('--live');
if (live && existsSync('build/h4b-live-ui-receipt.json') && !process.argv.includes('--resume')) {
  throw new Error('Existing Preview requests require exact-ID reconciliation; use --resume only after inspecting them');
}
const axeSource = readFileSync(createRequire(fileURLToPath(import.meta.url)).resolve('axe-core/axe.min.js'),'utf8');
const receipt = live && process.argv.includes('--resume') ? JSON.parse(readFileSync('build/h4b-live-ui-receipt.json','utf8')) :
  { phase: 'GS-HOST-H4-B', transport: live ? 'deployed Preview Edge' : 'in-memory Edge HTTP', states: [], requests: [], accepted: [], accessibility: [] };
if(live&&receipt.closed)throw new Error('This Preview proof was cleaned up; its replay records no longer exist. Do not resume.');
const browser = await launch(), page = await browser.newPage();
const saveReceipt = () => writeFileSync(`build/h4b-${live?'live':'mock'}-ui-receipt.json`,JSON.stringify(receipt,null,2)+'\n');
const accept = (item) => {
  receipt.accepted=receipt.accepted.filter(previous=>previous.form!==item.form||previous.width!==item.width);
  receipt.accepted.push(item);saveReceipt();
};
let mode = 'valid', admissions = 0, posts = 0;
const payloads = [], failures = [];
const handler = createIntake([base], async () => {
  if (mode === 'temporary') return { outcome: 'capacity' };
  if (mode === 'delay') await new Promise((resolve) => setTimeout(resolve, 700));
  admissions++; return { outcome: 'accepted', id: crypto.randomUUID() };
});
await page.setRequestInterception(true);
page.on('pageerror', (error) => failures.push(error.message));
page.on('request', async (request) => {
  try {
    if (request.url() === endpoint) {
      if (request.method() === 'POST') {
        posts++; const body = JSON.parse(request.postData()); payloads.push(body);
        if (live) {
          assert(body.fields.full_name.startsWith('GS-HOST-H4-B '));
          assert(body.fields.email.endsWith('@gridsmith.invalid'));
          const previous=receipt.requests.find(item=>item.formType===body.formType);
          if(previous){assert(process.argv.includes('--resume'));body.requestId=previous.requestId;}
          else receipt.requests.push({formType:body.formType,requestId:body.requestId,startedAt:new Date().toISOString()});
          saveReceipt(); // Reconcile this UUID even if a committed response is lost.
          return request.continue({postData:JSON.stringify(body)});
        }
      }
      if (live) return request.continue();
      if (mode === 'network' && request.method() === 'POST') return request.abort('failed');
      const response = await handler(new Request(endpoint, { method: request.method(), headers: request.headers(),
        ...(request.method() === 'POST' ? { body: request.postData() } : {}) }));
      return request.respond({ status: response.status, headers: Object.fromEntries(response.headers), body: await response.text() });
    }
    assert.equal(request.method(), 'GET', 'Unexpected submission destination/method');
    await request.continue();
  } catch { failures.push('Blocked unexpected request'); await request.abort('failed'); }
});
const fill = async (name, value) => {
  await page.$eval(`[name="${name}"]`, (element) => { element.value = ''; });
  await page.type(`[name="${name}"]`, value);
};
const send = async () => { await page.focus('button[type=submit]'); await page.keyboard.press('Enter'); };
const choose = async (name,value) => {
  await page.focus(`[name="${name}"][value="${value}"]`); await page.keyboard.press('Space');
  await page.waitForFunction((selector)=>document.querySelector(selector)?.checked,{},`[name="${name}"][value="${value}"]`);
};
const settled = () => page.waitForFunction(() => !document.querySelector('button[type=submit]')?.disabled);
const next = async () => {
  await page.waitForFunction(() => [...document.querySelectorAll('form button')].some((button) => button.textContent.trim() === 'Next' && !button.disabled));
  const title = await page.$eval('form h2', (element) => element.textContent);
  await page.$eval('form', (form) => [...form.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Next').focus());
  await page.keyboard.press('Enter');
  await page.waitForFunction((previous) => document.querySelector('form h2')?.textContent !== previous, {}, title);
};
const audit = async (label) => {
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Horizontal overflow: ${label}`);
  const result = await new AxePuppeteer(page,axeSource).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
  receipt.accessibility.push({ label, violations: result.violations.map((issue) => ({ id: issue.id, targets: issue.nodes.map((node) => node.target) })),
    incomplete: result.incomplete.map((issue) => ({id:issue.id,nodes:issue.nodes.map(node=>({target:node.target,any:node.any,all:node.all,none:node.none}))})) });
  assert.equal(result.violations.length, 0, `Focused axe: ${label}`);
  for(const issue of result.incomplete)for(const node of issue.nodes){
    assert.equal(issue.id,'color-contrast');assert.deepEqual(node.target,['#gs-consent-heading']);
    assert(node.any.some(check=>check.data?.messageKey==='elmPartiallyObscuring'));
  }
  // Existing check-axe adjudication is only for this fixed-overlay heading, never form controls.
  if(result.incomplete.length){
    const pair=await page.$eval('#gs-consent-heading',element=>{
      const fg=getComputedStyle(element).color;let parent=element,bg='';
      while(parent){const color=getComputedStyle(parent).backgroundColor;if(!color.endsWith(', 0)')&&color!=='transparent'){bg=color;break;}parent=parent.parentElement;}
      return {fg,bg};
    });
    const luminance=color=>{const values=color.match(/[\d.]+/g).slice(0,3).map(Number).map(value=>{const c=value/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;});return values[0]*.2126+values[1]*.7152+values[2]*.0722;};
    const levels=[luminance(pair.fg),luminance(pair.bg)].sort((a,b)=>b-a),ratio=(levels[0]+.05)/(levels[1]+.05);
    assert(ratio>=4.5);receipt.accessibility.at(-1).consentContrast={...pair,ratio,adjudication:'existing opaque fixed-overlay heading; form controls have no incompletes'};
  }
};
try {
  for (const width of live ? [1440] : [1440,390]) {
    await page.setViewport({ width, height: width === 390 ? 844 : 900 });
    await page.goto(base+'/contact', { waitUntil: 'networkidle0' }); await settled();
    assert(await page.$('form[data-edge-form=contact]'));
    await fill('full_name', 'GS-HOST-H4-B Synthetic Contact');
    await fill('email', 'contact-ui@gridsmith.invalid');
    await fill('message', 'SYNTHETIC H4-B TEST — no customer data.');
    if (!live) {
      await fill('email','invalid'); await send(); await page.waitForSelector('[name=email][aria-invalid=true]');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('name')), 'email');
      assert.equal(await page.$eval('[name=message]', (element) => element.value), 'SYNTHETIC H4-B TEST — no customer data.');
      assert.equal(admissions, width === 1440 ? 0 : 2);
      await audit(`contact ${width} invalid`); await fill('email','contact-ui@gridsmith.invalid');
      for (const failure of ['network','temporary']) {
        mode = failure; await send(); await page.waitForSelector('[data-error-summary]'); await settled();
        assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute('data-error-summary')), true);
        assert.equal(await page.$eval('[name=full_name]', (element) => element.value), 'GS-HOST-H4-B Synthetic Contact');
        assert(!(await page.$('[role=status]'))); receipt.states.push({ form: 'contact', width, failure, retained: true, focus: true });
      }
    }
    mode = 'delay'; const before = posts;
    const accepted = page.waitForResponse((response) => response.url() === endpoint && response.request().method() === 'POST' && response.status() === 202);
    await send();
    if (!live) { await page.waitForFunction(() => document.querySelector('button[type=submit]')?.disabled && document.querySelector('[data-submit-status]')?.textContent.includes('Sending')); await page.keyboard.press('Enter'); }
    const response = await accepted;
    accept({ form: 'contact', width, requestId:live?receipt.requests.find(item=>item.formType==='contact').requestId:JSON.parse(response.request().postData()).requestId });
    await page.waitForSelector('[role=status]'); assert.equal(posts-before,1);
    await audit(`contact ${width} success`);
    await page.goto(base+'/press/contact', { waitUntil: 'networkidle0' });
    await choose('segment','author'); await next();
    await choose('manuscriptStage','idea'); await fill('genre','Synthetic nonfiction');
    await page.select('[name=wordCount]','unknown'); await choose('previouslyPublished','no');
    await page.select('[name=timeline]','no-deadline'); await next();
    await page.select('[name=budget_band]','not-sure'); await next(); await settled();
    await fill('full_name','GS-HOST-H4-B Synthetic Press'); await fill('email','press-ui@gridsmith.invalid');
    assert.equal(await page.$eval('[name=manuscriptLink]', (element) => element.value),'');
    assert.equal(await page.$eval('[name=triedElsewhere]', (element) => element.value),'');
    if (!live) {
      await fill('email','invalid'); await send(); await page.waitForSelector('[name=email][aria-invalid=true]');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('name')), 'email');
      await audit(`press ${width} invalid`); await fill('email','press-ui@gridsmith.invalid');
      for(const failure of ['network','temporary']) {
      mode=failure; await send(); await page.waitForFunction((word) => document.querySelector('[data-error-summary]')?.textContent.includes(word),{},failure==='temporary'?'temporarily':'could not confirm');
      await settled(); assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute('data-error-summary')),true);
      await audit(`press ${width} ${failure}`);
      await page.$eval('form',form=>[...form.querySelectorAll('button')].find(button=>button.textContent.trim()==='Back').focus());
      await page.keyboard.press('Enter');
      await page.waitForFunction(()=>document.activeElement?.querySelector('h2')?.textContent==='Budget and source material');
      await next();
      await page.waitForFunction(()=>document.activeElement?.querySelector('h2')?.textContent==='How to reach you');
      }
    }
    mode=live?'valid':'delay';
    const pressAccepted=page.waitForResponse((response) => response.url()===endpoint && response.request().method()==='POST' && response.status()===202);
    await send();
    if(!live)await page.waitForFunction(()=>document.querySelector('button[type=submit]')?.disabled&&document.querySelector('[data-submit-status]')?.textContent.includes('Sending'));
    const pressResponse=await pressAccepted;
    // Redirect may discard the browser response body. The pre-dispatch UUID is the durable reconciliation key.
    const pressRequest=JSON.parse(pressResponse.request().postData());
    accept({form:'press',width,requestId:live?receipt.requests.find(item=>item.formType==='press').requestId:pressRequest.requestId,blankOptionals:true});
    await page.waitForFunction(() => location.pathname==='/press/contact/thank-you');
    assert((await page.title()).includes('That has reached us'));
  }
  if (!live) {
    const noJs=await browser.newPage();await noJs.setJavaScriptEnabled(false);
    for (const route of ['/contact','/press/contact']) {
      await noJs.goto(base+route,{waitUntil:'networkidle0'});
      assert(await noJs.$eval('form noscript',element=>element.textContent.includes('JavaScript is required')));
      assert(await noJs.$('form noscript a[href^="mailto:"]'));
      assert(await noJs.$eval('form',element=>!element.hasAttribute('action')));
      if(route==='/contact')assert(await noJs.$eval('button[type=submit]',element=>element.disabled));
    }
    await noJs.close();receipt.noJs='explicit unsupported submission, email alternative, no external action';
    assert.equal(payloads.length,posts);assert.equal(admissions,4);
  }
  assert.deepEqual(failures,[]);
  saveReceipt();
  console.log(`H4-B ${receipt.transport} UI PASS: ${receipt.accepted.length} accepted paths; ${receipt.accessibility.length} focused axe analyses; pending/value/error/focus/redirect checks.`);
} finally { await browser.close(); }
