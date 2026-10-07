# Rights-chain pack

**Status:** internal operational templates, prepared at `GS-LEGAL-001-R4` (7 October 2026) from the
evidence in `../RIGHTS-CHAIN.md` and `../../research/GS-LEGAL-001/R3-OWNER-DECISIONS-APPLIED.md` §4.

These are **not** website pages and **not** a substitute for the client terms. They are not legal
advice, and nobody has reviewed them as a solicitor would. **Nothing here is signed. No document may
be represented as signed until it has actually been signed.**

## Why the pack exists

The adopted client terms make three promises that Gridsmith can keep only if it holds the rights first:

| Promise | Clause | Template that makes it keepable |
|---|---|---|
| Transfer of rights in final deliverables, by a signed document | Cons 13 ¶2; Bus 9.3 ¶1 | 06 (and 01–04 upstream) |
| A written transfer from every subcontractor or other contributor **before their work is used** | Cons 13 ¶4; Bus 9.3 ¶3 | 01, 03, 04 |
| A signed waiver from each writer on a ghostwritten book | Cons 10.2; Bus 13 ¶3 | 05 (via 01–04) |

They also rest on one unstated condition: Bus 9.2 and Cons 13 ¶6 describe "our own" tools and
templates. That is true only for material Gridsmith Ltd owns, which for anything the owner made
personally or before incorporation means template 01.

## The templates

| # | File | Signed by | Covers |
|---|---|---|---|
| 01 | `01-OWNER-ASSIGNMENT-AND-WAIVER.md` | The owner, personally | Existing and future copyright (and design and database right) in business work; pre-incorporation and background material; AI-arranged output; moral-rights waiver |
| 02 | `02-EMPLOYEE-IP-CLAUSE.md` | Gridsmith Ltd and the employee | Clause for a contract of employment: s. 11(2) acknowledgement; related out-of-course work; waiver; confidentiality; AI tools |
| 03 | `03-SUBCONTRACTOR-INDIVIDUAL-SCHEDULE.md` | The individual subcontractor | IP and confidentiality schedule to attach to an individual's services agreement, with role addenda for commissioned writers and ghostwriters |
| 04 | `04-SUBCONTRACTOR-COMPANY-SCHEDULE.md` | The subcontracting company | As 03, plus a chain-of-title warranty and an obligation to deliver an individual waiver (05) from each author |
| 05 | `05-INDIVIDUAL-MORAL-RIGHTS-WAIVER.md` | Each individual author | Stand-alone moral-rights waiver |
| 06 | `06-CLIENT-RIGHTS-ASSIGNMENT.md` | On behalf of Gridsmith Ltd | The client instrument promised by Cons 13 / Bus 9.3; consumer and business variants |
| 07 | `07-TITLE-AND-TOOL-REGISTER.md` | — | Register of 01–06 and of the AI and third-party tools used, kept under retention row R7 |

## Which role needs what

Key: **A** assignment of existing copyright · **B** present assignment of future copyright · **C**
moral-rights waiver · **D** confidentiality · **E** attribution and credit · **F** third-party
materials · **G** AI and tool licensing · **H** obligation to obtain equivalent rights from
contributors.

