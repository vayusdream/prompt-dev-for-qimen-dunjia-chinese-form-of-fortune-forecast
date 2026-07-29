# Generation Response Field Specification

**Prompt Version:** `creator-operations-base-v1`

## Contract rules

A response conforming to this specification is a versioned **Generation Response** for one **Text Generation Result**. It has exactly the nine required top-level fields below. Unless a field table says otherwise, use an empty array (`[]`) or empty object (`{}`) rather than `null`. Consumers must preserve `display_text` as returned and must not reconstruct it by concatenating structured fields.

### Stable `generation_task_type` wire values

| Wire value | Meaning |
| --- | --- |
| `topic_generation` | Generate reviewable topic-oriented output. |
| `content_master_expansion` | Expand an approved topic into a reviewable Content Master-oriented output. |
| `platform_text_adaptation` | Adapt an approved Content Master into reviewable platform text. |

The wire values are stable, lower-case ASCII identifiers. User-facing labels may be localized, but the values above must not be changed or inferred from text.

## Required top-level fields

| Field | JSON type | Required | Semantics | Empty-value representation |
| --- | --- | --- | --- | --- |
| `prompt_version` | string | Yes | The Prompt Version that produced this response. It **must exactly equal** `creator-operations-base-v1`. | Never empty. A nonconforming response is invalid. |
| `generation_task_type` | string | Yes | The stable wire value identifying the invoked generation task. | Never empty; one of `topic_generation`, `content_master_expansion`, or `platform_text_adaptation`. |
| `display_text` | string | Yes | The complete, human-readable review artifact for the Creator, including any material uncertainty, conflict, risk, or confirmation context needed to review the result. | Never empty. It cannot be replaced by application-side field concatenation. |
| `task_output` | object | Yes | Task-specific structured payload defined by the invoked downstream Task Prompt. This shared specification deliberately does not prescribe its inner fields. | `{}` when no task-specific structured payload is available. |
| `source_references` | array of `SourceReference` | Yes | Traceable source and Knowledge Trace metadata for claims or material used in the result. | `[]` when no source reference is available or applicable; do not invent one. |
| `knowledge_conflicts` | array of `KnowledgeConflict` | Yes | Unresolved **Knowledge Conflict** entries sufficient for Creator review. | `[]` when none is identified. Never record an automatically merged or adjudicated conflict. |
| `risk_flags` | array of `RiskFlag` | Yes | Safety, privacy, missing-clearance, or **Blocking Content Risk** flags that affect generation or review. | `[]` when none is identified. Every Blocking Content Risk must also be explained in `display_text`. |
| `confirmation_items` | array of `ConfirmationItem` | Yes | Decisions, facts, approvals, sanitization/public-use clearance, or conflict resolution that the Creator must confirm. | `[]` when no Creator confirmation is needed. |
| `generation_notes` | `GenerationNotes` object | Yes | Machine-readable review-supporting notes about mode, limitations, and handling decisions that do not belong in the task output. | `{}` when there are no such notes. |

## Shared metadata object schemas

All fields shown for an item are required. Identifiers are non-empty strings unique within one Generation Response. References between items use these response-local identifiers.

### `SourceReference`

| Field | JSON type | Semantics | Empty value |
| --- | --- | --- | --- |
| `id` | string | Response-local source identifier. | Never empty. |
| `source_type` | string enum | One of `authority_rule`, `confirmed_knowledge_entry`, `reference_material`, `historical_expression`, `creator_input`, `sanitized_case`, or `model_background`. | Never empty. |
| `label` | string | Human-readable source name supplied by the interface or generated as a neutral locator label. | Never empty. |
| `locator` | string | Source-provided page, section, record, or URL locator. | `""` when no locator was supplied. |
| `supports` | array of strings | Short identifiers or descriptions of claims supported by this source. | `[]` when the source is contextual rather than claim-specific. |

### `KnowledgeConflict`

| Field | JSON type | Semantics | Empty value |
| --- | --- | --- | --- |
| `id` | string | Response-local conflict identifier. | Never empty. |
| `subject` | string | The disputed view, term, or rule. | Never empty. |
| `positions` | array of `ConflictPosition` | Two or more unresolved positions; preserve them without adjudication. | Never empty and must contain at least two items. |
| `confirmation_question` | string | The specific question the Creator must decide. | Never empty. |

