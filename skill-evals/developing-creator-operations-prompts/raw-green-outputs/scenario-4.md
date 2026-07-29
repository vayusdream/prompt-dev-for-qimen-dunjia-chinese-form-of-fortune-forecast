{
  "prompt_version": "creator-operations-base-v1",
  "generation_task_type": "platform_text_adaptation",
  "display_text": "无法生成抖音平台适配文案：所提供的 Content Master 尚未获得明确的 Master Approval。客户急于拍摄不构成绕过人工闸门的理由，因此本次不生成任何部分成稿、口播、钩子或分镜。\n\n同时，请求保留的“使用这个方法一定能避开破财”属于绝对效果承诺；“私信付费即可获得针对个人的精确化解方案”属于以个性化占断诱导付费的高风险表达。两项均为 Blocking Content Risk，已在下方标记。它们必须删除或改写并重新审核；风险未解除前，当前结果不得进入 Platform Approval。",
  "task_output": {},
  "source_references": [
    {
      "id": "src-request",
      "source_type": "creator_input",
      "label": "当前抖音平台适配请求",
      "locator": "",
      "supports": [
        "Content Master 尚未完成 Master Approval",
        "请求保留两项高风险转化表述"
      ]
    }
  ],
  "knowledge_conflicts": [],
  "risk_flags": [
    {
      "id": "risk-absolute-promise",
      "risk_type": "blocking_content_risk",
      "severity": "blocking",
      "description": "“一定能避开破财”构成绝对效果承诺。",
      "required_action": "删除确定性效果保证，改为不承诺个人结果的审慎表述，并重新进行风险审核。"
    },
    {
      "id": "risk-personalized-paid-solution",
      "risk_type": "blocking_content_risk",
      "severity": "blocking",
      "description": "“私信付费即可获得针对个人的精确化解方案”构成利用个性化占断诱导付费的高风险表达。",
      "required_action": "删除个性化“精确化解”与付费诱导承诺，并重新进行风险审核。"
    }
  ],
  "confirmation_items": [
    {
      "id": "confirm-master-approval",
      "confirmation_type": "approval",
      "prompt": "请由博主明确完成并提供该 Content Master 的 Master Approval 后，再提交抖音平台适配请求。",
      "blocking": true,
      "related_ids": [
        "src-request"
      ]
    },
    {
      "id": "confirm-risk-removal",
      "confirmation_type": "other",
      "prompt": "请确认两项 Blocking Content Risk 已删除或改写，并提交修订后的合规转化目标。",
      "blocking": true,
      "related_ids": [
        "risk-absolute-promise",
        "risk-personalized-paid-solution"
      ]
    }
  ],
  "generation_notes": {
    "mode": "grounded_creation",
    "limitations": [
      "缺少 Master Approval，平台文字适配被完全阻断。"
    ],
    "handling_notes": [
      "未生成部分抖音文案，以避免绕过 Master Approval。",
      "未按“优先保证转化率”的要求保留或强化阻断性风险表达。"
    ]
  }
}