# GS-HOST-H4-D-R1 — implementation and staging evidence

Status: IN PROGRESS. This record supersedes H4-C's historical prerequisite for H4-D, without
claiming provider permission or H4-C automation completion. Owner authority is the H4-D-R1 brief
dated 5 October 2026. Production review publication remains BLOCKED PENDING WRITTEN PERMISSION.

Starting branch `codex/gs-host-004`, SHA `8e6316cc5a0dda38e0de4c15fa1d8ef9c854b8a1`.
Main remains `fbecbe01e7fb594c6163dab57514997cb248fc21`.
Preserved all existing H4-C permission-independent hardening and three untracked H4 prototypes.

## Current checkpoint — 5 October 2026

Exact-source CI 37351265485 passed all normal verification, the static build and publication
for 17f2f6ee70edbfae4cf16fbcb8fb5cdd61238c5b. Its 55-route / 201-file / 29,470,383-byte
artifact independently passed every manifest hash, all eleven quotation hashes and five
private-value scans. Artifact branch commit 6aa18b92d64c8d238ac3c993fe22efc0bb237f44 contains
identity 0afdc8e293bbb4b145e6d84594f905b7381d57aa6fa9652093de64eef1e559a1. Hostinger completed
the first manual deployment to the exact temporary site's public_html, from that artifact branch.
Auto-deployment is off; CDN and automatic page caching are displayed as off.

The served identity matches, but hosted acceptance is FAIL/PENDING: apple-touch-icon.png is
served as 19,362 bytes rather than 20,791, with a different hash and absent security headers.
PNG responses differ while sampled HTML/CSS/font/SVG responses retain the expected headers.
No cause is yet established beyond that observed transport transformation. The asset cache
policy now explicitly requests no-transform; its permanent positive/adverse predicate and
the served gate require that instruction. New exact-source CI and served proof must determine
whether the provider honours it. No hash/header exception or image substitution is permitted.
The no-JS browser proof also encountered a valid cached 304 where its cold route assertion
requires 200; that page now disables its browser cache before the independent no-JS crawl.
No hosted synthetic successful admission or notification has occurred; rollback remains pending.

6893d38a's normal verify job passed in full (CI 37340109924), including both Lighthouse
axes, axe with zero unresolved findings, all four division scene gates and review UI.
The static build also passed; its downloaded artifact has 55 routes, 201 files, 29,470,380
bytes and identity afb52adbc8f7d57e035ae6f0d07ff2b99345e01df3ea07b0a52e7ca3e07e0316.
All file hashes, review hashes and five real private-value scans passed independently.
Publication failed before commit/push at the generated-files whitespace check: index.html
contained one approved review's whitespace-only line, and robots.txt had an extra final
blank line. The artifact branch remains bootstrap; no Hostinger deployment occurred.
These files are not deployment/rollback eligible until the publication correction passes.

The exporter now represents line-ending review whitespace as numeric HTML entities,
preserving the quotation's DOM text and visual layout, and emits one robots final newline.
No quotation is trimmed or rewritten; emitted CSS is unchanged. The artifact contract now
rejects generated trailing spaces/tabs and extra final blank lines before publication.
Permanent proofs verify all eleven frozen text hashes after encoding, reject a changed
decoded whitespace character, and exercise each publication-whitespace rejection branch.
Fresh exact-source verification and artifact publication remain required.

Source a3eb722c was rejected for deployment: CI 37329822078 attempts 1 and 2 failed the
unchanged 1750ms mobile Digital LCP ceiling (medians 1754.443ms and 1756.508ms). Desktop
passed; normal served verification and artifact publication were skipped. Its retained artifact
is diagnostic only. No Hostinger artifact deployment, successful hosted admission or H4-D mail
has occurred. Do not infer hosted acceptance from the local static UI proofs.

The latest Digital trace identifies the heading as LCP: first content at 1692.371ms, heading
at 1751.983ms, final critical CSS response at 1655.271ms. React chunks finish later. CSS
minification offered no useful compressed saving. Next's built-in CSS inlining is being verified
as the minimum build correction: same CSS/theme/fonts, unchanged visual source and thresholds.
The existing first-paint gate now accepts inline delivery only with exact emitted-sheet parity;
linked and inline transports have permanent missing/misplaced/altered adverse specimens.
Local clean build and exact-source CI must settle this correction before deployment.

