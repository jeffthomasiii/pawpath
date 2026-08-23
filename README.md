# PawPath

**Pet-care preparedness for the road.**

PawPath is a mobile-friendly web application for campers, RV travelers, road-trippers, and other people traveling with pets. It is being developed to help users identify, evaluate, and save veterinary and emergency-care options near a destination before care is needed.

> **Google Maps and Apple Maps help people find places. PawPath helps people traveling with pets make a care plan and act quickly when something goes wrong.**

## Live proof of concept

[Open PawPath](https://jeffthomasiii.github.io/pawpath/)

The proof of concept now presents two functionally distinct workflows. **Plan a Trip** lets users enter trip details, choose Primary and Backup facilities, and save one active care plan locally in the browser. At phone widths, Plan now uses a three-stage guided workflow — **Trip & pet → Choose care → Review & save** — so the editor, selections, results, and map are not exposed as one long continuous page. **Find Care Now** hides the planning form and focuses on immediate nearby-care search. A saved plan can also open **Emergency Mode**, which removes unrelated planning and map controls, presents the saved Primary facility first with immediate Call and Directions actions, keeps the Backup directly below, and shows saved pet and owner details with call-ahead guidance. When the normal nearby search contains no emergency or urgent-care option, PawPath also checks a 30-mile fallback radius and either adds the nearest qualifying listing or clearly explains that OpenStreetMap could not identify one.

## Why PawPath?

A general map search can show nearby veterinary businesses, but travelers still have to determine:

- Which facility provides routine, urgent, or emergency care
- Whether the information is current or incomplete
- Which facility should be the primary option
- What the backup option should be
- How far care is from a campground or destination
- What number to call before driving
- Where essential pet information will be during an urgent situation
- What should be saved before entering an area with weak connectivity

PawPath is designed around that missing planning and emergency-readiness workflow.

**The intended outcome is not simply a map search. The intended outcome is a saved pet-care plan for the trip.**

Read the complete positioning in [Why PawPath?](docs/WHY_PAWPATH.md).

## Product direction

PawPath is organized around two core experiences:

### Plan a Trip

Search around a campground, destination, ZIP code, or overnight stop; enter trip and pet details; choose a Primary facility and Backup; and save the essential information before leaving. On mobile, the workflow is progressive: complete trip details, choose care, then review and save.

### Find Care Now

Use the current location to prioritize likely emergency-care options and quickly access call, directions, backup, and saved pet-information actions without showing the trip-planning form.

### Emergency Mode

Open the saved care plan as a focused call-and-go view. The Primary facility appears first with large Call and Directions actions, the Backup remains immediately available, and saved pet and owner information stays visible without returning to search.

## Current capabilities

- Switch between Plan a Trip and Find Care Now modes
- Use a phone-only app shell with compact header and persistent Plan / Care Now / Saved navigation
- Use a guided three-stage mobile Plan workflow with one active stage at a time
- Collapse completed mobile Plan stages into concise summaries without discarding entered data
- Reveal Results / Map only during the mobile Choose care stage
- Review trip and Primary / Backup choices before mobile save/update
- Show a trip-plan editor only in Plan a Trip mode
- Save one active care plan to browser `localStorage` using `pawpath.activeCarePlan.v1`
- Store a trip name, destination, optional dates, pet name, owner phone, and one brief important note
- Save and restore Primary and Backup facility snapshots after a full page refresh
- Validate stored schema and fail safely when stored data is malformed or unsupported
- Automatically update a saved plan when trip details or facility choices change
- Clear the saved plan and selections with confirmation
- Keep saved plan data entirely in the browser without an account or backend
- Show a persistent saved-plan summary with trip details, Primary, Backup, Call, Directions, Edit, Clear, and Open Emergency Mode actions
- Open a focused Emergency Mode from a valid saved plan
- Present the Primary facility first with large Call and Directions actions
- Keep the Backup facility immediately below without requiring another search
- Show saved pet name, owner phone, and important note in Emergency Mode
- Hide search, filters, planning controls, and map exploration while Emergency Mode is active
- Exit Emergency Mode explicitly or with Escape, with keyboard focus restored appropriately
- Use destination-focused search language and actions for trip preparation
- Emphasize current-location access for immediate nearby-care searches
- Search a 30-mile fallback radius for the nearest emergency or urgent-care option only when none appears in the normal nearby results
- Open the same facility-detail experience from a result card or map marker
- Classify facilities conservatively as emergency, urgent, routine, or unknown
- Show confidence states and plain-language explanations without relying only on color
- Display missing information, OpenStreetMap source links, and call-ahead guidance honestly
- Select one emergency or urgent-care facility as the Primary option
- Select a distinct facility as the Backup option
- Replace, move, view, or remove Primary and Backup selections
- Show selected roles in the care-plan summary, facility cards, map markers, and facility details
- Search by U.S. city, state, or ZIP code
- Use browser geolocation to search near the current position
- View veterinary clinics on an interactive Leaflet map
- Filter results between all care, emergency, and routine clinics
- Open driving directions without embedding a paid map service
- Responsive desktop, tablet, and mobile layouts
- Keyboard-accessible mode controls, mobile planning steps, search controls, cards, selections, forms, detail drawer, saved-plan actions, Emergency Mode, and map markers
- PawPath branded header and favicon

## Next proof-of-concept capabilities

The remaining `v0.2 – Care Plan POC` work will add:

- Curated demonstration data for one or two transparent example destinations
- Printable emergency card
- Shareable POC validation and two-minute demo testing

See [Proof-of-Concept Scope](docs/POC_SCOPE.md) and [Roadmap](docs/ROADMAP.md).

## Active development

Phase 1 work is tracked in the [`v0.2 Care Plan POC` tracking issue](https://github.com/jeffthomasiii/pawpath/issues/13), with one issue for each feature package and its acceptance criteria.

The next implementation task is [POC-07: Add curated demonstration data](https://github.com/jeffthomasiii/pawpath/issues/10).

## Product documentation

- [Documentation Index](docs/README.md) — recommended reading order
- [Why PawPath?](docs/WHY_PAWPATH.md) — product distinction, audience, value proposition, and messaging
- [Product Vision](docs/PRODUCT_VISION.md) — mission, users, jobs to be done, principles, and success criteria
- [Proof-of-Concept Scope](docs/POC_SCOPE.md) — required capabilities and acceptance criteria for the shareable POC
- [Roadmap](docs/ROADMAP.md) — phased product and development plan
- [Phase 1 Backlog](docs/BACKLOG.md) — prioritized POC work packages
- [Phase 1 Release Plan](docs/PHASE_1_RELEASE_PLAN.md) — increments, release gate, and manual checklist
- [Implementation Notes](docs/IMPLEMENTATION_NOTES.md) — data objects, state model, storage, confidence logic, and file guidance
- [Mobile Web App](docs/MOBILE_WEB_APP.md) — mobile application-shell direction and constraints
- [Demo Script](docs/DEMO_SCRIPT.md) — two-minute walkthrough and early-user feedback questions

## Technologies

- HTML
- CSS
- JavaScript
- [Leaflet 1.9.4](https://leafletjs.com/) for the interactive map
- [OpenStreetMap](https://www.openstreetmap.org/) map tiles and clinic data
- [Nominatim](https://nominatim.org/) for destination geocoding
- [Overpass API](https://overpass-api.de/) for nearby veterinary-facility queries
- Browser `localStorage` for the active care plan

PawPath does not require a Google Maps API key. Google Maps is currently used only as an external destination for the **Directions** and emergency-search links.

## Project structure

```text
pawpath/
├── assets/                  # PawPath logo and brand assets
├── docs/                    # Product vision, POC scope, roadmap, backlog, and demo documentation
├── index.html               # Semantic application layout
├── styles.css               # Core responsive design system and components
├── site-fixes.css           # Map, brand, mode, and facility-detail enhancements
├── selection.css            # Primary and Backup selection components
├── care-plan.css            # Saved active care-plan editor and mode-specific presentation
├── emergency-fallback.css   # Extended emergency-result presentation
├── brand-refresh.css        # Approved PawPath visual alignment layer
├── plan-summary.css         # Saved-plan summary and focused Emergency Mode presentation
├── mobile-app.css           # Phone-only application shell and task views
├── mobile-plan.css          # Guided mobile Plan stages and review surface
├── leaflet-local.css        # Locally hosted Leaflet layout styles
├── app.js                   # Modes, map, facility classification, detail rendering, search, filters, and UI state
├── emergency-fallback.js    # Conditional 30-mile emergency and urgent-care fallback search
├── selection.js             # Primary and Backup care-plan selection
├── care-plan.js             # Versioned local storage, validation, restore, update, and clear behavior
├── plan-summary.js          # Persistent saved-plan summary and Emergency Mode behavior
├── mobile-app.js            # Phone app shell, bottom navigation, Saved, and Results / Map task views
├── mobile-app-sync.js       # Keeps mobile saved-plan state synchronized with persistence
├── mobile-plan.js           # Guided mobile Plan state, progress, summaries, and review behavior
├── map-layout-fix.js        # Late integration loading and defensive Leaflet resize handling
└── README.md                # Project overview
```

## Getting started locally

1. Clone the repository:

   ```bash
   git clone https://github.com/jeffthomasiii/pawpath.git
   cd pawpath
   ```

2. Serve the folder from a simple local web server. For example, with Python:

   ```bash
   python -m http.server 8000
   ```

3. Open `http://localhost:8000` in a browser.

A local server is recommended because browser geolocation and remote API requests may not work correctly when the page is opened directly from the file system.

## Public API usage and fair use

PawPath currently relies on public OpenStreetMap infrastructure. These services are suitable for a lightweight proof of concept but are not unlimited production APIs.

- Do not bulk download or prefetch OpenStreetMap tiles.
- Avoid rapid or automated repeated searches.
- Preserve OpenStreetMap attribution on the map.
- Clinic data can be incomplete or outdated; users should call ahead when possible.
- Before significant production traffic, configure dedicated geocoding, tile, and facility-data providers with appropriate service agreements.

## Trust and safety boundaries

PawPath is not a veterinary diagnosis or medical-triage service. It does not guarantee that a facility is open, available, or able to treat a specific animal or condition. The product should clearly identify uncertain or incomplete information and encourage users to call facilities before traveling.

## Privacy

Location information is used in the browser to perform the requested nearby search. PawPath does not currently maintain a backend or store the user’s location remotely. The active care plan is saved only in the current browser. Users should not enter medical documents, identification records, financial information, or other unnecessary sensitive data into the proof of concept.

## License

MIT License — free to use, adapt, and share.

## Built by

[Jeff Thomas III](https://github.com/jeffthomasiii)
