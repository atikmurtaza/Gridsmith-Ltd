# GS-VIS-NUM-R5 — About / Approach numbering remediation + targeted H4-E regression

Date: 6 October 2026. Branch `codex/gs-host-004`. Result: **PASS.**

## Finding

The owner saw decorative numbers beside ordinary narrative headings on hosted `/about` and
`/approach`. Source: `GroupSections` (shared by both pages) rendered `<p class=index>02…07</p>`
above every section heading and passed numbers to page inserts; `/about`'s studio-map insert and
`Connect` rendered the next two; `ProcessRail` (Approach's six-stage section) rendered
`aria-hidden` "01–06" stage numbers. Shared mechanism, presentation layer only — not CMS content,
so no Sanity write was needed.

Why it survived: the owner-approved `GS-VIS-001-R3` rule was implemented only in `41a54998`
(GS-VIS-SEO-RC, branch `staging/gs-press-001-press`), which was never merged into the hosting
branch. The 44e Hostinger build therefore never carried it; the earlier "removed" claim described
the VIS branch, not the deployed artifact. H4-E did not test numbering (outside its brief).

The rendered audit (12 routes × 1440/390, hosted 44e) found the same R3 rule unapplied on Master
(chapter labels "01 The studios"… and process numbers), Design ("One practice" process list),
Digital (engagement process), Press (journey bar "01 Write"… and process rail) and the Path
Finder no-JS question headings ("1. Where is your manuscript?").

## Change — source `6f0ef7ce195dcc8d8ed164369dc6cc67929173ff`

Only `41a54998`'s numbering hunks were ported; its copy, metadata (`masterOpenGraph`), Approach
closing line, Connect note wording, Design default-open groups, separators, Press supporting-list
default-open, scene and review-drum changes were **not** ported. `GroupSections.tsx`,
`ProcessRail.tsx`, `design.css`, `digital.css` and `press-home.css` are byte-identical to R3;
`shared.module.css` differs from R3 only by R3's GS-SEO `.closingNote`. 14 files, 37+/118−.
Press's process rail keeps an unnumbered node (R3's `::after` joint). No form, review, lead, Edge,
metadata or copy file changed.

## Numbering audit (rendered, after)

Removed: About/Approach section and Connect numbers; Approach six-stage numbers; Master chapter
labels and process numbers; Design process list; Digital engagement process; Press journey bar
and process rail (incl. screen-reader-only stage prefixes in its headings); Path Finder no-JS
question prefixes.
Retained (meaningful): studio taxonomy (Master studio list 01–03, About studio map `aria-hidden`,
footer index `aria-hidden`); service-group taxonomy (Digital route map "01 / Web"…, Press
territories `pr-cat-n`/`pr-slug-n`); counts (Digital "Services in this group", Press
`pr-count`); functional progress ("Review 1 of 11"); illustration content (Design drawing grid,
Digital system states "00 / Input"/"01 Rule matched", Press manuscript/chapter notes, passes,
queries, folios). `/approach` now carries no numbers except the footer index. Hosted audit is
identical to the local audit on all 24 route × width keys.

## Verification

- Text diff, hosted 44e vs R5 (JS on/off, 1440/390; `build/r5-text-diff.json`): on `/`, `/about`,
  `/approach` only bare number tokens removed, nothing added, headings identical; Path Finder and
  Press no-JS differ only by the removed prefixes. JS-mode `/press` text varies between two loads
  of the same deployment (control: desk caption cycles), so the deterministic no-JS diff is the
  content proof.
- `build/r5-visual.mjs`: `/about`, `/approach`, control `/insights` × 390×844, 430×932, 768×1024,
  1024×768, 1280×800, 1440×900, 1920×1080 × JS on/off — 42 checks, 21 axe analyses: one h1, no
  overflow, no clipping, no overlap, no empty slot before any h2, no index element, no console
  error, 0 axe violations; local and hosted. Validity: against hosted 44e it fired on `/about` (6
  index elements) and `/approach` (12) at every size and mode, and nothing on `/insights`.
- Builds (Node 24.21.0, CI's sanitised env, clean `.next`): typecheck, lint, `git diff --check`,
  `verify:build` (73 pages; 69 routes within budget), `verify:static`, `build:static` (55 routes),
  `check:static:artifact` — all PASS.

## Targeted H4-E regression

Impact: `/`, `/about`, `/approach`, `/design`, `/digital`, `/press`, `/press/path-finder`; controls
`/insights` (shares `shared.module.css`) and `/contact`. `h4e-nojs` 9 routes × 5 widths and
`h4e-features` (18 axe analyses on the no-JS replay, reviews, mobile nav, skip link, Design
disclosures, Press desk, Path Finder, both form fallbacks), local and hosted: identical to the
H4-E baseline — 0 axe violations, all features PASS; the only crawl flag is the already-adjudicated
Press audiobook Voice words. Path Finder's probe now counts its 5 question headings (it previously
matched the removed "1." prefix). H4-E evidence for the other 46 routes is reused: their source is
untouched.

## CI, artifact, deployment

CI 37432618479 (workflow_dispatch, `6f0ef7ce`) success: verify 07:54–09:13Z, build 09:13–09:15Z,
publish 09:15–09:16Z; duplicate push run 37432605697 cancelled. Artifact identity
`997a2344bfc801252c0e4531810d22b7d3b4cc692bb99bb67e153c907876905e`, 55 routes, 201 files,
29,297,305 bytes; validator PASS (hashes, 11 review hashes, 5 private values); artifact commit
`8c3cad8a` matches the manifest blob-for-blob. Scans: 0 maps/secrets/Production ref/withheld IDs/
Technical slugs; robots Disallow-all; sitemap empty; noindex on every route.

Hostinger: auto-deployment OFF verified 07:56:51Z before CI published; the publish push at
09:16Z created no deployment (served 75d8bf40… through 09:19:45Z; history unchanged at 09:21Z).
Manual Redeploy: deployment records 10:24 and 10:26 BST (the first, hidden-tab click registered
late; both deploy `8c3cad8a`); served identity 997a2344… from 09:25:03Z. Site-specific Flush cache
09:26:42Z. Auto-deployment read ON at 09:26:55Z (Redeploy side effect), turned OFF 09:27:00Z,
confirmed OFF after reload 09:27:10Z.

H4-D contract on the new deployment (`build/h4d-r2-acceptance.mjs`): identity 997a2344…; 217 file
responses, 0 failures; exceptions PNG-headers 27 + robots 1 (temporary domain only); 55 routes;
14 gated 404; fixture marker 404. Preview leads 0 / outbox 0 (09:27:29Z). No submission or mail.

## New authoritative staging baseline

Source `6f0ef7ce`, CI 37432618479, identity `997a2344…`, artifact commit `8c3cad8a`, Hostinger
manual deployment 10:26 BST 6 Oct, auto-deployment OFF. Supersedes 44e / 75d8bf40… / 255d0e55.