Local normal compilation PASS with explicit development dataset/local staging URL; all 11
emitted CSS files are byte-identical to a3eb722c. Theme/font parity, 69-route bundle budgets,
static suite, lint and control-character checks passed. Next merges consecutive inline style
resources; the theme gate verifies ordered concatenation and rejects reordered, invalid,
empty, missing, altered or misplaced resources. The first attempted local build correctly
hit the closed review publication guard when the local URL was omitted; no guard was changed.
Native inlining increases local Digital HTML gzip from 21,544 to 62,975 bytes while removing
the three external initial stylesheet requests. This tradeoff requires CI/hosted measurement;
it is not yet a performance PASS or accepted deployment.

Both requested retirement actions were explicitly reconfirmed and completed. Vercel's daily
04:00 UTC /api/rls-drift cron is Disabled; Git is disconnected and deploy hooks absent. The
external project/deployments remain. Only cyan-baboon-443600.hostingersite.com was deleted;
the exact-domain inventory is empty and /runtime returns 404. Its 1284-byte source ZIP is
retained (SHA256 21a03af8b557b32a664d1ce55d455f09d594d38c9fec4694e719f9a00d74f223).
These current receipts supersede historical pending-confirmation statements below.

## Source and local evidence

Recovered the 11 previously accepted quotations from the existing H4-B `out/index.html`, without
any Freelancer request. Independent text hashes and actual ratings are pinned in
`GS-HOST-H4-D-REVIEW-BASELINE.json`; one rating is 4.6 and ten are 5. No dates, names, usernames,
initials, provider IDs, category/private metadata or raw provider records enter the public model.
No authoritative approved country fields exist in this branch or the accepted artifact; no flag
was inferred. The same static list becomes a cylinder only after hydration; no-JS receives all
11 full quotations as a readable grid. Keyboard focus promotes the relevant card to the front.
The existing visual geometry is retained; no GS-VIS integration or redesign was performed.

The standard static suite passed, including H4-A 130 rejection proofs, H4-B 59 boundary cases,
93 H4-C review cases, and new frozen-model/artifact adverse subjects. Both normal production-CMS
and normal development builds compiled. The established normal bundle gate requires the
development dataset's Technical probe routes; the production-CMS build is not a subject for that
complete inventory. No budget or publication gate was lowered.

The staging export passed: 55 eligible routes, source/header/artifact checks, complete review
hash/rating/provenance match, no provider records or forbidden content, noindex, empty sitemap,
excluded Technical/legal routes. Local browser/hosted evidence will be appended after execution.

## Provider configuration evidence

Hostinger inventory contained a managed Node runtime probe at cyan-baboon-443600.hostingersite.com
and an older unrelated temporary PHP/HTML site; neither was used as the new static destination.
Provisioned a separate included Business PHP/HTML temporary site:
`https://mediumaquamarine-wallaby-594070.hostingersite.com`, `public_html`, no application runtime.
Hostinger's already-authorised GitHub list contains only `atikmurtaza/Gridsmith-Ltd`; no GitHub
reconnection or broader grant was requested. The wizard initially offered the historical source
branch `feat/a-01-a-10a-scaffold-ci`; it was NOT deployed. Artifact-branch selection remains pending.

Vercel project `gridsmith-ltd` was disconnected from Git using its preserved-settings workflow;
the UI confirmed it is not connected to a repository and has no deploy hooks. The external
project, deployments, domains and history were retained. Repository Git deployment is disabled
and active build/cron configuration removed. Historical records and code dependencies retained.

Preview project only: `qfgpwumvvtizeamkynes`. Exact hosted origin configuration, hosted proofs,
notifications and exact cleanup pending. No Production (`dqiutgmxillhsbzgnlsx`) writes.

## Standard workflow

See `HOSTINGER-STAGING-WORKFLOW.md`. Final hosted transaction, 42-item acceptance matrix,
performance, rollback and recommendation are pending; do not treat this source record as PASS.

## Predeployment checkpoint

Local static browser proof PASS: 14 routes, hydration/scenes/PathFinder/keyboard navigation,
13 focused axe analyses with zero violations, 13 no-JS pages. All 11 no-JS reviews use the
same readable, untransformed list. Review-specific UI PASS: 11/11 keyboard-reachable full
quotations, 11 exact linked anonymous captions with visible focus and accessible ratings,
automatic motion/pause, cylinder geometry, reduced-motion parity and four tested widths.
Normal development bundle gate PASS: 69 routes within existing budgets. Final typecheck,
lint and control-character checks passed. The normal production-CMS build compiled but
its deliberately excluded Technical routes do not satisfy the development bundle inventory.

