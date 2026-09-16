# AI handoff

## Execution

- **Task ID:** `GS-R001` / `GS-O008`
- **Task:** staging release candidate and human-acceptance preparation
- **Agent/model:** Claude Code (Opus 5)
- **Status:** COMPLETE IN REPOSITORY. A staging release candidate is cut as an **isolated Vercel
  preview**; `GS-O004` and `GS-O015` are closed; production content, migration and deployment
  untouched. **No Supabase call of any kind. No production Sanity call. No DNS, Hostinger or
  `gridsmith.uk` change.**
- **Date:** 16 September 2026
- **Full evidence:** `docs/_shared/GS-R001-STAGING-RC.md` — this file is the summary and the
  next-phase recommendation; that one is the record.

## Repository state

- **Starting commit:** `1ad462ff276c7d03079f5b9afbca908cbbfc0b24`
- **Ending commit:** the `GS-R001` commit containing this handoff; use `git rev-parse HEAD`
- **Branch:** `main`, tracking `origin/main`. The candidate is cut on a branch first — see
  *Staging* below
- **Starting working tree:** clean, 0 ahead / 0 behind `origin/main`, no unrelated owner work
- **Starting CI:** run `35084597904` **`success`** on `1ad462ff`. Verified before any work began

## Hard scope boundaries preserved

- **No Supabase call of any kind.** `GS-T004` is **not** applied. No schema, data, RLS, Auth or
  credential touched; no service-role key read or printed.
- **No production Sanity call.** The `production` dataset was not read, written or contacted.
- **One development Sanity write**, through the existing `npm run seed:company`, which hardcodes
  `dataset = 'development'` and cannot reach production. It rewrote the `companyDetails` singleton
  with the `GS-O004` facts — and removed a stale `vatNumber: "[SEED] GB123456789"` that had sat in
  that document since 21 August, two weeks after the field left the schema.
- **No deployment to production, no domain change, no DNS, no Hostinger.** `gridsmith.uk` was read
  **read-only** — its `robots.txt`, `wp-sitemap.xml` and five child sitemaps — and nothing else.
- **No synthetic lead submitted.** `GS-O010` is open, so Preview has no isolated database.
- No legal clause drafted or amended. No analytics reintroduced. No dependency added.
- The service architecture was not redesigned: 3 delivery divisions, Master as relationship layer,
  46 records, 81 approved capabilities, no public pricing, no public portfolio, Technical gated.

---

## 1. `GS-O004` — closed, and the limb that mattered was not on the list

The owner supplied the company and contact facts. They are implemented in the one canonical source
(`companyDetails`), and `check:company` asserts them on the **served pages** rather than in source.

`Gridsmith Ltd` · `17050842` · **registered in England** · `contact@gridsmith.uk` ·
`+44 7405 448534` · **no business hours** · *"We typically respond within 48 hours."* · registered
office in the statutory footer and `_legal/` only · **no public team**.

**Two facts were corroborated against the public Companies House register**, read read-only, which
closes checklist rows `A1`/`A2` that had been open since 7 September as *"confirm against the
register"*: `GRIDSMITH LTD`, **active**, incorporated 24 February 2026, registered office
`30 Briarfield Road, Farnworth, Bolton, England, BL4 0HD`. Same premises as the seed, with the
**digit zero** — so the live site's `BL4 **O**HD` is the malformed one, as `LIVE-SITE-EXTRACT.md`
§11.3 suspected but could not settle.

### The served `/about` was publishing four people who do not exist

It rendered `listPublicTeam()`, filtered on `isPublic == true`. The schema defaults that field
**false** and its docstring says why. `scripts/seed-content.mjs` set it `true` on all four seeded
records, so four documents named `[SEED] Placeholder Name` were served under the heading *"Who you
will work with"*.

**Nothing in the source was wrong**, which is why `GS-P03` through `GS-P06`, an accessibility audit
and a content-integrity audit all went past it. The defect lived only in the interaction between a
default, an override and a filter, and only a check that reads the *page* could see it. `Q-M9` is
answered — no public team — and it is enforced by deleting the query, the type, the renderer and
its CSS rather than by a boolean anyone can flip.

