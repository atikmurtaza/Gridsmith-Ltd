# GS-LEGAL-001-R12-PRESS-FIX — Press contrast and CI closure

8 October 2026. Baseline `c562ad575f1ea02c6e799f866fbf5f51c297ed7d`,
branch `claude/sweet-mendel-11qvli`. Local verification precedes one scoped commit
and one push. Exact-SHA CI is a separate receipt; no deployment is authorised.

## Root cause and repair

[Failed CI](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/37798308354)
reports Press mobile accessibility 0.96 / 1.00 / 0.96, desktop 1.00 in all three
runs. Both failing nodes are spans inside `.pr-desk > .pr-desk-visual > .pr-d-ms`:
`.pr-d-flag-1` (“Reason first?”) and `.pr-d-flag-2` (“Split this sentence”). The
reported composed foreground/background are `#a6aba0` / `#f3e6c8`, contrast 1.89:1,
normal-size text requiring 4.5:1. Lighthouse 12.6.1 used Linux Chrome 154,
412×823 CSS pixels, device scale 1.75 and the existing mobile 4G/devtools throttle.

These are illustrative editorial annotations, already inside the original
`aria-hidden` desk imagery, accompanied by visible stage captions. They are not
controls, chapter headings or contract copy. Their words and existing semantics
remain unchanged: decorative classification never excuses unreadable painted text.
Only PublishingDesk uses the style; its one PressHome instance contains both flags.

The flags faded over 600ms while their manuscript ancestor also interpolated opacity
and brightness/saturation over 400ms. A fresh Linux build reproduced flag opacity
0.164142 with parent opacity 1 and filter none in Edit. The screenshot visibly
records faint annotations. Its moving-capture guard prevents crediting that frame
as an exact pixel ratio; the independently valid computed-opacity reading and the
CI's exact contrast values establish the defect. The new gate fails the original
build explicitly with “Press flags: fractional painted opacity”. This is a timing
and compositing defect present at both widths; mobile CI caught it during its audit.
The CI final screenshot captures a different stage and does not establish the exact
animation fraction at the earlier contrast audit.

Repeated local Linux Lighthouse then found the neighbouring `.pr-d-ins` word “your”
at 3.13–3.69:1 during its own fade. The first flags-only batch had one failing Press
sample despite a passing median; the next batch failed 0.96 / 1.00 / 0.96. Those
results were investigated locally before Git. The same correction now covers that
insertion and `.pr-d-ms-tag` (“Edited manuscript”), the remaining manuscript text
annotation with the same opacity-fade pattern. The tag is hidden in Write/Edit as
before, and the insertion is hidden in Write as before. No copy or stage changes.

Flags and manuscript annotations now appear/disappear through visibility at whole
element opacity. The manuscript
retains its geometry transitions, settled opacity and dim/desaturated history states,
but its opacity/filter changes do not interpolate. This keeps entering flags fully
opaque and unfiltered, and hides them immediately on leaving Edit. Settled palette,
positions, typography, wording, story, controls, four-stage offsets, cycle and manual
hold remain unchanged. No other component, token or studio is repaired or redesigned.

## Permanent rendered-state regression

The existing `check:press:scene` now calls `checkPressFlags` in `press-contrast.mjs`.
Its `--contrast-only` option runs the same subject and proofs for focused diagnosis.
No workflow assertion, Lighthouse minimum, WCAG threshold, axe rule or incomplete
allowance changes. This check deliberately reaches visible aria-hidden flags through
the existing glyph/pixel helper rather than the decoration-skipping Press axe resolver.

- Initial rendering/hydration and real autoplay: opacity sampling begins before
  document rendering; the mobile lifecycle uses CI's 412×823 / 1.75 device scale.
- Scroll out/return uses the real observer lifecycle. The loop is explicitly paused
  before controlled captures; the native radio state remains the subject.
- Actual manuscript CSS timelines are paused at 0/5/25/50/75/100% for Write→Edit and
  Publish→Edit at 412/1440px. Moving geometry must still exist. Edit→Produce/Publish
  must immediately supply zero painted flags. The Edit insertion is also measured.
  Paused animation `ready` promises are awaited before capture; this synchronises
  the requested timeline state rather than sleeping through the transition.
- Reduced motion, cold native no-JS Publish, manual Edit and keyboard ArrowRight
  selection/focus are measured. Copy/count expectations independently name both flags.
- Every Edit capture requires three glyph boxes (insertion and both flags), whole
  composed opacity, no ancestor
  filter and at least the unchanged helper's 5:1 safety floor. Screenshot geometry
  must stay stable. The pixel decoder uses device scale 1 after the phone lifecycle.
- Permanent degraded specimens recolour the real flags to their backing, reduce
  ancestor/insertion opacity to 0.3 and apply a brightness filter. Each named assertion must
  reject its visible subject; empty/fractional samples must also be rejected.

The final focused Linux run measures 96 Edit annotation glyph boxes, minimum
6.21:1 (the insertion). Four separate two-flag captures each measure 7.39:1.
The natural loop also samples the insertion/tag's own opacity and requires both
names to be observed; that proves removal of their element fades. It does not
claim a separate pixel contrast measurement of the tag through the deliberately
dimmed/filtered Produce/Publish ancestor. The three-box Edit captures do include
ancestor compositing, and repeated Lighthouse provides further actual audit states.
The full scene gate disables the main page's cache too: earlier contrast pages can
warm Chrome's shared cache and produce a 304 on the next navigation. The original
fresh-200 assertion is retained; the complete scene rerun passes. No server or HTTP
acceptance threshold changes. None of these checks imply hosted acceptance or a
screen-reader/physical-device pass.

