import { Inter } from 'next/font/google';

/**
 * Body face for Master, Design and Digital; display face for Master and Design.
 * Not loaded on Press, which is serif throughout.
 *
 * One typeface per module deliberately. A single fonts.ts calling all three would make
 * every route group's layout pull all three @font-face sets, which is exactly the
 * per-route-group scoping this is meant to provide.
 * **`display: 'optional'`, not `'swap'` — `M-P2-31`.** With `swap` the fallback paints
 * first and the real face replaces it whenever it lands, and every replacement rewraps the
 * text. Lighthouse attributed all four routes' mobile CLS to a single shift with the cause
 * `"Web font loaded"`: `/design` 0.1017 and `/press` 0.1231, both on the footer statutory
 * line, against budgets of 0.05. `next/font`'s metric-matched fallback (`size-adjust`,
 * `ascent-override`) narrows the mismatch and does not remove it — it matches average
 * metrics, not per-glyph advances, so a long line still rewraps.
 *
 * `optional` gives the face ~100ms and otherwise keeps the fallback for the life of that
 * page load, so the swap cannot happen and the shift cannot exist. It is cached for every
 * subsequent navigation.
 *
 * **The cost is real and is the owner's to weigh:** a first-time visitor on a slow
 * connection sees the fallback for that one page view, and four distinct display faces are
 * the identity premise. The alternative is raising the CLS budgets, which CLAUDE.md
 * forbids ("never break a performance budget to add a feature"). `M-P2-31`.
 */
export const inter = Inter({
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-inter',
});
