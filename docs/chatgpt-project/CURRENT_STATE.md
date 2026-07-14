# PawPath Current State

Last updated: July 2026

## Live application

- Repository: `jeffthomasiii/pawpath`
- Default branch: `main`
- Live site: `https://jeffthomasiii.github.io/pawpath/`
- Hosting: GitHub Pages

## Current implemented capabilities

### Mapping and search

- Leaflet interactive map
- OpenStreetMap tiles and facility records
- Nominatim destination geocoding
- Overpass veterinary-facility queries
- Search by city, state, ZIP code, campground, or destination text supported by Nominatim
- Browser geolocation through **Use my location**
- Normal nearby search area of approximately 7.5 miles
- Conditional emergency fallback search up to 30 miles when no emergency or urgent-care listing appears nearby
- Explicit unresolved state when OpenStreetMap cannot identify an emergency facility
- External Google Maps links for Directions and emergency search

### Product modes

- **Plan a Trip**
  - destination-oriented search language
  - trip-plan editor
  - Primary and Backup selection controls
  - save and update one active care plan
- **Find Care Now**
  - immediate-care language
  - current-location emphasis
  - planning editor and selection controls hidden
- Saved-plan summary includes an emergency-focused transition, but the full Emergency Mode workflow remains the next major increment.

### Facility evaluation

- Facility details from cards and map markers
- Emergency, urgent, routine, or unknown classification
- Confidence states such as source-listed, likely emergency, and needs confirmation
- Honest handling of missing phone, hours, website, and source details
- OpenStreetMap source disclosure
- Call-ahead safety language

### Care-plan selection

- One Primary emergency or urgent-care facility
- One distinct Backup facility
- Replace, move, view, and remove behavior
- Selection indicators on cards, map markers, details, and summary

### Active care-plan persistence

- Storage key: `pawpath.activeCarePlan.v1`
- One active plan in browser `localStorage`
- Schema version, ID, created timestamp, and updated timestamp
- Trip name and destination
- Optional travel dates
- Optional pet name, owner phone, and brief important note
- Stored Primary and Backup facility snapshots
- Restore after refresh
- Validation and safe removal of malformed or unsupported stored data
- Confirmed Clear Plan action
- No backend or account

### Persistent saved-plan summary

- Appears when a valid saved plan exists
- Trip name, destination, dates, pet, and updated time
- Visually distinct Primary and Backup cards
- Call actions where phone data exists
- Directions actions
- Edit Plan and Clear Plan
- Open Emergency Mode action
- Responsive desktop and mobile presentation
- Cross-tab storage update handling

### Approved brand system

- Product category: **Pet-care preparedness for the road**
- Brand promise: **Travel with a care plan**
- Creative direction: **Trail guide, not alert siren**
- Established PawPath mark and wordmark remain the approved identity
- Muted Pine, Sage, Mist, Stone, Amber, Ink, and restrained Danger palette
- Open layout for orientation and explanatory content
- Selective light cards for saved plans, decisions, details, and urgent information
- List-row treatment for scan-heavy facility results
- Modest rounding, minimal shadows, and color reserved for meaningful emphasis
- Durable guidance is documented in `docs/BRAND_GUIDE.md`
- `brand-refresh.css` provides the focused visual alignment layer without changing application behavior

## Current Phase 1 roadmap status

Completed:

- POC-01: Plan a Trip and Find Care Now modes
- POC-02: Facility detail and confidence states
- POC-03: Primary and Backup selection
- POC-04: Persistent active care plan
- POC-05: Persistent saved-plan summary

Next:

- POC-06: Full Emergency Mode

Remaining after Emergency Mode:

- POC-07: Curated demonstration data
- POC-08: Printable emergency card
- POC-09: Shareable POC validation

## Important GitHub references

- Phase 1 tracker: Issue #13
- Full Emergency Mode: Issue #9
- Curated demo data: Issue #10
- Printable emergency card: Issue #11
- Shareable POC validation: Issue #12
- Brand alignment: Issue #24

## Technical architecture

The proof of concept is a static application with no bundler or module system. JavaScript files share global state and several later files wrap functions defined by earlier files. Script order is therefore significant.

Current major files include:

- `index.html`
- `styles.css`
- `site-fixes.css`
- `selection.css`
- `care-plan.css`
- `emergency-fallback.css`
- `brand-refresh.css`
- `plan-summary.css`
- `leaflet-local.css`
- `app.js`
- `emergency-fallback.js`
- `selection.js`
- `care-plan.js`
- `plan-summary.js`
- `map-layout-fix.js`

## Known limitations and risks

- No automated browser-test suite
- No build or lint process
- Public OpenStreetMap services are not production-scale infrastructure
- Facility data may be incomplete, inconsistent, or outdated
- Emergency capability is often inferred because source records lack explicit tags
- Saved data exists only in the current browser
- Clearing browser storage removes the plan
- No offline map support yet
- No user accounts, cloud sync, or multi-plan storage
- Several modules wrap global functions; careless script-order changes can break behavior
- Browser geolocation and remote API behavior require deployed or local-server testing
- Brand-layer visual behavior still requires deployed desktop and mobile browser review

## Immediate implementation objective

Build a full Emergency Mode that is clearly different from ordinary Find Care Now. It should prioritize the saved Primary and Backup facilities, immediate Call and Directions actions, current-location relevance, and a minimal decision path during a stressful situation.
