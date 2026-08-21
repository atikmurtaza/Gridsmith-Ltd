import type { PortableBlock } from '@/lib/sanity/queries';

/**
 * Portable Text, rendered in about fifteen lines.
 *
 * **`@portabletext/react` is not a dependency and is not being added.** It is ~4KB gz of a
 * general-purpose renderer, and every route in this programme is budgeted on the JS it adds
 * above the framework floor — Digital's allowance is 15KB in total. What the CMS actually
 * produces here is `block` with `normal`/`h3`/`h4` styles and spans; marks, lists, custom types
 * and annotations are not used by any seeded or drafted document. When one of them is needed,
 * the honest move is to add the case below, not to import a library to handle six cases we do
 * not have.
 *
 * Server Component, zero client JS.
 *
 * A block whose style is not handled renders as a paragraph rather than disappearing: content
 * silently vanishing is the worst failure available to a CMS renderer, because the editor sees
 * a saved document and an empty page and has nothing to report.
 */
export function Blocks({ value }: { value: PortableBlock[] | null | undefined }) {
  if (!value || value.length === 0) return null;
  return (
    <>
      {value.map((block, i) => {
        const text = (block.children ?? []).map((c) => c.text ?? '').join('');
        if (!text) return null;
        const k = block._key ?? `b${i}`;
        if (block.style === 'h3') return <h3 key={k}>{text}</h3>;
        if (block.style === 'h4') return <h4 key={k}>{text}</h4>;
        if (block.style === 'blockquote') return <blockquote key={k}><p>{text}</p></blockquote>;
        return <p key={k}>{text}</p>;
      })}
    </>
  );
}
