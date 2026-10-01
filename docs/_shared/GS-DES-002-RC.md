# GS-DES-002-RC — Gridsmith Design release candidate

## Authority and release boundary

Verification date: 30 September 2026. The owner explicitly **visually approved** the complete
Gridsmith Design experience after `GS-DES-002`, `GS-DES-002-R1` and `GS-DES-002-R2`. That result is
frozen; this phase verified it, corrected the defects verification found (below) and promoted it to
staging. It is not a design phase.

Staging only. Branch `staging/gs-press-001-press`, starting HEAD and remote
`61025fbae7386accbf678739a1f8adcd58356bd5`; main `fbecbe01e7fb594c6163dab57514997cb248fc21`
(untouched). Production deployment, aliases, DNS, production Sanity and production Supabase are
outside the phase.

**Master isolation.** The working tree also holds the approved, uncommitted local Master candidate
`GS-MASTER-001-F` (`app/(marketing)/page.tsx`, `app/(marketing)/about/page.tsx`, the three division
`layout.tsx` metadata descriptions, `components/chrome/nav.ts`, `components/master/*`,
`scripts/check-master-*.mjs`, `scripts/prove-master-scene.mjs`, `scripts/seed-content.mjs`). None
of it is in the Design commit and none of it was modified: Design depends on no Master change, and
all Design verification ran in a separate worktree at `61025fba` plus the Design files only, which
is exactly the tree CI receives. Pre-existing hashes of every Master and unrelated file, the
approved Design sources and the starting `git status` are kept in ignored
`node_modules/.cache/gs-des-002-rc/`. Untracked `.codex/`, `AGENTS.md` and the owner reference page
`public/brand/design/preview.html` (unused by `/design`) remain preserved and unstaged.

## Approved experience (frozen)

| Area | Approved and delivered |
|---|---|
| Flow | Continuous, content-led native scrolling. Each chapter's copy is page content (sticky, in normal flow): it arrives, dwells, and leaves with the scroll while the next arrives. No chapter blink or fade replacement; no copy waits for an animation. |
| Rhythm | `designTimeline.ts`: every transformation sits in a passing interval (copy leaving, next arriving); each finished artefact resolves within 0.15 of its copy settling and then holds (Brand 3D logo 0.36, mascot 0.50, building 0.40, final 3D logo 0.40 of a chapter). |
| Brand | G/S construct → exact Gridsmith mark → the supplied genuine 3D metallic logo resolves over the exact geometry and holds with its copy. |
| Brand → Motion | 3D logo → structural bars/spheres (swapped in under it) → strokes and nodes → construction outline → canonical mascot. Never blank. |
| Motion → Technical | Mascot → rig → technical construction; completed coordinated building dwells. |
| Final | Building compresses into the mark; the genuine 3D logo resolves in full view. |
| Footer handoff (≥768px, R2) | The stage stays pinned through the docking interval; the story's box runs on under the footer (`--ds-footer-h`, negative margin: layout unchanged); one continuous position/scale function glides the final 3D mark into the footer's mark slot; the footer paints above the run-on and stays clickable; wave and caption recede. No JS release compensation, no coordinate-space jump. |
| Footer mark | The shared decorative footer mark is `visibility: hidden` on `/design` only (`body:has([data-design-story])`), keeping its place; every other route keeps it (`/` keeps its own `display:none`). |
| Phones (<768px) | Owner-approved R2 native ride-away: the final mark leaves with the page (monotonic), no docking. |
| Reduced motion / Save-Data / low memory / failed import / no-JS | Static resolved posters: Brand 3D logo, mascot, building, final 3D logo; no morphs, no shine loop, no scroll hijack, no duplicate footer mark. |

## 3D logo delivery

`public/brand/gridsmith-logo-3d.png` (2400², 3,317,305 B, unchanged) is referenced by an SVG `<image>`
through the existing Next image optimiser at one URL, `/_next/image?url=%2Fbrand%2Fgridsmith-logo-3d.png&w=1080&q=75`,
aligned over the exact procedural geometry (x 263.75, y 246.5, 460²). Measured on the production build at 1440×900 and 390×844, walking the page: one request, `200 image/webp`, 41,742 B body (42,042 B transferred), no request for the raw PNG; the gate's `payoff-3d` also asserts the asset arrived and changes its box's pixels at both payoffs.
The procedural bars/spheres remain in the SVG for every transformation; the image is the resolved
payoff only.

## RC corrections (after owner approval)

Verification found two genuine accessibility regressions introduced by R1's content-led flow
(DES-RC-01, -02) and one gate allowance R2's docking required and never received (DES-RC-03). All
three were invisible to the R1/R2 sessions: those ran the Design gate's filtered `--des002-only` /
`--glide-only` development modes, which skip the G1/G2/chapter sections, and did not run `check:axe`
— the K-13 pattern. Each is corrected at the smallest scope; the artwork, timeline, footer glide and
composition are unchanged.

