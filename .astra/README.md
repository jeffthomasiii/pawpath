# PawPath Astra Development Team

This directory defines the operating contract for PawPath's Astra-assisted development team.

Phase 1 goal: given a GitHub issue, GPT-6 Astra should inspect the repository, delegate research/planning/implementation/review work to subagents, produce a validated patch and evidence bundle, and let GitHub Actions prepare a draft pull request for human review.

## Phase 1 boundaries

- Human merge is always required.
- Pricing, payments, secrets, authentication, privacy policy, destructive data changes, and veterinary/medical claims are red-gated.
- Agents may not weaken the safety language that PawPath does not diagnose, triage, guarantee availability, or replace professional veterinary care.
- The first automated runs are issue-triggered by manual workflow dispatch.
- Runtime changes are applied from a generated patch; the hosted agent does not receive GitHub write credentials.

## Required output artifacts

A successful run should publish these files under `/workspace/outputs`:

- `opportunity.json`
- `specification.json`
- `builder-a.json`
- `builder-b.json`
- `review.json`
- `qa.md`
- `changes.patch`
- `summary.md`

The JSON files must conform to the schemas in `.astra/contracts/`.

## Operating sequence

1. Root reads the issue and repository rules.
2. Scout establishes the problem, evidence, constraints, and business connection.
3. Architect converts the opportunity into a bounded implementation specification.
4. Builder A and Builder B work in parallel on independent implementation/verification slices.
5. Critic reviews the resulting diff against the original specification.
6. QA verifies repository checks and browser behavior when the task makes browser behavior relevant.
7. Root remediates failed criteria and repeats review as needed.
8. Root emits the final patch and evidence bundle.
9. GitHub Actions applies the patch, runs local guardrails, and opens a draft PR.

See `team.yaml`, `autonomy.yaml`, `economics.yaml`, role prompts, contracts, and policies for the full rules.