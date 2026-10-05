'use client'; // Rotation state, a timer and hover/focus pause — none of it exists on the server.

import { useEffect, useState } from 'react';
import type { PublicReview } from '@/lib/reviews/public-model';
import { Link } from '@/components/primitives/Link';
import styles from './home.module.css';

/**
 * The review cylinder — `GS-R001-M` R1. The owner rejected the article-style list and asked for
 * the cylinder carousel back, redesigned for the gold stage rather than restored.
 *
 * ## Every review, in full, reachable
 *
 * All reviews are in the DOM as one list, verbatim — a screen reader reads the whole set in
 * order, whatever is at the front. Sighted keyboard users step the ring with Previous / Next;
 * the front card is the reading card, and its text is never truncated: a card grows to fit its
 * whole review, so no card is a scroll region a keyboard would have to reach.
 *
 * ## Motion, and the controls it requires
 *
 * The ring steps forward on its own every 6 seconds — a turn you can read, rather than a spin.
 * It pauses while the pointer or focus is inside it, and the Pause button stops it outright,
 * which is WCAG 2.2 SC 2.2.2's requirement for motion that starts on its own. The turn counter
 * only grows, so the ring always turns the same way and never spins back through every card.
 *
 * Under `prefers-reduced-motion: reduce`, or without CSS `tan()`, the stylesheet lays the same
 * list out as a still grid and the controls are hidden; this component then never advances.
 */
const DWELL_MS = 6000;

export function ReviewCarousel({ reviews }: { reviews: readonly PublicReview[] }) {
  const n = reviews.length;
  const [turn, setTurn] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const front = ((turn % n) + n) % n;

  useEffect(() => {
    const ready = window.requestAnimationFrame(() => setEnhanced(true));
    return () => window.cancelAnimationFrame(ready);
  }, []);

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    if (paused || held || still.matches || n < 2) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setTurn((t) => t + 1);
    }, DWELL_MS);
    return () => window.clearInterval(id);
  }, [paused, held, n]);

  return (
    <div
      className={styles.carousel}
      data-reviews-carousel=""
      data-enhanced={enhanced ? '' : undefined}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={(event) => {
        setHeld(true);
        const key = (event.target as HTMLElement).closest('[data-review-key]')?.getAttribute('data-review-key');
        const index = reviews.findIndex((review) => review.key === key);
        if (index >= 0) setTurn((value) => value + ((index - value % n + n) % n));
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      <div className={styles.carouselStage}>
        <ul
          className={styles.carouselRing}
          style={{ '--n': n, '--turn': turn } as React.CSSProperties}
        >
          {reviews.map((review, i) => (
            <li
              key={review.key}
              data-review-key={review.key}
              className={styles.carouselCard}
              style={{ '--i': i } as React.CSSProperties}
              data-front={i === front ? '' : undefined}
            >
              <figure className={styles.carouselFigure}>
                <p className={styles.carouselFacts}>
                  <span aria-label={`${review.rating} out of 5 stars`}>{review.rating} / 5</span>
                  {review.country ? <span aria-hidden="true">{review.country.flag}</span> : null}
                </p>
                {/* Verbatim and whole — the card grows to fit, so there is nothing to scroll. */}
                <blockquote className={styles.carouselQuote}>
                  <p>{review.reviewText}</p>
                </blockquote>
                <figcaption className={styles.carouselMeta}>
                  <Link href={review.sourceUrl} external className={styles.carouselName}>
                    {review.sourceLabel}
                  </Link>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.carouselControls}>
        <button type="button" className={styles.carouselButton} onClick={() => setTurn((t) => t - 1)}>
          <span aria-hidden="true">←</span> Previous
        </button>
        <p className={styles.carouselCount} aria-live={held || paused ? 'polite' : 'off'}>
          Review <span>{front + 1}</span> of <span>{n}</span>
        </p>
        <button type="button" className={styles.carouselButton} onClick={() => setTurn((t) => t + 1)}>
          Next <span aria-hidden="true">→</span>
        </button>
        <button
          type="button"
          className={styles.carouselButton}
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          Pause rotation
        </button>
      </div>
    </div>
  );
}
