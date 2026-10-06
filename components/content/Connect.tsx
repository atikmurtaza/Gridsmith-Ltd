import type { ReactNode } from 'react';
import { PLATFORM_MARKS } from '@/components/chrome/platformMarks';
import { whatsAppHref, smsHref } from '@/lib/company/companyDetails';
import { SOCIAL_CHANNELS } from '@/lib/company/social';
import { ENQUIRY_CTA, enquiryHref } from '@/lib/services/architecture';
import styles from '@/components/shared/shared.module.css';

/**
 * The connection block on `/about` — `GS-R001-R`.
 *
 * Server Component, zero client JS. Two groups: the three ways to reach Gridsmith directly, and
 * the accounts it keeps elsewhere.
 *
 * ## Every URL here is owner-configured and was resolved before it was published
 *
 * The social channels are **not** search results. They come from the owner's own earlier
 * Gridsmith implementation — `github.com/atikmurtaza/gridsmith-working`, supplied as owner
 * evidence — where each is an explicitly configured link rather than something inferred from the
 * word "Gridsmith". `lib/company/social.ts` carries the list, the provenance and the per-channel
 * verification.
 *
 * **That evidence corrected an earlier conclusion in this same phase, and the correction is
 * worth keeping.** Before it arrived, a generic web search had found `facebook.com/gridsmith`
 * and `linkedin.com/company/gridsmith` and attributed them to *Gridsmith Studio*, an unrelated
 * surface-pattern designer in Seattle. Both are in fact Gridsmith Ltd's; the Seattle accounts
 * are different URLs entirely. A search that cannot distinguish two companies sharing a word is
 * exactly why the brief says not to infer accounts from the name.
 *
 * ## The one configured link that is NOT published
 *
 * The old implementation's first social tile was a Gmail compose link to
 * `contact.gridsmith@gmail.com`. That address is on `FORBIDDEN_EMAILS` — `GS-O004` approved
 * `contact@gridsmith.uk` and nothing else, and `check:company` question 2 refuses the legacy one
 * on any route. Being owner-configured in an older build does not revive a superseded fact.
 *
 * ## The icons — revised at `GS-SHARED-001-B2`
 *
 * **Superseded for the platforms.** The owner's `B1-R2` decision puts each platform's own
 * official full-colour mark beside its link (provenance and the TikTok permission gate in
 * `components/chrome/platformMarks.ts`), so the platform rows here use those marks. The three
 * direct channels keep the generic glyphs below — they are channels, not brands. The block is a
 * Master-frame band because X's official mark is the white variant for dark backgrounds. The
 * paragraphs that follow are the original `GS-R001-R` reasoning, kept as history.
 *
 * Inline SVG, hairline stroke, `currentColor`, `aria-hidden` — drawn in the site's own geometric
 * register, **never platform brand marks**. Three independent reasons: there is no icon
 * dependency in this build and adding one fails non-negotiable #8 before the taste question
 * arises; a brand mark is a third-party trademark with its own usage terms, which is a licensing
 * question nobody has asked; and a platform's own colour would be the first hardcoded colour on
 * the site.
 *
 * **Every social row shares one glyph — two nodes joined by a rod, the site's own geometry —
 * and the platform NAME does the identifying.** Eight invented platform-ish glyphs would either
 * be brand marks wearing a disguise or shapes that identify nothing. The name is unambiguous and
 * costs no trademark question.
 */
const ICONS: Record<string, ReactNode> = {
  // An envelope: a rectangle and its flap.
  email: (
    <>
      <rect x="2.5" y="4.5" width="15" height="11" />
      <path d="M2.5 5.5 L10 11 L17.5 5.5" />
    </>
  ),
  // A speech bubble with a tail — the message, not the platform's mark.
  whatsapp: <path d="M3 4.5 h14 v9 h-8 l-4 3.5 v-3.5 h-2 z" />,
  // A message card with two lines of text on it.
  sms: (
    <>
      <rect x="2.5" y="4.5" width="15" height="11" />
      <path d="M6 8.5 h8 M6 11.5 h5" />
    </>
  ),
};

function Glyph({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg className={styles.channelGlyph} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      {ICONS[name]}
    </svg>
  );
}

function Mark({ platform }: { platform: string }) {
  const mark = PLATFORM_MARKS[platform];
  if (!mark) return <span aria-hidden="true" />;
  const box = { inlineSize: mark.width * 0.85, blockSize: mark.height * 0.85 };
  return 'path' in mark ? (
    <svg viewBox="0 0 24 24" style={box} className={styles.channelMark} aria-hidden="true" focusable="false">
      <path d={mark.path} fill="currentColor" />
    </svg>
  ) : (
    <span className={styles.channelMark} style={{ ...box, backgroundImage: `url(${mark.src})` }} aria-hidden="true" />
  );
}

type Row = { icon: ReactNode; href: string; label: string; value: string; external?: true };

function Channels({ rows }: { rows: Row[] }) {
  return (
    <ul className={styles.channels}>
      {rows.map((row) => (
        <li key={row.label} className={styles.channel}>
          {row.icon}
          <a
            className={styles.channelLink}
            href={row.href}
            {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {row.label}
            {row.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </a>
          <span className={styles.channelValue}>{row.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function Connect({
  contactEmail,
  contactPhone,
  responseCommitment,
  registration,
}: {
  contactEmail: string | null;
  contactPhone: string | null;
  responseCommitment: string;
  /** The one-line company-number note that closes About — visually subordinate (`GS-R001-R` §6). */
  registration: ReactNode;
}) {
  const direct: Row[] = [];
  if (contactEmail?.trim()) {
    direct.push({ icon: <Glyph name="email" />, href: `mailto:${contactEmail}`, label: 'Email', value: contactEmail });
  }
  if (contactPhone?.trim()) {
    direct.push({
      icon: <Glyph name="whatsapp" />,
      href: whatsAppHref(contactPhone),
      label: 'WhatsApp',
      value: contactPhone,
      external: true,
    });
    direct.push({ icon: <Glyph name="sms" />, href: smsHref(contactPhone), label: 'Text message', value: contactPhone });
  }

  const social: Row[] = SOCIAL_CHANNELS.map((c) => ({
    icon: <Mark platform={c.platform} />,
    href: c.url,
    label: c.platform,
    value: c.handle,
    external: true as const,
  }));

  return (
    <section className={`${styles.frame} ${styles.band}`} aria-labelledby="connect">
      <div className={styles.wrap}>
        <div className={styles.connect}>
          <div>
            <h2 id="connect" className={styles.rowTitle}>Getting in touch</h2>
            <p className={styles.connectNote}>
              The form on <a href="/contact">the contact page</a> reaches the same place as all of
              these and is the easiest route if your enquiry needs any detail. {responseCommitment}
            </p>
            <p className={styles.connectCta}>
              <a href={enquiryHref()} className={styles.cta}>
                {ENQUIRY_CTA.master}
              </a>
            </p>
            <h3 className={`${styles.connectHeading} ${styles.connectHeadingSpaced}`}>Directly</h3>
            <Channels rows={direct} />
          </div>
          <div>
            <h3 className={styles.connectHeading}>Platforms</h3>
            <Channels rows={social} />
          </div>
        </div>
        <p className={styles.registration}>{registration}</p>
      </div>
    </section>
  );
}
