# Handover — end of the Epic A audit session

**Written:** 11 August 2026 · **Revised:** 14 August 2026, at **A-GATE PASS** · **Branch:**
`feat/a-01-a-10a-scaffold-ci` · **Runtime:** Node 24.15.0

This file exists because a session ended with state that only that session knew. Everything
here is either unrecorded elsewhere or scattered across five documents. Read it before
touching anything; delete the sections that go stale as they are resolved.

---

## 1. Where Epic A actually stands

| Task | Status | What a fresh session needs to know |
|---|---|---|
| A-01 | DONE | Next 15 pinned, React 19, **Node 24** (raised from 22 mid-audit). Framework floor **100.2KB gz / 102,635 bytes**, re-measured on Node 24 and byte-identical to the Node 22 build — proven by matching content hashes, not by similarity |
| A-10a | DONE | **Seventeen gates** — fourteen through 13 Aug, plus `check:headings` and `check:content` at the run-3 fixes and `check:claims` at `T3`. All swept twice for the "passes without measuring" class — four instances closed in July, three more found on 12 Aug (one inside `check-axe`), nine gates changed. Every fix proven by deliberate failure: `01-VALIDATION-REPORT.md` §14 |
| A-02 | DONE | 39 base tokens, now held in a **hardcoded required list** in `check-tokens.mjs` rather than scraped from the file being checked. It still counts **declarations**, not string occurrences — exactly once, which is what catches the Tailwind namespace collision |
| A-03 | DONE | Four themes, 15-token contract each (master +3). `check:contrast` is a **101-cell permission matrix**: every foreground token against every surface in every theme |
| A-04 | DONE | Four root layouts, no `app/layout.tsx`. `check:theme` verifies server-set `data-division`, render-blocking CSS, and zero client references |
| A-05 | DONE | 24 primitives, 21 Server / 3 Client. Every primitive that emits a DOM id now generates it with `useId()` — which works in Server Components, so this cost no client JS. `Accordion` also generates its own exclusive-group name and no longer emits an unread `id` |
| A-05a | DONE | `/_kitchen-sink`, 23 primitives × 4 themes (`Media` deliberately excluded — the page now says 23, not 24), **6.2KB gz delta, budgeted at 7KB**, of which **0.5KB** (measured) is the global-error boundary every route carries. The `scope()` workaround is gone: the primitives generate their own ids and `check-axe` still reports zero duplicates |
| A-10b | DONE | Lighthouse split into **two axes** — desktop asserts category scores, mobile asserts Core Web Vitals on 4G. Both green on CI |
| **A-GATE** | **PASSED — 14 Aug 2026** | All six criteria met after seven rounds. Rounds 4–7 were scoped re-verifications, not open audits (`_shared/09`–`12`). **Epic A is closed; do not reopen it to improve anything.** 22 items are logged as P2 with the epic — none an accessibility failure — plus one ceiling (`A-GATE-7-6`) and `G7` deferred. Backlog enumerated in `master/PROJECT-TRACKER.md` |
| A-06, A-07 | **TODO**, not REVIEW | **No code artefacts exist** — no `sanity/`, no `supabase/`, no `lib/`, nothing in `git ls-files`. What exists is prose in `docs/*/SCHEMA.md`, which is the spec, not the work. `REVIEW` means awaiting review and there was nothing to review. Blocked on `Q-M17` / `Q-M18` (the old `(B4)` reference resolved to nothing) |
| A-08, A-09, A-11, A-12 | TODO | Not started |

**Seventeen checks now run**, and the count is machine-checked — `check-node-version` walks
the `verify:*` chain, diffs it against `ci.yml` and prints the number, so this line cannot
drift from reality again: `check:node`, typecheck, ESLint, `lint:colors`,
**`check:contrast`**, **`check:headings`**, **`check:content`**, build, `lint:secrets`,
`check:tokens`, `check:theme`, `size`, `check:axe`, `check:responsive`,
`check:lhci:desktop`, `check:lhci:mobile`, **`check:claims`**. `npm run verify` runs all of them.

The two added at the run-3 fixes are both cases where a defect class had been fixed
per-instance twice: `check:headings` fails on a `<p>`/`<span>`/`<div>` carrying a class
that sets `--font-display` (WCAG 1.3.1 F2), and `check:content` fails on invented money,
revision codes, standards codes or ISBNs in files that render.

**The one missing from the old list was `check:contrast`** — the gate that exists because
25 of 29 published contrast ratios were wrong and two were hiding real WCAG AA failures.
The most consequential gate in the repository was absent from the list of gates, here and
in `master/PROJECT-TRACKER.md`. `lint:secrets` also moved: it now sweeps the built client
chunks, so it runs in `verify:build`, after the build, not in `verify:static`.

## 2. A-GATE — open, and exactly why

