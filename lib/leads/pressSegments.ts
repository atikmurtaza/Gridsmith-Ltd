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
