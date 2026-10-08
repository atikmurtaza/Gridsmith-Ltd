#!/usr/bin/env node
/**
 * check-reviews-ui — the `GS-P06` review-experience gate.
 *
 * `check:reviews` asserts the **pipeline**: what the transformation emits and what the request
 * carries. This asserts the **served experience**, which is a different subject with different
 * failure modes — a component rewired, a media query edited, a stylesheet reordered, a division
 * page quietly given the feed back. Neither gate can see the other's subject.
 *
 * It answers eight questions and **names which one it answered**, because a gate with more than
 * one assertion has more than one green (`CLAUDE.md`, `K-13`).
 *
 * | # | Question |
 * |---|---|
 * | 1 | Does Master render the reviews at all? |
 * | 2 | Does **no** division page render them? (`GS-O014`, the Master-only amendment) |
 * | 3 | Does the cylinder turn on its own, and does **Pause rotation** stop it? (R1 — the cylinder is back) |
 * | 4 | **Is every review reachable and readable in full?** Next, pressed from the keyboard, brings each to the front, where it is on screen, hit-testable, and its whole text is shown — nothing scrolls inside the card and nothing is clipped. |
 * | 11 | **Is it a cylinder?** Rendered, not declared: the cards are turned to different angles, so the front card renders wider than its neighbours. |
 * | 5 | Does `prefers-reduced-motion: reduce` keep the **same cylinder, still**? (`GS-VIS-001-R1`, owner decision — it replaced the flat grid) Content parity; no automatic turn; no pause control (nothing to pause); each arrow press turns exactly one card, lands at once and holds — no easing tail, no coast; every review reachable by the arrows; a drag stops where it is released. |
 * | 6 | Does the reduced-motion layout overflow the page at any of the three widths? |
 * | 7 | Is the source link present, real and reachable by keyboard? |
 * | 8 | Do the rendered categories carry no identifying fragment? |
 * | 9 | Is every review inside the chapter `check:master:scene` measures? (what `check:axe`'s allowlist entry rests on) |
 * | 10 | Is every `<time>` on `/` inside a review card? (so every date on `/` is review text that question 9 places in the measured chapter) |
 *
 * ## Why question 2's absence is a measurement and not a hope
 *
 * `CLAUDE.md`: a green result from an absence has two readings — *the thing is absent* and
 * *nothing was injected that the gate measures* — and they are indistinguishable from an exit
 * code. Question 2 is an absence over three routes. What makes it a measurement is that
 * **question 1 fires the same selector, in the same run, against the same build**, and requires
 * it to match. A selector that had rotted would fail question 1 before question 2 could report
 * a false clean. That is the *"say which"* the rule asks for, and it is why these two questions
 * are one gate rather than two.
 *
 * ## It does not call the Freelancer API, deliberately
 *
 * `check:reviews --live` is the gate that reads `www.freelancer.com`, and `GS-P05` kept it out
 * of ordinary CI on purpose: a build that goes red because a third party is having an afternoon
 * teaches people to re-run builds. So this gate asks only the **served page**, which is the
 * system it is about. Zero review cards on `/` is still a hard failure — a gate that shrugged at
 * an empty subject would be measuring nothing — and the failure message names both of the two
 * things that produce it, because they need different fixes.
 */
import { launch } from './browser-launch.mjs';
import { AxePuppeteer } from '@axe-core/puppeteer';
import { readFileSync } from 'node:fs';
import { REVIEW_SOURCE_LABEL as SOURCE_LABEL, REVIEW_SOURCE_URL as FREELANCER_PROFILE } from '../lib/reviews/public-model.ts';
import { anonymityProblems } from './service-content-rules.mjs';
import { labelOpacitySamples, proveLabelContrast, renderedLabelContrast } from './rendered-label-contrast.mjs';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const axeSource = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');

