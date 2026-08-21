import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Card } from '@/components/primitives/Card';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { Table } from '@/components/primitives/Table';
import { GroupSections } from '@/components/content/GroupSections';
import { Placeholder } from '@/components/content/Placeholder';
import { getCompanyDetails } from '@/lib/company/companyDetails';
import { getGroupPage, listPublicTeam } from '@/lib/sanity/queries';
import styles from '@/components/content/content.module.css';

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
 * registered office, VAT position — in monospace, which is this site's convention for anything
 * verifiable.
 *
 * Every one of those values comes from `companyDetails`, the same singleton the statutory
 * footer reads. There is no second copy of the company number on this site.
 *
 * ## The team listing is placeholder, and says so
 *
 * `Q-M9` — who appears publicly — is the owner's decision. `isPublic` defaults false precisely
 * because a person appearing on a public website is a decision someone makes rather than the
 * absence of one, and the seeded records are named `[SEED] Placeholder Name` so that no reader
 * can mistake one for a real person. A plausible invented name here would be a fabricated
 * credential on a public site.
 */
export default async function Page() {
  const [page, company, team] = await Promise.all([
    getGroupPage('about'),
    getCompanyDetails(),
    listPublicTeam(),
  ]);
  if (!page) notFound();

  const facts: [string, string | null][] = [
    ['Registered name', company.legalName],
    ['Company number', company.companyNumber],
    ['Place of registration', company.placeOfRegistration],
    ['Registered office', company.registeredOffice],
    ['Trading address', company.tradingAddress],
    ['VAT number', company.vatNumber],
    ['Trading divisions', 'Gridsmith Design · Gridsmith Digital · Gridsmith Press'],
    ['Contact', company.contactEmail],
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
              Everything below can be verified against the Companies House register. It is read
              from one record, which is the same record the footer of every page on this site
              reads.
            </p>
          </Prose>
          <Table caption="Gridsmith Ltd — statutory and trading details">
            <tbody>
              {facts.map(([label, value]) =>
                value ? (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td>
                      <Numeric>{value}</Numeric>
                    </td>
                  </tr>
                ) : null,
              )}
            </tbody>
          </Table>
        </Container>
      </Section>

      <GroupSections sections={page.sections} />

      {team.length > 0 ? (
        <Section labelledBy="people">
          <Container>
            <Heading level={2} id="people">
              Who you will work with
            </Heading>
            <ul className={styles.team}>
              {team.map((person) => (
                <Card as="li" key={`${person.name}-${person.role}`} className={styles.teamCard}>
                  <Placeholder ratio="portrait" />
                  <Heading level={3} size="d4">
                    {person.name}
                  </Heading>
                  {person.role ? <p className={styles.teamRole}>{person.role}</p> : null}
                  {person.bio ? <p className={styles.teamBio}>{person.bio}</p> : null}
                </Card>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </main>
  );
}
