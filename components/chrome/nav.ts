import type { Division } from './RootShell';

export type NavItem = { href: string; label: string };

/**
 * Shared-shell navigation — `GS-SHARED-001-B1` (owner-approved direction, local prototype).
 *
 * **Only routes that exist are listed, and that is the whole policy.** `check-axe` resolves
 * every same-origin link it finds on every audited route, so an entry added before its route
 * lands fails the build rather than shipping a dead link. `APP-FLOW.md` §8's `Work` was removed
 * at `GS-P03` with the `/work` routes (`GS-D001`).
 *
 * **Division headers carry no sibling links** (owner decision 2): a division header is
 * `Gridsmith / {Division}` plus that division's enquiry. The siblings stay discoverable in the
 * footer's Studios index, which is the only division switcher (`TECH-SPEC.md` §3).
 */
export const STUDIOS: {
  href: string;
  label: string;
  division: Exclude<Division, 'master'>;
  /** The division's own one-line description — the first sentence of its root layout's
   *  metadata description, not new copy. Used by the About structure map (B2). */
  summary: string;
}[] = [
  { href: '/design', label: 'Design', division: 'design', summary: 'Brand, visual, illustration, motion, 3D and technical design.' },
  { href: '/digital', label: 'Digital', division: 'digital', summary: 'Websites, software, apps, automation and intelligence.' },
  { href: '/press', label: 'Press', division: 'press', summary: 'Writing, editorial, publishing preparation and content.' },
];

export const COMPANY: NavItem[] = [
  { href: '/approach', label: 'Approach' },
  { href: '/about', label: 'About' },
];

/** The wordmark always returns to `/`, from every division (`APP-FLOW.md` §8). */
export const WORDMARK = { href: '/', label: 'Gridsmith' };