## Local verification

Fresh Windows and disposable Linux normal builds pass, using Node 24.15.0. The
Linux reproduction uses Debian Bookworm and Chrome 155.0.8059.39, compared with
failed CI's Ubuntu/Chrome 154; Lighthouse remains 12.6.1 with unchanged assertions,
412×823 / 1.75 mobile viewport and devtools 4G throttling. Windows browser gates
use the existing Puppeteer Chrome. Exact-SHA CI remains a separate mandatory gate.

| Check | Measured outcome |
|---|---|
| Press mobile Lighthouse | Six fresh final samples across two three-run batches: accessibility 1.00 each, performance 0.99, best practices 1.00, CLS 0; LCP 1051.258–1071.270ms, TBT 93.160–112.353ms. |
| Press desktop Lighthouse | Three samples: accessibility/performance/best practices 1.00 each, CLS/TBT 0; LCP 585.365–661.358ms. |
| Master and Digital Lighthouse | Three mobile and three desktop samples per route: all twelve accessibility 1.00, all existing assertions pass. Together with Press, 21 final samples pass. |
| Master focused scene | Representative angles 0/40/45/49.9/50.1/60/90° at 320/390/1440px, drag, focus, pause, reduced motion and no-JS pass; minimum 9.84:1 mobile, 9.39:1 desktop. |
| Digital full scene | 40 mobile, 70 desktop and 40 reduced-motion focused glyph boxes, minimum 7.45:1; full matrix 2009 boxes across six sizes, lifecycle and no-JS pass. |
| Press full scene | New 96 Edit glyph boxes and eight separate flag boxes pass; existing loop, pause/manual/offscreen/hidden-document, reduced-motion, nine-width layout, native keyboard, 14-service/canonical-process/contact validation and no-JS checks pass. |
| Normal axe | 76 analyses on 19 routes at 375/1280px, initial/scrolled, plus two deferred footer analyses: zero violations and zero unresolved incompletes; existing allowed incompletes unchanged. |
| Responsive and typography | 51 combinations on 17 routes at 375/768/1440px, no overflow; 17 bottom-bar focus-clearance assertions. Press typography: 12 combinations, 45 blocks, ≥17px/1.7 leading and ≤52ch. |
| Legal and company | Six instruments: 107 clauses, 437 paragraphs, 107 references match; draftless overview banner/links checked separately. Company 10 questions/18 routes, VAT, consumer routing, headers, redirects and service-content parity pass. |
| Full static verification | Typecheck, lint and all static gates pass, including 105 adoption selftests and seven OWNER_ADOPTED documents; tokens/theme/four root layouts and normal bundle budgets pass. |
| Private legal export | Fresh development legal-review artifact: 62 routes, 219 files, 32,822,215 bytes. Seven CMS records match full adopted content/fingerprints before and after generation. No reseed or CMS write. |
| Private static browser | 70 legal viewport/JS combinations at 320/390/768/1024/1440px, 102 verified legal links, 21 page subjects, 41 axe analyses with zero violations and 20 no-JS pages pass. Keyboard/TOC/anchor, native navigation, reduced motion and 404 pass; browser/request/response error lists empty. |
| Artifact and source security | 266 source files, 48 client chunks, 20 public assets and two available secret values checked; static contract scans 219 files and three available values. No leaks. Service-role value unavailable to scanner; build/test servers receive no private provider credentials. |
| Offline production migration | 47 eligible, ten excluded (seven legal and three Technical), manifest agreement and 12 selftests pass; no provider call. |

Raw local logs, reports, screenshots and receipts are retained under ignored
`build/r12-press-fix/` and the disposable Linux evidence directories under
`build/r12-ci-fix/`. Earlier failing pilot Lighthouse samples are retained as
diagnosis and are excluded from the final 21-sample summary.

## Independent review

One fresh read-only reviewer inspected the final Press CSS/gates, scope, evidence
claims and four fixed static-artifact screenshots (412/1440px, Edit/Publish).
Final outcome: **PASS, no blocking finding**. Accepted earlier evidence findings
were corrected before Git: the report includes the neighbouring insertion failure
and correct glyph counts, and limits the tag's own-opacity proof accurately. The
reviewer confirmed the main-page cold-cache correction retains HTTP 200. It did
not independently rerun the browser suites or inspect a physical device/screen reader;
the final static-UI run was still in progress at its review snapshot.
The primary agent subsequently completed that unchanged 70-combination/102-link/
41-analysis static-UI gate and final full static verification successfully before Git.

## Release and safety

Master/Digital repairs and the seven adopted legal instruments, fingerprints,
adoption register and production manifest are preserved. Nothing becomes PUBLISHABLE.
Production migration continues to exclude seven legal documents and three Technical
services. No reseed, form submission, mail send or provider mutation is authorised.

The final commit cannot contain its own SHA or a later CI result. The session's final
handoff and ignored `build/r12-press-fix/closeout.json` record the exact SHA, one commit,
one push, CI URL/conclusion and closure determination. Only successful CI on that SHA
permits R12 CI closure PASS. Until that receipt, the staging hold remains.

No Hostinger dispatch/deployment, gridsmith.uk/DNS change, Production Sanity/Supabase
call, Edge action, H4-B/H4-H, main merge, purchase or legal publication occurs.
Next only after exact-SHA CI closure and separate owner authority:
**GS-LEGAL-001-R13 private Hostinger staging deployment and served acceptance**.
STOP before that phase.
