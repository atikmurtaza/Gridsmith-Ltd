# CLAUDE.md — Gridsmith Ltd website

Loaded every session. Keep it accurate; update it in the same commit as any deviation.

---

## What this is

One Next.js application serving **four themed sections of one website** for Gridsmith Ltd, a UK company trading as three divisions.

```
gridsmith.uk/            master layer  — the company
gridsmith.uk/design/     Gridsmith Design   — brand, visual, CAD, engineering drawings
gridsmith.uk/digital/    Gridsmith Digital  — websites, software, products, AI
gridsmith.uk/press/      Gridsmith Press    — book publishing, ghostwriting, content
```

**One domain. One codebase. One deployment. Four route groups.** Not four sites, not subdomains. The divisions are trading divisions of a single legal entity — Gridsmith Ltd — and every contract, invoice and footer says so.

## The feel

Four distinct voices, one unmistakable hand.

A visitor moving from Design to Press should register a change of *voice* and never doubt they are on the same site. That is achieved through **shared structure, not shared colour**: identical grid, spacing scale, type scale, component shapes and motion language, with each division supplying its own palette and display face.

| | Character | Canvas | Accent | Display face |
|---|---|---|---|---|
| Master | The neutral frame | White | **Ink** (no colour of its own) | Neo-grotesque |
| Design | Precision instrument — a drawing sheet | Near-black | Amber | Neo-grotesque |
| Digital | Engineered clarity — a spec sheet | Off-white | Electric blue | **Monospace** |
| Press | The well-made book | Warm paper | Deep green | **Serif** |

Across all four: **monospace marks anything verifiable** — prices, dates, standards, ISBNs, dimensions, revision numbers. That single convention does more identity work than any logo placement.

The register is **tactile brutalism, not soft UI**: 1px hairline borders, near-zero radius, high contrast, stark typography, generous whitespace with tight internal density. Depth comes primarily from 1px borders and background steps. `--shadow-2` is a hard ceiling; nothing beyond it. Motion is opacity and transform only, and barely noticeable.

Soft shadows, rounded-everything, gradient meshes, glassmorphism, floating 3D shapes and stock photography all read as templated in 2026 and are prohibited. If something "looks harsh" during implementation, that is correct — fix it with spacing or contrast, never with radius.

## Non-negotiables

1. **Never hardcode a colour.** Tokens only. CI enforces this.
2. **Never invent content.** No fabricated case study metrics, client names, standards codes, ISBNs, prices, contract clauses, statistics or credentials. Mark `[TK]` and stop.
3. **Never publish a service page without pricing.** Schema-enforced.
4. **Never let seed content reach production.** Build check blocks it.
5. **Never promise a response faster than end of next business day.** One source of truth: `companyDetails.responseCommitment`.
6. **Never claim more than the contract gives.** Digital's ownership module and Press's rights module cite real clauses in `_legal/`.
7. **Never fire a non-essential cookie before consent.** PECR penalties are now up to 4% of turnover.
8. **Never break a performance budget to add a feature.** The feature changes or is cut.
9. **Never remove Press's honest outcomes.** The Path Finder must be able to recommend against Gridsmith. Schema-enforced and audited.
10. **Accessibility wins every conflict.** WCAG 2.2 AA is the floor. Then raise the conflict.

## Stack

Next.js 15 App Router (**pinned — Next 16 adds ~29KB gz to the JS floor and breaks every budget below**) · React 19 · Node 24 · TypeScript strict · Tailwind v4 + CSS custom properties · Sanity CMS · Supabase (Postgres) · Resend · Vercel · GA4 + PostHog (consent-gated) · Zod + Server Actions.

Rejected and not to be reintroduced: any UI component library (shadcn, MUI, Chakra), any third-party consent platform, any charting or animation library, any page builder. The primitives are hand-built because this site *is* the case study — 67% of B2B buyers judge vendor trustworthiness by site UX.

## Repository shape — **the target, not a description of the tree**

**Read this as where things go when they are built, not as what is there now.** An
accessibility audit was written against it on 13 Aug 2026 and had to correct itself
mid-run: it looked for `components/divisions/` and `app/layout.tsx`, and neither exists.
`✗` marks what has not been built yet. Check the tree before relying on a path.

```
app/
  (marketing)/          master layer      — each route group owns a ROOT layout;
  (design)/design/                          there is deliberately no app/layout.tsx
  (digital)/digital/
  (press)/press/
  global-not-found.tsx  the 404 — owns its <html>/<body>, needs
                        experimental.globalNotFound (see the file)
  global-error.tsx      uncaught-error boundary — same reason, 'use client'
✗ api/
components/
  primitives/           shared, theme-agnostic, ZERO hardcoded colours — 24 of them
  chrome/               header, footer, consent, division switcher — RootShell only so far
✗ divisions/{design,digital,press}/
✗ lib/
✗   cms/ leads/ analytics/ consent/ estimate/ path/ company/
styles/
  tokens.css            base layer
  globals.css           body, .sr-only, reduced-motion reset
  themes/{master,design,digital,press}.css
  fonts/
scripts/                seed, import, image ingest, prod checks
redirects/legacy.json
docs/                   the specs — see below
```

