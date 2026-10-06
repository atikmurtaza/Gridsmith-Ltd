# GS-VIS-SEO-RC — approved visual + SEO Batch A release candidate

**5 October 2026 (Europe/London). Result: PASS — local release candidate; one gate-only RC correction (`check:design:scene` G2); not pushed (Vercel auto-Preview); Production CMS sync of two group pages is a new owner action (`GS-O027`).** A release candidate, not a cutover. It
commits the owner-approved local work of `GS-SEO-001-I1`, `-I1-R1` and `GS-VIS-001` through
`GS-VIS-001-R4` (owner approval of the visual state through R4 is the authority; nothing here was
redesigned). The next deployment step is `GS-HOST-INTEGRATE-001` on `codex/gs-host-004`.

No Production CMS, Supabase, Edge, DNS, WordPress, Hostinger, Vercel or `main` change. No push
(see §Push).

## Repository

| | |
|---|---|
| Branch | `staging/gs-press-001-press` |
| Requested baseline | `9508412e` |
| Actual starting SHA | `8ed9a5a3` — `origin/staging/gs-press-001-press` carried two GS-PROD-005 docs commits (`6abc0d5d`, `8ed9a5a3`; docs + one `platformMarks.ts` comment) the local branch lacked. Fast-forwarded before any change; no overlap with the RC diff. The runtime baseline is unchanged (`9508412e`). |
| RC commit | recorded in the receipt below |

## Diff audit

Every changed file was read against the approved workstream.

- **Approved, committed (33 tracked + 3 new):** Master home, scene and scene model (R2/R4 Process
  framing), review cylinder (`ReviewCarousel.tsx`, `home.module.css`), studio summaries
  (`nav.ts`), About/Approach pages and metadata, `masterOpenGraph`, Portable Text links
  (`Blocks.tsx`, new `lib/content/portableLinks.ts`, `groupPage` schema link annotation, query
  types), `GroupSections`/`Connect`/`ProcessRail`/`ServiceDetail`/division homes/Path Finder
  numbering removal, Design default-open service groups and separator removal, the
  `seed-content.mjs` Batch A copy, gate updates (`check-master-scene` painted-text rules and pause
  label, `check-design-scene` manifest-derived service set, `check-press-scene` unnumbered stages,
  `check-reviews-ui` cylinder limbs), the new `check:portable-links:selftest` (package.json,
  `verify:static`, CI), and the owner copy-review record `GS-SEO-001-COPY-REVIEW.md`.
- **Removed local-only artefact:** `.claude/launch.json` — a `gridsmith-local-seo-review` entry
  pointing at a session scratchpad wrapper. Restored to `HEAD`; not committed.
- **Untracked, pre-existing, excluded (as at every RC since `GS-DIG-001-RC`):** `.codex/`,
  `AGENTS.md`, `public/brand/design/preview.html`.
