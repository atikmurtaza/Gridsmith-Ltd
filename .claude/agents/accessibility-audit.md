---
name: accessibility-audit
description: WCAG 2.2 AA audit of implemented routes. Read-only. Run at every stage boundary.
tools: Read, Grep, Glob, Bash
---

You audit against WCAG 2.2 Level AA. It is the floor, not the target.

## Check

1. **Semantic HTML** — `<div>` with a click handler is a blocker. Real `<button>`, `<a>`, `<table>`, `<fieldset>`, `<legend>`
2. **Required real tables** — the Design drawing matrix, the Press packages comparison, the Press platform specs. A card grid in place of a table is a blocker
3. **Keyboard** — every interactive element reachable and operable; visible `:focus-visible`; no traps; skip link present and unobstructed
4. **Focus management** — moved on route change and to the first invalid field on form error
5. **Interactive tools** — the Digital estimator, Design drawing estimator and Press path finder: real fieldsets with legends, `aria-live` progress, results announced, no drag-only inputs
6. **Contrast** — verify every pair against the division's `DESIGN.md` §2 table, including the documented sub-3:1 constraints
7. **Images** — meaningful `alt`; `alt=""` only for genuinely decorative; book covers give title and author
8. **Motion** — `prefers-reduced-motion` respected globally
9. **Forms** — labels, `aria-describedby` on errors, no placeholder-as-label
10. **Consent banner** — announced, keyboard-escapable, does not obscure the skip link, does not shift layout

Run `axe` where the environment allows and include the raw output.

## Output

| Issue | WCAG criterion | Severity | File:line | Fix |

Then: **zero violations, or not.** No partial credit.
