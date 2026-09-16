# AI handoff

## Execution

- **Task ID:** `GS-P04`
- **Task:** Approved service content and development content foundation
- **Agent/model:** Claude Code (Opus 5)
- **Status:** COMPLETE IN REPOSITORY AND IN THE DEVELOPMENT DATASET; production content,
  migration and deployment untouched
- **Date:** 16 September 2026

## Repository state

- **Starting commit:** `27b436f709c6e59b2250e1e0b9574e5f315d0948`
- **Ending commit:** the GS-P04 commit containing this handoff; use `git rev-parse HEAD`
- **Branch:** `main`, tracking `origin/main`
- **Starting working tree:** clean, in sync with `origin/main`
- **GS-P03 CI baseline:** run `34819472887` **completed `success`** — all 35 steps, on
  `27b436f7`. Verified before any work began; the baseline is sound and nothing was carried
  forward from a failed run.
- **Pushed:** YES when the GS-P04 commit is present on `origin/main`

## Hard scope boundaries preserved

- **No Supabase call of any kind.** The GS-P01 production migration was not applied, no RLS was
  altered, no production row was read or written.
- **Sanity production dataset: not read, not written, not contacted.** Every write was to
  `development`, whose identity was positively established first.
- No Vercel action, no deployment, no environment change. Hostinger, DNS and `gridsmith.uk`
  untouched.
- No legal clause drafted or amended. No company fact, price, client name, credential, turnaround,
  rating or guarantee invented. No external profile or link added.
- The GS-P01 lead-submission architecture was not redesigned or touched.
- The Press Path Finder and its 13 provisional rules are unchanged; `Q-P13` remains open.
- The Technical Design publication gate is unchanged and still refuses production. `GS-O005` and
  `GS-X002` were **not** marked complete.
- Analytics remain absent; nothing was re-introduced.

## Owner decisions closed

| ID | Decision | Result |
|---|---|---|
| `GS-O006` | Every listed Design, Digital and Press service is approved | **COMPLETE.** 81 services recorded verbatim in `lib/services/catalogue.ts`. Copy acceptance moved to `GS-O013`, so closing the list drops nothing |
| `GS-O011` | Campaign management confirmed; anonymise identifiable review project titles | **COMPLETE** on both limbs. Digital Marketing is a cross-division engagement; titles anonymised on the 6 reviews that exist. Narrow remainders are `GS-O012` and `GS-O013` |

## What changed

### Approved catalogue and content

- `lib/services/catalogue.ts` (new): the **81 approved services** as `group` + `name`, transcribed
  from the brief; the Digital Marketing decomposition; the unconfirmed-channel list. **Not
  architecture** — nothing in the schema, queries or components imports it, so CMS service
  evolution still needs no code change. It is the expectation the coverage gate measures against,
  and it sits outside its own subject on purpose.
- `scripts/service-content.mjs` (new): **46 service records covering all 81**, each declaring
  which approved services it `covers`, plus per-division process detail keyed to the canonical six
  stages. Pure data — the gate imports it without running the seed.
- `service.capabilities` added to the schema and projected; renders as *What this covers*.

**Granularity:** 46 records, not 81. A record is a page, and 81 pages would mean pages like
*Naming support* carrying three sentences. `covers` keeps the arithmetic honest and gate-provable.

**The content carries `isSeed: true` and deliberately no `[SEED]` text marker.** The marker means
*fabricated*; this is truthful, and the phase's purpose was a reviewable foundation. Production is
blocked by the flag plus `check:launch`, which is machine-enforced and specimen-proven —
non-negotiable #4 is intact. The **wording** is agent-authored and unapproved: `GS-O013`.

### Service-page architecture

One data-driven template for all three divisions, not three implementations and not 46 components:

- `components/content/ServiceDetail.tsx` (new) — the page body, division-parameterised.
- `components/content/servicePage.tsx` (new) — a factory returning `generateStaticParams`,
  `generateMetadata` and the page component; each route file is six lines.
- `/design/services/[slug]` and `/press/services/[slug]` (new); `/digital/services/[slug]`
  refactored onto the shared template.
- `components/content/DataRows.tsx` — promoted out of `components/divisions/digital/` on the
  condition its own docstring set. `components/divisions/digital/` is now empty and deleted; the
  kitchen-sink specimen renders in **every** theme frame rather than only the digital one, which
  is what a shared component needs audited.
- `DivisionLanding` links service cards in all three divisions.

The page needs no price, no portfolio, no case study and no client evidence. Every block is
conditional; exclusions render rather than disappear.

### Digital Marketing

**Nothing new was built** — no division, group, CMS type, route or orchestration machinery. The
engagement decomposes into capabilities the approved catalogue already holds, with campaign
strategy and management sitting with Master, which `GS-P03` already defined as the orchestration
layer. Held as data, asserted by a gate so it cannot drift. `SERVICE-ARCHITECTURE.md` §13.

