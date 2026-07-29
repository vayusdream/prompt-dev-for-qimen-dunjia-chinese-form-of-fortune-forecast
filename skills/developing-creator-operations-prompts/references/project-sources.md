# Creator Operations Prompt Sources

Read sources in this order. Later files add constraints; they do not silently override an explicit higher-authority product decision.

## Required for every Prompt task

1. `creator-operations/CONTEXT.md` — canonical terms and Avoid boundaries.
2. `docs/product/mvp-scope.md` — workflow, human gates, platforms, and MVP exclusions.
3. Every file in `docs/adr/` — knowledge isolation, measurement, application boundary, Prompt decoupling, case sanitization, and Blocking Content Risk.
4. Every file in `docs/validation/` — Core Generation Tasks, production evidence, and metric-integrity constraints.

## Required when a common contract already exists

Read all files in the active version directory under `creator-operations/prompts/`, especially:

- Base Prompt Definition;
- Generation Response field specification;
- non-negotiable rules.

Treat that version as the compatibility baseline. Do not infer a new public field or wire value from a single Task Prompt.

## Authority checks

- Creator Doctrine outranks other Creator materials.
- Exploration Mode applies to topic generation.
- Grounded Creation Mode applies to Content Master and Platform Version.
- Topic Approval precedes Content Master expansion.
- Master Approval precedes Platform Adaptation.
- Platform Approval is platform-specific and never implies Publication Approval.
- Sanitized Case and public-use clearance precede case generation.
- Knowledge Conflict requires Creator judgment.
- Model additions without reliable Knowledge Trace are Unverified Claims.
- Blocking Content Risk prevents Platform Approval until removed.

Search the repository for the canonical term before changing its meaning or introducing a synonym.
