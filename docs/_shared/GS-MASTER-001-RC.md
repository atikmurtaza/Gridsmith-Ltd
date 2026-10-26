# GS-MASTER-001-RC — Gridsmith Master release candidate

## Authority and release boundary

Verification date: 1 October 2026. The Master candidate `GS-MASTER-001-F` was owner-reviewed
locally before the Design/Digital remediation cycle and stayed uncommitted, byte-identical, through
`GS-DES-002-RC`, `GS-DIG-002-RC` and `GS-DES-002-M1-RC`. This phase verified it and promoted it to
staging. It is not a design phase. One defect found during verification needed a visible change in
the fallback path only; the owner reviewed it and approved it (`GS-MASTER-001-RC-R1`, below).

Staging only. Branch `staging/gs-press-001-press`, starting HEAD and remote
`146f93a0a8f68816b15410d5085c31b2f1e04c74`; main `fbecbe01e7fb594c6163dab57514997cb248fc21`
(untouched). Production deployment, aliases, DNS, production Sanity and production Supabase are
outside the phase. No CMS of any dataset was written.

**Programme baseline recorded here.** No docs-only checkpoint followed `GS-DES-002-M1-RC-R2`, so
this record also carries it: `146f93a0` is the first SHA on which the Design and Digital
remediation pass together — CI run `36810308636`, success on the first attempt, 47/47 steps;
`/digital` mobile LCP 1725 / 1716 / 1728ms, median 1725 against 1750, TBT median 51ms, CLS 0;
protected Preview `dpl_6wGKToq66FmoLnJtqJgZpmhgdgNw` READY at that SHA.

## The candidate (owner-reviewed, frozen)

Fifteen tracked files: `app/(marketing)/page.tsx`, `app/(marketing)/about/page.tsx`, the three
division `layout.tsx` metadata descriptions, `components/chrome/nav.ts`, `components/master/Home.tsx`,
`home.module.css`, `scene.ts`, `sceneModel.ts`, `scripts/check-master-hero.mjs`,
`check-master-scene.mjs`, `check-master-scene.selftest.mjs`, `prove-master-scene.mjs` and
`scripts/seed-content.mjs`. At RC start all fifteen matched the hashes recorded at `GS-DES-002-RC`,
`GS-DIG-002-RC` and `GS-DES-002-M1-RC` (`node_modules/.cache/gs-master-001-rc/`). Twelve are
committed unchanged; `home.module.css`, `check-master-scene.mjs` and `prove-master-scene.mjs` carry
the R1 correction and its gate only.

| Area | Delivered |
|---|---|
| H1 | *Most companies start over with every supplier. You shouldn’t have to.* — character-for-character under `check:master:hero` question 8 at 18 sizes |
| Studios | One source: `STUDIOS` in `nav.ts` (summary + thesis). The Master index, About's structure map and the first sentence of each division's metadata description all read it; none keeps a copy |
| Relationship | Chapter 02 heading *Gridsmith brings three specialist studios together under one relationship.*; statutory "trading divisions" wording only in the legal disclosure |
| Master offer | Four restrained lines — digital roadmap & discovery, strategy & advisory, programme management, ongoing partnership. No links, prices or studio catalogues. Named retainer tiers (operate / advance / partner) are not published: `SERVICE-ARCHITECTURE.md` §2 requires approved copy first |
| Scene (WebGL) | assembled mark → exploded (studios) → reassembled (relationship) → process chain → review ring held still (q13) → front-on mark; exact 8-sphere / 6-bar geometry at every resolved state (self-test) |
| Reviews | The cylinder: Previous / Next / Pause, counter, keyboard, reduced-motion still grid, backface-hidden rear cards |
| Footer | Shared footer mark `display:none` on `/`; the page's own front-on mark closes; footer-aware lift on phones (q12) |

## GS-MASTER-001-RC-R1 — the fallback was unreadable below the hero (owner-approved)

**Found by the independent walk, not by a gate.** With WebGL unavailable — no JavaScript,
Save-Data, `hardwareConcurrency ≤ 2` or `deviceMemory ≤ 2`, software-only WebGL, a failed import —
the scene layer shows `FallbackMark`, the logo's geometry as static gold shapes. The layer was
`position: fixed`, so every line of the page scrolled across the mark, and nothing dims a static
drawing behind text the way the renderer does. Measured with question 5's method (each text box's
own colour against the 98th-percentile luminance behind it, glyphs transparent) at 41 scroll
positions per size:

| | Phones 320–430 | 768×1024 | Desktop 1024–2400 |
|---|---|---|---|
| Candidate before R1 — text boxes below AA | 55–60 | 40 | 3–10 |
| `146f93a0` (the committed Master) — same | 44–51 | 35 | 5–12 |
| Worst reading, both | 1.00–1.04:1 | 1.00–1.01:1 | 1.00–1.04:1 |

So the defect **existed at the baseline** — it dates from `GS-R001-M` R1, which removed the veils —
and was not introduced by the candidate. No gate saw it: question 5 measures the WebGL scene only,
and question 7 looks at the fallback in the hero at 1440×900.

