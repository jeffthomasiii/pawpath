# PawPath ChatGPT Project Source Manifest

Last updated: September 16, 2026

## Project

**PawPath Product & Development**

## Source-of-truth order

For implementation questions, use this order:

1. Current `main` branch code
2. Active GitHub issues and Phase 1 tracking issue
3. `CURRENT_STATE.md`
4. Product vision, POC scope, roadmap, implementation notes, and repository audit
5. README
6. Older chats or historical assumptions

## Required project sources

1. `PROJECT_BRIEF.md` — concise product definition, audience, workflows, success criteria, and safety boundaries
2. `CURRENT_STATE.md` — active runtime architecture, current capabilities, validation status, and immediate next step
3. `ENGINEERING_WORKFLOW.md` — repository workflow, coding constraints, validation expectations, and merge process
4. `../REPO_AUDIT_2026-09-16.md` — post-premium-redesign architecture/functionality reconciliation
5. `../WHY_PAWPATH.md` — product positioning and competitive distinction
6. `../PRODUCT_VISION.md` — mission, jobs to be done, principles, and product direction
7. `../BRAND_GUIDE.md` — durable brand/voice/accessibility guidance; current UI may intentionally evolve beyond older visual examples
8. `../POC_SCOPE.md` — proof-of-concept requirements and release criteria
9. `../ROADMAP.md` — phased development plan and current Phase 1 sequence
10. `../IMPLEMENTATION_NOTES.md` — historical/state/data architecture guidance; verify against current main before implementation
11. `../PHASE_1_RELEASE_PLAN.md` — Phase 1 increments and release gate; verify status against current main/issues
12. `../../README.md` — public repository overview and current active architecture

## Important live references

- Repository: `jeffthomasiii/pawpath`
- Phase 1 tracker: Issue #13
- Repository/PWA reconciliation: Issue #75
- Current next step after reconciliation: deployed smoke testing, then mobile screen-by-screen review

## Architecture caution

The repository contains both the current premium multi-page PWA and older single-page implementation modules. File presence is not proof that a module is loaded. Inspect the current page entry points and script/style loading before describing or modifying active behavior.

The canonical local-storage key remains `pawpath.activeCarePlan.v1`. Current premium pages should preserve the established nested `trip`, `traveler`, and `facilities` shape.

## Keeping sources current

After each significant merged increment:

1. Update `CURRENT_STATE.md`.
2. Update README when public capabilities, architecture, limitations, or next task change.
3. Update the repository audit when architecture/loading assumptions materially change.
4. Update Roadmap/Next Step when the immediate sequence changes.
5. Replace stale uploaded project copies of these documents when appropriate.
6. Avoid treating old implementation notes or chats as more authoritative than current `main`.

## Suggested chat organization

Keep separate chats for product strategy/roadmap, feature implementation, bugs/QA, UX/interface design, data/trust, documentation/release notes, and future production architecture.