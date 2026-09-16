import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Section } from '@/components/primitives/Section';
import { ReviewCylinder } from '@/components/master/ReviewCylinder';
import { listFreelancerReviews } from '@/lib/reviews/freelancer';
import styles from './master.module.css';

/**
 * Homepage block 6 — client reviews (`N-01`, `APP-FLOW.md` §2). **Activated at `GS-P06`.**
 *
 * Server Component, zero client JS.
 *
 * ## The only block on this page whose content is real
 *
 * Every other block below the fold renders `[SEED]` content. These are the genuine public
 * Freelancer reviews, reproduced **verbatim** — the reviewers' own punctuation and
 * capitalisation, typos included, because correcting a review is editing it.
 *
 * That combination is why this block can sit on a homepage full of placeholders without
 * undermining it: a reader who follows the link finds the reviews exactly as printed. A quote
 * nobody can trace is worth nothing, and `PROJECT-RULES.md` §5 treats it the same way it treats
 * an invented one. **Do not reword these, do not tidy them, and do not add one from anywhere
 * else** without a source a reader can reach.
 *
 * ## What changed at `GS-P06`, and why it is not just a swap
 *
 * Until now this read **six** hand-transcribed `testimonial` documents out of Sanity. `GS-P05`
 * established that six was the size of an incomplete ingestion rather than the size of the
 * evidence: there are **twelve**, verified against both the public profile and the official API,
 * and four of the six differed from the source in whitespace the reviewers themselves typed. So
 * the CMS copy was not merely partial, it was less faithful than the source.
 *
 * `GS-O014` is the owner decision that allows this, on three limbs — Freelancer's API terms are
 * accepted, all twelve may be published **including the 4.6 that contains criticism**, and the
 * attribution wording is *"Verified review via Freelancer"*. Publishing the critical one is the
 * right default for a site whose Press section must be able to recommend against Gridsmith.
 *
 * **The six Sanity testimonials are retired from runtime in the same commit**, so the site never
 * carries two sources at once — one source means there is no second artefact to drift from it,
 * which is `01-VALIDATION-REPORT.md` §21's defect class removed rather than managed. The records
 * themselves are genuine development data and are left in the development dataset untouched;
 * `check:service-content` still asserts their anonymity.
 *
 * ## An outage cannot take this page down
 *
 * `listFreelancerReviews` returns `[]` on network failure, non-200, malformed body or schema
 * rejection, and Next serves the previously cached entry when a revalidation fails. With nothing
 * cached at all this renders `null` and the homepage is one block shorter. **No review is ever
 * fabricated to fill the gap.**
 */
export async function Testimonials() {
  const reviews = await listFreelancerReviews();
  if (reviews.length === 0) return null;

  return (
    <Section surface="sunken" labelledBy="testimonials">
      <Container>
        <div className={styles.blockIntro}>
          <Heading level={2} id="testimonials">
            What clients have said, where you can check it
          </Heading>
          <p className={styles.processLede}>
            Every review clients have left on our Freelancer profile, reproduced word for word.
            Nothing is selected, shortened or rewritten.
          </p>
        </div>
        <ReviewCylinder reviews={reviews} />
      </Container>
    </Section>
  );
}
