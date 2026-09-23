# GS-R002-RC — Design release candidate

## Authority and frozen baseline

23 September 2026: the owner explicitly approved the local GS-R002-R2 implementation at `http://localhost:3100/design`. This supersedes R1's pending visual acceptance. This phase verifies the approved design; it does not authorise creative polish, production launch, main advancement, Digital/Press work, GS-T004, DNS, production data or environment changes.

Starting branch: `staging/gs-r002-design`. Starting HEAD: `ffbd3623bc4c01acd166cd9efd49933a66ced1d9`. The approved uncommitted source/assets were copied before remediation, with hashes, status and binary diff, into ignored `node_modules/.cache/gs-r002-rc/approved-baseline/`.

Approved: From Line to Form; Oxford Navy / Imperial Gold; shared text/artwork chapter timeline and native scrolling; exact Inter SemiBold G/S with smaller G and dominant S; original animated mascot without pointer following; face network into four-storey CAD; the same building outline resolving into the exact mark; uncluttered metallic finish, scroll-driven shine and continuous direction-aware wave; static fallbacks. Copy and canonical service architecture are unchanged.

The standalone `public/brand/design/preview.html` is an owner reference/development page, unused by `/design`. It is preserved locally and excluded from the release commit. Only the two referenced SVG assets belong to the deployed Design route.

## Technical remediation

- Moved the exact two dynamic metallic colour formulas into Design theme custom properties to satisfy the token-only gate. No colour values or mixing behaviour changed.

- Reduced-motion restart: reproduced incorrect final circles after switching the system preference on/off during the Brand morph. The restart read mutable DOM positions as destination geometry. Destinations now use immutable approved mark coordinates.

- Lazy choreography initially measured 9.2 KB gzip against its unchanged 8 KB ceiling. Lossless base-36 micro-unit deltas compact the font geometry; all 1,380 six-decimal coordinates compare exactly with the approved baseline. Decoding happens once, outside the animation loop. The captured numeric-array SHA-256 is `77af7f2d53d86cce8b866a34eca1743c46ea80bc1390b1f21b5ac971a28f31a4`, asserted by the Design gate.

- Updated the existing Design browser gate for approved R2 rather than retired pointer-follow and returning-fragment expectations. It retains contrast/axe/fallback thresholds and expands to 25 viewport sizes, exact endpoint/restart checks, wave lifecycle, navigation and refresh.

- Corrected the existing served runner to pass its owned server URL to the reviews and security-header gates as well as the other served gates. Previously these two could silently measure port 3000 despite a different `VERIFY_PORT`.

## Verification evidence — stopped at owner gate

- Final complete `verify:static` PASS, exit 0; includes TypeScript, ESLint, colour/token policy and all established static selftests. Log: `%TEMP%/gs-r002-rc-static-final.log`.

- Clean `verify:build` PASS, exit 0: Design lazy 6.8 KB / 8 KB; 68 routes within unchanged delta budgets; source/built/public secret scans, tokens and theme checks pass. Log: `%TEMP%/gs-r002-rc-clean-build.log`. An earlier same-repository `next dev` process overwrote production manifests; it was stopped and the contaminated generated directory preserved before this clean build. Earlier corrupted served results are not application defect evidence.

- Initial 25-size Design sweep: five chapters, no overflow, contrast, service disclosure and original mascot passed. The only reported failure was reduced-motion restart, remediated above. Fresh final evidence is pending.

- Reduced-motion, hidden-tab and route-exit checks exercised real browser behaviour. The offscreen probe now establishes the actual offscreen precondition: a short footer can leave the scene visible at maximum native scroll, so maximum scroll alone cannot prove a pause defect.

- Local notification probe runs with process-level empty `RESEND_API_KEY`; environment files are unchanged and no email is authorised/sent.

- Local Lighthouse is unavailable on Windows under the established launcher limitation. Exact-SHA Linux CI must supply both Lighthouse axes; no local Lighthouse pass is claimed.

## Security, dependencies and existing issues

Production audit: zero vulnerabilities. Full graph: 27 affected development packages (12 high, 13 moderate, 2 low), matching the existing R1 audit. Manifest and lockfile unchanged; no GS-R002 dependency introduced. Advisory paths/ranges/fix proposals remain in `GS-R002-DEPENDENCY-AUDIT.md`; no force-fix, downgrade or new risk acceptance.

