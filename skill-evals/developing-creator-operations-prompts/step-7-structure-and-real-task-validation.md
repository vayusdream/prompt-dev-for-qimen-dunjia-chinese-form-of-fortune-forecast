# Step 7: Skill Structure and Real Prompt Task Validation

## Scope

This validation covers:

1. the project-local Skill directory and metadata;
2. one real production Prompt-development task: Topic Generation Task Prompt Definition;
3. an independent forward test in a fresh internal agent context.

It does not rerun all seven earlier pressure scenarios.

## Skill structure result

Expected runtime structure:

```text
skills/developing-creator-operations-prompts/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── project-sources.md
│   └── validation-and-review.md
└── scripts/
    ├── validate-base-package.mjs
    ├── validate-skill-structure.rb
    └── validate-topic-generation-prompt.mjs
```

The official validator was attempted first:

```sh
python3 $CODEX_SKILL_CREATOR/scripts/quick_validate.py skills/developing-creator-operations-prompts
```

Actual result:

```text
ModuleNotFoundError: No module named 'yaml'
```

The bundled workspace Python produced the same dependency error. This is an environment dependency failure before Skill validation, not a Skill finding.

The project-local validator implements the applicable structural checks without adding a Python package dependency:

```sh
ruby skills/developing-creator-operations-prompts/scripts/validate-skill-structure.rb skills/developing-creator-operations-prompts
```

Actual output:

```text
PASS SKILL.md frontmatter and directory name
PASS minimal Skill directory layout
PASS direct reference links resolve
PASS agents/openai.yaml interface metadata
PASS required deterministic validators exist
RESULT developing-creator-operations-prompts structure: PASS
```

Exit code: `0`.

## Real Prompt-development task

Task:

> Develop a callable production Topic Generation Task Prompt Definition for `creator-operations-base-v1`, with exactly five differentiated proposals, one stable task payload schema, Knowledge Conflict preservation, Topic Approval, evidence classification, and a complete non-empty Generation Response.

Production artifact:

`creator-operations/prompts/creator-operations-base-v1/topic-generation-prompt-definition.md`

### RED

The task validator was written before the Prompt Definition:

```sh
node skills/developing-creator-operations-prompts/scripts/validate-topic-generation-prompt.mjs .
```

Actual failure:

```text
Error: missing Topic Prompt Definition: $REPO_ROOT/creator-operations/prompts/creator-operations-base-v1/topic-generation-prompt-definition.md
```

Exit code: `1`. The failure was caused by the missing real artifact, as intended.

### GREEN

After implementing the Prompt Definition, the same command produced:

```text
PASS Topic Prompt Definition exists
PASS task mode terminology approval and candidate invariant
PASS non-empty topic example parses
PASS public envelope and Exploration Mode
PASS five proposal task payload shape
PASS proposal response-local references
PASS conflict preservation and human Topic Approval
RESULT topic-generation-prompt validation: PASS
```

Exit code: `0`.

The production artifact therefore demonstrates that the Skill can drive an actual Prompt-development change, not only simulated scenario answers.

## Independent forward test

The external Codex subprocess option was rejected by the approval reviewer because it would transfer private repository sources to an unverified remote execution environment. No workaround was attempted.

A fresh project-local internal agent context received only:

- the Skill path;
- the real Topic Prompt development request;
- permission to read mandated repository sources;
- instructions not to read `skill-evals/` or the production Topic Prompt artifact;
- read-only repository scope.

Raw independent output:

`skill-evals/developing-creator-operations-prompts/real-task-validation/topic-generation-forward-test.md`

It was validated without editing:

```sh
node skills/developing-creator-operations-prompts/scripts/validate-topic-generation-prompt.mjs . $TMPDIR/creator-operations-internal-topic-forward-test.md
```

Actual output:

```text
PASS Topic Prompt Definition exists
PASS task mode terminology approval and candidate invariant
PASS non-empty topic example parses
PASS public envelope and Exploration Mode
PASS five proposal task payload shape
PASS proposal response-local references
PASS conflict preservation and human Topic Approval
RESULT topic-generation-prompt validation: PASS
```

Exit code: `0`.

## Whole-package regression

Command:

```sh
node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .
```

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
PASS non-empty topic example parses
PASS public envelope and Exploration Mode
PASS five proposal task payload shape
PASS proposal response-local references
PASS conflict preservation and human Topic Approval
RESULT topic-generation-prompt validation: PASS
PASS Topic Generation Task Prompt validator
RESULT creator-operations-base-v1 validation: PASS
```

Exit code: `0`.

Additional commands:

```sh
node --check skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs
node --check skills/developing-creator-operations-prompts/scripts/validate-topic-generation-prompt.mjs
ruby -c skills/developing-creator-operations-prompts/scripts/validate-skill-structure.rb
git diff --check
git diff -- creator-operations/CONTEXT.md docs/product/mvp-scope.md docs/adr docs/validation
```

Actual results:

- both Node syntax checks exited `0`;
- Ruby reported `Syntax OK`;
- `git diff --check` exited `0`;
- the source-document diff command exited `0` with no output.

## Findings from real use

The real task exposed one maintainability gap: a Task Prompt validator could exist without being invoked by the canonical package validator. The Skill and `validate-base-package.mjs` were updated so applicable Task Prompt validators run through the canonical entry point.

No Critical contract, authority, approval, workspace, evidence-classification, or layer-boundary failure remains in the production artifact or independent forward-test output.

## Verdict

Step 7 passes:

- Skill structure: **PASS**
- real Topic Generation Prompt development: **PASS**
- independent forward test: **PASS**
- whole-package regression: **PASS**

The Skill remains project-local. This validation does not authorize global installation or cross-project promotion.
