# GS-HOST-H4-G — Approved-work reconciliation + hosted release candidate

Date: 6 October 2026. Branch `codex/gs-host-004`. Result: **PASS — hosted staging release
candidate** (production cutover remains blocked; see §Blockers).

Starting baseline: source `6f0ef7ce`, identity `997a2344…`, artifact `8c3cad8a` (GS-VIS-NUM-R5).
Final: source **`6615d97cde8bd2915e88834982c7768af597a2c5`**, CI **37468717268** success, identity
**`28b841dd974216e42629bbb54c03fe74352156218ca7ee7fb3a35033f996bb89`**, artifact commit
**`bd8dd825`**, Hostinger manual deployment 15:43 BST 6 Oct.

## Why this phase reconciled first

`GS-VIS-SEO-RC` (`41a54998`, local only, branch `staging/gs-press-001-press`) committed the
owner-approved `GS-SEO-001-I1/-R1` and `GS-VIS-001` → `-R4` work and stated that the next step,
`GS-HOST-INTEGRATE-001`, should merge it into `codex/gs-host-004`. That merge never happened: H4-D
integrated hosting work only, so the hosted artifact carried none of it except the numbering that
GS-VIS-NUM-R5 ported. Records that call this work "approved" therefore did not describe the hosted
site. Nothing here implies `41a54998` was previously deployed.

Method: per-file three-way reconciliation against the shared base `9508412e`, not a wholesale merge.
Files the hosting branch never touched were taken from `41a54998`; diverged files were merged and
each conflict resolved by the RC record's own integration notes (`GS-VIS-SEO-RC.md` §Hostinger).
After the commit every user-facing file equals `41a54998` except where the hosting contract requires
otherwise (listed below).

## Reconciliation matrix

| Change | Original approval | State before H4-G | Class | Action |
|---|---|---|---|---|
| Numbering (R3 rule) | GS-VIS-001-R3 | In source since `6f0ef7ce`, except ServiceDetail stage labels ("1. Consultation" on all 44 service pages) | B (+A for ServiceDetail) | ServiceDetail taken; nothing re-applied |
| Batch A metadata: `/`, `/about`, `/approach` own title/description/share card, `masterOpenGraph` | GS-SEO-001-I1/-R1 | Absent | A | Integrated |
| Master page copy (hero intro, chapter H2s) | GS-SEO-001 / GS-VIS-001 | Absent | A | Integrated |
| Studio summaries (`nav.ts`) incl. Digital "Working systems: … built to keep running." | GS-SEO-001 | Absent (old "built and kept running") | A | Integrated |
| About/Approach page code (Approach closing line, Connect note wording) | GS-SEO-001 decision 6A | Absent | A | Integrated |
| About/Approach CMS copy (`intro`, `sections`) — GS-O027 | GS-SEO-001; GS-O027 owner authority (H4-D-R1/H4-G briefs) | Repo seed only; Production at 1 Oct copy | A | Seed integrated; narrow Production write (§GS-O027) |
| Portable Text links (`Blocks.tsx`, `portableLinks.ts`, schema annotation, query types, selftest in `verify:static` + CI) | GS-SEO-001 | Absent | A | Integrated (17/17 selftest) |
| Design default-open service groups + separator removal | GS-VIS-001-R4 | Absent (all closed) | A | Integrated; Technical stays closed (0 published) |
| Press supporting lists open (`pr-cat-more`) | GS-VIS-001-R4 | Absent | A | Integrated |
| Master scene R2/R4 framing (`scene.ts`, `sceneModel.ts`) | GS-VIS-001-R2/-R4 | Absent | A | Integrated |
| Review drum (continuous turn, drag, inertia, opposite arrows, pause/play, still drum under reduced motion) | GS-VIS-001 → -R1 | Absent (6 s stepped ring) | A | Integrated with hosting card body (below) |
| Review card body from the live API (author name, project title, date) | Pre-H4-D model | — | C (superseded by H4-D-R1 contract) | Not ported |
| VIS lede "Every review … Nothing is selected" | GS-VIS RC | — | C (false while two reviews are withheld) | Hosting lede "Selected reviews …" kept |
| Gate updates (`check-master-scene` painted-text rules, `check-design-scene` manifest set, `check-press-scene` unnumbered stages, `check-reviews-ui` cylinder limbs) | GS-VIS-SEO-RC | Absent | A | Integrated; hosting provenance/tap/anonymity limbs kept |
| Docs (`GS-VIS-SEO-RC.md`, `GS-SEO-001-COPY-REVIEW.md`) | — | Absent on branch | A | Copied verbatim as records |

