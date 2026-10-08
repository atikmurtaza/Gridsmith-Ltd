# GS-LEGAL-001-R12 — Legal website integration and staging readiness

8 October 2026. Authorised scope: local integration, verification and preparation only.
Baseline: `claude/sweet-mendel-11qvli`, `d40ab59f53dd71e9ff1362331c5f82d085ee5dbe`.
R11 Actions run `37742159590`: SUCCESS, attempt 2, exact baseline SHA, verified through GitHub.

## 1. Result

**LOCAL LEGAL INTEGRATION PASS.** All seven private review routes function in the clean static export;
local gates, independent review and accepted fixes pass. Source CI is a separate exact-SHA checkpoint
reported at session closeout. No staging deployment or public publication is authorised by R12.

## 2. Seven documents and canonical routes

| Document | Version | Route | Adoption effective date |
|---|---|---|---|
| Business Client Terms | 3.1 | `/legal/business-client-terms` | 2026-10-07 |
| Consumer Client Terms | 3.1 | `/legal/consumer-client-terms` | 2026-10-07 |
| Website Terms | 2.1 | `/legal/terms` | 2026-10-07 |
| Cookie Policy | 2.1 | `/legal/cookies` | 2026-10-07 |
| Accessibility Statement | 2.1 | `/legal/accessibility` | 2026-10-07 |
| Client Terms overview | 2.1 | `/legal/client-terms` | 2026-10-07 |
| Privacy Policy | 2.3 | `/legal/privacy` | 2026-10-08 |

All seven remain OWNER_ADOPTED; none PUBLISHABLE. Adopted text, versions, register entries and
fingerprints are unchanged. Privacy fingerprint:
`80e67b5256449e2c7fc1562ead2da8ec538b217c8735cba3679f985af50a620b`.

## 3. Route and navigation audit

The existing `app/(marketing)/legal/[slug]/page.tsx` already rendered all seven development CMS
records in normal Next builds. The default static publication manifest excluded all seven at
GS-O003-R, and the export preparation removed the legal route handler when no legal route was
eligible. The resulting footer/Press legal links reached branded 404s on hosted staging.

R12 adds an explicit `GRIDSMITH_LEGAL_PREVIEW=adopted-development` profile requiring the development
dataset and an exact authorised temporary or loopback origin. Its separate private manifest admits
the seven adopted review pages, with GS-O003-R-PREVIEW identities; the committed production manifest
is not rewritten. The default production export retains all seven exclusions.

The shared footer retains Terms, Privacy, Cookies and Accessibility. Every route uses that footer,
including About and all service pages. Contact's form retains its Privacy link and gains an explicit
link to the Client Terms overview before accepting a quotation. Press retains the Consumer Terms
clause-10-1 link; its enquiry branches distinguish business/consumer/unsure terms. The overview links
both instruments. Consumer and Business instrument footers exclude the opposite instrument and
retain the overview. No checkout, payment, consent-to-terms or acceptance mechanism was added.

Legacy `/privacy-policy` and `/terms-and-conditions` requests deliberately remain branded 404s under
the existing Hostinger contract; canonical legal links use `/legal/...`. Redirects were not changed.
The three GS-X002 Technical services remain excluded from the static export. Static service cards
and related-service navigation now consult the same eligible route identities, so development seed
records cannot create links to those omitted routes. Normal development review remains unchanged.

## 4. Development CMS parity

Unauthenticated development-only reads before editing found exactly seven legal documents. A deep
comparison of every generated source field passed; object-key serialization order is immaterial.
The preview builder repeats that comparison before and after generation, checks the adoption
fingerprints and exact adopted versions, and compares CMS revision inventories across generation.
No development reseed was needed or performed; no Sanity mutation was performed.

Served parity against the static export: six instruments, 107 clauses, 437 paragraphs and all 107
draft clause references match. The draftless Client Terms overview is independently protected by
the exact generated-content/fingerprint comparison and consumer routing gate.

## 5. Static export and no-JS

