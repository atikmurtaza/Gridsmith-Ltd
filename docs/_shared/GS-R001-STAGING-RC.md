# `GS-R001` — staging release candidate: the evidence

**Phase:** `GS-R001` / `GS-O008` — staging release candidate and human-acceptance preparation.
**Date:** 16 September 2026. **Agent:** Claude Code (Opus 5).
**Predecessor:** `GS-P06`. **Production cutover: NOT performed and NOT authorised.**

> **`RC TECHNICALLY PASS` is not `PRODUCTION READY`.** They are different statuses and this
> document keeps them apart deliberately. The candidate builds, every gate is green, every
> journey works and nothing on it is untrue. It is still not ready for the public, and §8 says
> exactly what is missing and who owns each item.

---

## 1. What this phase changed, in one table

| | |
|---|---|
| `GS-O004` | **CLOSED.** Company and contact facts supplied, implemented and gate-asserted |
| `GS-O015` | **CLOSED.** Two reviews stay withheld — and the withholding moved from an id list to a rule that reaches reviews nobody has seen |
| `G-01` | **CLOSED.** The live URL inventory is eight URLs, read from the live site's own sitemap |
| `G-04`, `G-05` | **CLOSED.** robots, sitemap, canonicals, Open Graph, `Organization` structured data |
| `Q-M9` | **ANSWERED.** No public team members |
| Checklist `A1`–`A5`, `A8` | **CLOSED.** `A6`, `A7` remain; `A7` is lifted into `GS-O016` |
| New owner action | `GS-O016` — the ICO registration position |
| Gates | **43 → 45.** `check:company` (six questions, served) and `check:company:selftest` (35 cases) |
| Struck rules | **13 → 16**, each annotated in place and specimen-proven |

---

## 2. The defect that mattered, because it was invisible in source

**The served `/about` published four people who do not exist.**

`components/…/about` rendered `listPublicTeam()`, whose query filters `isPublic == true`. The
schema defaults that field **false**, and its docstring says why: *"a person appearing on a public
website is a decision someone makes rather than the absence of one."* Read the schema and the
query and the page, and the control looks correct.

`scripts/seed-content.mjs` set `isPublic: true` on all four seeded `teamMember` records. The
development dataset therefore carried four documents named `[SEED] Placeholder Name`, each with
a `[SEED]` role and a `[SEED]` credential, and the page rendered them under the heading **"Who
you will work with"**.

It survived `GS-P03`, `GS-P04`, `GS-P05`, `GS-P06`, an accessibility audit and a content-integrity
audit. **Nothing in the source was wrong.** The defect existed only in the interaction between a
default, an override and a filter, and only a check that reads the *page* could see it.

**The fix is deletion, not a flag.** `listPublicTeam`, the `TeamMember` type, the roster markup
and its CSS are gone, and the seed writes `isPublic: false`. The `teamMember` schema type stays
defined and dormant, like `project` and `book`. Restoring publication now means writing a query —
visible in a diff — rather than flipping a boolean, which is not.

---

## 3. `GS-O004` — the facts, and what was done with each

| Fact | Value | Implementation | Corroboration |
|---|---|---|---|
| Registered name | `Gridsmith Ltd` | `companyDetails.legalName` | Companies House, 16 Sep 2026 |
| Company number | `17050842` | `companyDetails.companyNumber` | the same register entry — **active**, incorporated 24 Feb 2026 |
| Registration wording | `Registered in England` | `placeOfRegistration`, rendered *"registered in England"* | the register gives the registered office country as `England`. The previous `England & Wales` was an agent-chosen seed value |
| Public email | `contact@gridsmith.uk` | one source, six surfaces | owner confirms the mailbox works and is authorised |
| Public telephone | `+44 7405 448534` | footer, `/contact`, `/press/contact`, `/about`, JSON-LD | the live `gridsmith.uk` publishes the same number |
| Business hours | **none** | the `businessHours` field is **removed** from the schema | — |
| Response wording | *"We typically respond within 48 hours."* | `responseCommitment`, the single source | — |
| Registered office | footer and `_legal/` **only** | withdrawn from `/about` | — |
| Public team | **none** | query and renderer deleted | — |