> ### ⇢ START HERE: A-GATE PASSED. Epic A is closed. Next is Epic M, task `G7`.
>
> **Criteria 1–6 are met as of 14 August 2026.** Seven audit rounds — three open-ended, four
> scoped. The scoped shape is what worked: rounds 4–7 each re-verified a named list rather than
> re-auditing the epic, and each returned in a single session.
>
> **Do not reopen Epic A.** 22 P2 items are logged against it and **none is an accessibility
> failure at any level** — every one is gate discipline or documentation. They are enumerated
> in `master/PROJECT-TRACKER.md` § "The P2 backlog carried out of Epic A".
>
> **`G7` is done — 18 August 2026.** Digital's shell epic became `U` (`U-01`–`U-09`), Press's
> Path Finder epic became `K` (`K-01`–`K-22`), and `app/(press)/press/page.tsx` now cites
> `Epic P`. Master's `S` and `N` were deliberately left alone: `Epic N` is named by
> `00-FOUNDATION.md`, this file and `scripts/check-bundle-size.mjs` as the epic the budget rule
> guards. **Note lines 250–254 below: `N-04`/`N-05`/`N-07`/`N-12` there are master's and are
> correct unchanged.** Full mapping and the free letters: `master/PROJECT-TRACKER.md` § `G7`.
> Uniqueness is unenforced — logged as `M-P2-1`.
>
> **`M-02` is done — 18 August 2026.** The skip link is in `RootShell`, `A11Y-21` is closed
> before the chrome that would have made it a Blocker, and `check-axe` asserts four things
> about it on every themed route × viewport. **`<main id="main">` is deliberately NOT in the
> shell** — `global-not-found` renders inside it and the 404 served two nested `main`
> landmarks; the tracker's `M-02` section has the full reasoning and the deliberate-failure
> table. Route deltas are unchanged at 0.5KB. **Next is `M-03`, the header — and that is the
> commit where `next/link` becomes a shared 3.3KB cost, so read the `M-06` note first.**
>
> **`M-03` and `M-08` are done — 18 August 2026.** `M-04` was blocked on `M-05`/`Q-M17` and
> `Q-M1`; both are now resolved.
>
> **Two spec claims were measured and found false this session, both in the same shape as
> the 29 contrast ratios.** `APP-FLOW` §8's header names four routes that do not exist —
> the header ships the three that resolve, and `check-axe` now resolves every same-origin
> link on every audited route. `FOUNDATION` §4 said `@font-face` declarations were not
> scoped per route group; they always were, `globals.css` has none, and `check:theme` now
> asserts the per-division face list. **`M-08`'s deliverable turned out to be the
> assertion, not the refactor.** Still 17 gates — both went into existing ones.
>
> **`M-05` is done — 18 August 2026, and `Q-M1`/`Q-M17` are resolved.** Sanity project
> `spzu6y31`; `development` and `production` share one schema folder;
> `NEXT_PUBLIC_SANITY_DATASET` defaults to `development` and must not be set to `production`
> before Stage 8. The Studio is standalone on `localhost:3333`, never a Next route — an
> embedded `/studio` would need a `check-bundle-size` exemption. **18 gates now**:
> `check:launch` asserts the statutory record in every dataset and, on `production` only, a
> non-empty VAT number with no `[SEED]` markers. **One operator step is outstanding and needs
> an interactive login** — the Studio CORS origin; `SETUP.md` has the command.
>
> **Two things to carry, both load-bearing:**
> - **`A-GATE-7-6` is the ceiling of the verification approach.** `check:claims` asserts that a
>   plausible commit exists, never that a fix occurred — the ledger's status column is written
>   by the person it exists to check. **A `FIXED` row means a claim is well-formed, not true.**
>   `CLAUDE.md` carries the rule; do not let a green ledger stand in for running the thing.
> - **`A-GATE-6-6` is worth closing early.** While `GOVERNED` omits the run reports, a finding
>   written only in a report creates no obligation to row it — which is why `A-GATE-7-2` exists.
>
> **`M-06` is the next budget checkpoint** and it is tight: consent 8KB + primitives 5.8KB +
> error boundary 0.5KB = **14.2KB of Master's 15KB**, 0.8KB of headroom before the header and
> footer exist. Both halves are now measured and asserted by `check-bundle-size`, and the
> **baseline spread** assertion added at `T2` is what will see a header imported by three of the
> four route groups — the shape `min` alone was blind to. If the delta exceeds 15KB, stop and
> raise it rather than proceeding into Epic N.

Criteria 1–4 are **met and independently re-verified**. Criteria 5 and 6 have been
**audited to completion once** — round 3 — and neither has yet *returned* clean.

There have been **three rounds** on 12 August, and none closed either criterion.

**Round one — the audit** (`06-EPIC-A-AUDIT.md`). Both agents got through on a second
attempt with tightened prompts and both **returned findings**: 1 blocker + 5 major + 3
minor, and 2 Level A blockers + 1 AA failure. All fixed — §9.

**Round two — after those fixes.** `rules-compliance` ran again against the fixed tree and
returned **4 blockers, 4 majors and 7 minors, none of them re-reports**. All fixed — §10.
`accessibility-audit` died on the session limit and returned nothing.