### Three smaller findings in the same family

- **`ContactForm.tsx` wrote `contact@gridsmith.uk` into its markup twice** — in the confirmation
  and the send-failure message — while its own docstring one paragraph above explained why the
  *response commitment* must never be written that way. `PressContactFlow.tsx` had a third. All
  three now take the address as a prop. The copy that would have drifted is the one in the error
  path nobody renders on a good day.
- **The response commitment was a guarantee.** *"…and always by the end of the next business day"*
  is an unqualified undertaking, and the owner authorises none. **Non-negotiable #5 is unchanged
  and did not need striking** — the new wording is slower than its ceiling *and* is not a promise.
  The single-source rule is what made it one edit: **six surfaces moved and none held a copy.**
- **Four specification documents still stated the old value.** `check:struck` found all four.
  `master/APP-FLOW.md`'s confirmation copy carried a second defect the same annotation catches —
  *"If it's urgent, call [number] during [hours]"*: the number is now real, the hours never will be.

---

## 2. `GS-O015` — closed, and the mechanism generalised

The two reviews stay **withheld**, unaltered, undeleted, unpublished. What moved is *how*.

They were held by `WITHHELD_REVIEW_IDS = [22108992, 22100632]`, which by construction cannot reach
a review nobody has seen. `namedThirdParty` now withholds any body naming a business other than
Gridsmith — a capitalised name followed by a corporate-form token.

**It does not attempt to detect disparagement.** That is the unreliable classification the owner
ruled out; deciding that *"the very disgraceful Varnika Software PVT"* is actionable and *"we moved
from Acme Ltd"* is not is a legal reading, not a pattern. So the predicate is structural and
**over-withholds by design**: a false positive costs one review on a page carrying nine others, and
a false negative is Gridsmith republishing a defamatory statement about a named company on its own
homepage.

Measured live: **12 returned, 10 published, 2 withheld**, each named by the business it matched,
**no collateral withholding of the other ten**. That last clause is what makes it a measurement.

**The two ids are removed and the array is empty**, because keeping them would leave two mechanisms
over one subject with the id branch unreachable for exactly the two reviews it was written for —
`A-GATE-4-3`. An empty denylist is normally inert; this one is not, because `withholdReason` takes
the list as an argument defaulting to the constant, so the self-test drives the branch by value.

`check:reviews --live` now pins `{ total: 12, published: 10, withheld: 2 }`. **A changed set makes
it red and names the difference**, which is the human-review limb: a review nobody has read cannot
reach the homepage without someone seeing the run that reported it. It goes red on a welcome
five-star review too — the action either way is to read the body and then move the numbers.

---

## 3. The SEO surface, and the staging-indexing control

`G-04` and `G-05` were `TODO` and P0. Both are built, and the safety property is the point:
**`app/robots.ts` and `app/sitemap.ts` read one `INDEXABLE` constant, so they cannot disagree.**
The default is `Disallow: /`, an empty sitemap and `noindex, nofollow` on every page. Indexing
requires a Vercel **production** deployment **and** an explicit `NEXT_PUBLIC_SITE_URL` — two
conditions, so it is an act rather than a side effect.

Per-route canonicals come from `alternates.canonical: './'` in the four root layouts, which Next
resolves against the current pathname — one line per group instead of twenty per page. Canonicals
resolve to the deployment's own origin, which is correct for a preview and avoids the thing the
brief warns about: pointing production URLs at a site this build does not serve.

**The documented production switch is one variable:** `NEXT_PUBLIC_SITE_URL=https://gridsmith.uk`
on the Production environment.

`Organization` structured data is emitted from the footer — the one component that already reads
`companyDetails`, so no value has a second copy. `brand[]` rather than `department[]`, because
`department` asserts sub-organisations and the divisions are trading names of one legal entity.
No `logo`, no `sameAs`, no `aggregateRating`.

**No `llms.txt`**, which `G-04` also names: it is an unratified convention and a file listing
content for an AI crawler is a publication decision nobody has taken.

