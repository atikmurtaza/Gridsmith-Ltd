# AI handoff

## Execution

- **Task ID:** `GS-P05`
- **Task:** Freelancer review integration investigation, and the owner content-review candidate
- **Agent/model:** Claude Code (Opus 5)
- **Status:** COMPLETE IN REPOSITORY. The review pipeline is **built, gated and deliberately not
  activated**; production content, migration and deployment untouched; **no Sanity, Supabase or
  Vercel call of any kind was made in this phase**
- **Date:** 16 September 2026

## Repository state

- **Starting commit:** `a4cb3e9df9ae7f954956eb6fd9b30ca64c0f03f1`
- **Ending commit:** the GS-P05 commit containing this handoff; use `git rev-parse HEAD`
- **Branch:** `main`, tracking `origin/main`
- **Starting working tree:** clean, 0 ahead / 0 behind `origin/main`, no unrelated owner work
- **GS-P04 CI baseline:** run `35042409312` **completed `success`** on `a4cb3e9d`. Verified
  before any work began; the baseline is sound and nothing was carried forward from a failed run
- **Pushed:** YES — `e8bdd9ba` on `origin/main`
- **GS-P05 CI:** run `35047282241` **completed `success`** on `e8bdd9ba` — **all 42 steps**,
  including Lighthouse CI desktop and mobile, which cannot run locally on Windows

## Hard scope boundaries preserved

- **No Sanity call of any kind.** Neither dataset was read, written or contacted. The six genuine
  development testimonials are untouched and still render (`§11` of the brief).
- **No Supabase call of any kind.** The GS-P01 production migration was not applied.
- No Vercel action, no deployment, no environment change. Hostinger, DNS and `gridsmith.uk`
  untouched. No secret created, requested, rotated or printed.
- **No Freelancer credential exists or was created.** No OAuth application, no Personal Access
  Token, no account setting changed. Every request was an unauthenticated public GET.
- The Technical Design publication gate is unchanged and still refuses production. `GS-O005` and
  `GS-X002` were **not** marked complete and nothing was inferred from Freelancer work history.
- No price, portfolio, client logo, case study or author title added. `GS-D001` and `GS-D002`
  unchanged. Freelancer *portfolio* items remain unauthorised — only reviews are in scope.
- No legal clause drafted or amended. No analytics reintroduced.
- **Nothing was rewired.** `Testimonials.tsx` and `DivisionLanding.tsx` are byte-identical to
  `GS-P04`; no route changed; the 77-route table is unchanged.

---

## 1. The `GS-P04` review finding — corrected

`GS-P04` reported *"the owner states 12; authoritative source data holds 6"* and raised `GS-O013`
asking the owner to supply the six or correct the count.

**Both halves of that were sound reasoning from what `GS-P04` could see. The reading laid on top
of them was not.** Six was the size of an **incomplete ingestion**, not the size of the evidence.
The owner challenged it and the owner was right.

Verified independently on 16 September 2026, two ways:

| Source | Reports |
|---|---|
| `https://www.freelancer.com/u/GridsmithLTD`, read unauthenticated in a browser | `5.0 · 12 Reviews` |
| `GET /projects/0.1/reviews/?to_users[]=92543257`, official API, unauthenticated | `reviews_count: 12`, twelve review objects |

All six transcribed in `seed-content.mjs` are among the twelve, matched by body text. **Four of
the six differ from the API only in whitespace** — the 21 August transcription collapsed runs of
spaces the reviewers themselves typed, so the API is not merely equivalent to that transcription,
it is more faithful than it. The six absent from the repository are Karl, Remy, a second review
from Tom, and three from one repeat client.

**No review was invented, and none needed to be.** `GS-P04`'s record is preserved and annotated
rather than overwritten, in `SERVICE-ARCHITECTURE.md` §14 and in the `GS-O011` completion entry.

**The transferable lesson, because it will recur.** `GS-P04` treated its own dataset as
authoritative and the owner's figure as the claim needing proof. Its dataset was a *derived*
artefact — a hand transcription — and the authority was the platform. **Where a stated figure and
a local record disagree, establish which of them is the source before deciding which one is
wrong.** The phrase "authoritative source data" in the `GS-P04` write-up was doing real damage:
it named a transcription as the authority, and once named, nobody re-derived it.

## 2. The official API — investigated first, and it exists

