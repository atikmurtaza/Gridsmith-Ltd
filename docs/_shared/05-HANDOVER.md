# Handover — GS-P00 production controls are authoritative

**Written:** 11 August 2026 · **Revised:** 11 September 2026, at **`GS-P00` — production-control
baseline and commercial-policy reconciliation** · **Branch:** `main` · **Runtime:** Node 24.15.0

This file exists because a session ended with state that only that session knew. Everything
here is either unrecorded elsewhere or scattered across five documents. Read it before
touching anything; delete the sections that go stale as they are resolved.

---

## ⇢ 11 September 2026 (latest) — `GS-P00` establishes the production-control system

Read `PROJECT-STATUS.md`, `AI-DEVELOPMENT-PROTOCOL.md`, `OWNER-ACTIONS.md` and `AI-HANDOFF.md`
before using the historical sections below. They are now the authoritative control set.

Two owner decisions supersede the old stopping report's price/portfolio dependency ordering:

- `GS-D001`: public case studies, client work, books/covers, retailer links and similar evidence
  requiring permissions Gridsmith does not hold are not launch dependencies. Do not fabricate or
  superficially anonymise them. Public capability, process, methodology and quality content replaces
  them; permitted examples may be discussed privately without promising disclosure.
- `GS-D002`: public fixed, starting, indicative, package, band and estimator-generated prices are
  not launch dependencies. The public route is bespoke quotation/consultation.

Therefore the 7 September ranking beginning with `Q-DG2`, `Q-DG1`, `Q-02`, `Q-04`, `Q-DG6`,
`Q-P3` and `Q-P1` is historical, not the current critical path. The live `gridsmith.uk` service
list is also no longer definitive; `GS-O002` asks the owner for the final service inventory.

The Press Path Finder remains useful as a non-price recommendation/scoping tool. Its seed rules
still require owner validation, but removing public prices does not remove its honesty outcomes.

Supabase switching was not performed: the connected integration exposed neither intended project.
No remote system other than GitHub may change in GS-P00. See `GS-O001` for exact owner steps.

---

## ⇢ 7 September 2026 (latest) — `R-01`/`R-10`/`R-15` ship, and **the build stops here**

### The build has stopped, and what it is stopped on is owner facts

**There is no buildable row left that does not need an answer from Atik.** That is the state,
stated plainly rather than left to be rediscovered by a session that opens the tracker looking
for work. `R-01`, `R-10` and `R-15` were the last three rows in the programme that were pure
code with no owner input, and they are `DONE` and pushed at `e0b2f0ce`. Every remaining open
row either names a `Q-` question in its `Depends`, or depends on a row that does.

**This is not a blocked build. It is a finished phase.** The schema layer, the gate layer, the
legal instruments, the primitives, the four route groups' chrome and the Path Finder are built
and gated; what is missing is content and the commercial decisions the content encodes. Nothing
technical is in the way of any of it.

### Which single answer buys the most work

Ordered by **days of downstream open work released**, largest first. The transitive closure was
computed from the four `PROJECT-TRACKER.md` files rather than read off any one of them:
`scratchpad/unblock.py` parses every row's `Depends` and walks the children.

⚠ **Every day figure below is a spec estimate that no gate measures.** `CLAUDE.md`'s rule about
unverified numbers applies to these in full — they are useful for *ordering* the questions and
should not be read as a schedule.

| Rank | Question | Direct rows | Days released | Notes |
|---|---|---|---|---|
| 1 | **`Q-DG2`** base price bands per project type | `V-01` | **13.0d** | The largest single answer in the programme. It unlocks the whole Digital estimator spine — `V-01`→`V-16` plus `Y-09` |
| 2 | **`Q-M6`** a real cross-division continuity example | `N-05` | **10.0d** | Unlocks `N-01`, `N-02`, `N-04`, `N-05`, `H-01`, `H-04`, `H-05` — the master layer's homepage and approach page. `master/SCHEMA.md` §2 calls an invented one "the most damaging possible piece of content on the site", so it cannot be seeded |
| 3 | **`Q-DG1`** 10 historical projects with real final prices | `V-04`, `V-05` | **9.5d** | Overlaps `Q-DG2` almost entirely — see the grouping note below |
| 4 | **`Q-02`** real pricing figures per Design service | `C-06`, `E-01`, `E-02` | **8.5d** | |
| 5 | **`Q-01`** Track A vs Track B split | `B-06` | **6.5d** | The only architectural question left; it is a positioning decision, not a price |
| 6 | **`Q-04`** which 8 Design projects become case studies | `E-03`, `E-04` | **6.0d** | |
| 7 | **`Q-DG6`** which 8 Digital projects become case studies | `X-02` | **5.0d** | |
| 8= | **`Q-P3`** final package prices and inclusions | `O-05` | **5.0d** | `R-10` is now built, so what is left is content |
| 8= | **`Q-P1`** author consent for 12+ titles | `O-01`, `O-02` | **5.0d** | Also gates `Z-02`, `Z-06`, `Z-07` — the launch checks |
| 8= | **`Q-P4`** revision rounds + extra cost per package | — | **5.0d** | Same downstream set as `Q-P3` |
| 11 | **`Q-P11`** marketing package contents and prices | `K-21`, `K-22` | 3.0d | |
| 11= | **`Q-P12`** platform spec detail per platform | `R-16` | 3.0d | `R-15` is now built |
| 13 | **`Q-DG4`** diagnostic price and deliverable | `T-09` | 2.5d | |
| 14 | **`Q-P5`** Manuscript Assessment price + deliverable | `K-09` | 2.2d | |
| 15= | **`Q-M7`**, **`Q-DG7`**, **`Q-P13`**, **`Q-P10`**, **`Q-DG3`** | | 2.0d each | `Q-P13` has a `[SEED]` draft and is a decision, not a blocker |
| 20= | **`Q-P7`**, **`Q-P6`**, **`Q-M9`**, **`Q-05`**, **`Q-P2`** | | 1.5d each | |
| 25= | **`Q-M8`**, **`Q-DG5`**, **`Q-M5`** | | 1.0d each | |
| 28 | **`Q-DG8`** the exclusions list | `X-05` | 0.5d | |
| — | **`Q-M2`**, **`Q-M3`**, **`Q-M4`**, **`Q-03`**, **`Q-06`**, **`Q-M15`** | | 0d of *build* | External or gate rows with no dev effort behind them. `Q-M2` (solicitor) and `Q-M3` (ICO) release no build days and are still launch blockers |

### The Press price questions **are** one sitting — four of the six, not all six

The grouping in the brief is **right about `Q-P3`, `Q-P4`, `Q-P5` and `Q-P11`, and wrong about
`Q-P6` and `Q-P7`.** The distinction is what kind of answer each needs, not what it is about.

- **One sitting — the Press price list: `Q-P3` + `Q-P4` + `Q-P5` + `Q-P11` = 10.2d** over 9 rows
  (`K-09`, `K-10`, `K-21`, `K-22`, `O-05`, `O-13`, `P-05`, `R-11`, `R-12`). All four are *"what
  does this cost and what is in it"*, they share one document, and `Q-P4` in particular cannot be
  answered apart from `Q-P3` — revision rounds are a line in the package. `Q-P11` is a separate
  *service* (`FR-P27`, never bundled) but not a separate *decision*.
- **`Q-P6` is not a price.** *"Ghostwriting: real author hours per stage"* is an observation about
  how the process actually consumes the author's time. It is answered by looking at a past
  project, not by choosing a number, and getting it wrong is an honesty failure rather than a
  margin failure. Different sitting, and arguably a different day.
- **`Q-P7` is two questions wearing one row.** The *tiers* belong to the price sitting; the *SLAs
  and notice period* are contract terms that bear on the consumer and business instruments in
  `_legal/`. Answering the tiers alone does not release `K-12`.

All six together are **13.2d**, so adding `Q-P6` and `Q-P7` to the sitting buys 3.0d more and
costs the sitting its focus. **Take the four.**

For comparison, the two other genuine one-sitting groups: **`Q-DG1` + `Q-DG2` = 13.0d** (the
Digital price bands — these two overlap almost completely, so they are one answer with two
tracker rows), and **`Q-02` + `Q-04` = 14.5d** for Design. The Digital pair is the single
highest-value hour available.

### What shipped

`e0b2f0ce`. Three document types, three object types, `check:schemas` extended, and **three
rules that were stated in prose and enforced nowhere** — the `ETH-07` shape, hunted deliberately
rather than met by accident:

| Rule | Stated in | Now enforced by |
|---|---|---|
| No affiliate links on retailer URLs | `press/PROJECT-RULES.md` §1.7 | `retailerLink.url`, a named parameter set |
| `extraRevisionCost` is required | `press/SCHEMA.md` §2 **prose**, contradicting its own code block | `publishingPackage.extraRevisionCost` |
| A spec unchecked for 90 days is surfaced in the CMS | `press/SCHEMA.md` §3a | `publishingPlatform.specCheckedOn`, as a `.warning()` |

**24 deliberate-failure proofs, all red, each naming its own case.** Six were re-run in a second
pass: the first attempt deleted the whole `validation` and produced *"has no validation
function"*, which proves the gate found the field and **not** that it asserts the particular
rule. The second pass swapped `min(1)` for `max(99)` and `required()` for a permissive `custom`,
so the only thing that changed was the assertion under test. **That correction is the reusable
part** — a probe that removes the subject proves the lookup, not the assertion.

`check:schemas` gained one piece of machinery: a `HARD_VALUES` refusal case may now be
`[value, substring]`, naming the limb whose message it must produce. `noAffiliateRule` has three
limbs and without it, one limb firing on every case reads exactly like all three working —
`check:rls`'s half-working alternation, which shipped twice.

**The JS delta is structurally zero and was not measured, deliberately.** `sanity/schemas/` is
imported by `sanity.config.ts` and two gate scripts and by nothing under `app/`, `components/` or
`lib/` — established by grep, not assumed — so no route's module graph can reach it. An A/B over
an unreachable subject reports a `0` that means nothing, which is the inert-probe class wearing a
performance label. One clean build ran as a control: green, `check-bundle-size` 67 routes all
within budget.

### Housekeeping and standing state

`press/k-14-carries-nothing` and `press/k-14-preview` are **deleted** from the remote. Three
older branches remain and were not touched: `feat/a-01-a-10a-scaffold-ci`,
`feat/palette-and-homepage-mark`, `legal/round-12-parity-gate-and-ucta`.

Production deploys still `ERROR` on the empty `production` dataset. **That is `H1`/`D6`, it is an
owner item, and it is not a regression — do not report it as a finding.**

---

## ⇢ 7 September 2026 — `K-14` ships as an **enforcement**; the production deploy is still `ERROR` on the empty dataset

### The `62d8aa9a` production deploy **ERRORed**, and it is `H1`/`D6`

`dpl_JxP3QzsoL8ZT1mot3S1XExbSyUZo`, target `production`. Cause read from the build log rather
than inferred from the last known failure:

```
check-launch-content: 1 problem(s) in dataset "production"
  no companyDetails document in dataset "production" — every page renders the statutory footer
Error: Command "npm run build" exited with 1
```

**Not a regression and not a `K-06`/`K-07` defect.** The gate is working: it refuses to publish a
site whose every page would render a footer with no company details in it. It is the known empty-
`production`-dataset failure and it is an owner item. Preview deployments are unaffected — they
build against `development` and are `READY`.

### `K-14` — the decision is **carry nothing**, and what shipped is the gate, not the behaviour

**Owner decision, recorded so it is not reopened: NOTHING travels from the Path Finder result to
the contact form. No query string, no answers, not even the outcome key.** The visitor follows a
plain link and the form starts clean. The reason is the audience — a query string puts a memoir
author's five answers in browser history and in the referrer of every page the contact form links
to, and `PressContactFlow` already refused that same trade once for these same people.

**The premise check found the required behaviour already present**: `ctaHref` defaulted to a bare
`/press/contact`, and nothing under `app/(press)/press/contact/` reads a query param — the only
`searchParams` in the whole tree is `app/gridsmith-lead-probe/route.ts`. So this row had **no
behaviour to build**, and shipping it as "done, nothing to do" would have left the decision as a
comment. What it ships is the **enforcement**: nothing in the tree stopped a later session
appending `?outcome=…` and calling it a helpful prefill.

`check:path:live` gains a **fifth assertion, CARRIES NOTHING** — every link from the result panel
to the contact route must resolve to a URL with an empty search **and** an empty hash. It went
into that gate rather than a 33rd because it is the same subject, and **assertions 1–4 read the
link's `pathname` only, so a query string passed all four of them**.

**Two deliberate-failure proofs, each firing its own branch and its own half of the predicate:**

| Probe | Site | Result |
|---|---|---|
| `?outcome=<key>` | the Gridsmith CTA | **4 problems** — one per `showCta` outcome; the no-recommendation link stayed clean, so the two sites are independent |
| `#answers` | the no-recommendation link | **1 problem** — exercising the `url.hash` half that the first probe never touched |

**The count moved 0 → 4 → 1 → 0**, so it is provable to report something other than zero. Both
probes were red, so each carries its own validity proof. Subject restored from bytes captured
before the first mutation and confirmed **md5-identical to baseline both times**.

**The ceiling is in the gate's docstring:** it asserts the *link* carries nothing, not that no
other carrier exists. `sessionStorage`, `localStorage` and cookies appear **nowhere in the tree**
(grepped at `K-14`), and asserting the absence of a mechanism that does not exist is the
inert-probe class.

### Runway after this session is **thin and it is three schema rows**

`R-01` (1d), `R-10` (1d), `R-15` (0.5d) — the `book`, `publishingPackage` and `publishingPlatform`
schemas. All three are pure code with hard validators, the shape `K-01`/`K-02` already shipped,
and none needs a price or a title. **Every other open row in Epics K, P and R needs an owner fact
or sits behind one of these three.** The full assessment, row by row with the reason, is at the
end of the `K-14` session report and on the tracker rows themselves.

---

## ⇢ 7 September 2026 — `K-06`/`K-07` built and gated; the live-site extract is reframed; the preview is verified

### The live site's authority is now **two things**, and the rest is superseded — owner decision

**`gridsmith.uk` is authoritative for the services offered and the work process. Nothing else.**
Its email addresses, refund policy, terms and governing law are **legacy**, and the six drafted
instruments in `docs/_legal/` are the only source. `LIVE-SITE-EXTRACT.md` now says so at the top
and marks §5's refund summary, §9's two email rows, §10's consent banner, §11.2 and §11.4
**SUPERSEDED BY `docs/_legal/`**. They are kept as provenance so the comparison is not
re-derived — a deleted record comes back as an open question — but they are not contradictions
to resolve and may never become checklist rows.

