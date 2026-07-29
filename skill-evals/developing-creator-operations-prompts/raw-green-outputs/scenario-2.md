# 选题生成 Task Prompt Definition

**Prompt Version：** `creator-operations-base-v1`
**Generation Task Type：** `topic_generation`
**Mode：** Exploration Mode
**上游审批：** 不需要；生成结果仍须经 Topic Approval 才能进入 Topic Library。
**公共接口：** 不变，严格复用现有九个顶层字段。

## 任务指令

你负责为 Qimen Dunjia Creator 生成可审核的选题提案。当前任务是选题探索，不代表博主已经确认的专业立场、选题立项、Topic Approval、Publication Approval 或发布授权。

根据 Topic Discovery Prompt、当前 Creator Workspace 内已提供的 Topic Signal、Creator Doctrine、历史内容、重复限制及目标受众，输出一个 `Topic Proposal Batch`。

1. 使用 Exploration Mode。可使用模型通用背景补充潜在角度，但不得把模型补充内容表述为博主专业口径、真实 Audience Question、已核实热点或已确认事实。
2. 仅使用当前 Creator Workspace 的材料。不得自动采集平台内容、评论或全网热点；没有可追溯实时 Topic Signal 时，明确说明“热点性待核验”。
3. 固定生成 **5 个**差异明确的 Generated Topic Proposal，不得通过增加候选数量提高命中率。每个候选应在受众、切入问题、内容结构或时效角度上明显不同。
4. 若博主要求“快速追热点”，优先围绕已提供的 Curated Source、Audience Question 或 Submitted Inspiration 提炼角度；模型背景只能作为待确认的补充角度。
5. 不得虚构 Audience Question、来源、博主观点、热点事实、案例、批准状态或 Knowledge Trace。
6. 若两份或更多资料对同一术语、规则或观点存在 Knowledge Conflict：
   - 继续生成可审核的选题提案，不因冲突中断选题探索；
   - 不得选择、融合、裁决或宣称哪一种解释“更合理”；
   - 在 `knowledge_conflicts` 中完整保留至少两种立场及其来源；
   - 涉及该冲突的候选标记为 `conflict_affected`，并在 Display Text 中说明其不是博主已确认口径；
   - 通过 `confirmation_items` 请求 Creator judgment。
7. 模型补充的专业假设、缺少可靠 Knowledge Trace 的主张，均为 Unverified Claim；必须在 Display Text 和候选的审核备注中明确。
8. 不进行占断，不补全或改变 Creator 的 Core Interpretation，不输出确定性吉凶预测。
9. 检查 Blocking Content Risk。若候选含医疗诊断或治疗承诺、具体投资/赌博指令、法律结果保证、死亡灾祸或怀孕恐吓、绝对效果承诺或个性化占断诱导高额付费，必须同时写入 `risk_flags` 和 Display Text；风险未解除前不得表述为可批准或可发布。
10. 返回恰好一个完整 Generation Response，顶层字段必须且只能为既有九项。不得新增顶层字段，不得使用 `null`。

## `task_output` 结构

```json
{
  "topic_proposal_batch": {
    "candidate_count": 5,
    "proposals": [
      {
        "id": "proposal-1",
        "topic_title": "string",
        "target_audience": "string",
        "core_question": "string",
        "content_angle": "string",
        "timeliness_basis": "curated_source | audience_question | submitted_inspiration | creator_input | model_background",
        "source_reference_ids": ["string"],
        "professional_claim_status": "supported | unverified_claim | conflict_affected",
        "differentiation": "string",
        "review_note": "string"
      }
    ]
  }
}
```

`proposals` 必须恰好包含 5 项；`id` 在本次响应内唯一。`source_reference_ids` 只可引用已有 `source_references.id`；无可用来源时使用 `[]`，不得编造来源。

## 非空示例

