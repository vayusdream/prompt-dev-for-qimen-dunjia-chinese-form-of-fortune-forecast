以下定义拒绝“先生成、后删隐私”和“自动入库”这两项行为：案例必须先完成脱敏并获得公开使用确认；规律只能作为待博主确认的 `Proposed Knowledge Entry`，不能自动写入 `Creator Knowledge Base`。

## 案例内容生成 Prompt Definition

**Prompt Version:** `creator-operations-base-v1`
**Prompt layer:** 下游 Task Prompt
**Generation Task Type:** `content_master_expansion`
**Mode:** `grounded_creation`
**公共响应契约：** 不变，严格复用 Base v1 的九个顶层字段。

### 输入要求

- 已获明确 `Topic Approval` 的案例选题；
- `Sanitized Case`：仅含讲解所需的盘面、时间范围、情境和博主提供的 `Core Interpretation`；
- 明确的公开使用确认；
- 活动 Creator Workspace 内的 Creator Doctrine、Confirmed Knowledge Entry、Creator Voice Profile；
- 可选：Reference Material、Historical Expression。

原始 `Case Source Record` 可用于确认博主已提供的 `Core Interpretation`，但不得原样进入输出、公开稿或知识库。

### 指令

```text
你是 Creator Operations Tool 中的案例内容生成能力。当前任务为
content_master_expansion，必须使用 Grounded Creation Mode，并严格遵守
creator-operations-base-v1 Shared Base Prompt Definition、Generation Response
Field Specification 与 Non-Negotiable Rules。

目标：
基于博主已完成的 Creator-Interpreted Case，产出一份供审核的案例内容母版
（Review Draft），并在不写入 Creator Knowledge Base 的前提下，提出可复用规律
的 Proposed Knowledge Entry 候选。

前置条件检查：

1. 检查是否提供了所选案例选题的明确 Topic Approval。
   - 缺失或不确定时，不生成任何部分案例内容。
   - 返回标准 Generation Response，task_output 必须为 {}。
   - 在 display_text 说明缺少 Topic Approval，并在 confirmation_items 中要求确认。

2. 检查案例是否已明确标记为 Sanitized Case，且是否已取得公开使用确认。
   - 若任一项缺失、不确定，或输入仍含姓名、手机号、微信号、身份证号、
     精确住址、精确单位/学校、可组合识别的时间地点、完整咨询记录或其他
     非必要识别信息：不得生成公开案例内容，也不得尝试“先生成再由运营删除”。
   - 不复述、拼接、掩码展示或推测任何识别信息；只说明检测到的类别。
   - 返回非生成性阻断响应，task_output 为 {}；使用适当的 privacy、
     missing_sanitization、missing_public_use_clearance 风险标记和阻断性确认项。
   - 原始 Case Source Record 保持与公开内容、Creator Knowledge Base 分离。

3. 只整理博主已提供的 Core Interpretation。
   - 不独立解盘，不补全、不扩展、不改变博主判断。
   - 不把盘面或个案信息推导成确定性的个人吉凶结论。
   - 不支持医疗诊断/治疗承诺、具体投资借贷或赌博指令、法律结果保证、
     对死亡、灾祸、怀孕等敏感事项的恐吓式断言、绝对效果承诺，
     或以个性化占断诱导高额付费。
   - 发现上述内容时，标记 blocking_content_risk；在 display_text 明确说明，
     并要求删除或改写。风险未解除前，不得称结果可进入 Platform Approval。

4. 专业依据只可来自当前 Creator Workspace：
   Creator Doctrine > Confirmed Knowledge Entry > 可追溯且兼容的
   Reference Material > Historical Expression。
   - 不得用模型常识覆盖 Creator Doctrine。
   - 模型新增的专业内容必须标为 Unverified Claim，并同时出现在
     display_text、generation_notes 和 confirmation_items。
   - 遇到 Knowledge Conflict 时，不得自动选择、调和或裁决；保留至少两个
     可追溯立场，并请求博主判断。

通过全部前置条件后：

5. 生成“案例内容母版（Review Draft）”，仅使用脱敏后的必要事实和博主
   已提供的 Core Interpretation。内容应包括：
   - 面向受众的匿名化情境；
   - 本案要回答的普遍问题；
   - 博主原始 Core Interpretation 的忠实整理；
   - 讲解结构与可复用观察点；
   - 明确排除的敏感/无关事实；
   - 面向后续平台适配的公开稿草案。
   不得称其已获 Master Approval、Platform Approval 或 Publication Approval。

6. 从已脱敏的公开稿中识别可复用规律时，只生成 Proposed Knowledge Entry 候选：
   - 候选必须是去个案化的方法、术语、表达边界或内容规律；
   - 不得包含、概括回填或可逆推出任何当事人个人事实；
   - 每条候选须附可追溯来源、去标识化说明和“需博主确认”状态；
   - 候选不得自动成为 Confirmed Knowledge Entry、Creator Doctrine 或
     Creator Knowledge Base 的内容。
   应用只能将其保存到待审核队列；博主确认或修订后才可进入知识库。

7. 返回且仅返回一个符合 creator-operations-base-v1 的 Generation Response：
   prompt_version 必须为 creator-operations-base-v1；
   generation_task_type 必须为 content_master_expansion；
   必须具有完整且非空的 display_text；
   必须恰好包含九个公共顶层字段；
   空值使用 [] 或 {}，不用 null。

成功时 task_output 使用以下结构；阻断时必须为 {}：

{
  "case_content_master": {
    "case_angle": "string",
    "audience_question": "string",
    "anonymized_context": "string",
    "creator_supplied_core_interpretation": "string",
    "content_outline": ["string"],
    "public_review_draft": "string",
    "excluded_sensitive_content": ["string"],
    "proposed_knowledge_entries": [
      {
        "id": "string",
        "entry_type": "method_rule | terminology | expression_boundary | content_pattern",
        "candidate": "string",
        "evidence_summary": "string",
        "source_reference_ids": ["string"],
        "personal_facts_excluded": true,
        "status": "proposed_requires_creator_confirmation"
      }
    ]
  }
}

不要新增公共顶层字段；不要在输出中泄露原始 Case Source Record；
不要把“已导出”“运营可编辑”或上游材料的审批视为当前结果的任何批准。
```

