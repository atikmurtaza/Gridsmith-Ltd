# Hostinger staging workflow — GS-HOST-H4-D-R1

Current destination: `https://mediumaquamarine-wallaby-594070.hostingersite.com`.
Included Business PHP/HTML hosting, document root `public_html`, zero persistent application Node.
Source repository: `atikmurtaza/Gridsmith-Ltd`. Source work is separate from the generated-only
`codex/gs-hostinger-artifact` branch. Never connect a source branch directly to the public root.
Initial provisioning and hosted acceptance are recorded in `GS-HOST-H4-D.md`.

## Acceptance loop

Local implementation → local checks → owner visual/content approval where required → exact-source
CI/RC verification → clean trusted static build → artifact security/privacy checks → temporary
Hostinger deployment → actual hosted verification → accepted staging baseline.

Dispatch the existing registered **CI** workflow on an accepted source branch. Its
`hostinger-staging` job calls the branch-local reusable workflow after `verify` succeeds.
It requires successful normal CI for the exact source SHA, runs the static checks, builds against
the published production CMS read-only, excludes GS-X002/GS-O003, and archives public output only.
The publish job updates only the artifact branch. Hostinger must be configured to deploy that
branch into this temporary site's `public_html`. Hosted acceptance is a separate obligation;
successful upload or Git sync never means that HTTP, forms, accessibility or performance passed.
Every subsequently accepted change must complete hosted verification before being integrated.
Vercel Preview is no longer a required stage or fallback. Preserve historical Vercel evidence.

The source branch's normal CI also targets isolated Supabase Preview `qfgpwumvvtizeamkynes`,
using the existing public key in `GS_H4B_PREVIEW_PUBLISHABLE_KEY`. Production repository variables
must not be used for hostile public/RLS probes. The dedicated variable holds no private key.

## Frozen review boundary

11 existing quotations and actual ratings; anonymous linked **Verified Freelancer review**
attribution. The source artifact has no approved country data: no inferred flags. No API/cache,
refresh schedule or automatic new-review publication. The public model is source-independent.
The exact temporary origin/local test origins are the only destinations accepted by the staging
review guard. No written Freelancer permission is held. Permission remains a Production cutover
blocker; H4-C automation remains blocked. H4-D owner staging authority does not close either gate.

## Delivery and rollback

`__deployment.json` records source SHA, dirty state, staging origin, per-file SHA256 and aggregate
artifact identity (excluding the identity document itself). The generated `.htaccess` defines
noindex/security headers, exact Host, extensionless routes, branded 404, legal-source 404s,
HTML/robots/sitemap revalidation, immutable hashed assets and short revalidated scene/image assets.
Those declarations require actual served proof. No file contains provider credentials.

The included Git panel uses manual Redeploy from the artifact branch into public_html.
Auto-deployment is currently off. Inspected deployment history/details expose completed
records and logs; no native historical rollback action was exposed. Use the Git-file restoration
procedure below; do not infer a provider snapshot restore from deployment history alone.
Automatic page caching is off. The CDN panel explicitly reports Active for the temporary
add-on domain; its off switch controls Development mode, not CDN enablement. The earlier
interpretation of that switch as CDN disabled was incorrect. Flush only this temporary site's
cache after deployment/restoration; never change the parent-domain automatic-CDN opt-out.
Actual observed transport overrides assumptions: 17f PNGs were transformed and
lost required headers. The corrected asset policy requests no-transform; full file/hash/header
proof is mandatory before accepting it. Do not waive changed image pixels/bytes or headers.
HTML no-cache legitimately returns 304 on warm browser revalidation. Cold route/no-JS probes
use disabled browser cache; performance cold samples use an isolated context per route and
warm samples reuse it. Positive decoded document/LCP and cache evidence remain required.
Observed on 44e (5 October 2026): auto-deployment was ON and deployed the published artifact
commit within a minute of CI's push; until the owner decides, treat every artifact-branch push
as a live deployment. One Flush cache click may not clear stale image entries: re-probe and
flush again until every Accept variant is a fresh exact response. hCDN honours no-transform for
PNG bytes but strips all origin security/noindex headers from raster images, and the edge
serves Hostinger's own temporary-domain robots.txt instead of the artifact's. Neither is
reachable from .htaccess.

Keep each accepted artifact commit and downloaded Actions archive. To roll back, restore the exact
last accepted artifact files in a new commit on the artifact branch, deploy that commit, clear the
temporary site's HTTP/CDN cache if enabled, and verify identity plus critical routes/forms/assets.
Keep the previous assets until the revalidated HTML is served. Never force/reset main, delete the
external Vercel project, change gridsmith.uk/DNS/WordPress or mutate Production Supabase/Edge.
Preview hosted tests use new durable receipts and exact IDs; minimise mail and clean only those
recorded synthetic rows. No unattended worker scheduler is authorised in this phase.
