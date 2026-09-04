import type { Metadata } from 'next';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { getCompanyDetails } from '@/lib/company/companyDetails';

export const metadata: Metadata = {
  title: 'That has reached us — Gridsmith Press',
  robots: { index: false, follow: false },
};

/**
 * `/press/contact/thank-you` — the confirmation for `K-13`.
 *
 * ## It is a route, not a state flag
 *
 * `press/PROJECT-RULES.md` §7: *"Success is a dedicated route, not a toast."* The master
 * `/contact` form renders its confirmation in place, which is right for a single-step form
 * where the id would be lost on refresh; here the whole point is that a person who has just
 * spent four steps describing an unfinished book has somewhere stable to land, and a URL they
 * can still see if they hit back.
 *
 * **No celebration.** ETH-01 and `PROJECT-RULES.md` §10: no confetti, no animation, no
 * congratulation. This division sells to people who have been sold to badly.
 *
 * The response commitment is read from the CMS singleton, not written here — non-negotiable #5,
 * one source for that sentence.
 *
 * `K-15` (the cross-division prompt) belongs on this page and only on this page. It is a
 * separate row and is not built here.
 */
export default async function Page() {
  const company = await getCompanyDetails();

  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container width="narrow">
          <Heading level={1}>That has reached us</Heading>
          <Prose>
            <p>{company.responseCommitment}</p>
            <p>
              A person reads it — there is no queue and no automated triage. If you left a
              manuscript link, we will look at it before replying.
            </p>
            {company.contactEmail ? (
              <p>
                If you need to add something, write to{' '}
                <a href={`mailto:${company.contactEmail}`}>
                  <Numeric>{company.contactEmail}</Numeric>
                </a>
                .
              </p>
            ) : null}
          </Prose>
        </Container>
      </Section>
    </main>
  );
}
