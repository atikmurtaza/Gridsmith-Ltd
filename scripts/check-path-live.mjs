#!/usr/bin/env node
/**
 * check-path-live — the 32nd gate. `K-06`/`K-07`.
 *
 * **`ETH-04` and non-negotiable #9, asserted against the rendered island rather than the data.**
 *
 * ## Why this is not a case in `check:path:selftest`
 *
 * That gate already asserts the shipped outcome records have the right shape — both honest
 * outcomes reachable, neither carrying `showCta`, each carrying guidance. It reads
 * `lib/path/seedConfig.ts`. **It cannot see whether the component reads the field it asserts.**
 * A `PathFinder.tsx` that ignored `showCta` and drew a button under every outcome would leave
 * every one of those 28 cases green, and the defect would be a call to action under *"you do
 * not need us"* — the single sentence non-negotiable #9 exists to protect.
 *
 * So the subject here is the **served page driven through five clicks**, and the question is
 * *"does the render reach the field?"*. Same division as `check-axe`'s route probe and the
 * opposite side from `check:tokens`: because the subject is the served page, the expectation is
 * **derived** from the shipped rules rather than hardcoded. A hardcoded answer set would rot the
 * day `Q-P13` replaces the seed rules, and a rotted answer set reaches no outcome at all —
 * which is the inert-probe class wearing a gate's name.
 *
 * ## The expectation is derived, and the derivation is asserted first
 *
 * Node enumerates the **entire cross-product** of the five questions' options — every
 * combination, not a convenient sample — runs the shipped `recommend()` over each, and takes
 * one answer set per outcome key plus one that returns `null`. That enumeration is then checked
 * before a browser is launched: **fewer than six outcomes, or no `null` set, is a hard failure**,
 * not a smaller run. A gate that quietly audits four outcomes because two became unreachable is
 * exactly the silent skip `CLAUDE.md` forbids, and unreachability of an honest outcome is the
 * defect this gate is for.
 *
 * `recommend()` is imported rather than reimplemented: reimplementing it would make this gate a
 * second opinion about the rules, which is not the question. It is the browser and node running
 * the *same* evaluator over the *same* rules, so any disagreement is the render.
 *
 * ## The five assertions, and each is a value or a count
 *
 * 1. **AGREES** — the island's `data-path-result` equals the key node computed. A value.
 * 2. **HONEST OUTCOME CARRIES NO CTA** — an outcome whose record says `showCta: false` renders
 *    a result panel containing **zero** links or buttons to the contact route.
 * 3. **GRIDSMITH OUTCOME CARRIES ITS CTA** — `showCta: true` renders exactly one.
 * 4. **GUIDANCE IS RENDERED** — an honest outcome's `externalGuidance` text is present in the
 *    panel. Without this, deleting the guidance and the CTA together would pass assertion 2.
 *
 * 5. **CARRIES NOTHING** (`K-14`) — every link from the result panel to the contact route
 *    resolves to a URL whose search and hash are empty. A value per link, not an absence.
 *
 * ### Why 5 is here and not a 33rd gate
 *
 * `K-14` is *"Path Finder -> contact prefill"*, and the owner decision on that row is to carry
 * **nothing** — not the five answers, not the outcome key. A query string puts a memoir
 * author's answers in browser history and in the referrer of every page the contact form links
 * to, which is the trade `PressContactFlow` already refused once for this audience. The
 * behaviour that decision requires is the behaviour the component already had, so what `K-14`
 * ships is the **enforcement**: nothing in the tree stopped a later session adding
 * `?outcome=…` to `ctaHref` and calling it a helpful prefill.
 *
 * Assertions 1–4 read the link's **pathname only**, so a query string passed all four. This is
 * the same gate's subject — the served result panel, driven through five clicks — and a second
 * gate over one subject is how two gates disagree in silence.
 *
 * It applies to **both** link sites: the Gridsmith CTA and the no-recommendation panel's link.
 * Both are a result-to-form carrier and the decision does not distinguish them.
 *
 * **Its ceiling:** it asserts the *link* carries nothing. It does not assert that no other
 * carrier exists — `sessionStorage`, a cookie, a POST. None is used anywhere in the tree today
 * (grepped at `K-14`), and a gate cannot enumerate mechanisms that do not exist; adding one
 * would be the inert-probe class. The link is the carrier the row is about.
 *
 * Assertions 2 and 3 are separate branches on purpose. One of them firing is not evidence for
 * the other — a component that rendered no CTA anywhere would satisfy 2 for both honest
 * outcomes and look clean, and only 3 says so.
 *
 * The summary prints **case count, total CTA count and the count of links carrying answer
 * data**. All three must be provable to move; the proofs are recorded on the `K-06`/`K-07` and
 * `K-14` tracker rows.
 *
 * ## The ceiling, in the gate's own words
 *
 * This asserts the island renders what the outcome record says. **It does not assert the
 * outcome record is right** — the rules are `[SEED]` and `Q-P13` is how that changes. It also
 * does not assert anything about the no-JavaScript path; the static table is `K-05` and
 * `check:axe` and `check:responsive` are what visit it.
 *
 * Expects a server already running at BASE_URL (`npm run start`).
 */