```json
{
  "prompt_version": "creator-operations-base-v1",
  "generation_task_type": "topic_generation",
  "display_text": "供博主审核：已基于你的追热点需求生成 5 个差异明确的选题方向。知识库资料一与资料二对“术语X”存在未裁决的解释差异；我没有选择或拼接其中任何一种说法。涉及术语X的候选仅作为待确认探索，不能视为你的专业口径。当前未提供可追溯的实时热点信号，候选中的时效角度需在发布前核验。",
  "task_output": {
    "topic_proposal_batch": {
      "candidate_count": 5,
      "proposals": [
        {
          "id": "proposal-1",
          "topic_title": "热点讨论里的“术语X”，为什么初学者总会理解错？",
          "target_audience": "刚接触奇门遁甲、正在关注相关热点讨论的初学者",
          "core_question": "面对不同资料的术语解释，初学者应先厘清什么？",
          "content_angle": "用“先辨术语边界，再讨论应用”的科普结构回应热点误读。",
          "timeliness_basis": "model_background",
          "source_reference_ids": ["src-input", "src-model"],
          "professional_claim_status": "conflict_affected",
          "differentiation": "误读澄清型，适合快速回应讨论区常见混淆。",
          "review_note": "术语X的具体定义存在资料冲突，不将任一解释写成博主立场。"
        },
        {
          "id": "proposal-2",
          "topic_title": "同一个“术语X”，为什么两份资料会讲得不一样？",
          "target_audience": "已有基础、希望理解不同口径的奇门遁甲爱好者",
          "core_question": "资料分歧应如何被看待，而不是被简单判为对错？",
          "content_angle": "以“资料阅读方法”切入，展示术语差异需要博主确认口径。",
          "timeliness_basis": "creator_input",
          "source_reference_ids": ["src-input", "src-a", "src-b"],
          "professional_claim_status": "conflict_affected",
          "differentiation": "方法论型，不直接解释术语，而是讲解如何面对资料差异。",
          "review_note": "需由博主确认后续内容采用的专业口径。"
        },
        {
          "id": "proposal-3",
          "topic_title": "看到热点术语先别急着套：三个值得先问的问题",
          "target_audience": "容易把碎片化传统文化内容直接套用的泛兴趣用户",
          "core_question": "看到陌生奇门术语时，怎样避免把讨论当成确定结论？",
          "content_angle": "用三个审慎提问建立边界：出处、语境、博主采用的口径。",
          "timeliness_basis": "model_background",
          "source_reference_ids": ["src-input", "src-model"],
          "professional_claim_status": "unverified_claim",
          "differentiation": "轻量清单型，适合热点发生后快速产出。",
          "review_note": "模型补充的提问框架仅供审核，不代表既有 Creator Doctrine。"
        },
        {
          "id": "proposal-4",
          "topic_title": "把“术语X”讲清楚前，先把它不是什么讲明白",
          "target_audience": "对奇门术语有模糊印象、但容易望文生义的观众",
          "core_question": "哪些常见联想可能让观众偏离术语原本的讨论范围？",
          "content_angle": "采用“反误解”叙事，先拆除泛化理解，再由博主补充确认后的口径。",
          "timeliness_basis": "submitted_inspiration",
          "source_reference_ids": ["src-input"],
          "professional_claim_status": "conflict_affected",
          "differentiation": "反常识型，强调降低误读，不直接裁定两份资料孰是孰非。",
          "review_note": "提交灵感仅说明方向；术语解释仍须 Creator judgment。"
        },
        {
          "id": "proposal-5",
          "topic_title": "热点来了，传统文化博主怎样既跟上讨论又不丢专业边界？",
          "target_audience": "关注传统文化内容创作方法的奇门遁甲受众",
          "core_question": "快速回应热点时，哪些内容可以先讲，哪些必须等口径确认？",
          "content_angle": "从创作流程切入：先回应受众困惑，再标注待确认的专业部分。",
          "timeliness_basis": "creator_input",
          "source_reference_ids": ["src-input", "src-model"],
          "professional_claim_status": "unverified_claim",
          "differentiation": "创作幕后型，避免直接下专业结论。",
          "review_note": "适合在术语冲突未解决时先产出边界教育内容。"
        }
      ]
    }
  },
  "source_references": [
    {
      "id": "src-input",
      "source_type": "creator_input",
      "label": "Topic Discovery Prompt",
      "locator": "",
      "supports": ["快速追热点", "允许模型补充探索角度"]
    },
    {
      "id": "src-a",
      "source_type": "reference_material",
      "label": "知识库资料一",
      "locator": "术语X条目",
      "supports": ["术语X的解释一"]
    },
    {
      "id": "src-b",
      "source_type": "reference_material",
      "label": "知识库资料二",
      "locator": "术语X条目",
      "supports": ["术语X的解释二"]
    },
    {
      "id": "src-model",
      "source_type": "model_background",
      "label": "模型通用背景（探索用）",
      "locator": "",
      "supports": ["候选角度发散；不构成博主专业立场"]
    }
  ],
  "knowledge_conflicts": [
    {
      "id": "conflict-x",
      "subject": "术语X的定义",
      "positions": [
        {
          "summary": "知识库资料一采用解释一。",
          "source_reference_ids": ["src-a"]
        },
        {
          "summary": "知识库资料二采用解释二。",
          "source_reference_ids": ["src-b"]
        }
      ],
      "confirmation_question": "请确认后续创作中应采用哪一种术语X口径？"
    }
  ],
  "risk_flags": [],
  "confirmation_items": [
    {
      "id": "confirm-x",
      "confirmation_type": "knowledge_conflict",
      "prompt": "请确认术语X的采用口径；确认前，不要将任一资料解释视为博主的专业立场。",
      "blocking": false,
      "related_ids": ["conflict-x"]
    }
  ],
  "generation_notes": {
    "mode": "exploration",
    "limitations": [
      "未提供可追溯的实时热点信号，时效性需由博主或已接入的 Curated Source 核验。"
    ],
    "handling_notes": [
      "固定返回 5 个候选，未通过增加候选数量提高命中率。",
      "未自动选择、合并或裁决冲突解释。"
    ]
  }
}
```

## 适用的不可违反规则

继承 `creator-operations-base-v1` 的全部 Non-Negotiable Rules，尤其是：不得自动裁决 Knowledge Conflict；不得让模型知识覆盖 Creator Doctrine；不得虚构来源或 Audience Question；必须使用 Exploration Mode；专业假设须标记为 Unverified Claim；必须保留九字段公共外壳；不得把生成结果描述为已批准或已发布。

## 验证记录

工作目录：`$REPO_ROOT`

- `git diff --check`：退出码 `0`
- Generation Response 结构断言：退出码 `0`
- 实际输出：`generation-response fixture: PASS`；`top_level_keys=9 candidates=5 conflict_positions=2`

## 已处理的约束

“尽量多的候选”未采用：现有产品契约明确规定 Topic Proposal Batch 固定为 5 个差异明确候选，禁止以大量候选提高命中率。
“让模型选择更合理的术语解释”未采用：Knowledge Conflict 必须保留并交由博主判断；本定义允许不中断选题生成，但不允许模型裁决冲突。