---

## 4. The legacy URL inventory — `G-01` was not blocked and the site was never greenfield

The tracker read *"Crawl existing site, export URLs — **BLOCKED**. Deferred — greenfield, no
existing site"*, and `next.config.ts` said the same. `LIVE-SITE-EXTRACT.md` had contradicted both
since 7 September.

No crawl and no owner export was needed: **WordPress publishes the inventory.**
`gridsmith.uk/robots.txt` names `wp-sitemap.xml`; that index names five child sitemaps, and every
`<loc>` in all five is **eight URLs**. Four are WordPress and theme defaults — `hello-world`, the
`uncategorized` archive and two UiCore template pages — that carry no Gridsmith content.

`redirects/legacy.json` **stays empty**, for two better reasons than the old one: cutover is
prohibited, and one row is an owner decision rather than an implementation one.
`/terms-and-conditions/` is a single instrument this build splits three ways, and `lib/legal/slugs.ts`
already recorded what happens when a redirect picks a target — *"every target is wrong for half the
people following the link."* Options are set out in `LIVE-SITE-EXTRACT.md` §13.3 and neither is
chosen here.

---

## What changed

| Path | |
|---|---|
| `scripts/seed-company-details.mjs` | the `GS-O004` facts; phone added; `England`; the new response wording |
| `sanity/schemas/companyDetails.ts` | `businessHours` **removed** (the `vatNumber` precedent) |
| `lib/company/companyDetails.ts` | `businessHours` out of the type and the projection; **new** `telHref` |
| `components/chrome/Footer.tsx` | phone published; `Organization` JSON-LD |
| `app/(marketing)/about/page.tsx` | registered-office and trading-address rows removed; email and phone rows added; **the team section deleted** |
| `app/(marketing)/contact/page.tsx`, `app/(press)/press/contact/page.tsx` | phone published; `businessHours` render removed; `contactEmail` passed down |
| `components/leads/ContactForm.tsx`, `components/divisions/press/PressContactFlow.tsx` | three hardcoded addresses replaced by a prop |
| `lib/sanity/queries.ts` | `listPublicTeam` and `TeamMember` **deleted**, with the reason in their place |
| `components/content/content.module.css` | the team rules removed |
| `scripts/seed-content.mjs` | `isPublic: false`; the `/about` people-section note rewritten |
| `lib/reviews/freelancer.ts` | **new** `namedThirdParty`; `WITHHELD_REVIEW_IDS` emptied and made injectable; `withholdReason` at five limbs |
| `scripts/check-reviews.mjs` | **new** pinned `EXPECTED` review set (the `GS-O015` human-review limb) |
| `scripts/check-reviews.selftest.mjs` | 58 → **66** cases |
| `lib/seo/site.ts` | **new** — origin resolution and `INDEXABLE` |
| `app/robots.ts`, `app/sitemap.ts` | **new** |
| the four root layouts | `metadataBase`, canonical, description, Open Graph, `robots` |
| `scripts/company-facts-rules.mjs`, `check-company-facts.mjs`, `check-company-facts.selftest.mjs` | **new** — the six-question gate and its 35 specimens |
| `scripts/struck-rules.mjs`, `check-struck-rules.mjs` | 13 → **16** rules; 27 → **32** specimens |
| `scripts/check-list-parity.mjs` | the `OFFICE_ALLOWED` ⊂ `ROUTES` relation registered |
| `package.json`, `ci.yml` | `check:company`, `check:company:selftest`. 43 → **45** gates, parity proven |
| `next.config.ts`, `master/PROJECT-TRACKER.md` | the greenfield claim corrected; `G-01`, `G-04`, `G-05` closed |
| `master/SCHEMA.md`, `master/APP-FLOW.md`, `master/PROJECT-RULES.md`, `00-FOUNDATION.md` | struck values annotated in place |
| `docs/_shared/GS-R001-STAGING-RC.md` | **new** — the evidence |
| `LIVE-SITE-EXTRACT.md` §13, `PRE-DEPLOYMENT-CHECKLIST.md` A1–A8, `OWNER-ACTIONS.md` | the records |

