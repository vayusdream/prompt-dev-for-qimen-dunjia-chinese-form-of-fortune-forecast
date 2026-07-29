# Creator Operations 生产 Prompt 公共响应协议

> 结论：不能将“来源、知识冲突、风险、待确认项”定义为任意对象，也不能用空数组作为生产示例。它们是审核、平台放行、追溯和指标的业务控制面；无约束会让前端无法稳定渲染、后端无法验证，且可能漏掉必须人工确认的冲突或阻断风险。

公共协议应固定外层信封与四类审核字段的**最小可验证结构**；各 Task Prompt 如需附加数据，只能放入明确的 `details` 扩展对象中。`displayText` 是完整、可审核的正文，不由客户端从结构化字段拼装或二次解析。

```ts
// 所有生产 Prompt 的版本化公共返回类型
interface GenerationResponseV1 {
  schemaVersion: "generation-response/v1";
  displayText: string;              // 完整展示正文，必填且不可为空
  sources: SourceTrace[];           // 允许为空；每项必须可追溯
  knowledgeConflicts: KnowledgeConflict[]; // 允许为空；冲突不得被静默省略
  risks: ContentRisk[];             // 允许为空；blocking 风险必须明确标识
  confirmations: ConfirmationItem[]; // 允许为空；待确认项必须可执行
  data: Record<string, unknown>;    // Task Key 专属、经该任务 Schema 校验的数据
}

interface SourceTrace {
  id: string;
  claim: string; // 对应正文中的关键主张或片段
  sourceType: "confirmed_knowledge" | "reference_material" |
              "historical_expression" | "model_background";
  sourceId?: string; // 非模型背景时必填，指向已保存的 Knowledge Source/Entry
  authority?: "doctrine" | "reference" | "historical";
  details?: Record<string, unknown>;
}

interface KnowledgeConflict {
  id: string;
  claim: string;
  conflictingSourceIds: string[];
  status: "open" | "resolved";
  requiredAction: "creator_review";
  details?: Record<string, unknown>;
}

interface ContentRisk {
  id: string;
  category: "medical" | "financial_or_gambling" | "legal" |
            "sensitive_fear" | "absolute_claim" | "high_fee_inducement" |
            "privacy" | "unverified_claim" | "other";
  severity: "info" | "warning" | "blocking";
  affectedText: string;
  resolutionStatus: "open" | "mitigated" | "cleared";
  details?: Record<string, unknown>;
}

interface ConfirmationItem {
  id: string;
  subject: string;
  reason: "knowledge_conflict" | "unverified_claim" | "source_authority" |
          "risk_clearance" | "case_authorization" | "other";
  requiredBefore?: "topic_approval" | "master_approval" | "platform_approval";
  status: "open" | "confirmed" | "rejected";
  details?: Record<string, unknown>;
}
```

最小响应示例（数组为空仅表示本次没有对应事项，不表示字段可不校验）：

```json
{
  "schemaVersion": "generation-response/v1",
  "displayText": "这里是供博主完整审核的正文。",
  "sources": [],
  "knowledgeConflicts": [],
  "risks": [],
  "confirmations": [],
  "data": {}
}
```

服务端必须在返回前校验该公共 Schema 与 Task Key 对应的 `data` Schema，并持久化响应版本、Task Key、Base/Task Prompt Version、模型执行记录及校验结果。前端按 `severity: "blocking"` 阻止 Platform Approval；`open` 的冲突、未验证主张、案例授权或风险清除待确认项必须可见并进入人工审核。这样保留任务级扩展的灵活性，同时不牺牲知识依据、风险闸门和可追溯性。
