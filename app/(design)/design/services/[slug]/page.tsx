import { serviceRoute } from '@/components/content/servicePage';

/** `/design/services/[slug]` — see `components/content/servicePage.tsx`. GS-P04. */
const route = serviceRoute('design');

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
