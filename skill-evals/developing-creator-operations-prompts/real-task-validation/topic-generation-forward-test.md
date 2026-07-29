# Creator Operations Topic Generation Task Prompt Definition

**Prompt Version:** `creator-operations-base-v1`
**Generation Task Type:** `topic_generation`
**Generation Mode:** **Exploration Mode**
**Layer:** downstream Task Prompt
**Upstream approval prerequisite:** none

## Invocation contract

Invoke this Task Prompt only with the Shared Base Prompt Definition, Generation Response Field Specification, and non-negotiable rules for `creator-operations-base-v1`.

The application supplies a non-empty **Topic Discovery Prompt** and may also supply:

- target audience;
- target Primary Platform values;
- content goal;
- professional constraints;
- duplication constraints or relevant historical content;
- traceable **Audience Question** records;
- traceable **Topic Signal** records;
- applicable active-workspace knowledge and source materials.

Use only materials from the active Creator Workspace. Do not collect live platform data, invent a current trend, or assume that an unavailable source exists.

If the Topic Discovery Prompt is absent or unusable, return the common non-generative Generation Response with `task_output` set to `{}`, explain the missing input in `display_text`, and add an actionable `confirmation_items` entry. Do not fabricate five proposals merely to fill the payload.

## Task objective

For a valid invocation, generate a **Topic Proposal Batch** containing exactly 5 differentiated **Generated Topic Proposal** items.

The five proposals must represent meaningfully different editorial choices. Different wording for the same question or angle does not count as differentiation. Across the batch, vary at least one of the following for every pair of proposals:

- the audience problem or core question;
- the explanatory frame or content angle;
- the content goal;
- the relationship to supplied Topic Signals;
- the practical, conceptual, historical, comparative, or misconception-correction approach.

Do not generate more or fewer than exactly 5 proposals, even when the request asks for a larger batch to increase the chance of selection.

## Evidence classification

### Audience basis

For every proposal, identify exactly one `audience_basis.basis_type`:

- `audience_question`: use only when the application supplied a real question from comments, private messages, or another documented audience interaction. Include at least one traceable source reference. Do not rewrite a model inference as an Audience Question.
- `creator_input`: use when the audience need or direction comes directly from the Creator's current request but is not supplied as a documented Audience Question.
- `model_hypothesis`: use when the audience need is inferred during Exploration Mode. State explicitly in `audience_basis.text` that it is a hypothesis requiring validation. Do not describe it as observed audience demand.

### Timeliness basis

For every proposal, identify exactly one `timeliness_basis.basis_type`:

- `topic_signal`: use only when a real Topic Signal record is supplied in the current request or active Creator Workspace. Include at least one traceable source reference.
- `creator_input`: use when the Creator directly supplies a timely direction or occasion that is not represented as a stored Topic Signal.
- `model_background`: use for a generalized timing hypothesis derived from model background. Do not call it a live trend, current audience signal, or verified external event.
- `none`: use when no defensible timeliness basis exists. Set the summary to a clear statement such as “无明确时效依据” and use an empty source-reference array.

A model hypothesis is never a real Audience Question or Topic Signal. Neutral labels such as “可能的受众疑问” or “可验证的时效假设” must be used where appropriate.

## Knowledge handling

Use **Exploration Mode**. Model general background may expand possible directions, but it never represents the Creator's confirmed professional position.

For every professional hypothesis:

- set `status` to `supported` only when it has reliable, applicable, conflict-free Knowledge Trace in `source_references`;
- set `status` to `unverified_claim` when it relies on model background, lacks reliable Knowledge Trace, or is affected by unresolved source disagreement;
- preserve all relevant source-reference IDs;
- expose material Unverified Claims in `display_text`;
- request Creator confirmation when an Unverified Claim would affect later content production.

When a **Knowledge Conflict** affects a proposal:

- preserve at least two unresolved positions in the shared `knowledge_conflicts` field;
- link each position to its source references;
- do not merge, select, rank, reconcile, or adjudicate the positions;
- describe the conflict as **未裁决** in `display_text`;
- add a `knowledge_conflict` confirmation item requesting Creator judgment.

Do not infer Creator Doctrine from Historical Expression, promote Proposed Knowledge Entry material, invent Knowledge Trace, or let model knowledge override Creator Doctrine.

## Topic Approval boundary

Every generated item remains a **Generated Topic Proposal**. It is not a **Topic Candidate** and must not enter the Topic Library until the Creator grants **Topic Approval**.

