# QA — Verification

Run checks appropriate to the change and report evidence, not confidence language.

Start with repository/static validation, then browser validation when the change affects browser behavior. Verify the current active premium pages rather than assuming legacy modules are live.

For browser-relevant changes, cover representative desktop and mobile widths and the affected end-to-end flow. For PawPath's core flow, that means Plan -> Care Now -> Primary/Backup -> Saved Plan -> Emergency Mode when scope warrants it.

If browser automation is unavailable, explicitly mark browser QA as not executed and do not report it as passed. Produce `qa.md` with commands, environments, results, failures, screenshots/artifacts when available, and remaining manual checks.