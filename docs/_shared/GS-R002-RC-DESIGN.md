# GS-R002-RC — Design release candidate

> **Current status, 24 September 2026: G2 implementation verified on staging.** Implementation `c4781b0af64733313a78ea7c557a9d1393f7bb32` passes CI `35940710523` and exact-SHA protected Preview smoke checks. The corrected 760x800 note measures 6.69:1; the minimum across all 24 Linux viewport combinations is 6.62:1. The later documentation checkpoint exposed a shared test focus race; the final gate correction changes no application and must pass its own exact-SHA CI and Preview before the final handoff reports RC PASS. Earlier owner-gate statuses below are historical. Production remains untouched.

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

## Staging release evidence — 23 September 2026

Implementation commit: `afe6f2da21088b03daa312681e64ca82fa0cb5ad` (`feat(design): verify owner-approved R2 release candidate`), pushed only to `staging/gs-r002-design`. Local HEAD, tracking ref and remote staging ref matched after the push. The main checkpoint remains `fbecbe01e7fb594c6163dab57514997cb248fc21`.

CI run: https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/35911790613 on that exact implementation SHA. **FAIL**, final run update at 20:13:29 UTC on 23 September 2026. Both Linux Lighthouse axes passed their unchanged assertions. The served suite completed with one failing command out of 15: the Design pixel-contrast gate reported the closed Technical scope note at 760x800. This failure blocks RC acceptance.

### Linux Lighthouse measurements

Median of three runs per route, Lighthouse 12.6.1. Desktop uses simulated throttling; mobile uses the established HTTP/2, 4G, 4x CPU setup. These are lab measurements, not field INP evidence.

| Design measurement | Desktop | Mobile |
| --- | --- | --- |
| Performance | 100 | 99 |
| Accessibility | 100 | 100 |
| LCP | 589 ms | 1,633.502 ms |
| CLS | 0 | 0 |
| TBT | 0 ms | 50.413 ms |

Desktop best practices 96 and SEO 66 are retained with the staging restrictions and existing favicon finding; no gate was relaxed. All four routes passed both axes. The mobile raw-report artifact is `lighthouseci-reports`; desktop numbers are retained in the run's Desktop numbers log (the mobile run replaces the raw report directory). Design's clean-build contribution remains 3.2 KB / 25 KB, with lazy choreography 6.9 KB / 8 KB. All 1,380 approved coordinates retain the recorded exact hash.

### Protected Preview verification

Exact deployment: `dpl_3uwTdB3GpHnrUPvKyyozkDGNH1Jk`, GitHub deployment `6622988705`, environment `Preview`, READY/success. Vercel's Source link and the GitHub deployment API both resolve to `afe6f2da21088b03daa312681e64ca82fa0cb5ad`.

Preview: https://gridsmith-7mplnvfky-atikmurtazas-projects.vercel.app/design

- Unauthenticated access returns 302 to Vercel authentication with `X-Robots-Tag: noindex`. Authenticated markup contains `noindex, nofollow`.
- At 320x568, the expanded Technical panel uses opaque paper `rgb(243, 240, 232)` at opacity 1; the long documentation title is readable and the approved building remains below. Closing restores `rgba(0, 0, 0, 0)`.
- The original single page H1 remains accessible after chapter navigation. Native PageDown changed scene progress from 1.211 to 1.684 and changed the G/S path. The original mascot appears, the wave phase changes continuously, and final progress 4.734 resolves to the exact six bars and eight nodes. Footer release is normal. Captured browser warnings/errors were empty.
- Reduced-motion startup, toggle/restart, shutdown and static fallback have same-commit local production-build and Linux CI browser evidence. The authenticated Preview browser did not permit opening its accessibility settings, so no independent Preview media-toggle test is claimed. Protection was retained and no settings/security workaround was used.

