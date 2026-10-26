# GS-LAUNCH-016 — One-page owner decision sheet

25 October 2026. **Static build demonstrated; cutover HOLD. Preparation only.**

The supplied source `373c04b69a2bf9612b0807694f9d0d3262235c3a` passes local TypeScript/lint/static/build, all 69 bundle budgets, contact/legal HTTP checks and the production dependency audit. A 54-route export exists, but it is deny-all and nondeployable. Seven final legal pages, required acceptance and a safe replacement/recovery transaction remain outstanding. Full toolchain audit: nine high affected entries, requiring the existing security decision.

The Hostinger operator supplies one private operational receipt with these eight entries; existing evidence may be referenced. Do not put passwords, database exports or customer contents in Git.

- [ ] **Live root:** identify gridsmith.uk's exact site and absolute WordPress document root; do not assume `public_html`.
- [ ] **Database:** privately match that site's `wp-config.php` database name/host/table prefix to its database backup; no credentials in the receipt.
- [ ] **Separation:** record distinct temporary/staging roots and databases; none is the production target or rollback copy.
- [ ] **Writers:** identify current Git auto-deploy, scheduled jobs and external file writers; name the approved maintenance freeze and operator.
- [ ] **Backup:** identify matched complete files and database snapshots, times, hashes and private custody/download access.
- [ ] **Rollback:** record the old/new/failed paths, supported inverse switch and recovery evidence; agree post-snapshot-write handling and rollback window.
- [ ] **Static target:** verify the proposed sibling upload destination, capacity/permissions and required Apache-style rules/modules; preserve `.htaccess`, assets and 404/500 mapping. No upload yet.
- [ ] **DNS/email:** retain the complete zone/mail baseline and confirm this is a file/root replacement only; DNS, MX/SPF/DKIM/DMARC and Hostinger mailbox configuration remain untouched.

**Owner/release decisions:** resolve the existing direct-contact receipt, all-seven publication prerequisites/authority, toolchain risk decision and permitted Linux/publisher-safe acceptance job. Settled mailbox/WhatsApp facts are not being asked again; no historical-data questionnaire or unrelated provider correspondence is required. Unchanged legal texts need no new adoption.

**Go-live sequence:** operational receipt + permitted checks → genuinely cleared publication inputs → fresh production artifact with all seven legal pages → final artifact acceptance → separate exact-artifact upload/cutover/rollback approval → controlled switch and production smoke checks. The current rehearsal must never be promoted.

Optional analytics/reviews/forms, further optimisation and routine administration can follow launch under their existing controls. No release approval is requested or recorded by this sheet. Detailed evidence and ownership: [assessment](GS-LAUNCH-016.md); execution instructions: [runbook](GS-LAUNCH-016-HOSTINGER-RUNBOOK.md).
