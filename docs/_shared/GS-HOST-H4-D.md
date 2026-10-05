# GS-HOST-H4-D-R1 — implementation and staging evidence

Status: PARTIAL (44e hosted checkpoint below). This record supersedes H4-C's historical prerequisite for H4-D, without
claiming provider permission or H4-C automation completion. Owner authority is the H4-D-R1 brief
dated 5 October 2026. Production review publication remains BLOCKED PENDING WRITTEN PERMISSION.

Starting branch `codex/gs-host-004`, SHA `8e6316cc5a0dda38e0de4c15fa1d8ef9c854b8a1`.
Main remains `fbecbe01e7fb594c6163dab57514997cb248fc21`.
Preserved all existing H4-C permission-independent hardening and three untracked H4 prototypes.

## 44e hosted checkpoint — 5 October 2026 (PARTIAL)

Exact-source CI 37372379784 (workflow_dispatch, 44e93c0b9d50dc31c8109f0dce21caad10f119fb)
concluded success: verify 21:02–22:11Z, hostinger-staging/build 22:11–22:12Z, publish
22:12–22:12Z. Its hostinger-static archive (id 11373019807) independently passes the established
validator: 55 routes, 201 files, 29,470,397 bytes, every file hash, all eleven review hashes,
five private-value scans, sourceModified=false, identity
75d8bf402c73c105ff51cd2a68de8d824dca88d4c808ed81bf38d47838c060a1. Artifact-branch commit
73b872b460794b603a5dcc9db096d1be0ae972b3 matches that manifest blob-for-blob (200 files plus
identity; 0 mismatches). Neither withheld review ID occurs; robots.txt is Disallow-all; the
sitemap is empty; every HTML document except 500.html (not a route; same as 17f) carries meta
noindex; the generated-files whitespace check is clean. Archive: build/h4d-ci-clean-artifact-44e93c0b.

Hostinger auto-deployment was found ON, contrary to the record above: Hostinger deployed
73b872b4 to public_html at 22:13Z (4s, Completed), one minute after CI's publish, before the
local validation finished. The deployed commit is exactly the validated artifact, so the
outcome is correct; the setting was not changed and needs an owner decision. Deployment history
holds two entries: 21:46 BST manual (17f) and 23:13 BST push-triggered (44e, Current).

The CDN panel shows Active, Development mode off, Flush cache available and Manage disabled
for this add-on domain; no image-optimisation control is exposed. The first site-specific
Flush cache left 22 of 27 PNG probes served from stale transformed entries; a second flush
cleared them within one minute. Served /__deployment.json equals the validated identity.

PNG bytes now PASS. After the second flush, all nine PNGs under three Accept variants (none,
image/png, browser image/avif,image/webp,...) — 27 responses, HIT and MISS — are byte-identical
image/png with Cache-Control "public, max-age=300, must-revalidate, no-transform". Before the
correction the same probe returned transformed PNGs and, for browser Accept headers, image/webp
bytes under .png URLs without Vary: Accept (build/h4d-png-accept-probe-17f-before.json; after:
build/h4d-png-accept-probe-44e-after-flush2.json).

Two provider-edge deviations remain and fail the delivery contract:
- PNG responses carry none of the required security headers (X-Robots-Tag, CSP,
  X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS); hCDN
  adds access-control-allow-origin *. SVG, HTML, CSS, JS, fonts, WebP, ICO and manifest keep
  every header, so this is hCDN's raster-image path, not the generated .htaccess.
- /robots.txt is replaced at the edge by Hostinger's temporary-domain file (Googlebot
  Disallow; every other agent Allow /), 58 bytes, no security or cache headers, also with a
  query string. The artifact's Disallow-all file is never served. HTML stays noindex by meta
  and header; PNGs are therefore crawlable by non-Google agents without noindex.
No repository change can reach either; no hash/header exception is accepted.

The non-stopping survey (build/h4d-hosted-http-survey-44e.json) passes 190 of 200 public files
on status, exact bytes, all seven headers and cache policy; the ten failures are exactly the
nine PNGs (headers) and robots.txt. The committed gate's route/404/redirect assertions, run as a
diagnostic copy (build/h4d-hosted-routes.mjs, unchanged assertions): 55 routes 200 + noindex +
headers; unknown, /api/rls-drift, both legacy legal URLs, three Technical and seven legal URLs
branded noindex 404; /.htaccess and /.git/config 403; /about/ one 308 hop; Brotli. The
committed scripts/check-hostinger-http.mjs itself therefore still fails (first PNG).

