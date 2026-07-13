# PawPath POC Issue Templates

The following issue definitions can be used to track Phase 1 work.

## POC-01 — Add Plan a Trip and Find Care Now modes

### Goal

Make the product’s two core use cases visible immediately.

### Acceptance criteria

- [ ] Both modes are prominent and keyboard accessible
- [ ] Plan a Trip uses destination-focused language
- [ ] Find Care Now prioritizes current location and urgent actions
- [ ] Search, map, and results continue to work in both modes
- [ ] Mobile layout remains usable

## POC-02 — Add facility detail and confidence states

### Goal

Help users understand care type, available details, and uncertainty before selecting a facility.

### Acceptance criteria

- [ ] Selecting a card or marker opens a detail view
- [ ] Detail view includes phone, address, website, distance, and source note when available
- [ ] Care type uses conservative classification
- [ ] Confidence states are visible and explained
- [ ] Call-ahead guidance appears for uncertain availability

## POC-03 — Add primary and backup facility selection

### Goal

Turn search results into a care-planning decision.

### Acceptance criteria

- [ ] A facility can be selected as Primary
- [ ] A different facility can be selected as Backup
- [ ] Duplicate Primary and Backup selection is prevented
- [ ] Selections are visible on cards, markers, and detail view
- [ ] Selections can be replaced or removed

## POC-04 — Persist one active trip care plan

### Goal

Save destination and care selections locally without requiring an account.

### Acceptance criteria

- [ ] Plan includes trip name, destination, optional dates, pet name, owner phone, and important note
- [ ] Plan saves to `pawpath.activeCarePlan.v1`
- [ ] Plan restores after refresh
- [ ] Malformed or unsupported data fails safely
- [ ] Clear Plan removes stored data after confirmation

## POC-05 — Add saved-plan summary

### Goal

Keep the active plan visible and actionable.

### Acceptance criteria

- [ ] Summary shows destination, Primary, Backup, and optional Routine care
- [ ] Call and Directions actions are available
- [ ] Edit, Clear, and Emergency Mode actions are available
- [ ] Summary works on desktop and mobile
- [ ] Status updates are announced accessibly

## POC-06 — Build Emergency Mode

### Goal

Reduce cognitive load during an urgent situation.

### Acceptance criteria

- [ ] Primary facility is the dominant content
- [ ] Call and Directions are the dominant actions
- [ ] Backup facility is immediately available
- [ ] Saved pet and owner details are visible
- [ ] Call-ahead disclaimer is visible
- [ ] Unrelated planning controls are minimized

## POC-07 — Add curated demonstration data

### Goal

Provide a reliable, transparent demonstration scenario when live public data is sparse.

### Acceptance criteria

- [ ] `data/demo-facilities.json` exists
- [ ] At least one destination supports the complete demo flow
- [ ] Records include source notes and reviewed dates
- [ ] Demo mode is visibly labeled
- [ ] Curated and live results are not silently mixed

## POC-08 — Add printable emergency card

### Goal

Allow the care plan to be retained or shared before entering an area with weak connectivity.

### Acceptance criteria

- [ ] Print view includes PawPath branding
- [ ] Trip, pet, owner, Primary, and Backup details appear
- [ ] Generated date and call-ahead disclaimer appear
- [ ] Map and unrelated UI are hidden when printing
- [ ] Print / Save as PDF works through the browser

## POC-09 — Validate the shareable POC

### Goal

Confirm that the product distinction is understandable and the complete flow works.

### Acceptance criteria

- [ ] Desktop walkthrough passes
- [ ] Mobile walkthrough passes
- [ ] Keyboard walkthrough passes
- [ ] Plan survives refresh
- [ ] Emergency card prints cleanly
- [ ] At least five demo viewers are asked the structured questions
- [ ] Most viewers describe PawPath as care planning or pet-travel preparedness rather than only a vet map