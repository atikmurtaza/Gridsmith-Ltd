/**
 * **The struck-rule registry and its predicate — a rule deleted in one document and left
 * standing in others.**
 *
 * Six registered, and only the first two were found by a person reading two documents side by
 * side. The other four came from sweeps of the audit trail for decisions recorded as
 * *removed* — and every one of them was still standing somewhere when it was registered, which
 * is the argument for the sweep rather than for the registry alone.
 *
 * Twice now. `P-01`'s `--ink-subtle` 17px floor was deleted at the run-3 fixes and survived in
 * four documents until 4 September 2026. `01-VALIDATION-REPORT.md` §21 is the same shape at a
 * larger scale: round 9 removed an unconditional 14-day refund promise from `CONSUMER-TERMS.md`
 * and `scripts/seed-legal.mjs` — the artefact the site actually published — kept it.
 *
 * Neither was found by a check, because there was nowhere to ask the question. Both were found
 * by a human reading two documents side by side, which does not scale and does not recur.
 *
 * ## The registry is populated by deliberate registration at strike time, not by archaeology
 *
 * **The retrospective sweeps are closed.** Two ran, on 4 September 2026; the first found three
 * live divergences and the second found one, `MASTER-VAT-NUMBER-FIELD`, standing in nine lines
 * of `docs/master/`. A third pass over the same trail — Hostinger, the analytics removal, the
 * four root layouts — produced nothing registrable, which is the expected result once the
 * backlog is drained and is the signal to stop. Sweeping again buys diminishing returns and
 * tempts the failure mode already recorded below: **a registry padded with rules that cannot
 * fire honestly is worse than a short one.** The analytics categories are the standing example
 * — removed on 26 August, but `master/PROJECT-RULES.md` §7 preserves the arrangement as the one
 * that returns with the analytics, so a rule over it would fire on a deliberate record.
 *
 * From here the registry grows one way only: **when a rule is struck, it is registered in the
 * same commit that strikes it.** That obligation is in `CLAUDE.md`. What this gate provides
 * going forward is regression coverage — a struck rule can never quietly come back — and that
 * is all it has ever provided; the retrospective value was a one-off backlog, and it is spent.
 *
 * ## Scope — narrow, and stated because the honest scope is narrower than the class
 *
 * **This check covers explicitly registered rule-statements only. It cannot see a rule struck
 * in prose it was never told about.** There is no general way to recognise "a normative
 * statement" in Markdown, and a check that claimed to would be the worst kind: a summary line
 * over an empty search. So the registry below is hand-maintained, every entry names the
 * decision that struck the rule, and adding an entry is part of striking a rule.
 *
 * What that buys is regression coverage, not discovery: once a rule is struck and registered,
 * it can never quietly come back, and the four documents that carried the 17px floor can never
 * drift apart again. What it does not buy is the *next* silent divergence, which will be in a
 * rule nobody registered. Nothing here mitigates that; the only thing that finds it is the
 * transcription pass that found §21, and that is a process rather than a gate.
 *
 * ## The corpus, and what is deliberately excluded
 *
 * Included: the standing specification documents an implementer follows — the eight per-
 * workstream files under `docs/{master,design,digital,press}/` and the shared foundation.
 *
 * Excluded, each for a reason rather than for convenience:
 *
 * - `docs/_legal/` — the reviewed instruments. `check:legal:parity` owns those, and a struck-
 *   rule check has no business asserting anything about a clause (`CLAUDE.md`: do not draft or
 *   amend clauses). It would also be wrong on its face: `_legal/` **must** state the superseded
 *   wording, because the revision log's job is to record what changed.
 * - the dated audit reports (`docs/_shared/06-` … `12-`) and `FIX-LEDGER.md` — records of a run
 *   at a point in time. A record is *supposed* to preserve struck wording verbatim; failing it
 *   would be demanding that history be rewritten.
 *
 * ## The predicate
 *
 * A line is a **violation** when it matches every regex in `patterns` and no regex in
 * `EXONERATIONS` within `WINDOW` lines either side. Matching is tight (one line, an AND of
 * patterns) and exoneration is loose (a small window), because a struck rule is struck on the
 * line it appears on and the annotation saying so is usually the line after it.
 *
 * Nothing here touches the filesystem, the network or the clock — `evaluate` decides only on
 * its arguments. That is what makes the self-test specimens honest: they exercise this
 * function, not a copy of it, and they read a **return value** rather than an absence, which is
 * the structural immunity `CLAUDE.md` asks for.
 */

