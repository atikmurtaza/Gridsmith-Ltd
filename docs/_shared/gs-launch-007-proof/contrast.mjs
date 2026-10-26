/** Recorded desktop axe memberships only; reuses the existing rendered predicates unchanged. */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import { launch } from '../../../scripts/browser-launch.mjs';
import { renderedLabelContrast } from '../../../scripts/rendered-label-contrast.mjs';
import { pressContrast, provePressContrast, preparePress } from '../../../scripts/press-contrast.mjs';
assert.equal(process.platform, 'linux');
assert(existsSync('/.dockerenv') && process.env.GS_LOCAL_PROOF === 'GS-LAUNCH-007');
assert.equal(process.cwd(), '/work/repo');
const base = 'http://127.0.0.1:3236', folder = 'build/gs-launch-007';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => readFileSync(path, 'utf8');
const identityBytes = read('build/production-rehearsal/__deployment.json'), identity = JSON.parse(identityBytes);
assert(identity.rehearsal && !identity.deployable && !identity.sourceModified && identity.contactMode === 'direct');
const original = read('build/production-rehearsal/.htaccess');
assert(/^Require all denied$/m.test(original));
const preserve = () => {
  assert.equal(read('build/production-rehearsal/__deployment.json'), identityBytes);
  assert.equal(read('build/production-rehearsal/.htaccess'), original);
  for (const file of identity.files) assert.equal(hash(readFileSync(`build/production-rehearsal/${file.path}`)), file.sha256);
};
preserve();
const response = await fetch(base + '/__deployment.json');
assert.equal(response.status, 200); assert.equal(await response.text(), identityBytes);
const rawBytes = read('build/static-axe-results.json'), raw = JSON.parse(rawBytes), members = [];
for (const row of raw) for (const rule of row.result.incomplete) {
  assert.equal(rule.id, 'color-contrast');
  for (const node of rule.nodes) {
    const selector = node.target.join(' ');
    const kind = selector === '#gs-consent-heading' ? 'consent' :
      ({ '/': 'master', '/design': 'design', '/digital': 'digital', '/press': 'press' })[row.route];
    assert(kind); members.push({ id: members.length, route: row.route, selector, html: node.html, kind });
  }
}
assert.equal(members.length, 250);
const receipt = { artifactIdentity: identity.artifactIdentity, sourceSha: identity.sourceSha,
  rawAxeSha256: hash(rawBytes), viewport: [1440,900,1], extractions: [], samples: [], proofs: [], failures: [],
  limitations: ['Recorded desktop incomplete memberships only; not full scenes/mobile/lifecycle or hosted acceptance.',
    'Hidden/decorative dispositions are not contrast passes. Digital returns measured counts and failures, not passing ratios.'] };
