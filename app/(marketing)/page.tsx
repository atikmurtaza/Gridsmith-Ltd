import { Heading } from '@/components/primitives/Heading';

// Placeholder. Real content is Epic N and comes from Sanity.
// The h1 is not decoration: a page without one fails axe `page-has-heading-one` and
// leaves screen reader users with no document title in the heading outline.
// `id="main"` is the skip link's target (M-02, closing A11Y-21); tabIndex={-1} so following
// the fragment moves focus, not only the scroll position. check-axe asserts it on every route.
export default function Page() {
  return (
    <main id="main" tabIndex={-1}>
      <Heading level={1}>Gridsmith Ltd</Heading>
    </main>
  );
}
