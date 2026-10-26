import type { Metadata } from 'next';
import { DigitalHome } from '@/components/divisions/digital/DigitalHome';

export const metadata: Metadata = {
  title: 'Gridsmith Digital — websites, software, apps and connected workflows',
  description:
    'Websites, software, apps and connected workflows built around clear decisions and handoffs. Gridsmith Digital is a trading division of Gridsmith Ltd.',
};

export default function Page() {
  return <DigitalHome />;
}