**Round three — `accessibility-audit` alone, after CI went green.** Died on the session
limit again, having reached the `global-error` render path. Nothing returned. See the
agent-budget note below: the problem was the session, not the shape.

**Round four — 13 August, and the first that returned.** Two narrow runs instead of one
wide one: the 24 primitives, then the five served routes and render paths, each launched
alone as the first action with the other explicitly out of scope. **Both completed.** The
split is what worked — four attempts had died on scope, and neither narrow run came close
to the limit. Findings and the fixes are `07-A11Y-AUDIT.md`; the backlog is
`master/PROJECT-TRACKER.md` § Epic A11Y.

**Criterion 6 is still open.** Round four returned findings, not zero. Six groups were
fixed the same day, four Majors were deliberately left (`A11Y-1`–`A11Y-4`, P1), and the
session that fixed them is the worst available reviewer of them — the same reasoning that
put the criterion there.

**Round three — 13 August, the first to complete both criteria.** Three passes:
`accessibility-audit` over the primitives and `/_kitchen-sink`, `accessibility-audit` over
the routes and render paths, and `rules-compliance`. All three returned.
`rules-compliance` died once on an account session limit and completed on a retry. Full
report: `_shared/08-A-GATE-RUN-3.md`.

It confirmed **all six items rounds 1–2 recorded as fixed are genuinely fixed** — including
`A11Y-1`–`A11Y-4`, independently re-verified — and returned **nine new findings**. Six of
the nine were recurrences of classes this repository had already named, fixed elsewhere and
written a rule about. Two of the three passes found things the other missed, which is the
first direct evidence for the fresh-context wording.

**All nine are fixed, in `G1`–`G8`.** What that produced, beyond the fixes:

| Group | Fix | What it left behind |
|---|---|---|
| `G1`/`G1b` | `--ink-subtle` re-derived in all four themes; no theme needs a size rule | `check:contrast` size pass; **`A11Y-22` closed** |
| `G2` | `Stepper` and `Specimen` render real headings | **`check:headings`** (gate 15) |
| `G3` | lift selector covers every interactive descendant | permanent linked-card specimen; **`A11Y-26` closed** |
| `G4` | `incomplete` no longer discarded; token probe reads every token | rule+route+target allowlist with written reasons |
| `G5`/`G5b` | `global-error` has a gate at last | committed probe route, excluded from production and proven absent by building |
| `G6` | three invented figures zeroed | **`check:content`** (gate 16) |
| `G8` | — | the 6.2KB delta decomposed and asserted; `M-06`'s headroom is now measured |

**Two gates written during those fixes shipped broken and were caught by their own
deliberate-failure proofs** (`A11Y-29`, `A11Y-32`). That is why the proof rule is now
recorded in `CLAUDE.md` as load-bearing rather than ceremonial.

Three things from round four that a fresh session must not rediscover, the first of which
changes how much you should trust everything else in this file:

- **CI had never fired on this branch except through an open PR, and nobody had checked.**
  `ci.yml` triggered on `push: branches: [main]` and `pull_request:`. Nothing in Epic A was
  ever pushed to `main`, so every run the programme has had — including the numbered runs
  quoted in §6 and Q-M16 — arrived via `pull_request` and existed only because PR #1
  happened to be open. Close it, or branch without one, and `git push` runs nothing: no
  failure, no skip, an empty Actions tab, and `npm run verify` still green locally.
  **`CLAUDE.md`'s "CI is the arbiter" was load-bearing for the whole of Epic A and was
  resting on that assumption.** Fixed 13 Aug with `push: branches: ['**']`; recorded as
  `A11Y-27`. The five gate defects before it were checks that measured nothing and reported
  a pass — this one never ran and reported nothing at all, which is why it survived six
  rounds of people reading gate output. **"Proven by deliberate failure" had only ever been
  applied to what a gate asserts, never to whether it is reached.**

- **`/_not-found` had been rendering with no theme at all**, and `check-axe` was green on
  it throughout, because the assertion was that `body[data-division]` existed rather than
  that it computed to anything. The attribute was written correctly server-side; the
  stylesheet giving it meaning was never linked. Fourth defect of that shape, and the
  first inside a gate written to catch the third. Both fixed — the gate now reads four
  tokens back off `body` and compares the background to `--canvas` through a probe.
- **`global-error` is verified on the client-effect path, and that path only.** A throw
  after hydration reaches it, and `app/(marketing)/gridsmith-error-probe/page.probe.tsx`
  is now a permanent committed subject that `check-axe` visits every run — title, `h1` and
  `lang` asserted, so the probe cannot go hollow. The probe must not live in a
  `_`-prefixed folder — Next drops those from routing and you will be measuring the 404.

  **The SSR path is unknown and must not be asserted either way.** This bullet, and
  `global-error.tsx`'s own docstring, used to state as fact that a throw during SSR never
  reaches the boundary and that production serves Next's `__next_error__` shell with no
  `lang` and no `<title>` — a live Level A failure on every server-side crash, if true.
  **Struck at the run-3 fixes.** It cannot be induced without editing a file, no gate
  covers it, and an unverifiable claim does not get asserted in either direction
  (CLAUDE.md). Do not read the probe's success as covering it: the probe exercises one of
  the two ways this boundary can be reached. Establishing the other needs a route that
  throws during render, `next build && next start`, and a read of the response.

