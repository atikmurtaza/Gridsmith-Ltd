# A-GATE run 4 — scoped re-verification of the nine run-3 findings

**Date:** 14 August 2026 · **Branch:** `feat/a-01-a-10a-scaffold-ci` · **Runtime:** Node 24.15.0
· **Working tree:** clean throughout, verified after every deliberate-failure edit. No probe
route left behind. The one `git stash` entry predates this session and was not touched.

Round 4 was **scoped to re-verifying the nine run-3 findings and their `G1`–`G8` fixes**, not
a fourth open-ended audit. Two passes, each in its own fresh context: `accessibility-audit`
(criterion 6) and `rules-compliance` (criterion 5). `G7` (the Epic identifier collisions) and
round 2's finding list were explicitly out of scope and are neither re-reported nor closed
here.

Each finding was put to three separate questions rather than one:

> **(a) Is the fix present? (b) Does a gate reach it? (c) Does that gate fail when the fix is
> reverted?**

That split is what this report is for. Six of the ten items answer **yes / yes / yes**. The
failures are concentrated in (b) and (c) — fixes that are present and believed gated, and are
not.

**Findings are left as written. Do not edit them to match a later tree.**

---

## Verdict

**No. Epic A does not pass A-GATE.**

| # | Criterion | Status |
|---|---|---|
| 1 | 23 of 24 primitives in four themes | MET (unchanged) |
| 2 | Correct at 375 / 768 / 1440 | MET (unchanged) |
| 3 | Keyboard navigable end to end | MET (unchanged) |
| 4 | Zero hardcoded colours | MET (unchanged) |
| **5** | `rules-compliance`, fresh context, **zero findings** | **NOT MET.** Fourth completed run, fourth to return findings. One run-3 finding was **never fixed** despite being recorded as fixed; one struck claim is still asserted; one gate cannot be made to fail |
| **6** | `accessibility-audit`, fresh context, **zero violations** | **NOT MET.** Zero AA failures in any primitive and zero axe violations across 28 analyses — but four new items, one of them the ninth gate-class defect |

Both criteria are worded with no partial credit. Neither returned zero.

**What is genuinely better.** Seven of the ten re-verified items are present, gated by a
permanent committed subject, and **proven to fail on revert with captured output**. `G3`,
`G4` and `G5` in particular are now among the strongest gates in the repository: the
linked-card specimen exists and CI renders it, the `elementFromPoint` scroll-into-view was
independently confirmed load-bearing, the `incomplete` allowlist was proven unable to swallow
a new entry, and the `global-error` probe was proven to fail when its throw is neutered. The
`check:headings` display-face scope is in force, documented beside the gate, and restated at
the call site — it has not been silently widened.

**What stops the gate.** Two of the nine run-3 findings are not fixed at all, and **two
gates written during `G1`–`G8` cannot be made to fail.** The prediction that a ninth
gate-class instance existed was correct, and there are two.

---

## 1. The ten re-verified items

| # | Item | (a) Present | (b) Gated | (c) Proven | Note |
|---|---|---|---|---|---|
| G1/G1b | `--ink-subtle` re-derived, four themes | **yes** | **yes** | **yes** | Gated by the drift check and permission matrix, **not** by the new size pass — see `A-GATE-4-1` |
| G2a | `Stepper` renders a real heading | **yes** | **yes** | **yes** | `check:headings` fires on revert |
| G2b | `Specimen` renders a real heading | **yes** | **no** | n/a | Ungated **by design**, documented in two places — see `A-GATE-4-11` |
| G3 | `.cardLinked` lift selector + specimen | **yes** | **yes** | **yes** | Permanent specimen; scroll-into-view confirmed load-bearing |
| G4 | `check-axe` `incomplete` + token probe | **yes** | **yes** | **yes** | Allowlist proven unable to swallow a new incomplete |
| G5 | `global-error` has a gate | **yes** | **yes** | **yes** | Probe committed, non-`_`-prefixed, hollow-subject assertion proven |
| G5b | The SSR claim struck | **partly** | n/a | n/a | Struck in two files, **still asserted in a third** — `A-GATE-4-6` |
| G6a | Invented content zeroed | **yes** | **yes** | **partly** | No fourth instance. Gate passes three inputs that should fail it |
| G6b | ESLint override repointed | **yes** | **yes** | **yes** | Now genuinely load-bearing; inline disable gone |
| G6c | Five stale `app/not-found.tsx` refs | **yes** | n/a | n/a | Every surviving hit is explicitly historical |
| G6d | `Tabs.tsx:2` comment corrected | **NO** | no | n/a | **Never fixed** — `A-GATE-4-5` |
| G8 | Delta decomposed | **yes** | **half** | **half** | Primitive half proven; shared-baseline half unreachable — `A-GATE-4-3` |

