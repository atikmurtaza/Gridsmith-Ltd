# GS-R001-M — Master experience redesign

**Date:** 18 September 2026 · **Agent:** Claude Code (Opus 5) · **Follows:** `GS-R001-R`
**Owner acceptance (`GS-O008`):** **OPEN — AWAITING OWNER RE-REVIEW.** Not closed here and not
closeable by an agent.

This is the record. `AI-HANDOFF.md` is the summary and the next-phase recommendation.

---

## 1. Why this phase existed

`GS-R001-R` was technically successful and the owner rejected the Master homepage's visual
direction at `GS-O008`. The verdict, in the owner's terms:

- **The grid and the three coloured division boxes** — generic, irrelevant, disconnected from
  Gridsmith. *"Drop the squares and grid on the hero section."* Recolouring, rounding or
  re-arranging the same cards was ruled out: the composition itself had to change.
- **The `GS-R001-R` background animation** — technically excellent and visually unsuccessful: a
  line-art sketch of the logo, hidden behind most sections, too subtle to notice, reading as
  *exploded logo → recomposed logo* and as childish rather than premium.
- **The brand colours** — the page did not express Gridsmith's own colour.

Richer animation technology (Three.js, React Three Fiber, GSAP, WebGL) was **explicitly
authorised** for this phase if justified, with performance as a constraint rather than the
objective. Design, Digital and Press were out of scope, and Digital research was deferred by the
owner (*"for digital i will tell later"*).

## 2. Reconstruction

Starting commit `fbecbe01`, `main`, clean, 0 ahead / 0 behind. Latest CI: runs `35288782657`
(`main`) and `35288781001` (`staging/gs-r001-r-remediation`), both `success`. The `GS-R001-R`
content, legal, contact, social and review-safety work was read before anything was changed and
none of it was reopened (§11).

## 3. The old Gridsmith reference — what was studied, what was taken

`github.com/atikmurtaza/gridsmith-working` (owner-controlled) and its rendered build, read-only.

| Aspect | The reference | Taken |
|---|---|---|
| Stack | React Three Fiber + drei (`Environment preset="city"`, `Float`, `Sparkles`) + postprocessing (Bloom, Noise) + GSAP ScrollTrigger + Lenis | **No library.** See §5 |
| Stage | `#050505`, fixed full-viewport canvas behind translucent sections | **Yes** — the principle that the mark is the page's surface and content moves over it |
| Material | `MeshStandardMaterial` `#d4af37`, metalness 0.9, roughness 0.1, city HDRI | **The look**, re-derived: polished gold reflecting a studio environment |
| Geometry | 8 spheres, 6 cylinders — **coordinates hand-placed and not the logo's** (they do not reproduce the mark) | **No** — this phase uses the owner's verified vector exactly |
| Scroll | one scrubbed timeline: random scatter at 0–0.6, recompose at 0.6–1, two group turns | **No** — that is the *explode → recompose* shape the owner rejected |
| Extras | sparkles, bloom, film noise, `Float` bobbing, Lenis smooth scroll | **No** — particles are prohibited by the brief; Lenis replaces native scrolling |

What the owner was pointing at was the **dimensional, lit, persistent gold object**. That is what
was built.

## 4. The design

### 4.1 Concept

**Content moving through one Gridsmith environment.** A dark studio stage, the polished gold
mark lit inside it, and six chapters of content passing over it. The mark does not decorate
sections; it *is* the surface, and every section is transparent.

### 4.2 Colour — derived from the logo, not invented

`styles/themes/master-stage.css`, applied to `/` only through `[data-stage="master"]`.

