import { STUDIOS } from '@/components/chrome/nav';
import { Button } from '@/components/primitives/Button';
import { Link } from '@/components/primitives/Link';
import { Numeric } from '@/components/primitives/Numeric';
import { getCompanyDetails } from '@/lib/company/companyDetails';
import { CANONICAL_PROCESS } from '@/lib/process/canonical';
import { FREELANCER_PROFILE, listFreelancerReviews } from '@/lib/reviews/freelancer';
import { ENQUIRY_CTA, enquiryHref } from '@/lib/services/architecture';
import { ReviewCarousel } from './ReviewCarousel';
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
 * `GS-MASTER-001-F` added the owner-approved proposition, studio theses and relationship
 * capabilities, and one structural label over the last: "Across all three studios".
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
      {/* No `Container`: its 1280px cap is what left the dead space on wide screens (R1). Every
          chapter, and the header and footer on `/`, share this one fluid frame and left edge. */}
      <div className={styles.frame}>
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
      </div>
    </section>
  );
}

/**
 * The divisions — `M-J3`, still the most important block on the page, and no longer three
 * boxes. A typographic index: one row per studio — the name set large, its summary, its thesis
 * line. Summary and thesis come from `STUDIOS` in `nav.ts`, the one source About and the division
 * metadata also read (`GS-MASTER-001-F`); this page keeps no copy of its own. Plain `<a>`,
 * because crossing a route group is a full document load (`TECH-SPEC.md` §3) and `next/link`
 * would prefetch three payloads it then discards.
 */
export function Studios() {
  return (
    <section id="studios" className={styles.section} data-chapter="studios" aria-labelledby="studios-title">
      <div className={styles.frame}>
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
                      Gridsmith {s.label}
                    </a>
                  </h3>
                  <p className={styles.studioSummary}>{s.summary}</p>
                  <p className={styles.studioThesis}>{s.thesis}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className={styles.fallback}>
            Not sure, or need more than one? <a href="/contact">Tell us what you need</a>.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * What Master itself does across the studios (`GS-MASTER-001-F`, owner-approved wording). A
 * relationship-level index subordinate to the chapter's argument — no links, no prices, no
 * icons; the studios' services stay on the studio pages.
 */
const RELATIONSHIP = [
  ['Digital roadmap & discovery', 'Define what needs to change before deciding what needs to be built.'],
  ['Strategy & advisory', 'Turn business requirements into a clear direction across the right specialist areas.'],
  ['Programme management', 'Coordinate work across Design, Digital and Press under one relationship.'],
  ['Ongoing partnership', 'Keep context, priorities and delivery connected as requirements evolve.'],
] as const;

/**
 * The one-company argument and the structure disclosure, merged. They were two blocks making
 * one point; the disclosure stays on `/` because it names the legal entity a client contracts
 * with (`GS-R001-R` §7), and its figures stay monospace because they are checkable.
 *
 * `GS-MASTER-001-F`: the proposition moved to the hero, so the approved "under one relationship"
 * sentence became this chapter's heading rather than repeating the proposition here.
 */
export async function Context() {
  const company = await getCompanyDetails();
  return (
    <section className={styles.section} data-chapter="context" aria-labelledby="context-title">
      <div className={styles.frame}>
        <div className={styles.column}>
          <Chapter n={2} label="One relationship" />
          <h2 id="context-title" className={styles.statement}>
            Gridsmith brings three specialist studios together under one relationship.
          </h2>
          <p className={styles.lede}>
            Each has its own expertise, people and standards, while sharing the context that
            matters: your business, your goals and the work we’ve already done together.
          </p>
          <p className={styles.fact}>
            Gridsmith Design, Gridsmith Digital and Gridsmith Press are trading divisions of{' '}
            {company.legalName}, registered in {company.placeOfRegistration} as company number{' '}
            <Numeric>{company.companyNumber}</Numeric>. They are not separate companies. Work that
            spans two studios is one engagement, one scope and one invoice.
          </p>
          <h3 className={styles.capabilitiesTitle}>Across all three studios</h3>
          <dl className={styles.capabilities}>
            {RELATIONSHIP.map(([name, line]) => (
              <div key={name} className={styles.capability}>
                <dt>{name}</dt>
                <dd>{line}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.more}>
            <Link href="/approach">How three studios work as one company</Link>
            <Link href="/about">About Gridsmith</Link>
          </p>
        </div>
      </div>
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
      <div className={styles.frame}>
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
      </div>
    </section>
  );
}

/**
 * The genuine Freelancer reviews — `GS-O014`, `GS-O015`, Master only. Verbatim, rating and date
 * as the API returns them, attribution on every review, one link to the profile.
 *
 * **The cylinder, again (R1).** The first redesign replaced it with a still list, and the owner
 * rejected that as reading like articles. `ReviewCarousel` is the cylinder redesigned for the
 * gold stage — see its docstring for the controls and the reduced-motion grid.
 *
 * An empty list renders nothing and fabricates nothing.
 */
export async function Reviews() {
  const reviews = await listFreelancerReviews();
  if (reviews.length === 0) return null;

  return (
    <section className={`${styles.section} ${styles.reviewsSection}`} data-chapter="reviews" aria-labelledby="reviews-title">
      <div className={styles.frame}>
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
          <ReviewCarousel reviews={reviews} />
        </div>
      </div>
    </section>
  );
}

export async function Close() {
  const company = await getCompanyDetails();
  return (
    <section className={styles.close} data-chapter="close" aria-labelledby="close-title">
      <div className={styles.frame}>
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
      </div>
    </section>
  );
}
