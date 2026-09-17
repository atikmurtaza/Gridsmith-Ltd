#!/usr/bin/env node
/**
 * The committed specimens for `check-company-facts` — `GS-R001`.
 *
 * `check-company-facts.mjs` fetches before it asserts, so its only subject is whatever a server
 * happened to serve. This file gives every predicate a permanent subject that cannot be deleted
 * without deleting a CI step, and every case reads a **returned problem set** rather than the
 * absence of an error — so a comparator broken into inertness fails here, offline, before it
 * can report a clean run against the live site.
 *
 * **Every rule is broken separately.** `CLAUDE.md`: one branch of a multi-branch assertion
 * firing is not evidence for the others, and a half-firing alternation reports success from
 * whichever limb happened to be exercised. Each `RESPONSE_RULES` and `TEAM_RULES` entry gets a
 * specimen asserted to fire **and to be the only rule that fires**, which closes the
 * `A-GATE-4-3` hazard by construction rather than by care.
 *
 * The clean cases matter as much as the firing ones: a predicate that rejects everything is as
 * useless as one that rejects nothing, and it is the one that gets silenced.
 */

import {
  FACTS,
  RESPONSE_RULES,
  TEAM_RULES,
  CALL_RULES,
  PLACEHOLDER_RULES,
  SOCIAL_URLS,
  disclosureProblems,
  emailProblems,
  officeProblems,
  phoneProblems,
  responseProblems,
  teamProblems,
  callProblems,
  placeholderProblems,
  socialProblems,
} from './company-facts-rules.mjs';

let passed = 0;
const failures = [];

function check(name, actual) {
  if (actual === true) {
    passed += 1;
    console.log(`  ok    ${name}`);
  } else {
    failures.push(`${name} — ${actual}`);
    console.log(`  FAIL  ${name} — ${actual}`);
  }
}

const one = (list, fragment) =>
  list.length === 1 && list[0].includes(fragment)
    ? true
    : `expected exactly one problem naming ${JSON.stringify(fragment)}, got ${JSON.stringify(list)}`;

const none = (list) => (list.length === 0 ? true : `expected no problem, got ${JSON.stringify(list)}`);

/* -- a footer the site actually serves -------------------------------------- */

const GOOD_FOOTER =
  `${FACTS.legalName} · registered in ${FACTS.placeOfRegistration} · company number ` +
  `${FACTS.companyNumber} · registered office ${FACTS.registeredOffice} ` +
  `${FACTS.contactEmail} · ${FACTS.contactPhone}`;

/* -- 1. the statutory disclosure -------------------------------------------- */

check('DISCLOSURE CLEAN — a complete footer', none(disclosureProblems('/', GOOD_FOOTER)));

check(
  'DISCLOSURE — an empty footer is a failure, not a pass',
  one(disclosureProblems('/', ''), 'served no statutory footer at all'),
);

for (const [value, label] of [
  [FACTS.legalName, 'registered name'],
  [FACTS.companyNumber, 'company number'],
  [FACTS.registeredOffice, 'registered office'],
  [FACTS.contactEmail, 'contact email'],
  [FACTS.contactPhone, 'contact phone'],
]) {
  check(
    `DISCLOSURE — a footer missing the ${label}`,
    one(disclosureProblems('/', GOOD_FOOTER.replace(value, '')), JSON.stringify(value)),
  );
}

check(
  'DISCLOSURE — the superseded "England & Wales" is named as itself',
  (() => {
    const list = disclosureProblems(
      '/',
      GOOD_FOOTER.replace('registered in England', 'registered in England & Wales'),
    );
    // Two problems: the required "registered in England" is absent as a substring only when the
    // ampersand form is used in isolation — it is not, so exactly the named rule must fire.
    return list.length === 1 && list[0].includes('England & Wales')
      ? true
      : `expected the England & Wales rule alone, got ${JSON.stringify(list)}`;
  })(),
);

/* -- 2. email ---------------------------------------------------------------- */

const CLEAN_HTML = `<a href="mailto:${FACTS.contactEmail}">${FACTS.contactEmail}</a>`;

check(
  'EMAIL CLEAN — the approved address, displayed and linked',
  none(emailProblems('/contact', FACTS.contactEmail, CLEAN_HTML)),
);

check(
  'EMAIL — the legacy Gmail address the live site displays',
  one(
    emailProblems('/contact', 'write to contact.gridsmith@gmail.com', CLEAN_HTML),
    'contact.gridsmith@gmail.com',
  ),
);

check(
  'EMAIL — the legacy info@ address the live site links',
  one(emailProblems('/contact', 'info@gridsmith.uk', CLEAN_HTML), 'info@gridsmith.uk'),
);

