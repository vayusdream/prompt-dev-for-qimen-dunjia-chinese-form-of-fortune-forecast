# Topic Generation Prompt Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the reviewability and evidence-validation gaps found while trialing the Creator Operations Prompt development Skill against the Topic Generation Task Prompt.

**Architecture:** Keep the shared `creator-operations-base-v1` contract unchanged. Strengthen only the topic Task Prompt, its non-empty fixture, and its deterministic validator so the validator proves the callable artifact exposes complete review content and enforces traceable evidence classifications.

**Tech Stack:** Markdown Prompt Definitions, JSON fixtures embedded in Markdown, Node.js ESM validation scripts, Git.

## Global Constraints

- Prompt Version remains exactly `creator-operations-base-v1`.
- Generation Task Type remains exactly `topic_generation`.
- Generation mode remains Exploration Mode with wire value `exploration`.
- The public Generation Response retains exactly nine top-level fields.
- A successful response contains exactly five Generated Topic Proposal items.
- No Content Master or platform-adaptation output logic is added.
- Source documents under `creator-operations/CONTEXT.md`, `docs/product/`, `docs/adr/`, and `docs/validation/` are not modified.

---

### Task 1: Add failing semantic assertions

**Files:**
- Modify: `skills/developing-creator-operations-prompts/scripts/validate-topic-generation-prompt.mjs`
- Test: `skills/developing-creator-operations-prompts/scripts/validate-topic-generation-prompt.mjs`

**Interfaces:**
- Consumes: the Markdown Prompt Definition and its embedded non-empty JSON response.
- Produces: deterministic failure or `RESULT topic-generation-prompt validation: PASS`.

- [ ] **Step 1: Require explicit missing-input handling**

Add assertions that the Prompt Definition requires a non-generative response with `task_output: {}` when `topic_discovery_prompt` is absent or unusable.

- [ ] **Step 2: Require evidence-dependent reference cardinality**

For each fixture proposal, assert that `audience_question` and `topic_signal` classifications have at least one source reference and that every `supported` professional hypothesis has at least one source reference.

- [ ] **Step 3: Require complete Display Text**

For every fixture proposal, assert that Display Text contains its title, audience basis, core question, content angle, content goal, target platforms, timeliness basis, professional hypotheses or explicit absence, differentiation, and duplication note.

- [ ] **Step 4: Run the focused validator and verify RED**

Run:

```bash
node skills/developing-creator-operations-prompts/scripts/validate-topic-generation-prompt.mjs .
```

Expected: non-zero exit caused by the current Display Text omitting newly required review content.

### Task 2: Minimally harden the Prompt Definition

**Files:**
- Modify: `creator-operations/prompts/creator-operations-base-v1/topic-generation-prompt-definition.md`
- Test: `skills/developing-creator-operations-prompts/scripts/validate-topic-generation-prompt.mjs`

**Interfaces:**
- Consumes: Shared Base Prompt Definition, common Generation Response specification, and active Creator Workspace inputs.
- Produces: one callable `topic_generation` Generation Response with complete Display Text and a stable topic payload.

- [ ] **Step 1: Define missing Topic Discovery Prompt behavior**

Require the common non-generative response, empty `task_output`, visible explanation, and actionable blocking confirmation item.

- [ ] **Step 2: Tighten evidence rules**

Require valid non-empty references for real Audience Questions, real Topic Signals, and `supported` professional hypotheses. Require both Primary Platforms when no target platform is supplied.

- [ ] **Step 3: Expand Display Text requirements and fixture**

Require and demonstrate all proposal review dimensions in Display Text without changing the public envelope or task schema.

- [ ] **Step 4: Run the focused validator and verify GREEN**

Run:

```bash
node skills/developing-creator-operations-prompts/scripts/validate-topic-generation-prompt.mjs .
```

Expected: exit `0` and `RESULT topic-generation-prompt validation: PASS`.

### Task 3: Validate and record the Skill trial

**Files:**
- Create: `skill-evals/developing-creator-operations-prompts/real-task-validation/topic-generation-hardening-validation.md`

**Interfaces:**
- Consumes: the final Prompt Definition, validator, source documents, and Git diff.
- Produces: copy-pasteable evidence for the real Prompt development trial.

- [ ] **Step 1: Run the complete package validator**

Run:

```bash
node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .
```

Expected: exit `0`, including Topic Generation validation PASS.

- [ ] **Step 2: Run Git integrity checks**

Run:

```bash
git diff --check
git diff --exit-code -- creator-operations/CONTEXT.md docs/product/mvp-scope.md docs/adr docs/validation
```

Expected: both commands exit `0` with no output.

- [ ] **Step 3: Record literal evidence**

Record the absolute working directory, compared commit, exact commands, exit codes, and literal outputs. Record assumptions and any remaining product decisions without claiming the Prompt has Production Prompt adoption evidence.

- [ ] **Step 4: Review the task and whole package**

Confirm no contract drift, approval bypass, fabricated evidence, Knowledge Conflict adjudication, cross-workspace leakage, hidden Blocking Content Risk, or platform-specific output logic.
