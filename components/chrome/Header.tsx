import type { Division } from './RootShell';
import { NAV, WORDMARK } from './nav';
import styles from './chrome.module.css';

/**
 * The shared header (`M-03`, FR-M11). Server Component — nothing here has state.
 *
 * **Plain `<a>`, deliberately, not the `Link` primitive.** Two reasons and both are
 * binding. `TECH-SPEC.md` §3 requires navigation between route groups to be a full
 * document load — it is what makes the theme change flash-free and removes any window
 * for a client-side theme swap — and `next/link` would defeat that. And every link here
 * is in a shared layout, so importing the primitive puts `next/link`'s client runtime in
 * a chunk every route loads: measured once at 3.3KB gz shared, against Master's 15KB
 * delta budget that `M-06` already expects to overrun. Route-group links must not be
 * prefetched, so the correct component is the one that does less.
 *
 * No division switcher here: `TECH-SPEC.md` §3 puts it in the footer only, because a
 * header-level switcher pulls buyers sideways mid-funnel. That is `M-04`.
 *
 * ## The logo — `GS-R001-R`, and the SVG is the primary asset on measurement
 *
 * The owner supplied three files and asked that `gridsmith-logo.png` be primary **unless
 * inspection establishes another is technically more appropriate**. It does, decisively:
 *
 * | | `gridsmith-logo.png` | `gridsmith-logo.svg` |
 * |---|---|---|
 * | Bytes | **669,476** | **4,134** |
 * | Intrinsic | 1536×1536 raster | vector, `viewBox` 920×920 |
 * | Mark's share of the frame | **48%** — the rest is transparent padding | 80% |
 * | At 3× density | resamples | exact |
 *
 * This element renders at roughly 28px on **all 77 routes, above the fold**, on a programme
 * where `Q-M16` measured an *empty* page at 1520ms against Digital's 1600ms LCP ceiling. 654KB
 * to draw 28 pixels fails that arithmetic by two orders of magnitude, and half of it is empty
 * space. The vector was verified to be the same mark before it was preferred — shape IoU
 * **0.9624** against the PNG, with **zero** XOR pixels surviving two erosions, so every
 * disagreement between them is a sub-2px antialiasing rim. `BackgroundMark.tsx` carries the
 * full measurement.
 *
 * **The PNGs are not modified and not deleted.** Both remain in `public/brand/` exactly as
 * supplied; they are the right source for a social card or any raster context, and
 * `GS-O007`/`OWNER-ACTIONS.md` records the one such surface still open.
 *
 * **It is a CSS background on `.wordmark::before`, not an `<img>` and not `next/image`.** The
 * mark is **decorative**: the word "Gridsmith" beside it is the link's accessible name and says
 * exactly what the mark says, so an `<img>` here would carry `alt=""` — and a decorative image
 * with an empty alt is an image that belongs in the stylesheet. Three consequences follow and
 * all three are wanted:
 *
 * - **No markup.** There is no element to reserve space for and no attribute for a later edit
 *   to get wrong. The box is sized by the pseudo-element's own `inline-size`/`block-size`, so
 *   it is reserved before the file arrives and cannot shift the header.
 * - **No accessibility surface.** A pseudo-element with no `content` text is not in the
 *   accessibility tree at all, so the link's accessible name is **unchanged** from what
 *   `check-axe` has asserted since `M-03`.
 * - **`@next/next/no-img-element` does not arise**, and no rule is disabled to achieve it. That
 *   rule's premise — that `next/image` would optimise this — is false for an SVG, which has no
 *   format to negotiate and no density to resample; and `next/image` is a client component in a
 *   **shared layout**, which is the measured mistake the `Link` primitive's docstring records
 *   for `next/link` (3,389 B gz shared, enough to push a route over budget by re-chunking).
 *
 * `check:mark:field` asserts on the served page that the file actually resolves and paints, so
 * a broken path is a red build rather than a silently missing logo.
 */
export function Header({ division }: { division: Division }) {
  const items = NAV[division];

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a href={WORDMARK.href} className={styles.wordmark}>
          {WORDMARK.label}
        </a>
        {items.length > 0 && (
          <nav aria-label="Primary">
            <ul className={styles.navList}>
              {items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={styles.navLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