| Token | Value | Source in `gridsmith-logo.svg` |
|---|---|---|
| `--gold-hi` | `#FFF3B9` | `barH` stop .15 — the bar's specular band |
| `--gold` / `--accent` | `#E0BD70` | `orb` stop .22 — the sphere's lit body |
| `--gold-mid` / `--accent-2` | `#A17C36` | `orb` stop .43 |
| `--gold-deep` | `#5C421C` | `orb` stop .63 |
| `--canvas` | `#0B0907` | `orb` stop 1 (`#392810`) at its own hue, taken to near-black |
| `--ink` | `#F5EEDD` | `softbox` (`#FFFEF0`) pulled toward the gold |

**Usage rules.** Gold is the accent — chapter numbers, rules, links, the primary button, the
verifiable monospace figures — and the material of the scene. It is never body text on anything
but the stage canvas. There is no division colour on `/` at all: the divisions' own palettes
belong to their own sections, and the owner ruled out colours invented to tell boxes apart.

**Measured, as a fifth palette in `check:contrast`** (44 pairs, 185 matrix cells). Worst text
cell: `--ink-subtle` on `--canvas-raised`, **6.39:1**. The stage file also carries
`--canvas-veil` (the canvas at 92%), whose value was set by `check:master:scene` rather than by
eye — at 90%, `--ink-muted` over the brightest gold measured under 4.5:1.

**A proximity to record.** Gridsmith Design is also near-black with an amber accent. The two
read differently — Design is a flat drawing sheet in hairline amber, the Master stage is a lit,
dimensional gold material — but they sit closer than the rest of the system. §13.

### 4.3 Information architecture — audited, not preserved

| Former block | Classification | Now |
|---|---|---|
| Hero + `HeroMark` (grid and three coloured blocks) | essential / **rejected composition** | **Hero** — left-set type, the mark carries the right of the frame |
| Division routing (three coloured cards) | essential / **rejected composition** | **Studios** — a typographic index |
| Continuity argument | essential | **One relationship** — merged with the structure disclosure |
| Group structure (company number, one contract) | useful, **better merged** | inside *One relationship*, as one monospace fact line |
| Process (six stages with full descriptions) | useful, **duplicated `/approach`** | **Process** — the six stage names on one rail; descriptions stay on `/approach` |
| Reviews (CSS 3D cylinder) | essential | **Reviews** — held heading, reviews pass under the reader's own scroll |
| Latest insights | **distracting / dormant** — every post is an unpublished brief, so it rendered `null` | **removed** from Home; `/insights` is in the header |
| CTA band | essential | **Start** — the mark resolves beside it |

Access preserved to all four the brief names: divisions (Studios), approach (links in *One
relationship* and *Process*), credibility (Reviews), contact (hero CTA, Studios fallback, Start).

### 4.4 Copy

All approved copy is carried over word for word: the hero headline and intro, every studio line,
the continuity heading and paragraph, the structure disclosure, the process lede, the review
heading and lede, the CTA heading and lede, and the response commitment from `companyDetails`.
**Three additions, all structural, none a claim:** the studios heading *"Where would you like to
start?"* (echoing the approved intro's *"Start with what you need today"*), the chapter labels
(`01 The studios` … `05 Start`) and the hero's secondary link *"See the three studios"*.
The structure disclosure's second paragraph is condensed to its final sentence. No `[SEED]`, no
price, no portfolio, no metric, no client.

### 4.5 Typography

Inter at display weight 500 and `-0.04em` for the hero and close, `--text-3xl` section titles,
the continuity statement at `--text-2xl` weight 400 so it reads as a sentence rather than a
headline, and JetBrains Mono for chapter numbers, stage numbers, the company number, ratings,
dates and the response commitment — *monospace marks anything verifiable*, unchanged.

## 5. The environment — technology and why

**One full-screen WebGL fragment shader that ray-traces the fourteen pieces analytically.**
Spheres and capped cylinders both have exact ray intersections, so the scene is fourteen tests
per pixel with one reflection bounce: no meshes, no tessellation, no environment map, no
post-processing. The studio lighting is procedural — a key softbox, a vertical strip and a warm
floor bounce, the same softbox device the supplied logo draws its highlights with.

