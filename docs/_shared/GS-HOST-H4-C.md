> **Later H4-D-R1 owner staging override:** Frozen anonymous presentation of the existing 11 reviews is authorised on temporary Hostinger staging only. The historical H4-C prerequisite for H4-D below is superseded. H4-C provider automation and Production review publication remain blocked; no written permission is held. See `GS-HOST-H4-D.md`.

# GS-HOST-H4-C — Reviews / build-time data / privacy / fallback

Date: 5 October 2026. Branch `codex/gs-host-004`, isolated `gs-host-004` worktree.
Starting and ending HEAD: `8e6316cc5a0dda38e0de4c15fa1d8ef9c854b8a1`.

## Result and stop gate

**BLOCKED — provider permission evidence required; limited local privacy hardening prepared.**
Latest R1 outcome: **BLOCKED — PROVIDER PERMISSION REQUEST PREPARED**, owner submission only.
The complete request, response matrix and eight-file classification are in the R1 section below.
Nothing was sent and no conditional implementation was activated.
H4-B remains accepted. H4-C is not PASS, has no commit/push and does not authorise H4-D.
No review snapshot, refresh workflow, external cache or review-bearing release was created.
The pre-existing H4-B `out/` remains historical proof, not an H4-C build or deployable release.

`GS-HOST-H4-C-R1`: the current official Freelancer User Agreement §11 requires written
Freelancer permission to use feedback ratings/comments outside Freelancer-operated sites,
including marketing/export. Current API T&Cs §1 incorporates that agreement. The conditional
API integration licence (§3) does not expressly override that feedback restriction.
`GS-O014` records owner acceptance of the terms and review presentation, not a provider grant.
The owner explicitly confirmed on 5 October 2026: no written permission is held.
This is not a reversal of James/GS-O020 or withholding/GS-O015.

The brief §38 prohibits a PASS commit when materially blocked on provider terms/access.
The AI development protocol additionally prohibits inventing permissions. No legal instrument
was amended and no provider was contacted. A cache-only design does not itself resolve §11.

## Current official provider evidence

Read-only research retrieved the official sources on 5 October 2026:

