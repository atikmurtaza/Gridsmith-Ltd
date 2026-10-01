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
  /** The studio's one-line description — **the one source** (`GS-MASTER-001-F`). The About
   *  structure map, the Master studio index and the first sentence of each division root
   *  layout's metadata description all read it; none keeps its own copy. It names the studio's
   *  breadth across its capability groups (`lib/services/architecture.ts`), not a service list. */
  summary: string;
  /** The studio's thesis line, as its own home sets it. Used by the Master studio index. */
  thesis: string;
}[] = [
  { href: '/design', label: 'Design', division: 'design', summary: 'Brand, visual, illustration, motion, 3D and technical design.', thesis: 'From line to form.' },
  { href: '/digital', label: 'Digital', division: 'digital', summary: 'Websites, software, apps, automation and AI, built and kept running.', thesis: 'When one thing changes, the right things follow.' },
  { href: '/press', label: 'Press', division: 'press', summary: 'Writing, editing, book production, publishing, audiobooks and marketing.', thesis: 'Clear writing is a series of decisions.' },
];

export const studio = (division: Exclude<Division, 'master'>) => STUDIOS.find((s) => s.division === division)!;

export const COMPANY: NavItem[] = [
  { href: '/approach', label: 'Approach' },
  { href: '/about', label: 'About' },
];

/** The wordmark always returns to `/`, from every division (`APP-FLOW.md` §8). */
export const WORDMARK = { href: '/', label: 'Gridsmith' };
