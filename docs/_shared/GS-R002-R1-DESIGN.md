# GS-R002-R1 — Design owner visual remediation

Date: 20 September 2026. Status: implementation and local verification complete; **owner visual acceptance pending**. Release handoff requires successful final branch-tip CI; exact runs and Preview checkpoints are distinguished below.

## Authority and baseline

The owner did not visually approve the original GS-R002 candidate. This is targeted remediation, not a strategy restart. The original record remains in `GS-R002-DESIGN.md`.

- Branch: `staging/gs-r002-design`.
- Starting commit: `ae7591b8573b01782ebe4dbee6cc683444ab5647`; clean start.
- Baseline full CI: [35506308564](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/35506308564), SUCCESS.
- Main remains `fbecbe01e7fb594c6163dab57514997cb248fc21`.
- No new dependencies; no shared Master/Digital/Press implementation changes.
- No Sanity write, Supabase call, production deployment, DNS/Hostinger change, GS-T004 application or production/Preview lead submission in R1. The existing local axe suite exercises synthetic validation without a database write and its configured internal notification probe; that probe reported provider acceptance, not delivery or production readiness.

## Owner-directed changes

| Area | R1 result |
|---|---|
| Hero | Arbitrary A replaced by a node-built dimensional cube with construction guides. The wave interacts with the same workspace. |
| Pacing | Desktop hero 200svh to 120svh; mobile 240svh to 125svh. Node and wave change from the start, with no wheel interception. Other mobile chapters shorten to 230svh, preserving space before the next chapter enters. The shortest phones reserve a larger technical drawing below compact copy. |
| Spatial flow | Central workspace; Brand left with copy right; character right with copy left; Technical left with copy right; convergence arrives from right toward the central logo. A persistent three-cubic wave survives the transitions. |
| G/S | Existing Inter display type; upper G at 170 SVG units, dominant S at 340. G draws two upper/left bars; S supplies four remaining bars before the original eight-node/six-bar mark resolves. No historical logo-origin claim. |
| Character | Original youthful rounded male face, swept navy hair, quiff, brows, oversized wraparound reflective visor, minimal nose/smile and tailored jacket. Sketch, clean line, flat colour, shading, then rig. |
| Interaction | Mouse influences visor reflection, damped head rotation/translation and small counter-rotation of body. Quiff uses a bounded damped spring, trails the head, settles, and returns on pointer leave. No physics dependency. Touch and narrow screens do not follow a cursor. |
| Rig handoff | Seven rig joints interpolate into structural positions while the shared wave and scene move left. |
| Building | Four distinct floor plates, roof, columns/mullions, 24 facade openings, service core, level labels and conceptual dimensions. Exploded components assemble, then dimensions/electrical/water layers appear. |
| Services layers | Solid electrical riser with per-floor branches and nodes; separate dashed water riser with floor branches. No cable/pipe sizes, structural calculations, compliance or certification claims. |
| Convergence | Exact logo remains dominant. Character, building, vector and dimensional fragments remain visible; arbitrary curved axes removed. The original wave returns at reduced prominence. Quote/contact flow retained. |

The mascot image itself was not available in the attachment directory; only the written request was available. The original SVG follows the owner's explicit visual description. No claim of direct image inspection, tracing or reuse is made.

## Colour system

The owner explicitly superseded Design's exact equality with Master gold. Design now uses `#0A192E` Oxford Navy and `#D4AF35` Imperial British Gold. Master retains its exact original palette. Family identity comes through the same logo, gold relationship, typography and shared chrome.

Supporting tokens are confined to `styles/themes/design.css` and `design-stage.css`: raised navy `#14263D`, sunken `#060F1E`, muted drawing navy `#465E78`, paper `#F3F0E8`, paper ink `#152C46`, paper muted `#43556C`, gold highlight `#F2DF9C`, muted gold `#AA914A`, deep gold `#635025`. Face shading is a restrained warm derivative. Shared footer division swatches remain frozen.