**Correction (CSS, fallback only).** `.scene[data-render="fallback"] { position: absolute; }`, and
`.scene { position: absolute; }` inside the existing `@media (scripting: none)` block. At scroll 0
nothing moves; the fallback layer — mark and glow — belongs to the first screen and leaves with the
hero, and the page continues on the body's own canvas (`#0B0907`). The WebGL path's selectors are
untouched. **Owner decision:** approved as reviewed — fallback visitors get a branded hero
composition, then normal readable content; there is deliberately **no fallback closing mark**, and
none is to be added.

**After.** Zero text boxes below AA at all ten sizes (320×568 … 2400×1350); worst 4.83:1 at
768×1024, otherwise 5.81–9.82:1. The fallback hero is unchanged (q7: 8/6 shapes, 7.5% coverage;
q9: LCP outside the scene layer).

**Gate.** `check:master:scene` question 14 — question 5's method without WebGL, at 25 scroll
positions top to bottom, at 1440×900, 768×1024 and 390×844; it fails if the page is not in
`fallback` (the subject) or if nothing was measured. Fixed candidate: 671 / 726 / 536 text boxes,
worst 7.5 / 10.1 / 8.4:1. **Proof:** `prove-master-scene` probe `s14` re-fixes the layer in the
prerendered HTML; red on question 14 alone — `14 1440x900 fallback @3082px: "05" measures 1.13:1`;
subject restored byte-identical. A red reading carries its own validity.

## Local verification

Clean worktree = `146f93a0` + the 15 files + this documentation; `.next` removed before each build;
Windows; no database or mail keys in the environment (the lead probe's notify branch asserted
`skipped`, no row written, no mail sent).

- `git diff --check` clean; `verify:static` PASS; `verify:build` PASS — `/` 5.6KB of 15KB, Master
  scene (lazy) 6.2KB of 8KB, Design scene (lazy) 7.9KB of 8KB; `verify:served` PASS (Lighthouse
  skipped on Windows by design — CI measures it).
- Served: axe 76 analyses, zero violations; responsive 51 combinations; Master scene 14 questions at
  12 viewports; Master hero 18 sizes; reviews UI; Design, Digital and Press scene gates; legal parity
  6/94/339; company facts; security headers.
- `prove-master-scene`: 29 of 29 probes red on their own question before R1 (subjects restored
  byte-identical). On the final build the fallback-adjacent probes were re-run: `s7` red on 7, `s9`
  red on 9, `s14` red on 14 (1.13:1); prerendered HTML restored byte-identical. Probes that touch
  only the WebGL scene, the hero or the cylinder were not re-run: R1 changes no selector they read,
  and the lazy scene chunk is byte-identical (`2588.a867b59ef65395fa.js`).
- Question 8 (software WebGL declined, ≤200ms blocking) also fired as a side reading in the `s9` and
  `s14` runs while passing in every clean run (103–121ms). Sampled directly on this machine it varies
  71–1586ms on **both** builds — baseline 122–1586, R1 71–246 — so it is local load, not R1.
- Fallback and no-JS walk, all ten sizes each: layer `absolute`, hero mark present at scroll 0
  (2.1–6.7% gold), 0.00% gold once the hero has left, 578–1198 text boxes over 41 positions with none
  below AA (worst 5.88:1), no overflow, no empty chapter, footer 20 links, footer mark `none`.
- Independent walk, ten sizes × motion / reduced motion: no overflow, no text-on-text collision, no
  runtime error; keyboard 26 stops, every one ringed, on screen, none in hidden content; Next moves
  *Review 1 of 11* → *2 of 11*. Live Freelancer API (read-only): 13 returned, 11 published, 2
  withheld (third-party names, `GS-O015`); withheld text absent from the page.
- Smoke at 390 and 1440: `/`, `/design`, `/digital`, `/press`, `/about`, `/approach`, `/insights`,
  `/contact`, `/legal/privacy` — one H1, header, footer (20 links), no overflow, no runtime error,
  noindex.

## Deferred and recorded

- **About intro** — *"One company, three specialist divisions…"* is development-CMS content
  (`groupPage` `about` `intro`); the seed already says "studios" and the Master route is correct. No
  CMS write in this RC; it moves with the CMS migration.
- **`/` metadata description** — *"…are its trading divisions."* lives in the shared Master layout,
  outside the candidate; for the integration/content review.
- `GS-O003` · `GS-O010` · `GS-O021` · `GS-O022` · production CMS migration · final integration /
  programme RC · controlled production cutover.

## Exact-SHA release receipt

The final commit cannot contain its own hash. Following the Design/Press/Shared RC convention, the
final SHA, remote/main checks, CI run, Lighthouse medians and the protected Preview are recorded in
the release handoff and `node_modules/.cache/gs-master-001-rc/final-release-receipt.json`. Master is
not RC-verified until that CI run succeeds.
