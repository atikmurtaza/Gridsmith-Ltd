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