Hosted UI on 44e (GET/navigation only, no submissions): check-static-ui PASS 14 pages, 13
focused axe analyses 0 violations, 13 no-JS pages; check-reviews-ui PASS (11 reviews, motion,
keyboard reach, reduced-motion parity, four widths, anonymous captions); responsive PASS 4
viewports x 10 routes. Preview at 22:18Z: leads 0, notification outbox 0. No form was
submitted and no mail sent; the closed 17f enquiry receipts stand (form/review source
unchanged, build/h4d-44e-form-review-invariance.json).

Post-correction Windows Chrome samples (two runs, same method as 17f; descriptive only):
desktop cold LCP 2096–2288ms, mobile cold 1924–2964ms, warm 116–716ms; cold transfer +9,223
bytes on PNG-bearing routes (untransformed icons). Press/Digital returned to the 17f values on
run 2. /design desktop cold was slower in both runs; navigation timing
(build/h4d-design-cold-nav-44e.json) puts the extra ~0.9s before responseStart, bimodal on the
same route (1.13s vs 2.0s), so it is client connection setup, not content or the correction.
No material delivery regression is attributed to 44e.

Rollback is NOT executed: the brief gates it on a fully passing corrected deployment, and
44e does not fully pass. 17f remains unaccepted. Production, DNS, gridsmith.uk, main
(fbecbe01), Production Supabase/Edge and Sanity untouched; no Vercel deployment created.

## Current checkpoint — 5 October 2026

Exact-source CI 37351265485 passed all normal verification, the static build and publication
for 17f2f6ee70edbfae4cf16fbcb8fb5cdd61238c5b. Its 55-route / 201-file / 29,470,383-byte
artifact independently passed every manifest hash, all eleven quotation hashes and five
private-value scans. Artifact branch commit 6aa18b92d64c8d238ac3c993fe22efc0bb237f44 contains
identity 0afdc8e293bbb4b145e6d84594f905b7381d57aa6fa9652093de64eef1e559a1. Hostinger completed
the first manual deployment to the exact temporary site's public_html, from that artifact branch.
Auto-deployment and automatic page caching are off. The current CDN panel explicitly says
Active for this temporary add-on domain; its off switch controls Development mode, not CDN
enablement. The earlier interpretation of that switch as CDN disabled was incorrect.
The temporary domain has its own Flush cache control. No parent-domain opt-out is authorised.

The served identity matches, but hosted acceptance is FAIL/PENDING: apple-touch-icon.png is
served as 19,362 bytes rather than 20,791, with a different hash and absent security headers.
PNG responses differ while sampled HTML/CSS/font/SVG responses retain the expected headers.
No cause is yet established beyond that observed transport transformation. The asset cache
policy now explicitly requests no-transform; its permanent positive/adverse predicate and
the served gate require that instruction. New exact-source CI and served proof must determine
whether the provider honours it. No hash/header exception or image substitution is permitted.
The no-JS browser proof also encountered a valid cached 304 where its cold route assertion
requires 200; that page now disables its browser cache before the independent no-JS crawl.
That first failure preceded the successful hosted enquiries recorded below; rollback remains pending.

### Hosted evidence on 17f2f6ee

- All 55 eligible document URLs return 200 and match their exact artifact HTML hashes, with
  noindex and revalidation. Fifteen additional observations pass: three Technical routes and
  seven legal routes remain branded noindex 404s; legacy legal URLs and the old runtime API
  stay closed; /about/ redirects in one 308 hop to /about.
- Hosted browser proof passes 14 pages, scenes/reviews/PathFinder/navigation/reduced motion,
  skip link and 404. Thirteen focused axe analyses have zero violations; thirteen no-JS pages
  are readable. This is focused staging evidence, not final full AA/no-JS acceptance.
- Review UI passes all eleven cylinder poses, anonymous provenance links, visible keyboard
  focus, accessible actual ratings, every full quotation, Master-only placement, reduced motion
  and four widths. The existing six-second stepped motion remains; unapproved GS-VIS work is absent.
- Responsive smoke passes 390x844, 768x1024, 1440x900 and 1920x1080 across ten routes each:
  loaded fonts, no horizontal overflow, no browser errors and no failed asset requests.
- Four actual browser-to-Preview adverse requests pass: Contact invalid email and URL-name
  return 422; honeypot returns non-admitting 202; Press invalid email returns 422 and focuses
  email. The recorded request was reconciled before resuming after cached navigation; no
  completed request was repeated. Counts remain zero and no notifications are produced.
