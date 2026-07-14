# PawPath ChatGPT Project Setup

This folder contains the durable context package for a dedicated PawPath ChatGPT Project.

## Recommended setup

### 1. Create the project

In ChatGPT:

1. Select **New project** in the sidebar.
2. Name it **PawPath Product & Development**.
3. Choose a forest-green color and a paw or map-style icon.
4. Choose **Project-only memory** when the option is presented.

Project-only memory keeps the workspace focused on PawPath chats, instructions, and files.

### 2. Add project instructions

Open the project menu, select **Project settings**, and paste the instruction block from:

- [`PROJECT_INSTRUCTIONS.md`](PROJECT_INSTRUCTIONS.md)

Project instructions apply only inside the PawPath Project and take precedence over global custom instructions there.

### 3. Add project sources

Start with the ten required sources listed in:

- [`SOURCE_MANIFEST.md`](SOURCE_MANIFEST.md)

The first three are the most important handoff files:

- [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md)
- [`CURRENT_STATE.md`](CURRENT_STATE.md)
- [`ENGINEERING_WORKFLOW.md`](ENGINEERING_WORKFLOW.md)

Then add the existing product and roadmap documents from the parent `docs` folder.

### 4. Move relevant chats

Move the active PawPath development conversation into the new project so its decisions and implementation history remain available alongside the curated sources.

Avoid moving unrelated mapping, branding, or other product conversations unless they directly inform PawPath.

### 5. Connect GitHub during implementation chats

Use the connected GitHub repository as the current implementation source:

- `jeffthomasiii/pawpath`

Uploaded project files provide stable context, but current `main`, active issues, and pull requests should determine the actual implementation state.

### 6. Start focused conversations

Use separate chats for product strategy, feature implementation, bugs, UX, data trust, and release readiness.

Suggested starting prompts are in:

- [`STARTER_PROMPTS.md`](STARTER_PROMPTS.md)

## Package contents

| File | Purpose |
|---|---|
| `PROJECT_INSTRUCTIONS.md` | Paste-ready ChatGPT Project instructions |
| `PROJECT_BRIEF.md` | Concise product definition and success criteria |
| `CURRENT_STATE.md` | Current implementation, roadmap status, architecture, and limitations |
| `ENGINEERING_WORKFLOW.md` | Branch, PR, validation, and documentation workflow |
| `SOURCE_MANIFEST.md` | Required and optional project sources |
| `STARTER_PROMPTS.md` | Reusable prompts for common PawPath workflows |

## Maintenance rule

After each major merged increment, update `CURRENT_STATE.md` and replace or refresh that source in the ChatGPT Project. Keep the project package concise; durable decisions are more useful than uploading every transcript.
