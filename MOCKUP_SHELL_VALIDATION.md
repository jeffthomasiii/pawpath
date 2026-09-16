# Mockup-first shell validation

Issue: #64

## Static review completed

- Existing application IDs remain unchanged because the shell is progressive enhancement inserted around the current DOM.
- Plan and Care Now shell actions delegate to the existing `.mode-option` controls instead of duplicating application state.
- Existing search, Leaflet map, facility detail, Primary/Backup, localStorage, and emergency modules are not modified.
- The new shell is generated from the already-direct-loaded `brand-journey.js`; no new dynamically loaded CSS dependency was introduced.
- `mockup-workspace.css` remains directly linked from `index.html` and now owns the mockup-first shell styling.
- Desktop and mobile receive explicit shell layouts.

## Browser validation still required

The repository has no automated browser suite. Validate on deployed GitHub Pages:

1. Desktop first viewport resembles the approved mockup hierarchy.
2. Plan a Trip shell CTA activates Plan and scrolls to the existing planning console.
3. Find Care Now shell CTA activates Care Now and scrolls to the existing console.
4. Desktop Results/Map and Primary/Backup rail remain usable.
5. Facility detail opens and selection still works.
6. Mobile first viewport, quick actions, existing Plan steps, Results/Map switcher, Saved, and Emergency remain usable.
7. Leaflet map resizes correctly after mode/navigation changes.
8. Keyboard focus remains visible and shell buttons are reachable.
