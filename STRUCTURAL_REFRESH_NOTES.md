# Structural brand refresh validation notes

Issue: #58

This increment changes presentation and information hierarchy while preserving existing application IDs and behavior contracts.

## Static review

- Existing form, care-plan, selection, facility-detail, map, and result IDs are preserved.
- Existing core script order remains unchanged; `brand-journey.js` is appended after `map-layout-fix.js` as desktop-only progressive enhancement.
- `structural-brand.css` is loaded after `adventure-brand.css`.
- No localStorage schema changes.
- No map, geocoding, Overpass, emergency-fallback, or facility-selection logic changes.
- Mobile Plan stepper behavior remains owned by the existing mobile modules; structural changes at <=700px are visual only.

## Browser validation still required

There is no automated browser suite in this repository. Validate desktop Plan/Care Now, mobile Plan steps, Plan → Choose care on short viewports, Care Now, Saved, Emergency Mode, facility detail, Results/Map switching, keyboard focus, and Leaflet resizing after deployment.