Measured contrast: primary ink/night 15.48:1; muted 10.30:1; subtle 7.87:1; gold/night and CTA 8.38:1; gold/raised 7.26:1; paper ink 12.45:1; paper muted 6.69:1. Existing AA limits are unchanged; decorative lines are not used as text. The contrast gate asserts the two approved anchor values rather than the now-superseded Master equality rule.

Digital's future direction remains deep teal + gold; Press remains `#426953` + gold. Neither is implemented here.

## Measured scroll pacing

At 1440×900, the original hero was 1800px tall. The first 180px wheel movement changed progress from .068 to .167 while its principal form opacity stayed 1; it did not visibly transform. After 540px total scrolling the form was still .932 opaque.

R1's real Puppeteer mouse-wheel input of 180px produces 180px native scrolling and changes both rendered construction transform and wave path. The hero is 1080px tall; Brand begins at document y1138.1px including header. The gate bounds the hero by 1.3 viewport heights and the chapter entry by 1.4; it also checks first-input rendered change, headline/CTA visibility and native scroll distance. This is a proportional measurement, not a claim that all trackpads emit identical events. Physical trackpad testing was unavailable.

## Verification and evidence

Final local source passed `verify:static`, clean `verify:build`, `verify:served`, staged/working diff checks and the source/client-bundle secret scan. The final harness edit also passed targeted ESLint. All 49 leaf gates remain aligned between local verification and CI; no threshold or performance budget was lowered.

- General axe: 76 analyses across 19 routes and two widths/two scroll states, zero violations. Existing characterised consent incompletes and SSR error-shell limitation remain explicitly reported; this is not a site-wide claim of perfect accessibility.
- Responsive: 51 combinations across 17 routes; no horizontal overflow. Fixed bottom-bar clearance passes.
- Design: 20 viewports x five chapters, plus 11 intermediate states with rendered text contrast; all pass. Real wheel, keyboard CTA/focus/disclosure, desktop mouse/hair settling and return, hybrid touch exclusion, narrow-screen exclusion, four distinct storeys, 24 openings and both system layers pass.
- Five fallback modes at desktop/mobile: reduced motion, no JS, save-data, low memory and deliberately blocked choreography import; five meaningful posters and readable text in every mode.
- Nine deliberate-failure probes cover loading layout shift, hero distance, storey removal, CTA, overflow, scene, chapter count, protagonist and rendered contrast.
- Master: 11 viewports x six chapters, reduced-motion/no-WebGL/software-WebGL pass; hero passes 14 sizes. Digital/Press responsive, typography, legal, service and interaction gates pass. Their implementation files are unchanged.
- Bundle: Design initial 103.4KB gzip, route delta 3.2KB against 25KB; lazy choreography 2.6KB against 8KB (baseline 2.5KB). Master remains 4.9KB initial delta and 5.9KB lazy. All 68 route budgets pass. No dependency added.
- Lighthouse: locally UNAVAILABLE on Windows under the existing explicit launcher-cleanup limitation. Ubuntu CI 35523226814 passes both axes against corrected implementation `33f4ffcd`; three-run medians are recorded below.

Rendered screenshots were personally inspected across the six required desktop sizes, six phones and wide/zoom-equivalent states, including G/S, rig/building handoff, technical layers, convergence and static posters. Visual inspection corrected the convergence fragment/copy collision and the 320px technical composition; the final pixel gates confirm those corrections. Screenshots are retained locally in `node_modules/.cache/gs-r002-r1-final-screens` and CI retains its own Design scene evidence. Aesthetic owner approval remains separate from these checks.

Local logs: `%TEMP%/gs-r002-r1-static.log`, `gs-r002-r1-final-build.log`, `gs-r002-r1-served.log`, and `gs-r002-r1-proofs.log`. Exact staging commit, CI and protected Preview checkpoints follow.

### CI-driven loading correction

