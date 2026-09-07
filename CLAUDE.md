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
7. **Never fire a non-essential cookie before consent.** (Today there is none to fire — see *Stack*. The rule is what keeps it that way.) A reg. 6 breach attracts PECR's *higher* maximum — £17.5m or 4% of worldwide turnover (PECR Sch. 1 para. 18(b)(ii), applying DPA 2018 s. 157(2)(a) and (5); in force 5 Feb 2026). See `_legal/02-CITATION-LEDGER.md` `L-PECR-PENALTY`.
8. **Never break a performance budget to add a feature.** The feature changes or is cut.
9. **Never remove Press's honest outcomes.** The Path Finder must be able to recommend against Gridsmith. Schema-enforced and audited.
10. **Accessibility wins every conflict.** WCAG 2.2 AA is the floor. Then raise the conflict.

## Stack

Next.js 15 App Router (**pinned — Next 16 adds ~29KB gz to the JS floor and breaks every budget below**) · React 19 · Node 24 · TypeScript strict · Tailwind v4 + CSS custom properties · Sanity CMS · Supabase (Postgres) · Resend · Vercel · Zod + Server Actions.

**No analytics.** GA4 and PostHog were removed on 26 Aug 2026 (owner decision, OQ-7 option 2): they
loaded on consent and never initialised, so consent was collected for two libraries that recorded
nothing while every accepting visitor's IP and user-agent still reached Google and PostHog. There are
**no consent categories** and the banner is a notice. Re-introducing analytics is a single deliberate
task with prerequisites — `docs/_shared/BEFORE-LAUNCH.md` item 22 — and `_legal/03-REVISION-LOG.md`
round 10 is the decision and the measurement.

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
- **Read before you build. Establish absence before authoring a gate or a route.** Before
  writing anything into `scripts/` or `app/api/`, list both directories and read the files whose
  names are near the question — a check is not new because the tracker row is open. `scripts/`
  holds 28 gates and `app/api/` holds the live probes; several answer questions phrased
  differently from the row that sends you there. `scripts/check-rls-live.mjs` was written,
  proven and then deleted at the `K-10` premise check because it duplicated
  `app/api/rls-drift/route.ts` by about 70%; the duplicated question had been recorded `FIXED`
  on 21 August and the route had been in the tree since. **That cost most of a session, and the
  reading that would have prevented it was two `ls` calls.** Where an existing gate is close but
  wrong, extend it — a second gate over one subject is how two gates disagree in silence.
- **CI is the arbiter.** TypeScript, ESLint, `no-hardcoded-colors`, `check-service-role-key`, `check-bundle-size`, Lighthouse CI and axe all block merge. Never add a bypass.
- **Conventional commits**, scoped by workstream: `feat(press): add platform compliance table`.
- **Update the spec in the same commit** as any deviation. A spec that has silently drifted is worse than none — the next session will follow it.
- **A measurable number in the specs is unverified until a gate measures it.** Where a
  gate and the prose disagree, **the gate is the source of truth** and the prose gets
  corrected. The two existing examples are `check:contrast` (the 36 contrast ratios in
  the four `DESIGN.md` §2 tables) and `check-bundle-size.mjs` (the JS budgets). This rule
  exists because it was learned the hard way: at A-03 there were 29 published ratios, and
  25 of them were wrong — 2 hiding WCAG AA failures the published figures called passes. A
  specific-looking number is worse than no number, because it stops anyone re-deriving it.
  **If you meet an asserted number that no gate covers, treat it as unverified and say
  so** rather than building on it.
- **Every A/B measurement runs on clean builds — `rm -rf .next` before each side.** An
  incremental build that decides nothing changed does not say so: it exits 0, prints the same
  route table, and leaves the previous artefact in place. Two readings in the `N-01` block 1
  session were real measurements of an unrebuilt tree — identical chunk hashes and identical
  file timestamps to the build before them — and one of them was reported as a +5,591 B
  regression before the timestamps were noticed. **A stale build does not error, it reports.**
  The tell is that the numbers do not move when they should, or move when nothing should have
  changed them; the fix is not to look for the tell but to remove the possibility. The same
  session's `.next` then corrupted outright and served HTTP 500 on every route, which is the
  loud version of the same fault and the harmless one.

