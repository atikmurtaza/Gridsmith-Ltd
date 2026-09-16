#!/usr/bin/env node
/**
 * The committed specimens for `check-service-content` — `GS-P04`.
 *
 * Same shape and the same reason as `check-launch-content.selftest.mjs`: the gate's real run
 * reads a catalogue that is correct, a content module that is correct and a dataset that is
 * correct, so **every assertion in it would report clean whether or not it worked**. A gate
 * never made to fail is not yet a gate.
 *
 * These are value-based probes, which is the shape `CLAUDE.md` prefers: each case calls a rule
 * function and asserts what it *returns*. The reading is a value rather than an absence, so
 * "the gate is broken" and "nothing was injected that the gate measures" are never confused —
 * a case expecting a problem fails loudly when it gets `[]`.
 *
 * **Every branch gets its own case.** `coverageProblems` has five limbs and a half-firing
 * alternation is more dangerous than a silent one, because it produces green results that look
 * earned. Each limb is broken separately below and the message it produced is asserted.
 */
import { strict as assert } from 'node:assert';
import {
  APPROVED_SERVICES,
  DIGITAL_MARKETING_ENGAGEMENT,
  UNCONFIRMED_CHANNEL_SERVICES,
} from '../lib/services/catalogue.ts';
import { PROCESS_DETAIL, SERVICES } from './service-content.mjs';
import {
  IDENTIFYING_TITLE_FRAGMENTS,
  MIN_COPY_STRINGS,
  STRUCK_COPY_RULES,
  anonymityProblems,
  coverageProblems,
  engagementProblems,
  struckCopyProblems,
} from './service-content-rules.mjs';

/** A minimal, internally consistent world: two approved services, one record covering both. */
const APPROVED = [
  { group: 'brand-visual', name: 'Logo systems' },
  { group: 'brand-visual', name: 'Brand guidelines' },
];
const CLEAN = {
  design: [
    {
      slug: 'brand-identity',
      title: 'Brand Identity',
      group: 'brand-visual',
      covers: ['Logo systems', 'Brand guidelines'],
    },
  ],
};

const cases = [];
const t = (name, run) => cases.push({ name, run });

/* -- coverageProblems, limb by limb --------------------------------------- */

t('CLEAN — a consistent world produces no problem', () => {
  assert.deepEqual(coverageProblems({ approved: APPROVED, services: CLEAN }), []);
});

t('LIMB 1 DIVISION — a group from another division', () => {
  const [p, ...rest] = coverageProblems({
    approved: [{ group: 'writing', name: 'Ghostwriting' }],
    services: { design: [{ slug: 'x', title: 'X', group: 'writing', covers: ['Ghostwriting'] }] },
  });
  assert.equal(rest.length, 0);
  assert.match(p, /^DIVISION: x is a design service in group "writing", which belongs to press$/);
});

t('LIMB 1 DIVISION — a group that is not in the architecture at all', () => {
  const problems = coverageProblems({
    approved: APPROVED,
    services: { design: [{ slug: 'x', title: 'X', group: 'digital-marketing', covers: [] }] },
  });
  assert.ok(
    problems.some((p) => /DIVISION: x has capability group "digital-marketing", which is not in the architecture/.test(p)),
    `expected the unknown-group message, got: ${JSON.stringify(problems)}`,
  );
});

t('LIMB 2 SLUG — one slug used by two divisions', () => {
  const problems = coverageProblems({
    approved: APPROVED,
    services: {
      design: [{ slug: 'copywriting', title: 'A', group: 'brand-visual', covers: ['Logo systems'] }],
      press: [{ slug: 'copywriting', title: 'B', group: 'writing', covers: [] }],
    },
  });
  assert.ok(
    problems.some((p) => /SLUG: "copywriting" is used by both the design and press records/.test(p)),
    `expected the duplicate-slug message, got: ${JSON.stringify(problems)}`,
  );
});

t('LIMB 3 UNAPPROVED — a capability the owner did not approve', () => {
  const problems = coverageProblems({
    approved: APPROVED,
    services: {
      design: [
        { slug: 'x', title: 'X', group: 'brand-visual', covers: ['Logo systems', 'Brand guidelines', 'Skywriting'] },
      ],
    },
  });
  assert.deepEqual(problems, [
    'UNAPPROVED: x claims "Skywriting" in group "brand-visual", which is not an approved service',
  ]);
});