The criteria are worded "zero findings" / "zero violations" with no partial credit. Round
two is the important lesson: **the tree that had just been audited and fixed still had four
blockers in it**, including a Level A accessibility hole that was the untouched half of a
defect class the fix session had explicitly closed. This is why the criteria specify a
fresh context — the model that wrote the code is the worst reviewer of it, and the model
that fixed the findings is the worst reviewer of the fixes. Two rounds of that have now
produced findings both times.

**The next actionable task in the programme is `G7`, then Epic M.** A-GATE is passed and
nothing in Epic A is blocking. The agent guidance below is kept because it is what made rounds
4–7 return: launch one agent alone as the **first action** of a fresh session, scoped to a named
list, never open-ended. Five runs died on the session limit before that shape was adopted, and
none has since. `design-conformance`,
`spec-compliance` and `content-integrity` are not A-GATE criteria and have still never run;
they are worth running eventually, one per session, and they are not blocking.

### ⚠ Agent budget — read this BEFORE doing anything else in the session

**Criterion 6 has now failed to complete three times.** Not because the agent is wrong, and
not because the brief is wrong — the third attempt had the tightest brief yet and got
furthest. It ran out of session.

| Attempt | Shape | Outcome |
|---|---|---|
| 1 | Five agents at once, unbriefed | All five died before returning anything |
| 2 | Five at once again, then the two gate-closers relaunched alone with tightened briefs | Both completed and returned findings |
| 3 | Two as a pair (`rules-compliance` + `accessibility-audit`) | `rules-compliance` completed at ~210k tokens / 58 tool calls. `accessibility-audit` died mid-run |
| 4 | **One agent alone**, best brief so far, launched at the **end** of a working session | Died. Got as far as the `global-error` render path — most of the audit done, nothing returned |

**The binding constraint is not the number of agents. It is how much session is left when
the agent starts.** Attempt 4 was launched after that session had already committed 46
files, fixed a red CI run, pushed twice, polled CI to completion and downloaded two log
archives. One agent was the right shape and it still had nothing to run on.

**So the rule is: launch the A-GATE agent as the FIRST action of a fresh session.** Before
reading files, before running gates, before any commit. Then act on its report in that same
session if there is room, or in the next one. `accessibility-audit` on this repository needs
most of a session to itself — it drives a real browser, builds, and probes render paths that
axe cannot reach.

Everything an agent needs in order to be worth launching is already written down: §9 and
§10 list what is fixed, and the do-not-report list is what has got every completed run
through. An unbriefed agent has never survived.

### Where criteria 5 and 6 ended up

| Criterion | Agent | Status |
|---|---|---|
| **5** | `rules-compliance` | **MET.** Seven rounds. Rounds 1–3 returned findings; round 2 is closed as unreconstructable and superseded (§10). Rounds 4–7 were scoped re-verifications and each returned in one session. Round 7 confirmed `U1`–`U3` present, subject-backed and proven red on their stated repro |
| **6** | `accessibility-audit` | **MET.** Completed in round 3 as two narrow runs, and again in rounds 4 and 5. Round 4 re-confirmed `A11Y-1`–`A11Y-4` and found **no AA failure in any primitive**; round 5 returned **zero** on `R3`/`R4`/`R5`. **No open accessibility finding at any level** |

**What actually closed them was the shape of the run, not the content of the brief.** A single
wide audit failed four times on the session limit. Two narrow runs, each launched alone as the
first action, completed every time from round 3 onward — and rounds 4–7 narrowed further still,
to a named list of findings rather than a scope.

**Nothing else in Epic A is open.** A-06 and A-07 are blocked on Atik (`Q-M17`, `Q-M18`), and
A-08 to A-12 are Stage-2 work that Epic M and later stages pick up. **Do not reopen Epic A to
improve anything** — the 22 P2 items are logged deliberately and none is an accessibility
failure.

### If an agent dies mid-run, check the working tree

`accessibility-audit` creates probe routes to observe render paths it cannot otherwise
reach — attempt 4 left `app/(marketing)/%5Fa11y-boom/page.tsx`, a route that throws, in
order to see what `global-error` renders. A probe left behind is a deliberately broken route
committed by accident. `git status` after any agent run.

## 3. Open questions, and who they wait on

