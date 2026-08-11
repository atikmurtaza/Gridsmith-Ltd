# Handover — end of the Epic A audit session

**Written:** 11 August 2026 · **Branch:** `feat/a-01-a-10a-scaffold-ci` · **Runtime:** Node 24.15.0

This file exists because a session ended with state that only that session knew. Everything
here is either unrecorded elsewhere or scattered across five documents. Read it before
touching anything; delete the sections that go stale as they are resolved.

---

## 1. Where Epic A actually stands

| Task | Status | What a fresh session needs to know |
|---|---|---|
| A-01 | DONE | Next 15 pinned, React 19, **Node 24** (raised from 22 mid-audit). Framework floor **100.2KB gz / 102,635 bytes**, re-measured on Node 24 and byte-identical to the Node 22 build — proven by matching content hashes, not by similarity |
| A-10a | DONE | Five gates, all hardened during the audit. None can now skip its subject silently |
| A-02 | DONE | 39 base tokens. `check:tokens` counts **declarations**, not string occurrences — it asserts each token is declared *exactly once*, which is what catches the Tailwind namespace collision |
| A-03 | DONE | Four themes, 15-token contract each (master +3). `check:contrast` is a **101-cell permission matrix**: every foreground token against every surface in every theme |
| A-04 | DONE | Four root layouts, no `app/layout.tsx`. `check:theme` verifies server-set `data-division`, render-blocking CSS, and zero client references |
| A-05 | DONE | 24 primitives, 21 Server / 3 Client |
| A-05a | DONE | `/_kitchen-sink`, 23 primitives × 4 themes (`Media` deliberately excluded), **5.7KB gz delta, budgeted at 7KB** |
| A-10b | DONE | Lighthouse split into **two axes** — desktop asserts category scores, mobile asserts Core Web Vitals on 4G. Both green on CI |
| **A-GATE** | **OPEN — this is the next task** | See §2 |
| A-06, A-07 | REVIEW | Schemas and migrations written; both await external accounts (`B4`) |
| A-08, A-09, A-11, A-12 | TODO | Not started |

**Thirteen checks now run**, not the ten the older prose says: `check:node`, typecheck,
ESLint, `lint:colors`, `lint:secrets`, build, `check:tokens`, `check:theme`, `size`,
`check:axe`, `check:responsive`, `check:lhci:desktop`, `check:lhci:mobile`.
`npm run verify` runs all of them.

## 2. A-GATE — open, and exactly why

Criteria 1–4 are met or provisionally met. **Criteria 5 and 6 have never been executed.**

Five agents were launched at the start of the audit — `spec-compliance`,
`rules-compliance`, `accessibility-audit`, `design-conformance`, `content-integrity` — and
**all five died on a session limit before returning anything**. Not one produced findings.

The audit that followed was done by a single context reading the code directly. It found
four blockers, six majors and thirteen environment findings, and all are fixed. **That is
not a substitute for criteria 5 and 6**, and it must not be recorded as one: the criteria
specify a fresh context precisely because the model that wrote the code is the worst
reviewer of it — and by the same logic, the model that fixed the audit findings is the
worst reviewer of the fixes.

**The next actionable task in the programme:** run `rules-compliance` and
`accessibility-audit` from `.claude/agents/` in a fresh session, on Node 24. Nothing
downstream of Epic A starts until both return clean. `design-conformance`,
`spec-compliance` and `content-integrity` are not A-GATE criteria but were also never run;
worth running while the context is fresh.

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

**Never `git checkout --` to undo a temporary edit** during a deliberate-failure proof. It
restores from HEAD and silently discards uncommitted work — it cost three files' worth of
edits in this session. Copy the file aside and copy it back.

**Recursive deletes outside the repo require asking first** — CLAUDE.md "How to work". A
top-level listing is not an inspection; `node_modules` shows as one entry and held a 258MB
global CLI install.

## 6. What Epic M starts from — all measured on CI, Node 24

| Quantity | Value | Where |
|---|---|---|
| Framework floor | **100.2KB gz** (102,635 bytes) | `check-bundle-size` |
| Primitive layer delta | **5.7KB gz**, budgeted 7KB | `/_kitchen-sink` |
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

**M-06 is the next budget checkpoint.** Consent banner 8KB + primitives 5.7KB = 13.7KB of
Master's 15KB, before header and footer exist. If the delta exceeds 15KB there, stop and
raise it rather than proceeding into Epic N.

## 7. What NOT to redo

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
