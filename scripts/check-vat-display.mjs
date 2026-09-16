#!/usr/bin/env node
/**
 * check-vat-display
 *
 * **No price this site serves may be presented as VAT-exclusive, and no VAT number may be
 * published.** Gridsmith Ltd is not VAT registered. The Electronic Commerce (EC Directive)
 * Regulations 2002 reg. 6(1)(g) requires a VAT identification number only *"where the provider
 * undertakes an activity subject to VAT"*, so publishing one would be a false disclosure; and
 * reg. 6(2) requires a price to indicate its tax treatment, which for a non-registered trader
 * is satisfied by the price being the amount charged rather than by a label.
 *
 * ## Why this exists as a gate rather than as a rule in a docstring
 *
 * The 2 September 2026 change removed the `vatNumber` field, the footer line, the `/about` row
 * and the seeded placeholder, and closed `M-P2-3` by deciding there is no net/gross field. All
 * of that is source. **None of it asserts anything about the page a visitor receives**, and the
 * defect being prevented — `[SEED] GB123456789` in the footer of every page — was a rendered
 * defect that source review had passed over for weeks. `CLAUDE.md`: a fix is not fixed until a
 * permanent committed subject exists for a gate to reach.
 *
 * So this reads the served HTML, like `check-legal-parity.mjs` and for the same reason.
 *
 * ## The count must be provable to move
 *
 * A regex that can never match reports clean forever. Two defences, and neither is optional:
 *
 * **The specimens below are asserted before any route is fetched.** Each is a string that a
 * VAT-exclusive page would contain, and the predicate must reject every one of them; a clean
 * string must be accepted. If the pattern is ever edited into something inert, this fails here,
 * offline, before it has a chance to report a green run against the live site.
 *
 * **Every route must yield text, and a route that yields none is a failure.** This used to require
 * a non-zero *price* count, because the assertion was about prices and a run that found none had
 * measured nothing. `GS-D002` (`GS-P03`) removed every public price, so zero prices is now the
 * correct state and that guard would fail a compliant site. The subject is the served text of each
 * route — VAT labelling and a VAT number can appear in any prose, not only beside a figure — so the
 * guard moved to the thing actually scanned: a route that serves under `MIN_TEXT` characters of
 * text after tags are stripped measured nothing, whatever its status code says. The price count is
 * still reported, because a figure reappearing is worth seeing.
 *
 * ## What it cannot see
 *
 * It reads the routes named below — the division landings, the master pages and the legal set. A
 * route added later is not covered until it is added here — the list is hardcoded rather than
 * crawled, for the same reason `check-consumer-terms.mjs` hardcodes its own: an expectation
 * derived from its subject cannot fail when the subject is removed.
 */

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';

/** Hardcoded. The public master and division pages, plus the instruments that describe charging. */
const ROUTES = [
  '/',
  '/about',
  '/design',
  '/digital',
  '/press',
  '/contact',
  // `/work` was removed at `GS-P03` with the route.
  //
  // The three service pages are `GS-P04` additions, and they are the routes this gate most
  // needs: `GS-D002` removed every price FIELD, so the only way a figure returns is as prose an
  // editor types into a summary, a description or a deliverable detail — and a service page is
  // where someone would type it. One per division, because they are one template under three
  // themes and the gate reads served text.
  '/design/services/technical-documentation',
  '/digital/services/website-design-build',
  '/press/services/publishing-preparation',
  '/insights',
  '/legal/privacy',
  '/legal/cookies',
  '/legal/terms',
  '/legal/client-terms',
  '/legal/business-client-terms',
  '/legal/consumer-client-terms',
  '/legal/accessibility',
];

/** A price presented as exclusive of — or labelled for — VAT. */
const VAT_LABELLED = /\+\s*VAT|VAT[-\s]?exclusive|ex(?:cl?)\.?\s*VAT|inc\.?\s*VAT|plus\s+VAT|excluding\s+VAT|including\s+VAT/i;

/** A published VAT registration number, real or placeholder. */
const VAT_NUMBER = /\bGB\s?[0-9]{9}\b/;

/**
 * Specimens. Each rejected string is a form the defect actually takes; each accepted string is
 * prose this site legitimately serves and must not fire on.
 */