### The two answers the brief asked for specifically

**`check:headings` is scoped to the display face and the limit is stated, not widened.**
`scripts/check-headings.mjs:69` matches only `font-family:\s*var\(--font-display\)`;
`NON_HEADING_TAGS` is `['p','span','div']` with `<summary>` deliberately excluded (`:52-55`);
the reasoning is written at `:36-47` — *"covers the display-face shape completely and the mono
shape not at all… Do not widen it to mono + uppercase"* — and restated at the call site
(`%5Fkitchen-sink/page.tsx:107-112`). **Confirmed in force, documented, and not forgotten.**
The cost of that limit is real and is `A-GATE-4-11`: `Specimen`'s heading is mono, so the
second half of `G2` has no gate.

**The `G8` shared-baseline assertion is *not* a second line of defence.** It is unreachable
code, and the relationship is not written down. See `A-GATE-4-3` and `A-GATE-4-4`.

---

## 2. The ninth gate-class instance — and there are two

The brief said to assume a ninth existed. Two do. Both were written during `G1`–`G8`, both
by an author who had just read the rule requiring the proof, and **neither is findable by
reading the code** — only by trying to make the gate fail.

### `A-GATE-4-3` — `check-bundle-size`'s shared-baseline assertion is unreachable

**Severity: major (gate).** `scripts/check-bundle-size.mjs:300` vs `:218-232`.

The baseline routes are the cheapest rows in the build, so
`cheapest = FLOOR + shared`. The floor check fires when `cheapest > FLOOR_KB + FLOOR_TOLERANCE_KB`
(`:219`) and `FLOOR_TOLERANCE_KB = 1.0` (`:36`). The shared-baseline check fires when
`shared > SHARED_BASELINE_BUDGET_KB` and `SHARED_BASELINE_BUDGET_KB = 1.0` (`:273`).

**The two predicates are identical**, and the floor check `process.exit(1)`s at `:231`, 69
lines before the decomposition block runs. The floor check strictly subsumes it.

Proven by deliberate failure — importing `Tabs` into `app/global-error.tsx` pushed the shared
baseline 0.5 → 1.6KB, over its 1.0KB budget:

```
/                          101.8KB      1.6KB      15KB  ok
check-bundle-size: the cheapest route in the build measures 101.8KB,
against a declared floor of 100.2KB. …
```

The decomposition block **never printed**. Independently re-derived from the source by the
auditing context.

This is the exact shape of `A11Y-29` — a predicate with no input that can reach it — one
level up: there, the predicate was narrowed to the already-passing set; here, an earlier
check with the same predicate exits first. `G8` was written to make `M-06`'s headroom
*measured rather than asserted*. **Half of it is still asserted**, and the half that is
unreachable is the 0.5KB boundary figure, which is the half `M-06`'s 0.8KB of headroom is
most sensitive to.

### `A-GATE-4-1` — `check:contrast`'s size pass has no independent power

**Severity: major (gate).** `scripts/check-contrast.mjs:392`, `:426-439`.

