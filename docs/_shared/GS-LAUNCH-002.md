# GS-LAUNCH-002 — targeted release-source reconciliation

22–23 October 2026. Local execution only. Final verification results are recorded below and in
`GS-LAUNCH-002-EVIDENCE.json`. Website launch remains **NO-GO**. GS-LAUNCH-003 is not started.

## Source and scope

The primary checkout was `codex/gs-launch-001` at
`f6cdd6daa2ac52788d029d72170b14011d2f899f`, following legal consolidation
`a720b567085872785128ffd65bbabdc4a755f7d2`. Its 14 pre-existing changed/untracked file contents
were fingerprinted before work. Implementation uses an isolated managed worktree on
`codex/gs-launch-002`; the primary checkout and other worktrees are preserved.

The comparison endpoint is adoption commit `a7b931c10eb2a543bfa43e89954555fdadb7072d`.
The selected non-analytics security baseline is `17080169288b06e1cb3d54f72479ef68e4ad9d07`;
Production-profile/intake/hosting controls come from pre-analytics
`3930a7ad14ecb806e74d4ec8f251badfcc031e5f`. Later company and withholding corrections are
selected individually. No branch merge or cherry-pick was used.

The file-by-file comparison, original/source/final hashes and import/adaptation decisions are in
`GS-LAUNCH-002-RECONCILIATION.json`. Historical reports are provenance at their pinned commits,
not claims about this candidate's CI, provider configuration or deployed website.

## Reconciliation decisions

| Area | Source decisions and resulting change |
|---|---|
| Browser/CI | `59efa2d4`, `fe72bdbc`, `98672fe2`, `493e3cad`, `e4dfe8f8`, `d9cb6c15`: preserve signed metadata bytes, fixed Chrome input, safe extraction/loader attribution, separate Puppeteer/Lighthouse identity checks, download suppression, read-only installation permissions and nonpersistent checkout credentials. Final workflow/package/lock pins are independently reviewed expectations. |
| HTTP/artifact security | `0784d7d3`, `8c1fd41e`, `cf2cd083`: detect new-format privileged keys; permanent Hostinger header/CSP adverse specimens. R13 adds exact-host routing, HTTPS/www folding, PHP/script denial, legacy redirects, indexing/sitemap checks and nondeployable rehearsal markers. |
| Production profile | `1c83b7c6`, `418aeac3`: explicit profile, recorded intake identity, seven legal publication inputs, secret stripping, CMS revision recheck, source identity and per-file artifact hashes. Rehearsal uses Preview only, separate output, `deployable:false`, and `Require all denied`. Real publication inputs are not changed. |
| Intake/worker | `86fe6620`, `30b8b22d`, `418aeac3`: project/mode/origin/recipient restrictions, synthetic identity admission, correct notification labelling and live-only narrowly authenticated scheduled drain capability. No schedule, secret, migration or provider activation is imported or executed. Tests use in-memory stores/transports. |
| Dependencies | `6b441ad3` and reviewed follow-ups: scoped tmp/UUID/basic-ftp overrides and consumer tests. Fresh advisory findings additionally require compatible Markdown, Vite, DOMPurify, IP parser and Next 15 patches; exact versions and fresh audits are recorded below. No Next 16 or unrestricted upgrade. |
| Shared bundle | `e6390bd6` plus owner decision `e720c939`: preserve the SC 2.4.11 footer-focus behavior, remove downlevelled syntax overhead, carry the approved 2.9 KB shared ceiling and calibrated permanent probe together. Other ceilings and contrast thresholds are unchanged. |
| Company facts | Later decisions 17–18 and `lib/company/confirmed.ts`: “England and Wales” and “We aim to respond as soon as practicable.” overlay stale CMS fields at the shared accessor. Seed input and independent served expectations agree. No CMS write. Old timed wording is an adverse specimen. |
| Public content | Later decision 15: public Path Finder removed; unchanged ethical/no-JS decision-table specimen retained as an excluded `page.probe.tsx`. All dependent local gate URLs/allowances/budgets move with it; static artifacts reject either URL/sidecars. Empty Insights indexing follows actual published articles in both profiles. The approved illustration clarification and Contact Design label are selected without analytics attributes. The generated content-review transcription is refreshed to preserve source parity. |

