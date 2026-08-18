# Project Rules — Gridsmith Master Layer

Binding rules for anyone (human or AI coding agent) working on the root route group and the shared chrome. **These rules also govern the shared foundation**, so they apply to code that all four route groups depend on. Where this conflicts with a division rules file, this file wins for shared code; the division file wins inside that division's components.

---

## 1. Non-negotiables

1. **The master layer has no colour of its own.** `--accent` is ink. Do not introduce a fourth brand colour. Division accents appear only on division cards, division badges and the footer switcher.
2. **`--accent-design` (amber) is 2.16:1 on white** — the figure check:contrast measures. It may never be text, never a sole state indicator, never a link colour on master pages. Rules and badge borders only.
3. **Division routing must sit above the second viewport** on every breakpoint. This is the founder's specialist-discovery requirement and it is testable.
4. **"More than one" and "Not sure" are never styled as secondary.** They are the highest-value conversion path.
5. **Case studies live at `/work/[slug]` only.** Division work routes are filtered indexes that link here. Do not create division-level detail routes.
6. **No non-essential cookie, script or pixel fires before consent.** Not loaded-and-suppressed — not injected.
7. **Accept and Reject on the consent banner are visually identical.** Same size, same weight, same colour treatment. Making reject harder is a dark pattern and invalidates consent.
8. **The response commitment renders from `companyDetails.responseCommitment`.** Never hardcoded, never paraphrased, never made faster. Current value: *as soon as we can, and always by the end of the next business day.*
9. **Statutory disclosure appears on every page.** Legal name, company number, place of registration, registered office. It is a legal requirement, not a footer decoration.
10. **No seed content in production.** The build check is not to be bypassed, weakened, or excluded from a deploy pipeline.
11. **No legal page ships without `solicitorApproved: true`.**
12. **Never hardcode a colour.** Tokens only.

## 2. Code conventions

```
app/(marketing)/            master routes
components/chrome/          header, footer, consent, division switcher
components/primitives/      shared, theme-agnostic, used by all four groups
lib/company/                companyDetails accessors
lib/consent/                consent state and Consent Mode bridge
scripts/                    seed, import, image ingest, prod checks
redirects/legacy.json       generated, version-controlled
```

- TypeScript strict. `any` banned.
- Server Components by default; `'use client'` requires a justifying comment. The consent banner and `/work` filters are the only expected client components at master level.
- Named exports. No barrel files.
- **Any change to `components/primitives/` or `styles/tokens.css` requires review** — it affects all four route groups.

## 3. Shared foundation rules

- Primitives consume tokens only. **No primitive may contain a hardcoded colour or a division-specific assumption.** A primitive that behaves differently for one division is a division component, not a primitive.
- `data-division` is set server-side in each route group layout. Never set it on the client — the theme must be correct in the first paint.
- Adding a token means adding it to all four themes, or to the base layer. A token defined in one theme only is a bug.

## 4. Content and data rules

- All content from Sanity. No hardcoded marketing copy anywhere.
- `processStep.title` must be one of the canonical six. The validator enforces it; do not add a bypass.
- `continuityExample.verified` must be true. **Do not create an illustrative continuity example.** The continuity principle is the group's entire commercial argument; inventing evidence for it is the most damaging content act available on this site.
- `isCrossDivision` is derived from `divisions.length`, never hand-set.
- Legal clause `anchorId` values are stable. Renumbering requires a version bump and a redirect for the old anchor, because contracts cite them.

## 5. Seed content rules

- Seed records carry `isSeed: true`, set by the script only.
- **Seed client names use an obviously fictional convention.** Never a real company, never a plausible-but-unverifiable one.
- **No fabricated engineering drawings, book covers, or software screenshots.** Abstract geometric placeholders at correct aspect ratios.
- Every seed price renders with a visible `INDICATIVE` badge.
- **Every seed metric renders with a `[SEED]` prefix and zeroed digits** — `[SEED] 00%`,
  `[SEED] 00 days`. Never a plausible figure. `project.metrics` requires at least one
  quantified metric, so seed case studies necessarily carry invented numbers; the marker
  is what stops a human reading staging mistaking one for a real outcome. The `isSeed`
  exemption in the `content-integrity` agent is a separate mechanism serving a separate
  purpose, and neither replaces the other.
- Seed records are **deleted and replaced**, never edited into real content.
- If the production build check fails, fix the content. Do not disable the check.

## 6. Consent and privacy rules

- Default deny for `analytics_storage`, `ad_storage`, `functionality_storage`.
- The Design division's `gs_design_track` preference cookie is gated on `functionality_storage`.
- **Lead capture works fully regardless of consent state.** Processing an enquiry someone submitted is contract/legitimate interest, not analytics. Never block a form on consent.
- `consent_events` stores a random consent id, the choice, the categories and the policy version — **no personal data**. Do not add IP, email, or a raw user agent.
- No third-party CMP. It would break the performance budgets and Digital's 100/100/100 gate.
- No PII in analytics events, URLs, or logs — across all four route groups.

## 7. Accessibility rules

