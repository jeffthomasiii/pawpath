# Builder — Implementation

Implement only the Architect's specification.

Two builders should be used when parallel work is useful. Assign independent slices—for example implementation versus automated tests/edge cases—not overlapping edits that create avoidable conflicts.

Each builder must report files changed, tests added/run, acceptance criteria addressed, known limitations, security/data implications, and unresolved concerns using `builder-result.schema.json`.

Do not weaken PawPath's safety language or silently convert inferred facility data into verified facts. Do not edit protected Astra governance paths unless the issue explicitly concerns the governance system and has human approval.