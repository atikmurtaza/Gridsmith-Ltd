# Processor and recipient register (internal)

**Status:** internal operational record, created at `GS-LEGAL-001-R6` (7 October 2026). It is not a
public page and not legal advice. It holds the detail that the Privacy Policy describes only by name or
category. Evidence references are to `../research/GS-LEGAL-001/R5-PRIVACY-EVIDENCE.md` and
`R6-PRIVACY-2.2-DRAFT.md`.

| Provider | Role for Gridsmith | Contracting position | Processing terms | Location | Evidence |
|---|---|---|---|---|---|
| **Supabase** (Supabase Pte. Ltd., Singapore) | Processor: enquiry database (Ireland), Edge Function intake (Preview only until H4-B is promoted), request logs | "Gridsmith Org" on the self-serve Free plan; no marketplace purchase recorded | DPA incorporated into the Terms of Service ("No separate signed DPA is needed"); UK Addendum B.1.0 | Data `eu-west-1`; sub-processors include US companies | R5 §3.1–§3.3 (provider source and account) |
| **Resend** (Plus Five Five, Inc., United States) | Processor: internal enquiry notification email | Free plan (owner-confirmed, R6) | DPA incorporated into the customer agreement and binding through it (verified outside this environment, R6). No separately signed DPA is recorded | Storage and processing in the US | R6 §2 |
| **Hostinger** (Hostinger UK Limited for UK customers per its Terms §2; DPA entities: Hostinger International Ltd, Hostinger UK Limited, Hostinger Global S.à r.l.) | Processor in substance: website hosting (France), CDN (sub-processor Cloudflare) and Business email hosting for contact@gridsmith.uk, on the existing Hostinger Business infrastructure (owner decision, R9) | **Gridsmith's admin department manages the hosting account** (owner). Under Hostinger's Terms §4, the Account-information entity (presumed to be the billing party, which is another party per R8; not verified) "is considered to be the owner of the Account and the data and Services contained therein" | Terms revised 2026-09-29 incorporate the DPA (§2). The DPA is made with "you (“Customer”)"; it covers Customer as Controller or as Processor (§2.2), notices to the Customer's administrators (§7.4), and SCCs deemed signed on the Customer's electronic acceptance plus the UK Addendum (§9). **Not evidenced as binding Hostinger with regard to Gridsmith Ltd** (see below) | Website: France. Mailbox location not established | R9 §3 |
| Professional advisers (e.g. accountants) | Recipients where necessary | Engaged case by case | Professional duties; terms per engagement | UK | Privacy §6 |
| WhatsApp (Meta), mobile networks | Independent providers that carry messages the person chooses to send | Their own terms with the sender | — | — | Privacy §6 |

## Hostinger contract structure (R9; supersedes the R6–R8 open actions, kept in git history)

**Residual documentation required**
(`../research/GS-LEGAL-001/R9-RETENTION-HOSTINGER-REASSESSMENT.md` §3):
- UK GDPR Art. 28(3) needs a contract "binding on the processor with regard to the controller". It does
  **not** need Gridsmith Ltd to be Hostinger's named customer, and the existing infrastructure stays (no
  new account, subscription, domain, VPS or migration).
- Hostinger's Terms §4 make the Account-information entity the owner of the Account's data and Services.
- §3 binds that owner for anyone using the Account.
- DPA Appendix 1 treats authorised users as data subjects.
- So the current terms alone do not evidence coverage with regard to Gridsmith Ltd.

**Minimum steps (owner's choice; no migration):**
- **A. Account information:** first check what it currently lists. If it is not Gridsmith Ltd, the Account owner corrects it to list Gridsmith Ltd, with the Terms accepted on Gridsmith Ltd's behalf (needs the current owner's cooperation; Gridsmith Ltd takes on the Terms' obligations) ("correctly indicate
  ownership", ToS §4). Privacy is unchanged. **First check that the Account holds only Gridsmith's sites,
  data and mail.**
- **B. Documented chain:** a short written Art. 28(3) arrangement, held outside the repository, between
  Gridsmith Ltd and the Account owner. The owner instructs Hostinger for gridsmith.uk data only as
  Gridsmith directs, and Hostinger is authorised as sub-processor under DPA §2.2. This makes the owner a
  processor and recipient, so Privacy §6/§7 need an edit first.

R8's "move under a Gridsmith Ltd Customer account" is withdrawn.

## Recommended confirmation (non-blocking)

Confirm that the Supabase organisation and the Resend account were opened for Gridsmith Ltd, not for the
owner personally, so that their incorporated DPAs bind them to Gridsmith Ltd as controller (R6 review
note). The same chain matters for Business Terms §23 wherever client personal data passes through the
mailbox.
