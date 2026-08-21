# A-GATE run 3 — consolidated audit report

**Date:** 13 August 2026 · **Branch:** `feat/a-01-a-10a-scaffold-ci` · **Runtime:** Node 24.15.0
· **Working tree:** clean throughout; no probe route created, no file edited.

This is the run-3 attempt at A-GATE criteria 5 and 6. Criterion 6 was run as two narrow
`accessibility-audit` passes, as in round four. Criterion 5 was attempted with
`rules-compliance` and is supplemented by a direct sweep from the auditing context, which
is recorded separately and marked as such — a criterion worded "fresh context, zero
findings" is not met by the auditor's own sweep, and nothing here claims otherwise.

**Findings are left as written.** Do not edit them to match a later tree.

---

## Verdict

**No. Epic A does not pass A-GATE.**

| # | Criterion | Status |
|---|---|---|
| 1 | 23 of 24 primitives in four themes | MET (unchanged) |
| 2 | Correct at 375 / 768 / 1440 | MET (unchanged) |
| 3 | Keyboard navigable end to end | MET (unchanged) |
| 4 | Zero hardcoded colours | MET — `lint:colors` clean across 73 files |
| **5** | `rules-compliance`, fresh context, **zero findings** | **NOT MET.** Third completed run, third to return findings: 1 blocker, 2 majors, 3 minors, plus one claim that is unverifiable by construction |
| **6** | `accessibility-audit`, fresh context, **zero violations** | **NOT MET.** 1 Major + 2 Minor + 1 Info from run 3a; 1 Major (gate) + 1 Major (unconfirmed) + 2 Minor (gate) from run 3b; A11Y-26 confirmed real |

Both criteria are worded with no partial credit. Neither returned zero.

**What is genuinely better than it was.** All six items that rounds 1–2 recorded as fixed
were independently re-verified here and all six hold up. That is not nothing: two previous
rounds of "fixed" did not survive re-audit. The gate suite is also measurably stronger —
`check-axe`'s theme probe was proven to fail by deliberate stylesheet interception, and
`check-node-version` now machine-confirms the fourteen-gate count.

**What stops the gate.** Every remaining finding but one is a *recurrence of a defect class
this repository has already named, fixed elsewhere, and written a rule about.* That is the
pattern, not the individual bugs.

---

## 1. Criterion 6, run 3a — the 24 primitives and `/_kitchen-sink`

**Scope:** `components/primitives/` (24 components + 5 CSS modules) and
`app/(marketing)/%5Fkitchen-sink/`, all four themes. Routes and render paths excluded.

`check-axe` reported **zero violations across 24 analyses** (6 routes × 375/1280px ×
initial/scrolled). `check-contrast` reported 29 pairs and all 101 matrix cells within
role minima. Every ratio was recomputed independently from resolved hex and agreed with the
gate to two decimals; **no published figure in the four `DESIGN.md` §2 tables that the gate
covers is now wrong.**

### A11Y-1 to A11Y-4 — all four independently confirmed FIXED

Re-verified against the tree, not against the write-up that recorded them.

| ID | Verdict | Evidence |
|---|---|---|
| A11Y-1 | **Fixed** | `Breadcrumb.tsx:45-50` emits `styles.breadcrumbLink` + `interactive.focusable`. Both rules exist and are non-empty (`content.module.css:148-152`, `interactive.module.css:14-17`). Link is `--ink` underlined, current crumb `--ink-muted` and not — distinct in two channels, not colour alone. Recomputed worst cells: link 15.42:1, focus ring 15.42:1, hover `--accent` 4.58:1. All clear |
| A11Y-2 | **Fixed** | `EmptyState.tsx` and `ErrorState.tsx` both take `headingLevel?: 2\|3\|4\|5\|6` defaulting to 3 and render a real heading element. `ErrorState.tsx:41`'s remaining `<p>` is the reference line, which is correct. `.title` sets font-family/size/colour only, so appearance survives |
| A11Y-3 | **Fixed** | `Container.tsx:28-30,37-41,46-49` declares `id`, `ariaLabel`, `ariaLabelledBy` individually — not a rest spread, so `role`/`tabIndex` stay inadmissible, exactly as the fix note claims |
| A11Y-4 | **Fixed for `a` and `button`** | `content.module.css:43-52`. `.cardLinked` is `position: relative` with no `z-index`, so it creates no stacking context and `1` beats `0` regardless of DOM order. The reasoning is correct, not merely asserted. See NEW-2 for what the selector does not cover |

