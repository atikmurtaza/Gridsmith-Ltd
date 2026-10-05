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

Keep each accepted artifact commit and downloaded Actions archive. To roll back, restore the exact
last accepted artifact files in a new commit on the artifact branch, deploy that commit, clear the
temporary site's HTTP/CDN cache if enabled, and verify identity plus critical routes/forms/assets.
Keep the previous assets until the revalidated HTML is served. Never force/reset main, delete the
external Vercel project, change gridsmith.uk/DNS/WordPress or mutate Production Supabase/Edge.
Preview hosted tests use new durable receipts and exact IDs; minimise mail and clean only those
recorded synthetic rows. No unattended worker scheduler is authorised in this phase.
