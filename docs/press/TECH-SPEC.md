# Tech Spec — Gridsmith Press

Inherits `_shared/00-FOUNDATION.md` §2. Press-specific detail only.

---

## 1. Route map

| Route | Render | Revalidate | Notes |
|---|---|---|---|
| `/press` | SSG + ISR | 3600s | Hub |
| `/press/book-publishing` `/ghostwriting` `/content-programmes` `/book-marketing` | SSG + ISR | 3600s | 4 group landings |
| `/press/services/[slug]` | SSG | 3600s | ~10 pages |
| `/press/packages` | SSG | 3600s | Full pricing matrix |
| `/press/books` | SSG + ISR | 21600s | Published books shelf |
| `/press/books/[slug]` | SSG | 3600s | Individual title |
| `/press/path-finder` | Client island on SSG shell | 3600s | 5 questions |
| `/press/rights` | SSG | 86400s | Rights, royalties, ISBN, publisher record |
| `/press/platforms` | SSG | 86400s | Platform compliance detail |
| `/press/assessment` | SSG | 3600s | Entry offer |
| `/press/work/[slug]` | SSG | 3600s | Case studies |
| `/press/contact` | Server Component + Server Action | — | |

Note `/press/packages` and `/press/rights` are top-level routes, not sections inside another page. Both are heavily linked-to and forwarded, and both need to be independently shareable — a suspicious author sends the rights page to a friend before deciding.

## 2. Path Finder architecture (FR-P09)

```
/press/path-finder
  ├─ SSR shell: static decision table (all paths and their criteria, crawlable, no JS)
  └─ Client island: <PathFinder />  ~18KB gz
       ├─ 5 questions, config from Sanity `pathFinderConfig` at build time
       ├─ pure recommendation function in lib/path/recommend.ts
       ├─ outcome may be a Gridsmith service OR an external self-service route
       └─ logs every completion to press_path_results including the "not us" outcomes
```

**The recommendation function must be able to return `outcome: 'self-service'` or `outcome: 'not-ready'`.** This is a hard functional requirement (ETH-04), and the logging of those outcomes is how it is audited — if `press_path_results` shows zero non-Gridsmith recommendations after a month of traffic, the tool is broken and must be fixed.

Question set:
1. What stage is your manuscript at? (idea / draft / finished / needs writing for me)
2. What is the book for? (business credibility / personal legacy / commercial sales / academic)
3. What is your budget range? (banded, includes an "under £500" option)
4. How involved do you want to be? (do it all for me / collaborate / I'll do most of it)
5. What is your timeline?

Outcomes include: Full Publishing Package · Ghostwriting · Manuscript Assessment first · Content Programme · **Self-service (KDP/IngramSpark) with a short honest guide** · **Not ready yet — finish the draft first**.

## 3. Books shelf & link integrity

```
Vercel Cron (weekly)
  → for each published `book` with a retailer link
  → HEAD request, follow redirects, 10s timeout
  → on non-2xx: set book.linkStatus = 'broken', write to press_link_checks
  → Slack alert to #gridsmith-press
  → broken links render as plain text, not as a dead hyperlink
```
A dead retailer link on the verification page is a legitimacy failure (PRD §7). The site degrades gracefully rather than showing a broken promise.

## 4. Content model

Sanity types consumed: `service`, `project`, `faq`, `post`, `testimonial`, plus Press-specific `book`, `publishingPackage`, `pathFinderConfig`, `contentProgrammeTier`. Definitions in `SCHEMA.md`.

## 5. Performance budget

| Metric | Budget | Note |
|---|---|---|
| LCP | ≤2.0s | Books shelf is image-dense — this is the risk route |
| INP | ≤200ms | |
| CLS | ≤0.05 | Book covers need explicit aspect ratios |
| JS, marketing routes | ≤110KB gz | |
| JS, `/press/path-finder` | ≤140KB gz | |
| Books shelf | first 12 covers eager+priority, rest lazy with `IntersectionObserver` | |

Book covers: AVIF, fixed 2:3 aspect ratio container, `sizes` attribute tuned per breakpoint. Never let a cover shift layout.

## 6. SEO & machine readability

| Template | Schema |
|---|---|
| Hub | `Organization` + `ProfessionalService` |
| Group landing | `Service` + `FAQPage` + `BreadcrumbList` |
| Service page | `Service` + `Offer` with `priceSpecification` |
| Packages | `OfferCatalog` — full pricing machine-readable |
| Book detail | **`Book`** with `author`, `isbn`, `bookFormat`, `workExample`, `offers` |
| Books shelf | `ItemList` of `Book` |
| Case study | `CreativeWork` |
| Path Finder | `WebApplication`; static table crawlable |

`Book` schema on every title is significant beyond SEO: it makes the catalogue machine-verifiable, which supports the legitimacy argument in AI search results — exactly the channel R1 identifies as converting 22% above organic.

## 7. Analytics

Shared taxonomy plus Press-specific:

`path_finder_start` · `path_finder_step` `{step}` · `path_finder_complete` `{outcome}` · `path_finder_external_recommendation` · `rights_page_view` · `packages_view` · `package_compare` `{packages[]}` · `book_view` `{title}` · `retailer_click` `{title, retailer}` · `assessment_view` · `sample_report_request` · `segment_select` `{author|business|memoir}`

**`retailer_click` is a key trust metric.** A visitor leaving to verify a book on Amazon is engaging in exactly the due diligence the site is designed to survive. High `retailer_click` followed by return-and-convert is the signal the legitimacy strategy is working. Track return sessions.

Funnels:
1. Any → Path Finder → complete → lead
2. Books shelf → retailer click → return → lead
3. Rights page → packages → assessment → lead

## 8. Integrations

Shared, plus:

| Service | Purpose | Failure mode |
|---|---|---|
| Retailer link checker (cron) | Books shelf integrity | Mark broken, alert, degrade link to text |
| Resend | Sample report delivery | Retry 3×; alert on failure |

No affiliate links on retailer URLs. Monetising the verification path would be a direct conflict with its purpose.

## 9. Security & privacy

- Manuscript uploads are **out of scope for v1** precisely to avoid holding unpublished intellectual property without a proper handling regime. Contact form accepts a link, not a file, for manuscripts.
- Sample report is a redacted real document served via signed 72h URL.
- Standard baseline otherwise: Zod server-side, RLS, honeypot + Turnstile, CSP with nonce, no PII in analytics.

## 10. Accessibility

WCAG 2.2 AA. Press-specific risks:
- Serif body type at small sizes — minimum body size is 17px, and `--ink-subtle` may not be used below 17px
- Warm paper canvas reduces available contrast headroom; every pair verified in `DESIGN.md` §2
- Book covers require meaningful `alt` (title and author), not `alt="book cover"`
- Path Finder: real fieldsets, legends, `aria-live` progress, keyboard operable
- Packages comparison must be a real `<table>` with `<th scope>`, not a card grid — it is comparative data and screen reader users need the row/column relationships