- **A proof harness owns its subject exclusively for the duration of the run. Nothing else
  reads or writes that file in the window — not a second harness, not `verify:static`, not a
  dev server.** A harness works by mutating a committed file, reading a result, and restoring
  the original. Two of those overlapping do not conflict noisily; they interleave, and the
  loser's "restore" writes the winner's mutation back **as the original**. The file is then
  wrong on disk, in a state no diff attributes to either proof, and both readings still look
  like readings.

  This shipped. At `K-04` two harnesses overlapped over `lib/path/seedConfig.ts` and committed
  `isSeed: false` to disk; separately, `verify:static` was started while a harness was mid-
  mutation and went red on a temporarily-mutated subject — **a real red with no real defect**,
  which is the reading that wastes a session. Both were recoverable and neither had to be.

  So: **one harness at a time, and no other reader of the subject while it runs.** Restore by
  writing back bytes captured before the first mutation, not by re-applying an inverse edit —
  an inverse edit of the wrong baseline is exactly the failure above. And when a proof ends,
  **assert the subject is byte-identical to `HEAD`** (`git diff --quiet -- <file>`) before
  believing the result; a harness that cannot say its subject is clean has not finished.

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

  **A probe that produces no red is not evidence about the gate until the probe is shown to
  be a subject the gate could have caught.** The rule above says a gate never made to fail is
  not yet a gate; it assumes the attempt to make it fail was valid, and that assumption is
  where the next defect lives. A green result from a deliberate-failure attempt has two
  readings — *the gate is broken* and *nothing was injected that the gate measures* — and they
  are indistinguishable from the exit code. **Establish the second before concluding the
  first**, and establish it from a property of the probe, not from the gate's silence.

  `V-06`'s overflow probe was a `3000×0px` div and `check:responsive` stayed green. A
  zero-height box contributes no scrollable overflow, so the probe was never a subject: the
  run measured nothing and read exactly like a broken gate. The gate's own `widest` reporter
  compares `rect.right` and would have named it, but the outer predicate is `scrollWidth`,
  which never reached it. A `3000×20px` div fired at all three widths.

  **The general form is that a probe has to satisfy the gate's predicate, not merely resemble
  its subject**, and a probe fails that test in three ways worth checking by name: it is
  *inert* — the injected thing cannot produce the quantity the predicate reads, as with the
  zero-height overflow box; it is *out of scope* — the file, route, viewport or state carrying
  it is not one the gate visits, as when a specimen sits below the fold of a hit-tested
  viewport; or it is *unreachable* — an earlier exit, filter or narrowed predicate consumes it
  before the assertion under test runs, which is `A-GATE-4-3` and `A11Y-29`.

  **A red result carries its own validity proof and needs no separate one** — the gate named
  the injection, so the injection reached it. The obligation is asymmetric and falls entirely
  on green readings, which is why it is easy to skip: the proofs that need it most are the
  ones that looked finished fastest. **Where a proof's recorded outcome is an absence, the
  record must say what makes the probe a subject** — the property, measured or derived, that
  puts it inside the predicate. "It did not fire, so there is no false positive" is a claim
  about the gate only if the same run fired on something else in the same file, route and
  pass; say which.

  **Prefer a probe whose validity is structural.** A committed selftest that asserts a rule
  function's *return value* cannot have this defect, because the reading is a value rather
  than an absence — `check-legal-parity.selftest.mjs` and `check-launch-content.selftest.mjs`
  are the shape. Where the subject must be a served page, make the probe's validity observable
  in the same run: assert the injected quantity directly, or use a probe large enough that the
  gate's secondary reporter names it even when the primary predicate does not.

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

  **Every branch of a multi-branch assertion gets its own deliberate-failure proof. One
  branch firing is not evidence for the others — and a partially-firing gate is more
  dangerous than a silent one**, because it produces green results that look earned.
  `check:rls` accepted an `anon` SELECT policy **twice**: first because an unbounded role
  capture read `to anon using (true)` as the role `"anon using"`, which matches no role
  name; then because the fix for that was written with a literal backspace (U+0008) where
  `\b` was intended, making the lookahead `(?:using|with)\x08`, which can never match. All
  the while the DELETE branch — which ends in `;` and takes the other side of the
  alternation — fired correctly, and reading that output was indistinguishable from reading
  the output of a gate that worked. **Reading the line found neither bug. Proving each
  branch separately found both.** A half-working alternation, a `||` where one side is
  unreachable, a loop whose predicate is true for one shape of input and inert for another:
  all of these report success from the branch you happened to exercise. Enumerate the
  branches, break each one, and record which message each produced.

  **A check that does not exist while reporting that it ran, and this is its own class.**
  Every other gate defect in this repository *executed something* and measured the wrong thing:
  a predicate that could not match, a subject below the fold, a filter that swallowed a route,
  an expectation read from its own subject. This one executed nothing. `check:schemas` declared
  a `CLOSED_LISTS` constant, printed **"2 closed list(s) intact and enforced by a custom rule"**,
  and contained no loop over it — an insertion that silently failed, leaving a summary line as
  the only evidence anyone would ever have had. **It produced its own evidence.** A reviewer
  reading the output saw a specific, plausible count of a thing that had never been counted,
  and a reviewer reading the file would have had to notice an absence rather than an error.

  So: **a summary line is not evidence a check ran. Only a proof that makes it fail is.**
  Wording that sounds measured — a count, a total, a list of what passed — is the easiest
  output to produce without measuring anything, and this repository's gates are full of exactly
  that wording because it is genuinely useful when true.

  **Any gate whose output is a count must be provable to report zero**, or to report a
  different number. If you cannot make the count move, you have not established that anything
  is counting. This is a distinct obligation from proving the assertion: the assertion proof
  shows the check *rejects* a bad input, and this shows the check *reached* the input at all.

  **A gate that infers the state of a system it does not run in is asserting against something
  it cannot see.** The gate and the thing it measures are usually separate processes, and any
  premise the gate reads from its *own* environment is a guess about the other one. `check-axe`
  decided whether Resend was "configured" from the runner's `process.env` while asserting the
  *server's* behaviour; during a deliberate-failure proof it reported *"Resend is not
  configured"* about a server that was configured and failing — a confidently wrong message
  from a gate that was otherwise working. The fix is not a better guess: **ask the system.** The
  probe route now reports its own configuration and the gate compares against that.

  **This shape recurs wherever the subject is remote**, and two open items have it by
  construction. `M-P1-3` must read the **live database**, not the migrations — `A-07`'s leak
  existed in the running system while the migration read correctly, so a source check cannot
  see the class that matters. And anything CI eventually asserts about the Vercel
  deployment — env vars set, dataset selected, mail authenticated — is an assertion about a
  machine CI does not run on, and must be answered by that machine rather than inferred from
  the workflow file.

  **A security proof executed over a transport no hostile client has is not a proof, whatever
  it returns — and a clean result is the dangerous one.** Choose the probe's transport to match
  the attacker's, not the one that is convenient to drive. Where they differ, the convenient
  transport can make an exposure unreachable *in the probe* while leaving it reachable in the
  system, and can equally make a real defence look like one the probe established.

  The concrete instance, because it will be rediscovered: **over PostgREST an `anon` UPDATE or
  DELETE probe cannot fire while the table has no SELECT policy.** PostgREST resolves a filtered
  write through a subselect, so it never finds a row to write, whatever UPDATE policy exists.
  Measured both ways at the `K-10` premise check: the same write is **1 row** as role `anon` in
  SQL and **0 rows** over HTTP. Two such probes were written and removed as unreachable code —
  **do not re-add them as defence in depth**; they are the inert-probe class wearing a security
  label. The reading that matters — `anon` cannot SELECT — is the one that makes them inert, so
  assert *that*, and assert INSERT separately because INSERT does not go through the subselect.
  `app/api/rls-drift/route.ts` is where this lives.

  **A gate subject must assert that it is still the subject.** A subject that quietly stops
  being one leaves the gate auditing whatever happens to be there and calling it clean —
  the *hollow subject*, and the general form of how `global-error` went unmeasured. Its
  probe route throws after hydration; if the throw ever stopped firing, axe would audit the
  fallback paragraph and pass. So the route asserts that the boundary identifies itself —
  title, `h1`, `lang` — and fails if it does not. Wherever a gate depends on its subject
  being in a particular *state*, assert the state, not the subject's existence.