check(
  'EMAIL — a placeholder domain',
  one(emailProblems('/contact', 'hello@example.com', CLEAN_HTML), 'example.com'),
);

check(
  'EMAIL — a mailto: pointing somewhere the page does not display (the live site defect)',
  one(
    emailProblems(
      '/contact',
      FACTS.contactEmail,
      `<a href="mailto:someone@elsewhere.test">${FACTS.contactEmail}</a>`,
    ),
    'someone@elsewhere.test',
  ),
);

/* -- 3. the contact number, and the schemes it may be linked with ------------ */

/**
 * **The `GS-R001-R` inversion, proved both ways.** Before this phase the clean specimen was a
 * correctly-formatted `tel:` and the failing one was a malformed `tel:`. Both are now failures,
 * and the specimen that must pass carries no `tel:` at all — which is the whole point: a gate
 * that only checked `tel:` *formatting* would be green on a site covered in perfectly-formed
 * call links.
 */
const CLEAN_CHANNELS =
  `<a href="${FACTS.whatsAppHref}">WhatsApp</a> <a href="${FACTS.smsHref}">text</a>`;

check(
  'PHONE CLEAN — the number as text, with the two authorised schemes',
  none(phoneProblems('/contact', FACTS.contactPhone, CLEAN_CHANNELS)),
);

check(
  'PHONE CLEAN — the number as plain text with no link at all (the footer treatment)',
  none(phoneProblems('/', FACTS.contactPhone, `<p>${FACTS.contactPhone}</p>`)),
);

check(
  'PHONE — a tel: href is refused even in the RFC 3966 form GS-O004 used to require',
  one(
    phoneProblems('/contact', FACTS.contactPhone, '<a href="tel:+447405448534">call</a>'),
    'withdraws the voice channel',
  ),
);

check(
  'PHONE — the live site\'s percent-encoded tel: is refused too, and for the new reason',
  one(
    phoneProblems(
      '/contact',
      FACTS.contactPhone,
      '<a href="tel:+44%207405%20448534">+44 7405 448534</a>',
    ),
    'withdraws the voice channel',
  ),
);

check(
  'PHONE — a wa.me link on the wrong number',
  one(
    phoneProblems('/contact', FACTS.contactPhone, '<a href="https://wa.me/447000000000">w</a>'),
    'not https://wa.me/447405448534',
  ),
);

check(
  'PHONE — wa.me with the plus retained, which wa.me does not accept',
  one(
    phoneProblems('/contact', FACTS.contactPhone, '<a href="https://wa.me/+447405448534">w</a>'),
    'no plus and no separators',
  ),
);

check(
  'PHONE — an sms: href that is not the global form',
  one(
    phoneProblems('/contact', FACTS.contactPhone, '<a href="sms:07405448534">t</a>'),
    'RFC 5724',
  ),
);

check(
  'PHONE — a second, unapproved number in the text',
  one(phoneProblems('/contact', 'or try +44 20 7946 0000', CLEAN_CHANNELS), '+44 20 7946 0000'),
);

/* -- 4. the registered office ------------------------------------------------ */

check(
  'OFFICE CLEAN — a body that does not carry the address',
  none(officeProblems('/about', 'Gridsmith Ltd is one company registered in England.', false)),
);

check(
  'OFFICE — the address in the body of a marketing route',
  one(
    officeProblems('/about', `Registered office ${FACTS.registeredOffice}`, false),
    'outside the statutory footer',
  ),
);

check(
  'OFFICE — the postcode alone is enough, so a reworded address does not slip past',
  one(officeProblems('/about', 'Our office is at BL4 0HD.', false), 'outside the statutory footer'),
);

check(
  'OFFICE — a _legal/ route may carry it, because the instrument names it for service',
  none(officeProblems('/legal/privacy', `Write to ${FACTS.registeredOffice}`, true)),
);

/* -- 5. response wording, every rule alone ----------------------------------- */

const RESPONSE_SPECIMENS = {
  'GUARANTEE-ALWAYS-BY': "We'll reply as soon as we can, and always by the end of the next business day.",
  'GUARANTEE-WORD': 'We guarantee a reply.',
  'GUARANTEE-SLA': 'Covered by a service-level agreement.',
  ASAP: 'We will get back to you ASAP.',
  'BUSINESS-HOURS-CLOCK': 'We are open 9am to 5pm.',
  'BUSINESS-HOURS-LABEL': 'Our opening hours are listed below.',
};