import { launch } from './browser-launch.mjs';
import { recommend } from '../lib/path/recommend.ts';
import { SEED_OUTCOMES, SEED_QUESTIONS, SEED_RULES } from '../lib/path/seedConfig.ts';

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';
const ROUTE = '/press/path-finder';
const CTA_ROUTE = '/press/contact';

const problems = [];
const fail = (message) => problems.push(message);

/* ── Derive the answer sets ─────────────────────────────────────────────────────────────── */

function crossProduct(questions) {
  let sets = [{}];
  for (const q of questions) {
    const next = [];
    for (const partial of sets) {
      for (const option of q.options) next.push({ ...partial, [q.key]: option.key });
    }
    sets = next;
  }
  return sets;
}

const allSets = crossProduct(SEED_QUESTIONS);
if (allSets.length === 0) {
  console.error('check-path-live: the cross-product is empty — there are no questions to drive.');
  process.exit(1);
}

/** One answer set per outcome key, plus one that matches no rule. First found wins. */
const cases = [];
const seen = new Set();
for (const answers of allSets) {
  const result = recommend(SEED_RULES, SEED_OUTCOMES, answers);
  const key = result.unknownOutcome ? null : result.outcome;
  const label = key ?? 'none';
  if (seen.has(label)) continue;
  seen.add(label);
  cases.push({ answers, key, outcome: key === null ? undefined : SEED_OUTCOMES.find((o) => o.key === key) });
}

/* The enumeration is checked BEFORE a browser is launched. A run over four outcomes is not a
   smaller pass; it is the gate having lost the subjects it exists for. */
const reached = SEED_OUTCOMES.filter((o) => seen.has(o.key)).map((o) => o.key);
const missing = SEED_OUTCOMES.filter((o) => !seen.has(o.key)).map((o) => o.key);
if (missing.length > 0) {
  console.error(
    `check-path-live: ${missing.length} outcome(s) are unreachable from any of the ` +
      `${allSets.length} possible answer sets and cannot be driven: ${missing.join(', ')}.\n` +
      'This is a failure, not a shorter run — an honest outcome nobody can reach is the ' +
      'defect this gate exists to catch (non-negotiable #9).',
  );
  process.exit(1);
}
if (!seen.has('none')) {
  console.error(
    'check-path-live: no answer set returns null, so the no-recommendation panel has no ' +
      'subject and would go unrendered and unmeasured. `recommend()` has no fallback by ' +
      'design and `check:path:selftest`’s NO FALLBACK case says so; if that has changed, ' +
      'this gate and that case both need revisiting.',
  );
  process.exit(1);
}

/* ── Drive them ─────────────────────────────────────────────────────────────────────────── */

const browser = await launch();
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
// Every case reloads the same URL. With the cache on, Chrome revalidates and the navigation
// reports 304 — and this gate treats a non-200 as a measurement failure rather than a pass, so
// six of seven cases correctly refused to run on the first version of this file. Turning the
// cache off is the fix; loosening the status check to "200 or 304" would have been the fix
// that makes the gate unable to tell a served page from a not-served one.
await page.setCacheEnabled(false);

let ctaTotal = 0;
let carryingTotal = 0;
let driven = 0;

