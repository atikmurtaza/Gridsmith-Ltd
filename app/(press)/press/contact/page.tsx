import type { Metadata } from 'next';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { PressContactFlow } from '@/components/divisions/press/PressContactFlow';
import { getCompanyDetails, whatsAppHref, smsHref } from '@/lib/company/companyDetails';

export const metadata: Metadata = {
  title: 'Tell us about the work — Gridsmith Press',
  description:
    'Four questions about the work, then how to reach you. Manuscripts are shared as links, never uploads.',
};

/**
 * `/press/contact` — `K-13`, `press/APP-FLOW.md` §6.
 *
 * A Server Component wrapping one client boundary. Everything a visitor needs in order to
 * decide whether to start — the response commitment and the email address — renders on the
 * server and survives with JavaScript off.
 *
 * ## `expectationsStatement` is not passed, and that is the honest state
 *
 * ETH-07's commercial-expectations statement is `R-09` (design) and `O-09` (copy), both TODO.
 * Passing nothing withholds the memoir segment rather than showing an acknowledgement box with
 * nothing above it to acknowledge. When the statement exists it is one prop, and the memoir
 * branch is already built behind it. Authoring it here would be non-negotiable #2.
 *
 * ## The email address, again, because reg. 6(1)(c) requires it
 *
 * Same reasoning as `/contact`: a form alone does not satisfy the Electronic Commerce (EC
 * Directive) Regulations 2002, because someone the form fails cannot reach us. `GS-O004` adds
 * the phone number beside it, from the same singleton and with no opening hours.
 */
export default async function Page() {
  const company = await getCompanyDetails();

  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container width="narrow">
          <Heading level={1}>Tell us about the work</Heading>
          <Prose>
            <p>
              Four short steps. The questions change after the first one, so you are only asked
              what applies to you.
            </p>
            <p>
              If you have a manuscript or source files, share a link rather than an upload.
            </p>
            <p>{company.responseCommitment}</p>
          </Prose>
        </Container>
      </Section>

      <Section>
        <Container width="narrow">
          <PressContactFlow
            responseCommitment={company.responseCommitment}
            contactEmail={company.contactEmail ?? ''}
          />
        </Container>
      </Section>

      <Section surface="sunken" labelledBy="press-contact-other">
        <Container width="narrow">
          <Heading level={2} id="press-contact-other">
            Or reach us directly
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
            {/* `GS-R001-R`: the number is a message channel, not a call channel. Same wording
                and same two schemes as `/contact` — the pages are one decision, not two. */}
            {company.contactPhone ? (
              <p>
                {'The same number takes '}
                <a
                  href={whatsAppHref(company.contactPhone)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                {' and '}
                <a href={smsHref(company.contactPhone)}>text messages</a>
                {': '}
                <Numeric>{company.contactPhone}</Numeric>. Both reach the same place as the
                form.
              </p>
            ) : null}
          </Prose>
        </Container>
      </Section>
    </main>
  );
}
