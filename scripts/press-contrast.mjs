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
