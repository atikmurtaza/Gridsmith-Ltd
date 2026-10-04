# GS-HOST-H4-A — Static compatibility foundation

Date: 4 October 2026. Isolated branch: `codex/gs-host-004`.
Application baseline: `9508412e1cc2396e4deafea30d08e3ab9d606b19`.

## Decision and phase boundary

Result: **PASS — local H4-A acceptance only.**
This implements the minimum dual-profile foundation from `GS-HOST-004.md` and its
16-blocker dependency matrix. It does not complete the Hostinger migration or create
a launch candidate. The static artifact is a disposable local technical proof with
honest enquiry shells, an explicit local origin, noindex and no submission capability.

The normal Next application remains the development/Preview/CI/runtime environment.
The proposed Hostinger artifact contains HTML, CSS, client JavaScript, fonts and images;
serving those files needs **zero persistent application Node processes**. A plain
loopback Python file server is used for local proof. Hostinger HTTP/CDN behavior,
upload, account configuration and cutover remain unverified and unauthorised here.

No GS-VIS or GS-SEO uncommitted implementation is copied from another worktree.
The prior GS-HOST-004 prototype receipt recorded two visual overlays; that is historical
prototype evidence only. H4-A uses this branch's committed carousel baseline: a
six-second step, Pause/Resume and Previous/Next, without continuous rotation or dragging.

## Build profiles and commands

| Profile | Activation | Behavior |
|---|---|---|
| Normal Next | Target unset or `GRIDSMITH_BUILD_TARGET=normal` | Existing `npm run build`/`dev`/`start`; current headers, redirects, optimiser, forms, server specimens and gates |
| Static technical proof | `npm run build:static` | Runner sets `GRIDSMITH_BUILD_TARGET=static`, `GRIDSMITH_STATIC_PROOF=1`, public Production CMS dataset and `http://localhost:3236` |
| Invalid target | Any other supplied value, including an empty string | Clear failure before output generation |

`NODE_ENV=production` alone never selects export. Direct static Next configuration
without the proof flag fails. H4-A has no production-indexability switch: static always
remains nonindexable, even if Vercel/origin variables are inherited. The runner removes
those inherited platform variables and known privileged/runtime configuration from
its child environment. Public dataset/project identifiers are not privileged tokens.

The runner uses the controlled Node runtime satisfying `>=24.15.0 <25`. Local evidence
uses Node **v24.21.0**, Next **15.5.25**, `NEXT_BUILD_CPUS=1`; no engine gate is lowered.
Next 15 remains pinned. GitHub Actions gains only the permanent static-predicate
selftest. No static deployment job, Hostinger credential or provider workflow is added.

Normal source is copied to ignored `build/static-source`. Only that disposable tree gets:

- Literal `dynamicParams=false` for dynamic routes, and removal of empty article/legal families.
- Removal of the known APIs, lead/timeout/error/SSR specimens and kitchen sinks.
- Form module exports replaced by `StaticContactShell`; normal actions and `after()` remain intact.
- Static metadata route configuration for `sitemap.ts` and `robots.ts`.
- Existing filtered Freelancer retrieval changed from ISR to a disposable build cache.
- The delivery WebP and explicit Tailwind scan roots for copied app/components/lib.

Static configuration sets `output: export`, unoptimized image behavior and the staged
workspace root; normal configuration retains its existing HTTP/image behavior.
Explicit Tailwind roots prevent auto-discovery from traversing sibling generated trees
or omitting source under the ignored build directory. Two early compile runs were
interrupted without completion; the scoped scan subsequently compiled in about ten
seconds. This is local build evidence, not a Hostinger speed measurement.

The command removes stale `out` before building, requires all known normal subjects
to exist before excluding their copies, checks content revisions before/after export,
and validates the artifact before publishing it to root `out/`. Its `finally` discards
the copied source and raw provider fetch cache. A failed generation produces no
apparently successful root export. Generated output/receipts stay ignored.

## One publication-aware route foundation

`lib/build/route-manifest.ts` consumes the existing reviewed
`GS-PROD-001-CMS-MANIFEST.json`; it does not author a competing service inventory.
Public, published-perspective Sanity identity/revision reads bind that policy to
actual content. Every required company/group/service document must exist and match
its reviewed identity, type, slug, division and publication state. Drafts, seed records,
missing revisions, duplicates, invalid slugs, unknown published services and published
gated services fail generation. No Sanity read/write token is required or supplied.

