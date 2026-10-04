# GS-HOST-004 Status

**4 October 2026 — OPTION B: STATIC HOSTINGER ARCHITECTURE FEASIBLE WITH EXTERNAL DYNAMIC BOUNDARIES.** Architecture finding and representative local proof; not a complete conversion, hosted RC, operational guarantee or launch approval.

Implement Next static HTML/CSS/JS/assets on the existing Hostinger Business web hosting, built on standard GitHub Actions, with narrowly scoped Supabase Free Edge endpoints for enquiries and existing Resend notifications. Keep Sanity reads at build time and all scenes in the browser. **Persistent Hostinger Node requirement: zero.** Trusted server-side work remains in existing external services. No VPS, upgrade, new paid host, Vercel Pro or waiting for a managed Node update.

The owner instruction supersedes GS-HOST-001/R1/R2 recommendations to wait for an included patch or investigate VPS. Node 22.14.0/24.6.0 remain ineligible; neither is used by this proposal. Earlier observations and security findings remain history. GS-O026 remains open for actual static-host acceptance; GS-O025 remains open for Free operations. GS-O003 still blocks full cutover; GS-X002 still gates three Technical routes. GS-O005/GS-O021 accepted owner decisions are not reopened; GS-O024 deferred and GS-O022 optional.

## Scope and evidence

Isolated worktree: `C:\Users\atikm\.codex\worktrees\gs-host-004\Gridsmith Ltd`; branch `codex/gs-host-004`; starting SHA `9508412e1cc2396e4deafea30d08e3ab9d606b19`. The primary checkout has concurrent GS-VIS/GS-SEO changes; none were edited. This audit covers the committed tree plus separately identified read-only working-copy differences. In particular, continuous review rotation/drag exists in the GS-VIS working copy, while committed reviews step every six seconds. The prototype overlays only read-only copies of ReviewCarousel and its CSS; it is **not** an exact-SHA release candidate.

Local/source checks, public official documentation and scoped account metadata were inspected. No raw provider response, secret or lead data is retained in these documents. Supabase read-only metadata confirms Gridsmith Org is Free, both named projects ACTIVE_HEALTHY, Preview has zero Edge Functions. No database SQL, form or mail probe ran. GitHub metadata confirms `atikmurtaza/Gridsmith-Ltd` is public, user-owned and not archived. Remaining quota headroom, Hostinger account SSH/CDN settings, Sanity webhook slots and Resend account capacity were not proved.

Full feature inventory, every server-compatible TSX module and environment classification: [server dependency matrix](GS-HOST-004-SERVER-DEPENDENCY-MATRIX.md).

## Current server dependency and target matrix

| Current runtime boundary | Why it exists | Replacement |
|---|---|---|
| Two form adapters plus shared use-server submission | Validation, honeypot, UUID, private Supabase insert and status | Public Edge intake; pure schemas reused; private atomic DB operation |
| Next after() and notify module | Private Resend/optional Slack fan-out after saved lead | Durable outbox + scheduled Edge worker; optional waitUntil wakeup |
| Three dynamic route handlers | Live RLS drift/refusal probes, validation/mail specimen and platform timeout specimen | External operational checker; retain nonproduction specimens; omit handlers in static profile |
| Dynamic SSR throw specimen | Deliberate render-failure proof | Retain normal Next CI/Preview, exclude static delivery |
| Unknown-slug rendering | Service/insight/legal defaults allow request-time fallback | Complete authorised params, dynamicParams=false, rebuild and real host 404 |
| Freelancer revalidation cache | Official retrieval/moderation and ~24h refresh/LKG | Controlled build ingestion or sanitised external feed, with approved freshness/retention controls |
| Default image endpoint | Design SVG explicitly uses /_next/image; generic Media would do so if used | Build 1080px WebP; responsive pre-generation/custom loader for future Media |
| Next HTTP layer | Headers, status redirects, slash routing, custom error status | Hostinger .htaccess/error-document configuration and served parity checks |

**Build-time (A):** published Sanity/company/service/article/legal content, server markup, fonts/assets, metadata/JSON-LD, sitemap/robots, prepared images, deployment configuration and review filtering. **Browser (B):** scenes, rotation/drag, reduced motion, disclosures, pure Path Finder, cookie notice and form UI. **Existing external boundary (C):** intake, DB admission/commit, notification retries, operational checks and review refresh where needed. **Persistent Hostinger Node (D): 0 in the target.** Current source still requires Next runtime until migration completes.

## Static export blockers

These are source/behavior findings, not a pasted build failure. Next 15 documents static RSC and client components as supported; request-dependent APIs, Server Actions, ISR, default image loader and Next-managed HTTP configuration are unsupported. The normal application configuration remains unchanged.