- [User Agreement](https://www.freelancer.com/about/terms), labelled last modified 5 June 2025:
  §11 Feedback, Reputation and Reviews includes the condition “without our written permission.”
  Ratings/comments are covered, not merely logos or raw API responses. §4 also restricts
  incorporation/mirroring and copying of website content.
- [API T&Cs](https://www.freelancer.com/about/apiterms), labelled last modified 21 December 2017:
  §1 incorporates the User Agreement; §3 is a conditional integration licence. §5 limits
  caching to performance purposes, says caches should refresh at least every 24 hours and
  stored/served data should use strong encryption; other copying/storage, including derived
  information, is restricted. §7 requires permanent deletion following termination subject
  to an applicable agreement/exception. No multi-day outage grace was found.
- [Official review API](https://developers.freelancer.com/docs/projects/reviews#reviews-get):
  GET `/projects/0.1/reviews/`, OAuth scopes `basic` and `fln:project_manage`, header
  `Freelancer-OAuth-V1`. The documented identity combines review ID and review type. Supported
  filters include `to_users[]`, `role=freelancer` and `review_types[]=project`.
- [Official SDK](https://github.com/freelancer/freelancer-sdk-python/blob/master/freelancersdk/session.py)
  corroborates the OAuth header. Today's endpoint still answers the existing unauthenticated
  request; that observed behavior is not permission and is not a guarantee of continued access.

No mandatory review attribution formula or mandatory logo was found in these inspected terms.
Preserve the accepted “Verified review via Freelancer” wording and official profile link;
neither supplies permission, endorsement or logo rights. GS-O022 remains unchanged.

## Current source and preserved owner contract

A bounded, read-only HTTP request using the existing official API URL returned 200 and
13 source reviews, all addressed to user `92543257`. The current transformation produced
11 eligible reviews and 2 withheld identities. James remains eligible (`22179079`).
The source payload existed in process memory only; no raw response, quotation or withheld
reason was saved to a receipt, repository, chat or public log by this probe.

Eligible IDs: `22179079`, `22156296`, `22148254`, `22148334`, `22140811`, `22134775`,
`22131409`, `22111228`, `22100757`, `22061591`, `22055287`.
Permanently excluded IDs: `22108992`, `22100632`.
These are current eligibility/count observations, not independent provider licensing approval.

Existing source retains verbatim quotation, original rating/date, public author display,
closed-taxonomy category and source link. Reviews remain Master-only. The cylinder/visual
workstream, James publication decision and conservative third-party/company/contact rules
are unchanged. No real withheld review text was added to tests or documentation.

## Implemented local privacy hardening

- `WITHHELD_REVIEW_IDS` now explicitly contains both permanent identities and is frozen.
  Mandatory identity checks run independently of the injectable additional manual list.
  An empty injected list therefore cannot bypass either exclusion.
- Permanent IDs are proven with clean synthetic quotations, so the ID branch rather than
  an overlapping text rule is shown to fire. Both identities together, reordering and duplicate
  denied identities are driven through the actual public mapper; only the unrelated fixture survives.
- Historical real-source snippets in the affected review selftests were replaced with
  explicitly synthetic company/text specimens. Text rules still have independent non-denied subjects.
- The existing live gate now logs withheld IDs only. Its withholding reasons can contain source
  names/text, so those reasons must not enter public CI logs. No live gate run was needed to print them.
- Parser/transport exception text is also suppressed. Fixed stage categories and HTTP status
  replace arbitrary errors; offline malformed-JSON, schema, transport and authentication specimens
  prove the fetch substitute was reached, the actual gate failed and the private fixture stayed absent.

The static build's prior temporary `force-cache` substitution is still present and does not
constitute the required H4-C trusted ingestion/LKG architecture. It is not activated as a release.
The inherited runtime module's historical cache-compliance and unbounded stale-outage prose
is explicitly superseded by its new H4-C authority note and this permission/retention gate.
No H4-B source, migration, function, secret or provider configuration was changed.

## Carrier decision — conditional design, not implemented activation

Subject to written display/retention permission, choose **trusted GitHub Actions ingestion**,
then a generated sanitised cache feeding the static build. One ingestion carrier keeps provider
access out of the public renderer; Hostinger still serves files and requires zero persistent Node.

| Candidate | Decision | Reason |
|---|---|---|
| A. Trusted GitHub Actions/build retrieval | Preferred, conditional | Existing build capability; can bound and validate before rendering; no new service |
| B. Supabase Edge feeding the build | Not selected | Adds a separately operated feed/cache without resolving provider rights; H4-B remains intact |
| C. CI-generated sanitised snapshot | Selected only as transient output of A | Suitable build input/LKG if encrypted, bounded and permitted; never a permanent Git snapshot |

No production deployment permissions belong to review refresh. No paid services are required.
No workflow is configured or remotely enabled in this blocked phase. Scheduler availability,
GitHub account storage/quota and successful refresh runs are therefore not claimed.

## Public schema and filter-first pipeline — required continuation

Proposed public fields only: `id`, `quote`, `authorName`, `rating`, `date`, optional
closed-taxonomy `projectTitle`. Profile/source label are fixed presentation constants.
The trusted adapter supplies compatibility null/constant fields expected by the existing
`FreelancerReview` type; do not change the cylinder solely to fetch data.
Do not ship review type, provider-user/project records, company, financial fields, source
counts, withholding reasons, retrieval/operator timestamps or cache metadata to the browser.

Required order: bounded official HTTPS retrieval with redirects disabled → verify account,
review type, pagination/completeness and stable positive IDs → discard permanent identities
without passing their bodies deeper → validate eligible shape/rating/date/text/name bounds →
apply existing privacy rules and approval state → minimise → strict public-schema validation →
authenticated cache integrity/freshness validation → generated temporary public module →
static build/artifact scan. Do not cache raw responses even in Next's build cache.

Duplicate identities with differing content, malformed source, wrong account/type,
missing required fields, unexpected controls or excessive text fail closed. Reject rather
than rewrite genuine quotations. React escaping is retained; never use HTML from reviews.
Proposed retrieval ceiling 1 MiB, text 10,000 characters, name 200 and at most 100 source
reviews/page; these are unimplemented proposed bounds, not measured current guarantees.
Pagination must be complete and identity-safe; never truncate a larger valid account silently.

## New reviews and source anomalies — required continuation

Preserve GS-O015's human-review state for new/changed identities not covered by deterministic
rules. Today's approved identities are not “11 forever”: later owner-reviewed identities can
be added to approval metadata and then appear through normal refresh. A matching count alone
does not approve a substituted or changed review. Retain private safe digests of approved
public records to detect changed content; do not retain raw withheld content or hashes of it.

New IDs are reported as pending review, not automatically published around the human gate.
Loss/change of an approved identity, inconsistent pagination, empty result or dramatic count
change is a visible integrity failure. Define and prove the anomaly threshold during continuation;
it is not implemented here. A benign count increase may retain the unchanged approved subset
only after complete provenance/approval verification. No new source reviews were discovered today.

## Freshness, LKG and retention — conditional design

Target daily trusted refresh plus refresh before a content build. A scheduled run needs no visitor.
Cron is best effort: missed runs must surface to an operator and must not be called a freshness SLA.
No schedule, GitHub secret, cache file or retained review dataset was created in this phase.

Propose a generated encrypted private LKG cache outside Git and the Hostinger artifact. It contains
only sanitised approved public fields plus private provenance/schema/version/retrieval timestamp,
approved identity/digest metadata and authenticated integrity. A later implementation must verify
storage access, encryption, deletion/termination behavior and actual retention against the grant.
GitHub's public repository artifacts cannot be assumed private; encryption and scoped access
must be proved rather than inferred from an upload action or a retention-days setting.

Conservative proposed thresholds pending the grant: fresh under 12 hours; temporarily stale
from 12 to under 24 hours; unusable at 24 hours. This is a design safety limit, not an express
contractual expiry. No longer stale grace is inferred from provider silence. An unavailable,
expired or corrupt LKG blocks the review-bearing build rather than inventing testimonials.

Daily refresh without publication cannot update an existing static site. H4-D/G/H must own
atomic publication, freshness monitoring and an expiry-safe fallback/removal plan for the
already-served artifact. Failing a new build does not expire an old live page. Review-bearing
rollback/build archives are copies too and need permitted retention; do not retain them forever.

## Failure policy — design, not executed cache proofs

| Failure | Required behavior |
|---|---|
| Ordinary network/5xx outage | Valid, authentic, permitted LKG under 24h may continue with visible warning |
| Authentication failure | Hard failure/operator action; do not silently fall back around a changed access gate |
| Malformed source/unknown schema/wrong account or type | Fail closed; no integrity-failure LKG bypass |
| Empty/incomplete source, approved ID loss or count anomaly | Hard visible integrity failure pending review |
| Privacy filter/denylist/public-schema failure | Fail closed; publish nothing from the candidate |
| Corrupt/future-dated/expired LKG or no LKG | Hard build failure; preserve safe diagnostics only |
| Missing written permission | Block activation and PASS, irrespective of successful API access |

The new public pipeline/LKG mechanisms are not implemented; these behaviors remain proof work.

## No-JS, accessibility, structured data and attribution

The current component server-renders approved review markup, but CSS can activate the ring
without successful hydration. Rear cards may be visually inaccessible and controls inert with
JavaScript disabled. GS-HOST-004 already recorded this; no new no-JS PASS is claimed.
Continuation should keep the readable list as default, enhance after hydration, preserve
keyboard/reading order, and avoid duplicate review text. No visual redesign is authorised here.
Focused served keyboard, desktop/mobile axe and no-JS proofs remain pending behind the gate.

Source inspection found no AggregateRating/Review JSON-LD path in the current rendering sources.
No structured review/rating data was added. The existing introductory claim that every profile
review is reproduced conflicts with two permanent exclusions; report the inherited copy issue
for a narrow truthful correction during continuation, without inventing a new marketing promise.
No Freelancer logo, affiliation or endorsement was introduced.

## Threat review and proof status

Provider secret: no authentication secret introduced; any future OAuth value belongs only in
trusted ingestion and must be stripped before build. Source injection: React escapes current
quotes, but strict new source/control/bounds validation is still pending. ID bypass: fixed/proven
with synthetic clean text and empty override. Duplicate cache poisoning, freshness poisoning,
encrypted LKG verification, workflow artifact exposure and supply-chain pinning remain pending.
Raw/withheld content must never be logged; local live-probe output contained IDs/counts/field
names only. No public refresh job was run.

Completed focused checks: review selftest **93 cases**, source review gate questions 1–3,
H4-A synthetic static selftest **130 adverse proofs**, H4-B Edge/domain/client selftest **59 cases**
plus client retry/concurrency/redirect assertions. Typecheck/lint results are recorded below.
These selftests do not certify a newly generated H4-C artifact or a deployed cache.

Of brief §33's required cases, both individual permanent IDs, both together, reordered source,
duplicate denied identity, existing missing-rating/schema specimens and synthetic static
withheld-ID/secret scans are proven. Trusted-cache wrong-source, outage/auth failure, complete
source empty/count-increase/decrease, stale/expired/corrupt/no LKG and injected pipeline-filter
failure proofs remain pending. The existing generic mapper deduplicates; a strict future cache
must additionally reject conflicting duplicates. Do not credit generic tests as cache proofs.

## H4-A / H4-B regression and performance

H4-A source/adverse selftests passed; no new static build, route/SEO/hydration/404 served sweep,
artifact-wide actual-value scan or review accessibility build was run after the permission gate.
H4-B pure Contact/Press/Edge/client selftests passed. Its accepted provider E2E was not repeated;
Preview received no query, mutation, deployment, secret change, form submission or synthetic mail.
Normal Next source remains valid subject to the completed typecheck/lint, but a new normal build
was not run and is not credited as PASS. H4-B's historical normal/static builds remain historical.

No H4-C build-time/HTML/JS/component-payload/artifact performance delta was measured. No new
client module/dependency/UI was added by these local privacy changes; a zero emitted-byte delta
is not claimed without matched builds. The existing `out/index.html` is 74,472 bytes, generated
on 4 October 2026; that inspection does not turn it into an H4-C artifact.

## Non-production changes, future production and reversal

Only local source, selftest/live-gate logging and control documentation changed. No Supabase
project was selected for H4-C mutation; H4-B Preview infrastructure is intact. No GitHub workflow,
secret, external service, Production Supabase/Edge/Sanity/Hostinger/DNS/WordPress/live-site change
or main/push action occurred. Main remains `fbecbe01e7fb594c6163dab57514997cb248fc21`.

After permission/retention evidence, implement and prove the selected pipeline in this isolated
worktree; complete all H4-C gates, then exactly one focused local commit, no push. Future Production
publication requires separate H4-D/G/H authority, reviewed secrets/access, atomic artifact
publication, safe expiry/fallback and permitted rollback retention. No review database migration
is currently proposed and H4-B infrastructure must not be altered to implement the carrier.

Reversal: restore only the H4-C-owned source/test/control changes from the accepted H4-B HEAD,
after preserving this findings document and safe ID/count audit evidence outside the deployable
artifact. Do not reset/clean the worktree, delete the three original prototypes or remove H4-B
provider infrastructure. No new LKG exists to delete. Avoid weakening the permanent denylist;
if source restoration is necessary, carry these two exclusions into the successor implementation.

## Remaining work and recommendation

H4-C must first obtain/evidence written off-platform review permission and permitted cache/archive
retention, or receive separately authorised revised review scope. No agent provider contact or
removal/replacement of the accepted feature is authorised here. Then implement cache/refresh/build integration, source approval/provenance/anomaly
checks, no-JS adaptation, all adverse proofs, focused accessibility, normal/static builds,
H4-A/B regressions, secret/privacy scans and measured performance. No PASS commit is allowed now.

H4-D build/deploy transaction/freshness, H4-E full static verification, H4-F isolated Hostinger
delivery/recovery, H4-G hosted RC and H4-H authorised cutover remain unexecuted.
**Next phase: GS-HOST-H4-C-R1 — provider permission evidence and gated implementation continuation. STOP.**

## Final local receipt

- Full `verify:static` exit0, including TypeScript, ESLint and registered source gates. That
  run used the initial 77-case review selftest. After the independent review's additional
  exception-log correction, the final review selftest passed93 cases and source gate questions
  1–3 passed again; final ESLint exit0.
- H4-A permanent static selftest130 and H4-B Edge59 plus client transport/retry/concurrency
  proofs passed. No provider mutation or mail was necessary.
- Fresh independent spec/privacy reviews identified the exception-message leak and final
  receipt/historical-comment ambiguity; these were corrected. Targeted spec/privacy re-review
  cleared the substantive findings; the final receipt wording is now complete.
- Ending HEAD remains the accepted H4-B commit; no H4-C commit/push, index unstaged.
  Three original untracked prototypes are preserved; the only new source-controlled candidate
  is this H4-C report. Generated check logs remain ignored under `build/`.
- Owner confirmed no written provider permission is held. `GS-HOST-H4-C-R1` remains open;
  conditional pipeline/LKG/refresh/served proof work remains unexecuted. No PASS commit.

## GS-HOST-H4-C-R1 — permission request and blocked-state preservation

Date: 5 October 2026. **BLOCKED — PROVIDER PERMISSION REQUEST PREPARED.**
Written permission status: **NO WRITTEN PERMISSION HELD**, explicitly confirmed by the owner.
GS-O014/GS-O015 remain owner decisions, not provider permission. H4-B stays accepted and intact.
This R1 prepares material for owner submission only. No email, ticket, chat, permission API
request, social message, Freelancer authentication or provider contact was performed.
No reviews were removed/replaced; no scraper, cache, scheduled retrieval or deployment was activated.

### Ready-to-send provider request

**Subject: Written permission request — Gridsmith profile reviews on gridsmith.uk**

Hello Freelancer Support / Legal,

Gridsmith Ltd requests written permission to display reviews associated with our own
Freelancer profile, https://www.freelancer.com/u/GridsmithLTD, on our company website,
https://gridsmith.uk. Please confirm permission for both off-platform public display and
the proposed API/cache/static-generation mechanism below.

Subject to your permission, we intend to retrieve reviews through Freelancer's official
API from a trusted server-side/build environment. We would maintain only a private,
encrypted performance cache, refreshed at least every 24 hours, and use it to generate
our static website. Visitors would receive only the minimum presentation fields, never
Freelancer credentials or raw API payloads. We would not resell or syndicate Freelancer
data or provide third-party API access. This architecture is proposed, not activated.

Because the website would be statically generated, retrieved review data would become
rendered HTML and associated public page data, remaining online until the next successful
site refresh/deployment. Please explicitly confirm whether this static rendering model
is permitted and what must happen to existing rendered content if refresh fails.

Possible public fields are the review quote, reviewer display name or another
provider-approved public identity, rating, review date, an optional generic service/category
title if permitted, and source attribution. We would not necessarily display every field;
please identify any field that may not be republished. We apply privacy, moderation and
publication controls and may omit particular reviews. Later API refreshes may discover
new reviews, which would pass those controls before publication.

Please specify:

1. The permitted display scope, official API use and static-generation/cache use, including
   any restrictions on fields or selective publication.
2. Whether the private encrypted cache is permitted; maximum retention; whether it may
   survive a temporary API outage; whether last-known-good use is allowed or cached reviews
   must be deleted after 24 hours when refresh fails; and additional encryption/storage requirements.
3. Required attribution: text, Freelancer name, profile link and specific wording. Please
   confirm whether a Freelancer logo is required or permitted and any brand restrictions;
   we do not assume logo permission. Attribution would identify the source only and would
   not imply Freelancer endorsement, partnership, certification or sponsorship.
4. Revocation/termination requirements, including ceasing use and deleting cached data if
   permission or API access ends, and requirements for rendered pages, backups and rollback
   copies. We intend to follow your written instructions.

Please explicitly confirm in writing that Freelancer grants permission for the described
off-platform review display and API/static/cache mechanism, stating any conditions or
changes required. If this use cannot be authorised, please confirm that instead.

Kind regards,
Gridsmith Ltd

### Internal provider-response decision matrix

| Response | Required evidence / disposition |
|---|---|
| GRANTED | Written provider communication clearly permits both required off-platform display and the static/API/cache mechanism; field, retention, outage, attribution, brand and termination conditions are resolved and Gridsmith can satisfy them. Preserve provider identity, date and scope/reference as evidence. This opens the implementation gate, not H4-C PASS or H4-D. |
| PARTIAL | Display is allowed but static/cache use, retention, attribution, brand/logo conditions or permitted fields remain unresolved. Keep H4-C blocked and clarify only those points. |
| DENIED | Provider refuses off-platform display or the required architecture. Keep blocked; ask the owner to choose a separately authorised alternative. |
| AMBIGUOUS | Generic terms links, API-only approval or an answer that does not address off-platform reviews/static rendering. Keep blocked. Working credentials, public visibility and silence are not permission. |

Clarification template for PARTIAL/AMBIGUOUS (owner submission only; insert only unresolved points):

> Thank you for your response. To resolve the remaining scope, please explicitly confirm
> [unresolved off-platform display / static rendering / encrypted cache / retention and outage
> use / permitted fields / attribution and brand / termination requirements]. Our proposed
> use is reviews from Gridsmith's own Freelancer profile displayed on gridsmith.uk, retrieved
> through the official API into a private encrypted cache and rendered into static pages.
> Please state whether Freelancer grants permission for these unresolved uses and their conditions.

The bracketed choices are an internal drafting instruction, not a completed clarification
to send before a provider response exists. No clarification or initial request has been sent.

### Classification of all eight existing local candidates

| File | Classification | Preserved scope |
|---|---|---|
| `lib/reviews/freelancer.ts` | PERMISSION-INDEPENDENT HARDENING | Frozen permanent exclusions, empty-override protection, accurate blocked-authority comments |
| `scripts/check-reviews.mjs` | PERMISSION-INDEPENDENT HARDENING | ID-only withholding logs and controlled parser/transport/schema/HTTP failure output |
| `scripts/check-reviews.selftest.mjs` | PERMISSION-INDEPENDENT HARDENING | Synthetic permanent-ID/order/duplicate/override and actual offline gate-log specimens |
| `CLAUDE.md` | PERMISSION-INDEPENDENT HARDENING | Blocked-state authority/documentation only; no new implementation |
| `docs/_shared/PROJECT-STATUS.md` | PERMISSION-INDEPENDENT HARDENING | Accurate blocked programme state; H4-D prohibited |
| `docs/_shared/AI-HANDOFF.md` | PERMISSION-INDEPENDENT HARDENING | Preserve safe uncommitted work, confirmed permission status and stop gate |
| `docs/_shared/OWNER-ACTIONS.md` | PERMISSION-INDEPENDENT HARDENING | Owner evidence/request scope; no agent contact authority |
| `docs/_shared/GS-HOST-H4-C.md` | PERMISSION-INDEPENDENT HARDENING for findings/receipts/request; CONDITIONAL H4-C IMPLEMENTATION for design sections only | Preserve audit/request; carrier/cache/LKG/refresh proposals are documentation, not executable or activated implementation |

Classification of control documents denotes permission-independent preservation, not a claim
that prose executes a security control. There is no conditional implementation code to activate.
The three hardening source/gate files were not changed in R1. Their prior proof results remain
recorded evidence; no repeated live retrieval, mail proof or broad build was necessary for this request.

Commit decision: **none**. The brief defaults to no commit and the H4-C implementation PASS
gate is unresolved; existing programme authority does not clearly authorise a separate hardening
commit. If separately authorised later, a proposed security commit would contain exactly
`lib/reviews/freelancer.ts`, `scripts/check-reviews.mjs`, `scripts/check-reviews.selftest.mjs`
and the associated hardening evidence subsection in `docs/_shared/GS-HOST-H4-C.md`, with no
cache/workflow activation. This is a proposed split, not a staged snapshot or commit.

### Continuation after a qualifying grant

Preserve permanent exclusions and approval/privacy policy. Implement filter-first processing,
only the permitted cache duration/LKG use, required attribution, brand restrictions and
provider-approved termination/deletion behavior. Finish all adverse proofs, normal/static builds,
no-JS review behavior, focused accessibility, privacy/secret artifact scans, H4-A/B regressions
and measured performance. Create the focused H4-C implementation commit only after full PASS.
A provider email alone does not authorise H4-D; H4-C must finish first.

### Owner-decision alternatives after denial

A. Remove Freelancer-derived review content from gridsmith.uk.
B. Replace it with testimonials for which Gridsmith independently holds direct publication rights.
C. Link to the Freelancer profile without reproducing reviews, subject to linking/brand rules.
D. Use another mechanism explicitly approved/offered by Freelancer.

These are unimplemented alternatives requiring owner instruction. Partial/ambiguous replies
retain the current block and require a concise clarification; no permission is inferred.

### R1 preservation receipt

Required HEAD/branch confirmed; no staged changes, commit or push. The seven modified tracked
candidates plus this untracked H4-C record remain local. Three original untracked prototypes
remain intact. No change to H4-B source/provider infrastructure, Supabase, Edge, Sanity,
Hostinger, DNS, WordPress, live site or main. No cache, refresh workflow, schedule or credential
was created. The request and decision matrix are prepared for the owner, not submitted.

R1 verification: independent read-only brief review found no material request/scope defect.
The ready-to-send draft is419 words and contains no excluded IDs, distinctive withheld-body
marker or credential patterns. Three hardening files matched their pre-R1 SHA256 byte-for-byte.
`git diff --check` passed, index remained empty and HEAD/main matched the protected baselines.
These are document/preservation checks; no new implementation/build/provider proof is claimed.

**Recommendation: H4-C remains blocked until a qualifying written provider response resolves
display/static/cache scope. H4-D must not begin. STOP.**