| Role | A | B | C | D | E | F | G | H | Template |
|---|---|---|---|---|---|---|---|---|---|
| Employee, work in the course of employment | Not needed: Gridsmith is first owner (s. 11(2)) | Not needed for in-course work | Belt and braces (ss. 79(3), 82 already limit the rights) | Yes | Per project | Yes | Yes | — | 02 |
| Employee, related work outside employment | Yes | Yes | Yes | Yes | — | Yes | Yes | — | 02 (clause 2) |
| Director, not employed under a contract of service | Yes | Yes | Yes | Yes | — | Yes | Yes | — | 01 adapted, or 03 |
| **The owner personally** | Yes (pre-incorporation, background and personally owned work) | Yes | Yes | — (company's own information) | — | Yes | Yes | — | **01** in every case; plus 02 if employed |
| Freelancer (individual) | Yes (pre-existing project material) | Yes, **before the work is used**, not conditional on payment | Yes | Yes | Per project | Yes | Yes | — | 03 + 05 |
| Subcontracting company | Yes | Yes | Only from its individuals (a company cannot waive for them, s. 87) | Yes | Per project | Yes | Yes | **Yes** | 04 + 05 from each individual |
| Commissioned writer (credited) | Yes | Yes | Paternity per agreed credit; integrity waived | Yes | **Credit recorded** | Yes | Yes | — | 03 + writer addendum + 05 |
| Ghostwriter | Yes | Yes | **Both rights waived; no assertion anywhere** | Yes, including the fact of involvement | **No credit, unless agreed** | Yes | Yes | — | 03 + ghostwriter addendum + 05 |
| AI-assisted work | Human contributions follow the contributor's row | As the contributor's row | None for computer-generated works (ss. 79(2), 81(2)) | Yes, no confidential input to tools that train on it | Disclose to client (Cons 13 / Bus 9.3) | — | **Tool terms must allow assignment** | — | 01–04 clause on AI output; 07 tool register |

## The owner employment question

**The repository holds no record of whether the owner is employed by Gridsmith Ltd under a contract
of service.** A directorship is not employment. The answer changes the paperwork:

- **If the owner is not employed:** the owner personally is first owner of everything they create
  (s. 11(1)). Template 01 must assign existing and future work to the company, or the company owns
  nothing of the owner's to transfer to a client.
- **If the owner is employed under a contract of service:** Gridsmith owns work made in the course of
  that employment (s. 11(2)). Template 01 is still needed for work made before incorporation
  (24 February 2026), outside the course of employment, or owned personally. Template 02 belongs in
  the employment contract.

**Template 01 is needed in both cases.** Only template 02 depends on the answer.

## Formalities, and what was verified

| Point | Basis | Status |
|---|---|---|
| Assignment of copyright needs writing signed by or on behalf of the assignor | CDPA s. 90(3) | Read at source by B on 6 Oct 2026 (`../../research/GS-LEGAL-001/B-business-terms.md`) |
| A signed agreement assigning future copyright vests it on creation, if the assignee is then entitled as against all others; a payment-conditional assignment is doubtful on that test | CDPA s. 91 | Read at source (B; citation ledger) |
| Moral-rights waiver: in writing signed by the person giving up the right; may cover specific works, works of a description or works generally, existing or future; conditional or unconditional; presumed to extend to licensees and successors in title of the owner or prospective owner | CDPA s. 87 | Read at source (B, G); the presumption's wording only as a search summary |
| Paternity right only once asserted; employee-work exceptions | CDPA ss. 78, 79(3); s. 82 | ss. 78, 79 read at source; **s. 82 search summary only** |
| An electronic signature satisfies s. 90(3) | B, citing the Law Commission and ECA 2000 s. 7 | Medium-high (B) |
| Design right: writing signed by the assignor; prospective ownership | CDPA ss. 222(3), 223 | **UNVERIFIED** (not read at source) |
| Database right: assignment formalities | Copyright and Rights in Databases Regulations 1997 | **UNVERIFIED** |
| Whether s. 91 needs consideration or a deed (it speaks of an "agreement") | — | **UNVERIFIED.** The templates recite a nominal consideration as conservative drafting; the owner or an adviser should confirm |
| Sign as simple signed writing, **not as a deed** (a deed carries the 12-year Limitation Act s. 8 period) | Limitation Act 1980 s. 8 | Search summary only (R3 record §4) |

## Execution checklist (before the first project that relies on it)

1. Answer the owner employment question above (yes/no; date of any service contract).
2. Sign template 01 (owner); the board minute records it.
3. If anyone is employed, put template 02 into each contract of employment.
4. For each subcontractor, sign 03 or 04 **before their work is used**, and collect 05 from each
   individual author.
5. For each writer on a book, record the credit position (writer addendum) or the ghostwriting
   position (ghostwriter addendum).
6. Record each AI tool used and confirm its terms allow assignment of output (07).
7. On full payment of each project, sign 06 for the client.
8. Enter every signed document in the register (07). Keep under retention row R7.
