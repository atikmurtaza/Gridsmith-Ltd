import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import { Link } from '@/components/primitives/Link';
import { Numeric } from '@/components/primitives/Numeric';
import { getCompanyDetails } from '@/lib/company/companyDetails';
import { CANONICAL_PROCESS } from '@/lib/process/canonical';
import { FREELANCER_PROFILE, listFreelancerReviews } from '@/lib/reviews/freelancer';
import { ENQUIRY_CTA, enquiryHref } from '@/lib/services/architecture';
import styles from './home.module.css';

/**
 * The Master homepage — `GS-R001-M`. Six chapters, one environment.
 *
 * `GS-O008`: the owner rejected the previous homepage's grid, its three coloured division
 * cards and its line-art background mark. What replaced them is **content moving over one
 * continuous scene** (`MasterScene`): every section here is transparent, so the gold mark is
 * visible behind the whole page rather than only where a section happened to leave a gap.
 *
 * Each section carries `data-chapter`. The scene reads those positions and nothing else, so
 * copy can grow or shrink without anyone retuning the animation.
 *
 * All Server Components; zero client JS. The words are the approved ones from `GS-R001-R`
 * and before, re-set rather than rewritten. Three are new and are structural rather than
 * claims: the studios heading, the chapter labels, and the secondary hero link's wording.
 */

function Chapter({ n, label }: { n: number; label: string }) {
  return (
    <p className={styles.chapter}>
      <Numeric>{String(n).padStart(2, '0')}</Numeric>
      <span>{label}</span>
    </p>
  );
}