| | Three.js / R3F (the reference) | This |
|---|---|---|
| Lazy JS | ~150KB gz for three + fiber + drei + postprocessing | **5.0KB gz** |
| Silhouettes | tessellated (32-segment spheres) | exact at any zoom, including the macro close-up |
| Inter-reflection | needs reflection probes | **native** — every sphere mirrors its neighbours |
| Rendering | continuous render loop | **renders only when something changes** |

`GS-R001-M` §8 authorised Three.js *if justified*. For eight spheres and six cylinders it is not:
it would cost thirty times the bytes for a less exact result. **GSAP was not used** — the scroll
relationship is a damped read of `scrollY` against the chapters' measured positions, which is
twenty lines and needs no timeline. **Neither was added as a dependency.**

### 5.1 The narrative — six poses, four formations

Each chapter has a pose, reached when that chapter's centre crosses the middle of the viewport;
between chapters the pieces travel. The model is `components/master/sceneModel.ts`.

| Chapter | Formation | What the reader sees |
|---|---|---|
| Hero | **logo** | The assembled mark in three-quarter view, polished gold, right of the headline; a slow sway and a subtle pointer tilt |
| Studios | **split** | The mark turns and its two interlocking halves draw apart in depth — the mark is two brackets, and this is the only formation that says so |
| One relationship | **logo, macro** | The camera travels in to a joint — the place the two structures meet — beside *"sharing the context that matters"* |
| Process | **chain** | The six bars laid end to end as one ascending path, the spheres as joints, beneath the six-stage rail |
| Reviews | **ring** | All fourteen pieces stand on one slowly turning circle, bars upright — where the review cylinder went |
| Start | **logo, front-on** | The mark reassembles and turns to face the reader exactly: the brand, resolved |

The lighting rotates with the chapters, so the highlights travel across the metal as the page
moves. **Native scrolling is untouched** — the scene reads `scrollY` and never writes it. No
scroll hijacking, no smooth-scroll library, no cursor follower.

### 5.2 Adaptation

- **≥1024px:** two-column composition — copy holds the left, the mark the right; the scene is
  shaded under the copy column.
- **<1024px:** there is no free column, so the mark sits above the hero and closing copy, and
  mid-page it travels through the gaps between sections, with copy blocks on the stage veil.
  Resolution is capped lower, the second anti-aliasing sample is dropped, pointer tilt is off.
- **Adaptive quality:** if frames run long the render scale steps down, never below 60%.
- **Reduced motion:** the scene still renders — the identity is not removed — once, in the hero
  pose, and never moves: no scroll response, no sway, no tilt.
- **No WebGL / shader failure / lost context / failed import / low-capability device**
  (`hardwareConcurrency ≤ 2`, `deviceMemory ≤ 2`, Save-Data): the owner's own
  `gridsmith-logo.svg`, unmodified and static. With scripting off, the same.

### 5.3 Performance design

Lazy by `import()` on `requestIdleCallback`, so the renderer is never on the LCP path (the `h1`
is the LCP element and has no entrance animation). Master-only. DPR capped at 2 and pixel count
capped (1.9M wide, 0.7M narrow). Rendering stops when the pose settles; the only continuous
motion is the hero/close sway, capped at 30fps; `requestAnimationFrame` stops in a background
tab. On unmount the program, shaders and buffer are deleted and the context released.

## 6. Reviews

Genuine API-derived Freelancer reviews, verbatim, rating and date as the API returns them,
*"Verified review via Freelancer"* on every one, one link to the profile, Master only. `GS-O014`
and `GS-O015` rules unchanged — the pipeline, `namedThirdParty` and the pinned live set were not
touched. **What changed is presentation:** the rotating cylinder hid most reviews at any moment
and needed a WCAG 2.2 SC 2.2.2 pause control because it moved by itself. Now the heading holds
its place (sticky ≥1024px) while every review passes under the reader's own scroll. Nothing
moves on its own, so there is nothing to pause, and reduced motion is at full parity by
construction.

