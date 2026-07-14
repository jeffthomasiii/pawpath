# PawPath ChatGPT Project Starter Prompts

Use these prompts to begin focused chats inside the PawPath ChatGPT Project.

## Resume development

> Review the PawPath project sources, current `main` branch, Issue #13, and the next open Phase 1 issue. Summarize the current state, identify any conflicts between documentation and code, and recommend the smallest complete next increment. Do not modify the repository until the implementation plan is clear.

## Implement the next roadmap increment

> Implement the next PawPath Phase 1 increment from its GitHub issue. Read the current code and project sources first, create a focused branch, preserve existing behavior, validate shared globals and script order, open a PR with honest validation notes, merge only when GitHub reports it mergeable, and update the tracker and README.

## Investigate a bug

> Investigate this PawPath bug end to end: [describe bug]. Check the current `main` implementation and deployed behavior where possible. Find the underlying cause rather than repeatedly patching presentation symptoms. Explain the cause briefly, implement a focused fix on a branch, and state what still requires browser testing.

## Product decision

> Evaluate this PawPath product decision against the Why PawPath positioning, primary users, Plan a Trip workflow, Emergency Mode, privacy boundary, and v0.2 release goal: [decision]. Recommend one direction, explain the tradeoffs, and identify whether it belongs in the current POC or a later phase.

## UX review

> Review the current PawPath interface for clarity, mobile usability, accessibility, and whether the difference between Plan a Trip and Find Care Now is obvious. Prioritize the most consequential issues and propose a practical implementation sequence without expanding the v0.2 scope unnecessarily.

## Emergency Mode planning

> Design the PawPath Emergency Mode increment using Issue #9, the saved-plan summary, current-location search, and the existing Primary and Backup data. Define the user flow, visual hierarchy, state changes, edge cases, accessibility behavior, and acceptance criteria before writing code.

## Data and trust review

> Review PawPath’s facility sourcing and emergency-classification approach. Separate what OpenStreetMap explicitly confirms from what PawPath infers. Identify misleading states, missing confidence language, and responsible fallback behavior. Keep recommendations appropriate for a lightweight proof of concept.

## Release readiness

> Evaluate PawPath against the v0.2 release gate. Review the current code, Issues #9–#12, README, POC scope, and release plan. Produce a pass/fail checklist, identify blockers, and recommend the exact work order needed to make the POC shareable.

## Documentation update

> Update PawPath documentation after the latest merged increment. Ensure README current capabilities, next task, `CURRENT_STATE.md`, roadmap status, and Issue #13 agree with the current `main` branch. Do not describe features that are not actually implemented.

## Future architecture exploration

> Explore the likely production architecture for PawPath after the v0.2 POC, but do not modify the current roadmap. Compare options for facility data, verification, offline support, route planning, accounts, privacy, and scalable map infrastructure. Clearly separate near-term POC needs from later production decisions.
