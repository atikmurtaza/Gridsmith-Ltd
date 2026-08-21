import type { Metadata } from 'next';
import { DivisionLanding, type DivisionCopy } from '@/components/divisions/DivisionLanding';

export const metadata: Metadata = {
  title: 'Gridsmith Design — brand, 3D, CAD and engineering drawings',
  description:
    'Brand identity, graphic and 3D design, CAD drafting and engineering drawings. A trading division of Gridsmith Ltd.',
};

/**
 * `/design` — the Design landing page.
 *
 * The theme does the work: near-black canvas, amber accent, neo-grotesque display face, all set
 * by `(design)/layout.tsx` on `<html data-division="design">` before first paint. `DESIGN.md`
 * §1 calls the register *a precision instrument — a drawing sheet*, and nothing in this file
 * names a colour or a face for that reason. See `DivisionLanding.tsx`.
 *
 * **This is the landing page, not the full hub.** `design/APP-FLOW.md` §3 specifies a track fork
 * between Brand & Visual and Technical & Engineering, a standards and capability strip, and a
 * Design Desk teaser. Those are Epic `B` rows and they need division content and a founder
 * decision on the track taxonomy. What ships here is real and usable: what the studio is, what
 * it does with a price against each service, the work, the process and one way to get in touch.
 *
 * ## The copy
 *
 * Drawn from what the repository already establishes — `CLAUDE.md`'s division table, the
 * services in the CMS, and the skills on the public Freelancer profile the testimonials link to.
 * **Nothing here claims a standard, a certification, a client or a figure.** The one place a
 * reader might expect one — "drawings a workshop can quote from" — is a description of intent,
 * not a conformance claim, and the Client Terms say in terms that a drawing set is not a
 * substitute for a competent person's design check.
 */
const COPY: DivisionCopy = {
  name: 'Gridsmith Design',
  positioning: 'Design that has to be right, not just look right.',
  intro: [
    'Brand identity, graphic and 3D design, CAD drafting and engineering drawings — the creative and the technical held to the same standard, because most projects need both and the handover between them is where things usually go wrong.',
    'A logo that survives being embroidered. A render that shows the product you will actually ship. A drawing set a workshop can quote from without sending it back with questions.',
  ],
  servicesHeading: 'What we do',
  servicesLede:
    'Every price here is a starting point, not a quotation — what moves it is listed against each one.',
  workHeading: 'Selected work',
  ctaHeading: 'Tell us what you are making.',
  ctaLede:
    'A sketch, a photograph of the part, a competitor’s catalogue page — whatever you have is enough to start with.',
  ctaLabel: 'Start a design project',
};

export default function Page() {
  return <DivisionLanding division="design" copy={COPY} />;
}