**One row was removed from `PRE-DEPLOYMENT-CHECKLIST.md`: `I4`**, the Pakistan governing-law
divergence. Group I 4 → 3. `I2` (`K-17`) kept its row and lost its pointer at §11.4 — `K-17` is
a decision about the *build's* notice and the live refund copy bears on it not at all.

**`A3` survives the rewrite and changed meaning.** `CONSUMER-TERMS.md` §6.1/§18 name
`contact@gridsmith.uk` as the address for serving a **statutory cancellation notice**, and that
mailbox **does not exist**. It is a mailbox to create — a requirement of the new instrument, not
a divergence from the old site — and a consumer must be able to reach it the day the instrument
is published.

### Two rules added to `CLAUDE.md`, both from last session's own mistakes

**A proof harness owns its subject exclusively for the duration of the run.** Two harnesses
overlapping do not conflict noisily — they interleave, and the loser's "restore" writes the
winner's mutation back **as the original**. That is how `isSeed: false` reached disk. Restore
from bytes captured before the first mutation, never by inverse edit, and assert
`git diff --quiet -- <file>` before believing the result.

**Geometric placeholders only; the Unsplash refusal was right and is not reopened.** The brief
authorised stock photography and *The feel* plus `00-FOUNDATION.md` §"Seed content" item 7
prohibit it, so adopting one would mean striking a rule rather than filling a surface. Recorded
in `CLAUDE.md` so the next session does not re-litigate it as a content gap.

### The `seedConfig.ts` damage is **fully repaired**, and this was established rather than assumed

Working tree clean, so disk equals `HEAD`, and `lib/path/seedConfig.ts` has exactly **one**
commit (`ced37cea`) — there was no second, repairing commit, so the mutation was reverted before
it was ever committed. The file on disk is the file that was reviewed.

Verified structurally rather than by eye: **5 questions, 21 option labels, 6 outcomes, 13 rules,
priorities `10,11,12,13,20,21,30,31,40,41,45,50,51` all distinct, 15 `[SEED]` markers,
`isSeed: true`** — every figure matching what the `Q-P13` write-up claimed. **The six lowest
priorities all belong to `self-service` and `not-ready`**, so no Gridsmith rule can shadow an
honest outcome, which is the ordering `ETH-04` needs and the thing a content edit is most likely
to reverse quietly. Both honest outcomes carry `isGridsmithService: false`, `showCta: false` and
guidance. `verify:static` green across all 20 gates; the other harness-touched files
(`check-path-recommend.selftest.mjs`, `path-finder/page.tsx`, three gate route lists) carry no
probe residue. **`SEED IS MARKED` catching line 373 was the only mutation there was.**

### The preview **can** be verified under Hobby, and `/press/path-finder` serves

Deployment protection on `gridsmith-ltd` is **Vercel Authentication (SSO),
`all_except_custom_domains`** — `passwordProtection` and `trustedIps` are both off. That is not
a Pro feature and it is not a wall: the Vercel MCP server's `web_fetch_vercel_url` performs an
**authenticated** fetch as the account owner.
**`https://gridsmith-6dox1skvr-…vercel.app/press/path-finder` returned 200** with the complete
page — five questions, all 21 options, the three-column table, both honest outcomes with
guidance and no CTA, `data-division="press"`, `x-gridsmith-dataset: development`,
`x-robots-tag: noindex`.

**The probe's validity is structural.** The same URL fetched **unauthenticated** returns
**302 to `vercel.com/sso-api`** — so the protection is real, and the authenticated transport is
what got through rather than an unprotected deployment. Two transports, one URL, two outcomes.

Also read while there: the last two **production**-target deployments are `ERROR`, which is the
known empty-`production`-dataset failure (`H1`/`D6`), not a regression.

### `K-06` and `K-07` are built — the island, and the result view

`components/divisions/press/PathFinder.tsx`, mounted where `K-05`'s static question list was.
Full detail is on the two tracker rows; four things that will otherwise be rediscovered:

1. **They were built together on purpose.** A five-step island that shows no recommendation is
   not shippable, and `APP-FLOW.md` §5 draws the steps and the outcome as one flow. The split is
   estimation.
2. **The no-JS path nearly regressed silently.** A client component server-renders step 1 and no
   further, so replacing the static list would have dropped four questions — and question 2's
   options appear in **no rule**, so `criteriaFor()` would not have carried them either. The full
   list is now inside `<noscript>`.
3. **`check:path:live` is the 32nd gate, and its reason for existing is the reason to keep it.**
   `check:path:selftest` asserts the *data* says no CTA on an honest outcome. It cannot see
   whether the component reads that field, and an island ignoring `showCta` leaves all 28 of its
   cases green while drawing a button under *"you do not need us"*. The new gate drives the
   served page through five clicks. Its expectation is **derived** — node enumerates the whole
   1152-set cross-product — and the derivation is checked **before a browser launches**: fewer
   than six reachable outcomes, or no `null` set, is a hard failure, not a shorter run.
4. **Nothing is logged, and that is an owner decision recorded rather than taken.**
   `press_path_results` has zero policies and `app/api/rls-drift/route.ts` asserts live that
   `anon` can neither read nor write it. An `anon` insert policy breaks that standing assertion;
   a service-role route is a new credential in the request path. Checklist row `C6`.

**Seven deliberate-failure proofs, each firing its own branch, and two probes were invalid on
their first run.** A regex that deleted rules broke the TypeScript, so the red was a parse error
and said nothing about the guard; and blanking the guidance by forcing its guard `false` failed
`next build`'s eslint at `--max-warnings 0`, so the probe never reached the gate. Both recorded
rather than quietly re-run. Counts proved to move: 1 → 2 unreachable outcomes, 1152 → 864 answer
sets. **JS delta 1.9 → 5.9KB gz against 40KB**, two clean builds per side.

### ⚠ `next build` fails on this Windows machine, and the escape hatch is committed

**`[Error: spawn UNKNOWN]` errno `-4094` partway through `Generating static pages`, on a clean
checkout with no local changes** — which is how it was established to be the environment and not
the tree. `next build` forks one `jest-worker` child per core; several succeed first, so it reads
as a late crash rather than a resource limit. **`NEXT_BUILD_CPUS=1 npm run build` works every
time.**

`next.config.ts` carries it as a **spread**, so an unset variable adds no key at all and CI keeps
Next's own default. Proven both ways in the same session: unset, the build still fails; set, it
succeeds. Every measurement and every gate run in this session used it.

### Runway after this session

`K-14` (0.5d) is the next Path Finder row and both its Depends are now built. It needs one
decision first, and it is the decision `PressContactFlow` already refused once for this audience:
**what travels from the result to the contact form, and how.** A query string puts a memoir
author's five answers in browser history and in the referrer of every page the contact form
links to.

Everything else is where the 5 September table left it — `K-17`, `K-10`'s asset, `R-09`/`O-09`,
`Q-P5`/`P6`/`P7`/`P11`.

---

## ⇢ 7 September 2026 — the live site is **Digital**, not Press; `Q-P13` has a [SEED] draft; `K-05` and `K-04` are built

### **Correction to this file: the live `gridsmith.uk` is NOT Press-facing.** Verified, not assumed.

Earlier revisions of this handover describe the live site as Press. It is **wholly Gridsmith
Digital** — website development, SEO, digital marketing, branding support, automation.
`press`, `book`, `publish`, `manuscript`, `ghostwrit`, `ISBN`, `editorial` and `author` appear
**nowhere** on the served homepage; the only adjacent word is *"publishing outcomes"* inside the
T&Cs' no-guarantees clause, which is a disclaimer, not an offer. **Design** exists only as
*"branding support"* — a line item inside Digital's list. There is no division structure at all.

**Full verbatim record: `docs/_shared/LIVE-SITE-EXTRACT.md`.** Read it before writing any copy
that assumes what the public currently sees.

Four things in it that will otherwise be rediscovered:

1. **The six process stages in `00-PROCESS.md` came from the live site.** Near-verbatim. The
   provenance was recorded nowhere until now. Live stage 6 names *"SEO improvements"* inside a
   description the build treats as division-neutral.
2. **The footer's email inconsistency runs the opposite way to how it is usually described.**
   The served markup is `<a href="mailto:info@gridsmith.uk">contact.gridsmith@gmail.com</a>` —
   **the label is the Gmail address and the `href` is `info@`**. Three addresses are in play
   across the estate, and the third — `contact@gridsmith.uk`, in the build's seed — is the one
   `CONSUMER-TERMS.md` §6.1 names for serving a **statutory cancellation notice**, and it is
   published on none of the three live pages.
3. **The live T&Cs elect the law of Pakistan** (§13) for a UK-registered company publishing a UK
   address. Both build instruments elect England & Wales. Largest single divergence found.
4. **The live registered address differs from the seed in four ways**, one substantive: the live
   postcode reads `BL4 **O**HD` with the **letter O**. Neither string was checked against the
   Companies House register in that session, and the live site publishes **no company number**,
   so the two artefacts cannot corroborate each other.

**`K-17` was not resolved and was not touched.** `LIVE-SITE-EXTRACT.md` §11.4 compares the live
refund summary against `CONSUMER-TERMS` and `MSA-BUSINESS` and stops there.

### `Q-P13` — a **[SEED]** rule set, and the row stays open

`lib/path/seedConfig.ts`: 5 questions, 6 outcomes, **13 rules**, `isSeed: true`. **The questions
and their 21 option labels are `APP-FLOW.md` §5 verbatim and were never the blocker** — the
`K-05` premise check said so and it was right. Only the criteria are drafted, plus the option
*slugs* (the spec gives labels, not keys) and the outcome prose, each `[SEED]`-prefixed where it
renders.

**The schema settles the question count at five, not three to five.** `pathFinderConfig.questions`
is `r.length(5)` — exactly five, not a minimum.

**`APP-FLOW.md` §5's *under £500 + partial draft → E or F* is implemented unconditionally** at
priority 10, two conditions, with no third that could let it fall through. It is the one rule in
the file whose replacement is a spec change rather than a content edit.

**The six honest-outcome rules hold the six lowest priority numbers**, so no Gridsmith rule can
shadow one. That ordering is what `ETH-04` needs and it is the thing a later content edit is
most likely to reverse quietly.

### `K-05` and `K-04` are built

`app/(press)/press/path-finder/page.tsx` — Server Component, no client boundary, the criteria
column **derived** from `SEED_RULES` rather than written beside them. `K-04` extended
`check:path:selftest` from **13 to 28 cases** rather than adding a 32nd gate. Fifteen
deliberate-failure proofs, each naming its own case; the full record is on the two tracker rows.

**One proof was invalid on its first run and the record says so.** The catch-all-fallback probe's
`^\];$` anchor matched `SEED_QUESTIONS`' closing bracket rather than `SEED_RULES`', so the
injected rule went into the wrong array and the gate never saw it — a green reading that looked
exactly like a broken gate. Re-run with probe validity established **structurally first** (rule
count printed 13 → 14 before the gate ran).

**Two process mistakes worth not repeating**, both mine and both cheap:

- **`verify:static` was started while the proof harness was still mutating its subject**, and read
  a temporarily-mutated `isSeed: false`. The red was real and the cause was the race. Do not run
  the suite and a mutation harness concurrently over the same file.
- The two harnesses themselves overlapped, so one proof's output carried another's mutation. Both
  readings were recoverable; neither had to be.

### `PRE-DEPLOYMENT-CHECKLIST.md` — 44 rows in nine groups

`docs/_shared/PRE-DEPLOYMENT-CHECKLIST.md`. Everything assumed, drafted, inferred or lifted.
**It is not a gate and must not become one** — a check that failed on placeholder content would
fail every build until launch and be bypassed within a day.

**No placeholder photography was added, and that is a deviation from the brief with a reason.**
The brief allowed *"Unsplash, Pexels, or generated blocks"*; generated blocks were taken because
the other two are prohibited by `CLAUDE.md` *The feel* (stock photography) and `00-FOUNDATION.md`
§"Seed content" item 7 (*"neutral geometric placeholders at correct aspect ratios"*), and because
`Placeholder.tsx` already fills every surface with a CSS hatch that costs no request. Group E
lists the three surfaces with no imagery and why none of them is an empty surface waiting for a
picture.

---

## ⇢ 5 September 2026 — `check:lists` and `P-03`, and Epic K/P has **no unblocked row left**

### `check:lists` — the 31st gate, from `K-13`'s defect rather than from a tracker row

`K-16` found `check:axe` red because `K-13` put two routes into `ROUTES` and not into
`INCOMPLETE_ALLOWED`. The rule that came out of it is in `CLAUDE.md` above the
expectation-derived-from-its-own-subject rule, and it has two halves, the second of which is the
load-bearing one: **adding a subject to a gate is not done until every list that gate consults has
been updated, and a gate's green is only evidence for the question it was actually asked.** The
`K-13` write-up's *"axe is clean on both new routes"* was true about **violations** — the question
that session asked — and silent about **incompletes**, a second question the same gate answers.

**The mechanical audit, run over all 26 gates.** Every module-level list in `scripts/check-*.mjs`
was extracted and classified by key domain. **Two gates hold more than one route-keyed list** and
both are in sync:

| Gate | Lists | Relation | State |
|---|---|---|---|
| `check-axe` | `ROUTES` (19) · `INCOMPLETE_ALLOWED` (18) · `FOOTER_EXEMPT` (1) | subset of `ROUTES` | **in sync** |
| `check-axe` | `FOOTER_LEGAL_PATHS` (4) | **none** — link *targets*, not routes visited | n/a, and asserting one would assert a falsehood |
| `check-bundle-size` | `BASELINE_ROUTES` (5) ⊆ `REQUIRED` (6) | subset | **in sync** |
| `check-bundle-size` | `BUDGETS` (9) | **none** — budgets precede their routes (`/design/estimate`, `/press/path-finder` are unbuilt) | n/a |
| `check-tokens` | `REQUIRED` (39) vs `CONTRACT` (16) + `SHARED_ACCENTS` (6) | **disjoint** — base layer vs theme layer | **in sync** |

Everything else — `check-responsive`, `check-press-type`, `check-vat-display`,
`check-consumer-terms` — holds exactly one subject list and a widths/regex axis, so the shape
cannot occur. `check-contrast`, `check-schemas` and `check-theme-flash` hold several lists over
non-route key domains; they are outside the discovery guard by construction and that ceiling is in
the gate's docstring.

**Five coupled pairs, 102 keys, all in sync.** `scripts/check-list-parity.mjs` asserts them, and
its **discovery guard** is what stops the registry rotting: a gate with two or more route-keyed
lists that is not registered is a hard failure, so a future multi-list gate cannot be added
without a decision — a relation, or an explicit `unrelated` entry — being written down.

