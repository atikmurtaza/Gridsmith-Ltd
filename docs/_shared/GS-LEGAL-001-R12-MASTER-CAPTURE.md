# GS-LEGAL-001-R12-MASTER-CAPTURE — bitmap/DOM geometry repair

8 October 2026. Baseline `b2179254ba4601c7e4747f5b8d86e8346b81d5f0`, branch
`claude/sweet-mendel-11qvli`. Local verification and independent read-only review precede
one scoped commit/push. Exact-SHA CI is mandatory; its final outcome belongs in the final
session handoff and ignored `build/master-capture/closeout.json`. No deployment is authorised.

## Confirmed capture defect

Both attempts of [CI 37812795783](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/37812795783)
failed the static caption beginning “Selected reviews from our Freelancer pro” at 320×568.
Glyph boxes `[24,254,248,24]` and `[24,285,172,24]` had foreground luminance
0.5142133418194795. Background p98 luminance was 0.16416275522416876 and
0.5341233765448787, producing 2.634507299034817:1 and 1.0352881317219356:1.
The two failed background PNGs have identical SHA-256
`2ec6d8227e58f7ed5e43e69c5e9bb66c666155aefcfbb2f05c91e884211c0019e`.

The bitmap paints previous/pause/next SVGs in the caption's sampling region even though
their actual button rectangles are around viewport y1016.67 and SVGs around y1026–1027,
outside this viewport. Fresh Linux focused execution reproduced the exact two failures.
A full baseline local run also passed: the underlying environmental/compositor trigger is
unisolated. Additional diagnostic captures change composition, so a later source frame
is explicitly labelled as a separate guarded capture. Neither a Chromium internals bug
nor a real application contrast defect is established by these observations.

Replacing only the screenshot options with an explicit document clip and
`captureBeyondViewport: true` makes the reproducing focused run pass: review-scene
minimum 6.7:1, transit minimum 6.1:1. Text-fill-only, additional animation frames and an
SVG-visibility exception did not correct the exact failures; those experiments were discarded.
Explicit clipping with `captureBeyondViewport: false` also retained misplaced controls.
Installed Puppeteer forces that viewport-surface path for captures without a clip.

## Minimal correction and permanent proof

Only the Master gate's capture path changes; application CSS, wording, ring, motion,
tokens and fallback are unchanged. Every existing capture uses the same helper. The clip
is `{x:scrollX,y:scrollY,width:innerWidth,height:innerHeight}`, without full-page capture or
viewport resizing. The helper rejects non-unit device/visual scale, visual viewport offsets,
wrong PNG dimensions, changed scroll, changed ring transform, and changed text geometry or
composed opacity during capture. All 14 acceptance questions, all 12 viewports, glyph masking,
98th-percentile sampling and 4.5:1/3:1 thresholds remain unchanged. No new sleep is added.

A Windows reduced-motion bare-scene capture exercised the guard: scroll/ring were unchanged
while hidden text widths changed during the screenshot (148→115 and 248→212 pixels).
The rejected frame was not counted as acceptance. Font readiness alone did not cure it;
that experiment was discarded. Font-face state and computed CSS were recorded in
`build/master-capture/font-diagnosis.log`, without inferring browser internals from them.
The collector was including text explicitly hidden by the bare-scene mask because its
hit-test admitted an ancestor containing the hidden node. It now requires computed
visibility to be visible. Colour-transparent background/mask subjects still qualify;
faded text still qualifies; a child explicitly visible under a hidden parent still qualifies.
The existing hiding proof asserts both that leaked visible text is collected and that
explicitly hidden descendants contribute zero boxes, with unchanged geometry. Guard
failures retain before/after metadata. No `document.fonts.ready` wait or new sleep remains.

The same strict guard then rejected the first visible fallback capture, with changed
glyph metrics and unchanged scroll/ring. Pixel-test pages now complete one unmeasured
document-clipped initial raster before collecting glyphs. Subsequent measured captures
still reject any geometry change; no failed measurement is retried or accepted. The
software-WebGL visitor/TBT question takes no screenshot and retains its original lifecycle.
The first-raster rejection is `build/master-capture/fallback-first-raster-rejection.log`.
This is capture synchronisation demonstrated locally, not attribution of a browser bug.
Primed captures establish stable settled measurements; first-frame/hydration and live
rotation evidence remains the separate review UI/lifecycle checks, not the primed bitmap.

