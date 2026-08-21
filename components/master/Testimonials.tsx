import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Link } from '@/components/primitives/Link';
import { Section } from '@/components/primitives/Section';
import { TestimonialList } from '@/components/content/TestimonialList';
import { listTestimonials } from '@/lib/sanity/queries';
import styles from './master.module.css';

/**
 * Homepage block 6 — clients and testimonials (`N-01`, `APP-FLOW.md` §2).
 *
 * Server Component, zero client JS.
 *
 * ## The only block on this page whose content is real
 *
 * Every other block below the fold renders `[SEED]` content. These six are public Freelancer
 * reviews, reproduced **verbatim** — the reviewers' own punctuation and capitalisation, typos
 * included, because correcting a review is editing it. They carry `isSeed: false`, `verified:
 * true`, and a `sourceUrl` to the profile they can be read on.
 *
 * That combination is why this block can sit on a homepage full of placeholders without
 * undermining it: a reader who checks one link finds the review exactly as printed. A quote
 * nobody can trace is worth nothing, and `PROJECT-RULES.md` §5 treats it the same way it treats
 * an invented one — which is the reason the source link is rendered per card rather than as a
 * single footnote at the bottom of the section.
 *
 * **Do not reword these, do not tidy them, and do not add a seventh from anywhere else** without
 * a source a reader can reach.
 *
 * The heading names where they come from, rather than saying "what clients say". The provenance
 * is the claim.
 */
export async function Testimonials() {
  const testimonials = await listTestimonials(6);
  if (testimonials.length === 0) return null;

  const profile = testimonials.find((t) => t.sourceUrl)?.sourceUrl;

  return (
    <Section surface="sunken" labelledBy="testimonials">
      <Container>
        <div className={styles.blockIntro}>
          <Heading level={2} id="testimonials">
            What clients have said, where you can check it
          </Heading>
          <p className={styles.processLede}>
            Reviews left by clients on our Freelancer profile, reproduced word for word. Each
            one links back to where it was written.
          </p>
        </div>
        <TestimonialList testimonials={testimonials} />
        {profile ? (
          <p className={styles.blockMore}>
            <Link href={profile} external>
              See the full profile and every review
            </Link>
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
