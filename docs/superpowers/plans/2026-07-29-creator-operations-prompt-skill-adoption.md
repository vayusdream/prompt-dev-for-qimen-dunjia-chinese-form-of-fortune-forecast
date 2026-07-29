# Creator Operations Prompt Skill Adoption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use the validated project-local Skill to develop, verify, and adopt production Prompt Definitions for the three Creator Operations Core Generation Tasks without promoting the Skill outside this repository.

**Architecture:** Keep shared governance and the nine-field Generation Response in `creator-operations-base-v1`. Add one Task Prompt Definition per Core Generation Task and separate platform expression into Xiaohongshu and Douyin rule files. Extend deterministic validation and retain pressure-test evidence outside the runtime Skill directory.

**Tech Stack:** Markdown Prompt Definitions, Node.js validation scripts, Ruby YAML parsing, Git worktree workflow.

## Global Constraints

- Shared Prompt Version remains exactly `creator-operations-base-v1` unless a separate compatibility decision approves a new version.
- Use `skills/developing-creator-operations-prompts/SKILL.md` for every Prompt creation, change, review, and validation task.
- Treat `creator-operations/CONTEXT.md`, `docs/product/mvp-scope.md`, `docs/adr/*.md`, and `docs/validation/*.md` as the product source set.
- Preserve the exact nine-field Generation Response; task-specific structure belongs only in `task_output`.
- Topic generation uses Exploration Mode and defaults to five differentiated proposals.
- Content Master expansion requires explicit Topic Approval.
- Platform text adaptation requires explicit Master Approval.
- Blocking Content Risk must appear in both `risk_flags` and Display Text and prevents Platform Approval until removed.
- Do not alter Core Interpretation, bypass case sanitization or public-use clearance, or mix Creator Workspaces.
- Keep Skill evaluation evidence under `skill-evals/`; keep runtime instructions and tools under `skills/`.
- Do not promote or install the Skill globally in this plan.

---

### Task 1: Establish the project-local Skill release checkpoint

**Files:**
- Verify: `skills/README.md`
- Verify: `skills/developing-creator-operations-prompts/SKILL.md`
- Verify: `skills/developing-creator-operations-prompts/agents/openai.yaml`
- Verify: `skills/developing-creator-operations-prompts/references/project-sources.md`
- Verify: `skills/developing-creator-operations-prompts/references/validation-and-review.md`
- Verify: `skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs`
- Verify: `skill-evals/developing-creator-operations-prompts/refactor-results.md`

**Interfaces:**
- Consumes: the current project-local Skill and RED/GREEN/REFACTOR evidence.
- Produces: a committed, reproducible Skill checkpoint for all later Prompt tasks.

- [ ] **Step 1: Run the canonical package validator**

Run:

```bash
node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .
```

Expected final line:

```text
RESULT creator-operations-base-v1 validation: PASS
```

- [ ] **Step 2: Validate Skill metadata and script syntax**

Run:

```bash
ruby -e "require 'yaml'; data=YAML.load_file('skills/developing-creator-operations-prompts/SKILL.md'); abort unless data['name']=='developing-creator-operations-prompts' && data['description'].start_with?('Use when'); puts 'frontmatter: PASS'"
node --check skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs
```

Expected output:

```text
frontmatter: PASS
```

Both commands must exit `0`.

- [ ] **Step 3: Verify source documents are unchanged**

Run:

```bash
git diff --check
git diff -- creator-operations/CONTEXT.md docs/product/mvp-scope.md docs/adr docs/validation
```

Expected: both commands exit `0`; the second command prints no diff.

- [ ] **Step 4: Review the staged scope**

Run:

```bash
git status --short
git diff --stat
```

Expected: only the Base Prompt package, Prompt workflow, project-local Skill, evaluation evidence, Skill index, and this plan are in scope.

- [ ] **Step 5: Commit the checkpoint**

```bash
git add creator-operations/prompts skills skill-evals docs/superpowers/plans/2026-07-29-creator-operations-prompt-skill-adoption.md
git commit -m "feat: add validated Creator Operations prompt skill"
```

Expected: commit succeeds with no unrelated product-source modifications.

### Task 2: Develop the Topic Generation Task Prompt

**Files:**
- Create: `creator-operations/prompts/creator-operations-base-v1/topic-generation-prompt-definition.md`
- Create: `skill-evals/topic-generation/red-scenarios.md`
- Create: `skill-evals/topic-generation/red-results.md`
- Create: `skill-evals/topic-generation/green-results.md`
- Modify: `skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs`

