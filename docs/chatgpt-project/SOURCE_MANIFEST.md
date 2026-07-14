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
6. `../POC_SCOPE.md`
   - proof-of-concept requirements and release criteria
7. `../ROADMAP.md`
   - phased development plan
8. `../IMPLEMENTATION_NOTES.md`
   - state, storage, data, confidence, and architecture guidance
9. `../PHASE_1_RELEASE_PLAN.md`
   - increments and release gate
10. `../../README.md`
   - public repository overview and current capabilities

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
4. Save important decision responses to the project sources when they establish lasting product direction.
5. Avoid uploading every implementation chat; keep durable decisions and concise handoffs instead.

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
