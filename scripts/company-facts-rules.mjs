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
  /**
   * The two schemes the number may be linked with — `GS-R001-R`. `tel:` is not one of them and
   * `telHref` is gone; question 3 refuses a `tel:` href anywhere.
   *
   * `wa.me` takes the international number with **no leading `+`**; `sms:` keeps it, per RFC
   * 5724. They are different strings for the same number, which is why both are written out
   * here rather than derived from one another inside the expectation.
   */
  whatsAppHref: 'https://wa.me/447405448534',
  smsHref: 'sms:+447405448534',
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
 * Wording that invites a reader to telephone — `GS-R001-R`.
 *
 * **`GS-O004` published the number and linked it for dialling. That limb is superseded and
 * only that limb.** The number is unchanged and still published; what is withdrawn is the
 * voice channel. Nobody has committed to answering a ring, there are no published hours and
 * there never will be, and *"We typically respond within 48 hours"* is a statement about
 * asynchronous contact that a telephone contradicts.
 *
 * One pattern per rule and no alternations inside a rule, for `RESPONSE_RULES`' reason: a
 * half-firing alternation reports success from whichever limb happened to be exercised.
 *
 * **None of these fires on the word "phone" alone**, deliberately. A page may need to say the
 * number is not a phone line, or that a browser will not open `sms:` on a desktop; a rule that
 * fired on the noun would refuse the sentence that explains the decision. What is refused is
 * the *invitation* — an imperative to call, or a `tel:` href, which is the invitation in markup.
 */
export const CALL_RULES = [
  {
    id: 'CALL-CTA-IMPERATIVE',
    pattern: /\b(?:call|ring|phone)\s+us\b/i,
    why: 'a call-to-action inviting a telephone call',
  },
  {
    id: 'CALL-CTA-GIVE-US',
    pattern: /\bgive\s+us\s+a\s+(?:call|ring|bell)\b/i,
    why: 'a call-to-action inviting a telephone call',
  },
  {
    id: 'CALL-CTA-OR-CALL',
    pattern: /\bor\s+call\b/i,
    why: 'the superseded "Or call <number>" offer from GS-O004',
  },
  {
    id: 'CALL-SPEAK-TO',
    pattern: /\bspeak\s+to\s+(?:us|someone)\s+on\b/i,
    why: 'an invitation to speak to someone on the number',
  },
];

/**
 * Markers and placeholder text that must never reach a visitor — `GS-R001-R`.
 *
 * **This is the question the owner's rejection of the `GS-R001` candidate actually asked**, and
 * it had no gate. `check:launch` refuses `isSeed: true` documents on the **production dataset**,
 * which is a different assertion in two ways that both matter: it reads the *dataset* rather
 * than the *page*, and it is inert on `development`, which is the dataset every staging
 * candidate is built from. So the one environment a human reviews was the one environment
 * nothing checked, and nine `[SEED]`-marked posts and two `[SEED]`-marked group pages were
 * served to the owner.
 *
 * The subject here is **served text**, so it fires whatever produced the string — CMS content,
 * a hardcoded fallback, a component's own copy. That is the property `check:launch` cannot have.
 *
 * `TEAM-SEED-NAME` in `TEAM_RULES` is the narrow ancestor of this list and stays where it is:
 * it names a specific person-shaped placeholder and reports under question 6, where a reader of
 * that output expects it.
 */
