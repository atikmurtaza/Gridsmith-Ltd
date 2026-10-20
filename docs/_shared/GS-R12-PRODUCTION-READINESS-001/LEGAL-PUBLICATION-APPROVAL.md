# Legal publication approval — seven documents

20 October 2026. Prepared for the owner; **nothing here is approved**. Each document is decided on
its own. This is a technical record of state and dependencies, not legal advice or a compliance
certificate.

All seven are `OWNER_ADOPTED` with fingerprints bound in `docs/_legal/GS-O003-R-REGISTER.json`, and
`check:legal:adoption` passes (no markers, versions and fingerprints match). Every document names
Gridsmith Ltd, company 17050842, 30 Briarfield Road, Farnworth, Bolton, BL4 0HD, and
contact@gridsmith.uk, matching production `companyDetails`.

## What "PUBLISHABLE" requires (enforced by `check:legal:adoption`)

A document may be set `PUBLISHABLE` only when every one of its prerequisites has recorded evidence:

| Prerequisite | Applies to | Met? | Evidence it needs |
|---|---|---|---|
| CUTOVER-AUTHORITY | all seven | **No** | Your authority for the cutover phase that publishes the legal routes on gridsmith.uk |
| H4-B-INTAKE-PROMOTED | Privacy | **No** | Production intake deployed, verified and live (GS-R13-H4B package, then `live` mode) |
| HOSTINGER-PROCESSOR-CHAIN | Privacy | Yes (R11) | — |
| PRIVACY-PUBLISHABLE | the other six | **No** | Privacy itself PUBLISHABLE |
| A-2-PRODUCTION-COOKIE-RETEST | Cookies | **No** | `curl -sI` on gridsmith.uk shows no `Set-Cookie` from the server |

So the order is fixed: intake live → cutover authority → Privacy → the other five → Cookies after
its retest.

## Sequencing defect to decide (found 20 Oct)

The GS-R13 gridsmith.uk build refuses unless **all seven** are PUBLISHABLE. Cookies cannot be
PUBLISHABLE until the A-2 retest runs **on gridsmith.uk**, and gridsmith.uk can only serve the new
site once that build exists. As written, the two gates wait on each other. Options, your choice;
neither gate is changed here:

1. Accept the A-2 evidence from the same Hostinger server stack on staging before cutover. The
   Cookie prerequisite wording would change, which is a legal-phase edit, and the check is repeated
   on gridsmith.uk immediately after the switch.
2. Let the production profile ship while Cookies alone is pending, with `/legal/cookies` held back
   (the footer link would 404 until the retest), then rebuild. This needs a reviewed profile change.
3. Re-word A-2 to "verified within N minutes of cutover, or roll back" and keep Cookies in the first
   build.

## Decisions (one line each)

Mark each **APPROVE** (set PUBLISHABLE when its prerequisites are evidenced) or **WITHHOLD**. Approval
of a line does not approve any other line or the cutover itself.

| # | Document | Route | Version / effective date | Decision |
|---|---|---|---|---|
| 1 | Privacy Policy | `/legal/privacy` | 2.3 / 8 Oct 2026 | ☐ APPROVE ☐ WITHHOLD |
| 2 | Cookie Policy | `/legal/cookies` | 2.1 / 7 Oct 2026 | ☐ APPROVE ☐ WITHHOLD; and choose sequencing option 1 / 2 / 3 |
| 3 | Website Terms of Use | `/legal/terms` | 2.1 / 7 Oct 2026 | ☐ APPROVE ☐ WITHHOLD |
| 4 | Client terms (disambiguation page, no operative clause) | `/legal/client-terms` | 2.1 / 7 Oct 2026 | ☐ APPROVE ☐ WITHHOLD |
| 5 | Client Terms for Business Clients | `/legal/business-client-terms` | 3.1 / 7 Oct 2026 | ☐ APPROVE ☐ WITHHOLD |
| 6 | Client Terms for Consumers | `/legal/consumer-client-terms` | 3.1 / 7 Oct 2026 | ☐ APPROVE ☐ WITHHOLD |
| 7 | Accessibility Statement | `/legal/accessibility` | 2.1 / 7 Oct 2026 | ☐ APPROVE ☐ WITHHOLD |

Decide alongside:

- **Effective dates** (LEG-10): keep 7/8 October, or re-date to the publication date. Re-dating
  changes the adopted text and needs re-adoption.
- **Withholding any document** blocks the GS-R13 build, because every page links Privacy, Terms,
  Cookies and Accessibility, and the contact pages link client terms. Withholding is therefore also
  a decision to delay launch.
- **POL-01:** the published phone number (GS-O004) against "no public phone number". Confirm which
  policy stands.

## After an approval

For each approved document, once its prerequisites are evidenced, in an owner-authorised legal phase:

1. Set the register state `PUBLISHABLE`, recording `prerequisitesMet` evidence; `check:legal:adoption`
   must pass.
2. `node scripts/migrate-production-cms.mjs --write-manifest`, then review the diff (the legal
   entries become eligible).
3. Guarded production CMS write of the legal documents (backup, then `--write`, separate approval).
4. GS-R13 build: `GRIDSMITH_STATIC_PROFILE=production …`; it refuses until all seven are present.
