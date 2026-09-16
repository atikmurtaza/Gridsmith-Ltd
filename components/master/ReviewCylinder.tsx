import { FREELANCER_PROFILE, type FreelancerReview } from '@/lib/reviews/freelancer';
import { Link } from '@/components/primitives/Link';
import styles from './master.module.css';

/**
 * The Master review experience — `GS-P06`, `GS-O014`.
 *
 * A continuously rotating 3D ring of the genuine Freelancer reviews, travelling right to left.
 * The owner supplied *Cylinder Carousel | Vengeance UI* as the visual reference; what is taken
 * from it is the **geometry**, which is the well-published CSS 3D ring — children stacked in one
 * grid cell, each turned `i × 360°/n` and pushed out by a radius derived from the card width,
 * with the container rotated by a single infinite keyframe. **No third-party source was copied.**
 * The reference component is an `<img>` carousel published without a licence statement on the
 * page, it keeps rotating under `prefers-reduced-motion` (its "reduced" mode only slows the turn
 * to 128s), and it has no pause control at all — so two of its three behaviours are things this
 * site may not ship. Where the reference and `CLAUDE.md` disagree, `CLAUDE.md` wins.
 *
 * ## Server Component. Zero client JavaScript. No animation library.
 *
 * Everything below is CSS: the geometry, the rotation, the hover pause, the focus pause, the
 * pause control and the reduced-motion alternative. `/` carries the tightest LCP headroom in the
 * programme (`Q-M16`) and the master JS delta is 15KB for the whole layer, so a carousel that
 * cost a hydration boundary would be a carousel that got cut.
 *
 * ## The cards carry no link, and that is a change of position with a reason
 *
 * `TestimonialList` rendered the source link **per card**, and its docstring argued the case:
 * a reader checking one quote should not have to work out which footnote applies to it. That
 * argument was correct while reviews could have different sources. Every review here resolves to
 * the same URL — `sourceUrl` is `FREELANCER_PROFILE` for all twelve, structurally, because the
 * pipeline never reads a per-project link (`GS-P05` §8 refuses `review_context.seo_url`). So
 * there is exactly one destination and no footnote to match.
 *
 * What that buys is the whole of the rotating-focus problem, removed rather than managed: **no
 * focusable element is ever carried behind the cylinder**, so rotation cannot move focus, cannot
 * strand it on a back-facing card, and cannot need a `tabindex` or an `inert` sweep to prevent
 * either. The attribution still appears on every card as text — it is the claim being made — and
 * the one link sits immediately beneath, always visible and always in the tab order.
 *
 * ## Pausing is a Level A requirement, not a nicety
 *
 * WCAG 2.2 SC 2.2.2: motion that starts automatically, runs for more than five seconds and sits
 * alongside other content needs a mechanism to pause it. **A hover pause is not that mechanism**,
 * because a keyboard or touch user never triggers one. So there is a real checkbox with a real
 * label, and the CSS reads its `:checked` state — which is also why it is a checkbox rather than
 * a button: a button needs script, and script here would cost the zero-JS property above.
 *
 * Hover and `:focus-within` pause it as well (`GS-P06` §15), and under
 * `prefers-reduced-motion: reduce` nothing rotates at all, so the control is hidden there rather
 * than offered as a pause for something already still.
 */
export function ReviewCylinder({ reviews }: { reviews: FreelancerReview[] }) {
  return (
    <div className={styles.reviewBlock}>
      <div className={styles.reviewStage}>
        {/* `--review-count` is the only thing the geometry needs from the data: the angular step
            is `360deg / n` and the radius follows from it, so the ring stays a true cylinder as
            reviews are added without anyone editing a stylesheet. It is a number, not a colour. */}
        <ul
          className={styles.reviewRing}
          style={{ '--review-count': reviews.length } as React.CSSProperties}
        >
          {reviews.map((review, index) => (
            <li
              key={review.id}
              className={styles.reviewCard}
              style={{ '--review-index': index } as React.CSSProperties}
            >
              <figure className={styles.reviewFigure}>
                <blockquote className={styles.reviewQuote}>
                  {/* Verbatim. The pipeline trims surrounding whitespace and nothing else; a
                      body that cannot be published is withheld whole rather than edited. */}
                  <p>{review.quote}</p>
                </blockquote>
                <figcaption className={styles.reviewMeta}>
                  <span className={styles.reviewName}>{review.authorName}</span>
                  <span className={styles.reviewFacts}>
                    {/* Monospace, because `CLAUDE.md` marks anything verifiable that way, and
                        both of these are checkable against the profile the link below reaches.
                        The rating is printed as the API returns it — `4.6` and `5`, not `5.0`:
                        formatting a genuine rating is a small edit to evidence and there is no
                        reason to make one. */}
                    <span>{review.rating} / 5</span>
                    <time dateTime={review.date}>{review.date}</time>
                  </span>
                  {review.projectTitle ? (
                    // Freelancer's own closed skill taxonomy, never the client's project title.
                    <span className={styles.reviewCategory}>{review.projectTitle}</span>
                  ) : null}
                  <span className={styles.reviewSource}>{review.sourceLabel}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      {/* Outside the stage, which clips. Inside `.reviewBlock`, which is the element whose
          `:has()` the pause rule reads. */}
      <p className={styles.reviewControls}>
        <input type="checkbox" id="gs-reviews-pause" className={styles.reviewPauseInput} />
        <label htmlFor="gs-reviews-pause" className={styles.reviewPauseLabel}>
          Pause the reviews
        </label>
      </p>

      <p className={styles.blockMore}>
        <Link href={FREELANCER_PROFILE} external>
          Read every review on our Freelancer profile
        </Link>
      </p>
    </div>
  );
}