t('LIMB 3 UNAPPROVED — an approved name claimed under the wrong group', () => {
  const problems = coverageProblems({
    approved: [{ group: 'technical', name: 'Technical illustration' }],
    services: {
      design: [{ slug: 'x', title: 'X', group: 'illustration', covers: ['Technical illustration'] }],
    },
  });
  assert.ok(
    problems.some((p) => /UNAPPROVED: x claims "Technical illustration" in group "illustration"/.test(p)),
    'group:name identity must not collapse to name — the catalogue lists this name twice',
  );
});

t('LIMB 4 UNCOVERED — an approved service no record represents', () => {
  const problems = coverageProblems({
    approved: APPROVED,
    services: { design: [{ slug: 'x', title: 'X', group: 'brand-visual', covers: ['Logo systems'] }] },
  });
  assert.deepEqual(problems, [
    'UNCOVERED: no seeded service represents "Brand guidelines" (brand-visual)',
  ]);
});

t('LIMB 4 DUPLICATE — two records claiming one approved service', () => {
  const problems = coverageProblems({
    approved: [{ group: 'brand-visual', name: 'Logo systems' }],
    services: {
      design: [
        { slug: 'a', title: 'A', group: 'brand-visual', covers: ['Logo systems'] },
        { slug: 'b', title: 'B', group: 'brand-visual', covers: ['Logo systems'] },
      ],
    },
  });
  assert.deepEqual(problems, ['DUPLICATE: "Logo systems" (brand-visual) is claimed by a and b']);
});

// The specimen is `Media buying`, and it changed at `GS-P05` for a reason worth recording.
// It used to be `Google Ads`, which the owner confirmed as a Gridsmith capability at `GS-O012`
// — so the denylist no longer contains it and this case began failing the moment the catalogue
// was updated. **That failure is the rule working**: `CLAUDE.md` says adding a subject to a gate
// is not done until every list the gate consults has been updated, and here the specimen list
// was the one nobody would have thought to look at. The case now uses the only entry that is
// still unconfirmed, which is also the entry keeping `UNCONFIRMED_CHANNEL_SERVICES` non-empty.
t('LIMB 5 CHANNEL — a record claiming an unconfirmed channel service (GS-O012)', () => {
  const problems = coverageProblems({
    approved: APPROVED,
    services: {
      design: [
        {
          slug: 'x',
          title: 'Media buying desk',
          group: 'brand-visual',
          covers: ['Logo systems', 'Brand guidelines'],
        },
      ],
    },
    unconfirmed: UNCONFIRMED_CHANNEL_SERVICES,
  });
  assert.deepEqual(problems, [
    'UNCONFIRMED CHANNEL: x claims "Media buying" as a service record, and no approved catalogue entry carries it (GS-O012, narrowed at GS-O013)',
  ]);
});

/* -- The empty-subject cases: a count that cannot be proved to move is not a count -- */

t('EMPTY — no approved services is a failure, not a pass', () => {
  assert.deepEqual(coverageProblems({ approved: [], services: CLEAN }), [
    'the approved catalogue was empty — the coverage assertion measured nothing',
  ]);
});

t('EMPTY — no records is a failure, not a pass', () => {
  assert.deepEqual(coverageProblems({ approved: APPROVED, services: {} }), [
    'no service records were supplied — the coverage assertion measured nothing',
  ]);
});

/* -- anonymityProblems ----------------------------------------------------- */

t('ANON CLEAN — generalised categories and an absent title', () => {
  assert.deepEqual(
    anonymityProblems([
      { id: 'a', projectTitle: 'Logo design' },
      { id: 'b', projectTitle: null },
      { id: 'c', projectTitle: 'Ecommerce theme customisation' },
    ]),
    [],
  );
});

t('ANON — a client brand name in a title', () => {
  assert.deepEqual(anonymityProblems([{ id: 'elizabeth', projectTitle: 'Artistic Logo Design for Casglu' }]), [
    'elizabeth: projectTitle "Artistic Logo Design for Casglu" still carries the identifying fragment "Casglu"',
    'elizabeth: projectTitle "Artistic Logo Design for Casglu" still carries the identifying fragment "Artistic Logo Design for"',
  ]);
});

