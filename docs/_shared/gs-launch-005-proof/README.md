# GS-LAUNCH-005 permanent local proof

These scripts are bound to the task-owned container `gs-launch005-proof`, label
`gridsmith.task=GS-LAUNCH-005`, and loopback ports 3354–3356. They never target Hostinger.
No credentials, environment files, enquiries or CMS/database writes are needed.

Use the repository's matching existing dependencies (recorded Next 15.5.28, Node 24.15.0).
First run the existing guarded production rehearsal with the recorded **Preview** intake:

```powershell
$env:GRIDSMITH_STATIC_PROFILE = 'production'
$env:GRIDSMITH_PRODUCTION_REHEARSAL = '1'
$env:NEXT_PUBLIC_LEAD_INTAKE_URL = 'https://qfgpwumvvtizeamkynes.supabase.co/functions/v1/gs-lead-intake'
$env:NEXT_BUILD_CPUS = '1'
node scripts/build-static.mjs
```

The build deletes only its own explicit generated directories first. `deployable:false` and
`Require all denied` must remain in the original artifact. Publication is forbidden.

The recorded Docker setup creates a new disposable container from the already available
`node@sha256:f22d6a1f082c02f292e86929b5b0442ac2e5eaf438a5dea9b1566601c3e05940` image,
with `sleep infinity`, the above label and only these mappings:
`127.0.0.1:3354:8080`, `127.0.0.1:3355:8081`, `127.0.0.1:3356:8082`.
Install Apache from signed Debian repositories inside that new container only. Never reuse another
project's container or change global Docker settings. The recorded Apache version is 2.4.68.

Run sequentially, stopping on any failure:

```powershell
node docs/_shared/gs-launch-005-proof/setup.mjs
docker exec -d --user node gs-launch005-proof apache2 -f /proof/apache.conf -DFOREGROUND
node docs/_shared/gs-launch-005-proof/verify.mjs
```

`setup.mjs` validates the operator pair, original rehearsal and label before copying files. It
records every simulator adaptation: remove deny-all only from the simulation copy, substitute a
loopback host/origin, and remove the HTTPS redirect only because this test is HTTP. The original
deny-all artifact is served separately on 3355 and must still return 403. TLS is not measured.
The production host lock, www redirect, PHP/dotfile denial, extensionless routes, cache/security
policies and legacy redirect remain present in the simulation. Local DirectorySlash Off is required
for exported file/directory collisions. None of this proves Hostinger permits these settings.

`verify.mjs` owns its three container subjects exclusively. No other gate/server/reader may run
against them until it exits. Faults are retained in code: broken root config, broken co-located
config, missing independent file, unreadable independent file. Restore uses captured bytes in
finally, then asserts file hashes and permissions before browser acceptance. Missing/unreadable
fallback and broken co-located mapping deliberately demonstrate inaccessible default responses;
a successful characterization does not make these acceptable production states. Unmapped synthetic
502/503/504 also demonstrate the uncovered outer boundary; they are not accepted error templates.

No-JS semantics are measured in a genuinely script-disabled page. Axe uses a separate script-free
DOM replay with asserted semantic equality and a named missing-language adverse control in every
replay. The browser subjects are 320/375/768/1440px, JavaScript on/off, reduced motion. Keyboard Tab
must reach a visible outlined homepage link; Enter must navigate by GET. The sole synthetic POST
hits the local induced-error rewrite only, with redirects refused; no form is submitted.

Raw HTTP error documents and full positive/adverse axe objects are retained as lossless `.gz`
files. The machine receipt records headers, status, response bytes/hashes, file/route cases and
browser facts. The original 201-file rehearsal is compared byte for byte at the end. Receipts live
under ignored `build/gs-launch-005/`; portable evidence is archived beside this README.
After collecting results, remove only the labelled task container. Hosted/CI/TLS/CDN/manual
screen-reader acceptance remains UNVERIFIED.
