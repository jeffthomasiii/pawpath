# Repository audit — September 16, 2026

## Purpose

This audit was performed after the premium multi-page/PWA redesign and before further mobile screen-by-screen refinement. It compares the active `main` entry points with the older single-page modules still present in the repository and records what is actually wired into the live-site architecture.

## Critical finding

The premium multi-page conversion changed the active runtime architecture rather than only changing presentation. `index.html`, `plan/index.html`, `care-now/index.html`, `saved/index.html`, and `resources/index.html` now use `premium-pages.css`, `premium-refinement.css`, `premium-shell.js`, `pwa-nav.js`, and page-local JavaScript.

The older single-page modules (`app.js`, `selection.js`, `care-plan.js`, `plan-summary.js`, `emergency-fallback.js`, `mobile-app.js`, `mobile-app-sync.js`, `mobile-plan.js`, `map-layout-fix.js`, and their companion styles) remain in the repository for reference but are not loaded by the premium multi-page entry points. Documentation written before that conversion therefore overstated live capabilities.

A second regression was found in persistence: the first premium Plan page wrote a flat object into `pawpath.activeCarePlan.v1`, while the established v1 schema is nested under `trip`, `traveler`, and `facilities`. This audit reconciles the premium PWA with that canonical schema and migrates the interim flat shape when it is read.

## Active architecture after reconciliation

- `/` — premium Home/dashboard and saved-plan summary
- `/plan/` — trip essentials editor using canonical `pawpath.activeCarePlan.v1`
- `/care-now/` — Leaflet map, Nominatim geocoding, browser geolocation, Overpass veterinary search, conservative care classification, Primary/Backup selection, Call/Directions/source links
- `/saved/` — canonical saved-plan review, Primary/Backup actions, Clear Plan, and focused Emergency Mode
- `/resources/` — curated preparedness guidance and external authoritative resources
- `premium-shell.js` — shared iconography, current-route state, footer
- `pwa-nav.js` — shared PWA registration and canonical care-plan persistence helpers
- `sw.js` — conservative app-shell service worker

## Static functionality review

### Navigation and PWA shell

Confirmed by source review: route-relative links are consistent, each page supplies `pawpath-base`, manifest paths are in scope for GitHub Pages, active navigation is assigned from `body[data-page]`, and the service worker is registered relative to the application base.

### Plan a Trip

Confirmed by source review: trip name and destination are required; optional dates, pet name, owner phone, and important note are stored in the canonical v1 object. End-before-start dates are rejected. Existing Primary/Backup snapshots are preserved when trip details are edited. The care link carries the destination into Care Now.

### Find Care Now

Confirmed by source review: text search uses Nominatim; current-location search uses browser geolocation; veterinary listings use Overpass; Leaflet displays the search area and returned facilities; results include distance, phone when available, Directions, OpenStreetMap source, and confidence/call-ahead language. Primary selection is restricted to listings classified as emergency or urgent; Backup may be another listing; the same facility cannot fill both roles. Selections persist into the canonical care plan.

### Saved Plan and Emergency Mode

Confirmed by source review: Saved Plan reads the canonical schema, displays trip/pet context and Primary/Backup facilities, exposes Call and Directions when available, can clear the plan with confirmation, and exposes Emergency Mode only when both selections exist. Emergency Mode removes normal navigation and unrelated planning content and keeps the saved Primary/Backup actions prominent.

### Resources

Confirmed by source review: the Resources page contains PawPath-specific travel preparation guidance plus links to CDC pet travel safety, USDA APHIS pet travel/state requirements, VECCS emergency/critical-care facility information, ASPCA Animal Poison Control, and PawPath Care Now. PawPath continues to state that it is not veterinary diagnosis or triage.

## Historical modules retained but not active

The repository still contains the pre-PWA single-page implementation. It is intentionally not described as the active runtime. These files remain useful reference material while the premium PWA reaches feature parity, but loading both architectures together would create conflicting globals and DOM assumptions.

Not currently active in the premium pages: legacy facility detail drawer, the older conditional 30-mile emergency fallback module, the older three-stage mobile Plan stepper, the older single-page Results/Map switcher, and the older plan-summary module. Their presence in the repository does not mean those exact implementations are live.

## Validation boundary

This pass is a static source and repository validation, not a claim of full browser execution. The repository has no automated browser-test suite, and this environment cannot execute the deployed GitHub Pages UI. The following still require deployed browser validation before being called browser-confirmed:

- Nominatim and Overpass responses/CORS/rate behavior
- browser geolocation permission paths
- Leaflet sizing after navigation and on small phones
- service-worker update behavior for an already installed PWA
- iPhone Safari and Android Chrome safe-area/bottom-nav behavior
- external hero image loading/cropping
- full Plan → Care Now → Primary/Backup → Saved → Emergency Mode interaction with real facility results

## Result

The premium PWA now has one documented active architecture and one canonical local-storage schema. The next work should be deployed smoke testing and the requested mobile screen-by-screen review, rather than adding another presentation layer before the active flow is verified.