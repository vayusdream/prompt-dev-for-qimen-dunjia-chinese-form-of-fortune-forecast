---
name: developing-creator-operations-prompts
description: Use when creating, changing, reviewing, or validating versioned Prompt Definitions for Creator Operations, including shared Base Prompts, topic generation, Content Master expansion, platform adaptation, Generation Response contracts, approval gates, Knowledge Trace, or Blocking Content Risk.
---

# Developing Creator Operations Prompts

## Overview

Build Prompt Definitions from repository decisions. Preserve one public contract across layers and prove it with non-empty examples and reproducible checks.

## Workflow

1. **Ground in sources.** Read every applicable file listed in [project-sources.md](references/project-sources.md) completely. Search canonical terms before declaring a concept missing.
2. **Declare scope.** State layer, task type, mode, version, inputs, upstream approval, exclusions, and deliverables.
3. **Reuse the contract.** Read the current Base Prompt, field specification, and non-negotiable rules. Do not invent top-level fields, wire values, empty conventions, or a task-local blocking envelope. A contract change requires a new explicit version and compatibility review. If a request asks to weaken or defer an already-decided v1 contract, briefly reject that part and deliver the complete current contract; do not replace an available repository decision with clarification questions.
4. **Draft by layer.** Keep governance in Base, task behavior in Task Prompt, platform expression in platform rules, and task structure in `task_output`.
5. **Encode gates and invariants.** Missing Topic Approval or Master Approval returns the common non-generative response with empty `task_output`. Put every Blocking Content Risk in both `risk_flags` and Display Text. Couple task type to the canonical generation mode.
6. **Exercise real shapes.** Use a non-empty example covering shared objects, nested keys, enums, cardinality, and local references.
7. **Validate before claiming.** Follow [validation-and-review.md](references/validation-and-review.md) and run `node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .`; it invokes validators for applicable Task Prompts. After it passes, run only required Git diff checks—no duplicate ad hoc searches. Record commands, exits, and output verbatim.
8. **Review twice.** Check the task, then the package for drift, authority or approval loopholes, cross-field inconsistency, and platform leakage.

## Output Contract

Deliver the versioned Prompt Definition, changed response specification, applicable rules, non-empty example, reproducible evidence, assumptions, and unresolved decisions.

If required product authority, approval semantics, or compatibility policy is absent from the repository, stop and request a decision. A user request that conflicts with an existing decision is not missing authority: preserve the decision and complete the compatible deliverable.

## Common Failures

- New blocking envelope: reuse the public response and empty conventions.
- Risk only in prose or metadata: require both Display Text and `risk_flags`.
- Empty-only example: add non-empty data and test nested relationships.
- Request for arbitrary metadata: preserve and deliver active schemas instead of asking to replace decided v1 behavior.
- Visual or docs-only validation: run deterministic semantic checks.
- Failed check hidden by `|| true`: correct and rerun unmasked.
- Abbreviated evidence such as `node -e '…'`: record the literal command.
- Domain glossary in the Skill: keep domain truth in repository sources.