const sourceFiles = new Map();
function extract(path, name, bindings = {}) {
  const text = read(path), ast = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  assert.equal(ast.parseDiagnostics.length, 0); sourceFiles.set(path, hash(text));
  const values = [];
  for (const statement of ast.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name?.text === name) values.push(statement.getText(ast));
    if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) values.push(declaration.initializer.getText(ast));
    }
  }
  assert.equal(values.length, 1, name);
  receipt.extractions.push({ path, name, sourceSha256: hash(text), extractedSha256: hash(values[0]) });
  return new Function(...Object.keys(bindings), `return (${values[0]});`)(...Object.values(bindings));
}
const browser = await launch({ args: ['--enable-unsafe-swiftshader','--use-angle=swiftshader'] });
const decoder = await browser.newPage(), wait = ms => new Promise(done => setTimeout(done, ms));
const master = 'scripts/check-master-scene.mjs';
const TEXT_BOXES = extract(master, 'TEXT_BOXES');
const capture = extract(master, 'captureViewport', { TEXT_BOXES });
const analyse = extract(master, 'analyse', { decoder, DIAGNOSTICS: false });
const ratio = extract(master, 'ratio');
const design = extract('scripts/check-design-scene.mjs', 'textContrast', { decoder, pause: () => wait(650) });
const digital = extract('scripts/check-digital-scene.mjs', 'textContrast', { decoder, settle: wait });
const digitalY = extract('scripts/check-digital-scene.mjs', 'resolveY');
const masks = [...new Set([...read(master).matchAll(/content: '(:is\(header, main, footer\) \*,[^\n]+)'/g)].map(match=>match[1]))];
assert.equal(masks.length, 1); const masterMask = masks[0];
const proven = new Set(), started = Date.now();
function bind(page, member) {
  return page.evaluate(member => {
    const captured = new DOMParser().parseFromString(member.html,'text/html').body.firstElementChild;
    const normalize = text => text.replace(/\s+/g,' ').trim();
    const found = [...document.querySelectorAll(member.selector)].filter(el =>
      el.tagName === captured.tagName && [...captured.attributes].every(a=>a.name==='style' ||
        (a.name==='class' ? [...captured.classList].every(c=>el.classList.contains(c)) : el.getAttribute(a.name)===a.value)) &&
      (!normalize(captured.textContent) || normalize(el.textContent) === normalize(captured.textContent)));
    if (found.length !== 1) throw Error(`Recorded selector resolves to ${found.length} matching nodes`);
    const value = `gs-${member.id}`; found[0].setAttribute('data-gs-contrast-member',value);
    return `[data-gs-contrast-member="${value}"]`;
  },member);
}
function state(page, selector) {
  return page.$eval(selector, el => {
    const hidden = el.closest('[hidden],[inert]') || (el.closest('details:not([open])') && !el.closest('summary'));
    const decor = el.closest('[aria-hidden="true"]');
    const decorative = decor && !decor.matches('a[href],button,input,select,textarea,[tabindex]') &&
      !decor.querySelector('a[href],button,input,select,textarea,[tabindex]');
    const ranges = [], walker = document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent.trim() || node.parentElement.closest('.sr-only,[aria-hidden="true"],[inert]') ||
          !node.parentElement.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})) continue;
      const range = document.createRange(); range.selectNodeContents(node);
      for (const r of range.getClientRects()) if (r.width>=2 && r.height>=2 && r.bottom>0 && r.top<innerHeight) {
        ranges.push({text:node.textContent.trim(),box:[r.x,r.y,r.width,r.height]});
      }
    }
    let opacity=1, opaque=null;
    for(let a=el;a;a=a.parentElement) {
      const css=getComputedStyle(a); opacity*=Number(css.opacity);
      const rgb=css.backgroundColor.match(/[\d.]+/g)?.map(Number);
      if(!opaque && rgb && (rgb.length===3 || rgb[3]===1)) opaque=css.backgroundColor;
    }
    const r=el.getBoundingClientRect(), points=[[r.left+1,r.top+1],[r.right-1,r.top+1],[r.left+1,r.bottom-1],[r.right-1,r.bottom-1],[(r.left+r.right)/2,(r.top+r.bottom)/2]];
    return {kind:hidden?'hidden':decorative?'decorative':'semantic', ranges, opacity, opaque,
      scroll:[scrollX,scrollY], rect:[r.x,r.y,r.width,r.height],
      unobscured:points.every(([x,y])=>el.contains(document.elementFromPoint(x,y)))};
  });
}
const overlaps = (box,ranges) => ranges.some(r => r.text.startsWith(box.text) &&
  Math.min(box.box[0]+box.box[2],r.box[0]+r.box[2])>Math.max(box.box[0],r.box[0]) &&
  Math.min(box.box[1]+box.box[3],r.box[1]+r.box[3])>Math.max(box.box[1],r.box[1]));
