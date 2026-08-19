import { DivisionRouting } from '@/components/master/DivisionRouting';
import { Continuity } from '@/components/master/Continuity';
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
 * **The hero copy is approved, and it is hardcoded on purpose.** `Q-M21` is resolved for blocks
 * 1–2: the homepage is not CMS-driven. It changes rarely, every block is bespoke, and `groupPage`
 * is correctly closed to `approach` and `about` — so there is no homepage schema and none is to
 * be built. The words below are the approved ones and are not to be reworded by a later session
 * without the same approval.
 */
export default function Page() {
  return (
    <main id="main" tabIndex={-1}>
      <Hero
        headline="One company. Three specialist studios. Built to work together."
        intro="Design, digital and publishing expertise under one roof. Start with what you need today — and keep the context when you need something else."
      />
      <DivisionRouting />
      <Continuity />
    </main>
  );
}
