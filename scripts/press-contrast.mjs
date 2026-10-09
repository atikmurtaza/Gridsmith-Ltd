import assert from 'node:assert/strict';
import { labelOpacitySamples, renderedLabelContrast } from './rendered-label-contrast.mjs';

/** Press's ruled paper, waveform and horizontal rails can make axe decline contrast.
 * Resolve each declined node from rendered pixels, rather than allowlisting the page.
 * Sampling follows the Design/Digital pixel gates: worst 2% of the text's backdrop.
 * No violations are discarded. Hidden/decorative nodes are reported separately.
 */
export async function preparePress(page) {
  for (const section of await page.$$('.pr-home section[data-pr-motion]')) {
    await section.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await new Promise(r => setTimeout(r, 1800));
  }
  await new Promise(r => setTimeout(r, 1800));
  await page.evaluate(() => scrollTo(0, 0));
}

export async function pressContrast(page, target) {
  const el = await page.$(target).catch(() => null);
  if (!el) return { pass: false, why: 'target missing', boxes: 0 };
  const scope = await el.evaluate(el => {
    if (!el.closest('main.pr-home')) return 'outside';
    if (el.closest('[aria-hidden="true"]') && !el.closest('a,button,input,select,textarea')) return 'decorative';
    if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return 'hidden';
    return 'text';
  });
  if (scope === 'outside') return { pass: false, why: 'outside Press content', boxes: 0 };
  if (scope !== 'text') return { pass: true, why: scope, boxes: 0 };
  await el.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 100));
  const boxes = await el.evaluate(el => {
    const boxes = [], walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode, parent = node.parentElement;
      if (!node.textContent.trim() || !parent.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})) continue;
      // Screen-reader-only text has glyph ranges but no painted glyphs inside its 1px clip.
      let clipped=false;
      for(let ancestor=parent;ancestor;ancestor=ancestor.parentElement){
        const c=getComputedStyle(ancestor),r=ancestor.getBoundingClientRect();
        if((c.clip!=='auto'||c.clipPath==='inset(50%)') && r.width<=1 && r.height<=1){clipped=true;break;}
      }
      if(clipped)continue;
      const c = getComputedStyle(parent), range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        const x = Math.ceil(Math.max(0,r.left)), y = Math.ceil(Math.max(0,r.top));
        const w = Math.floor(Math.min(innerWidth,r.right))-x, h = Math.floor(Math.min(innerHeight,r.bottom))-y;
        if (w < 2 || h < 2) continue;
        const rgba=c.color.match(/[\d.]+/g).map(Number);
        let alpha=rgba[3] ?? 1;
        for(let ancestor=parent;ancestor;ancestor=ancestor.parentElement)alpha*=Number(getComputedStyle(ancestor).opacity);
        boxes.push({x,y,w,h,rgb:rgba.slice(0,3),alpha,min:parseFloat(c.fontSize)>=24 || (parseFloat(c.fontSize)>=18.66 && Number(c.fontWeight)>=700) ? 3 : 4.5});
      }
    }
    return boxes;
  });
  if (!boxes.length) return { pass:false, why:'no visible text measured', boxes:0 };
  const saved = await el.evaluate(el => [el,...el.querySelectorAll('*')].map(node => {
    const style = node.getAttribute('style');
    node.style.setProperty('color','transparent','important');
    node.style.setProperty('-webkit-text-fill-color','transparent','important');
    node.style.setProperty('text-decoration-color','transparent','important');
    return style;
  }));
  let png;
  try { png = await page.screenshot({encoding:'base64'}); }
  finally { await el.evaluate((el,saved)=>[el,...el.querySelectorAll('*')].forEach((node,i)=>saved[i]===null?node.removeAttribute('style'):node.setAttribute('style',saved[i])),saved); }
  const ratios = await page.evaluate(async ({png,boxes}) => {
    const bitmap = await createImageBitmap(new Blob([Uint8Array.from(atob(png), c => c.charCodeAt(0))], {type:'image/png'}));
    const canvas = new OffscreenCanvas(bitmap.width,bitmap.height), ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0);
    const pixels=ctx.getImageData(0,0,bitmap.width,bitmap.height).data;
    const linear=v=>(v/=255)<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;
    const lum=rgb=>.2126*linear(rgb[0])+.7152*linear(rgb[1])+.0722*linear(rgb[2]);
    const scale=bitmap.width/innerWidth;
    return boxes.map(({x,y,w,h,rgb,alpha,min})=>{
      const values=[];
      for(let yy=Math.ceil(y*scale);yy<Math.min(bitmap.height,(y+h)*scale);yy++)for(let xx=Math.ceil(x*scale);xx<Math.min(bitmap.width,(x+w)*scale);xx++){
        const i=(yy*bitmap.width+xx)*4,bgRgb=[pixels[i],pixels[i+1],pixels[i+2]];
        const bg=lum(bgRgb),fg=lum(rgb.map((v,i)=>v*alpha+bgRgb[i]*(1-alpha)));
        values.push((Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05));
      }
      values.sort((a,b)=>a-b);
      return {ratio:values[Math.floor(values.length*.02)],min};
    });
  },{png,boxes});
  return {pass:ratios.every(r=>r.ratio>=r.min),why:ratios.map(r=>`${r.ratio.toFixed(2)}:1/${r.min}`).join(', '),boxes:boxes.length};
}

