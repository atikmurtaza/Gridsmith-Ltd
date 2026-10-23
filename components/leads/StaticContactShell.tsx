/** Direct contact without website input collection or a delivery claim. */
import { Link } from '@/components/primitives/Link';
import { Prose } from '@/components/primitives/Prose';

export function StaticContactShell({ contactEmail }: {
  contactEmail: string; responseCommitment: string; expectationsStatement?: string | null;
}) {
  return (
    <aside data-static-contact-shell="" aria-label="Contact by email">
      <Prose>
      <p>To discuss your project, email{' '}
        <Link href={`mailto:${contactEmail}`}>{contactEmail}</Link>.</p>
      <p>You can also use the WhatsApp or text message links on this page.</p>
      </Prose>
    </aside>
  );
}
