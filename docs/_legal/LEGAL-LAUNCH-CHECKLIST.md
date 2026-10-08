# Gridsmith Legal Launch Checklist

**For internal use — 2 September 2026**

> **GS-P00 note — 11 September 2026.** `GS-D001` and `GS-D002` change the intended public website:
> it will not depend on public client/author portfolio evidence or public prices. The legal
> instruments themselves were not redrafted in GS-P00. A solicitor must review portfolio-use,
> quotation/price and consumer-flow wording against these decisions before publication (`GS-X001`).

> **GS-LEGAL-001 — 6 October 2026.** The solicitor gate (`GS-O003`) is superseded by `GS-O003-R`:
> evidence-based review (`docs/_legal/research/GS-LEGAL-001/`) plus owner adoption recorded in
> `docs/_legal/GS-O003-R-REGISTER.json`. The instruments were redrafted (client terms v3.0, the rest
> v2.1). Items below that refer to a solicitor, to VAT status or to old clause numbers are updated in
> place; the open owner decisions are listed in `research/GS-LEGAL-001/GS-LEGAL-001-RECORD.md`.

This file is not a public legal notice. It records the practical items that should stay aligned with the public terms.

## R11 adoption and hosting closeout (8 October 2026)

All seven legal documents are OWNER_ADOPTED; none PUBLISHABLE. Existing Hostinger infrastructure
decision CLOSED; Article 28 existing-terms coverage recorded on owner-attested authorised corporate
use. No additional administrator agreement shown necessary. R10 draft SUPERSEDED / NOT EXECUTED.
Publication still requires the approved GS-O003-R launch policy prerequisites (H4-B intake accuracy,
cutover authority, Privacy co-publication and Cookie production retest), not a new contract signature.
This does not imply public publication or Production cutover readiness. Current authority:
`research/GS-LEGAL-001/R11-PRIVACY-ADOPTION-HOSTING-CLOSEOUT.md` §5.

## Required before public launch

- [x] Remove every fabricated or placeholder VAT number. Done 2 September 2026: the `vatNumber` field is removed from the Sanity schema, the query, the footer, `/about` and the seed, so there is no rendering path a number can reach. `check:launch` no longer requires one on a live dataset — a gate demanding a value that does not lawfully exist is a gate demanding a false disclosure.
- [ ] Do not charge or describe VAT unless Gridsmith Ltd is actually required/registered to do so. **No price anywhere in the UI may be presented as VAT-exclusive** — no "+ VAT", no "exc. VAT", no "inc. VAT" labelling. A price is the amount charged. ~~The conditional clauses in the instruments stay: they state that Gridsmith is not registered, that no VAT is charged, and what changes if it registers.~~ Superseded at `GS-LEGAL-001`: the v2.1/v3.0 instruments state no VAT status at all — each quotation states whether VAT applies, and consumer totals include it — so no document needs changing if the status changes. The owner reconfirms the status before adoption (`GS-O003-R` decision list).
- [x] Publish company number **17050842** and registered office **30 Briarfield Road, Farnworth, Bolton, BL4 0HD** — SI 2015/17 reg. 25(2) requires the registered name, the part of the UK of registration, the number and the registered office **on the website**, not only inside a transaction flow. The site-wide disclosure is the statutory block in `components/chrome/Footer.tsx`, repeated on `/about`. ~~Each instrument carries the address **once**, in its party-identification block (`CONSUMER-TERMS.md` §18, `PRIVACY-POLICY.md` §15, `MSA-BUSINESS.md` §19) and not in its header; the other three instruments say "Bolton, United Kingdom" and rely on the footer.~~ Superseded at `GS-LEGAL-001`: every draft header now carries the full identity block (legal form, place of registration, number, registered office), and the address also appears in `CONSUMER-TERMS.md` §21, `PRIVACY-POLICY.md` §15 and `MSA-BUSINESS.md` §20.
- [ ] Use **contact@gridsmith.uk** as the legal/privacy contact unless a dedicated address is later created.
- [ ] Ensure `/press` and consumer ordering paths link to `CONSUMER-TERMS.md`.
- [ ] Ensure business quotations/scopes link to or attach `MSA-BUSINESS.md`.
- [ ] Keep the Cookie Policy aligned with the actual site. If analytics returns, review the policy before enabling it.
- [ ] Ensure the website does not publish a stronger accessibility claim than `ACCESSIBILITY-STATEMENT.md`.
- [ ] Remove references to services or tools that do not exist yet.