- **Scans of the diff and the built output:** no debug logging (the one added `console.log` is a
  gate's proof line), no localhost or filesystem path, no secret-shaped value, no withheld review
  id (`22108992`, `22100632`) anywhere in source or `.next`. The Technical boundary and the
  accessibility sentence match the owner-approved wording character for character.

## Verification environment

Every build, server and browser gate ran under a **sanitised** environment: every key named in
`.env.local` blanked (plus the Vercel/site keys and `SUPABASE_SERVICE_ROLE_KEY`), dataset forced to
`development`. The approved About/Approach copy and the Production-eligible service lists were
supplied by the established read-only interceptor (`local-grouppages.mjs`, GET-only, outside the
repository), exactly as the owner reviewed them. `lint:secrets` alone read `.env.local`, by design
(it sweeps the bundle for those values; it prints none).

Two build configurations, each clean (`rm -rf .next`):

- **Approved / eligible** — the interceptor serves the Batch A group pages and filters studio
  service lists to the Production manifest (Design 13, Digital 17, Press 14). This is what a
  Production-dataset visitor sees, with the new copy. Served gates run with
  `DESIGN_SERVICE_SET=eligible`.
- **CI** — no interceptor: development dataset as CI serves it (Design catalogue 16, the
  1 October group-page copy). Used for the bundle budgets (which require a prerendered Technical
  route) and the catalogue-mode Design gate.

## Results

### Static and build

| Gate | Result |
|---|---|
| `verify:static` (32 scripts: typecheck, ESLint, colour lint + selftest, contrast, state cues, headings, content, claims, control, schemas, RLS, lead security, CMS migration dry run, launch/legal/struck/path/press/lists/service-content/reviews/company/master/design-timeline selftests, `check:portable-links:selftest` 17/17) | PASS |
| `next build` (both configurations) | PASS, 70 static pages |
| `lint:secrets` | PASS — 234 source files, 48 client chunks, 20 public assets; 2 values checked |
| `check:tokens`, `check:theme` | PASS |
| `size` (CI configuration) | PASS — 69 routes within delta budget; Master 7.0 of 15 KB; lazy Master scene 7.1 of 8 KB; lazy Design scene 7.9 of 8 KB |
| `size` (eligible configuration) | red by construction: it requires `/design/services/technical-documentation` prerendered, which the eligible set withholds. Not an RC defect; see Hostinger notes |

### Served (approved / eligible configuration)

All PASS: `check:axe` (0 violations; 966 incompletes, every one allowed, 0 unresolved; skip link
18 routes × 2 viewports), `check:security-headers`, `check:redirects`, `check:launch`,
`check:responsive` (51/51, no overflow), `check:consumer-terms`, `check:legal:parity`, `check:vat`,
`check:press:type`, `check:press:scene` (incl. no-JS), `check:path:live`,
`check:service-content:dataset`, `check:reviews:ui` (11 cards; turns and pauses; 11/11 keyboard
reachable and readable; reduced motion: drift 0.00°/3 s, no pause control, arrows 11/11, coast 0.00°;
no overflow), `check:company` (10 questions, 18 routes), `check:master:hero` (18 sizes),
`check:design:scene`, `check:digital:scene` (2,012 text boxes, Save-Data and no-JS) and
`check:master:scene`. CI configuration: `check:company`, `check:launch`, `check:design:scene`
(catalogue) PASS.

### Master scene

Full authoritative matrix (12 viewports × 6 chapters + 12 transit samples, footer handoff, still
ring, reduced motion, no-WebGL read top to bottom, software WebGL): **all 14 questions pass.**
**1024×768 Process: 2.3% gold, 100% unobscured, worst text 10.7:1** (R4's figures). Supplementary
sizes outside the gate's list, via a scratch copy with only the list extended: 1920×1080 (process
2.1%/100%/6.8), 1280×800 (2.5%/100%/10.6), 340×600 (3.1%/100%/10.3) — all 14 questions pass.
Fallback: 1440×900 / 768×1024 / 390×844 read top to bottom, worst 10.4 / 10.1 / 9.9:1.

### Q8 — software renderer

Threshold unchanged: 200 ms. **Absolute: PASS — 166 ms** in the full gate run and again in the
supplementary run. Matched comparison anyway (the R4 harness, 12 alternating rounds, untouched
`8ed9a5a3` built and served under the same sanitised wrapper on :3200 vs the candidate on :3300),
run later under heavier machine load: HEAD median 637 / mean 568 ± 220 ms (10/12 over 200);
candidate median 647 / mean 527 ± 264 ms (9/12). **Baseline-relative: no regression** (difference
well inside one standard deviation; candidate mean lower). In every Q8 sample the scene reported
`data-render="fallback"`, so the R4 framing code (`scene.ts` `measure`) is not on the measured path.
The absolute figure is environment-sensitive, as R4 recorded; the gate passed here.

### RC correction — `check:design:scene` G2 (gate only)

The CI-configuration run of the Design gate **failed** before this correction: R4 made a service
group open by default when it has published services, and closed such groups from the keyboard
before the chapter loop — but G2, which measures the **closed** Technical scope note, was only ever
run on the eligible set, where Technical has no published service and stays closed. On the
catalogue set CI serves, Technical opened and the note left the measured dwell (`closed
disclosure/overflow changed`, `No rendered text boxes measured`, 24 sizes). Shipped behaviour on a
Production-dataset build is unchanged (Technical has 0 published services there).

G2 now asserts the default the set implies — closed on `eligible`, open on `catalogue` — and closes
an open Technical disclosure from the keyboard (asserting it closes) before sampling, as the
chapter loop does. Proofs: catalogue on the CI build **PASS** (G2 24/24, minimum 6.69:1); eligible
on the CI build **red** with `Technical disclosure open by default on the eligible set` at all 24
sizes; eligible on the eligible build **PASS** (24/24, 6.69:1); catalogue on the eligible build **red** with `Technical disclosure closed by default on the catalogue set` at all 24 sizes. Each branch fired its own message in a run where the other set passed. The keyboard-close assertion is exercised (it passes on the catalogue set) but was not separately made to fail; it is the chapter loop's R4 assertion, reused.

**Recorded for `GS-X002` closure:** once Technical services publish, the Technical group opens by
default like every other group, and at 761–1024 px widths (and 320×568) its list carries the scope
note out of the dwell positions G2 samples. Re-assess the note's placement when `GS-X002` closes.

### Numbering, responsive, service discovery

- **Numbering** (served DOM, 13 routes × 8 sizes): no numbered heading or stage remains outside
  taxonomy. Remaining digits are the footer/`/about` studio index (`aria-hidden`), Digital and Press
  service-group taxonomy (Press `pr-cat-n` `aria-hidden`), service counts, review ratings, Path
  Finder "Question 1 of 5" progress, and illustration content (Press manuscript/chapter notes,
  Digital system states).
- **Responsive:** 360×740, 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080 on
  `/`, `/about`, `/approach`, `/insights`, `/contact`, the three studio homes, Path Finder, Press
  contact and one service per studio — **0 horizontal overflow in 104 combinations**; plus
  `check:responsive` 375/768/1440 × 17 routes and each scene gate's own matrix.
- **Design:** 13 eligible service links exactly (eligible set), the 3 `GS-X002` slugs linked
  nowhere, default-open groups close and reopen from the keyboard, Technical scope note 6.69:1.
- **Technical negatives:** on the eligible build no Technical slug appears in links or JSON-LD on
  `/`, `/design`, `/about`, `/approach` or a service page. Off Production the sitemap is empty by
  design, and the development dataset renders the Technical routes on demand, so the route/sitemap
  negative is a Production-dataset property: a clean build against the public Production dataset (no credential; `VERCEL_ENV=production`, `NEXT_PUBLIC_SITE_URL=https://gridsmith.uk`, served on :3400) returned **404 for `cad-drafting`, `engineering-drawings` and `technical-documentation`**; its sitemap holds 60 URLs, 13 Design services, **0 Technical**, and the 7 gated legal URLs that 404 (the `GS-PROD-005` pre-launch condition, unchanged); no Technical slug in the HTML of `/`, `/design`, `/about`, `/approach`, `/digital`, `/press` or a service page; `/design` links exactly 13 services; `/legal/*` 404; `check:launch` live tier PASS (statutory fields, 0 seed, 0 unconfirmed Technical). `/about` served the 1 October copy there, which is `GS-O027`.

## CMS — approved content that exists only in the repository

The Hostinger staging build reads the **production** dataset (`codex/gs-host-004`
`scripts/build-static.mjs`, `hostinger-staging.yml`). The Batch A About/Approach copy exists only in
`scripts/seed-content.mjs` (the migration source). A read-only, unauthenticated comparison of the
public Production documents with the payload `migrate-production-cms.mjs` builds:

| Document | Production `_rev` | Differs |
|---|---|---|
| `grouppage-approach` | `0BiMQiPM5rorSeZsxnHEvi` (2026-10-01) | `intro`; `sections` — all six changed (`one-company` 3 links, `continuity` 2 links) |
| `grouppage-about` | `0BiMQiPM5rorSeZsxnHEvi` (2026-10-01) | `intro`; `sections` — four changed, `evidence` new (1 link) |

Every other field is equal. **Proposed mutation, not executed:** after a fresh Production export
(the `--backup`), set `intro` and `sections` on exactly those two documents to the repository
payload — equivalently the existing guarded `migrate-production-cms.mjs --write`, whose
`createOrReplace` leaves the other 45 documents byte-identical. No Technical (`GS-X002`) or legal
(`GS-O003`) document is in the payload. **No existing programme authority covers this write**
(`GS-PROD-002` authorised the 1 October content), so it is a new owner action. Until it runs, a
Production-dataset build shows the 1 October About/Approach copy; every other RC change is in code.
The `groupPage` schema's link annotation is a Studio change only; no API write needs it.

## Push

**Not pushed.** A read of the Vercel project (`gridsmith-ltd`) shows the Git integration still
deploys this branch: every push since `7f6472b2` produced an automatic Preview (latest
`dpl_57LEXzodtFCtkrVnXVmGwDquN8bn` at `8ed9a5a3`). This branch's `vercel.json` has no
`git.deploymentEnabled: false` (that change lives on `codex/gs-host-004`, which owns Vercel
cleanup). Pushing would create a Vercel Preview, which this phase prohibits. The RC is therefore
local; `codex/gs-host-004` shares this repository's object store and can merge the SHA directly.
Consequence: there is **no exact-SHA GitHub CI receipt** for this RC; the local gates below are the
evidence, and the integration branch's CI is the first CI run of this code.

## Hostinger integration notes

`codex/gs-host-004` branches from `9508412e`, the same runtime as this RC's parent. Merge the RC SHA
(do not cherry-pick piecemeal: the gates and the code they measure move together).

1. **Review component — expected conflict.** The hosting branch adapted the *old* dwell carousel to
   its `PublicReview` model (`key`, `reviewText`, `country.flag`, `sourceUrl`, `sourceLabel`) and
   changed `Home.tsx`'s data source to `listPublicReviews()`. This RC replaces the carousel with
   the approved cylinder. Keep the cylinder (geometry, drag, inertia, arrows, pause, reduced motion
   are data-independent) and port only its card body (`ReviewCarousel.tsx`, the `<figure>`, ~15
   lines) to `PublicReview`: no reviewer name, provenance link, flag, rating, verbatim text. Keep
   the hosting branch's `Reviews()` data source and lede. `home.module.css` will conflict around
   the carousel rules: take the cylinder's.
2. **Review gates.** Both branches changed `check-reviews-ui.mjs`; the cylinder limbs (3, 5, 11)
   come from this RC, the caption/provenance assertions from the hosting branch. `check-master-scene`
   finds the pause control by `aria-label="Pause review rotation"`.
3. **Other overlaps:** `ci.yml`, `package.json` (add `check:portable-links:selftest`),
   `lib/sanity/queries.ts` (keep the hosting branch's `STATIC_BUILD` null guard and this RC's
   `markDefs`/`PortableSpan` types), `lib/seo/site.ts` (`masterOpenGraph` is additive),
   `check-press-scene.mjs`.
4. **Static compatibility of this RC's changes:** all are Server Components or existing client
   islands; no new route, API, runtime env read, image or font. Portable Text links are plain `<a>`
   to site paths or the Freelancer profile. The scene framing runs in the browser only. Nothing
   here needs a server.
5. **Content source:** the static build reads the **production** dataset, so About/Approach show
   Batch A copy only after `GS-O027` (§CMS). Production holds 0 Technical services, so the Design
   Technical group renders closed with its fallback line and scope note — the eligible state these
   gates passed.
6. **Bundle gate:** `check-bundle-size` requires `/design/services/technical-documentation` to be
   prerendered; a Production-dataset or static build withholds it, so the hosting branch must keep
   measuring budgets in its development-dataset CI job (as now) or re-derive that route list.
7. **Freelancer reviews:** this branch still uses the HEAD data path (`listFreelancerReviews`, live
   API). The hardcoded 11-review staging set, name removal, "Verified Freelancer review" provenance
   and the permanent exclusion of `22108992` and `22100632` belong to the hosting branch, unchanged
   by this RC.

## Gates still outstanding

- `GS-O003` — seven legal documents, solicitor review; full-cutover blocker.
- `GS-X002` — three Technical services stay unpublished; nothing here changes that.
- Freelancer review permission — the hardcoded staging dataset is the hosting workstream's; final
  `gridsmith.uk` publication stays permission-gated; API/cache stays disabled.
- New: the two-document Production CMS sync above (owner authority).
- Owner visual acceptance of the hosted result (after `GS-HOST-INTEGRATE-001`).

## Receipt

The RC commit is the commit that carries this record, on `staging/gs-press-001-press`, parent `8ed9a5a3`. Its SHA is reported in the phase handoff and is the SHA `GS-HOST-INTEGRATE-001` merges. Local only: no remote ref, no CI run, no Preview. Source gates (`verify:static`) re-run on the final tree before commit.
