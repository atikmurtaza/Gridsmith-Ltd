import type { Metadata } from 'next';
import { PressHome } from '@/components/divisions/press/PressHome';

export const metadata: Metadata = {
  title: 'Gridsmith Press — writing, editorial, publishing and content',
  description:
    'We write, edit and prepare work for its intended readers and destinations, from books and reports to websites and ongoing content. A trading division of Gridsmith Ltd.',
};

/**
 * `/press` — owner-approved GS-PRESS-001-R3 visual direction, "The Publishing Desk".
 *
 * Copy is the GS-PRESS-001-B2 content lock. The previous rights block made absolute
 * ownership, ISBN and moral-rights claims the draft terms do not support; B2's qualified
 * wording replaces it inside `PressHome`, still linking the consumer clause
 * (`check:consumer-terms`). The Path Finder is deliberately not linked (B2: WITHHOLD).
 */
export default function Page() {
  return <PressHome />;
}
