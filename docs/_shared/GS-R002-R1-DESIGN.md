# GS-R002-R1 — Design owner visual remediation

Date: 20 September 2026. Status: LOCAL VERIFICATION PASSED; staging CI/Preview verification pending; owner visual acceptance pending.

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
- Eight deliberate-failure probes produce their own red: hero distance, storey removal, CTA, overflow, scene, chapter count, protagonist and rendered contrast. Clean baseline passes.
- Master: 11 viewports x six chapters, reduced-motion/no-WebGL/software-WebGL pass; hero passes 14 sizes. Digital/Press responsive, typography, legal, service and interaction gates pass. Their implementation files are unchanged.
- Bundle: Design initial 103.4KB gzip, route delta 3.2KB against 25KB; lazy choreography 2.6KB against 8KB (baseline 2.5KB). Master remains 4.9KB initial delta and 5.9KB lazy. All 68 route budgets pass. No dependency added.
- Lighthouse: locally UNAVAILABLE on Windows under the existing explicit launcher-cleanup limitation. Ubuntu CI must supply both final three-run medians before completion.

Rendered screenshots were personally inspected across the six required desktop sizes, six phones and wide/zoom-equivalent states, including G/S, rig/building handoff, technical layers, convergence and static posters. Visual inspection corrected the convergence fragment/copy collision and the 320px technical composition; the final pixel gates confirm those corrections. Screenshots are retained locally in `node_modules/.cache/gs-r002-r1-final-screens` and CI retains its own Design scene evidence. Aesthetic owner approval remains separate from these checks.

Local logs: `%TEMP%/gs-r002-r1-static.log`, `gs-r002-r1-final-build.log`, `gs-r002-r1-served.log`, and `gs-r002-r1-proofs.log`. Exact staging commit, CI and protected Preview are recorded below after publication.

Retained coverage: 20 desktop/mobile/zoom compositions × five chapters; intermediate construction states; real hybrid mouse/touch input; rendered contrast; axe; keyboard CTA/disclosure; reduced-motion, no-JS, save-data, low-memory and failed-import posters. New assertions measure early wheel progress, side placement, G/S hierarchy, four distinct storeys/windows/coordinated systems, and rendered head/body/hair response and settling.

## Dependency audit

R1 re-audit, 20 September 2026: `npm audit --omit=dev` reports zero vulnerabilities. Full audit reports the same 27 affected development packages: 12 high, 13 moderate, 2 low, zero critical. Package manifest and lockfile are unchanged. Advisory/range/path/fix detail remains in `GS-R002-DEPENDENCY-AUDIT.md`; no force-fix, downgrade or implicit risk acceptance was applied.

## Unchanged scope and next action

Design remains five canonical groups, 16 services, 31 capability references, 72 deliverable rows. No service/content records or ownership boundaries change. Technical professional-scope/insurance gates GS-O005 and GS-X002 remain in force. No fake portfolio, prices or engineering specifications are introduced.

GS-O008 remains approved, Master polish deferred; GS-O019 remains resolved; GS-O020 remains CLOSED — PUBLISH. Production readiness is not granted by these tests. Production state is not refreshed in R1; previous dated read-only snapshots remain historical evidence only.

After final verification, the sole next action is **GS-R002-R1 owner visual acceptance**. Do not begin Press or Digital and do not fast-forward main.

Owner review checklist: hero symbol; faster hero pacing; left G/S construction; exact logo resolution; right mascot; face/quiff interaction; left four-storey sequence; electrical/water detail; final wave/convergence; Oxford Navy/Imperial Gold palette; mobile.
