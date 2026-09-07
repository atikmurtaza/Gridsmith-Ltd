/**
 * Step 1's segment list for the Press contact flow (`K-13`).
 *
 * **This is a separate file from `pressLead.ts` because of a measurement, not a preference.**
 * The flow's client component needs the option list and the segment type; `pressLead.ts` is the
 * Zod contract. Importing the list from there pulled Zod into the client bundle and put
 * `/press/contact` at a **23.9KB** delta against a 20KB budget — over, on the first clean build.
 * With the list here the route measures **7.7KB**. Nothing was cut and no budget moved; a
 * server-side schema had simply crossed into the browser through one named import.
 *
 * So: **nothing in this file may import Zod, or import anything that does.** `pressLead.ts`
 * imports *from* here, never the other way round.
 *
 * `PRESS_SEGMENTS` is the single list; `pressLeadPayload`'s four branches are typed against it,
 * so a segment added here without a branch is a type error rather than a silent gap.
 */
import {
  CLIENT_TERMS_BUSINESS,
  CLIENT_TERMS_CONSUMER,
  CLIENT_TERMS_DISAMBIGUATION,
} from '../legal/slugs.ts';

// Relative, with the extension: `check:press:contact:selftest` imports this file under Node 24
// type-stripping, which resolves neither the `@/` alias nor an extensionless specifier — the
// same reason `sanity/schemas` uses explicit extensions (see `tsconfig.json`). Webpack and the
// selftest both resolve this form, so the gate's subject is the shipped file.

export const PRESS_SEGMENTS = ['author', 'business', 'memoir', 'content'] as const;
export type PressSegment = (typeof PRESS_SEGMENTS)[number];

/**
 * `memoir` appears only when the ETH-07 commercial-expectations statement is available to render
 * beside it. The statement is `R-09`/`O-09` and is not authored in code; an acknowledgement
 * checkbox with nothing above it to acknowledge is a consent record of nothing.
 * `check:press:contact:selftest` asserts both directions of this by reading the returned list.
 */
export function pressSegmentOptions(hasExpectationsStatement: boolean) {
  const all = [
    { value: 'author', label: 'I am an author with a manuscript' },
    { value: 'business', label: 'I am a business or a founder' },
    { value: 'memoir', label: 'I am writing a memoir or a legacy book' },
    { value: 'content', label: 'I need ongoing content' },
  ];
  return hasExpectationsStatement ? all : all.filter((o) => o.value !== 'memoir');
}

/**
 * Which client-terms instrument a segment is routed to (`K-16`, `PRD.md` FR-P24).
 *
 * **The instruments do not test who you are, they test what you are buying for.**
 * `CONSUMER-TERMS.md` §1 applies where an individual buys *"wholly or mainly for purposes
 * outside their trade, business, craft or profession"*; `MSA-BUSINESS.md` §1 applies *"only
 * where the client is acting for purposes relating to a trade, business, craft or
 * profession"*. So the routing is only as determinate as the segment answer is about purpose,
 * and the three destinations are not interchangeable — `CRA 2015 s. 57` makes a business
 * liability cap not binding on a consumer, which is the whole reason `/legal/client-terms`
 * was split into two instruments on 26 August 2026 (`lib/legal/slugs.ts`).
 *
 * | Segment | Destination | Why |
 * |---|---|---|
 * | `business` | business terms | *"I am a business or a founder"* states the trade purpose `MSA-BUSINESS.md` §1 requires |
 * | `author` | consumer terms | `_legal/00-LEGAL-BASIS.md` §3 and FR-P24: an individual author with a manuscript is a consumer buyer, and the instrument's own §1 corrects the minority who are not |
 * | `memoir` | consumer terms | same, and more strongly — a memoir or legacy book is outside a trade by description |
 * | `content` | **the disambiguation page** | *"I need ongoing content"* says nothing about purpose. FR-P24 does not name this segment and neither instrument's §1 resolves it, so it goes to the page that carries no operative clause and explains both. **This is a correct destination, not the closest one**: picking either instrument here would be the pre-26-August defect with an extra step. |
 *
 * `check:press:contact:selftest` breaks each of the four branches separately.
 */
export function pressSegmentTerms(segment: PressSegment) {
  if (segment === 'business') return CLIENT_TERMS_BUSINESS;
  if (segment === 'content') return CLIENT_TERMS_DISAMBIGUATION;
  return CLIENT_TERMS_CONSUMER;
}