### 3.1 The `tel:` representation, and why it is derived

`telHref` strips everything but `+` and digits, so `+44 7405 448534` is displayed and
`tel:+447405448534` is dialled, from **one** stored string. The live site does not do this: its
footer displays `contact.gridsmith@gmail.com` while linking `mailto:info@gridsmith.uk`
(`LIVE-SITE-EXTRACT.md` §11.2), so reading it and clicking it reach different mailboxes. A second
stored field is how that happens, and `check:company` question 2 now refuses it.

### 3.2 The registered office — the reading taken, stated so it can be argued with

`GS-O004` says the registered office is not displayed throughout the marketing website, and only
where a legal requirement or an already-approved legal document requires it. **Two things require
it and they are the only two exceptions implemented:**

1. **SI 2015/17 reg. 25(2)(c)** requires the address of the registered office on the company's
   websites. This build satisfies it in the statutory footer, which is on every page —
   `_legal/02-CITATION-LEDGER.md` `L-CTD-25`, and the `Footer.tsx` docstring has cited the
   regulation since `M-04`. Moving it to a single page would be a compliance decision, not a
   content one, and is not an implementer's to take.
2. **The `_legal/` instruments** name it as the address for service. Amending a clause is not
   available here.

`/about`'s `Registered office` row is removed — it was a second copy of a residential address on
a marketing page, disclosing nothing the footer below it did not. The `Trading address` row went
with it: it was conditional on a field that is empty *because* it is the same premises, so it
could only ever have rendered a duplicate of the row above it.

`check:company` question 4 therefore asserts **position, not presence**: the address may appear
inside the `<footer>` element, and anywhere on a `/legal/` route; nowhere else.

**If the owner meant the footer too, that is a one-sentence instruction and a small change** — but
it needs the reg. 25(2)(c) position resolved, which belongs with `GS-O003`.

### 3.3 The response commitment — a rule kept, a value struck

The old value was *"We'll reply as soon as we can, and always by the end of the next business
day."* **"Always" is an unqualified undertaking**, and a published one is a term a customer can
hold the company to. `GS-O004` authorises no guaranteed response time and no SLA.

**Non-negotiable #5 is not struck and did not need to be.** It forbids promising *faster* than the
end of the next business day; the new wording is slower than that ceiling **and** is not a
promise, so it satisfies the rule twice over. What the rule bought was the change itself: the
sentence lives in one place, and **six surfaces moved with one edit** — `/contact`, `/press/contact`,
the press confirmation, `CtaBand`, `DivisionLanding` and both form components — because none of
them holds a copy.

Four specification documents still stated the old value and are now annotated in place:
`00-FOUNDATION.md`, `master/APP-FLOW.md`, `master/PROJECT-RULES.md` §8 and `master/SCHEMA.md`.
`check:struck` found all four; reading would not have.

**`master/APP-FLOW.md`'s confirmation copy carried a second defect the same annotation catches:**
*"If it's urgent, call [number] during [hours]."* The number is now real and published; **the
hours are not and never will be**, so that line is struck rather than filled in.

### 3.4 Two literals that were a second copy of a company fact

`ContactForm.tsx` wrote `contact@gridsmith.uk` into its markup **twice** — in the confirmation and
in the send-failure message — while its own docstring, one paragraph above, explained why the
response commitment must never be written that way. `PressContactFlow.tsx` had a third. Both now
take the address as a prop from the Server Component that already reads the singleton.

The copy that would have drifted is the one in the error path, which nobody renders on a good day.

---

## 4. `GS-O015` — withheld, and now withheld by a rule

The owner's decision is that the two reviews naming a third-party development company
disparagingly stay **withheld**: not deleted at source, not altered, not paraphrased, not
republished, not exposed through hidden content. All of that was already true and is unchanged.