## Verification

The table is in `GS-R001-STAGING-RC.md` §5.1. Headline: **`verify:static` (45 gates) PASS**,
**`verify:build` PASS on a wiped `.next`** (77 page routes plus `/robots.txt` and `/sitemap.xml`,
all within delta budgets, master 1.9KB of 15KB), **the full served chain PASS**, `npm audit
--omit=dev` clean, no dependency added. Lighthouse is CI's — it cannot run on Windows.

### The deliberate-failure proofs, and the two that were about the gate itself

**`check:company` went red twice on its own defects before it was trusted.** Round one stripped
tags but not `<script>` *contents* and read Next's RSC flight payload — which serialises every prop
and the footer's text, **after** `</footer>` — as page text: 22 problems on questions 3 and 4.
Round one's fix stripped scripts before the *text* extraction and left the *href* scans on raw
markup: 57 problems on question 2, naming a `mailto:` at `contact@gridsmith.uk\\`, an address that
exists nowhere but in the payload's own escaping.

Fixing the symptom each round would have taken a third, and the third would have been question 3's
`tel:` href. **The root cause is one thing — the subject is the markup a browser renders** — so
scripts and styles come out once, at the top, and all six questions read what is left. Every other
served gate here could have had this; `check-vat-display` and `check-legal-parity` are clean of it
only because their subjects do not appear in props.

Then three questions that had not been observed firing on served content were made to fire, in one
build, with the exit code verified separately from the output:

| # | Q | Injection | Named in the red |
|---|---|---|---|
| P1 | 1 | footer's `placeOfRegistration` → a literal `England & Wales` | the rule, on **18 routes** |
| P2 | 5 | `Our opening hours are 9am to 5pm.` into `/contact` | `BUSINESS-HOURS-CLOCK` **and** `BUSINESS-HOURS-LABEL`, both named |
| P3 | 6 | `Who you will work with` into `/about` | `TEAM-HEADING`, named |

Problem count moved **0 → 21**; `with-server` exit was `1`. Every branch is additionally proven by
**return value** in the 35-case self-test, which is the structural probe. Subjects were restored
from bytes captured before the first mutation, verified by SHA-256 — never `git checkout --`, which
would have discarded this phase's own uncommitted work — and a residue grep found none of the three.

`check:struck`'s three new rules each got an annotated specimen and a separate unannotated branch
case, and its `ZERO-SUBJECT` count expectation moved 13 → 16 deliberately, which is what proves
that count is counted rather than printed.

### CI found a regression this phase introduced, and the fix is not a lowered bar

Run `35144458922` on the first push went **failure**: thirty steps green, then desktop Lighthouse
red at `categories.seo` **0.66** against a `>= 0.9` floor, on all four routes and all three runs.

**Real, and mine.** Every page now carries `noindex` unless the deployment is a configured
production one, so Lighthouse's `is-crawlable` is correctly 0 — the page really is blocked.

The artefact was read rather than guessed at: across **12 runs and 4 routes**, `is-crawlable`
scored 0 every time and **every other SEO audit scored 1**. One audit carrying ~4.04 of the
category weight is the whole drop. Performance stayed **1.00** and accessibility **1.00**.

Lowering the floor to 0.66 would also accept a missing title, a missing description, a broken
canonical and unreadable link text. Removing the `noindex` would delete the safety property to
make a score green. **Neither was done.** The category assertion now applies only when the build
is actually indexable; otherwise the eight substantive SEO audits are asserted **individually at
1** and only `is-crawlable` is off — **stricter than the 0.9 floor it replaced**, which tolerated
exactly one failing audit and whose ratchet note named `meta-description` as the one it tolerated.

It closes itself: setting `NEXT_PUBLIC_SITE_URL` on a production deployment restores the category
assertion with no edit. Both branches are proven by **value** — evaluating the config with and
without that environment returns the two different assertion sets.

Reading the condition from the config's own environment is legitimate here and would not be
elsewhere: this config **starts the server itself**, so the build measured inherits the
environment by construction. There is no second machine to be wrong about.