**There is no `app/layout.tsx` and there must not be.** Four root layouts is what gives
each division its own `<html>`/`<body data-division>` in the first paint. The cost is that
anything falling outside all four — the 404, the error boundary — inherits nothing and has
to supply its own document, which is why those two files sit at the app root and why they
are the `global-*` conventions rather than `not-found.tsx`/`error.tsx`.

## Where the specs are

Read the workstream's own files before touching its code.

| Path | What |
|---|---|
| `docs/_shared/00-FOUNDATION.md` | Architecture, tokens, primitives, seed policy, launch gates |
| `docs/_shared/00-PROCESS.md` | The canonical six client stages — fixed names, all divisions |
| `docs/_shared/00-MARKET-RESEARCH-BASIS.md` | Why every conversion decision is what it is |
| `docs/_shared/SCHEMA-CORE.md` | Shared CMS and database schema |
| `docs/_shared/01-VALIDATION-REPORT.md` | Known gaps and recorded decisions |
| `docs/_shared/02-BUILD-SEQUENCE.md` | Stage order and rationale |
| `docs/_shared/04-AGENT-STRATEGY.md` | How to parallelise and verify |
| `docs/_shared/05-HANDOVER.md` | **Read first in a fresh session.** Live state, open questions, in-flight work, and the findings that must not be rediscovered |
| `docs/{master,design,digital,press}/` | 8 files each: PRD · TECH-SPEC · APP-FLOW · DESIGN · SCHEMA · IMPLEMENTATION-PLAN · PROJECT-TRACKER · PROJECT-RULES |
| `docs/_legal/` | Solicitor-ready drafts. **Do not draft or amend clauses.** |

**`PROJECT-RULES.md` for the workstream you are in is binding.** Where it conflicts with general best practice, it wins.

## How to work

- **One tracker task per session or PR.** `C-02: Drawing matrix component` is a unit of work. "Build the Track B page" is nine tasks and context will drift.
- **Server Components by default.** `'use client'` needs a one-line comment saying why. "Easier" is not a reason.
- **CI is the arbiter.** TypeScript, ESLint, `no-hardcoded-colors`, `check-service-role-key`, `check-bundle-size`, Lighthouse CI and axe all block merge. Never add a bypass.
- **Conventional commits**, scoped by workstream: `feat(press): add platform compliance table`.
- **Update the spec in the same commit** as any deviation. A spec that has silently drifted is worse than none — the next session will follow it.
- **A measurable number in the specs is unverified until a gate measures it.** Where a
  gate and the prose disagree, **the gate is the source of truth** and the prose gets
  corrected. The two existing examples are `check:contrast` (the 29 contrast ratios in
  the four `DESIGN.md` §2 tables) and `check-bundle-size.mjs` (the JS budgets). This rule
  exists because it was learned the hard way: of 29 published contrast ratios, 25 were
  wrong and 2 were hiding WCAG AA failures that the published figures said were passes. A
  specific-looking number is worse than no number, because it stops anyone re-deriving it.
  **If you meet an asserted number that no gate covers, treat it as unverified and say
  so** rather than building on it.
- **Every gate must be proven by deliberate failure before it is trusted, and the proof
  recorded.** A gate that can skip its subject silently must treat that skip as a hard
  failure, never a pass. A green result from a check that measured nothing is worse than
  no check: it buys unearned confidence and is never re-examined. Three defects of exactly
  this shape have already shipped and been caught — a `_`-prefix filter that swallowed a
  whole route, a double-encoded chunk path that resolved to nothing, and a line-anchored
  regex that counted a third of what it claimed.
