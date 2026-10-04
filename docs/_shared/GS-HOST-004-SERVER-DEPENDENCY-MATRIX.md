# GS-HOST-004 — Server dependency matrix

Audit date: 4 October 2026. Committed source: `9508412e1cc2396e4deafea30d08e3ab9d606b19`; isolated branch `codex/gs-host-004`. Concurrent GS-VIS/GS-SEO source was inspected read-only. No production application configuration changed.

Classification: **A** build-time; **B** browser; **C** existing external service; **D** persistent Gridsmith server. Classification describes a proposed replacement, not an implemented migration. **Target D = 0.** C still executes trusted server-side code; it is not a browser-secret workaround. Account allowance remaining, provider delivery and operational acceptance are not implied by a feature being available.

## Feature matrix

| Feature | Current implementation | Current runtime | Reason server-side | Target architecture | Build-time possible? | Browser-safe? | Existing external service possible? | Security implications | SEO implications | Migration complexity | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Four document/root layouts | `app/(marketing)/layout.tsx`, `(design)/layout.tsx`, `(digital)/layout.tsx`, `(press)/layout.tsx`; `RootShell` | RSC during build | Emit themed document and metadata | Keep four root layouts; exported HTML | Yes | Static output safe | Unnecessary | Preserve first-paint theme, lang and tokens | Full document available | Low | A |
| Master home | `app/(marketing)/page.tsx`; `components/master/Home.tsx` | RSC at build; reviews currently ISR | Company details and public reviews | Build content; reviews handled separately | Yes | Only projected props | Sanity/approved review feed | No raw remote payload shipped | H1/copy/footer remain HTML | Low excluding reviews | A+B |
| About/Approach | `app/(marketing)/about/page.tsx`, `approach/page.tsx`; GroupSections/Connect | Build | CMS content and statutory contact data | Public published Sanity reads in clean build | Yes | Rendered output safe | Sanity already used | No write token | Full headings/copy/links in HTML | Low | A |
| Three studio landings | DesignHome, DigitalHome, PressHome and their page files | Build plus client islands | Service catalogue and company read | Keep RSC and lazy browser islands | Yes | Islands safe | Sanity | No need to move primary copy client-side | Static primary copy | Low | A+B |
| Three service route families | `app/(design)/design/services/[slug]/page.tsx`, Digital/Press equivalents; `components/content/servicePage.tsx` | Enumerated SSG plus unknown-slug fallback | CMS lookup, metadata, fallback | Complete authorised params; `dynamicParams=false`; rebuild on change | Yes | No privileged fetch needed | Sanity build read | Fail closed on publication and GS-X002 | Service copy stays HTML; new slug waits for rebuild | Medium | A |
| Insights index/articles | `app/(marketing)/insights/page.tsx`, `insights/[slug]/page.tsx` | SSG; default dynamic params | Published article lookup | Enumerate published slugs; static empty index allowed | Yes | Article HTML safe | Sanity | Drafts excluded; reject invalid/seed content | Article metadata and body in HTML | Low | A |
| Legal documents | `app/(marketing)/legal/[slug]/page.tsx`; `lib/legal/slugs.ts` | SSG over hardcoded six slugs, notFound if absent | CMS document | Emit only launch-authorised, approved documents; none while GS-O003 open | Yes after gate | Rendered approved text | Sanity | No clause edits; no 200 page containing missing-document 404 | Remove gated URLs from sitemap, avoid soft 404 | Medium | A; gated |
| Company/footer/Organization JSON-LD | `lib/company/companyDetails.ts`; `components/chrome/Footer.tsx` | Build | One public statutory document | Keep build-time read and escaping | Yes | Published projection safe | Sanity | Missing record fails build; no fabricated facts | Organization JSON-LD retained | Low | A |
| Sanity client/query layer | `lib/sanity/client.ts`, `queries.ts`; `sanity/env.ts`, `project.ts` | Build and fallback render | Public GROQ reads | Build-only published projection; clean cache | Yes | No visitor fetch required | Existing Sanity | No read token currently needed; write token absent from build | No content hidden behind CSR | Low | A |
| General contact action | `lib/leads/action.ts::submitLeadAction`; `components/leads/ContactForm.tsx` | Next request | Named-field extraction, honeypot and mutation | Supabase intake Edge Function; JS adapter plus POST/303 to static confirmation/error fallback | No | Validation/UI only; no privileged write | Supabase Free Edge | Endpoint repeats validation; success only after commit; no paid custom-domain/Edge-HTML dependency; no-JS field identification/correction and valid-answer recovery are binding acceptance requirements | Form page remains static | High | B+C |
| Press contact action | `lib/leads/pressAction.ts::submitPressLeadAction`; `PressContactFlow.tsx` | Next request | Branch schema and success redirect | Same intake boundary with Press branch parser and POST/303 PRG/navigation to static pages | No | Flow/state safe | Supabase Free Edge | Preserve memoir expectations acknowledgement, privacy and optional answers; default-domain redirects/no-JS error detail need Preview proof | Static confirmation URL unchanged | High | B+C |
| Shared submission function | `lib/leads/submit.ts::submitLead` also has `use server` | Next request | Zod, UUID, service-role insert | Trusted Edge endpoint calls restricted transactional RPC | No | Never privileged | Supabase | Retain zero public table grants/RLS; no browser service role | No primary SEO dependency | High | C |
| Notification fan-out | `lib/leads/notify.ts`; Resend HTTPS; unused optional Slack | Next after-response | Private provider credentials | Durable outbox + bounded Edge worker calling existing Resend | No | Never | Supabase + Resend | Message body stays DB; idempotency and retry; Slack stays unused | None | High | C |
| Next `after()` | `lib/leads/submit.ts:95` | Next request lifecycle | Notify after insert/response | Commit lead/job then worker; waitUntil only optional wakeup | No | No | Supabase background worker/cron/queue | Background promise alone is not durable; do not silently lose notification | None | Medium | C |
| Honeypot, Zod, Press segments | `guard.ts`, `schema.ts`, `pressLead.ts`, `pressSegments.ts` | Browser and request | Trust boundary checks | Reuse pure rules at Edge and client; HTML constraints remain | Rules build/bundle | Client checks are advisory | Edge repeats | Named whitelist, byte bounds, nested Press schema and no URL-name spam | Form HTML preserved | Medium | B+C |
| Rate limiting | `lib/leads/guard.ts`; intended Vercel Firewall, not current DB limiter | Planned hosting boundary | Abuse control | Atomic global admission buckets and queue ceiling in DB; Edge body limits | No | No authoritative client limiter | Supabase | No stored IP/fingerprint; Origin/CORS are not authentication; no distributed-DoS guarantee | None | High | C; requires proof |
| RLS drift route | `app/api/rls-drift/route.ts::GET` | `force-dynamic`, authenticated scheduler | Live PostgREST read + refusal-write probes | External scheduled checker using anon HTTP vantage; omit Next route from static tree | No | Not a public browser task | GitHub Actions or Supabase Edge | It attempts INSERTs; unsafe to execute in this read-only phase; keep valid reachability proofs | Not a visitor URL | Medium | C |
| Lead test route | `app/gridsmith-lead-probe/route.ts::POST` | `force-dynamic`; runtime exclusion | Validate and optionally send notification for tests | Retain in normal Next test profile; equivalent isolated Edge contract probes | No static runtime | Not public | Preview Edge test boundary | Never deliver from production test artifact | Excluded | Medium | Test-only |
| Timeout test route | `app/gridsmith-timeout-probe/route.ts::GET` | `force-dynamic`; maxDuration=5 | Deliberate platform timeout | Retain Next/Vercel specimen; Hostinger file/error proof separate | No | No | Existing protected Preview | A static host has no equivalent Next invocation timeout | Excluded | Low | Test-only |
| SSR throw test page | `app/(marketing)/gridsmith-ssr-throw-probe/page.probe.tsx` | `force-dynamic` | Reach render-error path | Keep normal probe profile; omit from static profile | Cannot prerender throw | No | Preview | Do not delete committed proof source | Excluded | Low | Test-only |
| Other page specimens | `_kitchen-sink`, `_master-sink`, `gridsmith-error-probe` | Build/client; production pageExtensions exclusion | Permanent gate subjects | Retain original test source and suite; static profile excludes | Some | Probe behavior only | Preview/local | Absence from public artifact must be tested; not delete fixtures | Excluded | Low | Test-only |
| Freelancer retrieval | `lib/reviews/freelancer.ts::listFreelancerReviews` | Server fetch `revalidate:86400` | Filter untrusted provider data | Preferred build retrieval into ephemeral approved cache; external sanitised feed if retention requires | Yes, without ISR | Only approved publishable data | Existing Edge/CI | Current code sends no credential; never ship raw/withheld data or future OAuth | Primary copy unaffected; review HTML requires freshness design | High | A preferred; C conditional |
| Review moderation | `toReviews`, `withholdReason`, `jobsByReview`; live gate EXPECTED 13/11/2 | Server/build | Privacy, approval, closed taxonomy | Reuse before publication; pin two permanent withheld IDs; freeze unknown/changed reviews | Yes | No raw moderation input | CI/Edge | Two IDs 22108992/22100632 must remain withheld even if provider edits wording | Approved quotations only | Medium | A/C |
| Review last-known-good/cache | Next fetch cache; not Sanity testimonial storage | Server revalidation | Outage continuity and terms | Bounded freshness cache; retry/expiry/rollback strategy; no Git history/raw cache upload | Yes with retention controls | Approved feed only | Existing Edge private store | Current API terms not freshly retrievable; indefinite copies cannot be called compliant | No stale/fabricated proof | High | Release gate |
| Continuous review cylinder/drag | committed ReviewCarousel steps every 6s; GS-VIS working copy uses RAF/drag | Browser | No server reason | Preserve GS-VIS browser component with approved props | Initial markup | Yes | No | Keyboard, pause, reduced-motion and hidden-tab behavior retained | Whole approved review DOM when loaded | Low | B |
| Master WebGL | MasterScene -> lazy `scene.ts`/sceneModel | Browser | No server reason | Same JS/shader/scroll/pointer code, statically delivered | Fallback HTML | Yes | No | No forced software GPU in production; capability fallback unchanged | Primary copy remains HTML | Low | B |
| Design choreography | DesignScene -> lazy `sceneChoreography.ts`; server SVG | Browser + build SVG | No server reason | Same SVG/DOM animation; prepared logo image | SVG yes | Yes | No | Reduced-motion, Save-Data, responsive reading surfaces preserved | Semantic HTML stays | Low | A+B |
| Digital motion | VisualActivation, HeroApertureMotion | Browser | No server reason | Keep viewport/timer/scroll code | Content yes | Yes | No | Local `after` timer helper is not Next `after()` | Content remains HTML | Low | B |
| Press interactions | PressMotion, DeskLoop, PathFinder, EditorialDemo | Browser/build | No server reason | Keep pure recommendation and native disclosures | Content yes | Yes | No | Keep honest recommendation against Gridsmith; no answers forwarded | Content remains HTML | Low | A+B |
| Cookie notice | ConsentBanner/Reopen; `lib/consent/state.ts` | Browser document.cookie | No server read | Keep notice cookie, no analytics | Notice markup | Yes | No | No Next cookies() and no new consent categories | None | None | B |
| CTA/referral query state | ContactForm effect; `lib/analytics/referral.ts`; `enquiryHref` | Browser | No request state needed | Keep local query parsing, no Press Path Finder answers | Form HTML | Yes | No | Attribution not authorisation; no PII query prefill | Links unchanged | Low | B |
| `next/image` primitive | `components/primitives/Media.tsx` only import; no consumers in current TSX | Default Next loader if used | Resize/transcode on request | Build responsive assets or approved custom static loader; unoptimized only bounded assets | Yes via pre-generation | Static assets safe | Sanity image CDN for CMS assets if appropriate | Do not globally replace with full originals | Sizes/alt/layout retained | Medium | A+B |
| Hidden runtime image URL | `DesignArtwork.tsx:17` SVG href `/_next/image?...1080&q=75` | Next image endpoint | Genuine 3D logo compression | Pre-generate 1080px WebP and replace both SVG uses | Yes, prototype 41,742 B | Yes | No | Keep original visual/alpha/geometry; inspect fidelity | No primary copy change | Low | A |
| Other images/fonts/manifest | public brand PNG/SVG/icons; local next/font; CSS backgrounds; manifest | Files/build | No runtime reason | Copy public/fonts and hashed chunks | Yes | Yes | Existing Sanity assets if used | Include asset refs; allow no directory listing | Identity retained | Low | A |
| Metadata/canonical/OG/Twitter | root/page metadata; `generateMetadata`; `lib/seo/site.ts` | Build or fallback | CMS titles and route identity | Keep generated head; explicit host-independent build target and origin | Yes | Output safe | No | Current VERCEL_ENV indexing coupling must be replaced intentionally | Unique/correct URLs; no SEO copy behind CSR | Medium | A |
| OG image generation | No `next/og`, ImageResponse or OG handler found | Absent | None | Approved static image when supplied by separate owner work | Yes | Public image | No | Do not invent OG artwork or claim existing image | Preserve current tags; future static assets | Low | A; absent today |
| Sitemap | `app/sitemap.ts` async metadata route | Build-compatible GET | Slugs + origin + INDEXABLE | Emit sitemap.xml from actual authorised artifact route manifest | Yes | Safe XML | Sanity build | Current hardcoded legal links bypass publication absence; do not publish them | Only real authorised pages | Medium | A |
| Robots | `app/robots.ts`; INDEXABLE | Build-compatible GET | Environment intent | Static robots.txt per target; preview disallow + noindex header/meta | Yes | Public | No | No crawlable temporary hostname; metadata switch alone insufficient | Live allow only after cutover gates | Medium | A |
| Redirects | next.config redirects + legacy.json | Next HTTP server | Status/location/query semantics | Hostinger .htaccess, legacy before slash normalisation | Config generation | No JS redirect | Existing Hostinger server | Origin/CDN 308/query parity unproven | One hop; no soft-404 default redirects | Medium | A configuration + host |
| Security/cache headers | next.config headers; CSP and dataset header | Next HTTP server | HTTP enforcement | .htaccess generated from same policy per target | Config generation | Meta cannot replace all headers | Existing Hostinger | Exact-origin form/CORS and served header parity required | Dataset probe/noindex/cache remain observable | Medium | A configuration + host |
| 404 | app/global-not-found.tsx; experimental.globalNotFound | Next routing/build | Themed unknown route status | Exported 404.html + local ErrorDocument 404 | Yes, prototype emitted | HTML safe | Hostinger | Must remain HTTP 404, no wildcard index fallback | Avoid soft 404; noindex errors | Medium | A configuration + host |
| Runtime/global errors | app/global-error.tsx; public/500.html | Client boundary/Next or provider failure | Browser boundary and platform fallback | Keep client boundary; host error documents; Edge failure UI | HTML/client yes | Client errors | Existing host/Edge | Static output cannot reproduce SSR invocation errors; explicit failure coverage | Error noindex | Medium | A+B+C |
| Middleware/headers/cookies/draft APIs | No executable Next middleware, next/headers imports, cookies(), headers(), draftMode, revalidatePath/Tag, connection or intercepting routes | Absent | None | No migration needed | N/A | Existing cookie use above | N/A | Comments/string names are not APIs | None | None | Inventory negative |
| Build-only operational scripts | scripts seed/migrate/content/verification, CI | Controlled Node build/operator | Filesystem, secrets for authorised writes and tests | Keep outside public artifact; no mutation jobs in build | Yes for read/gates | Never publish scripts/env | GitHub existing runner | No Production DB/Sanity/mail secret in static build; public Actions logs/artifacts sanitised | Gates enforce content/HTML | Medium | A |