The expanded Linux run exposed an additional 412×915 capture race: scroll changed
5135→4183 while screenshotting the bare scene. The rejected frame was not acceptance.
Reading document layout dimensions before scroll/clip coordinates resolves the focused
reproduction, including without the initial raster; a document-height read alone does
not resolve Windows's first-raster case. The final helper reads and guards document
width/height first as well as the viewport, scroll, ring and painted glyphs. A permanent
specimen changes only document height during capture and must fire the pose guard.
Receipts: `build/r12-ci-fix/capture-final-412.log` (rejection),
`capture-layout-412.log` (expanded diagnosis), `capture-layout-flush-412.log` (narrow
layout-read correction, all 14 questions PASS). The browser's underlying trigger remains
unisolated; these are independently demonstrated capture-path corrections.

Permanent specimens in the existing gate establish document-to-bitmap marker mapping at
three scroll positions; reject shifted pixels, incorrect dimensions, device scale and moving
DOM; measure a static caption becoming unreadable and its faded opacity; and retain existing
visible/clipped review glyph, opacity-zero/fractional-opacity and clipping proofs. The live
`PROBE=r4b` clipping proof fires its own question 4 at step 1, then restores every subject
byte-identically. That is `check:reviews:ui`'s front-review readability question, not the
scene's motion question 4. It is not credited merely because some other question also fails.

`MASTER_SCENE_DIAGNOSTICS=1` defaults to the explicitly FILTERED 320×568 run.
It stores source/background/labelled-overlay PNGs and JSON in ignored `build/master-scene`:
browser/runtime, fonts/hydration, paused state/ring angle, before/after CSS/geometry,
document and bitmap coordinates, canvas dimensions and actual shader uniforms, exact
glyph/background p98 pixel/RGB/luminance and contrast. The source image is a subsequent
independently guarded frame. CI failure artifact upload follows this ignored path; diagnostic
mode is not enabled in normal CI. No diagnostic code enters application bundles.

## Environment and evidence

Failed CI: Ubuntu 24.04 runner image 20261004.327, Node 24.21.0/npm 11.19.0,
Puppeteer Chrome 148.0.7778.97. Local disposable Linux: Debian Bookworm, the same
Chrome revision and Node 24.21.0 (official archive SHA-256 verified). This is a close
reproduction, not an exact Ubuntu environment match. Windows uses Node 24.15.0 and the
same Puppeteer Chrome. Linux Lighthouse 12.6.1 uses Chrome 154 with existing assertions;
it is separate from the scene browser.

Ignored evidence: `build/master-capture/ci-attempt-{1,2}.log`, `attempt-{1,2}/`,
`build/r12-ci-fix/capture-baseline-320.log`, `capture-baseline-full.log`,
`capture-document-320.log`, `capture-corrected-320-{1,2,3}.log`,
`capture-clipped-proof.log`; `build/master-capture/final-helper-proofs.log`.

Final labelled Windows 320×568 diagnostic: scroll `[0,4996]`, document clip
`[0,4996,320,568]`, bitmap `[320,568]`, loaded fonts, hydrated ring paused. The
corresponding two caption lines measure 8.437715280694405:1 and 8.597307625240731:1;
p98 pixels are `[42,34,20]` at `[27,265]` and `[42,32,16]` at `[169,285]`. Foreground
luminance remains 0.5142133418194795. The third line is 6.653830203189124:1. Caption
document y positions are 5250/5281/5312; control buttons are viewport y994.984375,
outside the bitmap. Before/after geometry is guarded independently for background,
masks and source. The second Windows glyph box rounds to 173px versus CI's 172px;
this is not claimed as an exact Linux geometry match. Files:
`build/master-scene/capture-320x568-reviews{,-source,-background,-overlay}` (JSON/PNG).

## Verification and independent review

Independent read-only reviewer: PASS, no blockers. Reviewer checked the capture API path,
coordinate/pose assertions, unchanged thresholds and all 14 questions, and independently
ran the permanent adverse proofs. Source-frame timing and unisolated baseline trigger are
explicit limitations above, not claims of an exact paired frame or an application defect.