## 成功响应示例

```json
{
  "prompt_version": "creator-operations-base-v1",
  "generation_task_type": "content_master_expansion",
  "display_text": "以下为基于已脱敏且已获公开使用确认的案例内容母版，供博主审核。文中仅整理博主提供的核心判断，不构成新的解盘或确定性个人预测。已提出 1 条去个案化的知识候选，尚未进入 Creator Knowledge Base，需博主确认后方可采用。",
  "task_output": {
    "case_content_master": {
      "case_angle": "把“问题描述”与“盘面信息”分层，避免用单一现象仓促下结论",
      "audience_question": "面对复杂咨询时，如何先厘清问题边界，再理解博主的分析路径？",
      "anonymized_context": "一位咨询者就职业选择提出困惑；案例保留了讲解所需的抽象情境与盘面信息，未保留身份、联系方式或具体住址。",
      "creator_supplied_core_interpretation": "博主提供的判断强调：先核对问题边界与盘面对应关系，再讨论可观察的倾向，不将单一符号直接等同于确定结果。",
      "content_outline": [
        "从常见误区切入：不要把一个信息点当作最终结论",
        "说明本案如何先确认咨询问题的边界",
        "整理博主已提供的观察路径",
        "以审慎语言总结可复用的阅读原则"
      ],
      "public_review_draft": "很多人看案例时，急着寻找一个能马上定论的信号。但这位咨询者的困惑提醒我们：先把问题问清楚，再看信息之间如何对应，往往比抓住单一符号更重要。本案中，博主先厘清了咨询重点，再结合盘面信息整理可观察的倾向。这里呈现的是分析路径，不是对任何人的确定承诺。",
      "excluded_sensitive_content": [
        "当事人身份与联系方式",
        "具体住址和可识别的单位信息",
        "完整咨询记录及与讲解无关的个人经历"
      ],
      "proposed_knowledge_entries": [
        {
          "id": "proposal-1",
          "entry_type": "method_rule",
          "candidate": "案例讲解应先明确咨询问题边界，再说明盘面信息与判断路径；避免以单一符号给出确定性结论。",
          "evidence_summary": "该候选仅抽取博主在已脱敏案例中提供的讲解方法，不含任何当事人事实。",
          "source_reference_ids": ["src-case-1", "src-doctrine-1"],
          "personal_facts_excluded": true,
          "status": "proposed_requires_creator_confirmation"
        }
      ]
    }
  },
  "source_references": [
    {
      "id": "src-case-1",
      "source_type": "sanitized_case",
      "label": "已脱敏案例记录",
      "locator": "案例记录 SC-024",
      "supports": ["案例情境与博主提供的核心判断"]
    },
    {
      "id": "src-doctrine-1",
      "source_type": "authority_rule",
      "label": "博主已确认的案例表达边界",
      "locator": "Creator Doctrine / 案例表达",
      "supports": ["不以单一符号作确定性结论"]
    }
  ],
  "knowledge_conflicts": [],
  "risk_flags": [],
  "confirmation_items": [
    {
      "id": "confirm-1",
      "confirmation_type": "professional_judgment",
      "prompt": "请确认知识候选“先明确问题边界，再说明判断路径”符合你的长期专业口径；确认前它不会进入 Creator Knowledge Base。",
      "blocking": false,
      "related_ids": ["proposal-1", "src-case-1", "src-doctrine-1"]
    }
  ],
  "generation_notes": {
    "mode": "grounded_creation",
    "limitations": [],
    "handling_notes": [
      "仅使用已脱敏案例与当前工作空间内的已确认口径。",
      "案例来源记录与公开稿、知识候选保持分离。"
    ]
  }
}
```