- WCAG 2.2 AA is the floor.
- The consent banner: announced on appearance, keyboard-escapable, must not obscure the skip link, must not shift layout.
- Division cards are `<a>` elements, not click-handled divs.
- Legal pages need a table of contents, correct heading hierarchy, and an anchor on every clause.
- Focus managed on route change and on form error.

## 8. Performance rules

| Rule | Enforcement |
|---|---|
| Homepage Lighthouse performance ≥98 | LHCI **desktop axis** blocks merge, median of 3 |
| LCP ≤1.8s, CLS ≤0.03 | LHCI **mobile axis**, asserted directly on a 4G throttle. Both were named here and asserted nowhere until the Epic A audit |
| INP ≤200ms | **Not assertable in CI** — field metric. TBT ≤200ms is the lab proxy |
| Master routes JS **delta ≤15KB gz** above the framework floor, **including the consent banner** | `check-bundle-size` |
| Consent banner ≤8KB gz | `check-bundle-size` — **as a reservation, not a measurement.** No banner exists, so nothing can weigh one. What is asserted, from `M-06`, is that `/`'s measured delta plus this 8KB fits the 15KB budget. Until `M-06` this row named an enforcement that did not exist: the gate printed the literal `8.0KB` and checked nothing |
| Framework floor reported separately; re-baselining it is its own commit | `check-bundle-size` |
| No hero video, no third-party embeds | Manual review |

**Lighthouse runs on two axes — FOUNDATION §8.** Desktop asserts the category scores (the
craft claim a prospect runs); mobile asserts Core Web Vitals directly on a 4G throttle and
deliberately does **not** assert the performance score, because that score is a weighted
curve that moves between Lighthouse versions. Nothing was lowered when the two were split.

**INP is not assertable in CI.** It is a field metric and a Lighthouse navigation run does
not produce one; this file previously named LHCI as its enforcement, which was never
possible. TBT at the same ceiling is the lab proxy. See `_shared/01-VALIDATION-REPORT.md` §11.

**The LCP ceilings here are measured, not provisional.** CI run #7, `ubuntu-latest`, Node 24,
median of 3, devtools throttling: 1519–1530ms across the four routes. The 1441ms figure this
paragraph used to quote was the superseded dev-machine number, and the sentence stayed after
`Q-M16` was closed and `_shared/00-FOUNDATION.md` §8 and `05-HANDOVER.md` took the budgets
off provisional.

**What remains open is durability, not the number.** Every figure above is what an empty
page costs — one `h1`, 425 B of route JS. Hero imagery, work grids and book covers all
produce a larger and later LCP element. Re-measure at the first Stage 3 route, not at
`H-01`, by which point the remedy is cutting a page feature to pay for a floor. `Q-M16`.


## 9. Motion rules

- `transform` and `opacity` only.
- **No page transition between route groups.** The theme change is the transition; a fade on top makes it feel slower.
- Prohibited: parallax, scroll-jacking, cursor followers, animated counters, hero video, entrance animation above the fold.

## 10. Definition of Done

- [ ] Works at 375px, 768px, 1440px — `npm run check:responsive`, not a manual look
- [ ] Keyboard navigable end to end
- [ ] Screen reader tested for any interactive component
- [ ] axe zero violations
- [ ] Loading, empty and error states implemented
- [ ] Zero TS errors, zero ESLint warnings, zero production console output
- [ ] Lighthouse ≥98 performance on affected master routes
- [ ] Content from CMS
- [ ] Analytics events fire once, correctly, and only after consent
- [ ] Statutory disclosure still present
- [ ] No seed content leaked into a production-flagged build
- [ ] Reviewed against `DESIGN.md`

## 11. What an AI coding agent must not do here

- Do not add a UI library, a CMP, an animation library, or a charting library.
- Do not invent a master brand colour, a tagline, a mission statement, a founding year, an employee count, a client count, or an office location. Every one of these is a factual claim about a real company. Mark `[TK]` and escalate.
- Do not write the continuity example. It must come from real project records.
- Do not write the "when to use a specialist instead" section. Those are commercial decisions only the founder can make.
- Do not fabricate a company number, VAT number, ICO registration, insurance details, or registered office. These are statutory. `[TK]` and escalate.
- Do not draft or amend legal clauses. The drafts in `_legal/` are a starting point for a solicitor, not a source to extend.
- Do not soften the consent banner's reject option, add a "not now" that defers rather than rejects, or re-prompt a user who has rejected.
- Do not promise a faster response time anywhere, in any template, in any microcopy.
- Do not add stock photography, handshakes, offices, or abstract network graphics.
- Do not build a client portal, careers ATS, or site search — out of scope (PRD §9).
- Do not skip the master layer to ship a division faster. The header, footer, consent layer and canonical case study route all live here; skipping it means rebuilding all three divisions.

## 12. Escalation

Stop and ask rather than guess when:
- A statutory detail (company number, registered office, insurance, ICO) is unknown
- A legal clause needs interpretation or amendment
- A continuity example cannot be verified against real records
- The honest-limits content is undecided
- A design decision conflicts with accessibility or with consent compliance — **compliance and accessibility win, then raise it**
- A performance budget cannot be met without cutting a P0 requirement