No item was classified D or E. Kept from the hosting branch: static frozen review source
(`listPublicReviews`) and lede, `STATIC_BUILD` guard, review tap targets (44 px), front-card-only
pointer, review gate provenance/anonymity/target-size limbs, hosting `package.json`/CI steps.

Review drum adaptations (`ReviewCarousel.tsx`, `home.module.css`): anonymous `PublicReview` card
(actual rating as `role="img"` "N out of 5 stars", verbatim text, "Verified Freelancer review" link to
`https://www.freelancer.com/u/GridsmithLTD`; no name, project or date; flags only from approved
country data, of which there is none); drum styles gated on `[data-enhanced]` (set after hydration)
so no-JS keeps the flat readable list (H4-E); focus inside a card turns it to the front and holds the
automatic turn until focus leaves; a press on a link or control never starts a drag. Two withheld
reviews (`22108992`, `22100632`) absent; no API/refresh/cache.

## GS-O027 — Production Sanity

Read before write (10:36Z, unauthenticated): `grouppage-about` and `grouppage-approach` both at
`_rev 0BiMQiPM5rorSeZsxnHEvi` (1 Oct, as the RC recorded); `_type`/`slug`/`title` MATCH; `intro` and
`sections` DRIFT exactly as recorded (About 4 changed + `evidence` missing; Approach 6 changed). No
unexpected drift. Backup of both full documents outside the repository
(`proof/gs-o027/grouppages-before-2026-10-06T10-37-17-481Z.json`); one transaction patching only
`intro` and `sections`, guarded by `ifRevisionID`; new rev `OYqJMxSgjqUZpSF35PObJk`. Canonical
read-back: 0 differences on both documents; other fields unchanged; 47 public documents before and
after, no other `_rev` changed, none added. (The script's first in-run comparison reported
`sections` false — an object-key-order artefact of `JSON.stringify`; the canonical comparison is the
record.) No Technical or legal content. `GS-O027` closed in `OWNER-ACTIONS.md`.

## Path Finder — INTENTIONALLY UNLINKED

`/press/path-finder` is a **withheld preview**: metadata "Withheld preview — Gridsmith Press",
noindex/nofollow, absent from the sitemap source (`GS-PRESS-001-RC` PRESS-RC-07), "Path Finder
remains withheld and carries no data to the contact form" (`GS-PRESS-001-D`), and the Press no-JS
gate requires "no Path Finder promotion". H4-E's "orphan" observation is that deliberate state. No
change; exposing it would need an owner decision to un-withhold it (its rules are [SEED]).

## Legal links while GS-O003 is open

Footer links (Terms, Privacy, Cookies, Accessibility) on every route and the `/press` rights-module
link to `/legal/consumer-client-terms#clause-10-1` resolve to the branded noindex 404 on staging.
Repository records define the launch dependency, not a temporary treatment: the cutover runbook
(`GS-PROD-005` F1) requires all seven legal routes to return 200 after GS-O003 and the approved legal
migration. Classification: expected staging state; **production blocker tied to GS-O003**. No footer
change, no substitute text, no publication.

## Gate changes (all proven)

- `check-static-ui` review limbs measured the old stepped ring (`--turn`, "Next" text button) and a
  flat reduced-motion grid. They now measure the approved drum: continuous rotation by the ring's
  `rotateY`, pause and right arrow by `aria-label`, and a still drum without a pause control under
  reduced motion. Proofs: against the old hosted ring the gate failed "Review cylinder exposes no
  rotateY angle"; separate sabotages each turned exactly their own predicate red (pause blocked →
  paused false; arrow blocked → arrow false; reduced-motion forced turning → still false) with the
  controls passing (`build/h4g-static-ui-limb-proofs.json`).
- `check-axe` review-rating classifier: added the decline reason "partially obscured by another
  element" (drum facets overlapping the rating) — the same overlap the R1 cylinder allowance covers
  for that card's text; mapping still requires the unique node inside the card scope (17 proofs).
- `check-master-scene`: a failing question 5 now saves the frame and box it measured; CI uploads
  them as `master-scene-evidence`. Evidence only; no threshold or assertion changed.

## CI

CI 37453490263 (`84bfba35`) failed two served gates: the rating classifier above, and
`check:master:scene` question 5 at 390×844 and 320×568 (reviews lede 1.00–2.63:1). The latter did not
reproduce locally (6.9/6.7:1), under forced software WebGL, or as any drum overlap at 48 sampled
angles; it is recorded as intermittent on the Linux runner. CI 37468717268 (`6615d97c`) **success**:
verify 13:10–14:29Z (including both Lighthouse axes, axe, all scene gates, review UI), build, publish;
no question-5 evidence was produced. Duplicate push runs were cancelled.