Generation does not grant Topic Approval. Selecting, displaying, copying, exporting, or assigning a proposal ID does not grant Topic Approval. The response must:

- state this boundary in `display_text`;
- include an actionable `approval` confirmation item asking the Creator which proposal or proposals receive Topic Approval;
- avoid representing any proposal as approved, scheduled, published, or authorized for publication.

Topic Approval applies only to the selected proposal. It does not imply Master Approval, Platform Approval, or Publication Approval.

## Risk and privacy handling

Apply all shared privacy, case, and Blocking Content Risk rules.

Do not independently interpret a case or add a Core Interpretation. If a proposal depends on case material that lacks sanitization or public-use clearance, do not use that material as public-facing evidence; record the applicable shared risk and confirmation fields.

Every Blocking Content Risk must appear in both `risk_flags` and `display_text`. A risk-bearing result must not be described as approvable, approved, publishable, or capable of receiving Platform Approval. The risk must be removed before the content proceeds toward approval.

## Output instructions

Return exactly one Generation Response with exactly the shared nine top-level fields:

- `prompt_version`
- `generation_task_type`
- `display_text`
- `task_output`
- `source_references`
- `knowledge_conflicts`
- `risk_flags`
- `confirmation_items`
- `generation_notes`

Set:

- `prompt_version` to exactly `creator-operations-base-v1`;
- `generation_task_type` to exactly `topic_generation`;
- `generation_notes.mode` to exactly `exploration`.

Do not add task-specific top-level fields. Put the entire topic-generation payload under `task_output`.

`display_text` must be a complete, non-empty Creator review artifact that presents all five proposals and makes material hypotheses, Knowledge Conflict, Unverified Claim, Blocking Content Risk, and Topic Approval requirements visible. The application must not reconstruct it by concatenating structured fields.

## Stable `task_output` schema

A successful topic-generation response uses exactly this structure:

```text
task_output
└── topic_proposal_batch
    ├── candidate_count
    └── proposals[5]
```

### `topic_proposal_batch`

| Field | JSON type | Required | Rules |
| --- | --- | --- | --- |
| `candidate_count` | integer | Yes | Must equal `5`. |
| `proposals` | array of `GeneratedTopicProposal` | Yes | Must contain exactly 5 items with unique response-local IDs. |

No additional keys are allowed inside `task_output` or `topic_proposal_batch`.

### `GeneratedTopicProposal`

Every proposal contains exactly these required fields:

| Field | JSON type | Rules |
| --- | --- | --- |
| `id` | string | Non-empty and unique within the response. |
| `title` | string | Non-empty proposed topic title; must not imply approval. |
| `audience_basis` | `AudienceBasis` | Required evidence classification for the audience need. |
| `core_question` | string | Non-empty question the content would answer. |
| `content_angle` | string | Non-empty editorial or explanatory approach. |
| `content_goal` | string | Non-empty intended audience outcome. |
| `target_platforms` | array of strings | One or more unique values from `xiaohongshu` and `douyin`. If no platform is supplied, default to both. |
| `timeliness_basis` | `TimelinessBasis` | Required evidence classification for timeliness. |
| `professional_hypotheses` | array of `ProfessionalHypothesis` | Use `[]` only when the proposal makes no professional hypothesis. |
| `source_reference_ids` | array of strings | Valid response-local `SourceReference.id` values for material used by the proposal; `[]` when none exists. |
| `differentiation` | string | Non-empty explanation of how this proposal differs from the other four. |
| `duplication_note` | string | Non-empty comparison with supplied history, or an explicit statement that no usable history was supplied. |

No additional proposal keys are allowed.

### `AudienceBasis`

| Field | JSON type | Rules |
| --- | --- | --- |
| `basis_type` | string enum | `audience_question`, `creator_input`, or `model_hypothesis`. |
| `text` | string | Non-empty. A model hypothesis must be labeled as a hypothesis. |
| `source_reference_ids` | array of strings | Valid response-local source IDs. Required and non-empty for `audience_question`; otherwise `[]` when no source applies. |

### `TimelinessBasis`

| Field | JSON type | Rules |
| --- | --- | --- |
| `basis_type` | string enum | `topic_signal`, `creator_input`, `model_background`, or `none`. |
| `summary` | string | Non-empty explanation of the basis and its certainty. |
| `source_reference_ids` | array of strings | Valid response-local source IDs. Required and non-empty for `topic_signal`; use `[]` for `none`. |

