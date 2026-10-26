# GS-LEGAL-001-R12-STABILITY

9 October 2026. Baseline `68cc9811b9f63a38f4782eea02191c9b3e85049c` on
`claude/sweet-mendel-11qvli`.
[Failed baseline CI](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/37854457577).
Local acceptance PASS. This is the pre-commit snapshot: exact-SHA CI is pending;
staging remains HOLD until CI succeeds. No final commit/push yet.
Final exact-SHA CI evidence belongs in the session closeout, after the single authorised push.

1. **Status:** PARTIAL, pending exact-SHA CI. Local success alone cannot close R12.
2. **Master mechanism:** native document-clipped screenshot capture transiently changes
   the viewport from 390×844 to 1×1 and back. In the reproduced failure, scroll anchoring
   then moved Y5952 to Y4330 during the screenshot command. Document dimensions remained
   390×7468, DPR/visual scale stayed 1, visual offsets stayed 0, and the paused review ring
   stayed at −0.002°. Focus stayed on the body, fonts were loaded, and no application/test
   scroll call occurred inside capture. Two animation-frame waits still reproduced the jump.
   The candidate keeps the explicit current document clip and uses
   `captureBeyondViewport: false` for measured and priming captures, avoiding the observed
   artificial 1×1 reflow. Root styles remain unchanged. The original pose and bitmap guards
   remain; pose is checked first so a genuinely moved viewport reaches its named rejection
   before clipping reduces bitmap dimensions. No post-capture scroll reset or application CSS change.
   The first full sweep subsequently found a separate Q5 failure at 412×915 close: 1.68:1
   against the unchanged 4.5:1 requirement. Its bitmap contains carousel controls in the
   sampled caption box. The original receipt lacks their same-frame DOM geometry, so
   an actual overlap versus stale composition is not yet established. Q5 receipts now retain
   same-capture button/SVG/path geometry and computed colour/stroke/fill. These computed
   reads also flush style state and change capture synchronization; final candidate greens
   cannot isolate the capture option alone as a cure for this secondary symptom. A fresh
   original-path 412px run passed once; no isolated fix for that bitmap symptom is claimed.
   The second full candidate run found another Q5 failure at 2560×1440
   process→reviews@0.33: a heading measured 2.04:1 against the unchanged 3:1 requirement.
   Its saved mask paints Context links where the Process heading is measured. The retained
   scroll, layout, canvas dimensions and control geometry are stable; the internal trigger
   behind those stale-looking pixels remains unisolated. An ignored diagnostic's
   initial selector compared 1/3 to 0.33, selected zero positions and measured no transit;
   those readings are invalid and receive no credit. Its target assertion is now explicit.
   Reached CPU4 diagnostics passed 2/2 before and 2/2 after a two-rAF lifecycle barrier.
   This does not isolate a cure. The candidate crosses that lifecycle after original
   pose/text reads and before screenshot; all original pose, bitmap and contrast predicates
   remain. Q5 receipts also retain Context-anchor and Process-heading ancestor state.
   These changes are synchronization hardening and attribution evidence, not a proved
   repair of Chromium's internal raster mechanism.
3. **Press mechanism:** the missing count was the insertion “your”. Its DOM sample was
   x91–101/y336–342, while its black/white glyph-mask difference painted at x110–121/y334–339.
   All three subjects existed at composed opacity 1 with no ancestor filter; DOM boxes,
   viewport and scroll were unchanged across the three masks. Wide flag boxes partly
   overlapped displaced glyphs, so their success did not establish correct pose.
   Natural transition completion, frame waits and alternate surface capture did not cure it.
   The paused-fraction pixel browser now uses Chromium `--disable-threaded-animation`;
   real CSS transition fractions, easing and geometry remain the subjects. Six distinct
   native poses are required. Default-browser full acceptance follows separately and
   also requires three painted glyph subjects and contrast in naturally settled Edit.
   Its separate live-loop DOM check observes all three annotation names at computed
   composed opacity 1; it does not measure painted glyphs on every live frame.
   The underlying cause of the native compositor/DOM pose mismatch remains unresolved;
   this is a controlled capture correction.
4. **Relationship:** separate demonstrated triggers, with browser capture/timing as the
   common context. Master's failing path used a document clip with captureBeyondViewport; Press uses
   viewport masks and paused CSS effects. A common environment is not proof of one cause.