async function measure(page, member, selector) {
  const before=await state(page,selector); assert(before.ranges.length,'No visible semantic range');
  const evaluate=page.evaluate; let boxes=[], result, pass, targetFailed, count;
  try {
    if(member.kind==='consent') {
      assert(before.opaque && before.opacity===1 && before.unobscured,'Consent is not opaque/unobscured');
      result=await renderedLabelContrast(page,selector); count=result.boxes;
      pass=!result.failures.length; targetFailed=result.min<5;
    } else if(member.kind==='press') {
      result=await pressContrast(page,selector); count=result.boxes; pass=result.pass; targetFailed=!pass && count>0;
    } else if(member.kind==='master') {
      boxes=(await page.evaluate(TEXT_BOXES)).filter(b=>overlaps(b,before.ranges)); assert(boxes.length);
      const hide=await page.addStyleTag({content:masterMask}); let png;
      try { png=await capture(page); } finally { await hide.evaluate(el=>el.remove()); }
      const pixels=await analyse(png,boxes.map(b=>b.box));
      result=boxes.map((b,i)=>({text:b.text,min:b.min,opacity:b.opacity,ratio:pixels.p98[i]===null?null:ratio(b.L,pixels.p98[i])}));
      count=result.length; pass=result.every(r=>r.ratio!==null && r.ratio>=r.min && r.opacity===1);
      targetFailed=result.some(r=>r.ratio!==null && r.ratio<r.min);
    } else {
      page.evaluate=async function(fn,...args) {
        const value=await evaluate.call(this,fn,...args);
        if(Array.isArray(value) && value.length && value.every(r=>r && Array.isArray(r.box) && 'min' in r)) {
          // Keep the existing pixel predicate, scoped to this recorded node's glyph ranges.
          boxes=member.kind==='digital'?value.filter(b=>overlaps(b,before.ranges)):value;
          return boxes;
        }
        return value;
      };
      result=member.kind==='design' ? await design(page,{selector,hide:`${selector},${selector} *`,report:true}) : await digital(page);
      const reached=boxes.filter(b=>overlaps(b,before.ranges)); count=reached.length;
      assert(before.ranges.every(r=>reached.some(b=>overlaps(b,[r]))),'Predicate did not reach every recorded range');
      pass=member.kind==='design' ? result.every(r=>r.measured && r.ratio>=r.min) : !result.failures.length;
      targetFailed=member.kind==='design' ? result.some(r=>r.measured && r.ratio<r.min) :
        result.failures.some(f=>reached.some(b=>f.includes(`"${b.text}"`)));
    }
  } finally { page.evaluate=evaluate; }
  assert(count>0,'No boxes measured');
  assert.deepEqual(await state(page,selector),before,'Capture changed subject geometry/state');
  return {pass,targetFailed,boxes:count,result};
}
async function prove(page,member,selector) {
  const styles=await page.$eval(selector,el=>[el,...el.querySelectorAll('*')].map(n=>n.getAttribute('style')));
  await page.$eval(selector,el=>{
    el.style.setProperty('background-color','black','important');
    for(const n of [el,...el.querySelectorAll('*')]) n.style.setProperty('color','black','important');
  });
  let bad;
  try {bad=await measure(page,member,selector);}
  finally {await page.$eval(selector,(el,styles)=>[el,...el.querySelectorAll('*')].forEach((n,i)=>styles[i]===null?n.removeAttribute('style'):n.setAttribute('style',styles[i])),styles);}
  assert(bad.targetFailed,'Low-contrast specimen did not reach its intended predicate');
  const restored=await measure(page,member,selector); assert(restored.pass);
  receipt.proofs.push({kind:member.kind,member:member.id,bad,restored}); proven.add(member.kind);
}
try {
  await provePressContrast(browser);
  for(const route of new Set(members.map(m=>m.route))) {
    const page=await browser.newPage(); await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
    const forbidden=[]; await page.setRequestInterception(true);
    page.on('request',r=>{const u=new URL(r.url());
      if(!['GET','HEAD'].includes(r.method()) || (['http:','https:'].includes(u.protocol)&&u.origin!==base)) {forbidden.push(r.url());void r.abort();} else void r.continue();});
    try {
      assert.equal((await page.goto(base+route,{waitUntil:'networkidle0'})).status(),route==='/h4a-unknown-route'?404:200);
      await page.evaluate(()=>document.fonts.ready);
      if(route==='/press') {await preparePress(page);await page.click('.pr-desk-loop');await wait(2000);}
      for(const member of members.filter(m=>m.route===route)) {
        assert(Date.now()-started<12*60*1000,'Twelve-minute bound');
        const row={...member}; receipt.samples.push(row);
        try {
          const selector=await bind(page,member);
          if(member.kind==='digital' && member.selector==='.dg-motion-control') {
            await page.evaluate(()=>scrollTo(0,0));await wait(1500);
          } else if(member.kind==='digital' && await page.$eval(selector,e=>!!e.closest('.dg-apertures'))) {
            await digitalY(page,{sel:'.dg-map-visual-space',off:-.1});await wait(1500);
          } else if(member.kind!=='consent') await page.$eval(selector,e=>e.scrollIntoView({block:'center',inline:'center',behavior:'instant'}));
          await wait(650); row.state=await state(page,selector);
          if(row.state.kind!=='semantic') {row.disposition=row.state.kind;continue;}
          row.measurement=await measure(page,member,selector);
          assert(row.measurement.pass,'Rendered contrast predicate failed'); row.disposition='measured';
          if(!proven.has(member.kind)) await prove(page,member,selector);
        } catch(error) {row.disposition='unresolved';row.error=error.stack;receipt.failures.push({member:member.id,error:error.stack});}
      }
      assert.deepEqual(forbidden,[]);
      console.log(JSON.stringify({route,visited:receipt.samples.length,failures:receipt.failures.length}));
    } finally {await page.close();}
  }
  assert.equal(receipt.samples.length,members.length);
  assert.equal(proven.size,5);
} catch(error) {receipt.failures.push({error:error.stack});}
finally {
  await browser.close(); preserve();
  for(const [path,digest] of sourceFiles) assert.equal(hash(read(path)),digest);
  receipt.sourceFiles=Object.fromEntries(sourceFiles);
  receipt.coverage=Object.fromEntries(['measured','decorative','hidden','unresolved'].map(k=>[k,receipt.samples.filter(r=>r.disposition===k).length]));
  receipt.unvisited=members.length-receipt.samples.length; receipt.elapsedMs=Date.now()-started;
  receipt.status=receipt.failures.length||receipt.unvisited?'FAIL':'PASS_FOR_RECORDED_DESKTOP_MEMBERSHIPS';
  writeFileSync(`${folder}/contrast-receipt.json`,JSON.stringify(receipt,null,2)+'\n');
}
console.log(JSON.stringify({status:receipt.status,coverage:receipt.coverage,failures:receipt.failures.length,unvisited:receipt.unvisited}));
if(receipt.failures.length||receipt.unvisited)process.exitCode=1;
