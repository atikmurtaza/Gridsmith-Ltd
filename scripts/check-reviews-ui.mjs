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
 * | 5 | Does `prefers-reduced-motion: reduce` get a still layout with the same reviews? |
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
import { SOURCE_LABEL, FREELANCER_PROFILE } from '../lib/reviews/freelancer.ts';
import { anonymityProblems } from './service-content-rules.mjs';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

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

const WIDTHS = [375, 768, 1440];

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

try {
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
   * are found by their visible names.
   */
  const carousel = await page.evaluate(async (label) => {
    const cards = [...document.querySelectorAll('blockquote')].map((q) => q.closest('li')).filter((li) => li?.textContent?.includes(label));
    const ring = cards[0]?.parentElement;
    const button = (name) => [...document.querySelectorAll('button')].find((b) => b.textContent?.trim().includes(name));
    if (!ring || !button('Next') || !button('Pause rotation')) return null;
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
    button('Pause rotation').click();
    await wait(50);
    const pausedAt = front();
    await wait(7500);
    const stayed = front() === pausedAt;
    const pressed = button('Pause rotation').getAttribute('aria-pressed');
    button('Pause rotation').click();
    return { cards: cards.length, turned, stayed, pressed };
  }, SOURCE_LABEL);
  if (!carousel) problems.push('3: no review carousel with Next and Pause rotation controls was found on /');
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
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent?.trim().includes('Pause rotation'))?.click());
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent?.trim().startsWith('Next'))?.focus());
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
  if (times.length === 0) problems.push('10: / has no <time> at all — the scope assertion measured nothing');
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

  const still = await page.evaluate((label) => {
    const cards = [...document.querySelectorAll('blockquote')]
      .map((q) => q.closest('li'))
      .filter((li) => li?.textContent?.includes(label));
    const ring = cards[0]?.parentElement;
    return {
      cards: cards.length,
      ringStyle: ring ? getComputedStyle(ring).transformStyle : null,
      animated: ring ? getComputedStyle(ring).animationName !== 'none' : null,
      transformed: cards.filter((c) => getComputedStyle(c).transform !== 'none').length,
      stacked: cards.filter((c) => getComputedStyle(c).backfaceVisibility === 'hidden').length,
    };
  }, SOURCE_LABEL);

  if (still.cards !== counts['/']) {
    problems.push(
      `5: reduced motion renders ${still.cards} review(s) where the default renders ` +
        `${counts['/']}. Content parity is the requirement — a reader who asks for less motion ` +
        'does not get less evidence.',
    );
  }
  if (still.cards === 0) problems.push('5: reduced motion renders no reviews at all — the parity assertion measured nothing');
  if (still.animated) problems.push('5: the ring still carries an animation under prefers-reduced-motion: reduce');
  if (still.ringStyle === 'preserve-3d') {
    problems.push(
      '5: the ring is still `transform-style: preserve-3d` under reduced motion. Stopping the ' +
        'rotation is not the same as undoing the cylinder: twelve cards frozen at fixed 3D ' +
        'angles in one grid cell is not a readable page, and most of them are backface-hidden.',
    );
  }
  if (still.transformed > 0) problems.push(`5: ${still.transformed} card(s) are still 3D-transformed under reduced motion`);
  if (still.stacked > 0) problems.push(`5: ${still.stacked} card(s) are still backface-hidden under reduced motion`);
  say(
    `  5. reduced:    ${still.cards} review(s) (default ${counts['/']}), animation ` +
      `${still.animated ? 'STILL RUNNING' : 'none'}, transform-style ${still.ringStyle}, ` +
      `${still.transformed} card(s) transformed`,
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
    'cylinder, reduced motion is a still grid at content parity, ' +
    'nothing overflows, the source link is reachable, no caption is identifying, every review ' +
    'is inside the chapter check:master:scene measures, and every <time> is a review date.\n',
);
