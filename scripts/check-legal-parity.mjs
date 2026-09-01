#!/usr/bin/env node
/**
 * check-legal-parity
 *
 * **The legal pages the site serves are the drafts in `docs/_legal/`.**
 *
 * ## The defect this exists for
 *
 * `docs/_legal/07-STATE-REPORT.md` §0: *"The drafts and the published site are two different
 * documents, and nobody has been comparing them."* Findings F-1 to F-7 are seven live
 * divergences and **not one of them failed a build**. The worst two:
 *
 * **F-1.** The served consumer terms were the **pre-round-9 instrument** — a flat 14-day
 * cancellation right for every consumer with no reg. 27(1) scope, the period run from the
 * contract date in every case, and a flat 14-day refund promise that round 9 removed because
 * reg. 34(5) does not give it for returned goods. Under `L-CRA-50` a statement a consumer takes
 * into account becomes a term, so **the site was binding Gridsmith to a concession nobody
 * chose**, from a document that had been superseded five days earlier. §5A, §5.0, §5.2–§5.5 and
 * §6A did not exist on the site at all.
 *
 * **F-2.** The served privacy policy stated retention as fact — *"kept for 24 months … then
 * deleted"* — while the draft records retention as **NOT IMPLEMENTED**: no purge, no
 * anonymisation, no scheduled delete. The site told a data subject their data was deleted by a
 * job that does not exist.
 *
 * Both are the same shape, and it is the shape the reseed alone does not fix: a reseed makes
 * the two agree **today**, and the next revision to a draft parts them again silently.
 *
 * ## What it compares, and why the served page rather than the seed script
 *
 * The choice was between comparing the markdown against **`scripts/seed-legal.mjs`** and
 * comparing it against the **served page**. The served page wins, on three grounds:
 *
 * **1. Coverage is a strict superset.** Both catch a draft edited without the seed being
 * updated. Only the served-page comparison catches a seed updated and **never reseeded** —
 * which is half of what F-1 actually was: `seed-legal.mjs` was touched by round 10 for the
 * analytics sections and the consumer terms had not been reseeded since before round 8. A
 * source-to-source check would have gone green over a CMS serving a superseded instrument.
 *
 * **2. It is the instrument a customer reads.** `L-CRA-50` attaches to what was said to the
 * consumer, not to what a repository intended to say. A gate asserting a fact about a document
 * nobody receives is asserting the wrong fact — and the `check-axe` defect that motivated
 * `CLAUDE.md`'s rule about gates inferring remote state was exactly this: reading the runner's
 * own environment while asserting the server's behaviour.
 *
 * **3. The cost is already paid.** The argument against is that it needs a running site.
 * `verify:served` already starts one through `scripts/with-server.mjs`, and
 * `check-consumer-terms.mjs` already reads served legal pages from behind it. This gate is one
 * more command in that list, not a new capability.
 *
 * **The trade, stated plainly.** This gate **cannot run in `verify:static`**, so a developer
 * editing a draft does not learn of a divergence until a build and a server exist. It also
 * requires a populated dataset: on an empty one every route 404s, which this gate reports as a
 * failure rather than as nothing to measure — see branch D. The source-to-source alternative
 * would have run in milliseconds on a bare checkout and would have been reassuring about a
 * question nobody was asking.
 *
 * ## The four branches
 *
 * **A — version parity.** The version the draft declares must equal the version the page
 * renders. This is the cheapest and the strongest single assertion in the file: a draft revised
 * without a reseed fails here on the first line, before any prose is compared, and a stale
 * version header fails here even when the prose happens to agree.
 *
 * **A2 — the draft agrees with itself.** Where a draft carries a `**Version:**` header, that
 * header must be the highest version the file declares anywhere. `WEBSITE-TERMS.md` read
 * `Version: 1.1` while its own round-8 note directly beneath announced 1.2, and it stayed that
 * way through a full verification pass (`07-STATE-REPORT.md` F-9) because **nothing in the
 * build read a draft's version header**.
 *
 * **B — content containment.** Every paragraph the page publishes inside a clause must appear,
 * as a contiguous run of words, in the draft. **This is the over-promise direction** — the one
 * F-1 and F-2 ran in. The site cannot say anything the reviewed draft does not say.
 *
 * **C — clause coverage.** Every numbered clause the draft declares must be reachable from a
 * clause number the page serves. **This is the omission direction** — the site cannot quietly
 * drop §5A and §6A and pass B by saying less.
 *
 * **D — the subject asserts that it is still the subject.** Each page is 200, carries an `<h1>`,
 * serves at least one clause, and carries the unapproved-draft banner. Without D, deleting a
 * CMS document turns every other branch green: a 404 publishes no paragraph the draft lacks
 * (B passes vacuously) and declares no version to disagree (A is skipped). The banner is in
 * because all seven documents are `solicitorApproved: false` today, and a page that has quietly
 * stopped announcing itself as a draft is a different failure worth the same red.
 *
 * ## Counts
 *
 * `EXPECTED_DOCS` is a **literal**, not `Object.keys(...).length`. An expectation read from its
 * own subject cannot fail when the subject is removed — deleting a slug from
 * `LEGAL_DRAFT_SOURCES` would delete the expectation with it and leave this gate green having
 * measured less. Every counter is incremented inside the loop that measures, so a non-zero
 * value can only come from a loop that executed, and a zero paragraph count is a failure rather
 * than a clean run.
 *
 * ## What this gate cannot see, by construction
 *
 * **It asserts that the page matches the draft. It never asserts that the draft is right.**
 * A defect the draft and the page share is invisible to it, and there are two live today,
 * both recorded in `07-STATE-REPORT.md`:
 *
 * **F-11.** `CONSUMER-TERMS.md` §5's headline sentence still promises *"we will refund all
 * payments received from you within 14 days of being told"*, while §5.3 — deferred to two
 * clauses later — runs that clock from the **return of the goods** under reg. 34(5). Under
 * `L-CRA-50` the headline is the one a consumer takes into account, so **this is an
 * over-promise inside a reviewed draft**, and the page reproduces it faithfully. The gate is
 * green and correct to be green.
 *
 * **F-10.** §5.0's digital-content bullet points the reader to §6A for the *period*. §6A
 * states when the right is **lost**, not how long it lasts, so a consumer buying a file is
 * left without one.
 *
 * This is a **CEILING, not a gap** — it is the boundary of what a parity assertion can be,
 * not a branch someone forgot to write. Widening it would mean asserting that a clause is
 * *legally sound*, which is the solicitor review (`L-04`) and cannot be mechanised. It is
 * stated here rather than left implicit precisely because a green line from this gate is
 * otherwise easy to read as "the legal copy is fine", and what it means is narrower:
 * **"the legal copy is the copy that was reviewed."**
 *
 * The same boundary in one sentence: this gate closes the gap between the draft and the site;
 * it opens nothing on the gap between the draft and the law.
 *
 * ## The one slug this cannot cover, named in every run
 *
 * `/legal/client-terms` has **no `docs/_legal/` draft**, because it is not an instrument: it is
 * the disambiguation page the owner's 26 August 2026 routing decision created, carrying no
 * operative clause. There is nothing to compare it against, so it is excluded — and the
 * exclusion is printed on every successful run rather than left implicit, because a gate that
 * silently covers six of seven reads exactly like a gate that covers seven.
 * `scripts/check-consumer-terms.mjs` is what guards that page.
 *
 * ## Proven by deliberate failure
 *
 * Each branch, separately — `docs/_shared/FIX-LEDGER.md`. The predicates live in
 * `legal-parity-rules.mjs` and are exercised against committed specimens by
 * `check-legal-parity.selftest.mjs`, which runs in `verify:static` where no server exists.
 */
