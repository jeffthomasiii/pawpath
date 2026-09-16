# PawPath Current State

Last updated: September 16, 2026

## Live application

Repository: `jeffthomasiii/pawpath`. GitHub Pages hosts the premium multi-page PWA at `https://jeffthomasiii.github.io/pawpath/`. Entry points are `/`, `/plan/`, `/care-now/`, `/saved/`, and `/resources/`.

## Active architecture

Shared premium runtime includes `premium-pages.css`, `premium-refinement.css`, `premium-decision-support.css`, `premium-shell.js`, `pwa-nav.js`, `premium-plan.js`, `premium-care.js`, `manifest.webmanifest`, and `sw.js`. Older single-page modules remain historical/reference implementations and are not loaded wholesale.

## Current capabilities

### Plan a Trip

- Three-stage **Trip → Pets → Care plan** workflow.
- Supports 1–5 traveling pets.
- Each pet stores a name, species, concise medications, allergies, and important care note.
- Owner phone remains trip-level contact information.
- Existing single-pet plans are normalized into Pet 1; facility selections are preserved.
- One active plan remains under `pawpath.activeCarePlan.v1`; the storage key did not change.

### Find Care Now

- Leaflet/OpenStreetMap map, Nominatim geocoding, browser geolocation, and Overpass veterinary discovery.
- Normal search approximately 10 miles; automatic emergency/urgent expansion to 30 miles when needed.
- Results visibly distinguish **Emergency care**, **Urgent care**, and **General veterinary care · emergency unknown** before a facility is opened.
- Map markers use the same care distinction.
- Facility decision sheet provides source/provenance, address, phone, hours, Call, Navigate, website/source when available, and Primary/Backup controls.
- Primary requires emergency/urgent evidence; Backup must be distinct.
- When the 30-mile search still cannot identify emergency/urgent care, PawPath explicitly says both search ranges were checked and that OSM evidence may be incomplete.
- That unresolved state offers a Maps emergency-veterinarian search plus **Add facility manually**.
- Manual facilities store user-entered name/address/phone/website and require the traveler to affirm that emergency/urgent capability was confirmed directly. They are stored with `source: User-added` and `confidence: user-confirmed`; PawPath does not present that confirmation as OSM/PawPath verification.

### Saved Plan / Emergency Mode

- Shows all traveling pets and their individual medication/allergy/care notes.
- Primary and Backup retain provenance/care type and prominent **Call** and **Navigate** actions.
- Emergency Mode prioritizes the saved Primary and Backup and removes normal navigation.

### Resources

- Curated CDC, USDA APHIS, VECCS, ASPCA, and PawPath care links remain.
- Desktop Resources is a compact four-panel dashboard designed to expose the core checklist, official guidance, care resources, and away-from-home reminders within a normal desktop viewport rather than a long card stack.
- Mobile retains a single-column condensed layout.

### Premium shell

- Desktop header/navigation now use the forest surface rather than detached white/pale chrome.
- Desktop footer is reduced to compact brand/navigation chrome; mobile continues to hide the footer in favor of persistent bottom navigation.

## Important limitations

- No automated browser-test suite.
- No backend, accounts, cloud synchronization, or multi-plan storage.
- Public Nominatim, Overpass, and OpenStreetMap services are POC infrastructure and can be incomplete/outdated.
- PawPath does not guarantee hours, services, species accepted, emergency capability, or availability.
- User-confirmed manual facilities are traveler-supplied information, not independently verified by PawPath.
- Saved data remains local to the current browser.
- No offline maps/live facility discovery.
- Remote hero imagery requires network access.

## Validation status

Static/source review is part of each increment, but browser-dependent behavior must still be smoke-tested after deployment. The priority validation scenario is the Big Bear/Serrano Campground trip: multi-pet persistence, visible care classification, 10→30-mile messaging, external Maps handoff/manual facility return path, Primary/Backup persistence, Saved Plan, Navigate actions, and Emergency Mode.

## Phase 1 / next step

The objective remains `v0.2 – Care Plan POC`. Complete deployed smoke testing of this care-planning refinement, then resume the mobile screen-by-screen review before advancing to curated demo data or the printable emergency card.