t('ANON — every recorded fragment is matched, none is dead', () => {
  for (const fragment of IDENTIFYING_TITLE_FRAGMENTS) {
    const problems = anonymityProblems([{ id: 'x', projectTitle: `Prefix ${fragment} suffix` }]);
    assert.ok(
      problems.some((p) => p.includes(`"${fragment}"`)),
      `the fragment "${fragment}" is on the denylist and matched nothing — a dead entry is a rule that cannot fire`,
    );
  }
});

t('ANON — matching is case-insensitive', () => {
  assert.equal(anonymityProblems([{ id: 'x', projectTitle: 'casglu' }]).length, 1);
});

t('ANON — an empty review list is a failure, not a pass', () => {
  assert.deepEqual(anonymityProblems([]), [
    'no reviews were supplied — the anonymity assertion measured nothing',
  ]);
});

t('ANON — a non-string title is reported rather than skipped', () => {
  assert.deepEqual(anonymityProblems([{ id: 'x', projectTitle: 42 }]), [
    'x: projectTitle is 42, not a string or absent',
  ]);
});

/* -- engagementProblems ---------------------------------------------------- */

t('ENGAGEMENT CLEAN — the real map against the real catalogue', () => {
  assert.deepEqual(
    engagementProblems({ engagement: DIGITAL_MARKETING_ENGAGEMENT, approved: APPROVED_SERVICES }),
    [],
  );
});

t('ENGAGEMENT — an activity mapped to a service the catalogue does not have', () => {
  assert.deepEqual(
    engagementProblems({
      engagement: [
        { activity: 'Paid search', owner: 'digital', approved: { group: 'web', name: 'Google Ads management' } },
      ],
      approved: APPROVED_SERVICES,
    }),
    [
      'ENGAGEMENT: "Paid search" maps to "Google Ads management" (web), which is not an approved service',
    ],
  );
});

t('ENGAGEMENT — an activity owned by a division the capability does not belong to', () => {
  assert.deepEqual(
    engagementProblems({
      engagement: [
        { activity: 'Campaign copy', owner: 'digital', approved: { group: 'writing', name: 'Sales/campaign copywriting' } },
      ],
      approved: APPROVED_SERVICES,
    }),
    [
      'ENGAGEMENT: "Campaign copy" is owned by digital but maps to a press capability — the division-bound group rule would refuse it',
    ],
  );
});

t('ENGAGEMENT — only master may be unmapped', () => {
  assert.deepEqual(
    engagementProblems({
      engagement: [{ activity: 'Something', owner: 'design', approved: null }],
      approved: APPROVED_SERVICES,
    }),
    [
      'ENGAGEMENT: "Something" names no approved service but is owned by design, not master — only orchestration may be unmapped',
    ],
  );
});

t('ENGAGEMENT — an empty map is a failure, not a pass', () => {
  assert.deepEqual(engagementProblems({ engagement: [], approved: APPROVED_SERVICES }), [
    'the Digital Marketing engagement map was empty — nothing was measured',
  ]);
});

/* -- The real subjects, asserted here too so the selftest is not a parallel world -- */

t('REAL — the committed catalogue and content module are consistent', () => {
  assert.deepEqual(
    coverageProblems({
      approved: APPROVED_SERVICES,
      services: SERVICES,
      unconfirmed: UNCONFIRMED_CHANNEL_SERVICES,
    }),
    [],
  );
});

/* -- struckCopyProblems, one branch at a time ----------------------------- */

/**
 * `GS-P06`. One specimen per struck position, and **each specimen must fire exactly one rule**.
 *
 * That last clause is the point. `CLAUDE.md` records `A-GATE-4-3`: where two checks can fire on
 * one input, a proof that only observes a red credits whichever one the author had in mind. Two
 * of these rules are two phrasings of the same struck position, so their specimens sit closest
 * to that hazard — the assertion below names the id it expects **and** asserts nothing else
 * fired, which is what makes each of the eleven a separately proven branch rather than eleven
 * readings of whichever rule happens to be greediest.
 *
 * Keyed by rule id, and the parity case beneath refuses a rule with no specimen: a rule added
 * without one would otherwise be a registered position nothing has ever broken.
 */
