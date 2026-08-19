import { companyDetails } from './companyDetails.ts';
import { continuityExample, continuityRow } from './continuityExample.ts';
import { coreDocumentTypes } from './documents.ts';
import { groupPage, groupSection } from './groupPage.ts';
import { objectTypes } from './objects.ts';

/**
 * **One schema folder, shared by both datasets — never two.** `development` and `production`
 * differ in their content, not in their shape; a second schema is how the two drift until
 * seed content stops being a preview of live content.
 *
 * Ordered objects-first only for readability — Sanity resolves the registry as a set, so a
 * document type may reference an object declared after it.
 *
 * **Nothing in `next build` compiles this file.** The Studio is a separate application and
 * the app reads Sanity over HTTP, so a broken schema — a typo in a `type:`, a reference to a
 * document type that does not exist, a missing `isSeed` — fails for an editor and for no
 * gate. `scripts/check-schemas.mjs` is what closes that.
 */
export const schemaTypes = [
  ...objectTypes,
  groupSection,
  continuityRow,
  ...coreDocumentTypes,
  groupPage,
  continuityExample,
  companyDetails,
];