export const PLACEHOLDER_RULES = [
  {
    id: 'SEED-MARKER',
    pattern: /\[SEED\]/i,
    why: 'the seed-content marker, which is an internal provenance label',
  },
  {
    id: 'TK-MARKER',
    pattern: /\[TK\]/i,
    why: 'the to-come marker CLAUDE.md non-negotiable #2 requires instead of an invented fact',
  },
  {
    id: 'PLACEHOLDER-WORD',
    pattern: /\bplaceholder\b/i,
    why: 'copy describing itself as a placeholder',
  },
  {
    id: 'LOREM',
    pattern: /\blorem ipsum\b/i,
    why: 'filler text',
  },
  {
    id: 'TODO',
    pattern: /\b(?:TODO|FIXME)\b/,
    why: 'a development note in visitor-facing text',
  },
  {
    id: 'SAMPLE-COMPANY',
    pattern: /\b(?:Acme|Example)\s+(?:Ltd|Limited|Inc|Corp|Company)\b/i,
    why: 'a placeholder company name',
  },
  {
    id: 'LATIN-FILLER',
    pattern: /\bdolor sit amet\b/i,
    why: 'filler text',
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
 * The approved social channels — `GS-O017`, closed 18 September 2026.
 *
 * **Hardcoded here, and transcribed from `lib/company/social.ts` rather than imported from it.**
 * That file is the subject; this is the expectation. An expectation read out of its own subject
 * cannot fail when the subject gains an entry, which is the class `check:tokens` carries a
 * hardcoded `REQUIRED` list to avoid — and the failure mode it prevents here is specific: a
 * later session adding an unverified account to the component and this gate agreeing with it.
 *
 * Every URL was resolved before publication; `lib/company/social.ts` carries the per-channel
 * evidence and the provenance, which is the owner's own earlier implementation rather than a
 * search result.
 */
export const SOCIAL_URLS = [
  'https://www.facebook.com/gridsmith',
  'https://www.instagram.com/gridsmith_ltd',
  'https://www.linkedin.com/company/gridsmith',
  'https://x.com/gridsmithltd',
  'https://www.tiktok.com/@gridsmithltd',
  'https://www.youtube.com/@Gridsmithltd',
  'https://www.reddit.com/user/Gridsmithltd',
  'https://www.freelancer.com/u/GridsmithLTD',
];

/**
 * Hosts a profile link may point at. Anything else on a social platform is an account nobody
 * verified — the whole point of question 9.
 *
 * `wa.me` is here because the WhatsApp link is an external profile-shaped URL on the same page
 * and question 3 already owns it; listing it stops question 9 reporting it twice.
 */
const KNOWN_SOCIAL_HOSTS = [
  'facebook.com', 'instagram.com', 'linkedin.com', 'x.com', 'twitter.com',
  'tiktok.com', 'youtube.com', 'youtu.be', 'reddit.com', 'freelancer.com',
  'threads.net', 'pinterest.com', 'mastodon.social', 'bsky.app', 'github.com',
];

/**
 * Problems with the social channels a route serves.
 *
 * Two directions, because either alone is half a check: every approved channel must be present
 * on `/about`, and **no unapproved social host may appear on any route**. The second is what
 * refuses a future session's unverified addition; the first is what stops the block silently
 * emptying.
 *
 * @param {string} route
 * @param {string} html raw served markup
 * @param {boolean} expectPresent true on the route that carries the connection block
 * @param {string[]} [approved] injectable for the self-test
 * @returns {string[]}
 */
export function socialProblems(route, html, expectPresent, approved = SOCIAL_URLS) {
  const problems = [];
  const h = asText(html);

  if (expectPresent) {
    for (const url of approved) {
      if (!h.includes(`href="${url}"`)) {
        problems.push(
          `${route} does not link ${url} — it is an approved channel (GS-O017) and the ` +
            'connection block is expected to carry every one of them.',
        );
      }
    }
  }

  for (const m of h.matchAll(/href="(https?:\/\/[^"]+)"/gi)) {
    const url = m[1];
    let host;
    try {
      host = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      problems.push(`${route} has an unparseable external href ${JSON.stringify(url)}.`);
      continue;
    }
    if (!KNOWN_SOCIAL_HOSTS.some((k) => host === k || host.endsWith(`.${k}`))) continue;
    if (approved.includes(url)) continue;
    problems.push(
      `${route} links ${JSON.stringify(url)} on a social platform, and it is not an approved ` +
        'channel. GS-O017 closed on owner-supplied evidence for a specific set of accounts; ' +
        'an account nobody verified must not be published. Add it to lib/company/social.ts ' +
        'and to SOCIAL_URLS with its verification, or remove it.',
    );
  }
  return problems;
}


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

  // **The assertion is inverted at `GS-R001-R` and this is the load-bearing line.** It used to
  // check that every `tel:` was the RFC 3966 form; a gate shaped that way is green on a site
  // covered in correctly-formatted call links, which is now the defect rather than the fix.
  for (const m of h.matchAll(/href="tel:([^"]*)"/gi)) {
    problems.push(
      `${route} has a tel: href (${JSON.stringify(m[1])}). GS-R001-R withdraws the voice ` +
        'channel: the number is published and is authorised for WhatsApp and SMS only. Link ' +
        'it with whatsAppHref or smsHref, or render it as text.',
    );
  }

  // Each authorised scheme must point at the approved number. Same reasoning as the `mailto:`
  // rule above: a displayed number and a linked number that differ are two numbers.
  for (const m of h.matchAll(/href="(https:\/\/wa\.me\/[^"]*)"/gi)) {
    if (m[1] !== FACTS.whatsAppHref) {
      problems.push(
        `${route} has a WhatsApp link of ${JSON.stringify(m[1])}, not ${FACTS.whatsAppHref}. ` +
          'wa.me takes the international number with no plus and no separators.',
      );
    }
  }
  for (const m of h.matchAll(/href="(sms:[^"]*)"/gi)) {
    if (m[1] !== FACTS.smsHref) {
      problems.push(
        `${route} has an sms: href of ${JSON.stringify(m[1])}, not ${FACTS.smsHref}. ` +
          'RFC 5724 wants the global form.',
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
 * Problems with call-to-action wording that invites a telephone call.
 *
 * @param {string} route
 * @param {string} text
 * @returns {string[]}
 */
export function callProblems(route, text) {
  const t = asText(text);
  return CALL_RULES.flatMap((rule) => {
    const m = t.match(rule.pattern);
    return m
      ? [
          `${route} carries ${rule.id}: ${JSON.stringify(m[0])} — ${rule.why}. GS-R001-R: the ` +
            'number is a WhatsApp and SMS channel, not a call channel.',
        ]
      : [];
  });
}

/**
 * Problems with placeholder markers and filler in visitor-facing text.
 *
 * @param {string} route
 * @param {string} text
 * @returns {string[]}
 */
export function placeholderProblems(route, text) {
  const t = asText(text);
  return PLACEHOLDER_RULES.flatMap((rule) => {
    const m = t.match(rule.pattern);
    return m
      ? [
          `${route} serves ${rule.id}: ${JSON.stringify(m[0])} — ${rule.why}. GS-R001-R: no ` +
            'placeholder, marker or internal content-state label reaches a visitor.',
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
    // Presence only. The footer renders it as text at `GS-R001-R` — see `Footer.tsx` — so
    // this asserts the string is there, and question 3 asserts nothing links it `tel:`.
    [FACTS.contactPhone, 'the published contact number (GS-O004)'],
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
