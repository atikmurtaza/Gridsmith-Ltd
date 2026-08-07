# Claude Code Kickoff Prompts

Copy-paste prompts for each kind of session. They are written to be pasted verbatim.

---

## 1. Session one — bootstrap

Use once, on an empty repository, after copying `CLAUDE.md` to the root and the rest of the bundle to `docs/`.

```
I'm building the Gridsmith Ltd website. Everything you need is specified in this repo —
CLAUDE.md at the root and the full specification in docs/.

Before writing any code:

1. Read CLAUDE.md.
2. Read docs/_shared/00-FOUNDATION.md in full. This defines the architecture,
   the design token system, the shared primitives, the seed content policy and
   the universal launch gates.
3. Read docs/_shared/02-BUILD-SEQUENCE.md. We are starting at Stage 1, Foundation.
4. Read docs/master/PROJECT-RULES.md. It is binding for all shared code.
5. Read docs/master/PROJECT-TRACKER.md, Epic A.

Then, before you write a line:

- Tell me your understanding of the architecture in your own words — specifically,
  why this is one application with four route groups rather than four sites, and how
  theming works across them.
- List anything in the specs that is ambiguous, contradictory, or that you would need
  a decision from me on before starting.
- Propose the order you'll tackle Epic A in, and where you'd deviate from the tracker
  order and why.

Do not start implementing until I've responded. I want to know we're aligned on the
architecture before any code exists, because Epic A is what all four workstreams
inherit.
```

**Why it's shaped this way.** The most expensive errors in this build are foundation errors — a primitive with a hardcoded colour, a theming approach that flashes on route change, a schema that makes a launch gate unenforceable. Every one is an hour to fix in week two and forty files in week twelve. Spending one session on alignment before any code exists is the cheapest insurance available.

---

## 2. Starting a new stage

```
Starting Stage [N]: [name] from docs/_shared/02-BUILD-SEQUENCE.md.

Read, in this order:
- docs/[workstream]/PROJECT-RULES.md   (binding — read fully)
- docs/[workstream]/PRD.md
- docs/[workstream]/TECH-SPEC.md
- docs/[workstream]/DESIGN.md
- docs/[workstream]/APP-FLOW.md
- docs/[workstream]/SCHEMA.md
- docs/[workstream]/PROJECT-TRACKER.md

Then:
1. Confirm which tracker tasks are in scope for this stage.
2. Identify any task blocked on a decision or data I haven't provided.
3. Flag any hard gate in this stage and what it needs from me, with lead time.
4. Tell me the first three tasks you'd take and in what order.

Don't start implementing until I confirm.
```

---

## 3. A single task

The workhorse prompt. Use one per session or per PR.

```
Task [ID]: [title] from docs/[workstream]/PROJECT-TRACKER.md.

Relevant spec sections:
- docs/[workstream]/PRD.md § [requirement IDs]
- docs/[workstream]/DESIGN.md § [component spec]
- docs/[workstream]/APP-FLOW.md § [flow section]

Requirements:
- Follow docs/[workstream]/PROJECT-RULES.md exactly, including the "what an AI coding
  agent must not do here" section.
- Implement loading, empty and error states as part of this task, not afterwards.
- No hardcoded colours. No invented content — use [TK] and tell me.
- Meet the Definition of Done in CLAUDE.md before you call it complete.

When you're finished, tell me:
- What you built and where
- Which requirement IDs it satisfies
- Anything you had to decide that the spec didn't cover
- Any [TK] markers you left and what I need to supply
- Confirmation that CI passes
```

---

## 4. Verification session

Run after each stage, in a **fresh session**. The context reset is the point — a model that just wrote the code is a poor reviewer of it.

```
You are reviewing, not building. Do not fix anything you find — report it.

Scope: [workstream] Stage [N], tracker tasks [IDs].

Read the specs first: docs/[workstream]/PRD.md, DESIGN.md, PROJECT-RULES.md,
and docs/_shared/00-FOUNDATION.md.

Then audit the implementation against them and produce a report with one row per
finding: severity (blocker / major / minor), what the spec requires, what the code
does, and the file and line.

Check specifically:
1. Every P0 requirement in the PRD — implemented, partial, or missing?
2. Hardcoded colours anywhere outside the token files
3. Components that should be Server Components but are 'use client'
4. Missing loading, empty or error states
5. Accessibility: semantic HTML, keyboard operability, focus management, contrast,
   real tables where the spec requires tables
6. Performance budget compliance for the route group
7. Content hardcoded in components that should come from the CMS
8. Any invented content — fabricated metrics, client names, standards codes, prices,
   clause references, statistics
9. Any [TK] marker that has been silently filled in with plausible-looking content
10. Deviations from DESIGN.md that weren't raised with me

End with a single verdict: does this stage pass its Definition of Done, yes or no.
Be harsh. A missed defect here becomes a defect in a live commercial website.
```

Item 9 deserves attention. The most damaging failure mode across a long build is a `[TK]` marker quietly replaced with something that looks real. A fabricated BS standard on the drawing matrix or an invented metric on a case study is unrecoverable reputationally, and it is exactly the kind of thing that survives a casual read.

---

## 5. Gate verification

For the nine hard gates. Run separately from feature verification.

```
Verifying hard gate: [name] from docs/[workstream]/IMPLEMENTATION-PLAN.md.

Read the gate definition and its pass criteria. Then:
1. State the pass criteria precisely, as written in the spec.
2. Tell me exactly what evidence is needed to demonstrate it.
3. Tell me what you can verify from the codebase and what needs me
   (external review, user testing, client data, solicitor sign-off).
4. Run whatever verification is possible in code and report the result.

Do not mark the gate passed on partial evidence. If it can't be fully demonstrated,
say what's missing.
```

---

## 6. Content load session

Stage 8, once the real portfolio and pricing exist.

```
Loading real content. docs/_shared/00-FOUNDATION.md §7 covers the seed policy.

1. Run the bulk import from [source] using scripts/import-projects.ts.
2. Replace all seed pricing with the confirmed figures in [source].
3. DELETE every seed record. Do not edit seed records into real ones — the import
   path and the seed path are separate for a reason.
4. Verify the production seed check passes with zero seed documents published.
5. Re-run the full accessibility and performance pass. Real portfolio imagery
   behaves differently from placeholder geometry — I expect LCP regressions on the
   image-heavy routes and I want them found now.
6. Report any content that failed to import, and why.
```

---

## 7. Prompt hygiene

Four habits that matter more than prompt wording:

**Name the file, not the concept.** "Follow docs/press/DESIGN.md §5 for the ownership module" beats "make it look premium." The specs exist to remove ambiguity; referencing them by section is what cashes that in.

**Ask for disagreement explicitly.** "Tell me anything in the spec you think is wrong before implementing" surfaces real problems. The specs were written before any code existed and some of them will be wrong.

**Never accept a summary as evidence.** "I've implemented the drawing matrix with full accessibility" is a claim. `axe` output is evidence. Ask for the evidence.

**Re-anchor after long sessions.** After several hours, ask it to re-read `PROJECT-RULES.md` before continuing. Drift is gradual and the rules files are short.
