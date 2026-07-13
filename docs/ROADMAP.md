# PawPath Roadmap

## Roadmap principle

PawPath should not grow by adding generic map features. Each phase should strengthen the core promise:

> **Help people traveling with pets prepare for care needs and act quickly when something goes wrong.**

The immediate priority is to make that promise unmistakable in a shareable proof of concept.

## Current state: Mapping foundation

The existing application provides the technical foundation:

- Responsive web interface
- Leaflet and OpenStreetMap map
- Destination and ZIP-code geocoding
- Current-location search
- Nearby veterinary-facility queries
- Routine and emergency filtering
- Clinic cards synchronized with markers
- External directions links
- No required paid Google Maps API

This foundation demonstrates location search, but it does not yet fully demonstrate why PawPath is different from a general map application.

---

# Phase 1 — Make the “Why PawPath?” obvious

**Target:** Shareable proof of concept

**Release concept:** `v0.2 – Care Plan POC`

## Goal

Transform the current clinic finder into a visible pet-travel preparedness workflow.

## Required features

### 1.1 Plan a Trip and Find Care Now

- Add two clear modes at the top of the experience
- Make Plan a Trip the primary preparedness flow
- Preserve current-location search for Find Care Now
- Update homepage language to emphasize care planning rather than simple discovery

### 1.2 Facility detail and confidence

- Add a detail panel or drawer
- Classify care type without overstating certainty
- Display confidence states such as Source listed, Likely emergency, Needs confirmation, and Demo verified
- Show source notes and “call ahead” guidance

### 1.3 Trip care-plan builder

- Select a primary emergency facility
- Select a backup facility
- Optionally select routine care
- Add destination, trip name, pet name, owner contact, and important note
- Save one active plan in browser `localStorage`

### 1.4 Saved plan summary

- Display the active trip plan persistently
- Provide Call, Directions, Edit, Clear, and Open Emergency Mode actions
- Restore the plan after page refresh

### 1.5 Emergency Mode

- Present the primary facility first
- Provide large Call and Directions actions
- Display the backup immediately below
- Include saved pet and owner information
- Minimize unrelated controls and map exploration

### 1.6 Curated demonstration mode

- Add one or two reliable demonstration destinations
- Store curated facility records in a repository JSON file
- Clearly identify demo data and reviewed dates
- Ensure the complete POC flow can be demonstrated consistently

### 1.7 Printable emergency card

- Create a print-friendly plan summary
- Include primary and backup facilities, phone numbers, addresses, pet name, owner contact, important note, and generated date
- Provide a Print / Save as PDF action using the browser print workflow

## Phase 1 exit criteria

- A viewer understands the product distinction within two minutes
- A destination-based care plan can be created in under three minutes
- Primary and backup facilities remain saved after refresh
- Emergency Mode presents the key actions in under 30 seconds
- The demo works consistently on desktop and mobile

---

# Phase 2 — Improve trust and facility data

**Release concept:** `v0.3 – Trust Layer`

## Goal

Make care-type and availability information more useful without creating false certainty.

## Features

- Establish a documented facility-verification standard
- Add reviewed and last-checked dates
- Add structured care-type taxonomy
- Add hours and after-hours information when reliable
- Add animal types served when available
- Add service capability fields such as emergency surgery, hospitalization, and exotics
- Add stronger data-source attribution
- Add stale-data warnings
- Add a simple correction or feedback mechanism
- Evaluate production veterinary-data providers and partnership options

## Phase 2 exit criteria

- Users can tell which facts are verified, source-provided, inferred, or unknown
- Critical emergency claims are never presented without confidence context
- Facility records have a defined source and review history

---

# Phase 3 — Expand trip planning

**Release concept:** `v0.4 – Route Planning`

## Goal

Support multi-stop travel rather than only one destination.

## Features

- Save multiple trips
- Add travel dates
- Add multiple destinations or overnight stops
- Search for care around each stop
- Display route-adjacent emergency options
- Identify gaps where emergency care is far away
- Add a trip overview with primary and backup care per stop
- Share a complete trip plan with a spouse, family member, sitter, or travel companion

## Phase 3 exit criteria

- A user can prepare care options for an entire road trip
- Each major stop has an identified primary and backup option
- The user can recognize stretches of travel with limited nearby care

---

# Phase 4 — Offline readiness and installation

**Release concept:** `v0.5 – Road Ready`

## Goal

Keep critical information available when connectivity is poor.

## Features

- Progressive Web App installation
- Offline application shell
- Locally cached active care plans
- Offline emergency card
- Cached facility details for saved plans
- Connectivity-status indicator
- Graceful fallback when live search is unavailable
- Optional limited-area map caching only through a provider and method that permits it

## Phase 4 exit criteria

- Saved plans remain accessible without a network connection
- The app communicates clearly when information cannot be refreshed
- No prohibited tile prefetching or unsupported public-API usage is introduced

---

# Phase 5 — Portable pet profile

**Release concept:** `v0.6 – Pet Travel Profile`

## Goal

Give the care plan the essential pet context needed during travel.

## Features

- Multiple pet profiles
- Species, breed, age, weight, and identifying information
- Medications and allergies
- Primary veterinarian contact
- Insurance information
- Vaccination and document attachments
- Emergency contact
- Shareable limited-information profile
- Privacy controls and clear local/cloud storage choices

## Phase 5 exit criteria

- A traveler can provide essential information without searching through separate files
- Sensitive information is shared intentionally and minimally

---

# Phase 6 — Accounts, synchronization, and partnerships

**Release concept:** `v1.0 – PawPath Travel Safety Platform`

## Goal

Move from a validated individual POC to a sustainable product.

## Potential features

- Optional user accounts
- Secure cloud synchronization
- Shared household plans
- Clinic and campground partnerships
- Verified facility portal
- Data-provider integrations
- Notifications about changed facility information
- Poison-control and emergency-resource integrations
- Analytics focused on product reliability and successful planning
- Sustainable operating and business model

## Preconditions before Phase 6

- Core planning workflow validated with real users
- Clear evidence that travelers value saved care plans and Emergency Mode
- Production data agreements identified
- Privacy and security architecture defined
- Public API usage replaced or formalized for production traffic

---

# Prioritized development backlog

## Now — build the shareable POC

1. Add Plan a Trip / Find Care Now modes
2. Add facility-detail and confidence states
3. Add primary and backup selection
4. Save the active plan in `localStorage`
5. Add saved-plan summary
6. Add Emergency Mode
7. Add curated demo data
8. Add printable emergency card
9. Refine accessibility and responsive behavior
10. Run a structured two-minute demo test

## Next — improve credibility

1. Define verification rules
2. Improve care-type classification
3. Add reliable hours and availability data
4. Evaluate production data sources
5. Add correction feedback

## Later — expand travel value

1. Multi-stop trips
2. Route-adjacent care
3. Offline readiness
4. Portable pet profile
5. Accounts and sharing

# Decision filter for future features

Before adding a feature, ask:

1. Does this help a traveler prepare before care is needed?
2. Does this reduce confusion during an urgent situation?
3. Does this improve confidence without overstating certainty?
4. Does this address a pet-travel need that general maps do not organize well?
5. Can the value be demonstrated clearly in the current product story?

If the answer is no, the feature should not displace the care-plan and emergency-readiness roadmap.