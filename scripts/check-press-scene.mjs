/** GS-PRESS-001-RC: served Press lifecycle, controls, rails, service metadata and fallback.
 * Uses the existing production server. No valid form is submitted; incomplete forms reject
 * in the Press payload validator before submitLead. No CMS/database/provider mutations here.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {AxePuppeteer} from '@axe-core/puppeteer';
import {launch} from './browser-launch.mjs';
import {checkPressFlags, pressContrast, provePressContrast} from './press-contrast.mjs';
import {labelOpacitySamples, renderedLabelContrast} from './rendered-label-contrast.mjs';
const base=process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const processNames=['Consultation','Planning & Scope','Approval & Start','Design, Development & Updates','Delivery','Support (if applicable)'];
const axeSource=readFileSync('node_modules/axe-core/axe.min.js','utf8');
async function stateContrast(page,region){
 const result=await new AxePuppeteer(page,axeSource).include(region).withRules(['color-contrast']).analyze();
 assert.equal(result.violations.length,0,`${region}: color contrast violation`);
 for(const rule of result.incomplete)for(const node of rule.nodes){
  const measured=await pressContrast(page,node.target.join(' '));
  assert(measured.pass,`${region}: ${node.target.join(' ')} color contrast ${measured.why}`);
 }
}
const visibleFocus=e=>{
 const probe=document.createElement('span');probe.style.color=e.closest('.pr-paper-obj')?'var(--pr-green)':'var(--pr-gold-bright)';e.append(probe);
 const expected=getComputedStyle(probe).color;probe.remove();const c=getComputedStyle(e);
 return c.outlineColor===expected && c.outlineStyle!=='none' && parseFloat(c.outlineWidth)>=2;
};
const withheld=(sitemap,metadata)=>!sitemap.includes('/press/path-finder') && /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/.test(metadata);
const sitemap=readFileSync('app/sitemap.ts','utf8'),metadata=readFileSync('app/(press)/press/path-finder/page.tsx','utf8');
assert(withheld(sitemap,metadata),'Path Finder discovery is not withheld');
assert(!withheld(sitemap+"'/press/path-finder'",metadata),'sitemap negative proof');
assert(!withheld(sitemap,metadata.replace('index: false','index: true')),'metadata negative proof');
assert(!withheld(sitemap,metadata.replace('follow: false','follow: true')),'follow metadata negative proof');
const checkCycle=events=>{
 const writes=events.filter(e=>e.stage==='write');
 assert(writes.length>=2,'loop did not repeat');assert(Math.abs(writes[1].at-writes[0].at-3800)<300,'cycle timing changed');
 const start=events.findIndex(e=>e.stage==='write');
 assert.deepEqual(events.slice(start,start+4).map(e=>e.stage),['write','edit','produce','publish']);
 for(const [i,offset] of [0,450,1000,1500].entries())assert(Math.abs(events[start+i].at-events[start].at-offset)<300,'stage timing changed');
};
const specimen=[{stage:'write',at:0},{stage:'edit',at:450},{stage:'produce',at:1000},{stage:'publish',at:1500},{stage:'write',at:3800}];
checkCycle(specimen);
assert.throws(()=>checkCycle(specimen.slice(0,4)),/repeat/);
assert.throws(()=>checkCycle(specimen.map((e,i)=>i===4?{...e,at:5000}:e)),/cycle timing/);
assert.throws(()=>checkCycle(specimen.map((e,i)=>i===1?{...e,stage:'publish'}:e)));
for(const index of [1,2,3])assert.throws(()=>checkCycle(specimen.map((e,i)=>i===index?{...e,at:e.at+500}:e)),/stage timing/);
// Use main-thread CSS sampling for paused pixel captures; default-browser acceptance follows.
const pixelBrowser=await launch({args:['--disable-threaded-animation']});
try{await provePressContrast(pixelBrowser);await checkPressFlags(pixelBrowser,base);}
finally{await pixelBrowser.close();}
if(process.argv.includes('--contrast-only'))process.exit(0);
const browser=await launch();
try {
 const page=await browser.newPage(),errors=[];
 await page.setCacheEnabled(false);
 await page.evaluateOnNewDocument(labelOpacitySamples,'.pr-desk:has(#pr-desk-edit:checked) :is(.pr-d-flag, .pr-d-ins)',true);
 page.on('pageerror',e=>errors.push(e.message));
 await page.evaluateOnNewDocument(()=>{
  window.__pressShifts=[];
  new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__pressShifts.push(e.value);})).observe({type:'layout-shift',buffered:true});
 });
 await page.setViewport({width:1440,height:900});
 assert.equal((await page.goto(base+'/press',{waitUntil:'networkidle0'})).status(),200);
 const services=await page.$$eval('.pr-cat-list a',a=>[...new Set(a.map(e=>e.getAttribute('href')))]);
 assert.equal(services.length,14);assert.equal(await page.$$eval('.pr-cat-list a',a=>a.length),43);
 const sample=ms=>page.evaluate(async ms=>{
  const events=[],start=performance.now();let last='';
  while(performance.now()-start<ms){const stage=document.querySelector('[name="pr-desk"]:checked')?.value;if(stage!==last){events.push({stage,at:performance.now()-start});last=stage;}await new Promise(r=>setTimeout(r,25));}return events;
 },ms);
 // The first sample is the current state, not an observed transition into that state.
 checkCycle((await sample(8200)).slice(1));
 const nativeLabels=await page.evaluate(()=>window.__labelContrastSamples);
 const nativeAnnotations=samples=>{
  assert(samples.length>0,'default-threaded loop did not reach readable annotations');
  assert(samples.every(s=>s.opacity===1),'default-threaded loop faded readable annotations');
  assert.deepEqual([...new Set(samples.map(s=>s.text))].sort(),['Reason first?','Split this sentence','your'],'default-threaded loop did not reach all three annotations');
 };
 nativeAnnotations(nativeLabels);
 assert.throws(()=>nativeAnnotations([]),/did not reach/);
 assert.throws(()=>nativeAnnotations([{opacity:.3}]),/faded readable/);
 assert.throws(()=>nativeAnnotations(nativeLabels.filter(s=>s.text!=='your')),/did not reach all three/);
 const cls=await page.evaluate(()=>window.__pressShifts.reduce((a,b)=>a+b,0));assert(cls<=.1,`hero CLS ${cls}`);console.log(`Hero CLS: ${cls}`);
 await page.click('.pr-desk-loop');assert.equal((await sample(4100)).length,1,'pause does not stop');
 for(let i=0;i<3;i++){await page.click('.pr-desk-loop');await wait(200);await page.click('.pr-desk-loop');assert.equal((await sample(700)).length,1);}
 await page.click('label[for="pr-desk-edit"]');assert.equal((await sample(5300)).length,1,'manual choice overrides pause');
 const settled=await renderedLabelContrast(page,'.pr-desk:has(#pr-desk-edit:checked) :is(.pr-d-flag, .pr-d-ins)');
 assert.deepEqual(settled.failures,[],'default-threaded settled Edit contrast');
 assert.equal(settled.boxes,3,'default-threaded settled Edit must paint all annotations');
 console.log(`Default-threaded settled Edit: ${settled.min.toFixed(2)}:1, three painted glyph subjects`);
 await page.click('.pr-desk-loop');await page.click('label[for="pr-desk-produce"]');
 const manual=await sample(6700);assert.equal(manual[0].stage,'produce');assert(manual[1].at>=4800&&manual[1].at<5500,'manual hold changed');
 await page.$eval('#editing',e=>e.scrollIntoView());await wait(500);assert.equal((await sample(4100)).length,1,'offscreen loop');
 await page.evaluate(()=>scrollTo(0,0));await wait(200);assert((await sample(2000)).length>1,'return did not restart');
 const other=await browser.newPage();await other.bringToFront();await wait(200);
 assert.equal(await page.evaluate(()=>document.hidden),true,'hidden-document precondition');assert.equal((await sample(4100)).length,1,'hidden-document loop');
 await other.close();await page.bringToFront();
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await wait(100);
 const reduced=await sample(4100);assert.equal(reduced.length,1);assert.equal(reduced[0].stage,'publish');
 const fault=await page.evaluate(()=>setInterval(()=>{const ids=['write','edit'];document.querySelector(`#pr-desk-${ids[document.querySelector('#pr-desk-write').checked?1:0]}`).checked=true;},100));
 const broken=await sample(450);assert.throws(()=>assert.equal(broken.length,1),'autoplay negative proof');await page.evaluate(id=>clearInterval(id),fault);
 await page.click('label[for="pr-desk-edit"]');assert.equal((await sample(5200)).length,1,'reduced manual autoplay');
 await page.reload({waitUntil:'networkidle0'});assert.equal((await sample(4100))[0].stage,'publish');
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);assert((await sample(2000)).length>1,'motion preference restart');
 console.log('Hero: 3.8s loop, offsets, repeated pause, manual 5s hold, offscreen/hidden and live/start reduced motion PASS');
 for(const width of [320,360,390,430,768,1024,1280,1440,1920]){
  await page.setViewport({width,height:900});await page.goto(base+'/press',{waitUntil:'networkidle0'});
  for(const selector of ['.pr-hero','#writing','#editing','#production','#publishing','#audio','#marketing','#services','#process','.pr-arrangements','.pr-close']){
   await page.$eval(selector,e=>e.scrollIntoView({block:'start',behavior:'instant'}));await wait(300);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width} ${selector} overflow`);
  }
  for(const selector of ['.pr-stages','.pr-arr-grid']){
   await page.focus(selector);await page.keyboard.press('ArrowRight');await wait(120);
   const rail=await page.$eval(selector,e=>({overflow:e.scrollWidth>e.clientWidth,scroll:e.scrollLeft,focused:document.activeElement===e}));
   assert(rail.focused);if(rail.overflow)assert(rail.scroll>0,'rail cannot be keyboard-scrolled');
  }
 }
 console.log('Responsive: nine widths 320–1920, 11 page sections, keyboard process/rights rails PASS');
 await page.setViewport({width:390,height:844,hasTouch:true});await page.goto(base+'/press',{waitUntil:'networkidle0'});
 await page.tap('label[for="pr-desk-edit"]');assert.equal(await page.$eval('[name="pr-desk"]:checked',e=>e.value),'edit','touch hero selection');
 await page.focus('#pr-desk-edit');await page.keyboard.press('ArrowRight');assert.equal(await page.$eval('[name="pr-desk"]:checked',e=>e.value),'produce','keyboard hero selection');
 await page.setViewport({width:1440,height:900});
 for(const name of ['pr-pass','pr-pro','pr-size','pr-au']){
  if(name==='pr-size')await page.locator('label[for="pr-pro-ebook"]').click();
  const inputs=await page.$$(`[name="${name}"]`);
  for(const [index,input] of inputs.entries()){
   const id=await input.evaluate(e=>e.id);
   await page.$eval(`label[for="${id}"]`,e=>e.scrollIntoView({block:'center',behavior:'instant'}));await wait(400);
   await page.click(`label[for="${id}"]`);assert(await input.evaluate(e=>e.checked),`${id} pointer selection`);
   await wait(800);
   const region=name==='pr-pass'?`.pr-pane-${id.replace('pr-pass-','')}`:name==='pr-au'?'.pr-au-stage':'.pr-pro-stage';
   await stateContrast(page,region);
   if(id==='pr-pass-proof'){
    const subject=await page.$(`${region} .pr-passage`);
    const saved=await subject.evaluate(e=>{const saved=e.getAttribute('style');e.style.color='white';e.style.background='white';return saved;});
    try{await assert.rejects(()=>stateContrast(page,region),/color contrast/,'alternate passage contrast negative proof');}
    finally{await subject.evaluate((e,s)=>s===null?e.removeAttribute('style'):e.setAttribute('style',s),saved);}
   }
   await input.focus();await page.keyboard.press('ArrowRight');
   assert.equal(await page.$eval(`[name="${name}"]:checked`,e=>e.id),await inputs[(index+1)%inputs.length].evaluate(e=>e.id),`${name} keyboard selection`);
   if(name==='pr-pass'&&index===0){
    await page.evaluate(()=>{window.__blockArrow=e=>{if(e.key==='ArrowRight')e.preventDefault();};document.addEventListener('keydown',window.__blockArrow,true);});
    const before=await page.$eval(`[name="${name}"]:checked`,e=>e.id);await page.keyboard.press('ArrowRight');
    const after=await page.$eval(`[name="${name}"]:checked`,e=>e.id);assert.throws(()=>assert.notEqual(after,before),'blocked arrow negative proof');
    await page.evaluate(()=>{document.removeEventListener('keydown',window.__blockArrow,true);delete window.__blockArrow;});
   }
  }
 }
 for(const selector of ['.pr-desk-loop','.pr-hero-actions .pr-button','.pr-arrangements a','.pr-cat-list a']){
  await page.$eval(selector,e=>e.scrollIntoView({block:'center'}));await page.keyboard.press('Tab');await page.focus(selector);
  assert(await page.$eval(selector,visibleFocus),`invisible focus ${selector}`);
 }
 const focusSubject=await page.$('.pr-cat-list a');
 const savedOutline=await focusSubject.evaluate(e=>{const saved=e.getAttribute('style');e.style.outlineStyle='none';return saved;});
 assert.equal(await focusSubject.evaluate(visibleFocus),false,'missing focus negative proof');
 await focusSubject.evaluate((e,s)=>s===null?e.removeAttribute('style'):e.setAttribute('style',s),savedOutline);
 // Every non-default native control state receives the same direct pixel checks as the
 // unresolved axe nodes. Low contrast fails; decoration is separately identified.
 for(const id of ['pr-pro-ms','pr-pro-print','pr-pro-ebook','pr-au-text','pr-au-voice']){
  const target=`label[for="${id}"]`;
  await page.$eval(target,e=>e.scrollIntoView({block:'center',behavior:'instant'}));await wait(400);
  await page.click(target);assert(await page.$eval(`#${id}`,e=>e.checked),`${id} state-cue precondition`);
  assert((await pressContrast(page,target)).pass,`${id} contrast`);
  assert.match(await page.$eval(target,e=>getComputedStyle(e).textDecorationLine),/underline/,`${id} non-colour selection cue missing`);
 }
 const titles=new Set(),descriptions=new Set();
 for(const path of [...services,'/press/contact']){
  assert.equal((await page.goto(base+path,{waitUntil:'networkidle0'})).status(),200);
  const meta=await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name="description"]')?.content,canonical:document.querySelector('link[rel="canonical"]')?.href,robots:document.querySelector('meta[name="robots"]')?.content,h1:document.querySelectorAll('h1').length,pathLinks:document.querySelectorAll('a[href*="path-finder"]').length,process:[...document.querySelectorAll('dt')].map(e=>e.textContent)}));
  assert.equal(meta.h1,1);assert.equal(meta.pathLinks,0);assert(meta.description);assert.match(meta.robots,/noindex/);assert.equal(new URL(meta.canonical).pathname,path);
  assert(!titles.has(meta.title));assert(!descriptions.has(meta.description));titles.add(meta.title);descriptions.add(meta.description);
  if(path.includes('/services/'))assert.deepEqual(meta.process.filter(t=>processNames.includes(t)),processNames,`${path}: the six canonical stages, by name and in order (unnumbered since GS-VIS-001-R3)`);
 }
 for(const [segment,field] of [['author','manuscriptStage'],['business','bookPurpose'],['content','formats'],['production','workType']]){
  await page.goto(base+'/press/contact',{waitUntil:'networkidle0'});
  await page.click(`input[name="segment"][value="${segment}"]`);await page.locator('form button[type="button"]:last-child').click();
  assert(await page.$eval(`[name="${field}"]`,e=>e.checkVisibility()),`${segment} branch missing`);
  if(segment==='production')assert.deepEqual(await page.$$eval('[name="workType"] option',es=>es.map(e=>e.value).filter(Boolean)),['editing','book-production','publishing','audiobook']);
 }
 // Invalid payload only: no branch answers, so the action rejects before submitLead.
 await page.goto(base+'/press/contact',{waitUntil:'networkidle0'});
 let posts=0;page.on('request',r=>{if(r.method()==='POST')posts++;});
 await page.click('input[name="segment"][value="content"]');
 for(let i=0;i<3;i++){await page.locator('form button[type="button"]:last-child').click();await wait(200);}
 assert.match(await page.$eval('form [aria-live]:not([data-submit-status])',e=>e.textContent),/^Step 4/,'Next submitted before contact details');
 assert.equal(posts,0,'Next sent a premature submission');
 await page.click('button[type="submit"]');
 await page.waitForSelector('#press-formats-error');
 assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('name')),'formats','first invalid field not focused');
 assert.equal(await page.$eval('#press-formats-error',e=>e.previousElementSibling.getAttribute('aria-describedby')),'press-formats-error');
 console.log('Services: 14 distinct metadata/canonical routes, canonical process; invalid contact focus/description PASS');
 await page.setJavaScriptEnabled(false);await page.goto(base+'/press',{waitUntil:'networkidle0'});
 const fallback=await page.evaluate(()=>({text:document.querySelector('main').textContent,links:[...document.querySelectorAll('main a')].map(e=>e.getAttribute('href')),stage:document.querySelector('[name="pr-desk"]:checked')?.value}));
 assert.equal(fallback.stage,'publish');for(const path of services)assert(fallback.links.includes(path));
 for(const name of processNames)assert(fallback.text.includes(name));
 assert(fallback.links.includes('/contact?division=press'));assert(fallback.links.includes('/press/contact'));assert(fallback.links.some(x=>x.includes('/legal/consumer-client-terms')));assert(!fallback.links.some(x=>x.includes('path-finder')));
 assert.equal(errors.length,0,errors.join('; '));
 console.log('No-JS: proposition, 14 services, canonical process, enquiries, consumer terms, no Path Finder promotion PASS');
} finally { await browser.close(); }
