# REFACTOR Results: Developing Creator Operations Prompts

## Scope

Step 5 addressed only the two Critical failures exposed by the first GREEN run:

1. Scenario 6 stopped for clarification instead of preserving and delivering the decided v1 contract.
2. Scenario 7 used shallow checks and non-reproducible or inaccurate validation evidence.

Scenarios 1–5 were not regenerated because their Critical criteria already passed. Their governing approval, risk, contract, privacy, and authority invariants were covered by the package validator and Skill structure checks after the refactor.

## Changes

### Contract-conflict handling

The Skill now distinguishes:

- a genuinely missing product decision, which requires escalation; and
- a request that conflicts with an existing repository decision, which requires preserving that decision and completing the compatible deliverable.

It explicitly requires delivery of the active shared metadata schemas when a request asks to make them arbitrary.

### Validation evidence

The Skill now:

- prohibits ellipses, paraphrased commands, masked failures, and rewritten exit codes;
- requires literal command and output evidence in the delivered artifact;
- prohibits redundant improvised checks after the canonical validator passes;
- provides `scripts/validate-base-package.mjs` for deterministic v1 validation.

The validator checks:

- expected deliverables and exact version consistency;
- the non-empty JSON example;
- exact top-level fields and task wire values;
- nested keys, types, enums, cardinality, unique IDs, and local references;
- Blocking Content Risk severity and Display Text visibility;
- approval-gate and dual-risk wording;
- Base Prompt task/platform neutrality;
- compatibility of all three generation task types with one envelope.

## Refactor iterations

| Iteration | Scenario | Result | New evidence |
| --- | --- | --- | --- |
| 1 | 6 | PASS, 7/7 | Agent rejected schema weakening and delivered the complete active v1 protocol rather than asking questions. |
| 1 | 7 | FAIL, 3/8 | A real command ran, but the final response still summarized rather than reproduced it. |
| 2 | 7 | FAIL, 5/8 | Literal commands appeared, but semantic assertions remained incomplete. |
| 3 | 7 | FAIL | Canonical validator passed, but an extra `rg` actually exited 1 and was reported as 0. |
| 4 | 7 | PASS, 8/8 | Only the canonical validator and required Git checks were reported, with literal commands, output, and exit codes. |

Failed iterations are retained because they are the evidence that motivated each minimal Skill correction.

## Final targeted score

| Scenario | Before refactor | After refactor | Result |
| --- | ---: | ---: | --- |
| 6. Stable response contract | 0/7 | 7/7 | PASS |
| 7. Validation evidence | 3/8 | 8/8 | PASS |
| **Targeted total** | **3/15** | **15/15** | **PASS** |

Together with the unchanged passing results for Scenarios 1–5, every original Critical criterion now has passing evidence. This is a targeted REFACTOR result, not a fresh rerun of all seven scenarios.

## Final evidence

- Scenario 6: `raw-refactor-outputs/scenario-6.md`
- Scenario 7 final: `raw-refactor-outputs/scenario-7-final.md`
- Intermediate failed reruns:
  - `raw-refactor-outputs/scenario-7.md`
  - `raw-refactor-outputs/scenario-7-rerun.md`
- Canonical validator: `skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs`

Final local checks:

```sh
node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .
ruby -e "require 'yaml'; data=YAML.load_file('skills/developing-creator-operations-prompts/SKILL.md'); abort unless data['name']=='developing-creator-operations-prompts' && data['description'].start_with?('Use when'); puts 'frontmatter: PASS'"
node --check skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs
git diff --check
```

Observed results:

- package validator: all checks PASS;
- Skill frontmatter: PASS;
- validator syntax check: exit 0;
- diff check: exit 0.

## Verdict

Step 5 passes. The two newly exposed Critical loopholes are closed and their original pressure scenarios now pass.