- **Adding a subject to a gate is not done until every list that gate consults has been
  updated — and a gate's green is only evidence for the question it was actually asked.**
  Most gates hold more than one list: a subject list, and alongside it allowlists, exclusions,
  budgets, expected-counts. Adding a route to the first and not the others is **invisible in
  the source**, because nothing in the gate relates its own lists to each other. There is no
  wrong output to notice and no silent check to find — only a red run later, on a route the
  session that added it has stopped looking at.

  `K-13` put `/press/contact` and `/press/contact/thank-you` into `check-axe`'s `ROUTES` and
  not into `INCOMPLETE_ALLOWED`, and `check:axe` was red for **two sessions**. The `K-13`
  write-up's *"axe is clean on both new routes"* was not careless and not false: it was true
  about **violations**, which is what that session had asked about. It was silent about
  **incompletes**, which is a second question the same gate answers and nobody had put to it.
  So the second half of this rule is the load-bearing half: **when you report a gate green,
  report which of its questions you asked.** A gate with two assertions has two greens, and
  the summary line prints both whether or not you read both.

  The obligation when adding a subject is therefore: **enumerate the gate's lists, decide each
  one explicitly, then re-run the gate** — the run is what settles whether an allowlist entry
  was needed, because that depends on what the route renders and no static reading can know it.
  `check:lists` (`scripts/check-list-parity.mjs`) asserts the half that *is* static — every key
  in a dependent list names something in the subject list — and its discovery guard makes a new
  multi-list gate impossible to add without registering a relation for each of its lists. It
  does not and cannot catch the `K-13` direction; its docstring says so, and the run is what does.