| ID | Defect and evidence | Correction | Proof |
|---|---|---|---|
| DES-RC-01 | G2 closed Technical scope note, stacked layout at heights ≤650px: the arriving Technical copy now crosses the half-built roof (progress 2.92) with a transparent note — 3.28:1 at 430×650 and 760×650, 3.98:1 at 320×568/430×568/600×600/700×600 (min 4.5). The rule's own premise ("the compact ≤650px layout keeps the note clear") stopped being true at R1. | The approved G2 note paper applies at every stacked width (`max-width: 760px`), not only above 650px height. On the Technical chapter the surface is already paper, so the only visible change is that the note occludes the roof lines while crossing them — the treatment the owner approved for taller phones. | G2 surface assertion follows the rule (`width <= 760`); all 24 G2 sizes now read **6.69:1** minimum (the original approved G2 figure). |
| DES-RC-02 | The stage caption (`.ds-stage-label`, text) sits inside `.ds-stage-art`, which R1 dims to 0.28 as copy passes ("the scene recedes"); R2 also faded it with the scroll at the footer. A 20px scroll sweep found it on screen below 0.9 effective opacity at 33–38% of positions at six sizes from 768×1024 to 2400×1350 (worst 0.36 at 1280×720, 0.49 at 1440×900). axe: `color-contrast` 3.59:1 at 1440×900. | The caption is whole or hidden: shown only while the art is fully opaque and the story is not leaving, otherwise hidden on a `--dur-fast` opacity transition, so no scroll position can hold it part-faded. The artwork's own recession and the wave are unchanged. +14 B gz. | New `label-fade` key in `check:design:scene` (every handoff sample, all seven R1 sizes) with its own probe; holds at all seven sizes. |

| DES-RC-03 | `check:axe` red: on `/design` at 1280px (initial and scrolled) every footer text node was UNRESOLVED `color-contrast` — "overlapped by another element" / "background gradient". Cause: R2's approved docking — the positioned, `pointer-events:none` story runs on under the footer with a gradient surface sized to stop at its end; axe reads that transparent layer and declines. Nothing covers the footer: `elementsFromPoint` at footer text returns text → footer (#0a192e) → body, and screenshots show the footer on its own navy with the docked mark. Zero violations. | No application change. `check:axe` maps a `/design` decline inside `body > footer`, for exactly those two reasons, to one allowlisted target (the existing `digitalSceneTarget` classifier with Design-footer scope; 5 positive/negative proofs run every time). The allowance rests on a new measurement: `check:design:scene` `footer-contrast` pixel-measures every on-screen footer text box at the 0.5, 0.2 and bottom handoff positions at all seven R1 sizes. | `check:axe`: 76 analyses, zero violations, 0 unresolved. `footer-contrast` proven red (footer painted in its own `--chrome-ink`). |

Gate hygiene in the same file: the G2 evidence screenshots named positions R1 no longer samples
(3.15/3.65 → 2.92/3.2); `textContrast` takes the glyphs to hide as a parameter (default unchanged),
because the footer's text is outside `.ds-copy`; the `overlap` proof now requires the overlap
predicate's own message — it had been credited on a seek failure sharing the key, while the predicate
("no moment in 1→2 …") did fire in the same run. The first `footer-contrast` probe
(`background: currentColor`) was **inert** — the measurement makes the footer's colour transparent,
which removed the probe's background with it — and the harness refused it ("failed to produce its own
red"); the probe uses the ink token instead.

**Scroll-map seek race (gate only).** Two runs of the full gate timed out in G1 (`seek 2.15` at 375×812,
`seek 4.3` at 320×568) after an earlier run passed the same step. Reproduced: G1 closes a disclosure
and seeks at once; the renderer republishes `data-map` from a ResizeObserver a frame later, so the seek
used the disclosure-open map — at 320×568 it computed y 1700 for 2.15, which the settled map reads as
2.468, and the progress wait timed out. `seek` now waits until the map is unchanged across two frames
before reading it (y 1555 → 2.150). No page defect: a reader never seeks by the map.

## Gates added or wired

- `check:design:timeline:selftest` (`scripts/check-design-timeline.selftest.mjs`) — five rhythm
  checks on the real timeline, eleven broken fixtures each red on its own branch. Now in
  `verify:static` and CI (it was omitted).
- `check:design:scene` R1/R2 section (existing, from R1/R2): dwell, content-flow, overlap, no-blink,
  payoff-3d, payoff-dwell, morph-outline, morph-blank, footer-glide, footer-reversal (read straight
  after each scroll, before any listener runs, and after the redraw), footer-duplicate,
  footer-collision, footer-dock, footer-scope; plus RC `label-fade`.
