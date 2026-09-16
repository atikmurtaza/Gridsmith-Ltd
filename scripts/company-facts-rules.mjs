/**
 * The `GS-O004` company-fact assertions, as pure functions — `GS-R001`.
 *
 * Split from the fetch for the reason `launch-content-rules.mjs` records: a top-level-`await`
 * script that fetches before it asserts has no subject but whatever a server happened to serve,
 * so its predicates can only ever be exercised by a live run. These are exercised by
 * `check-company-facts.selftest.mjs`, which reads a **return value** rather than the absence of
 * an error — `CLAUDE.md`, *"prefer a probe whose validity is structural"*.
 *
 * Nothing here reads the environment, the network or the clock.
 *
 * ## The facts, and where they come from
 *
 * Every value below was supplied by the owner at `GS-O004` on 16 September 2026. Two of them
 * were additionally corroborated against sources that are not this repository, and the
 * corroboration is recorded because `PRE-DEPLOYMENT-CHECKLIST.md` A1/A2 had them open as
 * *"confirm against the Companies House register"* since 7 September:
 *
 * | Fact | Owner | Corroboration |
 * |---|---|---|
 * | `Gridsmith Ltd` | yes | Companies House register, 16 Sep 2026 — `GRIDSMITH LTD`, active |
 * | `17050842` | yes | the same register entry |
 * | registered in **England** | yes | the register gives the registered office country as `England`. The seed said `England & Wales`, which no owner and no register had ever confirmed |
 * | `contact@gridsmith.uk` | yes — *"working and authorised for publication"* | — |
 * | `+44 7405 448534` | yes | the live `gridsmith.uk` publishes the same number (`LIVE-SITE-EXTRACT.md` §9) |
 *
 * **Hardcoded here, deliberately.** An expectation read from `companyDetails` could not fail
 * when `companyDetails` is wrong, which is the whole class `check:tokens` carries a hardcoded
 * `REQUIRED` list to avoid. The singleton is the subject; this is the expectation.
 */

/** The owner-approved facts. The expectation, not the subject. */
export const FACTS = {
  legalName: 'Gridsmith Ltd',
  companyNumber: '17050842',
  placeOfRegistration: 'England',
  contactEmail: 'contact@gridsmith.uk',
  contactPhone: '+44 7405 448534',
  /** RFC 3966 global form: `+` and digits, no visual separators. */
  telHref: 'tel:+447405448534',
  /**
   * The reg. 25(2)(c) particular. It is asserted to appear **only** in the statutory footer
   * and in the `_legal/` instruments — see `officeProblems`.
   */
  registeredOffice: '30 Briarfield Road, Farnworth, Bolton, BL4 0HD',
};

/**
 * Addresses that must never be served — `GS-O004` and `LIVE-SITE-EXTRACT.md` §11.2.
 *
 * The live site puts **three** addresses in play and links one while displaying another. Only
 * `contact@gridsmith.uk` has any standing; the other two are legacy, and the danger is not that
 * someone reintroduces them on purpose but that a page is copied from the old site.
 *
 * `noreply@` is not here: nothing serves one, and a denylist entry for a string that never
 * appears is an assertion that cannot fire.
 */
export const FORBIDDEN_EMAILS = [
  ['contact.gridsmith@gmail.com', 'the legacy Gmail address the live site displays'],
  ['info@gridsmith.uk', 'the legacy address the live site links but never shows'],
  ['example.com', 'a placeholder domain'],
  ['example.org', 'a placeholder domain'],
];

/**
 * Wording that turns a statement of typical behaviour into an undertaking.
 *
 * **`GS-O004`: the owner authorises no guaranteed response time and no SLA.** The site said
 * *"We'll reply as soon as we can, and always by the end of the next business day"* — "always"
 * is unqualified, and a published undertaking about performance is a term a customer can hold
 * the company to. The replacement is *"We typically respond within 48 hours."*
 *
 * One pattern per rule, no alternations inside a rule. `CLAUDE.md` requires every branch of a
 * multi-branch assertion to be proven separately, and a half-firing alternation reports success
 * from whichever limb happened to be exercised.
 */