Channel services (Google Ads/PPC, Meta advertising, social media management, Google Business
Profile, email marketing, media buying) were **not** inferred from the phrase; the live site is not
authority. `GS-O012`.

### Review anonymisation

Titles generalised to a category of work by a mechanical rule; one omitted because stripping left
nothing meaningful. **No quote altered — all six bodies byte-identical to the 21 August 2026
transcription. None had to be withheld. No rating invented.** `SERVICE-ARCHITECTURE.md` §14.

**Count discrepancy, unresolved and not papered over:** the owner states 12; authoritative source
data holds 6. The missing six were not fabricated. `GS-O013`.

### Development dataset — `GS-T007` CLOSED

Project `spzu6y31`, dataset `development`, identity established before any mutation.

| | Before | After |
|---|---|---|
| Published documents | 140 | 132 |
| `service` | 30, ungrouped, all priced | 46, all grouped |
| `project` | 24 | 0 |
| `testimonial` (genuine) | 6 | 6, anonymised |
| `companyDetails` (genuine) | 1 | 1 |
| Sanity `system.*` | 12 | 12 |
| Drafts | 0 | 0 |

46 obsolete seed documents deleted (24 `project`, 22 `service`), 119 written, all 119 confirmed
visible to an **unauthenticated** read. Deletion is **by provenance, never by type**: both
`isSeed: true` and an `seed-` id prefix required, and a disagreement between the markers stops the
run. Idempotent — a second run deleted nothing and wrote the same 119.

### Gates

| Gate | Change |
|---|---|
| `check:service-content` + selftest (**new**) | Coverage of the 81 by the 46 (both directions), the Digital Marketing map, review anonymity, and an opt-in `--dataset` mode that reads the served dataset unauthenticated. 23 selftest cases, every limb broken separately |
| `check-axe` | Three service routes as subjects (one per division) in `ROUTES` **and** `INCOMPLETE_ALLOWED` |
| `check-responsive` | Same three routes |
| `check-vat` | Same three routes — the pages most likely to grow a price as prose |
| `check-bundle-size` | Same three in `REQUIRED`; no new `BUDGETS` row needed, division prefixes already bind them |
| `check-node-version` | **Defect fixed** — see below |
| `ci.yml` | Selftest, source gate and dataset gate added; `verify` and CI proven in parity again |

## Two gate defects found and fixed in this phase

Neither was raised by an audit, so neither is a `FIX-LEDGER` row — that register is keyed to audit
findings and its `FIXED` rule requires a commit descending from the report that raised them.

1. **`check-axe`: the `K-13` pair, again, in the same gate.** The two new service routes went into
   `ROUTES` and not into `INCOMPLETE_ALLOWED`, and the gate went red on seven combinations — two
   rows below a comment describing exactly that failure. Found the only way it can be: **by running
   the gate.** `check:lists` was green throughout and correctly so — it asserts
   `INCOMPLETE_ALLOWED ⊆ ROUTES`, and the missing direction is the one its docstring says it cannot
   decide. Zero axe **violations** on all three routes at any point.
2. **`check-node-version`: a parity gate that could not see hyphens.** Its regex was
   `/npm run ([\w:]+)/`, so every hyphenated script name was truncated on **both** sides —
   `check:lead-security` read as `check:lead`. Parity held because the two sides were wrong the same
   way. What it could not survive is two scripts collapsing to one token: `check:service-content`
   and `check:service-content:dataset` both read as `check:service`, so one could sit in `verify`
   and the other in `ci.yml` and the gate would call it parity. Fixed to `[\w:-]` and proven.

A third defect was found **in this session's own new gate, by its own deliberate-failure proof**:
`check-service-content`'s review line printed *"no identifying fragment found"* unconditionally,
and the proof printed it directly above two problems saying the opposite. That is the
"a summary line is not evidence a check ran" class. The line now reports the count, and the
corrected line was re-proven to move.

## Verification

| Check | Result |
|---|---|
| `npm run verify:static` (40-gate chain) | **PASS** on a clean `.next` |
| `npm run verify:build` | **PASS** — **77 routes** (was 41), all within delta budgets. Every service page is 1.9KB gz delta — the shared baseline, zero client JS |
| `check:axe` | **PASS** — 76 analyses (19 routes × 2 viewports × 2 phases), **zero violations**, 66 allowed incompletes, 0 unresolved, 71 link targets resolve |
| `check:responsive` | **PASS** — 51 combinations (17 routes × 375/768/1440px), no overflow |
| `check:vat` | **PASS** — 17 routes, 626,401 characters scanned, **0 price figures** (was 14 routes / 527,607 chars — the count moved with the new routes) |
| `check:launch` (served) | **PASS** — dataset `development`; 113 published seed documents; **3 published technical services without professional-scope confirmation, refused on production only** |
| `check:service-content` | **PASS** — 81 approved / 46 records / each covered exactly once; 12 engagement activities resolve; 6 reviews, 5 categorised, 1 deliberately without, no identifying fragment |
| `check:service-content --dataset` | **PASS** — dataset read unauthenticated: 46 published services, 6 testimonials, 0 provenance mismatches |
| `check:security-headers`, `check:consumer-terms`, `check:legal:parity`, `check:press:type`, `check:path:live` | **PASS** |
| `npm audit --omit=dev` | **PASS** — 0 vulnerabilities |
| `lint:secrets` | **PASS** |
| `git diff --check` / `--cached --check` | **PASS** |
| Lighthouse CI (desktop/mobile) | **NOT RUN locally** — the known Windows chrome-launcher EPERM. CI is the arbiter |
| Manual screen-reader and cross-browser review | **NOT RUN** — `GS-R001` |