- Gate review: the mixed-colour parser (`color(srgb …)` channels 0–1) is correct in the Design
  gate. The same unguarded parser exists in `check-digital-scene.mjs` (`textContrast`) and
  `check-master-scene.mjs`; no Digital, Master or Press text computes to `color(srgb …)` today (measured at 1440 and 390 on `/digital`, `/`, `/press`), so it is latent, not a false result — follow-up if a mixed colour ever reaches text there. Not modified (Digital frozen, Master candidate).

## Verification evidence

All local runs on the Design-only worktree (HEAD `61025fba` + this commit's files), clean `.next`, Windows,
Node 24. Lighthouse cannot run on Windows (VALIDATION §13) — CI is its evidence.

- **Static:** `verify:static` exit 0 — TypeScript, ESLint (0 warnings), colour-literal selftest,
  no-hardcoded-colours (261 files), `check:contrast` (44 pairs / 5 themes, chrome, size, permission and
  opacity passes), state cues, headings, invented content, claims, control characters, schemas, RLS,
  lead security, all selftests, `check:lists`, service content, reviews, company, Master scene
  selftest, and `check:design:timeline:selftest` (5 checks; 11 broken fixtures, every branch red).
  `git diff --check` clean.
- **Build and budgets:** `verify:build` exit 0 — no service-role key in 47 client chunks, tokens,
  theme flash, bundle sizes: `/design` delta **3.6 KB** (budget 25), Design lazy scene **8,070 B gz = 7.9 KB**
  (budget 8 KB, not eager on any route), Master lazy scene 5.9 KB; 69 routes within budget. No new
  dependency, no source maps in `.next` or requested.
- **`check:design:scene` PASS** — R1/R2 at 360×740, 390×844, 430×932, 768×1024, 1024×768,
  1440×900, 1920×1080 (dwell, content flow, overlap, no blink, caption, 3D payoffs, payoff dwell, morph,
  footer glide, reversal, footer contrast; footer-scope on `/press`, `/about`, `/digital` and a Design
  service page); G2 at 24 sizes (6.69:1); G1 at 320×568–1280×720 (one H1, three disclosures,
  keyboard/focus, titles, contrast, closed surface, axe); the 25-size chapter matrix
  (320×568 … 3200×1800, including 2400×1350, 2560×1440, 2844×1600) with axe at 1440 and 375; R2
  lifecycle; reduced motion, no-JS, Save-Data, low memory and failed import at 1440×900 and 375×812.
- **Footer glide:** largest step beyond the glide's own pace **0.0 px** at all seven sizes; centre-Y
  one leg (monotonic) through 70–81 steps, each read straight after the scroll (before any listener)
  and after the redraw: 360 595→−304, 390 678→−219, 430 748→−149 (phones ride away), 768 536→394,
  1024 428→290, 1440 502→421, 1920 603→602 (≈1 px of travel: 0 legs). No reversal, jump or scale step.
- **Proofs (`prove:design:scene`):** 28 deliberate failures, each red on its own key — loading shift;
  footer-glide, footer-reversal (R1's compositor release), overlap (its own predicate), content-flow,
  no-blink, label-fade, payoff-3d (asset blocked; asset clipped), dwell, payoff-dwell, morph-outline,
  morph-blank, footer-contrast, footer-duplicate, footer-collision, footer-dock; hero-distance, storeys,
  CTA, overflow, scene, chapters, protagonist, text contrast (incl. mixed-colour label), clipped mobile
  panel, scope note without paper. Browser-only; no source mutated.
- **`check:axe`:** 76 analyses (19 routes × 375/1280 × initial/scrolled), **zero violations**, 0
  unresolved; Design-footer classification 5 positive/negative proofs. Its standing lead probe wrote
  no row; its notification branch used the development Resend key (owner-only delivery), as in every
  RC — not a contact-form submission.
- **Other served gates** (same build): security headers (CSP, framing, referrer, MIME, permissions,
  HSTS; no `X-Powered-By`), launch content, responsive (17 routes × 375/768/1440, no overflow),
  consumer terms, legal parity 6/94/339, VAT, Press type and scene, Path Finder live, service content,
  reviews UI, company facts, Master scene (11 viewports), Master hero (14 sizes), Digital scene — all PASS.
- **Independent walk:** `/design` footer links 20/20 hit-test to themselves at the bottom (1440, 390);
  reduced motion at 1440/390: posters Brand 3D logo, mascot, building, final 3D logo, no running
  animation, footer mark hidden, no overflow; keyboard 32/31 stops, every one with a visible on-screen
  ring; cross-route smoke `/`, about, approach, insights, contact, design, digital, press,
  legal/privacy at 1440/390: header, footer (20 links), one H1, no overflow, no runtime error, noindex;
  footer mark hidden on `/` (`display:none`) and `/design` (`visibility:hidden`) only.
- **Master candidate:** the owner's local server still serves `/` with the `GS-MASTER-001-F` headline
  (200); its files are byte-identical to the pre-RC hashes.

## Deferred and production-gated

- **Production dependency advisory (new since the last RC):** `undici` 7.29.0 (high; fixed in
  7.29.1), reached in production only through `get-it` (the Sanity client), server-side, requesting
  Sanity's API. `package-lock.json` is unchanged since 11 September; the advisories post-date the
  previous RC. Not a Design change and not bumped inside this commit — a separate dependency-patch
  task, before production cutover.
- `GS-O003` solicitor confirmation · `GS-O010` Preview isolation (no valid submission made) ·
  `GS-O021` TikTok written logo permission · `GS-O022` official Freelancer asset · production CMS
  migration · legal list-semantics migration · final Master RC (`GS-MASTER-001-F`, local) · final
  integration/programme RC · controlled production cutover · `GS-DIG-002` Digital Route Map/radar
  pacing refinement (after this RC).

## Exact-SHA release receipt

The final commit cannot contain its own hash. Following the Design/Press/Shared RC convention, the
final SHA, remote/main checks, CI run and Lighthouse medians, and the protected Preview URL,
deployment, SHA, protection and runtime smoke are recorded in the release handoff and
`node_modules/.cache/gs-des-002-rc/final-release-receipt.json`. The candidate is accepted only once
CI and Preview pass for that exact SHA. No launch or next phase is authorised.

## GS-DES-002-M1 (+ R1, R2) — Technical readability and ultra-wide containment (owner-approved; RC below)

**Trigger.** `GS-DIG-002-RC`'s exact-SHA CI (run `36734877438`, `f7e45436`) is the first run to reach
`check:design:scene` on Linux: this RC's own CI (`4df670d2`) stopped earlier, at the then-failing
`/digital` mobile LCP. **`GS-DIG-002-RC`'s Digital mobile performance passed** (1748 / 1745 /
1733ms, median 1745ms against 1750ms). The run failed only at `detail 2.75: pixel contrast Technical
Design: 3.40:1; needs 4.5` (1440×900, touch). Not a Digital regression; Digital is unchanged.

**Cause.** At 2.75–2.8 the Technical copy arrives on the right while the building is still sliding
from the Motion side (`--ds-art-left` 40% → 0%) and is only partly receded (stage-art opacity ≈0.64).
The small muted mono kicker lands on the building's slab fills, a column, linework and two rig joints.
Measured on HEAD at 1440×900 (touch and not): 2.7 4.56–4.86, 2.75 3.97–4.34, **2.8 3.76**; 1920×1080
2.75 3.71, 2.8 3.45. Touch makes no difference. The gate sampled 2.75 but not 2.8, the worst state.
Neither the rig joints (`fill: --ds-night`) nor the column alone set the reading: hidden together it
still read 4.3–4.5 — the slab and line drawing does.

**Correction (Design-local, CSS only).** Like the stage label, the enhanced-story kicker carries its
own chapter surface (`--ds-surface`), sized to its line (`fit-content`, `0.5em` inline padding offset
by a negative margin — no layout change): invisible on a plain surface, a small drafting label where
the drawing passes behind. Geometry, timing, rig, building, colours and the scroll map are unchanged.
Static/reduced-motion/no-JS layouts are outside `[data-enhanced]` and unchanged. Where G1 turns an
expanded phone disclosure to paper, `--ds-surface` follows the paper too: the first full-gate run
without it read the Motion kicker at 2.31:1 (night label on paper copy) at 360–430px — caught by the
existing `expanded motion-dimensional` pass, fixed, re-run green.

**Gate.** `check:design:scene` samples 2.8 as well as 2.75 in its detail pass, and `--prove` adds
*PROVEN RED Technical kicker contrast without its surface* (1440×900 touch, 2.8: the kicker is
measured clean, its surface removed, and the reading must name `Technical Design`). The red is its
own validity proof: the subject is the kicker over the drawing. Since R1 recedes the drawing at 2.8,
the proof also forces the building detail back to full strength — without that the removed surface
was inert (the first R1 `--prove` run: *removed-surface proof did not fail*).

**GS-DES-002-M1-R1 — the Technical intro.** M1 found the intro paragraph ("Parts become an
assembly…") crossing the same building below 4.5:1 on HEAD too, at states the gate did not sample:
1920×1080 @2.8 **3.43:1** (3.13 on another run), 390×844 @2.8 4.07:1; 1440×900 passes. *(RC
correction: from 1920 wide the intro renders as large text — the gate's threshold there is 3:1 — so
1920's 3.13–3.43 was not a failure. The real failures R1 removes are 2048×1152 @2.8 **2.42:1** and
2133×1200 2.59:1 against 3:1, and 390×844 4.07:1 against 4.5; see GS-DES-002-M1-RC.)* Layers,
measured by hiding each: on wide screens the building's **linework** (strokes hidden → 6.20:1); on
phones the **solid roof** still dropping into place (assemble 2.72–2.90, ghost from 2.93; hidden →
5.22:1). Slab fills, columns, rig and wave move nothing. The shared copy-over-art recession
(`cover`) cannot carry it: it weighs the whole copy block against the whole art box, so the wide
Technical column reads ~18% cover (art ≈0.7), and on phones it is already at its 0.28 floor.

*Correction (Technical only):* `TECHNICAL.copyOver [2.66, 2.76]` and `copyClear [2.84, 2.90]`
(`designTimeline`) recede the building's **detail** group — floors, roof, columns, linework,
dimensions — to 0.2 while the Technical copy crosses it, and return it by 2.90, before the
dimensions and roof-ghost beats; the building outline and rig stay at full strength, so the
building reads as its contour. No other chapter, the shared `cover`, the construction sequence or
the completed-building dwell changes (the building now resolves at `max(…, copyClear[1])`, still
3.1). Both ranges are in the self-test's Motion → Technical placement check. The lazy scene chunk
grows 43 B gz (8,078 → 8,121; ceiling 8KB, ~70 B left).

*Gate:* every one of the 25 sizes now samples 2.8 (*technical transit*) through the same text sweep,
and `--prove` adds *PROVEN RED Technical intro contrast with the building detail unreceded*
(clean, then the detail forced to opacity 1 — exactly its value there without the recession — must
name `Parts become`; subject corrected at RC from 1920×1080 to 2048×1152 @2.8, see below).

**GS-DES-002-M1-R2 — ultra-wide containment (owner decision: contain the artwork, do not fade it
away).** R1's 2.8 sampling across all 25 sizes found 2844×1600 and 3200×1800 red (scope note 2.23:1).
Measured on R1: up to 2133×1200 every Technical line holds ≥5.31:1; from 2400 it fails — 2400 intro
4.68, 2560 3.96, 2844 note 2.68, 3200 note 2.58 — and at 2.6 the Technical H2 crosses the fading
mascot at 2.6–2.9:1 (3:1 floor), 1.46 at 3200 @2.5. Cause: the stage box is a percentage of the
viewport (60% × 88svh for chapters, 100% for the hero) and the SVG is `meet`-scaled into it, so the
drawing's scale grows linearly (chapters 0.6·vw/1000: 1.152 at 1920, 1.920 at 3200); the copy is rem
and does not. At 2.8 the drawing reaches ~62% of the width at every size, but the paragraph sits at
74% of the height at 1920 and 53% at 3200 — over the rig's densest middle. Deeper recession (joints on
paper, rig and outline at 0.35, wave at 0.5) still left 3200 at ~4.8 and 2844's note at ~4.4.

*Containment (CSS only, 0 B JS):* in landscape (`min-width: 761px` and `min-aspect-ratio: 3/2`) the
stage box stops growing at its 1200px-tall size — `height: min(88%, 1056px)`, the hero
`min(100%, 1200px)`. On a landscape screen height is the limiting axis, so the drawing's scale stops
there (≈1.32; hero 1.5). Everything inside the SVG — the supplied 3D logos, mascot, building, final
mark — moves together, and `footerDock` reads `getScreenCTM()`, so alignment and the footer glide
follow. The box keeps its own top, as on every screen up to 1200px tall: a vertically centred cap was
measured and failed (intro 4.27–4.60, H2 2.6) because it moves the drawing's dense middle to where
the arriving copy is. *Threshold:* 1200px tall is where `min()` starts to bind, so geometry up to
2133×1200 is identical by construction — measured identical (scale, box, SVG origin, building and copy
positions at 0 / 1.3 / 2.25 / 2.8 / 3.3 / 4.3) at 390×844, 768×1024, 1024×768, 1440×900, 1920×1080,
2048×1152, 2133×1200 and 1024×1366 portrait; the scale continues from 2133's 1.28 to 1.32 at ~2200
and holds, so there is no snap in width. The aspect condition keeps portrait and near-square screens
over 1200px tall (a 1024×1366 tablet) on their own composition; resizing a >1200px-tall window across
3:2 moves a width-limited drawing a few tens of px. The rig joints (`--ds-night` fill) and the wave
cause no remaining failure once contained and are unchanged.

*Gate:* each size's transit sample now reads 2.6, 2.75 and 2.8 (the H2, the intro and the kicker/note
states), and `--prove` adds *PROVEN RED ultra-wide Technical contrast with the stage uncontained*
(3200×1800 @2.8: clean, then the box forced back to 88% must name Technical copy).