### A11Y-26 — the gap is REAL

`%5Fkitchen-sink/page.tsx` contains **exactly one** `.cardLinked` specimen, at lines
172-177, carrying **one** link inside the heading. `grep -c` for `linked` in that file
returns 1.

The consequence, stated precisely: the selector
`.cardLinked :is(a, button):not(:is(h1..h6) a)` — the half of the A11Y-4 fix that does the
actual work — **matches zero elements on the only page CI renders.** `check-axe`'s 24
analyses and `check-responsive` therefore cannot detect an A11Y-4 regression. Deleting the
`z-index: 1` rule outright would leave every gate green.

The tracker's own note that the fix "was proven by injecting a sibling link at runtime"
describes a proof that does not survive into CI. A `<Card linked>` specimen carrying a
title link **and** a second link is what would close it.

### New findings — run 3a

| Severity | WCAG SC / spec | file:line | Spec requires | Code does |
|---|---|---|---|---|
| **Major** | `press/DESIGN.md` §2:51, §2:62 | `app/(marketing)/%5Fkitchen-sink/kitchen-sink.module.css:24-31` | `--ink-subtle` on `--canvas` is 4.56:1 in Press and carries "AA — **17px minimum, never below**"; §2:62 calls the floor "genuinely not negotiable". The floor is the entire reason the token is permitted as text there | `.specimenName` sets `color: var(--ink-subtle)` at `font-size: var(--text-xs)` = **12.06px at 375px, 13px at 1440px**. Rendered 23× inside `[data-division="press"]`. Numerically 4.56:1, so 1.4.3 passes and `check-contrast` cannot see it — the gate measures token/surface pairs, not the size of the declarations that use them. This is the **A11Y-22 class, in a new and unlisted instance**, and it is the only `--ink-subtle`-as-text declaration in scope: the primitives use the token for borders only, and `interactive.module.css:92-97` documents avoiding this exact trap for `::placeholder` |
| **Minor** | 2.5.8 (nearest fit — see note) | `components/primitives/content.module.css:49` | The A11Y-4 fix must lift **every** interactive descendant above the `inset: 0` overlay. CLAUDE.md: "Fix the class, not the instance… a per-instance fix leaves the same defect live everywhere else" | The lift selector is `:is(a, button)` only. A `<Card linked>` containing an `<input>`, `<select>`, `<textarea>`, `<summary>` (nested `Accordion` renders `<summary>`, not a button) or any `[tabindex]` element leaves that control under the overlay: tabbable, focusable, unclickable by pointer. Identical failure mode to the one just fixed, one element-type list away. No current caller triggers it — and per A11Y-26 nothing would detect it if one did |
| **Minor** | 1.3.1 (F2) | `app/(marketing)/%5Fkitchen-sink/page.tsx:98` + `kitchen-sink.module.css:24-32` | A11Y-2 established that text presented as a heading must be marked up as one. `Heading` separates `level` from `size` precisely so a small label can still be a real heading | `Specimen` renders its name as `<p className={styles.specimenName}>`, styled as a section label with a rule under it. It is the heading of 23 specimen blocks × 4 frames. Heading navigation goes h1 → 4×h2 and then into specimen content with no way to reach a named specimen. **The A11Y-2 defect class, still live on the page built to exercise the primitives.** Not machine-detectable, so axe cannot flag it |
| Info | `press/DESIGN.md` §5:74, §2:62 | `styles/globals.css:34-39`, `styles/tokens.css:23,31` | Press body: serif, **17px minimum**, leading 1.7 | `body` sets `line-height` but **no** `font-size`, so Press body renders at the UA default 16px. `--text-base` is `clamp(…)` = 16.08px at 375px, reaching 17px only at 1440px. Not a WCAG failure (AA sets no minimum type size) and no gate covers it — but it partially undermines the §2 argument that the 17px floor is what makes Press's 4.56:1 `--ink-subtle` acceptable |