**What it cannot do, stated in its own docstring.** The two directions are not symmetrical.
*Dependent → subject* is decidable and asserted: an allowlist key naming nothing in the subject
list is a decision that has silently stopped applying. *Subject → dependent* — the actual `K-13`
direction — **is not decidable statically**, because whether a new route needs an allowlist entry
depends on what it renders. Running the gate is what settles it. So this gate closes the mirror
image of `K-13`, not `K-13`; the rule in `CLAUDE.md` is the part that closes `K-13`, and it is
procedural.

Proven both structurally and on the real tree. The selftest's **14 cases each read the returned
problem set**, so a broken comparator cannot pass as an absence. On the real tree: injecting
`'/press/gone'` into `INCOMPLETE_ALLOWED` named it; appending a second route list to
`check-press-type` fired the discovery guard on both of that file's lists; deleting one allowlist
route moved the key count **102 → 101**, which is the count proving it reached the lists at all.
In `verify:static` and in `ci.yml`.

### `P-03` is built — the margin note

`components/divisions/press/MarginNote.tsx` + `pressMargin.module.css`. **The premise held**:
`marginNote` / `MarginNote` / `margin-note` had zero hits across `components/`, `app/` and
`styles/`.

**A two-column grid, not a float, and the reason is a gate.** The obvious marginalia technique is
`float` with a negative margin, which pulls the note outside the text container — and overflows
the viewport at the widths between "the container has slack" and "the container is capped".
`check:responsive` asserts `scrollWidth` at three of them. A grid cannot overflow: the second
column is space that already exists inside `--container-narrow`.

**Degradation is measured, not asserted.** *"On mobile these collapse inline beneath the paragraph
they annotate"* is a geometric claim, so `check:press-type` gained a fourth branch that measures it
as one — below `1024px` the note's left edge is flush with the annotated block's and its top is
below that block's bottom; at or above it, the note's left edge is beyond the block's right edge.
Live at 1440: note left **836**, annotated block right **804**, a 32px `--space-8` gutter, 15px,
`rgb(87, 83, 78)`. A margin note with no margin has to be a note rather than a broken layout, and
nothing but geometry can say which.

**The breakpoint is `64rem` and it is now in `DESIGN.md` §4, which had only said "on mobile".**
`--container-narrow` is 800px and Press prose caps at 52ch (~426px in Source Serif at 17px), so the
slack is real from about 768px — but a ~290px note column beside a 426px column of 17px serif is
two cramped columns, not a book's margin. 375 and 768 collapse; 1440 does not.

**The subject is real content already on the page, not a specimen.** The rights statement on
`/press` ends in a clause-10.1 reference, and `DESIGN.md` §4 names clause references as the use
case. That paragraph is now the margin note beside the three rights paragraphs. Nothing was
authored: the sentence, the link and the anchor are unchanged, and `check:consumer-terms` still
reports `/press` linking to the consumer instrument. **Both sinks are in `(marketing)`**, so a
kitchen-sink specimen was not available — `check:press-type` requires `data-division="press"`.

**The note is deliberately outside the 17px / 1.7 / 52ch assertions** — `DESIGN.md` §4 sets it at
`--text-sm` `--ink-muted`, and at 375px it measures 14.05px against a 16.08px body. That exemption
is the shape that goes unmeasured, so it has its own branch rather than none.

**Seven deliberate-failure proofs, each firing its own case and nothing else**: `--text-base` fired
size at all three widths; `--ink` fired colour at all three; removing the media query fired the
outer-column branch **at 1440 only**, both collapse branches still passing; a 40px inline start
fired flush-left at 375 and 768 only; a -400px block start fired beneath-the-paragraph at the same
two and not flush-left; emitting the note first fired the no-preceding-sibling branch and stopped
there; deleting the only call site fired the hollow-subject exit. The two collapse branches were
broken separately on purpose — one alternation branch firing is not evidence for the other.

**JS delta 1.9 → 1.9KB on `/press` against a 20KB budget**, two clean builds per side
(`rm -rf .next` each). It is a server component; there is no client boundary to pay for.

**Every list of every gate this touched was checked, per the rule above.** `/press` was already in
`check-axe`'s `ROUTES` **and** its `INCOMPLETE_ALLOWED`, in `check-responsive`'s `ROUTES`, in
`check-press-type`'s `ROUTES` and in `check-bundle-size`'s `REQUIRED`, `BASELINE_ROUTES` and
`BUDGETS` — no route is new, so no list changed, and `check:lists` re-confirms all five pairs. Axe
on the changed route: **zero violations and zero unresolved incompletes**, which are two answers
and are reported as two.

### Runway after this session: **nothing. No Epic K or P row is buildable without an owner decision.**

`P-03` was the last one. What remains and what each waits on:

| Blocked on | Rows |
|---|---|
| Owner decision `K-17` | `K-17`, and `K-19`'s consumers (`K-19` itself is buildable as a migration, but every consumer is downstream) |
| Missing `K-10` sample asset | `K-10` |
| `Q-P13` | `K-21`, `K-22` |
| `Q-P5`/`P6`/`P7`/`P11` | `K-04`, `K-05`, `K-06`, `K-07`, `K-14` |
| `R-09` (design) + `O-09` (copy) | `K-13`'s memoir residual, `K-09`, `K-11`, `K-12` |
| `P-03` — now unblocked | `R-08`, `R-09`, `R-13`, `R-17` are **no longer blocked by their dependency**, but `R-09` and `R-17` both need clause and copy decisions that are not mine to make |

`R-08` and `R-13` are the two that are closest to buildable and neither is clean: `R-08` is a
three-way honest comparison naming what Gridsmith is not, and `R-13` names distribution platforms.
Both are content-first rows under non-negotiable #2, and authoring either means inventing the
comparison or the platform list. **They are open questions wearing a Dev label, not runway.**

---

## ⇢ 4 September 2026 — `K-16` and `K-15` are built, and Epic K's runway is now `P-03` alone

**`K-16` is built.** `pressSegmentTerms` in `lib/leads/pressSegments.ts`, rendered at step 4 of the
Press flow beside the privacy line. **The premise check held** — both destinations existed at
`lib/legal/slugs.ts:40-42` and all three serve 200 — but reading the instruments changed one
routing from what `PRD.md` FR-P24 implies.

**The instruments do not test who you are, they test what you are buying for.**
`CONSUMER-TERMS.md` §1 is *"wholly or mainly for purposes outside their trade, business, craft or
profession"*; `MSA-BUSINESS.md` §1 is *"only where the client is acting for purposes relating to a
trade, business, craft or profession"*. Against that test:

| Segment | Destination | Determinate? |
|---|---|---|
| `business` | `/legal/business-client-terms` | yes — *"a business or a founder"* states the trade purpose |
| `author` | `/legal/consumer-client-terms` | FR-P24 and `_legal/00-LEGAL-BASIS.md` §3; the instrument's own §1 corrects the minority buying in trade |
| `memoir` | `/legal/consumer-client-terms` | same, more strongly — and withheld at step 1 regardless |
| `content` | **`/legal/client-terms`** | **no.** *"I need ongoing content"* states no purpose, FR-P24 does not name the segment, and neither §1 resolves it |

**`content` going to the disambiguation page is the finding, not a shortcut.** The page carries no
operative clause and exists to explain both; picking an instrument there would be the
pre-26-August defect with an extra step. It is recorded on the FR-P24 row and in the tracker
rather than resolved quietly.

**Six deliberate-failure proofs, each naming its own case.** Business→consumer fired the business
case; content→business fired content and the no-consumer-reaches-the-MSA case; collapsing the
fall-through fired author and memoir together; memoir→MSA fired memoir and the MSA case;
author→disambiguation fired author and content; author→`undefined` fired author and the
every-segment-routed case. Validity is structural — every specimen reads a **returned slug**,
so there is no absence to misread. Selftest 19 → 25 cases, and the count moved.

**Live over HTTP on `next start`:** driving step 1 through all three reachable segments swapped the
rendered `href` and the link text each time — `/legal/consumer-client-terms`,
`/legal/business-client-terms`, `/legal/client-terms` — and all three serve 200. **JS delta
7.7 → 8.0KB against a 20KB budget**, two clean builds per side (`rm -rf .next` each).

**`K-15` is built** on `/press/contact/thank-you` and nowhere else. Copy and two links, no figure
and no claim; `check:content` clean, route delta unchanged at 1.9KB because it is server-rendered.

### One pre-existing defect found by running the gates, and it was `K-13`'s

**`check:axe` has been RED since `K-13`**, and the `K-13` write-up's *"axe is clean on both new
routes"* was true about violations and not about the gate. The two new routes went into the route
list and not into `INCOMPLETE_ALLOWED`, so the shared consent banner's `color-contrast` incomplete
— allowed on all sixteen other routes — reported **UNRESOLVED on eight combinations**. Fixed by
adding the two routes to the existing entry; allowed count **56 → 64, unresolved 0**, so the count
moved and proves the entry was reached. **A route added to a gate's subject list is not the same
as a route added to its allowlist**, and nothing in the K-13 session asked the second question.

### Runway after this session: **1 day, one row**

`P-03` (1d, margin-note component, `DESIGN.md` §3 line 105, zero hits in the tree) is the only
unblocked Epic K/P row left. It was **not started** — deliberately, on instruction. `K-19` (0.5d,
`consumer_consents`) is buildable as a migration but every consumer is downstream of the blocked
`K-17`. Everything else is behind `Q-P13`, `Q-P5`/`P6`/`P7`/`P11`, the missing `K-10` sample asset,
the owner's `K-17` decision, or `R-09`/`O-09` for the memoir residual.

---

## ⇢ 4 September 2026 — `K-13` is built, and Epic K's clear runway is about two days

**`K-13` is built and verified live.** `app/(press)/press/contact` and `/contact/thank-you`,
`components/divisions/press/PressContactFlow.tsx`, `lib/leads/{pressLead,pressSegments,pressAction}.ts`,
and `check:press:contact:selftest` as the 30th gate — in `verify:static` **and** in `ci.yml`, which
`check:node` caught me omitting.

**The premise check corrected the row's own reading.** `components/leads/ContactForm.tsx` is not a
single-step version of this flow — it is the **master** `/contact` form, mounted only at
`app/(marketing)/contact/page.tsx`, division-agnostic by design and carrying the "more than one
division" journey `N-11` exists for. `app/(press)` held a layout and one landing page and nothing
else. So there was nothing to extend: this is a new route, and the master form is untouched.
**What was reused is the pipeline** — `submitLead`, the `anon` insert, `Prefer: return=minimal`,
the generated id, the `after()` notification fan-out. `pressAction.ts` is a second `useActionState`
adapter over the same function, and the branch answers land in `leads.payload`, the `jsonb` column
`0001` already indexed for exactly this. **No second data path and no new RLS surface.**

**`SCHEMA.md` §6 said `expectationsAcknowledged: z.boolean()`, and a boolean accepts `false`.**
`PROJECT-RULES.md` §7 requires ETH-07 *"enforced in the Zod schema, not just the UI"*, and it was
enforced in neither — the requirement lived in the paragraph under the code block. It ships as
`z.literal(true)`, `SCHEMA.md` is corrected in the same commit, and the selftest breaks it three
ways: unticked, explicit `false`, and an attempt to route round it by relabelling the segment as
`author` (which parses, and drops the memoir keys — that is the point).

**Six deliberate-failure proofs, each naming its own case and nothing else.** Weakening the ETH-07
literal fired the two ETH-07 cases only; breaking the coupling fired one; loosening
`manuscriptLink` from `z.url()` fired one; widening the memoir stage enum fired one; deleting
`genre` from the mapper fired the three author-carrying cases and no others. Validity is
structural throughout — every specimen reads a **return value**, so there is no absence to
misread and no inert-probe class to rule out.

### Two things `K-13` did not do, and neither is code

1. **The memoir segment is withheld at step 1.** ETH-07's commercial-expectations statement is
   `R-09` (design) and `O-09` (copy), both TODO, and authoring it is non-negotiable #2. An
   acknowledgement checkbox above nothing to acknowledge is a consent record of nothing, so
   `pressSegmentOptions()` returns three options until a statement is supplied. **The branch and
   its gate are built behind an `expectationsStatement` prop** — one prop away, not a rebuild —
   and both directions of the coupling are asserted in the selftest by reading the returned list.
2. **Budget bands diverge from `SCHEMA.md` §6 and this is unresolved, not decided.** §6 lists
   money bands; `check:content`'s price pattern rejects any currency-plus-digits in
   `components/**`, and it is right to — every Gridsmith price on this site is `[SEED] INDICATIVE`,
   so a band would be the first hard money figure on it. The shipped values are the four
   shape-of-engagement bands `/contact` has used since August, so `leads.budget_band` keeps one
   vocabulary. **Nothing was struck**; `SCHEMA.md` §6 now says the divergence is open.

### A budget failure caught by the clean-build rule, and worth carrying

The first clean build put `/press/contact` at a **23.9KB** delta against a 20KB budget. The cause
was one named import: the client component took `pressSegmentOptions` and `PressSegment` from
`pressLead.ts`, **which imports Zod**, so the whole schema library crossed into the browser.
Moving the list into a Zod-free `lib/leads/pressSegments.ts` took the route to **7.7KB**. Nothing
was cut and no budget moved. `pressSegments.ts` carries the rule in its own docstring: nothing in
it may import Zod or anything that does, and `pressLead.ts` imports *from* it, never the reverse.
Both readings are clean builds — `rm -rf .next` each side. `/contact` moved 5.6 → 5.7KB across the
same pair, which is chunk-splitting jitter from two new routes and is reported rather than
explained away.

### Verified live over HTTP, as a hostile `anon` client

A real enquiry was submitted through the built form on a production server (`next start`, port
3010): author segment, finished draft, `https://example.com/draft`, and it **redirected to
`/press/contact/thank-you`**. That redirect happens only on `submitLead` returning `ok`, which
happens only on PostgREST returning 201 — so the row landed, and that is the read-back-free
evidence the table is not empty. Then, holding nothing but the publishable key:

| Probe | Result |
|---|---|
| `SELECT * FROM leads` | 200, `[]` |
| `SELECT * WHERE email = <the probe's own address>` | 200, `[]` |
| `SELECT payload FROM leads` | 200, `[]` |
| `SELECT * FROM v_lead_funnel` | **401**, `permission denied for view` |

**The `[]` on the probe's own email is the reading that matters**, and it is a subject rather than
an inert probe precisely because the submission above proved that row exists. The UPDATE and
DELETE probes also returned `200 []` and **are not counted as proofs** — that is the PostgREST
subselect asymmetry recorded on 4 September: a filtered write cannot find a row while there is no
SELECT policy, whatever the write policy says. They are noted and disregarded, not re-added as
defence in depth.