**Local evidence — M1 + R1 + R2 (HEAD `f7e45436` + this change, clean worktree without the Master
candidate, clean `.next`, Windows).** Minimum readings over 2.5 / 2.55 / 2.6 / 2.65 / 2.7 / 2.75 /
2.8 / 2.85 / 2.9 / 3.0 at 390×844, 768×1024, 1024×768, 1440×900, 1920×1080, 2048×1152, 2133×1200,
2400×1350, 2560×1440, 2844×1600 and 3200×1800: kicker 6.69:1 everywhere; intro 5.10 (2400×1350),
5.32 (390×844), ≥5.69 elsewhere; scope note ≥6.55; every other line of copy (H2 included) 6.69.
`check:design:scene` PASS (all 25 sizes sampled at 2.6 / 2.75 / 2.8 in transit; the same loop fired
on 2844/3200 in the R1 run, so it reaches its subjects); `--prove` PASS, 31 PROVEN RED, among them
the kicker (drawing held at full strength), the intro (detail unreceded) and the ultra-wide stage
(uncontained). M1's kicker proof on the unchanged HEAD build stops red at *Dirty Technical kicker
baseline: 3.62:1*. The GS-DES-002-R1 continuity/footer section (`R1_SIZES` stops at 1920×1080) was
also run at 2400×1350, 2560×1440 and 3200×1800 from a scratch copy: dwell, flow, overlap, no blink,
caption, 3D payoffs, morph, footer glide (one leg, 0.0px beyond pace), reversal, dock, footer
contrast and no duplicate footer mark all hold. `tsc`, ESLint (Design files), `lint:colors`,
`check:contrast`, `check:design:timeline:selftest` and `git diff --check` clean. `/design` JS delta
3.7KB of 25KB; lazy Design scene 8,121 B gz (R1 +43 B; R2 0 B, CSS only; ceiling 8KB). Digital,
Press, shared chrome/styles and the 15 Master-candidate files untouched (hashes recorded before and
after). Linux CI has not yet run any of it. *(RC: the "31 PROVEN RED" above did not reproduce — see
GS-DES-002-M1-RC.)*

