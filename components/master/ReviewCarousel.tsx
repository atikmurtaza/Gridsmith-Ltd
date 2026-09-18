'use client'; // Rotation state, a timer and hover/focus pause — none of it exists on the server.

import { useEffect, useState } from 'react';
import type { FreelancerReview } from '@/lib/reviews/freelancer';
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

export function ReviewCarousel({ reviews }: { reviews: FreelancerReview[] }) {
  const n = reviews.length;
  const [turn, setTurn] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const front = ((turn % n) + n) % n;

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
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
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
              key={review.id}
              className={styles.carouselCard}
              style={{ '--i': i } as React.CSSProperties}
              data-front={i === front ? '' : undefined}
            >
              <figure className={styles.carouselFigure}>
                <p className={styles.carouselFacts}>
                  {/* Monospace: both are checkable against the profile. As the API returns them. */}
                  <span>{review.rating} / 5</span>
                  <time dateTime={review.date}>{review.date}</time>
                </p>
                {/* Verbatim and whole — the card grows to fit, so there is nothing to scroll. */}
                <blockquote className={styles.carouselQuote}>
                  <p>{review.quote}</p>
                </blockquote>
                <figcaption className={styles.carouselMeta}>
                  <span className={styles.carouselName}>{review.authorName}</span>
                  {review.projectTitle ? <span>{review.projectTitle}</span> : null}
                  <span>{review.sourceLabel}</span>
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
