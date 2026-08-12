# Epic A — independent audit and A-GATE determination

**Date:** 12 August 2026 · **Branch:** `feat/a-01-a-10a-scaffold-ci` · **Runtime:** Node
v24.15.0 (matches `.nvmrc`) · **Scope:** Epic A entire — A-01 to A-12, A-05a, A-10b

This is the fresh-context audit that A-GATE criteria 5 and 6 require. It supersedes
nothing in `01-VALIDATION-REPORT.md`; it tests whether what that report records as closed
is actually present in the repository, and looks for what it missed.

---

## 0. What ran, and what did not

**This must be read before the findings.** The instruction was to report which agents ran
rather than to present partial coverage as complete.

| Agent | A-GATE criterion | Result |
|---|---|---|
| `rules-compliance` | **5** | **RAN** — round two. 1 blocker, 5 major, 3 minor |
| `accessibility-audit` | **6** | **See §6** |
| `spec-compliance` | — | **DID NOT RUN** — died on a session limit, both rounds |
| `design-conformance` | — | **DID NOT RUN** — died on a session limit, both rounds |
| `content-integrity` | — | **DID NOT RUN** — died on a session limit, both rounds |

All five agents were launched together and **all five died on a session limit before
returning anything** — the identical failure that killed the previous attempt and left
criteria 5 and 6 open. The two gate-closing agents were relaunched on their own with
tightened prompts, which is what allowed them through. **The lesson is operational and
belongs in the handover: launching five agents concurrently on this repository exhausts
the session budget before any of them reports. Run the two A-GATE agents alone.**

Everything in §1–§5 and §7–§8 was verified directly by this context, by reading the code
and by executing the gates. That is not a substitute for the three agents that did not
run, and it is not recorded as one.

### Gates executed in this session, on Node 24

| Gate | Result |
|---|---|
| `check:node` | pass — `Node v24.15.0 matches .nvmrc (24)` |
| `lint:colors` | pass — clean, 62 files |
| `lint:secrets` | pass — clean, 47 files |
| `check:contrast` | pass — 29 pairs, 101 matrix cells |
| `build` | pass |
| `check:tokens` | pass — 39 tokens, 4 themes, 6 CSS modules |
| `check:theme` | pass — 4 route groups |
| `size` | pass — floor 100.2KB, `/_kitchen-sink` 5.7KB delta vs 7KB |
| `check:axe` | pass — 5 routes, zero violations, zero duplicate ids |
| `check:responsive` | pass — 15 combinations |
| `check:lhci:desktop` · `check:lhci:mobile` | **SKIPPED** — guarded Windows skip fired correctly and printed the banner. **Not evidence. CI is.** |

**The claimed count of gates is wrong.** Two files say "Thirteen checks"
(`05-HANDOVER.md:27`, `master/PROJECT-TRACKER.md:82`). There are **fourteen**, and the one
missing from both enumerations is **`check:contrast`** — the gate that exists because 25 of
29 published contrast ratios were wrong and two were hiding WCAG AA failures. The most
consequential gate in the repository is absent from the list of gates.

---

## 1. Criteria 1–4, independently re-verified

The tracker records 1 and 3 as *provisionally met — not independently re-verified*. They
have now been re-verified. Both hold, with one exception on criterion 1.

### Criterion 1 — `/_kitchen-sink` renders all 24 primitives in all four themes

**The four blocking defects are genuinely fixed, and the fixes are verifiable from the
repository.** Confirmed by execution, not by reading the fix note:

- `check:axe` reports `/_kitchen-sink` **clean**, and its own DOM-integrity assertion
  reports *"no duplicate ids, no radio or exclusive-details group spanning theme frames"*
  against the served DOM. The 80 duplicate ids are gone.
- Scoping is real: `scope(division, key)` at `page.tsx:68` for every `id`, form `name`,
  `exclusiveName` and `defaultOpenId`; `Tabs` additionally derives ids from React's
  `useId()` (`Tabs.tsx:23`), which is robust independent of the caller.
- Exactly one `<h1>` — one `level={1}` at `page.tsx:293`. Specimen names are `<p>`, frame
  titles are `<h2>`, specimen headings `<h3>`, card headings `<h4>`. No skipped level.
- `StickyCta` now renders per frame (`page.tsx:277–282`) plus one live fixed instance
  (`page.tsx:316`).