check(
  'RESPONSE CLEAN — the wording GS-O004 authorises',
  none(responseProblems('/contact', 'We typically respond within 48 hours.')),
);

for (const rule of RESPONSE_RULES) {
  const specimen = RESPONSE_SPECIMENS[rule.id];
  check(
    `RESPONSE ${rule.id} — fires, and nothing else does`,
    specimen === undefined
      ? `no specimen registered for ${rule.id} — a rule with no specimen has never been proven`
      : one(responseProblems('/contact', specimen), rule.id),
  );
}

check(
  'RESPONSE parity — every specimen names a registered rule',
  Object.keys(RESPONSE_SPECIMENS).every((id) => RESPONSE_RULES.some((r) => r.id === id))
    ? true
    : 'a specimen names a rule that does not exist, so it proves nothing',
);

/* -- 6. public team, every rule alone ---------------------------------------- */

const TEAM_SPECIMENS = {
  'TEAM-SEED-NAME': '[SEED] Placeholder Name',
  'TEAM-HEADING': 'Who you will work with',
  'TEAM-MEET': 'Meet the team',
};

check(
  'TEAM CLEAN — a page that names no people',
  none(teamProblems('/about', 'Gridsmith Ltd is one company registered in England.')),
);

for (const rule of TEAM_RULES) {
  const specimen = TEAM_SPECIMENS[rule.id];
  check(
    `TEAM ${rule.id} — fires, and nothing else does`,
    specimen === undefined
      ? `no specimen registered for ${rule.id} — a rule with no specimen has never been proven`
      : one(teamProblems('/about', specimen), rule.id),
  );
}

check(
  'TEAM parity — every specimen names a registered rule',
  Object.keys(TEAM_SPECIMENS).every((id) => TEAM_RULES.some((r) => r.id === id))
    ? true
    : 'a specimen names a rule that does not exist, so it proves nothing',
);

/* -- 7. the call channel, every rule alone ----------------------------------- */

const CALL_SPECIMENS = {
  'CALL-CTA-IMPERATIVE': 'Call us on the number below.',
  'CALL-CTA-GIVE-US': 'Give us a call any time.',
  'CALL-CTA-OR-CALL': 'Or call the office.',
  'CALL-SPEAK-TO': 'Speak to us on the number below.',
};

check(
  'CALL CLEAN — the wording GS-R001-R authorises',
  none(callProblems('/contact', 'The same number takes WhatsApp and text messages.')),
);

check(
  'CALL CLEAN — the noun "phone" alone is not an invitation and must not fire',
  none(callProblems('/contact', 'The number is not answered as a phone line.')),
);

for (const rule of CALL_RULES) {
  const specimen = CALL_SPECIMENS[rule.id];
  check(
    `CALL ${rule.id} — fires, and nothing else does`,
    specimen === undefined
      ? `no specimen registered for ${rule.id} — a rule with no specimen has never been proven`
      : one(callProblems('/contact', specimen), rule.id),
  );
}

check(
  'CALL parity — every specimen names a registered rule',
  Object.keys(CALL_SPECIMENS).every((id) => CALL_RULES.some((r) => r.id === id))
    ? true
    : 'a specimen names a rule that does not exist, so it proves nothing',
);

/* -- 8. placeholders, every rule alone --------------------------------------- */

const PLACEHOLDER_SPECIMENS = {
  'SEED-MARKER': '[SEED] An introduction to the group.',
  'TK-MARKER': 'Revision code [TK] pending.',
  'PLACEHOLDER-WORD': 'This is placeholder copy.',
  LOREM: 'Lorem ipsum and so on.',
  TODO: 'TODO write this section',
  'SAMPLE-COMPANY': 'A case study with Acme Ltd.',
  'LATIN-FILLER': 'consectetur adipiscing, dolor sit amet, and the rest',
};

check(
  'PLACEHOLDER CLEAN — real copy from the rebuilt /about',
  none(
    placeholderProblems(
      '/about',
      'Gridsmith Design handles brand and visual work, illustration, motion, 3D visualisation ' +
        'and technical drawing.',
    ),
  ),
);

for (const rule of PLACEHOLDER_RULES) {
  const specimen = PLACEHOLDER_SPECIMENS[rule.id];
  check(
    `PLACEHOLDER ${rule.id} — fires, and nothing else does`,
    specimen === undefined
      ? `no specimen registered for ${rule.id} — a rule with no specimen has never been proven`
      : one(placeholderProblems('/about', specimen), rule.id),
  );
}

check(
  'PLACEHOLDER parity — every specimen names a registered rule',
  Object.keys(PLACEHOLDER_SPECIMENS).every((id) => PLACEHOLDER_RULES.some((r) => r.id === id))
    ? true
    : 'a specimen names a rule that does not exist, so it proves nothing',
);