The approved baseline is preserved: G/S hierarchy, original mascot, face-network/building sequence, persistent building-to-logo handoff, metallic finish, wave and canonical copy. G1 changes only the authorised expanded-mobile reading surface and original H1 semantics. The earlier geometry/token/endpoint/runner corrections and clipped-text sampler correction are documented above.

Production Sanity, production Supabase, environment values, DNS, gridsmith.uk, Hostinger and main were untouched. No GS-T004 or next division was started. Existing development-package findings and the historical favicon 404 remain the only recorded non-blocking issues for this RC.

## Historical G2 owner gate — closed Technical scope-note contrast

**Exact-SHA CI evidence:** the 25-viewport Design sweep completed, as did the lifecycle and fallback probes, but the accumulated result was a failure: `760x800 technical: pixel contrast Diagrammatic Gridsmith study, not a construction: 3.90:1; needs 4.5`. This is not an infrastructure failure or an acceptable incomplete. The retained CI screenshot `760x800-technical.png` visibly shows the building roof/facade behind the final lines of the scope note while the disclosure is closed.

CI otherwise passed the seven G1 widths, the original single-H1 regression checks, native wheel/artwork progression, the full general axe suite (76 analyses, zero violations, zero unresolved incompletes), Master scene and hero, shared/content/security/served checks, build and both Lighthouse axes. The full accessibility release gate still fails because the rendered Design contrast gate fails; the general axe pass does not override it. Logs and 25-viewport screenshots are retained under ignored `node_modules/.cache/gs-r002-rc/ci-35911790613*` and in the GitHub run's artifacts.

**Confirmed technical cause:** in the <=760px layout, the fixed copy and the bottom-aligned building occupy intersecting space. The closed scope note remains transparent. G1 deliberately applies paper only while a service disclosure is open, so it cannot address this closed-state collision. A local production-build probe at 760x800 and scene progress 3.150 confirmed copy opacity 1, closed disclosure, and the solid roof directly behind essential scope text. Pixel contrast there was 1.62:1. This is not a fade-out frame or an offscreen-text sampling defect. Switching only to the existing primary ink token still failed (1.15:1), so a colour-only change is not sufficient.

**Proposed owner decision:** permit an existing Design-paper background tightly behind the Technical scope note in the affected mobile/tablet composition even when the service disclosure is closed. Keep note typography, position, text, border and all building geometry/choreography/timing unchanged. This masks only the artwork directly behind the note, but it is an explicit exception to G1's closed-artwork/expanded-only surface constraint. Alternatively, authorise changing the copy/artwork layout to reserve non-overlapping space; that has a broader composition impact.

The narrow paper proposal was tested only with reversible browser-injected CSS and captured as `node_modules/.cache/gs-r002-rc/760-scope-3.15-paper-proposal.png`. The existing pixel sampler reported no contrast failures for the proposal at 760x800, progress 3.150 and 3.650. This is a focused proposal check, not a completed remediation or release pass. It is a review artifact, not an application change. The corresponding unchanged screenshot is `760-scope-3.15-before.png`. Application source and the approved visual baseline remain untouched since the implementation commit.

Under original RC section 16 and G1 sections 3-4/18, this requires the owner's visual decision. No thresholds were relaxed, no failed CI was rerun as a substitute for remediation, and no additional commit or push was made. HEAD, tracking and remote staging remain `afe6f2da21088b03daa312681e64ca82fa0cb5ad`; the evidence/programme updates in this checkpoint remain local. There is no final verified RC SHA.

The local workspace also acquired untracked `.codex/` and `AGENTS.md` tooling files during verification. They and the standalone `public/brand/design/preview.html` remain preserved and excluded. The source-root inventory gate rejects the new local `.codex/` directory; release documentation is checked in an isolated tracked checkout instead of altering the gate or deleting tool files. This local workspace condition is separate from the genuine CI contrast failure.

**GS-R002-RC OWNER GATE REQUIRED. Production remains untouched.**

## G2 approval and local remediation — 24 September 2026