| ID | File / feature | Why incompatible or unsafe | Replacement / behavior change | Risk / acceptance |
|---|---|---|---|---|
| H4-01 | lib/leads/action.ts; ContactForm | Runtime Server Action bound to useActionState | Call Edge contract; preserve field errors/pending/success and HTML fallback | Lost submission, false success or inaccessible failure; synthetic Preview proof required |
| H4-02 | lib/leads/pressAction.ts; PressContactFlow | Server Action + request redirect | Same endpoint, Press discriminated schema, fixed thank-you destination | Memoir acknowledgement/optional branches/PII must not be lost |
| H4-03 | lib/leads/submit.ts; notify.ts | Third use-server module, private insert, Next after lifecycle | Private intake RPC/outbox/worker; no server imports in static form graph | DB/mail atomicity and retries must be proven; no credentials in bundle |
| H4-04 | app/api/rls-drift/route.ts | force-dynamic, auth/request state and refusal INSERT probes | External authenticated job; retain HTTP anon vantage and all active branches | Cannot simply export GET as a fixed success JSON; no execution in this phase |
| H4-05 | app/gridsmith-lead-probe/route.ts; gridsmith-timeout-probe/route.ts | POST, force-dynamic and deliberate long runtime; exclusion currently runtime-only | Preserve normal probe source, exclude files from static build tree | pageExtensions page exclusion alone does not remove these handlers |
| H4-06 | app/(marketing)/gridsmith-ssr-throw-probe/page.probe.tsx | Deliberate dynamic render exception | Existing production pageExtensions exclusion in static profile | Retain committed test subject and source suite |
| H4-07 | Three services/[slug]/page.tsx; components/content/servicePage.tsx | default dynamicParams=true permits unknown-slug execution | Explicit false in static profile, generate all eligible slugs | New/unpublished/deleted routes wait for deployment; unknowns genuine 404 |
| H4-08 | insights/[slug]/page.tsx; legal/[slug]/page.tsx | Same dynamic fallback; legal params hardcoded even when no document | False; only published, authorised, existing docs enumerated | Missing known legal params must not export 404 markup served as HTTP 200 |
| H4-09 | lib/reviews/freelancer.ts:451 | revalidate:86400 requires ISR runtime; API moderation currently fetches on server | Build retrieval/cache without ISR or external sanitised feed | Freshness, outage LKG and current terms/retention remain release gate |
| H4-10 | components/primitives/Media.tsx | Default next/image optimisation is runtime-dependent | Build responsive assets or bounded static loader; unoptimized for appropriate small files | No active Media consumer found; future use must not ship giant originals |
| H4-11 | components/divisions/design/DesignArtwork.tsx:17 | SVG href hardcodes runtime optimiser independent of next/image import | Same 1080px alpha WebP prepared at build; preserve coordinates | Global images.unoptimized alone does not fix this URL; visual fidelity proof |
| H4-12 | next.config.ts headers()/redirects() | Export supplies files, not HTTP rules | Generate Hostinger .htaccess from canonical policy/map | Lost security headers, wrong statuses/query behavior/CDN overrides |
| H4-13 | lib/seo/site.ts; four layouts; robots.ts | INDEXABLE tied to VERCEL_ENV production | Explicit validated static deployment target + exact origin; retain Preview behavior | Spoofing VERCEL_ENV risks probes/SEO coupling; temporary host must stay noindex |
| H4-14 | app/sitemap.ts | Static generation supported but literal legal routes ignore actual content/gates | Generate from emitted authorised route manifest; omit gated/missing pages | Existing sitemap could advertise absent legal routes; no artificial publication |
| H4-15 | app/global-not-found.tsx; host clean-URL routing | Exported 404 exists, but files alone do not provide correct HTTP error/routing | local ErrorDocument /404.html, clean .html rewrite; no SPA wildcard fallback | Hostinger status/CSS/noindex/CDN need actual served proof |
| H4-16 | Existing verify/build/served scripts; CI/probe/header lists | Gates expect Next manifests, endpoint behavior and development route subjects | Preserve normal suite; add registered static-profile parity evidence/probes | A Next green is not an exported-host green; no threshold/list bypass |

No executable next/headers import, request cookies()/headers(), draftMode, middleware, rewrites, revalidateTag/Path, unstable_cache, intercepting route or ImageResponse/next/og handler was found. Client document.cookie is independent of Next cookies(). Digital's local helper named after() schedules browser animation; the one imported Next after() schedules mail. No hidden runtime image consumer was inferred merely from a comment.

## Sanity architecture and CMS updates

Current public reads already occur during static generation: published perspective, public `development`/`production` datasets, no read token, useCdn:false, explicit projections, draft exclusion. Company details are mandatory. About/Approach, all studio catalogues, services and future published Insights can be built without visitor Sanity requests. Keep RSC; do not convert whole pages to client components. Future private dataset reads would need a separately scoped build-only read token, never a write token/browser token.

Build with an explicit production dataset and clean fetch cache, validate seed/company/publication gates, freeze a content/revision manifest, then emit every authorised slug. Published Insights get new pages at the next build; empty published-post list gives an honest static index. Deletes remove pages on the next release. GS-O003 legal and GS-X002 Technical exclusions are structural in both route manifest and sitemap. Existing footer/legal links still make full launch conditional on legal migration; static export does not close that gate.

Sanity Free currently documents **two** GROQ webhooks; configured slots and usage are unknown. Webhook POST supports custom body projection and Authorization header, so direct Sanity → GitHub **workflow_dispatch** can use a fixed approved ref and declared inputs. A relay is not automatically necessary. Prefer a one-repository fine-grained token with Actions:write over repository_dispatch's broader Contents:write; never share token-bearing webhook configuration. A successful dispatch only starts a job, not a successful publication. Use concurrency, content revision receipts, failure visibility and reconciliation; webhook retries are bounded.

