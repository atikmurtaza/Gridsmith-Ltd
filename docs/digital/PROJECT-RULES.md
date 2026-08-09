# Project Rules — Gridsmith Digital

Binding rules for anyone (human or AI coding agent) working on the Digital route group. Where this conflicts with general best practice, this file wins.

**Read this first:** Digital sells software craft. This codebase is the primary sales artifact. A shortcut taken here is not a technical debt entry — it is a visible defect in the product being sold (R4.6, persona P4).

---

## 1. Non-negotiables

1. **Lighthouse 100/100/100 on every Digital template.** Not 95. This is a launch gate and a maintenance obligation. If a feature cannot be built within it, the feature changes.
2. **The estimator result is never gated behind an email.** Do not add a "enter your email to see your price" step, however much it appears to lift a metric. It destroys the trust the tool exists to create.
3. **Never trust a client-computed price.** Every persisted estimate is recalculated server-side from validated input.
4. **Never publish an estimate range you cannot defend.** If calibration (V-05) fails, the estimator does not ship.
5. **Never soften the exclusions.** "What we don't do" and every `excludes` array are P0 trust requirements, not copy that needs warming up.
6. **Never mark a stack item `lockInRisk: none` when it isn't.** An all-`none` stack page is not credible and will be read as marketing.
7. **Never display stale or fabricated performance data.** The vitals badge hides rather than lies.
8. **Never promise ownership terms the client contract does not grant.**
9. **Never hardcode a colour.** Tokens only. CI enforced.
10. **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.**

## 2. Code conventions

```
components/divisions/digital/   Digital-only compositions
lib/estimate/                  Pure calculation, no side effects, no imports from components
app/(digital)/digital/           Route segments, kebab-case
```

- TypeScript strict. `any` banned. `unknown` + type guard is the escape hatch.
- Server Components by default. `'use client'` requires a justifying comment.
- **`lib/estimate/calculate.ts` must remain a pure function** — no fetch, no Date.now(), no randomness, no React imports. It is unit tested to 100% branch coverage and runs identically on client and server. Breaking purity breaks the server-side recalculation guarantee.
- Named exports. No barrel files. No default exports outside route files.
- Zod schemas are the source of truth; TS types are inferred with `z.infer`, never hand-written alongside.

## 3. Styling rules

- `--radius-default` is `2px`. Do not exceed it.
- **`--line-strong` is 2.1:1 against the canvas.** It may never be the sole carrier of information — no selected states, error states, or status indicators expressed by border colour alone. Always pair with a glyph, a background change, or text.
- Mono is the display face. **Hard limit: 6 words in any `--text-3xl` mono heading.** Longer headings drop to Inter.
- No arbitrary Tailwind values. Use the scale.
- Depth via 1px borders and background steps. No shadow beyond `--shadow-2`.
- Every interactive element has a visible `:focus-visible` state.

## 4. Estimator rules

These are specific and non-negotiable because this component carries the division's conversion strategy.

- Every step must be a real `<fieldset>` with a `<legend>`. Not a div with a heading.
- Every step must offer a "not sure" option that widens the range and lowers `confidence` — never blocks progress.
- Sliders, if used, must have a paired numeric input and full arrow-key support. Drag-only inputs are a build failure.
- Progress must be announced via `aria-live="polite"`.
- The result must be announced on completion and receive focus.
- The static SSR pricing table must render before hydration and must not shift when the island mounts (CLS ≤0.02).
- **Confidence is expressed in words** ("Medium confidence"), never percentages. False precision is the failure mode.
- Ranges are formatted `£24,000 — £38,000` with an em dash.
- Prices are never animated or counted up.
- Exclusions render at the same visual weight as the price.
- Every completion and abandonment logs, regardless of conversion.
- `config_version` is stamped on every persisted estimate.

## 5. Content and data rules

- All content from Sanity. No hardcoded marketing copy.
- `estimatorConfig` lives in the CMS so pricing can be retuned without a deploy. Do not move any pricing constant into code.
- All CMS queries typed via generated types.
- Filter state in the URL, including the stack filter.
- ISR via webhook on publish.