| | |
|---|---|
| Endpoint | `GET https://www.freelancer.com/api/projects/0.1/reviews/` |
| Documented at | `developers.freelancer.com` → Projects → Reviews → *List Project Reviews* |
| Filters used | `to_users[]=92543257`, `role=freelancer` |
| Projections used | `reviews_count`, `user_details`, `user_display_info`, `project_details`, `project_job_details`, `compact` |
| Pagination | `limit` / `offset` — twelve fit one page of 100 |
| Rate limits | per endpoint, e.g. `50/60s` and `1000/3600s`, reported in `RateLimit-Limit` / `RateLimit-Remaining` |
| **Webhooks** | **none documented anywhere in the API reference** — synchronisation must be pull-based |
| Documented auth | OAuth token with scopes `basic` + `fln:project_manage`; header `Freelancer-OAuth-V1` |
| **Observed auth** | **`200` unauthenticated**, returning the complete twelve-review public set |
| Caching (API T&Cs §5.1) | *"Where Data is cached, you should refresh the cache at least every 24 hours."* |
| Storage (API T&Cs §5.3) | *"You may not copy or store any Data … except to the extent permitted by these API T&Cs."* |
| Acceptance (API T&Cs §4.1) | *"Anyone who wants to access our API must agree to be bound by this API T&Cs."* |
| Brand (API T&Cs §2, §8) | the Freelancer brand is defined and its use is not granted — **no mark, logo or asset is used** |

The account id `92543257` was resolved from the public username through
`GET /api/users/0.1/users/?usernames[]=GridsmithLTD`, also unauthenticated.

**No scraping of any kind was built or attempted.** No browser automation, no HTML parsing, no
session reuse, no cookie, no private endpoint, no CAPTCHA, no anti-bot circumvention.

**One access difference is recorded honestly rather than glossed.** The public HTML profile shows
an anonymous visitor five reviews behind a *Show all 12* control, and that control opens a sign-up
modal. The API returns all twelve to the same anonymous caller. Nothing here defeats the control —
it is a growth prompt on a web page, and the platform's own documented public API publishes the
data it sits in front of. The request carries no credential, no cookie and no session, and
`check:reviews` question 3 asserts it cannot.

**The documentation/behaviour divergence is the single largest risk in this integration**, and it
is why `check:reviews --live` exists. If Freelancer starts enforcing the documented scopes the
fetch returns nothing, the block stops rendering, and the gate goes red. It cannot half-work and
it cannot take a page down. The OAuth fallback is written up in `OWNER-ACTIONS.md` under `GS-O014`
**so it is not designed under pressure** — including the fact that a Personal Access Token is
unsuitable (one per environment, thirty days, no refresh), which is exactly the kind of thing that
gets discovered at the wrong moment.

## 3. The architecture — nothing is stored

```
Freelancer API → fetch (24h revalidate) → zod validation → withhold unsafe bodies
               → categorise from the skill taxonomy → TestimonialList
```

**The terms decided this before engineering did.** A `testimonial` written into Sanity is a stored
copy that never refreshes (§5.3). A 24-hour revalidating fetch cache is the form §5.1 describes.
So **the cache is the storage layer**, and `next: { revalidate: 86400 }` is the term rather than a
tuning knob. Option B (Sanity) and Option C (Supabase) were rejected on that plus the engineering
cost; Option D (a committed last-known-good fixture) was rejected because it is a permanent stored
copy that by definition never refreshes.

It also removes a defect class outright. One source means there is no second artefact to diverge
from it — `01-VALIDATION-REPORT.md` §21, the shape that let `seed-legal.mjs` drift from
`docs/_legal/` across nine review rounds.

**Outage behaviour.** Next serves the previously cached entry when revalidation fails, so the
last-known-good set keeps rendering. With nothing cached, the function returns `[]` and the block
renders nothing — `Testimonials` already returns `null` on an empty list. Network failure, non-200,
malformed body and schema rejection all take that path. A Freelancer outage cannot take a page down.

**Zero client JavaScript.** The request happens on the server. No performance budget moves.

**Anonymisation is structural, not careful.** The source's free-text project title is **never
read**; the category comes from `jobs[]`, Freelancer's own closed skill taxonomy, through thirteen
allowlisted labels matched in **list order** so the result does not depend on payload order. A
client's name cannot appear in a skill tag — not because a filter removes it but because the field
cannot contain it. No match yields **no category and no division**, never a guess. That is what
makes it work for reviews nobody has seen yet.

