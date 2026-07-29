# Content Master Task Prompt Validation

## Scope

- Prompt Version: `creator-operations-base-v1`
- Generation Task Type: `content_master_expansion`
- Generation mode: Grounded Creation Mode
- Upstream gate: Topic Approval
- Downstream gate: Master Approval
- Compared commit: `28de8ef`
- Working directory: repository worktree root
- Local absolute path: intentionally omitted from this version-controlled report
- Path-resolution command: `git rev-parse --show-toplevel`

Machine-specific paths in failure stacks are replaced with `[machine-specific path redacted]`. Commands, exit codes, error meanings, and non-path outputs are preserved.

## RED: Prompt Definition absent

Command:

```bash
node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .
```

Exit code: `1`

Actual output:

```text
PASS expected deliverables exist
PASS version consistency
PASS non-empty JSON parses
PASS public envelope keys and wire values
PASS nested keys types enums and cardinality
PASS unique response-local IDs and references
PASS blocking risk severity and Display Text visibility
PASS approval gates and dual risk visibility wording
PASS shared Base Prompt task and platform neutrality
PASS three task simulations reuse one envelope
PASS Topic Prompt Definition exists
PASS task mode terminology approval and candidate invariant
PASS missing Topic Discovery Prompt handling
PASS non-empty topic example parses
PASS public envelope and Exploration Mode
PASS five proposal task payload shape
PASS complete proposal review content in Display Text
PASS proposal response-local references
PASS conflict preservation and human Topic Approval
RESULT topic-generation-prompt validation: PASS
PASS Topic Generation Task Prompt validator

Error: missing Content Master Prompt Definition: [machine-specific path redacted]/creator-operations/prompts/creator-operations-base-v1/content-master-prompt-definition.md
    at fail ([machine-specific path redacted]/skills/developing-creator-operations-prompts/scripts/validate-content-master-prompt.mjs:15:9)
    at [machine-specific path redacted]/skills/developing-creator-operations-prompts/scripts/validate-content-master-prompt.mjs:24:27

Node.js v24.18.0

Error: Command failed: node [machine-specific path redacted]/skills/developing-creator-operations-prompts/scripts/validate-content-master-prompt.mjs [machine-specific path redacted]
```

Interpretation: the new validator was wired into the complete package and failed only because the required Content Master Prompt Definition did not exist.

## Failed GREEN attempt: punctuation-sensitive Display Text comparison

Command:

```bash
node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .
```

Exit code: `1`

Actual output:

```text
PASS expected deliverables exist
PASS version consistency
PASS non-empty JSON parses
PASS public envelope keys and wire values
PASS nested keys types enums and cardinality
PASS unique response-local IDs and references
PASS blocking risk severity and Display Text visibility
PASS approval gates and dual risk visibility wording
PASS shared Base Prompt task and platform neutrality
PASS three task simulations reuse one envelope
PASS Topic Prompt Definition exists
PASS task mode terminology approval and candidate invariant
PASS missing Topic Discovery Prompt handling
PASS non-empty topic example parses
PASS public envelope and Exploration Mode
PASS five proposal task payload shape
PASS complete proposal review content in Display Text
PASS proposal response-local references
PASS conflict preservation and human Topic Approval
RESULT topic-generation-prompt validation: PASS
PASS Topic Generation Task Prompt validator
PASS Content Master Prompt Definition exists
PASS task mode terminology and approval boundaries
PASS public envelope and Grounded Creation Mode
PASS missing Topic Approval non-generative response
PASS Content Master core shape
PASS claims structure draft and expression boundaries
PASS references conflicts risks and Master Approval

Error: Display Text omits Content Master review content: 知识讲解可以解释概念、方法和历史。
    at fail ([machine-specific path redacted]/skills/developing-creator-operations-prompts/scripts/validate-content-master-prompt.mjs:15:9)
    at [machine-specific path redacted]/skills/developing-creator-operations-prompts/scripts/validate-content-master-prompt.mjs:297:5

Node.js v24.18.0

Error: Command failed: node [machine-specific path redacted]/skills/developing-creator-operations-prompts/scripts/validate-content-master-prompt.mjs [machine-specific path redacted]
```