## Server Action and handler contracts

Three `use server` modules export runtime-callable functions: `action.ts::submitLeadAction` (ContactForm), `pressAction.ts::submitPressLeadAction` (PressContactFlow), and `submit.ts::submitLead` (called by the two adapters; not a third form). Both forms receive status/errors from their action; Press additionally redirects to `/press/contact/thank-you`. Secret/DB access occurs in submit/notify, not the field extraction. Every adapter and direct submission entry must lose its runtime Server Action dependency in the static profile.

Three route-handler files exist: RLS GET checker, lead POST probe, timeout GET probe. Sitemap and robots are two additional metadata file routes, not application mutation APIs. Probe runtime `404` exclusion does **not** make a force-dynamic handler export-compatible. Retain the committed specimens in normal dev/CI and construct a separately reviewed static source profile which excludes them physically. No handler was removed here.

## Environment classification

| Variable(s) | Current use | Target classification and restriction |
|---|---|---|
| NEXT_PUBLIC_SANITY_DATASET | Required sanity/env.ts; no fallback | Safe public build selector, pinned production for release; must still fail if absent |
| NEXT_PUBLIC_SITE_URL | SEO origin | Safe public build configuration; exact https://gridsmith.uk only for authorised release; preview uses its own origin |
| NEXT_PUBLIC_BUNDLE_SIZE_PROBE | Client test payload flag, config default empty | Test-only; force empty and assert excluded in release |
| NEXT_PUBLIC_GA4_ID / NEXT_PUBLIC_POSTHOG_KEY | Historical .env.example comment only | Removed/unnecessary; do not restore |
| VERCEL_ENV / VERCEL_URL / VERCEL_PROJECT_PRODUCTION_URL | Probe exclusion + indexing/origin | Preview compatibility only; replace production authority with explicit validated static target, never spoof VERCEL_ENV |
| GRIDSMITH_EXCLUDE_PROBES / NEXT_BUILD_CPUS | Build controls | Build-only; static profile must independently prove no probes/handlers |
| PROJECT_URL / PUBLISHABLE_KEY | Backend Supabase; RLS probe | Public by capability, but no direct table write interface. Publish exact function URL as needed; key is not an abuse-control secret |
| SUPABASE_SERVICE_ROLE_KEY | submit.ts only | Privileged Edge secret; never build output/client; retain server-only legacy profile protection |
| RESEND_API_KEY | notify.ts only | Privileged worker secret; no static-build need |
| LEAD_NOTIFICATION_FROM / LEAD_NOTIFICATION_EMAIL | Backend destination/sender | Worker config, avoid adding internal inbox to public bundles |
| SLACK_LEADS_WEBHOOK | Optional unused notifier | Secret; remain unused; no new integration |
| CRON_SECRET | RLS checker auth | External operational secret; absent from public export |
| DIRECT_CONNECTION_STRING / SANITY_API_WRITE_TOKEN / GS_PRODUCTION_CMS_CONFIRM | Authorised operation scripts only | Never required for static page build; no migration/seed automation here |
| NODE_ENV | Framework/build and referral standalone demo guard | Build configuration, no credential |
| BASE_URL / AXE_BASE_URL / HEADER_BASE_URL / VERIFY_PORT / CI / H2_PORT / H2_UPSTREAM_PORT and visual/proof flags | Verification-only scripts | Not visitor config; no new production boundary |