Each `ConflictPosition` contains required `summary` (non-empty string) and `source_reference_ids` (non-empty array of valid `SourceReference.id` strings).

### `RiskFlag`

| Field | JSON type | Semantics | Empty value |
| --- | --- | --- | --- |
| `id` | string | Response-local risk identifier. | Never empty. |
| `risk_type` | string enum | One of `blocking_content_risk`, `privacy`, `missing_sanitization`, `missing_public_use_clearance`, or `other`. | Never empty. |
| `severity` | string enum | `blocking` when generation or approval must stop; otherwise `warning`. | Never empty. |
| `description` | string | Creator-facing description of the risk. | Never empty. |
| `required_action` | string | Action required to remove or resolve the risk. | Never empty. |

### `ConfirmationItem`

| Field | JSON type | Semantics | Empty value |
| --- | --- | --- | --- |
| `id` | string | Response-local confirmation identifier. | Never empty. |
| `confirmation_type` | string enum | One of `approval`, `fact`, `knowledge_conflict`, `sanitization`, `public_use_clearance`, `professional_judgment`, or `other`. | Never empty. |
| `prompt` | string | A specific, actionable question or request for the Creator. | Never empty. |
| `blocking` | boolean | `true` when the requested task or next approval gate cannot proceed before confirmation. | Not nullable. |
| `related_ids` | array of strings | Related response-local source, conflict, or risk identifiers. | `[]` when none applies. |

### `GenerationNotes`

When non-empty, the object contains all fields below:

| Field | JSON type | Semantics | Empty value |
| --- | --- | --- | --- |
| `mode` | string enum | `exploration` or `grounded_creation`. | Never empty in a non-empty object. |
| `limitations` | array of strings | Material scope or evidence limitations not already represented as risks. | `[]` when none applies. |
| `handling_notes` | array of strings | Concise review-supporting notes about how input was handled; never hidden chain-of-thought. | `[]` when none applies. |

## Generic valid JSON example

This example is intentionally generic and exercises every shared metadata shape. `task_output` has no task-specific inner fields, so the contract can serve all three task types without embedding downstream prompt logic.

```json
{
  "prompt_version": "creator-operations-base-v1",
  "generation_task_type": "topic_generation",
  "display_text": "当前内容仅供博主审核。资料中的专业口径存在冲突，且包含一项阻断性风险；在博主确认口径并解除风险前，不得进入下一审批环节。",
  "task_output": {},
  "source_references": [
    {
      "id": "src-1",
      "source_type": "reference_material",
      "label": "示例参考资料甲",
      "locator": "示例章节",
      "supports": ["示例专业主张甲"]
    },
    {
      "id": "src-2",
      "source_type": "historical_expression",
      "label": "示例历史表达乙",
      "locator": "",
      "supports": ["示例专业主张乙"]
    }
  ],
  "knowledge_conflicts": [
    {
      "id": "conflict-1",
      "subject": "示例术语的专业口径",
      "positions": [
        {
          "summary": "资料甲采用口径甲。",
          "source_reference_ids": ["src-1"]
        },
        {
          "summary": "历史表达乙采用口径乙。",
          "source_reference_ids": ["src-2"]
        }
      ],
      "confirmation_question": "本次内容应采用哪一种口径？"
    }
  ],
  "risk_flags": [
    {
      "id": "risk-1",
      "risk_type": "blocking_content_risk",
      "severity": "blocking",
      "description": "示例输入包含不得直接进入平台版本的确定性承诺。",
      "required_action": "删除或改写该承诺，并重新审核风险。"
    }
  ],
  "confirmation_items": [
    {
      "id": "confirm-1",
      "confirmation_type": "knowledge_conflict",
      "prompt": "请确认本次内容采用的专业口径，并确认阻断性风险已经解除。",
      "blocking": true,
      "related_ids": ["conflict-1", "risk-1"]
    }
  ],
  "generation_notes": {
    "mode": "exploration",
    "limitations": ["示例资料不足以自动消解专业口径冲突。"],
    "handling_notes": ["未对冲突观点作自动合并或裁决。"]
  }
}
```

The same envelope supports simulated `content_master_expansion` and `platform_text_adaptation` calls by changing only `generation_task_type` and supplying the downstream Task Prompt's `task_output`; no additional top-level field is introduced.
