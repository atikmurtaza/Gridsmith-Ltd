/** GS-R002 narrow development-only patch. No reseed, delete, production endpoint or schema change.
 * Default is dry-run. Revision preconditions prevent overwriting concurrent editorial work.
 */
import { createClient } from "@sanity/client";
import { SERVICES } from "./service-content.mjs";

const client = createClient({
  projectId: "spzu6y31",
  dataset: "development",
  apiVersion: "2026-01-01",
  useCdn: false,
  token: process.argv.includes("--apply")
    ? process.env.SANITY_API_WRITE_TOKEN
    : undefined,
});
const slugs = ["gaming-and-streamer-creative", "motion-graphics"];
const ids = slugs.map((s) => `seed-service-design-${s}`);
const docs = await client.fetch(
  "*[_id in $ids]{_id,_rev,_type,division,isSeed,slug,capabilityGroup,deliverables}",
  { ids },
);
if (docs.length !== 2)
  throw new Error("Expected exactly two existing Design development records");
let transaction = client.transaction();
for (const doc of docs) {
  const row = SERVICES.design.find(
    (r) => `seed-service-design-${r.slug}` === doc._id,
  );
  if (
    !row ||
    doc.division !== "design" ||
    doc.isSeed !== true ||
    doc._type !== "service" ||
    doc.capabilityGroup !== row.group
  )
    throw new Error("Identity/provenance mismatch");
  const deliverables = row.deliverables.map(
    ([label, detail, included = true], i) => ({
      _type: "deliverable",
      _key: `k${i}`,
      label,
      detail,
      included,
    }),
  );
  console.log(
    `${doc._id}: ${doc.deliverables.length} -> ${deliverables.length} deliverables; development only`,
  );
  transaction = transaction.patch(doc._id, (p) =>
    p.ifRevisionId(doc._rev).set({ deliverables }),
  );
}
if (process.argv.includes("--apply")) {
  if (!process.env.SANITY_API_WRITE_TOKEN)
    throw new Error("Missing write credential");
  await transaction.commit();
  console.log(
    "Applied two revision-guarded deliverable patches to spzu6y31/development.",
  );
} else console.log("DRY RUN: nothing written.");