- **A fix is not fixed until a permanent committed subject exists for a gate to reach.**
  Deliberate-failure proofs become **committed specimens or committed probe routes**. Proof
  artefacts are never deleted after use. A gate with no subject is not green and not red —
  it is silent, which is worse than either, because there is nothing to re-examine. This is
  the rule above about proving a gate by deliberate failure, extended one step: that rule
  covers *what a gate asserts*, and the round-3 audit added *whether it is reached* and now
  *whether a subject exists for it to reach at all*. Two instances motivated it, both from
  one fix session:
  **`A11Y-4`** — the `.cardLinked` overlay fix was proven by injecting a sibling link at
  runtime. The injection was discarded, the kitchen sink had no linked-card specimen with a
  second link, and so the working half of the selector matched nothing in CI; deleting it
  outright would have left every gate green.
  **`global-error`** — its Level A `lang`/`<title>` fix was proven by a temporary throwing
  probe route that was then deleted. No gate referenced the file at all, and the only
  surviving evidence of the fix was a docstring.

  **This rule is load-bearing, not ceremonial. Do not treat the proof as paperwork to file
  after the work is done — it is the step that finds the defect.** It has now caught a
  broken gate in three consecutive sessions, and two of those gates were written in the
  same session as the proof that caught them:
  `check:contrast`'s size pass shipped green with its predicate narrowed to the set that
  already passed (`A11Y-29`), and `check-axe`'s linked-card assertion reported *clean*
  against a deliberately broken selector because `elementFromPoint` hit-tests the viewport
  and the subject sat below the fold (`A11Y-32`). Both were written by someone who had just
  read this rule, and neither was caught by reading the code. Writing a gate and believing
  it works is the normal outcome; the proof is what makes the difference observable.

  **A deliberate-failure proof observes a red build, not a red gate — establish which gate
  fired.** Where two checks can fire on the same input, a proof that only records "the build
  went red" credits whichever one you had in mind. `G8`'s shared-baseline assertion was
  recorded as proven this way and had in fact never executed: its predicate was
  arithmetically identical to the floor check's, which exits ~70 lines earlier
  (`A-GATE-4-3`). **Two checks that can fire on one input need thresholds far enough apart
  that a window exists where only one of them fires, and the proof must land in that
  window** — or disable the other check and re-run. The tell that this has happened is a
  write-up saying *"caught first by X, which fires before this code runs"* and filing it as
  defence in depth: that sentence is a description of unreachable code.

  **A gate subject must assert that it is still the subject.** A subject that quietly stops
  being one leaves the gate auditing whatever happens to be there and calling it clean —
  the *hollow subject*, and the general form of how `global-error` went unmeasured. Its
  probe route throws after hydration; if the throw ever stopped firing, axe would audit the
  fallback paragraph and pass. So the route asserts that the boundary identifies itself —
  title, `h1`, `lang` — and fails if it does not. Wherever a gate depends on its subject
  being in a particular *state*, assert the state, not the subject's existence.
- **An expectation derived from its own subject cannot fail when the subject is removed.**
  If a check reads its expected values out of the same file it is checking, deleting an
  entry deletes the expectation with it and the check stays green having measured less.
  This is why `check:tokens` holds a **hardcoded** 39-token `REQUIRED` list rather than
  scraping `tokens.css`, and why `check:contrast` carries literal `EXPECTED_PAIRS = 29` and
  `EXPECTED_CELLS = 101`.

  **It does not follow that derived lists are always wrong — it depends on the question.**
  The two live examples divide cleanly and both are correct:

  | Gate | Question | List | Why that way |
  |---|---|---|---|
  | `check:tokens` | does the token layer **declare** the right tokens? | **hardcoded** | the declarations *are* the subject, so the expectation must come from outside them |
  | `check-axe`'s route probe | does the token layer **reach** this route? | **derived** from `tokens.css` + the theme files | the subject is the *served page*, not the source; a hardcoded list would rot as tokens are added, and any unlinked stylesheet makes every name resolve to nothing regardless of which names are on the list |

  Deleting `--text-2xl` from `tokens.css` therefore fails `check:tokens` and not the route
  probe, and that is the intended division. **State which question a gate answers before
  choosing where its expectation comes from**, and write the answer next to the list —
  the route probe carries that note because the proof is what surfaced the distinction.
- **A gate over a hand-maintained record asserts that a plausible claim exists, never that
  the work happened. This is the boundary of the whole verification approach, not a defect
  in one script.** `check:claims` reads `_shared/FIX-LEDGER.md` and verifies, against git,
  that every fix claim names a commit which exists, is on this branch, postdates the audit
  that raised the finding, touches the files named, and is not documents alone. Each of
  those rejects a class of *implausible* claim. **None of them can reach whether the change
  did what it says**, because the ledger's status column is written by the same person the
  ledger exists to check: promoting an `OPEN` row to `FIXED` against the current commit is
  accepted in one word and goes fully green (`A-GATE-7-6`).

  Tightening further chases an asymptote — each increment removes another implausible claim
  and leaves the plausible-but-false one untouched. **What establishes that a fix occurred
  is the deliberate-failure proof: make the gate go red, then green.** The record and the
  proof are complementary and neither substitutes for the other.

  So: **read a `FIXED` row as evidence that a claim is well-formed, not that it is true**,
  and never let a green ledger stand in for running the thing. The same reasoning applies to
  any future gate that checks a human-written register — a tracker, a changelog, an
  attestation. Verify the shape mechanically; verify the substance by making it fail.