## Consumer cancellation implementation

For a consumer distance/off-premises service where work may begin within the statutory cancellation period:

- [ ] obtain an express request to start early where required;
- [ ] obtain the acknowledgement required before a fully performed service can lose its cancellation right;
- [ ] preserve evidence of what the consumer agreed to and when;
- [ ] calculate any cancellation deduction by the proportion of service actually supplied where the law permits it;
- [ ] never use “no refund after work starts” as an automatic consumer rule.

Commercial policy after any statutory cancellation period:

- no work started -> refund, less authorised non-refundable third-party cost;
- work started -> deduct reasonable value of work completed + unavoidable committed cost;
- substantial work completed -> refund may be zero;
- do not describe the deduction as a penalty.

## Scope/change-control rule

Every quotation or Scope should state:

- deliverables;
- exclusions;
- revisions included;
- timeline;
- client responsibilities;
- payment stages;
- third-party costs; and
- what counts as additional work.

Large requested changes require a written additional price/change order before the extra work is carried out.

## Press rule

Gridsmith Press is a **service provider**.

- Client manuscripts/articles remain the client's.
- Gridsmith does not take royalties or ownership merely by providing writing, editing, proofreading or publishing services.
- Bespoke rights Gridsmith actually owns should transfer on full payment, subject to third-party/background IP.
- Publishing/distribution accounts should normally be in the client's name/control.

## Engineering/design rule

> **Superseded at `GS-LEGAL-001` (6 October 2026):** §12 of both client instruments now states the `GS-X002` boundary (no engineering design or calculations, no certification, approval, stamping or sign-off, never the responsible designer, no construction drawings), and the self-referential cap saver is deleted. The note below is kept as history.
>
> **Factual note for the solicitor — 2 October 2026 (`GS-PROD-003-R1`).** No clause has been changed.
> Gridsmith currently intends to offer the limited Technical services (CAD drafting, engineering
> drawing/schematic preparation, technical documentation, to the client's brief) **without** professional
> indemnity insurance covering professional engineering responsibility; the owner deferred that cover.
> The published services exclude design responsibility, calculations, certification, approval,
> stamping, sign-off and responsible-designer duties. Please review §12 and §16 of `MSA-BUSINESS.md`, and
> the PI-limit `[TK]` with the cap (UCTA s. 11(4)(b)), on that basis. Liability is not assumed to be
> excludable. Register entry: `OWNER-ACTIONS.md` `GS-O003`.
> Explicitly: PI cover is not an owner-imposed launch prerequisite; this is not a claim of zero
> liability; §12 (written for "drawings or design services", with certification and sign-off
> available where a Scope states them) is broader than the intended public scope.

- Define exactly what Gridsmith is engaged to design/draw.
- Do not describe preliminary/draft drawings as final.
- State what information and dimensions came from the client.
- Client review does not excuse Gridsmith from reasonable care and skill.
- ~~Site surveys, approvals, certification, specialist calculations and independent professional sign-off are included only if the Scope expressly includes them.~~ Superseded at `GS-LEGAL-001`: certification, approval, stamping, sign-off, engineering design and calculations are never provided, and no Scope can add them.
- For higher-risk or higher-value work, consider a project-specific liability clause rather than relying automatically on the standard MSA.

## Privacy operations

- [ ] Keep processor list accurate: ~~Vercel, Supabase, Resend, Sanity~~ Hostinger (hosting, CDN, mailbox), Supabase (Edge Functions + database, Ireland), Resend (internal notification) — Sanity holds site content only, no visitor data — plus any new processor actually used (corrected at `GS-LEGAL-001`; Vercel is retired).
- [ ] If Slack notifications are enabled, update the Privacy Policy and vendor/privacy arrangements first.
- [ ] Periodically review old enquiries because there is not yet an automated deletion schedule.
- [ ] Provide a working electronic route for data-protection complaints.
- [ ] Acknowledge data-protection complaints within 30 days.
- [ ] Update the Privacy Policy when data collection or service providers materially change.

## Later-stage legal review priorities

When Gridsmith begins taking larger or higher-risk projects, obtain targeted legal review of:

1. engineering/design duty allocation and project-specific liability;
2. B2B liability cap and exclusion wording;
3. IP assignment and subcontractor-created IP;
4. consumer cancellation flows if online ordering is introduced;
5. data-processing agreements and international-transfer arrangements; and
6. any analytics/advertising stack introduced later.
