# GS-DIG-001 — Gridsmith Digital: *Systems in Agreement*

> **Namespace.** Digital redesign and its release candidate are `GS-DIG-001`. `GS-R003` stays
> reserved for live post-cutover verification and is not used here.

**Status (25 September 2026):** owner-approved visual baseline (R3-F plus the two R3-G
corrections), frozen for release. RC verification is local-complete; the implementation commit,
its exact-SHA CI and the protected Preview are recorded in the receipt section appended after
they exist (a commit cannot carry its own hash). Production is untouched: `main` stays
`fbecbe01`; no production Sanity/Supabase, DNS, Hostinger or gridsmith.uk action; `GS-T004`
not applied.

## Visual thesis (frozen)

One persistent, server-rendered SVG compass travels the whole page as a single instrument:

| State | Behaviour |
|---|---|
| **Hero** | Foreground, right. Finite autoplay 01→02→03→04→05→01, adjacent callout, Pause/Play/Replay, hover/focus preview, real chapter links. |
| **Hero → Map** | Waits for composition space: the move starts only when the Route Map intro has cleared the 01 callout field (sentinel `.dg-map-visual-space`). One eased transform right → centre; no fade, no respawn. |
| **Route Map** | Centred. Five equal 84px callouts, 01–03 right and 04–05 left, reaching the page frame; one-line titles and behaviours; count tags on the top border; 1px gold leaders (rest 55%) from each number straight to its box. Neutral by default; hover/focus previews; real links. **R3-G:** the callouts fade in 100ms after the map state begins and are complete (≥95% opacity) at ≈290ms while the compass is ≈81% of the way across — no numbers-only interval at any tested speed. The reserved field is `size + 14rem + max(65svh, 36rem)` so the complete map holds during continuous scrolling. |
| **Map → chapters** | Callouts leave at once; the same compass recedes (opacity 0.22), centres in the viewport and **enlarges to 1.7× on desktop** (1.9× tablet, 1.12× phone) through the same transform, so it reads as an environmental graphic rather than a watermark. |
| **Chapters 01–05** | Inert, aria-hidden; the current group's number highlighted (gold, 0.6), others neutral (0.3). Local copy veil: soft-masked `blur(3px)` + graphite 45% behind headers, service lists and process copy; text itself is never filtered. |
| **Process** | The Engagement Route is unnumbered: `activeGroup = null`, all five neutral, still enlarged and turning. No fake 06. |
| **Process → Final** | Delayed until the CTA's first paragraph has fully risen past the instrument's axis. Then one continuous transform scales 1.7× → 1× and moves centre → right while opacity rises; the rail rises in front only after the move (step-end z-index), so it never crosses the heading. Fresh 01 autoplay; interaction restored. |
| **Exit** | Native sticky rail ends with the final section; the footer stays clear. |

Canonical destinations: 01 Web · 02 Software · 03 Apps & Interactive · 04 Automation &
Intelligence · 05 Operate & Improve. Not present: brand state, Gridsmith-logo takeover, Digital
WebGL, any second visible compass.

## Motion and ambient mechanism

- Ambient rotation is CSS only, in nested `.dg-spin` groups inside the script-rotated alignment
  groups, so destination alignment (slot, cause, sightline) is never overwritten. Ring one
  ≈38.4s clockwise, ring two 54s counter-clockwise, inner track 90s — all
  `calc(var(--dur-cycle) * n)`.
- Paused (`data-ambient="paused"`) when the instrument is off screen or the document hidden.
  Absent under `prefers-reduced-motion: reduce` (the rule only exists inside
  `no-preference`) and under Save-Data (`data-instant`). No React or rAF frame loop.
- Every Digital duration is now on the token scale (`check:tokens` found 28 literals at RC; all
  converted to exact multiples of `--dur-fast/base/slow/cycle`, timing unchanged).

## Architecture

5 capability groups, 17 Digital services, 28 capabilities (`lib/services/architecture.ts`,
`scripts/service-content.mjs`); all 17 `/digital/services/[slug]` routes build and serve 200.
Digital identity colour has one source: `styles/themes/digital-stage.css`, declared on the
Digital root layout's body, reaching `/digital` and every service page. `styles/themes/digital.css`
maps the shared token contract onto it with `var()`; its retired electric-blue literals are gone.

## RC gate corrections (narrow, no visual redesign)

1. **Contrast gate measured an undelivered palette.** `check:contrast` read `digital.css`'s
   blue literals while the stage layer overrode all of them — 01-VALIDATION-REPORT §21's class.
   It now resolves each theme's delivered values through its palette layer (root body block
   only). Deliberate-failure proofs: a stage literal mutated to a low-contrast value → red naming
   Digital `--ink-muted`/`--ink-subtle`; a stage file without its root block → hard error; both
   restored byte-identical and green.
