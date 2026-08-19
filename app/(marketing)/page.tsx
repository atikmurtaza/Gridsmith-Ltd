import { Hero } from '@/components/master/Hero';

/**
 * The homepage — `N-01`, block 1 of 9 (`APP-FLOW.md` §2).
 *
 * **Built one block per commit and measured against the Lighthouse gate after each.** The
 * `0.98` performance threshold on `/` is measured and gated; that nine blocks fit under it is a
 * projection nobody has tested, and a page delivered in one commit gives no way to attribute a
 * regression to any one of nine candidates.
 *
 * `id="main"` is the skip link's target (`M-02`); `tabIndex={-1}` so following the fragment
 * moves focus rather than only the scroll position. `check-axe` asserts it on every route.
 *
 * **The hero sentence is `[TK]` and is not being drafted here.** No approved positioning line
 * exists in any specification — `APP-FLOW.md` §2 names the slot and supplies no words — and
 * CLAUDE.md non-negotiable #2 is to mark it and stop rather than invent the most-read sentence
 * on the site. `Q-M21`, which also covers where homepage copy lives: there is no schema for it,
 * and `groupPage` is deliberately closed to `approach` and `about`.
 */
export default function Page() {
  return (
    <main id="main" tabIndex={-1}>
      <Hero headline="[TK] One sentence on what Gridsmith is — not a services list." />
    </main>
  );
}
