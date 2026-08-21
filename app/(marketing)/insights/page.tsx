import type { Metadata } from 'next';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { PostList } from '@/components/content/PostList';
import { listPosts } from '@/lib/sanity/queries';

export const metadata: Metadata = {
  title: 'Insights — Gridsmith Ltd',
  description: 'Writing from Gridsmith Design, Gridsmith Digital and Gridsmith Press.',
};

/**
 * `/insights` — the hub (`N-13`).
 *
 * Server Component, zero client JS. No category filter: the taxonomy is `division` and there
 * are three of them, so a filter control would be three links doing what three links already do
 * on the cards. It arrives when the volume justifies it.
 */
export default async function Page() {
  const posts = await listPosts();

  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container>
          <Heading level={1}>
            Insights
          </Heading>
          <Prose>
            <p>
              Writing about the work — how a drawing gets quoted, what an integration costs once
              you count the evaluation, why keeping your own ISBN matters two years later.
            </p>
          </Prose>
        </Container>
      </Section>
      <Section>
        <Container>
          <PostList posts={posts} headingLevel={2} />
        </Container>
      </Section>
    </main>
  );
}
