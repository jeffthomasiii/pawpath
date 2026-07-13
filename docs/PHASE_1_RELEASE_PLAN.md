# Phase 1 Release Plan — v0.2 Care Plan POC

## Release objective

Make the reason for PawPath immediately understandable by turning the current nearby-care map into a destination-based planning and emergency-readiness workflow.

## Release sequence

### Increment A — Explain the product in the interface

- Add Plan a Trip and Find Care Now modes
- Update the hero and search context for each mode
- Add confidence-state language
- Add facility-detail view

### Increment B — Create the plan

- Add Primary and Backup selection
- Add optional Routine selection
- Add trip, pet, owner, and important-note fields
- Save one active plan locally

### Increment C — Use the plan

- Add persistent plan summary
- Add Emergency Mode
- Add call, directions, and backup actions
- Restore the saved plan after refresh

### Increment D — Make the demo reliable

- Add curated demonstration data
- Add visible demo-data disclosure
- Add printable emergency card
- Run the two-minute demo test on desktop and mobile

## Recommended release branches

- `feature/poc-modes-and-detail`
- `feature/poc-care-plan`
- `feature/poc-emergency-mode`
- `feature/poc-demo-and-print`

Each branch should be small enough to review independently and should preserve the live clinic-search foundation.

## Manual release checklist

- [ ] Destination search works
- [ ] Current-location search works
- [ ] Map resizes correctly
- [ ] Mode switching works by mouse, touch, and keyboard
- [ ] Facility detail works by mouse, touch, and keyboard
- [ ] Primary and backup selections are distinct
- [ ] Saved plan survives refresh
- [ ] Invalid stored plan data fails safely
- [ ] Call links work on mobile
- [ ] Directions links open correctly
- [ ] Emergency Mode is readable at narrow widths
- [ ] Demo mode is visibly labeled
- [ ] Print preview contains only the intended emergency card
- [ ] Confidence states do not rely only on color
- [ ] Uncertain information includes call-ahead guidance
- [ ] No uncaught console errors
- [ ] No Google Maps API key is introduced

## Release decision

Release `v0.2` when the complete demonstration can be performed without explaining missing features or manually working around data gaps.