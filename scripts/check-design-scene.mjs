/** GS-R002 rendered invariants. This measures geometry, visibility, progression and accessibility;
 * it does not claim that a class name or passing test establishes aesthetic acceptance.
 * --prove injects reversible browser-only faults and requires the corresponding assertion to fail.
 */
import { launch } from "./browser-launch.mjs";
import { AxePuppeteer } from "@axe-core/puppeteer";
import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, basename } from "node:path";
import { createHash } from "node:crypto";
import { gOutlines, sOutlines } from "../components/divisions/design/letterGeometry.ts";
import {
  buildingCurves as BUILDING_CURVES,
  markCurves as MARK_CURVES,
  mascotCurves as MASCOT_CURVES,
} from "../components/divisions/design/transitionGeometry.ts";
import { HANDOFF } from "../components/divisions/design/designTimeline.ts";

// Captured from the owner-approved numeric arrays before lossless compaction.
if (createHash("sha256").update(JSON.stringify([gOutlines, sOutlines])).digest("hex") !==
    "77af7f2d53d86cce8b866a34eca1743c46ea80bc1390b1f21b5ac971a28f31a4")
  throw new Error("Approved G/S coordinates changed");

const base = process.env.AXE_BASE_URL ?? "http://127.0.0.1:3000";
const axeSource = readFileSync(
  createRequire(import.meta.url).resolve("axe-core/axe.min.js"),
  "utf8",
);
const sizes = [
  [768, 1024],
  [1024, 768],
  [760, 800],
  [761, 800],
  [900, 700],
  [1280, 720],
  [1366, 768],
  [1440, 900],
  [1536, 864],
  [1600, 900],
  [1920, 1080],
  [2048, 1152],
  [2560, 1440],
  [1229, 691],
  [1745, 982],
  [2133, 1200],
  [2400, 1350],
  [2844, 1600],
  [3200, 1800],
  [320, 568],
  [360, 800],
  [375, 812],
  [390, 844],
  [412, 915],
  [430, 932],
];
const browser = await launch();
const decoder = await browser.newPage();
const errors = [];
const out = process.env.DESIGN_SCREENSHOTS;
if (out) mkdirSync(out, { recursive: true });
const pause = () => new Promise((r) => setTimeout(r, 650));
const choreographyChunk = readdirSync(".next/static/chunks", {
  recursive: true,
})
  .filter((f) => f.endsWith(".js"))
  .find((f) =>
    readFileSync(join(".next/static/chunks", f), "utf8").includes(
      "data-workspace-controls",
    ),
  );
if (!choreographyChunk) throw new Error("Design choreography chunk missing");

// Like Master's scene gate: measure the background pixels after hiding only glyphs.
// The worst 2% of a text box is ignored for antialiasing and thin construction lines.
// `hide` names the glyphs made transparent for the background shot; it must cover `selector`'s text.
async function textContrast(page, { selector = ".ds-copy,.ds-stage-label", hide = ".ds-copy *,.ds-stage-label *", report = false } = {}) {
  // Let scrolling and media-query layout reach the compositor before pairing DOM
  // rectangles with screenshot pixels (especially reduced motion on Linux).
  await pause();
  const boxes = await page.evaluate((selector) => {
    const out = [];
    for (const root of document.querySelectorAll(selector)) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode,
          el = node.parentElement;
        if (
          !node.textContent.trim() ||
          !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) ||
          (el.closest("details:not([open])") && !el.closest("summary"))
        )
          continue;
        const c = getComputedStyle(el),
          range = document.createRange();
        range.selectNodeContents(node);
        // Range rectangles include unpainted text outside a scrolling panel.
        // Intersect with its ancestor scrollports before sampling screenshot pixels.
        const clip = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
        for (let ancestor = el; ancestor; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor), rect = ancestor.getBoundingClientRect();
          if (/auto|scroll|hidden|clip/.test(style.overflowX)) {
            clip.left = Math.max(clip.left, rect.left + ancestor.clientLeft);
            clip.right = Math.min(clip.right, rect.left + ancestor.clientLeft + ancestor.clientWidth);
          }
          if (/auto|scroll|hidden|clip/.test(style.overflowY)) {
            clip.top = Math.max(clip.top, rect.top + ancestor.clientTop);
            clip.bottom = Math.min(clip.bottom, rect.top + ancestor.clientTop + ancestor.clientHeight);
          }
        }
        for (const r of range.getClientRects()) {
          const left = Math.ceil(Math.max(r.left, clip.left)),
            top = Math.ceil(Math.max(r.top, clip.top)),
            right = Math.floor(Math.min(r.right, clip.right)),
            bottom = Math.floor(Math.min(r.bottom, clip.bottom));
          if (
            right <= left ||
            bottom <= top ||
            c.display === "none"
          )
            continue;
          out.push({
            box: [
              left,
              top,
              right - left,
              bottom - top,
            ],
            // A mixed colour computes to `color(srgb r g b)` with channels in 0–1, not bytes in 0–255:
            // read as bytes it is near-black, and the label on navy measured 1.19:1 (GS-DES-002-R1).
            rgb: c.color
              .match(/[\d.]+/g)
              .slice(0, 3)
              .map((v) => (c.color.startsWith("color(srgb") ? 255 * v : Number(v))),
            text: node.textContent.trim().slice(0, 48),
            min:
              parseFloat(c.fontSize) >= 24 ||
              (parseFloat(c.fontSize) >= 18.66 && Number(c.fontWeight) >= 700)
                ? 3
                : 4.5,
          });
        }
      }
    }
    return out;
  }, selector);
  if (!boxes.length) return ["No rendered text boxes measured"];
  const style = await page.addStyleTag({
    content: `${hide}{color:transparent!important;text-decoration-color:transparent!important;-webkit-text-fill-color:transparent!important}`,
  });
  const png = await page.screenshot({ encoding: "base64", captureBeyondViewport: false });
  await style.evaluate((el) => el.remove());
  return decoder.evaluate(
    async (png, boxes, report) => {
      const img = await createImageBitmap(
        await (await fetch(`data:image/png;base64,${png}`)).blob(),
      );
      const canvas = new OffscreenCanvas(img.width, img.height),
        ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const { data, width, height } = ctx.getImageData(
        0,
        0,
        img.width,
        img.height,
      );
      const lin = (v) =>
        (v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      const lum = (rgb) =>
        0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
      return boxes.flatMap(({ box: [x, y, w, h], rgb, text, min }) => {
        const values = [];
        for (let yy = Math.max(0, y); yy < Math.min(height, y + h); yy++)
          for (let xx = Math.max(0, x); xx < Math.min(width, x + w); xx++) {
            const i = (yy * width + xx) * 4;
            values.push(lum([data[i], data[i + 1], data[i + 2]]));
          }
        values.sort((a, b) => a - b);
        const fg = lum(rgb),
          bg = values[Math.floor(values.length * (fg > 0.5 ? 0.98 : 0.02))];
        const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
        if (report) return [{ text, ratio, min, measured: values.length > 0 }];
        return !values.length || ratio < min
          ? [`pixel contrast ${text}: ${ratio.toFixed(2)}:1; needs ${min}`]
          : [];
      });
    },
    png,
    boxes,
    report,
  );
}

async function open(
  width,
  height,
  {
    reduced = false,
    js = true,
    limited = false,
    lowMemory = false,
    failedImport = false,
    touch = false,
    mutate = null,
    block = null,
  } = {},
) {
  const page = await browser.newPage();
  if (block) {
    // Off the cache too: an earlier page in this browser already holds the image, and a cached image
    // never reaches interception — the first run of this proof blocked nothing and read as a pass.
    await page.setCacheEnabled(false);
    await page.setRequestInterception(true);
    page.on("request", (request) => (request.url().includes(block) ? request.abort() : request.continue()));
  }
  if (mutate) {
    // A proof serves the choreography changed in the browser only: no file is written, so there is
    // nothing to restore. An edit that matches nothing is not a probe, and says so.
    const original = readFileSync(join(".next/static/chunks", choreographyChunk), "utf8");
    const changed = mutate(original);
    if (changed === original) throw new Error("INERT proof: the mutation matched nothing in the choreography chunk");
    await page.setRequestInterception(true);
    page.on("request", (request) =>
      request.url().includes(basename(choreographyChunk))
        ? request.respond({ status: 200, contentType: "application/javascript; charset=utf-8", body: changed })
        : request.continue(),
    );
  }
  await page.evaluateOnNewDocument(() => {
    window.__designLayoutShift = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) window.__designLayoutShift += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  if (failedImport) {
    await page.setRequestInterception(true);
    page.on("request", (request) =>
      request.url().includes(basename(choreographyChunk))
        ? request.abort()
        : request.continue(),
    );
  }
  await page.setViewport({
    width,
    height,
    deviceScaleFactor: 1,
    hasTouch: touch,
  });
  await page.setCookie({ name: "gs_consent", value: "1", url: base });
  if (reduced)
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
  if (!js) await page.setJavaScriptEnabled(false);
  if (lowMemory)
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "deviceMemory", {
        value: 1,
        configurable: true,
      });
    });
  if (limited)
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "connection", {
        value: { saveData: true },
        configurable: true,
      });
    });
  page.on("pageerror", (e) => errors.push(`Browser: ${e.message}`));
  const response = await page.goto(`${base}/design`, {
    waitUntil: "networkidle0",
  });
  if (![200, 304].includes(response?.status()))
    throw new Error(`Design HTTP ${response?.status()}`);
  if (js && !reduced && !limited && !lowMemory && !failedImport)
    await page.waitForSelector("[data-enhanced]", { timeout: 10000 });
  if (js && (reduced || limited || lowMemory || failedImport))
    await page.waitForSelector("[data-static]");
  return page;
}
/**
 * GS-DES-002-R1: progress is mapped onto where the copy actually settles and leaves, so a position is
 * found through the renderer's own published map (`data-map`: settle, leave for each chapter) — the
 * inverse of its piecewise scale, read, not re-derived.
 */