2. **Legacy blue retired.** The shared `--accent-digital` (only use: the footer switcher's Digital
   rule) was `#1B5FFF` on Master/Design/Press while Digital's own pages rendered `#35718A`. All
   themes now declare `#35718A` (5.41:1 with white, up from 5.09:1). No other Master/Design value
   or component changed.
3. **`.codex/` classified.** The untracked Codex CLI agent definitions (`.codex/agents/*.toml`)
   are the equivalent of `.claude/agents` and are excluded in `scripts/source-files.mjs` with that
   reason — not committed, not deleted. Proofs: an unclassified probe directory → red; a hex
   literal in a Digital CSS probe → red; both removed.
4. **Bundle baseline set.** `/digital` now ships its own feature (compass controller + chapter
   leaf, 4.8KB against its 15KB ceiling) and leaves `BASELINE_ROUTES`, as `/design` did at
   GS-R002. With it listed the spread assertion fired red (2.8KB), which is the proof it is live.
5. **Owner content-review document regenerated** (`npm run docs:content-review`) to transcribe the
   approved B2 wording; `check:service-content` asserts parity.
6. **`check:digital:scene` (new, CI served step).** axe cannot resolve colour contrast on
   `/digital`: the compass rail is a positioned full-page layer (axe's element stack ignores
   `pointer-events: none`) and the copy veil is a pseudo-element — 752 undetermined results, zero
   violations. Following `check:design:scene`, the new gate measures rendered pixels under every
   visible, non-decorative text box in `main.dg-home` at every compass state (hero, map, 01–05
   header and services, process, final) across 1440×900, 1280×720, 1024×768, 768×1024, 390×844
   and 360×800 (≈2,060 boxes); asserts the state machine, circular ring and no overflow; the R3-G
   map timing under a 1000px/s continuous scroll; live `prefers-reduced-motion` and Save-Data
   (no autoplay, no rotation, navigation works); and no-JS content (hero, both CTAs, five route
   links, five chapters, 17 service links, engagement, final). `--prove` makes each of its six
   branches go red. check-axe then allows `/digital` contrast declines **only** for nodes inside
   `main.dg-home` with one of six named background/short-content reasons, normalised by
   `digitalSceneTarget()` with 10 positive/negative proofs run every time. Result: zero
   violations, zero unresolved.
7. **Defects the pixel gate found, fixed without redesign:**
   - The Final CTA drew `var(--dg-ink)` — light ink on gold, **2.03:1** (hover 1.21:1). It now
     uses the Hero CTA's approved treatment: graphite on gold 7.08:1, hover 14.40:1.
   - Stacked Route Map rows scrolled under the opaque compass for ~260px before the approved
     "reading" state began at a fixed 40% line. Reading now begins when the rows reach the
     instrument's lower edge in its map position (a layout-fixed line, so it cannot oscillate).
   - `.dg-web-layout` carried `aria-label` on a generic `div` (axe `aria-prohibited-attr`); it is
     now `role="group"`.
8. **Mobile Core Web Vitals (first CI run `36140863700` on `5770da41`, preserved as failed).**
   Lighthouse mobile measured `/digital` at CLS **0.285** (budget 0.02) and LCP **1831ms**
   (budget 1750ms); desktop passed. Its own report attributed the whole shift to
   `div.dg-compass-rail` (the compass painted before the controller positioned it), and LCP equalled
   FCP: the first frame after the last stylesheet took 187ms against `/design`'s 101ms. Local
   diagnosis under 4× CPU isolated the cost to style/layout of the below-fold chapters (~160ms) and
   the compass markup (~70ms). Fix, with no visual change: `content-visibility: auto` +
   `contain-intrinsic-size: auto 1600px` on chapters, engagement and close; the rail is
   `content-visibility: hidden` until `data-enhanced`, which is set in the same task that positions
   it. Local: first-render delay 557 → 297ms (`/design` 288ms), desktop CLS 0.028 → 0, long-task
   excess 521 → 346ms. Because sections now size lazily, `check:digital:scene` resolves its
   anchors at visit time and adds a lifecycle branch (real click on the map's 05 callout, reverse
   scroll to the hero, resize 1440 → 390 inside a chapter with no stale state), proven red.

## Commercial wording (B2)