- Controlled hosted form transport proves network/capacity errors, retained values, error focus,
  pending controls, confirmation and redirects at desktop/mobile, with ten focused axe analyses.
  These in-memory transport cases do not claim deployed worker-failure evidence.
- Exactly two real enquiries are accepted: Contact and Press author/idea with blank optionals.
  Contact duplicate Enter while pending produces only one POST. Both durable rows are synthetic,
  both outbox rows are sent after one attempt, and blank Press optionals are omitted from storage.
  Resend confirms exactly one delivered message for each form, to contact@gridsmith.uk, marked
  SYNTHETIC/H4-B with H4-D-R1 names and matching record IDs. Two subsequent drains claim zero.
  Exact recorded lead/outbox IDs are removed, aggregate counts return to leads0/outbox0, and
  the UI receipt is closed. NEVER resume/repeat these cleaned successful submissions.
- All nine PNG responses have changed bytes and lack the required security/noindex headers.
  Eight preserve decoded pixels; brand/gridsmith-logo-3d.png does not. No byte, visual or header
  exception is accepted. The diagnosis is retained independently of the failed full HTTP gate.

Evidence is retained under build/: hosted-ui-receipt.json, hosted-axe-results.json,
h4d-hosted-route-observations.json, h4d-hosted-responsive.json, h4d-hosted-reviews-ui-17f.txt,
h4d-hosted-negative-ui-receipt.json, h4d-mock-ui-receipt.json, h4d-live-ui-receipt.json,
h4d-e2e-receipt.json and h4d-image-transport-diagnostic.json. The deployment screenshot is
h4d-evidence/hostinger-first-deploy.png; sixteen responsive screenshots are retained there.

### Corrected source and verification boundary

44e93c0b9d50dc31c8109f0dce21caad10f119fb requests no-transform for short-lived assets and
uses a cold no-JS browser page. Typecheck, lint, permanent predicates, staged whitespace and
five actual private-value scans pass. The clean local export contains 55 routes, 203 files,
29,425,127 bytes; identity 5444fd6bf7224e294d63c6bb5ff21bf58ddf54ecbe69bf20689672d4111be803.
Every file hash and all eleven review hashes pass; sourceModified=false, Node24.21.0.
It is retained in build/h4d-local-clean-artifact-44e93c0b, pending exact-source CI/hosted acceptance.

Authoritative run 37372379784 is running after a runner-assignment delay. GitHub's official
status page reported an Actions major outage affecting runner assignment and workflow starts
on 5 October 2026 (incident 3q1yb5m7ltvb); that is consistent with the delay, not proof of its
specific cause. The duplicate push run 37372380548 was cancelled; the authoritative run remains.
Do not deploy the correction before its complete normal/static/publication gates succeed.
The served 17f artifact is not a last known good rollback baseline while PNG acceptance fails.

Session-resumption checkpoint: source44e remains behind CI37372379784, with desktop Lighthouse
passed and mobile Lighthouse running. Remote source/main/artifact refs remain44e/fbecbe01/6aa18b92.
The original17f hosted receipts and screenshots are separately retained in
build/h4d-retained-hosted-17f before further hosted probes. Both successful enquiry receipts
remain closed; no further successful submission is permitted. After corrected deployment,
flush only the temporary domain's CDN cache and repeat actual file/hash/header verification.

The resumed run has subsequently passed both Lighthouse profiles. Its retained report archive
contains24 unique samples (three per division/profile), all with accessibility100. Desktop
LCP medians for Master/Design/Digital/Press are610/611/569/651ms; mobile medians are
928/953/895/1049ms, with mobile TBT medians53/55/68/56ms. These Linux CI values are not
Hostinger or field measurements. The full served job reports76 axe analyses with zero
violations, two revealed-footer analyses with zero unresolved findings, responsive51 combinations
without overflow, the complete review UI PASS and company-facts PASS. Master pixel measurements
remain active; complete verify/static/publication acceptance is still required.
The downloaded archive and summary are build/h4d-ci-44e-lighthouse and
build/h4d-ci-44e-performance-summary.json. Git comparison independently confirms that app,
components, lead/review/Supabase source, public assets and styles are unchanged from17f to44e;
build/h4d-44e-form-review-invariance.json records that premise. The17f successful-mail proof
is retained with its original attribution; it does not claim a new44e successful submission.

### Hosted performance observations