/** Lines either side of a match that may carry its annotation. */
export const WINDOW = 3;

/**
 * A line inside the window carrying any of these is an annotated strike, not a live rule.
 *
 * Word-bounded on purpose. An unbounded `/cancel/` would exonerate every line of the
 * cancellation-notice panel, which is the exact subject of `STRUCK_RULES[1]`.
 */
export const EXONERATIONS = [
  /~~/,
  /\b(deleted|struck|removed|superseded|stale|rescinded)\b/i,
  /\bno longer\b/i,
  /\b(is|are|was|were) gone\b/i,
  /\bwent with\b/i,
  /\bdo not build\b/i,
];

/**
 * Every entry is a rule that a recorded decision struck. `why` is the decision; `where` is the
 * statement that survives and is not this one, so the two are never conflated again.
 */
export const STRUCK_RULES = [
  {
    id: 'PRESS-INK-SUBTLE-17PX',
    /** Both must match the same line. `--ink-subtle` alone would hit every token table. */
    patterns: [/--ink-subtle/, /\b17\s*px\b/i],
    why:
      'The `--ink-subtle` 17px size floor was deleted at the run-3 fixes, together with the ' +
      'token value that made it necessary. At its current value the token measures ' +
      '5.44 / 5.73 / 4.98:1 across the three press surfaces and needs no size rule at all. ' +
      '`styles/themes/press.css:8-16` is the record; `press/PROJECT-TRACKER.md` P-01.',
    where:
      'The 17px *body* rule survives on its own terms — typographic, not contrast ' +
      'compensation. `press/DESIGN.md` §2 line 76, gated by `check:press-type` (P-02).',
  },
  {
    id: 'CONSUMER-14-DAY-UNCONDITIONAL',
    /**
     * One phrase, and it is the whole of the struck promise: unconditional, every consumer,
     * every case. The surviving right is conditional on reg. 27(1) scope, so a document
     * stating it correctly does not contain this phrase.
     */
    patterns: [/cancel(?:\s+\w+)?\s+within\s+14\s+days\s+for\s+any\s+reason/i],
    why:
      'Round 9 removed the flat 14-day right. `CONSUMER-TERMS.md` §6 gives it only *where* ' +
      'the contract is distance or off-premises and the CCR 2013 confer it, with §6.1/§6.2 ' +
      'governing the refund. Under `L-CRA-50` the UI statement becomes a term, so the flat ' +
      'wording offers more than the reviewed contract gives — non-negotiable #6, ' +
      '`01-VALIDATION-REPORT.md` §21, `press/PROJECT-TRACKER.md` K-17.',
    where:
      '`docs/_legal/CONSUMER-TERMS.md` §6, and nowhere else. The replacement UI copy is ' +
      'K-17 and is blocked on the owner — this check asserts only that the struck wording ' +
      'does not stand, never what should stand in its place.',
  },
  {
    id: 'INP-ENFORCED-BY-LIGHTHOUSE-CI',
    /**
     * Both, on the same line. `INP` alone hits every budget table and every corrected
     * paragraph; `Lighthouse CI` alone hits the LCP and CLS rows, which are correct — the
     * mobile axis really does assert those.
     */
    patterns: [/\bINP\b/, /\b(Lighthouse\s*CI|LHCI)\b/i],
    why:
      'INP is a field metric and a Lighthouse navigation run does not produce one, so naming ' +
      'LHCI as its enforcement was never possible. Struck at the A-10b two-axis split; TBT at ' +
      'the same ceiling is the lab proxy and real INP has to come from field data. ' +
      '`CLAUDE.md` performance budgets, `master/PROJECT-TRACKER.md` line 534.',
    where:
      'The INP *target* survives — `{master,design,digital,press}/PROJECT-RULES.md` state it ' +
      'as **not assertable in CI** with TBT as the proxy, and `00-FOUNDATION.md` §8 is the ' +
      'two-axis record. This check asserts only that no document re-names LHCI as the gate.',
  },
  {
    id: 'DIGITAL-90KB-TOTAL-BUDGET',
    /** `budget` matches `budgeted` in the annotated Q-M12 line, which is the committed subject. */
    patterns: [/\b90\s*KB\b/i, /budget/i],
    why:
      'Q-M12 changed the metric, not the numbers: JS is budgeted on the delta above the ' +
      '100.2KB framework floor, not on the total, because budgeting on the total lets a ' +
      'framework upgrade silently eat the allowance features were supposed to have. Digital ' +
      "carries a 15KB delta. The 90KB total was a badly-set proxy for Digital's 100/100/100 " +
      'gate. `master/PROJECT-TRACKER.md` Q-M12; `CLAUDE.md` performance budgets.',
    where:
      "Digital's **100/100/100 Lighthouse gate** survives unchanged and is the real claim — " +
      '`digital/PROJECT-RULES.md`. The delta budgets are `CLAUDE.md` and are gated by ' +
      '`scripts/check-bundle-size.mjs`, which reports the floor as its own number.',
  },
  {
    id: 'PRESS-IMPRINT-CREDENTIAL',
    /**
     * Both, on the same line — this is the credentials-strip specification and nothing else.
     * `imprint` alone would hit every correct *no imprint* statement, of which the corpus has
     * several and all of them are the surviving rule.
     */
    patterns: [/\bimprint\b/i, /\bISBN prefix\b/i],
    why:
      'Q-P8 resolved as the author\u2019s own ISBN, the author as publisher of record, and no ' +
      'Gridsmith imprint. Gridsmith therefore has neither an imprint name nor an ISBN prefix, ' +
      'so a credentials strip carrying them would state two credentials that do not exist — ' +
      'non-negotiable #2, and the structural claim in `press/PRD.md` \u00a7Positioning is that a ' +
      'vanity press holds exactly these. `press/PROJECT-TRACKER.md` Q-P8.',
    where:
      '`press/PRD.md` FR-P19 is the surviving rule and states it directly: *"No imprint is ' +
      'claimed, because none is operated."* FR-P04a and R-18 are the module that says so to ' +
      'the reader. The credentials strip keeps company number, years trading, titles ' +
      'published and platforms published to — all verifiable.',
  },
  {
    id: 'MASTER-VAT-NUMBER-FIELD',
    /**
     * One pattern, and that is deliberate — the field name itself is the struck thing. There
     * is no correct un-annotated use of it left in the standing spec: `companyDetails` has no
     * such field, so every line naming it either specifies one to build or records one that
     * used to exist, and both need the annotation for the reader to tell which.
     */
    patterns: [/vatNumber/],
    why:
      'Gridsmith Ltd is not VAT registered. On 2 September 2026 `vatNumber` was removed from ' +
      'the Sanity schema, the GROQ projection, the footer, `/about`, the seed and ' +
      "`check:launch`'s live-required tier, and `M-P2-3` was closed rather than deferred — a " +
      'non-registered trader has no number to disclose and no net/gross distinction to draw. ' +
      'The absence is the decision and both `sanity/schemas/companyDetails.ts` and ' +
      '`lib/company/companyDetails.ts` say so in their first lines. ' +
      '`_shared/05-HANDOVER.md` 2 Sept 2026; `docs/_legal/03-REVISION-LOG.md`.',
    where:
      'The **VAT display rule** survives and is the live one: no price this site serves may be ' +
      'presented as VAT-exclusive and no VAT number may be published. ' +
      '`scripts/check-vat-display.mjs`, in `verify:served`, proving its predicate against 13 ' +
      'specimens first. This check asserts only that no document re-specifies the field.',
  },
  /**
   * **`GS-D002`, registered in the `GS-P03` commit that removed the price fields.** Four
   * wordings of one struck rule, each one pattern so no rule carries an alternation that needs
   * per-limb proof. Every line they match was annotated in the same commit.
   */
  {
    id: 'GS-D002-SERVICE-PAGE-WITHOUT-PRICING',
    patterns: [/service page without pric/i],
    why:
      'SC-6 / old non-negotiable #3 — "never publish a service page without pricing" — was ' +
      'superseded by owner decision GS-D002 (bespoke quotation). GS-P03 removed ' +
      '`service.pricingModel` and `pricingBlock`; a service page is complete with no price.',
    where:
      '`CLAUDE.md` non-negotiable #3 ("never require public pricing") and ' +
      '`_shared/SERVICE-ARCHITECTURE.md`. `check:schemas` refuses a price field on any type.',
  },
  {
    id: 'GS-D002-PRICE-REQUIRED',
    patterns: [/\bpric(?:e|ing) required\b/i],
    why:
      'Tracker and plan rows that made a price a required field of a service page or a Press ' +
      'package. GS-D002 superseded both; GS-P03 removed the fields.',
    where: '`_shared/SERVICE-ARCHITECTURE.md` §Pricing reconciliation; `check:schemas`.',
  },
  {
    id: 'GS-D002-VISIBLE-PRICE-BAND',
    patterns: [/visible price band/i],
    why:
      'Digital group landings were specified to show a visible price band so a buyer did not ' +
      'need the estimator. GS-D002 removed public bands and GS-P03 removed the estimator route.',
    where: 'Digital service groups lead to a contextual enquiry — `_shared/SERVICE-ARCHITECTURE.md`.',
  },
  {
    id: 'GS-D002-PACKAGE-NO-POA',
    patterns: [/\bPOA\b/],
    why:
      'Press non-negotiable #3 — "every package shows a total price; there is no POA path" — was ' +
      'superseded by GS-D002. GS-P03 removed `publishingPackage.price` and its sibling fields.',
    where:
      'The honesty half survives: `excludes` and `notFor` stay required (ETH-03, FR-P06). ' +
      '`press/PROJECT-RULES.md` §1 as annotated.',
  },
  /**
   * **`GS-O013`, registered in the `GS-P06` commit that struck them.** Three of the six owner
   * remediations are *normative statements about what Gridsmith does not do*, which is what this
   * registry is for; the other three are tone and phrasing, which it is not and cannot be.
   *
   * **Why these need a second gate at all.** `check:service-content` question 4 refuses eleven
   * struck phrasings and is the stronger assertion — but its subject is
   * `scripts/service-content.mjs`, the delivered copy. These rules' subject is the **standing
   * specification**, where a future session could restate the position and nothing would notice.
   * Disjoint corpora, complementary gates: neither can see the other's subject, which is the
   * opposite of the "two gates over one subject" hazard `CLAUDE.md` warns about.
   */
  {
    id: 'GS-O013-MEDIA-BUYING-DENIAL',
    /** One pattern. The other phrasing ("does not run ad accounts") was already struck at GS-P05
     *  and is annotated on the same line; a rule per phrasing would need a proof per phrasing for
     *  a position that is one position. */
    patterns: [/media buying is not something/i],
    why:
      'The site denied media buying while selling Google Ads and Meta account management, and ' +
      'running an ad account IS placing paid media. GS-P05 read the owner\u2019s silence at ' +
      'GS-O012 as a refusal; it was silence, and a denial is a claim about the company that has ' +
      'to be true. Struck by GS-O013. `_shared/SERVICE-ARCHITECTURE.md` \u00a713.',
    where:
      'The scope boundary survives and is the live one: campaign and advertising ACCOUNT ' +
      'management is a separate cross-division engagement rather than part of the Design ' +
      'creative service. `DIGITAL_MARKETING_ENGAGEMENT` carries paid media management as a ' +
      'Master row; the 81-service catalogue is unchanged and no service record may claim ' +
      '"Media buying" \u2014 `UNCONFIRMED_CHANNEL_SERVICES`, asserted by check:service-content.',
  },
  {
    id: 'GS-O013-HOSTING-RESALE',
    patterns: [/does not resell hosting/i],
    why:
      'A permanent rule against reselling hosting forecloses managed-hosting arrangements the ' +
      'owner has not ruled out, and it was published as a client-facing promise. Struck by ' +
      'GS-O013: hosting is project-specific and set by the written agreement.',
    where:
      'The capability survives and widened: Hosting Coordination & Management \u2014 coordination, ' +
      'configuration, deployment, maintenance, monitoring and management, arranged per project. ' +
      'No hosting product, SLA or price was invented, and the approved capability name ' +
      '"Hosting coordination" in `lib/services/catalogue.ts` is untouched.',
  },
  /**
   * **`GS-O004`, registered in the `GS-R001` commit that struck them.** Three rules, one pattern
   * each. All three were struck **in place** rather than deleted: `master/SCHEMA.md` carries the
   * annotated `businessHours` line and the annotated `teamMember` note, so this gate has a
   * subject to reach — deleting the wording would have removed it, which is the mistake
   * `_shared/01-VALIDATION-REPORT.md` §21 records.
   */
  {
    id: 'GS-O004-BUSINESS-HOURS-FIELD',
    /**
     * The field name is the struck thing, exactly as `MASTER-VAT-NUMBER-FIELD` above. There is
     * no correct un-annotated use of it left in the standing spec: `companyDetails` has no such
     * field, so every line naming it either specifies one to build or records one that used to
     * exist, and a reader cannot tell which without the annotation.
     */
    patterns: [/businessHours/],
    why:
      'The owner does not authorise published business hours \u2014 `GS-O004`, 16 September 2026. ' +
      'The field was removed from the Sanity schema, the `CompanyDetails` type, the GROQ ' +
      'projection and `/contact`, on the `vatNumber` precedent directly above it: a field that ' +
      'does not exist cannot be filled in by an editor who did not know the decision, whereas ' +
      'an empty optional field is a surface waiting for a value. Gridsmith works remotely and ' +
      'has not committed to hours; publishing any would be a claim about the business.',
    where:
      'The published telephone number survives and is new \u2014 `+44 7405 448534`, with no hours ' +
      'beside it, which is the honest form. `check:company` question 5 asserts on the SERVED ' +
      'pages that no clock range and no "opening/office/business hours" label appears, proven ' +
      'by deliberate failure on both. This check asserts only that no document re-specifies ' +
      'the field.',
  },
  {
    id: 'GS-O004-RESPONSE-GUARANTEE',
    patterns: [/always by the end of the next business day/i],
    why:
      'Struck by `GS-O004`: the owner authorises no guaranteed response time and no SLA, and ' +
      '*"always"* is an unqualified undertaking about performance \u2014 a published one is a term ' +
      'a customer can hold the company to. `companyDetails.responseCommitment` now reads ' +
      '*"We typically respond within 48 hours."*',
    where:
      '**Non-negotiable #5 is NOT struck and is unchanged**: nothing may promise a response ' +
      'faster than the end of the next business day, and `responseCommitment` remains the one ' +
      'source of truth. The new value is slower than that ceiling AND is not a promise, so the ' +
      'rule holds twice over \u2014 and the single-source design is what made the change one edit ' +
      'rather than six. `check:company` question 5 refuses guarantee wording, SLA wording and ' +
      '"ASAP" on the served pages, each rule broken separately in the self-test.',
  },
  {
    id: 'GS-O004-PUBLIC-TEAM-ROSTER',
    patterns: [/isPublic: true. members render/i],
    why:
      'Struck by `GS-O004`: there are **no** public team members. No founder profile, no ' +
      'employee profiles, no placeholder staff, no stock identities \u2014 the owner represents ' +
      'the company institutionally. `master/SCHEMA.md` said *"Only `isPublic: true` members ' +
      'render on `/about`"*, and that boolean was the entire control. The development dataset ' +
      'held four `teamMember` records named `[SEED] Placeholder Name` with `isPublic: true`, ' +
      'so the served `/about` published four placeholder people under the heading "Who you ' +
      'will work with". **Nothing in the source was wrong**, which is why it survived six ' +
      'phases and an accessibility audit.',
    where:
      '`listPublicTeam`, the `TeamMember` type, the `/about` roster and its CSS are deleted, ' +
      'and `scripts/seed-content.mjs` writes `isPublic: false`. The `teamMember` schema type ' +
      'stays defined and **dormant**, like `project` and `book`, so a future decision is ' +
      'available \u2014 but restoring publication means writing a query, which shows in a diff, ' +
      'rather than flipping a field, which does not. `check:company` question 6 asserts the ' +
      'absence on the served page, proven by deliberate failure.',
  },
  /**
   * **`GS-R001-R`, registered in the commit that struck them.** Two rules, one pattern each,
   * both struck **in place**: `master/APP-FLOW.md`'s confirmation-copy block carries the
   * annotated `call [number]` line, and `master/PROJECT-TRACKER.md` carries the annotated
   * nine-post seed line. Deleting either wording would remove this gate's only subject, which
   * is `_shared/01-VALIDATION-REPORT.md` §21's mistake.
   */
  {
    id: 'GS-R001-R-CALL-CHANNEL',
    patterns: [/call \[number\]/i],
    why:
      'Struck by `GS-R001-R`, 17 September 2026: the published number is **not a voice-call ' +
      'channel**. Nobody has committed to answering a ring, no business hours are published ' +
      'and none ever will be (`GS-O004`, unchanged), and *"We typically respond within 48 ' +
      'hours"* is a statement about asynchronous contact that a telephone contradicts. The ' +
      '`tel:` hrefs on `/about`, `/contact`, `/press/contact` and the statutory footer are ' +
      'removed, and `telHref` is deleted from `lib/company/companyDetails.ts`.',
    where:
      '**The number itself survives unchanged and is still published** \u2014 `+44 7405 448534`, ' +
      'on the same surfaces. What changed is the scheme: `whatsAppHref` gives ' +
      '`https://wa.me/447405448534` and `smsHref` gives `sms:+447405448534`, each derived from ' +
      'the displayed string so the number read and the number reached cannot differ. The ' +
      'statutory footer renders it as **text**, because that block is a Companies Act ' +
      'disclosure rather than a contact surface and reg. 6(1)(c) needs it readable, not ' +
      'clickable. `check:company` question 3 refuses any `tel:` href on any route and question ' +
      '7 refuses the wording, each rule broken separately in the 57-case self-test.',
  },
  {
    id: 'GS-R001-R-SEED-POSTS',
    patterns: [/9 posts/i],
    why:
      'Struck by `GS-R001-R`: the nine `[SEED]`-marked `post` documents were **published** on ' +
      'the `GS-R001` staging candidate, and the owner rejected them. The objection was not the ' +
      'marker \u2014 a generated article presented as a company\u2019s thinking is fake whether or ' +
      'not it is labelled, and removing the label would have made it worse rather than better.',
    where:
      'Nine **editorial briefs** replace them, on the owner\u2019s own topics, carrying ' +
      '`status: \'brief\'` \u2014 premise, reader, central question, arguments, structure and the ' +
      'research questions nobody has answered yet. `lib/sanity/queries.ts` serves only ' +
      '`status == "published"`, by strict equality and never `coalesce`, so a brief is absent ' +
      'from `/insights` **and** has no page built for it at all. The seed-marker convention ' +
      'itself is untouched for `teamMember` and `faq`, neither of which renders.',
  },
  {
    id: 'GS-O013-ACCESSIBILITY-CERTIFY',
    patterns: [/no one can certify accessibility/i],
    why:
      'Categorical and false \u2014 formal accessibility conformance certification exists. Struck by ' +
      'GS-O013 and replaced with a scoped statement: certification is not included unless ' +
      'explicitly scoped.',
    where:
      'Everything substantive survives: WCAG 2.2 AA positioning, the automated/manual testing ' +
      'distinction, honest residual-risk language, and no unsupported guarantee of universal ' +
      'compliance. Gridsmith reports the standards tested, the evidence, the findings and the ' +
      'residual issues.',
  },
];

