# GS-HOST-H4-E — Full static acceptance / no-JS decision

Date: 6 October 2026. Branch `codex/gs-host-004`, worktree `gs-host-004`.
Result: **PASS.** Verification and documentation only; no source change, no CI run, no redeploy.

Accepted source `44e93c0b9d50dc31c8109f0dce21caad10f119fb`; CI 37372379784; artifact identity
`75d8bf402c73c105ff51cd2a68de8d824dca88d4c808ed81bf38d47838c060a1` (artifact commit 255d0e55,
tree = 73b872b4). Hosted origin `https://mediumaquamarine-wallaby-594070.hostingersite.com`
served that identity before and after every hosted run. Local runs used the same CI archive on a
loopback file server (`build/h4a-static-serve.py`), stopped afterwards. H4-D evidence is not
re-proved; no H4-E change invalidates it.

## A. Inventory

Source of truth: `build/static-route-manifest.json` (65 routes, 55 eligible, 10 excluded), equal
to the artifact's 55 route documents plus 404.html/500.html.

| Class | Routes |
|---|---|
| Master | `/` |
| About / Approach / Insights | `/about`, `/approach`, `/insights` |
| Contact | `/contact` |
| Studios | `/design`, `/digital`, `/press` |
| Eligible services | Design 13, Digital 17, Press 14 |
| Press form / Path Finder | `/press/contact`, `/press/contact/thank-you`, `/press/path-finder` |
| Excluded GS-X002 | `/design/services/cad-drafting`, `/engineering-drawings`, `/technical-documentation` |
| Excluded GS-O003 | `/legal/accessibility`, `/business-client-terms`, `/client-terms`, `/consumer-client-terms`, `/cookies`, `/privacy`, `/terms` |
| 404 | branded `404.html` |

Every gated URL remains a branded noindex 404 (H4-D-R2 wrapper, 14 gated checks, unchanged).

## B. Functionality matrix

| Feature | Classification | Evidence (no JS) |
|---|---|---|
| Global navigation (desktop links; mobile menu) | FULL NO-JS | Plain links; mobile menu is native `popover`: opened by keyboard and navigated `/about` → `/press` |
| Studio header (home, studio, contact) | FULL NO-JS | Plain links on all studio/service pages |
| Footer navigation | FULL NO-JS | All studios, About, Approach, Contact on every route |
| CTA links | FULL NO-JS | Plain links (`/contact?division=…`, in-page anchors) |
| Social links / review provenance links | FULL NO-JS | Plain external links |
| Skip link | FULL NO-JS | First Tab focuses "Skip to content", visible on focus, Enter moves to `#main` |
| 404 navigation | FULL NO-JS | Branded 404, h1 "Page not found", studio/About/Approach/Contact links |
| Service discovery | FULL NO-JS | 52/55 routes reachable from `/` by links, max depth 2; all 44 eligible services reachable |
| Design service-group disclosures | FULL NO-JS | Native `<details>`; closed group opens by keyboard; 13 eligible links; Technical group has no service link |
| Press Publishing Desk stages | FULL NO-JS | Native radios + CSS `:has()`; "Edit" reveals the editorial flags (opacity 0 → 1) |
| Press audiobook Text/Voice illustration | FULL NO-JS | Native radios; Voice (default, same with JS) hides 31 sample words, Text reveals all 31 |
| Review content | CONTENT FALLBACK | Static readable list: 11 quotations visible, unclipped, flat (no transforms) |
| Review cylinder motion | CONTENT FALLBACK | Enhancement only; absent without JS |
| Master / Design / Digital / Press scenes | CONTENT FALLBACK | Static composition; all copy in DOM; illustrations `aria-hidden`; 0 running animations |
| Reduced-motion presentation | n/a without JS | No-JS pages run 0 CSS animations either way; reduced motion stays an enhanced-mode feature (H4-D `check-static-ui`/`check-reviews-ui`) |
| Path Finder | JS REQUIRED + ACCEPTABLE ALTERNATIVE | `<noscript>` notice; all 5 questions, every option and the 6-outcome table visible |
| Contact form | JS REQUIRED + ACCEPTABLE ALTERNATIVE | Visible notice before the form: "JavaScript is required to submit this form. You can email contact@gridsmith.uk instead…"; visible `mailto:` links; submit disabled |
| Press enquiry form | JS REQUIRED + ACCEPTABLE ALTERNATIVE | Visible notice: "JavaScript is required for this enquiry journey. Email contact@gridsmith.uk instead…"; visible `mailto:` links; Next disabled |
| Client-only routing | none required | Every route is a static document; links are full navigations |
| Canvas/WebGL | CONTENT FALLBACK | No important content exists only in canvas/WebGL; Master's static fallback layer (GS-MASTER-001-RC-R1) |

**BLOCKER: none.**

## C. Full no-JS route acceptance

`build/h4e-nojs.mjs`: every eligible route, each in a fresh incognito context with JavaScript and
the HTTP cache disabled, measured at 390, 768, 1024, 1440 and 1920 (275 route-width
observations per run). Run locally and against the hosted origin; results identical.

- 55/55 status 200, one non-empty h1, `lang=en-GB`, header/nav/main/footer present, meta noindex.
- Main text 252–5,438 characters; no blank/client-only shell; no bare loading state.
- 0 horizontal overflow at all five widths; 0 heading-level skips.
- 0 `<img>` elements site-wide (raster/SVG via CSS or inline SVG); 0 failed non-script requests
  and 0 HTTP error responses, so no broken asset. With JavaScript disabled Chrome aborts the
  preloaded `webpack-*.js` fetch on every route; recorded, not a static failure.
