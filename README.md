# Gridsmith Ltd — website specification bundle

Complete production specification for one website serving Gridsmith Ltd and its three trading divisions.

**Start here:** `CLAUDE.md` (every session) → `_shared/02-BUILD-SEQUENCE.md` (what to build when) → `_shared/03-CLAUDE-CODE-KICKOFF.md` (the prompts to use).

---

## Setting up the repository

```
your-repo/
  CLAUDE.md              ← copy from this bundle to the repo root
  docs/                  ← copy the rest of this bundle here
    _shared/  _legal/  master/  design/  digital/  press/
```

Claude Code reads `CLAUDE.md` automatically at the start of every session. Everything else is read on demand, which is why `CLAUDE.md` stays short and points outward.

## What's in the bundle

### `_shared/` — read before anything else
| File | Purpose |
|---|---|
| `00-FOUNDATION.md` | Architecture decision, stack, design tokens, primitives, seed content policy, universal launch gates |
| `00-PROCESS.md` | The canonical six client stages, fixed across all divisions |
| `00-MARKET-RESEARCH-BASIS.md` | The evidence layer. Every conversion decision traces to a numbered finding here |
| `SCHEMA-CORE.md` | Shared CMS document types and database tables |
| `01-VALIDATION-REPORT.md` | Audit of all specs — closed defects, open gaps, recorded decisions and their costs |
| `02-BUILD-SEQUENCE.md` | Stage order, timeline, what to compress if needed |
| `03-CLAUDE-CODE-KICKOFF.md` | Session prompts — bootstrap, per-stage, per-task, verification |
| `04-AGENT-STRATEGY.md` | When to parallelise, when not to, and how to verify |

### `_legal/` — solicitor-ready drafts
Website terms · privacy policy · cookie policy · accessibility statement · master services agreement with three division schedules · consumer terms.

**Drafts, not advice.** `legalDocument.solicitorApproved` gates production publication. Do not extend or amend clauses in code.

### Four workstreams
`master/` · `design/` · `digital/` · `press/` — eight files each:

| File | Answers |
|---|---|
| `PRD.md` | What we're building and why, with numbered requirements |
| `TECH-SPEC.md` | Routes, architecture, budgets, integrations, security |
| `APP-FLOW.md` | Journeys, page structures, form logic, states |
| `DESIGN.md` | Theme tokens, typography, components, motion, do/don't |
| `SCHEMA.md` | Division-specific CMS types and database tables |
| `IMPLEMENTATION-PLAN.md` | Phases, dependencies, gates, risk register |
| `PROJECT-TRACKER.md` | Task IDs, estimates, blockers, metrics |
| `PROJECT-RULES.md` | Binding rules for whoever writes the code |

## The nine hard gates

Build-blocking. None may be waived without a recorded decision.

| Gate | Workstream |
|---|---|
| Solicitor approval of all legal documents | Master |
| Division routing test — ≥70% correct in one click | Master |
| Chartered engineer review of the drawing matrix | Design |
| Track fork user test — ≥80% self-select correctly | Design |
| Drawing estimator calibration — ≥6 of 8 | Design |
| Project estimator calibration — ≥8 of 10 | Digital |
| Ownership wording matches the contract | Digital |
| Rights wording matches the contract | Press |
| Author user test — "does this feel like a vanity press?" | Press |

## Current status

Specs complete and validated. Awaiting: solicitor review, real pricing, author consents, historical project data, and the external bookings listed in `02-BUILD-SEQUENCE.md` Stage 0.