| ID | Waiting on | Blocks |
|---|---|---|
| `Q-M1` | **Atik** — company number. Registered office confirmed; the number is statutory and must never be guessed | `M-05`, `L-05` |
| `Q-M2` | **Atik + solicitor** — `_legal/` drafts sent and reviewed. Longest lead time in the programme | `L-04` |
| `Q-M3` | **Atik** — ICO registration | `L-06` |
| `Q-M4` | **Atik + broker** — PI insurance covering engineering drawings | `L-08` |
| `Q-M5` | **Atik** — business hours and phone number | `N-12` |
| `Q-M6` | **Atik** — a real continuity example, verifiable against project records. Must not be invented | `N-05` |
| `Q-M7` | **Atik** — the honest-limits content ("when to use a specialist instead") | `N-04` |
| `Q-M8` | **Atik** — the existing Press site's URL inventory, before Stage 8. **Do not crawl or plan yet** | `G-08` |
| `Q-M9` | **Atik** — public-facing team members | `N-07` |
| `Q-M15` | **Atik** — a real favicon / brand mark. Holds Lighthouse best-practices at 0.96 | best-practices 1.0 |
| `Q-M17` | **Atik** — a Sanity organisation and project | `A-06` |
| `Q-M18` | **Atik** — a Supabase project | `A-07` |
| `Q-M16` | Partly resolved | LCP budgets are measured and closed; two carries remain — see §6 |

Resolved and **not to be reopened**: `Q-M10` (typefaces), `Q-M12` (delta budgeting),
`Q-M13` (`--ink-subtle`), `Q-M14` (shadow tokens). `Q-M11` is **partly reopened** — the
build is greenfield but the existing Press site retires at launch, so its URLs need mapping
(`G-08`).

## 4. In flight

- **PR #1 is open**, `feat/a-01-a-10a-scaffold-ci` → `main`, **21+ commits ahead**.
- CI runs #1 and #2 failed (Chrome sandbox, fixed). **#3 onward are green.** Any run still
  executing at handover is on a docs-only commit.
- **`main` now has a `.gitignore`** — it had none, so checking it out offered `node_modules`
  for commit. Fixed directly on `main`; PR #1 will merge cleanly since the content matches.

**Nothing is half-decided.** The launch model, build order, runtime and budgets are all
settled and recorded. The only open work is A-GATE.

## 5. Gotchas a fresh session will trip on

**Lighthouse does not run on Windows.** Both axes exit 0 with a loud `SKIPPED` on local
Windows — `chrome-launcher`'s `destroyTmp` races Node 24's `fs.rmSync`, deterministic. The
skip is guarded: reaching it with `CI` truthy, or off Windows, is a hard failure. **A local
`npm run verify` pass is not evidence for those two gates — CI is.** The summary says so
between rules; do not scroll past it.

**Node is managed by nvm-windows.** `C:\nvm4w\nodejs` is a symlink, not an install. `nvm use`
changes what every shell resolves. Global npm packages were per-version, which is how
switching to 24 removed `claude` from PATH; it has been reinstalled into the shared
`Roaming\npm` prefix so it survives future switches.

**Node 20 is not fully removed.** `node.exe` (72MB) remains at
`C:\Users\atikm\AppData\Local\nvm\v20.20.2`, held open by two processes from 5 August
belonging to a **different project** — `npm run dev` and a Vite dev server for
`C:\Users\atikm\Projects\Task Tracker`. They were deliberately not killed. Finish with
`Remove-Item ... -Recurse -Force` once they are stopped. `check:node` makes a silent
fallback impossible in the meantime.

**`%5F` is not a typo.** `/_kitchen-sink` lives at `app/(marketing)/%5Fkitchen-sink/`,
because Next treats a literal `_` prefix as a private folder and produces no route. The HTML
references its chunks as `%255F…` (double-encoded); `check-bundle-size` decodes once. Case
is preserved through `decodeURIComponent`, so it resolves on Linux — verified on CI. **Do
not "fix" the directory name.**

**Deliberate-failure proofs: copy the file aside, then copy it back.** Never
`git checkout --` to undo a temporary edit. It restores from HEAD and silently discards
uncommitted work — it cost three files' worth of edits in the 11 August session. The
12 August session ran ten deliberate-failure proofs this way with nothing lost; check
`git status` after each, because a proof you forgot to revert is a defect you just
committed.

**A local `npm run typecheck` is not equivalent to CI, and one defect only ever appeared
there.** `declare module '*.css' {}` typechecked clean on Windows and produced 100+ TS2339
errors on `ubuntu-latest`. Same TypeScript (6.0.3, same lockfile), same tsconfig. `*.css`
and `*.module.css` both have a zero-length prefix before the `*`, so TypeScript's
longest-prefix tie-break cannot separate them and the winner follows filesystem iteration
order — which differs between the two platforms. **Deleting `.next` and
`tsconfig.tsbuildinfo` first does not reproduce it.** There is no local test for this class;
CI is the only instrument. `css.d.ts` now gives the module a real type so it no longer
matters which pattern wins.

**`npm run verify` refuses to run if anything is already on port 3000.** That is
deliberate — it used to test whatever answered, including another project’s dev server, and
worse, a stale `next start` of this app serving the previous build. Use
`VERIFY_PORT=3100 npm run verify` rather than killing a process that may not be yours.

**Recursive deletes outside the repo require asking first** — CLAUDE.md "How to work". A
top-level listing is not an inspection; `node_modules` shows as one entry and held a 258MB
global CLI install.

## 6. What Epic M starts from — all measured on CI, Node 24