**Bodies are published verbatim or withheld whole — never edited.** Three deterministic rules: the
reviewer's own company name appears in the body (taken from the same payload, so it needs no
maintained list); the body contains a URL or email address; the body is empty. **Stated ceiling:**
the first rule only sees a company Freelancer publishes, so a client naming an undisclosed employer
is not detectable by any automatic rule and is not claimed to be — which is why the gate *reports*
the withheld count rather than asserting it is zero.

**Never rendered and never parsed:** `paid_amount`, `bid_amount`, `price_usd`, `currency`,
`project_id`, `review_context.seo_url`, and the reviewer's `company`. Two of the twelve reviewers
publish a company; all twelve carry a project value. A field absent from the schema cannot be
rendered by a later accident.

**Attribution:** *"Verified review via Freelancer"* per card plus a link to the public profile.
No endorsement claimed, no Freelancer branding used, reviewer `public_name` only — the same name
Freelancer shows an anonymous visitor.

### Why it is not switched on

**API T&Cs §4.1 makes API access an acceptance of terms, and accepting terms on Gridsmith Ltd's
behalf is an owner act, not an agent's.** No credential and no paid service is involved, so this is
acceptance rather than provisioning — but it is still a commercial position. The brief's §17 is
explicit about this case: implement the safe preparatory architecture, then stop at the owner gate.

