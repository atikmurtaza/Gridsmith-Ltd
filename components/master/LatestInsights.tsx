import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Link } from '@/components/primitives/Link';
import { Section } from '@/components/primitives/Section';
import { PostList } from '@/components/content/PostList';
import { listPosts } from '@/lib/sanity/queries';
import styles from './master.module.css';

/**
 * Homepage block 8 — latest insights, three of them (`N-01`, `APP-FLOW.md` §2).
 *
 * Server Component, zero client JS.
 *
 * `APP-FLOW.md` gives this block the purpose "Authority", which is the one purpose a block can
 * fail at by being present: three placeholder articles do not demonstrate expertise, they
 * demonstrate that the section exists. So it **renders nothing at all when there are no posts**
 * rather than showing an empty state — an empty "Latest insights" heading on a homepage is worse
 * than no heading, and `PostList`'s empty state is right for `/insights`, where a visitor
 * arrived asking for articles, and wrong here, where they did not.
 *
 * Three, from the query's `[0...3]`, ordered by `publishedAt desc`.
 */
export async function LatestInsights() {
  const posts = await listPosts(3);
  if (posts.length === 0) return null;

  return (
    <Section labelledBy="insights">
      <Container>
        <div className={styles.blockIntro}>
          <Heading level={2} id="insights">
            Recent writing
          </Heading>
        </div>
        <PostList posts={posts} headingLevel={3} />
        <p className={styles.blockMore}>
          <Link href="/insights">All insights</Link>
        </p>
      </Container>
    </Section>
  );
}