## GS-DES-002-M1-RC — release candidate (30 September 2026)

**Owner approval.** The owner visually approved M1 (kicker surface), R1 (Technical detail recession,
`copyOver [2.66, 2.76]` / `copyClear [2.84, 2.90]`, detail floor 0.2, outline and rig untouched) and
R2 (landscape stage containment, `min(88%, 1056px)` / hero `min(100%, 1200px)`). All three are frozen;
this RC makes no runtime or visual change to them.

**RC defect found and corrected (gate only).** Two full `check:design:scene --prove` runs on the clean
RC build stopped at *Technical transit unreceded-detail proof did not fail* — **an inert proof**, and
the R2 proof after it never ran (29 of 31 reached). Isolated, the probe read the unreceded intro at
1920×1080 @2.8 **3.13:1** on three fresh loads, yet the gate's own predicate returned nothing: from
1920 wide the intro is large text (≥24px) and its threshold is 3:1, so the subject cleared its own
predicate by 0.13 and fired or not on pixel noise. The previous session's 31-red reading was of that
kind. Measured with the detail forced to 1 (the unreceded state), threshold in brackets:
1920×1080 2.78/2.8/2.82 → 4.05/3.13/3.67 (3); **2048×1152 2.75/2.42/4.10 (3)**; 2133×1200
2.65/2.59/3.72 (3); 1600×900 and 1745×982 ≥4.90 (3); 390×844 4.34/4.07/3.98 (4.5). The proof's
subject moves to **2048×1152 @2.8** — a real HEAD failure that R1 removes, below 1200px tall so R2
plays no part — where it reads **2.27:1 against 3** (clean baseline: no finding). The threshold, the
predicate, the matrix and every other proof are unchanged; the R2 proof's subject was measured before
it first ran here (3200×1800 @2.8 uncontained: scope note **2.20:1** against 4.5). The transit-loop
comment that cited 1920 is corrected. Re-run in full on the same build: **`--prove` PASS, 31 PROVEN
RED** — among them *Technical kicker contrast without its surface* (1440×900 touch, drawing held at
full strength), *Technical intro contrast with the building detail unreceded* and *ultra-wide
Technical contrast with the stage uncontained*.

