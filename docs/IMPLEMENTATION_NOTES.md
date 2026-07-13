# PawPath POC Implementation Notes

## Purpose

This document translates the product vision into practical guidance for the existing lightweight HTML, CSS, and JavaScript application.

## Preserve the current architecture for the POC

The next proof-of-concept phase does not require a framework migration. The existing static GitHub Pages architecture can support the care-plan workflow with:

- Semantic HTML sections or views
- Shared CSS components and responsive states
- Plain JavaScript modules or clearly separated functions
- JSON files for curated demonstration records
- Browser `localStorage` for one active care plan
- Browser print styles for the emergency card

A framework, backend, and account system should be considered only after the core workflow is validated.

## Recommended data objects

### Facility

```js
{
  id: "source-type-id",
  name: "Example Emergency Animal Hospital",
  lat: 0,
  lng: 0,
  address: "",
  phone: "",
  website: "",
  distanceMiles: 0,
  careType: "emergency | urgent | routine | unknown",
  confidence: "demo-verified | source-listed | likely-emergency | needs-confirmation",
  source: "OpenStreetMap | curated-demo",
  reviewedAt: null,
  sourceNotes: "",
  hours: "",
  animalsServed: []
}
```

### Active care plan

```js
{
  version: 1,
  id: "generated-id",
  tripName: "",
  destination: {
    label: "",
    lat: 0,
    lng: 0
  },
  travelDates: {
    start: "",
    end: ""
  },
  pet: {
    name: "",
    importantNote: ""
  },
  owner: {
    phone: ""
  },
  primaryFacility: null,
  backupFacility: null,
  routineFacility: null,
  createdAt: "",
  updatedAt: ""
}
```

## Recommended state model

```js
const state = {
  mode: "plan | now",
  selectedFacilityId: null,
  activeFilter: "all",
  searchCenter: null,
  searchLabel: "",
  liveFacilities: [],
  demoFacilities: [],
  activePlan: null,
  isEmergencyMode: false,
  isDemoMode: false
};
```

## Local-storage strategy

Use one namespaced key for the POC:

```text
pawpath.activeCarePlan.v1
```

Requirements:

- Validate stored data before using it
- Include a schema version
- Handle malformed or outdated data without breaking the application
- Provide a visible Clear Plan action
- Do not store sensitive medical documents in the POC

## Recommended UI regions

- `mode-selector` — Plan a Trip / Find Care Now
- `search-workflow` — destination or current-location input
- `results-panel` — categorized facility cards
- `facility-detail` — selected facility information and plan actions
- `active-plan-summary` — persistent primary and backup summary
- `emergency-mode` — simplified call-and-go view
- `emergency-card` — print-only or printable plan section
- `demo-mode-banner` — clear curated-data disclosure

## Confidence-state presentation

Use plain language and tooltips or explanatory text:

- **Demo verified** — manually reviewed for the demonstration on a stated date
- **Source listed** — information is presented as supplied by the source
- **Likely emergency** — emergency capability is inferred and must be confirmed
- **Needs confirmation** — important details are incomplete or uncertain

Avoid a green checkmark for any state other than a defined verification status.

## Care-type classification

For live POC data, classify conservatively:

1. Use explicit structured source tags when available.
2. Use `emergency=yes` or reliable equivalent signals before assigning emergency.
3. If a name contains terms such as “emergency,” “urgent,” or “24 hour,” assign `likely-emergency`, not verified emergency.
4. Otherwise classify as routine or unknown based on available information.
5. Always provide a call-ahead reminder for urgent and emergency selections.

## Demonstration data

Recommended repository location:

```text
data/demo-facilities.json
```

Each curated record should include:

- Stable ID
- Destination association
- Full facility fields
- Source URL or source note
- Manually reviewed date
- Explicit `demo-verified` confidence

The application should visibly indicate when curated demonstration data is active.

## Print strategy

The first emergency card can be implemented with:

- A dedicated semantic HTML section
- `@media print` CSS
- Hidden navigation, map, filters, and nonessential controls
- A Print / Save as PDF button calling `window.print()`

## Accessibility requirements

- Modes should use buttons with clear active states
- Facility cards must remain keyboard operable
- Detail drawers require appropriate headings and focus management
- Emergency Mode actions should use descriptive labels
- Status and save confirmations should use `aria-live`
- Print content must remain understandable without color
- Confidence states should not rely on color alone

## Suggested file evolution

The POC can remain simple while reducing complexity:

```text
app.js                  # Bootstrap and orchestration
js/map.js               # Leaflet setup and marker behavior
js/search.js            # Geocoding and live facility queries
js/facilities.js        # Normalization and care classification
js/care-plan.js         # Plan state and localStorage
js/ui.js                # Rendering and interaction handlers
js/emergency-mode.js    # Emergency-mode rendering
js/demo-data.js         # Curated-data loading
```

This split is optional for the first feature, but the application should move toward it as the care-plan workflow grows.

## Definition of done for each Phase 1 feature

Every feature should include:

- Desktop and mobile behavior
- Keyboard operation
- Empty, loading, and error states
- Honest data-source and confidence presentation
- No uncaught console errors
- No regression to map sizing or clinic search
- README or documentation updates when behavior changes
- A clear manual test checklist in the pull request