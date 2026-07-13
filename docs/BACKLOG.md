# PawPath Phase 1 Backlog

This backlog defines the implementation sequence for `v0.2 – Care Plan POC`. GitHub issues should be used to track each work package and its acceptance criteria.

## Priority 1 — Product structure

### POC-01: Add Plan a Trip and Find Care Now modes

- Present both modes prominently
- Adapt search instructions and headings to the selected mode
- Preserve current location and destination search
- Make the product distinction understandable without explanation

### POC-02: Add facility detail and confidence states

- Create a selected-facility detail panel
- Normalize care types
- Add Source listed, Likely emergency, Needs confirmation, and Demo verified states
- Add call-ahead and source messaging

## Priority 2 — Care-plan workflow

### POC-03: Add primary and backup facility selection

- Add Primary and Backup actions
- Prevent invalid duplicate selections
- Show selections in facility cards and detail panel
- Allow replacement and removal

### POC-04: Build and persist one active trip care plan

- Add trip, destination, pet, owner, and note fields
- Save plan to `pawpath.activeCarePlan.v1`
- Restore after refresh
- Validate and safely clear invalid stored data

### POC-05: Add persistent saved-plan summary

- Show destination, primary, backup, and routine selections
- Add Call, Directions, Edit, Clear, and Emergency Mode actions
- Make the summary responsive and accessible

## Priority 3 — Emergency experience

### POC-06: Build Emergency Mode

- Present primary facility and immediate actions first
- Display backup without returning to search
- Include saved pet and owner details
- Minimize unrelated interface elements
- Include call-ahead and availability disclaimer

### POC-07: Add printable emergency card

- Create print-friendly semantic markup
- Add `@media print` styles
- Provide Print / Save as PDF action
- Include trip, pet, owner, primary, backup, and generated date

## Priority 4 — Reliable demonstration

### POC-08: Add curated demonstration data

- Create `data/demo-facilities.json`
- Add at least one consistent destination scenario
- Include reviewed dates and source notes
- Label demo mode clearly in the UI
- Keep curated and live data distinguishable

### POC-09: Validate the two-minute product demo

- Run desktop and mobile walkthroughs
- Test saved plan after refresh
- Test keyboard operation
- Gather feedback using the demo-script questions
- Confirm viewers can explain why PawPath differs from general maps

## Recommended implementation sequence

1. POC-01
2. POC-02
3. POC-03
4. POC-04
5. POC-05
6. POC-06
7. POC-08
8. POC-07
9. POC-09

## Release gate

Do not call the POC shareable until:

- Primary and backup selection works
- The plan survives refresh
- Emergency Mode works
- A reliable curated demo scenario exists
- The emergency card prints cleanly
- A new viewer can explain the product distinction after the demo