# Project Rules — Gridsmith Press

Binding rules for anyone (human or AI coding agent) working on the Press route group. Where this conflicts with general best practice or with conversion optimisation orthodoxy, this file wins.

**Read this first:** Press sells to people the market has warned to be suspicious of companies exactly like this one, and to people (memoir and legacy authors) who can be financially harmed by aggressive selling. Several rules below will look like they suppress conversion. They are the reason this division converts at all.

---

## 1. Non-negotiables

1. **No urgency, scarcity, or countdown mechanics. Ever.** No "3 slots left", no expiring offers, no timers. (ETH-01)
2. **No claims or implications about sales, bestseller status, or income.** Not in copy, not in testimonials, not in imagery, not in case study metrics. (ETH-02)
3. **Every package shows a total price.** There is no "POA" path and the schema will not permit one. (ETH-03, FR-P06)
4. **The Path Finder must be able to recommend against Gridsmith.** The self-service and not-ready outcomes are functional requirements with schema-level enforcement. Do not remove them, do not add CTAs to them, do not tune the rules so they stop firing. (ETH-04)
5. **The commercial expectations statement appears before pricing.** Do not move it down the page. (ETH-05, ETH-07)
6. **No book on the shelf without recorded author consent and at least one working retailer link.** (ETH-06, FR-P08)
7. **No affiliate links on retailer URLs.** Monetising the verification path corrupts its purpose.
8. **The vanity-press FAQ is first and open by default.** Do not collapse it, reorder it, or soften the answer.
9. **Never hardcode a colour.** Tokens only.
10. **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.**

## 2. Code conventions

```
components/divisions/press/   Press-only compositions
lib/path/                     Pure recommendation logic, no side effects
app/(press)/press/            Route segments, kebab-case
```

- TypeScript strict. `any` banned.
- Server Components by default. `'use client'` requires a justifying comment.
- **`lib/path/recommend.ts` must be pure** — no fetch, no randomness, no dates. Unit tested with all six outcomes covered.
- Named exports. No barrel files.
- Zod schemas are the source of truth; types inferred with `z.infer`.

## 3. Styling rules

- **Body copy minimum 17px, leading 1.7, measure 52ch.** This is a serif division; smaller or tighter is a legibility failure, and legibility is part of the credibility claim.
- **`--ink-subtle` may never be used below 17px** (4.9:1 on the warm canvas).
- **`--line-strong` is 2.3:1** and may never carry information alone. Selected and error states need a glyph or background change as well as a border.
- Buttons are **sentence case**, never uppercase. Uppercase CTAs read as sales pressure here.
- `--radius-default` is `2px`. Do not exceed.
- No shadow beyond `--shadow-1` on book cards.
- Every interactive element has a visible `:focus-visible` state.

## 4. Content and data rules

- All content from Sanity. No hardcoded marketing copy.
- Package prices, revision rounds, exclusions and `notFor` are schema-required. Do not add code paths that render around a missing value — if it's missing, the content is wrong, not the component.
- Every Press case study must reference a real `book`. A case study with no verifiable title does not ship.
- `linkStatus` and `lastChecked` are written by the cron only. Never editable in the CMS.
- Filter state in the URL.

## 5. Books shelf rules

- Book covers render in a **fixed 2:3 container with explicit dimensions**. Zero CLS is a launch gate and the shelf is the route most likely to break it.
- First 12 covers eager with `priority`; the rest lazy.
- **No hover overlay on a cover.** Obscuring a book cover to reveal a button is the wrong instinct in a division whose product is book covers.
- Retailer links: new tab, `rel="noopener noreferrer"`, fire `retailer_click`, no affiliate parameters.
- **A broken link renders as plain grey text with a short unavailable note — never as a dead hyperlink.** A dead link on the verification page is a legitimacy failure.
- `alt` text gives title and author. Never `alt="book cover"`.

## 6. Path Finder rules

- Five questions, each a real `<fieldset>` with a `<legend>`.
- Options render as bordered rows, not tiles. It should read as a form, not a quiz game.
- Progress announced via `aria-live="polite"`; result announced and focused on completion.
- **Outcomes E (self-service) and F (not ready) render with no CTA button.** Guidance and an external link only. This is enforced by `showCta: false` in the config and must also be defended in the component — do not add a fallback CTA.
- Every completion and abandonment logs, including `is_gridsmith_outcome`.
- The static SSR decision table must render all six outcomes and their criteria without JavaScript.
- `config_version` stamped on every result.

## 7. Forms and leads