for (const testCase of cases) {
  const label = testCase.key ?? 'no recommendation';
  const response = await page.goto(`${BASE_URL}${ROUTE}`, { waitUntil: 'networkidle0' });
  if (!response || response.status() !== 200) {
    fail(`${ROUTE} returned ${response ? response.status() : 'no response'} — nothing was measured for "${label}"`);
    continue;
  }

  let clicked = 0;
  for (const question of SEED_QUESTIONS) {
    const value = testCase.answers[question.key];
    const selector = `input[type="radio"][name="${question.key}"][value="${value}"]`;
    const radio = await page.$(selector);
    if (!radio) {
      fail(`"${label}": step for "${question.key}" never rendered option "${value}" (${selector})`);
      break;
    }
    await radio.click();
    // The step's own advance button. `disabled` until the step is answered, which the click
    // above has just done — so a button still disabled here is a real defect, not a race.
    const advanced = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button[type="button"]')];
      const next = buttons.find((b) => b.textContent === 'Next' || b.textContent === 'See the recommendation');
      if (!next || next.disabled) return false;
      next.click();
      return true;
    });
    if (!advanced) {
      fail(`"${label}": no enabled advance button after answering "${question.key}"`);
      break;
    }
    clicked += 1;
  }
  if (clicked !== SEED_QUESTIONS.length) continue;

  await page.waitForSelector('[data-path-result]', { timeout: 5000 }).catch(() => {});

  const rendered = await page.evaluate((contactRoute) => {
    const panel = document.querySelector('[data-path-result]');
    if (!panel) return null;
    const targets = [...panel.querySelectorAll('a[href]')].filter((a) =>
      new URL(a.href, location.origin).pathname === contactRoute,
    );
    return {
      key: panel.getAttribute('data-path-result'),
      ctaCount: targets.length,
      // Everything the link carries beyond its path. `''` is the only acceptable value —
      // see the CARRIES NOTHING assertion. Read from the resolved URL rather than the
      // attribute so a relative `?a=b` and an absolute one are the same measurement.
      ctaCarried: targets.map((a) => {
        const url = new URL(a.href, location.origin);
        return url.search + url.hash;
      }),
      text: panel.textContent ?? '',
    };
  }, CTA_ROUTE);

  if (rendered === null) {
    fail(`"${label}": five answers given and no [data-path-result] panel rendered`);
    continue;
  }

  driven += 1;
  ctaTotal += rendered.ctaCount;

  // 5. CARRIES NOTHING — `K-14`. Every link from the result to the contact route is a plain
  //    link: no query string, no fragment, nothing of the five answers and not the outcome key
  //    either. Applied to both link sites, because both are a result-to-form carrier.
  for (const carried of rendered.ctaCarried) {
    carryingTotal += carried === '' ? 0 : 1;
    if (carried !== '') {
      fail(
        `CARRIES NOTHING "${label}": the link to ${CTA_ROUTE} carries "${carried}". ` +
          'K-14 is built on carrying nothing from the result to the form — a query string ' +
          "puts a memoir author's answers in browser history and in the referrer of every " +
          'page the contact form links to.',
      );
    }
  }

  // 1. AGREES — a value, never an absence.
  const expectedKey = testCase.key ?? 'none';
  if (rendered.key !== expectedKey) {
    fail(`AGREES "${label}": node computed "${expectedKey}", the island rendered "${rendered.key}"`);
  }

  if (testCase.outcome === undefined) {
    // The no-recommendation panel. It links to contact, and that is not a CTA on an outcome —
    // it is the only useful thing to offer someone the rules did not answer.
    if (rendered.ctaCount !== 1) {
      fail(`NO-RECOMMENDATION PANEL: expected exactly 1 link to ${CTA_ROUTE}, found ${rendered.ctaCount}`);
    }
    continue;
  }

  if (testCase.outcome.showCta) {
    // 3. GRIDSMITH OUTCOME CARRIES ITS CTA.
    if (rendered.ctaCount !== 1) {
      fail(
        `GRIDSMITH CTA "${label}": showCta is true and the panel renders ${rendered.ctaCount} ` +
          `link(s) to ${CTA_ROUTE}, expected exactly 1`,
      );
    }
  } else {
    // 2. HONEST OUTCOME CARRIES NO CTA. The assertion the gate exists for.
    if (rendered.ctaCount !== 0) {
      fail(
        `ETH-04 "${label}": showCta is false and the panel renders ${rendered.ctaCount} ` +
          `link(s) to ${CTA_ROUTE}. An honest outcome must carry no call to action`,
      );
    }
    // 4. GUIDANCE IS RENDERED — so deleting the guidance and the CTA together cannot pass 2.
    const guidance = testCase.outcome.externalGuidance;
    if (!guidance) {
      fail(`ETH-04 "${label}": the outcome record carries no externalGuidance to render`);
    } else if (!rendered.text.includes(guidance)) {
      fail(`GUIDANCE "${label}": externalGuidance is not in the rendered result panel`);
    }
  }
}

await browser.close();

if (driven !== cases.length) {
  fail(`drove ${driven} of ${cases.length} answer sets to a result — the rest measured nothing`);
}

if (problems.length > 0) {
  console.error(`\ncheck-path-live: ${problems.length} problem(s)\n`);
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-path-live: ${driven} answer set(s) driven through ${SEED_QUESTIONS.length} steps — ` +
    `${reached.length} outcome(s) reached, ${ctaTotal} call(s) to action rendered across all of ` +
    `them, ${carryingTotal} of which carry answer data.`,
);