## 7. Measurements

### 7.1 JavaScript

| | Before (`GS-R001-R`) | After |
|---|---|---|
| `/` initial JS delta | 1.9KB of 15KB | **4.4KB of 15KB** (`MasterScene`, the client boundary) |
| Lazy scene renderer | — | **5.0KB gz**, in no route's HTML, ceiling 8KB |
| Dependencies added | — | **none** |

`check-bundle-size` gained the lazy line with three assertions — exactly one chunk carries the
renderer, no route loads it eagerly, and it fits its ceiling — each proven red: ceiling lowered
to 4KB, marker changed so zero chunks match, and the chunk injected into `/about`'s built HTML
(restored byte-identical by SHA-256). `/` left the gate's `BASELINE_ROUTES` deliberately: the
spread assertion fired at 2.4KB because the scene boundary is on `/` alone, and the feature is
owner-authorised.

### 7.2 LCP, CLS, TBT

**Lighthouse cannot run on Windows** (recorded since `GS-R001`; chrome-launcher's temp-profile
cleanup races Node 24). Its figures come from CI and are recorded in `PROJECT-STATUS.md` once the
run completes. The structural expectations, stated so they can be checked against that run: the
`h1` remains the LCP element and nothing delays it; the canvas is `position: fixed` and fades in
by opacity, so CLS contribution is zero by construction (`check:mark:cls` asserts it by
scrolling); TBT gains the shader compile, which happens on idle, not during load.

### 7.3 GPU and render behaviour

Per pixel: 14 analytic intersections for the primary ray, 14 more for the reflection bounce, ×2
samples on wide screens. Measured in headless Chrome on SwiftShader (software rendering — the
slowest realistic path) at 1440×900, the scene renders and the gate's six chapters settle within
its 1.8s window. Real GPUs are one to two orders of magnitude faster. The adaptive-quality step is
the safety net for weak integrated GPUs.

## 8. Gates

| Gate | Change | Proof |
|---|---|---|
| `check:master:scene` **(new, served)** | Replaces `check:mark:field`. Seven questions at 2560, 1440, 1024, 768 and 375 widths × six chapters, plus reduced motion and no-WebGL, from **rendered pixels**: decorative; WebGL started; **mark visible at every chapter** (gold share of viewport ≥1%); **moves between chapters** (≥2% of the frame changes) and holds still under reduced motion; **every line of text readable over the scene** (its own colour vs the 98th-percentile luminance behind it); no overflow; fallback shows the logo | `scripts/prove-master-scene.mjs`, committed — §8.1 |
| `check:master:scene:selftest` **(new, static)** | The model's invariants: the close **is** the logo exactly; the hero is the assembled mark; no bar ever changes length; nothing jumps; ≥4 formations | Each check run against a fixture broken to fail it, in the same run — 5 of 5 red |
| `check:bundle-size` | Lazy scene line, three assertions; `/` leaves `BASELINE_ROUTES` | §7.1 |
| `check:contrast` | Fifth palette; `home.module.css` scoped to it; 36→44 pairs, 148→185 cells | Scoping found a real defect on first run (§8.2) |
| `check:reviews:ui` | Questions 3, 4, 9 rewritten for still reviews | — |
| `check:struck` | `GS-R001-M-DIVISION-CARDS` registered; 18→19 rules, 36→38 specimens | Its branch fires; its not-a-subject case passes |
| `check:mark:field`, `check:mark:guard` | **Retired** with their subject (`BackgroundMark`; no `animation-timeline` remains) | — |

### 8.0 `check:master:scene` — the deliberate-failure record

`scripts/prove-master-scene.mjs`, on the final build. Each probe mutates one built artefact, runs
the gate, and is credited only if the gate fires **the question it targets**; every subject was
restored byte-identical (SHA-256).

