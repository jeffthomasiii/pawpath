# PawPath Current State

Last updated: September 16, 2026

## Live application

- Repository: `jeffthomasiii/pawpath`
- Default branch: `main`
- Live site: `https://jeffthomasiii.github.io/pawpath/`
- Hosting: GitHub Pages
- Current product shape: premium multi-page Progressive Web App proof of concept

## Active runtime architecture

The live entry points are now separate pages rather than the older single-page application:

- `/` — Home/dashboard
- `/plan/` — Plan a Trip
- `/care-now/` — Find Care Now
- `/saved/` — Saved Plan and Emergency Mode
- `/resources/` — preparedness resources

Shared active files are `premium-pages.css`, `premium-refinement.css`, `premium-shell.js`, `pwa-nav.js`, `manifest.webmanifest`, and `sw.js`, plus page-local JavaScript.

The older single-page modules (`app.js`, `selection.js`, `care-plan.js`, `plan-summary.js`, `emergency-fallback.js`, `mobile-app.js`, `mobile-app-sync.js`, `mobile-plan.js`, `map-layout-fix.js`, and companion styles) remain in the repository as historical/reference implementation. They are not loaded by the premium multi-page pages and must not be described as active simply because the files still exist.

See `docs/REPO_AUDIT_2026-09-16.md` for the reconciliation audit.

## Current implemented capabilities

### Plan a Trip

- Enter a trip name and destination
- Optionally save travel dates, pet name, owner phone, and one brief important note
- Save one active plan in browser `localStorage`
- Storage key remains `pawpath.activeCarePlan.v1`
- Canonical v1 data is nested under `trip`, `traveler`, and `facilities`
- Interim flat premium-PWA records are normalized when read
- Preserve existing facility selections when trip details are edited
- Carry the saved destination into Care Now

### Find Care Now

- Leaflet interactive map with OpenStreetMap tiles
- Nominatim place/ZIP/destination geocoding
- Browser geolocation through **Use my location**
- Overpass veterinary-facility search within roughly 10 miles (16 km)
- Distance-sorted facility results
- Conservative emergency / urgent / routine classification based on OpenStreetMap tags and listing names
- Confidence/call-ahead language when emergency capability is inferred or important listing details are missing
- Phone, Google Maps Directions, and OpenStreetMap source links when available
- Select a Primary facility only when the listing is classified as emergency or urgent
- Select a distinct Backup facility
- Persist both selections into the active care plan

### Saved Plan

- Review trip, pet, Primary, and Backup information
- Call and Directions actions for saved facilities when data is available
- Edit trip or return to care search
- Clear the saved plan with confirmation
- Explicit reminder that the plan exists only in the current browser

### Emergency Mode

- Available from Saved Plan when both Primary and Backup exist
- Hides normal navigation and unrelated planning content
- Presents saved Primary and Backup with immediate Call and Directions actions
- Keeps saved pet, owner phone, and important note visible when present
- Includes call-ahead language and does not diagnose or medically triage
- Provides explicit Exit Emergency Mode action

### Resources

- Travel preparation guidance
- Care-away-from-home guidance
- Links to CDC pet travel safety information
- Links to USDA APHIS pet travel and state requirements
- Link to VECCS emergency/critical-care facility information
- Link to ASPCA Animal Poison Control
- Direct route back to PawPath Care Now

### PWA/mobile shell

- Installable web-app manifest
- Conservative same-origin app-shell service worker
- Compact mobile header
- Persistent five-destination bottom navigation outside Emergency Mode
- Active-route icon state
- Safe-area-aware bottom navigation
- Mobile-condensed heroes, cards, controls, and spacing

## Important limitations

- No automated browser-test suite
- No backend, accounts, cloud synchronization, or multi-plan storage
- Public Nominatim, Overpass, and OpenStreetMap services are POC infrastructure, not production-scale dependencies
- Facility records can be incomplete, inconsistent, or outdated
- PawPath does not guarantee facility hours, services, species accepted, emergency capability, or availability
- Saved data is local to the current browser and can be lost when browser data is cleared
- No offline maps
- Remote hero imagery still requires network access
- The older conditional 30-mile emergency fallback implementation is not currently wired into the premium multi-page Care Now page
- The older facility-detail drawer and three-stage mobile Plan stepper are not currently wired into the premium multi-page pages

## Validation status

Repository/static review has been completed for the premium multi-page architecture. Browser-dependent behavior still requires deployed testing, especially Nominatim/Overpass requests, geolocation permissions, Leaflet resizing, service-worker upgrades, iPhone Safari/Android Chrome safe areas, and the complete Plan → Care Now → Primary/Backup → Saved → Emergency Mode flow.

Do not describe those items as browser-confirmed until that smoke test is completed.

## Phase 1 status

The current objective remains `v0.2 – Care Plan POC`. The active premium PWA again supports the core care-plan path: trip essentials, care search, Primary/Backup selection, saved-plan review, and focused Emergency Mode.

Before moving to curated demo data, printable emergency card, or shareable validation, complete the deployed smoke test and mobile screen-by-screen review so the reconciled architecture is verified on real phone browsers.

## Immediate next step

Run the deployed smoke-test matrix, then resume the mobile screen-by-screen review requested after the premium visual redesign.