const STRUCK_SPECIMENS = {
  'MEDIA-BUYING-DENIAL': 'Gridsmith does not buy media on your behalf.',
  'MEDIA-BUYING-NOT-UNDERTAKEN': 'Media buying is not part of this service.',
  'AD-ACCOUNT-DENIAL': 'We do not run ad accounts or set budgets.',
  'HOSTING-RESALE-PROHIBITION': 'Gridsmith does not resell hosting.',
  'ACCESSIBILITY-CATEGORICAL': 'No one can certify accessibility.',
  'COMBATIVE-ANYONE-HONEST': 'Not offered by anyone honestly.',
  'COMBATIVE-ANYONE-PROMISE': 'Listing decisions are not within anyone’s gift to promise.',
  'OWNERSHIP-ABSOLUTE-CODE': 'The code is yours at the end of the engagement.',
  'OWNERSHIP-ABSOLUTE-ACCOUNTS': 'Hosting, domain and CMS accounts are yours.',
  'OWNERSHIP-ABSOLUTE-HELD-IN-YOUR-NAME': 'Accounts and ISBNs are obtained and held in your name.',
  'CONTINUITY-QUOTED-AS-FURTHER-WORK': 'Later amends are quoted as further work.',
};

/** Enough strings to clear the floor, so only the injection under test can be the finding. */
const padding = Array.from({ length: MIN_COPY_STRINGS }, (_, i) => `filler ${i}, not a subject`);

/** @param {string} specimen */
const struckFor = (specimen) =>
  struckCopyProblems({
    services: { design: [{ slug: 'specimen', description: [...padding, specimen] }] },
    process: {},
  }).problems.filter((problem) => problem.startsWith('STRUCK COPY:'));

for (const rule of STRUCK_COPY_RULES) {
  t(`STRUCK ${rule.id} — fires, and nothing else does`, () => {
    const specimen = STRUCK_SPECIMENS[rule.id];
    assert.ok(specimen, `${rule.id} has no committed specimen — it has never been broken`);
    const fired = struckFor(specimen);
    assert.equal(
      fired.length,
      1,
      `expected exactly one rule to fire on ${JSON.stringify(specimen)}, got ${fired.length}:\n${fired.join('\n')}`,
    );
    assert.ok(
      fired[0].includes(rule.id),
      `expected ${rule.id} to fire on ${JSON.stringify(specimen)}, got:\n${fired[0]}`,
    );
  });
}

t('STRUCK parity — every specimen names a registered rule', () => {
  const ids = new Set(STRUCK_COPY_RULES.map((r) => r.id));
  const orphans = Object.keys(STRUCK_SPECIMENS).filter((id) => !ids.has(id));
  assert.deepEqual(orphans, [], `specimens for rules that no longer exist: ${orphans.join(', ')}`);
});

t('STRUCK ZERO-SUBJECT — an empty walk is a failure, not a pass', () => {
  const { problems, scanned } = struckCopyProblems({ services: {}, process: {} });
  assert.equal(scanned, 0);
  assert.ok(
    problems.some((p) => p.startsWith('ZERO-SUBJECT: 0 copy string(s) read')),
    `an empty subject must fail loudly, got: ${JSON.stringify(problems)}`,
  );
});

t('STRUCK count moves — the scanned figure is counted, not printed', () => {
  const one = struckCopyProblems({ services: { design: [{ slug: 'a' }] }, process: {} }).scanned;
  const two = struckCopyProblems({
    services: { design: [{ slug: 'a', summary: 'b' }] },
    process: {},
  }).scanned;
  assert.equal(one, 1);
  assert.equal(two, 2);
});

t('REAL — no struck position stands in the committed copy', () => {
  const { problems, scanned } = struckCopyProblems({
    services: SERVICES,
    process: PROCESS_DETAIL,
  });
  assert.ok(scanned >= MIN_COPY_STRINGS, `only ${scanned} string(s) were read`);
  assert.deepEqual(problems, []);
});

/* -- Run ------------------------------------------------------------------ */

let failed = 0;
for (const c of cases) {
  try {
    c.run();
    console.log(`  ok    ${c.name}`);
  } catch (error) {
    failed += 1;
    console.error(`  FAIL  ${c.name}\n        ${error.message.split('\n').join('\n        ')}`);
  }
}

console.log(
  `\ncheck-service-content selftest: ${cases.length - failed}/${cases.length} case(s) passed\n`,
);
if (failed > 0) process.exit(1);