Every token in `USE` claims `role: 'body'`, so the permission matrix already requires ≥4.5:1
on every surface. The size pass needs `r + 0.02 < 4.5` for small text — strictly weaker —
and only *relaxes* to 3.0 at ≥24px. Its stated purpose, *"a token permitted as body text used
at a size its measurement does not support"*, is **unreachable under the current `USE`**.

Meanwhile `:392` `if (!use || use.role === 'decor') continue` makes a decorative token painted
as small text pass silently and uncounted:

```
TEST A: .gateProbeA { color: var(--accent-design); font-size: var(--text-xs); }   # 1.96:1 as 12px text
  check-contrast: size pass — 252 declaration/surface combinations …   EXIT=0     # count unchanged: skipped entirely
TEST B: .gateProbeB { color: var(--ink-subtle); font-size: var(--text-xs); } + press token reverted
  check-contrast: 1 size/contrast problem(s) …  EXIT=1
```

Test B exits 1 — but only on an input the matrix already rejects. The `except`-branch's
no-subject state is documented at `:419-425`; the other branch's lack of independent power is
not.

**Consequence for `G1`:** the `--ink-subtle` fix is genuinely present and genuinely proven —
by the drift check and the permission matrix, both of which predate `G1`. Reverting
`press.css` to `#78716C` produces:

```
check-contrast: 1 pair(s) disagree with DESIGN.md by more than 0.02
  press: --ink-subtle on --canvas — DESIGN.md says 5.4:1, measured 4.56:1
check-contrast: 1 permission-matrix problem(s) …
check-contrast EXIT=1
```

The size pass reported **nothing** on that revert. No stylesheet pairs `color: var(--ink-subtle)`
with a `font-size` any more, so the pass has no `--ink-subtle` subject at all. `G1` holds; the
gate `G1` shipped does not add what it claims.

`A11Y-31` is separately confirmed closed: `scripts/check-contrast.mjs:140` is a bare
`'--ink-subtle': { role: 'body' }` and no `except:` key exists anywhere in `USE` or
`ON_ACCENT`. **Removed, not narrowed.**

---

## 3. Two run-3 findings that are not fixed

### `A-GATE-4-5` — `Tabs.tsx:2` was never touched

**Severity: major.** `components/primitives/Tabs.tsx:2`.

The comment still reads verbatim *"The only client component in this tier… Everything else in
tier 3 is a Server Component"*. `RevealOnScroll.tsx:1` and `StickyCta.tsx:1` are both
`'use client'` in the same directory, and `05-HANDOVER.md` §1 itself records 21 Server / 3
Client.

`git log -- components/primitives/Tabs.tsx` shows the last touch is `be384ab9`, which
**predates the entire `G1`–`G8` range**. The file was never opened during the fixes.