| Quantity | Value | Where |
|---|---|---|
| Framework floor | **100.2KB gz** (102,635 bytes) | `check-bundle-size` |
| `/_kitchen-sink` delta | **6.2KB gz**, budgeted 7KB | `check-bundle-size` |
| — of which primitives | **5.8KB gz** | the remaining **0.5KB** is the global-error boundary, carried by every route — both halves are now measured and asserted by `check-bundle-size`, not derived by hand |
| Master JS delta budget | **15KB**, of which the consent banner reserves 8KB | `PROJECT-RULES` §8 |
| Mobile LCP floor | **1519–1530ms** across five CI runs | mobile axis |
| Digital LCP headroom | **~78ms** against a 1600ms ceiling | run #7 |
| Mobile TBT | **~90ms median, ±13ms band** (81–107 observed) | five runs |
| Digital TBT headroom | **~55ms** against 150ms | as above |
| CLS | **0.000** everywhere | both axes |

**Two carries into Stage 3, both `Q-M16`:**

1. **The LCP floor is measured on an empty page** — one `h1`, 425 B of route JS. Every
   figure above is what four essentially blank pages cost. Hero imagery, work grids and book
   covers all produce a larger and later LCP element. Re-measure at the first real route,
   **not at `H-01`** — by then the remedy is cutting a page feature to pay for a floor.
2. **TBT varies with the runner, not the code.** Compare `benchmarkIndex` — now printed
   beside every metric table — before reading a TBT movement as a regression.

**M-06 is the next budget checkpoint, and it is tighter than it was.** Consent banner 8KB
+ primitives 5.8KB + the global-error boundary **0.5KB** = **14.2KB of Master's 15KB**, before
header and footer exist — 0.8KB of headroom, not the 1.3KB this line said before the error
boundary landed. If the delta exceeds 15KB there, stop and
raise it rather than proceeding into Epic N.

## 7. What NOT to redo

> **This section is §7.** It is the list of things that look wrong and are not, and it is
> what a fresh session is told to read before filing a defect against them. It has been
> cited as §8 — §8 is "Decisions settled this session", which is a different list. No live
> document mis-cites it now; if you are about to, it is §7.

`01-VALIDATION-REPORT.md` §11–§13 records **six defect classes and thirteen environment
findings (E1–E13), all closed**. A fresh session must not rediscover them, and must not
"improve" the gates back into the shapes they were fixed out of.

The six classes, in one line each:

1. **Gate ≠ spec** — the gate did not do what its specification said. Four instances.
2. **Number ≠ reality** — the gate was correct and the *model* producing the number was
   wrong. Lantern's `simulate` throttling mis-attributed `font-display: swap`.
3. **Gate cannot run where it matters** — correct, spec-matching, and structurally
   unrunnable on CI. Eleven of eleven green locally; two could never execute on Linux.
4. **A fix that does not cover its own originating case** — `engine-strict` was adopted to
   close E1 and would not have caught the E1 scenario.
5. **Destructive operation inspecting only its top level** — the destructive analogue of a
   gate that passes without measuring.
6. **§12 applied to the analyst** — three ascending points reported as a trend; the fourth
   and fifth returned to baseline.

Specific things that look wrong and are not:

- `check-tokens` counting declarations rather than occurrences — deliberate, see E-M1.
- The 101-cell contrast matrix instead of a token list — deliberate; a list is what let
  `--accent` reach 4.46:1 unchecked.
- `check-axe` asserting duplicate ids itself — deliberate; axe-core keeps `duplicate-id`
  behind its `deprecated` tag and no WCAG tag set reaches it.
- The mobile Lighthouse axis **not** asserting the performance category — deliberate; it is
  a weighted curve that moves between versions. It measures 0.99 on CI, so asserting it
  would make the build red for a number no user experiences.
- `lighthouserc.mobile.cjs` using `devtools` rather than `simulate` throttling —
  load-bearing, see class 2.
- Stage 5 struck through with a gap in the numbering — deliberate; renumbering would break
  every `Stage 8` and `Stage 4` cross-reference.

## 8. Decisions settled this session

- **Runtime: Node 24 LTS**, pinned by major in three places that move together.
- **Single launch after Stage 8.** Nothing ships partially; the existing Press site trades
  until launch and comes down at it.
- **Build order by risk: Master → Digital → Press → Design.** Digital second to discover at
  week 9 rather than week 18 whether 1600ms is reachable; Press third so the section with
  real customers is not in the tail.
- **`O-01` at Stage 4 by calendar** — week 8, whichever division is being built.
- **Mobile LCP budgets are measured**, no longer provisional.

## 9. What changed on 12 August 2026, and what it means for you

The audit in `06-EPIC-A-AUDIT.md` returned 3 blockers, 3 gate holes, 5 majors, several
minors and 7 documentation contradictions. **All are fixed.** Full detail and every
deliberate-failure proof: `01-VALIDATION-REPORT.md` §14. What a fresh session needs:

### Three primitive fixes, each made as a class