| Q | Probe | Result |
|---|---|---|
| 1 | `aria-hidden` removed from the layer | **RED** — *"the scene layer is not aria-hidden"* |
| 2 | shader made uncompilable (`gl_FragColour`) | **RED** — `data-render` is `fallback`, not `ready` |
| 3 | canvas hidden | **RED** — *"the mark covers 0.00% of the viewport"* at every chapter. Run through the harness with `PROBE=3`: in the full run the port was still held after probe 2, `with-server` correctly refused, and the harness reported **NOT RUN** rather than a reading |
| 4 | scroll no longer drives the pose | **RED** — *"only 1.22% of the frame changed since the previous chapter"* |
| 4 reduced | reduced-motion query ignored | **RED** — *"6.35% of the frame changed between hero and close — it moved"* |
| 5 | hero `h1` moved over the mark | **RED** — *"measures 1.31:1 over the scene, needs 3:1"* |
| 6 | a 3000×20px probe in `main` (a probe with height, so it can overflow) | **RED** — *"440px of horizontal overflow"* |
| 7 | fallback logo removed | **RED** — *"without WebGL the static logo is not shown"* |

### 8.1 What proving the gates found

**This rule paid for itself four times in one phase.**

1. **The scene gate found the design's readability failures that a visual review had passed.**
   First run: 44 problems — at 768×1024 the desktop composition put the mark under full-width
   body copy (1.2:1); narrow mid-page chapters had dimmed gold under copy (3.5–4.4:1); the reviews
   ring reached the lede at 1024–1440. Every one was fixed in the design (the narrow composition
   now applies below 1024px, the stage veil, the ring moved), not by lowering a threshold.
2. **The scene gate itself was wrong, and read as a scene defect.** Content was hidden for the
   visibility measurement with `visibility: hidden`; descendants declaring `visibility: visible`
   (the nav, the kicker, the button) stayed on screen and counted as gold. Under reduced motion it
   reported the scene moving by 2.12% — the scene was pixel-identical, verified by screenshot. Now
   `opacity: 0`, which no descendant can override; the reduced-motion reading is 100.00%.
3. **The model self-test's first red was a false one**, and diagnosing it is recorded in the file:
   at chapter 4 a bar is handed over with its ends exchanged — the same segment — and an ordered
   comparison read that as a 2.4-unit jump. Bars are now compared as unordered segments.
4. **The proof harness's first parser credited reds that had not happened.** It read the leading
   digit of the gate's summary rows (`  2560x1440 …`) as question numbers, which would have marked
   questions 1, 2, 3 and 7 proven regardless. Caught before it reported; it now reads only the
   problem list. *A red build is not a red gate.*

### 8.1a Two more gate predicates, narrowed to their real question

- **`check:responsive`** read the scene layer — fixed, full-viewport — as a *900px fixed bottom
  bar* that could hide a focused control (SC 2.4.11). It is `z-index: -1`, painted beneath all
  content, so it cannot obscure anything. The predicate now skips elements with a **negative**
  `z-index` only; `auto` and 0 still count. Observed red before the change on `/` at 375px.