Latest source files were not copied blindly. In particular, the later manifest/artifact/selftest
versions would remove consolidation's atomic legal checks or restore owner-staging review
presentation. Those changes are rejected. Current canonical paths, loopback-only legal preview,
all-seven publication specimens and review-leak specimens remain.

Excluded optional infrastructure: GA4/PostHog runtime/configuration/attributes, AI analytics,
consent-recording service/schema/retention, analytics workflow variables, availability/drain
workflows and operator credential/backup executors. Existing deployed operational state is not
inferred from importing runtime capability. WordPress recovery/rollback still needs owner evidence;
an imported utility or historical Supabase backup would not prove a WordPress restore.

Review suppression also exposed a pre-existing scene integration defect. Both pinned sources
still expected the carousel controls and a real review section; with reviews absent, the renderer
measured a NaN review centre and the scene gate stopped before measuring its fourteen questions.
The candidate now resolves only that absent centre halfway between Process and Close, preserving
the six model indices, keyframes, dwell, materials, pointer behavior and all contrast thresholds.
The gate computes the virtual centre independently, rejects review carriers with four permanent
adverse specimens and retains the still-ring and transit assertions. The reduced-motion proof
scrolls the existing Close chapter. Existing model/lifecycle selftests cover present and withheld
reviews, invalid geometry, finite uploaded WebGL coordinates and cleanup; the rebuilt runtime is
verified separately. No review content, blank review section or visual redesign is introduced.

## Protected legal and release boundaries

All seven canonical files and the adoption register are unchanged. Their exact SHA-256 values,
versions and states are reproduced from fresh reads in the evidence JSON: **seven OWNER_ADOPTED,
zero PUBLISHABLE**. `docs/_legal/` has no diff. Public legal publication remains blocked and all
seven must be authorised together. No legal wording, prerequisite, adoption date or status is
changed to run a rehearsal.

Reviews remain unconditionally suppressed in the shared source and every artifact profile.
No client, project, portfolio or case-study proof is introduced. Three GS-X002 Technical records
remain ineligible in the unchanged publication inventory. H4-B live promotion remains separately
authorised. Agency execution, rights-chain and international-transfer clearance remain separate
from the closed public-document adoption task.

No push, remote CI, deployment, publication, live enquiry/email, Production database write,
analytics/review activation, hosted-site, WordPress or DNS change is authorised or performed.
Only public read-only package/advisory documentation and Sanity build content are queried.

## Security measurements and disposition

The initial original-lock audit returned production 0; full 32 affected entries (23 high,
7 moderate, 2 low). Advisory metadata changed during execution. A refreshed original-lock audit
is retained separately so that later critical findings are not presented as regressions caused
by this patch. Audit snapshots, underlying advisory IDs, propagated package entries and exact
lock identities are in the evidence JSON.

The selected source's historical audit counts are not reused as current results. Targeted changes
retain existing overrides, add the reviewed tmp/UUID/basic-ftp overrides, patch Markdown
14.3.1 → 14.3.3 and Vite 8.2.1 → 8.2.4, then address newly returned findings with Next and
eslint-config-next 15.5.27 → **15.5.28**, DOMPurify 3.4.16 → 3.4.17 and ip-address 10.7.1 →
10.7.4. Associated Next env/SWC/eslint packages align; unrelated Rolldown/native bindings remain
at their original versions. A scoped npm resolution that proposed extra changes was discarded;
only the reviewed lock changes are retained. Clean installation validates the final lock.