Implementation commit `730fdef28a6e091783305566efd3168820d7b1af` produced a protected, noindex Preview at `https://gridsmith-50asz0eqv-atikmurtazas-projects.vercel.app/design` (deployment `dpl_3EH2St2xbBU3jY3ZKJMETyVb5xnb`, development dataset confirmed in its build gate). [CI 35522419822](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/35522419822) exposed a real initial-layout regression: Design desktop performance 83, with CLS 0.3566 attributed to the stage SVG. LCP remained approximately 590ms and TBT 0ms. Mobile and later served steps did not run after the desktop failure.

The CSS still reserved the previous 38%-left / 62%-wide stage before the lazy renderer applied R1's 0%-left / 100%-wide workspace. The correction makes the server-rendered frame match the initial animation frame. No budget or Lighthouse assertion changed. A browser PerformanceObserver assertion reproduced the original built defect locally (CLS 0.3555, exceeding 0.02) before rebuilding; a reversible frame-resize probe also verifies the assertion can fail. This measures initial loading as well as settled chapter screenshots.

After correction: local loading CLS 0.0000; all nine deliberate-failure probes pass; full Design 20-size/intermediate/interaction/fallback sweep passes again. `verify:static` and a clean `verify:build` pass against the correction, including lint, typecheck, secrets and unchanged bundle ceilings. Correction logs are `%TEMP%/gs-r002-r1-cls-static.log`, `gs-r002-r1-cls-build.log`, `gs-r002-r1-cls-scene.log`; screenshots are in `node_modules/.cache/gs-r002-r1-cls-final-screens`. The full Ubuntu workflow must confirm Lighthouse and all served regressions before handoff.

### Corrected staging evidence