Dispatch workflow must exist on the default branch. It does not exist for this proposed static deployment, and no main merge is authorised here. Design only: no webhook/secret/workflow/provider automation was configured. Manual controlled build/deploy remains fallback. GitHub schedules are default-branch based, may be delayed/dropped and public schedules disable after 60 inactive days; they do not guarantee a strict review-refresh or DB-availability deadline. A 5–30 minute content delay is the acceptable target, **not measured** for the future static pipeline.

## Forms, database and Resend

Production project `dqiutgmxillhsbzgnlsx`; isolated Preview `qfgpwumvvtizeamkynes`. Existing receipts record RLS 5/5, zero policies/public grants and bounded leads after GS-T004. This phase verified only project metadata; it did **not** re-audit the live catalog, touch rows or execute the drift route. Preserve those access controls.

| Alternative | Assessment |
|---|---|
| Direct browser INSERT through anon RLS | Rejected as primary: reopens intentionally closed public insertion and cannot provide the complete nested Press validation, abuse admission and private mail path alone |
| Public anonymous RPC | Technically possible if carefully bounded, but exposes an unauthenticated privileged write capability without the needed request/body/honeypot/mail controls; not preferred |
| Public intake Edge Function + private transactional operation | Preferred: one auditable boundary validates input, enforces quotas/admission, commits lead/job and keeps credentials external |
| DB trigger/queue alone | Useful after admission but does not replace validation/spam/HTTP failure handling; useful for atomic durable mail work |

Proposed intake endpoint accepts only known contact/Press contract fields. Preserve shared Zod bounds, Unicode-byte payload cap, URL-in-name rejection, branch schemas, required memoir acknowledgement and honeypot success-without-write behavior. Set explicit request byte/depth/field-count/timeout limits before parsing. Client validation is convenience; the endpoint is authoritative. Return bounded error maps and no SQL/provider bodies or internal configuration names.

Edge public invocation must be intentional (`verify_jwt` settings depend on the selected public-key/invocation model); an anonymous/public key is not bot authentication. Enforce exact production/preview origins and CORS, but recognise scripts can forge Origin and bypass CORS. Reject arbitrary redirect/recipient/URL fields; no user URL fetching. Do not make CORS the spam control.

Use a DB transaction for atomic global admission bucket + lead row + notification job, with a queue ceiling and idempotency token/request consistency. No raw IP, IP hash, fingerprint or user-agent storage; no guessed trusted forwarding header. A global bound is privacy-preserving but can let one attacker consume admission capacity; test saturation/failure UX and Free invocation limits. Per-IP controls or third-party challenges require separate proved provenance/privacy/CSP approval; do not silently add them. Hostinger static assets do not protect the direct Edge endpoint from abuse.

Endpoint-held service-role capability is equivalent to the current private writer, not an anon grant. Prefer a narrowly authorised private RPC/role where supported; do not add SECURITY DEFINER or broad grants to fix permissions. If using the existing service-role PostgREST channel, keep its key solely in Edge secrets, hardcode table/operation, construct rows only from parsed whitelisted data, and expose no read/update/delete/general SQL proxy. Test privilege boundaries in Preview before any later authorised production migration. Pure schemas can run in Deno; remove node:crypto/Next imports in the external adapter and use platform crypto. No function or RPC was implemented here.

Resend currently runs only from notify.ts via HTTPS API. Move its secret, sender and internal recipient to the worker. The existing notification contains identity/division/service/record id; full enquiry text stays in Supabase. Keep Slack unused. Commit before acknowledging: notification failure must not make a durable lead look lost. A transactionally persisted outbox/queue enables claimed leases, bounded backoff, attempts, idempotent provider keys and operator-visible terminal failures. EdgeRuntime.waitUntil can wake work after response but is not retry storage; database queue visibility is not exactly-once email delivery. Define ambiguous provider response/retry semantics and reconciliation before release.

Preserve progressive submission wherever technically reasonable: JS receives structured errors and navigates to the fixed Press thank-you route; HTML form fallback posts to the external endpoint, which returns a fixed 303 PRG to Hostinger static confirmation/error pages. Do not depend on Edge-hosted HTML: Supabase documents default-domain HTML-serving restrictions, and its custom-domain feature is paid and excluded. Exact default-domain POST redirect delivery must be proved in Preview. No enquiry/Press answers in URLs, browser persistence, logs or redirect parameters. The JS path retains the field error map. A general no-JS retry page alone is insufficient: H4-B must identify each detected invalid field and describe its error (WCAG 3.3.1), suggest known corrections (3.3.3), and preserve or make available valid prior answers where 3.3.7 applies. This is a binding accessibility acceptance gate; the static-redirect design has not yet established how it meets those requirements. Prove the complete flow and privacy-safe value recovery in Preview before accepting that adapter. CSP form-action must explicitly allow the selected endpoint origin for no-JS fallback; fetch uses connect-src. Endpoint URLs are public configuration; internal secrets are never exported. No-JS general confirmation/error treatment must not become a silent JS-only downgrade.

