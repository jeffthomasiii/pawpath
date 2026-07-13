# PawPath Proof-of-Concept Scope

## Purpose

The current application proves that PawPath can search a location, retrieve public veterinary data, and display facilities on a Leaflet map. The next proof of concept must prove something more important:

> **PawPath is a pet-care planning and emergency-readiness tool, not merely another veterinarian map.**

The POC should be polished enough to demonstrate to friends, potential users, collaborators, veterinarians, campground operators, and possible data partners.

## Demonstration outcome

After a short demonstration, a viewer should understand that PawPath helps a traveler:

1. Plan veterinary care around a destination.
2. Distinguish routine care from emergency care.
3. Choose a primary facility and backup.
4. Save the resulting care plan.
5. Use a focused emergency workflow if care is needed during the trip.

## Recommended POC story

Use a simple, relatable scenario throughout the application and demo:

> A family is taking their dog on a camping trip in an unfamiliar area. Before leaving, they use PawPath to identify the nearest likely emergency hospital, choose a backup, save both facilities, and create a simple emergency card. During the trip, they can switch to Emergency Mode and immediately call or navigate to the selected facility.

The exact destination can change, but the story should remain consistent.

## Required POC capabilities

## 1. Two clearly defined entry points

The home experience should present two primary actions:

### Plan a Trip

For destination-based preparation before travel.

### Find Care Now

For urgent location-based access to appropriate care.

The distinction should be visible immediately rather than hidden inside filters.

## 2. Destination-based search

The user should be able to search for:

- City and state
- ZIP code
- Campground or RV park name when geocoding supports it
- A recognizable destination or landmark

The current-location search should remain available, but it should no longer be the only central story.

## 3. Care-type prioritization

Results should be organized into clear categories:

- Emergency or 24-hour care
- Urgent or after-hours care
- Routine veterinary care
- Unclassified or needs confirmation

The POC must avoid presenting inferred emergency status as verified fact.

## 4. Confidence and verification indicators

Each facility card should show one of the following POC-level states:

- **Source listed** — directly provided by the current data source
- **Likely emergency** — inferred from available tags or the facility name
- **Needs confirmation** — important details are incomplete
- **Demo verified** — used only for curated POC demonstration records that have been manually checked

The card should encourage calling ahead when current availability is not confirmed.

## 5. Facility detail panel

Selecting a facility should reveal a focused detail view containing:

- Facility name
- Care type
- Confidence status
- Address
- Phone number
- Website when available
- Distance from the searched destination or current location
- Hours when reliable data exists
- Call action
- Directions action
- Add as primary action
- Add as backup action
- Data-source and confirmation note

## 6. Trip care-plan builder

The user should be able to create one active plan containing:

- Trip name
- Destination
- Travel dates as optional fields
- Pet name as an optional field
- Primary emergency facility
- Backup facility
- Routine-care facility as an optional selection
- Owner contact number as an optional field
- Important pet note as an optional field

For the POC, the plan can be saved in browser `localStorage`. No account or backend is required.

## 7. Saved plan summary

A persistent plan summary should display:

- Destination
- Primary facility
- Backup facility
- One-tap call and directions actions
- Edit plan
- Clear plan
- Open Emergency Mode

The user should be able to refresh the page without losing the saved plan on the same device.

## 8. Emergency Mode

Emergency Mode should intentionally simplify the interface. It should display:

1. Primary emergency facility
2. Call button
3. Directions button
4. Distance or estimated travel information when available
5. Backup facility
6. Pet and owner information from the saved plan
7. A visible “Call ahead to confirm availability” notice
8. A way to return to the planning experience

Emergency Mode should not present medical diagnosis or treatment guidance.

## 9. Emergency card

The POC should produce a concise, printable care card containing:

- PawPath branding
- Trip destination
- Pet name
- Owner contact
- Primary facility and phone
- Backup facility and phone
- Addresses
- Important pet note
- Generated date
- Disclaimer to call and confirm availability

The first version can use browser print styles rather than PDF-generation infrastructure.

## 10. Curated demonstration mode

Public OpenStreetMap data can be incomplete. The POC should include a transparent demonstration mode with a small curated dataset for one or two example destinations.

Demonstration data must be visibly labeled and should not be represented as live, nationally complete, or automatically verified.

The demo mode ensures the product story can be shown consistently even when a live location has sparse data.

## User-interface changes needed

The current map-and-results layout can remain as the foundation, but the POC should add:

- Plan a Trip and Find Care Now mode selector
- Stronger destination context in the page heading
- Facility-detail drawer or panel
- Add as Primary and Add as Backup actions
- Persistent saved-plan summary
- Emergency Mode screen or overlay
- Confidence-status badges
- Demo-mode indicator
- Printable emergency-card layout

## POC data strategy

### Live data

Continue using Nominatim, Overpass, and OpenStreetMap for lightweight live demonstration searches.

### Curated data

Store a small JSON dataset in the repository containing manually reviewed demonstration records. Each record should include source notes and a reviewed date.

### Honest presentation

The application should never silently combine curated and live data. The source and confidence state should be visible to users.

## Out of scope for this POC

- User registration and authentication
- Cloud-saved trips
- Multi-user collaboration
- Paid map or data subscriptions
- Full national data verification
- Full offline map tiles
- Route optimization
- Push notifications
- Veterinary medical advice or symptom triage
- Clinic reviews or ratings
- Appointment booking
- Payments
- Native mobile applications

## Acceptance criteria

The POC is ready to share when all of the following are true:

- [ ] The home screen clearly presents Plan a Trip and Find Care Now.
- [ ] A destination search produces categorized facility results.
- [ ] Facility cards show confidence or verification status.
- [ ] A facility can be selected as the primary option.
- [ ] A second facility can be selected as the backup.
- [ ] The care plan can be saved locally and survives refresh.
- [ ] Emergency Mode can be opened from the saved plan.
- [ ] Emergency Mode provides direct call and directions actions.
- [ ] A printable emergency card is available.
- [ ] A curated demo destination reliably demonstrates the complete flow.
- [ ] Mobile and desktop layouts both support the complete flow.
- [ ] All uncertain information is clearly labeled.
- [ ] No medical-diagnosis or guaranteed-availability claims appear.
- [ ] A new viewer can explain why PawPath is different from Google Maps after a two-minute demo.

## Recommended implementation order

1. Add the two-mode information architecture.
2. Add facility-detail and care-plan selection states.
3. Save one active plan in `localStorage`.
4. Add the persistent plan summary.
5. Build Emergency Mode.
6. Add confidence indicators.
7. Add curated demonstration data.
8. Add the printable emergency card.
9. Refine responsive behavior and accessibility.
10. Test the complete two-minute demonstration.