import { readFileSync } from 'node:fs';
import { LEGAL_DRAFT_SOURCES } from './seed-legal.mjs';
import {
  containsRun,
  currentVersion,
  declaredVersions,
  draftClauseTokens,
  normaliseWords,
  tokenReached,
} from './legal-parity-rules.mjs';

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';
const DRAFTS = 'docs/_legal/';

/** Hardcoded. See the docstring — an expectation derived from its subject cannot fail. */
const EXPECTED_DOCS = 6;

/** The slug with no draft, named in the output rather than silently skipped. */
const UNCOVERED = 'client-terms';

const problems = [];
const counted = { docs: 0, clauses: 0, paragraphs: 0, tokens: 0 };

/** `<section id="clause-…">…</section>` — the template renders one per clause. */
const clauseSections = (html) => [
  ...html.matchAll(/<section id="(clause-[^"]+)"[^>]*>([\s\S]*?)<\/section>/g),
];

const stripTags = (s) => s.replace(/<[^>]*>/g, ' ');

/** HTML entities the renderer emits. Enough for text this template produces. */
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));

for (const [slug, file] of Object.entries(LEGAL_DRAFT_SOURCES)) {
  if (!file) continue;
  counted.docs += 1;

  const markdown = readFileSync(DRAFTS + file, 'utf8');
  const draftWords = normaliseWords(markdown);
  const route = `/legal/${slug}`;

  const res = await fetch(BASE_URL + route).catch((e) => ({ ok: false, status: 0, error: e }));
  if (!res.ok) {
    // Branch D. A route that does not serve is not a route that passes: nothing was measured
    // on it, and reporting that as clean is how a deleted CMS document goes unnoticed.
    problems.push(
      `${route} returned ${res.status || 'no response'} — nothing was measured against ` +
        `${file}. An empty or unseeded dataset fails here rather than passing quietly.`,
    );
    continue;
  }
  const html = await res.text();

  // Branch D — the page is the document this gate thinks it is measuring.
  const h1 = decode(stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '')).trim();
  if (!h1) {
    problems.push(`${route} serves no <h1>. The route resolves but the document did not render.`);
  }
  if (!/DRAFT — NOT YET REVIEWED BY A SOLICITOR/i.test(html)) {
    problems.push(
      `${route} does not carry the unapproved-draft banner. All seven documents are ` +
        'solicitorApproved: false, so either one was approved without this gate being told, ' +
        'or the banner stopped rendering — and a draft presented as reviewed is the outcome ' +
        'that banner exists to prevent.',
    );
  }

  // Branch A — version parity, and A2, the draft agreeing with itself.
  const draftVersion = currentVersion(markdown);
  const servedVersion = html.match(/Version\s+([0-9]+\.[0-9]+)/)?.[1] ?? null;
  if (draftVersion === null) {
    problems.push(`${file} declares no version at all, so nothing can be compared to ${route}.`);
  } else if (servedVersion !== draftVersion) {
    problems.push(
      `${route} serves version ${JSON.stringify(servedVersion)} and ${file} is at ` +
        `${draftVersion}. The published instrument is not the reviewed one. If the draft was ` +
        'revised, reseed; if the seed was revised, the draft has not caught up. Either way a ' +
        'reader is being given a document nobody signed off.',
    );
  }
  const { header } = declaredVersions(markdown);
  if (header && draftVersion && header !== draftVersion) {
    problems.push(
      `${file} disagrees with itself: the **Version:** header says ${header} and the file ` +
        `declares ${draftVersion} further down. 07-STATE-REPORT.md F-9. The version a ` +
        'reviewer cites may not be the version they read.',
    );
  }

  // Branches B and C need the clauses.
  const sections = clauseSections(html);
  const servedNumbers = [];
  for (const [, anchor, inner] of sections) {
    counted.clauses += 1;

    // The clause number is the first span inside the heading.
    const heading = inner.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? '';
    const number = decode(stripTags(heading.match(/<span[^>]*>([\s\S]*?)<\/span>/)?.[1] ?? '')).trim();
    if (number) servedNumbers.push(number);

    // Branch B. Only `<p>` inside the clause body — the heading is the clause's own number and
    // the `Basis:` line is editorial, neither of which is draft prose.
    const body = inner.replace(/<h2[\s\S]*?<\/h2>/, ' ');
    for (const [, paragraph] of body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)) {
      const text = decode(stripTags(paragraph)).trim();
      if (!text || /^Basis:/.test(text)) continue;
      counted.paragraphs += 1;
      const words = normaliseWords(text);
      if (words.length === 0) continue;
      if (!containsRun(draftWords, words)) {
        // Report where it stops matching. A whole paragraph in the error is unreadable and
        // the first divergent word is the whole of the information.
        let cut = words.length;
        while (cut > 1 && !containsRun(draftWords, words.slice(0, cut))) cut -= 1;
        problems.push(
          `${route} ${anchor} publishes text that is not in ${file}:\n` +
            `      matched: …${words.slice(Math.max(0, cut - 10), cut).join(' ')}\n` +
            `      then:    ${words.slice(cut, cut + 14).join(' ')}…\n` +
            '      The page may not say anything the reviewed draft does not say. If the ' +
            'wording is right, it belongs in the draft first.',
        );
      }
    }
  }

  if (sections.length === 0) {
    problems.push(
      `${route} served no clause at all. Every branch below it then passes by having nothing ` +
        'to measure, which is the failure mode a 404 would at least have announced.',
    );
  }

  // Branch C — every clause the draft declares is reachable.
  for (const entry of draftClauseTokens(markdown)) {
    counted.tokens += 1;
    if (!tokenReached(entry, servedNumbers)) {
      problems.push(
        `${file} declares clause ${entry.token}${entry.exact ? ' as a section of its own' : ''} ` +
          `and ${route} serves no clause covering it ` +
          `(served: ${servedNumbers.join(', ') || 'none'}). The site is publishing less than ` +
          'the reviewed instrument — which is how §5A, §5.0, §5.2–§5.5 and §6A were absent ' +
          'from the consumer terms for five days without a build going red.',
      );
    }
  }
}

