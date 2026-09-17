import { Heading } from '@/components/primitives/Heading';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { whatsAppHref, smsHref } from '@/lib/company/companyDetails';
import styles from './content.module.css';

/**
 * The connection block on `/about` — `GS-R001-R`.
 *
 * Server Component, zero client JS. Four channels, each of which is **verified to exist**, and
 * that is the whole editorial rule of this component.
 *
 * ## What is not here, and why the absence is the finding
 *
 * `GS-R001-R` asked for Gridsmith's actual social channels. There are none that can be
 * confirmed. Checked, on 16 September 2026:
 *
 * - **The live `gridsmith.uk` links no social account at all** — its only external links are a
 *   `mailto:` and a `tel:`, read from the served pages of `/`, `/about-us/`, `/contact/` and
 *   `/services/`.
 * - **A public search for "Gridsmith" social accounts returns other companies.** Gridsmith
 *   Studio (a surface-pattern designer in Seattle) holds the Instagram, Facebook and LinkedIn
 *   handles; `joingridsmith.com` and `gridsmith.io` are two further unrelated businesses. None
 *   is Gridsmith Ltd, company `17050842`.
 *
 * Linking any of them would put a third party's business on Gridsmith's About page. The brief's
 * instruction where a channel cannot be confidently verified is to omit it and report it, and
 * that is `GS-O017` in `OWNER-ACTIONS.md`. **Adding a channel here is a one-line change once a
 * URL is confirmed** — the omission is the only thing holding it.
 *
 * ## Freelancer is the one external channel, and it was already approved
 *
 * `https://www.freelancer.com/u/GridsmithLTD` is not a search result. It is the profile
 * `GS-O014` approved as the attribution target for the reviews on the homepage, and the
 * account the official API returns those reviews from. It is the only social or platform
 * presence this programme has evidence for.
 *
 * ## The icons
 *
 * Inline SVG, hairline stroke, `currentColor`, `aria-hidden` — drawn in the site's own
 * geometric register rather than imported as brand logos. Three reasons and each is
 * independent: there is no icon dependency in this build and adding one for four glyphs fails
 * non-negotiable #8 arithmetic before it reaches the taste question; brand logos are third-party
 * marks with their own usage terms, which is a licensing question nobody has asked; and a
 * platform's own colour would be the first hardcoded colour on the site. Each link's accessible
 * name is its text, so the glyph carries no meaning a screen reader needs.
 */
const ICONS: Record<string, React.ReactNode> = {
  // An envelope: a rectangle and its flap.
  email: (
    <>
      <rect x="2.5" y="4.5" width="15" height="11" />
      <path d="M2.5 5.5 L10 11 L17.5 5.5" />
    </>
  ),
  // A speech bubble with a tail — the message, not the platform's mark.
  whatsapp: (
    <>
      <path d="M3 4.5 h14 v9 h-8 l-4 3.5 v-3.5 h-2 z" />
    </>
  ),
  // A message card with two lines of text on it.
  sms: (
    <>
      <rect x="2.5" y="4.5" width="15" height="11" />
      <path d="M6 8.5 h8 M6 11.5 h5" />
    </>
  ),
  // Two nodes joined by a rod — the site's own geometry, and a profile held elsewhere.
  profile: (
    <>
      <circle cx="5.5" cy="10" r="2.5" />
      <circle cx="14.5" cy="10" r="2.5" />
      <path d="M8 10 h4" />
    </>
  ),
};

function Glyph({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg
      className={styles.connectGlyph}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {ICONS[name]}
    </svg>
  );
}

export function Connect({
  contactEmail,
  contactPhone,
  responseCommitment,
}: {
  contactEmail: string | null;
  contactPhone: string | null;
  responseCommitment: string;
}) {
  const rows: { key: keyof typeof ICONS; href: string; label: string; value: string; external?: true }[] = [];

  if (contactEmail?.trim()) {
    rows.push({
      key: 'email',
      href: `mailto:${contactEmail}`,
      label: 'Email',
      value: contactEmail,
    });
  }
  if (contactPhone?.trim()) {
    rows.push({
      key: 'whatsapp',
      href: whatsAppHref(contactPhone),
      label: 'WhatsApp',
      value: contactPhone,
      external: true,
    });
    rows.push({
      key: 'sms',
      href: smsHref(contactPhone),
      label: 'Text message',
      value: contactPhone,
    });
  }
  rows.push({
    key: 'profile',
    href: 'https://www.freelancer.com/u/GridsmithLTD',
    label: 'Freelancer',
    value: 'freelancer.com/u/GridsmithLTD',
    external: true,
  });

  return (
    <>
      <Heading level={2} id="connect">
        Getting in touch
      </Heading>
      <Prose>
        <p>
          The form on <a href="/contact">the contact page</a> reaches the same place as all of
          these and is the easiest route if your enquiry needs any detail. {responseCommitment}
        </p>
      </Prose>
      <ul className={styles.connectList}>
        {rows.map((row) => (
          <li key={row.label} className={styles.connectItem}>
            <Glyph name={row.key} />
            <a
              className={styles.connectLink}
              href={row.href}
              {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {row.label}
              {row.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
            </a>
            <span className={styles.connectValue}>
              <Numeric>{row.value}</Numeric>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
