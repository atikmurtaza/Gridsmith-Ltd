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
 * | 3 | Do the reviews stay still unless the reader scrolls? (`GS-R001-M` — was *does the ring travel right to left*) |
 * | 4 | Is every review in the flow and unobscured? (`GS-R001-M` — was *does the pause control stop it*) |
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
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

  /**
   * **`GS-R001-M` replaced the cylinder, so questions 3 and 4 changed with it.** The ring turned
   * by itself, which is why it needed a direction assertion and a WCAG 2.2 SC 2.2.2 pause
   * control. The reviews now pass under the reader's own scroll and nothing moves on its own,
   * so SC 2.2.2 has no subject — and the assertion that keeps it that way is that they do not
   * move. A pause control over still content would be a control that does nothing.
   */
  const travel = await page.evaluate(async (label) => {
    const card = [...document.querySelectorAll('blockquote')]
      .map((q) => q.closest('li'))
      .find((li) => li?.textContent?.includes(label));
    if (!card) return null;
    card.scrollIntoView({ block: 'center' });
    await new Promise((r) => setTimeout(r, 300));
    const first = card.getBoundingClientRect();
    await new Promise((r) => setTimeout(r, 1500));
    const second = card.getBoundingClientRect();
    const running = card.closest('ul').getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length;
    return { dx: Math.round(second.left - first.left), dy: Math.round(second.top - first.top), running };
  }, SOURCE_LABEL);

  if (!travel) problems.push('3: no review card was found on / — the stillness assertion measured nothing');
  else if (travel.dx || travel.dy || travel.running) {
    problems.push(
      `3: a review moved by itself (${travel.dx}px, ${travel.dy}px in 1.5s, ${travel.running} running ` +
        'animation(s)). Motion that starts on its own needs a pause control (WCAG 2.2 SC 2.2.2), ' +
        'and GS-R001-M removed the carousel so that nothing here would.',
    );
  }
  say(`  3. still:      ${travel ? `moved ${travel.dx}px/${travel.dy}px in 1.5s, ${travel.running} running animation(s)` : 'NOT MEASURED'}`);

  const flow = await page.evaluate(async (label) => {
    const cards = [...document.querySelectorAll('blockquote')]
      .map((q) => q.closest('li'))
      .filter((li) => li?.textContent?.includes(label));
    const hidden = [];
    for (const [i, card] of cards.entries()) {
      card.scrollIntoView({ block: 'center' });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const r = card.querySelector('blockquote').getBoundingClientRect();
      const cs = getComputedStyle(card);
      const hit = document.elementFromPoint(r.left + Math.min(r.width, 40) / 2, r.top + Math.min(r.height, 20) / 2);
      if (!r.width || !r.height || cs.transform !== 'none' || cs.backfaceVisibility === 'hidden' || !card.contains(hit)) hidden.push(i);
    }
    return { cards: cards.length, hidden };
  }, SOURCE_LABEL);
  if (flow.cards === 0) problems.push('4: no review card was found — the flow assertion measured nothing');
  for (const i of flow.hidden) problems.push(`4: review ${i + 1} is not in the flow or is covered where a reader would start reading it`);
  say(`  4. in flow:    ${flow.cards} review(s), each scrolled to and hit-tested at its first line; ${flow.hidden.length} obscured`);

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
  '\ncheck-reviews-ui: PASS — Master renders the feed, no division does, nothing moves by ' +
    'itself, every review is in the flow and unobscured, reduced motion is at content parity, ' +
    'nothing overflows, the source link is reachable, no caption is identifying, every review ' +
    'is inside the chapter check:master:scene measures, and every <time> is a review date.\n',
);
