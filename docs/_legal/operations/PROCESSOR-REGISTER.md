# Processor and recipient register (internal)

**Status:** internal operational record, created at `GS-LEGAL-001-R6` (7 October 2026). It is not a
public page and not legal advice. It holds the detail that the Privacy Policy describes only by name or
category. Evidence references are to `../research/GS-LEGAL-001/R5-PRIVACY-EVIDENCE.md` and
`R6-PRIVACY-2.2-DRAFT.md`.

| Provider | Role for Gridsmith | Contracting position | Processing terms | Location | Evidence |
|---|---|---|---|---|---|
| **Supabase** (Supabase Pte. Ltd., Singapore) | Processor: enquiry database (Ireland), Edge Function intake (Preview only until H4-B is promoted), request logs | "Gridsmith Org" on the self-serve Free plan; no marketplace purchase recorded | DPA incorporated into the Terms of Service ("No separate signed DPA is needed"); UK Addendum B.1.0 | Data `eu-west-1`; sub-processors include US companies | R5 §3.1–§3.3 (provider source and account) |
| **Resend** (Plus Five Five, Inc., United States) | Processor: internal enquiry notification email | Free plan (owner-confirmed, R6) | DPA incorporated into the customer agreement and binding through it (verified outside this environment, R6). No separately signed DPA is recorded | Storage and processing in the US | R6 §2 |
| **Hostinger** (Hostinger International Ltd, Cyprus; Hostinger UK Limited; or Hostinger Global S.à r.l., per its DPA) | Processor in substance: website hosting (servers in France), CDN and email hosting for contact@gridsmith.uk | **Not contracted by Gridsmith Ltd.** Hostinger's "Customer" is the subscription holder (R7, owner-confirmed) | DPA revised 2026-09-29, read directly at R7: Customer is controller or processor (§2.1); a processor-Customer warrants controller authority (§2.2); EU SCCs Modules 2/3 and the UK Addendum (§9). **It binds Hostinger to its Customer, not to Gridsmith Ltd. Gridsmith can rely on these terms only once *Open action* (b) is in place** | Website: France (owner-confirmed). Mailbox location not established | R6 §2; R7 §2 |
| **Subscription holder** (a business registered in the United States; its name is held by the owner and **not recorded here, because the repository is public**) | **Not a processor and not a recipient** (R7, superseding R6's "treated as a processor"), subject to *Open action* (a). It bought the multi-domain plan in 2024 (prepaid to 2028), and Gridsmith uses its capacity. The owner states that Atik Murtaza personally manages the account. No fact shows the holder's staff, systems or processes receiving or using Gridsmith data, and none is inferred | Commercial subscription holder only | None needed on account of its role. **Becomes a processor only if route 2 below is chosen** | United States (no Gridsmith data shown to reach it, so no transfer) | R7 §2.1–§2.2 |
| Professional advisers (e.g. accountants) | Recipients where necessary | Engaged case by case | Professional duties; terms per engagement | UK | Privacy §6 |
| WhatsApp (Meta), mobile networks | Independent providers that carry messages the person chooses to send | Their own terms with the sender | — | — | Privacy §6 |

## Open action — the Hostinger contract (R7; supersedes the R6 text, kept in git history)

~~R6: the subscription holder is Gridsmith's processor; a processing agreement with it, or an account
transfer, documents the chain.~~ **R7 correction:** paying for and holding the plan, with the same
individual managing it, does not make the holder a processor (UK GDPR Art. 4(2), 4(8)). On the facts
supplied it performs no operation on Gridsmith data.

**The gap that remains is Hostinger's, not the holder's.**
- Hostinger processes Gridsmith data, and UK GDPR Art. 28(3) requires a contract binding it "with
  regard to the controller".
- Hostinger's DPA binds it to its Customer, the holder.
- The DPA knows only controller and processor customers (§2.1), and on the facts the holder is neither
  for Gridsmith's data.

**Routes:**
1. **Recommended:** Gridsmith Ltd becomes Hostinger's Customer for the gridsmith.uk hosting and
   mailbox. Either move them to a Hostinger account in Gridsmith Ltd's name, or transfer the
   subscription. Hostinger's DPA then binds Hostinger to Gridsmith directly. **Privacy 2.2 is correct as
   drafted under this route.**
2. **Interim only, if route 1 must wait:** a written arrangement under which the holder operates the
   account for gridsmith.uk only on Gridsmith Ltd's documented instructions (DPA §2.2). **This makes the
   holder a processor by contract, and so a recipient (Art. 4(9)), established in the US.** Before
   adoption, Privacy §6 must describe that recipient category and §7 the US transfer and its
   safeguard, followed by a re-hash, a fresh review and A-1.

**Adoption evidence `HOSTINGER-PROCESSOR-CHAIN` (redefined at R7; gate unchanged)** must record:
- **(a)** the owner's confirmation that:
  - no person other than Atik Murtaza holds a login, team-member or delegated access to the Hostinger
    account or the contact@gridsmith.uk mailbox;
  - the account's contact and notification email is controlled by him or by Gridsmith;
  - he manages the gridsmith.uk hosting for Gridsmith.

  If any part is untrue, Privacy §6 and §7 must be revised before adoption.
- **(b)** route 1 in place with a date, or route 2 with those Privacy revisions.

Privacy 2.2 no longer carries a marker for this. Adoption is held by the evidence key, not by a marker.

## Recommended confirmation (non-blocking)

Confirm that the Supabase organisation and the Resend account were opened for Gridsmith Ltd, not for the
owner personally, so that their incorporated DPAs bind them to Gridsmith Ltd as controller (R6 review
note). The same chain matters for Business Terms §23 wherever client personal data passes through the
mailbox.
