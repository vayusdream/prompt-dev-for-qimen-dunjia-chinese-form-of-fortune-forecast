# Platform Adaptation Task Prompt Validation

## Scope

- Prompt Version: `creator-operations-base-v1`
- Generation Task Type: `platform_text_adaptation`
- Generation mode: Grounded Creation Mode
- Upstream gate: Master Approval
- Output gates: platform-specific Platform Approval
- Compared commit: `e208a86`
- Working directory: repository worktree root
- Local absolute path: intentionally omitted

Machine-specific paths in failure output are replaced with `[machine-specific path redacted]`; commands, exit codes, and semantic errors are preserved.

## RED: Prompt files absent

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
PASS complete Content Master review content in Display Text
PASS no platform package field leakage
RESULT content-master-prompt validation: PASS
PASS Content Master Task Prompt validator

Error: missing task Prompt Definition: [machine-specific path redacted]/creator-operations/prompts/creator-operations-base-v1/platform-adaptation-prompt-definition.md
    at fail ([machine-specific path redacted]/skills/developing-creator-operations-prompts/scripts/validate-platform-adaptation-prompt.mjs:17:9)
    at [machine-specific path redacted]/skills/developing-creator-operations-prompts/scripts/validate-platform-adaptation-prompt.mjs:27:29

Node.js v24.18.0
```

## Failed GREEN attempt: fixture extractor

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
PASS complete Content Master review content in Display Text
PASS no platform package field leakage
RESULT content-master-prompt validation: PASS
PASS Content Master Task Prompt validator
PASS Platform Adaptation Task Prompt and platform rules exist
PASS task mode single-platform and approval boundaries

Error: missing example: Xiaohongshu Generation Response example
    at fail ([machine-specific path redacted]/skills/developing-creator-operations-prompts/scripts/validate-platform-adaptation-prompt.mjs:17:9)
    at parseExample ([machine-specific path redacted]/skills/developing-creator-operations-prompts/scripts/validate-platform-adaptation-prompt.mjs:80:15)

Node.js v24.18.0
```

Interpretation: the example existed, but the validator's dynamic regular expression over-escaped the fenced JSON marker. The extractor was corrected and rerun without weakening any schema assertion.

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
PASS Platform Adaptation Task Prompt and platform rules exist
PASS task mode single-platform and approval boundaries
PASS Xiaohongshu Douyin and approval examples parse
PASS public envelope and Grounded Creation Mode
PASS shared metadata keys enums IDs and references
PASS missing Master Approval non-generative response
PASS common Platform Version shape and preservation
PASS Xiaohongshu Package and complete Display Text
PASS Douyin Package and complete Display Text
PASS risk visibility and approval boundaries
RESULT platform-adaptation-prompt validation: PASS
PASS Platform Adaptation Task Prompt validator
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

- One Generation Response produces one Platform Version for one target platform.
- Explicit Master Approval must identify the exact Content Master version.
- Content Master audience, question, Creator position, professional claims, and expression boundaries are preserved.
- Platform Voice Rule changes expression only and cannot override Creator Doctrine.
- Xiaohongshu and Douyin packages have distinct schemas and distinct Platform Approval decisions.
- Risky requested language is excluded from the package and remains visible in Display Text and `risk_flags`.
- Douyin output stops at filming- and layout-ready text; it does not generate video, voice, editing, scheduling, or publication.

## Whole-package review

- All three Core Generation Tasks reuse the same nine-field Generation Response.
- Topic generation remains Exploration Mode; Content Master and Platform Version use Grounded Creation Mode.
- Topic Approval, Master Approval, Platform Approval, and Publication Approval remain separate human decisions.
- No platform package field entered the shared Base Prompt or Content Master payload.
- Product authority files are unchanged.

## Assumptions and unresolved evidence

- The fixtures prove static compatibility, not Production Prompt adoption.
- The Pilot Creator must test each platform separately and record one Text Generation Result and Adoption Decision per response.
- Xiaohongshu and Douyin Platform Approval remain independent even when both derive from the same Content Master.