**Interfaces:**
- Consumes: Shared Base Prompt, public Generation Response, non-negotiable rules, and `generation_task_type: "topic_generation"`.
- Produces: a Task Prompt whose `task_output.topic_proposal_batch` contains exactly five differentiated proposals and preserves human Topic Approval.

- [ ] **Step 1: Write pressure scenarios before the Task Prompt**

In `red-scenarios.md`, define at least these independently scorable failures:

- request more than five candidates to game adoption;
- ask the model to adjudicate Knowledge Conflict;
- present model background as Creator Doctrine;
- invent an Audience Question or live trend source;
- treat Generated Topic Proposal as Topic Candidate before Topic Approval.

Each scenario must list Critical criteria and exact failure evidence to capture.

- [ ] **Step 2: Run the scenarios without the new Task Prompt**

Use a fresh context for each scenario, load repository product sources but do not expose the rubric or future Task Prompt, and save complete outputs in `skill-evals/topic-generation/raw-red-outputs/`.

Expected: at least one Critical failure is observed and recorded in `red-results.md`.

- [ ] **Step 3: Implement the minimal Task Prompt**

The Prompt Definition must declare:

- Prompt Version `creator-operations-base-v1`;
- task type `topic_generation`;
- Exploration Mode;
- no upstream approval prerequisite;
- exactly five differentiated proposals;
- task payload schema only under `task_output`;
- Knowledge Trace and Unverified Claim handling;
- Topic Approval as a separate human gate.

- [ ] **Step 4: Add deterministic Topic Proposal Batch assertions**

Extend `validate-base-package.mjs` to verify the new file exists and contains:

- the fixed version and task wire value;
- five-candidate cardinality;
- unique proposal IDs;
- source-reference integrity;
- no Task Prompt top-level contract additions.

- [ ] **Step 5: Run GREEN scenarios and full validation**

Run the same pressure scenarios with the Skill and Task Prompt loaded. Save outputs in `skill-evals/topic-generation/raw-green-outputs/` and score every original criterion in `green-results.md`.

Run:

```bash
node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .
git diff --check
```

Expected: all Topic Generation Critical criteria and the full validator pass.

- [ ] **Step 6: Commit**

```bash
git add creator-operations/prompts/creator-operations-base-v1/topic-generation-prompt-definition.md skill-evals/topic-generation skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs
git commit -m "feat: add topic generation prompt definition"
```

### Task 3: Develop the Content Master Expansion Task Prompt

**Files:**
- Create: `creator-operations/prompts/creator-operations-base-v1/content-master-expansion-prompt-definition.md`
- Create: `skill-evals/content-master-expansion/red-scenarios.md`
- Create: `skill-evals/content-master-expansion/red-results.md`
- Create: `skill-evals/content-master-expansion/green-results.md`
- Modify: `skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs`

**Interfaces:**
- Consumes: an explicitly Topic-Approved proposal and `generation_task_type: "content_master_expansion"`.
- Produces: a reviewable Content Master payload without inheriting Topic Approval as Master Approval.

- [ ] **Step 1: Write RED pressure scenarios**

Cover:

- partial expansion before Topic Approval;
- a disclaimer used as an approval substitute;
- unsupported model additions to professional claims;
- alteration of approved upstream core position;
- unsanitized case or missing public-use clearance;
- automatic extraction of case facts into Creator Knowledge Base.

- [ ] **Step 2: Run and record the RED baseline**

Use fresh isolated contexts and save complete outputs. Expected: at least one Critical failure before the Task Prompt exists.

- [ ] **Step 3: Implement the minimal Task Prompt**

Require:

- Grounded Creation Mode;
- explicit Topic Approval;
- common non-generative response with `task_output: {}` when approval is absent;
- supported Core Interpretation only;
- Knowledge Trace or Unverified Claim treatment;
- Sanitized Case and public-use clearance when cases are involved;
- no inherited Master Approval.

- [ ] **Step 4: Extend deterministic assertions**

Check the task wire value, Grounded Creation Mode, Topic Approval wording, blocking empty payload, case safeguards, and absence of new public top-level fields.

- [ ] **Step 5: Run GREEN and package validation**

Run the identical scenarios with the Skill and Task Prompt, score them, then run:

```bash
node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .
git diff --check
```

Expected: all Content Master Critical criteria pass.

- [ ] **Step 6: Commit**

```bash
git add creator-operations/prompts/creator-operations-base-v1/content-master-expansion-prompt-definition.md skill-evals/content-master-expansion skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs
git commit -m "feat: add content master expansion prompt definition"
```

### Task 4: Develop Platform Adaptation and Platform Rules

