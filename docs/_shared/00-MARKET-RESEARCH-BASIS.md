# Market Research Basis — Gridsmith Division Websites

Evidence layer. Every conversion and UX decision in the three division specs traces back to a numbered finding here. The validation report (`01-VALIDATION-REPORT.md`) checks each spec against these.

---

## R1 — Conversion benchmarks

| Finding | Figure | Source |
|---|---|---|
| Median B2B website conversion | 2.9% (1.7% form, 1.2% call) | Ruler Analytics, 2026 |
| B2B **professional services** visitor-to-lead | 3–6% typical; 6–10% top quartile | First Page Sage / Ruler, 2026 |
| All-industry **landing page** median | 6.6% | Unbounce, 57M+ conversions |
| Gap between median and top-decile | ~4.9x | Krishaweb, 2026 |
| Desktop vs mobile conversion | 5.06% vs 2.49% | 2026 benchmark data |
| AI-search referral traffic (ChatGPT/Perplexity/Gemini) | 3.49% vs 2.86% organic — **22% premium** | Digital Applied, 2026 |
| Organic search conversion, professional services | ~5.0% | Martal, 2026 |

**Implications adopted across all three specs:**
- **Target: 4% visitor-to-lead minimum, 6% stretch.** Anything under 2.5% is a failed build, not a slow start.
- Mobile converts at half of desktop but carries most traffic → mobile is a **first-class conversion surface**, not a responsive afterthought. Sticky mobile CTA is mandatory.
- AI-search traffic is the highest-value organic segment and must be tracked separately from day one. This directly justifies the structured-data and machine-readability requirements in every tech spec.

## R2 — Speed and performance as conversion levers

| Finding | Figure | Source |
|---|---|---|
| Target load time | Under 2.5s | 2026 CRO consensus |
| Sub-1-second load sites | Up to **5x** conversion | Success Knocks, 2026 |
| Speed-to-lead: contact within 5 min vs 30 min | **21x** more likely to qualify | Wonderchat, 2026 |

**Implications adopted:** hard performance budgets in every tech spec (LCP ≤ 2.0s, INP ≤ 200ms, CLS ≤ 0.05, JS ≤ 120KB gzipped on marketing routes). Instant lead *notification* to Slack + email is a **launch-blocking requirement**.

**Deviation recorded:** the founder has set the human response commitment at *as soon
as possible, and always by the end of the next business day*. This knowingly forfeits
most of the 21x speed-to-lead benefit. It is the right call while the rota cannot be
staffed — an unmet promise is worse than a modest one — but it is a real cost and
should be revisited. All site copy must state the next-business-day commitment; no
template may imply a faster response.

## R3 — Pricing transparency

| Finding | Figure | Source |
|---|---|---|
| Lead form submission uplift when pricing is transparent | **+20–35%** | Rework, 2026 |
| Agency sites adding a pricing calculator | conversion from <2% to >11% in reported studies | SitePoint, 2026 |
| Buyers penalise vague scope and unexplained fees | Consistent red flag across B2B and publishing sources | Multiple, 2026 |

**Implications adopted:** all three sites publish **pricing architecture** (model + from-price + what changes the number). Digital and Press get interactive estimators. Design gets a per-drawing/per-sheet/day-rate table for the technical track. No "Contact us for pricing" anywhere.

## R4 — Trust architecture (what actually closes B2B service deals)

Cross-cutting from the CAD, agency and publishing sources:

1. **Process transparency beats capability claims.** Buyers in every one of the three markets said a clearly explained process was a primary selection factor. A visible, honest "how we work" section reduces perceived risk more than any portfolio piece.
2. **Sample work is the fastest vetting method.** For CAD specifically, "asking for sample drawings or past project examples is the quickest way to check" a provider's standards competence.
3. **Small paid trial before large commitment** is the buyer's preferred de-risking move — explicitly recommended in the CAD outsourcing guidance. This validates the Diagnostic / Sprint / Assessment entry tiers as *conversion mechanisms*, not just revenue tiers.
4. **Named standards are credibility shorthand.** BS 8888, Eurocodes, RIBA stages, ISO 19650, WCAG 2.2 AA. Naming the standard you work to converts better than adjectives about quality.
5. **67% of B2B buyers prefer a rep-free, self-serve experience** (Gartner via Wonderchat, 2026) — the site must be able to sell without a call.
6. **UX quality directly affects vendor trust** for 67% of B2B buyers (Adobe Digital Trends). For a company selling design and development, the site *is* the primary case study. Any visible defect is a disqualifying signal.

