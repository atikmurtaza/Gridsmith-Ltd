import { Card } from '@/components/primitives/Card';
import { EmptyState } from '@/components/primitives/EmptyState';
import { Link } from '@/components/primitives/Link';
import type { TestimonialCard } from '@/lib/sanity/queries';
import styles from './content.module.css';

/**
 * Client testimonials — homepage block 6, and the proof block on each division landing page.
 *
 * Server Component, zero client JS. No carousel: `DESIGN.md` prohibits the register, and a
 * carousel hides most of the evidence behind an interaction, which is the opposite of what a
 * proof block is for.
 *
 * ## These are real, and the link is what makes that checkable
 *
 * Every testimonial on this site today is a public Freelancer review reproduced **verbatim** —
 * the reviewers' own punctuation, their own capitalisation, their own typos. They are the one
 * category of content on this site that is not seeded, and `scripts/seed-content.mjs` refuses to
 * write one without a `sourceUrl`.
 *
 * `PROJECT-RULES.md` §5 treats an unverifiable claim the way it treats an invented one. A quote
 * a visitor cannot trace is indistinguishable from one written in-house, so the source link is
 * not an attribution courtesy — it is the thing that makes the quote worth printing. It is
 * rendered per card rather than once at the bottom, because a reader checking one quote should
 * not have to work out which footnote applies to it.
 *
 * `verified` is not rendered as a badge. A site asserting that its own testimonials are verified
 * is worth nothing; a link to the page they are on is worth something.
 */
export function TestimonialList({
  testimonials,
  columns = 3,
}: {
  testimonials: TestimonialCard[];
  columns?: 2 | 3;
}) {
  if (testimonials.length === 0) {
    return (
      <EmptyState title="No testimonials yet">
        <p>Reviews appear here as clients leave them.</p>
      </EmptyState>
    );
  }

  return (
    <ul className={columns === 2 ? styles.testimonialsTwo : styles.testimonials}>
      {testimonials.map((t, i) => (
        <Card as="li" key={`${t.authorName}-${i}`} className={styles.testimonialCard}>
          <figure className={styles.testimonialFigure}>
            <blockquote className={styles.quote}>
              <p>{t.quote}</p>
            </blockquote>
            <figcaption className={styles.attribution}>
              <span className={styles.attributionName}>{t.authorName}</span>
              {t.authorRole || t.authorCompany ? (
                <span className={styles.attributionRole}>
                  {[t.authorRole, t.authorCompany].filter(Boolean).join(', ')}
                </span>
              ) : null}
              {t.projectTitle ? (
                <span className={styles.attributionProject}>{t.projectTitle}</span>
              ) : null}
              {t.sourceUrl ? (
                <Link href={t.sourceUrl} external tone="quiet" className={styles.attributionSource}>
                  {t.sourceLabel ?? 'Read this review at the source'}
                </Link>
              ) : null}
            </figcaption>
          </figure>
        </Card>
      ))}
    </ul>
  );
}