Clean disposable export: 62 routes, 219 files, 32,822,912 bytes. Build and export use Node 24.15.0
locally; the delivered site needs no application Node runtime. Public output contains native legal
document content, section headings, contents links, shared chrome and print styles. No CMS query
transport, Next Server Action transport or runtime image optimiser URL is emitted.

The export uses development CMS at build time. All nonlegal services remain constrained to the
existing publication inventory. Neither production credentials nor a Production CMS copy are used.
The authorised Preview intake URL remains the existing form adapter; no form was submitted and no
notification was sent. JavaScript-disabled forms continue to disclose the existing email route.

The static route/link/artifact gate scans every exported route, internal destination, fragment,
asset, sidecar and noindex/canonical expectation. Proofs cover both missing destinations and orphan
fragments. Final no-JS and browser receipts are in `build/static-ui-receipt.json`.

## 6. Presentation, accessibility and responsive verification

Preserved the existing Master opening and light document sheet (68ch, readable typography), native
mobile contents disclosure, sticky desktop contents and print treatment. Legal clause numbers are
the adopted reference numbers, not decorative chapter numbering. Every clause is focusable as an
anchor target. Versions, effective dates and the adopted/not-published notice remain visible.
Metadata uses the exact staging canonical; review documents explicitly remain noindex/nofollow.

The browser gate checks all seven documents at 320/390/768/1024/1440px with and without JavaScript:
one H1, clauses/headings, unique anchors, native keyboard disclosure, keyboard contents navigation,
visible anchor landing, shared chrome, no horizontal overflow and reduced motion. It checks legal
links from shared navigation, enquiry pages and representative service routes.

Existing normal-build gates passed: 51 responsive combinations and bottom-bar focus clearance;
Consumer Terms routing; six-instrument parity; VAT display on 17 routes; all ten company-identity
questions across 18 routes. Running the unmodified VAT gate against the static profile reports its
Technical service subject's deliberate 404; its full normal-development run passes. No gate was
weakened to treat that missing subject as a pass.

The first static browser run found insufficient contrast on the new Contact quotation link because
it used a chrome colour class on the light sheet. A scoped sheet-token style fixes it. No unrelated
UI or accessibility threshold changed. Final browser run: 21 pages, 70 legal viewport/JavaScript
combinations, 102 legal links, 20 no-JS pages, 41 axe analyses (28 over legal pages), zero violations.
For no-JS axe, the H4-E method replays the cold DOM with application scripts removed, noscript
unwrapped and scripting media rewritten. Visible main text must be identical. An injected visible
low-contrast specimen produces the named axe violation in that same replay before removal.
Existing consent-notice overlap contrast incompletes are retained as review items; the document
sheet has no new violation. Automated results do not establish screen-reader, physical-device or
complete WCAG acceptance.

The full Master scene gate passes all 14 questions over 12 viewports, six chapters and 12 transit
positions, plus reduced-motion, fallback and software-WebGL subjects. R11's flaky transition
contrast sample did not reproduce. Minimum reported transit contrast is 6.0:1. No Master UI changed.

## 7. Production publication gate proof

The register and production migration manifest are byte-unchanged. Production legal queries require
PUBLISHABLE in both the CMS and committed register; OWNER_ADOPTED alone cannot expose a production
legal route. The default export's seven exclusions remain proved by the existing adverse specimens.

Preview tests reject an unadopted version, altered CMS text/state/version, missing or duplicate
documents, source fingerprint mismatch, production dataset, production/unknown origin, malformed
origin and unknown preview mode. The production artifact inspector rejects the private preview's
legal output. Independent explicit expectations require all seven legal subjects in a preview.

Static foundation selftest: 140 adverse proofs; R12: 22 adverse proofs (including five missing/wrong
served-identity specimens). Adoption gate/selftest retain
all publication prerequisites and the adopted fingerprints. Offline production migration dry run:
47 eligible (1 company, 2 group pages, 44 services), 10 gated (3 Technical, 7 legal), 12 selftest cases,
manifest agreement. It neither reads nor writes Production. No prerequisitesMet field changed.

