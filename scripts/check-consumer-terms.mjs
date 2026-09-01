#!/usr/bin/env node
/**
 * check-consumer-terms
 *
 * **No consumer-facing route links to the business terms.**
 *
 * `lib/legal/slugs.ts` records the decision this gate protects. Until 26 August 2026 one slug,
 * `/legal/client-terms`, served two instruments: `docs/_legal/MSA-BUSINESS.md` and
 * `docs/_legal/CONSUMER-TERMS.md`. `/press` linked to it from its rights statement, so a Press
 * author following that link read a B2B liability cap that **CRA 2015 s. 57 makes not binding
 * on a consumer** — and nothing on the page said so. Four verification passes established the
 * defect is unfixable by drafting; the fix was to split the routes, and what can silently undo
 * the fix is a single `href`.
 *
 * ## It reads the served pages, never the source
 *
 * The assertion is about what a visitor's browser receives. `CLAUDE.md`: *"if the assertion is
 * about what the served pages link to, read the served pages, don't infer from source."* A
 * source check would have to model `/legal/[slug]`'s "other documents" list, `DivisionLanding`,
 * the chrome, and whatever the CMS returns — and the CMS is the part that can change without a
 * commit. Every one of those is a premise about the running system. So this fetches HTML from
 * a running server, the same way `check-launch-content` asks the site which dataset it was
 * built against rather than reading its own environment.
 *
 * It follows that this gate belongs in `verify:served`, behind `scripts/with-server.mjs`.
 *
 * ## Three branches, and why the negative one is not enough on its own
 *
 * **A.** No consumer-facing route contains a link to `/legal/business-client-terms`. The
 *   assertion the gate exists for.
 * **B.** `/press` DOES link to `/legal/consumer-client-terms`. Without this, A is satisfied
 *   perfectly by a Press page that links to no terms at all — which is a worse outcome than
 *   the defect, because an author then has no instrument to read. A negative assertion with no
 *   positive counterpart is trivially satisfiable, and the trivial satisfaction is invisible.
 * **C.** `/legal/consumer-client-terms` is served, is 200, and is the consumer instrument —
 *   its `<h1>` says so and it carries the CRA-facing clause anchor `/press` links into. This
 *   is the hollow-subject guard: if the CMS document were deleted the route would 404, A and B
 *   would both still pass (a 404 links to no business terms, and `/press`'s href is unchanged),
 *   and the gate would report clean over a consumer with nowhere to go.
 *
 * Each branch was proven separately by deliberate failure. One branch firing is not evidence
 * for the others — see `CLAUDE.md`, and `check:rls`, which accepted an `anon` SELECT policy
 * twice while its DELETE branch fired correctly the whole time.
 *
 * ## The counts
 *
 * `routes` and `links` are incremented inside the loops, so a non-zero value can only come
 * from a loop that executed. `EXPECTED_ROUTES` is a literal, not `CONSUMER_ROUTES.length`: an
 * expectation read from its own subject cannot fail when the subject is removed, and deleting
 * a route from the list below would otherwise delete the expectation with it and leave the
 * gate green having measured less.
 */

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';

/** The instrument no consumer-facing route may link to. */
const BUSINESS_TERMS = '/legal/business-client-terms';
const CONSUMER_TERMS = '/legal/consumer-client-terms';

/**
 * Routes a consumer reads.
 *
 * Gridsmith Press sells to consumers (`docs/_legal/01-FACTUAL-INVENTORY.md` §5.1), so every
 * `(press)` route is one, as is the consumer instrument itself. `/`, `/contact` and
 * `/legal/client-terms` are deliberately NOT here: they serve both audiences, and
 * `/legal/client-terms` is the disambiguation page whose entire job is to link to both
 * instruments and say which governs whom.
 *
 * Add a route here when Press grows one. It is a hand-kept list and this gate cannot discover
 * a route it is not told about — which is a real limit, stated rather than papered over.
 */
const CONSUMER_ROUTES = ['/press', CONSUMER_TERMS];

/** Hardcoded, not derived from the list above. See the docstring. */
const EXPECTED_ROUTES = 2;