if (problems.length > 0) {
  console.error(`\ncheck-legal-parity: ${problems.length} problem(s) against ${BASE_URL}\n`);
  for (const p of problems) console.error(`  ${p}\n`);
  console.error(
    'The served legal pages and docs/_legal/ must be the same documents. 07-STATE-REPORT.md\n' +
      'F-1 to F-7 are what happens when nothing checks: a superseded consumer instrument\n' +
      'published for five days, and a retention promise enforced by a job that does not exist.\n',
  );
  process.exitCode = 1;
} else if (counted.docs !== EXPECTED_DOCS) {
  console.error(
    `\ncheck-legal-parity: measured ${counted.docs} document(s), expected ${EXPECTED_DOCS}. ` +
      'The expectation is a literal precisely so that removing an entry from ' +
      'LEGAL_DRAFT_SOURCES fails here instead of silently measuring less.\n',
  );
  process.exitCode = 1;
} else if (counted.paragraphs === 0 || counted.tokens === 0) {
  console.error(
    `\ncheck-legal-parity: ${counted.paragraphs} paragraph(s) and ${counted.tokens} clause ` +
      'token(s) compared. A zero on either side means the extraction broke and the ' +
      'comparison reached nothing — which reads exactly like agreement.\n',
  );
  process.exitCode = 1;
} else {
  console.log(
    `check-legal-parity: ${counted.docs} document(s), ${counted.clauses} served clause(s), ` +
      `${counted.paragraphs} paragraph(s) matched word-for-word against the drafts, ` +
      `${counted.tokens} draft clause(s) all reachable`,
  );
  console.log(
    `check-legal-parity: /legal/${UNCOVERED} is NOT covered — it has no docs/_legal/ draft ` +
      'because it carries no operative clause. check-consumer-terms.mjs guards it.',
  );
}
