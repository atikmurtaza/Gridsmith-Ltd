# Verification subagents

Five read-only reviewers. Copy `.claude/` to the repository root alongside `CLAUDE.md`.

**Run them in a fresh context at every stage boundary.** A model that just wrote the code
is a poor reviewer of it — the reset is the point.

| Agent | Finds |
|---|---|
| `spec-compliance` | P0 requirements not implemented |
| `content-integrity` | **Fabricated content — the highest-consequence failure** |
| `design-conformance` | Deviations from DESIGN.md |
| `accessibility-audit` | WCAG 2.2 AA violations |
| `rules-compliance` | Violations of PROJECT-RULES.md and the CLAUDE.md non-negotiables |

They report; they do not fix. Triage the findings yourself, then hand them back to the
building agent as a task. Full rationale in `docs/_shared/04-AGENT-STRATEGY.md`.

Run `content-integrity` weekly across the whole codebase regardless of stage.
