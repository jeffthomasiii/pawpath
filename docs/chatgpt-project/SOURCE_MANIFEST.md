# PawPath ChatGPT Project Source Manifest

## Recommended project name

**PawPath Product & Development**

## Recommended project memory

Choose **Project-only memory** when creating the ChatGPT Project so PawPath work remains anchored to this project’s chats, instructions, and sources rather than unrelated conversations.

## Required sources

Add these first:

1. `PROJECT_BRIEF.md`
   - concise product definition, audience, workflows, success criteria, and safety boundaries
2. `CURRENT_STATE.md`
   - implementation handoff, current roadmap status, architecture, and known limitations
3. `ENGINEERING_WORKFLOW.md`
   - repository workflow, coding constraints, validation expectations, and merge process
4. `../WHY_PAWPATH.md`
   - complete product positioning and competitive distinction
5. `../PRODUCT_VISION.md`
   - mission, jobs to be done, principles, and product direction
6. `../BRAND_GUIDE.md`
   - approved brand positioning, voice, palette, UI shape strategy, accessibility expectations, and feature-decision guardrails
7. `../POC_SCOPE.md`
   - proof-of-concept requirements and release criteria
8. `../ROADMAP.md`
   - phased development plan
9. `../IMPLEMENTATION_NOTES.md`
   - state, storage, data, confidence, and architecture guidance
10. `../PHASE_1_RELEASE_PLAN.md`
   - increments and release gate
11. `../../README.md`
   - public repository overview and current capabilities

## Brand use in ChatGPT

For feature proposals, UX recommendations, mockups, documentation, and implementation planning, use `../BRAND_GUIDE.md` as the source for:

- calm, practical, transparent voice
- approved Pine / Sage / Mist / Stone / Amber / Ink / Danger palette
- preservation of the established PawPath mark and wordmark
- open layouts for orientation
- selective cards for key decisions
- list rows for scan-heavy results
- modest rounding and minimal shadows
- accessible, product-first emphasis

Brand guidance does not override product safety, current `main` behavior, active issue acceptance criteria, or the immediate Phase 1 roadmap.

## Optional sources

Add these when useful:

- `STARTER_PROMPTS.md`
- `../DEMO_SCRIPT.md`
- `../BACKLOG.md`
- `../ISSUE_TEMPLATES.md`
- selected screenshots of the current desktop and mobile interface
- saved ChatGPT responses that capture important product decisions

## GitHub as the live source of truth

The uploaded Markdown files provide durable context, but current implementation questions should also use the connected GitHub repository because code and issues may change after the files were uploaded.

Important live references:

- Repository: `jeffthomasiii/pawpath`
- Phase 1 tracker: Issue #13
- Current next issue: Issue #9, Full Emergency Mode

## Keeping project sources current

After each significant merged increment:

1. Update `CURRENT_STATE.md` in the repository.
2. Update the README when public capabilities or the next task change.
3. Replace the old uploaded `CURRENT_STATE.md` in the ChatGPT Project, or save the updated content as a new project source.
4. Replace the uploaded `BRAND_GUIDE.md` when approved brand decisions change.
5. Save important decision responses to the project sources when they establish lasting product direction.
6. Avoid uploading every implementation chat; keep durable decisions and concise handoffs instead.

## Suggested project organization

Use separate chats for:

- Product strategy and roadmap
- Current feature implementation
- Bugs and QA
- UX and interface design
- Data sources and trust
- Documentation and release notes
- Future architecture and production planning

This keeps individual conversations focused while allowing the Project to retain shared files and context.