export const RESPONSE_RULES = [
  {
    id: 'GUARANTEE-ALWAYS-BY',
    pattern: /always\s+(?:by|within)\b/i,
    why: 'an unqualified undertaking about when a reply arrives',
  },
  {
    id: 'GUARANTEE-WORD',
    pattern: /\bguarantee(?:d|s)?\s+(?:a\s+)?(?:repl|response|answer|turnaround)/i,
    why: 'a response time described as guaranteed',
  },
  {
    id: 'GUARANTEE-SLA',
    pattern: /\bservice[-\s]level\s+agreement\b/i,
    why: 'an SLA, which the owner has not authorised',
  },
  {
    id: 'ASAP',
    pattern: /\bASAP\b/,
    why: 'the owner asked that "ASAP" not appear in public-facing copy',
  },
  {
    id: 'BUSINESS-HOURS-CLOCK',
    pattern: /\b(?:0?[1-9]|1[0-2])\s?(?:am|pm)\s*(?:to|-|–|—|until)\s*(?:0?[1-9]|1[0-2])\s?(?:am|pm)/i,
    why: 'published opening hours, which GS-O004 does not authorise',
  },
  {
    id: 'BUSINESS-HOURS-LABEL',
    pattern: /\b(?:opening|office|business)\s+hours\b/i,
    why: 'a published statement of business hours',
  },
];

/**
 * Wording or markup that publishes a person as Gridsmith staff.
 *
 * `GS-O004`: there are no public team members. The failure this exists for already happened —
 * the development dataset carried four `teamMember` records named `[SEED] Placeholder Name`
 * with `isPublic: true`, and the served `/about` published all four under a heading. The query
 * and the renderer are deleted, and this asserts the result on the page rather than in source.
 */
export const TEAM_RULES = [
  {
    id: 'TEAM-SEED-NAME',
    pattern: /\[SEED\]\s*Placeholder Name/i,
    why: 'a seeded placeholder person',
  },
  {
    id: 'TEAM-HEADING',
    pattern: /Who you will work with/i,
    why: 'the team roster heading',
  },
  {
    id: 'TEAM-MEET',
    pattern: /\bmeet\s+the\s+(?:team|founder)\b/i,
    why: 'a team or founder profile section',
  },
];

/** The served text of one route, already stripped of tags. */
const asText = (v) => (typeof v === 'string' ? v : '');

/**
 * Problems with the email addresses a route serves.
 *
 * @param {string} route
 * @param {string} text served text, tags stripped
 * @param {string} html the raw served markup, for `mailto:` hrefs
 * @returns {string[]}
 */