- Server Actions only.
- **The memoir branch cannot submit without `expectationsAcknowledged: true`.** Enforced in the Zod schema, not just the UI.
- **Manuscripts are accepted as links, not uploads.** Do not implement file upload for manuscripts — holding unpublished IP without a proper handling regime is out of scope for v1 and is a deliberate decision, not an oversight.
- On failure: preserve every field, retry, direct email fallback.
- Success is a dedicated route, not a toast. **No confetti, no celebration animation** (ETH-01).
- Budget always banded.
- The cross-division prompt appears on the confirmation screen only. Never mid-funnel.

## 8. Accessibility rules

- WCAG 2.2 AA is the floor.
- The packages comparison is a **real `<table>`** with `<caption>` and `<th scope>`. It is comparative data; a card grid destroys the row/column relationships screen reader users need.
- Semantic HTML first. A `<div>` with a click handler is a build failure.
- Serif type at the specified sizes — do not reduce to fit a layout.
- Focus managed on route change and on form error.
- Margin notes must be associated with the content they annotate (`aria-describedby`) and must not be visually orphaned on mobile.

## 9. Performance rules

| Rule | Enforcement |
|---|---|
| LCP ≤2.0s, INP ≤200ms, CLS ≤0.05 | LHCI blocks merge |
| Press route JS **delta ≤20KB gz** above the framework floor — covers books shelf and filters | `check-bundle-size` |
| `/press/path-finder` JS **delta ≤40KB gz** | `check-bundle-size` |
| Book covers: AVIF, fixed aspect, `sizes` tuned | Manual review |
| Every image explicit dimensions | ESLint |

## 10. Motion rules

- `transform` and `opacity` only.
- Scroll reveal is `opacity` only, 500ms, no translate.
- **Prohibited:** page-turn effects, book-opening animations, parallax, scroll-jacking, animated counters, cursor followers, and any celebratory animation on submission.

## 11. Git and review

- Conventional commits: `feat(press): add retailer link checker`.
- No direct commits to `main`.
- **Any PR touching `lib/path/`, the ethics-related schema validators, or the expectations/rights copy requires explicit sign-off from Atik.** These encode commitments, not features.
- Any PR touching shared tokens or primitives requires review — it affects all three divisions.

## 12. Definition of Done

- [ ] Works at 375px, 768px, 1440px
- [ ] Keyboard navigable end to end
- [ ] Screen reader tested for any interactive component
- [ ] axe zero violations
- [ ] Loading, empty and error states implemented
- [ ] Zero TS errors, zero ESLint warnings, zero production console output
- [ ] Lighthouse ≥95 performance on affected routes; CLS ≤0.05 on the books shelf
- [ ] Content from CMS
- [ ] Analytics events fire once, correctly
- [ ] Reviewed against `DESIGN.md`
- [ ] **Checked against the ethical requirements in `PRD.md` §5**

## 13. What an AI coding agent must not do here

- Do not add a UI library.
- Do not pre-tick, bundle, or restyle the early-start checkbox to increase take-up. It is a statutory consent mechanism (CCR 2013), not a conversion element. Bundling it with terms acceptance invalidates it.
- Do not add urgency, scarcity, social-proof counters ("14 authors enquired this week"), exit-intent popups, or chat widgets that open unprompted. Every one of these is a vanity-press signal.
- Do not add celebratory micro-interactions to form completion.
- Do not "improve conversion" by gating the Path Finder result, removing the honest outcomes, or moving the expectations statement below the fold. If a conversion argument seems to justify one of these, raise it — do not implement it.
- Do not fabricate book titles, ISBNs, retailer links, author names, testimonials, package prices, or case study details. Ever. Mark `[TK]` and escalate.
- Do not invent contract clause references for the rights page. They must be real clauses.
- Do not add stock photography of authors, writers, coffee cups, typewriters, or quills.
- Do not add "bestseller", "award-winning", or sales-figure language anywhere.
- Do not implement manuscript upload, an author portal, royalty dashboards, or e-commerce — out of scope (PRD §8).
- Do not soften `notFor`, `excludes`, or the "what we are and are not" module.

## 14. Escalation

Stop and ask rather than guess when:
- A package price, revision count, or exclusion is unknown
- Author consent for a title cannot be confirmed
- A rights or contract clause cannot be located
- A retailer link cannot be verified
- A conversion optimisation appears to conflict with an ethical requirement — **the ethical requirement wins, then raise it**
- A design decision conflicts with accessibility — **accessibility wins, then raise it**