The two SVGs contain no script, event handlers, foreignObject or external href. They are image assets, not injected HTML. Animated mascot SHA-256 remains `87CC5E8A8DCCDE1C15256BE129FA5281051EB7ECDA81C834AF92DB52624EA409`. Final clean-build source/built/public secret checks passed.

`/favicon.ico` returns 404, as already recorded in R1 Lighthouse evidence; no favicon route or metadata is declared. This is pre-existing and non-blocking for this Design RC, not a new animation defect. No unrelated shared branding decision is introduced.

## Historical checkpoint before G1 approval

Not committed or pushed: the owner gate below prevents release. HEAD and remote staging remain `ffbd3623bc4c01acd166cd9efd49933a66ced1d9`. No RC CI run or new Preview exists. No prior deployment is represented as this RC.

Main read-only checkpoint: local/tracking/remote production branch remains `fbecbe01e7fb594c6163dab57514997cb248fc21`. No production action has been taken. GS-O008 Master approval, GS-O019 resolution, GS-O020 CLOSED — PUBLISH and Technical publication gates remain unchanged.

## Original owner gate — expanded mobile Technical services

**Observed on the clean production build, 23 September 2026, in the in-app browser at 320 × 568.** Native hero link opens `/design#technical-design`; open “Explore Technical Design services”. At measured scene progress 3.154, “Technical Documentation & Manuals” overlaps the dark building roof and facade. This is a real readability collision, not horizontal overflow or a missing route.

DOM measurement: copy is `position: fixed`, transparent `rgba(0,0,0,0)`, x19.2–300.8, y22.71–477.11. The affected link is x19.2–142.4, y373.39–454.49. The building roof is x84.71–221.28, y356.95–428.51. Their overlap was visually inspected; no numeric contrast ratio is claimed for this sample.

Technical cause: expanded disclosures increase the fixed copy height into the persistent stage area. The existing 80svh inner scroll contains the panel but gives it no opaque reading surface, so the artwork paints behind essential service text.

**Proposed owner decision:** approve a Design-paper reading surface for expanded service panels on narrow viewports, constrained by the existing inner scroll. This preserves closed-state chapter timing, glyph geometry and copy, but covers part of the approved artwork while the disclosure is open. Alternatively, reserve separate vertical space for expanded details; that changes the mobile composition. Neither visual choice was implemented.

The owner's RC brief §16 explicitly requires stopping if a fix could materially alter the approved appearance or interaction. Verification and release actions stopped at this gate. Remaining Master/shared, final Design/lifecycle suite, Linux Lighthouse, commit, staging push, exact-SHA CI and protected Preview checks are incomplete and must not be represented as passed. The clean served run was deliberately stopped after the gate was confirmed; it is not a completed `verify:served` pass.

The clean general axe gate reported two unresolved release failures: `page-has-heading-one` on `/design` after scrolling at both 375px and 1280px. The hero H1 is inside the copy made hidden/inert after its chapter exits. This finding still needs remediation and verification after the owner gate; no accessibility pass is claimed. The same clean run passed served security headers, launch/development-dataset checks, 51 responsive route/width combinations without horizontal overflow, consumer routing, legal parity and VAT content checks.

Completed clean served checkpoints are retained in `%TEMP%/gs-r002-rc-served-clean.log`; final status must distinguish those partial results from the full suite. No changes to production, main, DNS, Sanity/Supabase production data or environment, migrations or Hostinger occurred.

**Historical status: GS-R002-RC OWNER GATE REQUIRED. Superseded by the G1 approval below.**


## G1 owner approval and remediation — 23 September 2026

The owner explicitly approved the opaque Design-paper surface for expanded mobile service panels and the accessible-H1 correction without material visual change, then authorised resuming the incomplete RC gates and a verified staging-only commit/push/Preview.

The shared enhanced-copy rule applies only at <=760px while `.ds-services` is open. It uses the existing paper and ink tokens, typography, disclosure markup and 80svh inner scroll; it adds no card decoration. All three service groups share the rule. Closing removes the surface; tablet/desktop retain their approved composition. Building geometry, Technical animation, electrical/water treatment and chapter timings were not changed by G1.