**Local RC verification** — clean worktree = `f7e45436` + exactly the six Design files (Master
candidate absent), `.next` removed before the build, Windows, port 3210 (something unrelated held
3000 and was left alone). `git diff --check` clean. `verify:static` PASS (tsc, ESLint 0 warnings,
colour selftest, `lint:colors`, `check:contrast` 44 pairs / 543 size / 185 permission / 20 opacity
composites, headings, content, claims, control, schemas, RLS, lead security, every selftest,
`check:master:scene:selftest`, `check:design:timeline:selftest` 5 checks / 11 red fixtures).
The self-test reaches both R1 ranges: `copyOver` moved to 2.3 → *Motion → Technical starts at 2.3,
inside the dwell*; `copyClear` ended at 3.45 → *building resolves at 3.45* and *holds 0.05* (restored
byte-identical). `verify:build` PASS (the first build attempt's worker died with Windows 0xC0000409 —
a native crash, not a code error; the clean retry passed): `lint:secrets`, `check:tokens`,
`check:theme`, bundle size 69 routes in budget, `/design` 3.7KB of 25KB, **lazy Design scene 8,121 B
gz** (level 9; 8,192 B ceiling, 71 B headroom, unchanged by R2), Master lazy 6,016 B. Served suite
PASS: `check:axe` (76 analyses, zero violations, 0 unresolved, skip link, cookie notice, deferred
footer), security headers, launch (development dataset), responsive (51 combinations), consumer terms,
legal parity 6/94/339, VAT, Press type/scene, Path live, service content, reviews UI, company facts,
Master scene/hero (committed HEAD Master), **`check:design:scene`** (25-size matrix each sampled in
transit at 2.6 / 2.75 / 2.8, detail pass incl. 2.75 and 2.8 at 1440×900 touch, G1, G2 24 sizes
≥6.69:1, fallbacks and lifecycle, R1 continuity/footer at 7 sizes, footer scope) and
`check:digital:scene`. Production audit 0.

