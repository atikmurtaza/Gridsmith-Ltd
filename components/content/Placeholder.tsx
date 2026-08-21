import styles from './content.module.css';

/**
 * The image placeholder — `FOUNDATION` §7.7, *"neutral geometric placeholders at correct
 * aspect ratios"*, and §7.7's prohibition: no fabricated drawings, book covers or screenshots.
 *
 * ## It is not an image, and that is the whole design
 *
 * There is no file, no `<img>`, no asset in Sanity and no network request. It is a bordered box
 * with a CSS `repeating-linear-gradient` hatch, drawn from tokens. Three consequences, all of
 * them the reason:
 *
 * 1. **It cannot become the LCP element and cost anything.** A real placeholder image on 24
 *    project cards is 24 requests and a contended LCP on the route with the tightest budget in
 *    the programme. `Q-M16` already records that an empty page measures 1520ms against Digital's
 *    1600ms — there is no headroom to spend on decoration.
 * 2. **It reserves the correct space.** `aspect-ratio` holds the box at the ratio real media
 *    will use, so the layout being validated now is the layout real content will land in, and
 *    CLS stays at the 0.05 ceiling rather than moving when images arrive.
 * 3. **There is nothing to delete.** Seed records are deleted rather than edited
 *    (`FOUNDATION` §"Replacing seed content"); an uploaded placeholder asset would outlive the
 *    record that referenced it.
 *
 * `aria-hidden` and no alt text: it depicts nothing. WCAG 1.1.1's decorative case is exactly
 * this — a description of a placeholder is noise in a screen reader, and inventing one
 * ("abstract geometric pattern") describes the placeholder rather than the work.
 */
const RATIOS = {
  /** Project and post cards. */
  card: '3 / 2',
  /** Case-study lead media. */
  wide: '16 / 9',
  /** Book covers — Press. */
  book: '2 / 3',
  /** Team and author portraits. */
  portrait: '1 / 1',
} as const;

export function Placeholder({
  ratio = 'card',
  className,
}: {
  ratio?: keyof typeof RATIOS;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={[styles.placeholder, className].filter(Boolean).join(' ')}
      style={{ aspectRatio: RATIOS[ratio] }}
    />
  );
}
