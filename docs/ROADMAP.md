# PawPath Roadmap

Last updated: September 16, 2026

## Roadmap principle

PawPath should not grow by adding generic map features. Each phase should strengthen the core promise:

> **Help people traveling with pets prepare for care needs and act quickly when something goes wrong.**

The immediate priority remains a clear, reliable, shareable proof of concept.

## Current state — premium Care Plan POC

PawPath is now a premium multi-page PWA proof of concept with separate Home, Plan a Trip, Find Care Now, Saved Plan/Emergency Mode, and Resources destinations.

The active flow supports trip/pet essentials, live destination/current-location veterinary search, conservative care classification, Primary/Backup selection, one locally saved care plan, saved-plan actions, and a focused Emergency Mode. The post-redesign architecture and validation boundary are documented in `docs/REPO_AUDIT_2026-09-16.md` and `docs/chatgpt-project/CURRENT_STATE.md`.

The repository still contains the earlier single-page implementation for reference. Its modules are not automatically active in the premium multi-page pages.

## Immediate gate before more feature work

Complete deployed smoke testing of the reconciled premium PWA and then the mobile screen-by-screen review. Browser-dependent behavior must be validated separately because the repository has no automated browser-test suite.

---

# Phase 1 — Make the “Why PawPath?” obvious

**Target:** Shareable proof of concept  
**Release concept:** `v0.2 – Care Plan POC`

## Core product requirements

### Plan a Trip / Find Care Now

- Make preparation before travel distinct from immediate nearby-care search
- Keep Plan a Trip as the preparedness workflow
- Preserve current-location search for immediate care

### Facility evaluation

- Present care type conservatively
- Distinguish source-listed information from inferred/unknown information
- Show source and call-ahead guidance
- Never imply guaranteed hours, capability, species acceptance, or availability

### Trip care plan

- Store trip and concise pet/traveler essentials
- Select a Primary emergency/urgent-care facility
- Select a distinct Backup
- Save one active plan locally in the browser

### Saved plan / Emergency Mode

- Keep the saved plan easy to reach
- Provide Call and Directions actions where data exists
- Keep Primary first and Backup immediately available in Emergency Mode
- Reduce unrelated decision-making during urgent use

### Curated demonstration data

- Add one or two transparent example destinations
- Keep curated records clearly labeled with source/review context
- Ensure the complete POC can be demonstrated even when public OSM data is sparse

### Printable emergency card

- Provide a print-friendly plan summary
- Include Primary, Backup, phone/address data, pet/traveler essentials, and generated date
- Use the browser print workflow for Print / Save as PDF

### Shareable validation

- Run the two-minute product-understanding test
- Verify desktop and mobile behavior
- Document known limitations and public-service constraints

## Phase 1 exit criteria

- A viewer understands the PawPath distinction within two minutes
- A destination-based care plan can be created in under three minutes
- Primary and Backup remain saved after refresh
- Emergency Mode exposes key saved actions quickly
- The demo works consistently on desktop and mobile
- Documentation describes the active implementation rather than historical modules

## Phase 1 sequence from here

1. Deployed smoke test of the reconciled premium PWA
2. Mobile screen-by-screen review and fixes
3. Curated demonstration data
4. Printable emergency card
5. Shareable POC validation

---

# Phase 2 — Improve trust and facility data

**Release concept:** `v0.3 – Trust Layer`

Define a facility-verification standard, reviewed/last-checked dates, stronger care-type taxonomy, better source attribution, stale-data warnings, correction feedback, and production data-provider evaluation.

**Exit:** users can distinguish verified, source-provided, inferred, and unknown facts.

---

# Phase 3 — Expand trip planning

**Release concept:** `v0.4 – Route Planning`

Add multiple trips/stops, route-adjacent care, care coverage per stop, gap identification, and intentional sharing with travel companions.

**Exit:** a traveler can prepare Primary/Backup care across a multi-stop road trip.

---

# Phase 4 — Offline readiness

**Release concept:** `v0.5 – Road Ready`

Build on the current installable shell with locally cached critical saved-plan information, offline emergency card, connectivity state, and provider-permitted offline mapping strategies.

**Exit:** critical saved information remains usable when connectivity is poor.

---

# Phase 5 — Portable pet profile

**Release concept:** `v0.6 – Pet Travel Profile`

Only after the care-plan workflow is validated, consider richer pet profiles, medications/allergies, veterinarian/insurance information, documents, emergency contacts, and explicit privacy controls.

---

# Phase 6 — Accounts, synchronization, and partnerships

**Release concept:** `v1.0 – PawPath Travel Safety Platform`

Accounts, secure cloud synchronization, shared household plans, verified facility partnerships, production data integrations, and a sustainable operating model remain later-stage work.

## Preconditions

- Core planning workflow validated with real users
- Evidence that saved care plans and Emergency Mode provide distinct value
- Production data agreements identified
- Privacy/security architecture defined
- Public POC APIs replaced or formalized for production traffic

## Decision filter

Before adding a feature, ask whether it helps a traveler prepare before care is needed, reduces confusion during urgent use, improves confidence without overstating certainty, addresses a pet-travel need general maps do not organize well, and can be demonstrated clearly in the product story.