## R5 — Premium visual direction, 2026

From Fireart's 2026 trend analysis and the premium-agency reviews:

- **Tactile brutalism has replaced soft UI** at the premium end: sharp geometry, 1px solid borders, stark typography, high contrast — projecting engineered precision. Soft shadows, heavy blur, rounded-everything now reads as templated and dated.
- **Neo-serif display paired with monospace utility** is the defining premium type pairing — elegance plus data-credibility.
- **Machine Experience (MX)** optimisation: stripping heavy JavaScript in favour of lightweight CSS logic, partly to serve AI search crawlers.
- Premium positioning is achieved through **restraint and density control**, not decoration. "Clean layouts, thoughtful spacing, controlled interface density."

**Implications adopted:** the shared design system uses 1px hairline borders, no drop shadows below `--shadow-2`, a neo-serif + mono pairing, generous whitespace with tight internal density, and motion restricted to opacity/transform only.

## R6 — Division-specific buyer intelligence

### Design — technical/engineering track
- Buyer's three options are: hire in-house, use freelancers, or use a specialist outsourcing partner. **The site must argue against the other two explicitly.**
- UK-managed offshore-production CAD partners typically deliver **50–60% lower cost than in-house resource** while holding UK-standard QA and UK-timezone project management. This is precisely Gridsmith's UK-entity/US-delivery structure — it is a proven, understood model, and the site should state it plainly rather than hide it.
- Pricing is **per drawing, per sheet, or day rate.** Per-drawing for defined scope (redlines, as-builts, PDF-to-CAD); day rate for evolving scope.
- Standards fluency (BS 8888, Eurocodes, RIBA stages) and QA process are the top vetting criteria.
- Positioning language that resonates: **"an extension of your drawing office," not "a vendor."**

### Digital — software/development
- Buyers evaluate on: clear scope definition, attribution/reporting transparency, contract terms with accountability, and ramp-period honesty.
- Red flags buyers actively screen for: vague deliverable lists, guaranteed outcomes, no ramp discussion, large prepayment discounts.
- 2026 premium dev positioning centres on **owning the outcome and the asset**, not renting a platform.

### Press — publishing
- **The dominant market anxiety is the vanity press.** Sources repeatedly warn authors to verify legitimacy before engaging. Buyers are primed to suspect you.
- Trust signals authors screen for: clear process explanation, transparent terms, retained rights and royalties, no guaranteed-fame claims, no pressure tactics, no unexplained fees.
- Market splits into upload platforms (KDP, IngramSpark, Draft2Digital) and full-service partners. Gridsmith Press is the latter, and must **name the platforms it publishes onto** rather than obscure them — obscuring distribution is a vanity-press tell.
- Highest-value segment: nonfiction, founder and entrepreneur books where the book is a credibility instrument.

---

## R7 — Success criteria applied to all three specs

Any division spec must satisfy all of these to pass validation:

| ID | Criterion | Traces to |
|---|---|---|
| SC-1 | Visitor-to-lead target ≥4%, measured and instrumented | R1 |
| SC-2 | Mobile conversion surface designed explicitly, not inherited | R1 |
| SC-3 | AI-search traffic segmented in analytics; full structured data | R1, R5 |
| SC-4 | Hard performance budget with CI enforcement | R2 |
| SC-5 | Sub-60-second automated notification; site copy states the next-business-day human commitment accurately | R2 |
| SC-6 | Pricing model published on every service page | R3 |
| SC-7 | Process section on every division hub and service page | R4.1 |
| SC-8 | Evidence/sample-work access path | R4.2 |
| SC-9 | Low-commitment paid entry offer as primary CTA | R4.3 |
| SC-10 | Named standards and credentials, not adjectives | R4.4 |
| SC-11 | Full self-serve path to decision without contacting sales | R4.5 |
| SC-12 | Zero visible defects; WCAG 2.2 AA verified | R4.6 |
| SC-13 | Premium direction per R5, no soft-UI defaults | R5 |
| SC-14 | Division-specific objection handling in FAQ, schema-marked | R6 |