- **An expectation derived from its own subject cannot fail when the subject is removed.**
  If a check reads its expected values out of the same file it is checking, deleting an
  entry deletes the expectation with it and the check stays green having measured less.
  This is why `check:tokens` holds a **hardcoded** 39-token `REQUIRED` list rather than
  scraping `tokens.css`, and why `check:contrast` carries literal `EXPECTED_PAIRS = 36` and
  `EXPECTED_CELLS = 148`.

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
- **Two documents that must agree, with no assertion between them, is its own defect class —
  and where only one of them is delivered, the assertion must run against the delivered one.**
  `scripts/seed-legal.mjs` was not a stale copy of `docs/_legal/`. It was an **independently
  authored second document set**, internally coherent, actively maintained, and carrying its own
  version — `0.1-draft` on all seven documents while the drafts were at 1.2 and 1.3 after nine
  review rounds. **The site published the seed script.** So every round that verified a clause
  against an instrument was verifying a document the public never received, and the served
  consumer terms kept a 14-day refund promise round 9 had deliberately removed — which under
  `L-CRA-50` is a term of the contract, so the site was **making a more generous offer than the
  reviewed draft, and nobody chose it**. Six further divergences sat alongside it and five ran
  against Gridsmith or the reader.

  **This is not "documentation drifts".** Four features distinguish it and all four must hold:
  both artefacts are authored rather than derived, so no build step is missing; both are
  maintained, so neither looks stale; **only one is delivered**, and the undelivered one is the
  one everybody reviews; and their disagreement is not unlikely but *unobservable*, because
  nothing in the system takes both as input. Eleven rounds went past it — not from carelessness,
  but because **no output was wrong, no check was silent, and there was no place the question
  could be asked**.

  **It was found by transcribing one document into the other word for word**, which is the
  reusable part: reading for a defect finds the defects you can imagine, and a transcription
  fails on the sentences that cannot be located regardless of what you were looking for. The
  first pass reported 106 divergences, nine of which were connectives the transcription had
  itself invented — the same defect in miniature, in the work done to fix it.

  So: **when two artefacts must agree and only one reaches a user, assert against the one that
  reaches the user.** A check between the two sources is a check between two things nobody
  receives — which is why `check:legal:parity` reads the served page and not `seed-legal.mjs`.
  Two instances of this shape are still open and are now recorded as one class rather than two
  notes: `PRIVACY-POLICY.md` §6's recipient table against `lib/leads/notify.ts`, and the
  committed migrations against the live database (`M-P1-3`, `M-P2-12`).
  `_shared/01-VALIDATION-REPORT.md` §21.
