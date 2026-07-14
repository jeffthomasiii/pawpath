# PawPath

**Pet-care preparedness for the road.**

PawPath is a mobile-friendly web application for campers, RV travelers, road-trippers, and other people traveling with pets. It is being developed to help users identify, evaluate, and save veterinary and emergency-care options near a destination before care is needed.

> **Google Maps and Apple Maps help people find places. PawPath helps people traveling with pets make a care plan and act quickly when something goes wrong.**

## Live proof of concept

[Open PawPath](https://jeffthomasiii.github.io/pawpath/)

The proof of concept now presents two distinct workflows: **Plan a Trip** for destination-based preparation and **Find Care Now** for immediate nearby-care access. Users can review facility details and confidence information, then choose a Primary emergency or urgent-care option and a distinct Backup facility for the current session. Upcoming increments will save the full trip care plan, add Emergency Mode, and create a printable emergency card.

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

Search around a campground, destination, ZIP code, or overnight stop; review care options; choose a primary facility and backup; and save the essential details before leaving.

### Find Care Now

Use the current location to prioritize likely emergency-care options and quickly access call, directions, backup, and saved pet-information actions.

## Current capabilities

- Switch between Plan a Trip and Find Care Now modes
- Use destination-focused search language and actions for trip preparation
- Emphasize current-location access for immediate nearby-care searches
- Open the same facility-detail experience from a result card or map marker
- Classify facilities conservatively as emergency, urgent, routine, or unknown
- Show confidence states and plain-language explanations without relying only on color
- Display missing information, OpenStreetMap source links, and call-ahead guidance honestly
- Select one emergency or urgent-care facility as the Primary option
- Select a distinct facility as the Backup option
- Replace, move, view, or remove Primary and Backup selections during the current session
- Show selected roles in the care-plan summary, facility cards, map markers, and facility details
- Search by U.S. city, state, or ZIP code
- Use browser geolocation to search near the current position
- View veterinary clinics on an interactive Leaflet map
- Filter results between all care, emergency, and routine clinics
- Open driving directions without embedding a paid map service
- Responsive desktop, tablet, and mobile layouts
- Keyboard-accessible mode controls, search controls, cards, selections, detail drawer, and map markers
- PawPath branded header and favicon

## Next proof-of-concept capabilities

The remaining `v0.2 – Care Plan POC` work will add:

- One locally saved active trip plan
- A persistent saved-plan summary
- Emergency Mode
- Curated demonstration data
- Printable emergency card

See [Proof-of-Concept Scope](docs/POC_SCOPE.md) and [Roadmap](docs/ROADMAP.md).

## Active development

Phase 1 work is tracked in the [`v0.2 Care Plan POC` tracking issue](https://github.com/jeffthomasiii/pawpath/issues/13), with one issue for each feature package and its acceptance criteria.

The next implementation task is [POC-04: Build and persist one active trip care plan](https://github.com/jeffthomasiii/pawpath/issues/7).

## Product documentation

- [Documentation Index](docs/README.md) — recommended reading order
- [Why PawPath?](docs/WHY_PAWPATH.md) — product distinction, audience, value proposition, and messaging
- [Product Vision](docs/PRODUCT_VISION.md) — mission, users, jobs to be done, principles, and success criteria
- [Proof-of-Concept Scope](docs/POC_SCOPE.md) — required capabilities and acceptance criteria for the shareable POC
- [Roadmap](docs/ROADMAP.md) — phased product and development plan
- [Phase 1 Backlog](docs/BACKLOG.md) — prioritized POC work packages
- [Phase 1 Release Plan](docs/PHASE_1_RELEASE_PLAN.md) — increments, release gate, and manual checklist
- [Implementation Notes](docs/IMPLEMENTATION_NOTES.md) — data objects, state model, storage, confidence logic, and file guidance
- [Demo Script](docs/DEMO_SCRIPT.md) — two-minute walkthrough and early-user feedback questions

## Technologies

- HTML
- CSS
- JavaScript
- [Leaflet 1.9.4](https://leafletjs.com/) for the interactive map
- [OpenStreetMap](https://www.openstreetmap.org/) map tiles and clinic data
- [Nominatim](https://nominatim.org/) for destination geocoding
- [Overpass API](https://overpass-api.de/) for nearby veterinary-facility queries
- Browser `localStorage` planned for the first saved care-plan implementation

PawPath does not require a Google Maps API key. Google Maps is currently used only as an external destination for the **Directions** link.

## Project structure

```text
pawpath/
├── assets/                  # PawPath logo and brand assets
├── docs/                    # Product vision, POC scope, roadmap, backlog, and demo documentation
├── index.html               # Semantic application layout
├── styles.css               # Core responsive design system and components
├── site-fixes.css           # Map, brand, mode, and facility-detail enhancements
├── selection.css            # Primary and Backup selection components
├── leaflet-local.css        # Locally hosted Leaflet layout styles
├── app.js                   # Modes, map, facility classification, detail rendering, search, filters, and UI state
├── selection.js             # Session-based Primary and Backup care-plan selection
├── map-layout-fix.js        # Defensive Leaflet resize handling
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

Location information is used in the browser to perform the requested nearby search. PawPath does not currently maintain a backend or store the user’s location. The next saved-plan implementation is intended to remain on the user’s device through browser `localStorage`.

## License

MIT License — free to use, adapt, and share.

## Built by

[Jeff Thomas III](https://github.com/jeffthomasiii)