/** The standing-spec corpus. Globbed by the runner; listed here so the scope is reviewable. */
export const CORPUS_GLOBS = [
  'docs/master/*.md',
  'docs/design/*.md',
  'docs/digital/*.md',
  'docs/press/*.md',
  'docs/_shared/00-FOUNDATION.md',
  'docs/_shared/00-PROCESS.md',
];

/** A floor on the corpus, so an empty or mis-rooted glob cannot report a clean run. */
export const MIN_FILES = 30;

/**
 * @param {{file: string, text: string}[]} files
 * @param {typeof STRUCK_RULES} [rules]
 * @returns {{ok: boolean, problems: string[], counts: Record<string, {matched: number, exonerated: number}>}}
 */
export function evaluate(files, rules = STRUCK_RULES) {
  const problems = [];
  const counts = {};

  if (files.length < MIN_FILES) {
    problems.push(
      `ZERO-SUBJECT: ${files.length} document(s) read, expected at least ${MIN_FILES}. ` +
        `The corpus is empty or mis-rooted; nothing was measured.`,
    );
  }

  for (const rule of rules) {
    counts[rule.id] = { matched: 0, exonerated: 0 };

    for (const { file, text } of files) {
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (!rule.patterns.every((p) => p.test(lines[i]))) continue;
        counts[rule.id].matched++;

        const window = lines.slice(Math.max(0, i - WINDOW), i + WINDOW + 1).join('\n');
        if (EXONERATIONS.some((e) => e.test(window))) {
          counts[rule.id].exonerated++;
          continue;
        }
        problems.push(
          `${rule.id} STANDS at ${file}:${i + 1}\n` +
            `    ${lines[i].trim()}\n` +
            `    struck because: ${rule.why}\n` +
            `    what survives:  ${rule.where}`,
        );
      }
    }

    // The hollow-subject guard. A rule whose patterns have rotted matches nothing, reports no
    // violation, and is indistinguishable from a rule that is being honoured. `CLAUDE.md`: a
    // gate with no subject is not green and not red — it is silent.
    if (counts[rule.id].matched === 0) {
      problems.push(
        `HOLLOW SUBJECT: ${rule.id} matched no line in the corpus. Either the struck wording ` +
          `was deleted outright rather than annotated — which removes the gate's only ` +
          `subject — or its patterns have rotted. Restore the annotated line or retire the rule.`,
      );
    }
  }

  return { ok: problems.length === 0, problems, counts };
}
