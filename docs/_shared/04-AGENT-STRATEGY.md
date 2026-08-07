# Agent Strategy — when to parallelise, when not to

Direct answer to "should I spin up agents to handle different tasks and then verify the outputs?"

**Partly yes. Not for building. Yes for verifying, researching and auditing.**

---

## 1. The short version

| Work | Parallel subagents? | Why |
|---|---|---|
| Foundation (Epic A) | **No** | Everything depends on it. Parallel work here compounds every error four ways |
| Building features in one workstream | **No** | Sequential, one tracker task at a time. Interdependent code in one codebase |
| Building two workstreams at once | **No** | They share primitives. Two agents will independently "improve" the same component |
| **Verification and audit** | **Yes** | Read-only, independent, and better done by a context that didn't write the code |
| **Research** (platform specs, standards, competitor pricing) | **Yes** | Genuinely independent, no shared state |
| **Content drafting** (FAQs, service copy) | **Yes, carefully** | Independent per page, but needs hard anti-fabrication constraints |
| **Cross-cutting sweeps** (accessibility, performance, dead links) | **Yes** | Read-only across the whole codebase |

## 2. Why not parallel building

It is tempting, and it is the wrong instinct here for four specific reasons.

**They share primitives.** Twenty-one components in `components/primitives/` are used by all four route groups. Two agents building Design and Press simultaneously will both hit a gap in `Table` or `Accordion`, and both will fix it — differently. You get a merge conflict at best and a silently divergent component at worst.

**Conventions drift.** The `PROJECT-RULES.md` files are detailed precisely so a single agent stays consistent across twenty weeks. Two agents reading the same rules will still make different micro-decisions — naming, file organisation, how a state is expressed — and the divergence is invisible until you read both.

**You cannot review two streams at once.** You are the only reviewer. Parallel agents produce output faster than one person can meaningfully check, and unreviewed output in this project means fabricated content and spec drift accumulating in parallel.

**The bottleneck isn't code generation.** It is decisions, content and external gates — solicitor review, author consents, the chartered engineer, estimator calibration data. Parallelising the part that isn't the bottleneck buys you very little and costs you coherence.

The build sequence is already designed around this: shell first, then one workstream at a time, with a public launch at week 12 rather than week 21.

## 3. Where subagents genuinely earn their place

### 3.1 Verification — the strongest case

**Run verification in a fresh context, not the one that built the thing.** A model that just spent four hours implementing the drawing matrix has every reason to believe it did so correctly. A fresh reviewer reading `DESIGN.md` §5 and then the code finds things the builder cannot see.

Run these as separate, parallel, read-only agents after each stage:

| Agent | Reads | Reports |
|---|---|---|
| **Spec compliance** | PRD + tracker + code | Every P0 requirement: implemented / partial / missing |
| **Design conformance** | DESIGN.md + components | Deviations from tokens, typography, motion, component specs |
| **Accessibility** | Code + WCAG 2.2 AA | Semantic HTML, keyboard, focus, contrast, real tables, ARIA |
| **Content integrity** | All content + CMS | **Fabricated content, silently filled `[TK]`s, invented standards/metrics/clauses** |
| **Rules compliance** | PROJECT-RULES.md + code | Hardcoded colours, unjustified `'use client'`, banned dependencies, missing states |

They are independent, read-only, and produce findings rather than changes. Nothing conflicts.

**The content integrity agent is the most valuable of the five.** Across a twenty-week build, the failure that does lasting damage is not a layout bug — it is a `[TK]` marker replaced with a plausible-looking invented BS standard, a fabricated case study metric, or an ISBN that doesn't exist. These survive casual review because they look right. A dedicated agent whose only job is to find them, with instructions to treat every specific claim as guilty until verified, catches what feature review misses.

### 3.2 Research — clean parallelism

Genuinely independent, no shared state, and several of these are on the critical path:

- Current platform specifications for KDP, IngramSpark, Draft2Digital, Apple Books, Kobo (Press `R-15`, `O-12`)
- BS 8888 / BS EN ISO 128 / Eurocode / RIBA stage references for the drawing matrix — **for drafting only; the chartered engineer gate still applies**
- Competitor pricing and positioning per division
- Accessibility patterns for the estimator and path finder components

### 3.3 Cross-cutting sweeps

Read-only, whole-codebase, ideal for parallel agents:

- Dead retailer links on the Press books shelf
- Response-commitment audit across all four route groups (`H-07`)
- Performance budget compliance per route
- Structured data validation across every template
- `[TK]` marker inventory

## 4. The verification protocol

The part of your question that matters most: *"then it should verify the outputs based on the requirements."*

### Three rules

**1. Verification runs in a fresh context.** Not a continuation. Not "now check your work." A new session that reads the spec first and the code second.

**2. Verification reports, it does not fix.** A reviewer that fixes what it finds cannot be trusted to have found everything — the incentive to declare done contaminates the search. Separate the passes: find, then decide, then fix.

**3. Verification produces evidence, not assurance.** "Fully accessible" is a claim. `axe` output, a keyboard walkthrough transcript, and a contrast table are evidence. Reject the first and ask for the second.

### The loop, per stage

```
BUILD      one tracker task at a time, sequential, single agent
   ↓
SELF-CHECK builder confirms Definition of Done, lists [TK]s and open decisions
   ↓
VERIFY     5 parallel read-only agents, fresh context, report-only
   ↓
TRIAGE     you decide: fix now / defer with a tracker row / accept with a note
   ↓
FIX        back to the building agent, with the findings as the task
   ↓
RE-VERIFY  the agents that found blockers, only those
   ↓
GATE       hard gates for the stage — external where required
   ↓
COMMIT     stage marked done in the tracker
```

### What verification cannot do

Be clear-eyed about the limits. No agent can verify:

- Whether a BS standard reference is correct → **chartered engineer**
- Whether an estimator range is realistic → **calibration against real past projects**
- Whether the site reads as a vanity press → **real authors, asked directly**
- Whether the ownership wording matches the contract → **you and your solicitor**
- Whether the division routing works → **ten real people**
- Whether a case study metric is true → **you**

That is why there are nine hard gates and why six of them are external. **Automated verification catches spec deviation. It cannot catch a specification that is confidently wrong, and it cannot catch a claim about the world.**

## 5. Practical setup

**Custom subagent definitions.** Claude Code supports project-scoped subagents in `.claude/agents/`. Worth defining the five verification agents once so each runs with a fixed brief and a read-only posture rather than being re-prompted from memory each time.

**Scope every verification agent narrowly.** "Check accessibility on the Press books shelf and packages table" gets a useful report. "Check the site" gets a summary that reads well and finds nothing.

**Give them the spec path, not a description.** `docs/press/DESIGN.md §5` — not "check it matches the design."

**Instruct them to be harsh.** Include it explicitly: *"Be harsh. A missed defect here becomes a defect in a live commercial website."* Reviewers default to agreeable.

**Timebox research agents.** Platform specifications and standards references need to be current, but research agents will happily produce twenty pages. Ask for a table with a source and a checked-on date.

## 6. What I'd actually do

For a solo build with your setup:

1. **Sequential single-agent building**, one tracker task per session. This is the whole build.
2. **Five parallel verification agents at each stage boundary**, fresh context, read-only, harsh.
3. **Research agents on demand** for platform specs, standards drafting and competitor pricing.
4. **One standing content integrity agent** run weekly across the whole codebase, regardless of stage. Fabricated content is the failure that compounds silently.
5. **Never parallelise the foundation, and never build two workstreams at once.**

The temptation will be strongest around week 14, when Press is live, Design is half-built, and Digital is still untouched. That is exactly the point at which parallel building would cost you the coherence the master brand depends on.