No currently consumed NEXT_PUBLIC variable was found to be a secret. The only `next.config.env` export is the empty/test bundle flag. Non-prefixed variables can still leak if deliberately put in config.env, browser modules, props, error text or public files: scan final HTML, RSC text, JS, JSON, maps and deployment file list. A prefix audit alone is insufficient.

## Complete server-compatible TSX inventory

The inventory below records every TSX module without a `use client` directive, including factories/visual helpers. Such a module may also enter a client bundle when imported by a client component. Classification is by behavior, not the absence of a directive. **93 TSX modules: 76 server-compatible; 17 explicit client modules.** No production page requires request cookies/headers. The SSR throw specimen genuinely needs request-time execution in its test profile; forms have replaceable action dependencies.

| File | Classification |
|---|---|
| `app/(design)/design/page.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `app/(design)/design/services/[slug]/page.tsx` | Build-time after authorised enumeration/dynamicParams=false; current unknown-slug fallback replaced |
| `app/(design)/layout.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `app/(digital)/digital/page.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `app/(digital)/digital/services/[slug]/page.tsx` | Build-time after authorised enumeration/dynamicParams=false; current unknown-slug fallback replaced |
| `app/(digital)/layout.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `app/(marketing)/%5Fkitchen-sink/page.probe.tsx` | Build-time/client test specimen; excluded static production, retained normal suite |
| `app/(marketing)/%5Fmaster-sink/page.probe.tsx` | Build-time/client test specimen; excluded static production, retained normal suite |
| `app/(marketing)/about/page.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `app/(marketing)/approach/page.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `app/(marketing)/contact/page.tsx` | Build-time markup; replaceable runtime Server Action in imported form island |
| `app/(marketing)/gridsmith-ssr-throw-probe/page.probe.tsx` | Genuinely dynamic test specimen; retained normal test profile, excluded static output |
| `app/(marketing)/insights/[slug]/page.tsx` | Build-time after authorised enumeration/dynamicParams=false; current unknown-slug fallback replaced |
| `app/(marketing)/insights/page.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `app/(marketing)/layout.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `app/(marketing)/legal/[slug]/page.tsx` | Build-time after authorised enumeration/dynamicParams=false; current unknown-slug fallback replaced |
| `app/(marketing)/page.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `app/(press)/layout.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `app/(press)/press/contact/page.tsx` | Build-time markup; replaceable runtime Server Action in imported form island |
| `app/(press)/press/contact/thank-you/page.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `app/(press)/press/page.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `app/(press)/press/path-finder/page.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `app/(press)/press/services/[slug]/page.tsx` | Build-time after authorised enumeration/dynamicParams=false; current unknown-slug fallback replaced |
| `app/global-not-found.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/chrome/Footer.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/chrome/Header.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/chrome/RootShell.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/content/Blocks.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/content/Connect.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/content/DataRows.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/content/GroupSections.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/content/Placeholder.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/content/PostList.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/content/ServiceDetail.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/content/ServiceList.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/content/servicePage.tsx` | Build-time after authorised enumeration/dynamicParams=false; current unknown-slug fallback replaced |
| `components/divisions/design/DesignArtwork.tsx` | Build-time SVG; hardcoded image endpoint replaced |
| `components/divisions/design/DesignHome.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/divisions/digital/DigitalHome.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/divisions/digital/HeroApertures.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/divisions/DivisionLanding.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/divisions/press/EditorialDemo.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/divisions/press/MarginNote.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/divisions/press/passage.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/divisions/press/PressHome.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/divisions/press/visuals.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/leads/Honeypot.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/master/ContinuityExample.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/master/FallbackMark.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/master/Home.tsx` | Build-time company/content; review ISR carrier/freshness replaced |
| `components/master/ProcessStages.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Accordion.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Badge.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Breadcrumb.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Button.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Card.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Container.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/EmptyState.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/ErrorState.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Eyebrow.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Field.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Grid.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Heading.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Link.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Media.tsx` | Build-time markup; default image endpoint replaced; currently unused |
| `components/primitives/Numeric.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Pagination.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Prose.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/RadioGroup.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Section.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Select.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Stepper.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/primitives/Table.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/shared/Opening.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/shared/ProcessRail.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |
| `components/shared/StudioMap.tsx` | Build-time static; CMS reads, when present, are build inputs; no request state required |

Explicit client modules (17):

- `app/(marketing)/gridsmith-error-probe/page.probe.tsx`
- `app/global-error.tsx`
- `components/consent/ConsentBanner.tsx`
- `components/consent/ConsentReopen.tsx`
- `components/divisions/design/DesignScene.tsx`
- `components/divisions/digital/HeroApertureMotion.tsx`
- `components/divisions/digital/VisualActivation.tsx`
- `components/divisions/press/DeskLoop.tsx`
- `components/divisions/press/PathFinder.tsx`
- `components/divisions/press/PressContactFlow.tsx`
- `components/divisions/press/PressMotion.tsx`
- `components/leads/ContactForm.tsx`
- `components/master/MasterScene.tsx`
- `components/master/ReviewCarousel.tsx`
- `components/primitives/RevealOnScroll.tsx`
- `components/primitives/StickyCta.tsx`
- `components/primitives/Tabs.tsx`