async function seek(page, pos) {
  // GS-DES-002-RC: the map is republished by a ResizeObserver a frame after layout changes (a
  // disclosure closing just before a seek). Reading it first seeked on the stale map — G1 at 320x568
  // computed y 1700 for 2.15, which the settled map reads as 2.47, and the wait below timed out.
  await page.evaluate(async () => {
    const read = () => document.querySelector("[data-design-stage]").dataset.map;
    const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
    let before;
    do { before = read(); await frame(); await frame(); } while (read() !== before);
  });
  await page.evaluate(({ pos, H }) => {
    const m = document.querySelector("[data-design-stage]").dataset.map.split(",").map(Number);
    const i = Math.min(4, Math.floor(pos)), fr = pos - i;
    const y = fr < H ? m[2 * i] + (fr / H) * (m[2 * i + 1] - m[2 * i]) : m[2 * i + 1] + ((fr - H) / (1 - H)) * ((m[2 * i + 2] ?? m[2 * i + 1]) - m[2 * i + 1]);
    window.scrollTo(0, y);
  }, { pos, H: HANDOFF });
  await pause();
  await page.waitForFunction(
    (pos) => Math.abs(Number(document.querySelector("[data-design-stage]")?.dataset.progress) - pos) < 0.015,
    { timeout: 10000 },
    Math.min(Math.max(0, pos), 4 + HANDOFF),
  ).catch(async (error) => {
    const at = await page.evaluate(() => ({ progress: document.querySelector("[data-design-stage]")?.dataset.progress, map: document.querySelector("[data-design-stage]")?.dataset.map, scrollY, size: `${innerWidth}x${innerHeight}`, open: [...document.querySelectorAll("details[open]")].length }));
    throw new Error(`seek ${pos}: ${error.message} — ${JSON.stringify(at)}`);
  });
}
async function measure(page, { hero = false, expected } = {}) {
  return page.evaluate(
    ({ hero, expected }) => {
      const failures = [];
      const root = document.querySelector("[data-design-story]");
      const stage = document.querySelector("[data-design-stage]");
      const visible = (el) => {
        if (!el) return false;
        let p = el;
        while (p && p !== document.body) {
          const c = getComputedStyle(p);
          if (
            c.display === "none" ||
            c.visibility === "hidden" ||
            +c.opacity < 0.05
          )
            return false;
          p = p.parentElement;
        }
        const r = el.getBoundingClientRect();
        return (
          r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < innerHeight
        );
      };
      if (document.documentElement.scrollWidth > innerWidth + 1)
        failures.push("overflow");
      if (!root || root.querySelectorAll("[data-chapter]").length !== 5)
        failures.push("chapters");
      if (
        !visible(stage) ||
        stage.getAttribute("aria-hidden") !== "true" ||
        stage.querySelector("a,button,[tabindex]")
      )
        failures.push("scene");
      if (hero) {
        if (
          root.querySelector('[data-chapter="0"]').offsetHeight >
          innerHeight * (innerWidth > 760 ? 1.3 : 1.4)
        )
          failures.push("hero-distance");
        const h = document.querySelector("h1"),
          cta = document.querySelector("[data-design-cta]");
        const r = h?.getBoundingClientRect();
        const c = cta?.getBoundingClientRect();
        if (
          !r ||
          r.left < 0 ||
          r.right > innerWidth ||
          r.top < 0 ||
          r.bottom > innerHeight
        )
          failures.push("headline");
        if (!visible(cta) || !c || c.top < 0 || c.bottom > innerHeight)
          failures.push("cta");
      }
      if (expected && !visible(stage.querySelector(expected)))
        failures.push("protagonist");
      if (
        stage.querySelectorAll('[data-art="technical"] [data-storey]')
          .length !== 4
      )
        failures.push("storeys");
      const active = Number(root.dataset.active);
      if (
        expected?.startsWith("[data-art=") &&
        !visible(
          root.querySelector(
            `[data-chapter="${active}"] h1,[data-chapter="${active}"] h2`,
          ),
        )
      )
        failures.push("chapter-copy");
      return {
        failures,
        path: stage?.querySelector("[data-thread]")?.getAttribute("d"),
        state: stage?.dataset.progress,
        links: [...root.querySelectorAll('a[href*="/design/services/"]')]
          .length,
      };
    },
    { hero, expected },
  );
}

async function pageHeading(page, label) {
  const tree = await page.accessibility.snapshot({ interestingOnly: false });
  const headings = [];
  const walk = node => {
    if (node.role === "heading" && node.level === 1) headings.push(node.name);
    node.children?.forEach(walk);
  };
  if (tree) walk(tree);
  if (headings.length !== 1 || headings[0].replace(/\s+/g, " ").trim() !== "From line to form.")
    errors.push(`${label}: expected one accessible original page H1, found ${JSON.stringify(headings)}`);
  if (await page.$$eval('h1', headings => headings.length) !== 1)
    errors.push(`${label}: duplicate/missing DOM H1`);
}


/* ==== GS-DES-002-R1 — continuous page flow, the 3D payoff, the footer glide ======================
 *
 * The owner's R1 review: content waited for the animation and the chapters blinked; the resolved logo
 * was a flat mark with drawn-on shading; the final mark jumped down into the footer. The timeline's
 * rhythm is asserted as data by `check-design-timeline.selftest`; these ask the served page, from
 * positions and pixels, whether the page now behaves like one.
 *
 * | Key | Question |
 * |---|---|
 * | dwell | Each chapter's copy holds still, settled, for at least a quarter of the screen of scroll (the renderer's own map). |
 * | content-flow | Through each handoff the copy moves with the scroll, 1:1 — it is page content, not a fading layer. |
 * | overlap | In each handoff there is a moment where the current copy is leaving, the next is arriving and the scene is mid-change. |
 * | no-blink | Through each handoff at least one copy is substantially on screen, and no copy is faded. |
 * | label-fade | (RC) Through each handoff the stage caption, when on screen, is whole or hidden — never held part-faded by the scroll. |
 * | payoff-3d | At the Brand and final payoffs the supplied 3D logo is on, aligned over the exact geometry, and rendered (it changes the pixels). |
 * | payoff-dwell | Each finished artefact — 3D logo, mascot, building, final 3D logo — is unchanged across its dwell, with its copy settled. |
 * | morph-blank | Brand → Motion, rendered: the art is never close to empty. |
 * | morph-outline | The strokes draw the mascot's construction outline before the mascot resolves. |
 * | footer-glide | From the footer's edge to the bottom, sampled every 6px, the final mark's centre and size never move faster than the glide can: no jump. |
 * | footer-duplicate / footer-collision / footer-dock | One mark, never on footer copy, docked in the footer's slot from 768px. |
 * | footer-scope | Every other route still shows the footer's mark. |
 * | footer-contrast | (RC) Every footer text box on screen through the handoff, pixel-measured: axe declines it where the story runs on under the footer. |
 */
const R1_SIZES = [[360, 740], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]];
const near = (a, b, tol = 0.05) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
const nums = (d) => (d.match(/-?\d+(\.\d+)?(e-?\d+)?/g) ?? []).map(Number);

