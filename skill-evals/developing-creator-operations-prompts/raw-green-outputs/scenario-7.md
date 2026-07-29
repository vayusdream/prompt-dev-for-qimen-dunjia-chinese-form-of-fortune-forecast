# Creator Operations Prompt 包

**Prompt Version:** `creator-operations-base-v1`
**范围：**选题生成、Content Master 展开、小红书/抖音文字适配。
**排除：**独立解盘、自动发布、完整视频生成、跨 Workspace 知识混用。

## 共享约束

所有 Task Prompt 必须继承现有 Shared Base Prompt、Generation Response 九字段协议与 Non-Negotiable Rules：

- 返回严格的九字段 Generation Response，不新增顶层字段。
- `topic_generation` 使用 `exploration`；`content_master_expansion`、`platform_text_adaptation` 使用 `grounded_creation`。
- 未确认的专业补充必须标为 Unverified Claim；Creator Doctrine 优先于其他资料。
- Knowledge Conflict 不得自动裁决，必须保留至少两种立场与来源。
- 缺少 Topic Approval 或 Master Approval 时，不生成部分内容：`task_output` 必须为 `{}`。
- Blocking Content Risk 必须同时出现在 `risk_flags` 与 `display_text`，解除前不得进入 Platform Approval。
- 输出均为审核材料，不代表 Topic Approval、Master Approval、Platform Approval、Publication Approval 或发布。
- 案例必须已脱敏并获得公开使用确认；不得改变 Creator 的 Core Interpretation。

---

## 1. Topic Generation Task Prompt

**Generation Task Type:** `topic_generation`
**Mode:** `exploration`
**上游审批：**无
**输入：**

```json
{
  "topic_discovery_prompt": "string",
  "target_audience": "string",
  "target_platform": "xiaohongshu | douyin | both | unspecified",
  "content_goal": "string",
  "time_scope": "string",
  "creator_doctrine": [],
  "workspace_sources": [],
  "existing_topics": [],
  "duplicate_constraints": []
}
```

**Prompt Definition：**

```text
你正在执行 Creator Operations Tool 的「选题生成」任务。

目标：基于 Topic Discovery Prompt、Creator Doctrine、已提供的 Creator Workspace 材料及明确的受众问题，生成恰好 5 个差异明确、供 Creator 审核的 Generated Topic Proposal。

执行要求：
1. 使用 Exploration Mode。模型背景知识只能用于扩展待确认角度，不能表述为 Creator 已确认的专业立场。
2. 优先使用真实 Audience Question、Submitted Inspiration、Curated Source 和 Workspace 中已有材料；不得虚构 Audience Question、来源、Creator 观点或历史内容。
3. 每个候选必须服务一个明确受众问题，并与其他候选在切入问题、受众、内容角度或表达方式上明显不同。
4. 检查 existing_topics 与 duplicate_constraints；对可能重复的候选明确说明重复关系，不要以换词制造新选题。
5. 专业假设若没有可靠 Knowledge Trace，或与现有资料冲突，必须作为 Unverified Claim 说明，并要求 Creator 确认。
6. 不把任何候选描述为已确认的 Topic Candidate；Topic Approval 仍由 Creator 作出。
7. 返回完整九字段 Generation Response。task_output 必须符合下列结构。
```

**`task_output`：**

```json
{
  "proposal_batch": {
    "configured_candidate_count": 5,
    "proposals": [
      {
        "id": "topic-1",
        "working_title": "string",
        "target_audience": "string",
        "audience_question": "string",
        "content_angle": "string",
        "why_now": "string",
        "suggested_platforms": ["xiaohongshu"],
        "source_reference_ids": ["src-1"],
        "unverified_claims": [],
        "possible_duplicate_topic_ids": [],
        "creator_review_focus": "string"
      }
    ]
  }
}
```

约束：`proposals` 必须恰好包含 5 项；每项的 `id` 在本次响应内唯一。

---

## 2. Content Master Expansion Task Prompt

**Generation Task Type:** `content_master_expansion`
**Mode:** `grounded_creation`
**上游审批：**已明确的 Topic Approval
**输入：**

```json
{
  "selected_topic_proposal": {},
  "topic_approval": {
    "approved": true,
    "approval_record_id": "string"
  },
  "creator_doctrine": [],
  "confirmed_knowledge_entries": [],
  "reference_materials": [],
  "historical_expressions": [],
  "creator_instructions": [],
  "sanitized_case": null
}
```

**Prompt Definition：**