**But the criterion as written is not met.** It says *all 24 primitives*. The page renders
**23** — `Media` is deliberately excluded, for a defensible reason (rendering it would
require fabricated placeholder imagery, CLAUDE.md non-negotiable #2). The exclusion is
sound. Two things about it are not:

1. **The page tells the browser something untrue.** `page.tsx:296` renders *"All 24
   primitives, rendered once per theme."* It renders 23. This is a false statement in
   user-visible copy, on the one page whose entire purpose is to be the reference for
   correctness.
2. **`Media` has therefore never been evaluated by any gate.** It is rendered nowhere, so
   axe has never seen it, `check:responsive` has never laid it out, and no Lighthouse run
   has measured it. It is the only primitive in that position, and it is the one that
   handles the site's primary evidence — portfolio imagery.

**Verdict on criterion 1: met in substance, not as worded.** Either the criterion text
changes to "23 primitives; `Media` excluded and covered at D-01", or the page renders
`Media`. It cannot stay as a criterion that its own subject fails on a literal reading.

### Criterion 2 — correct at 375 / 768 / 1440

**MET.** Re-run here: 15 combinations, 5 routes × 3 widths, no horizontal overflow.

One coverage note, not a failure: the gate asserts **375px** as the narrowest width because
that is what the Definition of Done names. WCAG 2.2 SC 1.4.10 Reflow is specified at
**320px**. The repo's own floor is WCAG 2.2 AA (non-negotiable #10), so the gate is set one
notch above its stated floor. Worth resolving deliberately rather than by default.

### Criterion 3 — keyboard navigable end to end

**The blocking defect is genuinely fixed.** Duplicate ids sending every label in frames
2–4 to the control in frame 1 cannot recur: proven by the served-DOM assertion, not by the
absence of an axe rule.

`Tabs` implements the WAI-ARIA pattern correctly — roving `tabIndex` (`Tabs.tsx:75`),
Arrow/Home/End with `preventDefault` (`:47–59`), `aria-selected`, `aria-controls`,
`aria-labelledby`, and the panel focusable only when it contains nothing else focusable
(`:32–39`). `Accordion`, `Select` and `RadioGroup` are native elements and inherit browser
behaviour. One focus treatment for the whole system at 17.9:1 minimum
(`interactive.module.css:9–12`).

**Qualified, not clean** — see F-8 in §2. Automated keyboard coverage exists only at
1280×900 and only *after* the page has been scrolled to its foot.

### Criterion 4 — zero hardcoded colours

`lint:colors` is green across 62 files, and there are no hardcoded colours in the committed
tree. **But the gate's coverage is materially narrower than its name**, and that is F-1
below — a blocker. Criterion 4 is *true today* and *not protected tomorrow*.

---

## 2. Gates that can pass without measuring their subject

Four instances of this class were found and fixed at the previous audit. The instruction
was to assume a fifth. **There are three more, two of them serious, and one is proven by
deliberate failure.**

### F-1 · BLOCKER · `check-no-hardcoded-colors` misses this codebase's own border idiom

`scripts/check-no-hardcoded-colors.mjs:82-85`. `CSS_NAMED` requires the colour word to sit
**immediately after a colon**: `/:\s*(?:red|blue|…)\b/`. Verified by running the gate's own
regexes against realistic inputs:

```
CAUGHT   color: red;
CAUGHT   color: #ff0000;
CAUGHT   fill: white;
MISSED   border: 1px solid red;
MISSED   outline: 2px dashed black;
MISSED   box-shadow: 0 0 0 1px navy;
MISSED   background: var(--canvas) no-repeat white;
MISSED   background: linear-gradient(to right, teal, gold);
MISSED   color-mix(in srgb, red, blue);
```

This is not a hypothetical shape. **The entire design language is 1px borders**, and the
shorthand form is already idiomatic in the repository —
`interactive.module.css:130` writes `border-block-end: 2px solid transparent`. A named
colour in that position ships unflagged.

Second gap in the same rule: `color-mix()` is absent from the `color-fn` list
(`rgba?|hsla?|hwb|lab|lch|oklab|oklch`), and `color-mix()` is precisely how someone tints a
token — `color-mix(in srgb, var(--accent), white 20%)` passes.

This is the same shape as the already-logged *"line-anchored regex that counted a third of
what it claimed"*. Whatever deliberate-failure proof this gate has must have used `color:`
or a hex, both of which it catches. **A gate whose proof-by-failure exercised only the
forms it catches has not been proven.**

CLAUDE.md non-negotiable #1 is the rule that makes four themes possible over one primitive
set. It is enforced by a regex with a hole in it, in the shape the codebase actually writes.

### F-2 · BLOCKER · `check-tokens` derives its expectation from the file it is checking — *proven*

`scripts/check-tokens.mjs:32-41`. `declared` is scraped from `styles/tokens.css` itself.
The only floor is `length === 0`.

**Proven by deliberate failure in this session.** `--text-3xl`, `--measure`,
`--measure-narrow` and `--shadow-2` were removed from `tokens.css` and the gate re-run:

```
check-tokens: 35 base tokens, each declared exactly once in the built CSS
check-tokens: 4 themes each define the 15-token contract …
exit 0
```

Four tokens deleted, gate green. (Working tree restored and re-verified clean: 39 tokens,
gate green, `git status` empty.)

The tokens removed were chosen deliberately: `--text-3xl` is the **exact** token
FOUNDATION §3 names as the Tailwind namespace-collision hazard, and `--shadow-2` is the
hard shadow ceiling in CLAUDE.md. The gate written to protect them cannot notice their
removal.

The asymmetry is the tell: the **15-token theme contract is hardcoded** in the same file
(`CONTRACT`, `:105`) and is correctly protected. The **39-token base layer — the layer all
four themes build on — has no required list at all.** FOUNDATION §3 and the tracker both
assert "39 base tokens"; per CLAUDE.md's own rule, that number is unverified.

### F-3 · MAJOR · `check-contrast` has the same self-reference, and its other half has no count at all

`scripts/check-contrast.mjs:270-279`. `EXPECTED_CELLS` is computed from
`Object.keys(USE).length`, the same table the loop iterates. Remove a token from `USE` and
both the measured count and the expected count fall together — green, having measured
fewer cells. The assertion catches only an in-loop `continue`, which is the one failure it
was already structurally safe from.

Worse: **`PAIRS` — the 29 published `DESIGN.md` figures, which is the half of this gate
that exists because 25 of 29 were wrong — has no count assertion whatsoever.** Empty a
theme's array and the run reports fewer pairs and exits 0.

The literals `- 3` and `1 * 3 *` in `EXPECTED_CELLS` are hand-maintained and tied to
`MASTER_EXTRAS` by nothing but a comment.

### F-4 · MAJOR · `/_not-found` is exempt from the only gate that sees it, and invisible to every other

`scripts/check-bundle-size.mjs:157-159` exempts `/_not-found` by name. Confirmed live in
this session's output:

```
/_not-found     100.2KB      0.0KB       —    not budgeted — Next 404 template
```

Searched across every gate, `_not-found` appears in **exactly one place in the repository**
— that exemption. It is absent from `check-axe.mjs:37`, `check-responsive.mjs:26` and
`lighthouse/routes.cjs:23-28`.

So the 404 is the one route in the build that **no gate measures at all**, and the single
gate that can see it is instructed to skip it. `M-07` (P0) puts a real 404 there, and
`M-04`/`L-05` put the statutory disclosure on *every page* — a legal requirement, not a
footer decoration. Both land on a route with no budget, no axe run, no responsive check and
no Lighthouse run. The exemption was written for an empty Next template and will silently
inherit real code.

### F-5 · MAJOR · `check-service-role-key` inspects source shape; the leak is a bundle property

`scripts/check-service-role-key.mjs:52-72`. The key check fires only when
`isClientComponent(source)` is true — the file must itself open with `'use client'`. A
module without the directive, imported by a client component, is compiled into the client
bundle and is not flagged.

`next.config.ts` is outside `ROOTS` entirely, and Next's `env:` key inlines any variable it
names into every client bundle. Neither the directive check nor `PUBLIC_PREFIXED` sees it.

No gate greps `.next/static/chunks` for the key string — although `check-theme-flash.mjs:88-95`
proves that exact technique is already in the repository and calls it "the load-bearing one".

### F-6 · MAJOR · `PENDING_ROOTS` guards one tree; the docstring claims it guards all of them

`check-no-hardcoded-colors.mjs:25` and `check-service-role-key.mjs:20` both name only
`lib`. The first says *"a new tree cannot arrive unscanned"*. That is false — only `lib`
cannot. Unscanned and unguarded today: **`public/`** (Q-M15's brand mark is an open item
and will land there, and `.svg` is absent from `SOURCE` in both gates), `lighthouse/`, and
every root-level source file — `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`,
`lighthouserc.*.cjs`, `css.d.ts`.

The `lib` guard proves the authors identified the class. It was then applied to one
instance — which is the specific thing CLAUDE.md "fix the class, not the instance" exists
to prevent.

### F-7 · MINOR · two evadable assertions

- `check-theme-flash.mjs:92` matches the literal string `data-division` in minified
  chunks. `el.dataset.division = 'press'` never emits that string. The gate's own comment
  calls this check the load-bearing one.
- Neither Lighthouse axis asserts an HTTP 200. A route that 404s is still collected, and a
  themeless Next 404 scores 1.0 accessibility and passes every LCP/CLS/TBT ceiling.
  `check-axe` and `check-responsive` do guard status, but they run *after* Lighthouse in
  `ci.yml`.

### F-8 · MINOR · no accessibility check runs at a mobile width

`check-axe.mjs:114` fixes the viewport at 1280×900. `check-responsive` visits 375px but
asserts only horizontal overflow. So WCAG 2.2 AA rules that are viewport-dependent —
`target-size` (2.5.8) most obviously — are evaluated at desktop width only, on a site whose
Definition of Done names 375px first and whose own notes say mobile carries most traffic.

Related: `check-axe` scrolls to the document foot before analysing (`:133-136`), correctly,
to reach `StickyCta` and `RevealOnScroll`. The consequence is that **nothing audits the
page in its initial state** — see A-2 in §6.

---

## 3. Numeric claims that no gate enforces

CLAUDE.md: *"A measurable number in the specs is unverified until a gate measures it… If
you meet an asserted number that no gate covers, treat it as unverified and say so."*

| Claim | Where | Enforced? |
|---|---|---|
| **39 base tokens** | FOUNDATION §3, tracker A-02 | **No** — F-2. The gate prints the count and asserts nothing about it |
| **29 contrast pairs** | tracker A-03 | **No** — the ratios are asserted; the *count* is not. F-3 |
| **101 matrix cells** | FOUNDATION §3, handover §1 | **Self-referentially** — F-3 |
| **Digital 100/100/100** | CLAUDE.md budgets, FOUNDATION §8 | **Partly.** The desktop axis asserts performance ≥1.0 and accessibility ≥1.0 but **SEO at 0.90**. CLAUDE.md states the three 100s unqualified; only the tracker and `lighthouserc.desktop.cjs` disclose the ratchet |
| **Framework floor 100.2KB** | FOUNDATION §2 | **Partly.** A declared constant. Downward drift is caught at ±1KB (`FLOOR_TOLERANCE_KB`); upward drift is caught only as every route failing at once |
| **Primitive delta 5.7KB / 7KB** | FOUNDATION §5 | **Yes** — re-measured here at 5.7KB. This one is properly enforced |
| **Mobile LCP 1519–1530ms, TBT ~90ms** | FOUNDATION §8, tracker | **Yes**, on 4 routes — and on none of `/_kitchen-sink`, `/_not-found` |
| **INP ≤200ms / ≤150ms** | CLAUDE.md, four `PROJECT-RULES` | **No, and correctly recorded as unassertable.** TBT is the proxy |
| **`--accent-design` "never text, never a sole state indicator"** | master §1.2 | **Half.** The regex catches `color`/`fill`/`stroke`/`caret-color`/`text-decoration-color`. It cannot catch a state signalled only by an amber border. The gate's own docstring says so; `styles/themes/master.css:41` states flatly *"Enforced by scripts/check-no-hardcoded-colors.mjs"*, which overstates it |
| **`--line`/`--line-strong` may never identify a control** | FOUNDATION §3 | **No gate.** `check-contrast` measures the ratios and permits `decor`; nothing checks *where the token is used*. Compliance today is by convention and a header comment in `interactive.module.css:1-5` |

---

## 4. Recorded as fixed — verified against the repository

E1–E13 were checked one by one. **Eleven of thirteen are genuinely present and verifiable.**

| ID | Claim | Verified |
|---|---|---|
| E1 | `.npmrc` `engine-strict=true` | **Present** |
| E2 | `--no-sandbox --disable-dev-shm-usage` on both Puppeteer gates | **Present** — `check-axe.mjs:104-107`, `check-responsive.mjs:32-35` |
| E3 | Codepoint sort, not `localeCompare` | **Present** — `check-bundle-size.mjs:92`. Repo-wide grep: no `localeCompare` outside that comment |
| E4 | `.gitattributes` pins `* text=auto eol=lf` + binaries | **Present** |
| E5 | `%5F` resolves on a case-sensitive filesystem | **Present and exercised** — build emits `_kitchen-sink.html`; `size` measured it at 105.9KB |
| E6 | `toPosix` in the path-comparing gates | **Present** — three gates |
| E7 | All three env vars have defaults | **Present** — `AXE_BASE_URL ?? …` ×2, `VERIFY_PORT ?? '3000'` |
| E8 | No locale-dependent number formatting | **Present** — no `toLocaleString`, no `Intl` |
| E9 | `with-server` relative path — noted, not fixed | **Accurate as recorded** |
| E10 | `check-node-version` as `preinstall` **and** in `verify:static` | **Present** — `package.json:10,26`; ran green here |
| E11 | Orphaned MSI record left alone | **Environmental — not verifiable from the repo, and correctly so** |
| E12 | Windows LHCI skip guarded in both directions | **Present and observed firing.** `lhciSkipped = isWindows && !isCI`; `check-lhci.mjs:32-41` hard-fails on `isCI \|\| !isWindows`. The `with-server` banner printed in this session |
| E13 | Recursive-delete rule adopted | **Present** in CLAUDE.md "How to work" |

**Two carry stale text that a fresh reader cannot reconcile:**

- **E1**, `01-VALIDATION-REPORT.md:404`: *"`npm ci` now fails on any machine not running
  Node ≥22.11.0… Install Node 22 (`.nvmrc` names it)."* `.nvmrc` names **24** and `engines`
  says `>=24.15.0 <25`. Following this instruction now breaks the build.
- **§12/§13 build order**, `01-VALIDATION-REPORT.md:499`: *"Proposed order Master → Digital
  → **Design → Press**, pending confirmation."* `02-BUILD-SEQUENCE.md:44` and
  `05-HANDOVER.md:185` both say **Master → Digital → Press → Design**, and BUILD-SEQUENCE
  adds *"Confirmed by the founder."* The validation report contradicts a founder decision
  recorded in two other files.

---

## 5. Documented state that the repository contradicts

CLAUDE.md: *"A spec that has silently drifted is worse than none — the next session will
follow it."* Seven live contradictions:

| # | Claim | Repository |
|---|---|---|
| D-1 | **A-10b is `BLOCKED`** and *"now fails on Digital — Q-M16"* (`master/PROJECT-TRACKER.md:24`) | Handover §1 says DONE and green on CI; commit `ad299847` says *"A-10b is green on CI Node 24, not blocked"*; Q-M16 is struck through as resolved in the same file. **The tracker row was never updated.** A-GATE depends on A-10b, so the gate currently depends on a task its own tracker marks blocked |
| D-2 | **"Thirteen checks"** ×2 | Fourteen. `check:contrast` is missing from both lists |
| D-3 | **"The LCP ceiling here is provisional"** (`master/PROJECT-RULES.md:106`), quoting 1441ms | Handover §8 and tracker both take the budgets **off** provisional at 1519–1530ms. The 1441ms figure is the superseded dev-machine number |
| D-4 | **"The ceilings in lighthouse/routes.cjs are provisional pending real CI numbers"** (`lighthouserc.mobile.cjs:37`) | `lighthouse/routes.cjs:12` says **"MEASURED, not provisional"**. The two files contradict each other, and one of them *is* the gate |
| D-5 | **A-06 / A-07 = `REVIEW`**, *"Schemas written" / "Migrations written"* | **No code artefacts exist.** No `sanity/`, no `supabase/`, no `lib/`, no schema or migration file anywhere in `git ls-files`. What exists is prose in `docs/*/SCHEMA.md`. `REVIEW` means work awaiting review; there is nothing to review |
| D-6 | Both A-06/A-07 rows block on **"(B4)"** | `B4` resolves to nothing. There is no `B4` row in the Blocked table. The only `B4` in `_shared/` is the **LHCI defect ID** in `01-VALIDATION-REPORT.md:222`, and the only other is an MSA clause. A fresh reader cannot follow the reference |
| D-7 | **`Media` (watermarked, right-click disabled)** (FOUNDATION §5) | `Media.tsx` does neither. The watermark is baked at CMS ingest (D-03) and context-menu suppression is deferred to D-04, both correctly explained *in the component*. The specification describes behaviour the primitive does not have |

Also: the handover's list of deliberate-looking-wrong decisions is **§7**, not §8. §8 is
"Decisions settled this session". Worth correcting, because §7 is the section a fresh
session is told to read before filing a defect.

### On the §7 decisions themselves

Each was assessed. **All hold**, and none should be reversed:

- `check-tokens` counting declarations rather than occurrences — correct, and the reasoning
  is sound. F-2 is a *different* defect in the same file and does not touch this.
- The 101-cell matrix over a token list — correct and load-bearing. F-3 is about its
  *count assertion*, not its shape.
- `check-axe` asserting `duplicate-id` itself — correct. Confirmed: `axe.getRules()` cannot
  reach it behind the `deprecated` tag.
- The mobile axis not asserting the performance category — correct, and the reasoning
  (weighted curve, moves between versions) is right.
- `devtools` over `simulate` throttling — correct, and the Lantern diagnosis is sound.
- `%5Fkitchen-sink` — correct. Verified end to end: the build emits it, `check-bundle-size`
  decodes it once, `size` measured 105.9KB. **Do not rename it.**
- Struck-through Stage 5 numbering — correct.

---

## 6. Accessibility — A-GATE criterion 6

`accessibility-audit` **ran** and returned **not zero violations**: two Level A blockers,
one AA measurement failure, and one gate blind spot that keeps the first two hidden. Both
blockers were re-verified by this context directly from the source before being recorded.

### A-1 · BLOCKER · `StickyCta` — painted, and simultaneously `inert` and `aria-hidden`
**WCAG 2.1.1 (A), 4.1.2 (A), 1.3.1 (A)**

`StickyCta.tsx:63-64` derives `aria-hidden={!visible}` and `inert={!visible}` from a
**JavaScript scroll measurement**. `kitchen-sink.module.css:42-46` overrides
`position`, `transform` and `display` to pin the four specimens in flow. **Presentation and
semantics are driven by two different mechanisms, so they desync.**

At 375px, scroll position 0, the four in-flow specimens measure: `position: static`,
`display: flex`, `visibility: visible`, painted, 95px tall, two links each — and
`aria-hidden="true"`, `inert`. **Eight visible links, unreachable by keyboard and absent
from the accessibility tree.**

Confirmed by reading: `aria-hidden`/`inert` are props on the element, `.stickyStatic` is a
class. No CSS override can change a prop. There is no code path by which the two agree.

**Why every gate missed it.** `inert` is precisely what axe is built to skip, and
`check-axe.mjs:133-136` scrolls to the document foot before analysing — which sets
`visible: true` and makes all five instances live. **`check-axe` reporting `/_kitchen-sink`
clean is a green result from a check that did not measure the failing state.** That is the
gate-blindness class, occurring inside the gate written to close it.

The instance is on a `noindex` specimen page. **The class is in the primitive**, and any
caller that repositions `StickyCta` inherits it.

### A-2 · BLOCKER · `Stepper` completed state is colour only, and the code says it is not
**WCAG 1.4.1 (A), 1.3.1 (A)**

`interactive.module.css:156`:

```css
.stepDone .stepMarker { border-color: var(--ink-muted); color: var(--ink); }
```

Against the base `.stepMarker` (`:150`, `border: 1px solid var(--ink-subtle)`,
`color: var(--ink-muted)`), a completed step differs from a pending one by **`border-color`
and `color` — two colour changes and nothing else.** No border-width step, no background,
no glyph, no weight change, no ARIA. The marker itself is `aria-hidden="true"`
(`Stepper.tsx:40`), and the `sr-only` prefix at `Stepper.tsx:45` is `Step {n}: ` for every
step regardless of state. **A screen-reader user and a colour-blind user both receive
nothing.**

Two comments in the repository assert the opposite:

- `Stepper.tsx:14` — *"Completed steps differ in border weight, not colour alone."*
- `interactive.module.css:5` — *"Every state carries a non-colour cue as well as any colour
  change — WCAG 1.4.1."*

`.stepCurrent` (`:154-155`) genuinely does carry three cues. `.stepDone` carries none.
FOUNDATION §3's *"colour is never the only signal"* is violated in the shared primitive
layer, by the component that renders the canonical six process stages on every division.

### A-3 · MAJOR · `Field` and `Select` set the DOM `id` from the form `name`
**WCAG 1.3.1 (A), 4.1.2 (A), 3.3.2 (A) — latent**

`Field.tsx:45,58,69` — `htmlFor={name}` / `id={name}`, with `${name}-hint` and
`${name}-error` derived from it. `Select.tsx` does the same. **There is no `id` prop.**

Two forms on one page — a contact form and a newsletter signup, both with a field named
`email` — produce duplicate ids and bind `<label for>` to the wrong control. The only
escape is mangling `name`, which changes what the Server Action receives.

**This is the root cause of criterion 1's original blocking defect, and it is still live.**
The 80 duplicate ids were fixed at the *call site*, with `scope(division, key)` in the
kitchen sink. The *primitive* is unchanged. CLAUDE.md: *"Fix the class, not the instance…
A per-instance fix leaves the same defect live everywhere else and guarantees it recurs.
Three of the four Epic A blockers were repeats of already-fixed defects."* This is the
fourth, and it is a repeat of the one that was just fixed.

`Tabs` shows the correct pattern in the same codebase — `useId()` at `Tabs.tsx:23`.

### A-4 · MAJOR · `scroll-padding-block-end` reserves less than the bar it reserves for
**WCAG 2.4.11 (AA)**

`globals.css:50` reserves `calc(2.75rem + var(--space-6) + env(safe-area-inset-bottom))` =
**68px**. The bar measures **95px** at 375px, because the buttons wrap. A focused element
near the document foot is obscured.

The comment at `globals.css:44-47` derives the number from a model — *"a 2.75rem control
plus `var(--space-3)` top and bottom"* — which describes the bar **unwrapped**. It was
never measured against the rendered bar. That is the "number ≠ reality" class from
`01-VALIDATION-REPORT.md` §12, in the fix written for an accessibility criterion.

### A-5 · MAJOR · no accessibility check runs below 768px, or at scroll position 0

`check-axe.mjs:114` fixes the viewport at 1280×900 — where `StickyCta` is `display: none`
(`motion.module.css:40-42`). **axe has therefore never evaluated `StickyCta` in its real
`position: fixed` form.** And the scroll-to-foot means no gate ever audits any route in its
initial state. `check-responsive` visits 375px but asserts horizontal overflow only.

Between them, A-1 is invisible to the entire gate suite by construction. See also F-8.

### Further findings, reported and not independently re-verified here

`Card`'s `.cardLinked a::after { inset: 0 }` applies a full-card overlay to *every*
descendant link (`content.module.css:22-25`) — major, latent. `Pagination`'s
`display: contents` on `<li>` (`:38`) can drop the `listitem` role — minor. `Table`'s
wrapper is `tabIndex={0}` + `role="region"` unconditionally and omits the shared
`.focusable` class (`Table.tsx:24`) — minor. `.table thead th` claims `position: sticky`
with no constrained block size, so it can never stick (`content.module.css:43,61-63`) —
minor, latent at C-02. `RevealOnScroll` armed content is focusable while at `opacity: 0`
(`RevealOnScroll.tsx:44-45`) — minor, transient. `motion.module.css:3-5` claims *"both
components below also check the preference in JS"*; `StickyCta` contains no `matchMedia`
call — comment drift, not a user-facing failure.

**Forward risk, worth deciding now rather than at D-04:** the planned `contextmenu`
suppression on `Media` would break Shift+F10 and the Menu key, which are keyboard
operations (2.1.1), plus long-press and assistive "right click". It also deters nobody —
the asset is in the DOM and on the network. FOUNDATION §5 already describes `Media` as
"right-click disabled" (D-7 above). Recommend the behaviour is not built and the
specification is corrected.

### Cleared, and worth recording

`Tabs` is a conformant WAI-ARIA tabs implementation. `RevealOnScroll` genuinely cannot end
hidden — three independent defences, all present. `Accordion`, `Select` and `RadioGroup`
are native elements. `Field`'s error state carries three real cues. `Heading` separates
level from size. The `prefers-reduced-motion` block is complete, including
`animation-iteration-count: 1` and `scroll-behavior: auto`. Zero duplicate ids, no radio or
`<details>` group spanning frames, exactly one `<h1>`, no skipped heading level — all four
confirmed against the served DOM.

### Explicitly not audited — do not read as clean

Skip link (does not exist; deferred to Epic M). Consent banner (does not exist) —
announcement, Escape, skip-link occlusion, layout shift. Route-change and form-error focus
management (no mechanism exists). The three required real tables and the three interactive
tools (none exist). Both Lighthouse axes (environmental Windows skip; **CI is the
evidence**).

---

## 7. Verdict

### Does Epic A pass A-GATE?

# NO.

| # | Criterion | Determination |
|---|---|---|
| 1 | `/_kitchen-sink` renders all 24 primitives in four themes | **Met in substance, failed as worded.** 23 render; `Media` is excluded for a sound reason, and the page's own copy claims 24. The four blocking defects are genuinely fixed and independently re-verified |
| 2 | Correct at 375 / 768 / 1440 | **MET** — re-verified, 15/15 |
| 3 | Keyboard navigable end to end | **NOT MET.** The symptom is fixed; **the root cause is live in `Field`/`Select` (A-3)**, and A-1 puts eight visible links outside the keyboard order |
| 4 | Zero hardcoded colours | **True today, not protected.** `lint:colors` is green, but F-1 shows it misses this codebase's own border idiom |
| 5 | `rules-compliance`, fresh context, **zero findings** | **FAILED** — 1 blocker, 5 major, 3 minor |
| 6 | `accessibility-audit`, fresh context, **zero violations** | **FAILED** — 2 Level A blockers, 1 AA failure, 1 gate blind spot |

Criteria 5 and 6 are worded "zero findings" / "zero violations", with **no partial credit**.
Both returned findings. The gate does not pass, and no reading of the results makes it pass.

### The single most important thing in this report

**Two Level A accessibility blockers and one blocker-grade gate hole were live while every
gate in the repository was green.** The suite reported: axe clean on five routes, zero
duplicate ids, 101 contrast cells measured, 39 tokens present, 15 responsive combinations
clean, every budget met.

Each of the three was invisible for a structural reason, and all three are the *same*
reason:

- **A-1** — `inert` is what axe skips, and the gate scrolls past the failing state.
- **F-2** — the gate derives its expectation from the file it is checking, **proven**: four
  tokens deleted, exit 0.
- **F-1** — the deliberate-failure proof exercised only the forms the regex catches.

`01-VALIDATION-REPORT.md` §11 names this class and records four instances closed.
**There are three more, and one of them is inside `check-axe` — the gate written to close
it.** The class is not closed. It should be treated as a standing property of this gate
suite rather than a defect list that was worked through once.

### What has to be true before A-GATE is retested

1. **F-1** — `check-no-hardcoded-colors` catches named colours anywhere in a declaration,
   plus `color-mix()`. Re-prove by deliberate failure **using `border: 1px solid red`**, not
   `color: red`.
2. **F-2** — `check-tokens` carries a hardcoded required list of the 39 base tokens, as it
   already does for the 15-token theme contract. Re-prove by deleting one.
3. **A-1** — `StickyCta` hides via CSS `visibility` on the same class the override targets,
   so presentation and semantics cannot desync.
4. **A-2** — `.stepDone` gains a non-colour cue, and both false comments are corrected in
   the same commit.
5. **A-3** — `Field` and `Select` decouple DOM `id` from form `name`. **This is the class
   fix for criterion 1's original blocker.**
6. **A-4** — the scroll-padding reserve is measured, not modelled, and asserted by
   `check-responsive`.
7. **A-5 / F-8** — axe runs at 375px and at scroll 0, not only 1280px at the foot.
8. **F-4** — `/_not-found` enters the route lists of `check-axe`, `check-responsive` and
   `check-bundle-size` before `M-07` puts real code and the statutory disclosure on it.
9. **D-1 to D-7** — the seven documentation contradictions are resolved. **D-1 first:**
   A-GATE cannot be assessed while its own dependency is recorded as `BLOCKED` in one file
   and `DONE` in two others.

`F-3`, `F-5`, `F-6`, `F-7` and the further accessibility findings are real and should be
scheduled, but they are not gate-blocking on their own.

### What is genuinely solid, and should not be re-litigated

The architecture is sound and most of the engineering is better than the defects above
suggest. Four root layouts with server-set `data-division`, proven structurally rather than
by screenshot. The 101-cell contrast matrix. Budgeting on the delta above a separately
reported framework floor. The two-axis Lighthouse split and the Lantern diagnosis behind
it. The guarded Windows skip, which is the right shape and was observed firing. Native
elements wherever the platform provided one. The primitive layer at 5.7KB gz against a 7KB
budget that is actually enforced. Eleven of the thirteen E1–E13 fixes verified present.

The failures are not failures of care. They are failures of a specific kind: **checks whose
subject can slip out from under them.** That is worth naming precisely, because the
remedy — a required list, a measured number, a proof that exercises the real shape — is
cheap, and the alternative is inheriting all of it four times over.

### Coverage this determination does not have

`spec-compliance`, `design-conformance` and `content-integrity` **did not run**. They are
not A-GATE criteria, so their absence does not change the verdict — but three audit
surfaces are unexamined, and one of them (`content-integrity`) is the only planned check on
the failure mode CLAUDE.md ranks as most damaging. Run them before Epic M, one at a time.