/**
 * The only list this gate holds, which is why `check:lists`' discovery guard correctly does not
 * ask it to register a relation: there is no second list for a subject to be added to and
 * forgotten in. `reviews: true` is the presence limb, `false` is the Master-only amendment.
 */
const ROUTES = [
  { path: '/', reviews: true },
  { path: '/design', reviews: false },
  { path: '/digital', reviews: false },
  { path: '/press', reviews: false },
];

const WIDTHS = [390, 768, 1440, 1920];

/**
 * Found by rendered content, never by class name. CSS module classes are hashed, so a selector
 * built from one would be a selector that silently stops matching after an unrelated refactor —
 * and a review gate that stops matching reports *no reviews anywhere*, which is question 2's
 * green. The attribution string is the thing the block exists to say, so it is also the thing
 * whose absence should break this.
 */
const countReviewCards = (label) =>
  [...document.querySelectorAll('blockquote')].filter(
    (q) => q.closest('li')?.textContent?.includes(label),
  ).length;

const problems = [];
const say = (line) => console.log(line);
const browser = await launch();

async function captionContrast() {
  await proveLabelContrast(browser);
  for (const width of [320, 390, 1440]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    await page.setCookie({ name: 'gs_consent', value: '1', url: BASE_URL });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluateOnNewDocument(labelOpacitySamples, '[data-reviews-carousel] figure', true);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('[data-reviews-carousel][data-enhanced]');
    await page.$eval('[data-reviews-carousel]', el => el.scrollIntoView({ block: 'center' }));
    let boxes = 0, min = Infinity;
    for (const angle of [0, 40, 45, 49.9, 50.1, 60, 90]) {
      const drag = await page.$eval('[data-reviews-carousel]', (el, angle) => {
        const ring = el.querySelector('ul'), card = ring.firstElementChild;
        const at = Number(ring.style.transform.match(/rotateY\(([-\d.]+)deg/)[1]);
        const radius = card.offsetWidth * Number(el.style.getPropertyValue('--k'));
        const stage = ring.parentElement.getBoundingClientRect();
        return { x: stage.left + 8, y: Math.max(5, stage.top + 8), dx: (angle - at) * Math.PI * radius / 180 };
      }, angle);
      await page.mouse.move(drag.x, drag.y);
      await page.mouse.down();
      await page.mouse.move(drag.x + drag.dx, drag.y, { steps: 8 });
      await page.mouse.up();
      await page.waitForFunction(angle => {
        const ring = document.querySelector('[data-reviews-carousel] ul');
        const at = Number(ring.style.transform.match(/rotateY\(([-\d.]+)deg/)[1]);
        return Math.abs(at - angle) < .1;
      }, {}, angle);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const result = await renderedLabelContrast(page, '[data-reviews-carousel] figure');
      problems.push(...result.failures.map(f => `12: ${width}px ${angle}°: ${f}`));
      boxes += result.boxes; min = Math.min(min, result.min);
    }
    // Keyboard focus restores even an unpainted far-side provenance link to the reading plane.
    await page.focus('[data-review-key="review-06"] figcaption a');
    await page.waitForFunction(() => {
      const ring = document.querySelector('[data-reviews-carousel] ul');
      const card = document.querySelector('[data-review-key="review-06"]');
      const angle = Number(ring.style.transform.match(/rotateY\(([-\d.]+)deg/)[1]);
      const step = 360 / ring.children.length;
      return card.hasAttribute('data-front') && Math.abs(((angle + 5 * step) % 360 + 540) % 360 - 180) < .01;
    });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const focus = await renderedLabelContrast(page, '[data-review-key="review-06"] figure');
    problems.push(...focus.failures.map(f => `12: ${width}px focused caption: ${f}`));
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await page.focus('#main');
    const movingAt = await page.$eval('[data-reviews-carousel] ul', el => el.style.transform);
    await new Promise(r => setTimeout(r, 8500));
    const samples = await page.evaluate(() => window.__labelContrastSamples);
    if (!samples.length || samples.some(s => s.opacity !== 1)) problems.push(`12: ${width}px transitional caption opacity failed`);
    if (movingAt === await page.$eval('[data-reviews-carousel] ul', el => el.style.transform)) problems.push(`12: ${width}px autoplay sampling measured a still drum`);
    await page.click('[data-pause]');
    const paused = await renderedLabelContrast(page, '[data-reviews-carousel] figure');
    problems.push(...paused.failures.map(f => `12: ${width}px paused: ${f}`));
    console.log(`12. captions ${width}px: seven manual angles, focus, reduced motion, pause; ${boxes} glyph boxes, minimum ${min.toFixed(2)}:1; ${samples.length} frame samples`);
    await page.close();
    const nojs = await browser.newPage();
    await nojs.setViewport({ width, height: 900 });
    await nojs.setJavaScriptEnabled(false);
    await nojs.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    const staticState = await nojs.$eval('[data-reviews-carousel]', el => ({ enhanced: el.hasAttribute('data-enhanced'), figures: el.querySelectorAll('figure').length, layout: getComputedStyle(el.querySelector('ul')).display }));
    if (staticState.enhanced || staticState.figures !== 11 || staticState.layout !== 'grid') problems.push(`12: ${width}px no-JS review grid changed`);
    await nojs.$eval('[data-reviews-carousel]', el => el.scrollIntoView({ block: 'start' }));
    const fallback = await renderedLabelContrast(nojs, '[data-reviews-carousel] figure');
    problems.push(...fallback.failures.map(f => `12: ${width}px no-JS: ${f}`));
    await nojs.close();
  }
}

if (process.argv.includes('--contrast-only')) {
  try { await captionContrast(); } finally { await browser.close(); }
  if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
  console.log('check-reviews-ui: focused caption contrast PASS');
  process.exit(0);
}

try {
  await captionContrast();
  /* -- 1 and 2. Master renders them; no division does ---------------------- */

  const counts = {};
  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    const response = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle0' });
    const status = response ? response.status() : 0;
    if (status !== 200 && status !== 304) {
      console.error(`\ncheck-reviews-ui: ${route.path} returned ${status || 'no response'}.`);
      console.error('Cannot measure this route. Fix the route or the base URL.\n');
      process.exit(1);
    }

    counts[route.path] = await page.evaluate(countReviewCards, SOURCE_LABEL);

    if (route.reviews && counts[route.path] === 0) {
      problems.push(
        `1: ${route.path} renders no review card. Two things produce this and they need ` +
          'different fixes: the block was unwired, or the Freelancer API was unavailable when ' +
          'this build was made. `npm run check:reviews:live` is what tells them apart.',
      );
    }
    if (!route.reviews && counts[route.path] > 0) {
      problems.push(
        `2: ${route.path} renders ${counts[route.path]} review card(s). GS-O014 restricts the ` +
          'Freelancer feed to Master: the platform taxonomy does not map onto Design / Digital ' +
          '/ Press, and it put a 3D review and a logo review on Press.',
      );
    }
    await page.close();
  }
  say(
    `  1. master:     / renders ${counts['/']} review card(s)` +
      (counts['/'] === 0 ? ' — NONE, which is a failure' : ''),
  );
  say(
    `  2. master-only: ${ROUTES.filter((r) => !r.reviews).map((r) => `${r.path} ${counts[r.path]}`).join(', ')} ` +
      '— and question 1 above fired the same selector, so a zero here is a measurement',
  );

  /* -- 3, 4, 7, 8. The Master experience ----------------------------------- */

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  // The fixed cookie notice sits over the lower stage; it is not the subject of a hit-test.
  await page.setCookie({ name: 'gs_consent', value: '1', url: BASE_URL });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

  /**
   * **R1 brought the cylinder back, so questions 3 and 4 are about it** — found by rendered
   * content and behaviour, never by class name: the cards are the `<li>`s holding a review
   * `<blockquote>`, the front card is the one the ring presents (`data-front`), and the controls
   * are found by their accessible names — icons named by `aria-label` since `GS-VIS-001`.
   */
  const carousel = await page.evaluate(async (label) => {
    const cards = [...document.querySelectorAll('blockquote')].map((q) => q.closest('li')).filter((li) => li?.textContent?.includes(label));
    const ring = cards[0]?.parentElement;
    const button = (name) => [...document.querySelectorAll('button')].find((b) => (b.getAttribute('aria-label') ?? b.textContent ?? '').trim() === name);
    if (!ring || !button('Rotate reviews right') || !button('Pause review rotation')) return null;
    ring.scrollIntoView({ block: 'center' });
    const front = () => cards.findIndex((c) => c.hasAttribute('data-front'));
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    // 3 — it turns on its own: the pointer is not over it and nothing inside it has focus.
    const start = front();
    let turned = false;
    for (let i = 0; i < 16 && !turned; i++) {
      await wait(500);
      turned = front() !== start;
    }
    // Pause stops it, for longer than one dwell.
    button('Pause review rotation').click();
    await wait(50);
    const pausedAt = front();
    await wait(7500);
    const stayed = front() === pausedAt;
    const pressed = button('Pause review rotation').getAttribute('aria-pressed');
    button('Pause review rotation').click();
    return { cards: cards.length, turned, stayed, pressed };
  }, SOURCE_LABEL);
  if (!carousel) problems.push('3: no review carousel with "Rotate reviews right" and "Pause review rotation" controls was found on /');
  else {
    if (!carousel.turned) problems.push('3: the cylinder did not turn on its own within 8s — it is not animating');
    if (!carousel.stayed) problems.push('3: after Pause rotation the cylinder kept turning (WCAG 2.2 SC 2.2.2)');
    if (carousel.pressed !== 'true') problems.push(`3: the pause control reports aria-pressed="${carousel.pressed}" while paused`);
  }
  say(`  3. motion:     ${carousel ? `turns on its own: ${carousel.turned}; paused holds still: ${carousel.stayed}; aria-pressed while paused: ${carousel.pressed}` : 'NOT MEASURED'}`);

  // 4 — every review, from the keyboard: pause, focus Next, press Enter, read the front card.
  const reach = [];
  const total = carousel?.cards ?? 0;
  if (total) {
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.getAttribute('aria-label') === 'Pause review rotation')?.click());
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.getAttribute('aria-label') === 'Rotate reviews right')?.focus());
    for (let step = 0; step < total; step++) {
      await new Promise((r) => setTimeout(r, 1300));
      reach.push(
        await page.evaluate((label) => {
          const card = [...document.querySelectorAll('li[data-front]')].find((li) => li.textContent?.includes(label));
          if (!card) return { id: null };
          const q = card.querySelector('blockquote');
          const r = q.getBoundingClientRect();
          const hit = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(r.height, 24) / 2);
          return {
            id: q.textContent,
            onScreen: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth,
            hit: card.contains(hit),
            // Whole text fits, or the body can be scrolled because it takes focus.
            // The whole text is shown: nothing scrolls inside the card and nothing is clipped by it.
            readable: q.scrollHeight <= q.clientHeight + 1 && card.scrollHeight <= card.clientHeight + 1,
          };
        }, SOURCE_LABEL),
      );
      // Include the side cards: perspective can shrink a text link below the tap floor.
      const touch = await new AxePuppeteer(page, axeSource).include('[data-reviews-carousel]').withRules(['target-size']).analyze();
      if (touch.violations.length) problems.push(`7: review pose ${step + 1} has insufficient source-link tap targets`);
      await page.keyboard.press('Enter');
    }
    const seen = new Set(reach.map((r) => r.id).filter(Boolean));
    if (seen.size !== total) problems.push(`4: pressing Next ${total} times brought ${seen.size} of ${total} reviews to the front`);
    reach.forEach((r, i) => {
      if (!r.id) problems.push(`4: step ${i + 1} has no front card`);
      else if (!r.onScreen || !r.hit) problems.push(`4: at step ${i + 1} the front review is off screen or covered`);
      else if (!r.readable) problems.push(`4: at step ${i + 1} the front review is clipped and cannot be scrolled`);
    });
  }
  say(`  4. reachable:  ${reach.length ? `${new Set(reach.map((r) => r.id).filter(Boolean)).size} of ${total} reviews reached from the keyboard, each on screen, unobscured and readable in full` : 'NOT MEASURED'}`);
  say(`  7c. tap targets: ${reach.length} cylinder poses audited, including side-card source links`);

  // 11 — a cylinder, rendered: the front card faces the reader; its neighbour is turned away.
  // After the last step's turn has finished — mid-turn, no card is square to the reader.
  await new Promise((r) => setTimeout(r, 1500));
  const geometry = await page.evaluate((label) => {
    const cards = [...document.querySelectorAll('li')].filter((li) => li.querySelector('blockquote') && li.textContent?.includes(label));
    const i = cards.findIndex((c) => c.hasAttribute('data-front'));
    if (i < 0) return null;
    const w = (c) => c.getBoundingClientRect().width;
    return {
      front: Math.round(w(cards[i])),
      neighbour: Math.round(w(cards[(i + 1) % cards.length])),
      preserve: getComputedStyle(cards[i].parentElement).transformStyle,
    };
  }, SOURCE_LABEL);
  if (!geometry) problems.push('11: no front card — the cylinder geometry measured nothing');
  else if (!(geometry.neighbour < geometry.front * 0.95) || geometry.preserve !== 'preserve-3d') {
    problems.push(`11: not a cylinder — the front card renders ${geometry.front}px and its neighbour ${geometry.neighbour}px (${geometry.preserve})`);
  }
  say(`  11. cylinder:  ${geometry ? `front card ${geometry.front}px wide, its neighbour ${geometry.neighbour}px — turned away (${geometry.preserve})` : 'NOT MEASURED'}`);

  const link = await page.evaluate(
    (profile) => {
      const a = [...document.querySelectorAll('a')].find((el) => el.href.startsWith(profile));
      if (!a) return null;
      a.focus();
      return { href: a.href, focused: document.activeElement === a, text: a.textContent.trim() };
    },
    FREELANCER_PROFILE,
  );
  if (!link) problems.push(`7: no link to ${FREELANCER_PROFILE} on / — the quotes are unverifiable without it`);
  else if (!link.focused) problems.push('7: the profile link cannot take keyboard focus');
  say(`  7. source:     ${link ? `"${link.text}" → ${link.href}, keyboard-focusable` : 'NOT MEASURED'}`);

  await page.keyboard.press('Tab');
  const provenance = await page.evaluate((profile) => {
    const captions = [...document.querySelectorAll('[data-review-key] figcaption')];
    return captions.map((caption) => {
      const anchor = caption.querySelector('a');
      anchor?.focus();
      const style = anchor ? getComputedStyle(anchor) : null;
      return {
        correct: anchor?.href === profile && anchor?.target === '_blank' && anchor?.rel === 'noopener noreferrer' &&
          anchor?.textContent === 'Verified Freelancer review (opens in a new tab)',
        focus: document.activeElement === anchor && style?.outlineStyle !== 'none' && parseFloat(style?.outlineWidth ?? '0') >= 2,
        rating: /^\d+(?:\.\d+)? out of 5 stars$/.test(caption.closest('li')?.querySelector('[aria-label]')?.getAttribute('aria-label') ?? ''),
      };
    });
  }, FREELANCER_PROFILE);
  if (provenance.length !== 11 || provenance.some((row) => !row.correct || !row.focus || !row.rating)) {
    problems.push('7: every frozen review must have exact anonymous provenance, safe source link, visible keyboard focus and accessible rating');
  }
  say(`  7b. provenance: ${provenance.length} individual links/visible focus/rating labels measured`);

  // Foreshortened links cannot be safe pointer targets. Focus must promote each to a usable front link.
  for (let index = 0; index < 11; index++) {
    await page.$$eval('[data-review-key] figcaption a', (links, i) => links[i].focus(), index);
    await new Promise((resolve) => setTimeout(resolve, 1300));
    const usable = await page.$eval('[data-front] figcaption a', (anchor) => {
      const rect = anchor.getBoundingClientRect();
      return document.activeElement === anchor && getComputedStyle(anchor).pointerEvents !== 'none' &&
        rect.width >= 24 && rect.height >= 24 && anchor.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
    });
    if (!usable) problems.push(`7: keyboard source ${index + 1} did not become a usable front target`);
  }

  const categories = await page.evaluate(
    (label) =>
      [...document.querySelectorAll('figcaption')]
        .filter((f) => f.textContent.includes(label))
        .map((f, i) => ({ id: `card ${i}`, projectTitle: f.textContent })),
    SOURCE_LABEL,
  );
  problems.push(...anonymityProblems(categories).map((p) => `8: ${p}`));
  say(`  8. anonymity:  ${categories.length} rendered caption(s) checked against the shared denylist`);

  /* -- 9. Every review is inside the measured chapter ------------------------ */

  /**
   * **This one exists because of a decision taken in another gate.**
   *
   * The reviews sit over the WebGL scene at `GS-R001-M`, so axe cannot resolve a background for
   * their text and returns `color-contrast` **incompletes**. `check-axe`'s `INCOMPLETE_ALLOWED`
   * accepts them on the argument that `check:master:scene` question 5 measures every line of
   * text in the reviews chapter against the rendered scene behind it.
   *
   * That argument holds **only while the reviews are inside that chapter.** Until `GS-R001-M`
   * the premise was that the cylinder's cards were opaque; the premise changed with the design,
   * and the assertion changed with it rather than being left asserting a card that is gone.
   */
  const scope = await page.evaluate((label) => {
    const cards = [...document.querySelectorAll('blockquote')]
      .map((q) => q.closest('li'))
      .filter((li) => li?.textContent?.includes(label));
    return { cards: cards.length, outside: cards.filter((c) => !c.closest('[data-chapter="reviews"]')).length };
  }, SOURCE_LABEL);
  if (scope.cards === 0) problems.push('9: no review card was found — the scope assertion measured nothing');
  else if (scope.outside > 0) {
    problems.push(
      `9: ${scope.outside} review(s) sit outside [data-chapter="reviews"]. check:axe allowlists ` +
        'their color-contrast incompletes on the argument that check:master:scene measures the ' +
        'rendered scene behind every line of text in that chapter. Outside it, nothing does.',
    );
  }
  say(`  9. measured:   ${scope.cards} review(s), ${scope.outside} outside the chapter check:master:scene reads`);

  /* -- 10. Every <time> on `/` is a review date ---------------------------- */

  /**
   * The second premise `check:axe` rests on, asserted for the same reason as the first.
   *
   * Three review dates carry a `datetime` unique on the page, so axe names them
   * `time[datetime="2026-05-22"]` \u2014 no class, nothing the cylinder's allowlist pattern can
   * match. The entry that covers them keys on the bare `<time>` shape, which would ALSO accept a
   * contrast incomplete on some unrelated `<time>` added to this route later.
   *
   * So the scope is measured rather than assumed. If a `<time>` ever appears outside the review
   * cards on `/`, this goes red and that allowlist entry gets reconsidered instead of quietly
   * covering something it was never written for.
   */
  const times = await page.evaluate(
    (label) =>
      [...document.querySelectorAll('time')].map((el) => ({
        datetime: el.getAttribute('datetime'),
        inCard: Boolean(el.closest('li')?.textContent?.includes(label)),
      })),
    SOURCE_LABEL,
  );
  const stray = times.filter((t) => !t.inCard);
  if (scope.cards !== 11) problems.push('10: expected 11 frozen review cards');
  if (times.length !== 0) problems.push('10: frozen public model must not publish review dates');
  for (const t of stray) {
    problems.push(
      `10: <time datetime="${t.datetime}"> on / is NOT inside a review card. Every date on / ` +
        'is a review date and is measured as review text by check:master:scene; this one is ' +
        'neither, and needs a person to look at it.',
    );
  }
  say(`  10. time scope: ${times.length} <time> element(s) on /, ${stray.length} outside a review card`);

  /* -- 5 and 6. Reduced motion -------------------------------------------- */

  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

  /*
   * GS-VIS-001-R1 — the owner replaced the flat grid: reduced motion keeps the cylinder, still.
   * Every limb below reads a value (an angle, a count, a display) rather than an absence, and the
   * angle comes from the ring's own inline transform — the one thing the drum is drawn from.
   */
  const still = await page.evaluate(async (label) => {
    const cards = [...document.querySelectorAll('blockquote')]
      .map((q) => q.closest('li'))
      .filter((li) => li?.textContent?.includes(label));
    const ring = cards[0]?.parentElement;
    if (!ring) return { cards: 0 };
    ring.scrollIntoView({ block: 'center' });
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const angle = () => Number(/rotateY\((-?[\d.]+)deg\)/.exec(ring.style.transform)?.[1] ?? NaN);
    const front = () => cards.findIndex((c) => c.hasAttribute('data-front'));
    const button = (name) => [...document.querySelectorAll('button')].find((b) => b.getAttribute('aria-label') === name);
    await wait(600);
    // No automatic turn: the angle is a number and it does not move.
    const a0 = angle();
    await wait(3000);
    const a1 = angle();
    const pause = button('Pause review rotation');
    const right = button('Rotate reviews right');
    // Every review by the arrows, each press landing at once and holding.
    const seen = new Set([front()]);
    const lags = [];
    if (right) {
      for (let i = 0; i < cards.length; i++) {
        const before = angle();
        right.click();
        await wait(150);
        const landed = angle();
        await wait(450);
        const held = angle();
        lags.push({ moved: Math.abs(landed - before), tail: Math.abs(held - landed) });
        seen.add(front());
      }
    }
    return {
      cards: cards.length,
      ringStyle: getComputedStyle(ring).transformStyle,
      drift: Math.abs(a1 - a0),
      measured: Number.isFinite(a0) && Number.isFinite(a1),
      pauseShown: !!pause && getComputedStyle(pause).display !== 'none',
      arrows: !!right && !!button('Rotate reviews left'),
      reached: seen.size,
      step: 360 / cards.length,
      lags,
    };
  }, SOURCE_LABEL);

  // Drag: a real pointer, released mid-movement — the drum must stop where it is let go.
  let coast = null;
  if (still.cards) {
    const box = await page.evaluate(() => {
      const r = document.querySelector('[data-reviews-carousel] > div').getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + Math.min(r.height / 2, 200) };
    });
    const read = () => page.evaluate(() => Number(/rotateY\((-?[\d.]+)deg\)/.exec(document.querySelector('[data-reviews-carousel] ul').style.transform)?.[1]));
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    for (let i = 1; i <= 6; i++) await page.mouse.move(box.x + i * 30, box.y);
    const before = await read();
    await page.mouse.up();
    await new Promise((r) => setTimeout(r, 800));
    coast = { dragged: before, after: await read() };
  }

  if (still.cards !== counts['/']) {
    problems.push(
      `5: reduced motion renders ${still.cards} review(s) where the default renders ` +
        `${counts['/']}. Content parity is the requirement — a reader who asks for less motion ` +
        'does not get less evidence.',
    );
  }
  if (still.cards === 0) problems.push('5: reduced motion renders no reviews at all — the parity assertion measured nothing');
  else {
    if (still.ringStyle !== 'preserve-3d') problems.push(`5: reduced motion lost the cylinder (ring transform-style ${still.ringStyle})`);
    if (!still.measured) problems.push('5: the ring carries no rotateY angle under reduced motion — the stillness limb measured nothing');
    else if (still.drift > 0.01) problems.push(`5: the drum turned ${still.drift.toFixed(2)}° on its own in 3s under prefers-reduced-motion: reduce`);
    if (still.pauseShown) problems.push('5: the pause control is shown under reduced motion, where there is nothing to pause');
    if (!still.arrows) problems.push('5: the left/right arrow controls are missing under reduced motion');
    if (still.reached !== still.cards) problems.push(`5: the arrows reached ${still.reached} of ${still.cards} reviews under reduced motion`);
    const slow = still.lags.filter((l) => Math.abs(l.moved - still.step) > 0.5);
    const tails = still.lags.filter((l) => l.tail > 0.01);
    if (slow.length) problems.push(`5: ${slow.length} arrow press(es) did not land one card (${still.step.toFixed(2)}°) within 150ms — reduced motion must not ease`);
    if (tails.length) problems.push(`5: ${tails.length} arrow press(es) kept moving after landing — reduced motion must not coast`);
    if (!coast || !Number.isFinite(coast.dragged)) problems.push('5: the drag limb measured nothing');
    else if (Math.abs(coast.after - coast.dragged) > 0.01) problems.push(`5: after a drag was released the drum moved a further ${Math.abs(coast.after - coast.dragged).toFixed(2)}° — reduced motion must not carry inertia`);
  }
  say(
    `  5. reduced:    ${still.cards} review(s) (default ${counts['/']}), cylinder ${still.ringStyle}, ` +
      `drift ${still.measured ? `${still.drift.toFixed(2)}°/3s` : 'NOT MEASURED'}, pause control ${still.pauseShown ? 'SHOWN' : 'absent'}, ` +
      `arrows reached ${still.reached}/${still.cards}, coast after drag ${coast ? Math.abs(coast.after - coast.dragged).toFixed(2) : 'NOT MEASURED'}°`,
  );

  const overflows = [];
  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 900 });
    // Default motion too: the cylinder is wider than the page and must be clipped, not scrolled.
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    const cyl = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (cyl > 0) overflows.push(`${width}px with the cylinder (${cyl}px)`);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    const measured = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    if (measured.doc > measured.viewport) {
      overflows.push(`${width}px (document ${measured.doc}px vs viewport ${measured.viewport}px)`);
    }
  }
  for (const o of overflows) {
    problems.push(
      `6: / overflows horizontally under reduced motion at ${o}. check:responsive measures the ` +
        'default state only, so this width is unmeasured anywhere else.',
    );
  }
  say(`  6. overflow:   ${WIDTHS.length} width(s) under reduced motion — ${overflows.length === 0 ? 'none overflows' : overflows.join('; ')}`);

  await page.close();
} finally {
  await browser.close();
}

if (problems.length > 0) {
  console.error(`\ncheck-reviews-ui: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('');
  process.exit(1);
}

console.log(
  '\ncheck-reviews-ui: PASS — Master renders the feed, no division does, the cylinder turns and ' +
    'pauses, every review is reachable and readable in full from the keyboard, it renders as a ' +
    'cylinder, reduced motion keeps the cylinder still at content parity with arrows and no inertia, ' +
    'nothing overflows, the source link is reachable, no caption is identifying, every review ' +
    'is inside the chapter check:master:scene measures, and every <time> is a review date.\n',
);