- Corrected implementation: `33f4ffcd47868d99f367d42752f9248c89106531`.
- CI: [35523226814](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/35523226814). Both Lighthouse axes and 14 of 15 served gates PASS; overall run failed solely on the two decorative-glyph axe incompletes described below. It is not represented as a green run.
- Immutable Preview: [Design R1](https://gridsmith-mq3kcm1ti-atikmurtazas-projects.vercel.app/design), READY; deployment `dpl_HDPsJwAocRFgQZYpAv8uKRe3hqKb`, exact SHA confirmed through deployment metadata and its Git source link.
- Vercel build gate explicitly reports `development`; authenticated page reports `noindex, nofollow`. Unauthenticated response redirects to Vercel authentication and carries `X-Robots-Tag: noindex`. No protection was disabled.
- Branch alias: `https://gridsmith-ltd-git-staging-gs-r002-design-atikmurtazas-projects.vercel.app/design`.

| Design Lighthouse median, 3 runs | Desktop | Mobile 4G / HTTP2 |
|---|---:|---:|
| Performance | 100 | 99 |
| Accessibility | 100 | 100 |
| Best practices | 96 | 96 |
| SEO | 66 | 66 |
| LCP | 584.8559ms | 1626.015ms |
| TBT | 0ms | 81.853ms |
| CLS | 0 | 0 |

The unchanged best-practices deduction is `/favicon.ico` returning 404; SEO reflects intentional staging noindex. These are reported, not hidden or corrected outside this phase. Reports are retained in CI's `lighthouseci-reports` artifact and locally under `node_modules/.cache/gs-r002-r1-ci-35523226814`. No initial/lazy JavaScript budget changed. Compared with the approved technical baseline, performance remains 100/99 and CLS remains zero; mobile LCP/TBT movement is small and is not presented as a measured speed improvement.

### Decorative glyph audit classification

CI 35523226814 measured zero axe violations, but returned two unresolved `color-contrast` incompletes on the single-letter G and S SVG nodes at 375px after scrolling: **"Element content is too short to determine if it is actual text content"**. Local timing had not exposed these in the earlier general sweep. Both nodes belong to the existing `aria-hidden="true"`, `focusable="false"` identity artwork. They are illustrative glyphs rather than readable service information. The semantic Brand heading, explanation and links remain HTML.

The harness correction records exactly those two selectors, on `/design` and only for `color-contrast` incompletes, with a removal condition. It does not suppress any violation or unrelated incomplete. The Design gate now also asserts that the SVG remains decorative, non-focusable and free of interactive descendants, alongside its existing smaller-G/dominant-S geometry check. No application source, CSS, performance budget or accessibility threshold changes in this classification correction. Local ESLint, the full general axe gate, and Design intermediate/interaction/fallback checks pass (`%TEMP%/gs-r002-r1-glyph-checks.log`).

### Final harness and handoff checkpoint

- CI [35539761718](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/35539761718) on `3ae4bf9d` and [35539860031](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/35539860031) on documentation checkpoint `74302091` failed because axe selected the same G/S nodes by their animated `transform` instead of the originally captured selector. Both Lighthouse axes and Design scene checks passed. The first run also reported one Master review-rating contrast sample at 375px (2.66:1); the latter passed the unchanged full Master gate. The investigation below reproduces and explains that intermittent sample.
- The revised glyph classifier uses axe's captured node HTML and the current, unique G/S node within the exact decorative SVG boundary. It requires the specific single-character incomplete reason, exact G/S text, `aria-hidden`, `focusable=false`, and no interactive descendants. This avoids racing an animated transform. Violations and all other incomplete matching remain unchanged.
- Eight browser proofs run with the axe gate: both changing-selector glyph cases pass; ordinary HTML, unrelated SVG text, altered wording, another incomplete reason, a removed decorative boundary and an interactive descendant remain unresolved. Standalone proof command: `node scripts/check-axe.mjs --prove-glyphs-only`. Proof, actual 375px Design DOM identity checks, a focused zero-violation mobile axe analysis, and full static suite passed locally; log `%TEMP%/gs-r002-r1-glyph-static.log`.
- Last exact Preview checkpoint: [Design R1](https://gridsmith-cqe0lf7dh-atikmurtazas-projects.vercel.app/design), deployment `dpl_FypWEUdzuP1QfXM9hpnZGa8e2iG4`, exact SHA `74302091407c89ecb596f820cf1cd1b223348d63`. READY, development dataset, authenticated `noindex, nofollow`; unauthenticated requests redirect to Vercel authentication with `X-Robots-Tag: noindex`.
- The classifier correction requires its own full CI and exact-SHA Preview before owner handoff. [Staging CI runs](https://github.com/atikmurtaza/Gridsmith-Ltd/actions?query=branch%3Astaging%2Fgs-r002-design) retain the branch-tip result; the final handoff names its exact ending commit, run and Preview. This record describes verified checkpoints, not an assertion that a pending run has passed.
- Sole next phase: owner visual acceptance of GS-R002-R1. Technical verification is not owner aesthetic approval and does not authorize Press, Digital, main advancement or production activity.

### Master contrast measurement correction (application unchanged)

A targeted 375x812 sweep of all 11 review positions reproduced the earlier CI failure: a side-card `/ 5` Range rectangle at `[349,626,16,18]` sampled 2.58:1. Screenshot inspection showed the text fragment is clipped; its perspective-projected rectangle includes bright scene pixels outside the card. Opposite black/white glyph renders produced zero painted text pixels in that rectangle, while the visible front rating measured 11.06:1. This is a false measurement of unpainted geometry, not a Master visual change.

The Master harness now samples the background beneath painted glyphs for review-card text only. Opposite-colour masks identify coverage independently of the real foreground colour; other text retains the existing rectangular sampling. The 4.5:1 / 3:1 thresholds, p98 percentile, scene visibility and motion budgets are unchanged. A rendered fixture proves visible text is measured, clipped text is absent, and an actual foreground change to the background colour fails. This proof runs in the normal gate (`--prove-review-mask-only` also runs it independently). The corrected full Master sweep passes all 11 viewports x six chapters plus bottom, reduced motion, no-WebGL and software fallback; the 375px reviews sample now measures 6.7:1 at its worst visible text. No Master application, palette or layout file changed. Diagnostic logs: `%TEMP%/r1-master-review.log`, `r1-master-glyph-review.log`; full corrected sweep: `gs-r002-r1-master-mask.log`.

### Corrected harness release checkpoint

- Harness checkpoint commit: `cbe3933c03c20777401ab6e6e8f54162c54564b1`.
- Full CI: [35541806964](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/35541806964). FAILED on two hardcoded colours in the new isolated contrast-proof fixture, before build/served checks. The fixture had been added after the earlier full static run; its local ESLint and rendered proof passed, but that did not cover the token-only gate. The follow-up now loads the existing Master theme and uses its canvas/ink custom properties. No gate exclusion or application token was added.
- Exact immutable Preview: [GS-R002-R1 Design](https://gridsmith-gueyykv66-atikmurtazas-projects.vercel.app/design), deployment `dpl_A4h5eEWS6B3pmn4y7RgoYH62YiZD`, READY, Preview target, exact full SHA confirmed. Build completed in 53s. Build logs explicitly confirm `development`, authenticated page reports `noindex, nofollow`, and both immutable URL and branch alias redirect unauthenticated requests to Vercel authentication with `X-Robots-Tag: noindex`. Five chapters and final hero inspected.
- Local final verification includes the full static suite, ESLint, secret scan, eight glyph-classifier proofs, real Design DOM/mobile axe check and the full corrected Master scene gate. Application build and all remaining Design checks are unchanged from the corrected implementation evidence above and are rerun in full CI.
- This follow-up changes documentation only. Its own exact branch-tip CI/Preview must pass before handoff; the final response records that ending SHA, run and immutable URL. No pending job is treated as a pass. Main remains `fbecbe01e7fb594c6163dab57514997cb248fc21`; production is untouched.

The token-only fixture correction passes its rendered positive/negative proof and a fresh complete `verify:static` run (`%TEMP%/gs-r002-r1-final-static.log`). Final branch-tip CI still owns the clean build, complete served chain and Lighthouse result. The final response must name that exact run and final Preview after success; earlier failed checkpoints remain historical evidence.

Retained coverage: 20 desktop/mobile/zoom compositions × five chapters; intermediate construction states; real hybrid mouse/touch input; rendered contrast; axe; keyboard CTA/disclosure; reduced-motion, no-JS, save-data, low-memory and failed-import posters. New assertions measure early wheel progress, side placement, G/S hierarchy, four distinct storeys/windows/coordinated systems, and rendered head/body/hair response and settling.

## Dependency audit

R1 re-audit, 20 September 2026: `npm audit --omit=dev` reports zero vulnerabilities. Full audit reports the same 27 affected development packages: 12 high, 13 moderate, 2 low, zero critical. Package manifest and lockfile are unchanged. Advisory/range/path/fix detail remains in `GS-R002-DEPENDENCY-AUDIT.md`; no force-fix, downgrade or implicit risk acceptance was applied.

## Unchanged scope and next action

Design remains five canonical groups, 16 services, 31 capability references, 72 deliverable rows. No service/content records or ownership boundaries change. Technical professional-scope/insurance gates GS-O005 and GS-X002 remain in force. No fake portfolio, prices or engineering specifications are introduced.

GS-O008 remains approved, Master polish deferred; GS-O019 remains resolved; GS-O020 remains CLOSED — PUBLISH. Production readiness is not granted by these tests. Production state is not refreshed in R1; previous dated read-only snapshots remain historical evidence only.

After final verification, the sole next action is **GS-R002-R1 owner visual acceptance**. Do not begin Press or Digital and do not fast-forward main.

Owner review checklist: hero symbol; faster hero pacing; left G/S construction; exact logo resolution; right mascot; face/quiff interaction; left four-storey sequence; electrical/water detail; final wave/convergence; Oxford Navy/Imperial Gold palette; mobile.