- Invisible-text classification: text hidden by opacity/visibility outside `aria-hidden`
  illustrations exists only on `/press` (166 chars) — the audiobook Voice mode above,
  independently proven reversible without JS. `aria-hidden` illustration text hidden at rest:
  `/` 2, `/design` 196, `/press` 318, `/press/contact` 3 characters (decorative by contract).
- Screenshots of 14 representative routes at 390 and 1440, local and hosted:
  `build/h4e-evidence/{local-44e,hosted-44e}/`; studio contact sheet
  `build/h4e-evidence/studios-top-1440-local.png`.

## D. Forms decision

JavaScript is required for submission; the accessible no-JS alternative is the approved email.
No backend, handler, credential or service was added. Both forms render a `<noscript>` notice
above the form, visible `mailto:contact@gridsmith.uk` links, and disabled submit controls; no
`tel:` link (the existing approved WhatsApp/text line on `/contact` is unchanged).
**Privacy finding (safe as shipped):** the forms carry no `action` and default to GET. Without JS,
Enter in a text field does not navigate on `/contact` and `/press/contact` exposes no text field
before step 1. Validity: with the submit's `disabled` attribute removed, the same Enter press
navigated to `/contact?division=…&full_name=…&email=…` (all fields incl. the honeypot), so the
server-rendered `disabled` is load-bearing. Optional future hardening (`method="post"`) is not
required and was not made. No submission, mail or Preview write; Preview leads 0 / outbox 0
(06:59:49Z).

## E. Reviews decision

No change. Without JS: 11 quotations visible and unclipped in a flat list; provenance "Verified
Freelancer review" (with screen-reader "(opens in a new tab)") linking
`https://www.freelancer.com/u/GridsmithLTD` on every card; all 11 provenance links reachable by
Tab; ratings `role=img` "5 out of 5 stars" ×10 and "4.6 out of 5 stars" ×1; no images/flags; no
reviewer names; withheld 22108992/22100632 absent from the built artifact; no API/cache/refresh
automation. Written Freelancer permission remains a production blocker.

## F. Navigation, content, accessibility

axe (WCAG 2.0/2.1 A+AA, 2.2 AA tags) over the no-JS rendering of all 55 routes at 390 and 1440:
**110 analyses, 0 violations**, local and hosted (`build/h4e-features.mjs`). axe cannot run
inside a JavaScript-disabled page, so each route's no-JS DOM is replayed with scripts removed,
`<noscript>` unwrapped and `scripting` media queries rewritten to their no-JS branch; each replay
must match the no-JS h1, heading list and main-text length before its result counts (all 110 did).
Validity: the replay path reported `color-contrast` on an injected 1.3:1 paragraph and nothing on
the clean page (`build/h4e-axe-validity.mjs`).

## G. Visual fallbacks

Master: static gold mark beside H1/CTA, studio list. Design: hero with static line-to-cube drawing,
disclosures. Digital: hero then Route Map list (Web, Software, Apps & Interactive, Automation &
Intelligence, Operate & Improve). Press: Publishing Desk at Publish stage, territories in order.
No-JS pages run 0 CSS animations (default and reduced motion); validity: an injected infinite
keyframe animation was counted in a JS-disabled page.

## H. Static artifact

Built CI archive scanned: 0 `.map` files, 0 `sourceMappingURL`; 0 hits for service_role,
`sb_secret_`, Resend key shape, RESEND/SANITY/DIRECT_CONNECTION variable names, `postgres://`,
private-key blocks, the Production project ref `dqiutgmxillhsbzgnlsx`, or the withheld IDs (118
broad `re_…` hits are CSS-module class names). Only Supabase references: the Preview intake and
the CSP. No link or slug for the three Technical services; two Design copy sentences name the
Technical boundary in prose (approved scope wording). Noindex, empty sitemap, branded 404 and
`/about/` single 308 unchanged from H4-D-R2. H4-D's validator (5 real private values, review
contract) stands for this identical artifact.

## I. Hosted acceptance

All of C, D, E, F, G re-run against the hosted origin: identical results. Provider exceptions
unchanged and correctly scoped (H4-D-R2). Auto-deployment OFF verified in hPanel 07:01Z; current
deployment the 00:04 BST manual Redeploy of 255d0e55. No deployment occurred in H4-E.

## Recorded observations (not no-JS defects; no change made)

1. GS-O003: every route's footer links `/legal/terms|privacy|cookies|accessibility`, and `/press`'s
   rights module cites `/legal/consumer-client-terms#clause-10-1`; all are branded 404s on
   staging, with or without JS, until GS-O003 publishes legal content.
2. `/press/path-finder` has no inbound link anywhere (JS or no-JS). `/insights` is linked only when
   posts exist (none). Both are owner information-architecture decisions.
3. The forms' no-JS safety depends on the server-rendered `disabled` submit (see D).

## Performance

No source or delivery change: no Lighthouse rerun. H4-D measurements stand.

## Revalidation after GS-VIS-NUM-R5 (6 October 2026)

H4-E passed against 44e as recorded above. The owner then reported decorative heading numbers on
About/Approach (not part of the H4-E brief); `GS-VIS-NUM-R5` (source `6f0ef7ce`, identity
`997a2344…`) removed them and the same-rule numbering on Master, Design, Digital, Press and the
Path Finder fallback. The affected scope — those seven routes plus controls `/insights` and
`/contact` — was re-run with `h4e-nojs` (5 widths) and `h4e-features` (18 axe analyses), local and
hosted: identical outcome, 0 violations. Path Finder's probe now counts question headings instead
of the removed "1." prefix. H4-E remains accepted; the other 46 routes' evidence is unaffected.
See `GS-VIS-NUM-R5.md`.
