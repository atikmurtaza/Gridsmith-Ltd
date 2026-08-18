import { companyDetails } from './companyDetails';

/**
 * **One schema folder, shared by both datasets — never two.** `development` and
 * `production` differ in their content, not in their shape; a second schema is how the two
 * drift until seed content stops being a preview of live content.
 */
export const schemaTypes = [companyDetails];
