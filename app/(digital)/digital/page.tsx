import type { Metadata } from 'next';
import { DivisionLanding, type DivisionCopy } from '@/components/divisions/DivisionLanding';

export const metadata: Metadata = {
  title: 'Gridsmith Digital — websites, software, apps and AI integration',
  description:
    'Websites, web and mobile applications, automation and AI integration. A trading division of Gridsmith Ltd.',
};

/**
 * `/digital` — the Digital landing page.
 *
 * Off-white canvas, electric blue accent, and a **monospace display face** — `DESIGN.md` §1's
 * *engineered clarity, a spec sheet*. All three come from `(digital)/layout.tsx`; nothing here
 * names any of them.
 *
 * **Digital carries the tightest budgets in the programme** — 100/100/100 Lighthouse on
 * desktop, LCP ≤1.6s, CLS ≤0.02, and a 15KB JS delta — because this site is the case study for
 * a studio that builds websites. This page therefore ships **zero client JavaScript of its own**
 * and no image requests: the placeholders are drawn in CSS (`Placeholder.tsx`). A slow page here
 * would be an argument against the division.
 *
 * **This is the landing page, not the full hub** — the ownership module, the stack page and the
 * estimator are Epic `U` rows.
 *
 * ## The copy
 *
 * From `CLAUDE.md`'s division table and the services in the CMS. **No metric, no client, no
 * claim about speed or rankings** — the studio's own budgets are measured and gated in this
 * repository, but a number on a marketing page that no gate on the page itself produces would
 * be exactly the unverified figure `CLAUDE.md` warns about.
 */
const COPY: DivisionCopy = {
  name: 'Gridsmith Digital',
  positioning: 'Software that fits the business, not the other way round.',
  intro: [
    'Websites, web and mobile applications, automation and AI integration — built around how your business actually works rather than around what a template makes easy.',
    'You get the code, the accounts and the documentation. Nothing is hosted somewhere only we can reach, and nothing needs us in order to keep running.',
  ],
  servicesHeading: 'What we do',
  servicesLede:
    'Every price here is a starting point, not a quotation — what moves it is listed against each one.',
  workHeading: 'Selected work',
  ctaHeading: 'Tell us what is not working.',
  ctaLede:
    'A process running on a spreadsheet, a site nobody can edit, an integration that keeps breaking — describe it in a sentence and we will tell you whether it is something we do.',
  ctaLabel: 'Start a digital project',
};

export default function Page() {
  return <DivisionLanding division="digital" copy={COPY} />;
}
