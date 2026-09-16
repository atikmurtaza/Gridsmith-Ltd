import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { Table } from '@/components/primitives/Table';
import { GroupSections } from '@/components/content/GroupSections';
import { getCompanyDetails, telHref } from '@/lib/company/companyDetails';
import { getGroupPage } from '@/lib/sanity/queries';

export const metadata: Metadata = {
  title: 'About — Gridsmith Ltd',
  description:
    'Gridsmith Ltd is one registered company. Design, Digital and Press are its trading divisions.',
};

/**
 * `/about` — `N-07`, the structure disclosure.
 *
 * **`M-J4`'s whole journey, and it has no conversion event.** `APP-FLOW.md` §1: an evaluator
 * arrives to verify that this is a real company and must be able to finish in under ninety
 * seconds. That is a design constraint, not a nicety — everything on this page either helps
 * someone check a fact or is in the way of someone checking a fact.
 *
 * Server Component, zero client JS.
 *
 * ## The structure statement is the point of the page
 *
 * Three trading names and one legal entity is the single fact most likely to be misread, and
 * misreading it has contractual consequences: a client who believes they are contracting with
 * "Gridsmith Press" is wrong about who owes them the work. So it is stated in prose, and then
 * stated again as a table of checkable facts — company number, place of registration,
 * registered office — in monospace, which is this site's convention for anything verifiable.
 *
 * **No VAT row.** Gridsmith is not VAT registered, so e-commerce regs reg. 6(1)(g) is not
 * engaged and there is no number to publish; the field does not exist on the singleton.
 *
 * **No registered-office row either, as of `GS-O004`.** It used to be here *and* in the
 * statutory footer, and the docstring above used to say so approvingly. The owner's decision
 * is that the registered office is displayed only where a legal requirement or an approved
 * legal instrument puts it: SI 2015/17 reg. 25(2)(c) puts it in the footer of every page, and
 * `_legal/` carries it as the address for service. A second copy on a marketing page is not a
 * further disclosure — it is a residential address published twice. The `Trading address` row
 * went with it: it was conditional on a field that is empty precisely *because* it is the same
 * premises, so it could only ever have rendered a duplicate of the row above it.
 *
 * The rows that remain are the ones an evaluator checks against the register in ninety
 * seconds — name, number, place of registration, trading divisions — plus the two ways to make
 * contact. Every one of them comes from `companyDetails`, the same singleton the footer reads.
 *
 * ## There is no team section, and its absence is the decision
 *
 * `Q-M9` is answered. **`GS-O004`: there are no public team members** — no founder profile, no
 * employee profiles, no placeholder staff. The owner's position is that the company is
 * represented institutionally.
 *
 * It is enforced by deletion rather than by a flag. This page rendered `listPublicTeam()`
 * behind `isPublic`, which defaults false — and the development dataset nevertheless carried
 * four `teamMember` records named `[SEED] Placeholder Name` with `isPublic: true`, so the
 * served `/about` published four placeholder people under the heading "Who you will work
 * with". A placeholder presented as a fact on a public page is what non-negotiable #4 exists
 * to stop, and a boolean nobody had looked at is what let it happen. The query and the
 * renderer are gone; the `teamMember` schema type stays dormant, like `project` and `book`,
 * for a decision that would have to be made deliberately. `check:company` question 6 asserts
 * the absence on the served page.
 */
export default async function Page() {
  const [page, company] = await Promise.all([getGroupPage('about'), getCompanyDetails()]);
  if (!page) notFound();

  const facts: [string, string | null][] = [
    ['Registered name', company.legalName],
    ['Company number', company.companyNumber],
    ['Place of registration', company.placeOfRegistration],
    ['Trading divisions', 'Gridsmith Design · Gridsmith Digital · Gridsmith Press'],
    ['Email', company.contactEmail],
    ['Telephone', company.contactPhone],
  ];

  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container width="narrow">
          <Heading level={1}>
            {page.title}
          </Heading>
          {page.intro ? (
            <Prose>
              <p>{page.intro}</p>
            </Prose>
          ) : null}
          <Prose>
            <p>
              Gridsmith Ltd is one company registered in {company.placeOfRegistration}. Gridsmith
              Design, Gridsmith Digital and Gridsmith Press are trading divisions of it, not
              separate companies. Whichever studio you deal with, your contract, your invoice and
              your legal counterparty are Gridsmith Ltd.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="sunken" labelledBy="facts">
        <Container width="narrow">
          <Heading level={2} id="facts">
            The checkable facts
          </Heading>
          <Prose>
            <p>
              The registered details below can be verified against the Companies House
              register. They are read from one record — the same record the footer of every
              page on this site reads, which is also where the registered office is disclosed.
            </p>
          </Prose>
          <Table caption="Gridsmith Ltd — statutory and trading details">
            <tbody>
              {facts.map(([label, value]) =>
                value ? (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td>
                      {label === 'Email' ? (
                        <a href={`mailto:${value}`}>
                          <Numeric>{value}</Numeric>
                        </a>
                      ) : label === 'Telephone' ? (
                        <a href={telHref(value)}>
                          <Numeric>{value}</Numeric>
                        </a>
                      ) : (
                        <Numeric>{value}</Numeric>
                      )}
                    </td>
                  </tr>
                ) : null,
              )}
            </tbody>
          </Table>
        </Container>
      </Section>

      <GroupSections sections={page.sections} />
    </main>
  );
}
