# GS-LAUNCH-027 — final CI repair and release-candidate acceptance

29–30 October 2026 (Europe/London). **Acceptance in progress; no publication authority.**

## Source and preservation

Start: `codex/gs-launch-026`, `caa3f4c3ba8f8ba688ed3c27359f1bc815a26dbb`, draft [PR #4](https://github.com/atikmurtaza/Gridsmith-Ltd/pull/4) into `codex/gs-launch-023`. Work is isolated on `codex/gs-launch-027` in its own worktree. The primary checkout's existing changes, GS-LAUNCH-025's original uncommitted work, and the clean GS-LAUNCH-026 checkout were preserved. Current refs were fetched before implementation. No reset, clean, force push, merge, or artifact-branch write.

This task supersedes GS-LAUNCH-026's suggested adoption/deployment next task: the owner's GS-LAUNCH-027 instruction authorises CI repair and review preparation only. The placeholder is already backed up; no WordPress restoration project is required.

## Starting CI evidence

Run [40806160977](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/40806160977), exact starting head above, completed **FAILURE**:

| Job / step | Actual evidence | Root cause |
|---|---|---|
| `hostinger-staging / build`, static UI | `/legal/privacy/320/JS:true`, `banner:false`; artifact legal parity passed first | UI gate required the adopted banner in two places even when the served identity selected the GS-LAUNCH-026 proposal |
| `verify`, Master scene | Reduced-motion capture at line 808: identical viewport, scroll and document size; ten text boxes before, none after | The global reduced-motion reset gives every property a 0.01ms transition. Adding the visibility mask starts a real transition; the gate sampled its baseline before waiting for rendering and captured after the transition |
| `hostinger-staging / build`, dependency audit | Production zero; full audit one moderate `qs` advisory | Development-only `qs` 6.16.0, [GHSA-6pq8-jhm2-2vcw](https://github.com/advisories/GHSA-6pq8-jhm2-2vcw) |

Raw logs and downloaded `owner-preview-evidence` are retained privately under `C:\Users\atikm\.codex\task-evidence\gs-launch-027`. No customer records or credentials are included in the public record.

## Fixes and permanent proof subjects

**Legal UI.** Read `legalProposal` from the served deployment identity, require the owner-preview profile, validate the proposal set, and select exactly one appropriate visible disclosure. The page source already says `NOT YET ADOPTED.`; no legal wording or adoption state changes. The link-destination check uses the existing legal-parity banner predicate. Browser checks cover seven documents at 320, 390, 768, 1024 and 1440px, JS on/off. On the first document at every combination, hide then remove the actual banner, require both to fail, restore the captured node, and require the positive control again. Pure permanent specimens reject absent, duplicate, hidden and wrong-status disclosures in both modes.

**Master capture.** Await fonts, cross the rendering lifecycle, and require browser animations to have completed before recording the baseline pose. No animation is cancelled or force-finished, and no screenshot is retried. The exact before/after comparison, document clip, dimensions, scale, contrast thresholds and motion checks remain. A permanent specimen reproduces the reduced-motion visibility transition and confirms the settled hidden state. A continuously animated specimen must time out; existing document-layout, moved-element and real-scroll mutations must still fail during capture. The scene renderer, bounded sway, approved design and user-facing CSS are unchanged.

**Dependency audit.** Update only the `qs` lockfile entry from 6.16.0 to 6.16.2 (version, registry URL, integrity). Re-pin the reviewed lockfile in the installation guard and its independent fixture. Existing dependency gate checks both actual consumers, nested/aliased vulnerable specimens, and both comma-encoding branches with hostile and ordinary input. No audit threshold or lifecycle policy changes.

## Previously stale proofs

No later repair was found in fetched refs or current relevant worktree changes. Other worktrees were not edited.

| Proof | Correction | Evidence / limit |
|---|---|---|
| Digital map timing | Labels already have opacity before map mode, so transition delay does nothing. Withhold opacity in the measured map state; pair clean and defective runs and require complete-map and numbers-only diagnostics | Initial repaired run: clean 303ms complete; defective 0ms complete, 297ms numbers-only; all 12 Digital proof cases passed. Both diagnostics now required explicitly after independent review |
| Design G2 removed surface | The current roof no longer overlaps the note. Place a controlled backing matching its ink behind the real note, verify its paper passes, then remove that paper | Correctly fails on the actual note at 1.00:1 against unchanged 4.5:1 threshold |
| Master s4r | Initial preference is now `motion.matches`; mutate that actual initialisation rather than the removed inline matchMedia expression | PASS: the defective reduced-motion scene changed 8.82% between hero and close, firing its own question; subject restored byte-identical |

The Design suite subsequently reaches a **separate older stale probe**, `Technical transit unreceded-detail`, which did not produce its expected failure. It follows the repaired G2 and kicker cases. It is recorded, not suppressed or counted as a pass; it is outside the three requested subjects and is not a CI step. The positive full Design gate still must pass on final CI. No indefinite expansion into legacy proof infrastructure.

## Verification and exact-head CI

This is an in-progress record. The final results, exact source, PR, CI run and artifact identity are recorded in `GS-LAUNCH-027-EVIDENCE.json` and the review PR before acceptance is claimed. A green local result is not Linux, Apache, Lighthouse, physical-device or assistive-technology evidence.

Already observed: fresh patched `npm ci`, `verify:static` (including TypeScript, zero-warning ESLint, CMS dry-run, legal/consent/review/dependency gates), fresh normal build and 69 route budgets pass. The full normal served sequence completed through all 21 commands: Master passes all 14 questions across 12 viewports; Design, Digital, Press, accessibility, responsive, legal, contact, review-suppression and security-header gates pass. Its two Lighthouse commands explicitly SKIP on Windows, so that sequence is not full Linux acceptance. Proposal static UI passes (20 pages, 70 legal combinations, 20 hidden/missing disclosure proofs, 41 focused axe analyses plus three error analyses, zero violations). Dependency lockfile audits report zero production/full findings after the patch. All ten changed scripts pass syntax checks. The browser-input adversarial selftest passes with explicit Windows Python (`C:\Python314\python.exe`); the initial default Python alias failure is retained. Adopted-preview, consent-mode and final Linux results remain explicit until completed.

Three independent read-only reviews covered the gate logic, scope/security preservation and stale proofs. The Digital proof now requires both measured diagnostics after that review. No application, canonical legal/proposal/register, analytics/review controls, workflow or deployment configuration bytes differ from the starting head.

## Owner-review transaction and unchanged release controls

The eventual review candidate is the exact successful Linux run's `hostinger-release-archive` / `hostinger-static`, bound to its source SHA, acceptance receipts, manifest and artifact identity. It is not the locally generated validation export. The currently approved temporary website stays frozen until a new exact artifact-bound owner approval.

- Seven revised legal documents remain proposals; all seven original adopted documents and the register are unchanged, zero PUBLISHABLE. Owner re-adoption and production publication remain separate decisions.
- GA4 and PostHog remain unconfigured/dormant; identifiers, policy eligibility, `ANALYTICS-READY` and visitor consent remain necessary. Test identifiers are confined to a never-deployed verification build.
- Freelancer reviews remain disabled; no republication rights or owner activation are fabricated. The existing review-copy A/B/C decision is still in the GS-LAUNCH-026 owner packet.
- Owner visual inspection still covers the GS-LAUNCH-026 bounded home sway, Design pause control and Digital pause behaviour. GS-LAUNCH-027 changes no visual implementation.
- Manual screen-reader, speech/switch, physical-device, forced-colour, zoom and human reading/focus-order checks listed in GS-LAUNCH-026 remain unperformed; no full WCAG conformance claim.
- Direct email/WhatsApp, no backend intake, noindex owner-preview and separate production profile remain intact.

Next required production-advancing action after exact-head CI acceptance: owner reviews the bound candidate and authorises that exact artifact for temporary-preview replacement. Legal adoption/publication, analytics activation, review rights, direct-contact evidence and eventual production cutover remain separate gates. No hosted site, WordPress, DNS, mailbox, CMS/database or provider setting is changed here; no support contact.