Sixteen Windows Chrome samples use a fresh isolated browser context per cold route, followed
by warm navigation in the same context. Every cold sample has zero cached assets. Mobile uses
600ms latency, approximately 1.47Mbps download, 675kbps upload and 4x CPU throttling; this is
descriptive hosting evidence, not the Linux Lighthouse RC profile or field data. The earlier
shared-context measurements retained seven cached scripts on cold mobile pages and are kept
only as diagnostic history in h4d-performance-shared-context-diagnostic-17f.json.

For Master/Design/Digital/Press respectively, desktop cold LCP is 2184/1352/2152/1368ms and
mobile cold LCP is 2896/2860/1960/2128ms. Warm desktop is 160/124/124/104ms and warm mobile
692/700/664/708ms. Observed navigation TTFB is 60-80ms. Every document uses h2; warm HTML
revalidation returns 304 while decoded content and LCP remain positive. Cold asset transfer
is 219,749/277,018/196,554/263,157 bytes, including approximately 101-109KB encoded JS.
The slower cold Master/Design readings are retained as a limitation. These one-per-state
observations cannot establish a statistical regression against Linux CI or an absent previous
Hostinger baseline. Raw resource timing and before-LCP paths are in h4d-hosted-performance.json.

## H4-D-R1 acceptance register — current checkpoint

PASS here names the measured question only; the phase remains incomplete until every required
question and the corrected exact-source deployment transaction pass. Evidence above concerns
served source17f; the no-transform correction44e is still under verification.

1. PASS — exactly eleven frozen approved static records.
2. PASS — reviewer names absent from public data/captions.
3. PASS — exact Verified Freelancer review provenance.
4. PASS — official Gridsmith Freelancer profile destination.
5. PASS — no authoritative approved country fields exist; no flags inferred.
6. PASS — ten ratings5 and one4.6, with accessible labels.
7. PASS — all eleven independent approved quotation hashes match.
8. PASS — both permanent exclusions and withheld text absent.
9. PASS — raw provider records absent from public artifact.
10. PASS — real private-value scan and credential-marker rules pass.
11. PASS — retrieval/cache/refresh automation remains inactive.
12. PASS — written Freelancer permission remains a Production blocker.
13. PARTIAL — 44e deployed; PNG headers and robots.txt fail at the provider edge.
14. PASS — authorised repository/generated branch/public_html verified.
15. PASS — exact discovered temporary domain recorded.
16. PASS — Vercel Git/deploy coupling and daily cron retired; project retained.
17. PASS — included PHP/HTML static site; no persistent Gridsmith application Node.
18. PASS — 44e CI 37372379784 success; artifact published and independently validated.
19. PARTIAL — 44e identity and 199/200 file hashes incl. all PNGs match; robots.txt replaced.
20. PARTIAL — documents noindex; PNGs lack X-Robots-Tag; edge robots.txt allows non-Google.
21. PASS — all three Technical URLs are hosted branded noindex404s.
22. PASS — all seven legal URLs are hosted branded noindex404s.
23. PASS — browser/server pipeline targets only approved Supabase Preview.
24. PASS — exact temporary origin allowed; Production/attacker origins rejected.
25. PASS — one real hosted Contact admission, validation and duplicate Enter proof.
26. PASS — one real hosted Press author/idea admission with blank optionals.
27. PASS — exact synthetic rows removed; leads0/outbox0; closed receipt.
28. PASS — all55 hosted eligible documents return200 and exact HTML hashes.
29. PASS — branded404/gated/legacy checks and one-hop308 redirect.
30. PARTIAL — 190/200 files carry every header; PNGs and edge robots.txt carry none.
31. PASS — HTML no-cache, hashed immutable, image no-transform observed on 44e.
32. PASS — four requested exact viewports by ten routes, no overflow/errors.
33. PASS — eleven reviews, pose/targets/focus/ratings/reduced motion/full text.
34. PASS — thirteen document and ten controlled-form focused axe analyses; no violations.
35. PASS — sixteen isolated cold/warm descriptive samples, limitations retained.
36. PENDING — exact accepted-artifact restoration has not been executed.
37. PASS — this phase performs no gridsmith.uk mutation/cutover.
38. PASS — this phase performs no Production DNS mutation.
39. PASS — this phase performs no Production Supabase mutation.
40. PASS — this phase performs no Production Edge deployment.
41. PASS — main remains unchanged; source/artifact branches only.
42. PASS — standard Hostinger staging release/verification/rollback workflow documented.

Current outcome (44e): 37PASS / 4PARTIAL / 1PENDING / 0FAIL. H4-E is not started. The site is an operational
temporary test destination; it is not yet an accepted authoritative hosted baseline.

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
