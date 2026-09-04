#!/usr/bin/env node
/**
 * **`check:press:contact:selftest` — the committed subject for the Press contact flow's data
 * contract (`K-13`).**
 *
 * Subjects: `lib/leads/pressLead.ts` — the four-branch discriminated union, the `FormData`
 * mapper, and the memoir/statement coupling that decides whether step 1 offers the memoir
 * segment at all.
 *
 * ## Why this shape, and what makes each specimen a valid probe
 *
 * Every case asserts a **return value**: a `safeParse` result, or the contents of an options
 * array. `CLAUDE.md`'s probe-validity rule says a green reading is only evidence once the probe
 * is shown to be a subject the predicate could have caught, and the asymmetry falls on absences.
 * There is no absence here — nothing is injected into a served page, nothing is hit-tested, and
 * a broken import throws rather than passing quietly. The reading is a value.
 *
 * Each branch is broken **separately**. `pressLeadPayload` is a four-way alternation and
 * `CLAUDE.md`'s half-working-alternation rule is explicit that one branch firing is not evidence
 * for the others — `check:rls` accepted an `anon` SELECT policy twice while its DELETE branch
 * fired correctly the whole time. So each of the four segments gets a VALID specimen and at
 * least one REJECTS specimen, and the VALID ones are what make the rejections mean something:
 * a union that refused everything would produce identical rejection output.
 *
 * ## What this does NOT assert
 *
 * That the Press form renders correctly, that the insert lands, or that RLS holds. Those are
 * `check:axe`, the live probe in `app/api/rls-drift/route.ts`, and the HTTP posture check.
 * **A green line here means the contract rejects what it should, not that the flow works.**
 */
import { pressLeadPayload, pressPayloadFrom } from '../lib/leads/pressLead.ts';
import {
  PRESS_SEGMENTS,
  pressSegmentOptions,
  pressSegmentTerms,
} from '../lib/leads/pressSegments.ts';

const form = (entries) => {
  const fd = new FormData();
  for (const [k, v] of entries) fd.append(k, v);
  return fd;
};

const AUTHOR = [
  ['segment', 'author'],
  ['manuscriptStage', 'finished-draft'],
  ['genre', 'Crime fiction'],
  ['wordCount', '80k-120k'],
  ['previouslyPublished', 'no'],
  ['timeline', '6-months'],
];

const BUSINESS = [
  ['segment', 'business'],
  ['bookPurpose', 'credibility'],
  ['whoWrites', 'ghostwritten'],
  ['companyName', 'Example Ltd'],
  ['approvalNeeded', 'yes'],
  ['timeline', '12-months'],
];

const MEMOIR = [
  ['segment', 'memoir'],
  ['manuscriptStage', 'partial-draft'],
  ['intendedReadership', 'family-only'],
  ['expectationsAcknowledged', 'yes'],
  ['timeline', 'no-deadline'],
];

const CONTENT = [
  ['segment', 'content'],
  ['formats', 'Articles'],
  ['volumePerMonth', 'Two a month'],
  ['turnaroundNeeded', 'Two weeks'],
  ['procurementProcess', 'no'],
];

const parse = (entries) => pressLeadPayload.safeParse(pressPayloadFrom(form(entries)));
const without = (entries, key) => entries.filter(([k]) => k !== key);
const withValue = (entries, key, value) => [...without(entries, key), [key, value]];
const issuePaths = (r) => r.error.issues.map((i) => i.path.join('.'));

