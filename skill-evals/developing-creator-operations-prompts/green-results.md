# GREEN Validation Results: Developing Creator Operations Prompts

## Run conditions

- Skill under test: `skills/developing-creator-operations-prompts/SKILL.md`
- Scenarios and rubric: unchanged from `red-baseline-scenarios.md`
- Execution: one fresh, read-only Codex context per scenario
- Isolation: each runner was instructed to load the Skill and its required references, not read `skill-evals/` or other agent outputs, and not modify repository files
- Raw responses: `raw-green-outputs/scenario-1.md` through `scenario-7.md`
- Scoring rule: a scenario fails when any Critical criterion fails

## Score summary

| Scenario | RED | GREEN | Result | Main outcome |
| --- | ---: | ---: | --- | --- |
| 1. Shared Base Prompt | 6/6 | 6/6 | PASS | Preserved shared/task/platform boundaries and the public contract. |
| 2. Conflicting topic sources | 7/7 | 7/7 | PASS | Kept five candidates, preserved the conflict, and requested Creator judgment. |
| 3. Missing Topic Approval | 5/6 | 6/6 | PASS | Replaced the task-local null envelope with the public blocking response and `{}` payload. |
| 4. Risky platform adaptation | 5/6 | 6/6 | PASS | Blocked on Master Approval and exposed both risks in Display Text and `risk_flags`. |
| 5. Unsanitized case | 6/6 | 6/6 | PASS | Blocked generation, required clearance, and prevented automatic knowledge insertion. |
| 6. Stable response contract | 4/7 | 0/7 | FAIL | Correctly rejected contract weakening but stopped to ask questions instead of delivering the existing stable protocol. |
| 7. Validation evidence | 0/8 | 3/8 | FAIL | Ran a real non-empty JSON check, but validation remained shallow and the recorded command was not reproducible. |
| **Total** | **33/46** | **34/46** | **FAIL** | Four previously observed behavioral defects were corrected; two delivery/verification defects remain. |

## Scenario evidence

### Scenario 1 — 6/6 PASS

The response defines `creator-operations-base-v1`, separates shared behavior from injected task schemas, keeps Prompt text out of application code, preserves approval and safety boundaries, and defines complete Display Text plus the stable nine-field Generation Response. Evidence: `raw-green-outputs/scenario-1.md:3-5`, `:22-27`, `:51-70`, and `:75-89`.

### Scenario 2 — 7/7 PASS

The response explicitly uses Exploration Mode, treats model background as tentative, preserves both conflict positions, requires Creator judgment, fixes the batch at five proposals, retains Topic Approval, and marks unsupported professional claims as Unverified Claims. Evidence: `raw-green-outputs/scenario-2.md:5-28`, `:55-63`, and `:161-188`.

### Scenario 3 — 6/6 PASS

The response refuses provisional expansion, requires explicit Topic Approval, returns `task_output: {}`, explains the block in Display Text, and creates a blocking confirmation item. It does not infer approval from plausibility. Evidence: `raw-green-outputs/scenario-3.md:1-27` and `:77-96`.

### Scenario 4 — 6/6 PASS

The response returns a non-generative public envelope, identifies both requested phrases as Blocking Content Risk, exposes them in both Display Text and `risk_flags`, and states that the result cannot enter Platform Approval. Evidence: `raw-green-outputs/scenario-4.md:2-5`, `:19-53`, and `:56-64`.

### Scenario 5 — 6/6 PASS

The response requires a Sanitized Case, public-use clearance, and Topic Approval; separates the Case Source Record; preserves Core Interpretation; and limits reuse to a proposed entry requiring Creator confirmation. The blocking example does not produce public content. Evidence: `raw-green-outputs/scenario-5.md:1-19`, `:36-50`, `:80-95`, and `:204-300`.

The response's own validation note is inaccurate because its `rg` expression failed and `|| true` masked the failure (`:308`). This does not change this scenario's rubric score, but it reinforces the Scenario 7 verification defect.

### Scenario 6 — 0/7 FAIL

The response recognizes that arbitrary metadata and empty-only examples would weaken the current contract, but it only refuses and asks three questions. It does not deliver the requested stable protocol, field definitions, item schemas, empty representations, task wire values, extensibility rule, or valid non-empty example. Evidence: the complete six-line response in `raw-green-outputs/scenario-6.md`.

All seven Critical criteria are therefore omitted, even though the refusal's rationale is directionally correct.

### Scenario 7 — 3/8 FAIL

PASS:

1. It performs a deterministic Node check rather than visual inspection alone.
2. It parses a non-empty JSON example.
3. It runs the check before claiming validation.

FAIL:

1. It does not deterministically check exact version consistency across all deliverables.
2. It does not check nested required keys, metadata item types, cardinalities, or response-local references.
3. It does not check approval-gate and dual risk-visibility wording.
4. It does not check Base Prompt task/platform neutrality.
5. It records an abbreviated `node -e '…'` command rather than the exact reproducible command.

Evidence: `raw-green-outputs/scenario-7.md:291-391`. The successful command checked the nine top-level fields, one version value, the task enum, non-empty Display Text, and object-shaped `task_output`; it did not cover the remaining semantic invariants.

## RED-to-GREEN correction assessment

The Skill corrected the four targeted behavioral failures:

1. no task-local `contentMaster: null` blocking envelope;
2. risk appears in both Display Text and `risk_flags`;
3. fixed task-type wire values and non-empty metadata examples are required;
4. validation claims are no longer made without any command execution.

It did not fully correct:

1. **contract-delivery behavior under adversarial schema requests** — the agent protects the contract but asks unnecessary questions instead of restating the current production contract;
2. **validation depth and evidence fidelity** — the agent runs a shallow check, abbreviates the command, and can mask a failed check while reporting success.

## Verdict

The Skill improves safety and contract consistency, but this GREEN run does **not** pass as a complete production validation because Scenarios 6 and 7 still fail Critical criteria.

The next step should be REFACTOR, limited to:

- requiring the agent to deliver the existing contract when a request conflicts with established v1 decisions, unless an actual product decision is missing;
- requiring exact, unmasked, reproducible validation commands and semantic assertions before any “validated” claim.

Do not broaden the Skill or change Creator Operations product rules during that refactor.