Supabase Free documents 500,000 invocation allowance shared across projects, 150s worker wall time, 2s CPU/request and 256MB memory. Remaining allowance/egress/DB headroom are unknown. Cron/pg_net/Vault and Queues offer existing scheduling/durable work capabilities, but extensions, permissions and jobs are not assumed configured. Free pause/resume, non-writing health checks, backups, operator custody and recovery remain GS-O025. Resend existing-plan capacity/sender acceptance must be established without new purchase or production mail probes.

## Reviews architecture

Current source uses official Freelancer review and taxonomy requests, sends **no OAuth token/cookie**, validates/filters on the server and exposes only `FreelancerReview` props; fetch has `revalidate:86400`. Its unauthenticated endpoint behavior differs from documented auth scopes and may stop working. Current source cites historical API T&Cs §5.1 (refresh cached data at least every 24h) and §5.3 (restricted storage). Fresh official API terms could not be read in this phase: candidate URLs 404 and developers site is a JS shell. **No claim of current terms compliance.**

Preferred order evaluated:

1. **Build-time retrieval**: technically proven by the representative export. Fetch official data only in controlled ingestion, validate/count/moderate first, pass only approved projection into build. No Freelancer credential needed by today's code; if auth becomes required, secret belongs in ingestion only.
2. **Generated sanitised snapshot**: technically suitable as a transient cache. Reject a permanently checked-in snapshot/Git history or retained raw provider/build cache as the default. Static release archives and rollback copies containing reviews are still copies; their retention must be covered by current terms, not ignored because only 11 quotes remain.
3. **Existing external Edge capability**: if permanent review embedding is not allowed, serve an expiry-enforced approved-data feed from existing Supabase Edge; browser consumes only that feed and keeps the cylinder/drag/pause behavior. This avoids exposing raw API data/credentials and unbounded immutable review assets. It introduces visitor feed availability and requires an explicit no-JS/review-HTML decision plus accessible loading, unavailable/expired-feed and retained-content behavior; no silent switch occurred.

Recommended H4-C resolves current terms/retention **before selecting the deployed review carrier**. Target a scheduled refresh well within 24h plus content-build refresh, bounded cache lifetime, failure alarms and an expiry-safe fallback. GitHub cron alone cannot enforce freshness. Last-known-good remains available within the permitted freshness/retention envelope; perpetual stale publication is not asserted safe. If the API/terms cannot be confirmed, report that release blocker and an explicit behavior decision; do not invent a compliant permanent snapshot or silently remove the feature.

Preserve **13 known total / 11 publishable / 2 permanently withheld**. Current transformation withholds the two by body rules; WITHHELD_REVIEW_IDS is empty. H4-C must pin permanent exclusion of IDs `22108992` and `22100632` before generic filtering, with independent branch proofs, so later provider wording changes cannot republish them. Unknown or changed reviews require human approval; count parity alone cannot prove identity/approval. Keep verbatim quotations, public author display, ratings/date/source; no company names, project titles/URLs, financial data, raw users/project payload, withheld text or reasons in browser assets. Expire/purge review-bearing rollback/artifact/cache copies according to approved terms. The local prototype is a short-lived proof, not a production cache policy.

## SEO, redirects, headers and errors

Keep titles/descriptions/canonical/Open Graph/Twitter declarations in generated HTML. Current committed metadata has OG title/description and no ImageResponse/OG generator; GS-SEO adds masterOpenGraph/copy/link work concurrently and is not overwritten or approved by this audit. Current Organization JSON-LD lives in Footer and uses escaped jsonLdHtml. Future Service/Breadcrumb/Article structured data should be generated from true approved records; architecture can support it but none is claimed implemented here.

Replace Vercel-only INDEXABLE authority with an explicit validated static build target. Production requires exact live HTTPS origin and independent release authorization; local/temporary/Preview outputs stay noindex/nofollow and disallow. Do not use VERCEL_ENV=production to fake this transition. A noindex tag is not access control; restrict temporary verification hosting where available, avoid discovery/domain attachment, and test headers on all file/error paths.

Emit robots.txt and sitemap.xml at build. Sitemap uses the actual eligible emitted routes, CMS publication revision and meaningful lastmod where available, not a fabricated content-edit date. Omit six legal documents while GS-O003 open and the three Technical services while GS-X002 open; omit confirmation/probe/error URLs. `/press/path-finder` has its own noindex metadata and is currently absent from sitemap: keep that deliberate posture. Full cutover still awaits approved legal content and working footer destinations.

| Current application redirect | Hostinger mapping design | Required proof |
|---|---|---|
| `/privacy-policy` with optional trailing slash | Legacy .htaccess rule → `/legal/privacy`, permanent **308**, before slash normalisation | One hop, unchanged query, destination 200 only after GS-O003 |
| `/terms-and-conditions` with optional trailing slash | Legacy rule → `/legal/client-terms`, 308 | Same; do not choose a different legal instrument |
| `/:path+/` → `/:path+` | Trailing-slash 308 after legacy map; root exempt | `/about/` and service/query variants one hop; no DirectorySlash chain |

