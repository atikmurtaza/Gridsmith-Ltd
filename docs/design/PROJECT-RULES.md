# Project Rules — Gridsmith Design

Binding rules for anyone (human or AI coding agent) working on this codebase. Read fully before the first commit. Where this file conflicts with a general best practice, this file wins.

---

## 1. Non-negotiables

1. **Never hardcode a colour.** Every colour reads from a CSS custom property. CI lint rule `no-hardcoded-colors` fails the build on any hex, `rgb()`, or Tailwind colour utility outside the token files.
2. **Never publish a service page without pricing.** Enforced at the Sanity schema level. Do not add a bypass.
3. **Never render a confidential client's name.** The guard lives in the GROQ query. Do not move it into a component.
4. **Never invent a standards code.** BS/ISO/EN references come from `lib/cms/standards.ts` only. If a standard is not on the list, it does not go on the site until a qualified engineer adds it.
5. **Never ship an un-redacted or un-watermarked sample asset.** Schema validates both as hard-true.
6. **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.** CI greps every `'use client'` file for it.
7. **Never trust client-side validation.** Every input is Zod-validated in the Server Action.
8. **Never break the performance budget to add a feature.** If a feature costs more than budget, the feature changes or is cut.

## 2. Code conventions

```
components/primitives/     PascalCase files, one component per file, zero business logic
components/divisions/design/  Design-only compositions
lib/                       camelCase files, pure functions, fully typed
app/(design)/design/       route segments, kebab-case
```

- **TypeScript strict.** `any` is banned. `unknown` plus a type guard is the escape hatch.
- **Server Components by default.** `'use client'` requires a one-line comment stating why. Acceptable reasons: interactivity requiring state, browser API access, third-party client library. Not acceptable: "easier".
- Named exports for everything except Next.js route files.
- No default exports from `lib/` or `components/`.
- No barrel files (`index.ts` re-exports) — they defeat tree-shaking.
- Props interfaces named `ComponentNameProps`, colocated above the component.
- No inline styles except dynamic values that genuinely cannot be a class.

## 3. Styling rules

- Tailwind utilities for layout and spacing; CSS custom properties for all colour, type and radius.
- `--radius-default` on this division is `0`. **Do not introduce rounded corners.** If something "looks harsh", the fix is spacing or contrast, not radius.
- No `box-shadow` beyond `--shadow-2`. Depth is expressed through 1px borders and background steps.
- No arbitrary Tailwind values (`w-[437px]`). Use the scale. If the scale is wrong, change the scale.
- Every interactive element has a visible `:focus-visible` state. Removing focus outlines without a replacement is a build failure.
- Mobile-first. Write the small-screen rule, then add breakpoints upward.

## 4. Content and data rules

- All content from Sanity. **No hardcoded marketing copy in components.** A string a marketer might want to change belongs in the CMS.
- All CMS queries typed via generated types. No untyped GROQ results.
- Filter state lives in the URL, never only in React state.
- Never fetch in a client component when a server component can fetch and pass down.
- ISR revalidation via webhook on Sanity publish, not aggressive time-based revalidation.

## 5. Forms and leads

- Server Actions only. No API routes for form submission.
- Zod schema is the single source of truth; the TypeScript type is inferred from it, never written separately.
- On submit failure: preserve every field, show a retry, surface a direct email address. **Never lose a user's input.**
- Success is a dedicated route, not a toast — it must be trackable, shareable and back-button-safe.
- Budget is always banded radio options. Never a free-text or numeric input.
- Honeypot + Turnstile. No visible CAPTCHA.
- Lead notification is fire-and-forget to Slack, awaited for Resend, and **must not block the user's success response**.

## 6. Accessibility rules

- WCAG 2.2 AA is a floor, not a target.
- Semantic HTML first. `<div>` with a click handler is a build failure — use `<button>`.
- The drawing matrix is a real `<table>` with `<caption>` and `<th scope>`. It is never a grid of divs.
- Filter results announce via `aria-live="polite"` with a count.
- Focus is managed on route change and on form error (move to first invalid field).
- All imagery has meaningful `alt`. Decorative images get `alt=""` and `role="presentation"`.
- Test with keyboard only and with a screen reader before marking any UI task `DONE`.

## 7. Performance rules

| Rule | Enforcement |
|---|---|
| LCP ≤2.0s, INP ≤200ms, CLS ≤0.05 | Lighthouse CI blocks merge |
| Marketing route JS ≤120KB gz | `check-bundle-size` blocks merge |
| Max 2 font families, 4 weights | Manual review |
| Every image has explicit dimensions | ESLint rule |
| Hero media ≤120KB, `priority` | Manual review |
| No above-the-fold entrance animation | Manual review — it delays LCP |
| No client-side data fetching on first paint | Manual review |

## 8. Motion rules

- `transform` and `opacity` only. Animating `height`, `width`, `top`, `left` or `margin` is a build failure.
- Scroll reveals fire once, threshold 0.15, 500ms, 60ms stagger.
- Prohibited outright: parallax, scroll-jacking, cursor followers, animated number counters, page-transition loaders.
- `prefers-reduced-motion` is handled globally in `tokens.css`. Do not re-implement it per component.

## 9. Git and review

- Branches: `feat/`, `fix/`, `chore/`, `content/`.
- Conventional commits: `feat(design): add drawing matrix filtering`.
- No direct commits to `main`.
- PRs must include: what changed, why, a screenshot or recording for any visual change, and confirmation that CI is green.
- Any PR touching the token files or shared primitives requires review — it affects all three divisions.

## 10. Definition of Done

A task is `DONE` only when all of these are true:

- [ ] Works on mobile (375px), tablet (768px), desktop (1440px)
- [ ] Keyboard navigable end to end
- [ ] Screen reader tested for any interactive component
- [ ] axe reports zero violations
- [ ] Loading, empty and error states implemented
- [ ] Zero TypeScript errors, zero ESLint warnings, zero console output in production
- [ ] Lighthouse still ≥95 performance on affected routes
- [ ] Content sourced from CMS, not hardcoded
- [ ] Analytics events fire correctly and exactly once
- [ ] Reviewed against the relevant section of `DESIGN.md`

"It works on my machine at 1440px in Chrome" is not Done.

## 11. What an AI coding agent must not do here

- Do not add a UI library (shadcn, MUI, Chakra). Primitives are hand-built to hold the premium direction. Importing a component library defeats the entire positioning (R4.6 — this site *is* the case study).
- Do not add dependencies without checking bundle impact against the budget.
- Do not "improve" the visual design mid-implementation. Build what `DESIGN.md` specifies. Raise disagreements as an issue.
- Do not soften the aesthetic. Zero radius, hairline borders and high contrast are deliberate (R5). They will feel stark during implementation. That is correct.
- Do not generate placeholder marketing copy that reads as real. Use obvious `[TK]` markers so nothing fake ships.
- Do not invent case study metrics, client names, statistics, or credentials. Ever. If a number is unknown, mark `[TK]` and flag it.
- Do not add stock photography.
- Do not implement a client portal, live markup tool, or checkout — explicitly out of scope (PRD §8).
- Do not skip the states. Loading and empty states are the difference between a premium site and a demo.

## 12. Escalation

Stop and ask rather than guess when:
- A pricing figure is unknown
- A standards code is not on the controlled list
- A case study metric cannot be verified
- A design decision in `DESIGN.md` appears to conflict with an accessibility requirement — **accessibility wins, then raise the conflict**
- A performance budget cannot be met without cutting a P0 requirement