Scratch measurement (never committed) over 2.5 / 2.55 / 2.6 / 2.65 / 2.7 / 2.75 / 2.8 / 2.85 / 2.9 /
3.0 — minimum kicker / intro / scope note / other Technical copy: 390×844 6.69 / 5.32 / 6.69 / 8.28;
768×1024 6.69 / 6.58 / 6.69 / 9.61; 1024×768 6.69 / 6.58 / 6.69 / 9.12; 1440×900 (and touch) 6.69 /
6.52 / 6.69 / 8.87; 1920×1080 6.69 / 5.77 / 6.69 / 8.42; 2048×1152 6.69 / 5.27 / 6.55 / 8.26;
2133×1200 6.69 / 5.69 / 6.69 / 7.80; **2400×1350 6.69 / 5.10 / 6.69 / 7.43; 2560×1440 6.69 / 5.88 /
6.69 / 7.57; 2844×1600 6.69 / 6.39 / 6.69 / 7.33; 3200×1800 6.69 / 6.69 / 6.69 / 6.90**. No failing
line anywhere. R2 geometry: at 768×1024 → 2133×1200 the stage box with the containment is identical to
the box forced back to its percentage at 0 and 2.8; above 1200px tall it holds 1056px (hero 1200px).
390×844 is outside the ≥761px rule. The R1 continuity/footer section run at 2400×1350, 2560×1440 and
3200×1800: dwell, flow, overlap, no blink, caption, 3D payoffs, morph, footer glide, reversal, dock,
collision, footer contrast, no duplicate mark — hold.

The exact-SHA receipt (SHA, CI run, Lighthouse, Preview) follows the convention above and is written to
`node_modules/.cache/gs-des-002-m1-rc/final-release-receipt.json` and the release handoff; the
candidate is accepted only once CI and Preview pass for that exact SHA. Staging only; no launch or
next phase is authorised.

## GS-DES-002-M1-RC-R1 — Technical H2 / mascot handoff (owner-approved)

**Exact-SHA result for M1-RC.** CI run `36789860893` on `e551f035` failed one served command:
`check:design:scene` — `2133x1200 technical transit 2.6: pixel contrast Make the: 2.54:1; needs 3`
(the Technical H2, large text). Every other step passed, including `/digital` mobile LCP 1746ms median
(budget 1750), TBT 123ms, CLS 0, and the historical `detail 2.75` kicker reading. No Vercel Preview was
created for that SHA (not investigated in this phase). The programme stays blocked.

