/** H4-A technical artifact only. No Server Action, input collection or success claim. */
import { Link } from '@/components/primitives/Link';
import { Prose } from '@/components/primitives/Prose';

export function StaticContactShell({ contactEmail }: {
  contactEmail: string; responseCommitment: string; expectationsStatement?: string | null;
}) {
  return (
    <aside data-static-contact-shell="" aria-label="Technical preview enquiry notice">
      <Prose>
      <p>Enquiry submissions are unavailable in this local technical preview.</p>
      <p>No information is collected here. The website’s contact address is{' '}
        <Link href={`mailto:${contactEmail}`}>{contactEmail}</Link>.</p>
      </Prose>
    </aside>
  );
}
