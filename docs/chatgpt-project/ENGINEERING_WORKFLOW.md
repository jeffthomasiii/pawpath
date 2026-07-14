# PawPath Engineering Workflow

## Purpose

Use this workflow for code, documentation, bug fixes, and roadmap increments in the PawPath repository.

## Before changing code

1. Read the current issue and its acceptance criteria.
2. Inspect the current `main` files involved in the feature.
3. Review `CURRENT_STATE.md`, the roadmap, and implementation notes.
4. Identify which existing global functions, state variables, DOM IDs, storage fields, and script-order dependencies the change touches.
5. Confirm whether the request is a bug fix, roadmap increment, documentation task, or exploratory design decision.

## Branch and pull-request pattern

- Create one focused branch per increment or fix.
- Suggested branch prefixes:
  - `agent/feature-name`
  - `agent/fix-name`
  - `docs/topic-name`
- Keep unrelated cleanup outside the branch unless it is required for the requested change.
- Open a pull request that includes:
  - what changed
  - why it strengthens PawPath
  - acceptance criteria addressed
  - validation performed
  - known limitations
  - issue-closing reference
- Merge only after GitHub reports the PR as mergeable.
- Prefer squash merges for focused increments.

## Static application constraints

PawPath currently uses plain scripts rather than ES modules. Later scripts may wrap functions defined earlier. Always verify:

- script loading order
- duplicate global function names
- DOMContentLoaded registration order
- whether a function reference was captured before another module wrapped it
- whether a new listener duplicates an existing listener
- whether rerendering removes decorations or event handlers
- whether map size must be invalidated after layout changes

## HTML checks

- New IDs must be unique.
- JavaScript lookups must match exact HTML IDs.
- Buttons need explicit `type="button"` unless they submit a form.
- Form controls require labels.
- Dynamic status messages should use an appropriate live region.
- Dialog and focus behavior must work with keyboard navigation.
- Avoid hiding critical content only by color.

## CSS checks

- Use existing PawPath tokens from `styles.css`.
- Do not invent token names without adding them to `:root`.
- Test desktop, tablet, and narrow mobile layouts conceptually and in a browser when possible.
- Preserve visible focus states.
- Respect reduced-motion preferences for scrolling or animation.
- Verify that new content does not destabilize Leaflet’s map dimensions.

## JavaScript checks

- Fail safely when remote APIs or browser storage are unavailable.
- Do not silently label routine care as emergency care.
- Treat source data as incomplete unless evidence supports a stronger claim.
- Sanitize dynamic content inserted with `innerHTML`.
- Validate stored data before restoring it.
- Keep storage schema versioned.
- Avoid storing unnecessary sensitive information.
- Confirm that saved state, rendered state, and map state remain synchronized after rerenders.

## Data-source rules

- OpenStreetMap attribution must remain visible.
- Public Nominatim and Overpass usage must remain lightweight.
- Do not implement bulk downloads, aggressive polling, or high-volume automated calls.
- Emergency classification should retain confidence language and call-ahead guidance.
- Google Maps is permitted only as an external link destination in the current architecture.

## Minimum validation for each increment

Perform and report the checks that are actually possible:

- Review complete branch diff against `main`.
- Check changed filenames and scope.
- Review script order and shared global dependencies.
- Check DOM IDs referenced by new JavaScript.
- Check CSS variable names against the design tokens.
- Check storage schema compatibility when relevant.
- Check fallback and error states.
- Check accessible names, focus targets, and live-region messages.
- Identify browser interactions that remain untested.

Do not claim automated, live-browser, mobile-device, geolocation, API, or deployment testing unless it was actually performed.

## After merge

1. Confirm the issue closed when the PR used `Closes #…`.
2. Update Issue #13, the Phase 1 tracker.
3. Update README current capabilities and next task when materially changed.
4. Update `CURRENT_STATE.md` after significant increments.
5. Tell the user what to test on the deployed GitHub Pages site.
6. Note that GitHub Pages and browser caches may require a short wait and force refresh.