Three gates gained the new routes and each count moved to prove it reached them: `check:axe`
16 → 18 footered routes, `check:responsive` 48 → 51 combinations, `check:press:type` 3 → 6
route/width combinations and 6 → 12 measured blocks. Axe is clean on both new routes. Step 1 is
what axe sees, and deliberately: steps 2–4 carry `hidden`, which computes `display: none` and
removes them from the accessibility tree — confirmed in the browser rather than assumed.

### Epic K's remaining runway is short: **about 2.2 days, three rows**

`K-16` (0.7d, segment → terms routing, both destinations and now both segments exist), `K-15`
(0.5d, cross-division prompt — the confirmation route it belongs on now exists), and `P-03` (1d,
margin-note component, spec'd at `DESIGN.md` §3 line 105, zero hits in the tree). `K-19` (0.5d,
`consumer_consents`) is buildable as a migration but its consumers are all downstream of the
blocked `K-17`, so it is thin rather than false. Everything else in Epic K is behind `Q-P13`
(`K-04`/`K-05`/`K-06`/`K-07`/`K-14`), `Q-P5`/`P6`/`P7`/`P11` (`K-09`/`K-11`/`K-12`/`K-21`/`K-22`),
the missing sample asset (`K-10`) or the owner's `K-17` decision. Epic P's remaining rows are
each waiting on another row's *subject*: `P-05` on `R-11`, `P-08` on `R-01`, `P-06` and `P-07` on
content that has no schema yet. **Press stalls after roughly a session and a half unless a `Q-P`
is answered or `R-09`/`O-09` land.**

---

## ⇢ 4 September 2026 — `K-08` is built and applied live, and the `check:struck` sweeps are closed

**`K-08` is done.** `supabase/migrations/0003_press_path_results.sql`, applied to the live
database with `npm run migrate`. It was chosen because it is the only Epic K row clear of every
open question: `K-06`/`K-07` are nominally VALID but both consume the Path Finder rules `Q-P13`
blocks, so building them is building around `K-05`; `K-13` and everything downstream of it is a
2d PARTIAL; `K-22` waits on `K-21`. `K-08` depends on `A-07` alone, and its content is the
schema, not the decision logic.

**Two constraints are in it that `SCHEMA.md` §7 does not carry**, both because non-negotiable #9
is audited from this table and nothing else. `press_path_outcome_known` closes `outcome` to the
same six keys `pathOutcome.key` is closed to; `press_path_honesty_agrees` derives the audit
column from the outcome, so `IMPLEMENTATION-PLAN.md` 3.7's *"`is_gridsmith_outcome` written
correctly"* is enforced by the database rather than by application discipline. **Seven
deliberate-failure proofs against the live database, each naming its own constraint**, and their
validity is structural: two correct rows went in through the identical statement and were
accepted, so the rejections are the constraints and not the table refusing everything.

**`app/api/rls-drift/route.ts` covers the new subject** — `press_path_results` in `NO_READ`
(labelled NOT VALIDATED, the honest label, until `K-06` writes a row), in `NO_WRITE` with a
constraint-satisfying row so only RLS can refuse it, and `v_path_finder_honesty` in `NO_REACH`.
**Both new assertions were proven by breaking the live database** — an anon insert policy and a
view grant — and each fired naming its own subject with everything else still green. Restored;
one policy in the whole schema. One incidental fix: `NO_WRITE` ids are now unique per request,
because a probe that once succeeded would collide on the next run and return 409, which the loop
reads as *refused* — a leak would have reported itself closed the day after it opened.
**JS delta zero, two clean builds, `npm run size` byte-identical across 64 routes.**

**`check:struck`'s retrospective sweeps are CLOSED. Do not run another one.** The second sweep
registered exactly one rule, `MASTER-VAT-NUMBER-FIELD`, and it was standing in **nine** lines of
`docs/master/` — `SCHEMA.md` still specified the `vatNumber` field and the statutory-footer
projection two days after the field was removed from the schema, the footer, `/about`, the seed
and `check:launch` because Gridsmith is not VAT registered. An implementer rebuilding the
singleton from the spec would have restored a field whose absence is the compliance decision. A
third pass over the same trail — Hostinger, the analytics removal, the four root layouts —
**found nothing registrable, which is the expected result and the signal to stop.** The registry
is six rules and 19 specimens. `CLAUDE.md` now carries the replacement obligation: **a struck
rule is registered in the same commit that strikes it, and struck in place rather than deleted.**

---

## ⇢ 4 September 2026 — `K-03` is built, `K-05` is blocked, and `check:struck` holds five rules

**`K-03` is done.** `lib/path/recommend.ts` plus `check:path:selftest`, in `verify:static`. Nine
deliberate-failure proofs, one per branch, each naming its own case. The selftest imports the
shipped `.ts` under Node 24 type-stripping so the subject is the file, not a `.mjs` copy of it.
**JS delta zero, measured on two clean builds** — `rm -rf .next` each side, `npm run size`
byte-identical across 64 routes. Nothing imports it yet; `K-05` and `K-06` are the importers.

Three semantics the schema forced and `SCHEMA.md` §3 does not state are recorded in the file:
`in` takes a comma-separated `value`; **a condition over an unanswered question never matches,
`not` included** (plain inequality makes `not` true against `undefined`, so a rule would fire on
question one); `conditions` is an AND. And **no match returns `null`, never a fallback** — a
default outcome would defeat ETH-04 with every gate green.

**`K-05` is BLOCKED on Atik, and the blocker is not an open `Q-P` — there was no `Q-P`.** The
route premise-checks clean and `V-06` is the precedent, but `PROJECT-RULES.md` §6 requires the
static table to render **all six outcomes and their criteria**, and the criteria are stated
nowhere: `APP-FLOW.md` §5 gives one of six, `pathFinderConfig.rules` is empty by `K-01`'s design,
no Epic O row owns them and no `Q-P` did. **`Q-P13` is now open for exactly that.** `K-04`
follows it. Authoring the rules here is inventing the decision logic non-negotiable #9 rests on.

**`check:struck` went from 2 registered rules to 5, and all three new ones fired red before they
were annotated** — the registry was not padded, it was catching live divergences:

| Rule | Struck where | Still standing at | Fired |
|---|---|---|---|
| `INP-ENFORCED-BY-LIGHTHOUSE-CI` | the `A-10b` two-axis split; INP is a field metric and LHCI can never produce one | `design/TECH-SPEC.md:72` | yes, 1 |
| `DIGITAL-90KB-TOTAL-BUDGET` | `Q-M12` — JS is budgeted on the delta above the floor, not the total | `_shared/00-FOUNDATION.md:137` | yes, 1 |
| `PRESS-IMPRINT-CREDENTIAL` | `Q-P8` — author's own ISBN, no Gridsmith imprint, so neither credential exists | `press/IMPLEMENTATION-PLAN.md:55`, `press/PROJECT-TRACKER.md:66` | yes, 2 |

Each is struck **in place**, not deleted, because deleting removes the gate's only subject —
`APP-FLOW.md:168`'s precedent. Selftest is 17 specimens over 5 rules; each new rule has a STANDS
specimen and a NOT-A-SUBJECT specimen so the pattern is shown to discriminate, not just to match.

**One candidate was rejected rather than registered: the three consent categories.** They were
removed on 26 August, but `master/PROJECT-RULES.md` §7 explicitly preserves the arrangement as
*"the arrangement that returns with the analytics"* (`BEFORE-LAUNCH` item 22), and
`IMPLEMENTATION-PLAN.md` 0.8/0.11/6.8 are that plan. A rule over it would fire on the deliberate
record of what returns. **A registry padded with rules that cannot fire honestly is worse than a
short one**, so it is out and this is the note saying why.

---

## ⇢ 4 September 2026 (later) — `check:struck` is the 29th gate, and `K-01`/`K-02` are built

**Two rules went into `CLAUDE.md`.** The **PostgREST transport asymmetry**, stated generally: a
security proof executed over a transport no hostile client has is not a proof, whatever it
returns, and a clean result is the dangerous one. It sits with the verify-live rule as the
concrete reason behind it. And **read before you build** — list `scripts/` and `app/api/` and
establish absence before authoring a gate; a check is not new because the tracker row is open.

**`check:struck`** — a rule struck in one document may not stand in another. Registry scope
only, stated in the script. It **fired red on its first real run**: `press/APP-FLOW.md:168`
still carried the flat 14-day refund promise round 9 removed. The copy is now struck in place
rather than deleted, because deleting it removes the gate's only subject. Full record in
`master/PROJECT-TRACKER.md`.

**`K-10`'s write path is DECIDED and recorded on the row.** `SUPABASE_SERVICE_ROLE_KEY` is in
the Vercel environment; the grant is written by a **server route using service-role**. The
`anon insert` policy and the `security definer` RPC are both rejected and are not to be
reopened. **`K-10` is still BLOCKED** — blocker 1 stands: there is no redacted real assessment
to deliver and authoring one is non-negotiable #2. `K-17` was not touched beyond striking the
stale spec copy.

**`K-01` and `K-02` are built together, and that was deliberate** — an ethics validator whose
limbs have never been made to fail is not a validator. `pathFinderConfig` plus three objects;
`pathOutcome.key` closed and enforced by a rule that is run; `ethicsRule`'s three limbs each
disabled separately, each producing only its own message. JS delta **zero**, measured on a
clean build — nothing in `next build` compiles the schema folder.

---

## ⇢ 4 September 2026 — `P-02` is gated, and `K-10` is blocked on the owner

**`P-02` is done and the row's targets were right.** Press body copy renders 17px / 1.7 / 52ch and
`check:press-type` is the 28th gate, reading the served page at 375/768/1440 — a source check cannot
tell 16.08px from 17px, because `--text-base` is a clamp. Five branches, five deliberate-failure
proofs. **The row's own diagnosis was wrong and the proof is what found it**: it said body *"reaches
17px only at the top of the clamp"*; `body` set no `font-size` at all, so every division rendered
the UA default **16.00px at 1440 as well as at 375**. No token was added and none overridden —
`check:tokens` makes the theme contract closed, so the fix overrides the declaration site.

**`P-01`'s stale `--ink-subtle` 17px floor is deleted from all four documents that carried it.** The
17px *body* rule is a separate, surviving, typographic claim; §2 line 76 of `press/DESIGN.md` already
said so and three documents had not caught up.

### `K-10` is BLOCKED on Atik. Two blockers, and neither is code.

1. **The asset does not exist and may not be authored here.** `TECH-SPEC.md` §9 requires a *redacted
   real document*. There has been no assessment, so there is no report. Writing a plausible one is
   non-negotiable #2. It is `Q-P5`'s sibling — FR-P10 pairs the offer with the sample report.
2. **There is no write path to `sample_grants`, by design.** Zero policies, no service-role key, and
   `submit.ts` says a service-role writer does not exist. The three ways to make one are a new
   credential, an `anon insert` policy that lets any browser mint a bearer token, or a
   `security definer` RPC — which is anon-callable by construction, so **the token would gate
   link-sharing and indexing rather than access**. That is a change to what "signed URL" promises and
   it is the owner's call.

**`K-17` is not a dependency and was not touched** — it is order-confirmation copy for a paid consumer
contract; a free sample request is not an order.

### What the premise check did land: three defects in `app/api/rls-drift/route.ts`

The live RLS posture was verified over HTTP as a hostile `anon` client. **The posture is clean** — 61
leads in the table, `anon` sees 0, updates 0, deletes 0, one policy in the whole schema, the view
401s. **The check that asserts this daily had three defects**, all found by breaking it rather than
reading it, full record in `master/PROJECT-TRACKER.md` under `M-P1-3`:

* **two of its three `NO_READ` probes were inert** — `sample_grants` and `events` are empty, so a
  permissive SELECT policy on each left the route reporting clean; `HTTP 200, 0 rows` was a reading of
  an empty table presented as a reading of RLS;
* **`leads`' validity was accidental** — it worked only because the table happens to hold rows. A
  read-back now makes it structural;
* **nothing asserted that `anon` cannot INSERT into `sample_grants`**, which is exactly `K-10`'s
  security premise.

**And one finding worth carrying because it will be rediscovered:** over PostgREST, an UPDATE or
DELETE probe as `anon` **cannot fire** while there is no SELECT policy — PostgREST resolves a filtered
write through a subselect, so it never finds a row, whatever UPDATE policy exists. Measured both ways:
SQL as role `anon` affects 1 row, the same write over HTTP affects 0. Two such probes were written
here and removed as unreachable code. **Do not re-add them as defence in depth.**

**A `scripts/check-rls-live.mjs` was also written, proven, and then deleted** — it duplicated this
route by about 70%. `M-P1-3` was already FIXED on 21 Aug and `app/api/` was in the tree; the cost of
writing before reading it was most of a session.

---

## ⇢ 3 September 2026 — the probe-validity rule, and `V-07` is blocked

**A probe that produces no red proves nothing until it is shown to be a subject the gate could
have caught.** `V-06`'s first overflow probe was `3000×0px` and `check:responsive` stayed green:
a zero-height box contributes no scrollable overflow, so the run measured nothing and read
exactly like a broken gate. Every other deliberate-failure rule in `CLAUDE.md` governs what
happens *after* the gate reacts and assumes the attempt was valid — this is the assumption
underneath them. The rule is in `CLAUDE.md`'s deliberate-failure block; the class and the audit
are `01-VALIDATION-REPORT.md` §22.

**40 recorded proofs audited, 6 unsound, 3 declared-unproven and counted as neither.** Five of
the six were already fixed as individual findings; **`G8` / `A-GATE-4-3` is the one still open.**
Nothing was fixed this session — the brief was to list them. `npm run audit:proofs`, and
`audit:proofs:selfcheck` proves the count reports zero from the loop rather than from an emptied
register. It is deliberately not in the `verify:*` chain.

**`V-07` (estimator island) is BLOCKED on Atik, and its `Depends` was wrong.** It read `V-03`
alone; it is `V-01, V-03, V-05`. On disk there is no `lib/estimate/` and no `estimatorConfig`
schema, and `V-01`–`V-05` are all TODO. Every number the island emits comes from
`estimatorConfig` through `calculate.ts`, and the two inputs — `Q-DG2` (base bands per project
type) and `Q-DG1` (ten historical projects with real final prices) — are open with the owner.
`PROJECT-RULES.md` #4 and non-negotiable #2 both forbid shipping it on invented rates.
**Epic M satisfies none of it** — it gave the chrome and the primitives, and `V-06` gave the
route, the bands table and both gates on the route by name, which is the degradation target
rather than an input. Building the six steps without the calculator was considered and rejected:
it spends the route's first real JS on a form that ends in nothing. Full reasoning on the
tracker row.

---

## ⇢ 2 September 2026 — the legal set was replaced wholesale, and VAT left the system

**Read this before touching `docs/_legal/` or anything that renders a price.**

