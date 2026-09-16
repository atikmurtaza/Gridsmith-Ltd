import { serviceRoute } from '@/components/content/servicePage';

/** `/press/services/[slug]` — see `components/content/servicePage.tsx`. GS-P04. */
const route = serviceRoute('press');

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
