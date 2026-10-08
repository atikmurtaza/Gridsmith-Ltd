'use client'; // Continuous rotation, pointer drag and the controls' state exist only in the browser.

import { useEffect, useRef, useState } from 'react';
import type { PublicReview } from '@/lib/reviews/public-model';
import { Link } from '@/components/primitives/Link';
import styles from './home.module.css';

/**
 * The review cylinder — `GS-R001-M` R1, re-made at `GS-VIS-001` as labels on a turning drum and
 * at `GS-VIS-001-R1` as an installation sized by the room it is given.
 *
 * ## Every review, in full, reachable
 *
 * All reviews are in the DOM as one list, verbatim — a screen reader reads the whole set in
 * order, whatever is at the front. The front card is the reading card, and its text is never
 * truncated: a card grows to fit its whole review, so no card is a scroll region. The arrow
 * controls bring each review to the front in turn (`check:reviews:ui` question 4).
 *
 * ## The label is curved; the words are not
 *
 * Each card's surface is `STRIPS` narrow facets, each turned about the drum's own axis by its
 * angle within the card — so the label's edges follow the cylinder and its far side recedes. The
 * review text stays on one plane, tangent to the drum at the label's centre, a pixel proud of the
 * surface: legible at the front, foreshortened naturally at the sides, never warped. The facets
 * are decoration (`aria-hidden`) and carry no text. `geometry()` derives the angles from the
 * review count, so server and client render the same values. Because the words are flat and the
 * label curves away behind them, a label keeps side margins that grow with its width, and its
 * words stay at full contrast until `WORDS_GONE` degrees from the front — past that the label
 * is a sliver at the drum's edge, carried on as a blank curve.
 *
 * ## Sized by the stage, never by a card count
 *
 * Every length — card width, drum radius, perspective — is CSS, in container units of the
 * carousel (`home.module.css`), so a resize or a browser zoom recomposes the drum with no script
 * and no reload. The card has a readable minimum and maximum; between them it is a share of the
 * stage, the radius follows from the card and the review count, and how many reviews are in view
 * at once is whatever that geometry shows. The script holds only the angle, in degrees, so a
 * resize never moves the drum's position.
 *
 * ## Motion
 *
 * The drum turns continuously — one card every `CARD_SECONDS`, never stopping at a card. The
 * angle is integrated each animation frame from an angular velocity that eases toward its target
 * (the automatic rate, or zero when paused), so nothing starts or stops with a jump. Dragging
 * turns the drum directly under the pointer (pointer capture; `touch-action: pan-y` leaves
 * vertical scrolling to the page); a release keeps a little of the hand's speed and eases back.
 * The arrows turn it to the previous or next card. The pause control stops the automatic turn —
 * WCAG 2.2 SC 2.2.2 — and leaves the arrows and drag working. Frames run only while there is
 * something to move and the cylinder is on screen in a visible tab; on return it resumes from the
 * same angle, with no time accrued while away.
 *
 * Under `prefers-reduced-motion: reduce` the cylinder stays, still: nothing turns on its own, an
 * arrow moves the drum to the next card in one frame, a drag follows the pointer and stops where
 * it is released, and the pause control — with nothing to pause — is not shown.
 *
 * ## Hosted staging (`GS-HOST-H4-G`)
 *
 * The card body is the hosting branch's anonymous `PublicReview`: the actual rating as an image
 * with its value in words, the verbatim review, and a "Verified Freelancer review" link to the
 * official profile — no reviewer name, project or date. Because every card now holds a link, focus
 * inside a card turns that card to the front and holds the automatic turn until focus leaves, so a
 * focused link is never carried round the drum; a press on a link or control never starts a drag.
 * The drum styles apply only once `data-enhanced` is set after hydration, so without JavaScript
 * the same list is a still, flat grid of every review (`GS-HOST-H4-E`).
 */

/** Seconds for one card to cross the front: slow enough to read the front card as it passes. */
const CARD_SECONDS = 8;
/** Share of each card's angular slot the label covers; the rest is the gap between labels. */
const FILL = 0.9;
/** Share of the slot the label surface covers: a little wider than its words, so the flat words
 *  stay on the curved label as it turns (measured overhang began near 32° with labels = words). */
const LABEL_FILL = 0.96;
/** Facets per label. Six keeps the curve smooth at the front and cheap to composite. */
const STRIPS = 6;
/** Easing time constants, seconds: back to the automatic rate, and an arrow turn. */
const EASE_RATE = 0.6;
const EASE_NUDGE = 0.22;
/** A release keeps at most this angular speed (deg/s) — momentum, never a spin. */
const MAX_FLING = 60;
/** Beyond this angle the flat words would overhang the curved label. */
const WORDS_GONE = 50;

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Pure in the review count. `k` is the drum radius in card widths. */
export function geometry(n: number) {
  const step = 360 / n;
  const span = step * FILL;
  const k = 1 / rad(span);
  const label = step * LABEL_FILL;
  const facet = label / STRIPS;
  const strips = Array.from({ length: STRIPS }, (_, s) => {
    const phi = (s - (STRIPS - 1) / 2) * facet;
    return {
      phi,
      // A facet's chord, in card widths: 2·r·sin(Δ/2) with r = k card widths.
      width: 2 * k * Math.sin(rad(facet) / 2),
      // Edge facets turn further from the light: up to a quarter shade at the label's rim.
      shade: 0.25 * (Math.abs(phi) / (label / 2)) ** 2,
    };
  });
  return { step, span, k, strips, speed: step / CARD_SECONDS };
}