## 8. Independent review and accepted fixes

One independent read-only review found a P2: optional runner-side metadata could silently omit legal
browser checks. Accepted fix: ask the served `__deployment.json` for its profile, fail when identity
is missing, and require development legal-preview identity under `--legal-preview`. Seven-route
coverage is recorded explicitly. The reviewer confirmed that correction, production/register query
separation and the refreshed docstrings; no further blocking finding.

The artifact scan also found the unrelated untracked `public/brand/design/preview.html` being copied
into output. It remains untouched and outside the commit; exports now copy only Git-tracked public
resources. The independent follow-up confirmed that exclusion and the private register copy needed
by the disposable build. The Contact contrast correction was caught by axe and reverified locally.

## 9. Build, security and privacy

`verify:static` passes: typecheck, lint, colour/contrast, content/claims/control/schema gates, adoption,
migration and permanent selftests. Clean normal and clean static builds pass. Built token/theme,
secret-marker and bundle checks pass: all 69 normal routes within budget; legal routes 102.8KB gzip,
2.6KB delta against the declared floor. These are local measurements, not hosted performance claims.

Artifact scans pass all 62 routes and 219 files: no privileged variable/token/private-key markers,
internal adoption-register fields, CMS query transport, withheld review markers, server/test/source
paths, broken assets, unmanifested HTML or unexpected Server Action/image transport. Exact secret
values checked: zero, deliberately, because no credentials were provided to these builds.

The normal-build wrapper blanks every local dotenv name before starting Next and then sets only
explicit public development settings. `.env.local` is not edited. Previous `.next` builds were moved
to ignored, validated workspace checkpoints; fresh builds cannot reuse them. No raw provider
responses, private records, credentials or generated output are committed.

## 10. Git and CI

All local implementation, accepted fixes and review precede one final scoped commit and one source
branch push. No intermediate commit or push. Final SHA and Actions conclusion are external receipts
reported at session closeout, since this record cannot embed its own commit SHA. Source push runs
normal CI only; no workflow_dispatch, artifact-branch publication, main merge or deployment.
Linux CI is the authority for Lighthouse, which the established Windows harness cannot run.

Unrelated untracked `.codex/`, `AGENTS.md` and `public/brand/design/preview.html` are preserved outside
the scoped commit. The local artifact is a development review candidate, not a production package.

## 11. Hostinger staging readiness

See `docs/_shared/GS-LEGAL-001-R12-STAGING-READINESS.md`. Local artifact validation is separate from
deployment authority and hosted acceptance. The existing Hostinger Business account remains;
no purchase, paid plan, new domain/account/VPS, migration or runtime Node service is needed.
R11 hosting-contract closeout is not reopened; the R10 draft remains SUPERSEDED / NOT EXECUTED.

## 12. Production safety and remaining blockers

No Production Sanity/Supabase operation, Edge deployment, H4-B promotion, H4-H cutover, public legal
publication, staging deployment, Hostinger setting, DNS, gridsmith.uk or main change. No Git
auto-deploy enabled. Existing staged review-provider exceptions remain temporary-domain-only.

Publication still requires CUTOVER-AUTHORITY; Privacy requires H4-B-INTAKE-PROMOTED; the other six
require Privacy co-publication; Cookie additionally requires A-2-PRODUCTION-COOKIE-RETEST. Remaining
document-specific prerequisites and wider production gates stay in their existing registers.
Freelancer publication permission, Technical GS-X002 and production-origin BEFORE-LAUNCH item 24
are not discharged by R12. Owner adoption is complete and does not need to be repeated.

## 13. Exact next phase and owner-only action

Recommendation only: GS-LEGAL-001-R13 — controlled private Hostinger legal-review staging deployment
and served acceptance of this development artifact, under separate owner authority. Required owner
action: authorise that deployment and visually accept the legal presentation. Use the existing
temporary site and manually controlled staging workflow; do not promote legal publication states.
Production intake promotion, publication-prerequisite evidence and H4-H require later explicit
authorisation. STOP after R12 local integration and readiness verification.
