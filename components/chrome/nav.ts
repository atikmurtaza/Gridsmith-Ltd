import type { Division } from './RootShell';

export type NavItem = { href: string; label: string };

/**
 * Per-division primary navigation (`M-03`, FR-M11).
 *
 * **Only routes that exist are listed, and that is the whole policy.** `APP-FLOW.md` §8
 * specifies the master header as `Design · Digital · Press · Work · Approach · About ·
 * [Tell us what you need]`. Four of those routes are Epic N and do not exist; shipping
 * them now would put four 404s in the chrome of every page on the site. `check-axe`
 * resolves every same-origin link it finds on every audited route, so adding one back
 * before its route lands fails the build rather than shipping a dead link.
 *
 * The three division lists are empty on purpose rather than absent. Each division's own
 * navigation belongs to its shell epic — `B-04` (Design), `U-04` (Digital), `P-04`
 * (Press) — and inventing entries here would be the master layer deciding a division's
 * information architecture. Until one fills its list, a division header is the wordmark
 * alone, which is a correct header for a one-page division.
 */
export const NAV: Record<Division, NavItem[]> = {
  master: [
    { href: '/design', label: 'Design' },
    { href: '/digital', label: 'Digital' },
    { href: '/press', label: 'Press' },
    // **The four routes `APP-FLOW.md` §8 named and `M-03` could not ship.** They exist now
    // (`N-04`, `N-07`, `N-08`, `N-11`), so the header is the one the spec specified rather
    // than the subset that resolved. `check-axe` resolves every same-origin link on every
    // audited route, so this list cannot get ahead of the routes again without failing the
    // build — which is what made shipping the subset the right call at the time rather than
    // a compromise.
    { href: '/work', label: 'Work' },
    { href: '/approach', label: 'Approach' },
    { href: '/about', label: 'About' },
  ],
  design: [],
  digital: [],
  press: [],
};

/** The wordmark always returns to `/`, from every division (`APP-FLOW.md` §8). */
export const WORDMARK = { href: '/', label: 'Gridsmith' };