5. **Before/after:** Master reproduced the exact 1,622px jump; an intermediate capture-scoped
   anchoring control passed 80/80 alternating Y4330/Y5952 captures at CPU4 with no leaked style.
   The smaller final candidate removes the artificial reflow rather than suppressing its anchor.
   Explicit clipping without beyond-viewport emulation passed the 320/390/412px full filtered
   question matrix once. A viewport-relative marker/caption also passed 390px all 14 questions
   with no unexpected resize. Previous R12 false-path failures remain historical contrary
   evidence; these fresh greens do not establish the secondary Q5 raster mismatch's internal cause.
   Press normal-thread capture repeatedly measured 2 glyph boxes; the control passed
   16/16 plus 40/40 constrained captures with 3 boxes, insertion 6.21:1 and flags 7.39:1.
6. **Adverse proofs:** existing low-contrast/fading/clipped/offscreen/shifted-bitmap,
   wrong-scale/dimensions and moved-DOM specimens remain. Permanent additions reject
   real scroll movement, missing insertion text, moved manuscript geometry and repeated
   transition poses. Calibration requires an explicit current document clip without beyond-
   viewport emulation, validates viewport-relative painted marker positions, rejects a
   structural 1×1 resize trace, and checks root styles on successful and rejected captures.
   No count, threshold, viewport or acceptance question removed.
7. **Focused repetitions:** initial normal Master 390×844 all 14 questions PASS; initial
   Press complete 96-box fraction/mode matrix PASS. Final constrained run: Master 80/80
   captures for the intermediate anchoring control; Press 2 complete matrices, 192 painted glyph boxes, all PASS. Diagnostic control
   receipts are separate from whole acceptance. One earlier ignored diagnostic generator
   mis-expanded `$$eval`; that failed harness is not credited as a Master result.
   Final-candidate cold CPU1/CPU4: 80 captures each, 160/160 PASS; warm CPU1/CPU4:
   six captures each, 12/12 PASS, with ten cached responses on each reload. Press warm
   CPU1/CPU4: six paused publish→edit boundary samples each, 12/12 with all three glyph
   subjects and minimum 6.21:1. These counts are captures from one cold/warm load per axis,
   not 80 separate cold navigations. Whole acceptance remains separate.
   After lifecycle hardening, permanent negative proofs PASS; actual-helper cold
   CPU1/CPU4 160/160 and warm CPU1/CPU4 12/12 PASS again.
   Affected 2560×1440, 412×915 and 390×844 complete filtered 14-question matrix PASS,
   including reduced motion and three 25-position no-WebGL fallback sweeps.
8. **Complete scenes:** the earlier intermediate sweep stopped at the 412×915 Q5 failure.
   Pre-lifecycle candidate: Master 1/2 complete 12-viewport/14-question runs PASS; second run
   failed at the 2560px transit above. Press 2/2 complete acceptance runs PASS, each
   retaining 96 transition/mode glyph-box measurements and normal-browser lifecycle,
   settled glyph, keyboard, nine-width responsive, reduced-motion and no-JS checks.
   Design and Digital complete regression gates PASS once each; Digital minimum 7.45:1.
   That earlier candidate did not meet stability acceptance.
   Lifecycle-hardened candidate: 2/2 complete 12-viewport/14-question runs PASS.
   Earlier failed receipts remain retained and are not reclassified.
9. **Accessibility:** fresh axe PASS: 76 analyses (19 routes, two widths, initial/scrolled)
   plus two deferred-footer analyses, zero violations and zero unresolved incompletes.
   Existing 889 incompletes retain their documented resolution/allowlist contracts;
   no allowance changed. The existing SSR-throw probe still exposes the characterised
   crash-shell Level A gap M-P1-1; this is not whole-site AA certification.
   Notification is explicitly skipped/unconfigured, not a live mail/deliverability proof.
   Responsive PASS: 51 route/width combinations and 17 fixed-bar focus-clearance checks.
   Master hero PASS: four phone/tablet and 14 desktop sizes. Fresh Linux Lighthouse PASS:
   33 desktop and 33 mobile reports, all individual accessibility scores 1.00; existing
   performance and other assertions pass without changed budgets or configuration.
   Automated checks do not establish physical-device or screen-reader acceptance.
   The failed CI artifact contains 99 Lighthouse 12.6.1 JSON reports (33 desktop/66 mobile),
   all accessibility 1.00, with host user-agent Chrome 154. It retains two mobile collections;
   this artifact count is not the count of one desktop/mobile repetition.