export async function provePressContrast(browser) {
  const page=await browser.newPage();
  try {
    await page.setContent('<main class="pr-home"><p id="copy">Contrast specimen</p><span aria-hidden="true" id="decor">→</span></main><p id="outside">Outside</p>');
    await page.$eval('#copy',el=>{el.style.color='black';el.style.background='white';});
    const good=await pressContrast(page,'#copy');
    if(!good.pass||!good.boxes)throw new Error('Press contrast proof: readable specimen not measured');
    await page.$eval('#copy',el=>{const span=document.createElement('span');span.textContent='Screen-reader-only specimen';Object.assign(span.style,{position:'absolute',width:'1px',height:'1px',clip:'rect(0px, 0px, 0px, 0px)',overflow:'hidden',color:'white'});el.append(span);});
    const clipped=await pressContrast(page,'#copy');
    if(!clipped.pass||clipped.boxes!==good.boxes)throw new Error('Press contrast proof: clipped text incorrectly measured');
    await page.$eval('#copy span',el=>{el.style.clip='auto';el.style.clipPath='inset(50%)';});
    const clipPath=await pressContrast(page,'#copy');
    if(!clipPath.pass||clipPath.boxes!==good.boxes)throw new Error('Press contrast proof: clip-path text incorrectly measured');
    await page.$eval('#copy span',el=>el.remove());
    await page.$eval('#copy',el=>{el.style.color='white';});
    if((await pressContrast(page,'#copy')).pass)throw new Error('Press contrast proof: 1:1 specimen escaped');
    await page.$eval('#copy',el=>{el.style.color='black';el.style.opacity='.5';});
    if((await pressContrast(page,'#copy')).pass)throw new Error('Press contrast proof: translucent low contrast escaped');
    await page.$eval('#copy',el=>{el.style.opacity='0';});
    const hidden=await pressContrast(page,'#copy');
    if(hidden.why!=='hidden'||hidden.boxes!==0)throw new Error('Press contrast proof: hidden count did not reach zero');
    if((await pressContrast(page,'#outside')).pass||(await pressContrast(page,'#missing')).pass)throw new Error('Press contrast proof: out-of-scope/missing specimen escaped');
    if((await pressContrast(page,'#decor')).why!=='decorative')throw new Error('Press contrast proof: decoration misclassified');
    console.log('Press pixel contrast: readable, 1:1/opacity failures, zero hidden count, outside, missing and decorative specimens PASS');
  } finally { await page.close(); }
}