**The drafts are a new set at version 2.0.** The owner adopted a revised set on 2 September
2026; it replaces all six instruments and their nine rounds of internal apparatus. `[TK]` and
`[DECISION REQUIRED]` markers are gone from operative prose because the new drafts do not carry
any. `scripts/seed-legal.mjs` was re-transcribed against them and `check:legal:parity` is green
on the served pages: 6 documents, 94 clauses, 339 paragraphs word-for-word, 94 clause tokens all
reachable. `solicitorApproved` is still `false` on all seven — a revised set is not a reviewed
one, and `L-04` is unchanged.

**Gridsmith Ltd is not VAT registered, and the system no longer has a place to say otherwise.**
`vatNumber` is removed from the Sanity schema, the GROQ projection, the footer, `/about`, the
seed and `check:launch`'s live-required tier. `M-P2-3` is **closed, not deferred**: there is no
net/gross field and no tax label, because a non-registered trader's price is the amount charged.
**No price anywhere in the UI may be presented as VAT-exclusive** — `scripts/check-vat-display.mjs`
is the gate, in `verify:served`, and it proves its own predicate against 13 specimens before it
fetches anything.

**The registered office appears once per instrument and once site-wide.** SI 2015/17 reg. 25(2)
is a *website* obligation, satisfied by the statutory block in `components/chrome/Footer.tsx` and
repeated on `/about`. Each instrument carries the address in its party block only — consumer
terms 18, privacy 15, MSA 19 — and every other mention is "Bolton, United Kingdom".

---

## ⇢ START HERE — Epic N is built out. The site is complete as a shell. Read this box, then `_shared/BEFORE-LAUNCH.md`.

**Revised 21 August 2026.** The box below it is the Epic M close and is kept because its
reasoning still governs; this supersedes its "Epic N is next" instruction.

**The site is now a complete working shell.** Homepage (all nine `N-01` blocks), `/work` and 24
case studies, `/about`, `/approach`, `/insights` and nine articles, `/contact` with a working
enquiry pipeline, five legal pages, and real landing pages for all three divisions. 51 routes
measured, all within budget. axe: 60 analyses, zero violations.

**Nothing is live and nothing can go live by accident.** `NEXT_PUBLIC_SANITY_DATASET` has no
default and `check:launch` refuses a production dataset carrying `[SEED]` markers or published
seed documents. `development` holds 121 of them today (re-counted 26 Aug; the 119 previously
recorded here was stale, not wrong at the time).

> **This paragraph was true of CI and false of the deploy until 26 Aug — `M-P1-14`,
> VALIDATION §19.** `check:launch` lived in `verify:served`, which runs in CI and nowhere
> else. Vercel runs `next build`, so **no deployment has ever run the seed gate.** What was
> actually stopping production was `getCompanyDetails()` throwing on the *empty* `production`
> dataset — and a dataset seeded with placeholder content is not empty, so it would have built
> green and published `[SEED] GB123456789` as the VAT number. The gate now runs as npm's
> `prebuild`, `vercel.json` pins `buildCommand` to `npm run build` so the hook cannot be
> bypassed from the dashboard, and `check:node` fails if either goes missing. Read the claim
> above as true of both paths only from that date.

**`_shared/BEFORE-LAUNCH.md` is the only homework list. Do not create a second one.** Everything
on it needs the owner. The full close-out — what was built, what was measured, what was found —
is `master/PROJECT-TRACKER.md` § "Epic N/L/S — the seed-and-shell session".

**The one finding to carry forward, because no amount of reading finds it again:**

> **Sanity treats any document id containing a dot as a private document** — readable with a
> token, invisible to an unauthenticated query. 125 seed documents wrote successfully, the script
> printed a correct census, and every one was invisible to the site, which reads with no token.
> Worse: `check:launch` counts published seed documents *unauthenticated*, so it would have
> reported **0** in a dataset holding 125 — green, specific and wrong, on the one check standing
> between fabricated case studies and a live site.
>
> The gate was correct. The query was correct. **The subject was invisible to the reader the gate
> used.** The remedy is the standing one — *ask the system*: the seed script now reads the whole
> set back with no token and fails unless every document is visible. Both guards proven by
> deliberate failure.

**Three things are still true and are not covered by "all gates green":**

| | |
|---|---|
| **Lighthouse has never run against the finished pages.** It does not run on Windows (VALIDATION §13 E12), so **CI is the arbiter** and the next run tests `N-01`'s open premise — that nine blocks fit under 0.98 | `H-01` |
| **The screen-reader pass still has not happened.** `M-02` stays un-DONE | item 17 in `BEFORE-LAUNCH.md` |
| **`M-P1-4`'s two sweeps are still open** — the zero-input audit and the never-made-to-fail sweep, across all 21 gates | tracker § "END OF EPIC N" |

**What is genuinely left for a developer:** division shell epics (`B-*`, `U-*`, `K-*`/`P-*`),
`G-04`/`G-05` (sitemap, robots, structured data), `L-07` (`consent_events`), `N-02`/`N-10`, and
Epic H. Everything else on the critical path is in `BEFORE-LAUNCH.md` and belongs to Atik.

---

## ⇢ START HERE — Epic M is closed. Epic N is next. Read this box and then the two named files.

**Nothing in Epic M is waiting for work.** Every row is done or blocked on the owner. The full
close-out — what is done, what is blocked and on whom, the backlog, and the defect classes — is
`master/PROJECT-TRACKER.md` § **"Epic M — CLOSED"**. This box is the short version.

**Done:** `M-02`–`M-08`, plus the Epic A rows Epic M unblocked or needed — `A-06` (core
schemas), `A-09` (analytics, built and **not enabled**), `A-11` (consent), `A-12` (seed
enforcement). `G7` closed the epic-identifier collisions. **Gates went 17 → 20.**

**Blocked, all on Atik:**

| | On |
|---|---|
| ~~`A-07`~~ | **Done 19 Aug.** `Q-M18` resolved. Two migrations, `check:rls` is the gate — **and the spec's own §4 reporting view was an RLS bypass**, found by querying as `anon` rather than by reading the SQL. `A-08` is done |
| ~~`A-08`~~ | **Insert leg done 19 Aug, verified live through the runtime.** Inserts as `anon` so RLS is exercised rather than bypassed; `Prefer: return=minimal` is mandatory and asserted by status code. **Notifications done and verified live 19 Aug** — a real send, in `after()` so it never blocks the response (56ms vs 224ms measured). **Two deployment constraints:** the dev sender only delivers to the Resend account owner, so a green run is not deliverability; and the SPF `include:` must be **merged** into `gridsmith.uk`'s existing record — a second record is a `permerror` that breaks the live mail |
| ~~`A-09`'s grant path~~ | **Done 19 Aug.** `Q-M19` resolved. Permanent subject: nothing before a choice, a request to each provider after Accept, **PostHog on an EU host**, nothing after Reject |
| **`M-P1-12`** | **closed a0e7db2a.** `with-server`'s port refusal exited 127 with a libuv assertion over its own message, so a CI log read "command not found" rather than "a gate declined to measure". It never exited 0 — that claim came from reading the status through `| tail`, and the correction is the reusable half. The probe is now a raw TCP connect, which also catches a non-HTTP listener the old `fetch` could not see. `01-VALIDATION-REPORT.md` §17 |
| **`M-P1-3`** | **a post-deploy job.** Nothing checks the *live* RLS posture — `check:rls` reads migrations. Promoted from P2 because `A-07`'s leak existed live while the migration read correctly, so a source check cannot see the class that matters. The shape is proven by hand; it needs a credential CI must not hold |
| **`M-P1-1`** | **a decision.** The 500 serves Next's `__next_error__` shell with no `lang` — WCAG 3.1.1 **Level A**, on every server-side crash. No app-level fix exists. **The Hostinger framing here is superseded** — hosting moved to Vercel on 20 Aug, and the platform-served remedy was then tested on Vercel and did not work either (`M-P1-1`) |
| The Studio's CORS origin | an interactive `npx sanity login` — `SETUP.md` has the command |
| **The screen-reader pass** | a human with NVDA or VoiceOver, over `M-02`, `M-03`, `M-04` and the consent banner. **It never happened** — it was placed at "the `M-06` chrome checkpoint" and `M-06` turned out to be a measurement plus a build. **`M-02` stays un-DONE until it does.** The gates cover focus order, target, paint, landmarks and roles; they do not cover announcement, and no lab check does |

`M-07`'s remaining content is Epic N and `Q-M5`. **Do not start Epic N without reading the
close-out's last section**, which carries the one instruction that applies to every row in it:

> **A number that was projected rather than measured is not evidence, and reserving against it
> costs real budget. Measure first, then decide.**

Three rows this epic carried a figure nobody had measured — `M-08`'s font waste, `M-06`'s
11.7KB projection, `A-11`'s 8KB reservation — and **all three were wrong in the same
direction**, because nobody projects a number for something they expect to be cheap. The same
applies to a row's summary of anything external: **check the source, not the summary.**

**Backlog: 33 open, 1 P1, 1 ceiling.** Hand-counted, and that is a stated limitation —
`check:claims` covers the ledger's identifier space and `M-P*` is outside it, so the figure is
a hand-maintained claim about a hand-maintained list. Enumerated in the close-out.

**Also read `master/PROJECT-TRACKER.md` § Hosting before deploying anything.** Two facts bite
immediately: `check:node` runs on the host via `preinstall`, so **the platform's Node must be set
to 24** or every deploy fails at install; and **`NEXT_PUBLIC_SANITY_DATASET` must be set in the
platform environment** — it has no default, so an unset variable is now a build error rather
than a site serving seed content.

---

## 1. Where Epic A actually stands

| Task | Status | What a fresh session needs to know |
|---|---|---|
| A-01 | DONE | Next 15 pinned, React 19, **Node 24** (raised from 22 mid-audit). Framework floor **100.2KB gz / 102,635 bytes**, re-measured on Node 24 and byte-identical to the Node 22 build — proven by matching content hashes, not by similarity |
| A-10a | DONE | **Seventeen gates** — fourteen through 13 Aug, plus `check:headings` and `check:content` at the run-3 fixes and `check:claims` at `T3`. All swept twice for the "passes without measuring" class — four instances closed in July, three more found on 12 Aug (one inside `check-axe`), nine gates changed. Every fix proven by deliberate failure: `01-VALIDATION-REPORT.md` §14 |
| A-02 | DONE | 39 base tokens, now held in a **hardcoded required list** in `check-tokens.mjs` rather than scraped from the file being checked. It still counts **declarations**, not string occurrences — exactly once, which is what catches the Tailwind namespace collision |
| A-03 | DONE | Four themes, 15-token contract each — **plus the three division accents, which every theme carries from V3, not master alone**. `check:contrast` is a **128-cell permission matrix** (was 101): every foreground token against every surface in every theme |
| A-04 | DONE | Four root layouts, no `app/layout.tsx`. `check:theme` verifies server-set `data-division`, render-blocking CSS, and zero client references |
| A-05 | DONE | 24 primitives, 21 Server / 3 Client. Every primitive that emits a DOM id now generates it with `useId()` — which works in Server Components, so this cost no client JS. `Accordion` also generates its own exclusive-group name and no longer emits an unread `id` |
| A-05a | DONE | `/_kitchen-sink`, 23 primitives × 4 themes (`Media` deliberately excluded — the page now says 23, not 24), **6.2KB gz delta, budgeted at 7KB**, of which **0.5KB** (measured) is the global-error boundary every route carries. The `scope()` workaround is gone: the primitives generate their own ids and `check-axe` still reports zero duplicates |
| A-10b | DONE | Lighthouse split into **two axes** — desktop asserts category scores, mobile asserts Core Web Vitals on 4G. Both green on CI |
| **A-GATE** | **PASSED — 14 Aug 2026** | All six criteria met after seven rounds. Rounds 4–7 were scoped re-verifications, not open audits (`_shared/09`–`12`). **Epic A is closed; do not reopen it to improve anything.** 22 items are logged as P2 with the epic — none an accessibility failure — plus one ceiling (`A-GATE-7-6`) and `G7` deferred. Backlog enumerated in `master/PROJECT-TRACKER.md` |
| A-06 | **DONE 18 Aug** | Core schemas: 8 object types, 6 core document types, `isSeed` group-wide, the canonical-six validator. `check:schemas` is the gate — `next build` never compiles this tree. The note below was true when written and is kept for the reasoning about `REVIEW` |
| A-07 | **TODO**, blocked on `Q-M18` | **No code artefacts exist** — no `sanity/`, no `supabase/`, no `lib/`, nothing in `git ls-files`. What exists is prose in `docs/*/SCHEMA.md`, which is the spec, not the work. `REVIEW` means awaiting review and there was nothing to review. Blocked on `Q-M17` / `Q-M18` (the old `(B4)` reference resolved to nothing) |
| A-08 | TODO | Blocked on `A-07`, so on `Q-M18` |
| A-09 | **BUILT, not enabled** 18 Aug | Taxonomy, AI-referral classifier, consent-gated loader. `Q-M19` blocks the ids; the grant path is proven once by hand and gated by nothing |
| A-11 | **DONE 18 Aug** | Consent state, Consent Mode v2 bridge, banner, footer reopen. **Measured 2.0KB gz against an 8KB reservation** |
| A-12 | **DONE 18 Aug** | Seed enforcement folded into `check:launch` — the spec's query counted almost nothing. Closes `M-P1-2`. `/_kitchen-sink` now inherits the probe exclusion |

**⚠ The paragraph below is the Epic A state and says seventeen. Nineteen checks now run** —
`check:launch` was added at `M-05` and `check:schemas` at `A-06`, and both are in `ci.yml` and
the `verify:*` chain, which `check-node-version` still machine-checks. The list that follows is
otherwise accurate.

**Seventeen checks now run**, and the count is machine-checked — `check-node-version` walks
the `verify:*` chain, diffs it against `ci.yml` and prints the number, so this line cannot
drift from reality again: `check:node`, typecheck, ESLint, `lint:colors`,
**`check:contrast`**, **`check:headings`**, **`check:content`**, build, `lint:secrets`,
`check:tokens`, `check:theme`, `size`, `check:axe`, `check:responsive`,
`check:lhci:desktop`, `check:lhci:mobile`, **`check:claims`**. `npm run verify` runs all of them.

The two added at the run-3 fixes are both cases where a defect class had been fixed
per-instance twice: `check:headings` fails on a `<p>`/`<span>`/`<div>` carrying a class
that sets `--font-display` (WCAG 1.3.1 F2), and `check:content` fails on invented money,
revision codes, standards codes or ISBNs in files that render.

**The one missing from the old list was `check:contrast`** — the gate that exists because
25 of 29 published contrast ratios were wrong and two were hiding real WCAG AA failures.
The most consequential gate in the repository was absent from the list of gates, here and
in `master/PROJECT-TRACKER.md`. `lint:secrets` also moved: it now sweeps the built client
chunks, so it runs in `verify:build`, after the build, not in `verify:static`.

