# Gridsmith Legal Launch Checklist

**For internal use — 2 September 2026**

This file is not a public legal notice. It records the practical items that should stay aligned with the public terms.

## Required before public launch

- [x] Remove every fabricated or placeholder VAT number. Done 2 September 2026: the `vatNumber` field is removed from the Sanity schema, the query, the footer, `/about` and the seed, so there is no rendering path a number can reach. `check:launch` no longer requires one on a live dataset — a gate demanding a value that does not lawfully exist is a gate demanding a false disclosure.
- [ ] Do not charge or describe VAT unless Gridsmith Ltd is actually required/registered to do so. **No price anywhere in the UI may be presented as VAT-exclusive** — no "+ VAT", no "exc. VAT", no "inc. VAT" labelling. A price is the amount charged. The conditional clauses in the instruments stay: they state that Gridsmith is not registered, that no VAT is charged, and what changes if it registers.
- [x] Publish company number **17050842** and registered office **30 Briarfield Road, Farnworth, Bolton, BL4 0HD** — SI 2015/17 reg. 25(2) requires the registered name, the part of the UK of registration, the number and the registered office **on the website**, not only inside a transaction flow. The site-wide disclosure is the statutory block in `components/chrome/Footer.tsx`, repeated on `/about`. Each instrument carries the address **once**, in its party-identification block (`CONSUMER-TERMS.md` §18, `PRIVACY-POLICY.md` §15, `MSA-BUSINESS.md` §19) and not in its header; the other three instruments say "Bolton, United Kingdom" and rely on the footer.
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

- Define exactly what Gridsmith is engaged to design/draw.
- Do not describe preliminary/draft drawings as final.
- State what information and dimensions came from the client.
- Client review does not excuse Gridsmith from reasonable care and skill.
- Site surveys, approvals, certification, specialist calculations and independent professional sign-off are included only if the Scope expressly includes them.
- For higher-risk or higher-value work, consider a project-specific liability clause rather than relying automatically on the standard MSA.

## Privacy operations

- [ ] Keep processor list accurate: Vercel, Supabase, Resend, Sanity, plus any new processor actually used.
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