Current inventory: **55 eligible HTML routes = 11 fixed routes + 44 services**.
There are **zero published Insights articles**. Articles have a validated published-slug
foundation and an independent permanent specimen; no article is invented to prove it.
There are **10 exclusions: three Technical services and seven legal documents**.
The earlier six-legal wording in part of GS-HOST-004 is superseded by the actual reviewed
manifest, the dry-run migration gate and this inventory.

Technical exclusions remain `cad-drafting`, `engineering-drawings` and
`technical-documentation` under GS-X002. All seven reviewed legal routes remain
excluded under GS-O003. Exclusion covers HTML and flat/nested text/JSON/RSC sidecars.
The current Technical narrative/scope disclosure is preserved; it does not authorise
publishing the three gated service pages or professional engineering claims.

`staticParams` reads the prepared build manifest only in static mode. The staged Next
modules emit only eligible known parameters with no unknown-slug fallback. The export
contains no page for an unknown slug; the local file server proves the branded 404.
Hostinger's actual status/routing rules still belong to H4-D/F.

Sanity reads stay in Server Components and run at generation. Required null content
throws in static mode, and the artifact contract requires every expected HTML file.
Before/after revision equality rejects a content change during generation. There is no
CMS mutation, webhook or automatic redeployment implementation.

The static sitemap uses this same manifest's eligible sitemap set. H4-A deliberately
emits an empty sitemap, `robots.txt` with `Disallow: /`, and noindex metadata throughout.
Normal sitemap behavior is preserved; full production eligibility/HTTP SEO parity is H4-D.

## Images and fidelity

The actual image audit finds one active optimiser dependency: DesignArtwork's explicit
`/_next/image` SVG image href. `Media` imports `next/image` but has no active page
consumer. SVG/CSS/header assets are already file-based. Global unoptimized configuration
alone would not fix the DesignArtwork URL, so it selects the prepared derivative only
in static mode. No wholesale image replacement or client-component conversion occurs.

| Asset | Dimensions / format | Bytes | Treatment |
|---|---|---:|---|
| Canonical Design logo | 2400×2400 RGBA PNG | 3,317,305 | Preserved byte-identically |
| Static delivery derivative | 1080×1080 alpha WebP, quality 75 | 41,742 | Generated, never replaces canonical source |
| Normal optimiser response | 1080×1080 alpha WebP, quality 75 | 41,742 | GET with WebP Accept; byte-identical to derivative |

Canonical SHA-256: `f613c7a7bdda188fecf874c109c6d0db833ee2759125c9a96859542930f88ac7`.
Delivery/normal-response SHA-256: `98674bdaa388325938334a99b18368923563284e1cb57dfdc5ca16cc669a9192`.
Visual inspection preserves geometry, gold detail and transparent edges; byte identity
establishes parity with the currently delivered normal image. It does not establish
final owner visual acceptance or real-device GPU/performance acceptance. Unused public
assets, including the canonical PNG, still contribute to total export bytes.

## Artifact contract and permanent failure proofs

Commands: `npm run check:static:artifact`, `npm run check:static:selftest`,
`npm run check:static:ui`. Browser proof requires an already running plain loopback file
server at port 3236; the local Python wrapper is excluded from the commit.

The contract scans every file, checks all eligible HTML against independent reviewed
publication subjects, rejects gated/API/probe/source files, requires title/description/H1,
local canonical, noindex, Organization JSON-LD, restrictive robots, empty sitemap and
branded 404. Generic resource URLs, srcset, SVG use/image, preload/manifest/icon references
and CSS URLs must resolve for local assets. Runtime optimiser URLs are forbidden.
Contact, Press contact and thank-you must contain the technical notice and no forms;
thank-you must not claim that a submission arrived.

Every artifact byte is checked for privileged configuration markers/credential shapes,
service-role JWT roles, supplied actual secret values and withheld review IDs/name.
Intentionally public identifiers/anon-role specimens are accepted by independent tests.
Known withheld IDs `22108992` and `22100632`, and withheld-person marker, must be absent.
The build never commits raw or withheld reviews. H4-C still owns permanent ID exclusion,
terms, approved carrier, retention, expiry, refresh and last-known-good behavior.

Permanent in-memory subjects currently provide **118 independent rejection proofs**,
positive public-configuration/article/noindex cases, and moving file/route/byte counters.
They do not mutate application source or contact providers. Independent audits found
and prompted corrections for ignored `lib/build`, gated published-service leakage,
flat sidecars, generic assets, false thank-you confirmation and accessibility-verifier gaps.

