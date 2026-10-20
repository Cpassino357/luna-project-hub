# Lunabotics Project ERP — prototype

Separate browser-based engineering project ERP for the 2027 UB Lunabotics robot.

## Run

Serve `dist/` with any static web server, for example `python -m http.server 8765 --directory dist`, then open http://localhost:8765. No build or package installation is required. GitHub Pages can serve the `dist` contents; alternatively move them into a Pages `/docs` folder.

## Included

- Eight units: Drivetrain, Chassis, Shoulder, Legs, Drum, Electronics, Misc, Documentation.
- Unit purchase/fabricate/assemble deadlines and individual documentation deadlines.
- Component catalog with separate per-unit requirements, drawings, revisions, suppliers, estimates, quantities, room locations, and parent assemblies.
- Consolidated purchasing by component identity, with unreleased demand warnings and earliest released unit purchase deadline.
- Partial purchase allocation by unit; confirmed purchase prices, tax and shipping; inventory and fabrication quantities.
- Expected cost = confirmed purchase cost plus estimated cost of remaining required quantities. Actual cost = confirmed purchases only. Assembly group labels do not add duplicate costs.
- Editable unit budget allocation, $3,000 team total, backup export/import.

## Data provenance and unresolved values

Initial data is transcribed from the supplied MASTER BUDGET.pdf and user corrections. All five Misc items are quantity one and received, totaling $164.95 before tax. Mechanical unit assignments are provisional. Mechanical items marked Received are imported as historical purchases; the hex shaft collar marked Hold remains Design. Verify supplier prices and receipt totals before operational use. The electrical bolt line is excluded because the line and summary conflict. Receipt tax, shipping, purchase dates, room locations, drawing links, and deadlines are unknown. No invented deadline or mechanical budget split is assigned. Electronics allocation is $600; Misc $300; the five mechanical units share an unallocated $2,100 pool.

## Prototype limits

Records live only in localStorage in the current browser and origin. This is not a shared database or a club production system. Export JSON backups regularly. Moving between local preview, GitHub Pages, and other hosting creates separate browser datasets; use export/import to transfer data. There is no authentication, multiuser synchronization, upload storage, revision approval audit trail, or immutable purchase ledger yet. Drawing attachments use HTTP(S) links. Assembly readiness is calculated from component quantities; welding completion is tracked through component stages rather than a standalone work order.

## Next implementation stage

Add a shared database, member permissions, server validation, file storage, explicit assembly/welding work orders, purchase amendments/returns, audit history, and receipt reconciliation before club-wide use.

## Validation

Run `node tests/logic.test.cjs` to verify consolidated purchasing, partial releases, allocation of purchased quantities, actual/expected cost arithmetic and missing estimates. Browser scenarios are in `tests/browser.cjs` (requires Playwright and a Chrome executable).
