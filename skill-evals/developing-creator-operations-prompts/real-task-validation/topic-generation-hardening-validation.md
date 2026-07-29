# Topic Generation Prompt Hardening Validation

## Scope

- Prompt layer: downstream Task Prompt
- Prompt Version: `creator-operations-base-v1`
- Generation Task Type: `topic_generation`
- Generation mode: Exploration Mode
- Compared commit: `25ab645`
- Working directory: repository worktree root
- Local absolute path: intentionally omitted from this version-controlled report
- Path-resolution command: `git rev-parse --show-toplevel`

This trial hardened the existing Topic Generation Task Prompt without changing the shared public Generation Response envelope. It added deterministic coverage for missing required input, evidence-dependent source references, supported-claim grounding, non-empty platform targeting, and complete proposal review content in Display Text.

Machine-specific paths in the RED stack trace below are replaced with `[machine-specific path redacted]`. The command, exit code, error meaning, and all non-path output are preserved.

## RED evidence

Command:

```bash
node skills/developing-creator-operations-prompts/scripts/validate-topic-generation-prompt.mjs .
```

Exit code: `1`

Actual output:

```text
PASS Topic Prompt Definition exists
PASS task mode terminology approval and candidate invariant
file:///[machine-specific path redacted]/skills/developing-creator-operations-prompts/scripts/validate-topic-generation-prompt.mjs:15
  throw new Error(message);
        ^

Error: missing input handling: If `topic_discovery_prompt` is missing or unusable
    at fail (file:///[machine-specific path redacted]/skills/developing-creator-operations-prompts/scripts/validate-topic-generation-prompt.mjs:15:9)
    at file:///[machine-specific path redacted]/skills/developing-creator-operations-prompts/scripts/validate-topic-generation-prompt.mjs:47:31
    at ModuleJob.run (node:internal/modules/esm/module_job:439:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:643:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v24.18.0
```

Failure interpretation: the newly added assertion correctly detected that the Prompt Definition did not yet define a non-generative response for a missing or unusable Topic Discovery Prompt.

## Focused GREEN evidence

Command:

```bash
node skills/developing-creator-operations-prompts/scripts/validate-topic-generation-prompt.mjs .
```

Exit code: `0`

Actual output:

```text
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
```

## Complete package evidence

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

- A missing or unusable `topic_discovery_prompt` now produces the common non-generative response with empty `task_output`.
- Real Audience Questions and real Topic Signals require traceable response-local sources.
- A `supported` professional hypothesis requires a reliable source reference.
- Every successful proposal has at least one Primary Platform; omission defaults to both supported platforms.
- Display Text now exposes every proposal's full review surface instead of requiring application-side reconstruction.
- Generated Topic Proposals remain unapproved until human Topic Approval.

## Whole-package review

- No public envelope field or wire value changed.
- No Content Master or platform-adaptation payload logic entered the topic Task Prompt.
- Creator Doctrine remains authoritative; Knowledge Conflict remains unresolved until Creator judgment.
- Blocking Content Risk remains visible in both Display Text and `risk_flags` and does not incorrectly redefine Topic Approval.
- No cross-workspace source use, approval inheritance, publication claim, or fabricated Audience Question is permitted.
- Product authority sources were unchanged.

## Assumptions and unresolved evidence

- This is a deterministic static and fixture-based validation, not adoption evidence from a Production Prompt.
- The Pilot Creator must still exercise the Prompt through real Topic Discovery Prompts and record Adoption Decision and Topic Proposal Selection Rate.
- No new product decision is required for this hardening change.
