# Next Implementation Step

The next development task is **POC-01: Add Plan a Trip and Find Care Now modes**.

This should be implemented before the care-plan builder because it establishes the product’s information architecture and makes the “why PawPath?” distinction visible in the interface.

## Deliverable

Add a prominent mode selector above the search experience:

- **Plan a Trip** — search around a destination and prepare care options
- **Find Care Now** — use the current location or nearby search for immediate care

## Required behavior

- The default mode should be Plan a Trip
- The selected mode should update the headline, explanatory copy, input label, and primary action
- Find Care Now should visually emphasize Use My Location
- Existing search and map behavior must continue to work
- The selected mode should be stored only in application state; no account or persistence is required
- Both modes must be usable by keyboard and screen reader

## Definition of done

The first screen should make it clear, before any search is performed, that PawPath supports both preparation before travel and immediate access during an urgent need.