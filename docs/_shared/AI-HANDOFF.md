# AI handoff

## Execution

- **Task ID:** `GS-R001-M` / `GS-O008`
- **Task:** Master experience redesign
- **Agent/model:** Claude Code (Opus 5)
- **Status:** COMPLETE IN REPOSITORY. The owner rejected the Master homepage's visual direction
  at `GS-O008`; `/` is redesigned. **`GS-O008` stays OPEN — AWAITING OWNER RE-REVIEW.** No
  Supabase call of any kind. No production Sanity call. No DNS, Hostinger or `gridsmith.uk`
  change. **No dependency added.**
- **Date:** 18 September 2026
- **Full evidence:** `docs/_shared/GS-R001-M-MASTER-REDESIGN.md`. The previous handoff
  (`GS-R001-R`) is in git history and `GS-R001-R-REMEDIATION.md`.

## Repository state

- **Starting commit:** `fbecbe01`, `main`, clean, 0 ahead / 0 behind
- **Starting CI:** runs `35288782657` (`main`) and `35288781001` (branch), both `success`
- **Branch:** `staging/gs-r001-m-master-redesign` (Vercel preview). **`main` not pushed** — it stays at
  `fbecbe01`; a `main` push starts a production-target build and this phase forbids production
  deployment. Fast-forward it when the owner accepts `/`