These are the two entries in legacy.json plus the explicit Next slash rule; there are no other application redirects. WordPress `/hello-world/`, `/category/uncategorized/` and `/uicore-cd/*` have no successor and remain genuine 404; `/?uicore-tb=...` is a query on `/`. Press action success is separate POST behavior, replaced with a fixed 303/JS navigation, not a legacy 308.

Generate .htaccess with legacy rules first, directory-listing/MultiViews policy, clean extensionless HTML mapping, existing files/hashed assets passthrough and local `ErrorDocument 404 /404.html`. Preserve query strings through redirects and internal rewrites. Retain slashless canonical URLs; do not change trailingSlash merely to simplify deployment. DirectorySlash interaction with a physical `design/` directory needs a specific proof. Never rewrite all missing paths to index.html or let 404.html return 200. Apache docs support R=308 and local ErrorDocument, but exact Hostinger module/CDN behavior is **UNVERIFIED**; use H4-F disposable tests before accepting parity.

| Current header | Static-host mapping / restriction |
|---|---|
| Content-Security-Policy | Same policy generated into .htaccess; script/style existing inline allowances retained, base/form/frame/object/worker policies retained; exact Edge origin additions reviewed for form-action/connect-src |
| Referrer-Policy | strict-origin-when-cross-origin |
| X-Content-Type-Options | nosniff |
| X-Frame-Options / frame-ancestors | DENY / none |
| Permissions-Policy | camera/geolocation/microphone/payment/usb/browsing-topics disabled |
| Strict-Transport-Security | max-age=31536000 on appropriate HTTPS live origin; no new includeSubDomains/preload |
| x-gridsmith-dataset | Actual build dataset from artifact receipt; retained so served gates ask the host |
| X-Robots-Tag | All temporary/Preview responses noindex/nofollow/noarchive; errors noindex; do not accidentally blanket live pages |
| Cache-Control | Hashed assets immutable; HTML/data/robots/sitemap/errors bounded as below; do not cache intake/errors/private data |

Hostinger documents .htaccess and mod_headers examples, not every module/version or end-to-end CDN security-header/status outcome. Unsupported security enforcement is a host acceptance stop, not permission to remove a header. The local Python server demonstrates files/404 semantics only; it does not validate Hostinger rules, HTTP headers, compression or CDN.

Exported global 404 retains its own document/theme/fonts. global-error remains a browser error boundary. A static request cannot have a Next server-render crash; provider file/HTTP failure and Edge submission failure still need truthful accessible error paths. Keep public/500.html where host error configuration can use it, but do not claim Next FUNCTION_INVOCATION_TIMEOUT behavior survives file hosting.

## Hostinger build, delivery and rollback

Build outside Hostinger using a currently reviewed supported Node 24 patch, locked npm ci, normal TypeScript/component model, publication/secret/budget gates and separate static contract checks. Prototype used **Node v24.21.0**, official index latest Node 24 on 4 October, dated 7 September 2026; download checksum matched official HTTPS SHASUMS256.txt. No global runtime/package policy changed; the broad >=24.15.0 range is not a security certificate. Recheck advisories/dependencies at each release and use a patched build environment. Normal next dev and protected Next Preview can remain; a static-specific profile must avoid importing Server Actions and exclude dynamic specimen handlers without deleting them.

GitHub repository is public. Standard GitHub-hosted runners are documented free for public repositories; larger runners are paid and excluded. Artifact storage is finite/shared; current account usage is unknown. Retain few bounded receipts and short-lived deploy artifacts, not raw CMS/Freelancer/PII/secret data. Current run **37101353410** at source/programme `8ed9a5a3` succeeded; install 57s, Build **24s**, verify job about 73m06s. Its two evidence artifacts total **86,966,789 bytes**, not the site deployment artifact. These are historical CI observations, not future static pipeline timings. Starting SHA 9508412e has its own successful CI run 37056516953; the prototype overlay is not that SHA. Future static deployment must meet its own exact-source/content gates; existing CI is not bypassed for speed.

Public production Sanity read needs no token. Static build needs **no** Production service-role, DB connection, Sanity write, Resend or Slack secret. Deployment job separately receives narrowly scoped SSH identity/path credentials and verified host key, never in bundles/logs. Sanity dispatch token stays in webhook configuration; review OAuth, if required later, stays only in controlled ingestion. Public-repository artifacts/logs must be treated as downloadable.

Hostinger Business documentation supports externally uploaded HTML and SSH/SFTP (documented SFTP port 65002; actual connection details/host key unknown). Prefer account-home-restricted **SFTP/SSH** with explicit document-root path. Use pinned known_hosts, scoped identity, rsync/SFTP without public ZIP/source/env/node_modules/.next upload; no password/host-key bypass. FTPS may be a fallback if TLS/certificate/supported account configuration are proved; plain FTP is not a secure fallback. Hostinger Git/source deployment is not assumed to give build-artifact transactions. Upload only export files plus reviewed HTTP config, never the source package. **No upload/deployment executed.**

Serving: existing Business static web server returns HTML/CSS/JS/fonts/WebGL/image files. No Next start, standalone server or managed Node process is needed for the public request path. Existing managed runtime-watch probe is a separate candidate; this phase did not change, stop or redeploy it. WordPress remains live and unchanged.