## 2. A-GATE — open, and exactly why

> ### ~~⇢ START HERE~~: A-GATE PASSED. Epic A is closed. **Superseded 18 Aug — the START HERE box is now at the top of this file, and Epic M is closed too.** Kept because the A-GATE record is the reasoning behind the gate discipline everything since has relied on.
>
> **Criteria 1–6 are met as of 14 August 2026.** Seven audit rounds — three open-ended, four
> scoped. The scoped shape is what worked: rounds 4–7 each re-verified a named list rather than
> re-auditing the epic, and each returned in a single session.
>
> **Do not reopen Epic A.** 22 P2 items are logged against it and **none is an accessibility
> failure at any level** — every one is gate discipline or documentation. They are enumerated
> in `master/PROJECT-TRACKER.md` § "The P2 backlog carried out of Epic A".
>
> **`G7` is done — 18 August 2026.** Digital's shell epic became `U` (`U-01`–`U-09`), Press's
> Path Finder epic became `K` (`K-01`–`K-22`), and `app/(press)/press/page.tsx` now cites
> `Epic P`. Master's `S` and `N` were deliberately left alone: `Epic N` is named by
> `00-FOUNDATION.md`, this file and `scripts/check-bundle-size.mjs` as the epic the budget rule
> guards. **Note lines 250–254 below: `N-04`/`N-05`/`N-07`/`N-12` there are master's and are
> correct unchanged.** Full mapping and the free letters: `master/PROJECT-TRACKER.md` § `G7`.
> Uniqueness is unenforced — logged as `M-P2-1`.
>
> **`M-02` is done — 18 August 2026.** The skip link is in `RootShell`, `A11Y-21` is closed
> before the chrome that would have made it a Blocker, and `check-axe` asserts four things
> about it on every themed route × viewport. **`<main id="main">` is deliberately NOT in the
> shell** — `global-not-found` renders inside it and the 404 served two nested `main`
> landmarks; the tracker's `M-02` section has the full reasoning and the deliberate-failure
> table. Route deltas are unchanged at 0.5KB. **Next is `M-03`, the header — and that is the
> commit where `next/link` becomes a shared 3.3KB cost, so read the `M-06` note first.**
>
> **`M-03` and `M-08` are done — 18 August 2026.** `M-04` was blocked on `M-05`/`Q-M17` and
> `Q-M1`; both are now resolved.
>
> **Two spec claims were measured and found false this session, both in the same shape as
> the 29 contrast ratios.** `APP-FLOW` §8's header names four routes that do not exist —
> the header ships the three that resolve, and `check-axe` now resolves every same-origin
> link on every audited route. `FOUNDATION` §4 said `@font-face` declarations were not
> scoped per route group; they always were, `globals.css` has none, and `check:theme` now
> asserts the per-division face list. **`M-08`'s deliverable turned out to be the
> assertion, not the refactor.** Still 17 gates — both went into existing ones.
>
> **`M-05` is done — 18 August 2026, and `Q-M1`/`Q-M17` are resolved.** Sanity project
> `spzu6y31`; `development` and `production` share one schema folder;
> `NEXT_PUBLIC_SANITY_DATASET` defaults to `development` and must not be set to `production`
> before Stage 8. The Studio is standalone on `localhost:3333`, never a Next route — an
> embedded `/studio` would need a `check-bundle-size` exemption. **18 gates now**:
> `check:launch` asserts the statutory record in every dataset and, on `production` only, a
> non-empty VAT number with no `[SEED]` markers. **One operator step is outstanding and needs
> an interactive login** — the Studio CORS origin; `SETUP.md` has the command.
>
> **`M-04` is done — 18 August 2026.** Footer, division switcher and statutory block, all from
> `companyDetails`, deltas unchanged at 0.5KB. **Read the tracker's `M-04` section before
> touching the statutory block:** the VAT line's basis is the Electronic Commerce (EC
> Directive) Regulations 2002 reg. 6(1)(g), **not** the Companies Act, reg. 25(2)(a) requires
> the place of registration which the row's summary omitted, and reg. 6(1)(c) requires a rapid
> contact route — so `contactEmail` is in `check:launch`'s live tier alongside `vatNumber`.
>
> **Three traps recorded there, all still live for the next session:** the division accents
> exist on the master theme only and need a fallback anywhere shared chrome uses them;
> `cache: 'no-store'` on a Sanity read turns every route dynamic and breaks SSG — the seed
> script clears `.next/cache/fetch-cache` instead; and `StickyCta` overlaps the footer below
> 768px, which the statutory block reserves for. `INCOMPLETE_ALLOWED` in `check-axe` is now
> empty.
>
> **`M-06`'s measurement is done and the ⚑ projection was false — 18 August 2026.** `/`
> measures **0.5KB** of its 15KB delta; with the consent banner's 8KB reservation that is
> 8.5KB, **6.5KB spare**. Nothing is breached, no capability leaves the master layer. The
> projection's 3.3KB `next/link` term never happened (plain `<a>`), and its 5.8KB primitive
> term is a `/_kitchen-sink` figure no master route pays. `check-bundle-size` now asserts the
> reservation instead of printing it. **The banner itself is blocked on `A-11`, which is
> TODO.**
>
> **The screen-reader checkpoint is still PENDING.** It was placed at "the `M-06` chrome
> checkpoint"; `M-06` turned out to be a measurement, not chrome, so the pass over `M-02`,
> `M-03` and `M-04` has not happened and was deliberately not folded in early.
>
> ### ⚠ `M-P1-1` — the first live accessibility failure in the programme
>
> **`M-07` established that the 500 does not work without JS.** A server-render crash serves
> `<html id="__next_error__">` with **no `lang`** (WCAG 3.1.1, Level A), no `<h1>`, no
> `<main>`, and a `<title>` leaked from route metadata; `global-error` renders only after
> hydration. The subject is the committed `gridsmith-ssr-throw-probe` route and `check-axe`
> characterises it every run. **No app-level fix exists** — a segment `error.tsx` was tried.
> The remedy is architectural and **is the owner's decision**, not a session's. `APP-FLOW.md`
> §7 has been corrected.
>
> ### `A-11` and `M-06` are done — 18 August 2026
>
> **The consent banner is built and the 8KB reservation is finally measured: 2.0KB gz.**
> `PROJECT-RULES.md` §8 said <=8KB, `TECH-SPEC.md` §4 said ~6KB, and nothing had ever weighed
> either. The reservation is retired; the enforced budget is **3.0KB** and PROJECT-RULES' 8KB
> stands as the ceiling. `/` measures **2.4KB of 15KB — 12.6KB spare**, which returns 5KB to
> Epic N. `A-09` is unblocked.
>
> **`check-axe` now asserts that no cookie is set on any route load with no interaction** —
> PECR, non-negotiable #7. That could not be a source sweep, and it is the one assertion here
> with a 4%-of-turnover penalty behind it.
>
> **Epic M has no unblocked rows left.** What remains is `M-07`'s 404/500 content, which is
> Epic N and CMS work, and `M-P1-1`, which is your decision. **The screen-reader checkpoint is
> still PENDING** — `M-06` turned out to be a measurement plus this build rather than a chrome
> pass, so `M-02`, `M-03`, `M-04` and now the banner all still need one human pass with NVDA
> or VoiceOver. Do not mark `M-02` done until it happens.
>
> **⚠ SUPERSEDED 20 Aug — hosting is Vercel, not Hostinger. The paragraph below is the record
> as written and is kept for why neighbouring rows say what they say; see
> `master/PROJECT-TRACKER.md` § Hosting for what replaced it. On Vercel the project is already
> on Node `24.x` and the dataset is set per target.**
>
> **Hosting is decided — Hostinger Business, Node app via GitHub.** Two constraints and three
> consequences are in `master/PROJECT-TRACKER.md` § Hosting. The one to know now: `check:node`
> runs on the host via `preinstall`, so **Hostinger's Node must be set to 24 or every deploy
> fails at install**, and `NEXT_PUBLIC_SANITY_DATASET` must be set there or the site serves
> seed content — **`M-P1-2`, P1**, because the published value is a `[SEED]` VAT number and
> that is a false VAT statement on a public website. `A-12` owns the remedy; the preferred one
> is removing the default so an unset variable is a build error.
>
> **`A-09` is built and NOT enabled — 18 August 2026.** Taxonomy, AI-referral classifier and a
> consent-gated loader; `check-axe` asserts zero requests to four analytics hosts before
> consent, alongside the cookie assertion — they answer different questions. **`Q-M19` is the
> blocker: no GA4 measurement id, no PostHog key**, so nothing injects even after a grant. The
> grant path itself is **proven once by hand and gated by nothing** — 0 requests before Accept,
> 1 after, with a test id — and needs a permanent subject when the real ids arrive.
>
> **`A-06` is done — 18 August 2026.** The core schema layer: 8 object types, 6 core document
> types, `isSeed` group-wide, and the canonical-six validator. `processStep` is the **master**
> version, per `SCHEMA-CORE.md`'s own instruction. **19 gates now** — `check:schemas` exists
> because `next build` never compiles `sanity/schemas/`, so a broken schema failed for an
> editor and for nothing in CI. It imports the registry and *runs* the validation functions,
> which is how it establishes that `service.pricingModel` is genuinely required — CLAUDE.md
> non-negotiable #3 had been asserted by nothing until now. **`A-12` is unblocked.**
> Two spec gaps filled conservatively and logged: `M-P2-9` (`protectedVideo` is referenced and
> never defined) and `M-P2-10` (`post.author`/`readingTime` untyped).
>
> **`A-12` is done — and `M-P1-2` is closed with it.** `NEXT_PUBLIC_SANITY_DATASET` now has
> **no default**: an unset variable is a build error, not a fallback. **Set it in the Hostinger
> environment before the first deploy** or the deploy fails at build — which is the intended
> behaviour and much better than the alternative it replaces. `TECH-SPEC.md` §6's seed query
> counted almost nothing (`published == true` exists on `service` alone, so five of six
> seedable types were invisible); it now counts by draft-id path and is folded into
> `check:launch`. `/_kitchen-sink` inherits the probe exclusion via a file rename.
>
> **Still 19 gates.** Remaining unblocked work in Epic A: none — `A-07`/`A-08` need `Q-M18`
> and `A-09`'s grant path needs `Q-M19`, both with the owner. Epic M has no unblocked rows.
> **The next epic is N**, and the standing instruction above applies to every row in it.
>
> **`N-01`'s premise was checked and it is half measured, half projected.** The Lighthouse
> `0.98` is real — gated in `lighthouse/routes.cjs`, asserted at `error` severity, passing
> today. **What nobody has measured is whether nine content blocks fit under it**: every green
> run to date is against an `h1`, a header and a footer, and `Q-M16` says the same about the
> LCP headroom. Build `N-01` incrementally against the gate rather than authoring it whole —
> the first block that moves the score is the one worth arguing about.
>
> **`N-03` is done — 19 August 2026.** `groupPage` and `groupSection`, with both of the spec's
> structural claims enforced rather than restated: a closed slug set (singleton-per-slug) and a
> closed layout set (so `sunken-plain` cannot be prettified by a content edit). `check:schemas`
> runs the rules rather than trusting `options.list`, which Sanity does not enforce on write.
> **Three defects found by proving branches, none by reading** — including a check that had
> never been inserted while its summary line claimed it had run. **`N-05` is next.**
>
> **And `N-03` was the honest first row, not `N-01`.** The DoD requires content from the CMS and
> the homepage's blocks have no schema: `groupPage` is `N-03`, `continuityExample` `N-05`, the
> canonical process component `N-06`. `N-01` depends on `M-03` in the table and on three schema
> rows in practice.
>
> **Three visual items landed after A-12 (V1–V3).** The wordmark is locked to `--font-mono` —
> the one element that must be identical in all four themes, and the only face all four route
> groups already load. The three division accents are declared by **every** theme now, not
> master alone, so the footer switcher's rules no longer fall back to `--line-strong` off
> master; `check:tokens` requires all four and the contrast matrix grew 101 → 128 cells. That
> growth immediately caught an overstatement: `--accent-digital`/`--accent-press` were claimed
> as text-capable, which was true only of master's white canvas and was never their use — both
> are `decor` now, and `DESIGN.md` §2 says so.
>
> **And `check-axe` now asserts the STATE of the unmade consent choice, not only that nothing
> is stored.** Those are different questions: a banner could apply `granted` defaults, store
> nothing, request nothing, and pass every prior assertion. The reject affordance was checked
> and is already correct — Accept and Reject are 128×48, same class, same treatment — so
> nothing was changed there.
>
> **And read the tracker's standing instruction before Epic N:** every unmeasured number in
> Epic M was wrong and all three were pessimistic — `M-08`'s font waste did not exist, `M-06`
> projected 11.7KB against an actual 0.5KB, `A-11` reserved 8.0KB against an actual 2.0KB. A
> projected number is not evidence, and reserving against it spends real budget.
>
> **Two things to carry, both load-bearing:**
> - **`A-GATE-7-6` is the ceiling of the verification approach.** `check:claims` asserts that a
>   plausible commit exists, never that a fix occurred — the ledger's status column is written
>   by the person it exists to check. **A `FIXED` row means a claim is well-formed, not true.**
>   `CLAUDE.md` carries the rule; do not let a green ledger stand in for running the thing.
> - **`A-GATE-6-6` is worth closing early.** While `GOVERNED` omits the run reports, a finding
>   written only in a report creates no obligation to row it — which is why `A-GATE-7-2` exists.
>
> **`M-06` is the next budget checkpoint** and it is tight: consent 8KB + primitives 5.8KB +
> error boundary 0.5KB = **14.2KB of Master's 15KB**, 0.8KB of headroom before the header and
> footer exist. Both halves are now measured and asserted by `check-bundle-size`, and the
> **baseline spread** assertion added at `T2` is what will see a header imported by three of the
> four route groups — the shape `min` alone was blind to. If the delta exceeds 15KB, stop and
> raise it rather than proceeding into Epic N.

Criteria 1–4 are **met and independently re-verified**. Criteria 5 and 6 have been
**audited to completion once** — round 3 — and neither has yet *returned* clean.

There have been **three rounds** on 12 August, and none closed either criterion.

**Round one — the audit** (`06-EPIC-A-AUDIT.md`). Both agents got through on a second
attempt with tightened prompts and both **returned findings**: 1 blocker + 5 major + 3
minor, and 2 Level A blockers + 1 AA failure. All fixed — §9.

**Round two — after those fixes.** `rules-compliance` ran again against the fixed tree and
returned **4 blockers, 4 majors and 7 minors, none of them re-reports**. All fixed — §10.
`accessibility-audit` died on the session limit and returned nothing.

**Round three — `accessibility-audit` alone, after CI went green.** Died on the session
limit again, having reached the `global-error` render path. Nothing returned. See the
agent-budget note below: the problem was the session, not the shape.