There is a second decision inside it. The site publishes six reviews today; the pipeline publishes
twelve, and **the twelfth is rated 4.6 and contains criticism** (*communication "could be much
better"*). Publishing it is the right default for a site whose Press section must be able to
recommend against Gridsmith — and it is still a change to what the homepage says. `GS-O014`.

**Activation is one line in `components/master/Testimonials.tsx` and one in
`components/divisions/DivisionLanding.tsx`**, plus wiring `check:reviews:live` into
`verify:served` and `ci.yml`. The six Sanity testimonials keep rendering meanwhile and are retired
only when the switch is thrown, so the site never carries two sources at once.

## 4. `GS-O012` — the marketing channels, closed

The owner confirmed eight of the nine open channel services. **Six new rows in
`DIGITAL_MARKETING_ENGAGEMENT` and nothing else** — no fourth division, no capability group, no
CMS type, no route, no orchestration engine. The engagement count moved **12 → 18**.

Cross-division managed services (Google Ads/PPC, Meta advertising, social media management, email
marketing) sit with **Master**, because a capability group is a *medium* and running an ad account
is the coordination of several. Google Business Profile sits with **Digital** — its confirmed scope
is technical local-search configuration. `SERVICE-ARCHITECTURE.md` §13.

**`Media buying` was not confirmed and is not inferred from its neighbours.** It is the sole
remaining entry in `UNCONFIRMED_CHANNEL_SERVICES`, which also keeps that denylist non-empty and
the assertion alive.

### One copy statement was made false by the confirmation, and that is a class

Design's *Campaign & Social Creative* carried the exclusion *"Gridsmith does not run ad accounts,
set budgets or buy media."* Accurate when written; **a false statement about the company the
moment `GS-O012` closed.** Corrected to draw the boundary where it actually is.

**An owner confirmation can invalidate existing copy, not only leave gaps in it.** A capability
decision is naturally read as *"what may we now add"*; this one also asked *"what did we already
say that is now wrong"*. Nothing automatic finds that — exclusions are prose, and no gate knows
which of them contradict the engagement map. It was found by re-reading the exclusions against the
newly confirmed list, and **that re-reading is the step to repeat next time a capability is
confirmed.**

### Four more stale statements, found by sweeping rather than by a gate

Updating `catalogue.ts` and `SERVICE-ARCHITECTURE.md` §13 felt like the whole change. It was not.
A grep for the channel names across the repository found four places still asserting the old
position, and each would have been read as current by the next session:

| Where | Said |
|---|---|
| `SERVICE-ARCHITECTURE.md` §2 | *"Paid-media management, advertising management and media buying are **not** in the model"* |
| §4 legacy table, two rows | *"**Still open — `GS-O012`**"* for Google Ads and Google Business Profile |
| §4 legacy table | Social Media Design Support *"**not** social media management"* — true of the Design capability, misleading once the company sells the management |
| `docs/digital/PROJECT-TRACKER.md` | *"Not carried forward — owner review `GS-O011`"* |

All four now state the current position and name the phase that changed it. This is
`01-VALIDATION-REPORT.md` §21's shape in miniature — **a decision changed in the document you were
editing and left standing in the ones you were not** — and `check:struck` cannot catch it, because
nothing was struck: a status flipped. The registry is for deleted rules; this was a rule whose
*answer* changed. **After closing an owner action, grep the repository for the terms it names**,
not just the file the decision lives in. `check:struck` reports clean and is correct to.

`LIVE-SITE-EXTRACT.md` was deliberately left untouched: it is a dated record of what the live site
says, not a claim about the model.

## 5. `GS-O013` — the owner content-review candidate

`docs/_shared/GS-P05-OWNER-CONTENT-REVIEW.md`, 1,758 lines, generated by
`npm run docs:content-review`:

| | |
|---|---|
| Service records presented | **46** (Design 16, Digital 17, Press 13) |
| Approved capabilities represented | **81** |
| Published exclusions surfaced | **35** |
| Passages flagged `⚠ VERIFY` | **12** |
| Records behind the Technical publication gate | **3**, marked as gated |

**It transcribes; it does not rewrite.** Every summary, sentence, deliverable and exclusion is
copied verbatim from `scripts/service-content.mjs`. No second version of the copy was authored —
which was the brief's explicit instruction, and is also the only way the approval attaches to what
the site will actually carry. It is generated rather than hand-written for the same reason: a
hand-written copy would be two authored artefacts that must agree, with only one of them read.

The owner can answer *"Approve all Digital"* or *"Approve Design except the CAD Drafting summary"*
without opening Sanity.

**`GS-O013` is narrowed, not closed.** Its review-count limb is closed by §1 above. Its copy limb
is open and is what the document exists to answer.

### The staleness guard

The document records the SHA-256 of the copy it transcribes, and `check:service-content` now fails
while the two disagree. Without it, editing a service after the owner had read the document would
leave the approval attached to wording that no longer exists — **a stale approval is worse than no
approval, because it looks settled and nobody reopens it.** Regenerating is a deliberate act that
knowingly reopens the review.

## What changed

| Path | |
|---|---|
| `lib/reviews/freelancer.ts` | **new** — the whole pipeline: request, zod validation, withholding, categorisation, mapping. One impure function |
| `scripts/check-reviews.mjs` | **new** — four named questions; `--live` reads the real API and says so when it does not |
| `scripts/check-reviews.selftest.mjs` | **new** — 55 value-based cases, every rule limb broken separately |
| `scripts/owner-content-review.mjs` | **new** — the generator; writes only when executed, never when imported |
| `docs/_shared/GS-P05-OWNER-CONTENT-REVIEW.md` | **new** — the artefact `GS-O013` is answered against |
| `scripts/check-service-content.mjs` | question 4 added (owner-document parity); questions renumbered 4→5 |
| `scripts/check-service-content.selftest.mjs` | channel specimen `Google Ads` → `Media buying` — see below |
| `lib/services/catalogue.ts` | six engagement rows added; `UNCONFIRMED_CHANNEL_SERVICES` 9 → 1 |
| `scripts/service-content.mjs` | one exclusion corrected (§4) |
| `package.json`, `ci.yml` | `check:reviews`, `check:reviews:selftest`, `check:reviews:live`, `docs:content-review`. 40 → **42 gates**, parity proven |

**`server-only` is deliberately absent from `lib/reviews/freelancer.ts`** and the file says why:
the gate imports it, and `server-only` throws outside a React Server Component. There is no secret
in the module — the request carries no credential at all.

### The selftest specimen that had to change, and why it is the rule working

`check-service-content.selftest.mjs`'s channel case used `Google Ads` as its specimen. `GS-O012`
confirmed Google Ads, so it left the denylist, and **the case failed the moment the catalogue was
updated.** That is `CLAUDE.md`'s *"adding a subject to a gate is not done until every list that
gate consults has been updated"* — and the list nobody would have thought to look at was a
**specimen inside a selftest**. It was caught by running `verify:static`, which is the only thing
that could have caught it. The case now uses the one entry still unconfirmed.

## Verification

| Check | Result |
|---|---|
| `npm run verify:static` (**42-gate chain**) | **PASS** |
| `npm run verify:build` | **PASS** on a clean `.next` — **77 routes**, unchanged, all within delta budgets; master 1.9KB of 15KB |
| `check:reviews` (static) | **PASS** — 13 category labels × 9 identifying fragments, 5 forbidden fields absent, request credential-free |
| `check:reviews --live` | **PASS** — 12 returned, reported count 12, 12 published, 0 withheld, 12 categorised, 12 distinct ids |
| `check:reviews:selftest` | **PASS** — 55 cases |
| `check:service-content` | **PASS** — 81 approved / 46 records / each covered once; **18** engagement activities (was 12); 6 reviews, 5 categorised; **owner-document parity in agreement** |
| `check:service-content --dataset` | **PASS** — development dataset read unauthenticated, 0 provenance mismatches |
| `check:service-content:selftest` | **PASS** — 23/23 after the specimen fix |
| `check:axe` | **PASS** — zero violations, 65 allowed incompletes, **0 unresolved**; skip link on 18 routes × 2 viewports; zero cookies and zero analytics requests before consent |
| `check:responsive` | **PASS** — 51 combinations, no overflow |
| `check:vat` | **PASS** — 17 routes, 626,375 characters, **0 price figures** |
| `check:launch` (served) | **PASS** — dataset `development`; 3 technical services refused on production only |
| `check:lists` | **PASS** — **31 gates scanned** (was 30); the new gate has no route-keyed list, so no registration is required and the discovery guard correctly did not fire |
| `check:node` | **PASS** — **42 gates**, `verify` and `ci.yml` run the same set |
| `check:security-headers`, `check:consumer-terms`, `check:legal:parity`, `check:press:type`, `check:path:live` | **PASS** |
| `npm audit --omit=dev` | **PASS** — 0 vulnerabilities, **no dependency added** |
| `lint:secrets` | **PASS** — 190 source files, 41 client chunks |
| `git diff --check` / `--cached --check` | **PASS** |
| Lighthouse CI (desktop/mobile) | **NOT RUN locally** — the known Windows chrome-launcher EPERM. CI is the arbiter |
| Manual screen-reader and cross-browser review | **NOT RUN** — `GS-R001` |

**Which question each green answers**, because a gate with two assertions has two greens:
`check:axe` is reported above on **both** violations *and* unresolved incompletes. `check:reviews`
is reported separately for its static questions and for `--live`. `check:service-content` is
reported on coverage, engagement, anonymity, owner-document parity **and** the dataset.

### Deliberate-failure proofs

Each ran alone. The subject's bytes were captured before the first mutation and restored from
those bytes, verified by SHA-256 — **not** by `git checkout --`, which reverts to `HEAD` and would
have discarded this phase's own uncommitted edits (the `GS-P04` restore note, applied). Every
result is a red that **names its injection**, so each probe is established as a subject rather than
inferred to be one.

| # | Gate / question | Injection | Named in the red |
|---|---|---|---|
| R1 | `check:reviews` Q1 | `Miniature Medieval Castle` into a category label | the fragment, by name. **Deliberately not `Casglu`**: the first attempt used a string that Q2 also matches, and two questions fired on one input — which credits whichever one you had in mind (`A-GATE-4-3`). Re-run with a fragment only Q1 can see |
| R2 | `check:reviews` Q2 | `authorCompany` passed through from the payload | `a rendered review carries "company" (Lime Assistive Technology Ltd)` |
| R3 | `check:reviews` Q3 | a `Freelancer-OAuth-V1` header added to the request | both the header name and `oauth`, from code lines only — the prose explaining why none is sent does not trip it |
| R4 | `check:reviews` Q4 | `limit` lowered to 5 against the live API | `the API reports 12 review(s) but returned 5`. **The counts moved**: `12 → 5` returned, categorised and distinct — so the count is counted, not printed |
| R5 | `check:reviews` Q4 | user id pointed at an account with no reviews | `returned zero reviews — the live assertion measured nothing`, plus the anonymity limb's own empty-input failure. A zero is a failure, not a pass |
| R6 | `check:reviews` selftest | `categorise` made to guess instead of returning `null` | the case, with expected and actual values |
| R7 | `check:reviews` Q4 | endpoint host made unresolvable | `the live Freelancer API could not be measured — fetch failed`. Unreachable is a failure, not a skip |
| R8 | `check:service-content` Q4 | one summary edited after the document was generated | both hashes named, `869735bc… → 952ea53d…`. **The hash moved** |
| R9 | `check:service-content` engagement | a confirmed channel filed under `digital` instead of `master` | `names no approved service but is owned by digital, not master` |
| R10 | `check:service-content` Q4 | the owner document deleted | `a missing one is a hard failure, not a skip` — **and this is also the proof that importing the generator no longer writes the document**, since a gate that regenerated its own subject would have gone green |

**Exit codes were verified separately from output**, because a gate that prints red and exits `0`
is a silent gate: baseline `0/0/0`, R6 `1`, R7 `1`, doc-missing `1`.

**R10 is the one worth remembering.** `check-service-content` imports `contentHash` from the
generator, and on the first wiring that import **ran the generator**, rewriting the very document
it was about to check. The assertion could never have failed. It is the "expectation derived from
its own subject" failure with an extra step — a gate that repairs its subject before measuring it —
and it was caught by deleting the document and expecting a red. `seed-content.mjs` is kept out of
that gate for the same reason; this is the second instance of the same hazard, and the generator
now writes only under `import.meta.main`.

## Findings and programme state

- **Closed:** `GS-O012` (marketing channels — 8 of 9 confirmed). The `GS-P04` review-count finding,
  **corrected**: twelve reviews, independently verified; no owner action owed.
- **Narrowed:** `GS-O013` — the review-count limb is closed; the copy limb is open and now has an
  artefact to answer against.
- **New:** `GS-O014` — accept Freelancer's API T&Cs and decide what the reviews block publishes.
  **No credential and no paid service required.**
- **Remaining:** `GS-T004`, `GS-T005`, `GS-O003`, `GS-O004`, `GS-O005`, `GS-O007`, `GS-O010`,
  `GS-X001`, `GS-X002`, `GS-R001`–`GS-R003`, `Q-P13`. Plus the narrow remainders: `Media buying`
  unconfirmed, and per-channel exclusions unwritten (both inside `GS-O013`).
- **Production readiness:** **NOT READY.**

## Remote changes

- **GitHub:** the GS-P05 commit pushed to `main`.
- **Freelancer:** **read only, unauthenticated.** The public profile page was read in a browser;
  `GET /api/users/0.1/users/` and `GET /api/projects/0.1/reviews/` were called a small number of
  times, well inside the documented `50/60s` and `1000/3600s` limits. **No account was signed into,
  no setting changed, no application created, no token generated, nothing written.**
- **Sanity development:** **none.** Not read, not written, not contacted.
- **Sanity production:** **none.** Not read, not written, not contacted.
- **Supabase:** **none.**
- **Resend:** the existing `check:axe` notification probe sent one development notification through
  Resend's shared sender to the account owner. Established gate behaviour, not new here.
- **Vercel:** none initiated. The push triggered the normal Git integration, which produced
  production-target deployment `dpl_45A72Pnr2eMtF1tr4c3Jw62LpE1x` — **`ERROR`, as expected**.
  Every production-target deployment since `GS-P00` has ended the same way, on the empty
  production Sanity dataset (`GS-T005`). **Nothing was published, `gridsmith.uk` is unaffected,
  and this is not a regression introduced here** — observed and reported, not acted on. Preview
  remains non-isolated (`GS-O010`).
- **Hostinger/DNS/`gridsmith.uk`:** none.

## Recommended next phase

Recommendation only. **Do not begin it from this handoff alone.**

An **owner decision and activation phase**, narrowly scoped to what the owner can now answer
without new work from anyone else. It has a natural order and a real dependency:

1. Put the development site and `GS-P05-OWNER-CONTENT-REVIEW.md` in front of the owner and close
   `GS-O013` — approve or amend the 46 records, with the 35 exclusions and 12 flagged passages as
   the priority, and write the per-channel exclusions the `GS-O012` confirmation now requires.
2. Close `GS-O014` — three short answers, no credentials — and if accepted, throw the two-line
   switch, retire the six Sanity testimonials in the same commit so the site never carries two
   sources, and wire `check:reviews:live` into `verify:served` and `ci.yml`.

Then, and only with the accepted copy, move toward a staging release candidate for
`GS-R001`/`GS-O008`. Technical-group content stays gated on `GS-O005`/`GS-X002`. `GS-T004`
production activation stays in a separately authorised production-release phase.