Linux CI Lighthouse (`6615d97c`, H4-D 44e in brackets): desktop LCP 614/644/580/669 ms
(610/611/569/651); mobile LCP 975/993/906/1096 (928/953/895/1049); mobile TBT 89/95/107/97
(53/55/68/56); CLS ≤0.0002; accessibility 100 in every sample. The increase is the drum's continuous
motion and the R2/R4 framing, inside the unchanged budgets.

## Hostinger deployment

Auto-deployment OFF verified 11:02:17Z and 14:36:01Z (before CI published). The publish push
(`bd8dd825`, 14:31:59Z) created no deployment (served `997a2344…` through 14:33Z; history unchanged).
Manual Redeploy: first two hidden-tab attempts did not register; the third registered as one record,
15:43 BST (Current); served `28b841dd…` from 14:43:17Z. Site-specific Flush cache 14:43:55Z.
Auto-deployment read ON at 14:44:15Z (Redeploy side effect), turned OFF 14:44:24Z, confirmed OFF
after reload 14:44:42Z.

## Hosted RC verification (`28b841dd…`)

| Check | Result |
|---|---|
| H4-D contract (`h4d-r2-acceptance`) | identity exact; 217 file responses, 0 failures; exceptions PNG-headers 27 + robots 1 (temporary domain only); 55 routes; 14 gated 404; fixture marker 404 |
| Responsive RC matrix (13 families × 320/360/390/430/768/1024/1280/1440/1920 = 117) | one h1, no overflow, no clipping, no console errors, drum enhanced with 11 cards; 26 raw-axe analyses: only `/press` source cards mid-entrance (below fold, opacity ≈0), present identically on the pre-H4-G baseline; `check:axe` (CI) authoritative and passed. The 304s on repeat loads are the probe's cached context |
| `check-reviews-ui` | PASS, all questions (turn/pause, 11/11 keyboard, tap targets 11 poses, provenance/focus/rating 11, anonymity, 0 `<time>`, reduced motion still drum, no overflow) |
| `check-static-ui` | PASS: 14 pages, 13 axe analyses 0 violations, 13 no-JS pages |
| Numbering audit (13 routes × 1440/390) | identical to local; removed set = R3 rule; retained taxonomy/counts/progress/illustration |
| No-JS (`h4e-nojs`, 55 routes × 5 widths) | PASS; only the adjudicated Press audiobook Voice words |
| No-JS features + axe replay | 110 analyses 0 violations (one `/press@1440` replay was not faithful and was re-run faithfully: 0); reviews flat and readable, mobile nav, skip link, Design disclosures (default-open groups close/open natively), Press desk, Path Finder fallback, both form notices |
| Content snapshot | identical to local: Batch A metadata, approved strings, Design groups open except Technical, Press supporting lists open |
| Hosted performance (Windows synthetic, descriptive) | cold desktop LCP 1244–2308 ms, cold mobile 1936–2996 ms, warm 124–772 ms — inside the H4-D ranges; warm loads re-fetch the four footer social PNGs (22 KB; hCDN strips their validators) — recorded, not material |

Preview leads 0 / outbox 0 (15:08Z); no submission or mail. Production: only the GS-O027 write.

## Owner review package

Staging: `https://mediumaquamarine-wallaby-594070.hostingersite.com` — source `6615d97c`, identity
`28b841dd…`.

Inspect (representative templates are proven equivalent across their families):
1. `/` — hero copy, studio list, the review drum (turning, drag, arrows, pause; a phone width too), the
   Batch A section headings.
2. `/about` and `/approach` — the GS-O027 copy (new Evidence section on About; the example journey
   and closing line on Approach), no heading numbers, the unnumbered six-stage rail.
3. `/design` — Brand/Visual and Illustration/Motion/3D groups open by default; Technical closed with
   its scope note.
4. `/press` — the six territories with their supporting lists open.
5. One service page per studio (e.g. `/digital/services/web-applications`) — unnumbered stage list.
6. Share previews (title/description) of `/`, `/about`, `/approach` if you check link cards.

Owner decisions still open: Path Finder stays withheld unless you choose to un-withhold it; legal
links stay branded 404s until GS-O003.

## Blockers (production cutover, not this RC)

Freelancer written permission (review text on gridsmith.uk); GS-O003 (legal review; seven legal
routes must be 200 before cutover); GS-X002 (Technical services gated); BEFORE-LAUNCH item 24
(production robots/sitemap/index/image headers); O024 deferred/non-blocking.