### Human acceptance — what was done, and what is not claimed

**Done**, in a real Chromium browser against the served candidate: 375/768/1440/1920 with no
horizontal overflow; the skip link is the first focusable with a visible ring; **36 focusable
elements and 0 inside the cylinder**, so rotation cannot strand focus; the pause control moves
`animation-play-state` `running → paused` and carries a real label; the ring runs at 96s on a
`preserve-3d` container with 10 cards; both contact journeys render the right email and phone;
invalid submission produces a `role="alert"` summary plus `aria-invalid` and `aria-describedby`
per field with a non-colour `!` cue.

**Not done and not claimed: no screen-reader test** — `check:axe` passing is not one — **no
physical device**, **no Firefox and no Safari** (neither engine is available here), and **no
successful form submission**, because Preview has no isolated database (`GS-O010`). The success
state is covered by `check:axe`'s probe-route assertion, not by a browser.

## Staging

Project `gridsmith-ltd` has **no custom domain** and `live: false`; `gridsmith.uk` is on Hostinger.
**A production-target deployment cannot replace the live site**, and every one since `GS-P00` has
ended `ERROR` on the empty production Sanity dataset (`GS-T005`). So the candidate is a **branch
preview**, which builds against `development` and reaches `READY` — isolated by construction rather
than by configuration. Vercel Authentication is on for all non-custom-domain deployments, so it
answers 401 to a crawler; `robots.txt` and the `noindex` meta are the second and third locks.

## Findings and programme state

- **Closed:** `GS-O004`, `GS-O015`, `G-01`, `G-04`, `G-05`, `Q-M9`, checklist `A1`–`A5` and `A8`.
- **New:** `GS-O016` — the ICO registration position, lifted out of `GS-O004`'s original wording so
  that closing it could not silently close this.
- **Narrowed:** `GS-O007` — the URL inventory and the SEO-metadata limbs are done; brand assets and
  one redirect row remain.
- **Remaining:** `GS-T004`, `GS-T005`, `GS-O003`, `GS-O005`, `GS-O007`, `GS-O010`, `GS-O016`,
  `GS-X001`, `GS-X002`, `GS-R002`, `GS-R003`, `Q-P13`, the three `GS-R001` human tests, and the
  production content listed in `GS-R001-STAGING-RC.md` §8.
- **RC status:** **TECHNICALLY PASS.** **Production readiness: NOT READY.**

## Recommended next phase

Recommendation only. **Do not begin it from this handoff alone.**

**`GS-O008` — owner acceptance of the staging release candidate**, followed by whichever of the
owner actions that review unblocks. It is an **owner task, not an agent phase**: the candidate is
built, gated and deployed, and what it now needs is a person to read all four sections and say
whether the site describes their business.

- **Owner task required before it?** Yes — this *is* the owner task. Open the preview URL and read
  Master, Design, Digital and Press end to end. `GS-R001-STAGING-RC.md` §8 is the list of what is
  knowingly missing, so time is not spent re-finding it.
- **Exact owner information/action required:** (1) accept or reject the candidate section by
  section; (2) real copy for `/about` and `/approach`, which carry `[SEED]`-marked prose; (3) a
  reading of the nine `/insights` posts, which are agent-authored and unread; (4) the `GS-O016` ICO
  position, one sentence; (5) approved logo and favicon, and the one redirect row (`GS-O007`).
  Items 2–5 can be answered in any order and none blocks the others.
- **Session:** **NEW.** This one's context is company facts, review safety and SEO; the next is
  owner-supplied content.
- **Agent/model:** Claude Code (Opus 5).
- **Effort:** medium — no new architecture. The work is transcribing owner-approved copy into the
  development dataset and re-running the chain. It becomes large only if the acceptance review
  rejects a section.

**`GS-T004` production activation stays in a separately authorised production-release phase**, and
`gridsmith.uk` cutover stays behind `GS-O009`. Technical-group content stays gated on `GS-O005` /
`GS-X002`. **Do not treat an accepted RC as authorisation for either.**
