import type { Metadata } from 'next';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Link } from '@/components/primitives/Link';
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
 * ## The cross-division prompt (`K-15`, FR-P20) is here and nowhere else
 *
 * `APP-FLOW.md` §6: *"never mid-funnel — upselling a suspicious buyer mid-decision is exactly
 * the behaviour they are screening for."* So it sits after the enquiry is sent, states what the
 * other two divisions are, and asks for nothing: no second form, no button styled as a call to
 * action, no claim about what the work costs or how good it is. Two links and a sentence.
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
          <Prose>
            <p>
              Gridsmith Press is one of three trading divisions of Gridsmith Ltd. If the book
              turns out to need a cover, a set of drawings, or a place on the web, the same
              company does that work — <Link href="/design">Gridsmith Design</Link> and{' '}
              <Link href="/digital">Gridsmith Digital</Link>. There is nothing to do about that
              now; it is here so you know it exists.
            </p>
          </Prose>
        </Container>
      </Section>
    </main>
  );
}
