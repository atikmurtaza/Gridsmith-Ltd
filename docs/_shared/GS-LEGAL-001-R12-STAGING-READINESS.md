# GS-LEGAL-001-R12 — Separate Hostinger staging deployment readiness

8 October 2026. **LOCAL DEVELOPMENT ARTIFACT ONLY. STAGING DEPLOYMENT NOT EXECUTED OR AUTHORISED.**

Destination remains `https://mediumaquamarine-wallaby-594070.hostingersite.com`, existing multi-domain
Business account administered internally by Gridsmith. No purchase, migration, new account/domain,
VPS, subscription or managed Node service. R11 controls hosting-processing coverage; R10 draft is
SUPERSEDED / NOT EXECUTED.

## Prepared candidate

`out/` contains 62 static routes including all seven adopted legal documents, native no-JS content,
shared chrome, assets, branded 404, restrictive robots and empty sitemap. The private profile uses
Sanity `development` at build time and checks full legal content and adopted fingerprints before and
after generation. Neither development seed identities nor OWNER_ADOPTED are production authority.
The seven documents remain review-labelled; none PUBLISHABLE.

The generated `.htaccess` restricts the exact temporary hostname, extensionless routes, HTTPS,
noindex/security headers and asset caching. It reports the actual development dataset. It retains
the deliberate legacy legal-source 404s. Legal canonical destinations now exist in this private
candidate. Deployment identity, per-file hashes, aggregate identity and build receipt are local
`out/__deployment.json` and `build/static-receipt.json`; generated output is not committed to source.

Build locally with `NEXT_PUBLIC_SANITY_DATASET=development`,
`GRIDSMITH_LEGAL_PREVIEW=adopted-development`,
`GRIDSMITH_STAGING_ORIGIN=https://mediumaquamarine-wallaby-594070.hostingersite.com`, and the existing
public Preview intake URL (`NEXT_PUBLIC_LEAD_INTAKE_URL`) before `npm run build:static`.
No production or secret credential is required. Only versioned public resources enter the artifact.
Local browser verification uses a plain loopback file server and
`STATIC_BASE_URL=http://127.0.0.1:3236 node scripts/check-static-ui.mjs --legal-preview`.

## Deployment gate

Do not dispatch registered CI to deploy this candidate in R12. The existing Hostinger reusable
workflow builds the default production-content profile and excludes legal routes; it does not
implicitly select this private review exception. A later authorised private staging phase must
explicitly select the development legal-review artifact, prove its exact source and artifact
identity, retain the accepted previous artifact for rollback, and perform hosted acceptance.
Source push/normal CI success cannot mean the legal-preview artifact has deployed.

Before any separately authorised deployment: confirm exact temporary destination, frozen anonymous
review permission boundary, current rollback artifact and Git auto-deploy OFF. Do not connect the
source branch to public_html. After manual Redeploy, turn auto-deploy OFF again and confirm after
reload because hPanel Redeploy previously re-enabled it. Verify the served artifact identity,
all seven legal routes/anchors, enquiry/legal links, no-JS/keyboard/reduced-motion/mobile/axe,
files/assets/redirects/canonicals and noindex. No form submission or email is part of R12.

Preserve the two H4-D-R2 temporary-domain provider exceptions: hCDN strips security/noindex headers
from PNGs despite exact bytes/no-transform, and Hostinger serves its own temporary-domain robots.
The artifact keeps the stronger policies. These exceptions do not extend to gridsmith.uk;
BEFORE-LAUNCH item 24 requires production-origin verification. No DNS, production domain, Edge,
Supabase, Sanity or production-publication action is authorised here.

## Remaining authority

Local implementation acceptance is recorded in
`docs/_legal/research/GS-LEGAL-001/R12-WEBSITE-INTEGRATION.md`. Recommended next phase only:
GS-LEGAL-001-R13 controlled private staging deployment and served acceptance. Owner deployment
authority and visual acceptance remain required. Production prerequisites remain unchanged;
seven OWNER_ADOPTED, zero PUBLISHABLE. STOP; do not deploy from this report.
