import type { ReactNode } from 'react';
import { spanLink } from '@/lib/content/portableLinks';
import type { PortableBlock } from '@/lib/sanity/queries';

/**
 * Portable Text, rendered by hand.
 *
 * **`@portabletext/react` is not a dependency and is not being added.** It is ~4KB gz of a
 * general-purpose renderer, and every route in this programme is budgeted on the JS it adds
 * above the framework floor — Digital's allowance is 15KB in total. What the CMS produces here is
 * `block` with `normal`/`h3`/`h4` styles, spans, and — since `GS-SEO-001` (`GS-PROD-006-S4`) —
 * `link` annotations. When another shape is needed, the honest move is to add its case below,
 * not to import a library to handle cases we do not have. Lists are still rendered as
 * paragraphs; no current content uses them.
 *
 * Server Component, zero client JS.
 *
 * A link is a plain `<a>` so `Prose`'s own link styling applies; an external one opens in a new
 * tab and says so, as `components/primitives/Link.tsx` does. Which annotations become links, and
 * why everything else stays plain text, is `lib/content/portableLinks.ts`.
 *
 * A block whose style is not handled renders as a paragraph rather than disappearing: content
 * silently vanishing is the worst failure available to a CMS renderer, because the editor sees
 * a saved document and an empty page and has nothing to report.
 */
function inline(block: PortableBlock): ReactNode[] {
  return (block.children ?? []).map((span, i) => {
    const text = span.text ?? '';
    const link = text ? spanLink(span, block.markDefs) : null;
    if (!link) return text;
    const key = span._key ?? `s${i}`;
    return link.external ? (
      <a key={key} href={link.href} target="_blank" rel="noopener noreferrer">
        {text}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    ) : (
      <a key={key} href={link.href}>
        {text}
      </a>
    );
  });
}

export function Blocks({ value }: { value: PortableBlock[] | null | undefined }) {
  if (!value || value.length === 0) return null;
  return (
    <>
      {value.map((block, i) => {
        const text = (block.children ?? []).map((c) => c.text ?? '').join('');
        if (!text) return null;
        const k = block._key ?? `b${i}`;
        const content = inline(block);
        if (block.style === 'h3') return <h3 key={k}>{content}</h3>;
        if (block.style === 'h4') return <h4 key={k}>{content}</h4>;
        if (block.style === 'blockquote') return <blockquote key={k}><p>{content}</p></blockquote>;
        return <p key={k}>{content}</p>;
      })}
    </>
  );
}