**What moved is how.** They were held by `WITHHELD_REVIEW_IDS = [22108992, 22100632]` — a list of
two ids, which by construction cannot reach a review nobody has seen. The owner's second
requirement is that *future* reviews carrying equivalent statements are withheld automatically
where a safe deterministic rule can decide, and otherwise enter a human-review state. Both limbs
now exist:

**Limb 1 — deterministic.** `namedThirdParty` withholds any body naming a business other than
Gridsmith: a capitalised name followed by a corporate-form token (`Ltd`, `Pvt`, `LLC`, `Software`,
`Technologies`, …). **It does not try to detect disparagement.** That is the classification the
owner ruled out, and it is genuinely unreliable — judging *"the very disgraceful Varnika Software
PVT"* actionable and *"we moved from Acme Ltd"* harmless is a legal reading, not a pattern. So the
predicate is structural and **over-withholds by design**: a false positive costs one review on a
page carrying nine others; a false negative is Gridsmith republishing a defamatory statement about
a named company on its own homepage.

Measured against the live API on 16 September 2026: **12 returned, 10 published, 2 withheld** —
the same numbers, reached by a different mechanism, with each withheld review reported by the name
it matched (`Varnika Software PVT`, `Varnika Pvt`). No collateral withholding: the other ten are
unaffected, which is what makes this a measurement rather than a coincidence.

**The two ids are removed from `WITHHELD_REVIEW_IDS` and the array is empty.** Keeping them would
leave two mechanisms over one subject — the `A-GATE-4-3` hazard — with the id branch unreachable
for exactly the two reviews it was written for. **An empty denylist is normally an inert
assertion, and this one is not**: `withholdReason` takes the list as an argument with the constant
as its default, so `check:reviews:selftest` drives the branch by value and reads the returned
reason. Production behaviour is unchanged; no caller passes anything else.

**Limb 2 — human review.** `check:reviews --live` now pins the review set a person has read:
`EXPECTED = { total: 12, published: 10, withheld: 2 }`. A changed set makes that gate **red** and
names the difference, so a review nobody has read cannot reach the homepage without someone seeing
the run that reported it. It goes red on a welcome five-star review too, and that is not a defect
in the assertion — the action either way is to read the new body and then move the numbers in a
commit.

**Stated ceilings, because a clean run means what they leave out.** Rule 3 sees only a company
Freelancer publishes on the reviewer's profile. Rule 4 sees only a business named with a corporate
form — *"my previous developer"* satisfies neither, and no rule here claims otherwise. That residue
is what `WITHHELD_REVIEW_IDS` and the pinned counts exist for.

**Negative reviews about Gridsmith remain publishable and are published.** The rating shown is the
rating the API returns.

---

## 5. Verification

### 5.1 The chain

| Check | Result |
|---|---|
| `verify:static` — **45-gate chain** | **PASS** |
| `verify:build` — wiped `.next` | **PASS** — 77 page routes + `/robots.txt` + `/sitemap.xml`, all within delta budgets; master 1.9KB of 15KB; framework floor 100.2KB |
| `check:company` (served, six questions) | **PASS** — 18 routes, 86,961 characters |
| `check:company:selftest` | **PASS** — 35 cases, every rule limb read by return value |
| `check:reviews` (static) / `--live` / `:selftest` | **PASS** — 12 returned, 10 published, 2 withheld, each named / 66 cases |
| `check:reviews:ui` | **PASS** — `/` 10 cards; `/design` `/digital` `/press` 0 each |
| `check:axe` | **PASS** — zero violations, zero unresolved incompletes |
| `check:responsive` | **PASS** — no horizontal overflow |
| `check:launch` (served) | **PASS** — dataset `development`; 3 technical services refused on production only |
| `check:struck` / `:selftest` | **PASS** — 34 documents, **16** rules, every one annotated / **32** specimens |
| `check:lists` / `check:node` | **PASS** — 6 coupled pairs, 33 gates scanned / **45 gates**, `verify` and `ci.yml` agree |
| `check:service-content` + `--dataset` | **PASS** — 81 approved / 46 records / 969 copy strings / 0 provenance mismatches |
| `check:vat`, `check:legal:parity`, `check:consumer-terms`, `check:press:type`, `check:path:live`, `check:security-headers` | **PASS** |
| `lint`, `typecheck`, `lint:colors`, `lint:secrets` | **PASS** — 0 warnings |
| `npm audit --omit=dev` | **PASS** — 0 vulnerabilities, **no dependency added** |
| Lighthouse CI | **NOT RUN locally** — the known Windows `chrome-launcher` EPERM. CI is the arbiter |