- **A parity gate asserts that the delivered copy matches the reviewed copy. It never asserts
  that the reviewed copy is right, and that limit belongs in the gate.** A defect the two share
  is invisible to it by construction — `CONSUMER-TERMS.md` §5's headline refund promise is more
  generous than the §5.3 it defers to (`F-11`), and the served page reproduces it faithfully, so
  `check:legal:parity` is green and correct to be green. That is a **CEILING, not a gap**:
  widening it would mean asserting that a clause is legally sound, which is the solicitor review.
  State it in the gate's own docstring, because a green line is otherwise read as "the copy is
  fine" when what it means is **"the copy is the copy that was reviewed."**
- **Never recursively delete outside the repository working tree without asking.** Inside
  the repo, `.next/` and `node_modules/` are regenerable — remove them freely. Outside it —
  home directories, tool installs, version-manager trees, anything under `AppData` or
  `Program Files` — **enumerate the full contents first, report what is there, and ask.** A
  top-level listing is not an inspection: `node_modules` shows as one entry and can hold a
  global tool install. This rule exists because a recursive delete of a Node version
  directory destroyed a global CLI install that a one-level look had not revealed
  (`_shared/01-VALIDATION-REPORT.md` §13, E13).
- **When a rule is struck, register it in `check:struck` in the same commit that strikes it,
  and strike it in place rather than deleting it.** A rule removed from one document and left
  standing in another is `_shared/01-VALIDATION-REPORT.md` §21's shape, and it has recurred:
  `P-01`'s 17px floor stood in four documents, and `vatNumber` — removed from the schema, the
  projection, the footer, `/about`, the seed and `check:launch` on 2 September 2026 — was still
  specified in `master/SCHEMA.md` two days later, where an implementer rebuilding the singleton
  would have restored a field whose absence is a compliance decision. Deleting the wording is
  not the fix either: it removes the gate's only subject, so the annotated line stays and
  `scripts/struck-rules.mjs` gets the entry. **Retrospective sweeps of the audit trail are
  closed** — two ran on 4 September 2026, a third found nothing, and the registry is now
  populated by deliberate registration at strike time rather than by archaeology.

- **Placeholder imagery is geometric and generated in this repository. Never stock
  photography — not Unsplash, not Pexels, not "just for now".** *The feel* above prohibits
  stock photography outright and `00-FOUNDATION.md` §"Seed content" item 7 requires *"neutral
  geometric placeholders at correct aspect ratios"*. `components/content/Placeholder.tsx` is
  that placeholder: a bordered box with a token-drawn CSS hatch, no file, no `<img>`, no Sanity
  asset, no network request, at every ratio the site uses.

  **This has already been asked for and correctly refused, and the refusal stands.** A brief on
  7 September 2026 authorised *"Unsplash, Pexels, or generated blocks"*; generated blocks were
  taken and the refusal was right, for four reasons that are still true. Two are rules already
  written here, so adopting a photograph would mean **striking a rule, not filling a surface**.
  The third is performance — 24 photographic cards is 24 requests on the route with the
  tightest budget in the programme, and `Q-M16` already measures an *empty* page at 1520ms
  against Digital's 1600ms. The fourth is that seed records are deleted rather than edited, and
  an uploaded asset outlives the record referencing it.

  **Do not reopen this as a content gap.** A surface with a `Placeholder` is filled. An unbuilt
  route is not an empty surface. `Media.tsx` and the `2:3` book cover are deliberately
  unexercised and `PRE-DEPLOYMENT-CHECKLIST.md` Group E says why. If photography is wanted it
  is a positioning decision by the owner, taken by striking the two rules above and registering
  them in `check:struck` — not by an implementer reaching for an image host mid-task.

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
| Master | ≥98 perf | ≤1.8s | **≤15KB** — notice + chrome | ~115KB |
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
