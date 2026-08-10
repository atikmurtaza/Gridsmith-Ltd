import { Heading } from '@/components/primitives/Heading';

// Placeholder. Real content is Epic B and comes from Sanity.
// The h1 is not decoration: a page without one fails axe `page-has-heading-one` and
// leaves screen reader users with no document title in the heading outline.
export default function Page() {
  return (
    <main>
      <Heading level={1}>Gridsmith Design</Heading>
    </main>
  );
}