/** Everything the questions read, from the served page. */
const pageState = (page) =>
  page.evaluate(() => {
    const stage = document.querySelector("[data-design-stage]");
    const svg = stage.querySelector("svg");
    const q = (s) => stage.querySelector(s);
    const qa = (s) => [...stage.querySelectorAll(s)];
    const op = (el) => (el ? +getComputedStyle(el).opacity : NaN);
    const circle = (el) => [+el.getAttribute("cx"), +el.getAttribute("cy"), +el.getAttribute("r")];
    const box = (el) => { const r = el.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; };
    const copies = [...document.querySelectorAll("[data-chapter] .ds-copy")].map((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, stick: parseFloat(getComputedStyle(el).top), opacity: +getComputedStyle(el).opacity, visible: Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) * Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) };
    });
    const [brand3d, final3d] = qa("[data-mark-3d]");
    return {
      scrollY, progress: +stage.dataset.progress, copies,
      brandNodes: qa("[data-brand-node]").map(circle),
      letters: q("[data-letter-g] path").getAttribute("d") + q("[data-letter-s] path").getAttribute("d"),
      brand3d: { opacity: op(brand3d), box: box(brand3d) }, final3d: { opacity: op(final3d), box: box(final3d) },
      brandNodesBox: (() => { const r = qa("[data-brand-node]").map((e) => e.getBoundingClientRect()); return [Math.min(...r.map((x) => x.left)), Math.min(...r.map((x) => x.top)), Math.max(...r.map((x) => x.right)) - Math.min(...r.map((x) => x.left))]; })(),
      finalNodesBox: (() => { const r = qa("[data-building-node]").map((e) => e.getBoundingClientRect()); return [Math.min(...r.map((x) => x.left)), Math.min(...r.map((x) => x.top)), Math.max(...r.map((x) => x.right)) - Math.min(...r.map((x) => x.left))]; })(),
      morph: op(q("[data-morph]")),
      morphEdges: qa("[data-morph-edge]").map((el) => ({ d: el.getAttribute("d"), w: +el.getAttribute("stroke-width") })),
      mascot: op(q("[data-finished-character]")),
      rig: op(q("[data-rig]")),
      faceToPlan: q("[data-rig] circle").getAttribute("cx"),
      detail: op(q("[data-building-detail]")),
      water: op(q("[data-water]")),
      roofShift: q("[data-roof]").getAttribute("transform"),
      edges: qa("[data-building-edge]").map((el) => el.getAttribute("d")),
      buildingNodes: qa("[data-building-node]").map(circle),
      svgUnit: svg.getScreenCTM().a,
      // The caption's effective opacity (its own × the receding art's) and whether it is on screen.
      label: (() => { const l = stage.querySelector(".ds-stage-label"), r = l.getBoundingClientRect(); return { on: getComputedStyle(l).display !== "none" && r.width > 0 && r.bottom > 0 && r.top < innerHeight, opacity: op(l) * op(stage.querySelector(".ds-stage-art")) }; })(),
    };
  });

/** Non-surface pixels in the stage art, copy, wave, grid and label hidden (a viewport crop). */
async function artInk(page) {
  const style = await page.addStyleTag({ content: ".ds-copy,.ds-stage-label,[data-thread],[data-grid],[data-construction],[data-sketch]{visibility:hidden!important}" });
  await new Promise((r) => setTimeout(r, 120));
  const clip = await page.$eval(".ds-stage-art", (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.max(0, r.left), y: Math.max(0, r.top), width: Math.min(innerWidth, r.right) - Math.max(0, r.left), height: Math.min(innerHeight, r.bottom) - Math.max(0, r.top) };
  });
  // The art is what differs from both chapter surfaces behind it, read from the chapters themselves.
  const surfaces = await page.evaluate(() => ["[data-chapter=\"0\"]", "[data-chapter][data-paper]"].map((s) => getComputedStyle(document.querySelector(s)).backgroundColor).map((bg) => bg.match(/[\d.]+/g).slice(0, 3).map((v) => (bg.startsWith("color(srgb") ? 255 * v : Number(v)))));
  const png = await page.screenshot({ encoding: "base64", captureBeyondViewport: false });
  await style.evaluate((el) => el.remove());
  if (clip.width < 1 || clip.height < 1) return 0;
  return decoder.evaluate(async (b64, clip, surfaces) => {
    const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
    const c = new OffscreenCanvas(img.width, img.height);
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(Math.round(clip.x), Math.round(clip.y), Math.round(clip.width), Math.round(clip.height));
    let n = 0;
    for (let i = 0; i < data.length; i += 4)
      if (surfaces.every((s) => Math.abs(data[i] - s[0]) + Math.abs(data[i + 1] - s[1]) + Math.abs(data[i + 2] - s[2]) > 60)) n++;
    return n;
  }, png, clip, surfaces);
}

/**
 * Share of the 3D logo's box whose pixels change when the image itself is hidden: it is really drawn.
 * Everything else that moves is held still first — the wave travels on its own, and the first version
 * of this read the wave crossing the box as the logo, with the image blocked (found by its proof).
 */
async function drawnShare(page, index) {
  const still = await page.addStyleTag({ content: ".ds-copy,.ds-stage-label,[data-thread]{visibility:hidden!important}" });
  await new Promise((r) => setTimeout(r, 120));
  const shot = async () => page.screenshot({ encoding: "base64", captureBeyondViewport: false });
  const box = await page.$$eval("[data-design-stage] [data-mark-3d]", (els, i) => { const r = els[i].getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round); }, index);
  const on = await shot();
  await page.$$eval("[data-design-stage] [data-mark-3d]", (els, i) => { els[i].style.visibility = "hidden"; }, index);
  const off = await shot();
  await page.$$eval("[data-design-stage] [data-mark-3d]", (els, i) => { els[i].style.removeProperty("visibility"); }, index);
  await still.evaluate((el) => el.remove());
  return decoder.evaluate(async (a, b, box) => {
    const read = async (b64) => {
      const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
      const c = new OffscreenCanvas(img.width, img.height);
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const [x, y, w, h] = [Math.max(0, box[0]), Math.max(0, box[1]), Math.min(img.width - Math.max(0, box[0]), box[2]), Math.min(img.height - Math.max(0, box[1]), box[3])];
      return w > 0 && h > 0 ? ctx.getImageData(x, y, w, h).data : new Uint8ClampedArray();
    };
    const [pa, pb] = [await read(a), await read(b)];
    if (!pa.length) return 0;
    let changed = 0;
    for (let i = 0; i < pa.length; i += 4) if (Math.abs(pa[i] - pb[i]) + Math.abs(pa[i + 1] - pb[i + 1]) + Math.abs(pa[i + 2] - pb[i + 2]) > 45) changed++;
    return changed / (pa.length / 4);
  }, on, off, box);
}

