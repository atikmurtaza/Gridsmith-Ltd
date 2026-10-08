import { readFileSync } from 'node:fs';

/** Pixel backgrounds and composed foregrounds for moving text; callers own the interaction state. */
export async function renderedLabelContrast(page, selector) {
  const read = () => page.evaluate((selector) => {
    const boxes = [];
    for (const root of document.querySelectorAll(selector)) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode, el = node.parentElement;
        if (!node.textContent.trim() || el.closest('.sr-only') || !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
        const style = getComputedStyle(el);
        let opacity = 1;
        for (let a = el; a; a = a.parentElement) opacity *= Number(getComputedStyle(a).opacity);
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) {
          const box = [Math.max(0, Math.ceil(rect.left)), Math.max(0, Math.ceil(rect.top)), Math.min(innerWidth, Math.floor(rect.right)), Math.min(innerHeight, Math.floor(rect.bottom))];
          if (box[2] - box[0] < 2 || box[3] - box[1] < 2 || opacity === 0) continue;
          boxes.push({ box, rgb: style.color.match(/[\d.]+/g).slice(0, 3).map(Number), opacity, text: node.textContent.trim().slice(0, 45) });
        }
      }
    }
    return { boxes, scroll: [scrollX, scrollY], viewport: [innerWidth, innerHeight] };
  }, selector);
  const before = await read();
  const frames = [];
  for (const color of ['transparent', 'black', 'white']) {
    const style = await page.addStyleTag({ content: `${selector}, ${selector} * { -webkit-text-fill-color: ${color} !important; text-decoration-color: transparent !important; }` });
    try { frames.push(await page.screenshot({ encoding: 'base64', captureBeyondViewport: false })); }
    finally { await style.evaluate(el => el.remove()); }
  }
  const after = await read();
  const failures = [];
  if (before.boxes.length !== after.boxes.length || before.boxes.some((b, i) => {
    const a = after.boxes[i];
    return !a || b.text !== a.text || b.opacity !== a.opacity || b.box.some((v, j) => Math.abs(v - a.box[j]) > 1);
  }) || before.scroll.some((v, i) => Math.abs(v - after.scroll[i]) > 1)) {
    failures.push('text/background capture state moved');
    console.log('capture mismatch', JSON.stringify({ scrollBefore: before.scroll, scrollAfter: after.scroll, boxesBefore: before.boxes.map(b => [b.box, b.opacity]), boxesAfter: after.boxes.map(b => [b.box, b.opacity]) }));
  }
  if (!before.boxes.length) failures.push('no visible text boxes measured');
  const decoder = await page.browser().newPage();
  let readings;
  try {
    readings = await decoder.evaluate(async (frames, boxes) => {
      const pixels = [];
      for (const png of frames) {
        const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${png}`)).blob());
        const canvas = new OffscreenCanvas(img.width, img.height), ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        pixels.push({ data: ctx.getImageData(0, 0, img.width, img.height).data, width: img.width });
      }
      const lin = v => (v /= 255) <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
      const lum = rgb => .2126 * lin(rgb[0]) + .7152 * lin(rgb[1]) + .0722 * lin(rgb[2]);
      return boxes.map(({ box: [x0, y0, x1, y1], rgb, opacity, text }) => {
        const ratios = [];
        for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
          const i = (y * pixels[0].width + x) * 4;
          if (Math.max(...[0, 1, 2].map(c => Math.abs(pixels[2].data[i + c] - pixels[1].data[i + c]))) < 32) continue;
          const bg = [0, 1, 2].map(c => pixels[0].data[i + c]);
          const fg = rgb.map((c, j) => c * opacity + bg[j] * (1 - opacity));
          const a = lum(fg), b = lum(bg);
          ratios.push((Math.max(a, b) + .05) / (Math.min(a, b) + .05));
        }
        ratios.sort((a, b) => a - b);
        return { text, opacity, pixels: ratios.length, ratio: ratios[Math.floor(ratios.length * .02)] ?? null };
      });
    }, frames, before.boxes);
  } finally { await decoder.close(); }
  for (const row of readings) {
    if (row.opacity !== 1) failures.push(`"${row.text}" painted at ${row.opacity} opacity`);
    if (row.ratio !== null && row.ratio < 5) failures.push(`"${row.text}" ${row.ratio.toFixed(2)}:1, needs 5:1 safety margin`);
  }
  const measured = readings.filter(r => r.ratio !== null);
  if (!measured.length) failures.push('no painted glyph pixels measured');
  return { failures, boxes: measured.length, min: Math.min(...measured.map(r => r.ratio)) };
}

/** Every animation frame must keep visible text whole; a settled-only contrast check misses fades. */
export const labelOpacitySamples = (selector, monitor = false) => {
  const read = () => {
  const rows = [];
  for (const el of document.querySelectorAll(selector)) {
    if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
    let opacity = 1;
    for (let a = el; a; a = a.parentElement) opacity *= Number(getComputedStyle(a).opacity);
    if (opacity > 0) rows.push({ opacity, text: el.textContent.trim().slice(0, 45) });
  }
  return rows;
  };
  if (!monitor) return read();
  window.__labelContrastSamples = [];
  const frame = () => {
    window.__labelContrastSamples.push(...read());
    requestAnimationFrame(frame);
  };
  frame();
};

export async function proveLabelContrast(browser) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 400, height: 200 });
    await page.setContent('<style>body{background:var(--digital-dark);color:var(--digital-ink-dark);font:16px Arial}p{background:var(--digital-dark-raised)}</style><body data-division="digital"><p>Permanent rendered contrast specimen</p></body>');
    await page.addStyleTag({ content: readFileSync('styles/themes/digital-stage.css', 'utf8') });
    const good = await renderedLabelContrast(page, 'p');
    if (good.failures.length || good.boxes === 0) throw new Error('contrast specimen did not measure readable glyphs');
    for (const [css, expected] of [['p{color:var(--digital-dark-raised)}', 'needs 5:1'], ['body{opacity:.3}', 'painted at'], ['p{display:none}', 'no visible text']]) {
      const style = await page.addStyleTag({ content: css });
      const bad = await renderedLabelContrast(page, 'p');
      const samples = await page.evaluate(labelOpacitySamples, 'p');
      if (expected === 'painted at' && !samples.some(s => s.opacity === .3)) throw new Error('opacity sampler did not reach faded text');
      if (expected === 'no visible text' && samples.length !== 0) throw new Error('opacity sampler count did not reach zero');
      await style.evaluate(el => el.remove());
      if (!bad.failures.some(f => f.includes(expected))) throw new Error(`contrast proof did not fire: ${expected}`);
    }
    const screenshot = page.screenshot.bind(page);
    page.screenshot = async options => {
      await page.$eval('p', el => { el.style.marginTop = '50px'; });
      return screenshot(options);
    };
    const moved = await renderedLabelContrast(page, 'p');
    page.screenshot = screenshot;
    if (!moved.failures.includes('text/background capture state moved')) throw new Error('capture movement proof did not fire');
    console.log('rendered contrast: readable glyphs, low contrast, ancestor opacity, zero count and moved capture proven');
  } finally { await page.close(); }
}