Interpretation: the content was present, but the structured key point ended with a Chinese full stop while Display Text joined it with a semicolon. The review-content comparison was narrowed to normalize punctuation and whitespace only; schema, types, IDs, references, and substantive text remain strict.

## Complete GREEN evidence

Command:

```bash
node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .
```

Exit code: `0`

Actual output:

```text
PASS expected deliverables exist
PASS version consistency
PASS non-empty JSON parses
PASS public envelope keys and wire values
PASS nested keys types enums and cardinality
PASS unique response-local IDs and references
PASS blocking risk severity and Display Text visibility
PASS approval gates and dual risk visibility wording
PASS shared Base Prompt task and platform neutrality
PASS three task simulations reuse one envelope
PASS Topic Prompt Definition exists
PASS task mode terminology approval and candidate invariant
PASS missing Topic Discovery Prompt handling
PASS non-empty topic example parses
PASS public envelope and Exploration Mode
PASS five proposal task payload shape
PASS complete proposal review content in Display Text
PASS proposal response-local references
PASS conflict preservation and human Topic Approval
RESULT topic-generation-prompt validation: PASS
PASS Topic Generation Task Prompt validator
PASS Content Master Prompt Definition exists
PASS task mode terminology and approval boundaries
PASS public envelope and Grounded Creation Mode
PASS missing Topic Approval non-generative response
PASS Content Master core shape
PASS claims structure draft and expression boundaries
PASS references conflicts risks and Master Approval
PASS complete Content Master review content in Display Text
PASS no platform package field leakage
RESULT content-master-prompt validation: PASS
PASS Content Master Task Prompt validator
RESULT creator-operations-base-v1 validation: PASS
```

Command:

```bash
ruby skills/developing-creator-operations-prompts/scripts/validate-skill-structure.rb skills/developing-creator-operations-prompts
```

Exit code: `0`

Actual output:

```text
PASS SKILL.md frontmatter and directory name
PASS minimal Skill directory layout
PASS direct reference links resolve
PASS agents/openai.yaml interface metadata
PASS required deterministic validators exist
RESULT developing-creator-operations-prompts structure: PASS
```

## Git integrity evidence

Command:

```bash
git diff --check
```

Exit code: `0`

Actual output: no output.

Command:

```bash
git diff --exit-code -- creator-operations/CONTEXT.md docs/product/mvp-scope.md docs/adr docs/validation
```

Exit code: `0`

Actual output: no output.

## Task review

- The task requires explicit Topic Approval tied to the supplied Topic Candidate.
- Missing or uncertain approval returns the shared non-generative response with empty `task_output`.
- The approved proposal's `audience_basis` classification is preserved, so Creator input or a model hypothesis cannot be relabeled as a real Audience Question.
- A missing Creator position is not guessed.
- The Content Master contains a complete platform-neutral draft plus structured audience, question, goal, Creator position, claims, argument, boundaries, and source links.
- Supported claims require reliable Knowledge Trace; model-supplied or conflicted claims remain Unverified Claims.
- Knowledge Conflict remains unresolved and blocks approval of the affected professional choice until Creator judgment.
- The result is a Review Draft and requests Master Approval without claiming it.
- Blocking Content Risk is visible in both Display Text and `risk_flags`.
- Case use is limited to Sanitized Cases with public-use clearance and supplied Core Interpretation.

## Whole-package review

- The shared nine-field Generation Response contract and wire values are unchanged.
- Topic generation remains Exploration Mode; Content Master expansion uses Grounded Creation Mode.
- No platform-package field entered the Content Master payload.
- Topic Approval does not imply Master Approval, Platform Approval, or Publication Approval.
- Creator Doctrine remains authoritative, Historical Expression is not promoted, and cross-workspace data remains excluded.
- Product authority files are unchanged.

## Assumptions and unresolved evidence

- The fixture demonstrates deterministic compatibility and review behavior; it is not a Production Prompt adoption result.
- The Pilot Creator must still test the Task Prompt with real approved Topic Candidates and record Adoption Decision.
- Platform-specific expression remains intentionally deferred to the Platform Adaptation Task Prompt.
