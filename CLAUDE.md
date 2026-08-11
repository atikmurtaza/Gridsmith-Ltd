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

## Repository shape

```
app/
  (marketing)/          master layer
  (design)/design/
  (digital)/digital/
  (press)/press/
  api/
components/
  primitives/           shared, theme-agnostic, ZERO hardcoded colours
  chrome/               header, footer, consent, division switcher
  divisions/{design,digital,press}/
lib/
  cms/ leads/ analytics/ consent/ estimate/ path/ company/
styles/
  tokens.css            base layer
  themes/{master,design,digital,press}.css
scripts/                seed, import, image ingest, prod checks
redirects/legacy.json
docs/                   the specs — see below
```

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