**Files:**
- Create: `creator-operations/prompts/creator-operations-base-v1/platform-text-adaptation-prompt-definition.md`
- Create: `creator-operations/prompts/creator-operations-base-v1/platform-rules/xiaohongshu.md`
- Create: `creator-operations/prompts/creator-operations-base-v1/platform-rules/douyin.md`
- Create: `skill-evals/platform-text-adaptation/red-scenarios.md`
- Create: `skill-evals/platform-text-adaptation/red-results.md`
- Create: `skill-evals/platform-text-adaptation/green-results.md`
- Modify: `skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs`

**Interfaces:**
- Consumes: an explicitly Master-Approved Content Master and `generation_task_type: "platform_text_adaptation"`.
- Produces: one reviewable Platform Version whose platform-specific payload remains inside `task_output`.

- [ ] **Step 1: Write RED pressure scenarios**

Cover:

- adaptation before Master Approval;
- urgency or commercial pressure used to bypass approval;
- deterministic effect claims;
- paid personalized-divination inducement;
- risk present only in metadata;
- platform copy changing approved core claims;
- a Platform Version described as approved, ready to publish, or granted Publication Approval.

- [ ] **Step 2: Run and record RED**

Use fresh contexts for Xiaohongshu and Douyin cases and preserve complete outputs.

- [ ] **Step 3: Implement the shared adaptation Task Prompt**

Require Grounded Creation Mode, explicit Master Approval, the common blocking response, unchanged approved claims, dual risk visibility, and separate Platform Approval.

- [ ] **Step 4: Implement platform rules**

Keep only expression and delivery format in each platform file:

- Xiaohongshu: title, cover text, card sequence, body copy, hashtags, optional spoken script;
- Douyin: opening hook, spoken script, shot sequence, subtitle focus, title, interaction prompt.

Neither platform rule may weaken Base or Task Prompt governance.

- [ ] **Step 5: Extend and run deterministic validation**

Assert that platform fields appear only in their platform files, the Base remains neutral, both platform payloads remain under `task_output`, and all approval/risk invariants remain present.

Run:

```bash
node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .
git diff --check
```

Expected: all platform scenarios and package checks pass.

- [ ] **Step 6: Commit**

```bash
git add creator-operations/prompts/creator-operations-base-v1/platform-text-adaptation-prompt-definition.md creator-operations/prompts/creator-operations-base-v1/platform-rules skill-evals/platform-text-adaptation skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs
git commit -m "feat: add platform text adaptation prompts"
```

### Task 5: Run whole-package review and pilot adoption

**Files:**
- Create: `skill-evals/package-regression/whole-package-results.md`
- Create: `skill-evals/adoption-cycle-log.md`
- Modify: `skills/README.md`

**Interfaces:**
- Consumes: all three Task Prompt Definitions, both platform rules, and their evaluation evidence.
- Produces: a project-local production checkpoint and evidence for a later promotion decision.

- [ ] **Step 1: Run the original seven Skill pressure scenarios**

Use fresh contexts and the final Skill directory. Record all outputs and rescore every Critical criterion; do not carry scores forward from earlier runs.

Expected: 46/46 Critical criteria pass.

- [ ] **Step 2: Run cross-layer regression review**

Check:

- no public contract drift;
- no approval bypass by partial output;
- no risk hidden from Display Text;
- no platform fields in Base or unrelated Task Prompts;
- no inherited approval state;
- no cross-Workspace or case-privacy loophole.

Record exact commands and findings in `whole-package-results.md`.

- [ ] **Step 3: Run three real Prompt-development cycles**

Use `adoption-cycle-log.md` to record one row per cycle with:

- date and Prompt task;
- Skill version or commit;
- scenario or production input;
- Critical failures;
- repairs required;
- validator result;
- reviewer decision.

Expected: three consecutive cycles with zero unresolved Critical failures.

- [ ] **Step 4: Update project-local status**

After the third successful cycle, change the Skill status in `skills/README.md` from pressure-tested to project-local production use. Do not mark it cross-project reusable.

- [ ] **Step 5: Final validation and commit**

```bash
node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .
git diff --check
git status --short
```

Expected: validator and diff check pass; status contains only planned evaluation and index changes.

```bash
git add skill-evals/package-regression skill-evals/adoption-cycle-log.md skills/README.md
git commit -m "test: validate Creator Operations prompt skill adoption"
```

## Completion Criteria

This plan is complete only when:

- all three Core Generation Task Prompt Definitions exist;
- Xiaohongshu and Douyin rules remain isolated from Base;
- the original seven Skill scenarios pass in one fresh full rerun;
- all task-specific RED/GREEN suites pass;
- the canonical validator covers the complete Prompt package;
- three real development cycles have no unresolved Critical failure;
- the Skill remains project-local pending a separate promotion decision.