The owner explicitly approved Design-paper behind the closed Technical scope note, including a small roof occlusion, and authorised resuming from CI run `35911790613` rather than restarting the programme. That approval supersedes the expanded-only restriction for this note alone. The failure and decision trail above are retained.

The only G2 application change is in `components/divisions/design/design.css`: the enhanced `.ds-gate` uses existing paper and muted-ink tokens when width is <=760px and height is >650px. It retains typography, copy, spacing, dimensions and border. Expanded G1 disclosure surfaces remain independent. Other closed disclosures remain transparent. The compact short-screen composition and >=761px side-by-side composition retain transparent notes. No building geometry, stage position, animation, chapter timing or scroll synchronisation changes were made.

The range follows rendered evidence, not the single CI sample. Baseline probes found roof/note collisions at 560, 600, 640, 700, 720 and 760px at 800px height and at 760x651; 600x600, 700x600 and 760x650 were clear, as were 761, 768, 800, 900 and 1024px at 800px height. Tall stacked samples can also be clear, but an opaque note matching its existing paper background adds no artwork obstruction when nothing is behind it. Using the existing stacked and compact breakpoints avoids brittle isolated viewport exceptions and protects the full stacked composition.

### G2 verification

- Clean production build PASS after one Windows build worker crash during page-data collection (exit `3221226505`). A second clean build succeeded without a code/configuration change. Build log: ignored `node_modules/.cache/gs-r002-rc/g2-build-retry.log`; exit receipt `g2-build-exit.txt` is 0. Next build includes TypeScript and lint validation.
- Extended the existing Design gate to measure the closed scope note at four readable scene positions (3.15, 3.35, 3.55, 3.65), using its existing screenshot-pixel contrast sampler with unchanged thresholds. All 24 viewport combinations PASS at minimum **6.69:1**, comfortably above 4.5:1: 320x568; 430x568/650/651/800/932; 500x700; 560x800; 600x600/800/900; 700x600/800/900; 720x800; 760x650/651/800/900; 761x800; 768x800; 800x800; 900x800; 1024x800.
- The same run retained G1 checks at seven widths: all three disclosures, keyboard/focus, title reachability, touch targets, contrast, axe and the original single H1 throughout chapter/footer states. Native wheel movement, endpoint integrity, idle wave, direction reversal, hidden/offscreen pause, route exit/back/refresh and static fallback cases PASS. Loading layout shift remains 0.0000. Log `g2-design.log`, exit `g2-design-exit.txt` = 0; screenshots `g2-screenshots/`.
- The permanent `--prove` specimen removes the paper in a disposable browser at 760x800, progress 3.15. The scope contrast assertion fails as intended; the clean baseline passes. All prior Design negative proofs also PASS. Log `g2-proof.log`, exit `g2-proof-exit.txt` = 0. This mutates only the disposable test page, not application source.
- Focused ESLint, token-only colour policy, control-character checks, built tokens/theme and all 68 route budgets PASS. Design contribution remains 3.2 KB / 25 KB; lazy choreography 6.9 KB / 8 KB. G2 changes neither JavaScript nor geometry; the frozen choreography, geometry and mascot assets compare byte-for-byte with the preceding implementation commit. The coordinate hash is also checked on every Design gate run.
- Rendered screenshot inspection confirms the approved note-only paper occlusion and unchanged building. General axe (76 analyses, zero violations and zero unresolved incompletes), Master/shared, service content, navigation/footer, security and both Linux Lighthouse axes from the preceding candidate are reused where unaffected. The required new-SHA CI will automatically rerun the established complete workflow; no gate/budget/workflow was weakened.

Eight pending RC/programme records were reviewed and updated with the G2 authority and evidence. Source inventory checks run against the isolated tracked checkout so local untracked tool files do not alter the release subject; `.codex/`, `AGENTS.md` and the standalone `preview.html` remain preserved and excluded. Secret checks include source, new build and served assets. No package/lockfile, CMS content, production configuration or shared application change belongs to G2.

