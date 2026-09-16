# Next Implementation Step

Last updated: September 16, 2026

The next task is **deployed smoke testing of the reconciled premium PWA, followed by the mobile screen-by-screen review**.

Do not add another visual layer or advance to curated demo data until the active multi-page flow has been exercised on the deployed GitHub Pages site.

## Smoke-test path

1. Open Home on desktop and phone widths.
2. Open Plan a Trip, save trip/pet essentials, refresh, and confirm they restore.
3. Continue to Care Now with the destination carried into search.
4. Verify Nominatim search, browser geolocation permission handling, Overpass results, Leaflet markers, Call/Directions/source links, and call-ahead messaging.
5. Choose an eligible Primary and a distinct Backup; refresh and confirm both persist.
6. Open Saved Plan and verify trip/pet/facility details and actions.
7. Open Emergency Mode and verify normal navigation is removed while Primary/Backup Call and Directions remain available.
8. Clear the plan and confirm Home, Plan, and Saved return to their empty states.
9. Verify installed-PWA/service-worker refresh behavior where practical.
10. On iPhone Safari and Android Chrome, verify safe-area spacing, fixed bottom navigation, map stacking, hero crops, keyboard/focus behavior, and no clipped controls.

## Reporting rule

Record static review separately from deployed browser behavior. The repository has no automated browser-test suite, so browser-dependent behavior should not be described as confirmed until this smoke test has been completed.

After the smoke test, resume the planned mobile screen-by-screen review and address visual/interaction issues one screen at a time.