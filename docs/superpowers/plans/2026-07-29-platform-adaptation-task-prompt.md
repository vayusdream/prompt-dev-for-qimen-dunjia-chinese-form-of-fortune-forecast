# Platform Adaptation Task Prompt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a validated single-platform Platform Adaptation Task Prompt with separate Xiaohongshu and Douyin rule modules.

**Architecture:** Keep approval, grounding, preservation, risk, and response behavior in one `platform_text_adaptation` Task Prompt. Keep platform expression schemas in two supporting rule files selected by `target_platform`; each Generation Response produces exactly one Platform Version.

**Tech Stack:** Markdown Prompt Definitions, embedded JSON fixtures, Node.js ESM validators, Git.

## Global Constraints

- Prompt Version is exactly `creator-operations-base-v1`.
- Generation Task Type is exactly `platform_text_adaptation`.
- Generation mode is Grounded Creation Mode.
- Explicit Master Approval tied to the supplied Content Master is required.
- One response contains exactly one target platform.
- Xiaohongshu and Douyin require separate Platform Approval.
- Platform Approval never implies Publication Approval.
- No complete video, voice synthesis, editing, scheduling, or publishing is generated.

---

### Task 1: Add failing platform validators

**Files:**
- Create: `skills/developing-creator-operations-prompts/scripts/validate-platform-adaptation-prompt.mjs`
- Modify: `skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs`
- Modify: `skills/developing-creator-operations-prompts/scripts/validate-skill-structure.rb`

- [ ] Require the common Task Prompt and both platform rule files.
- [ ] Assert the task type, mode, Master Approval gate, one-platform invariant, Review Draft boundary, Platform Approval separation, and Publication Approval boundary.
- [ ] Parse and validate one Xiaohongshu response, one Douyin response, and one missing-approval response.
- [ ] Assert exact public envelopes, discriminated package schemas, IDs, references, risk visibility, complete Display Text, and preservation metadata.
- [ ] Assert no cross-platform package key appears in the wrong package.
- [ ] Wire the validator into complete package and Skill structure validation.
- [ ] Run the complete validator and observe RED because the Prompt files are absent.

### Task 2: Implement the Task Prompt and platform rules

**Files:**
- Create: `creator-operations/prompts/creator-operations-base-v1/platform-adaptation-prompt-definition.md`
- Create: `creator-operations/prompts/creator-operations-base-v1/xiaohongshu-platform-rules.md`
- Create: `creator-operations/prompts/creator-operations-base-v1/douyin-platform-rules.md`

- [ ] Define required inputs, untrusted-data handling, Master Approval validation, Grounded Creation Mode, and single-platform selection.
- [ ] Define Content Master preservation checks, source handling, conflict behavior, case safeguards, risk handling, and approval boundaries.
- [ ] Define the common Platform Version payload and the Xiaohongshu/Douyin discriminated package schemas.
- [ ] Define Xiaohongshu expression rules without introducing Douyin fields.
- [ ] Define Douyin expression rules without generating complete video, audio, or editing output.
- [ ] Add complete Xiaohongshu, Douyin, and missing Master Approval response examples.
- [ ] Run the focused and complete validators until GREEN.

### Task 3: Record evidence and review

**Files:**
- Create: `skill-evals/developing-creator-operations-prompts/real-task-validation/platform-adaptation-prompt-validation.md`

- [ ] Record every failed and successful validation command, exit code, and output with machine-specific paths sanitized.
- [ ] Record complete package, Skill structure, `git diff --check`, and authority-source diff evidence.
- [ ] Review the task for preservation, platform separation, risk visibility, case safety, and approval boundaries.
- [ ] Review the whole package for contract drift, mode mismatch, upstream approval inheritance, and platform leakage.