**Cause (measured, Windows, the RC build).** Through the Motion → Technical handoff the Technical H2
slides up over the departing mascot while the stage art moves left: at 2133×1200 its box overlaps the
mascot's by 2% at 2.55, 21% at 2.585 and 34% at 2.615. The mascot fade `MOTION.mascotOut [2.56, 2.66]`
left it at 0.84 at 2.585 and 0.65 at 2.6. Hiding layers one at a time, only the mascot moves the H2
reading in that window (2133 @2.615: 5.11 → 11.87 with it hidden; rig, sketch, building, grid and wave
move nothing until the rig at 2.65+, where the H2 stays ≥7.4). Windows never read below 5.11 (2133
@2.615) across 16 landscape sizes at 0.005 steps — CI's 2.54 is an alignment Windows' layout does not
produce. Shifting the H2 over the mascot (±160px, mascot forced) gives the worst case by mascot opacity:
1.0 → 1.21, 0.65 → 3.24, 0.5 → 4.43, 0.4 → 5.76, 0.3 → 7.22, ≤0.2 → 7.77; at the real 2.6 state the old
fade's worst alignment reads 2.49–2.66, matching Linux. The gate's own ±0.015 seek tolerance spans
mascot 0.84 → 0.43 around 2.6, which widens the exposure.

**Correction (timeline value only).** `MOTION.mascotOut [2.56, 2.66] → [2.5, 2.6]`: the same 0.1-long
fade, 0.06 earlier — it starts as the Technical copy begins to arrive (the Motion dwell ends at 2.5)
and cross-fades with the rig's existing `[2.5, 2.58]`, so the mascot yields into its own construction
rig; it is gone before the H2 meets it. No position, size, copy, stage, R2 threshold, M1 surface or R1
recession changes; no shared CSS or runtime. Mascot opacity: 2.5 1.0 · 2.55 0.50 · 2.575 0.16 · 2.585
0.06 · 2.6 0.

**Evidence after.** With realistic layout variance (H2 shifted ±80px) the worst H2 reading from 2.53
to 2.6 is ≥7.69 at 2048, 2133 and 2400 (old fade, ±160px: 1.10–2.66). Unshifted, 2.5–2.7 at 390×844,
768×1024, 1024×768, 1440×900, 1920×1080, 2048×1152, 2133×1200, 2400×1350 and 2560×1440: H2 minimum
7.43 (2400 @2.65, over the rig, mascot 0); every line of the H2 measured; kicker 6.69, intro ≥5.91,
scope note 6.69, every on-screen line (Motion copy and caption included) ≥5.91 — no failing line.
Ultra-wide continuity and footer glide at 2400 / 2560 / 3200 hold (one leg, 0.0px beyond pace).

**Gates.** `check:design:timeline:selftest` gains a sixth check, **yield**: the mascot must be ≤0.3 at
2.57, where the H2 first crosses it (basis in the self-test header); its broken fixture is the shipped
`[2.56, 2.66]` (0.97). Mutating the real module also fires it — `[2.56, 2.66]` 0.97, `[2.52, 2.62]`
0.50, `[2.53, 2.6]` 0.39 — and the fixture/module agreement now covers 1.0–2.7. `check:design:scene`
is unchanged and still samples 2.6 / 2.75 / 2.8 at all 25 sizes, 2133×1200 among them. **No served
proof was added:** with the old fade restored, no Windows state reads the H2 below 5.11, so a "restore
the old mascot" proof would be inert locally and red only on Linux — the inert-probe class. The
value-based `yield` check carries its own validity (a reading, not an absence).

**Local verification** (clean worktree = `e551f035` + `designTimeline.ts` + the self-test; `.next`
removed; Windows): `git diff --check` clean; `verify:static` PASS (tsc, ESLint 0 warnings,
`lint:colors`, `check:contrast`, timeline self-test 6 checks / 12 red fixtures); `verify:build` PASS —
lazy Design scene **8,120 B gz** (was 8,121; ceiling 8,192, not raised), `/design` 3.7KB of 25KB;
`check:axe` 76 analyses, zero violations, 0 unresolved; `check:responsive` 51 combinations;
`check:design:scene` PASS (25 sizes × 2.6/2.75/2.8, detail pass, G1 keyboard/focus/disclosures, G2,
reduced motion, Save-Data, no-JS, failed import, lifecycle, R1 continuity and footer glide at 7 sizes,
footer scope); `--prove` PASS, 31 PROVEN RED. Digital, Press, shared chrome and the 15 Master-candidate
files are unchanged (hashes recorded before and after). Linux CI has not run this.

**Owner approval.** The owner visually approved the Motion → Technical handoff on the local clean
build (`mascotOut [2.5, 2.6]`); it is frozen with M1, R1 and R2. The programme remains blocked until
the corrected exact SHA passes CI; that result and the Preview are recorded in the receipt
(`node_modules/.cache/gs-des-002-m1-rc/final-release-receipt.json`) and the release handoff.