/** Inspect visible illustrative text too: aria-hidden does not make a painted flag readable. */
export async function checkPressFlags(browser, base) {
  const selector = '.pr-desk:has(#pr-desk-edit:checked) :is(.pr-d-flag, .pr-d-ins)';
  const copy = ['Reason first?', 'Split this sentence'];
  const nativePoses = (poses, from) => assert.equal(new Set(poses).size, 6, `${from}: paused transition fractions did not produce six distinct native poses`);
  const whole = samples => {
    assert(samples.length, 'Press flags: no visible animation-frame subjects');
    assert(samples.every(s => s.opacity === 1), 'Press flags: fractional painted opacity');
  };
  assert.throws(() => whole([]), /no visible/);
  assert.throws(() => whole([{ opacity: .3 }]), /fractional/);
  let minimum = Infinity, boxes = 0;
  for (const [width, height, mode] of [[412, 823, 'motion'], [1440, 900, 'motion'],
    [412, 823, 'reduced'], [412, 823, 'no-JS']]) {
    const page = await browser.newPage();
    try {
      await page.setCacheEnabled(false);
      await page.setViewport({ width, height, deviceScaleFactor: width === 412 && mode === 'motion' ? 1.75 : 1 });
      await page.setCookie({ name: 'gs_consent', value: '1', url: base });
      if (mode === 'reduced') await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      if (mode === 'no-JS') await page.setJavaScriptEnabled(false);
      if (mode !== 'no-JS') {
        await page.evaluateOnNewDocument(labelOpacitySamples, selector, true);
        await page.evaluateOnNewDocument(() => {
          window.__pressAnnotationSamples = [];
          const frame = () => {
            for (const e of document.querySelectorAll('.pr-d-ins, .pr-d-ms-tag')) {
              if (e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))
                window.__pressAnnotationSamples.push({ opacity: Number(getComputedStyle(e).opacity), text: e.textContent.trim() });
            }
            requestAnimationFrame(frame);
          };
          frame();
        });
      }
      assert.equal((await page.goto(base + '/press', { waitUntil: 'networkidle0' })).status(), 200);
      assert.deepEqual(await page.$$eval('.pr-d-flag', es => es.map(e => e.textContent)), copy, 'Press flag subjects changed');
      assert.equal(await page.$eval('.pr-d-ins', e => e.textContent), 'your');
      if (mode === 'motion') {
        await page.$eval('.pr-desk', e => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await new Promise(r => setTimeout(r, 4200));
        whole(await page.evaluate(() => window.__labelContrastSamples));
        const annotations = await page.evaluate(() => window.__pressAnnotationSamples);
        // This guards each annotation's own fade; Edit pixels below include ancestor effects.
        assert(annotations.every(s => s.opacity === 1), 'Press annotation own-opacity fade');
        assert.deepEqual([...new Set(annotations.map(s => s.text))].sort(), ['Edited manuscript', 'your'], 'annotation sampler missed a stage');
        // Scroll out and back through the real IntersectionObserver lifecycle.
        await page.$eval('#editing', e => e.scrollIntoView({ behavior: 'instant' }));
        await new Promise(r => setTimeout(r, 100));
        await page.$eval('.pr-desk', e => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await new Promise(r => setTimeout(r, 1200));
        whole(await page.evaluate(() => window.__labelContrastSamples));
        await page.click('.pr-desk-loop');
        assert.equal(await page.$eval('.pr-desk-loop', e => e.getAttribute('aria-pressed')), 'true');
        // The shared glyph decoder uses CSS pixels; lifecycle above uses CI's phone scale.
        await page.setViewport({ width, height, deviceScaleFactor: 1 });
      } else {
        assert.equal(await page.$eval('[name="pr-desk"]:checked', e => e.value), 'publish');
        assert.deepEqual(await page.evaluate(labelOpacitySamples, '.pr-d-flag'), [], `${mode}: initial Publish flags must be absent`);
        await page.$eval('.pr-desk', e => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
      }
      const measure = async context => {
        const appearance = await page.$$eval(selector, es => es.map(e => {
          const ancestors = [];
          for (let a = e; a; a = a.parentElement) ancestors.push(getComputedStyle(a).filter);
          return { visible: e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }), ancestors };
        }));
        assert(appearance.every(e => e.visible && e.ancestors.every(f => f === 'none')), `${context}: flags hidden or filtered`);
        whole(await page.evaluate(labelOpacitySamples, selector));
        const result = await renderedLabelContrast(page, selector);
        assert.deepEqual(result.failures, [], `${context}: ${result.failures.join('; ')}`);
        assert.equal(result.boxes, 3, `${context}: both flags and insertion must supply painted glyphs`);
        minimum = Math.min(minimum, result.min); boxes += result.boxes;
        console.log(`Press flags ${width}px ${mode} ${context}: ${result.min.toFixed(2)}:1, ${result.boxes} glyph boxes`);
      };
      // Freeze actual CSS transition timelines at known fractions, never wait away a fade.
      for (const from of ['write', 'publish']) {
        await page.$eval(`#pr-desk-${from}`, e => {
          e.checked = true;
          getComputedStyle(document.querySelector('.pr-d-ms')).getPropertyValue('transform');
          document.getAnimations().forEach(a => a.finish());
        });
        await page.$eval('#pr-desk-edit', e => { e.checked = true; getComputedStyle(document.querySelector('.pr-d-ms')).getPropertyValue('transform'); });
        const moving = await page.evaluate(async () => {
          const animations = document.querySelector('.pr-d-ms').getAnimations();
          animations.forEach(a => a.pause());
          await Promise.all(animations.map(a => a.ready));
          return animations.length;
        });
        if (mode === 'motion') assert(moving > 0, `${from}: manuscript geometry no longer moves`);
        const poses = [];
        for (const fraction of mode === 'motion' ? [0, .05, .25, .5, .75, 1] : [1]) {
          await page.evaluate(fraction => {
            document.querySelector('.pr-d-ms').getAnimations().forEach(a => { a.currentTime = Number(a.effect.getTiming().duration) * fraction; });
          }, fraction);
          poses.push(await page.$eval('.pr-d-ms', e => JSON.stringify(e.getBoundingClientRect().toJSON())));
          await measure(`${from}→edit ${fraction}`);
        }
        if (mode === 'motion') {
          nativePoses(poses, from);
          assert.throws(() => nativePoses(poses.map(() => poses[0]), from), /six distinct native poses/);
        }
        for (const to of ['produce', 'publish']) {
          await page.$eval(`#pr-desk-${to}`, e => { e.checked = true; });
          assert.deepEqual(await page.evaluate(labelOpacitySamples, '.pr-d-flag'), [], `edit→${to}: flags remain painted`);
          await page.$eval('#pr-desk-edit', e => { e.checked = true; document.getAnimations().forEach(a => a.finish()); });
        }
      }
      if (mode === 'motion') {
        const insertion = await page.$eval('.pr-d-ins', e => { const text = e.textContent; e.textContent = ''; return text; });
        try {
          assert.equal(await page.$eval('.pr-d-ins', e => e.textContent), '', 'missing annotation specimen was inert');
          await assert.rejects(() => measure('missing insertion specimen'), /both flags and insertion/, 'missing required glyph escaped');
        } finally { await page.$eval('.pr-d-ins', (e, text) => { e.textContent = text; }, insertion); }
        const screenshot = page.screenshot.bind(page);
        const manuscriptStyle = await page.$eval('.pr-d-ms', e => e.getAttribute('style'));
        page.screenshot = async options => { await page.$eval('.pr-d-ms', e => { e.style.translate = '30cqw 1cqw'; e.style.transition = 'none'; }); return screenshot(options); };
        try {
          await assert.rejects(() => measure('moved manuscript specimen'), /text\/background capture state moved/, 'mismatched manuscript geometry escaped');
        } finally {
          page.screenshot = screenshot;
          await page.$eval('.pr-d-ms', (e, style) => {
            if(style === null)e.removeAttribute('style');else e.setAttribute('style', style);
            getComputedStyle(e).getPropertyValue('translate');
            document.getAnimations().forEach(a => a.finish());
          }, manuscriptStyle);
        }
        // Real degraded flag specimens must fail the same pixel assertion, despite aria-hidden.
        for (const css of [`.pr-d-flag{color:var(--pr-gold-bright)!important}`, '.pr-d-ms{opacity:.3!important}', '.pr-d-ins{opacity:.3!important}']) {
          const style = await page.addStyleTag({ content: css });
          try {
            const bad = await renderedLabelContrast(page, selector);
            assert(bad.failures.some(f => f.includes('needs 5:1')), 'Press flag low-contrast specimen escaped');
            assert.equal(bad.boxes, 3, 'degraded annotations were not measured');
            if (css.includes('opacity')) {
              const faded = await page.evaluate(labelOpacitySamples, selector);
              assert.throws(() => whole(faded), /fractional/);
            }
          } finally { await style.evaluate(e => e.remove()); }
        }
        const filtered = await page.addStyleTag({ content: '.pr-d-ms{filter:brightness(.3)!important}' });
        try {
          assert.equal((await page.evaluate(labelOpacitySamples, selector)).length, 3, 'filtered specimen is not visible');
          await assert.rejects(() => measure('filtered specimen'), /flags hidden or filtered/);
        } finally { await filtered.evaluate(e => e.remove()); }
      }
      await page.$eval('#pr-desk-write', e => { e.checked = true; document.getAnimations().forEach(a => a.finish()); });
      await page.focus('#pr-desk-write'); await page.keyboard.press('ArrowRight');
      assert.equal(await page.$eval('[name="pr-desk"]:checked', e => e.value), 'edit', 'keyboard did not select Edit');
      assert(await page.$eval('label[for="pr-desk-edit"]', e => {
        const c = getComputedStyle(e); return c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) >= 2;
      }), 'Edit keyboard focus outline missing');
      await page.evaluate(() => document.getAnimations().forEach(a => a.finish()));
      await measure('keyboard Edit');
      const flags = await renderedLabelContrast(page, '.pr-d-flag');
      assert.deepEqual(flags.failures, [], 'settled flag contrast');
      assert.equal(flags.boxes, 2, 'settled flags not both painted');
      console.log(`Press flags alone ${width}px ${mode}: ${flags.min.toFixed(2)}:1`);
    } finally { await page.close(); }
  }
  console.log(`Press flags PASS: ${boxes} painted glyph boxes, minimum ${minimum.toFixed(2)}:1; initial/hydrated, lifecycle, transition timelines, reduced-motion, native no-JS and keyboard`);
}