## 6. Forms and leads

- Server Actions only.
- On failure: preserve every field, offer retry, show a direct email address.
- Success is a dedicated route, not a toast.
- Budget always banded.
- Honeypot + Turnstile. No visible CAPTCHA.
- Arriving from an estimate collapses the flow to 2 steps — do not re-ask what the estimate already answered.

## 7. Accessibility rules

- WCAG 2.2 AA is the floor.
- Semantic HTML first. A `<div>` with a click handler is a build failure.
- The estimator is the highest accessibility risk on the entire group site. It gets a dedicated keyboard-only pass and a dedicated screen reader pass before it is marked `DONE`.
- Code samples need `aria-label` and must never be the only means of conveying information.
- Focus managed on route change and on form error.

## 8. Performance rules

| Rule | Enforcement |
|---|---|
| Lighthouse 100/100/100 | LHCI blocks merge |
| LCP ≤1.6s, INP ≤150ms, CLS ≤0.02 | LHCI blocks merge |
| Digital route JS **delta ≤15KB gz** above the framework floor — the tightest in the programme | `check-bundle-size` blocks merge |
| `/digital/estimate` JS **delta ≤40KB gz** | `check-bundle-size` blocks merge |
| No client-side fetch on first paint | Manual review |
| No third-party embeds | Manual review — booking is a link, not an iframe |
| Every image explicit dimensions | ESLint |

Digital's budget is stricter than the group baseline. This is intentional and is not negotiable down "just for this feature".

## 9. Motion rules

- `transform` and `opacity` only.
- Scroll reveal is `opacity` only — no translate. Digital reveals more quietly than Design.
- Height changes use the `grid-template-rows: 0fr → 1fr` technique, never `height: auto` transitions.
- Prohibited: parallax, scroll-jacking, animated counters (especially on prices), typewriter effects, cursor followers, page-transition loaders.

## 10. Git and review

- Conventional commits: `feat(digital): add estimator confidence indicator`.
- No direct commits to `main`.
- Any PR touching `lib/estimate/` requires a second reviewer and passing unit tests. This code determines what the business quotes.
- Any PR touching shared tokens or primitives requires review — it affects all three divisions.

## 11. Definition of Done

- [ ] Works at 375px, 768px, 1440px
- [ ] Keyboard navigable end to end
- [ ] Screen reader tested for any interactive component
- [ ] axe zero violations
- [ ] Loading, empty and error states implemented
- [ ] Zero TS errors, zero ESLint warnings, zero production console output
- [ ] **Lighthouse still 100/100/100** on affected routes
- [ ] Content from CMS
- [ ] Analytics events fire once, correctly
- [ ] Reviewed against `DESIGN.md`
- [ ] For estimator work: unit tests pass, coverage maintained, calibration unaffected

## 12. What an AI coding agent must not do here

- Do not add a UI library. Primitives are hand-built.
- Do not add a charting library for the estimator breakdown. It is data rows and CSS bars. A charting library is 40KB+ for something that needs zero.
- Do not add an animation library for the estimator steps. CSS is sufficient.
- Do not "make the estimator friendlier" by adding illustrations, mascots, or celebratory animations on completion. The buyer is making a budget decision.
- Do not fabricate estimator base prices, stack lock-in assessments, case study metrics, client names, or performance figures. If unknown, mark `[TK]` and escalate.
- Do not invent contract clause references for the ownership guarantee. They must be real clauses from the real contract.
- Do not add stock photography, device mockups on gradients, or illustrations of people at laptops.
- Do not implement a client portal, dashboard, login, or checkout — out of scope (PRD §8).
- Do not weaken the exclusions, the lock-in disclosures, or the confidence indicator to make the site sound more confident. Every one of these was specified *because* buyers screen for overconfidence (R6-Digital).

## 13. Escalation

Stop and ask rather than guess when:
- A base price or multiplier is unknown
- Calibration data is insufficient
- A lock-in risk assessment is uncertain
- A contract clause cannot be located
- A design decision conflicts with accessibility — **accessibility wins, then raise it**
- Lighthouse 100 cannot be met without cutting a P0 requirement