This is verified local release readiness. The new commit, successful CI and exact-SHA protected Preview will be recorded at the release checkpoint; the earlier `afe6f2da` Preview does not certify this correction.

## G2 staging release verification — 24 September 2026

**Implementation commit:** `c4781b0af64733313a78ea7c557a9d1393f7bb32` (`fix(design): protect Technical scope note contrast`), pushed only to `staging/gs-r002-design`. This supersedes `afe6f2da21088b03daa312681e64ca82fa0cb5ad` as the verified application candidate. The original RC starting HEAD remains `ffbd3623bc4c01acd166cd9efd49933a66ced1d9`.

**CI:** https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/35940710523 — **SUCCESS** on the exact implementation SHA, completed 24 September 2026 at 01:23:59 UTC. Logs and artifacts are retained in ignored `node_modules/.cache/gs-r002-rc/ci-35940710523*` and in GitHub Actions.

The complete workflow passes TypeScript, ESLint, static/content/security assertions, production build, token/theme/bundle gates, both Linux Lighthouse axes and all 15 served commands. General axe reports 76 analyses, zero violations and zero unresolved incompletes. Its 244 established allowed incompletes are not represented as zero; scene text is additionally covered by the rendered pixel gates. General responsive coverage is 51 combinations without horizontal overflow. Master scene (11 viewports x six chapters and fallbacks), Master hero (14 sizes), navigation/footer/company, service content and development-dataset checks pass.

G2 covers all 24 viewport combinations at four readable Technical positions. Linux minimum is **6.62:1** at 320x568 and 430x568; every other sampled viewport, including the original failing **760x800**, measures **6.69:1**. The local minimum was 6.69:1. Both exceed the unchanged 4.5:1 threshold with margin. G1's seven sizes and three disclosures, original single accessible H1, keyboard/focus/title reachability, the 25-viewport chapter sweep, exact endpoints, reduced-motion restart, native scrolling, idle/direction-aware wave, hidden/offscreen pause, route exit/back/refresh and static fallbacks all pass. Loading layout shift is 0.0000.

### G2 Linux performance

Median of three Design reports per axis, from this exact-SHA run's `lighthouseci-reports` artifact:

| Measurement | Desktop | Mobile |
| --- | --- | --- |
| Performance | 100 | 99 |
| Accessibility | 100 | 100 |
| LCP | 588.912 ms | 1,641.210 ms |
| CLS | 0 | 0 |
| TBT | 0 ms | 50.740 ms |

All four routes pass both Lighthouse axes. These remain lab measurements, not field INP. Design route contribution stays 3.2 KB / 25 KB and lazy choreography 6.9 KB / 8 KB. All 68 route budgets pass. G2 does not change JavaScript or geometry; all 1,380 approved coordinates and the recorded hash remain intact. The approved G/S, original mascot, Technical building, persistent building-to-logo transformation, metallic finish, wave, timing and copy are preserved.

### G2 protected Preview

GitHub deployment `6627746310` is `Preview`, `success`, and its API reports the exact implementation SHA `c4781b0af64733313a78ea7c557a9d1393f7bb32`.

Preview: https://gridsmith-cmu1q1wo3-atikmurtazas-projects.vercel.app/design

Authenticated browser smoke verifies the closed scope note at 760x800, transparent side-by-side note at 768x800, and expanded G1 Technical disclosure at 320x568. The approved paper/roof occlusion and all three expanded service titles were visually inspected. Each sampled viewport has no horizontal overflow. The original single H1 remains in the accessibility tree after native chapter navigation. Browser warnings/errors were empty. The route was refreshed again after successful CI. Temporary viewport overrides were reset.

Authenticated markup contains `noindex, nofollow`; unauthenticated access returns HTTP 302 to Vercel authentication with `X-Robots-Tag: noindex`. No protection was bypassed. Reduced-motion preference toggling has local and Linux CI evidence; no independent authenticated Preview media-toggle result is claimed.

