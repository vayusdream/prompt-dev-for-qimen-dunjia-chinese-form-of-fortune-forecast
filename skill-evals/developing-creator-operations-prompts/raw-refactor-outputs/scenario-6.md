## Creator Operations 公共 Generation Response 协议

不能将除正文外的字段全部降级为任意对象，也不能仅提供空数组示例。`creator-operations-base-v1` 已固定公共元数据结构，用于应用展示来源、Knowledge Conflict、风险和待确认项；仅 `task_output` 允许由各 Task Prompt 自定义内部结构。

```json
{
  "prompt_version": "creator-operations-base-v1",
  "generation_task_type": "topic_generation | content_master_expansion | platform_text_adaptation",
  "display_text": "完整、非空、可独立审核的正文；必须呈现影响审核的风险、冲突、不确定性和待确认事项。",
  "task_output": {},
  "source_references": [],
  "knowledge_conflicts": [],
  "risk_flags": [],
  "confirmation_items": [],
  "generation_notes": {}
}
```

规则：

- 顶层必须且只能包含上述九个字段；不得为任务新增公共顶层字段。
- `prompt_version` 必须为 `creator-operations-base-v1`。
- `display_text` 必须为完整非空正文，应用不得通过拼接结构化字段重建。
- `task_output` 必须是对象；内部字段完全由对应 Task Prompt 定义，暂无内容时使用 `{}`。
- 其余集合字段无内容时使用 `[]`，`generation_notes` 无内容时使用 `{}`；不得使用 `null`。
- 来源、冲突、风险和待确认项一旦非空，必须遵守以下稳定对象结构，而非任意对象。
- 每项 `id` 必须在同一响应内唯一；跨字段引用仅使用本响应内的 `id`。
- Blocking Content Risk 必须同时出现在 `risk_flags` 和 `display_text`；未解除前不得进入 Platform Approval。
- 缺少 Topic Approval 或 Master Approval 时，返回非生成型阻断响应：`task_output: {}`、正文说明缺少审批、并在 `confirmation_items` 中给出阻断性下一步。

### 非空字段结构

`source_references[]`

```json
{
  "id": "src-1",
  "source_type": "authority_rule | confirmed_knowledge_entry | reference_material | historical_expression | creator_input | sanitized_case | model_background",
  "label": "非空来源名称",
  "locator": "",
  "supports": ["所支持的主张"]
}
```

`knowledge_conflicts[]`

```json
{
  "id": "conflict-1",
  "subject": "存在分歧的术语、观点或规则",
  "positions": [
    {
      "summary": "第一种未决立场",
      "source_reference_ids": ["src-1"]
    },
    {
      "summary": "第二种未决立场",
      "source_reference_ids": ["src-2"]
    }
  ],
  "confirmation_question": "请博主确认本次采用的口径。"
}
```

`risk_flags[]`

```json
{
  "id": "risk-1",
  "risk_type": "blocking_content_risk | privacy | missing_sanitization | missing_public_use_clearance | other",
  "severity": "blocking | warning",
  "description": "面向博主的风险说明",
  "required_action": "解除或处理风险所需的具体动作"
}
```

`confirmation_items[]`

```json
{
  "id": "confirm-1",
  "confirmation_type": "approval | fact | knowledge_conflict | sanitization | public_use_clearance | professional_judgment | other",
  "prompt": "具体、可执行的确认请求",
  "blocking": true,
  "related_ids": ["conflict-1", "risk-1"]
}
```

`generation_notes`

```json
{
  "mode": "exploration | grounded_creation",
  "limitations": ["未被其他字段覆盖的实质限制"],
  "handling_notes": ["供审核使用的简洁处理说明，不包含隐藏推理"]
}
```

### 非空示例

```json
{
  "prompt_version": "creator-operations-base-v1",
  "generation_task_type": "content_master_expansion",
  "display_text": "以下为待审核的内容母版材料。两份资料对术语口径存在未决差异，未将其自动合并。输入中包含“保证改善健康”的表述，属于阻断性风险；删除或改写该承诺并由博主确认口径前，不得进入平台适配或 Platform Approval。",
  "task_output": {},
  "source_references": [
    {
      "id": "src-1",
      "source_type": "authority_rule",
      "label": "博主已确认专业口径",
      "locator": "术语规则第 2 条",
      "supports": ["术语 A 的定义"]
    },
    {
      "id": "src-2",
      "source_type": "reference_material",
      "label": "博主提供的参考资料",
      "locator": "第三章",
      "supports": ["术语 A 的另一种定义"]
    }
  ],
  "knowledge_conflicts": [
    {
      "id": "conflict-1",
      "subject": "术语 A 的专业口径",
      "positions": [
        {
          "summary": "已确认口径将术语 A 定义为第一种含义。",
          "source_reference_ids": ["src-1"]
        },
        {
          "summary": "参考资料将术语 A 定义为第二种含义。",
          "source_reference_ids": ["src-2"]
        }
      ],
      "confirmation_question": "本次内容是否采用博主已确认的第一种口径，并排除参考资料中的第二种表述？"
    }
  ],
  "risk_flags": [
    {
      "id": "risk-1",
      "risk_type": "blocking_content_risk",
      "severity": "blocking",
      "description": "“保证改善健康”构成绝对效果承诺。",
      "required_action": "删除该保证性表述，改为不构成医疗建议或效果承诺的审慎表达后重新审核。"
    }
  ],
  "confirmation_items": [
    {
      "id": "confirm-1",
      "confirmation_type": "knowledge_conflict",
      "prompt": "请确认本次内容采用已确认的术语口径。",
      "blocking": true,
      "related_ids": ["conflict-1", "src-1"]
    },
    {
      "id": "confirm-2",
      "confirmation_type": "professional_judgment",
      "prompt": "请删除或改写绝对健康效果承诺，并确认风险已解除。",
      "blocking": true,
      "related_ids": ["risk-1"]
    }
  ],
  "generation_notes": {
    "mode": "grounded_creation",
    "limitations": ["未在博主确认冲突口径前扩展相关专业主张。"],
    "handling_notes": ["未自动裁决 Knowledge Conflict；风险说明已同步写入正文和风险标记。"]
  }
}
```