Final local verification and exact-SHA CI receipts are recorded at session closeout.
Checks include repeated 320×568 and the complete scene matrix, review autoplay/manual/pause,
hydration, transitions, reduced motion, no-WebGL and static fallback; prior Digital and Press
repairs; clean build/static suite; axe/responsive/no-JS; Linux desktop/mobile Lighthouse;
legal parity/adoption/fingerprints, company/VAT, static artifact/UI and security checks.

The frozen Linux Master matrix passes all 12 viewports and all 14 questions. Reviews/transit
minimums: 320×568 6.7/6.1:1, 360×740 6.7/6.0:1, 390×844 6.9/6.1:1, 1440×900
8.7/8.1:1. Reduced motion holds the same composition; no-WebGL/static fallback top-to-bottom
and software-WebGL decline pass, the latter recording 0ms blocking. Receipt:
`build/r12-ci-fix/capture-frozen-full-master.log`/`.exit` (0).

Final full `verify:static`, clean Windows and Node-24.21 Linux builds, static artifact/UI,
76 normal axe analyses plus two deferred-footer analyses, responsive 51 combinations,
legal parity, company/VAT, review active/manual/pause/reduced/no-JS and Press gates pass.
The private export measures 70 legal responsive/keyboard states, 102 links and 41 focused
axe analyses with zero violation rules. An earlier Windows repetition failed question 8
at 288ms blocking while other tests were running, with capture/contrast/geometry checks
passing. That failed result is retained, not represented as a pass or fixed by threshold
change. Final repetitions and performance audits run sequentially without competing tests.
Frozen final Linux 320×568 repetitions: three of three pass all 14 questions, each with
0ms software-WebGL blocking. Receipts: `build/r12-ci-fix/capture-frozen-320-{1,2,3}.log`
and `.exit` (all 0). Digital and Lighthouse resume only after these browser runs finish.

Both Linux Lighthouse axes pass their unchanged assertions: 11 routes × three runs per
axis, all 66 individual accessibility scores 1.00. Desktop performance/accessibility/best
practice medians 1.00 on every route; mobile performance medians 0.99, accessibility/best
practice 1.00. Mobile Master/Design/Digital/Press LCP medians 947/959/898/1086ms and TBT
100/108/129/107ms. SEO remains the deliberate private/noindex profile, not a launch claim.
Reports: `build/master-capture/lighthouse-{desktop,mobile}/` and
`lighthouse-summary.json`. Full Digital scene gate passes, minimum compass contrast 7.45:1;
Press flags minimum 6.21:1. Design's full gate also passes.

The earlier combined `verify:served` invocation returns 1: its Master command ran the
helper still under investigation and hit the recorded 412px guard rejection. Its other
19 commands all pass, including both Lighthouse axes. The repaired frozen Master full
matrix and three repetitions above are separate successful reruns; the failed aggregate
receipt is retained, not relabelled as green. The application/build subjects are unchanged.
Local requested checks are complete across those runs; exact-SHA CI must run the whole
suite successfully before closure. Receipt: `build/r12-ci-fix/capture-final-served.log`.

## Preservation and stop boundary

All adopted legal source, register, fingerprints and production publication prerequisites
remain byte-identical to baseline. Seven OWNER_ADOPTED, zero PUBLISHABLE. Offline production
CMS dry run retains 47 eligible documents and ten exclusions (seven legal, three Technical).
Private legal-review output remains development-only, 62 routes/219 files and 102 legal links;
its source-modified build receipt is local verification, not an exact-commit deployed artifact.
No reseed, form submission, email, provider mutation, deployment/dispatch, DNS change,
main merge, Production Edge, H4-B/H4-H, hosting purchase/migration or legal publication.

Successful exact-SHA push CI closes R12 CI only. Next phase requires separate owner authority:
**GS-LEGAL-001-R13 private Hostinger staging deployment and served acceptance**, retaining
`GS-LEGAL-001-R12-STAGING-READINESS.md` destination, rollback, auto-deploy-OFF and hosted
acceptance controls. If CI fails, staging remains HOLD. STOP before R13.