## Verification receipts and limits

Final static artifact and focused browser checks: **PASS**. Ignored receipts are under
`build/`; this report records aggregate evidence only. Root `out/` contains **55 eligible
HTML routes, 200 files, 10,776,971 bytes**. The complete emitted-file contract reports
zero problems and **0 supplied actual secret values checked**; every file was still
scanned for credential markers/shapes, privileged JWT role and withheld markers.

Browser proof on the plain loopback file server passed **14 pages**, all selected
scene/review/PathFinder/disclosure/navigation controls, keyboard Skip/Enter/Space,
mobile menu opening/traversal/Escape and no-JS mobile navigation. There were zero
page errors, failed requests or unexpected HTTP errors. **13 no-JS pages and 39
route/width combinations** retained primary headings, service/company copy, navigation
and no horizontal overflow. The server returned the branded unknown-path document
with local status 404; this does not establish Hostinger's status behavior.

Focused axe: **13 analyses, zero reported violation rules**. **302 color-contrast nodes
on nine routes remain incomplete**. Raw findings and the reason/target triage are kept
in ignored `build/static-axe-results.json` and `build/accessibility-triage.json`.
They concern images/overlap/gradients/pseudo-elements and short decorative text.
No incomplete is called an accessibility pass. Existing specialized scene/chrome
gates remain intact; complete pixel/state/manual-screen-reader release acceptance
is deferred to H4-E/G.

The first two axe attempts sampled Press entrance/hero transitions and failed on
reported contrast violations. The final run uses the existing `preparePress` real
scroll/settle helper and the visible Pause control, asserting its paused state. Its
recorded hero stage is **Write**. A separate normal/static diagnostic of this state
found matching colors/opacity and zero contrast violations in both profiles. No
reported violation is filtered or allowed. This proof covers the recorded settled
state, not every moving Press frame/stage. Motion/transition acceptance remains a
later release obligation.

Existing `check:press:type` also passed on static output: **12 route/width combinations,
48 body-copy blocks**, body at least 17px with 1.7 leading, prose within 52ch. The
technical notices use existing Prose/Link primitives, preserving measure, spacing,
underline and focus treatment without new styles.

Independent final source review found no residual implementation/phase-scope blocker.
The artifact audit independently hashed all 200 emitted files: zero receipt mismatches.
These are local precommit-source proofs (baseline SHA plus modified source), not exact-final-SHA
CI/release evidence. Final GET/primary-HTML smoke passed 13 normal routes, including
the preserved normal thank-you confirmation. Both owned loopback proof servers were
stopped and ports 3235/3236 released. The focused 32-path repository diff is reviewed;
explicit staged-path equality, whitespace, credential-shape/privileged-JWT scanning,
worktree/index content equality and protected normal-source preservation all passed.
The static contract/selftest, existing secret gate and control-character gate passed again
at closure. No actual privileged values were supplied for equality scanning.

Normal evidence already observed:

- `verify:static` completed successfully with the full registered source/security/content suite.
- Final current-source clean normal development-dataset `verify:build` passed (exit 0): 73/73 generated pages and 69 routes within JS budgets.
- A clean normal Production-dataset build compiled/generated 70/70 pages, but its subsequent
  bundle gate required the intentionally absent Technical documentation subject. This existing
  dataset/gate mismatch is recorded; the required subject/budget is not removed or bypassed.
- Normal loopback runtime smoke passed 14 pages, software WebGL readiness, Design scroll/disclosure,
  Digital motion control, Press motion/PathFinder step, review rotation/pause/Next, navigation,
  reduced motion, skip link, mobile keyboard menu and genuine local 404 with no browser/request errors.
- Existing normal served security-header gate passed three routes. Redirect gate passed
  five mapped legacy URLs (single 308, query preserved), four unmapped WordPress defaults,
  two root forms and three slash cases. None of this establishes Hostinger HTTP parity.

The final focused browser verifier additionally covers contact-shell/thank-you pages,
keyboard review/disclosure/PathFinder interactions and the native mobile menu. It keeps
raw axe findings, fails on violation rules, and checks no-JS primary content/navigation
and horizontal reflow at 375/768/1440. Focused checks are not full WCAG acceptance.
Incompletes require explicit triage; full release accessibility/screen-reader, visual,
Linux Lighthouse, real GPU and all scene acceptance remain H4-E/G.

