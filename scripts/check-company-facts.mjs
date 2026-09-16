#!/usr/bin/env node
/**
 * check-company-facts — `GS-O004`, `GS-R001`.
 *
 * **Every company and contact fact the site publishes, asserted against the served pages.**
 *
 * ## Why this reads the served HTML
 *
 * `lib/company/companyDetails.ts` is the one reader and every render site goes through it, so a
 * source check would be asserting that the architecture is what it already visibly is. The
 * things that can actually go wrong are all downstream of that: a literal typed into a
 * component (`ContactForm` held `contact@gridsmith.uk` twice until `GS-R001`), a value in the
 * CMS singleton that nobody re-seeded (`vatNumber: "[SEED] GB123456789"` sat in the development
 * dataset for two weeks after the field was removed from the schema), a page copied from the
 * old site, or a `teamMember` record whose `isPublic` someone flipped.
 *
 * That last one is not hypothetical and is the reason this gate exists rather than a docstring:
 * `/about` published four people named `[SEED] Placeholder Name` because a boolean in a dataset
 * defaulted false and four records overrode it. **Nothing in the source was wrong.**
 *
 * ## Six questions, reported separately
 *
 * `K-13`'s lesson — a gate with several assertions has several greens, and reporting "it
 * passed" credits whichever one was on your mind. Each is named in the summary:
 *
 * 1. the statutory disclosure is present and correct in the footer of every route;
 * 2. only the approved email address is published, and every `mailto:` points at it;
 * 3. only the approved telephone number is published, and every `tel:` is the RFC 3966 form;
 * 4. the registered office appears only in the footer and in the `_legal/` instruments;
 * 5. no response-time guarantee, no SLA, no "ASAP", no published business hours;
 * 6. no public team member.
 *
 * ## The counts must be provable to move
 *
 * Three defences, none optional:
 *
 * **The predicates are proved offline first.** `check:company:selftest` breaks every rule
 * separately and reads the returned problem set, so an inert pattern fails there rather than
 * reporting a clean run here.
 *
 * **A route that serves under `MIN_TEXT` characters is a failure.** A gate whose subject is
 * served text cannot distinguish "nothing forbidden" from "nothing at all" by exit code.
 *
 * **The footer must be found on every route.** Questions 1 and 4 both depend on locating it;
 * if the extraction ever stopped matching, question 4 would scan the whole page (a red, loudly)
 * but question 1 would report a missing disclosure on every route — also loud. The failure that
 * would be quiet is the extraction matching *everything*, which `disclosureProblems` catches by
 * requiring six values inside it.
 *
 * ## What it cannot see
 *
 * The route list is hardcoded rather than crawled — an expectation derived from its own subject
 * cannot fail when the subject is removed. A route added later is not covered until it is added
 * here, and `check:lists` asserts the relation between this list and its exemption list.
 *
 * It asserts what the site **publishes**. It cannot tell whether `contact@gridsmith.uk` receives
 * mail; the owner confirmed that at `GS-O004` and no gate can re-confirm it.
 */

import {
  FACTS,
  disclosureProblems,
  emailProblems,
  officeProblems,
  phoneProblems,
  responseProblems,
  teamProblems,
} from './company-facts-rules.mjs';

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';

/**
 * Hardcoded. One route per shape: the four landings, both contact journeys and their
 * confirmation, the structure disclosure, one service page per division, and the legal set —
 * which is where the address for service legitimately appears in the body.
 */
const ROUTES = [
  '/',
  '/about',
  '/approach',
  '/contact',
  '/insights',
  '/design',
  '/design/services/technical-documentation',
  '/digital',
  '/digital/services/website-design-build',
  '/press',
  '/press/path-finder',
  '/press/contact',
  '/press/contact/thank-you',
  '/press/services/publishing-preparation',
  '/legal/privacy',
  '/legal/terms',
  '/legal/consumer-client-terms',
  '/legal/business-client-terms',
];

/**
 * Routes where the registered office may appear in the body — question 4's exemption.
 *
 * These are the `_legal/` instruments, which name it as the address for service. Every key must
 * be in `ROUTES`; `check:lists` asserts that, which is the `K-13` relation.
 */
const OFFICE_ALLOWED = [
  '/legal/privacy',
  '/legal/terms',
  '/legal/consumer-client-terms',
  '/legal/business-client-terms',
];

/** Below this, a served route carried no text worth the name and the scan measured nothing. */
const MIN_TEXT = 200;

/**
 * **Everything below measures `withoutScripts(html)`, never `html`. That is the difference
 * between a gate that works and one that reports a defect on every route.**
 *
 * A React Server Components page carries its own flight payload in inline
 * `self.__next_f.push(...)` scripts at the end of `<body>`, and that payload is a serialisation
 * of the whole tree: every prop, every `href`, and the footer's text — **after** the
 * `</footer>` element, where nothing that splits on the element can see it.
 *
 * This gate's first two runs went red on 22 and then 57 routes for exactly that reason, in two
 * rounds, which is the part worth recording. Round one stripped tags but not script *contents*,
 * so question 3 read a `tel:` out of the payload and reported it as a second, unformatted phone
 * number, and question 4 read the registered office out of it and reported it as displayed
 * outside the footer on every page. Round one's fix stripped scripts before the **text**
 * extraction and left the **href** scans reading raw markup — so question 2 then reported a
 * `mailto:` pointing at `contact@gridsmith.uk\\`, an address that exists nowhere except in the
 * payload's own backslash escaping.
 *
 * Both rounds were the gate. Fixing the symptom each time would have taken a third round, and
 * the third one would have been question 3's `tel:` href. **The subject is the markup a browser
 * renders**, so scripts and styles come out once, at the top, and every question reads what is
 * left. A payload-derived reading is not a weaker measurement — it is a measurement of a
 * different document.
 */