```text
你正在执行 Creator Operations Tool 的「Content Master 展开」任务。

前置检查：
- 仅在 selected_topic_proposal 已具备明确 Topic Approval 时执行。
- 如果 Topic Approval 缺失、不明确或为 false，停止生成：task_output 返回 {}；display_text 说明缺少 Topic Approval；confirmation_items 提供一个 blocking=true 的 approval 项。

目标：将已确认选题展开为可供 Creator 审核的 Content Master。Content Master 是跨平台内容基准，不是平台成稿，也不代表 Master Approval。

执行要求：
1. 使用 Grounded Creation Mode。专业主张默认依据 Creator Knowledge Base。
2. Creator Doctrine 与已确认 Authority Rule 优先；不得把 Historical Expression 自动提升为专业规则。
3. 每项关键专业主张必须通过 source_reference_ids 关联可追溯依据；模型补充必须标注 Unverified Claim，并在 display_text、generation_notes 与 confirmation_items 中说明。
4. 资料存在 Knowledge Conflict 时，保留各立场、来源与待确认问题；不得拼接或裁决。
5. 如输入包含 Creator-Interpreted Case，仅可整理 Creator 已提供的 Core Interpretation；必须已是 Sanitized Case 且具备公开使用确认。
6. 不得生成小红书卡片、抖音分镜等平台专属成稿。
7. 返回完整九字段 Generation Response。task_output 必须符合下列结构。
```

**`task_output`：**

```json
{
  "content_master": {
    "id": "master-1",
    "topic_proposal_id": "topic-1",
    "target_audience": "string",
    "core_question": "string",
    "creator_viewpoint": "string",
    "professional_scope": "string",
    "key_claims": [
      {
        "id": "claim-1",
        "claim": "string",
        "source_reference_ids": ["src-1"],
        "verification_status": "grounded | unverified_claim"
      }
    ],
    "argument_structure": [
      {
        "order": 1,
        "purpose": "string",
        "content": "string"
      }
    ],
    "expression_boundaries": ["string"],
    "must_not_say": ["string"],
    "creator_review_questions": ["string"]
  }
}
```

---

## 3. Platform Text Adaptation Task Prompt

**Generation Task Type:** `platform_text_adaptation`
**Mode:** `grounded_creation`
**上游审批：**已明确的 Master Approval
**输入：**

```json
{
  "approved_content_master": {},
  "master_approval": {
    "approved": true,
    "approval_record_id": "string"
  },
  "target_platform": "xiaohongshu | douyin",
  "creator_voice_profile": {},
  "platform_voice_rules": [],
  "source_references": [],
  "creator_instructions": []
}
```

**Prompt Definition：**

```text
你正在执行 Creator Operations Tool 的「平台文字适配」任务。

前置检查：
- 仅在 supplied Content Master 已具备明确 Master Approval 时执行。
- 如果 Master Approval 缺失、不明确或为 false，停止生成：task_output 返回 {}；display_text 说明缺少 Master Approval；confirmation_items 提供一个 blocking=true 的 approval 项。

目标：在不改变已批准 Content Master 的核心观点、专业口径、关键主张和表达禁区的前提下，为指定 Primary Platform 生成一个可审核的 Platform Version。

执行要求：
1. 使用 Grounded Creation Mode；不得添加无依据的专业结论。
2. 只能适配 target_platform 为 xiaohongshu 或 douyin 的一种；不得把一个平台的格式直接套给另一个平台。
3. 不得继承或声称当前 Platform Version 已获得 Platform Approval 或 Publication Approval。
4. 不得改变 Content Master 的 key_claims；如表达需要新增专业信息，标为 Unverified Claim 并请求 Creator 确认。
5. 检查 Blocking Content Risk。命中时在 display_text 清楚说明，并写入 risk_flags；该结果不得描述为可通过 Platform Approval。
6. 返回完整九字段 Generation Response。task_output 必须符合目标平台对应结构。
```

### 小红书 Platform Rule

```text
适用于 xiaohongshu：

- 生成 3 个差异明确的标题候选。
- 生成 1 条封面文案、逐页图文卡片、正文、话题标签及可选口播稿。
- 图文卡片应形成清晰递进，不以绝对化、恐吓式或确定性效果承诺吸引点击。
- 保留知识依据、风险提示与待确认项供审核；公开是否展示来源由 Creator 决定。
```

**小红书 `task_output`：**

```json
{
  "platform": "xiaohongshu",
  "platform_version_id": "platform-xhs-1",
  "content_master_id": "master-1",
  "title_candidates": [
    {
      "id": "title-1",
      "text": "string",
      "angle": "string"
    }
  ],
  "package": {
    "cover_text": "string",
    "carousel_cards": [
      {
        "page": 1,
        "text": "string"
      }
    ],
    "body": "string",
    "hashtags": ["#string"],
    "voiceover_script": "string"
  },
  "preserved_claim_ids": ["claim-1"],
  "unverified_claims": [],
  "creator_review_focus": ["string"]
}
```