/** The rendered R1 questions at one size; returns failures prefixed by their key. */
async function continuity(page, { pixels = true } = {}) {
  const f = [];
  const ih = await page.evaluate(() => innerHeight);
  // A position the page cannot reach is a reading, not a crash: progress no longer follows the copy.
  const at = async (p, key) => {
    try {
      await seek(page, p);
    } catch {
      f.push(`${key}: the page never reached progress ${p} — progress no longer follows the copy`);
    }
    return pageState(page);
  };
  const settled = (s, i) => Math.abs(s.copies[i].top - s.copies[i].stick) <= 1.5;
  const map = await page.$eval("[data-design-stage]", (el) => el.dataset.map.split(",").map(Number));

  // dwell — the copy holds, settled, for a real reading distance.
  for (let i = 1; i < 5; i++)
    if (map[2 * i + 1] - map[2 * i] < ih * 0.25) f.push(`dwell: chapter ${i} holds its copy for ${map[2 * i + 1] - map[2 * i]}px of scroll (need ${Math.round(ih * 0.25)})`);

  // content-flow, overlap, no-blink — through each handoff, sampled.
  const transforming = [
    (s) => s.morph > 0.01 && !s.morphEdges.every((e, k) => near(nums(e.d), MASCOT_CURVES[k], 0.5)),
    (s) => s.rig > 0.01 && s.roofShift !== "translate(0 0)",
    (s) => s.detail < 0.99 && !s.edges.every((d, k) => near(nums(d), MARK_CURVES[k], 0.5)),
  ];
  for (const i of [1, 2, 3]) {
    const samples = [];
    for (let k = 0; k <= 12; k++) samples.push(await at(i + HANDOFF + (k / 12) * (1 - HANDOFF), "overlap"));
    const settledArea = Math.max(1, samples[0].copies[i].visible);
    let overlap = false;
    samples.forEach((s, k) => {
      const cur = s.copies[i], next = s.copies[i + 1];
      if (s.label.on && s.label.opacity > 0.01 && s.label.opacity < 0.99) f.push(`label-fade: at ${s.progress} the caption is on screen at ${s.label.opacity.toFixed(2)} opacity — text held part-faded`);
      if (cur.opacity < 0.99 || next.opacity < 0.99) f.push(`no-blink: at ${s.progress} a copy is faded (${cur.opacity}, ${next.opacity})`);
      if (cur.visible + next.visible < settledArea * 0.3) f.push(`no-blink: at ${s.progress} both copies are nearly off screen (${Math.round(((cur.visible + next.visible) / settledArea) * 100)}% of the settled copy)`);
      if (cur.top < cur.stick - 10 && next.top < ih - 10 && next.top > next.stick + 10 && transforming[i - 1](s)) overlap = true;
      if (k) {
        const prev = samples[k - 1], dy = s.scrollY - prev.scrollY;
        for (const [name, a, b] of [["current", prev.copies[i], cur], ["next", prev.copies[i + 1], next]]) {
          const free = !settled({ copies: [a] }, 0) && !settled({ copies: [b] }, 0);
          if (free && Math.abs(b.top - a.top + dy) > 2) f.push(`content-flow: through ${i}→${i + 1} the ${name} copy moved ${(b.top - a.top).toFixed(1)}px for ${dy.toFixed(1)}px of scroll — not moving with the page`);
        }
      }
    });
    if (!overlap) f.push(`overlap: no moment in ${i}→${i + 1} where the copy is leaving, the next arriving and the scene changing together`);
  }

  // payoff-3d and payoff-dwell.
  const aligned = (asset, nodesBox) => {
    // The asset's 460-unit frame starts 46.25 units left of and 52 above the spheres' 367.5 box.
    const unit = nodesBox[2] / 367.5;
    return near([asset.box[0], asset.box[1], asset.box[2]], [nodesBox[0] - 46.25 * unit, nodesBox[1] - 52 * unit, 460 * unit], 3);
  };
  for (const [name, a, b, pick, nodes, copy] of [
    ["the Brand 3D logo", 1.15, 1.47, (s) => s.brand3d, (s) => s.brandNodesBox, 1],
    ["the final 3D logo", 4.12, 4.45, (s) => s.final3d, (s) => s.finalNodesBox, 4],
  ]) {
    const [s, t] = [await at(a, "payoff-3d"), await at(b, "payoff-3d")];
    for (const [p, x] of [[a, s], [b, t]]) {
      if (!(pick(x).opacity >= 0.99 && aligned(pick(x), nodes(x)) && settled(x, copy)))
        f.push(`payoff-3d: at ${p} ${name} is ${pick(x).opacity} on, ${aligned(pick(x), nodes(x)) ? "aligned" : "not aligned"}, copy ${settled(x, copy) ? "settled" : "not settled"}`);
    }
    await at(b, "payoff-3d");
    // Drawn is not enough on its own: a failed SVG <image> draws Chrome's broken-image icon, which
    // also changes the box (found by this key's proof, with the asset blocked). The page's own
    // resource timing says whether the supplied asset itself arrived.
    const loaded = await page.evaluate(() => performance.getEntriesByType("resource").some((e) => e.name.includes("gridsmith-logo-3d") && e.responseStatus === 200 && e.decodedBodySize > 10000));
    if (!loaded) f.push(`payoff-3d: ${name} — the supplied 3D logo never loaded`);
    const drawn = await drawnShare(page, copy === 1 ? 0 : 1);
    if (drawn < 0.08) f.push(`payoff-3d: ${name} changes ${(drawn * 100).toFixed(1)}% of its box — it is not actually rendered`);
    if (JSON.stringify(pick(s).box.map(Math.round)) !== JSON.stringify(pick(t).box.map(Math.round))) f.push(`payoff-dwell: ${name} moves during its dwell`);
  }
  const m1 = await at(2.02, "payoff-dwell"), m2 = await at(2.48, "payoff-dwell");
  for (const [p, s] of [[2.02, m1], [2.48, m2]])
    if (!(s.mascot >= 0.99 && s.rig <= 0.01 && settled(s, 2))) f.push(`payoff-dwell: at ${p} the mascot is ${s.mascot}, the rig ${s.rig}, copy ${settled(s, 2) ? "settled" : "moving"}`);
  const b1 = await at(3.12, "payoff-dwell"), b2 = await at(3.48, "payoff-dwell");
  for (const [p, s] of [[3.12, b1], [3.48, b2]])
    if (!(s.detail >= 0.99 && s.water >= 0.99 && settled(s, 3) && s.edges.every((d, k) => near(nums(d), BUILDING_CURVES[k], 0.5))))
      f.push(`payoff-dwell: at ${p} the building detail ${s.detail}, water ${s.water}, copy ${settled(s, 3) ? "settled" : "moving"} — not complete and holding`);
  if (JSON.stringify(b1.edges) !== JSON.stringify(b2.edges)) f.push("payoff-dwell: the building changes during its dwell");

  // morph-outline, morph-blank.
  const outline = await at(1.9, "morph-outline");
  if (!(outline.morph >= 0.99 && outline.mascot <= 0.1 && outline.morphEdges.every((e, k) => near(nums(e.d), MASCOT_CURVES[k], 0.5))))
    f.push(`morph-outline: at 1.90 strokes ${outline.morph}, mascot ${outline.mascot} — no construction outline before the mascot`);
  if (pixels) {
    await at(1.3, "morph-blank");
    const reference = await artInk(page);
    let worst = Infinity, worstAt = 0;
    for (let p = 1.46; p <= 2.1; p += 0.04) {
      await at(+p.toFixed(2), "morph-blank");
      const ink = await artInk(page);
      if (ink < worst) [worst, worstAt] = [ink, p];
    }
    console.log(`  morph ink: payoff ${reference}px, lowest ${worst}px at ${worstAt.toFixed(2)} (${((worst / reference) * 100).toFixed(1)}%)`);
    if (reference < 1000) f.push(`morph-blank: the reference payoff measured ${reference}px — the art was not measured`);
    else if (worst < reference * 0.015) f.push(`morph-blank: the art falls to ${worst}px at ${worstAt.toFixed(2)} against ${reference} — a blank interval`);
  }
  return f;
}

/** The footer handoff: one continuous glide, one mark, never on footer copy, docked where it can be. */
async function footerGlide(page) {
  const f = [];
  const { width: vw, start, end } = await page.evaluate(() => {
    const top = document.querySelector("body > footer").getBoundingClientRect().top + scrollY;
    return { width: innerWidth, start: top - innerHeight - 60, end: document.documentElement.scrollHeight - innerHeight };
  });
  // Arrive first: from the hero the art's height is still easing (a CSS transition), which is not the glide.
  await page.evaluate((y) => scrollTo(0, y), start);
  await pause();
  let prev = null, worst = 0;
  for (let y = start; y <= end + 6; y += 6) {
    await page.evaluate((y) => scrollTo(0, y), Math.min(y, end));
    await new Promise((r) => setTimeout(r, 25));
    const s = await page.evaluate(() => {
      const r = document.querySelectorAll("[data-design-stage] [data-mark-3d]")[1].getBoundingClientRect();
      return { y: scrollY, cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width };
    });
    if (prev) {
      const ds = Math.abs(s.y - prev.y), move = Math.hypot(s.cx - prev.cx, s.cy - prev.cy), dw = Math.abs(s.w - prev.w);
      worst = Math.max(worst, move - 4.5 * ds);
      if (move > 4.5 * ds + 2 || dw > 3 * ds + 2)
        f.push(`footer-glide: at scroll ${Math.round(s.y)} the mark moved ${move.toFixed(0)}px and changed size ${dw.toFixed(0)}px for ${ds}px of scroll — a jump`);
    }
    prev = s;
  }
  for (const where of [0.8, 0.5, 0.2, "bottom"]) {
    await page.evaluate((where) => {
      const top = document.querySelector("body > footer").getBoundingClientRect().top + scrollY;
      scrollTo(0, where === "bottom" ? document.documentElement.scrollHeight : top - innerHeight * where);
    }, where);
    await pause();
    const s = await page.evaluate(() => {
      const footer = document.querySelector("body > footer");
      const slot = footer.querySelector("[class*='footerMark']");
      const mark = document.querySelectorAll("[data-design-stage] [data-mark-3d]")[1].getBoundingClientRect();
      const inView = mark.bottom > 0 && mark.top < innerHeight && mark.width > 1;
      // The drawn mark inside the 460-unit frame: its spheres' 367.5-unit box.
      const k = mark.width / 460;
      const drawn = { left: mark.left + 46.25 * k, right: mark.left + 413.75 * k, top: mark.top + 52 * k, bottom: mark.top + 408 * k };
      const boxes = [];
      const walker = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        if (!walker.currentNode.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(walker.currentNode);
        boxes.push(...[...range.getClientRects()].map((r) => ({ r, what: walker.currentNode.textContent.trim().slice(0, 30) })));
      }
      for (const a of footer.querySelectorAll("a")) boxes.push({ r: a.getBoundingClientRect(), what: a.getAttribute("aria-label") ?? a.textContent.trim().slice(0, 30) });
      const hits = inView ? boxes.filter(({ r }) => r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.left < drawn.right && r.right > drawn.left && r.top < drawn.bottom && r.bottom > drawn.top).map((b) => b.what) : [];
      const sl = slot.getBoundingClientRect();
      const cx = (drawn.left + drawn.right) / 2, cy = (drawn.top + drawn.bottom) / 2;
      return { slotShown: getComputedStyle(slot).visibility !== "hidden" && getComputedStyle(slot).display !== "none", inView, hits, docked: inView && cx >= sl.left && cx <= sl.right && cy >= sl.top && cy <= sl.bottom };
    }, where);
    if (s.slotShown) f.push(`footer-duplicate: the footer's decorative mark is shown on /design at ${where}`);
    // RC: the story runs on under the footer (R2), so axe declines the footer's text there
    // (check-axe DESIGN_FOOTER_TARGET); this is the measurement that allowance rests on.
    // At 0.8 only the footer's top padding is on screen: no text to measure, so it is not asked there.
    if (where !== 0.8)
      for (const x of await textContrast(page, { selector: "body > footer", hide: "body > footer,body > footer *" }))
        f.push(`footer-contrast: at ${where} ${x}`);
    if (s.hits.length) f.push(`footer-collision: at ${where} the scene's mark covers ${s.hits.slice(0, 4).join(" | ")}`);
    if (where === "bottom" && vw >= 768 && !s.docked) f.push(`footer-dock: at the bottom the mark is ${s.inView ? "not in" : "not near"} the footer's slot`);
  }
  // GS-DES-002-R2 — the owner's defect, read in the frame the owner saw. From before the story ends to
  // the page's end, each step reads the mark twice: straight after the scroll, before any listener has
  // run (what the compositor shows while script is a frame behind), and after the redraw. R1 passed
  // every settled reading and still went up with the page on each keyboard step and came back down;
  // its settled path also went down towards the rising slot, then up with it. Its centre-Y must travel
  // one way only: a second leg (hysteresis 2px) is a reversal.
  const trace = await page.evaluate(async () => {
    const mark = () => { const r = document.querySelectorAll("[data-design-stage] [data-mark-3d]")[1].getBoundingClientRect(); return r.top + r.height / 2; };
    const from = document.querySelector('[data-chapter="4"]').getBoundingClientRect().bottom + scrollY - innerHeight - 60;
    const to = document.documentElement.scrollHeight - innerHeight;
    const frame = () => new Promise((r) => requestAnimationFrame(r));
    scrollTo(0, from); await frame(); await frame();
    const out = [];
    for (let y = from; y <= to + 12; y += 12) {
      scrollTo(0, Math.min(y, to));
      const raw = mark();
      await frame(); await frame();
      out.push([Math.round(scrollY), raw, mark()]);
    }
    return out;
  });
  const seq = trace.flatMap(([, raw, drawn]) => [raw, drawn]);
  // A leg starts once the centre is 2px from the last extreme; continuing the same way extends it.
  const legs = [];
  let ext = seq[0];
  for (const y of seq) {
    const dir = legs.at(-1) ?? 0;
    if (dir && Math.sign(y - ext) === dir) ext = y;
    else if (Math.abs(y - ext) >= 2) { legs.push(Math.sign(y - ext)); ext = y; }
  }
  if (trace.length < 10) f.push(`footer-reversal: only ${trace.length} samples through the handoff — not measured`);
  else if (legs.length > 1)
    f.push(`footer-reversal: the mark's centre-Y went ${legs.map((l) => (l < 0 ? "up" : "down")).slice(0, 4).join(" then ")} (${legs.length} legs) through the footer handoff — not monotonic`);
  console.log(`  footer glide ${vw}px: largest step beyond the glide's own pace ${Math.max(0, worst).toFixed(1)}px; centre-Y ${seq[0].toFixed(0)} → ${seq.at(-1).toFixed(0)} in ${legs.length} leg(s) over ${trace.length} steps`);
  return f;
}