- **`Field`, `Select`, `RadioGroup`, `Accordion` generate their DOM ids with `useId()`.**
  They derived `id` from the form `name`, so two forms on one page both collecting `email`
  produced duplicate ids and bound `<label for>` to the wrong control. This was the *root
  cause* of criterion 1's original blocker — fixed at the call site in July, left live in
  the primitives, and it was the fourth Epic A blocker that was a repeat of an
  already-fixed defect. **`useId()` works in Server Components** (React 19's Flight
  dispatcher implements it), so none of these became Client Components and no client JS
  was added.
- **`StickyCta` has one mechanism, CSS `visibility`.** It drove `aria-hidden` and `inert`
  as React props while `position`/`transform`/`display` were CSS, and the two desynced —
  eight painted links that were simultaneously inert and out of the accessibility tree.
  `visibility: hidden` does both jobs in one declaration, so an override that repositions
  the bar sets them together or not at all.
- **`Stepper`'s completed state has a non-colour cue.** `.stepDone` differed by
  `border-color` and `color` — two colour changes, WCAG 1.4.1 — while two comments claimed
  otherwise. **The code was changed to match the claim**, not the reverse: a border-width
  step, plus "completed" in the sr-only prefix, because the marker is `aria-hidden`.

### The gate suite

`check-axe` runs **375px and 1280px × initial and scrolled** — 24 analyses, not 5. It used
to audit one width in one state, and the state it chose was after scrolling to the foot, so
**no route was ever audited as a visitor first meets it**. `/_not-found` is in the route
lists of `check-axe`, `check-responsive` and `check-bundle-size`; it was in exactly one
place in the repository before, an exemption. Nine gates changed in total.

**Two things to hold on to:**

1. **`a gate you have not run is not measuring zero, it is measuring nothing`.** Adding the
   404 to the gates immediately produced a **Level A** failure that had been shipping since
   A-04 — Next's default 404 has no `lang` attribute. Every gate was green throughout.
2. **Fixing that then cost 4.3KB gz on every route**, because the 404 imported the `Link`
   primitive (which wraps `next/link`, a Client Component) and Next puts the root
   not-found boundary in every route's script list. **Every per-route budget still passed** —
   4.3KB is inside all of them. Only the new symmetric floor check in `check-bundle-size`
   caught it. If that check fires, it means every route is carrying something no route
   declared; it deliberately does not guess which of the two possible causes it is.

### Traps this session hit, so you do not

- **`app/global-not-found.tsx` renders its own `<html>`/`<body>`, and that is correct.** With four
  root layouts and no `app/layout.tsx`, an unmatched URL falls outside all four. A raw grep
  of the prerendered file finds two `<html>` tags; the *parsed* DOM has one, because the
  HTML parser merges the attributes of a second `<html>` start tag onto the open element.
  Verified in a real browser. **Two other arrangements were built and measured first** — a
  catch-all route with `(marketing)/not-found.tsx`, and the same boundary a segment
  lower — and both rendered inside `<html id="__next_error__">` with no `lang` and no
  theme, because `notFound()` does not re-enter a root layout. Both also made the 404
  dynamic, so `check-bundle-size` could no longer see it. The file records this. Do not
  re-try them.
- **`check-theme-flash` reads the raw file, so it cannot assert the 404's theme.** That
  assertion lives in `check-axe`'s DOM-integrity pass instead, which reads the parsed DOM:
  every route must carry `data-division` on `<body>`. This is why the 404 is absent from
  `check-theme-flash`'s list and it is not an oversight.
- **`/_kitchen-sink` still scopes `RadioGroup`'s `name`, and only that.** A radio `name` is
  both the Server Action's form contract and the thing that groups the options, so a
  primitive cannot generate it. Four frames sharing `name="division"` genuinely *are* one
  radio group. Everything else the old `scope()` helper touched is gone.
- **ESLint's `no-html-link-for-pages` is switched off for `app/global-not-found.tsx` alone**, in
  `eslint.config.mjs`, with the measurement in the comment. It is not a bypass of a CI
  gate; it is the rule being measurably wrong for one file, and CLAUDE.md non-negotiable #8
  says the feature changes rather than the budget.
- **`lint:secrets` moved from `verify:static` to `verify:build`.** It now greps the built
  client chunks, which is where a leak actually is. It hard-fails if there is no build.

## 10. Round two — what `rules-compliance` found against the fixed tree

> **⚠ This section's "15 findings, all fixed" is UNRECONSTRUCTABLE, and is now CLOSED as
> superseded. Do not attempt to reconstruct it.**
>
> The count is recorded here and in the tracker as **4 blockers, 4 majors, 7 minors**. What
> is actually written down is roughly **eleven** items: three blockers, two gate fixes and
> six corrected numbers, all in the prose below. **The four majors and seven minors are
> itemized nowhere in the repository** — there is no round-two audit file the way
> `06-EPIC-A-AUDIT.md` and `07-A11Y-AUDIT.md` exist for the other rounds. A fresh reader
> asked to "confirm each from the repo" cannot, because the list does not exist. Run 3
> reported this as a finding in its own right: a claim of "all fixed" against a set that
> cannot be enumerated is unfalsifiable by construction, which is the documentary form of a
> gate that measures nothing.
>
> **Why it is nevertheless safe to close.** Round 3 audited **the same scope from a fresh
> context** — the whole of Epic A, in three passes (`accessibility-audit` over the
> primitives and over the routes, plus `rules-compliance`) — and it re-found things that
> were genuinely still live, including two instances of a class round two had itself fixed
> in the same file. An audit that re-finds live defects would have re-found any of the
> unlisted eleven that still mattered. What round 3 returned is the current defect list;
> what round 2 returned is superseded by it.
>
> The prose below is kept because the parts that *are* written down changed how the work is
> done. It is a record, not a checklist — nothing here is outstanding.