The original H1 disappeared from the accessibility tree because its parent was assigned `visibility:hidden` and `inert` on hero exit. The original heading and parent now stay semantic while the existing visual opacity/transform/clip timeline is preserved. Only the hero's non-H1 content becomes inert after exit; cleanup restores it. There is still exactly one DOM H1 and one accessible level-one heading. No replacement or duplicate heading was added.

### G1 completed local evidence

- Clean production `verify:build` PASS, `%TEMP%/gs-r002-rc-g1-build.log`: all 68 route budgets, token/theme checks and source/build/public secret scans. Design route contribution 3.2 KB / 25 KB; lazy choreography 6.9 KB / 8 KB after the H1 fix.
- Focused Design gate PASS, `%TEMP%/gs-r002-rc-g1-design.log`, exit recorded in ignored `node_modules/.cache/gs-r002-rc/g1-design-exit.txt`. Seven viewport sizes: 320x568, 360x800, 375x812, 390x844, 430x932, 768x1024, 1280x720. Original H1 verified at initial/chapter/final/footer states; all three disclosures checked open/closed with keyboard, focus, full service-title bounds, touch-target height, rendered contrast and axe.
- Native wheel progress, pacing/overlap, exact geometry/mark endpoint, reduced-motion restart, wave idle/direction/hidden/offscreen lifecycle, route exit/back/refresh and no-JS/reduced-motion/save-data/low-memory/import-failure static fallbacks PASS in that same gate. Loading layout shift 0.0000.
- Contrast sampling remediation: Range rectangles included text below the mobile panel's overflow clip, where no glyph was painted. Confirmed at 320x568: panel bottom y477.1, scope-note rectangle extended to y561.2. The existing sampler now intersects rectangles with ancestor scrollports. Contrast thresholds are unchanged. `--prove` PASS, `%TEMP%/gs-r002-rc-g1-proof.log`: deliberately low-contrast visible mobile disclosure text still produces a failure, alongside the existing negative proofs.
- Manual in-app-browser inspection at 320x568 using the native Technical chapter link confirmed the long documentation title on opaque paper and the building visible below. The accessibility tree retained the original page H1.
- Full general axe PASS: 76 analyses, 19 routes x 375/1280 x initial/scrolled, zero violations. The original two scrolled Design H1 failures are resolved. Established rendered-scene contrast incompletes remain backed by pixel gates; no new allowlist was added.
- Responsive PASS: 51 route/width combinations, no horizontal overflow; all 17 fixed bottom bars retain adequate scroll padding.

Previously passed static/security-header/launch/legal/VAT checks are reused where unaffected. Remaining Master/shared gates, exact-SHA Linux Lighthouse, CI and protected Preview are still in progress; this checkpoint is not a release PASS.

### Local RC completion and release readiness

The resumed remaining-gates run completed with exit 0 (`node_modules/.cache/gs-r002-rc/g1-remaining-exit.txt`; `%TEMP%/gs-r002-rc-g1-remaining.log`). In addition to the axe/responsive results above, Press typography, seven Path Finder journeys, service content/development dataset, review UI, company/footer facts, Master scene (11 viewports x six chapters plus footer and fallback cases) and Master hero (14 sizes) PASS. Both Windows Lighthouse commands explicitly SKIPPED; no Lighthouse pass is inferred from this local exit code.

Fresh G1 TypeScript and ESLint checks PASS (`%TEMP%/gs-r002-rc-g1-typecheck.log`, `%TEMP%/gs-r002-rc-g1-lint.log`). Documentation control-character, fix-claim, struck-rule and gate-list checks PASS. The earlier complete static run and unaffected clean headers/launch/legal/VAT evidence remain valid. No package, lockfile, service copy, CMS data, workflow budget or shared application code changed.

Final comparison with the captured approved baseline confirms `transitionGeometry.ts` and both mascot SVGs are byte-identical. Application differences from that baseline are limited to the documented immutable endpoints, lossless glyph encoding, token extraction, mobile expanded surface and H1 semantics. The full staging diff was reviewed, including the approved R2 work predating RC. The standalone reference `preview.html` remains excluded and preserved.

The candidate is ready for the authorised staging commit/push. Exact commit, successful Linux CI/Lighthouse, protected Preview and deployment checks will be recorded at the release checkpoint; until then this is local readiness, not final RC PASS.