**Round four — 13 August, and the first that returned.** Two narrow runs instead of one
wide one: the 24 primitives, then the five served routes and render paths, each launched
alone as the first action with the other explicitly out of scope. **Both completed.** The
split is what worked — four attempts had died on scope, and neither narrow run came close
to the limit. Findings and the fixes are `07-A11Y-AUDIT.md`; the backlog is
`master/PROJECT-TRACKER.md` § Epic A11Y.

**Criterion 6 is still open.** Round four returned findings, not zero. Six groups were
fixed the same day, four Majors were deliberately left (`A11Y-1`–`A11Y-4`, P1), and the
session that fixed them is the worst available reviewer of them — the same reasoning that
put the criterion there.

**Round three — 13 August, the first to complete both criteria.** Three passes:
`accessibility-audit` over the primitives and `/_kitchen-sink`, `accessibility-audit` over
the routes and render paths, and `rules-compliance`. All three returned.
`rules-compliance` died once on an account session limit and completed on a retry. Full
report: `_shared/08-A-GATE-RUN-3.md`.

It confirmed **all six items rounds 1–2 recorded as fixed are genuinely fixed** — including
`A11Y-1`–`A11Y-4`, independently re-verified — and returned **nine new findings**. Six of
the nine were recurrences of classes this repository had already named, fixed elsewhere and
written a rule about. Two of the three passes found things the other missed, which is the
first direct evidence for the fresh-context wording.

**All nine are fixed, in `G1`–`G8`.** What that produced, beyond the fixes:

| Group | Fix | What it left behind |
|---|---|---|
| `G1`/`G1b` | `--ink-subtle` re-derived in all four themes; no theme needs a size rule | `check:contrast` size pass; **`A11Y-22` closed** |
| `G2` | `Stepper` and `Specimen` render real headings | **`check:headings`** (gate 15) |
| `G3` | lift selector covers every interactive descendant | permanent linked-card specimen; **`A11Y-26` closed** |
| `G4` | `incomplete` no longer discarded; token probe reads every token | rule+route+target allowlist with written reasons |
| `G5`/`G5b` | `global-error` has a gate at last | committed probe route, excluded from production and proven absent by building |
| `G6` | three invented figures zeroed | **`check:content`** (gate 16) |
| `G8` | — | the 6.2KB delta decomposed and asserted; `M-06`'s headroom is now measured |

**Two gates written during those fixes shipped broken and were caught by their own
deliberate-failure proofs** (`A11Y-29`, `A11Y-32`). That is why the proof rule is now
recorded in `CLAUDE.md` as load-bearing rather than ceremonial.

Three things from round four that a fresh session must not rediscover, the first of which
changes how much you should trust everything else in this file:

- **CI had never fired on this branch except through an open PR, and nobody had checked.**
  `ci.yml` triggered on `push: branches: [main]` and `pull_request:`. Nothing in Epic A was
  ever pushed to `main`, so every run the programme has had — including the numbered runs
  quoted in §6 and Q-M16 — arrived via `pull_request` and existed only because PR #1
  happened to be open. Close it, or branch without one, and `git push` runs nothing: no
  failure, no skip, an empty Actions tab, and `npm run verify` still green locally.
  **`CLAUDE.md`'s "CI is the arbiter" was load-bearing for the whole of Epic A and was
  resting on that assumption.** Fixed 13 Aug with `push: branches: ['**']`; recorded as
  `A11Y-27`. The five gate defects before it were checks that measured nothing and reported
  a pass — this one never ran and reported nothing at all, which is why it survived six
  rounds of people reading gate output. **"Proven by deliberate failure" had only ever been
  applied to what a gate asserts, never to whether it is reached.**

- **`/_not-found` had been rendering with no theme at all**, and `check-axe` was green on
  it throughout, because the assertion was that `body[data-division]` existed rather than
  that it computed to anything. The attribute was written correctly server-side; the
  stylesheet giving it meaning was never linked. Fourth defect of that shape, and the
  first inside a gate written to catch the third. Both fixed — the gate now reads four
  tokens back off `body` and compares the background to `--canvas` through a probe.
- **`global-error` is verified on the client-effect path, and that path only.** A throw
  after hydration reaches it, and `app/(marketing)/gridsmith-error-probe/page.probe.tsx`
  is now a permanent committed subject that `check-axe` visits every run — title, `h1` and
  `lang` asserted, so the probe cannot go hollow. The probe must not live in a
  `_`-prefixed folder — Next drops those from routing and you will be measuring the 404.

  **The SSR path is unknown and must not be asserted either way.** This bullet, and
  `global-error.tsx`'s own docstring, used to state as fact that a throw during SSR never
  reaches the boundary and that production serves Next's `__next_error__` shell with no
  `lang` and no `<title>` — a live Level A failure on every server-side crash, if true.
  **Struck at the run-3 fixes.** It cannot be induced without editing a file, no gate
  covers it, and an unverifiable claim does not get asserted in either direction
  (CLAUDE.md). Do not read the probe's success as covering it: the probe exercises one of
  the two ways this boundary can be reached. Establishing the other needs a route that
  throws during render, `next build && next start`, and a read of the response.

The criteria are worded "zero findings" / "zero violations" with no partial credit. Round
two is the important lesson: **the tree that had just been audited and fixed still had four
blockers in it**, including a Level A accessibility hole that was the untouched half of a
defect class the fix session had explicitly closed. This is why the criteria specify a
fresh context — the model that wrote the code is the worst reviewer of it, and the model
that fixed the findings is the worst reviewer of the fixes. Two rounds of that have now
produced findings both times.

**The next actionable task in the programme is `G7`, then Epic M.** A-GATE is passed and
nothing in Epic A is blocking. The agent guidance below is kept because it is what made rounds
4–7 return: launch one agent alone as the **first action** of a fresh session, scoped to a named
list, never open-ended. Five runs died on the session limit before that shape was adopted, and
none has since. `design-conformance`,
`spec-compliance` and `content-integrity` are not A-GATE criteria and have still never run;
they are worth running eventually, one per session, and they are not blocking.

### ⚠ Agent budget — read this BEFORE doing anything else in the session

**Criterion 6 has now failed to complete three times.** Not because the agent is wrong, and
not because the brief is wrong — the third attempt had the tightest brief yet and got
furthest. It ran out of session.

| Attempt | Shape | Outcome |
|---|---|---|
| 1 | Five agents at once, unbriefed | All five died before returning anything |
| 2 | Five at once again, then the two gate-closers relaunched alone with tightened briefs | Both completed and returned findings |
| 3 | Two as a pair (`rules-compliance` + `accessibility-audit`) | `rules-compliance` completed at ~210k tokens / 58 tool calls. `accessibility-audit` died mid-run |
| 4 | **One agent alone**, best brief so far, launched at the **end** of a working session | Died. Got as far as the `global-error` render path — most of the audit done, nothing returned |

**The binding constraint is not the number of agents. It is how much session is left when
the agent starts.** Attempt 4 was launched after that session had already committed 46
files, fixed a red CI run, pushed twice, polled CI to completion and downloaded two log
archives. One agent was the right shape and it still had nothing to run on.

**So the rule is: launch the A-GATE agent as the FIRST action of a fresh session.** Before
reading files, before running gates, before any commit. Then act on its report in that same
session if there is room, or in the next one. `accessibility-audit` on this repository needs
most of a session to itself — it drives a real browser, builds, and probes render paths that
axe cannot reach.

Everything an agent needs in order to be worth launching is already written down: §9 and
§10 list what is fixed, and the do-not-report list is what has got every completed run
through. An unbriefed agent has never survived.

### Where criteria 5 and 6 ended up

| Criterion | Agent | Status |
|---|---|---|
| **5** | `rules-compliance` | **MET.** Seven rounds. Rounds 1–3 returned findings; round 2 is closed as unreconstructable and superseded (§10). Rounds 4–7 were scoped re-verifications and each returned in one session. Round 7 confirmed `U1`–`U3` present, subject-backed and proven red on their stated repro |
| **6** | `accessibility-audit` | **MET.** Completed in round 3 as two narrow runs, and again in rounds 4 and 5. Round 4 re-confirmed `A11Y-1`–`A11Y-4` and found **no AA failure in any primitive**; round 5 returned **zero** on `R3`/`R4`/`R5`. **No open accessibility finding at any level** |

**What actually closed them was the shape of the run, not the content of the brief.** A single
wide audit failed four times on the session limit. Two narrow runs, each launched alone as the
first action, completed every time from round 3 onward — and rounds 4–7 narrowed further still,
to a named list of findings rather than a scope.

**Nothing else in Epic A is open.** A-06 and A-07 are blocked on Atik (`Q-M17`, `Q-M18`), and
A-08 to A-12 are Stage-2 work that Epic M and later stages pick up. **Do not reopen Epic A to
improve anything** — the 22 P2 items are logged deliberately and none is an accessibility
failure.

### If an agent dies mid-run, check the working tree

`accessibility-audit` creates probe routes to observe render paths it cannot otherwise
reach — attempt 4 left `app/(marketing)/%5Fa11y-boom/page.tsx`, a route that throws, in
order to see what `global-error` renders. A probe left behind is a deliberately broken route
committed by accident. `git status` after any agent run.

## 3. Open questions, and who they wait on

| ID | Waiting on | Blocks |
|---|---|---|
| `Q-M1` | **Atik** — company number. Registered office confirmed; the number is statutory and must never be guessed | `M-05`, `L-05` |
| `Q-M2` | **Atik + solicitor** — `_legal/` drafts sent and reviewed. Longest lead time in the programme | `L-04` |
| `Q-M3` | **Atik** — ICO registration | `L-06` |
| `Q-M4` | **Atik + broker** — PI insurance covering engineering drawings | `L-08` |
| `Q-M5` | **Atik** — business hours and phone number | `N-12` |
| `Q-M6` | **Atik** — a real continuity example, verifiable against project records. Must not be invented | `N-05` |
| `Q-M7` | **Atik** — the honest-limits content ("when to use a specialist instead") | `N-04` |
| `Q-M8` | **Atik** — the existing Press site's URL inventory, before Stage 8. **Do not crawl or plan yet** | `G-08` |
| `Q-M9` | **Atik** — public-facing team members | `N-07` |
| `Q-M15` | **Atik** — a real favicon / brand mark. Holds Lighthouse best-practices at 0.96 | best-practices 1.0 |
| `Q-M17` | **Atik** — a Sanity organisation and project | `A-06` |
| `Q-M18` | **Atik** — a Supabase project | `A-07` |
| `Q-M16` | Partly resolved | LCP budgets are measured and closed; two carries remain — see §6 |

Resolved and **not to be reopened**: `Q-M10` (typefaces), `Q-M12` (delta budgeting),
`Q-M13` (`--ink-subtle`), `Q-M14` (shadow tokens). `Q-M11` is **partly reopened** — the
build is greenfield but the existing Press site retires at launch, so its URLs need mapping
(`G-08`).

## 4. In flight

- **PR #1 is open**, `feat/a-01-a-10a-scaffold-ci` → `main`, **21+ commits ahead**.
- CI runs #1 and #2 failed (Chrome sandbox, fixed). **#3 onward are green.** Any run still
  executing at handover is on a docs-only commit.
- **`main` now has a `.gitignore`** — it had none, so checking it out offered `node_modules`
  for commit. Fixed directly on `main`; PR #1 will merge cleanly since the content matches.

**Nothing is half-decided.** The launch model, build order, runtime and budgets are all
settled and recorded. The only open work is A-GATE.

## 5. Gotchas a fresh session will trip on

**Lighthouse does not run on Windows.** Both axes exit 0 with a loud `SKIPPED` on local
Windows — `chrome-launcher`'s `destroyTmp` races Node 24's `fs.rmSync`, deterministic. The
skip is guarded: reaching it with `CI` truthy, or off Windows, is a hard failure. **A local
`npm run verify` pass is not evidence for those two gates — CI is.** The summary says so
between rules; do not scroll past it.

**Node is managed by nvm-windows.** `C:\nvm4w\nodejs` is a symlink, not an install. `nvm use`
changes what every shell resolves. Global npm packages were per-version, which is how
switching to 24 removed `claude` from PATH; it has been reinstalled into the shared
`Roaming\npm` prefix so it survives future switches.

**Node 20 is not fully removed.** `node.exe` (72MB) remains at
`C:\Users\atikm\AppData\Local\nvm\v20.20.2`, held open by two processes from 5 August
belonging to a **different project** — `npm run dev` and a Vite dev server for
`C:\Users\atikm\Projects\Task Tracker`. They were deliberately not killed. Finish with
`Remove-Item ... -Recurse -Force` once they are stopped. `check:node` makes a silent
fallback impossible in the meantime.

**`%5F` is not a typo.** `/_kitchen-sink` lives at `app/(marketing)/%5Fkitchen-sink/`,
because Next treats a literal `_` prefix as a private folder and produces no route. The HTML
references its chunks as `%255F…` (double-encoded); `check-bundle-size` decodes once. Case
is preserved through `decodeURIComponent`, so it resolves on Linux — verified on CI. **Do
not "fix" the directory name.**

**Deliberate-failure proofs: copy the file aside, then copy it back.** Never
`git checkout --` to undo a temporary edit. It restores from HEAD and silently discards
uncommitted work — it cost three files' worth of edits in the 11 August session. The
12 August session ran ten deliberate-failure proofs this way with nothing lost; check
`git status` after each, because a proof you forgot to revert is a defect you just
committed.

**A local `npm run typecheck` is not equivalent to CI, and one defect only ever appeared
there.** `declare module '*.css' {}` typechecked clean on Windows and produced 100+ TS2339
errors on `ubuntu-latest`. Same TypeScript (6.0.3, same lockfile), same tsconfig. `*.css`
and `*.module.css` both have a zero-length prefix before the `*`, so TypeScript's
longest-prefix tie-break cannot separate them and the winner follows filesystem iteration
order — which differs between the two platforms. **Deleting `.next` and
`tsconfig.tsbuildinfo` first does not reproduce it.** There is no local test for this class;
CI is the only instrument. `css.d.ts` now gives the module a real type so it no longer
matters which pattern wins.

**`npm run verify` refuses to run if anything is already on port 3000.** That is
deliberate — it used to test whatever answered, including another project’s dev server, and
worse, a stale `next start` of this app serving the previous build. Use
`VERIFY_PORT=3100 npm run verify` rather than killing a process that may not be yours.

**Recursive deletes outside the repo require asking first** — CLAUDE.md "How to work". A
top-level listing is not an inspection; `node_modules` shows as one entry and held a 258MB
global CLI install.

## 6. What Epic M starts from — all measured on CI, Node 24