15 findings, none of them re-reports of §9. All fixed. The ones that change how you work:

### ✔ Verified by CI — run #16, commit `ecf37b02`, all 18 steps green

Both Lighthouse axes ran against these changes, including the `http-status-code`
assertion added to each. Medians of 3, `ubuntu-latest`, Node 24:

| Axis | Digital | All four routes |
|---|---|---|
| Desktop | **perf 1.00 · a11y 1.00** · bp 0.96 · seo 0.90 | LCP 436–513ms, CLS 0.000, TBT 0ms |
| Mobile 4G | LCP **1520ms** against a 1600ms ceiling — **80ms headroom** | LCP 1518–1522ms, CLS 0.000, TBT 85–89ms |

Both in the bands §6 already records (LCP 1519–1530ms, TBT ~90ms ±13). `benchmarkIndex`
2179 mobile / 2202 desktop, inside the 1259–2216 range across 12 runs — so nothing here is
a runner artefact.

**Run #14 was red first, on TypeScript**, and the cause is worth keeping: see the note in
§5 about local typecheck not being equivalent to CI. One defect in this work was only ever
observable on Linux.

### The blockers

- **`app/global-error.tsx` did not exist, and that was the same Level A hole as the 404.**
  The `/_not-found` fix in §9 treated "the 404 page has no `lang`" as the defect. It was
  not. The defect was *any render path outside the four route groups gets Next's built-in
  document*, and `not-found` was one instance of it. `global-error` was the other, still
  open, still rendering `<html id="__next_error__">` with no `lang`, no `<main>`, no theme.
  **A fix session closed a class it had itself named, on one instance.** Proven by
  deliberate failure: a temporary throwing route returned 500 with one
  `<html lang="en-GB">`, `data-division="master"`, one `<main>` and an `<h1>`.
  It costs **0.5KB gz on every route** (measured; this line said 0.4KB) — unavoidable, since Next puts the boundary in every
  route's client bundle. Raw elements, no primitives, no `next/font`, for exactly the reason
  the 404 taught: one convenience import there cost 4.3KB everywhere.
- **`/_kitchen-sink` rendered fabricated prices** — `£1,250` and `£980`, with `REV-02` and
  `REV-11`. Non-negotiable #2 bans invented prices outright. The same file already applied
  that rule correctly to imagery and to the error reference (`KS-0000`) and then broke it
  two specimens away. Now zeroed digits.
- **A `Field` hint hardcoded a paraphrase of the response commitment.**
  `master/PROJECT-RULES.md` §1.8: that string renders from
  `companyDetails.responseCommitment`, "never hardcoded, never paraphrased". The specimen
  now carries a hint that is not a promise at all.

### The gate that could go hollow, and the one that could drift

- **`check-responsive`'s scroll-reserve assertion now fails at zero measurements.** Its only
  subject is the `StickyCta` on `/_kitchen-sink` — and **A-12 removes that route from the
  production build**. Between A-12 and M-02 it would have had no subject and still printed
  a green line. If you are at A-12 and this fails: put a `StickyCta` on a real route, or
  delete the assertion deliberately. Do not let it pass empty.
- **`npm run verify` and the `ci.yml` step list were two hand-kept lists of the same
  fourteen gates, with nothing asserting they agreed.** Add a gate to one and forget the
  other and CI goes green having never run it. `check-node-version.mjs` now walks the
  `verify:*` chain and compares it to the workflow — it independently reports "14 gates",
  which is the first machine-checked confirmation of that count.

### Numbers corrected to what the gates measure

Six published figures disagreed with a gate. `--accent-design` is **2.16:1**, not 2.0:1
(five places, including a binding non-negotiable in `master/PROJECT-RULES.md` §1.2 and the
`design-conformance` agent's own brief). `--accent`'s range is **4.58–9.25:1**, not
`4.46–19.17:1` — a row that was internally contradictory, since 4.46 fails the 4.5 floor
the same table asserts. The focus treatment is **15.42:1** at worst, not "17.9:1 minimum".
The primitive delta is **6.2KB** as the gate prints it, of which **0.5KB** is the new error
boundary.

**M-06 got tighter.** Consent banner 8KB + primitives 5.8KB + error boundary **0.5KB** =
**14.2KB of Master's 15KB**. 0.8KB of headroom before the header and footer exist, not the
1.3KB the arithmetic in §6 assumed.