### `ProfessionalHypothesis`

| Field | JSON type | Rules |
| --- | --- | --- |
| `claim` | string | Non-empty professional proposition relevant to the proposal. |
| `status` | string enum | `supported` or `unverified_claim`. |
| `source_reference_ids` | array of strings | Valid response-local source IDs. A `supported` claim requires at least one reliable source ID. |

All referenced IDs must exist in the shared `source_references` array. Proposal IDs are not valid `related_ids` in shared `confirmation_items`; refer to proposal IDs in the confirmation prompt text instead.

## Non-empty Generation Response example

```json
{
  "prompt_version": "creator-operations-base-v1",
  "generation_task_type": "topic_generation",
  "display_text": "以下为 5 个差异明确的 Generated Topic Proposal，均仅供博主审核：\n\n1. TP-1「节气变化为什么会让初学者误解奇门判断？」——来自真实评论问题，采用误区澄清角度。\n2. TP-2「节气在不同口径里到底扮演什么角色？」——采用资料对照角度，相关 Knowledge Conflict 仍未裁决。\n3. TP-3「零基础学习者最容易卡在哪三个概念？」——受众需求来自模型假设，不代表真实 Audience Question。\n4. TP-4「如何区分传统文化讨论与确定性人生预测？」——采用表达边界教育角度。\n5. TP-5「围绕节气做一期知识内容，可以讲什么而不追逐热点？」——使用已提供的文化日历 Topic Signal，但专业口径仍需确认。\n\n待确认事项：TP-2 与 TP-5 涉及的节气口径存在未裁决冲突；TP-3 的受众需求和专业判断属于 Unverified Claim。输入中还包含“保证避开灾祸”的绝对效果承诺，属于 Blocking Content Risk；本批次未采纳该承诺，但在删除或改写并重新审核前，不得把本结果描述为可批准或可发布内容。所有提案在获得博主明确 Topic Approval 前都不是 Topic Candidate，不得进入 Topic Library；Topic Approval 也不代表 Master Approval、Platform Approval 或 Publication Approval。",
  "task_output": {
    "topic_proposal_batch": {
      "candidate_count": 5,
      "proposals": [
        {
          "id": "TP-1",
          "title": "节气变化为什么会让初学者误解奇门判断？",
          "audience_basis": {
            "basis_type": "audience_question",
            "text": "真实评论提问：节气一变，判断方法是不是也要全部改变？",
            "source_reference_ids": ["src-audience-1"]
          },
          "core_question": "节气变化与判断方法之间应如何被准确理解？",
          "content_angle": "从常见误区切入，区分背景条件、专业规则与确定性结论。",
          "content_goal": "帮助初学者识别概念混淆，并形成后续学习问题。",
          "target_platforms": ["xiaohongshu", "douyin"],
          "timeliness_basis": {
            "basis_type": "topic_signal",
            "summary": "文化日历记录显示临近节气节点，构成已提供的 Topic Signal。",
            "source_reference_ids": ["src-signal-1"]
          },
          "professional_hypotheses": [
            {
              "claim": "讲解节气时应避免把背景条件包装成对个人结果的确定性保证。",
              "status": "supported",
              "source_reference_ids": ["src-doctrine-1"]
            }
          ],
          "source_reference_ids": ["src-audience-1", "src-signal-1", "src-doctrine-1"],
          "differentiation": "唯一从真实 Audience Question 和初学者误区切入的提案。",
          "duplication_note": "已提供的历史内容中没有以该真实评论问题为主线的记录。"
        },
        {
          "id": "TP-2",
          "title": "节气在不同口径里到底扮演什么角色？",
          "audience_basis": {
            "basis_type": "creator_input",
            "text": "博主要求面向已有基础、希望理解口径差异的学习者。",
            "source_reference_ids": ["src-input-1"]
          },
          "core_question": "两份材料对节气作用的不同表述应如何呈现？",
          "content_angle": "并列展示两种未裁决口径及其适用语境，不替博主选择。",
          "content_goal": "让受众看到专业口径差异，并由博主确定最终讲解立场。",
          "target_platforms": ["xiaohongshu"],
          "timeliness_basis": {
            "basis_type": "creator_input",
            "summary": "时效方向来自博主本次提出的节气专题安排，并非外部实时趋势。",
            "source_reference_ids": ["src-input-1"]
          },
          "professional_hypotheses": [
            {
              "claim": "节气属于判断规则的直接边界条件。",
              "status": "unverified_claim",
              "source_reference_ids": ["src-reference-1"]
            },
            {
              "claim": "节气只适合作为文化背景，不应表述为直接规则。",
              "status": "unverified_claim",
              "source_reference_ids": ["src-history-1"]
            }
          ],
          "source_reference_ids": ["src-input-1", "src-reference-1", "src-history-1"],
          "differentiation": "唯一以 Knowledge Conflict 的并列呈现为核心的资料对照提案。",
          "duplication_note": "历史内容曾采用其中一种表达，但不能据此推断为 Authority Rule。"
        },
        {
          "id": "TP-3",
          "title": "零基础学习者最容易卡在哪三个概念？",
          "audience_basis": {
            "basis_type": "model_hypothesis",
            "text": "模型假设：零基础学习者可能需要先区分术语、方法与结果表达；该需求尚未经真实互动验证。",
            "source_reference_ids": ["src-model-1"]
          },
          "core_question": "新学习者可能首先需要厘清哪些概念层级？",
          "content_angle": "以学习路径诊断组织三个候选概念，并邀请受众反馈。",
          "content_goal": "验证潜在入门需求，为后续真实 Audience Question 收集提供方向。",
          "target_platforms": ["douyin"],
          "timeliness_basis": {
            "basis_type": "model_background",
            "summary": "仅基于通用内容策划背景形成的常青选题假设，不代表当前趋势。",
            "source_reference_ids": ["src-model-1"]
          },
          "professional_hypotheses": [
            {
              "claim": "术语、方法与结果表达是该受众最优先的三个学习障碍。",
              "status": "unverified_claim",
              "source_reference_ids": ["src-model-1"]
            }
          ],
          "source_reference_ids": ["src-model-1"],
          "differentiation": "唯一用于验证模型受众假设、而非回答已有问题的学习路径提案。",
          "duplication_note": "未提供足够的历史入门内容，无法完成可靠重复判断。"
        },
        {
          "id": "TP-4",
          "title": "如何区分传统文化讨论与确定性人生预测？",
          "audience_basis": {
            "basis_type": "creator_input",
            "text": "博主希望向普通兴趣受众解释内容表达边界。",
            "source_reference_ids": ["src-input-1"]
          },
          "core_question": "什么样的表达属于审慎讨论，什么样的表达越过确定性承诺边界？",
          "content_angle": "用安全表达与高风险表达的原则对照进行边界教育。",
          "content_goal": "帮助受众理解内容用途，同时避免恐吓和绝对效果承诺。",
          "target_platforms": ["xiaohongshu", "douyin"],
          "timeliness_basis": {
            "basis_type": "none",
            "summary": "无明确时效依据，定位为常青知识内容。",
            "source_reference_ids": []
          },
          "professional_hypotheses": [
            {
              "claim": "传统文化讨论不得被包装成对灾祸或个人结果的确定性保证。",
              "status": "supported",
              "source_reference_ids": ["src-doctrine-1"]
            }
          ],
          "source_reference_ids": ["src-input-1", "src-doctrine-1"],
          "differentiation": "唯一以内容安全和表达边界教育为主要目标的常青提案。",
          "duplication_note": "现有历史材料只零散提及表达禁区，未发现同结构主题。"
        },
        {
          "id": "TP-5",
          "title": "围绕节气做一期知识内容，可以讲什么而不追逐热点？",
          "audience_basis": {
            "basis_type": "creator_input",
            "text": "博主希望为关注传统文化但不熟悉奇门体系的受众策划节气内容。",
            "source_reference_ids": ["src-input-1"]
          },
          "core_question": "如何利用真实节气信号策划有知识价值、不过度追逐热点的内容？",
          "content_angle": "从文化日历信号出发，组织概念背景、口径边界和可继续追问的问题。",
          "content_goal": "把时点灵感转化为可审核的知识选题方向。",
          "target_platforms": ["xiaohongshu"],
          "timeliness_basis": {
            "basis_type": "topic_signal",
            "summary": "使用工作空间中已记录的文化日历节点，不推断额外实时热度。",
            "source_reference_ids": ["src-signal-1"]
          },
          "professional_hypotheses": [
            {
              "claim": "节气背景可以连接到具体专业规则的讲解。",
              "status": "unverified_claim",
              "source_reference_ids": ["src-reference-1", "src-history-1"]
            }
          ],
          "source_reference_ids": ["src-input-1", "src-signal-1", "src-reference-1", "src-history-1"],
          "differentiation": "唯一以真实 Topic Signal 为策划起点、同时主动限制热点化表达的提案。",
          "duplication_note": "与历史节气短文存在主题邻近，但本提案增加口径冲突审核和知识结构。"
        }
      ]
    }
  },
  "source_references": [
    {
      "id": "src-input-1",
      "source_type": "creator_input",
      "label": "本次 Topic Discovery Prompt",
      "locator": "current-request",
      "supports": ["目标受众", "节气专题方向", "内容表达边界"]
    },
    {
      "id": "src-audience-1",
      "source_type": "creator_input",
      "label": "真实评论问题记录",
      "locator": "comment-record-184",
      "supports": ["TP-1 的 Audience Question"]
    },
    {
      "id": "src-signal-1",
      "source_type": "creator_input",
      "label": "文化日历 Topic Signal",
      "locator": "topic-signal-2026-08",
      "supports": ["TP-1 和 TP-5 的时效依据"]
    },
    {
      "id": "src-doctrine-1",
      "source_type": "authority_rule",
      "label": "Creator Doctrine：确定性表达禁区",
      "locator": "authority-rule-07",
      "supports": ["不得作灾祸保证", "不得作绝对效果承诺"]
    },
    {
      "id": "src-reference-1",
      "source_type": "reference_material",
      "label": "参考讲义甲",
      "locator": "第三章",
      "supports": ["节气属于判断规则边界条件的观点"]
    },
    {
      "id": "src-history-1",
      "source_type": "historical_expression",
      "label": "历史节气内容乙",
      "locator": "history-article-22",
      "supports": ["节气只作为文化背景的历史表达"]
    },
    {
      "id": "src-model-1",
      "source_type": "model_background",
      "label": "模型通用内容策划背景",
      "locator": "",
      "supports": ["待验证的入门受众需求假设"]
    }
  ],
  "knowledge_conflicts": [
    {
      "id": "conflict-1",
      "subject": "节气在专业讲解中的作用",
      "positions": [
        {
          "summary": "参考讲义甲将节气视为判断规则的直接边界条件。",
          "source_reference_ids": ["src-reference-1"]
        },
        {
          "summary": "历史内容乙仅将节气作为文化背景，不表述为直接规则。",
          "source_reference_ids": ["src-history-1"]
        }
      ],
      "confirmation_question": "本次选题应采用哪一种节气口径，或是否继续保留并列差异？"
    }
  ],
  "risk_flags": [
    {
      "id": "risk-1",
      "risk_type": "blocking_content_risk",
      "severity": "blocking",
      "description": "输入中的“保证避开灾祸”属于恐吓式确定性断言和绝对效果承诺。",
      "required_action": "删除该承诺，改为非确定性的文化知识讨论，并重新进行风险审核。"
    }
  ],
  "confirmation_items": [
    {
      "id": "confirm-conflict-1",
      "confirmation_type": "knowledge_conflict",
      "prompt": "请判断 conflict-1 中应采用的节气专业口径。",
      "blocking": true,
      "related_ids": ["conflict-1", "src-reference-1", "src-history-1"]
    },
    {
      "id": "confirm-risk-1",
      "confirmation_type": "professional_judgment",
      "prompt": "请删除或改写绝对效果承诺，并确认 risk-1 已解除。",
      "blocking": true,
      "related_ids": ["risk-1", "src-doctrine-1"]
    },
    {
      "id": "confirm-topic-approval",
      "confirmation_type": "approval",
      "prompt": "请明确 TP-1 至 TP-5 中哪些 Generated Topic Proposal 获得 Topic Approval；未获批准的提案不得成为 Topic Candidate。",
      "blocking": true,
      "related_ids": []
    }
  ],
  "generation_notes": {
    "mode": "exploration",
    "limitations": [
      "没有实时平台采集能力，未将模型背景描述为当前趋势。",
      "TP-3 的受众需求尚无真实 Audience Question 证据。"
    ],
    "handling_notes": [
      "固定生成 5 个提案，并按受众问题、内容角度和内容目标进行差异化。",
      "保留了节气口径的两种来源立场，未自动裁决。",
      "未把 Generated Topic Proposal 表述为 Topic Candidate 或已批准内容。"
    ]
  }
}
```