- **Never recursively delete outside the repository working tree without asking.** Inside
  the repo, `.next/` and `node_modules/` are regenerable — remove them freely. Outside it —
  home directories, tool installs, version-manager trees, anything under `AppData` or
  `Program Files` — **enumerate the full contents first, report what is there, and ask.** A
  top-level listing is not an inspection: `node_modules` shows as one entry and can hold a
  global tool install. This rule exists because a recursive delete of a Node version
  directory destroyed a global CLI install that a one-level look had not revealed
  (`_shared/01-VALIDATION-REPORT.md` §13, E13).
- **Fix the class, not the instance.** When a defect is found, ask what category it
  belongs to and sweep every place that category can occur. A per-instance fix leaves the
  same defect live everywhere else and guarantees it recurs. Three of the four Epic A
  blockers were repeats of already-fixed defects.
- **Any PR touching `styles/tokens.css`, `components/primitives/` or `lib/estimate/` needs review.** These affect all four route groups or determine what the business quotes.

## Definition of Done

Not done until all of these are true:

- [ ] Works at 375px, 768px, 1440px
- [ ] Keyboard navigable end to end
- [ ] Screen reader tested (any interactive component)
- [ ] axe zero violations
- [ ] Loading, empty and error states implemented
- [ ] Zero TS errors, zero ESLint warnings, zero production console output
- [ ] Lighthouse still meets the route's budget
- [ ] Content from the CMS, not hardcoded
- [ ] Analytics events fire once, correctly, after consent
- [ ] Reviewed against the workstream's `DESIGN.md`
- [ ] No `[TK]` markers left unflagged

"It works on my machine at 1440px in Chrome" is not done.

## Performance budgets

**JS is budgeted on what we add above the framework floor, not on the total.** The floor
is a constant we do not control. Budgeting on the total means a framework upgrade
silently eats the allowance features were supposed to have, and the first symptom is a
feature cut for a reason unrelated to the feature.

**Framework floor: 100.2KB gz** — an empty Next 15 + React 19 App Router page, measured
at A-01. Reported as its own number by `scripts/check-bundle-size.mjs` so that a
dependency upgrade shows up as *the floor moving*, not as everyone's budget shrinking.

| Route group | Lighthouse | LCP | **JS delta (gz)** | ≈ total |
|---|---|---|---|---|
| Master | ≥98 perf | ≤1.8s | **≤15KB** — consent 8KB + chrome | ~115KB |
| Design | ≥95 perf | ≤2.0s | **≤25KB** — work grid + matrix + filters | ~125KB |
| **Digital** | **100/100/100** | ≤1.6s | **≤15KB** — deliberately tightest | ~115KB |
| Press | ≥95 perf | ≤2.0s | **≤20KB** — books shelf + filters | ~120KB |
| Estimator / path-finder routes | — | — | **≤40KB** | ~140KB |

All: CLS ≤0.05 (Digital 0.02, Master 0.03). INP ≤200ms (Digital 150) — a **field** target,
proxied in CI by TBT at the same ceiling; see below.

**Lighthouse runs on two axes.** One gate was doing two jobs. Nothing was lowered when
they were split; a second axis was added — FOUNDATION §8.

| Axis | Conditions | Asserts |
|---|---|---|
| **Desktop** | `preset: 'desktop'`, median of 3 | Category scores. Digital's 100/100/100 lives here — it is the craft claim a prospect runs on their own laptop |
| **Mobile** | 4G throttle, 4× CPU, `devtools` throttling, median of 3 | LCP, CLS and TBT directly. **Not** the performance score — it is a weighted curve that moves between Lighthouse versions, so pinning it fails builds for reasons users never experience |

**INP cannot be asserted in CI.** It is a field metric; a Lighthouse navigation run does
not produce one. Three spec files named LHCI as its enforcement, which was never possible.
TBT is the lab proxy at the same ceiling, and real INP has to come from field data.

**⚠ Every LCP budget below is provisional.** An empty page — one `h1`, no image — measures
1520ms on `ubuntu-latest` under real 4G. Digital's budget is 1600ms, so the headroom before
real content is about 80ms, and this is a structural floor rather than a feature overrun. Raise it at the
first Stage 3 route, not at `H-01`. `Q-M16`.

**Digital's 100/100/100 gate is unchanged.** Lighthouse scores measured experience, not
kilobytes; the old 90KB figure was a badly-set proxy for it and has been replaced, not
relaxed. Digital still carries the tightest delta in the programme.

Measured as per-route gzipped module scripts, excluding `noModule` legacy polyfills. Do
not measure with a chunk-directory glob — it double-counts polyfills and other routes.

## When to stop and ask

- A price, figure, standards code, clause reference or credential is unknown
- A calibration gate cannot be met with available data
- A design decision conflicts with accessibility or consent compliance
- A performance budget cannot be met without cutting a P0 requirement
- Anything in `_legal/` needs interpreting

Guessing on any of these is worse than a blocked task.