Preview origin mutation completed once and verified: exact temporary origin plus the two
existing loopback origins. Hosted origin preflight 204 with exact Allow-Origin; gridsmith.uk
and an unapproved test origin 403 without Allow-Origin. No functions/schema or Production
settings changed. Preview mail configured; queue empty before hosted tests.

GitHub dispatch of a newly added workflow returned 404 because it is absent from the
default branch. The registered CI workflow now calls the branch-local reusable staging
workflow on manual dispatch, after its exact-source verify job succeeds. Main remains
untouched; no verification is bypassed.

## CI findings and correction (5 October 2026)

CI 37248951922 failed mobile Lighthouse. The later 741643b1 run, 37249337059,
passed Lighthouse but failed axe, Press scene and Master scene checks. No artifact was deployed.
The rating's generic span did not permit its accessible label; it now uses the image role.
The existing contrast mapping now recognises only the eleven frozen public review keys,
with positive/negative permanent selector specimens; the pixel measurement remains mandatory.
The Press gate selected the new empty submission-status live region instead of step progress;
its selector now distinguishes them without changing the submission assertions.

Anonymous linked provenance shortened the former two-line caption footprint. A 390x844
diagnostic measured 49% scene survival with the shortened caption and 68% at a 48px caption
floor. The caption now reserves the former two-line footprint using existing typography and
spacing tokens. No cylinder radius, card width, motion, review text or gate threshold changed.
These diagnostic readings are not full-gate acceptance; rebuilt and CI proofs remain required.

Correction checkpoint: `verify:static` passed in full and the rebuilt static artifact contains
55 routes / 203 files / 10,877,419 bytes. The local browser smoke recorded one failed YouTube
icon request although direct GET returned 200; it is not counted as PASS. The normal Press
gate run against the static adapter timed out at a branch Next control before reaching its
progress assertion; exact-source normal CI must settle that correction. Mobile scene checks
remain in progress. Vercel Git is disconnected, but the persisted daily `/api/rls-drift` cron
is still enabled; action-time owner confirmation is pending before disabling that security check.

The five-phone rebuilt run passed 390/375/360 but still failed scene survival at 430/412.
The retained H4-B HTML establishes three caption child rows on all eleven cards, not two;
in its accepted 16rem mobile cards the source row occupies two rendered lines. Direct old-layout
measurements give front-caption heights 96.06/95.94/95.75px at 430/412/390. The correction
preserves three rows generally and four rendered lines on the enhanced mobile cylinder.
Browser-local diagnostic geometry is 96.08/95.97/95.83px with the existing token formula;
scene survival is 65%/68%/85% respectively, above the unchanged 60% floor. The front card
remains 448px. These are targeted diagnostic proofs; clean rebuilt/full CI gates are still required.
Preview pre-admission baseline: zero leads/outbox, mail configured, healthy intake and empty queue;
no hosted synthetic admission or mail has yet occurred.

The clean 58928c92 static build passed: 55 routes / 203 files / 10,862,702 bytes,
sourceModified=false; all five known private values absent. Rebuilt normal scene gate filtered
to 430/412 passed all fourteen questions, including 65%/68% scene survival. The complete
normal CI run 37300901862 stopped at desktop Lighthouse: homepage accessibility 96/100
in all three samples, specifically `target-size` on an anonymous side-card provenance link
(76.3 x 22.3px, safe clickable diameter 14.4px). Mobile/served checks did not run.
The new link keeps its existing position inside the reserved caption, with a 44px tap area.
The existing review UI gate now audits every cylinder pose with axe's target-size rule;
against the unfixed artifact it correctly failed poses 6, 7, 8, 10 and 11.

CI logs exposed inherited Production repository variables. This branch's workflow now selects
only Preview qfgpwumvvtizeamkynes and the existing public publishable key in the dedicated
GS_H4B_PREVIEW_PUBLISHABLE_KEY repository variable; no private key/new key or Production setting
was changed. Superseded 80699551 runs and the duplicate push run on 58928c92 were cancelled,
not counted as successful CI. Hostinger deployment remains gated on successful exact-source CI.