Four agreement-qualified corrections replace blanket promises ("in your repository", "held in
your accounts", "built on your systems and accounts"): ecommerce integration setup, web
application infrastructure and source/accounts, game source project, workflow automation
pipeline. The development dataset held the old wording; it was synchronised with the established
`npm run seed` workflow (hardcoded `development`, refuses `production`). A read-only comparison
before and after: 4 → 0 stale of 46 service documents. Production Sanity was not addressed.

## M1 maintenance correction (25 September 2026)

The malformed `--accent-digital` value introduced with `5770da41` is corrected in
`styles/themes/press.css`, `master.css`, `master-stage.css` and `design.css` from the
seven-digit `#35718AF` / `#35718af` to the authoritative Digital signal `#35718A` in
`digital-stage.css`. This closes the footer switcher's invalid computed border colour.

Root cause: `lint:colors` deliberately exempted token/theme files and its accepted-hex
matcher only recognized complete 3, 4, 6 or 8 digit literals, so the 7 digit token did not
match. `check:tokens` checks token presence and delivery, not literal syntax. `check:contrast`
matched 3–8 digits and luminance used the first six, so the malformed suffix was silently
ignored while the measured value happened to equal `#35718A`.

The existing `lint:colors` gate now validates CSS hash token lengths in declaration values,
including theme/token declarations. Repository-supported forms remain `#RGB`, `#RGBA`,
`#RRGGBB` and `#RRGGBBAA`; other all-hex lengths fail. Comments, strings, selectors,
non-hex hash names and URL fragments are excluded. `check:contrast` remains the WCAG ratio
gate, and `check:tokens` remains the declaration/delivery and parity gate; neither duplicates
hex syntax validation. `scripts/color-literals.selftest.mjs` permanently covers the four
accepted forms, `#12345`, `#1234567`, both original `#35718AF` spellings, and non-colour cases.

The committed deliberate-failure specimen is `0db2c9869d90375c375ca9c68510dee41926bd4c`
(Press `--accent-digital: #35718AF`). `npm run lint:colors` failed specifically with
`styles/themes/press.css:83:21 [invalid-hex] #35718AF` (exit 1). The required restore is the
separate revert commit `71f0b6eee92e4004bee0f07e91fa3ee6eebcf421`; the specimen remains
reachable in history and the final source is valid. Implementation commit:
`efec1cb1` (`fix(digital): validate theme hex colour literals`).

Local verification on the restored tree: color-literal self-test, `lint:colors` (240 files),
`check:contrast` (44 pairs / 185 permission cells), `check:tokens`, ESLint for the modified
gate files, `git diff --check`, and a development build passed. Puppeteer computed the
switcher border as `rgb(53, 113, 138)` on `/about` (Master), `/design`, `/press` and
`/digital`. Exact-SHA CI and protected Preview are tracked by the staging release receipt;
the correction is staging-only.

## Known non-blocking findings

- 27 development-dependency advisories (12 high, 13 moderate, 2 low), unchanged baseline;
  production dependencies report zero. No package or lockfile change.
- Lighthouse cannot run on Windows (`lhci-availability.mjs`); both axes are asserted on CI Linux.

## Release receipt

- **Branch:** `staging/gs-dig-001-digital` (from `c413a471`, the GS-R002 Design RC baseline).
- **Implementation commits:** `5770da41f3264c2e36183ccc8e1a6d943e5a9bab` (RC), then
  `4fb9af33b71056ef7a7be23641c20a7f8474d50e` (mobile Core Web Vitals correction).
- **CI:** `5770da41` → run `36140863700` **failed** (Lighthouse mobile `/digital`: CLS 0.285, LCP
  1831ms) and is preserved as such. `4fb9af33` → run `36147498717` **success**, every step.
  Lighthouse medians on that SHA, `/digital`: desktop performance 100, accessibility 100, LCP 579ms,
  CLS 0, TBT 0; mobile (n=6) LCP 1701ms (budget 1750), CLS 0.000 (0.02), TBT 97ms (150).
  `check:digital:scene` on Linux: 2,049 text boxes, map complete 500ms / numbers-only 0ms,
  lifecycle, reduced motion, Save-Data and no-JS all pass; axe zero violations, 0 unresolved.
- **Protected Preview:** GitHub deployment `6662981296`, environment `Preview`, success, SHA
  `4fb9af33`: https://gridsmith-katbz3r6c-atikmurtazas-projects.vercel.app — unauthenticated
  requests return 302 to Vercel SSO with `X-Robots-Tag: noindex`. The previous Preview
  (`6661785006`, `5770da41`) was fetched authenticated through the Vercel connector: HTTP 200,
  `noindex, nofollow` meta, production CSP, one compass, five route links, five chapters, 17
  service links, both CTAs, and served stylesheets whose content hashes equal the local build's.
  An authenticated runtime session on the final Preview was not available (the connector and the
  browser pane both redirect to Vercel sign-in) and no protection was bypassed; that session is an
  owner step and is recorded in the release handoff, not claimed here.
- **Production:** untouched — `main` `fbecbe01`, gridsmith.uk, DNS, Hostinger, production
  Sanity/Supabase, `GS-T004`. Development Sanity was synchronised by `npm run seed` only.
- This documentation commit's own SHA, CI and Preview are recorded in the release handoff (a
  commit cannot carry its own hash).