type Motion = {
  angle: number;
  v: number;
  pending: number;
  paused: boolean;
  /** Keyboard focus is inside the carousel: the automatic turn eases to rest. */
  held: boolean;
  still: boolean;
  drag: null | { x: number; angle: number; t: number; v: number; id: number };
};

export function ReviewCarousel({ reviews }: { reviews: readonly PublicReview[] }) {
  const n = reviews.length;
  const g = geometry(n);
  const [front, setFront] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLUListElement>(null);
  // Motion state lives in a ref: it changes every frame and must never re-render the list.
  const m = useRef<Motion>({ angle: 0, v: 0, pending: 0, paused: false, held: false, still: false, drag: null });
  const kick = useRef(() => {});

  useEffect(() => {
    const ready = requestAnimationFrame(() => setEnhanced(true));
    return () => cancelAnimationFrame(ready);
  }, []);

  useEffect(() => {
    m.current.paused = paused;
    if (paused) m.current.v = 0; // A pause is immediate; a resume eases in from rest.
    kick.current();
  }, [paused]);

  useEffect(() => {
    const el = ring.current;
    const host = stage.current;
    if (!el || !host || n < 2) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    let raf = 0;
    let last = 0;
    let shown = 0;
    const far: boolean[] = [];
    const ink: number[] = [];

    const draw = () => {
      const a = m.current.angle;
      el.style.transform = `translateZ(calc(-1 * var(--radius))) rotateY(${a.toFixed(3)}deg)`;
      const f = ((Math.round(-a / g.step) % n) + n) % n;
      if (f !== shown) setFront((shown = f));
      // Labels past 90° are on the far side of the drum: their facets are hidden whole (their
      // words are already backface-culled). Written only when a label crosses, never per frame.
      for (let i = 0; i < el.children.length; i++) {
        const away = Math.cos(rad(a + i * g.step)) < 0;
        if (far[i] !== away) el.children[i].toggleAttribute('data-far', (far[i] = away));
        // Keep painted words at full contrast; beyond the label's readable geometry they are
        // unpainted but stay in the accessibility tree so focus can bring any review to the front.
        const off = Math.abs(((((a + i * g.step) % 360) + 540) % 360) - 180);
        const o = off < WORDS_GONE ? 1 : 0;
        if (ink[i] !== o) {
          const fig = (el.children[i] as HTMLElement).querySelector('figure');
          if (fig) {
            fig.style.opacity = o === 1 ? '' : String(o);
            fig.style.pointerEvents = o === 0 ? 'none' : '';
          }
          ink[i] = o;
        }
      }
    };
    const live = () => visible && document.visibilityState === 'visible';
    /** Whether the next frame would move anything. */
    const busy = () => {
      const s = m.current;
      return !!s.drag || (!s.still && !s.paused && !s.held) || s.pending !== 0 || s.v !== 0;
    };
    const frame = (t: number) => {
      raf = 0;
      const s = m.current;
      // `last` is reset whenever the loop stops, so time off screen is never accrued; the cap
      // only absorbs a stalled frame, so a slow device still turns at the designed rate.
      const dt = last ? Math.min((t - last) / 1000, 0.25) : 0;
      last = t;
      if (!s.drag) {
        if (s.still) {
          // Reduced motion: an arrow turn lands in this frame; nothing coasts.
          s.angle += s.pending;
          s.pending = 0;
          s.v = 0;
        } else {
          const target = s.paused || s.held ? 0 : -g.speed;
          s.v += (target - s.v) * (1 - Math.exp(-dt / EASE_RATE));
          if ((s.paused || s.held) && Math.abs(s.v) < 0.001) s.v = 0;
          let take = s.pending * (1 - Math.exp(-dt / EASE_NUDGE));
          if (Math.abs(s.pending - take) < 0.01) take = s.pending; // Land exactly on the card.
          s.pending -= take;
          s.angle += s.v * dt + take;
        }
      }
      draw();
      if (live() && busy()) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const start = () => {
      if (!raf && live()) raf = requestAnimationFrame(frame);
    };
    const setReduce = () => {
      m.current.still = reduce.matches;
      if (reduce.matches) {
        m.current.v = 0;
        m.current.pending = 0;
      }
      setStill(reduce.matches);
      start();
    };
    kick.current = start;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(host);
    document.addEventListener('visibilitychange', start);
    reduce.addEventListener('change', setReduce);
    setReduce();
    draw();
    return () => {
      cancelAnimationFrame(raf);
      kick.current = () => {};
      io.disconnect();
      document.removeEventListener('visibilitychange', start);
      reduce.removeEventListener('change', setReduce);
    };
  }, [n, g.step, g.speed]);

  /** Turn to the previous (-1) or next (+1) card, counted from where the turn is heading. */
  const nudge = (dir: 1 | -1) => {
    const s = m.current;
    const heading = -(s.angle + s.pending) / g.step;
    s.pending += -(Math.round(heading) + dir) * g.step - (s.angle + s.pending);
    kick.current();
  };

  /** Turn the drum, by the shortest way, until card `i` is at the front. */
  const bringToFront = (i: number) => {
    const s = m.current;
    const at = s.angle + s.pending;
    const target = -i * g.step;
    s.pending += target + Math.round((at - target) / 360) * 360 - at;
    kick.current();
  };

  /** Degrees per pixel that keep the front of the drum under the pointer, at the current size. */
  const perPixel = () => {
    const card = ring.current?.firstElementChild as HTMLElement | null;
    const radiusPx = (card?.offsetWidth ?? 320) * g.k;
    return 180 / (Math.PI * radiusPx);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || e.button !== 0) return;
    if ((e.target as Element).closest('a, button')) return; // A link or control is pressed, not dragged.
    const s = m.current;
    s.angle += s.pending; // A turn in progress is completed under the hand, not discarded.
    s.pending = 0;
    s.drag = { x: e.clientX, angle: s.angle, t: e.timeStamp, v: 0, id: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
    if (e.pointerType === 'mouse') e.preventDefault(); // No text selection while turning.
    kick.current();
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = m.current.drag;
    if (!d || e.pointerId !== d.id) return;
    const angle = d.angle + (e.clientX - d.x) * perPixel();
    const dt = (e.timeStamp - d.t) / 1000;
    if (dt > 0) d.v = 0.7 * ((angle - m.current.angle) / dt) + 0.3 * d.v; // Smoothed hand speed.
    d.t = e.timeStamp;
    m.current.angle = angle;
    kick.current();
  };
  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = m.current;
    if (!s.drag || e.pointerId !== s.drag.id) return;
    const stale = e.timeStamp - s.drag.t > 120; // A hand that stopped before letting go keeps no speed.
    const v = s.still || stale || e.type === 'pointercancel' ? 0 : s.drag.v;
    s.v = Math.max(-MAX_FLING, Math.min(MAX_FLING, v));
    s.drag = null;
    kick.current();
  };

  return (
    <div
      className={styles.carousel}
      data-reviews-carousel=""
      data-enhanced={enhanced ? '' : undefined}
      style={{ '--n': n, '--k': g.k } as React.CSSProperties}
      onFocus={(event) => {
        m.current.held = true;
        const key = (event.target as HTMLElement).closest('[data-review-key]')?.getAttribute('data-review-key');
        const index = reviews.findIndex((review) => review.key === key);
        if (index >= 0) bringToFront(index);
        else kick.current();
      }}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        m.current.held = false;
        kick.current();
      }}
    >
      <div
        ref={stage}
        className={styles.carouselStage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <ul ref={ring} className={styles.carouselRing}>
          {reviews.map((review, i) => (
            <li
              key={review.key}
              data-review-key={review.key}
              className={styles.carouselCard}
              style={{ '--i': i } as React.CSSProperties}
              data-front={i === front ? '' : undefined}
            >
              {g.strips.map((strip, s) => (
                <span
                  key={s}
                  aria-hidden="true"
                  className={styles.carouselStrip}
                  data-edge={s === 0 ? 'start' : s === g.strips.length - 1 ? 'end' : undefined}
                  style={{ '--phi': `${strip.phi}deg`, '--sw': strip.width, '--shade': strip.shade } as React.CSSProperties}
                />
              ))}
              <figure className={styles.carouselFigure}>
                <p className={styles.carouselFacts}>
                  <span role="img" aria-label={`${review.rating} out of 5 stars`}>{review.rating} / 5</span>
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
        <button type="button" className={styles.carouselButton} aria-label="Rotate reviews left" onClick={() => nudge(-1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        </button>
        {/* Hidden under reduced motion by the stylesheet: there is no automatic turn to pause. */}
        <button
          type="button"
          className={styles.carouselButton}
          data-pause=""
          aria-label="Pause review rotation"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l10.5-6.5z" data-fill="" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5v14M15 5v14" /></svg>
          )}
        </button>
        <button type="button" className={styles.carouselButton} aria-label="Rotate reviews right" onClick={() => nudge(1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
        {/* Announced only while the visitor is in control, never on every automatic turn. */}
        <p className="sr-only" aria-live={paused || still ? 'polite' : 'off'}>
          Review {front + 1} of {n}
        </p>
      </div>
    </div>
  );
}