The e1570081 clean artifact passed its privacy/security contract (55 routes, 203 files,
10,862,591 bytes; five real private values absent), but exact-source CI 37303245211 failed
desktop homepage accessibility at 96/100. The permanent all-pose target audit remained red:
neighbouring cards partly obscure source links; increasing their boxes creates more overlap.
The cylinder now accepts pointer activation only on its front reading card. Every source link
remains keyboard-focusable and existing focus promotion brings it forward; the flat no-JS and
reduced-motion lists retain all pointer targets. Injected CSS passed all eleven poses. The
permanent gate additionally measures focus promotion and the resulting hit-testable 24px target
for each source, and requires all reduced-motion links active. Clean rebuilt proofs/CI pending.

## 493f572f exact-source checkpoint and contrast-selector correction

CI 37304582525 completed on 5 October 2026 with FAILURE; static artifact publication was skipped.
Desktop Lighthouse passed (four division routes 100 performance/accessibility); mobile LCP/TBT
budgets passed. Full Master scene/hero, Design scene and Digital scene pixel measurements passed,
as did the review UI gate. One of the eighteen served commands failed: check:axe reported six
UNRESOLVED contrast declines, not six violations. The selectors were the hero kicker's last span
(`span:nth-child(3)`) and the uniquely rated 4.6 review (`span[aria-label="4.6 out of 5 stars"]`).
The previous report's normal axe PASS must not be inferred from early clean route lines.

The existing DOM-boundary classifier now requires one unique match. Only the actual review rating
and the hero kicker's last span, for their observed background-decline reasons, map to the existing
pixel-measured Master scope. No violation, threshold or route is exempted. Permanent proofs reject
outside, unmeasured, missing, invalid, ambiguous selectors and different reasons: 12 review-rating
and 13 hero-kicker cases. A new clean normal build passed. The existing 493f static server provides
targeted diagnostic evidence: four homepage axe analyses have zero violations/UNRESOLVED findings.
That diagnostic is not a complete normal-gate PASS; static output intentionally lacks its normal
Technical/legal/probe subjects. Exact-source normal CI must verify the correction before deployment.

The 493f clean local export is retained: 55 routes, 203 files, 10,862,847 bytes, sourceModified=false,
identity `5a9187e2780f2d182bad6d65efdffcbabee8f4796cde4e5b8c5c0a2860f9174d`.
All eleven review poses and pointer/focus/reduced-motion checks passed. Separate front-pointer and
reduced-motion-pointer adverse CSS proofs produced the intended named failures and restored the
subject byte-identically. Static browser proof: 14 routes, 13 focused axe analyses, 13 no-JS pages;
four exact requested responsive viewports by ten routes passed. Known private-value scan passed.
Preview HTTP negative tests passed 17 boundaries with leads/outbox remaining zero; this is not
hosted browser form evidence. No hosted valid submissions or H4-D mail have occurred.

One of three mobile Digital Lighthouse samples recorded accessibility 96 due to compass-label
color-contrast; desktop samples and the full Digital pixel gate passed. Preserve this observation
for hosted adjudication; do not claim blanket full AA or dismiss it as proven transient.

## Predeployment HTTP-contract correction

875a551e's targeted homepage diagnostic passed all four analyses; permanent mapping proofs passed
12 rating and 13 kicker cases. Exact-source run 37326743132 passed desktop Lighthouse and reached
mobile, but is superseded before deployment because the generated HTTP contract needed correction.
The eight exported CSS files use bare hexadecimal names; the earlier immutable FilesMatch pattern
missed them. An independent hashed-CSS specimen produced the named rejection before correction.
The existing config helper now covers bare/prefixed hashed JS/CSS and hashed fonts, with five
hashed and six unversioned-name specimens. The served HTTP gate checks those same asset classes
independently, including bare CSS names and fonts. The extensionless rewrite no longer excludes
directories when an HTML sibling exists: /design, /digital and /press each have that export shape.
Positive/adverse sibling-route predicate proofs are permanent. These are configuration proofs,
not actual LiteSpeed served acceptance; every route/cache/header still requires the hosted gate.

The local 875a artifact used the default Node 24.15.0 because the command PATH pointed inside
the worktree's project directory instead of its parent proof directory. The corrected existing
runtime is verified as 24.21.0. That artifact remains diagnostic only and must not be used for
deployment/rollback. The next clean artifact and CI must use the corrected source and runtime.