/**
 * **The exact string the owner saw on staging**, kept as a specimen rather than as a memory.
 * `/insights` served nine of these and `/about` served three; every one of them was inside a
 * `[SEED]`-marked CMS field, and nothing on the served side was looking.
 */
check(
  'PLACEHOLDER — the GS-R001 staging string itself trips TWO rules, and both are named',
  (() => {
    // Asserted as a set rather than with `one()`, because the real string genuinely carries
    // both defects and a gate that reported only the first would be hiding the second. The
    // count moving from 1 to 2 on one input is also what shows these are counted, not printed.
    const found = placeholderProblems(
      '/insights',
      '[SEED] Placeholder standfirst. The article has not been written.',
    );
    const ids = ['SEED-MARKER', 'PLACEHOLDER-WORD'];
    return found.length === 2 && ids.every((id) => found.some((f) => f.includes(id)))
      ? true
      : `expected SEED-MARKER and PLACEHOLDER-WORD, got ${JSON.stringify(found)}`;
  })(),
);

/* -- 9. social channels, both directions ------------------------------------- */

const ALL_LINKED = SOCIAL_URLS.map((u) => `<a href="${u}">x</a>`).join(' ');

check(
  'SOCIAL CLEAN — /about linking every approved channel and nothing else',
  none(socialProblems('/about', ALL_LINKED, true)),
);

check(
  'SOCIAL — a missing approved channel on /about',
  one(
    socialProblems('/about', ALL_LINKED.replace(`<a href="${SOCIAL_URLS[0]}">x</a>`, ''), true),
    SOCIAL_URLS[0],
  ),
);

check(
  'SOCIAL — an UNAPPROVED account on a social host, on the route that carries the block',
  one(
    socialProblems('/about', `${ALL_LINKED} <a href="https://www.instagram.com/someone_else">x</a>`, true),
    'someone_else',
  ),
);

check(
  'SOCIAL — an unapproved account on a route with no connection block still fires',
  one(
    socialProblems('/design', '<a href="https://www.facebook.com/not-gridsmith">x</a>', false),
    'not-gridsmith',
  ),
);

check(
  'SOCIAL — the Gridsmith Studio LinkedIn, which a NAME SEARCH would have suggested',
  one(
    socialProblems('/about', `${ALL_LINKED} <a href="https://www.linkedin.com/company/gridsmith-studio">x</a>`, true),
    'gridsmith-studio',
  ),
);

check(
  "SOCIAL CLEAN — a non-social external link is not this question's business",
  none(socialProblems('/legal/privacy', '<a href="https://www.legislation.gov.uk/uksi/2015/17">x</a>', false)),
);

check(
  'SOCIAL CLEAN — a route with no connection block and no social link at all',
  none(socialProblems('/contact', '<a href="mailto:contact@gridsmith.uk">x</a>', false)),
);

check(
  // `https://` alone does throw in `new URL`, but the href scanner's `[^"]+` needs a character
  // after the slashes, so that input never reaches the parse at all — the first specimen here
  // was that, and it proved nothing. A space matches the scanner AND throws.
  'SOCIAL — an unparseable external href is reported, not skipped',
  one(socialProblems('/about', '<a href="https://exa mple.com/x">x</a>', false), 'unparseable'),
);

check(
  'SOCIAL COUNT moves — two unapproved accounts are two problems',
  socialProblems(
    '/design',
    '<a href="https://x.com/someone">a</a> <a href="https://www.tiktok.com/@other">b</a>',
    false,
  ).length === 2
    ? true
    : 'the problem count did not move with the number of defects',
);

/* -- the counts must be provable to move ------------------------------------- */

check(
  'ZERO-SUBJECT — an empty page produces the disclosure failure, not silence',
  disclosureProblems('/', '').length > 0
    ? true
    : 'an empty footer reported clean, so a route that served nothing would pass',
);

check(
  'COUNT moves — two forbidden addresses on one route are two problems, not one',
  emailProblems('/x', 'info@gridsmith.uk and contact.gridsmith@gmail.com', '').length === 2
    ? true
    : 'the problem count did not move with the number of defects, so it is printed, not counted',
);

if (failures.length > 0) {
  console.error(`\ncheck-company-facts selftest: ${failures.length} FAILURE(S)\n`);
  for (const f of failures) console.error(`  ${f}\n`);
  process.exit(1);
}

console.log(`\ncheck-company-facts selftest: PASS — ${passed} case(s), every rule limb asserted by return value.`);