**Which question each green answers.** `check:axe` is reported on both violations and unresolved
incompletes. `check:reviews` is reported separately for its static questions and for `--live`.
`check:company` is reported on all six, named individually in its own summary.

### 5.2 Deliberate-failure proofs

**The served gate went red twice on its own defects before it was trusted, and that is the part
worth recording** — a red carries its own validity proof, and these two were reds about the gate.

| Round | Injection | What the red said | Verdict |
|---|---|---|---|
| — | none; first run against the real site | 22 problems on questions 3 and 4 | **the gate.** It stripped tags but not `<script>` *contents*, and read Next's RSC flight payload — which serialises every prop and the footer's text, **after** `</footer>` — as page text |
| — | none; second run | 57 problems on question 2, naming a `mailto:` at `contact@gridsmith.uk\\` | **the gate again.** The fix had stripped scripts before the *text* extraction and left the *href* scans on raw markup. The address it reported exists nowhere but in the payload's own escaping |

Fixing the symptom each round would have taken a third round, and the third would have been
question 3's `tel:` href. The root cause is one thing — **the subject is the markup a browser
renders** — so scripts and styles come out once, at the top, and all six questions read what is
left. Every other served gate in this repository could have had this defect; `check-vat-display`
and `check-legal-parity` are clean of it only because their subjects do not appear in props.

Then, with the gate working, three questions that had not yet been observed firing on served
content were made to fire. One build, three injections in different places, each producing a
distinct named red — and the exit code verified separately from the output, because a gate that
prints red and exits `0` is a silent gate.