const problems = [];
const counted = { routes: 0, links: 0, businessLinks: 0 };

/** Every `href` in the document, in source order. */
const hrefsIn = (html) => [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);

const pages = new Map();

for (const route of CONSUMER_ROUTES) {
  counted.routes += 1;
  const res = await fetch(BASE_URL + route).catch((e) => ({ ok: false, status: 0, error: e }));
  if (!res.ok) {
    problems.push(
      `${route} returned ${res.status || 'no response'} — nothing was measured on it. A ` +
        'consumer-facing route that does not serve is not a route that passes this gate.',
    );
    continue;
  }
  const html = await res.text();
  pages.set(route, html);

  // Branch A.
  const hrefs = hrefsIn(html);
  counted.links += hrefs.length;
  for (const href of hrefs) {
    if (href === BUSINESS_TERMS || href.startsWith(`${BUSINESS_TERMS}#`) || href.startsWith(`${BUSINESS_TERMS}?`)) {
      counted.businessLinks += 1;
      problems.push(
        `${route} links to ${href} — the BUSINESS terms, on a route a consumer reads. A ` +
          'liability cap drafted for a business client is not binding on a consumer to the ' +
          'extent of Consumer Rights Act 2015 s. 57, and a reader following this link cannot ' +
          `tell that. Link to ${CONSUMER_TERMS}, or to /legal/client-terms, which explains both.`,
      );
    }
  }
}

// Branch B — the positive counterpart. Without it, branch A is satisfied by linking to nothing.
const pressHtml = pages.get('/press');
if (pressHtml && !hrefsIn(pressHtml).some((h) => h === CONSUMER_TERMS || h.startsWith(`${CONSUMER_TERMS}#`))) {
  problems.push(
    `/press does not link to ${CONSUMER_TERMS} at all. CLAUDE.md non-negotiable #6 requires ` +
      'the Press rights statement to cite a real clause, and "links to no terms" satisfies ' +
      'the assertion above without satisfying the reason for it.',
  );
}

// Branch C — the subject asserts that it is still the subject.
const consumerHtml = pages.get(CONSUMER_TERMS);
if (consumerHtml) {
  const h1 = consumerHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]*>/g, '').trim();
  if (!/consumer/i.test(h1 ?? '')) {
    problems.push(
      `${CONSUMER_TERMS} serves an <h1> of ${JSON.stringify(h1 ?? null)}, which does not ` +
        'identify it as the consumer instrument. The route is reachable but it is no longer ' +
        'the document this gate thinks it is measuring.',
    );
  }
  if (!consumerHtml.includes('id="clause-10-1"')) {
    problems.push(
      `${CONSUMER_TERMS} does not carry the anchor clause-10-1, which /press links into. The ` +
        'link resolves to the page and then to nothing, which is the failure mode a 404 would ' +
        'at least have announced.',
    );
  }
}

if (problems.length > 0) {
  console.error(`\ncheck-consumer-terms: ${problems.length} problem(s) against ${BASE_URL}\n`);
  for (const p of problems) console.error(`  ${p}\n`);
  process.exitCode = 1;
} else if (counted.routes !== EXPECTED_ROUTES) {
  console.error(
    `\ncheck-consumer-terms: measured ${counted.routes} consumer-facing route(s), expected ` +
      `${EXPECTED_ROUTES}. The expectation is a literal precisely so that shortening ` +
      'CONSUMER_ROUTES fails here instead of silently measuring less.\n',
  );
  process.exitCode = 1;
} else if (counted.links === 0) {
  console.error(
    `\ncheck-consumer-terms: 0 links scanned across ${counted.routes} route(s). Something ` +
      'served a document with no href in it, so the assertion reached nothing.\n',
  );
  process.exitCode = 1;
} else {
  console.log(
    `check-consumer-terms: ${counted.routes} consumer-facing route(s), ${counted.links} link(s) ` +
      `scanned, ${counted.businessLinks} to ${BUSINESS_TERMS} — must be 0, and is`,
  );
  console.log(
    `check-consumer-terms: /press links to ${CONSUMER_TERMS}, which serves 200 as the consumer ` +
      'instrument and carries clause-10-1',
  );
}