export function Hero({ headline, intro }: { headline: string; intro: string }) {
  return (
    <section className={styles.hero} data-chapter="hero" aria-labelledby="hero-title">
      <Container>
        <div className={styles.heroCopy}>
          <p className={styles.heroKicker}>
            <Numeric>Gridsmith Ltd</Numeric>
            <span aria-hidden="true" className={styles.rule} />
            <span>Design · Digital · Press</span>
          </p>
          <h1 id="hero-title" className={styles.heroTitle}>
            {headline}
          </h1>
          <p className={styles.heroIntro}>{intro}</p>
          <div className={styles.heroActions}>
            <Button href={enquiryHref()}>{ENQUIRY_CTA.master}</Button>
            <a href="#studios" className={styles.textLink}>
              See the three studios
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * The divisions — `M-J3`, still the most important block on the page, and no longer three
 * boxes. A typographic index: one row per studio, the name set large, the approved lines
 * beneath it. Plain `<a>`, because crossing a route group is a full document load
 * (`TECH-SPEC.md` §3) and `next/link` would prefetch three payloads it then discards.
 */
const STUDIOS = [
  {
    href: '/design',
    name: 'Gridsmith Design',
    services: 'Brand identity, graphic and 3D design, CAD and engineering drawings.',
    character: 'Creative and technical design built with the same attention to detail.',
  },
  {
    href: '/digital',
    name: 'Gridsmith Digital',
    services: 'Websites, software, applications and AI integrations.',
    character:
      'Custom digital products and internal systems designed around how your business actually works.',
  },
  {
    href: '/press',
    name: 'Gridsmith Press',
    services: 'Publishing, writing and content from manuscript to market.',
    character:
      'Professional support for authors and businesses, while keeping ownership where it belongs.',
  },
] as const;

export function Studios() {
  return (
    <section id="studios" className={styles.section} data-chapter="studios" aria-labelledby="studios-title">
      <Container>
        <div className={styles.column}>
          <Chapter n={1} label="The studios" />
          <h2 id="studios-title" className={styles.title}>
            Where would you like to start?
          </h2>
          <ol className={styles.studios}>
            {STUDIOS.map((s, i) => (
              <li key={s.href} className={styles.studio}>
                <Numeric>{String(i + 1).padStart(2, '0')}</Numeric>
                <div className={styles.studioBody}>
                  <h3 className={styles.studioName}>
                    <a href={s.href} className={styles.studioLink}>
                      {s.name}
                      <span aria-hidden="true" className={styles.arrow}>
                        →
                      </span>
                    </a>
                  </h3>
                  <p className={styles.studioServices}>{s.services}</p>
                  <p className={styles.studioCharacter}>{s.character}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className={styles.fallback}>
            Not sure, or need more than one? <a href="/contact">Tell us what you need</a>.
          </p>
        </div>
      </Container>
    </section>
  );
}

/**
 * The one-company argument and the structure disclosure, merged. They were two blocks making
 * one point; the disclosure stays on `/` because it names the legal entity a client contracts
 * with (`GS-R001-R` §7), and its figures stay monospace because they are checkable.
 */
export async function Context() {
  const company = await getCompanyDetails();
  return (
    <section className={styles.section} data-chapter="context" aria-labelledby="context-title">
      <Container>
        <div className={styles.column}>
          <Chapter n={2} label="One relationship" />
          <h2 id="context-title" className={styles.statement}>
            You shouldn’t have to introduce your business from scratch every time you need a
            different kind of expertise.
          </h2>
          <p className={styles.lede}>
            Gridsmith brings three specialist studios together under one relationship. Each has
            its own expertise, people and standards, while sharing the context that matters: your
            business, your goals and the work we’ve already done together.
          </p>
          <p className={styles.fact}>
            Gridsmith Design, Gridsmith Digital and Gridsmith Press are trading divisions of{' '}
            {company.legalName}, registered in {company.placeOfRegistration} as company number{' '}
            <Numeric>{company.companyNumber}</Numeric>. They are not separate companies. Work that
            spans two studios is one engagement, one scope and one invoice.
          </p>
          <p className={styles.more}>
            <Link href="/approach">How three studios work as one company</Link>
            <Link href="/about">About Gridsmith</Link>
          </p>
        </div>
      </Container>
    </section>
  );
}

/**
 * The six stages, by name only. The descriptions live on `/approach`; repeating them here was
 * the homepage becoming a second approach page.
 */
export function Process() {
  return (
    <section className={styles.section} data-chapter="process" aria-labelledby="process-title">
      <Container>
        <div className={styles.column}>
          <Chapter n={3} label="Process" />
          <h2 id="process-title" className={styles.title}>
            How we work
          </h2>
          <p className={styles.lede}>
            The same six stages in all three studios. What happens inside them differs by the
            work; the shape of the relationship does not.
          </p>
        </div>
        <ol className={styles.stages}>
          {CANONICAL_PROCESS.map((stage) => (
            <li key={stage.number} className={styles.stage}>
              <Numeric>{String(stage.number).padStart(2, '0')}</Numeric>
              <span className={styles.stageTitle}>
                {stage.title}
                {stage.optional ? <span className={styles.stageQualifier}> (if applicable)</span> : null}
              </span>
            </li>
          ))}
        </ol>
        <p className={styles.more}>
          <Link href="/approach">The six stages in full</Link>
        </p>
      </Container>
    </section>
  );
}

/**
 * The genuine Freelancer reviews — `GS-O014`, `GS-O015`, Master only. Verbatim, rating and date
 * as the API returns them, attribution on every review, one link to the profile.
 *
 * **No carousel.** The cylinder rotated by itself, which made SC 2.2.2 require a pause control
 * and hid most reviews at any moment. Here the heading holds its place while the reviews pass
 * under the reader's own scroll: nothing moves unless the reader moves it, every review is in
 * the document flow, and there is nothing to pause. The scene behind turns its pieces into a
 * ring through this chapter, which is where the cylinder went.
 *
 * An empty list renders nothing and fabricates nothing.
 */
export async function Reviews() {
  const reviews = await listFreelancerReviews();
  if (reviews.length === 0) return null;

  return (
    <section className={styles.section} data-chapter="reviews" aria-labelledby="reviews-title">
      <Container>
        <div className={styles.reviews}>
          <div className={styles.reviewsHead}>
            <Chapter n={4} label="Reviews" />
            <h2 id="reviews-title" className={styles.title}>
              What clients have said, where you can check it
            </h2>
            <p className={styles.lede}>
              Every review clients have left on our Freelancer profile, reproduced word for word.
              Nothing is selected, shortened or rewritten.
            </p>
            <p className={styles.more}>
              <Link href={FREELANCER_PROFILE} external>
                Read every review on our Freelancer profile
              </Link>
            </p>
          </div>
          <ul className={styles.reviewList}>
            {reviews.map((review) => (
              <li key={review.id} className={styles.review}>
                <figure className={styles.reviewFigure}>
                  <blockquote className={styles.reviewQuote}>
                    <p>{review.quote}</p>
                  </blockquote>
                  <figcaption className={styles.reviewMeta}>
                    <span className={styles.reviewName}>{review.authorName}</span>
                    <span className={styles.reviewFacts}>
                      <span>{review.rating} / 5</span>
                      <time dateTime={review.date}>{review.date}</time>
                    </span>
                    {review.projectTitle ? <span>{review.projectTitle}</span> : null}
                    <span>{review.sourceLabel}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export async function Close() {
  const company = await getCompanyDetails();
  return (
    <section className={styles.close} data-chapter="close" aria-labelledby="close-title">
      <Container>
        <div className={styles.column}>
          <Chapter n={5} label="Start" />
          <h2 id="close-title" className={styles.closeTitle}>
            Tell us what you need.
          </h2>
          <p className={styles.lede}>
            One form, all three studios. If what you need spans more than one of them, that is the
            first option on it.
          </p>
          <div className={styles.heroActions}>
            <Button href={enquiryHref()}>{ENQUIRY_CTA.master}</Button>
          </div>
          <p className={styles.commitment}>{company.responseCommitment}</p>
        </div>
      </Container>
    </section>
  );
}