| # | Question | Injection | Named in the red |
|---|---|---|---|
| P1 | 1 — disclosure | the footer's `placeOfRegistration` replaced with a literal `England & Wales` | `/'s footer says "England & Wales". GS-O004 gives "England"…` on **18 routes** |
| P2 | 5 — response wording | `Our opening hours are 9am to 5pm.` into `/contact` | `BUSINESS-HOURS-CLOCK: "9am to 5pm"` **and** `BUSINESS-HOURS-LABEL: "opening hours"` — two rules, both named |
| P3 | 6 — public team | `Who you will work with` into `/about` | `/about publishes TEAM-HEADING: "Who you will work with"` |

**Problem count moved 0 → 21**, and `with-server` exit was verified `1`.

**Every branch is additionally proven by value**, which is the structural probe: the self-test
breaks each of the six `RESPONSE_RULES` and each of the three `TEAM_RULES` separately and asserts
that it fires **and is the only rule that fires**, plus every `disclosureProblems` required field,
every forbidden address, both phone limbs and both office limbs. 35 cases.

**Restoration.** The harness captured each subject's bytes before its first mutation and restored
from those bytes, verified by SHA-256 — never `git checkout --`, which would have discarded this
phase's own uncommitted work. A residue grep found none of the three injections afterwards.

**`check:struck`'s three new rules** were each given an annotated specimen and a separate
unannotated branch case, and the `ZERO-SUBJECT` count expectation moved 13 → 16 deliberately —
which is what proves that count is counted rather than printed.

---

## 6. The four sections, audited

| | Verdict | What was checked |
|---|---|---|
| **Master** | **ACCEPTABLE** | Hero, division routing, continuity, process, the review cylinder (10 cards), group structure, insights, CTA band. No prices, no portfolio, no team. `/about`'s facts table now carries name, number, place of registration, divisions, email and phone |
| **Design** | **ACCEPTABLE** | 16 services in 5 groups; contextual CTA *Get a Design Quote*; the private-examples notice instead of a portfolio; **no review block** |
| **Digital** | **ACCEPTABLE** | 17 services in 5 groups; *Discuss Your Project*; no estimator, no price; **no review block** |
| **Press** | **ACCEPTABLE** | 13 services in 4 groups; Path Finder with all six outcomes including both honest ones; segmented contact flow; **no review block** |
| Cross-division routing | **CORRECT** | Footer switcher, `DivisionRouting`, the Press confirmation's cross-division prompt (after submission, never mid-funnel) |
| Pricing | **NONE PUBLISHED** | `check:vat`: 17 routes, 0 price figures. The Path Finder's budget bands are a question about the visitor's budget, not a price — checklist `B4` retains them deliberately |
| Portfolio | **NONE PUBLISHED** | `GS-D001`. The only statement about work is that some cannot be shown |
| Technical Design | **GATED** | `check:launch` refuses 3 published technical services on a production dataset. Development keeps them so the gate has a subject |

### 6.1 Content findings — recorded, not silently fixed

1. **`/about` and `/approach` carry `[SEED]`-marked prose.** Three marked strings on `/about`
   (intro, structure, verify) and the `groupPage` sections on `/approach`. **Not an RC blocker:**
   they are marked as provisional, so nothing is presented as true, and `check:launch` refuses a
   `[SEED]` marker on a production dataset. They *are* production content owed — §8.
2. **Stage 6 of the canonical process names "SEO improvements"** in a description that claims to
   be division-neutral, so a Design landing page describes a Digital activity. Recorded at
   `LIVE-SITE-EXTRACT.md` §3 since 7 September and still open. The six stages came from the live
   site; changing one is an owner content decision (`F1`), not an implementer's.
3. **`/insights` carries nine agent-authored posts.** They contain no invented figure
   (`check:content` passes) but they are marketing copy no owner has read. Owner content.

None of the three is a defect in the build. All three are in §8.

---

## 7. Human acceptance — what was actually done, and what was not

**Performed in a real browser against the served candidate** (Chromium, the in-app browser pane),
at 375px, 768px, 1440px and wide desktop:

| Item | Finding |
|---|---|
| Master homepage, all breakpoints | No horizontal overflow, no layout break. `check:responsive` agrees across 51 combinations |
| `/contact` at 375px | Form, commitment sentence, email and phone all reachable and legible. Both contact links are real and correct |
| Press Path Finder | Renders all five questions and the full six-outcome criteria table **server-side**, so the no-JS path is intact |
| Division landings | Service groups, CTAs and the process stepper render correctly at every width |
| Cylinder — semantics | Blockquotes with attribution, a real `<label>`-ed checkbox pause control, no focusable element behind the ring |
| Cylinder — pause | The checkbox is a real control satisfying WCAG 2.2 SC 2.2.2 (Level A). Hover and `:focus-within` pause additionally |
| Cylinder — reduced motion | The flat grid is the **base** and the 3D layer is applied only under `prefers-reduced-motion: no-preference`, so reduced motion is full content parity rather than a frozen ring |
| Animation pace (96s) | **No change recommended.** It is a pace, not a threshold, and no usability problem was observed. `CLAUDE.md`'s rule against changing a measured value on preference applies |
| Review density (10) | **No change recommended.** Ten reads as a body of evidence rather than a token; reducing it for aesthetics would discard genuine reviews |

**NOT performed, and not claimed:**

- **No screen-reader test.** `check:axe` is zero violations and the DOM order was read, but
  **axe passing is not a screen-reader test** and this document does not represent it as one. A
  NVDA/JAWS/VoiceOver pass over the cylinder, the Path Finder and both forms remains open.
- **No physical device.** The 375px testing was viewport emulation with a mobile user agent and
  touch points, in a desktop browser. Real touch behaviour, and in particular a reader with **no
  hover pause**, has not been observed on hardware.
- **No Firefox and no Safari.** Neither engine is available in this environment. Chromium only.
- **No hosted write-path test.** No synthetic lead was submitted — see §9.

---

## 8. What is still owed before production, by owner

| # | Item | Owner action |
|---|---|---|
| 1 | Solicitor review of the seven `_legal/` instruments | `GS-O003` |
| 2 | PI cover scope for engineering/CAD; the Technical group stays gated | `GS-O005` / `GS-X002` |
| 3 | ICO registration position | `GS-O016` (new) |
| 4 | Logo, favicon and any brand imagery; the redirect mapping's one undecided row | `GS-O007` |
| 5 | An isolated non-production Supabase target for Preview | `GS-O010` |
| 6 | **Real `/about` and `/approach` copy**, replacing the `[SEED]`-marked prose | production content |
| 7 | **Owner reading of the nine `/insights` posts** | production content |
| 8 | Per-channel exclusions for the marketing capabilities | production content, carried from `GS-O013` |
| 9 | `Q-P13` — the Path Finder's thirteen decision rules are still `[SEED]` | owner decision |
| 10 | Whether stage 6's *"SEO improvements"* stays in a division-neutral description | owner content decision |
| 11 | Screen-reader, physical-device and non-Chromium browser passes | `GS-R001` residue, `GS-R002` |
| 12 | Production Supabase migration | `GS-T004`, separately authorised |
| 13 | Production Sanity content | `GS-T005` |

---

## 9. What was deliberately NOT done

- **No production cutover, no DNS, no Hostinger change, no `gridsmith.uk` change.** The live site
  was read read-only — its `robots.txt`, its `wp-sitemap.xml` and its five child sitemaps.
- **No Supabase call of any kind.** `GS-T004` is not applied. No schema, data, RLS, Auth or
  credential was touched, and no service-role key was read or printed.
- **No synthetic lead submission.** `GS-O010` is open, so Preview has no isolated database; a test
  submission would have reached production Supabase. **A staging candidate that cannot prove its
  write path must say so rather than imply otherwise**, which is what this line is.
- **No production Sanity call.** The `production` dataset was not read, written or contacted.
- **No seed content promoted.** The development dataset's `companyDetails` singleton was rewritten
  by the existing `npm run seed:company`, which is hardcoded to `development` and cannot reach
  `production`. That write also removed a stale `vatNumber: "[SEED] GB123456789"` that had been in
  the document since 21 August — two weeks after the field was removed from the schema.
- **No `llms.txt`.** `G-04` names one. It is an unratified convention, and a file listing content
  for an AI crawler is a publication decision nobody has taken.
- **No stock photography.** Asked and correctly refused before; the refusal stands.
- **No legal clause drafted or amended.**

---

## 10. Staging, and why it is a branch

The Vercel project `gridsmith-ltd` has **no custom domain** and `live: false`. `gridsmith.uk`
points at Hostinger. **A production-target deployment cannot replace the live site**, and every one
since `GS-P00` has ended `ERROR` on the empty production Sanity dataset (`GS-T005`).

A branch push produces a **preview** deployment, which builds against the `development` dataset and
reaches `READY`. That is the release candidate, and it is isolated by construction rather than by
configuration. **Vercel Authentication is on for every deployment except custom domains**, so the
candidate answers 401 to a crawler; `app/robots.ts` serves `Disallow: /` as the second lock, and
every page carries `noindex, nofollow`. Both read one `INDEXABLE` in `lib/seo/site.ts`, so they
cannot disagree.

**The documented production switch is one variable:** `NEXT_PUBLIC_SITE_URL=https://gridsmith.uk`
on the Production environment. Until it is set on a production deployment, nothing is indexable and
the sitemap is empty. Canonicals resolve to the deployment's own origin, which is correct for a
preview and avoids pointing production URLs at a site this build does not serve.