try {
  // Measure loading, not just settled screenshots: a deferred scene must not
  // move the initial SVG frame. CI caught the old 38%/62% frame expanding to 0%/100%.
  const loading = await open(1440, 900);
  const loadShift = () => loading.evaluate(() => window.__designLayoutShift);
  const initialShift = await loadShift();
  if (initialShift > 0.02)
    throw new Error(`Design loading layout shift ${initialShift} exceeds 0.02`);
  console.log(`Design loading layout shift: ${initialShift.toFixed(4)}`);
  if (process.argv.includes("--prove")) {
    await loading.$eval(".ds-stage-art", (el) => {
      el.style.setProperty("--ds-art-left", "38%");
      el.style.setProperty("--ds-art-width", "62%");
    });
    await pause();
    if ((await loadShift()) <= 0.02)
      throw new Error("Loading layout-shift proof did not produce its own red");
    console.log("PROVEN RED loading layout shift");
  }
  await loading.close();
  // GS-DES-002-R1 — continuous flow, the 3D payoff and the footer glide (see the table above).
  if (!process.argv.includes("--prove")) {
    for (const [width, height] of R1_SIZES) {
      const page = await open(width, height);
      const found = [...(process.argv.includes("--glide-only") ? [] : await continuity(page)), ...(await footerGlide(page))];
      errors.push(...found.map((x) => `GS-DES-002-R1 ${width}x${height} ${x}`));
      console.log(`GS-DES-002-R1 ${width}x${height}: ${found.length ? `${found.length} failure(s)` : (process.argv.includes("--glide-only") ? "footer glide, reversal, dock, collision, contrast — hold (continuity NOT run: --glide-only)" : "dwell, content flow, overlap, no blink, caption, 3D payoffs, payoff dwell, morph, footer glide, reversal, footer contrast — hold")}`);
      await page.close();
    }
    for (const route of ["/press", "/about", "/digital", "/design/services/brand-identity-systems"]) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(`${base}${route}`, { waitUntil: "networkidle0" });
      const shown = await page.$eval("body > footer [class*='footerMark']", (el) => getComputedStyle(el).visibility === "visible" && getComputedStyle(el).display !== "none").catch(() => false);
      if (!shown) errors.push(`GS-DES-002-R1 footer-scope: ${route} lost the footer's mark — the suppression is not Design-only`);
      await page.close();
    }
    console.log("GS-DES-002-R1 footer-scope: /press, /about, /digital and a Design service page keep the footer's mark");
  } else {
    // Each question made to fail by a probe that satisfies its predicate — a red on its own key.
    // Timing probes serve the chunk with one range moved; nothing on disk is touched.
    const halfSpeed = () => addEventListener("scroll", () => document.querySelectorAll(".ds-copy").forEach((el) => { el.style.translate = `0 ${scrollY * 0.5}px`; }), { passive: true });
    const PROBES = [
      // R2: no scroll left to come — the glide completes the moment the footer enters.
      ["footer-glide", { mutate: (js) => js.replace("document.documentElement.scrollHeight-innerHeight-scrollY", "0"), glide: true }],
      // R2: R1's mechanism — the stage released on the compositor, held by script a frame late.
      ["footer-reversal", { css: ".ds-story[data-enhanced]::after{display:none!important}", script: () => addEventListener("scroll", () => { const st = document.querySelector("[data-design-stage]"); st.querySelector(".ds-stage-art").style.translate = `0 ${-st.getBoundingClientRect().top}px`; }), glide: true }],
      // RC: credit the overlap predicate itself — fixed copy also breaks seeking, whose message shares the key.
      ["overlap", { css: ".ds-story[data-enhanced] .ds-copy{position:fixed!important}", message: "no moment" }],
      ["content-flow", { script: halfSpeed }],
      ["no-blink", { css: ".ds-copy{opacity:.02!important}" }],
      // RC: the caption dimmed with the receding art (R1), and faded with the scroll at the footer (R2).
      ["label-fade", { css: ".ds-stage-label{opacity:.5!important}" }],
      ["payoff-3d", { block: "gridsmith-logo-3d", message: "never loaded" }],
      ["payoff-3d", { css: "[data-mark-3d]{clip-path:inset(50%)!important}", message: "not actually rendered" }],
      ["dwell", { css: ".ds-story:not([data-static]) .ds-chapter::after{height:0!important}" }],
      ["payoff-dwell", { mutate: (js) => js.replace("rig:[2.5,2.58]", "rig:[2.2,2.3]") }],
      ["morph-outline", { mutate: (js) => js.replace("mascot:[1.88,2]", "mascot:[1.7,1.8]") }],
      ["morph-blank", { css: "[data-morph]{visibility:hidden!important}" }],
      // RC: the footer painted in its own ink token — its ink text reads ~1:1. Not currentColor: the
      // measurement makes the footer's colour transparent, which would take the probe with it (inert).
      ["footer-contrast", { css: "body>footer{background:var(--chrome-ink)!important}", glide: true }],
      ["footer-duplicate", { css: "body>footer [class*='footerMark']{visibility:visible!important}", glide: true }],
      ["footer-collision", { css: "body>footer [class*='footerBrand']{transform:translateX(55vw)}", glide: true }],
      ["footer-dock", { mutate: (js) => js.replace("(min-width: 768px)", "(min-width: 9999px)"), glide: true }],
    ];
    const only = process.env.DES002_PROBE;
    for (const [key, probe] of PROBES.filter(([k]) => !only || k === only)) {
      const page = await open(1440, 900, { mutate: probe.mutate, block: probe.block });
      if (probe.css) await page.addStyleTag({ content: probe.css });
      if (probe.script) await page.evaluate(probe.script);
      if (probe.css || probe.script) await page.evaluate(() => dispatchEvent(new Event("resize")));
      await pause();
      const found = probe.glide ? await footerGlide(page) : await continuity(page, { pixels: key === "morph-blank" });
      await page.close();
      const own = found.filter((x) => x.startsWith(`${key}:`) && (!probe.message || x.includes(probe.message)));
      if (!own.length) throw new Error(`Proof ${key} failed to produce its own red (got: ${found.join("; ") || "nothing"})`);
      console.log(`PROVEN RED GS-DES-002-R1 ${key}: ${own[0].slice(key.length + 2, key.length + 150)}`);
    }
  }
  if (process.argv.includes("--des002-only")) {
    // Development convenience only: says so, so a narrowed run is never read as the whole gate.
    if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
    console.log("check-design-scene: FILTERED --des002-only — GS-DES-002-R1 section only; the full gate was not run.");
    await browser.close();
    process.exit(0);
  }
  if (!process.argv.includes("--prove")) {
    // G2: sample the closed scope note through the roof/CAD sequence, including
    // both sides of the stacked-layout and short-screen breakpoints.
    for (const [width, height] of [
      [320,568],[430,568],[430,650],[430,651],[430,800],[430,932],
      [500,700],[560,800],[600,600],[600,800],[600,900],[700,600],
      [700,800],[700,900],[720,800],[760,650],[760,651],[760,800],
      [760,900],[761,800],[768,800],[800,800],[900,800],[1024,800],
    ]) {
      const page = await open(width, height);
      let minimum = Infinity;
      // GS-DES-002-R1: the roof is assembled and still solid at 2.92, ghosted from 3.0 — the crossing
      // this question exists for — then the settled Technical dwell to 3.5.
      for (const position of [2.92,3.05,3.2,3.35,3.45]) {
        await seek(page, position);
        const samples = await textContrast(page, { selector: ".ds-gate", report: true });
        for (const sample of samples) {
          if (!sample.measured || !(sample.ratio >= sample.min))
            errors.push(`G2 ${width}x${height} @${position}: scope contrast ${JSON.stringify(sample)}`);
          minimum = Math.min(minimum, sample.ratio);
        }
        const state = await page.$eval('#technical-design .ds-copy', el => ({
          open: el.querySelector('details').open,
          copy: getComputedStyle(el).backgroundColor,
          note: getComputedStyle(el.querySelector('.ds-gate')).backgroundColor,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
        }));
        if (state.open || !state.copy.endsWith(', 0)') || state.overflow)
          errors.push(`G2 ${width}x${height}: closed disclosure/overflow changed ${JSON.stringify(state)}`);
        // GS-DES-002-RC: every stacked height, not only > 650px — R1's arriving copy crosses the roof at all of them.
        if (width <= 760 ? state.note.endsWith(', 0)') : !state.note.endsWith(', 0)'))
          errors.push(`G2 ${width}x${height}: incorrect responsive scope surface`);
        if (out && [2.92,3.2].includes(position))
          await page.screenshot({path:join(out,`g2-${width}x${height}-${position}.png`)});
      }
      console.log(`G2 ${width}x${height}: scope-note minimum ${minimum.toFixed(2)}:1 across five readable Technical states`);
      await page.close();
    }
  }
  if (process.argv.includes("--prove")) {
    const page = await open(1440, 900);
    const probes = [
      [
        "hero-distance",
        () => {
          document.querySelector('[data-chapter="0"]').style.minHeight =
            "300svh";
        },
      ],
      [
        "storeys",
        () => {
          document
            .querySelector(
              '[data-design-stage] [data-art="technical"] [data-storey]',
            )
            .remove();
        },
      ],
      [
        "cta",
        () => {
          document.querySelector("[data-design-cta]").style.visibility =
            "hidden";
        },
      ],
      [
        "overflow",
        () => {
          const el = document.createElement("div");
          el.style.cssText =
            "width:5000px;height:30px;position:absolute;left:0";
          document.body.append(el);
        },
      ],
      [
        "scene",
        () => {
          document.querySelector("[data-design-stage]").style.display = "none";
        },
      ],
      [
        "chapters",
        () => {
          document.querySelector('[data-chapter="4"]').remove();
        },
      ],
      [
        "protagonist",
        () => {
          document.querySelector(
            '[data-design-stage] [data-art="workspace"]',
          ).style.visibility = "hidden";
        },
      ],
    ];
    for (const [name, inject] of probes) {
      await page.goto(`${base}/design`, { waitUntil: "networkidle0" });
      await page.waitForSelector("[data-enhanced]");
      const clean = await measure(page, {
        hero: true,
        expected: '[data-art="workspace"]',
      });
      if (clean.failures.length)
        throw new Error(`Dirty proof baseline: ${clean.failures}`);
      await page.evaluate(inject);
      const result = await measure(page, {
        hero: true,
        expected: '[data-art="workspace"]',
      });
      if (!result.failures.includes(name))
        throw new Error(`Proof ${name} failed to produce its own red`);
      console.log(`PROVEN RED ${name}`);
    }
    await page.goto(`${base}/design`, { waitUntil: "networkidle0" });
    await page.waitForSelector("[data-enhanced]");
    const contrastBaseline = await textContrast(page);
    if (contrastBaseline.length)
      throw new Error(
        `Dirty contrast proof baseline: ${contrastBaseline.join("; ")}`,
      );
    await page.$eval("h1", (el) => (el.style.color = "var(--ds-night)"));
    if (!(await textContrast(page)).length)
      throw new Error("Contrast proof did not fail");
    console.log("PROVEN RED rendered text contrast");
    // The mixed-colour branch: the stage label computes to `color(srgb …)`. Readable must be clean (it
    // read 1.19:1 when parsed as bytes); navy-on-navy through the same mix (its own tokens overridden) must be red.
    await seek(page, 2.25);
    const mixed = await page.$eval("[data-label='2']", (el) => getComputedStyle(el).color);
    if (!mixed.startsWith("color(srgb")) throw new Error(`INERT proof: the stage label is not a mixed colour (${mixed})`);
    const mixedClean = (await textContrast(page)).filter((f) => f.includes("Character / form study"));
    if (mixedClean.length) throw new Error(`color(srgb) label misread: ${mixedClean}`);
    await page.addStyleTag({ content: ".ds-stage-label{--ink-muted:var(--ds-night)!important;--ds-paper-muted:var(--ds-night)!important}" });
    if (!(await textContrast(page)).some((f) => f.includes("Character / form study")))
      throw new Error("color(srgb) contrast proof did not fail");
    console.log("PROVEN RED rendered text contrast — mixed-colour label (and clean when readable)");
    await page.close();
    const mobile = await open(320, 568);
    await seek(mobile, 3.15);
    await mobile.click('#technical-design summary');
    const cleanPanel = await textContrast(mobile);
    if (cleanPanel.length) throw new Error(`Dirty scrollport contrast baseline: ${cleanPanel}`);
    await mobile.$eval('#technical-design summary', el => el.style.color = 'var(--ds-paper)');
    if (!(await textContrast(mobile)).some(f => f.includes('Explore Technical')))
      throw new Error('Scrollport contrast proof did not fail');
    console.log('PROVEN RED visible text contrast inside clipped mobile panel');
    await mobile.close();
    const scope = await open(760,800);
    // R1 ghosts the roof before the Technical copy settles, and copy in transit is over a receded
    // scene, so no served position has the note over solid art any more: removing the paper alone is
    // inert (the first R1 run of this proof). The subject is a settled note over a roof held solid —
    // the case the paper surface exists for, should the art behind it ever be dark again.
    await seek(scope,3.2);
    await scope.addStyleTag({ content: "[data-design-stage] [data-roof]{opacity:1!important}" });
    const cleanScope = await textContrast(scope, {selector:'.ds-gate'});
    if (cleanScope.length) throw new Error(`Dirty G2 scope baseline: ${cleanScope}`);
    await scope.$eval('.ds-gate', el => el.style.background = 'transparent');
    if (!(await textContrast(scope, {selector:'.ds-gate'})).length)
      throw new Error('G2 removed-surface proof did not fail');
    console.log('PROVEN RED closed Technical scope contrast without paper');
    await scope.close();
  } else if (!process.argv.includes("--g2-only")) {
    // G1: the original H1 stays semantic throughout the story; disclosures own
    // readability on narrow screens and preserve transparent closed/desktop copy.
    for (const [width, height] of [[320,568],[360,800],[375,812],[390,844],[430,932],[768,1024],[1280,720]]) {
      const page = await open(width, height);
      await pageHeading(page, `${width} initial`);
      for (const [chapter, id] of [[1,'brand-visual'],[2,'motion-dimensional'],[3,'technical-design']]) {
        await seek(page, chapter + .15);
        await pageHeading(page, `${width} chapter ${chapter}`);
        const selector = `#${id} .ds-copy`;
        const closed = await page.$eval(selector, el => getComputedStyle(el).backgroundColor);
        await page.focus(`#${id} summary`);
        await page.keyboard.press('Enter');
        const panel = await page.$eval(selector, el => ({
          open: el.querySelector('details').open,
          background: getComputedStyle(el).backgroundColor,
          paper: getComputedStyle(el).getPropertyValue('--ds-paper').trim(),
          outline: parseFloat(getComputedStyle(el.querySelector('summary')).outlineWidth),
        }));
        if (!panel.open || panel.outline < 2) errors.push(`${width} ${id}: disclosure keyboard/focus failed`);
        if (width <= 760 ? panel.background === closed || panel.background.endsWith(', 0)') : panel.background !== closed)
          errors.push(`${width} ${id}: incorrect expanded surface ${panel.background}`);
        // Focus each real title, including long wrapped titles: the existing inner
        // scroll must expose it and the panel must paint beneath its visible text.
        for (const link of await page.$$(`#${id} details a`)) {
          await link.focus();
          const reachable = await link.evaluate(el => {
            const r = el.getBoundingClientRect(), p = el.closest('.ds-copy').getBoundingClientRect();
            return r.left >= 0 && r.right <= innerWidth && r.top >= Math.max(0,p.top)-1 &&
              r.bottom <= Math.min(innerHeight,p.bottom)+1 && r.height >= 24;
          });
          if (!reachable) errors.push(`${width} ${id}: service link clipped or undersized`);
        }
        errors.push(...(await textContrast(page)).map(f => `${width} expanded ${id}: ${f}`));
        const axe = await new AxePuppeteer(page, axeSource).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
        errors.push(...axe.violations.map(v => `${width} expanded ${id}: axe ${v.id}`));
        if (out) await page.screenshot({path:join(out,`${width}-expanded-${id}.png`)});
        await page.focus(`#${id} summary`);
        await page.keyboard.press('Enter');
        if (await page.$eval(selector, el => getComputedStyle(el).backgroundColor) !== closed)
          errors.push(`${width} ${id}: paper remained after disclosure closed`);
      }
      await seek(page, 4.3);
      await pageHeading(page, `${width} final`);
      await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
      await pause();
      await pageHeading(page, `${width} footer`);
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) errors.push(`${width} G1: overflow`);
      console.log(`G1 ${width}x${height}: single accessible H1, three disclosures, keyboard/focus, titles, contrast, closed surface`);
      await page.close();
    }
    const pacing = await open(1440, 900);
    const heroState = () =>
      pacing.evaluate(() => ({
        y: scrollY,
        height: document.querySelector('[data-chapter="0"]').offsetHeight,
        brandTop:
          document.querySelector('[data-chapter="1"]').getBoundingClientRect()
            .top + scrollY,
        wave: document
          .querySelector("[data-design-stage] [data-thread]")
          .getAttribute("d"),
        node: document
          .querySelector("[data-design-stage] [data-design-node]")
          .getAttribute("transform"),
      }));
    const before = await heroState();
    await pacing.mouse.wheel({ deltaY: 180 });
    await pause();
    const after = await heroState();
    if (
      after.y - before.y < 160 ||
      after.y - before.y > 200 ||
      before.wave === after.wave ||
      before.node === after.node
    )
      errors.push(
        "Hero first wheel must scroll natively and visibly change both wave and construction",
      );
    if (after.height > 900 * 1.3 || after.brandTop > 900 * 1.4)
      errors.push("Hero handoff exceeds proportional scroll-distance budget");
    console.log(
      `R2 wheel: ${after.y - before.y}px native scroll; hero ${after.height}px; Brand begins ${after.brandTop}px; wave/node changed`,
    );
    await pacing.close();
    const keyboard = await open(1440, 900);
    for (let i = 0; i < 20; i++) {
      await keyboard.keyboard.press("Tab");
      if (
        await keyboard.$eval(
          "[data-design-cta]",
          (el) => document.activeElement === el,
        )
      )
        break;
    }
    const focus = await keyboard.$eval("[data-design-cta]", (el) => ({
      active: document.activeElement === el,
      width: parseFloat(getComputedStyle(el).outlineWidth),
      style: getComputedStyle(el).outlineStyle,
    }));
    if (!focus.active || focus.width < 2 || focus.style === "none")
      errors.push("Quote CTA keyboard/focus visibility failed");
    await seek(keyboard, 1.12);
    await keyboard.focus("#brand-visual summary");
    await keyboard.keyboard.press("Enter");
    if (!(await keyboard.$eval("#brand-visual details", (el) => el.open)))
      errors.push("Service disclosure did not open with keyboard");
    await keyboard.close();
    for (const [width, height] of process.argv.includes("--fallback-only")
      ? []
      : sizes) {
      const page = await open(width, height);
      const label = `${width}x${height}`;
      const states = [
        [0, "workspace"],
        [1.3, "identity"],
        [2.25, "character"],
        [3.3, "technical"],
        [4.3, "technical"],
      ];
      const paths = [];
      for (const [position, name] of states) {
        await seek(page, position);
        const m = await measure(page, {
          hero: position === 0,
          expected: `[data-art="${name}"]`,
        });
        errors.push(...m.failures.map((f) => `${label} ${name}: ${f}`));
        if (width > 760 && [1.3, 2.25, 3.3].includes(position)) {
          const centre = await page.$eval(".ds-stage-art", (el) => {
            const r = el.getBoundingClientRect();
            return (r.left + r.width / 2) / innerWidth;
          });
          if (name === "character" ? centre < 0.56 : centre > 0.44)
            errors.push(`${label} ${name}: incorrect side (${centre})`);
        }
        errors.push(
          ...(await textContrast(page)).map((f) => `${label} ${name}: ${f}`),
        );
        paths.push(m.path);
        if (m.links !== 16)
          errors.push(`${label}: expected 16 service links, found ${m.links}`);
        if (out)
          await page.screenshot({ path: join(out, `${label}-${position >= 4 ? "final" : name}.png`) });
        if (width === 1440 || width === 375) {
          const axe = await new AxePuppeteer(page, axeSource)
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze();
          errors.push(
            ...axe.violations.map(
              (v) =>
                `${label} ${name}: axe ${v.id} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`,
            ),
          );
        }
      }
      if (new Set(paths).size !== 5)
        errors.push(
          `${label}: surviving path did not transform through five chapters`,
        );
      // Opening service detail is a real interaction; it must remain reachable and avoid overflow.
      await seek(page, 1.12);
      await page.$eval("#brand-visual details", (el) => {
        el.open = true;
      });
      await pause();
      const opened = await measure(page);
      errors.push(
        ...opened.failures.map((f) => `${label} open services: ${f}`),
      );
      console.log(
        `${label}: five chapters, hero, path handoffs, service disclosure measured`,
      );
      await page.close();
    }
    const page = await open(1440, 900, { touch: true });
    const checkpoints = [
      [0.95, "[data-letters]"],
      [1.3, "[data-brand-node]"],
      [1.95, "[data-sketch]"],
      [2.2, "[data-character]"],
      [2.3, "[data-finished-character]"],
      [2.75, "[data-rig]"],
      [3.05, "[data-roof]"],
      [3.2, "[data-dimensions]"],
      [3.3, "[data-electrical]"],
      [3.4, "[data-water]"],
    ];
    for (const [pos, expected] of checkpoints) {
      await seek(page, pos);
      const r = await measure(page, { expected });
      errors.push(...r.failures.map((f) => `detail ${pos}: ${f}`));
      errors.push(
        ...(await textContrast(page)).map((f) => `detail ${pos}: ${f}`),
      );
      if (out) await page.screenshot({ path: join(out, `detail-${pos}.png`) });
    }
    // GS-DES-002-R1: the construction starts at 0.7, as the Brand copy arrives; 0.62 is before it.
    await seek(page, 0.62);
    const letters = await page.evaluate(() => {
      const g = document
        .querySelector("[data-design-stage] [data-letter-g]")
        .getBoundingClientRect();
      const s = document
        .querySelector("[data-design-stage] [data-letter-s]")
        .getBoundingClientRect();
      const svg = document.querySelector("[data-design-stage] svg");
      return {
        ratio: s.height / g.height,
        upperG: g.top < s.top,
        decorative: svg.getAttribute("aria-hidden") === "true" &&
          svg.getAttribute("focusable") === "false" &&
          !svg.querySelector('a,button,[tabindex]'),
      };
    });
    if (letters.ratio < 1.8 || !letters.upperG)
      errors.push("G/S hierarchy: require smaller upper G and dominant S");
    if (!letters.decorative)
      errors.push("G/S artwork must remain decorative and non-focusable");
    await seek(page, 3.4);
    const structure = await page.$eval(
      '[data-design-stage] [data-art="technical"]',
      (el) => ({
        levels: [...el.querySelectorAll("[data-storey]")].map((e) =>
          Math.round(e.getBoundingClientRect().top),
        ),
        windows: [
          ...el.querySelectorAll(".ds-facade path:not(.ds-core)"),
        ].reduce(
          (count, path) =>
            count + (path.getAttribute("d").match(/M/g) ?? []).length,
          0,
        ),
        electrical: +getComputedStyle(el.querySelector("[data-electrical]"))
          .opacity,
        water: +getComputedStyle(el.querySelector("[data-water]")).opacity,
      }),
    );
    if (
      structure.levels.length !== 4 ||
      new Set(structure.levels).size !== 4 ||
      structure.windows < 20 ||
      structure.electrical < 0.5 ||
      structure.water < 0.9
    )
      errors.push(
        `Four-storey coordinated drawing incomplete: ${JSON.stringify(structure)}`,
      );
    await seek(page, 2.3);
    const mascot = await page.$eval('[data-design-stage] [data-character]', el => el.outerHTML);
    await page.mouse.move(1000, 200);
    await page.mouse.move(300, 700);
    await pause();
    if (mascot !== await page.$eval('[data-design-stage] [data-character]', el => el.outerHTML) ||
        !mascot.includes('/brand/design/headshot-animated.svg'))
      errors.push('Original animated mascot must remain an image without pointer-follow');
    await page.evaluate(() => { window.__building = document.querySelector('[data-design-stage] [data-building-outline]'); });
    await seek(page, 4.3);
    const closing = await page.evaluate(() => {
      const stage = document.querySelector('[data-design-stage]');
      return {
        same: window.__building === stage.querySelector('[data-building-outline]'),
        bars: stage.querySelectorAll('[data-building-edge]').length,
        nodes: [...stage.querySelectorAll('[data-building-node]')].map(el => [+el.getAttribute('cx'), +el.getAttribute('cy'), +el.getAttribute('r')]),
        detail: +getComputedStyle(stage.querySelector('[data-building-detail]')).opacity,
        clutter: stage.querySelectorAll('[data-art="convergence"],[data-returning]').length,
      };
    });
    const markNodes = [[347.5,336,37.5],[538,336,37.5],[347.5,517.5,37.5],[538,517.5,37.5],[447.5,437,37.5],[640,437,37.5],[447.5,617,37.5],[640,617,37.5]];
    if (!closing.same || closing.bars !== 6 || closing.detail !== 0 || closing.clutter || JSON.stringify(closing.nodes) !== JSON.stringify(markNodes))
      errors.push(`Persistent building must resolve to exact uncluttered mark: ${JSON.stringify(closing)}`);
    // Toggling the system preference disposes the live scene, then rebuilds from immutable geometry.
    await seek(page, 1.35);
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.waitForSelector('[data-static]');
    const wave = () => page.$eval('[data-design-stage] [data-thread]', el => el.getAttribute('d'));
    const still = await wave();
    await pause();
    if (still !== await wave()) errors.push('Reduced motion left an autonomous wave running');
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
    await page.waitForSelector('[data-enhanced]');
    await seek(page, 4.3);
    const restarted = await page.$$eval('[data-design-stage] [data-building-node]', els => els.map(el => [+el.getAttribute('cx'),+el.getAttribute('cy'),+el.getAttribute('r')]));
    if (JSON.stringify(restarted) !== JSON.stringify(markNodes)) errors.push(`Reduced-motion restart corrupted mark endpoints: ${JSON.stringify(restarted)}`);
    await page.evaluate(() => {
      window.__nonWaveChanges = 0;
      window.__sceneObserver = new MutationObserver(records => {
        window.__nonWaveChanges += records.filter(record => !record.target.matches?.('[data-thread]')).length;
      });
      window.__sceneObserver.observe(document.querySelector('[data-design-story]'), { attributes: true, childList: true, subtree: true });
    });
    const moving = await wave();
    await pause();
    if (moving === await wave()) errors.push('Wave stopped while the visible page was idle');
    if (await page.evaluate(() => window.__nonWaveChanges)) errors.push('Idle wave redrew non-wave scene content');
    await page.evaluate(() => window.__sceneObserver.disconnect());
    for (const [pos, sign] of [[0.3,-1],[1.3,1],[2.3,-1],[3.3,1]]) {
      await seek(page, pos);
      await pause();
      const velocity = await page.$eval('[data-thread]', el => Number(el.dataset.velocity));
      if (Math.sign(velocity) !== sign || Math.abs(velocity) > .651) errors.push(`Wave direction/velocity failed at ${pos}: ${velocity}`);
    }
    const foreground = await browser.newPage();
    await foreground.bringToFront();
    await pause();
    if (!(await page.evaluate(() => document.hidden))) errors.push('Hidden-tab wave probe did not establish a hidden document');
    const hidden = await wave();
    await pause();
    if (hidden !== await wave()) errors.push('Wave runs in a hidden document');
    await foreground.close();
    await page.bringToFront();
    // A short footer can leave part of the story in view even at maximum scroll.
    // Extend only the test page so the offscreen precondition is real.
    await page.evaluate(() => {
      const spacer = document.createElement('div');
      spacer.dataset.offscreenProbe = '';
      spacer.style.height = '150vh';
      document.body.append(spacer);
      scrollTo(0, document.documentElement.scrollHeight);
    });
    await pause();
    if (!(await page.$eval('[data-design-story]', el => el.getBoundingClientRect().bottom < -100)))
      errors.push('Offscreen wave probe did not move the story beyond its observation margin');
    const offscreen = await wave();
    await pause();
    if (offscreen !== await wave()) errors.push('Wave runs beyond the story at the footer');
    await page.$eval('[data-offscreen-probe]', el => el.remove());
    await seek(page, 1.2);
    await page.$eval('#brand-visual details', el => { el.open = true; });
    await page.evaluate(() => { window.__retiredWave = document.querySelector('[data-design-stage] [data-thread]'); });
    await page.click('#brand-visual a[href="/design/services/brand-identity-systems"]');
    await page.waitForSelector('[data-design-story]', {hidden:true});
    const retired = await page.evaluate(() => window.__retiredWave?.getAttribute('d'));
    await pause();
    if (retired !== await page.evaluate(() => window.__retiredWave?.getAttribute('d'))) errors.push('Wave continues after route exit');
    await page.goBack({waitUntil:'networkidle0'});
    await page.waitForSelector('[data-enhanced]');
    await page.reload({waitUntil:'networkidle0'});
    await page.waitForSelector('[data-enhanced]');
    await pageHeading(page, 'route back/refresh');
    console.log('R2 lifecycle: reduced-motion restart, idle wave, direction reversal, hidden/offscreen pause, route exit/back/refresh');
    await page.close();
    for (const mode of [
      "reduced",
      "no-js",
      "save-data",
      "low-memory",
      "failed-import",
    ])
      for (const [width, height] of [
        [1440, 900],
        [375, 812],
      ]) {
        const p = await open(width, height, {
          reduced: mode === "reduced",
          js: mode !== "no-js",
          limited: mode === "save-data",
          lowMemory: mode === "low-memory",
          failedImport: mode === "failed-import",
        });
        const m = await p.evaluate(() => ({
          posters: [...document.querySelectorAll(".ds-poster")].filter(
            (e) =>
              getComputedStyle(e).display !== "none" &&
              e.getBoundingClientRect().height > 50,
          ).length,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          headings: document.querySelectorAll(
            "[data-chapter] h1,[data-chapter] h2",
          ).length,
        }));
        if (m.posters !== 5 || m.headings !== 5 || m.overflow)
          errors.push(
            `${mode} ${width}: incomplete static narrative ${JSON.stringify(m)}`,
          );
        for (let chapter = 0; chapter < 5; chapter++) {
          await p.evaluate(
            (chapter) =>
              document
                .querySelectorAll("[data-chapter]")
                [chapter].scrollIntoView({ behavior: "instant" }),
            chapter,
          );
          const contrast = await textContrast(p);
          await pageHeading(p, `${mode} ${width} chapter ${chapter}`);
          errors.push(
            ...contrast.map((f) => `${mode} ${width} chapter ${chapter}: ${f}`),
          );
          if (contrast.length && out) {
            await p.screenshot({
              path: join(out, `${width}-${mode}-${chapter}-failure.png`),
            });
            console.log(
              `${mode} ${width} chapter ${chapter} surfaces`,
              await p.evaluate(() =>
                [...document.querySelectorAll("[data-chapter]")].map((el) => ({
                  chapter: el.dataset.chapter,
                  background: getComputedStyle(el).backgroundColor,
                  colour: getComputedStyle(el).color,
                  top: el.getBoundingClientRect().top,
                })),
              ),
            );
          }
        }
        if (out)
          await p.screenshot({
            path: join(out, `${width}-${mode}.png`),
            fullPage: true,
          });
        await p.close();
      }
  }
} finally {
  await browser.close();
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  "check-design-scene: PASS — measured invariants; owner visual acceptance remains separate.",
);