export function emailProblems(route, text, html) {
  const problems = [];
  const t = asText(text);
  const h = asText(html);

  for (const [address, why] of FORBIDDEN_EMAILS) {
    if (t.toLowerCase().includes(address) || h.toLowerCase().includes(address)) {
      problems.push(
        `${route} publishes ${JSON.stringify(address)} — ${why}. The only approved address is ` +
          `${FACTS.contactEmail} (GS-O004).`,
      );
    }
  }

  // A `mailto:` that points somewhere other than the approved address is the live site's exact
  // defect: its footer displays one address and links another, so reading it and clicking it
  // reach different mailboxes.
  for (const m of h.matchAll(/mailto:([^"'\s>?]+)/gi)) {
    if (m[1].toLowerCase() !== FACTS.contactEmail) {
      problems.push(
        `${route} has a mailto: pointing at ${JSON.stringify(m[1])}, not ${FACTS.contactEmail}. ` +
          'A displayed address and a linked address that differ is LIVE-SITE-EXTRACT.md §11.2.',
      );
    }
  }
  return problems;
}

/**
 * Problems with the telephone number a route serves.
 *
 * @param {string} route
 * @param {string} text
 * @param {string} html
 * @returns {string[]}
 */
export function phoneProblems(route, text, html) {
  const problems = [];
  const t = asText(text).replace(/\s+/g, ' ');
  const h = asText(html);

  for (const m of h.matchAll(/href="tel:([^"]*)"/gi)) {
    if (m[1] !== FACTS.telHref.slice(4)) {
      problems.push(
        `${route} has a tel: href of ${JSON.stringify(m[1])}, not ${FACTS.telHref.slice(4)}. ` +
          'RFC 3966 wants a global number with no visual separators, and a dialled number that ' +
          'differs from the displayed one is a second phone number.',
      );
    }
  }

  // Any UK mobile or landline that is not the approved one. Deliberately narrow — a general
  // "looks like a number" pattern fires on dates, company numbers and postcodes.
  const approved = FACTS.contactPhone.replace(/\s+/g, ' ');
  for (const m of t.matchAll(/\+44\s?[0-9][0-9\s]{8,13}/g)) {
    const found = m[0].trim().replace(/\s+/g, ' ');
    if (found !== approved) {
      problems.push(
        `${route} publishes the phone number ${JSON.stringify(found)}, which is not the ` +
          `approved ${approved} (GS-O004).`,
      );
    }
  }
  return problems;
}

/**
 * Problems with response-time and opening-hours wording.
 *
 * @param {string} route
 * @param {string} text
 * @returns {string[]}
 */
export function responseProblems(route, text) {
  const t = asText(text);
  return RESPONSE_RULES.flatMap((rule) => {
    const m = t.match(rule.pattern);
    return m
      ? [
          `${route} carries ${rule.id}: ${JSON.stringify(m[0])} — ${rule.why}. GS-O004 ` +
            'authorises a statement of typical behaviour only.',
        ]
      : [];
  });
}

/**
 * Problems with public team publication.
 *
 * @param {string} route
 * @param {string} text
 * @returns {string[]}
 */
export function teamProblems(route, text) {
  const t = asText(text);
  return TEAM_RULES.flatMap((rule) => {
    const m = t.match(rule.pattern);
    return m
      ? [`${route} publishes ${rule.id}: ${JSON.stringify(m[0])} — ${rule.why}. GS-O004: none.`]
      : [];
  });
}

/**
 * Problems with where the registered office appears.
 *
 * **The reading `GS-R001` took, stated so it can be argued with rather than rediscovered.**
 * `GS-O004` says the registered office is not displayed throughout the marketing website, and
 * only where a legal requirement or an already-approved legal document requires it. Two things
 * require it and they are the only two exceptions this encodes:
 *
 * 1. **SI 2015/17 reg. 25(2)(c)** requires the address of the registered office on the
 *    company's websites. This build satisfies it in the statutory footer, which is on every
 *    page — `_legal/02-CITATION-LEDGER.md` `L-CTD-25`. That is a legal requirement, so it is
 *    inside the owner's own carve-out, and moving it to one page would be a compliance
 *    decision rather than a content one.
 * 2. **The `_legal/` instruments** name it as the address for service (`CONSUMER-TERMS` §18,
 *    `MSA-BUSINESS` §11, `PRIVACY-POLICY` §9). Those are already-approved legal documents and
 *    amending a clause is not available to an implementer.
 *
 * Everything else is withdrawn. `/about` rendered it a second time in a marketing table; that
 * row is gone. What this asserts is therefore **position, not presence**: the address may
 * appear inside the statutory footer element, and on a `/legal/` route it may appear anywhere;
 * on any other route it may not appear outside the footer.
 *
 * @param {string} route
 * @param {string} bodyText served text with the statutory footer removed
 * @param {boolean} isLegalRoute
 * @returns {string[]}
 */
export function officeProblems(route, bodyText, isLegalRoute) {
  if (isLegalRoute) return [];
  const t = asText(bodyText).replace(/\s+/g, ' ');
  // Match on the distinctive part rather than the whole string: a page that reproduced the
  // address with different punctuation would otherwise slip past.
  if (/Briarfield Road/i.test(t) || /BL4\s?0HD/i.test(t)) {
    return [
      `${route} displays the registered office outside the statutory footer. GS-O004 withdraws ` +
        'it from the marketing site; SI 2015/17 reg. 25(2)(c) is satisfied by the footer, and ' +
        'the _legal/ instruments carry it as the address for service.',
    ];
  }
  return [];
}

/**
 * Problems with the statutory disclosure itself.
 *
 * The other five functions are absences. This one is a presence, and it is here so that a run
 * reporting "no forbidden string found" cannot be a run against a page that served nothing —
 * the same reason `check-reviews-ui` question 1 fires the selector question 2 asserts against.
 *
 * @param {string} route
 * @param {string} footerText the statutory footer's text, or '' when there was none
 * @returns {string[]}
 */
export function disclosureProblems(route, footerText) {
  const t = asText(footerText).replace(/\s+/g, ' ');
  if (t.length === 0) {
    return [`${route} served no statutory footer at all — nothing on it was measured.`];
  }
  const problems = [];
  const required = [
    [FACTS.legalName, 'the registered name (SI 2015/17 reg. 24(2))'],
    [`registered in ${FACTS.placeOfRegistration}`, 'the part of the UK (reg. 25(2)(a))'],
    [FACTS.companyNumber, 'the registered number (reg. 25(2)(b))'],
    [FACTS.registeredOffice, 'the registered office (reg. 25(2)(c))'],
    [FACTS.contactEmail, 'an email address (e-commerce regs reg. 6(1)(c))'],
    [FACTS.contactPhone, 'the published telephone number (GS-O004)'],
  ];
  for (const [value, why] of required) {
    if (!t.includes(value)) {
      problems.push(`${route}'s statutory footer is missing ${JSON.stringify(value)} — ${why}.`);
    }
  }
  // The superseded value, named explicitly. It stood in the seed, in the citation ledger and in
  // the factual inventory, so it is the string a later session is most likely to restore.
  if (/registered in England\s*&(?:amp;)?\s*Wales/i.test(t)) {
    problems.push(
      `${route}'s footer says "England & Wales". GS-O004 gives "England", corroborated by the ` +
        'Companies House register. The old value was an agent-chosen seed nobody had confirmed.',
    );
  }
  return problems;
}