const SPECIMENS = [
  ['From £4,000 + VAT', VAT_LABELLED, true],
  ['£4,000 exc. VAT', VAT_LABELLED, true],
  ['£4,000 excl VAT', VAT_LABELLED, true],
  ['Prices are VAT-exclusive', VAT_LABELLED, true],
  ['£4,000 inc. VAT', VAT_LABELLED, true],
  ['£4,000 plus VAT', VAT_LABELLED, true],
  ['a total price including VAT and all charges', VAT_LABELLED, true],
  ['VAT number GB123456789', VAT_NUMBER, true],
  ['VAT number GB 123456789', VAT_NUMBER, true],
  // The prose the instruments do carry, which is a statement about registration rather than a
  // label on a price. If this ever fired, the gate would be unusable and would be silenced.
  ['Gridsmith Ltd is not currently registered for VAT and does not charge VAT.', VAT_LABELLED, false],
  ['A price shown on this website is the amount charged.', VAT_LABELLED, false],
  ['From £4,000', VAT_LABELLED, false],
  ['Gridsmith Ltd is not currently registered for VAT', VAT_NUMBER, false],
];

const problems = [];

for (const [text, pattern, shouldMatch] of SPECIMENS) {
  if (pattern.test(text) !== shouldMatch) {
    problems.push(
      `specimen ${JSON.stringify(text)} was ${shouldMatch ? 'accepted' : 'rejected'} by a ` +
        'pattern that must do the opposite. The predicate is broken, so a clean run against ' +
        'the live site would have meant nothing.',
    );
  }
}

if (problems.length > 0) {
  console.error('\ncheck-vat-display: the predicate failed its own specimens.\n');
  for (const p of problems) console.error(`  ${p}\n`);
  process.exit(1);
}

/** Below this, a served route carried no text worth the name and the scan measured nothing. */
const MIN_TEXT = 200;

const counted = { routes: 0, prices: 0, chars: 0 };
const empty = [];

for (const route of ROUTES) {
  const res = await fetch(BASE_URL + route).catch((e) => ({ ok: false, status: 0, error: e }));
  if (!res.ok) {
    problems.push(
      `${route} returned ${res.status || 'no response'} — nothing was measured on it. A route ` +
        'that does not serve is not a route that passes.',
    );
    continue;
  }
  counted.routes += 1;

  const text = (await res.text()).replace(/<[^>]*>/g, ' ');
  counted.prices += [...text.matchAll(/£[0-9]/g)].length;
  const chars = text.replace(/\s+/g, ' ').trim().length;
  counted.chars += chars;
  if (chars < MIN_TEXT) empty.push(`${route} (${chars})`);

  const labelled = text.match(VAT_LABELLED);
  if (labelled) {
    problems.push(
      `${route} presents a price with VAT labelling: ${JSON.stringify(labelled[0])}. ` +
        'Gridsmith Ltd is not VAT registered — a price is the amount charged, with no ' +
        'inclusive or exclusive label.',
    );
  }

  const number = text.match(VAT_NUMBER);
  if (number) {
    problems.push(
      `${route} publishes a VAT registration number: ${JSON.stringify(number[0])}. The company ` +
        'is not registered, so any number here is false — which is a worse defect than a ' +
        'missing one, and is the defect that shipped as [SEED] GB123456789.',
    );
  }
}

if (problems.length > 0) {
  console.error(`\ncheck-vat-display: ${problems.length} problem(s) against ${BASE_URL}\n`);
  for (const p of problems) console.error(`  ${p}\n`);
  process.exitCode = 1;
} else if (counted.routes !== ROUTES.length) {
  console.error(
    `\ncheck-vat-display: measured ${counted.routes} of ${ROUTES.length} route(s).\n`,
  );
  process.exitCode = 1;
} else if (empty.length > 0) {
  console.error(
    `\ncheck-vat-display: ${empty.length} route(s) served under ${MIN_TEXT} characters of text: ` +
      `${empty.join(', ')}. The assertion is about served text, so those routes measured nothing — ` +
      'which reads exactly like compliance.\n',
  );
  process.exitCode = 1;
} else {
  console.log(
    `check-vat-display: ${counted.routes} route(s), ${counted.chars} character(s) of served text ` +
      `scanned, ${counted.prices} price figure(s) — no VAT labelling, no VAT number published; ` +
      `predicate proved against ${SPECIMENS.length} specimens first`,
  );
}
