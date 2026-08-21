import type { Metadata } from 'next';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { ContactForm } from '@/components/leads/ContactForm';
import { getCompanyDetails } from '@/lib/company/companyDetails';

export const metadata: Metadata = {
  title: 'Tell us what you need — Gridsmith Ltd',
  description:
    'One form for all three studios. If your need spans more than one, say so — that is the first option.',
};

/**
 * `/contact` — `N-11`, and the confirmation at `N-12`.
 *
 * The page is a Server Component; only the form itself is a client boundary, and its docstring
 * says why. Everything above it — the commitment, the alternatives, the statutory contact
 * route — renders on the server and would still be there with JavaScript off.
 *
 * ## The email address is not a fallback, it is a legal requirement
 *
 * reg. 6(1)(c) of the Electronic Commerce (EC Directive) Regulations 2002 requires contact
 * details, **including an electronic mail address**, that make it possible to contact the
 * provider rapidly and communicate with them directly and effectively. A form alone does not
 * satisfy it — the user cannot reach us if it fails. That is why `contactEmail` is in
 * `check:launch`'s live-required tier alongside `vatNumber`, and why it is rendered here in
 * plain text as well as being a link.
 *
 * ## The commitment string is read once and passed down
 *
 * Non-negotiable #5: nothing may promise a response faster than the end of the next business
 * day, and there is **one source of truth** — `companyDetails.responseCommitment`. It is read
 * here and handed to the form so that the confirmation and this page cannot disagree, and so
 * that no component holds a second copy of the sentence.
 */
export default async function Page() {
  const company = await getCompanyDetails();

  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container width="narrow">
          <Heading level={1}>
            Tell us what you need
          </Heading>
          <Prose>
            <p>
              One form for all three studios. If what you need spans more than one of them, say
              so — it is the first option, and it comes straight to the founder rather than being
              routed to a studio that can only do part of it.
            </p>
            <p>{company.responseCommitment}</p>
          </Prose>
        </Container>
      </Section>

      <Section>
        <Container width="narrow">
          <ContactForm responseCommitment={company.responseCommitment} />
        </Container>
      </Section>

      <Section surface="sunken" labelledBy="other-ways">
        <Container width="narrow">
          <Heading level={2} id="other-ways">
            Or just email us
          </Heading>
          <Prose>
            <p>
              If the form is in your way, it is not the only route.
              {company.contactEmail ? (
                <>
                  {' '}
                  Write to{' '}
                  <a href={`mailto:${company.contactEmail}`}>
                    <Numeric>{company.contactEmail}</Numeric>
                  </a>{' '}
                  and it reaches the same place.
                </>
              ) : null}
            </p>
            {company.businessHours ? <p>{company.businessHours}</p> : null}
          </Prose>
        </Container>
      </Section>
    </main>
  );
}
