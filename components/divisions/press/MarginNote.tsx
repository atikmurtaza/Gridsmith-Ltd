import type { ReactNode } from 'react';
import styles from './pressMargin.module.css';

/**
 * `P-03` — the Press margin note. `press/DESIGN.md` §4:
 *
 * > **Margin notes**: secondary information set in the outer columns at `--text-sm`
 * > `--ink-muted`, mirroring a printed book's marginalia. Used for clause references,
 * > footnotes, caveats. On mobile these collapse inline beneath the paragraph they annotate.
 *
 * ## It is a wrapper, not a floating note
 *
 * The note cannot be positioned on its own: "the outer column" is only meaningful relative to
 * the text it annotates, and "collapses beneath the paragraph they annotate" names a
 * relationship a detached element does not have. So the component takes the annotated content
 * as `children` and the note as a prop, and the two are one CSS grid.
 *
 * **Two columns above `64rem`, one below**, and that is the whole mechanism — no float, no
 * negative margin, no measurement. A float pulled outside the text column overflows the
 * viewport at the widths between "the container has slack" and "the container is capped", and
 * `check:responsive` asserts `scrollWidth` at three of them. A grid cannot overflow: the
 * second column is `minmax(0, 1fr)` of space that already exists inside the container.
 *
 * **Degradation is the single-column case, and it is a note rather than a broken layout.**
 * DOM order is content then note, so the collapsed rendering needs no `order` and reading
 * order matches visual order in both. `check:press-type` asserts both states by geometry —
 * the note's left edge flush with the content at 375 and 768, and beyond the content's right
 * edge at 1440 — so the collapse is measured rather than assumed.
 *
 * ## Where the breakpoint comes from
 *
 * `--container-narrow` is 800px and Press prose is capped at `--measure-narrow` (52ch), which
 * is about 426px in Source Serif at 17px. The slack is therefore real from roughly 768px
 * upward — but a ~290px note column beside a 426px column of 17px serif is two cramped
 * columns rather than a book's margin, so the second column starts at `64rem` where the
 * container has reached its cap. 375 and 768 collapse; 1440 does not.
 *
 * No client boundary, no data path, no state: this is a server component and its cost in the
 * route's JS delta is zero.
 */
export function MarginNote({
  note,
  children,
}: {
  /** The marginalia. Clause references, footnotes, caveats — `DESIGN.md` §4. Not body copy. */
  note: ReactNode;
  /** The content the note annotates. The note collapses directly beneath this. */
  children: ReactNode;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.body}>{children}</div>
      {/* `data-margin-note` is the stable handle: CSS module class names are hashed, so a gate
          reading the served page cannot select `.note`. Same reasoning as `Prose`'s
          `data-prose`, and `check:press-type` reads both. */}
      <p data-margin-note="" role="note" className={styles.note}>
        {note}
      </p>
    </div>
  );
}