### Deliberate-failure proofs

Each ran alone, with the subject's bytes captured first and restored from those bytes afterwards,
verified by SHA-256. Every result is a red that **names its injection**, so each probe is
established as a subject rather than inferred to be one.

| # | Gate | Injection | Named in the red |
|---|---|---|---|
| P1 | `seed-content.mjs` production guard | `DATASET = 'production'`, run **without a token** so a guard failure could not reach the network | `refusing to run against "production"` — and the token check's message did **not** appear, which is how it is established that the production guard fired and not the one after it |
| P2 | `seed-content.mjs` provenance guard | a real `development` document with `isSeed: true` and an id not beginning `seed-` | `the two provenance markers disagree … Nothing was deleted and nothing was written` |
| P2b | `check:service-content --dataset` | the same document | `DATASET: … is marked isSeed but its id does not begin "seed-"`; the mismatch count moved 0 → 1 → 0 |
| P3 | `check:service-content` anonymity | `Casglu` restored to a review title in `seed-content.mjs` | both matching fragments named — **and this proof exposed the misleading summary line, which was then fixed and re-proven** |
| P4 | `check-node-version` parity | `check:service-content` removed from `ci.yml` only | the **full** name in both directions, which the pre-fix regex could not have produced |
| P5 | `check:service-content --dataset` coverage | a live `capabilities` value patched to an unapproved name | `DATASET UNAPPROVED: ghostwriting claims "Skywriting"` |
| P6 | `check:service-content --dataset` coverage | `capabilities` unset entirely on a live record | `DATASET UNCOVERED: no seeded service represents "Ghostwriting"` — a second limb, proven separately |
| P7 | `check-axe` | (unplanned, genuine) two routes in `ROUTES` and not `INCOMPLETE_ALLOWED` | seven `UNRESOLVED … not in INCOMPLETE_ALLOWED` lines naming each route and phase |

The 23-case committed selftest is the permanent subject. It is value-based — each case asserts what
a rule function **returns** — so a case that should fail cannot pass as an absence. Every limb of
`coverageProblems` is broken separately, including the two empty-input cases that prove a count of
zero is a failure rather than a pass.

**Restore note, recorded because it cost time:** `git checkout --` is the *wrong* restore for a
proof whose subject has uncommitted changes — it reverts to `HEAD`, not to the pre-mutation bytes.
It silently discarded a session's edits to `seed-content.mjs`, recovered only because the protocol's
own rule ("restore by writing back bytes captured before the first mutation") had been followed and
a byte copy existed. Capture bytes; restore from bytes.

## Findings and programme state

- **Closed:** `GS-O006`, `GS-O011` (owner decisions); `GS-T007` (development dataset).
- **New:** `GS-O012` (platform-specific marketing channels — the narrow remainder of `GS-O011`),
  `GS-O013` (development service copy acceptance, and the 12-vs-6 review count).
- **Remaining:** `GS-T004`, `GS-T005`, `GS-O003`, `GS-O004`, `GS-O005`, `GS-O007`, `GS-O010`,
  `GS-X001`, `GS-X002`, `GS-R001`–`GS-R003`, `Q-P13`.
- **Production readiness:** **NOT READY.**

## Remote changes

- **GitHub:** the GS-P04 commit pushed to `main`.
- **Sanity development:** reseeded under explicit owner authorisation — 46 obsolete seed documents
  deleted, 119 written, genuine records preserved. Two proof documents were created and deleted
  again within the proofs above, and two live records were patched and restored by reseed.
- **Sanity production:** **none.** Not read, not written, not contacted.
- **Supabase:** **none.**
- **Resend:** the existing `check:axe` notification probe sent one development notification through
  Resend's shared sender to the account owner. Established gate behaviour, not new here; no lead row
  was written.
- **Vercel:** none initiated. The push may trigger the normal Git integration.
- **Hostinger/DNS/`gridsmith.uk`:** none.

## Recommended next phase

Recommendation only. **Do not begin it from this handoff alone.**

An **owner content-review and staging-candidate phase**: put the development site in front of the
owner to close `GS-O013` (service copy acceptance and the review count) and `GS-O012` (channels),
then carry the accepted copy — and only the accepted copy — toward a staging release candidate for
`GS-R001`/`GS-O008`. Technical-group content stays gated on `GS-O005`/`GS-X002`. Keep `GS-T004`
production activation for a separately authorised production-release phase.
