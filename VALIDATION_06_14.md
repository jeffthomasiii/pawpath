# POC-06.14 validation notes

## Static review

Reviewed the merged structural brand layer against the existing dynamic mode and mobile shell modules.

### Confirmed contracts
- The structural refresh does not change the existing care-plan storage key or schema.
- Core search, Nominatim, Overpass, Leaflet, facility-selection, and Emergency Mode modules remain unchanged.
- The mobile app shell still owns Plan / Care Now / Saved state below 701px.
- The mobile discovery switcher still owns Results / Map state through `data-mobile-discovery`.

### Finding corrected in this increment
The desktop care-plan journey was initially created based only on viewport width. `setMode()` changes `#hero-panel[data-mode]` at runtime, so the Plan-only journey could remain visible after switching to Find Care Now. `brand-journey.js` now observes that existing mode attribute and hides the journey outside Plan mode. The CSS explicitly honors the journey's `hidden` state.

## Browser validation still required
This repository has no automated browser suite. Verify after deployment:

- Desktop Plan: hero, three-step journey, scroll targets, trip editor, Primary/Backup, results/map.
- Desktop Find Care Now: journey hidden; search and results remain coherent.
- Mobile Plan: Trip details → Choose care → Review.
- Short phone viewport: Choose care filters and Results / Map switcher remain fully reachable.
- Mobile Care Now and Saved.
- Emergency Mode entry/exit and Call/Directions actions.
- Facility detail and Primary/Backup selection.
- Keyboard focus for desktop journey buttons.
- Leaflet sizing after breakpoint, mode, orientation, and Results / Map changes.