Business CDN is documented included without separate subscription/per-visit fee, subject to domain pointing/nameserver prerequisites. Current configuration is not verified. Static files default cached up to two hours; HTML defaults DYNAMIC unless Cache-Control allows it. Plan immutable long caching for hashed _next files; stable public paths need versioning or shorter TTL. Proposed HTML browser revalidation with short shared-cache TTL; sitemap/robots revalidate promptly, 404 short/no cache with status retained, build images versioned. Review-bearing payloads require the separate freshness/retention policy. Edge intake/data errors are no-store. Whole-site flush is documented, individual URL purge is not; 308 caching/status behavior unknown. Do not change DNS/nameservers/CDN to force this plan in the audit.

Cutover design (not executed):

1. Back up current WordPress files, database, uploads, .htaccess and host/CDN config outside public_html; verify recovery privately. Preserve mail/DNS and existing hosting.
2. Upload full checksum-manifested static release to a sibling directory outside the live document root, with no public archive and noindex protections for any verification mount. Verify paths, headers/404/redirects/assets and absent secrets/probes before exposure.
3. Prefer a verified document-root/release-pointer switch if existing hPanel/SSH supports it. Do not assume symlink roots or atomic document-root changes are allowed.
4. If only directory rename is available, use same-filesystem staged/live rename with controlled maintenance and recorded rollback. Two renames have a gap and are **near-atomic**, not atomic; never incremental upload over the live tree. Preserve old hashed assets for in-flight pages, subject to separate review-data retention.
5. Recheck fresh HTML/robots/sitemap/canonical headers, purge CDN if authorised/required and verify cold/warm origin+edge. Fixed-source/content receipt and completed gates precede switch. Existing WordPress is retained privately for the approved rollback window.
6. Roll back by restoring verified previous document root/config/WordPress DB if needed, then required CDN invalidation and served checks. A stale review-bearing static release must not be blindly restored; rebuild/reinject permitted current review data or use the approved feed. No DNS alteration is necessary merely because the same account/site starts serving files; actual DNS/CDN prerequisite changes would require the later release authority.

## Security, performance and development model

Current target browser → Hostinger Next/Node → services becomes browser → Hostinger files and narrowly scoped public Edge form/feed endpoints. This removes Next RSC/Server Action/image-runtime parsing from the Hostinger public application request path and removes its vulnerable managed Node dependency. It does **not** remove Hostinger HTTP/TLS infrastructure, browser JS/dependency risks, external endpoint validation/abuse risk or service-role privilege. Security improvement is scoped to removed application runtime surfaces; not a blanket secure-site claim.

Expected TTFB/caching benefit is qualitative. Full HTML reduces crawler rendering dependence; current pages already prerender, so static export alone need not reduce client JS/TBT or increase content quality. WebGL GPU cost and lazy interaction code remain. Pre-generation avoids image endpoint work; naive unoptimized original images would worsen network/LCP. Preserve dimensions/fonts/first-paint theme and reserved layouts to protect CLS. External form/feed latency and build freshness are tradeoffs.

No invented speed/SEO score or benchmark delta. Prototype asset measurements: original Design PNG **3,317,305 B**; generated 1080px WebP **41,742 B**. Same geometry and byte size demonstrate a viable image approach, not a visual-regression acceptance or measured LCP improvement. Three-route artifact **6,022,905 B / 70 files** at first browser verification, includes complete current public assets and unused original logo; not an extrapolated full site size. Exact Linux Lighthouse, static bundle/gzip, device-GPU, mobile/keyboard/axe/no-JS, visual comparison, compression and warm/cold Hostinger CDN measurements remain H4-E/G work.

Keep local next dev, TypeScript and current RSC/client composition. Use two explicit build profiles: existing Node/Preview verification and separately staged static production source/contract profile. Pure schema sharing avoids duplicate validation rules. CI must assert lists/manifests, generated routes, secrets, host headers/redirect/error states and inactive probe omission. New gates require committed subjects and independent deliberate-failure branches; retain normal gate specimens. No build/env strategy was enabled in the production application.

## Representative prototype

Reproducible fixture preparer: `GS-HOST-004-PROTOTYPE.mjs`; loopback file server: `GS-HOST-004-STATIC-SERVE.py`; targeted browser verifier: `GS-HOST-004-VERIFY.mjs`. Generated fixture and receipts are outside the checkout at `C:\Users\atikm\.codex\worktrees\gs-host-004\proof\gs-host-004-prototype`, runtime at sibling `gs-host-004-runtime`. Prototype copies source then modifies **only those disposable copies**: output export, three-route subset, closed representative params, build-only review fetch, generated logo image. Every omitted product route/boundary is documented above; omitted forms are not called solved. Initial output was moved from ignored out/ because the existing source-inventory guard rejects unclassified top-level trees; no checker bypass or exclusion change was made.

Routes: `/`, `/design`, `/design/services/brand-identity-systems`. Four-root pattern represented by unchanged marketing+Design root layouts; generated 404 is preserved. Read-only overlays:

- GS-VIS ReviewCarousel SHA-256 `5f74338ec08d2d9571d994115020cc4bffe8cd0080bfe9c2e42cd65cfbe70dfe`.
- GS-VIS home CSS SHA-256 `fd8393e20300a942fa70d4b6e3b1678ecc4b241c6e1d7c8a4b8e6a8fc61966f4`.

First preparation omitted existing css.d.ts; compilation succeeded but TypeScript correctly failed the missing CSS import declarations. Copied that existing declaration and started a fresh .next build; no type/lint bypass. The corrected build passed compile/type/lint/static generation/export. Browser verifier checks concrete subjects/states, not only file existence. An initial Design-state assertion used an incorrect class; it failed and was corrected to the source's data-enhanced attribute before the final reading.

**Proof scope:** static HTML exists with SEO H1/title/canonical/noindex and theme tokens. Eleven currently filtered publishable reviews rendered; this count does not independently certify review identity/owner approval. No withheld IDs/body marker or privileged variable name/runtime image URL in HTML/JS/RSC/data assets. Hydration drove continuous rotation, pause, pointer drag and reduced-motion static grid. Master initialised WebGL using the existing explicit software-test affordance; no real-GPU/performance claim. Design choreography initialised with data-enhanced=true and its active chapter changed 0 → 3 after scroll; an actual ordinary service link reached exported service HTML. File server returns branded unknown-route document with HTTP 404 and noindex; no Next Node server runs behind these test requests. This is a representative proof; Digital/Press/forms/full route export and Hostinger delivery remain unproved.

Aggregate evidence: [prototype receipt](GS-HOST-004-PROTOTYPE-RECEIPT.json). The exported file manifest is hashed in the receipt. Existing Node declaration/CI gate parity check passed with 55 registered gates; that is a parity check, **not** execution of all 55. Existing secret gate passed against committed source/public and byte-identical copied prototype client chunks (231 source files, 23 client chunks, 19 public assets); no actual secret values were supplied, so 0 values were checked. The independent export scan covers HTML/JS/RSC/data for the named forbidden markers. Existing control-character check passed across 389 source files; phase files were also scanned directly. Whitespace and application/config/dependency/CI source preservation passed. Full normal verification/production build, Linux Lighthouse and hosted acceptance were not run. The local file server was stopped after proof.

Reproduce in a fresh isolated worktree with its normal dependencies and reviewed Node binary. Set GS_HOST_004_VIS_SOURCE only for the explicitly recorded GS-VIS supplemental overlay; without it the committed six-second review carousel is copied, so use the matching verifier rather than claiming continuous-drag coverage. Run launch/publication checks independently; this fixture is not a release pipeline and never performs migration/deploy or form submissions. Local proof receipts contain aggregate results only.

## Independent phase reviews

Brief compliance and content-integrity reviews found no remaining scope or unsupported-claim issue. Content integrity independently checked the 93-module inventory, artifact totals and overlay/image measurements. Accessibility review confirmed that the receipt does not claim full WCAG/axe/keyboard/no-JS or hosted acceptance. Two preservation requirements remain: the no-JS form error/recovery contract above, and the inherited GS-VIS review cylinder's no-JS fallback. Its CSS activates the ring without a successful-JS enhancement guard, leaving controls inert and rear reviews visually inaccessible when JS is disabled. Later adaptation must retain a readable static list until enhancement succeeds; the prototype proves only the recorded JS and reduced-motion paths. No concurrent GS-VIS source was changed.

A supplemental static-route axe attempt failed in its wrapper before analysis (`AxePuppeteer.default is not a constructor`); it produced no accessibility result. Its loopback server was stopped. Full accessibility acceptance remains pending, including keyboard alternatives to dragging and the complete no-JS submission/review states.

## Reversible migration plan

| Phase | Scope and acceptance | Reversal |
|---|---|---|
| H4-A | Static compatibility foundation: explicit host-independent target/indexing policy, static source profile/probe exclusions, complete authorised params, build-only content, prepared images and manifest; preserve normal Next dev/CI | Remove/revert static-profile-only changes; existing Node/Preview profile remains |
| H4-B | Forms/dynamic boundary: Preview-only Edge contract, private transactional admission/lead/outbox, mail worker, no-JS/error behavior; synthetic-only privilege/abuse/idempotency/retry proofs | Roll back Preview functions/schema via reviewed migration; production unaffected |
| H4-C | Reviews/build data: current terms, approved identity set, permanent withheld IDs, expiry/retention/LKG and chosen build cache/feed; prove no raw/withheld data or secret in artifact | Revert carrier/ingestion independently; keep approved current data only, not stale archive |
| H4-D | Static SEO/redirect/header parity: sitemap/robots/metadata/artifact manifest, HTTP config and permanent adversarial specimens | Revert generated config/profile; no live switch |
| H4-E | Exact local full static artifact: all eligible routes, data/assets, interactions, no-JS/forms against isolated Preview, security/accessibility/SEO/budget proofs; checksum receipt | Discard candidate; source/runtime profile unchanged |
| H4-F | Separately authorised isolated Hostinger static deployment: account SSH/key/path/rename/CDN/status/header/canonical/noindex acceptance; no live domain | Remove/revert scoped isolated release only after reviewed path/receipt; no WordPress change |
| H4-G | Exact artifact Hostinger performance/security/SEO RC and recovery rehearsal; zero new cost; owner review of preserved visuals/product behavior | Keep live WordPress; retire isolated RC safely |
| H4-H | Dedicated final cutover after GS-O003, relevant scope/operations/hosting gates and explicit owner authorisation; verified WordPress backup, deployment switch and rollback | Restore verified WordPress/config/CDN through approved rollback runbook |

