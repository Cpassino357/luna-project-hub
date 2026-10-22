# Lunabotics Cloud ERP

Engineering, purchasing, inventory, documentation and budget workspace for UB Lunabotics.

## Shared storage and sign-in

The hosted application uses Sites-managed ChatGPT sign-in and its private member allowlist. All authorized members share one workspace in the Sites-provisioned R2 bucket (`BUCKET`), not individual browser records. Cloud records persist independently of devices and application deployments. Membership is managed through the Site access policy. Signing in alone does not grant a new person membership. Never make the Site public to work around membership.

The first owner visit chooses either the master-budget starting records or the existing browser records. Existing local records are never uploaded automatically. You can also import a JSON backup after initialization. Import replaces the shared workspace and requires explicit confirmation. Export remains available for backups and unsaved drafts.

Each save is confirmed by the server. Reads refresh every ten seconds when a form is not being edited. Conditional storage writes reject stale revisions, including races between members. A failed save retains the draft on screen, stops further editing, and offers export/reload; connection failures also offer retry. No application records are written to localStorage. Old browser data is only read for optional migration.

## Run and test

Requires Node.js 20 or later, no dependencies for build/server tests:

```sh
node scripts/build.mjs
node tests/cloud.test.mjs
node tests/logic.test.cjs
node scripts/preview.mjs
```

Open http://127.0.0.1:8765. **The local preview injects a fake test identity and uses in-memory storage. It is not a production server and loses records when stopped.** Deploy the built Worker through Sites for managed sign-in and persistent R2 storage. `tests/browser-cloud.cjs` requires Playwright and Chrome and tests isolated sessions, shared records, conflict handling, and mobile layout.

Source UI files are in `web/`, server code in `worker/index.mjs`, and the build embeds assets into `dist/server/index.js`. Build output is tracked for the hosted deployment. `.openai/hosting.json` selects the existing Site and declares R2. The GitHub repository mirrors these sources under `erp-prototype/`; GitHub Pages alone cannot run the cloud server.

## Included workflow

Eight units: Drivetrain, Chassis, Shoulder, Legs, Drum, Electronics, Misc, Documentation. Unit purchase/fabricate/assemble deadlines; individual documentation deadlines; component catalog, per-unit requirements, linked drawings/revisions, suppliers, estimates, inventory locations, fabrication quantities and parent assemblies. Purchasing groups released requirements by component identity and flags unreleased demand. Expected costs include design quantities and actual purchase costs; actual costs include confirmed purchases only. No assembly cost double-counting.

## Initial data and outstanding reconciliation

Initial records come from MASTER BUDGET.pdf and the owner's corrections. Five Misc items are received, quantity one, $164.95 before tax. Mechanical unit assignments are provisional. Mechanical items marked Received are historical purchases; the hex shaft collar on Hold remains Design. The electrical bolt row is excluded because its log and summary conflict. Verify prices and receipt totals. Tax, shipping, dates, room locations, drawing links and deadlines remain unknown where not supplied. The team budget is $3,000: $600 Electronics, $300 Misc, and $2,100 awaiting allocation among five mechanical units.

## Current limits

Drawings use links, not uploaded files. Welding readiness groups components by parent assembly; dedicated welding work orders and roles within the ERP are future work. Authorized members currently have equal editing access. Purchase amendments, returns, full audit history and automated historical backups are not yet included. Server validation enforces component references, quantities, budgets, links, and purchase consistency. Keep periodic JSON exports.
