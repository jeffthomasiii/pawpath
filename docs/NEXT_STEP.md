# Next Implementation Step

Last updated: September 16, 2026

The next gate is **deployed smoke testing of the premium decision-support flow, followed by the mobile screen-by-screen review**.

Do not advance to curated demo data until the new Plan stages, facility decision sheet, expanded emergency search, saved plan, and Emergency Mode have been exercised on the deployed GitHub Pages site.

## Smoke-test path

1. Open Plan and complete Trip → Pet → Care plan stages.
2. Confirm trip validation and destination carry into Care Now.
3. Verify Nominatim, geolocation, Overpass, Leaflet, and normal roughly 10-mile results.
4. Open multiple facility decision sheets; verify source-supported data, confidence language, Call, Directions, website/source actions, close/focus behavior, and mobile bottom-sheet layout.
5. Choose an eligible Primary and distinct Backup; refresh and confirm both persist.
6. Open Saved Plan and Emergency Mode and verify immediate saved-care actions.
7. Search an area without nearby emergency/urgent evidence and verify automatic expansion to 30 miles.
8. Verify expanded results are clearly labeled and that an unresolved search offers an external emergency-veterinarian search action.
9. Clear the plan and verify empty states.
10. On iPhone Safari and Android Chrome, verify safe areas, fixed bottom navigation, map stacking, sheet stacking, keyboard/focus behavior, and no clipped controls.

## Reporting rule

Static/source review and deployed browser behavior must be reported separately. There is no automated browser-test suite, so browser-dependent behavior is not confirmed until this smoke test is completed.

After this gate, resume the mobile screen-by-screen review.