const CASES = [
  // ---- The four VALID specimens. Without these the rejections below prove nothing: a union
  // that refuses every input produces exactly the same output as one that discriminates.
  {
    name: 'VALID author — the full branch parses, and the optional link may be absent',
    run: () => parse(AUTHOR),
    expect: (r) => r.success && r.data.segment === 'author' && r.data.previouslyPublished === false,
  },
  {
    name: 'VALID business — booleans arrive as booleans, not the string "yes"',
    run: () => parse(BUSINESS),
    expect: (r) => r.success && r.data.approvalNeeded === true,
  },
  {
    name: 'VALID memoir — acknowledged, so ETH-07 is satisfied',
    run: () => parse(MEMOIR),
    expect: (r) => r.success && r.data.expectationsAcknowledged === true,
  },
  {
    name: 'VALID content — formats is an array with one entry',
    run: () => parse(CONTENT),
    expect: (r) => r.success && r.data.formats.length === 1,
  },

  // ---- ETH-07. The rule this whole flow exists under, broken three ways.
  {
    name: 'ETH-07 UNTICKED — memoir with the box unticked is REJECTED on that field',
    run: () => parse(without(MEMOIR, 'expectationsAcknowledged')),
    expect: (r) => !r.success && issuePaths(r).includes('expectationsAcknowledged'),
  },
  {
    name: 'ETH-07 EXPLICIT FALSE — sending false is REJECTED, not read as a considered answer',
    run: () => pressLeadPayload.safeParse({ ...pressPayloadFrom(form(MEMOIR)), expectationsAcknowledged: false }),
    expect: (r) => !r.success && issuePaths(r).includes('expectationsAcknowledged'),
  },
  {
    name: 'ETH-07 NOT ROUTABLE — an author payload cannot carry memoir fields to skip the gate',
    run: () => parse([...AUTHOR, ['expectationsAcknowledged', 'yes'], ['intendedReadership', 'public']]),
    // It parses as `author` — which is the point: the memoir gate cannot be evaded by
    // relabelling, because relabelling makes it a different branch with different required
    // fields. The proof is that the memoir keys do not survive into the stored payload.
    expect: (r) => r.success && r.data.segment === 'author' && !('intendedReadership' in r.data),
  },

  // ---- Each remaining branch broken on its own required field.
  {
    name: 'AUTHOR BRANCH — a missing genre is REJECTED, naming genre',
    run: () => parse(without(AUTHOR, 'genre')),
    expect: (r) => !r.success && issuePaths(r).includes('genre'),
  },
  {
    name: 'AUTHOR BRANCH — an out-of-list wordCount is REJECTED',
    run: () => parse(withValue(AUTHOR, 'wordCount', '500k-plus')),
    expect: (r) => !r.success && issuePaths(r).includes('wordCount'),
  },
  {
    name: 'BUSINESS BRANCH — a missing companyName is REJECTED, naming companyName',
    run: () => parse(without(BUSINESS, 'companyName')),
    expect: (r) => !r.success && issuePaths(r).includes('companyName'),
  },
  {
    name: 'CONTENT BRANCH — zero formats is REJECTED (min(1)), naming formats',
    run: () => parse(without(CONTENT, 'formats')),
    expect: (r) => !r.success && issuePaths(r).includes('formats'),
  },
  {
    name: 'MEMOIR BRANCH — the author-only revised-draft stage is REJECTED',
    run: () => parse(withValue(MEMOIR, 'manuscriptStage', 'revised-draft')),
    expect: (r) => !r.success && issuePaths(r).includes('manuscriptStage'),
  },
  {
    name: 'MEMOIR BRANCH — a 3-month deadline is not offered and is REJECTED',
    run: () => parse(withValue(MEMOIR, 'timeline', '3-months')),
    expect: (r) => !r.success && issuePaths(r).includes('timeline'),
  },

  // ---- The discriminator itself.
  {
    name: 'SEGMENT — an unknown segment is REJECTED; there is no fallback branch',
    run: () => parse([['segment', 'publisher']]),
    expect: (r) => !r.success,
  },
  {
    name: 'SEGMENT — a missing segment is REJECTED',
    run: () => parse([['genre', 'Crime fiction']]),
    expect: (r) => !r.success,
  },

  // ---- The manuscript link. TECH-SPEC §9: a link, never an upload.
  {
    name: 'MANUSCRIPT LINK — a valid URL is accepted',
    run: () => parse([...AUTHOR, ['manuscriptLink', 'https://example.com/draft']]),
    expect: (r) => r.success && r.data.manuscriptLink === 'https://example.com/draft',
  },
  {
    name: 'MANUSCRIPT LINK — a non-URL is REJECTED, naming manuscriptLink',
    run: () => parse([...AUTHOR, ['manuscriptLink', 'my-draft.docx']]),
    expect: (r) => !r.success && issuePaths(r).includes('manuscriptLink'),
  },

  // ---- The memoir/statement coupling. A value read, not a rendered absence.
  {
    name: 'COUPLING — with no ETH-07 statement, memoir is not offered and the other three are',
    run: () => pressSegmentOptions(false).map((o) => o.value),
    expect: (v) =>
      !v.includes('memoir') && ['author', 'business', 'content'].every((s) => v.includes(s)),
  },
  {
    name: 'COUPLING — with a statement supplied, all four segments are offered',
    run: () => pressSegmentOptions(true).map((o) => o.value),
    expect: (v) => v.length === 4 && v.includes('memoir'),
  },

  // ---- K-16 / FR-P24. Which instrument a segment is routed to is a legal-consequence
  // decision, so each of the four branches is asserted on its own returned slug. One branch
  // returning the right value is not evidence for the others: this is a three-way if/else and
  // the last arm is the fall-through, which is exactly the shape that reports a plausible
  // answer for an input it never considered.
  {
    name: 'K-16 BUSINESS — routed to the business MSA, the only segment that states a trade purpose',
    run: () => pressSegmentTerms('business'),
    expect: (v) => v === 'business-client-terms',
  },
  {
    name: 'K-16 AUTHOR — routed to the consumer instrument, never the business MSA (CRA 2015 s. 57)',
    run: () => pressSegmentTerms('author'),
    expect: (v) => v === 'consumer-client-terms',
  },
  {
    name: 'K-16 MEMOIR — routed to the consumer instrument',
    run: () => pressSegmentTerms('memoir'),
    expect: (v) => v === 'consumer-client-terms',
  },
  {
    name: 'K-16 CONTENT — routed to the disambiguation page; purpose is unstated, so neither instrument is asserted',
    run: () => pressSegmentTerms('content'),
    expect: (v) => v === 'client-terms',
  },
  {
    name: 'K-16 NO CONSUMER SEGMENT REACHES THE MSA — the assertion the split exists for',
    run: () => ['author', 'memoir', 'content'].map(pressSegmentTerms),
    expect: (v) => !v.includes('business-client-terms'),
  },
  {
    name: 'K-16 EVERY SEGMENT IS ROUTED — no segment falls through to undefined or an unknown slug',
    run: () => PRESS_SEGMENTS.map(pressSegmentTerms),
    expect: (v) =>
      v.length === 4 &&
      v.every((s) =>
        ['business-client-terms', 'consumer-client-terms', 'client-terms'].includes(s),
      ),
  },
];

let failed = 0;
for (const c of CASES) {
  let pass = false;
  let got;
  try {
    got = c.run();
    pass = c.expect(got);
  } catch (e) {
    got = `threw: ${e.message}`;
  }
  console.log(`  ${pass ? '✓' : '✗'} ${c.name}`);
  if (!pass) {
    failed++;
    console.error(`      got ${JSON.stringify(got)}`);
  }
}

if (failed) {
  console.error(`\n✗ check:press:contact:selftest — ${failed} of ${CASES.length} case(s) failed.`);
  process.exit(1);
}
console.log(`✓ check:press:contact:selftest — ${CASES.length} cases over lib/leads/pressLead.ts.`);