| Quantity | Value | Where |
|---|---|---|
| Framework floor | **100.2KB gz** (102,635 bytes) | `check-bundle-size` |
| `/_kitchen-sink` delta | **6.2KB gz**, budgeted 7KB | `check-bundle-size` |
| — of which primitives | **5.8KB gz** | the remaining **0.5KB** is the global-error boundary, carried by every route — both halves are now measured and asserted by `check-bundle-size`, not derived by hand |
| Master JS delta budget | **15KB**, of which the consent banner reserves 8KB | `PROJECT-RULES` §8 |
| Mobile LCP floor | **1519–1530ms** across five CI runs | mobile axis |
| Digital LCP headroom | **~78ms** against a 1600ms ceiling | run #7 |
| Mobile TBT | **~90ms median, ±13ms band** (81–107 observed) | five runs |
| Digital TBT headroom | **~55ms** against 150ms | as above |
| CLS | **0.000** everywhere | both axes |

**Two carries into Stage 3, both `Q-M16`:**

1. **The LCP floor is measured on an empty page** — one `h1`, 425 B of route JS. Every
   figure above is what four essentially blank pages cost. Hero imagery, work grids and book
   covers all produce a larger and later LCP element. Re-measure at the first real route,
   **not at `H-01`** — by then the remedy is cutting a page feature to pay for a floor.
2. **TBT varies with the runner, not the code.** Compare `benchmarkIndex` — now printed
   beside every metric table — before reading a TBT movement as a regression.

**M-06 is the next budget checkpoint, and it is tighter than it was.** Consent banner 8KB
+ primitives 5.8KB + the global-error boundary **0.5KB** = **14.2KB of Master's 15KB**, before
header and footer exist — 0.8KB of headroom, not the 1.3KB this line said before the error
boundary landed. If the delta exceeds 15KB there, stop and
raise it rather than proceeding into Epic N.

## 7. What NOT to redo

> **This section is §7.** It is the list of things that look wrong and are not, and it is
> what a fresh session is told to read before filing a defect against them. It has been
> cited as §8 — §8 is "Decisions settled this session", which is a different list. No live
> document mis-cites it now; if you are about to, it is §7.

`01-VALIDATION-REPORT.md` §11–§13 records **six defect classes and thirteen environment
findings (E1–E13), all closed**. A fresh session must not rediscover them, and must not
"improve" the gates back into the shapes they were fixed out of.

The six classes, in one line each:

1. **Gate ≠ spec** — the gate did not do what its specification said. Four instances.
2. **Number ≠ reality** — the gate was correct and the *model* producing the number was
   wrong. Lantern's `simulate` throttling mis-attributed `font-display: swap`.
3. **Gate cannot run where it matters** — correct, spec-matching, and structurally
   unrunnable on CI. Eleven of eleven green locally; two could never execute on Linux.
4. **A fix that does not cover its own originating case** — `engine-strict` was adopted to
   close E1 and would not have caught the E1 scenario.
5. **Destructive operation inspecting only its top level** — the destructive analogue of a
   gate that passes without measuring.
6. **§12 applied to the analyst** — three ascending points reported as a trend; the fourth
   and fifth returned to baseline.

Specific things that look wrong and are not:

- `check-tokens` counting declarations rather than occurrences — deliberate, see E-M1.
- The 101-cell contrast matrix instead of a token list — deliberate; a list is what let
  `--accent` reach 4.46:1 unchecked.
- `check-axe` asserting duplicate ids itself — deliberate; axe-core keeps `duplicate-id`
  behind its `deprecated` tag and no WCAG tag set reaches it.
- The mobile Lighthouse axis **not** asserting the performance category — deliberate; it is
  a weighted curve that moves between versions. It measures 0.99 on CI, so asserting it
  would make the build red for a number no user experiences.
- `lighthouserc.mobile.cjs` using `devtools` rather than `simulate` throttling —
  load-bearing, see class 2.
- Stage 5 struck through with a gap in the numbering — deliberate; renumbering would break
  every `Stage 8` and `Stage 4` cross-reference.

## 8. Decisions settled this session

- **Runtime: Node 24 LTS**, pinned by major in three places that move together.
- **Single launch after Stage 8.** Nothing ships partially; the existing Press site trades
  until launch and comes down at it.
- **Build order by risk: Master → Digital → Press → Design.** Digital second to discover at
  week 9 rather than week 18 whether 1600ms is reachable; Press third so the section with
  real customers is not in the tail.
- **`O-01` at Stage 4 by calendar** — week 8, whichever division is being built.
- **Mobile LCP budgets are measured**, no longer provisional.

## 9. What changed on 12 August 2026, and what it means for you

The audit in `06-EPIC-A-AUDIT.md` returned 3 blockers, 3 gate holes, 5 majors, several
minors and 7 documentation contradictions. **All are fixed.** Full detail and every
deliberate-failure proof: `01-VALIDATION-REPORT.md` §14. What a fresh session needs:

### Three primitive fixes, each made as a class

- **`Field`, `Select`, `RadioGroup`, `Accordion` generate their DOM ids with `useId()`.**
  They derived `id` from the form `name`, so two forms on one page both collecting `email`
  produced duplicate ids and bound `<label for>` to the wrong control. This was the *root
  cause* of criterion 1's original blocker — fixed at the call site in July, left live in
  the primitives, and it was the fourth Epic A blocker that was a repeat of an
  already-fixed defect. **`useId()` works in Server Components** (React 19's Flight
  dispatcher implements it), so none of these became Client Components and no client JS
  was added.
- **`StickyCta` has one mechanism, CSS `visibility`.** It drove `aria-hidden` and `inert`
  as React props while `position`/`transform`/`display` were CSS, and the two desynced —
  eight painted links that were simultaneously inert and out of the accessibility tree.
  `visibility: hidden` does both jobs in one declaration, so an override that repositions
  the bar sets them together or not at all.
- **`Stepper`'s completed state has a non-colour cue.** `.stepDone` differed by
  `border-color` and `color` — two colour changes, WCAG 1.4.1 — while two comments claimed
  otherwise. **The code was changed to match the claim**, not the reverse: a border-width
  step, plus "completed" in the sr-only prefix, because the marker is `aria-hidden`.

### The gate suite

`check-axe` runs **375px and 1280px × initial and scrolled** — 24 analyses, not 5. It used
to audit one width in one state, and the state it chose was after scrolling to the foot, so
**no route was ever audited as a visitor first meets it**. `/_not-found` is in the route
lists of `check-axe`, `check-responsive` and `check-bundle-size`; it was in exactly one
place in the repository before, an exemption. Nine gates changed in total.

**Two things to hold on to:**

1. **`a gate you have not run is not measuring zero, it is measuring nothing`.** Adding the
   404 to the gates immediately produced a **Level A** failure that had been shipping since
   A-04 — Next's default 404 has no `lang` attribute. Every gate was green throughout.
2. **Fixing that then cost 4.3KB gz on every route**, because the 404 imported the `Link`
   primitive (which wraps `next/link`, a Client Component) and Next puts the root
   not-found boundary in every route's script list. **Every per-route budget still passed** —
   4.3KB is inside all of them. Only the new symmetric floor check in `check-bundle-size`
   caught it. If that check fires, it means every route is carrying something no route
   declared; it deliberately does not guess which of the two possible causes it is.

### Traps this session hit, so you do not

- **`app/global-not-found.tsx` renders its own `<html>`/`<body>`, and that is correct.** With four
  root layouts and no `app/layout.tsx`, an unmatched URL falls outside all four. A raw grep
  of the prerendered file finds two `<html>` tags; the *parsed* DOM has one, because the
  HTML parser merges the attributes of a second `<html>` start tag onto the open element.
  Verified in a real browser. **Two other arrangements were built and measured first** — a
  catch-all route with `(marketing)/not-found.tsx`, and the same boundary a segment
  lower — and both rendered inside `<html id="__next_error__">` with no `lang` and no
  theme, because `notFound()` does not re-enter a root layout. Both also made the 404
  dynamic, so `check-bundle-size` could no longer see it. The file records this. Do not
  re-try them.
- **`check-theme-flash` reads the raw file, so it cannot assert the 404's theme.** That
  assertion lives in `check-axe`'s DOM-integrity pass instead, which reads the parsed DOM:
  every route must carry `data-division` on `<body>`. This is why the 404 is absent from
  `check-theme-flash`'s list and it is not an oversight.
- **`/_kitchen-sink` still scopes `RadioGroup`'s `name`, and only that.** A radio `name` is
  both the Server Action's form contract and the thing that groups the options, so a
  primitive cannot generate it. Four frames sharing `name="division"` genuinely *are* one
  radio group. Everything else the old `scope()` helper touched is gone.
- **ESLint's `no-html-link-for-pages` is switched off for `app/global-not-found.tsx` alone**, in
  `eslint.config.mjs`, with the measurement in the comment. It is not a bypass of a CI
  gate; it is the rule being measurably wrong for one file, and CLAUDE.md non-negotiable #8
  says the feature changes rather than the budget.
- **`lint:secrets` moved from `verify:static` to `verify:build`.** It now greps the built
  client chunks, which is where a leak actually is. It hard-fails if there is no build.

## 10. Round two — what `rules-compliance` found against the fixed tree

> **⚠ This section's "15 findings, all fixed" is UNRECONSTRUCTABLE, and is now CLOSED as
> superseded. Do not attempt to reconstruct it.**
>
> The count is recorded here and in the tracker as **4 blockers, 4 majors, 7 minors**. What
> is actually written down is roughly **eleven** items: three blockers, two gate fixes and
> six corrected numbers, all in the prose below. **The four majors and seven minors are
> itemized nowhere in the repository** — there is no round-two audit file the way
> `06-EPIC-A-AUDIT.md` and `07-A11Y-AUDIT.md` exist for the other rounds. A fresh reader
> asked to "confirm each from the repo" cannot, because the list does not exist. Run 3
> reported this as a finding in its own right: a claim of "all fixed" against a set that
> cannot be enumerated is unfalsifiable by construction, which is the documentary form of a
> gate that measures nothing.
>
> **Why it is nevertheless safe to close.** Round 3 audited **the same scope from a fresh
> context** — the whole of Epic A, in three passes (`accessibility-audit` over the
> primitives and over the routes, plus `rules-compliance`) — and it re-found things that
> were genuinely still live, including two instances of a class round two had itself fixed
> in the same file. An audit that re-finds live defects would have re-found any of the
> unlisted eleven that still mattered. What round 3 returned is the current defect list;
> what round 2 returned is superseded by it.
>
> The prose below is kept because the parts that *are* written down changed how the work is
> done. It is a record, not a checklist — nothing here is outstanding.

15 findings, none of them re-reports of §9. All fixed. The ones that change how you work:

### ✔ Verified by CI — run #16, commit `ecf37b02`, all 18 steps green

Both Lighthouse axes ran against these changes, including the `http-status-code`
assertion added to each. Medians of 3, `ubuntu-latest`, Node 24:

| Axis | Digital | All four routes |
|---|---|---|
| Desktop | **perf 1.00 · a11y 1.00** · bp 0.96 · seo 0.90 | LCP 436–513ms, CLS 0.000, TBT 0ms |
| Mobile 4G | LCP **1520ms** against a 1600ms ceiling — **80ms headroom** | LCP 1518–1522ms, CLS 0.000, TBT 85–89ms |

Both in the bands §6 already records (LCP 1519–1530ms, TBT ~90ms ±13). `benchmarkIndex`
2179 mobile / 2202 desktop, inside the 1259–2216 range across 12 runs — so nothing here is
a runner artefact.

**Run #14 was red first, on TypeScript**, and the cause is worth keeping: see the note in
§5 about local typecheck not being equivalent to CI. One defect in this work was only ever
observable on Linux.

### The blockers

- **`app/global-error.tsx` did not exist, and that was the same Level A hole as the 404.**
  The `/_not-found` fix in §9 treated "the 404 page has no `lang`" as the defect. It was
  not. The defect was *any render path outside the four route groups gets Next's built-in
  document*, and `not-found` was one instance of it. `global-error` was the other, still
  open, still rendering `<html id="__next_error__">` with no `lang`, no `<main>`, no theme.
  **A fix session closed a class it had itself named, on one instance.** Proven by
  deliberate failure: a temporary throwing route returned 500 with one
  `<html lang="en-GB">`, `data-division="master"`, one `<main>` and an `<h1>`.
  It costs **0.5KB gz on every route** (measured; this line said 0.4KB) — unavoidable, since Next puts the boundary in every
  route's client bundle. Raw elements, no primitives, no `next/font`, for exactly the reason
  the 404 taught: one convenience import there cost 4.3KB everywhere.
- **`/_kitchen-sink` rendered fabricated prices** — `£1,250` and `£980`, with `REV-02` and
  `REV-11`. Non-negotiable #2 bans invented prices outright. The same file already applied
  that rule correctly to imagery and to the error reference (`KS-0000`) and then broke it
  two specimens away. Now zeroed digits.
- **A `Field` hint hardcoded a paraphrase of the response commitment.**
  `master/PROJECT-RULES.md` §1.8: that string renders from
  `companyDetails.responseCommitment`, "never hardcoded, never paraphrased". The specimen
  now carries a hint that is not a promise at all.

### The gate that could go hollow, and the one that could drift

- **`check-responsive`'s scroll-reserve assertion now fails at zero measurements.** Its only
  subject is the `StickyCta` on `/_kitchen-sink` — and **A-12 removes that route from the
  production build**. Between A-12 and M-02 it would have had no subject and still printed
  a green line. If you are at A-12 and this fails: put a `StickyCta` on a real route, or
  delete the assertion deliberately. Do not let it pass empty.
- **`npm run verify` and the `ci.yml` step list were two hand-kept lists of the same
  fourteen gates, with nothing asserting they agreed.** Add a gate to one and forget the
  other and CI goes green having never run it. `check-node-version.mjs` now walks the
  `verify:*` chain and compares it to the workflow — it independently reports "14 gates",
  which is the first machine-checked confirmation of that count.

### Numbers corrected to what the gates measure

Six published figures disagreed with a gate. `--accent-design` is **2.16:1**, not 2.0:1
(five places, including a binding non-negotiable in `master/PROJECT-RULES.md` §1.2 and the
`design-conformance` agent's own brief). `--accent`'s range is **4.58–9.25:1**, not
`4.46–19.17:1` — a row that was internally contradictory, since 4.46 fails the 4.5 floor
the same table asserts. The focus treatment is **15.42:1** at worst, not "17.9:1 minimum".
The primitive delta is **6.2KB** as the gate prints it, of which **0.5KB** is the new error
boundary.

**M-06 got tighter.** Consent banner 8KB + primitives 5.8KB + error boundary **0.5KB** =
**14.2KB of Master's 15KB**. 0.8KB of headroom before the header and footer exist, not the
1.3KB the arithmetic in §6 assumed.
