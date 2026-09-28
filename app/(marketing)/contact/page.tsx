import type { Metadata } from 'next';
import { Numeric } from '@/components/primitives/Numeric';
import { ContactForm } from '@/components/leads/ContactForm';
import { Opening } from '@/components/shared/Opening';
import styles from '@/components/shared/shared.module.css';
import { getCompanyDetails, whatsAppHref, smsHref } from '@/lib/company/companyDetails';

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
 * `check:launch`'s live-required tier — now the only entry in it — and why it is rendered here in
 * plain text as well as being a link.
 *
 * ## The commitment string is read once and passed down
 *
 * Non-negotiable #5: nothing may promise a response faster than the end of the next business
 * day, and there is **one source of truth** — `companyDetails.responseCommitment`. It is read
 * here and handed to the form so that the confirmation and this page cannot disagree, and so
 * that no component holds a second copy of the sentence.
 *
 * **At `GS-O004` that sentence stopped being a commitment at all**, and the single-source rule
 * is what made the change one edit rather than six. It now states typical behaviour — the
 * owner authorises no guaranteed response time and no SLA — and every surface that says
 * anything about timing moved with it because none of them holds its own copy.
 *
 * ## The number is a message channel, not a call channel — `GS-R001-R`
 *
 * `GS-O004` published the number and linked it `tel:`. **That limb is superseded.** The number
 * is unchanged and still published; what is withdrawn is the invitation to ring it. Nobody has
 * committed to answering a call, there are no published hours and there never will be
 * (`GS-O004`, unchanged), and *"We typically respond within 48 hours"* is a sentence about
 * asynchronous contact — it sits correctly beside WhatsApp and SMS and incoherently beside a
 * telephone.
 *
 * So the number is offered as **WhatsApp and text message**, each named, each linked with the
 * scheme that channel actually uses. `check:company` question 3 refuses any `tel:` href and any
 * "call us" wording on any route, and the strike is registered in `scripts/struck-rules.mjs`.
 *
 * **SMS is listed alongside WhatsApp rather than instead of it** because `sms:` does nothing on
 * most desktop browsers. Neither is ever the only route on the page: the form is above it and
 * the email address is beside it, and reg. 6(1)(c) is satisfied by the email regardless.
 */
export default async function Page() {
  const company = await getCompanyDetails();

  // `GS-SHARED-001-B2` — presentation only. The form, its fields, validation, branching,
  // consent and submission are `ContactForm` exactly as before; this page only places it on the
  // light sheet beside the direct routes. Copy is unchanged apart from the aside's labels.
  return (
    <main id="main" tabIndex={-1} data-nav="contact">
      <Opening
        place="Contact"
        title="Tell us what you need"
        lead={[
          'One form for all three studios. If what you need spans more than one of them, say so — it is the first option, and it comes straight to the founder rather than being routed to a studio that can only do part of it.',
          company.responseCommitment,
        ]}
      />

      <div className={styles.sheet}>
        <div className={`${styles.wrap} ${styles.contactGrid}`}>
          <div>
            <ContactForm
              responseCommitment={company.responseCommitment}
              contactEmail={company.contactEmail ?? ''}
            />
          </div>

          <aside className={styles.direct} aria-labelledby="other-ways">
            <h2 id="other-ways" className={styles.directTitle}>
              Or reach us directly
            </h2>
            <p className={styles.directNote}>If the form is in your way, it is not the only route.</p>
            <dl className={styles.directList}>
              {company.contactEmail ? (
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${company.contactEmail}`}>
                      <Numeric>{company.contactEmail}</Numeric>
                    </a>
                  </dd>
                </div>
              ) : null}
              {company.contactPhone ? (
                <div>
                  <dt>WhatsApp or text</dt>
                  <dd>
                    <Numeric>{company.contactPhone}</Numeric>
                    <br />
                    <a href={whatsAppHref(company.contactPhone)} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    {' · '}
                    <a href={smsHref(company.contactPhone)}>text message</a>
                  </dd>
                </div>
              ) : null}
            </dl>
            <p className={styles.directNote}>
              Both reach the same place as the form. {company.responseCommitment}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