It is recorded as fixed in two places: `docs/master/PROJECT-TRACKER.md:59` ("All fixed in
`G5`/`G6`") and `docs/_shared/05-HANDOVER.md:52` ("all nine are now fixed"). Verified
directly from the tree by both the agent and the auditing context.

The other two client components were swept for the same drift class: `RevealOnScroll.tsx:2-3`
and `StickyCta.tsx:2-3` are accurate and scoped to themselves.

### `A-GATE-4-6` — the struck SSR claim is still asserted in the probe file

**Severity: major.** `app/(marketing)/gridsmith-error-probe/page.probe.tsx:19-21`.

`G5b` struck the `__next_error__` SSR claim as unverifiable, correctly, in
`app/global-error.tsx:47-59` (*"That claim is struck… the SSR path is unknown, not 'known bad'
and not 'known good'"*) and in `05-HANDOVER.md:158-165`. But the probe route — **created by
the same session** — still states it as settled fact:

> *"A throw during SSR never reaches this boundary — production serves Next's static
> `__next_error__` shell instead, which is exactly how the untitled document shipped
> unnoticed."*

So the tree asserts the claim and its striking simultaneously, in two files 40 lines apart in
purpose. This is `A-GATE-4-5`'s class again — a sweep that corrected the instances it was
handed and missed one in a file the same commit created — and it is directly against
CLAUDE.md's *"treat it as unverified and say so"*.

Round 2's closure as unreconstructable is **correct and holds**: `05-HANDOVER.md:481-502`
carries the notice, `PROJECT-TRACKER.md:59` matches, and nothing asserts it as verified.

---

## 4. `check:content` — present and gated, but passes three inputs that should fail

`G6` is otherwise clean. A full manual sweep of `%5Fkitchen-sink/page.tsx` for every currency
symbol, `REV-`/`DWG-`/`ISS-`, `ISO `/`BS `, ISBN shape and 3+ digit run found **no fourth
instance**: `:141` `REV-00`, `:242-243` `REV-00`/`£0,000`/`£000`, `:277` `Under £0,000` /
`£0,000 – £00,000`, `:335` `KS-0000`. The gate's own glob was executed and confirmed to reach
`app\(marketing)\%5Fkitchen-sink\page.tsx` — the `%5F` route is **not** swallowed — and its
expectations are hardcoded `PATTERNS` (`:50-76`), not derived from the subject. Reintroducing
a plausible price fails it.

Three inputs that should fail it do not:

| ID | Severity | File:line | What |
|---|---|---|---|
| `A-GATE-4-2` | major (gate) | `scripts/check-invented-content.mjs:100` | `line.replace(/\/\/.*$/, '')` strips from the first `//`, so **everything after a URL on the same line is deleted before matching.** `<a href="https://example.com">£12,500</a>` → *"every one zeroed"*, exit 0. A price inside a link is invisible to the gate that exists to catch prices |
| `A-GATE-4-7` | major (gate) | `:26` vs `:50-76` | The docstring says the gate catches *"percentages and durations that read as outcomes"*. **No such pattern exists.** `Clients see a 47% uplift in six weeks. Typical fee 4,500 GBP.` → exit 0. Also misses the symbol-less currency form, since the money regex requires `[£$€]`. Gate and prose disagree; per CLAUDE.md the gate is the source of truth, so **the prose is the defect** — but the uncaught cases are real |
| `A-GATE-4-8` | minor (gate) | `:126` | `candidatesSeen === 0` is a **global** count, not a per-subject assertion. It protects `/_kitchen-sink` only by the accident that it is currently the only file with candidates. The moment a second rendering file gains a `£0,000`, the kitchen sink can drop out of the glob silently. `check-bundle-size`'s `REQUIRED` (`:68`) already holds the right pattern |

---

## 5. Remaining new items

All **(B) — P2 for the Epic M sweep**. **No (A)-class findings: zero AA failures in any
primitive, and zero axe violations across 28 analyses on seven routes.**

| ID | Severity | File:line | What |
|---|---|---|---|
| `A-GATE-4-4` | major | `scripts/check-bundle-size.mjs:249-271` | The second-line-of-defence relationship between the decomposition and the floor check **survives only in commit `417e2661`'s body**. Neither docstring references the other check. A relationship in a commit message is not written down |
| `A-GATE-4-9` | minor | `scripts/check-axe.mjs:57` | Names the subject as `…/gridsmith-error-probe/page.tsx`. The file is `page.probe.tsx`, and the `.probe` suffix **is** the production-exclusion mechanism (`next.config.ts` `pageExtensions`). Same class as the dead `app/not-found.tsx` override. **Found independently by both passes** |
| `A-GATE-4-10` | minor | `%5Fkitchen-sink/kitchen-sink.module.css:28-31` | `.specimenName`'s comment asserts a restriction that no longer exists — that the matrix restricts `--ink-subtle` to UI on `--canvas-sunken`, and that the size pass enforces it. All three clauses are false post-`G1`: the `except` is gone, values re-derived (worst 4.96:1), and the size pass has no `--ink-subtle` subject |
| `A-GATE-4-11` | minor | `%5Fkitchen-sink/page.tsx:93-118` | `G2` is **half-gated**. `Specimen`'s `<h3>` has no gate — `check:headings` is display-face-only by design and axe cannot see F2 — so reverting it to `<p>` leaves every gate green. Documented at `check-headings.mjs:36-47` and `page.tsx:107-112`, so this is an **accepted** gap, not a hidden one. Recorded because the tracker should say so explicitly |
| `A-GATE-4-12` | minor | `05-HANDOVER.md:557`, `01-VALIDATION-REPORT.md:536` | §9 still says, present tense, that `check-node-version` *"independently reports 14 gates"*. It reports **16** (confirmed: `check-node-version: 16 gates, and npm run verify and ci.yml run the same set`). `01-VALIDATION-REPORT.md:536` records that *"All fourteen gates were swept"* for the derived-expectation question — which means **`check:headings` and `check:content` have never been swept for it** |
| `A-GATE-4-13` | minor | `scripts/check-bundle-size.mjs:292` | The 0.5KB shared baseline is labelled *"every route pays this (global-error boundary)"*. Adding a client component to `global-error.tsx` moved every route's total **and** `/_kitchen-sink` by the same amount, so the figure is the boundary **plus whatever else is shared** — asserted attribution, not decomposed. Not load-bearing for `M-06` (the sum is what matters), but it is the shape `G8` was written to remove |

---

## 6. What would close each criterion

**Criterion 5** — five items:

- Correct `Tabs.tsx:2`, and correct the two documents that record it as fixed.
- Delete the struck SSR claim from `page.probe.tsx:19-21`, keeping the "why an effect" reasoning
  without the unverifiable half.
- Make the shared-baseline assertion reachable — the two budgets must not be the same number,
  or the decomposition must run before the floor check exits. Then prove it fails.
- Write the decomposition ↔ floor-check relationship into both docstrings.
- Fix `check:content`'s comment stripping (strip only when `//` is not preceded by `:`), and
  either add the percentage/duration patterns the docstring claims or correct the docstring.
  Make `candidatesSeen` a per-subject `REQUIRED` assertion.

**Criterion 6** — two items:

- Give `check:contrast`'s size pass independent power: stop `continue`-ing on `role: 'decor'`,
  since a decorative token appearing in `color:` **is** the failure. Add a committed specimen so
  the branch has a subject.
- Correct the two drifted comments (`kitchen-sink.module.css:28-31`, `check-axe.mjs:57`) and
  record `G2`'s half-gated state in the tracker as accepted.

**Neither criterion can be closed by the session that applies these fixes.** That is now the
fourth round in which the fixes will be applied by the context that received the findings, and
it has produced a finding every time — including, this round, one item recorded as fixed that
was never touched at all.

---

## 7. Housekeeping

- **Working tree clean.** `git status --porcelain` empty. The single `git stash` entry
  (`stash@{0}: On main: !!GitHub_Desktop<main>`) predates this session and was not touched.
- **Ports 3100 and 3210 both have foreign processes listening** and were deliberately left
  alone. Run 3 recorded 3100; 3210 is new. The runs used 3277/3288/3299 and 3320. Use
  `VERIFY_PORT=…` rather than killing a process that may not be yours.
- **A false red recurred**, the fifteenth-instance class from the other direction: an
  intermediate axe run reported 8 unresolved incompletes that were a deliberate-failure probe
  still in the build, not a repo defect. Rebuilt clean and re-ran. An ad-hoc audit has no
  equivalent of `with-server.mjs`'s busy-port guard.
- **Lighthouse did not run.** Both axes skip on Windows and exit 0 (`A11Y-25`, still open).
  Nothing here is evidence for either axis; CI on `ubuntu-latest` is.
- **`05-HANDOVER.md` §7, not §8**, is the do-not-redo list.
- `G7` (Epic identifier collisions) remains deliberately open and was not examined. Round 2's
  finding list remains closed as unreconstructable. Neither is re-reported here.
