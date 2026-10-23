# Local static-release specimen

Run only in a newly created disposable Linux container with `--init`, labelled `gridsmith.task=GS-LAUNCH-007`,
with no published host port, source at `/work/repo`, matching installed dependencies, Apache from
signed distribution packages and the repository's independently verified browser. No env files,
credentials, provider requests or live enquiries are required. Keep raw logs and receipts.

First build the clean, committed source with `NEXT_BUILD_CPUS=1 GRIDSMITH_STATIC_PROFILE=production
GRIDSMITH_PRODUCTION_REHEARSAL=1 npm run build:static`, without an intake URL. Never upload it.
Assert its identity is `sourceModified:false`, `deployable:false`, `contactMode:direct` and its
original `.htaccess` still contains `Require all denied`. The builder retains all seven legal refusals.

As the unprivileged container `node` user, run sequentially:

```sh
GS_LOCAL_PROOF=GS-LAUNCH-007 node docs/_shared/gs-launch-007-proof/setup.mjs
apache2 -t -f /work/repo/docs/_shared/gs-launch-007-proof/apache.conf
apache2 -f /work/repo/docs/_shared/gs-launch-007-proof/apache.conf -DFOREGROUND
```

Run Apache in a separate owned execution session; the next commands run in the same container.
The setup records every loopback adaptation and copies the artifact. It adds the permanent
`induced-500` fault only to that copy. Neither source nor original denied artifact is changed.
The two loopback listeners serve the same identity on 3236 (HTTP/browser/mobile upstream) and
3200 (desktop Lighthouse). Mobile's existing proxy supplies TLS/H2 on 3202 and starts no Next server.

```sh
STATIC_BASE_URL=http://127.0.0.1:3236 node scripts/check-hostinger-http.mjs --local-production
STATIC_BASE_URL=http://127.0.0.1:3236 node scripts/check-static-ui.mjs
GRIDSMITH_BUILD_TARGET=static GRIDSMITH_PRODUCTION_REHEARSAL=1 node scripts/check-lhci.mjs desktop
node scripts/lhci-report.mjs desktop
GRIDSMITH_BUILD_TARGET=static GRIDSMITH_PRODUCTION_REHEARSAL=1 node scripts/check-lhci.mjs mobile
node scripts/lhci-report.mjs mobile
```

Run heavy browser/build/Lighthouse jobs sequentially. Preserve all browser control variables from
`browser-input.mjs provision` for both consumers. No URL/config/browser override is accepted.
The legal Lighthouse subject is omitted only for an identity-bound denied rehearsal. A ready
artifact must include it; the same ten other budgets remain measured.

For deliberate-failure HTTP proofs, with no browser/Lighthouse reader active, capture the simulated
`.htaccess` and `500.html` bytes first. Independently change its induced status to 503, map 500 to
404.html, then inject a HEAD-only 503 rule before the 500 rule. Each run of the same HTTP gate must
fail specifically at the new status/document assertion. Restore the captured bytes between cases,
then rerun the positive gate. These are local subjects only, never hosted fault instructions.
Also demonstrate the two raw-identity mismatches and occupied mobile listener make static Lighthouse
refuse before collection; retain the results. The pure route/subject branches have permanent
assert-based fixtures in `scripts/check-static.selftest.mjs`.
The permanent guarded seven-case runner is:

```sh
GS_LOCAL_PROOF=GS-LAUNCH-007 node docs/_shared/gs-launch-007-proof/negative-proofs.mjs
```

Apache's local worker pool is bounded to eight threads within one child. The original container
without an init reaper accumulated browser tasks and exhausted its 512-task limit; its interrupted
collections are retained separately. The final disposable container reaps orphaned browser children.
The artifact, browser and assertion budgets are unchanged.

After both Lighthouse axes, run the recorded-desktop contrast supplement sequentially:

```sh
GS_LOCAL_PROOF=GS-LAUNCH-007 node docs/_shared/gs-launch-007-proof/contrast.mjs
```

It binds the served identity to the denied original, imports/extracts the existing rendered
predicates without threshold changes, accounts for each recorded axe membership and deliberately
breaks/restores each of the five predicates. Its receipt distinguishes measured text, structural
hidden/decorative subjects and unresolved readings. It does not stand for full scene/mobile matrices.

At completion compare every original artifact file to its deployment manifest, plus its identity
and denied `.htaccess`; verify protected source bytes against Git. Stop/remove only the newly
labelled container after copying evidence out. No other container, port, website or root is owned
by this specimen. These local results never establish Hostinger/CDN acceptance.