- **`check:axe`**: every `/` finding is a `color-contrast` *incomplete* on text over the canvas —
  axe declining, zero violations. Three stale `/` entries (the line-art mark, the cylinder, the
  cylinder's dates) were **removed** with their subjects, and one entry replaces them, scoped to
  `#hero-title` and `home_*` classes, whose stated premise is `check:master:scene` question 5 and
  which names its own removal conditions. Chrome or a primitive declining on `/` still lands
  UNRESOLVED.

### 8.1b A new review, found on the way

`check:reviews --live` is red: Freelancer now returns 13 reviews, 11 publishable — a new 5/5
review from 17 September 2026. The build shows it (by rule). `EXPECTED` was **not** moved; the
decision is `GS-O020`.

### 8.2 `check:contrast` scoping

The opacity pass scoped every file under `components/master/` to the white `master` palette.
`home.module.css` renders on the stage; scoped correctly, the gate immediately found the studio
arrow resting at `opacity: 0.5` — 3.34:1 on the stage. The arrow now rests at full opacity and
only its position animates.

### 8.3 `check:state-cues`

It flagged `[data-state]` on the scene layer as a UI state carried by colour alone. It is a render
status of a decorative, `aria-hidden` layer, and the codebase reserves `data-state` for UI
states — so the attribute was renamed `data-render`. The gate was not exempted.

## 9. Accessibility

Semantic content unchanged in kind: one `h1`, `h2` per chapter, `h3` per studio, lists for the
studios, stages and reviews, `figure`/`blockquote`/`figcaption` per review. The scene is outside
`<main>`, `aria-hidden`, holds nothing focusable and takes no pointer events (gate question 1).
Every studio row is one `<a>` in the tab order; the whole row is its hit area via a pseudo-element,
not a second link. Focus is a 2px gold outline. Native scrolling. Reduced motion keeps the
composition and removes all motion. axe results are in `PROJECT-STATUS.md`.

## 10. Research — Press and Design capability evidence (future phases only)

Read-only. **Nothing here changed Press or Design public UI or content.** Marketing prose, prices,
guarantees, testimonials, metrics, addresses, phone numbers and company identity were excluded;
what is recorded is *capability evidence*, and every row needing a Gridsmith decision says so.

### 10.1 Book Publishers Den → Gridsmith Press

Source: `bookpublishersden.com` (home, editing, publishing, marketing, audiobook pages).
Excluded: price ranges, a Trustpilot badge, registration address and contact details.

| Capability evidenced | Gridsmith Press today | Status |
|---|---|---|
| Manuscript critique / assessment | Editorial: *Manuscript assessment* | **Already represented** |
| Developmental editing | Editorial: *Developmental/structural editing* | **Already represented** |
| Line editing (sentence-level: flow, word choice, clarity) | Copy editing and proofreading exist; line editing is not named | **Missing but evidenced** |
| Copyediting / mechanical editing, proofreading | Editorial: *Copy editing*, *Proofreading* | **Already represented** |
| Translation and bilingual proofreading ("based on language availability") | — | **Missing; needs owner decision** — which languages, and whether in-house |
| eBook / print formatting, typesetting, interior design | Publishing: *Ebook/print formatting*, *Platform-standard formatting*, *Typesetting* | **Already represented** |
| ISBN guidance | Publishing: *ISBN guidance/support* | **Already represented** |
| Metadata, category and keyword guidance for listings | Implicit in *Publishing preparation* | **Missing as a named service; evidenced** |
| Distribution planning, platform setup, upload assistance, pre/post-release checklists | Publishing: *Distribution/platform setup* | **Already represented** |
| Print-on-demand setup coordination; custom book printing | — | **Needs owner decision** — coordinating a third-party printer is a different undertaking from printing |
| Cover design | Publishing: *Cover-design coordination*; design itself is Design's (recorded boundary) | **Represented; boundary holds** |
| Audiobook production — narration casting, recording, editing and mastering, platform-ready files, distribution guidance | — | **Missing; needs owner decision.** The source's *"professional studio environment"* is that business's claim, not Gridsmith's; what Gridsmith itself would provide or coordinate is unconfirmed |
| Author website | Digital's *Web* group (boundary) | **Conflict with the architecture if placed in Press** — belongs to Digital |
| Social media, paid advertising | Digital Marketing cross-division engagement (`GS-O012`, `GS-O013`) | **Represented as an engagement** |
| Email marketing campaigns | Not among the confirmed channel services | **Needs owner decision** |
| Book trailers (video) | Design *Motion* | **Boundary** — Design, not Press |
| Content marketing, articles, guest posts | Content & Promotion: *Ongoing content programmes*, *Content SEO* | **Already represented** |
| Podcast / guest-spot placement | — | **Conflict as worded** — the source promises to *"secure"* placements, an outcome claim Press's honest-outcomes rule does not allow; could exist as outreach support without the promise |
| Bookmarks and promotional merchandise | Design *Print and digital collateral* | **Boundary** — Design |
| Launch planning and strategy | Content & Promotion: *Book marketing/support* | **Already represented** |
| "Not a publisher of record"; no guarantee of approval, rankings, reviews or sales | Consistent with Press's honest outcomes and Path Finder | **Consistent** — a framing, not a service |
| Ghostwriting | Writing: *Ghostwriting* (Gridsmith has it; the source does not mention it) | n/a |

### 10.2 MAD Alpha Designers → Gridsmith Design

Source: `madalphadesigners.com`. Excluded: five tiered packages and their prices, *"100% money-back"*,
*"10+ years"*, *"75,800+ launched products"*, *"5,678 satisfied customers"*, *"9,800+ projects"*,
*"1K+ daily visits"*, testimonials and the portfolio.

| Capability evidenced | Gridsmith Design today | Status |
|---|---|---|
| Logo design | Brand & Visual: *Logo systems*, *Brand identity systems* | **Already represented** |
| Stream screens (starting / BRB / offline), alerts, panels, banners and headers, cam frames, chat boxes, emotes, subscriber badges | Brand & Visual: *Gaming/streamer creative* — **one service, deliverables not enumerated** | **Represented as a service; the deliverables are missing but evidenced** — service-detail content, not new architecture |
| Intros and outros | Motion: *Motion graphics*, *Animated brand/content assets* | **Represented generally**; streamer context not named |
| Animated overlays, animated logos, animated banners, animated emotes | Motion: *Animated brand/content assets* | **Represented generally**; the specific deliverables are evidenced |
| Packages / tiers | — | **Conflict** — `GS-D002`, no public pricing |
| Money-back guarantee, turnaround and volume claims | — | **Conflict** — non-negotiable #2; none may be imported |
| Portfolio | — | **Conflict until permission** — `GS-D001` |

### 10.3 Owner decisions these create (future, not blocking this phase)

Recorded in `OWNER-ACTIONS.md` as `GS-O018` (Press) and `GS-O019` (Design): line editing, metadata
guidance, translation (languages), print coordination, audiobook scope, email marketing, and
podcast outreach without a placement promise for Press; whether *Gaming/streamer creative* should
enumerate its deliverables, and whether any associated-business work may ever be shown, for
Design.

## 11. Preserved

No visitor-visible `[SEED]`; About and Approach remediation; the editorial-brief Insights model;
no telephone-call CTA; WhatsApp and SMS; eight verified social links; ICO evidence unpublished;
no public pricing; no public portfolio; the Technical Design gate; Freelancer filtering. None
were touched. **Digital: unchanged and deferred.** Design and Press routes: unchanged.

## 12. Production safety

No production Sanity call. No Supabase call of any kind. `GS-T004` not applied. No DNS or Hostinger
change. `gridsmith.uk` unchanged. No production deployment: the staging candidate is a Vercel
branch **preview**, SSO-protected and `noindex`; the `main` push produces the production-target
build that ends `ERROR` on the empty production dataset (`GS-T005`), as every one since `GS-P00`.

## 13. Remaining concerns, stated plainly

- **The reviews chapter shows the least of the mark** (1.4–2.6% of the viewport at ≥1024px),
  because it is the densest text on the page. It is visible and turning, and it is the chapter an
  owner reviewer should look at hardest.
- **Master and Design are both dark with a warm accent.** Distinct in material and register;
  closer than the rest of the system. An owner call if it reads as too close.
- **`/` is now dark and the other Master routes are still white.** Extending the stage to
  `/about`, `/approach`, `/contact` and `/insights` is an owner decision (`GS-O008` review item).
- **The renderer is software-verified.** The gate runs on SwiftShader; real-GPU smoothness on the
  owner's devices is the owner's review to make, alongside Firefox/Safari, which remain the open
  `GS-R001` human-test items.
