# Operator-owned error response — conditional package

The two files in `hostinger-error/` are nonpublic source. They are deliberately outside `public/`,
the static build source roots, `out/`, and the replaceable release. Never upload this directory with
the website or add it to legal routes, the CMS, sitemap, navigation or public document inventories.

`identity.json` locks the HTML bytes and the configuration requirements. It is **not** Hostinger
configuration, installation permission or evidence that a mapping exists. `providerAcceptance` is
UNVERIFIED and `deployable` is false. The existing static builder validates the pair before generation
and records the identity only in its private build receipt. No operator payload or mapping enters
`__deployment.json` or `.htaccess`. An accidentally copied document is rejected by the artifact gate.

Provider confirmation must establish independent storage and configuration outside the replaceable
root and its `.htaccess` traversal, original HTTP 500, error-specific headers, CDN behaviour and
permissions. A same-root ErrorDocument is insufficient. No installable provider directives are supplied.
The Apache configuration under `docs/_shared/gs-launch-005-proof/` is a local simulation only.

Run `node scripts/check-static.selftest.mjs` for the package and artifact-admission adverse tests.
Reviewed HTML changes require a reviewed document hash update; policy changes require the validator,
identity, tests and phase report to agree. Hash equality is an integrity check, not an accessibility
certificate. Served checks are in the phase proof. Future operator acceptance/rollback procedure and
the exact evidence required before installation are in `docs/_shared/GS-LAUNCH-005.md`.