### Documentation checkpoint and final receipt

This closing record and the seven existing programme/Design authority headers form a documentation-only checkpoint after the verified implementation. It changes no application, asset, dependency, gate or deployment configuration. Its commit is identifiable from this section's Git history. Before reporting final RC PASS, verify the documentation checkpoint's own CI and protected Preview against its exact SHA; predecessor CI alone is insufficient. Record that final SHA, run URL/result, deployment URL/SHA and remote branch checks in the final release handoff and ignored `node_modules/.cache/gs-r002-rc/final-release-receipt.json`. This avoids embedding a commit's own hash inside itself or creating an endless chain of evidence-only commits.

Only the eight intended records belong to this checkpoint. Local `.codex/`, untracked `AGENTS.md` and the standalone `public/brand/design/preview.html` remain preserved and excluded. Existing non-blockers remain the historical favicon 404 and 27 documented development-package findings (12 high, 13 moderate, two low); production dependencies have zero reported vulnerabilities and no package/lockfile change was made.

Remote main was rechecked at `fbecbe01e7fb594c6163dab57514997cb248fc21`. No production deployment, main merge/push, production Sanity/Supabase action, environment change, DNS/Hostinger change, gridsmith.uk change, GS-T004 or next-division work was performed or authorised. Staging verification does not make the production programme ready to launch.

## Final-checkpoint focus precondition — 24 September 2026

Documentation checkpoint `a7769d7044956edc3c44efab55044c982dd3556a` passed both Lighthouse axes, all G2/G1/Design contrast and lifecycle checks, and the protected Preview smoke. Its CI run `35942946808` nevertheless **FAILED** because the general accessibility runner measured the `/_kitchen-sink` skip link at `(8,-57)` while `document.activeElement` named it. This is preserved as a failed run, not discarded because the application was unchanged.

The installed axe Puppeteer adapter creates and closes a foreground helper tab in `finishRun`. The subsequent DOM integrity check previously assumed the audited page had regained document focus. A deterministic local browser probe reproduced the exact symptom with a helper tab in front: `document.hasFocus()` false, `activeElement` the link, `:focus` false, link top -57.25px. Restoring page focus gives top 8px with the unchanged 0s-transition CSS. The evidence establishes the missing test precondition; the original CI log did not capture document focus directly.

`scripts/check-axe.mjs` now brings the measured page to the foreground and waits for `document.hasFocus()` before its existing DOM integrity assertions. It does not wait for the link to become visible, alter site CSS, change thresholds, ignore a route or add an allowlist. The approved Design and all shared application files remain unchanged.

A permanent proof in the existing gate establishes the unfocused-page precondition, calls the real DOM integrity assertion, deliberately hides the focused skip link and requires one failure, then restores the disposable browser specimen and requires zero failures. Removing the new foreground guard in an ignored copy of the gate makes the positive case fail with the original off-screen message. No application/source file is mutated by these proofs. `--prove-focus-only` permits focused verification; the normal accessibility gate runs the same proofs automatically.

The final release tip includes this gate correction and the updated existing records. The earlier documentation-only checkpoint is superseded. Its own exact-SHA CI and protected Preview must pass before final acceptance, and their identifiers/results belong in the final release handoff and `final-release-receipt.json` described above. No new creative or production scope is authorised.

Local verification of the focus correction: full general axe PASS (76 analyses, zero violations, zero unresolved incompletes), the foreground/hidden-link proofs PASS, focused ESLint and gate-list parity PASS, documentation control-character/struck-rule/fix-claim checks PASS, and source/build/public secret checks PASS. Logs: ignored `final-focus-axe.log`, `final-focus-axe-exit.txt` (0) and `skip-focus-without-guard.log` (expected exit 1). The production build is reused because no application, asset, dependency or build configuration changed; exact-SHA CI runs its mandated build and performance checks automatically.