Next patch evidence: [image optimisation advisory](https://github.com/advisories/GHSA-2464-fhr4-w9xw),
[Server Actions advisory](https://github.com/advisories/GHSA-p3m5-59mp-jv5r).
Markdown patch evidence: [maintainer advisory](https://github.com/markdown-it/markdown-it/security/advisories/GHSA-gfr2-rv44-r23c).
Other exact patch metadata and all active advisories are linked in the evidence JSON.

The existing dependency gate now measures real consumer resolution, nested/aliased lock copies,
temporary-file cleanup, ID round trips, loopback FTP, Portable Text Markdown, Sanity's Vite env
loader with a synthetic directory, sanitisation and IP parsing. No live proxy or provider is used.

Residual unfixed toolchain findings remain **UNACCEPTED / OWNER DECISION REQUIRED**. Authenticated
browser provisioning/download suppression mitigates the selected archive-install path; it is not
a claim that the vulnerable packages are fixed. A source scan finding no configured reachable
caller is not a proof of unexploitable behavior. No audit suppression or vulnerability waiver is
added. Final counts and per-advisory dispositions follow the final fresh audit, not old prose.

The refreshed original lock returns **1 critical production entry** and **31 full entries**
(2 critical, 23 high, 4 moderate, 2 low). The final lock returns **0 production entries** and
**17 high toolchain entries**, with no critical, moderate or low entries. These 17 propagated
package findings come from three underlying advisories: braces nested-pattern stack exhaustion
([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)) and two extract-zip
symlink/archive-write advisories
([GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv),
[GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3)).
The final audit proposes breaking toolchain changes or older major package lines; none is applied
without compatibility evidence. Braces still reaches glob/watch tooling used by Sanity/Next lint;
repository-controlled patterns reduce the immediate input exposure but do not establish safety for
hostile patterns. The archive path is constrained by authenticated browser acquisition and disabled
automatic downloading, while actual Linux installation/consumer acceptance remains UNVERIFIED.
Both classes remain unaccepted release gates, rather than recorded owner waivers.

## Bundle measurement

The original clean build fails the old 2.8 KB shared ceiling. The prior owner-approved 2.9 KB
decision applies because this candidate carries the same accessible cookie-notice focus behavior
and its syntax optimisation. The Next security patch separately changes framework cost. Independent
bare Next apps, exact React 19.2.8, Node 24.15.0, fresh builds and the gate's level-9 gzip method
measure **102676 B** for 15.5.27 and **102773 B** for 15.5.28. The measured current framework
floor rounds to **100.4 KB**. This updates the framework constant, with the evidence in
`GS-LAUNCH-002-FRAMEWORK-FLOOR.json`; it does not raise the site allowance.

The final clean candidate passes all **69 route budgets**: shared baseline 2.8 KB, consent
2.1 KB against 3.0 KB, Master total 7.6 KB against 15 KB, lazy Master scene 7.3 KB and lazy
Design scene 7.9 KB against their respective 8 KB caps. Display values are rounded by the gate.
The permanent 192-character adverse specimen produces **shared baseline 2.95 KB over 2.9 KB**,
within the unchanged 3.0 KB floor tolerance. The named shared assertion fires, and the source
subjects remain byte-identical before/after the proof. A subsequent clean probe-off build passes.

## Local verification matrix

Final machine-readable results, commands, exit codes, limitations and retained log hashes are in
`GS-LAUNCH-002-EVIDENCE.json`. Results apply to local source/builds and the explicit subjects below.

| Check | Local result and evidence |
|---|---|
| Full static verification | **PASS**, final corrected source. TypeScript, ESLint, token/contrast/content/schema/RLS source checks, legal adoption/parity, publication/review controls, intake and dependency-consumer tests all execute. `verify-static-final.log`. Database source checks do not attest the live database. |
| Clean Next build | **PASS**, Next 15.5.28; final corrected renderer included. Secret-pattern/token/theme checks pass; zero supplied secret values were checked by value. Privileged/provider credentials are absent from these local runs. `build-after.log` and `verification-build.json`. |
| Bundle budgets | **PASS**, 69 routes; approved 2.9 KB shared ceiling, measured 100.4 KB framework floor, unchanged component/scene caps. Permanent probe **EXPECTED RED**, specifically the 2.95 KB shared-baseline assertion; restored clean build passes. |
| Production refusal/rehearsal | Real build **EXPECTED REFUSAL** on all seven publication states. Fresh rehearsal **PASS**, 54 eligible/10 gated routes, 201 files; zero published legal/Technical routes, no Path paths, `deployable:false`, Preview intake, Apache deny-all. `production-refusal.log`, `production-rehearsal.log` and hashed rehearsal receipt. |
| Legal integrity and parity | **PASS**: seven exact approved hashes and register unchanged, seven OWNER_ADOPTED/zero PUBLISHABLE; 125 adoption and 39 parity specimens. Served development legal pages match 7 documents/109 clauses/406 paragraphs; 208 consumer-facing links checked. Production rehearsal publishes none. |
| Browser input controls | **PASS for synthetic/installed-source subjects**: 411 JavaScript cases and 161 Python cases; source/workflow/package/lock identity and downloader suppression. **UNVERIFIED** actual Linux acquisition/loader/consumer acceptance. Windows installation observation fails closed because `execFileSync('npm')` cannot spawn `npm.cmd`; no Linux guard relaxed. |
| Audits and compatibility | Fresh production **0**. Full audit **17 high entries / UNACCEPTED**, from three underlying advisories. Eleven actual consumer resolutions and temporary-file/ID/loopback-FTP/Markdown/Vite/sanitisation/IP behavior tests **PASS**. |
| Axe, cookie and security headers | **PASS** on normal local build: 76 route/state analyses plus 2 deferred-footer analyses, zero violations, existing adjudicated incompletes and zero unresolved. No analytics requests/cookies or Consent Mode signals; current/legacy/no-JS notice paths covered. Three header routes and legacy/WordPress/query/slash redirect subjects pass. Existing crash-shell M-P1-1 limitation remains. |
| Facts/content/reviews/Path | **PASS**: confirmed wording and ten fact questions across 18 served routes; zero public placeholders/team claims; 11 served review-suppression subjects make no Freelancer API calls. Public Path 404; retained probe exercises 7 answer sets/6 outcomes. Empty/published Insights sitemap branches are permanent specimens. |
| Responsive/Press/Design/Digital | **PASS** on retained complete served run: 51 overflow combinations/17 fixed-bar subjects; Press typography, writing/flags/controls/motion/no-JS; full Design scene/mobile disclosure/lifecycle matrix; Digital 2007 text boxes across six sizes, timeline/reduced-motion/Save-Data/no-JS. Their source and application code are unchanged by the later Master correction. |
| Corrected Master and accessibility | **PASS**, rebuilt source: 12 viewports × 6 chapters/12 transit positions, all 14 scene questions; 4 phone/tablet and 14 desktop hero sizes; 12 consent/footer-focus cases and 2 actual WebGL live reduced-motion cases. Model and actual-code lifecycle/invalid-geometry cleanup proofs pass. Four leaked-review-carrier specimens reject. Original carousel-control and undefined-form failures remain in the first run's log. |
| Refreshed static browser/forms | **PASS**, plain-loopback export: 13 pages, 13 focused axe analyses/zero violations, 13 no-JS pages, scenes/navigation/reduced-motion/skip-link/404, no reviews and both Path paths absent. In-memory Edge form proof: 4 desktop/mobile Contact/Press accepted paths, 10 focused axe analyses, pending/retry/error/value/focus/fixed-redirect and no-JS email alternative. All endpoint POSTs are intercepted; zero live submissions. |
| Normal deployment probe exclusion | **PASS**, fresh build with `GRIDSMITH_EXCLUDE_PROBES=1`; neither Path Finder path exists in its built app manifest. The exported profile independently excludes both paths. |
| Linux/hosted/manual release | **UNVERIFIED**: exact-SHA CI, Linux browser and Lighthouse, hosted Apache/CDN/security/cookies/redirects/intake, real-device/GPU/manual assistive-technology and owner visual acceptance. Lighthouse's Windows skip is not a pass. |

The complete original served batch returned two failures; it is not labelled green. Superseding
Master results control the corrected questions. No test expectation or accessibility threshold is
reduced to hide a failure, and local automated checks do not certify whole-site WCAG acceptance.

## Readiness and remaining owners

| Gate | Current release boundary | Owner and prerequisite |
|---|---|---|
| B01 source convergence | Local candidate reconciled; final local matrix below controls its verification status. | Engineering: separately authorised exact-SHA Linux acceptance. Historical green CI is not acceptance of this branch. |
| B02 factual/placeholder content | Corrected in source; shared company overlay avoids provider writes. | Engineering/owner: acceptance on the final authorised artifact. |
| B03 bundle decision | Approved BLD-01 implementation/ceiling/probe reconciled together. | Engineering: fresh candidate baseline and negative proof; Linux gate remains separate. |
| Dependency security | Targeted fixes and explicit residual findings; no automatic risk acceptance. | Owner/security: decide active unfixed toolchain advisories and durable authenticated browser input maintenance. |
| B04 reviews on older hosted artifact | Candidate suppression required; older hosted display is not changed by this task. | Owner/hosting operator: separately authorise replacement and served suppression acceptance. |
| H4-B intake/notification/availability | Runtime safeguards restored locally; current deployed configuration and live promotion unverified. | Operator/owner: exact source/config/origin/sender identity, synthetic acceptance, privacy co-publication, live-mode/drain authority and recent availability receipts. |
| B05 WordPress/hosting recovery | No fresh restore-proven WordPress backup or rollback acceptance. | Owner/hosting operator: hashed files+database backup, isolated restore, document-root/settings and complete DNS/mail baseline, protected recovery copy, rollback triggers/window. |
| B06 publication/channel/cutover | Seven OWNER_ADOPTED; nothing PUBLISHABLE or deployed. | Owner: exact artifact/channel, all-seven prerequisites and publication/cutover authority. DNS/mail and serving-origin headers/cookies/redirects need later acceptance. |
| Accessibility/performance | Local automated evidence has its recorded limits. The normal-runtime SSR crash probe still characterises the existing M-P1-1 Level A gap (no lang/h1/main); it is not an accessibility approval. | Owner/engineering: Linux Lighthouse/browser/scene acceptance, agreed devices and manual assistive-technology review; resolve the crash shell before accepting that Next runtime. The static export has its own browser evidence. |
| Agency/transfer/rights | Public adoption does not execute private agreements or authorise personal-data access. | Owner: actual signed/access/country/transfer and rights-chain evidence before the relevant work. |

**Next single recommended task:** exact-candidate Linux acceptance, beginning with read-only
provider-trigger safety preflight and residual-security disposition, then CI/browser/Lighthouse
only under separate explicit push/dispatch authority. This is a
recommendation only; no GS-LAUNCH-003 execution, push, dispatch or publication begins here.

## Execution notes

Independent source reviews cover release/spec, security, accessibility, design, content and rules.
Their actionable findings were addressed: probe filename exclusion, unrelated operational test
dependencies, empty-Insights sitemap parity, and LF-normalised independent package pins.
Reviews establish source findings; runtime results remain separately reported.

Initial integration checks exposed stale generated route types and a reserved test variable;
clean rebuilding and a local test-variable correction address them. A Windows file-open failure
during an exact-version npm command made no package/lock change; resolution was prepared in an
ignored disposable directory, reviewed and transferred atomically before clean installation.
No application safeguard or threshold was relaxed. Intermediate failures are recorded separately; overwritten logs are not credited as retained raw
evidence, and no failed attempt is recast as a pass.