Each phase is independent and separately authorised; none is executed by this recommendation. GS-X002 gates Technical only, not an excuse to publish those routes for export completeness. Final full cutover remains blocked by external gates.

## Cost, production safety and repository

Additional hosting **£0**; additional paid services **£0**. Existing Business/Sanity/Supabase/Resend/GitHub capabilities only, within verified allowances at implementation; no capacity/pause/delivery guarantees inferred from Free availability. No purchase, plan enablement, new hosting recommendation or commercial Vercel serving.

DNS/domain attachment: unchanged. WordPress/live site: unchanged. Production Supabase: metadata read only, no DB writes/SQL/form probes. Production Sanity: public build reads only, no writes. Production forms/mail: no submissions/delivery. Main: no merge/push. Hostinger: no file upload, settings, deployment, live-domain action or probe change. Concurrent GS-VIS/GS-SEO worktree: no writes.

Changed files are the two requested documents, three local proof harnesses, aggregate JSON proof receipt and documentation-only control/owner handoff updates. Application, Next config, package/lock, CI, scripts and runtime source are unchanged in the isolated worktree. **Commit: none; Push: none.** Generated fixture/runtime/output remain outside the checkout; only exported files would ever be deployed in a later phase. Final source-preservation/whitespace/secret checks and browser receipt are recorded before handoff.

## Primary sources checked 4 October 2026

Web search/open returned no usable content; official pages were retrieved directly over ordinary HTTPS. These sources establish documented capabilities, not account configuration or served-host acceptance.

- [Next 15 static export](https://nextjs.org/docs/15/app/guides/static-exports), [Next after](https://nextjs.org/docs/15/app/api-reference/functions/after).
- [Node release index](https://nodejs.org/dist/index.json), [v24.21.0 checksums](https://nodejs.org/dist/v24.21.0/SHASUMS256.txt).
- [Hostinger SSH](https://www.hostinger.com/support/1583645-how-to-enable-ssh-access-in-hostinger/), [SFTP](https://www.hostinger.com/support/5972689-how-to-connect-to-your-hosting-using-sftp-in-hostinger/), [HTML/file upload](https://www.hostinger.com/support/1869164-how-to-upload-backups-with-ftp-in-hostinger/), [.htaccess](https://www.hostinger.com/support/1583307-how-to-create-an-htaccess-file-at-hostinger/), [headers example](https://www.hostinger.com/support/which-web-standards-and-connectivity-features-are-supported-at-hostinger/), [error pages](https://www.hostinger.com/support/1583295-how-to-customize-your-website-s-error-pages-in-hostinger/).
- [Hostinger CDN plan inclusion](https://www.hostinger.com/support/which-plans-include-hostinger-cdn/), [cache behavior](https://www.hostinger.com/support/how-hostinger-cdn-caching-works/), [cache headers](https://www.hostinger.com/support/8052370-advanced-cdn-header-management-at-hostinger/).
- [Apache Rewrite flags](https://httpd.apache.org/docs/2.4/rewrite/flags.html), [ErrorDocument](https://httpd.apache.org/docs/2.4/mod/core.html#errordocument).
- [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [dispatch](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event), [events/scheduling](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).
- [Sanity Free pricing](https://www.sanity.io/pricing), [webhooks](https://www.sanity.io/docs/content-lake/webhooks), [HTTP webhook reference](https://www.sanity.io/docs/http-reference/webhooks), [delivery/retry](https://www.sanity.io/docs/content-lake/webhook-best-practices).
- [Supabase changelog](https://supabase.com/changelog.md), [Free billing](https://supabase.com/docs/guides/platform/billing-on-supabase), [invocations](https://supabase.com/docs/guides/platform/manage-your-usage/edge-function-invocations), [limits](https://supabase.com/docs/guides/functions/limits), [custom domains](https://supabase.com/docs/guides/platform/custom-domains), [background tasks](https://supabase.com/docs/guides/functions/background-tasks), [scheduling](https://supabase.com/docs/guides/functions/schedule-functions), [Queues](https://supabase.com/docs/guides/queues).
- [Freelancer official developer site](https://developers.freelancer.com/): API terms text was not retrievable; source's historical quotes are not a current legal assurance.
- W3C accessibility acceptance references: [error identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html), [error suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html), [redundant entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html).

## Recommendation

Implement **Next static production output built on standard GitHub Actions → existing Hostinger Business static document root**, with **existing Supabase Free Edge intake + durable private notification worker → existing Resend**. Keep Sanity build reads, RSC SEO content, all browser scenes and GS-VIS review interactions. Resolve review carrier/retention in H4-C rather than embed a permanent unreviewed snapshot. Full-route, host, security/performance and recovery acceptance remain required; the successful small proof is sufficient to start the compatibility foundation, not to launch.

## Next Phase

**H4-A — Static compatibility foundation. STOP.**
