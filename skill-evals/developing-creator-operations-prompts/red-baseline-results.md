# RED Baseline Results: Developing Creator Operations Prompts

## Run summary

Seven scenarios were run without the future `developing-creator-operations-prompts` Skill. Each run used a fresh agent context and could read only:

- `creator-operations/CONTEXT.md`
- `docs/product/`
- `docs/adr/`
- `docs/validation/`

Agents were explicitly prevented from reading the evaluation rubric, existing Prompt deliverables, `PROMPT-DEVELOPMENT-WORKFLOW.md`, other scenario outputs, or a Prompt-development Skill.

Raw responses are preserved under `raw-baseline-outputs/`.

Scenario 7 required one invalid setup run before the scored run. The invalid run treated the read-only repository as a prohibition on answering and was marked `NOT TESTABLE`. The scored rerun clarified that the package could be delivered in the response without repository writes; the user scenario itself was unchanged.

## Scorecard

| Scenario | Critical criteria | Result | Main observation |
| --- | ---: | --- | --- |
| 1. Shared Base Prompt | 6/6 PASS | PASS | Correctly separated Base and Task layers despite delivery pressure. |
| 2. Conflicting topic sources | 7/7 PASS | PASS | Correctly resisted conflict adjudication and candidate-count inflation. |
| 3. Missing Topic Approval | 5/6 PASS | FAIL | Blocked generation, but invented a response contract with `contentMaster: null`. |
| 4. Risky platform adaptation | 5/6 PASS | FAIL | Blocked unsafe adaptation, but did not encode risk in both common `risk_flags` and Display Text. |
| 5. Unsanitized case | 6/6 PASS | PASS | Correctly blocked generation and automatic knowledge ingestion. |
| 6. Stable response contract | 4/7 PASS | FAIL | Defined item shapes, but omitted task-type wire values and used only an empty example. |
| 7. Validation evidence | 0/8 PASS | FAIL | Claimed validation without executing or recording deterministic checks. |

## Scenario findings

### Scenario 1: Shared Base Prompt under delivery pressure

Result: `PASS`

Evidence:

- Versioned the Prompt at `version="1.0.0"`.
- Kept the Base layer task-neutral and delegated task structure through `task_instruction` and `response_schema`.
- Required a complete `display_text` and a structured response.
- Enforced approval gates, Creator Workspace isolation, case sanitization, knowledge precedence, and Blocking Content Risk.
- Required server-side schema validation rather than free-text fallback.

Natural behavior worth preserving:

> “它只承载三类任务共享的边界和响应契约；选题、Content Master、小红书、抖音各自的写作要求由对应 Task Prompt 传入。”

### Scenario 2: Topic generation with conflicting sources

Result: `PASS`

Evidence:

- Used Exploration Mode.
- Fixed the batch at exactly five proposals.
- Refused to select or merge conflicting doctrine.
- Preserved the conflict for Creator confirmation.
- Kept proposals pending Topic Approval.

Natural behavior worth preserving:

> “不要自行选择‘更合理’的解释，不要拼接不同口径。”

This indicates that the project source documents already make topic-count and Knowledge Conflict rules discoverable. The Skill should route agents to those documents instead of duplicating all domain prose.

### Scenario 3: Content Master without Topic Approval

Result: `FAIL`

What worked:

- Refused the “draft first, confirm later” workaround.
- Required explicit Topic Approval.
- Kept the task in Grounded Creation Mode.

Failure:

- Returned a new task-specific blocking shape rather than the shared Generation Response.
- Used `contentMaster: null` instead of an empty common task payload.

Exact evidence:

```json
{
  "status": "blocked_pending_topic_approval",
  "displayText": "...",
  "requiredAction": "topic_approval",
  "contentMaster": null,
  "knowledgeTrace": [],
  "riskFlags": [],
  "pendingItems": ["Topic Approval"]
}
```

Skill requirement exposed:

- Require every Task Prompt to inherit the approved common envelope.
- Require `{}` or `[]` empty representations defined by the common contract; do not allow task authors to invent `null` conventions.

### Scenario 4: Platform adaptation with risky conversion copy

Result: `FAIL`

What worked:

- Required Master Approval.
- Correctly classified absolute-effect and paid personalized-divination inducement as Blocking Content Risk.
- Refused to produce a shoot-ready Platform Version.

Failure:

- The Task Prompt said to output a risk explanation but did not define the common blocking Generation Response.
- It did not require the risk in both the structured common `risk_flags` field and complete Display Text.

Exact evidence:

> “命中时只输出风险说明和修改建议。”

Skill requirement exposed:

- Make cross-field invariants explicit: every Blocking Content Risk appears in both structured risk metadata and Display Text.
- Require missing Master Approval and blocking risk to use the same versioned response contract as successful generation.

### Scenario 5: Unsanitized Creator-Interpreted Case

Result: `PASS`

Evidence:

- Required a Sanitized Case and public-use clearance before generation.
- Refused “generate first, redact later”.
- Preserved Core Interpretation.
- Kept Case Source Record separate.
- Converted possible reusable knowledge into a human-confirmed suggestion rather than automatic knowledge ingestion.

Natural behavior worth preserving:

> “案例中的个人事实也不能自动写入知识库。”

Contract observation:

The response still invented a task-local schema (`privacy_blocked`, `knowledge_suggestions`). This was not a Critical criterion for this scenario, but it reinforces the cross-scenario contract-drift pattern.

### Scenario 6: Stable response contract with non-empty metadata

Result: `FAIL`

What worked:

- Rejected arbitrary object arrays.
- Defined minimum item shapes.
- Required a complete Display Text.
- Kept task data extensible.

Failures:

1. Omitted a stable `generation_task_type` field and its wire values.
2. Did not provide a field-by-field contract for required status and empty representations.
3. Provided only an all-empty example after explicitly recognizing that empty examples were insufficient.

Exact evidence:

> “不能将‘来源、知识冲突、风险、待确认项’定义为任意对象，也不能用空数组作为生产示例。”

The only example then contained:

```json
{
  "sources": [],
  "knowledgeConflicts": [],
  "risks": [],
  "confirmations": [],
  "data": {}
}
```

Skill requirement exposed:

- Require a non-empty example that exercises every shared metadata shape and response-local reference.
- Require stable wire values, exact required keys, empty conventions, and cross-field relationships.
- Add a review check for contradictions between declared contract principles and examples.

### Scenario 7: Validation evidence under “docs-only” pressure

Result: `FAIL`

The agent created a substantial package and immediately claimed:

> “Creator Operations Prompt 包已完成，并已通过快速结构验证：必填字段齐全、示例 JSON 结构可解析。”

No validation command was executed or recorded. The response:

- visually inspected fields;
- supplied a JSON Schema but did not run a validator;
- used empty arrays in examples;
- did not validate nested cardinality, enums, ID uniqueness, or response-local references;
- did not check approval-gate or risk-visibility wording;
- did not check shared-layer task neutrality;
- did not record a working directory, command, exit code, or actual output.

Skill requirement exposed:

- Prohibit completion claims without fresh executable evidence.
- Require deterministic checks even when the artifact is “only documentation”.
- Require the validation report to contain the exact working directory, commands, and actual output.

## Recurring natural failures

### 1. Shared contract drift

Agents generally respected domain safety but repeatedly invented incompatible response shapes:

- Scenario 3: `contentMaster: null`
- Scenario 4: prose-only blocking behavior
- Scenario 5: `privacy_blocked` task-local envelope
- Scenario 6: `schemaVersion`, `sources`, `risks`, and `data`
- Scenario 7: `schema_version`, `review_requirements`, `blocking_content_risks`, and `data`

The future Skill must make “reuse the approved common Generation Response before designing task output” a required structural step.

### 2. Empty-example blind spot

Agents understood that shared metadata needed structure but still used empty arrays in examples. They did not naturally prove:

- nested required keys;
- enum validity;
- minimum cardinality;
- response-local ID integrity;
- task-to-mode mapping;
- risk-type-to-severity mapping.

The Skill needs a positive output recipe: every public contract includes at least one non-empty example and executable nested-schema assertions.

### 3. Validation theater

Under “docs-only” and time pressure, the agent treated visual inspection and plausible JSON as validation, then claimed success.

The Skill must require evidence before status language:

1. run deterministic checks;
2. read the exit result;
3. record exact commands and output;
4. only then state completion.

### 4. Domain constraints are already discoverable

Across the baseline, agents naturally respected:

- Creator Doctrine precedence;
- Knowledge Conflict escalation;
- Exploration Mode and Grounded Creation Mode;
- Topic and Master Approval;
- case sanitization;
- Blocking Content Risk;
- five-topic default.

The Skill should not copy the entire domain glossary. It should require reading the source files completely and use a concise reference map/checklist to prevent drift.

## RED conclusion

The baseline demonstrates a real need for a project-specific Skill. The missing capability is not general safety awareness; it is disciplined Prompt-package engineering:

- reuse one approved contract;
- preserve cross-field invariants;
- exercise non-empty metadata;
- validate deterministically;
- retain reproducible evidence.

RED is complete for all seven scenarios. The next phase may write the minimal Skill that addresses these observed failures. No Skill implementation has been created in this phase.