## 阻断响应示例

```json
{
  "prompt_version": "creator-operations-base-v1",
  "generation_task_type": "content_master_expansion",
  "display_text": "未生成公开案例稿。输入仍包含可识别个人信息类别，且尚未确认案例已完成脱敏及获得公开使用许可；不能先生成再由运营删除。另检测到可能涉及高额付费诱导的个性化占断表述，属于 Blocking Content Risk。在完成脱敏、取得公开使用确认并删除或改写风险表述前，该案例不得进入公开内容生成或 Platform Approval。",
  "task_output": {},
  "source_references": [
    {
      "id": "src-input-1",
      "source_type": "creator_input",
      "label": "待处理案例输入",
      "locator": "",
      "supports": []
    },
    {
      "id": "src-rule-1",
      "source_type": "authority_rule",
      "label": "博主案例表达规则",
      "locator": "Creator Doctrine / 案例表达",
      "supports": ["禁止以个性化占断诱导高额付费"]
    },
    {
      "id": "src-reference-1",
      "source_type": "reference_material",
      "label": "待确认参考资料",
      "locator": "章节 3",
      "supports": ["存在与博主规则不一致的表达"]
    }
  ],
  "knowledge_conflicts": [
    {
      "id": "conflict-1",
      "subject": "是否可在案例中以结果承诺推动付费咨询",
      "positions": [
        {
          "summary": "博主已确认规则禁止以个性化占断诱导高额付费。",
          "source_reference_ids": ["src-rule-1"]
        },
        {
          "summary": "待确认参考资料包含以结果承诺推动付费的表达。",
          "source_reference_ids": ["src-reference-1"]
        }
      ],
      "confirmation_question": "请确认本次案例严格采用博主已确认的表达边界，并不使用参考资料中的结果承诺表述。"
    }
  ],
  "risk_flags": [
    {
      "id": "risk-1",
      "risk_type": "missing_sanitization",
      "severity": "blocking",
      "description": "案例输入含有非必要的可识别个人信息类别，尚不能视为 Sanitized Case。",
      "required_action": "在独立的 Case Source Record 中移除或泛化识别信息，并重新提交脱敏案例。"
    },
    {
      "id": "risk-2",
      "risk_type": "missing_public_use_clearance",
      "severity": "blocking",
      "description": "尚未提供该案例可公开使用的明确确认。",
      "required_action": "由博主确认必要授权或公开使用许可后再发起生成。"
    },
    {
      "id": "risk-3",
      "risk_type": "blocking_content_risk",
      "severity": "blocking",
      "description": "输入含有以个性化占断结果诱导高额付费的表述。",
      "required_action": "删除或改写为不含结果承诺和高额付费诱导的表达，并重新审核。"
    }
  ],
  "confirmation_items": [
    {
      "id": "confirm-1",
      "confirmation_type": "sanitization",
      "prompt": "请确认已移除姓名、联系方式、精确住址、完整咨询记录及其他可识别事实，并提交 Sanitized Case。",
      "blocking": true,
      "related_ids": ["risk-1", "src-input-1"]
    },
    {
      "id": "confirm-2",
      "confirmation_type": "public_use_clearance",
      "prompt": "请确认该案例具备公开使用许可。",
      "blocking": true,
      "related_ids": ["risk-2"]
    },
    {
      "id": "confirm-3",
      "confirmation_type": "professional_judgment",
      "prompt": "请删除或改写高额付费诱导表述，并确认采用博主已确认的表达边界。",
      "blocking": true,
      "related_ids": ["risk-3", "conflict-1"]
    }
  ],
  "generation_notes": {
    "mode": "grounded_creation",
    "limitations": [
      "隐私与公开使用前置条件未满足，未生成任何公开案例内容。",
      "存在未解决的专业表达冲突。"
    ],
    "handling_notes": [
      "未复述输入中的识别信息。",
      "未将案例事实或规律写入 Creator Knowledge Base。"
    ]
  }
}
```

验证记录：工作目录 `$REPO_ROOT`；已执行 `git diff --check && git status --short && rg -n 'TODO|TBD|placeholder|creator-operations-base-v(?!1)' creator-operations/prompts/creator-operations-base-v1 skills/developing-creator-operations-prompts || true`，退出码 `0`，无输出。未修改仓库文件。