Normal secret gate had no actual privileged values supplied for equality matching.
Static evidence likewise records **0 supplied actual secret values** separately from marker/shape scanning.
Public read-only CMS/review fetches do not prove private key or provider configuration.
No real form/DB/mail/Production mutation is tested or inferred.

## Local size observations

The artifact's total 10,776,971 bytes includes unused public images, all emitted HTML
and RSC sidecars, fonts/CSS and client chunks. It is not per-visit transfer size.
All JavaScript files total **911,366 bytes; 293,388 bytes when individually gzipped**;
that sum includes different routes and the legacy chunk and is not a first-load budget.

Representative HTML bytes: `/` 74,472; `/design` 159,098; `/digital` 106,120;
`/press` 191,569; Design identity service 52,282; Digital website service 54,187;
Press ghostwriting service 51,242; `/about` 64,797; `/approach` 53,193;
`/contact` 39,498; `/insights` 36,461.

Per-route unique non-legacy script gzip was compared with the preserved clean normal
Production-data build, using that build's rendered script lists and actual chunks.
Static values: `/` **108,786 B** (+583 B); `/design` **107,016 B** (+584 B);
`/digital` **108,706 B** (+581 B); `/press` **107,729 B** (+593 B);
each selected service/About/Approach/Insights **105,757 B** (+592 B).
Technical `/contact` is **105,757 B** versus normal **111,168 B**, because the real form
is intentionally isolated. Static Press contact/thank-you use notices; their smaller
chunks do not mean form migration is complete. Framework/chunk distribution changes
are observed, not described as an application feature regression.

Largest images: canonical Design PNG 3,317,305 B; existing brand PNG 669,476 B;
512px icon 133,317 B; delivered Design WebP 41,742 B. Canonical assets remain in export
even when unused. No obvious client runtime regression was found in the tested scope.
No Hostinger TTFB/CDN/LCP or real-device GPU measurements were made; full static
budgets/Linux Lighthouse and hosted performance remain H4-E/G.

## Remaining phases and existing gates

| Phase | Remaining work |
|---|---|
| H4-B | Forms; isolated Preview external intake; private admission/outbox; Resend worker; synthetic security and accessible no-JS errors/value recovery |
| H4-C | Current Freelancer terms/retention, approved identity/carrier, permanent withheld IDs, freshness/expiry/LKG and no-JS review fallback |
| H4-D | Production origin/indexability, sitemap/SEO and HTTP security headers, redirects/query/slash/404/cache policy |
| H4-E | Exact full local static candidate, Preview dynamic flow, full accessibility/security/SEO/budget acceptance |
| H4-F | Separately authorised isolated Hostinger upload and real status/header/CDN/path/recovery proof |
| H4-G | Exact hosted artifact performance/security/SEO/visual/GPU RC and rollback rehearsal |
| H4-H | Explicitly authorised cutover after legal, operations and host gates; verified WordPress backup and rollback |

GS-O003 remains the legal/full-cutover gate. GS-X002 excludes the three Technical routes.
GS-O025/GS-O026 remain operator/free-service and actual static-host acceptance dependencies.
No new owner gate or purchase recommendation is created by H4-A.

## Reversal and repository boundary

Immediate execution-profile reversal: unset `GRIDSMITH_BUILD_TARGET` and use normal
`npm run build`/`dev`/`start`; the runtime implementation remains present. To remove the
foundation entirely, revert the single H4-A commit on its isolated branch. While that
commit is the tip, `git revert HEAD` creates a reviewable inverse; after later commits,
use the exact H4-A SHA reported in the final receipt. Do not reset/copy the primary
checkout, alter unrelated work or revert the application baseline. Generated `build/`
and `out/` are ignored and can be discarded independently after local review.

The focused commit may include GS-HOST-004's architecture/matrix/aggregate receipt as
its prerequisite decision record and their already prepared control-document prefixes.
It excludes the prior prototype harnesses, Python wrappers, screenshots, derivatives,
raw data/cache, build output and concurrent visual/SEO implementation. Stage explicit
paths only. One local commit is conditional on complete H4-A acceptance; no push or main
merge is authorised. Exact final SHA belongs in the final response, avoiding a document
that claims its own content-addressed commit identity.

DNS, WordPress, Hostinger, Production Supabase schema/data, Production Sanity content,
real submissions/mail, main and the live site remain untouched. Owned local servers
must be stopped after the proof. Recommend H4-B only after final H4-A PASS. Then STOP.