10. **Legal preservation:** all 81 protected tracked files match baseline SHA-256, including
    legal texts/register/routes, Hostinger workflow, lead/review boundaries and migration
    controls. Seven OWNER_ADOPTED, zero PUBLISHABLE; production migration still excludes
    seven legal and three Technical records. Fresh served parity: six instruments,
    107 clauses and 437 paragraphs match word-for-word; the non-operative client-terms
    hub's adoption banner is checked separately. Private static export/security PASS:
    62 routes, 217 files, 32,873,051 bytes, with seven exact adopted development CMS
    fingerprints verified before and after build. The historical 219-file receipt used
    an older candidate/runtime; all non-chunk paths match, while JavaScript chunks changed
    from 41 to 39. No missing route or public asset was found; no exact compiler cause claimed.
    Private legal UI PASS: 70 responsive/keyboard combinations, 102 legal links;
    21 pages, 20 no-JS pages and 41 axe analyses, zero violations. The no-JS replay
    rejects its visible low-contrast specimen before auditing the restored legal content.
11. **Independent review:** one fresh read-only GPT-6.1 Sol reviewer, extra-high effort.
    Initial source review was conditional on full acceptance. Accepted corrections: priming capture containment,
    restoration/real-scroll proofs, responsive mapping/resize predicate proofs, normal-browser settled glyph check, six-pose red proof,
    and wording that distinguishes stable capture from a fixed native compositor.
    The reviewer requires same-capture control/SVG geometry for the additional Q5 failure.
    Accepted remaining proof correction: shifted and unshifted bitmaps must use the same
    repaired native capture path and equal dimensions, isolating coordinate shift.
    The equal-dimension shifted-bitmap correction has now passed its permanent proofs.
    The same reviewer independently read the complete Master, served, Lighthouse and
    artifact receipts. Final read-only review PASS, with no actionable findings: the
    reviewer verified the passing private static UI gate, retained navigation timeout,
    eight-path scope, clean diff and independently recalculated all 81 protected hashes.
    No second reviewer was created. Exact-SHA CI remains a separate closure gate.
    The lifecycle-barrier candidate received conditional source PASS: same pose guards,
    deliberate mutations still occur after the barrier, bounded same-capture metadata;
    acceptance depends on complete new runs. No claim of an isolated secondary cure.
12. **Build/static/security:** clean Linux npm ci, fresh complete verify:static and clean
    verify:build PASS; 69 routes within bundle budgets. All remaining served gates PASS:
    axe, headers, redirects, launch boundary, responsive, consumer terms, legal parity,
    VAT, Press typography, Path Finder, dataset/content, reviews, company and Master hero.
    Static-export artifact/security PASS. The private static UI navigation reproduced a
    30-second network-idle timeout with zero active requests, document.readyState complete,
    Master data-render ready and fonts loaded. Only that software-scene navigation now
    waits for load plus the scoped Master ready selector. Bounded readiness timeout,
    review interaction assertions and final browser/request/response error checks remain.
    Complete private static UI rerun PASS, including software readiness, 11 reviews with
    continuous rotation/pause/arrows, scenes, Path Finder, navigation, reduced motion,
    skip link, 404 and no-JS. Zero browser errors, failed requests or bad responses.
13. **Git/CI:** no intermediate commits or pushes. One scoped final commit/push only
    after complete local acceptance; final SHA and CI run recorded at session closeout.
14. **Production safety:** no deployment/Hostinger dispatch, DNS/main change, Production
    Sanity/Supabase/Edge write, H4-B/H4-H, publication, hosting purchase or migration.
    Application visuals and shared rendered-label sampler are unchanged.
15. **Closure:** R12 remains HOLD until successful exact-SHA CI. No automatic CI retry.
16. **Next:** GS-LEGAL-001-R13 private Hostinger staging deployment and served acceptance
    requires separate owner authorisation after R12 CI closure. STOP before R13.

Local receipts are under ignored `build/r12-ci-fix/stability-*.log`; bounded forensic
state/masks and protected hashes are under ignored `build/r12-stability/`.
The verified scene runtime is Node 24.21.0/Chrome 148.0.7778.97 on Debian Bookworm.
It matches the failed CI Node/scene-browser versions, but not its Ubuntu 24.04 OS image.
Local Lighthouse uses 12.6.1 with installed Chrome 154.0.8037.92; the baseline report
user-agent exposes only the 154 major version, so exact Lighthouse-browser patch parity
is not established.
[Chromium's current capture implementation](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/content/browser/devtools/protocol/page_handler.cc)
contains the temporary 1×1 capture emulation; that source reference supports the observed
trace and is not claimed to be the exact installed 148 source revision.