*Note on the SC for the Minor:* WCAG 2.2 names no criterion for pointer occlusion directly.
2.5.8 is the nearest fit — a fully occluded target has an effective size of zero. Run 1
recorded the original A11Y-4 against `press/DESIGN.md` §5 for the same reason. Keyboard
operation is unaffected, so 2.1.1 is not engaged.

Nothing in A11Y-5 … A11Y-24 has degraded, and no 13 Aug fix made one of them wrong.
A11Y-14 recomputes at **4.58:1**, unchanged and still the tightest cell in the programme;
A11Y-9 recomputes at a 1.30–1.38:1 delta, matching the recorded figure.

---

## 2. Criterion 6, run 3b — the served routes and render paths

**Scope:** `/`, `/design`, `/digital`, `/press`, `/_not-found`, `app/global-error.tsx`,
the four route-group layouts, `RootShell`, `styles/`. Primitives and `/_kitchen-sink`
excluded.

**axe: zero violations across 10 analyses** on the five rendered surfaces
(375×812 and 1280×900, tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`).
DOM facts correct on every surface: one `<html>`, one `<body>`, `lang="en-GB"`, one
`<main>`, one `<h1>`, no heading skips, no positive `tabindex`, body background equal to
`--canvas`, `.sr-only` and the reduced-motion block present in the CSSOM. Division
typography correct per theme (Digital's h1 monospace, Press serif).

### Both round-2 defects independently confirmed FIXED

**`/_not-found` token layer — fixed, and verified the right way.** Not by asserting
`body[data-division]` (the assertion that stayed green throughout the original defect) but
by reading computed values off the rendered document: three stylesheets linked, `--canvas`
`rgb(255,255,255)`, `--ink` `rgb(15,15,15)`, **`--text-2xl` 46.4px** (was 16px when
undefined), body font Inter (was Times New Roman), h1 64px, focus ring restored to a real
UA ring. `experimental.globalNotFound` is set at `next.config.ts:41-43` and the build
banner confirms it.

Incidentally: the raw prerendered 404 now contains **exactly one `<html>` start tag**
carrying `lang="en-GB"` directly. The second streaming shell is not in this build, so
`lang` no longer depends on parser attribute-merging. **A11Y-19's risk note is stale in the
good direction** — recorded here, not re-reported.

**`global-error`'s `<title>` — fixed in the render path.** The `<title>` survives
compilation as a real React element inside `<html>` in
`.next/static/chunks/app/global-error-*.js`, and that chunk is wired into every route's
boundary via the RSC payload. Source, compiled chunk and boundary wiring all confirmed
independently.

**`check-axe`'s theme probe does what it claims, proven by deliberate failure.** With
`b9a3fbec…css` blocked by request interception, the assertions returned five problems and
exit 1: all four tokens "resolve to nothing", plus `body bg != --canvas`.

### New findings — run 3b

| Severity | SC / rule | file:line | Spec requires | Code does |
|---|---|---|---|---|
| **Major (gate)** | CLAUDE.md — "every gate proven by deliberate failure"; DoD "axe zero violations" | `scripts/check-axe.mjs:47-54` | `app/global-error.tsx` is a served surface, and its `lang`/`<title>`/`<main>`/`<h1>` were an audited Level A + serious fix on 13 Aug | **No gate references `global-error` anywhere.** `grep -rn "global-error\|globalError" scripts/ .github/ lighthouse/` returns nothing — confirmed directly. The fix was proven once by a hand-built probe that was then deleted; its only surviving evidence is the docstring at `global-error.tsx:39-50`. A regression is undetectable by CI. **The one surface carrying a possible live Level A failure is the one surface no gate looks at** |
| **Major — UNCONFIRMED** | 3.1.1 (A), 2.4.2 (A) | `app/global-error.tsx:39-46` | Every render path outside the four route groups supplies `lang` and a title — the stated root cause of the `/_not-found` defect | A **server-side** throw is claimed never to reach this boundary; Next serves the static `__next_error__` shell (present in this build at `.next/server/pages/_error.js`) with no `lang`, no `<title>`, no `<main>`. If so, the 13 Aug commit fixed the **client half of a two-path root cause** while citing the rule against exactly that. **Not established:** a production 500 could not be induced without editing a file. See §5 — the repository asserts the same behaviour as settled fact with no gate behind it, which by CLAUDE.md's own rule makes it unverified in both directions |
| **Minor (gate)** | CLAUDE.md — "a gate that can skip its subject silently" | `scripts/check-axe.mjs:157` | The token-layer probe must fail if the stylesheet goes missing | Probes `--canvas`, `--ink`, `--line`, `--accent` — **all four defined in `styles/themes/*.css`**. Nothing probes a `tokens.css`-only value, and `--text-2xl` is precisely the token whose absence put the 404's h1 at 16px. It passes today only because `@import` bundles both into one file: **the check is adequate by accident of bundling.** Splitting the CSS output would silently re-open the original defect. Confirmed directly |
| **Minor (gate)** | 1.4.3 (AA) | `scripts/check-axe.mjs:241` | axe results must be acted on | Destructures `{ violations }` only. `incomplete` — axe explicitly reporting that it *could not determine a result* — is discarded without a word. **Eight `color-contrast` incompletes are currently being reported as `clean`.** Confirmed directly. The eight were resolved by hand and all pass (the cause is that the placeholder pages have zero chrome, so `h1`/`main`/`body` share one rect flush to the viewport edge and axe's sampling cannot resolve a background box) — the point is that the gate cannot resolve them and does not say so |

### A measurement caveat worth keeping

Run 3b's first pass hit a **stale Next process already listening on port 3100**, serving a
different build, and reported exactly the historical defect — every token undefined, Times
New Roman, `--text-2xl` at 16px. That reading was discarded and the run repeated against a
verified-fresh server.

This is the fifteenth-instance class from `01-VALIDATION-REPORT.md` §14, arriving from the
other direction: a **false red** rather than a false green. `scripts/with-server.mjs`
refusing a busy port is what protects `npm run verify` from it; an ad-hoc audit has no such
guard. A foreign Next process is **still listening on port 3100** and was deliberately left
alone — it will mislead the next person who audits against that port.

---

## 3. Criterion 5 — rules-compliance

**The agent completed on the second attempt** — the first terminated on an account session
limit before returning anything. This is the **third completed `rules-compliance` run**,
and the third to return findings.

Findings below are marked `[RC]` where they come from the agent's fresh context and `[AS]`
where they come from a supplementary sweep by the auditing context. Only the `[RC]` findings
bear on the criterion: an auditor's own sweep can fail criterion 5 but cannot pass it, since
the criterion requires a fresh context for the documented reason that the model which
received the previous findings is the worst reviewer of the fixes. The two sets overlap on
one finding and are otherwise disjoint, which is itself informative — neither pass was a
superset of the other.

### Recorded as fixed — confirmed from the repo

| Claim | Verdict | Evidence |
|---|---|---|
| `app/global-error.tsx` exists with `lang`, `<title>`, one `<main>`, one `<h1>`, raw elements | **Confirmed** | Read in full. No primitive imports, no `next/font` |
| `check-node-version.mjs` walks the `verify:*` chain and diffs it against `ci.yml` | **Confirmed** | `scripts/check-node-version.mjs:117-165`. Ran it: *"14 gates, and `npm run verify` and ci.yml run the same set"* — the first machine-checked confirmation of that count |
| `check-responsive.mjs` hard-fails at zero scroll-reserve measurements | **Confirmed** | Line 183, `if (barsMeasured === 0)`, with the A-12 instruction in the message |
| `check-tokens.mjs` uses a hardcoded required list | **Confirmed** | Line 49, `const REQUIRED`, checked in both directions |
| `check-contrast.mjs` asserts literal counts | **Confirmed** | `EXPECTED_PAIRS = 29` and `EXPECTED_CELLS = 101` at lines 44-45, asserted separately at 236 and 300 |
| `check-axe.mjs` probes computed theme, not the attribute | **Confirmed** | Lines 152-178, and proven by deliberate failure in run 3b |
| No `Field` hint paraphrases the response commitment | **Confirmed** | The only occurrence in `app/` or `components/` is the explanatory comment at `%5Fkitchen-sink/page.tsx:208-213` |
| Six corrected figures — `--accent-design` 2.16:1, `--accent` 4.58–9.25:1, focus 15.42:1 | **Confirmed** | `npm run check:contrast` measures `--accent-design` on `--canvas` at exactly **2.16:1**. The other figures match across `PROJECT-RULES` §1.2, `FOUNDATION` §3, `press/DESIGN.md` §2 and the `design-conformance` brief |
| `lint:colors` clean | **Confirmed** | 73 files, up from the recorded 72 |
| Fabricated prices removed from `/_kitchen-sink` | **Partially — see finding C-1** | `£1,250`, `£980` and `REV-02` are gone from the Table specimen. Two other instances in the same file are not |

### Findings

| Severity | Rule | file:line | What the rule says | What the code does |
|---|---|---|---|---|
| **Blocker** `[RC]` `[AS]` | CLAUDE.md non-negotiable #2; `master/PROJECT-RULES.md` §5 | `app/(marketing)/%5Fkitchen-sink/page.tsx:224` | "Never invent content… prices… Mark `[TK]` and stop." §5: "**never a plausible figure**" | The `Select` specimen renders `Under £5,000` and `£5,000 – £15,000` — plausible budget bands, prerendered into HTML. **Two specimens below the Table whose fix comment says the rule was "broken two specimens above"**. The round-2 fix corrected the instance it was handed and did not sweep the file it was already inside. The bands also contradict the only budget bands defined anywhere in the repo (`press/APP-FLOW.md:128`: Under £500 / £500–£3k / £3k–£10k / £10k–£30k / £30k+), so they are invented rather than borrowed. **Found independently by both passes** |
| **Major** `[RC]` | CLAUDE.md — "Update the spec in the same commit as any deviation"; non-negotiable "CI is the arbiter. Never add a bypass" | `eslint.config.mjs:50` | The `no-html-link-for-pages` suppression is recorded in three places as scoped in `eslint.config.mjs` to one file, "with the numbers, **rather than an inline disable someone later reads as noise**" (the config's own comment, `:48-49`) | `files: ['app/not-found.tsx']` — **that file does not exist.** It was renamed to `app/global-not-found.tsx` when `experimental.globalNotFound` was adopted and the override was not renamed with it. The block matches nothing and is dead. ESLint passes only because of an inline `// eslint-disable-next-line` at `app/global-not-found.tsx:96` — **exactly the mechanism the config comment disclaims**. The measured 4.3KB rationale, which is the justification under non-negotiable #8, now lives on a path nothing matches; tidy away the inline disable and the failure looks unexplained. Verified directly |
| **Major** `[AS]` | CLAUDE.md non-negotiable #2 | `app/(marketing)/%5Fkitchen-sink/page.tsx:123` | Same as the Blocker above — invented revision numbers are named in the same rule as prices | The Prose specimen renders `<code>REV-04</code>`. The same round-2 fix zeroed `REV-02` → `REV-00` in the Table specimen and left this one. Same file, same rule, same commit. **Third instance of the one class in one file** |
| **Minor** `[RC]` | Same as the ESLint Major — the documentation half of it | `01-VALIDATION-REPORT.md:586`, `05-HANDOVER.md:382,400`, `next.config.ts:27`, `eslint.config.mjs:50` | The specs must name real paths. §14 and §7 are what a fresh session is explicitly told to trust rather than rediscover | **Five live references to `app/not-found.tsx`**, a file that does not exist — including `05-HANDOVER.md:400` ("switched off for `app/not-found.tsx` alone, in `eslint.config.mjs`") and `01-VALIDATION-REPORT.md:586` ("`app/not-found.tsx` now renders the master shell itself"). A fresh reader following either lands on nothing. Verified directly. (`07-A11Y-AUDIT.md` uses the old path throughout, but that is a dated findings table and is correctly excluded) |
| **Minor** `[AS]` | CLAUDE.md — "Update the spec in the same commit as any deviation" | `components/primitives/Tabs.tsx:2` | A comment that has silently drifted is worse than none — the next session follows it | Asserts *"The only client component in this tier."* It is not: `RevealOnScroll.tsx:1` and `StickyCta.tsx:1` are both `'use client'` in the same directory, and `05-HANDOVER.md` §1 records 21 Server / 3 Client |
| **Minor** `[AS]` | CLAUDE.md "How to work" — "One tracker task per session or PR… is a unit of work" | `docs/*/PROJECT-TRACKER.md` | A tracker task ID is the unit of work, so it must resolve to one thing | **`Epic S` is "Seed content" in master's tracker and "Digital shell" in digital's. `Epic N` is "Master pages" in master's and "Path Finder & conversion" in press's.** A comment or commit citing "Epic S" is unresolvable without knowing which tracker was meant |
| **Minor** `[AS]` | Same | `app/(press)/press/page.tsx:3` | — | Cites "Epic R" (Press *Trust architecture*) where Press's shell epic is **P**. The other three placeholder pages each cite their correct shell epic (`N`, `B`, `S`) |

### Clean

- **Non-negotiable #7 / `PROJECT-RULES` §6 — consent.** Zero references to `gtag`,
  `googletag`, `posthog`, `analytics`, `cookie`, `localStorage`, `sessionStorage`,
  `<script` or `fetch(` anywhere in `app/` or `components/`. Holds by construction at this
  stage.
- **§2 code conventions.** No `any`, no barrel files, named exports throughout. All three
  client components (`RevealOnScroll`, `StickyCta`, `Tabs`) carry a justifying comment, and
  each justification is substantive rather than "easier".
- No `console.*` in `app/` or `components/`. No unflagged `[TK]`.
- **Non-negotiables #3, #4, #6, #9, #11** and `PROJECT-RULES` §4 have no subject yet — no
  service pages, no seed records, no legal pages, no CMS. Recorded as a standing deviation,
  not a violation: A-06 and A-07 are blocked on `Q-M17` / `Q-M18`.

---

## 4. `A11Y-26` and the shape it belongs to

A11Y-26 was already in the tracker as an open observation. This run **confirms it is real**
and sharpens what it costs. It is worth stating as a class, because three of run 3a's five
findings share it:

> **A fix whose only proof was a temporary artefact is a fix with no gate.**

Three instances now, all from the same fix session:

1. **A11Y-4** was proven by injecting a sibling link at runtime. The injection is gone; the
   kitchen sink has no second-link specimen; the working half of the selector matches
   nothing in CI.
2. **`global-error`** was proven by a temporary throwing probe route. The probe is gone; no
   gate references the file; the evidence is a docstring.
3. **The `__next_error__` SSR claim** at `global-error.tsx:39-46` was never proven at all
   and is written as settled fact.

This is adjacent to but distinct from the five recorded gate defects. Those were checks
that *ran and measured nothing*. These are fixes that were **verified by something that was
then deleted** — so there is no check to be green or red. `05-HANDOVER.md` §2 already
records the sharper version of this for CI itself: *"Proven by deliberate failure had only
ever been applied to what a gate asserts, never to whether it is reached."* The next
extension is that it has never been applied to whether a **subject** exists for the gate to
reach.

---

## 5. Recorded as fixed that a fresh reader cannot verify

This was an explicit ask of the run. Three items.

1. **The round-2 `rules-compliance` findings are not enumerable.** `05-HANDOVER.md` §10 and
   `master/PROJECT-TRACKER.md` both record **"4 blockers, 4 majors, 7 minors"** — fifteen —
   and "All fixed". §10's prose describes roughly eleven: three blockers, two gate fixes and
   six corrected numbers. **The four majors and seven minors are not individually itemized
   anywhere in the repository.** There is no `08-…` audit file for round two the way
   `06-EPIC-A-AUDIT.md` and `07-A11Y-AUDIT.md` exist for the other rounds. A fresh reader
   asked to "confirm each from the repo" cannot, because the list does not exist. **A
   criterion recorded as "all fixed" against a set that cannot be enumerated is unverifiable
   by construction**, and it is the exact shape of unearned confidence CLAUDE.md's gate rule
   exists to prevent — applied to a document rather than a script.
2. **The SSR half of the `global-error` claim.** `global-error.tsx:39-46` states as fact
   that a page throwing during SSR never reaches the boundary and that production serves the
   `__next_error__` shell. Run 3b confirmed the shell exists in the build but could not
   induce a production 500 without editing a file. Per CLAUDE.md — *"if you meet an asserted
   number that no gate covers, treat it as unverified and say so"* — this is unverified in
   both directions. It is load-bearing: if the claim is true, a Level A failure ships on
   every server-side crash.
3. **`document.title` in a live crashed DOM.** Confirmed in source, in the compiled chunk,
   and in the boundary wiring. Not confirmed at runtime, because that needs a client-side
   throw and therefore a probe route, which both runs were told to avoid. The right fix is
   not to repeat the probe but to put `global-error` behind a permanent gate.
4. **The 5.8KB / 0.4KB split of the 6.2KB primitive delta.** `check-bundle-size.mjs:53`
   enforces only the 7KB ceiling on `/_kitchen-sink` as a whole; **no gate decomposes the
   figure.** The split is prose in `05-HANDOVER.md` §6 and §10 — and `M-06`'s arithmetic
   (consent 8KB + primitives 5.8KB + boundary 0.4KB = 14.2KB of Master's 15KB, leaving
   0.8KB of headroom) rests entirely on it. Per CLAUDE.md, an asserted number no gate covers
   is unverified, and this one is load-bearing for the next budget checkpoint in the
   programme.

---

## 6. What would close each criterion

**Criterion 6** — six items, none large:

- Raise `.specimenName` above the Press 17px floor, or stop using `--ink-subtle` for it.
- Extend the `.cardLinked` lift selector to `input`, `select`, `textarea`, `summary`,
  `[tabindex]`.
- Make `Specimen` render a real heading.
- Add a `<Card linked>` specimen with a title link **and** a second link — this closes
  A11Y-26 and gives the A11Y-4 fix a subject in CI.
- Add `global-error` to a gate. This closes the Major and supersedes the two Unverified
  items, since a gate that renders it answers both.
- Have `check-axe` report `incomplete` rather than discard it, and probe one
  `tokens.css`-only value such as `--text-2xl`.

**Criterion 5** — sweep the two remaining invented-content instances in
`%5Fkitchen-sink/page.tsx` **as a class rather than as instances** (grep the file for every
currency symbol and every `REV-`); repoint `eslint.config.mjs:50` at
`app/global-not-found.tsx` and delete the inline disable it makes redundant; fix the five
stale `app/not-found.tsx` references; correct the `Tabs.tsx:2` comment; resolve the
`Epic S` / `Epic N` collisions and the `Epic R` citation. Then run `rules-compliance`
again — and note that this is now the **third** round in which the fixes will be applied by
the context that received the findings.

**Neither criterion can be closed by the session that applies these fixes.** That is the
whole reason both are worded the way they are, and two previous rounds have now demonstrated
the cost of ignoring it.

---

## 7. Housekeeping

- **Working tree clean.** `git status --porcelain` empty after all three runs. No probe
  route was created — run 3b exercised the 404 by requesting a non-existent path, which
  needs no file.
- **A foreign Next process is listening on port 3100** and was deliberately left alone. Use
  `VERIFY_PORT=…` rather than killing a process that may not be yours (`05-HANDOVER.md` §5).
- **Lighthouse did not run.** Both axes skip on Windows and exit 0 (A11Y-25, still open).
  Nothing in this report is evidence for either axis; CI on `ubuntu-latest` is.
- **`05-HANDOVER.md` §7, not §8**, is the do-not-redo list. §7 says so in its own opening
  paragraph, and the brief for this run cited it as §8 — the mis-citation §7 exists to
  correct is still happening.
