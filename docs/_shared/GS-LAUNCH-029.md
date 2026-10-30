# GS-LAUNCH-029 — production readiness and cutover preflight

30 October 2026, Europe/London. **CONDITIONAL: preparation complete; production remains HOLD.** This is an executable release sequence and a separate correction candidate. Nothing in this task adopts legal text, makes it PUBLISHABLE, writes production CMS data, activates providers, publishes an artifact, replaces WordPress or authorises cutover. No support communication.

## 1. Preserved release and scope

- Accepted source: `codex/gs-launch-027`, `629accd00e30b09394e6d3ef419999b2c8af0ec5`, [draft PR #5](https://github.com/atikmurtaza/Gridsmith-Ltd/pull/5).
- Accepted Linux CI: [40985674273](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/40985674273), SUCCESS. Publication workflow [41050245738](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/41050245738), SUCCESS. Both still bind the accepted source, not the new corrections.
- Frozen preview: `https://mediumaquamarine-wallaby-594070.hostingersite.com`; artifact `bc7142541f7f6be325f615737025e0d494bbfb97c7a6058a5c92849b5020f517`; artifact branch `codex/gs-hostinger-artifact`, commit `adbe957c9b3cd9cf3dd90a16af3d5ef56097a823`.
- Fresh GET at 17:12 UTC matches that source/artifact and identity SHA-256 `79fabdad5c0a69f5e4737d0a3b7ed48411166cd9495948e7824b4141c871bbe8`. Both analytics flags are false.
- GS-LAUNCH-028's owner confirmation of Auto-deployment OFF after reload is retained. No request to repeat its historical Redeploy or OFF operation.
- `gridsmith.uk` currently returns the WordPress site; `https://www.gridsmith.uk/` returns 301 to the apex. These observations establish the old destination, not acceptance of the future replacement.
- Isolated preparation branch/worktree: `codex/gs-launch-029`, based on the accepted source. The primary checkout and pre-existing dirty worktrees are preserved. No rebase, force push, main merge or worktree deletion.

Read actual final 027/028 records from the 028 worktree, 025/026 packets and evidence, the legal manifest/register, activation record, build/migration/source controls and Hostinger transaction code. Current user instructions override historical requirements to contact support, restore WordPress again or create owner inventory files. Repository agent strategy authorises independent read-only gate, legal/contact and analytics/review audits. No knowledge graph exists in this worktree; no graph generation was needed.

## 2. Engineering corrections prepared here

**029-C1: consent safety.** The accepted loader can initialise and opt PostHog in after withdrawal if its script finishes downloading afterwards. The defect was reproduced against accepted source in an in-memory callback proof. `lib/analytics/load.ts` now rechecks the latest live grant and its remaining lifetime before initialisation; concurrent grant applications do not duplicate the pending script. An expiry timer stops providers in an already-open document, with bounded timer intervals and resume/visibility checks. `lib/consent/decision.ts` rejects future-dated grants. Committed runtime/clock specimens and browser delayed-download/future-choice scenarios cover these cases. No provider is configured or activated by this change.

**029-C2: executable production acceptance.** Existing acceptance could serve only owner-preview bytes or the explicitly non-deployable rehearsal; the UI gate silently omitted production's seven legal routes. Extend the existing tools, rather than introduce a second verifier:

```text
node scripts/with-preview-apache.mjs --production
node scripts/check-hostinger-http.mjs --local-production-release
node scripts/check-hostinger-http.mjs --production
STATIC_BASE_URL=https://gridsmith.uk node scripts/check-static-ui.mjs --production
```

The first command is Linux-only local Apache acceptance of a future eligible `out/` artifact. The second is its loopback HTTP step, not a standalone server. The third/fourth are read-only checks after authorised cutover, bound to the exact production origin. Preview and rehearsal modes remain separate. Production identity rejects wrong origin/dataset, preview legal text, proposal text, intake, rehearsal, dirty source and invalid identities. Production UI includes all seven legal routes and requires the publication banners to be absent; CSP checks account for exactly the selected analytics mode. Pure positive/adverse identity specimens cover each required field and legal-route count. These tools are prepared, not proof that a production artifact exists or passes.

No approved presentation, runtime feature, canonical legal source, adoption register, accepted workflow or provider setting is changed. The only application change is dormant analytics consent protection. Its lazy chunk must receive fresh acceptance before activation.

## 3. Actual gates and their dependencies

| Gate | Current classification | Exact condition / next dependency |
|---|---|---|
| Accepted preview provenance | Satisfied | Source/run/archive/live identity match. Preview stays frozen. |
| Final visual/content acceptance | Owner approval | Owner has not accepted this latest deployed review candidate. |
| Revised legal adoption | Owner approval | Seven reviewed proposals are unadopted; corrected Privacy below must be read separately. |
| Direct contact | Partly evidenced; one owner custody fact missing | `productionInputProblems` requires direct-mode Privacy plus a nonblank `DIRECT-CONTACT-VERIFIED` receipt. A reference is not evidence by itself. |
| Legal publication | Owner approval plus technical evidence | Register and migration must permit **all seven**; current state is seven OWNER_ADOPTED originals, zero PUBLISHABLE. |
| Cookie Stage A | Technically resolvable after final configuration | Pre-cutover Hostinger-stack evidence, then exact final production-artifact repeat. No production-origin PASS is prefilled. |
| Analytics | Optional deployment choice; separate authority | Any identifier requires matching policies, valid configuration and recorded `ANALYTICS-READY`. Neither provider configured is allowed without that receipt. |
| Reviews | Deferred, not a service-launch blocker | Written republication rights and explicit activation remain absent. |
| CMS legal payload | Technical work after authority | Dry-run currently 47 eligible/10 gated; later all-seven publication produces 54 eligible/3 Technical services withheld. |
| Final production build / Linux acceptance | Future executable work | Approved canonical/legal/CMS/configuration and committed source, then immutable archive/run/log identities. |
| Destination preparation/cutover | Exact later authority | Existing gridsmith.uk website/root; no Change domain. |
| Actual-origin delivery/indexing/cookies/mail | Actual production origin | Measure only after separately authorised replacement. |
| Manual accessibility/device checks | Outstanding disclosed limitation | Automated and emulated testing does not establish complete WCAG conformance. Review actual remaining issues; do not invent manual acceptance. |

The actual production-builder negative run refuses **eight predicates**, all in `lib/build/production.ts`:

```text
LEGAL: DIRECT-CONTACT-VERIFIED has no recorded owner/verification receipt
LEGAL: privacy is not PUBLISHABLE (register OWNER_ADOPTED, migration gated)
LEGAL: cookies is not PUBLISHABLE (register OWNER_ADOPTED, migration gated)
LEGAL: terms is not PUBLISHABLE (register OWNER_ADOPTED, migration gated)
LEGAL: client-terms is not PUBLISHABLE (register OWNER_ADOPTED, migration gated)
LEGAL: business-client-terms is not PUBLISHABLE (register OWNER_ADOPTED, migration gated)
LEGAL: consumer-client-terms is not PUBLISHABLE (register OWNER_ADOPTED, migration gated)
LEGAL: accessibility is not PUBLISHABLE (register OWNER_ADOPTED, migration gated)
```

The builder itself already selects direct mode and refuses an intake URL. Direct-mode Privacy already substitutes DIRECT-CONTACT-VERIFIED for H4-B. No obsolete form predicate needs removal. Production fixes origin to `https://gridsmith.uk`, refuses a staging override and refuses proposal display. Malformed analytics configuration, missing policy disclosure or missing readiness refuse earlier if identifiers are supplied. Later checks reject seed/unreviewed/gated content, incomplete legal payload, exposed secrets, incorrect artifact/indexing/headers and review leaks. A production rehearsal waives legal inputs only and remains explicitly non-deployable; it is not a release.

## 4. One legal adoption packet

Fresh hosted parity: **7 documents, 110 clauses, 430 paragraphs, 29 exact cross-reference links**, no self-links; each clause reachable. All original GS-LAUNCH-026 manifest hashes match independently. Four link-only revisions preserve exactly the adopted served words. Effective dates remain **first publication with the replacement website at gridsmith.uk**, not a manufactured calendar date. Existing contracts retain their agreed versions.

**029-L1 correction:** Privacy 2.8's purpose table says Gridsmith does not receive the choice cookie. Both notice and analytics-choice implementations set an ordinary `Path=/` cookie. Browsers return applicable cookies to hosting in HTTP request headers ([RFC 6265 §4.2.1](https://www.rfc-editor.org/rfc/rfc6265.html#section-4.2.1)). No separate consent-event database does not mean no cookie transport. The frozen Privacy 2.8 is unchanged, hash `f054f126665d51539574bf1a27c552f25a6e2dc99f6b92ebd93c738833dc2c8b`.

Prepare **Privacy 2.9**, separately under `docs/_legal/proposed/GS-LAUNCH-029/`. The version/review date, purpose-table cell and analytics disclosure change: the browser sends the cookie to hosting; Gridsmith keeps no separate individual-choice log. It parses through the existing legal parser, has no self-link and preserves commencement. A second factual correction distinguishes GA4 standard first-visit, session and engagement information from PostHog page views; Enhanced measurement OFF does not suppress those standard Google events ([Google automatic events](https://support.google.com/analytics/answer/9234069)). Cookie **2.6** makes the same narrow correction to its analytics sentence. The original Cookie 2.5 remains frozen. Both corrected proposals are separately readable, not yet rendered on the public preview, adopted or publishable. No unrelated clause is rewritten. This is a factual proposal, not professional legal certification.

The sole recommended adoption set is the `documents` array in **GS-LAUNCH-029-ADOPTION.json**:

| Document | Version | SHA-256 | Revision |
|---|---|---|---|
| Privacy | **2.9** | `449db68c0c452b214e78f68a33f4123d7b6c09bfdba1b9d54055db1392227764` | Substantive; replaces proposed 2.8 only for future adoption |
| Cookie | **2.6** | `66023b43f37a3a8c42fedb31b8229cdb0970420d5bed965911ae276a108e7da3` | Substantive |
| Website Terms | 2.4 | `5a89cec4ea564a64bbcc55f692cccb94f421011f86233b7e62916d2a0d977571` | Links only |
| Client Terms Applicability | 2.4 | `1aae31572444d6c543fddbab71b66138ffb06ba516d4d10d836835a474cdfa6a` | Links only |
| Business Client Terms | 3.4 | `e7f1a7c1a1b64d66349aa4f3c806d4953ed739e5f36ceb6bd26724948168c0de` | Links only |
| Consumer Client Terms | 3.5 | `aeed75437292bd352ba86951061e4519fab44503881985249d56093d6b88488c` | Links only |
| Accessibility Statement | 2.5 | `e7b7f71e34c44db2202c9f41c1a09073c46ef25e05f34127c1263750d7da211f` | Substantive |

Substantive summary: Privacy separates Freelancer platform records from Gridsmith's actual copies/messages/logs, describes existing public-source review copies and conditional analytics, provider categories, retention and international access/transfers. Hosting in the EEA is not a claim that every processor operates only there. Cookie describes provider-by-provider opt-in, 180-day choices, actual cookies/session storage, refusal and cross-tab withdrawal; notice-only mode remains accurate. Accessibility describes the actual automated audit, focus/motion fixes and the unperformed assistive-technology, manual and physical-device checks. Retention statements retain their actual anchors; provider query windows are not presented as deletion. Disabled reviews and future processing remain distinct from existing source/development holdings.

**OWNER ACTION: Adopt the corrected seven-document set.**

**PURPOSE:** Approve exact revised wording, separately from publication.

**WEBSITE/TARGET:** The frozen [owner preview](https://mediumaquamarine-wallaby-594070.hostingersite.com/) for five unchanged proposals, and the separate [Privacy 2.9](../_legal/proposed/GS-LAUNCH-029/privacy-policy-2.9.md) and [Cookie 2.6](../_legal/proposed/GS-LAUNCH-029/cookie-policy-2.6.md) proposals. Privacy 2.8 on the preview is not the proposed final adoption text.

**STEPS:** 1. Finish visual/content review of the preview. 2. Read the separate Privacy 2.9 and Cookie 2.6 cookie-transport/GA4 disclosure corrections. 3. Check the seven versions/hashes above. 4. Reply with the adoption wording, or the specific change you require.

**EXPECTED RESULT:** One exact, recorded adoption decision; technical adoption integration can follow in a separately reviewed source candidate.

**DO NOT:** Treat this as PUBLISHABLE, production CMS/build/deploy/cutover, analytics, reviews or account-change authority.

**REPLY WITH — proposed wording, not approval already received:**

> I adopt the seven exact documents in the documents array of GS-LAUNCH-029-ADOPTION.json: Privacy 2.9, Cookie 2.6, Website Terms 2.4, Client Terms Applicability 2.4, Business Client Terms 3.4, Consumer Client Terms 3.5 and Accessibility Statement 2.5, with the SHA-256 fingerprints in GS-LAUNCH-029 section 4. I authorise their local canonical/adoption integration and validation. This does not make them PUBLISHABLE or authorise production CMS writes, a production build, publication, deployment, analytics/reviews activation, or gridsmith.uk, WordPress, DNS, mail or hosting changes.

Separate later all-seven publication decision: approve publication together with the separately authorised replacement-site cutover, conditional on actual direct-contact and Stage A cookie evidence. The current task does not record that decision or change the register. Do not substitute the older GS-LAUNCH-025 hashes.

## 5. Direct-contact and data readiness

The owner declares that Freelancer holds existing platform client/project records and Gridsmith has no separately retained customer collection in internal files/client database. Record that as an owner attestation. It does not establish empty email/WhatsApp accounts or absence of visitor/request logs, historic probe exports, source-review copies or future communications.

The agent prepared `direct-contact-preparation.json` privately, reusing actual evidence rather than assigning a new inventory project:

- 27 October 23:22 UTC aggregate observations: Production and Preview each had zero leads, events, Press results, sample grants and notification-outbox records. Technical state rows existed; technical logs were observed in the recorded 24-hour window. These are dated observations, not fresh 30 October database counts.
- The 7 October retention log was corroborated; the restricted pre-cleanup export existed. Next monthly review is 2 November, not claimed completed. Zero deletion candidates does not mean empty accounts.
- R11's existing Hostinger contractual-coverage conclusion remains recorded; no new administrator contract, host migration or restoration programme is demanded.
- Accepted source and hosted evidence establish no active website forms, direct email/WhatsApp, a usable email alternative and no live submission/notification test.
- Inaccessible provider log/backup deletion and other uninspected stores remain unknown; recorded technical holdings are not relabelled absent. No mailbox, private message or device inspection is fabricated.

**OWNER ACTION: Confirm current channel custody — one statement.**

**PURPOSE:** Finish the narrow access/forwarding/linked-device fact the agent cannot infer from public pages.

**WEBSITE/TARGET:** [Hostinger Email](https://hpanel.hostinger.com/emails), `contact@gridsmith.uk`; the business WhatsApp account actually linked by the website.

**STEPS:** 1. In Hostinger, choose Emails → Mailboxes beside gridsmith.uk; inspect the mailbox and Forwarders → Manage Your Forwarders. Inspect webmail forwarding/delegated access if applicable. 2. In WhatsApp, use Android More options → Linked devices, or iPhone Settings → Linked Devices. 3. Confirm the listed access/forwarding/device custodians are authorised and the email alternative is accessible and monitored. Do not open or share customer conversations.

**EXPECTED RESULT:** One dated custody attestation; agent appends it to the prepared private record and assesses the remaining unknowns against the actual disclosure. A blank reference is never promoted as verification.

**DO NOT:** Change passwords, forwarders or devices; send messages; export records; create documentation files or paste private addresses/device IDs.

**REPLY WITH:** `Checked on [date]: contact@gridsmith.uk is accessible and monitored; mailbox forwarding/delegation and business WhatsApp linked devices are under authorised custody [or describe the exception]. Direct enquiries are not copied into other systems [or identify the category].`

Navigation basis: [Hostinger forwarders](https://www.hostinger.com/support/1583221-how-to-set-up-a-forwarder-for-hostinger-email/). No owner-created O3–O5 files are requested; GS-LAUNCH-026 explicitly withdrew those earlier asks. Genuine unresolved provider/retention exceptions cannot be closed by a custody sentence alone.

## 6. GA4/PostHog readiness and minimum account work

The integration remains dormant. Current accepted preview has no providers; fresh identity and GS-LAUNCH-028's browser/network/storage observations agree. Configuration, explicit activation authority, accurate adopted/publication-eligible notices and **ANALYTICS-READY** remain independent. `analyticsReadinessProblems` checks only receipt presence; the operator must assess real settings/contracts/retention/transfers, not invent a reference. Policies can describe conditional analytics while a notice-only build runs; neither provider is mandatory in `productionInputProblems`.

**PostHog account exists and was inspected through the read-only connector.** EU project **315488, Gridsmith Staging Project**, ingestion host `https://eu.i.posthog.com`. IP anonymisation true; autocapture opted out; session recording, heatmaps, surveys, console/performance/exception capture and dead clicks disabled. Project metadata says no event ingested; this is not a fresh event-table audit. Existing local phc_ value differs from the connector's current project key, so do not reuse that stale value. Verified current public key is retained only in private preparation, never injected into a running build. The name “Staging” does not prevent technical reuse; the owner must approve that actual project as the production destination before activation. No new account/project is necessary by default.

PostHog's Free one-year event query window is **not a deletion mechanism**; current [retention documentation](https://posthog.com/docs/data/events-retention) says use explicit [data deletion controls](https://posthog.com/docs/privacy/data-storage#data-deletion). Neither a shorter retention request nor a support ticket is required here. Before activation, verify the actual plan, executable deletion/rights routine, provider DPA/transfer basis and access arrangements. If that cannot yet be evidenced, PostHog stays disabled; no invented physical-deletion guarantee.

**GA4 is not yet verified.** Browser inventory exposed existing property **550714475**; no Measurement ID is present in the inspected local config or accepted build. Inventory is not proof of its stream, ownership, settings or suitability. Browser inspection subsequently timed out, then explicitly reported “Local browser use is disabled in Work settings.” No bypass or account changes. Re-enabling access lets the agent do the inspection; otherwise the owner can provide only the public ID/settings below. Do not create another property merely because its ID is not yet known.

**OWNER ACTION: Inspect existing GA4 stream.**

**PURPOSE:** Identify the correct existing web stream and minimise its collection.

**WEBSITE:** [Google Analytics](https://analytics.google.com/analytics/web/).

**TARGET:** Select the Gridsmith property; verify property ID 550714475 belongs to Gridsmith before using it.

**STEPS:** 1. Click Admin → Data collection and modification → Data streams → Web. 2. Open the Gridsmith stream and inspect its website URL; it must be for `https://gridsmith.uk`. Copy its **G-… Measurement ID**, not the numeric property/stream ID. 3. Inspect Enhanced measurement: it must be OFF, because this integration supplies page views itself. 4. Inspect Admin → Data retention: event/user retention must be 2 months and Reset user data on new activity OFF. 5. Inspect Admin → Data Collection: Google signals and user-provided data collection OFF; keep advertising links/personalisation outside this launch. If any value differs, report it or separately approve its exact correction; this task has made no account changes.

**EXPECTED RESULT:** Verified public measurement ID and actual minimised settings, or precise mismatches for the agent to correct under appropriate authority.

**DO NOT:** Paste a Google tag into WordPress/Hostinger, enable enhanced measurement/advertising, create an API secret, or send credentials.

**REPLY WITH:** `Gridsmith property [ID], stream URL [URL], Measurement ID G-…; Enhanced measurement OFF; retention 2 months/reset OFF; signals/user-provided data OFF [or list mismatches].`

Current official controls: [Measurement ID](https://support.google.com/analytics/answer/12270356), [enhanced measurement](https://support.google.com/analytics/answer/9216061), [retention](https://support.google.com/analytics/answer/7667196), [signals](https://support.google.com/analytics/answer/9445345). Aggregated reports are outside the user/event retention setting. If no Gridsmith property exists, only then use Admin → Create → Property, select UK time zone/currency, then add a Web stream for gridsmith.uk with Enhanced measurement OFF; any terms acceptance is an owner operation.

Public build configuration is `NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-…`, `NEXT_PUBLIC_POSTHOG_KEY=phc_…`, `NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com`. These are browser-visible identifiers, not secrets. Personal PostHog phx_ keys, Google account/service-account credentials, Measurement Protocol secrets, CMS/hosting tokens and passwords must never be shared or put into public/client configuration. Do not run the providers' default installation snippets: the consent loader already owns installation.

**Production activation tests, exact final artifact:** no first-visit provider request/cookie/storage; unticked per-provider options; equally prominent accept/reject; refusal and no-JS retain contact functionality; each single-provider grant and both grants; site-sent path-only page views plus disclosed standard GA4 events, with no queries/fragments/text/identification; no replay/heatmap/autocapture/ads; valid secure cookie scope and expiry; page views without duplicates; same-tab and other-tab withdrawal; delayed-library withdrawal; expired/future/malformed/legacy choices; active-page expiry and resume; no storage remnants; exact CSP/origin; account-specific receipt and explicit authority. Use test identifiers and intercepted collection for pre-cutover tests; genuine production collection is separately authorised. Real library compatibility and actual-origin checks remain future tests.

If the owner chooses notice-only launch, unset both provider IDs (and avoid a mismatched host), retain accurate conditional policies, rerun the notice-mode checks and record that choice. This permits website launch without analytics account completion. It does not meet the owner's preference for both providers; ask for the explicit fallback decision rather than choose it silently.

## 7. Freelancer rights and existing exposure

Feature stays disabled. Accepted artifact/hosted checks find no review carousel/comments/ratings; source activation guards still fail closed. The repository is currently public. Existing source holds **11 verbatim review bodies/ratings** in `lib/reviews/staging-approved.ts`; seed data holds **6 review records with 6 first-name fields and 1 username field**. Removing visible names from a quote does not guarantee anonymity. Public-source and development copies are existing holdings even though the site displays none.

Written off-platform republication rights are not evidenced. Review exports remain subject to [Freelancer User Agreement §11](https://www.freelancer.com/about/terms). No review text, names or usernames are reproduced in this report. Permission remains separate from website launch.

Smallest prepared cleanup: restricted private source copies and SHA-256 custody record are retained. Under a later exact cleanup approval, remove real review arrays from the public snapshot/seed, retain synthetic adverse gate specimens and query/bind the exact affected development testimonial IDs before any authorised deletion. Assess the deletion diff and callers first. No Git history rewrite; older commits/forks may remain accessible. No public/CMS deletion or support request occurs now. Rights activation is not enabled by cleanup.

## 8. Production destination transaction

**Keep gridsmith.uk on its existing website association. Replace only its document-root content.** Do not use Change domain, delete/recreate the website, move it to the temporary website, change DNS/nameservers/mail, or uninstall WordPress through a flow that changes account associations. The downloaded WordPress backup is already in owner custody; no new restoration programme or customer-data migration.

Fresh hPanel read-only navigation confirmed the existing gridsmith.uk WordPress website and its own Files/File Manager and Advanced/GIT menu entries. Detailed Git mapping/root/auto-deployment inspection was interrupted; none is claimed verified. No Hostinger connector is configured. These limits do not prevent defining a supported upload route.

Supported methods, verified against current primary documentation:

1. **Controlled upload is the minimum-dependency first-cutover route.** Websites → gridsmith.uk → Manage site → Files → File Manager → access files of this website. Verify the actual domain/root breadcrumb and inventory before any change. Prepare the exact accepted static archive with index.html and .htaccess at its root; after later exact authority, preserve only this site's old root outside public serving, replace its contents and activate the prepared files. Use the existing document root; do not create another site. [Hostinger file management](https://www.hostinger.com/support/4548688-basic-actions-in-the-file-manager-in-hostinger/) and [archive extraction](https://www.hostinger.com/support/1869114-how-to-upload-backups-with-file-manager-in-hostinger/) document these operations. No atomic root-switch guarantee is assumed. Account filesystem details are checked at execution; if a safe outside-public-root location is unavailable, keep the downloaded backup and use a scoped file inventory, not a publicly reachable WordPress backup directory.
2. **Separate production Git route is also supported, but initial Deploy is a production write.** Existing site's Advanced → Git; reuse the authorised GitHub installation, select `atikmurtaza/Gridsmith-Ltd`, **`codex/gs-hostinger-production-artifact`**, root **`public_html`**. Recheck the actual account's target path and whether it requires an empty directory; never clone the source branch. Current [Hostinger Git instructions](https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/) confirm initial Deploy immediately publishes and enables subsequent automatic deployments. Create/populate the separate artifact-only branch only during the later approved transaction. Turn auto-deployment OFF after first Deploy and every Redeploy, reload and verify; do not assume saving Git settings is passive preparation.

For upload, confirm no active Git mapping can overwrite the root; disabling/changing an existing production mapping needs the exact later transaction authority. For Git, branch pushes must be controlled as production publication until OFF is freshly observed. Source/feature pushes cannot reach the separately named production artifact branch through the current preview-only publisher. The existing preview publisher must not be repointed or renamed into production. No production publisher or extra deployment system was added here.

Public DNS read-only preflight observed MX, SPF, DMARC, all three Hostinger DKIM CNAMEs, nameservers and www mapping. Values are retained privately for before/after equality; no value was changed. This proves those records existed at the observation time, not mailbox access or delivery. The preservation inference is conditional: changing only the site's files leaves domain/mail records untouched. Re-read the complete relevant zone and actual mailboxes immediately before the approved transaction, preserve all unrelated subdomains/sites and stop on unexplained drift.

**Recovery:** inspect the already-downloaded backup's availability/archive inventory before replacement; do not require another live restore. Prefer retaining this exact WordPress root outside public serving and leave its database unchanged. If critical acceptance fails, stop publication/analytics, restore the captured previous root/.htaccess under the approved rollback scope (and disconnect/disable Git first if it could overwrite recovery), verify WordPress and mail/DNS continuity. No database restore is needed merely because static files changed. If only the downloaded archive is usable, restore the exact old root from it. Do not claim a timed or atomic rollback until that account's mechanism has been observed. For subsequent static releases, retain the prior accepted archive/tree and use a normal forward rollback commit or exact scoped re-upload; never force push.

The two frozen temporary-hosting findings remain **strict FAIL**: provider-generated robots.txt and missing CSP on nine PNG responses. Document/executable CSP passed. They are neither waived nor debugged again here. The real origin must pass its own strict robots/CSP/indexing checks; do not infer identical provider behaviour from the temporary hostname.

## 9. Exact future release order

1. Receive final visual/content acceptance; record the specific motion changes separately if requested. Receive corrected all-seven legal adoption and the one custody fact. Resolve any actual retained-provider exception; do not invent erasure or mailbox inspection.
2. Choose analytics destination/mode. For both providers, finish actual settings, terms/DPA/transfer/retention/rights assessment, explicit activation authority and `ANALYTICS-READY`; otherwise receive explicit notice-only fallback. Keep reviews/forms off.
3. Prepare local canonical/adoption integration from the exact approved packet. Update canonical files, register versions/fingerprints and consumer workflow consistently. Retire `ACTIVE_LEGAL_PROPOSAL` in `scripts/seed-legal.mjs` and reconcile the hardcoded GS-LAUNCH-026 proposal environment in `hostinger-staging.yml`; otherwise subsequent acceptance correctly refuses supersedes mismatch. Do not alter the accepted preview branch, artifact or website.
4. **Cookie Stage A:** use committed final configuration/behaviour on the local Hostinger stack before legal publication eligibility. The existing non-deployable `GRIDSMITH_STATIC_PROFILE=production node scripts/build-static.mjs --rehearsal` can prove direct-contact/cookie behaviour before PUBLISHABLE, with `check-consent.mjs --production-rehearsal` explicitly omitting the withheld Cookie route only after verifying the loopback rehearsal identity; the approved canonical policies remain the disclosure subject. Do not label that rehearsal a release or a legal-page acceptance. Assess real direct-contact evidence and obtain the separate conditional all-seven publication decision. Only then record authorised prerequisites and all-seven PUBLISHABLE together. No production-origin test is required before the replacement exists; its later repeat remains mandatory.
5. Prepare CMS migration dry-run and full payload diff against a read-only export of the actual production dataset. `--write` overwrites **all eligible records**, not only seven legal records. Verify export integrity, affected IDs, exact content and distinct CMS-write authority before executing. Its `--rollback` deletes eligible IDs; it is not an export restoration. Do not use it as a recovery shortcut. After an approved write, run `--read-production` and exact seven-text parity/absence checks. Technical services stay withheld.
6. Reconcile source without force pushes: merge accepted PR #5 into `codex/gs-launch-023` only after authorisation/acceptance; review this correction PR against 027, then retarget it to 023 after #5 integration so its diff remains focused. Integrate accepted corrections and later legal/configuration work into 023, with conflict review and fresh CI. Finally refresh PR #3 into main and obtain separate merge authority. PR #4 is already contained by #5 and should be marked superseded rather than independently merged again. No merge is performed here. Main merge is not cutover.
7. Under separately authorised **build-only** scope, clean-build committed approved source with `GRIDSMITH_STATIC_PROFILE=production`, exact production origin and exact CMS/configuration. Run normal mandatory source checks, `check:static:artifact`, Linux Apache `with-preview-apache --production`, legal parity, consent and desktop/mobile Lighthouse. Recheck cookies against this exact resulting artifact; source-level Stage A evidence alone is not archive acceptance. No local exception or earlier run can accept different bytes.
8. Freeze archive, every-file manifest, source SHA, CMS revision snapshot, analytics mode, acceptance log/run hashes and whole ZIP hash. Preserve an offline copy. Record the separate artifact-branch tree/commit if choosing Git. An archive carrying preview noindex, proposal banners, wrong canonicals or temporary-origin URLs is refused, not renamed.
9. Present **one concrete production transaction approval** naming source, successful Linux run, artifact/ZIP hashes, gridsmith.uk existing website/root, chosen upload/Git method, allowed WordPress-file replacement, mail/DNS exclusions, OFF verification and conditional rollback to the captured old root. Include unavoidable non-atomic maintenance exposure. Approval is required at this boundary; no approval is inferred from visual/legal review.
10. Immediately before the approved write: re-read target, domain/mail/zone state, backup/root custody and any competing deployer. Prepare only this site's root. Activate the exact accepted static artifact; if using Git, verify OFF after Deploy/Redeploy and reload. No Change domain, account/site deletion or unrelated path mutation.
11. **Actual-origin Stage B:** exact identity and every route/file; seven legal pages/links/parity; HTTPS/http/www redirect/canonical; sitemap and robots/indexing with no preview noindex; CSP including PNGs, MIME/cache/compression, HEAD/404 and protected-file denial; direct email/WhatsApp; actual cookie/network/storage/withdrawal behaviour in the chosen mode. Use `check-hostinger-http --production`, `STATIC_BASE_URL=https://gridsmith.uk check-static-ui --production`, `AXE_BASE_URL=https://gridsmith.uk check-legal-parity`, and `AXE_BASE_URL=https://gridsmith.uk check-consent`. Record actual status, never a promised PASS. Synthetic 500 belongs to local Apache; do not introduce a production fault route or claim hosted-500 verification without a separately authorised mechanism.
12. Send/receive one minimal business-mail delivery test **only under the cutover transaction's explicit mail-test authority**, not a support email or live enquiry. Confirm DNS/mailboxes/unrelated sites unchanged. Roll back promptly on wrong identity, missing legal disclosure, unexpected analytics, critical navigation/asset/security/accessibility/contact failure or production delivery/indexing failure. Complete the actual-origin receipt, then launch closure. Optional reviews do not delay the other services.

## 10. Verification and launch disposition

Machine-readable results, identities, original/final proposal hashes, private-receipt digests and exact NOT RUN items: `GS-LAUNCH-029-EVIDENCE.json`. Raw logs, source-review custody, account/DNS observations and direct-contact preparation remain under the private task-evidence directory, outside Git.

Passed: fresh dependency installation; full local `verify:static`; TypeScript and zero-warning targeted ESLint; original seven-proposal integrity and fresh hosted legal parity; corrected Privacy/Cookie parser/self-link/commencement checks; CMS dry-run/read-only absence; production builder's eight expected refusals; guarded CMS write/rollback refusals before network; preview publisher adverse selftests; per-field production identity/legal-route specimens; consent runtime regression specimens. Browser consent results and final CI status are recorded in the evidence JSON at closeout.

Not run here: production-profile generation, production-artifact packaging/publication, production CMS write, destination root mutation, cutover, actual replacement-origin acceptance, mail send/receive, physical-device/screen-reader acceptance or real analytics activation. Existing preview full visual suites are reused only for its exact frozen bytes. Source correction checks never inherit old CI acceptance.

**Current eligibility:** the preview is ready for owner review; the replacement site is not yet eligible to build/publish for production. Material dependencies are exact owner visual/legal/custody decisions, genuine analytics readiness or explicit fallback, publication/CMS/build acceptance and the separate concrete cutover authority. No additional restoration/migration programme, portfolio/review permission or support ticket is on the service-launch critical path.

**Single recommended next task: GS-LAUNCH-030 — apply the owner's final review decisions and exact corrected legal adoption, complete custody/analytics evidence, then prepare the authorised all-seven publication/CMS transaction and accepted production-profile build.** It should continue from this executable packet; no new broad readiness investigation is needed.
