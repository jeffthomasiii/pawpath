# PawPath

**Pet-care preparedness for the road.**

PawPath is a mobile-friendly web application for campers, RV travelers, road-trippers, and other people traveling with pets. It helps travelers prepare veterinary care options before a trip and keep a Primary and Backup option accessible when care is needed away from home.

> Google Maps and Apple Maps help people find places. PawPath helps people traveling with pets make a care plan and act quickly when something goes wrong.

## Live proof of concept

[Open PawPath](https://jeffthomasiii.github.io/pawpath/)

The current proof of concept is a premium multi-page Progressive Web App hosted with GitHub Pages. It uses static HTML, CSS, and vanilla JavaScript; Leaflet and OpenStreetMap for mapping; Nominatim for place geocoding; Overpass for veterinary listings; and browser `localStorage` for one active care plan.

## Current user flow

### Plan a Trip

Enter a trip name and destination, plus optional dates, pet name, owner phone, and one brief important note. PawPath stores one active plan locally in the browser under `pawpath.activeCarePlan.v1`.

### Find Care Now

Search a city, ZIP code, campground/destination, or use the browser's current location. PawPath queries OpenStreetMap veterinary listings, maps nearby results, applies conservative care-type/confidence labels, and provides Call, Directions, and source links when data is available.

When a trip has been saved, an emergency/urgent listing can be selected as **Primary** and a distinct facility can be selected as **Backup**. PawPath intentionally reminds users to call ahead because hours, services, species accepted, emergency capability, and availability can change.

### Saved Plan

Review the trip and saved Primary/Backup facilities, use Call and Directions actions, edit the trip, return to care search, or clear the locally stored plan.

### Emergency Mode

When both Primary and Backup have been selected, Saved Plan can open a focused Emergency Mode. Normal navigation and unrelated planning content are removed so the saved care options, pet/traveler context, Call, and Directions actions are easier to reach.

### Resources

The Resources page contains travel-preparation and care-away-from-home guidance plus links to CDC pet travel information, USDA APHIS pet travel/state requirements, VECCS emergency/critical-care facility information, ASPCA Animal Poison Control, and PawPath Care Now.

## Why PawPath?

A general map search can show veterinary businesses, but a traveler still has to decide what to prepare, which option should be the first call, what the backup should be, and where those details will be during a stressful moment. PawPath is designed around that preparation-and-action gap rather than around generic place discovery.

The intended outcome is a saved pet-care plan for the trip, not simply a list of nearby veterinary businesses.

Read the complete positioning in [Why PawPath?](docs/WHY_PAWPATH.md).

## Active architecture

The current live entry points are:

```text
index.html                 Home/dashboard
plan/index.html            Trip essentials
care-now/index.html        Live care search, map, Primary/Backup selection
saved/index.html           Saved plan and Emergency Mode
resources/index.html       Preparedness resources
premium-pages.css          Shared premium layout and component system
premium-refinement.css     Current responsive/refinement layer
premium-shell.js           Shared iconography, route state, footer
pwa-nav.js                 PWA registration and canonical plan persistence
manifest.webmanifest       Installable PWA metadata
sw.js                      Conservative app-shell service worker
```

The repository also contains the earlier single-page implementation (`app.js`, `selection.js`, `care-plan.js`, `plan-summary.js`, `emergency-fallback.js`, mobile integration modules, and companion styles). Those files are retained as historical/reference implementation but are **not loaded by the premium multi-page entry points**. Do not infer live functionality from their presence alone.

The post-redesign reconciliation is documented in [Repository audit — September 16, 2026](docs/REPO_AUDIT_2026-09-16.md).

## Current limitations

- No backend, account system, cloud sync, or multi-plan storage
- One active care plan stored only in the current browser
- Clearing browser storage removes the saved plan
- Public OpenStreetMap/Nominatim/Overpass services are appropriate for this lightweight POC, not production-scale infrastructure
- Facility data can be incomplete, inconsistent, or outdated
- PawPath does not provide veterinary diagnosis or medical triage and does not guarantee facility availability
- No offline maps
- No automated browser-test suite
- The older 30-mile emergency fallback module, legacy facility-detail drawer, and legacy three-stage mobile Plan stepper are not currently wired into the premium multi-page pages

## Validation status

A repository/static reconciliation pass was completed after the premium PWA redesign. Browser-dependent behavior still needs deployed smoke testing for geolocation permissions, Nominatim/Overpass requests, Leaflet sizing, service-worker upgrades, mobile safe areas, remote imagery, and the complete Plan → Care Now → Primary/Backup → Saved → Emergency Mode flow.

Static review and browser validation are intentionally reported separately; the repository currently has no automated end-to-end browser suite.

## Roadmap

The current Phase 1 target remains **`v0.2 – Care Plan POC`**. Before moving farther into curated demonstration data, the printable emergency card, or shareable validation, the reconciled premium PWA should complete deployed smoke testing and the planned mobile screen-by-screen review.

See [Roadmap](docs/ROADMAP.md) and [Current State](docs/chatgpt-project/CURRENT_STATE.md) for the working product status.