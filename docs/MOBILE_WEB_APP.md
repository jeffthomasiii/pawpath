# PawPath Mobile Web-App Direction

## Purpose

PawPath's mobile experience should behave like a purpose-built pet-care preparedness application rather than a desktop webpage compressed onto a phone.

This phase remains a static web application hosted on GitHub Pages. It does not introduce a framework, backend, account system, build process, or native-app dependency.

## Product model

The mobile shell is organized around three persistent tasks:

- **Plan** — prepare a destination-based care plan before travel.
- **Care Now** — find nearby veterinary care with current-location emphasis.
- **Saved** — reach the stored Primary and Backup facilities without scrolling through planning content.

Emergency Mode remains a focused takeover entered from a valid saved plan.

## Interface principles

- Use a compact app header at phone widths instead of the full desktop site header.
- Keep the approved PawPath Pine, Sage, Amber, Stone, Ink, and restrained Danger system.
- Keep the interface visually distinct from Blue Green Guide; only the lesson of app-like task navigation carries over.
- Prefer one primary mobile task surface at a time.
- Treat Results and Map as switchable views rather than stacked page sections.
- Keep saved-plan and emergency actions thumb-reachable.
- Present facility details as a bottom sheet on narrow screens.
- Preserve honest missing-data and call-ahead language.
- Preserve keyboard access, focus visibility, and reduced-motion behavior.

## Technical approach

The mobile shell is layered on top of the existing PawPath application:

- `mobile-app.css` contains phone-only app-shell presentation.
- `mobile-app.js` injects the compact header, bottom navigation, saved-plan empty state, and Results/Map switcher.
- `mobile-app-sync.js` keeps the mobile saved-plan indicators synchronized with the existing `pawpath.activeCarePlan.v1` persistence flow.
- `map-layout-fix.js` loads the saved-plan module first, then the mobile shell, preserving the current global wrapper order.

Desktop and tablet behavior remains governed by the existing application styles and modules.

## Validation still required

The repository has no automated browser-test suite. Deployed browser testing is required for:

- iPhone Safari and Android Chrome narrow widths
- safe-area padding and bottom navigation
- Plan / Care Now / Saved navigation state
- Results / Map switching and Leaflet resizing
- saved-plan creation, clearing, restoration, and cross-tab updates
- Emergency Mode entry and exit
- facility-detail bottom-sheet scrolling and sticky actions
- keyboard focus and reduced-motion behavior