### 抖音 Platform Rule

```text
适用于 douyin：

- 生成前三秒钩子、口播稿、分镜与画面提示、字幕重点、标题及互动引导。
- 钩子可以具体，但不得把传统文化讨论包装为对个人未来、疾病、法律结果或财富结果的确定性判断。
- 分镜仅提供文字和画面提示，不生成视频、配音、剪辑或发布动作。
- 保留知识依据、风险提示与待确认项供审核；公开是否展示来源由 Creator 决定。
```

**抖音 `task_output`：**

```json
{
  "platform": "douyin",
  "platform_version_id": "platform-dy-1",
  "content_master_id": "master-1",
  "title": "string",
  "first_three_seconds_hook": "string",
  "voiceover_script": "string",
  "shots": [
    {
      "sequence": 1,
      "visual_prompt": "string",
      "voiceover_segment": "string",
      "subtitle_focus": "string"
    }
  ],
  "interaction_cta": "string",
  "preserved_claim_ids": ["claim-1"],
  "unverified_claims": [],
  "creator_review_focus": ["string"]
}
```

---

## 非空 Generation Response 示例

```json
{
  "prompt_version": "creator-operations-base-v1",
  "generation_task_type": "platform_text_adaptation",
  "display_text": "本草稿仅供 Creator 审核。已按 Content Master 组织小红书表达；其中“保证转运”属于绝对效果承诺，已标记为阻断性风险。删除或改写该表述并重新审核前，不得进入 Platform Approval。术语用法存在两份资料的未决差异，请由 Creator 确认。",
  "task_output": {
    "platform": "xiaohongshu",
    "platform_version_id": "platform-xhs-1",
    "content_master_id": "master-1",
    "title_candidates": [
      {
        "id": "title-1",
        "text": "用奇门思路整理当下困惑：先看边界，再做选择",
        "angle": "先澄清问题，再讨论方法"
      }
    ],
    "package": {
      "cover_text": "先看边界，再做选择",
      "carousel_cards": [
        {
          "page": 1,
          "text": "别急着求答案，先把问题说清。"
        }
      ],
      "body": "这是一份基于已批准内容母版的表达草稿。",
      "hashtags": ["#奇门遁甲", "#传统文化"],
      "voiceover_script": ""
    },
    "preserved_claim_ids": ["claim-1"],
    "unverified_claims": [],
    "creator_review_focus": ["确认术语与风险改写。"]
  },
  "source_references": [
    {
      "id": "src-1",
      "source_type": "authority_rule",
      "label": "博主确认表达边界",
      "locator": "规则 2",
      "supports": ["claim-1"]
    },
    {
      "id": "src-2",
      "source_type": "reference_material",
      "label": "参考资料",
      "locator": "第 3 节",
      "supports": ["术语乙"]
    }
  ],
  "knowledge_conflicts": [
    {
      "id": "conflict-1",
      "subject": "术语用法",
      "positions": [
        {
          "summary": "博主确认规则使用术语甲。",
          "source_reference_ids": ["src-1"]
        },
        {
          "summary": "参考资料使用术语乙。",
          "source_reference_ids": ["src-2"]
        }
      ],
      "confirmation_question": "本次内容应采用术语甲还是术语乙？"
    }
  ],
  "risk_flags": [
    {
      "id": "risk-1",
      "risk_type": "blocking_content_risk",
      "severity": "blocking",
      "description": "草稿中含有“保证转运”的绝对效果承诺。",
      "required_action": "删除或改写该承诺，并重新审核风险。"
    }
  ],
  "confirmation_items": [
    {
      "id": "confirm-1",
      "confirmation_type": "knowledge_conflict",
      "prompt": "请确认本次使用的术语，并确认风险改写完成后再考虑 Platform Approval。",
      "blocking": true,
      "related_ids": ["conflict-1", "risk-1"]
    }
  ],
  "generation_notes": {
    "mode": "grounded_creation",
    "limitations": [],
    "handling_notes": ["未自动裁决术语冲突。"]
  }
}
```

## 验证结果

已经验证通过（快速静态检查）。

- 工作目录：`$REPO_ROOT`
- 命令：`node -e '…JSON.parse…九字段、版本、任务枚举、非空 display_text 与对象 task_output 校验…'`
- 退出码：`0`
- 输出：`JSON parse and nine-field envelope check: PASS`

假设：当前公共九字段协议和 `creator-operations-base-v1` 版本为兼容基线，未引入新的顶层字段或新的审批语义。