# PawPath Current State

Last updated: September 16, 2026

## Live application

- Repository: `jeffthomasiii/pawpath`
- Default branch: `main`
- Live site: `https://jeffthomasiii.github.io/pawpath/`
- Hosting: GitHub Pages
- Product shape: premium multi-page Progressive Web App proof of concept

## Active runtime architecture

Entry points are `/`, `/plan/`, `/care-now/`, `/saved/`, and `/resources/`.

Shared premium runtime includes `premium-pages.css`, `premium-refinement.css`, `premium-decision-support.css`, `premium-shell.js`, `pwa-nav.js`, `premium-plan.js`, `premium-care.js`, `manifest.webmanifest`, and `sw.js`.

Older single-page modules remain in the repository as historical/reference implementations. The premium implementation reuses their product behavior where appropriate but does not load the old wrapper-heavy UI modules wholesale.

## Current implemented capabilities

### Plan a Trip

- Premium three-stage workflow: **Trip → Pet → Care plan**
- Mobile stages behave as focused app states rather than one long form
- Trip stage validates trip name, destination, and date order
- Pet stage stores pet name, owner phone, and one concise important travel note
- Care-plan stage carries the destination into Care Now and reviews Primary/Backup readiness
- One canonical active plan persists under `pawpath.activeCarePlan.v1`
- Existing facility selections are preserved when trip/pet details change

### Find Care Now

- Leaflet map, OpenStreetMap tiles, Nominatim geocoding, browser geolocation, and Overpass veterinary discovery
- Normal veterinary search is approximately 10 miles / 16 km
- Conservative emergency / urgent / routine classification based on source evidence
- Compact results open a premium facility decision sheet (mobile bottom sheet / desktop detail panel)
- Decision sheet shows source-supported address, phone, hours, website when available, distance, confidence explanation, OSM source, Call and Directions actions
- Primary/Backup selection occurs from the decision sheet and persists to the active plan
- Primary requires emergency/urgent evidence; Backup must be distinct
- If the normal search contains no emergency/urgent listing, PawPath automatically expands emergency discovery to 30 miles
- Expanded results are explicitly labeled and call-ahead language remains prominent
- If emergency/urgent care cannot be identified within 30 miles, PawPath provides an external emergency-veterinarian search action rather than implying availability

### Saved Plan and Emergency Mode

- Review trip, pet, Primary, and Backup information
- Call and Directions actions for saved facilities
- Clear/edit actions
- Emergency Mode prioritizes the saved Primary and Backup—the payoff of planning ahead—before live discovery is needed
- Focused Emergency Mode keeps concise pet/contact notes visible and does not diagnose or medically triage

### Resources

Curated travel-preparation and care-away-from-home guidance with links to CDC, USDA APHIS, VECCS, ASPCA Animal Poison Control, and PawPath Care Now.

### PWA/mobile shell

Installable manifest, conservative same-origin shell cache, compact header, safe-area-aware five-destination bottom navigation, active-route state, and condensed mobile layouts.

## Important limitations

- No automated browser-test suite
- No backend, accounts, cloud synchronization, or multi-plan storage
- Public Nominatim, Overpass, and OpenStreetMap services are POC infrastructure
- Facility data may be incomplete or outdated; PawPath does not guarantee hours, services, species accepted, emergency capability, or availability
- Saved data is local to the current browser
- No offline maps or offline live facility discovery
- Remote hero imagery requires network access
- Expanded emergency search depends on OpenStreetMap evidence and may fail to identify a facility even when one exists

## Validation status

Static/source contract review is required for every increment, but there is no automated browser suite. The premium three-stage Plan workflow, decision sheet, and 30-mile expanded emergency search require deployed mobile/desktop smoke testing before being described as browser-confirmed.

## Phase 1 status

The objective remains `v0.2 – Care Plan POC`. The active premium architecture now incorporates the useful behavior from the historical mobile Plan stepper, facility-detail drawer, and expanded emergency search as native premium components rather than reviving the old single-page presentation.

## Immediate next step

Smoke-test the complete deployed path—Plan stages → Care Now → facility details → Primary/Backup → Saved → Emergency Mode, including a location that triggers expanded emergency discovery—then resume the mobile screen-by-screen review.