- **Phase commits:** `07406d60` (the redesign), `c69fcdde` (declines software WebGL — CI's first
  finding), `e298f576` (fallback as vector shapes — CI's second finding); this record follows.
- **CI:** run `35308394477` on `07406d60` **failure** (Lighthouse desktop `/` 0.66, TBT 41,960ms);
  `35314676312` on `c69fcdde` **failure** (mobile LCP 3,385ms); **`35318073725` on `e298f576`
  `success`**, all steps. Lighthouse, median of 3, on a GPU-less runner — so **the fallback path**,
  which is what a GPU-less visitor receives: desktop `/` **1.00 perf / 1.00 a11y / LCP 578ms /
  TBT 0ms / CLS 0.000**; mobile `/` **0.99 / 1.00 / LCP 1,631ms (≤1,800) / TBT 88ms / CLS 0.000**.
  SEO 0.66 is the deliberate `noindex`. The WebGL path's cost on a real GPU is not lab-measured
  by anything available to this phase.
- **Staging:** preview `dpl_HbdjFaGDUSYsEJetzcb3oUuD224J`, **`READY`**, target `null`, at
  **`https://gridsmith-ltd-git-staging-gs-r001-7c084d-atikmurtazas-projects.vercel.app/`** — HTTP
  302 to Vercel SSO with `x-robots-tag: noindex`. `gridsmith.uk`: HTTP 200, `platform: hostinger`,
  unchanged.

## Scope held

- **Master homepage only.** Design, Digital and Press routes untouched; `/about`, `/approach`,
  `/contact`, `/insights` and legal keep the white Master theme.
- **Digital not researched** — owner: *"for digital i will tell later."*
- **Press and Design research is capability evidence only** (`GS-O018`, `GS-O019`); no public
  Press or Design content changed.
- Preserved: no visitor-visible `[SEED]`, About/Approach remediation, editorial-brief Insights,
  no call CTA, WhatsApp/SMS, eight social links, ICO unpublished, no pricing, no portfolio, the
  Technical Design gate, Freelancer filtering.

## What was built

1. **A gold stage** (`styles/themes/master-stage.css`) from the logo's own gradient stops —
   `#E0BD70` accent, `#0B0907` canvas, `#F5EEDD` ink — applied to `/` only via
   `[data-stage="master"]`, measured by `check:contrast` as a fifth palette (worst text cell
   6.39:1).
2. **`MasterScene`** — a fixed WebGL layer ray-tracing the logo's 8 spheres and 6 bars
   analytically as polished gold with inter-reflection, in one fragment shader. Six chapter poses
   over four formations (logo, split, chain, ring); lighting rotates with scroll; subtle pointer
   tilt; renders only on change. **Lazy 5.2KB gz** against Three.js's ~150KB; GSAP not needed.
   Reduced motion: one still hero frame. No WebGL, **software-only WebGL**, a draw blocking >100ms,
   failure or low capability: the logo as inline vector shapes (`FallbackMark`). CI found both
   cases the hard way: TBT 41,960ms (software WebGL), then mobile LCP 3,385ms (an image fallback).
3. **The page** — hero (left-set type, mark right), a typographic **studio index** instead of
   three cards, *One relationship* (continuity + structure disclosure merged), the six stage
   names on one rail, still reviews under a held heading, and a close where the mark resolves
   front-on. Approved copy carried word for word; three structural additions, no claims.

## Verification

`verify:static` **47 gates PASS** · `verify:build` PASS on a wiped `.next` (68 routes; `/` delta
**4.4KB of 15KB**, was 1.9KB; lazy scene **5.2KB of 8KB**) · `verify:served` PASS: `check:axe`
**zero violations, 0 unresolved**; `check:master:scene` **5 widths × 6 chapters +
reduced motion + no-WebGL + software-WebGL (9 questions)**; `check:reviews:ui`, `check:company` (9 questions), `check:responsive`,
legal parity, Press type, Path Finder — all PASS; `check:mark:cls` **0.0000** at 375/768/1440 ·
`npm audit --omit=dev` 0 vulnerabilities · Lighthouse: CI (Windows cannot run it).

**Gates proven by deliberate failure, and what proving them found** (`GS-R001-M-MASTER-REDESIGN.md`
§8): the scene gate's first run found **44 real readability failures** the visual review had
passed — fixed in the design, not the thresholds; it then exposed its own defect (hiding content
by `visibility` let gold text count as the mark); the model self-test's first red was an ordered
comparison of an unordered bar; the proof harness twice credited or missed reds it had not
measured (a digit parser, then an occupied port read as a green). Each is fixed and recorded.
`scripts/prove-master-scene.mjs` is committed and re-runnable.

## Findings and programme state

- **`GS-O008`: OPEN — AWAITING OWNER RE-REVIEW of the redesigned `/`.**
- **`GS-O020` (new):** a 13th Freelancer review (James, 5/5, 17 Sep 2026, Illustration) is live
  and shows on staging by rule; `check:reviews --live` is red **by design** until a person reads it.
  The agent did not move the pinned set.
- **`GS-O018`, `GS-O019` (new, not blocking):** Press and Design capability gaps.
- Unchanged: `GS-T004`, `GS-T005`, `GS-O003`, `GS-O005`, `GS-O010`, `GS-X001`, `GS-X002`,
  `GS-R002`, `GS-R003`, the three `GS-R001` human tests.
- **RC status:** `GS-R001`'s TECHNICALLY PASS stands. **Production readiness: NOT READY.**

## Recommended next phase

Recommendation only. **Do not begin it from this handoff alone.**

**`GS-O008` — owner re-review of the redesigned Master homepage on staging.** It is an **owner
task, not an agent phase.**

- **Owner action required first?** Yes — this *is* the owner task. Plus `GS-O020` (read one
  review, publish or withhold), which takes a minute and can be done in the same sitting.
- **What the owner decides:** accept or reject `/`; whether the gold stage extends to the other
  Master routes; whether Master and Design read as too close; whether the reviews chapter shows
  enough of the mark.
- **Then:** a **NEW** session, **Claude Code (Opus 5)**, effort **small** if accepted (extend the
  stage to the other Master routes if asked, move `EXPECTED` per `GS-O020`) or **scoped by the
  rejections** if not.

`GS-T004` activation stays in a separately authorised production-release phase, and
`gridsmith.uk` cutover behind `GS-O009`. **An accepted `/` is not authorisation for either.**
