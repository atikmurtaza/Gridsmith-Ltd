/** GS-R002 rendered invariants. This measures geometry, visibility, progression and accessibility;
 * it does not claim that a class name or passing test establishes aesthetic acceptance.
 * --prove injects reversible browser-only faults and requires the corresponding assertion to fail.
 */
import { launch } from "./browser-launch.mjs";
import { AxePuppeteer } from "@axe-core/puppeteer";
import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, basename } from "node:path";

const base = process.env.AXE_BASE_URL ?? "http://127.0.0.1:3000";
const axeSource = readFileSync(
  createRequire(import.meta.url).resolve("axe-core/axe.min.js"),
  "utf8",
);
const sizes = [
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
async function textContrast(page) {
  // Let scrolling and media-query layout reach the compositor before pairing DOM
  // rectangles with screenshot pixels (especially reduced motion on Linux).
  await pause();
  const boxes = await page.evaluate(() => {
    const out = [];
    for (const root of document.querySelectorAll(".ds-copy,.ds-stage-label")) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode,
          el = node.parentElement;
        if (
          !node.textContent.trim() ||
          (el.closest("details:not([open])") && !el.closest("summary"))
        )
          continue;
        const c = getComputedStyle(el),
          range = document.createRange();
        range.selectNodeContents(node);
        for (const r of range.getClientRects()) {
          if (
            r.width < 1 ||
            r.height < 1 ||
            r.bottom <= 0 ||
            r.top >= innerHeight ||
            c.display === "none"
          )
            continue;
          out.push({
            box: [
              Math.floor(r.x),
              Math.floor(r.y),
              Math.ceil(r.width),
              Math.ceil(r.height),
            ],
            rgb: c.color
              .match(/[\d.]+/g)
              .slice(0, 3)
              .map(Number),
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
  });
  if (!boxes.length) return ["No rendered text boxes measured"];
  const style = await page.addStyleTag({
    content:
      ".ds-copy *,.ds-stage-label *{color:transparent!important;text-decoration-color:transparent!important;-webkit-text-fill-color:transparent!important}",
  });
  const png = await page.screenshot({ encoding: "base64" });
  await style.evaluate((el) => el.remove());
  return decoder.evaluate(
    async (png, boxes) => {
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
        return !values.length || ratio < min
          ? [`pixel contrast ${text}: ${ratio.toFixed(2)}:1; needs ${min}`]
          : [];
      });
    },
    png,
    boxes,
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
  } = {},
) {
  const page = await browser.newPage();
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
async function seek(page, pos) {
  await page.evaluate((pos) => {
    const sections = [...document.querySelectorAll("[data-chapter]")];
    const i = Math.floor(pos);
    const el = sections[i];
    window.scrollTo(
      0,
      el.getBoundingClientRect().top +
        scrollY +
        el.offsetHeight * (pos - i) -
        innerHeight * 0.2,
    );
  }, pos);
  await pause();
  await page.waitForFunction(
    (pos) => {
      const progress = Number(
        document.querySelector("[data-design-stage]")?.dataset.progress,
      );
      return pos === 0 ? progress < 0.15 : Math.abs(progress - pos) < 0.015;
    },
    { timeout: 10000 },
    Math.max(0, pos),
  );
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

try {
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
    await page.close();
  } else {
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
      `R1 wheel: ${after.y - before.y}px native scroll; hero ${after.height}px; Brand begins ${after.brandTop}px; wave/node changed`,
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
        [1.6, "identity"],
        [2.53, "character"],
        [3.65, "technical"],
        [4.25, "convergence"],
      ];
      const paths = [];
      for (const [position, name] of states) {
        await seek(page, position);
        const m = await measure(page, {
          hero: position === 0,
          expected: `[data-art="${name}"]`,
        });
        errors.push(...m.failures.map((f) => `${label} ${name}: ${f}`));
        if (width > 760 && [1.6, 2.53, 3.65].includes(position)) {
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
          await page.screenshot({ path: join(out, `${label}-${name}.png`) });
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
      [1.1, "[data-letters]"],
      [1.62, "[data-resolved-mark]"],
      [2.06, "[data-sketch]"],
      [2.28, '[data-material="line"]'],
      [2.36, '[data-material="flat"]'],
      [2.53, '[data-material="shaded"]'],
      [2.92, "[data-rig]"],
      [3.1, "[data-roof]"],
      [3.31, "[data-dimensions]"],
      [3.46, "[data-electrical]"],
      [3.65, "[data-water]"],
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
    await seek(page, 1.1);
    const letters = await page.evaluate(() => {
      const g = document
        .querySelector("[data-design-stage] [data-letter-g]")
        .getBoundingClientRect();
      const s = document
        .querySelector("[data-design-stage] [data-letter-s]")
        .getBoundingClientRect();
      return { ratio: s.height / g.height, upperG: g.top < s.top };
    });
    if (letters.ratio < 1.8 || !letters.upperG)
      errors.push("G/S hierarchy: require smaller upper G and dominant S");
    await seek(page, 3.65);
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
    await seek(page, 2.53);
    // Exercise a hybrid desktop: coarse primary input, but a real mouse can still move.
    await page.touchscreen.touchStart(1000, 200);
    await page.touchscreen.touchMove(1001, 201);
    await page.touchscreen.touchEnd();
    await pause();
    const touchEyes = await page.$eval(
      "[data-design-stage] [data-eyes]",
      (el) => el.getAttribute("transform"),
    );
    if (touchEyes !== "translate(0 0)")
      errors.push("Character followed touch input");
    await page.mouse.move(1000, 200);
    await pause();
    const left = await page.$eval("[data-design-stage] [data-eyes]", (el) =>
      el.getAttribute("transform"),
    );
    await page.mouse.move(300, 700);
    await pause();
    const right = await page.$eval("[data-design-stage] [data-eyes]", (el) =>
      el.getAttribute("transform"),
    );
    if (left === right) {
      const state = await page.evaluate(() => ({
        progress: document.querySelector("[data-design-stage]")?.dataset
          .progress,
        fine: matchMedia("(hover: hover) and (pointer: fine)").matches,
        hidden: document.hidden,
      }));
      errors.push(
        `Desktop eyes did not respond to pointer: ${JSON.stringify(state)}`,
      );
    }
    const pose = () =>
      page.evaluate(() =>
        Object.fromEntries(
          ["head", "hair", "character-body"].map((name) => [
            name,
            document
              .querySelector(`[data-design-stage] [data-${name}]`)
              .getAttribute("transform"),
          ]),
        ),
      );
    const initialPose = await pose();
    await page.mouse.move(1200, 350);
    await new Promise((r) => setTimeout(r, 70));
    const earlyPose = await pose();
    await pause();
    const settledPose = await pose();
    if (
      initialPose.head === settledPose.head ||
      initialPose["character-body"] === settledPose["character-body"] ||
      earlyPose.hair === settledPose.hair
    )
      errors.push(
        "Mouse must move head/body and hair must continue secondary motion",
      );
    const angle = (value) => Number(value.match(/rotate\(([-\d.]+)/)?.[1]);
    await pause();
    const stablePose = await pose();
    if (
      Math.abs(angle(stablePose.hair) - angle(settledPose.hair)) > 0.05 ||
      Math.abs(angle(stablePose.hair)) > 5
    )
      errors.push("Hair did not settle within restrained bounds");
    await page.mouse.move(-10, 0);
    await pause();
    await pause();
    const returnedPose = await pose();
    if (
      Math.abs(angle(returnedPose.hair)) > 0.05 ||
      Math.abs(angle(returnedPose.head)) > 0.05
    )
      errors.push("Head/hair did not return after pointer leave");
    await seek(page, 4.7);
    const closing = await page.$eval(
      '[data-design-stage] [data-art="convergence"]',
      (el) =>
        [...el.children].map((child) =>
          Number(getComputedStyle(child).opacity),
        ),
    );
    if (
      closing[0] < 0.95 ||
      closing.slice(1).some((opacity) => opacity < 0.6 || opacity > 0.8)
    )
      errors.push(
        "R1 closing fragments must remain visible beneath the dominant gold mark",
      );
    await page.close();
    const mobile = await open(375, 812);
    await seek(mobile, 2.53);
    await mobile.mouse.move(300, 600);
    await pause();
    const mobileEyes = await mobile.$eval(
      "[data-design-stage] [data-eyes]",
      (el) => el.getAttribute("transform"),
    );
    if (mobileEyes !== "translate(0 0)")
      errors.push("Mobile character followed pointer input");
    await mobile.close();
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
