# Content Master Task Prompt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a production-oriented Content Master Task Prompt compatible with `creator-operations-base-v1`, including a complete cross-platform master draft and deterministic semantic validation.

**Architecture:** Add one downstream Prompt Definition for `content_master_expansion` and one focused Node.js validator invoked by the existing Base package validator. Keep governance and the nine-field public envelope unchanged; place the entire structured Content Master under `task_output.content_master`.

**Tech Stack:** Markdown Prompt Definitions, embedded JSON fixture, Node.js ESM validators, Git.

## Global Constraints

- Prompt Version is exactly `creator-operations-base-v1`.
- Generation Task Type is exactly `content_master_expansion`.
- Generation mode is Grounded Creation Mode with wire value `grounded_creation`.
- Explicit Topic Approval is required before generation.
- The result is a Review Draft and never implies Master Approval.
- No Xiaohongshu- or Douyin-specific package fields are allowed.
- Product authority files are read-only.

---

### Task 1: Add the failing validator

**Files:**
- Create: `skills/developing-creator-operations-prompts/scripts/validate-content-master-prompt.mjs`
- Modify: `skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs`
- Modify: `skills/developing-creator-operations-prompts/scripts/validate-skill-structure.rb`

**Interfaces:**
- Consumes: `creator-operations/prompts/creator-operations-base-v1/content-master-prompt-definition.md`.
- Produces: semantic PASS output or a non-zero validation failure.

- [ ] Assert the Prompt file, version, task type, Grounded Creation Mode, Topic Approval prerequisite, Review Draft boundary, and Master Approval next step.
- [ ] Parse one non-empty example and assert the exact shared nine-field envelope.
- [ ] Assert the exact `task_output.content_master` shape and nested object keys.
- [ ] Assert valid, unique IDs and response-local references for professional claims and argument sections.
- [ ] Assert Display Text contains the complete cross-platform draft, structure, claims, expression boundaries, conflicts, risks, and approval next step.
- [ ] Assert the Task Prompt does not contain platform-package fields.
- [ ] Invoke the focused validator from the Base package validator and require it in the Skill structure validator.
- [ ] Run the Base package validator and observe RED because the Prompt Definition is absent.

### Task 2: Implement the Content Master Prompt

**Files:**
- Create: `creator-operations/prompts/creator-operations-base-v1/content-master-prompt-definition.md`

**Interfaces:**
- Consumes: one approved Topic Candidate, explicit Topic Approval evidence, active-workspace knowledge, optional Creator instructions, and cleared Sanitized Cases.
- Produces: one `content_master_expansion` Generation Response containing `task_output.content_master`.

- [ ] Define scope, required inputs, optional inputs, exclusions, and untrusted-data handling.
- [ ] Define the non-generative response for absent or uncertain Topic Approval.
- [ ] Define Creator Doctrine precedence, professional-claim statuses, Knowledge Trace, Knowledge Conflict, case safeguards, and Blocking Content Risk handling.
- [ ] Define the exact Content Master schema: source topic, audience, question, goal, Creator position, professional claims, argument structure, cross-platform draft, expression boundaries, and source IDs.
- [ ] Require a complete Creator-facing Display Text and a human Master Approval confirmation item.
- [ ] Add a non-empty fixture covering supported and unverified claims, unresolved conflict, risk visibility, source relationships, complete draft content, and approval boundaries.
- [ ] Run the focused and complete validators until GREEN.

### Task 3: Record and review the real Skill trial

**Files:**
- Create: `skill-evals/developing-creator-operations-prompts/real-task-validation/content-master-prompt-validation.md`

**Interfaces:**
- Consumes: terminal evidence, compared commit, final Prompt Definition, and Git diff.
- Produces: sanitized, reproducible validation evidence and review findings.

- [ ] Record the RED and GREEN commands, exits, and outputs.
- [ ] Run and record `node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .`.
- [ ] Run and record `ruby skills/developing-creator-operations-prompts/scripts/validate-skill-structure.rb skills/developing-creator-operations-prompts`.
- [ ] Run and record `git diff --check`.
- [ ] Confirm authority sources are unchanged with `git diff --exit-code -- creator-operations/CONTEXT.md docs/product/mvp-scope.md docs/adr docs/validation`.
- [ ] Review the Task Prompt and then the whole package for contract drift, approval bypass, source fabrication, conflict adjudication, privacy bypass, hidden risk, and platform leakage.
