# Project-local Skills

This directory contains Skills incubated for this repository. They are not global user Skills and must not be copied to another project until their promotion criteria are satisfied.

## Active Skill

### `developing-creator-operations-prompts`

- Scope: versioned Prompt Definitions for Creator Operations only.
- Status: pressure-tested against seven repository-specific scenarios; targeted REFACTOR scenarios pass.
- Runtime entry: `developing-creator-operations-prompts/SKILL.md`
- Supporting instructions: `developing-creator-operations-prompts/references/`
- Deterministic validation: `developing-creator-operations-prompts/scripts/validate-base-package.mjs`
- Evaluation evidence: `../skill-evals/developing-creator-operations-prompts/`

Invoke it by explicitly loading:

```text
skills/developing-creator-operations-prompts/SKILL.md
```

## Promotion boundary

Keep the Skill project-local until it has:

1. produced all three Core Generation Task Prompt Definitions;
2. passed fresh pressure tests for each Task Prompt and both platform rules;
3. completed at least three real Prompt-development cycles without a Critical regression;
4. passed a review that separates reusable technique from Creator Operations product policy.

Promotion requires a new decision and a separate change. Do not silently install or copy this directory into a global Skill location.
