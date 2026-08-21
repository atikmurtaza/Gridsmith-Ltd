import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { SANITY_DATASET, SANITY_PROJECT_ID } from './sanity/env';
import { schemaTypes } from './sanity/schemas';

/**
 * The Studio, run standalone on `localhost:3333` via `npm run studio` — **not mounted at a
 * Next route.** An embedded `/studio` would be a multi-megabyte client bundle inside the
 * application whose entire premise is a JS delta measured in kilobytes, and
 * `check-bundle-size` would have to grow an exemption for it. The editors are internal; a
 * local Studio and a Vercel-hosted one later are both cheaper than that exemption.
 *
 * The dataset comes from the same module the app reads, so the Studio cannot be pointed at
 * one dataset while the build reads another.
 */
export default defineConfig({
  name: 'gridsmith',
  title: 'Gridsmith',
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