const withoutScripts = (html) =>
  html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ');

/** Markup to the text a reader receives. Entity decoding is only what the site emits. */
const strip = (markup) =>
  markup
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"');

/**
 * The statutory footer, located by the `<footer>` element the chrome renders.
 *
 * Returns both halves so questions 1 and 4 read the same split: a page whose footer could not
 * be found yields `''` for the footer, which `disclosureProblems` turns into a hard failure
 * rather than a silent pass.
 */
function splitFooter(html) {
  const start = html.search(/<footer\b/i);
  if (start === -1) return { footer: '', body: html };
  const end = html.lastIndexOf('</footer>');
  if (end === -1 || end < start) return { footer: '', body: html };
  return {
    footer: html.slice(start, end),
    body: html.slice(0, start) + html.slice(end),
  };
}

const problems = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
const counted = { routes: 0, chars: 0, footers: 0, emails: 0, phones: 0, offices: 0 };
const thin = [];

for (const route of ROUTES) {
  const res = await fetch(BASE_URL + route).catch((e) => ({ ok: false, status: 0, error: e }));
  if (!res.ok) {
    problems[1].push(
      `${route} returned ${res.status || 'no response'} — nothing on it was measured.`,
    );
    continue;
  }
  counted.routes += 1;

  // One strip, at the top. See `withoutScripts`.
  const markup = withoutScripts(await res.text());
  const { footer, body } = splitFooter(markup);
  const text = strip(markup).replace(/\s+/g, ' ').trim();
  const bodyText = strip(body).replace(/\s+/g, ' ').trim();
  const footerText = strip(footer).replace(/\s+/g, ' ').trim();

  counted.chars += text.length;
  if (footerText.length > 0) counted.footers += 1;
  if (text.includes(FACTS.contactEmail)) counted.emails += 1;
  if (text.includes(FACTS.contactPhone)) counted.phones += 1;
  if (text.includes(FACTS.registeredOffice)) counted.offices += 1;
  if (text.length < MIN_TEXT) thin.push(`${route} (${text.length})`);

  problems[1].push(...disclosureProblems(route, footerText));
  problems[2].push(...emailProblems(route, text, markup));
  problems[3].push(...phoneProblems(route, text, markup));
  problems[4].push(...officeProblems(route, bodyText, OFFICE_ALLOWED.includes(route)));
  problems[5].push(...responseProblems(route, text));
  problems[6].push(...teamProblems(route, text));
}

const all = Object.values(problems).flat();

if (counted.routes !== ROUTES.length) {
  all.push(`measured ${counted.routes} of ${ROUTES.length} route(s) — an unserved route is not a pass.`);
}
if (thin.length > 0) {
  all.push(
    `${thin.length} route(s) served under ${MIN_TEXT} characters of text: ${thin.join(', ')}. ` +
      'The subject is served text, so those routes measured nothing — which reads exactly like ' +
      'compliance.',
  );
}
if (counted.footers !== counted.routes) {
  all.push(
    `found a statutory footer on ${counted.footers} of ${counted.routes} served route(s). ` +
      'Questions 1 and 4 both read that split, so a route without one measured neither.',
  );
}

if (all.length > 0) {
  console.error(`\ncheck-company-facts: ${all.length} problem(s) against ${BASE_URL}\n`);
  for (const [q, list] of Object.entries(problems)) {
    for (const p of list) console.error(`  ${q}: ${p}\n`);
  }
  for (const p of all.filter((p) => !Object.values(problems).flat().includes(p))) {
    console.error(`  *: ${p}\n`);
  }
  process.exit(1);
}

console.log(
  `  1. disclosure: ${counted.footers} statutory footer(s), each carrying ${FACTS.legalName}, ` +
    `registered in ${FACTS.placeOfRegistration}, ${FACTS.companyNumber}, the registered office, ` +
    `${FACTS.contactEmail} and ${FACTS.contactPhone}`,
);
console.log(
  `  2. email: ${FACTS.contactEmail} on ${counted.emails} route(s); no legacy or placeholder ` +
    'address, and every mailto: points at it',
);
console.log(
  `  3. phone: ${FACTS.contactPhone} on ${counted.phones} route(s); every tel: is ` +
    `${FACTS.telHref}`,
);
console.log(
  `  4. registered office: ${counted.offices} occurrence-carrying route(s), none outside the ` +
    `statutory footer except the ${OFFICE_ALLOWED.length} _legal/ instrument(s) that name it ` +
    'as the address for service',
);
console.log('  5. response wording: no guarantee, no SLA, no "ASAP", no published business hours');
console.log('  6. public team: none');
console.log(
  `\ncheck-company-facts: PASS — 6 question(s) over ${counted.routes} route(s), ` +
    `${counted.chars} character(s) of served text`,
);
