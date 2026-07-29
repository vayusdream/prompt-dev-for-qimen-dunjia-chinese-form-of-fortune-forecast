# Prompt Development Workflow

本文沉淀 Creator Operations Tool 共享 Base Prompt 的实际开发流程，作为后续创建个人 Prompt 开发 Skill 的输入材料。它描述如何从产品上下文与决策文档出发，开发可版本化、可审核、可验证的 Prompt Definition；它本身不是 Skill，也不包含任何具体下游 Task Prompt。

## 1. 适用场景

适用于需要同时满足以下条件的 Prompt 开发任务：

- Prompt Definition 与应用代码解耦；
- Prompt 需要独立版本管理；
- 输出既包含完整可审核文本，也包含稳定结构化字段；
- 多个 Task Prompt 需要共享相同的知识、权限、安全和审批规则；
- Prompt 的行为需要通过静态验证和独立审阅追踪。

## 2. 必要输入

开始开发前，收集并确认以下材料：

1. 产品上下文与标准术语；
2. 产品范围、人工审批点与明确不做事项；
3. 与 Prompt、知识依据、隐私和内容风险有关的 ADR；
4. 本次 Prompt 的适用任务和明确排除范围；
5. 版本标识；
6. 公共响应字段及应用解析要求；
7. 不可违反规则；
8. 验收和验证要求。

如果缺少会改变权限边界、知识优先级、审批流程或公共接口的信息，应先补齐决策，不能通过 Prompt 作者自行猜测。

## 3. 先划分 Prompt 架构

不要直接编写一个承担所有任务的单体 Prompt。先区分：

- **Base Prompt**：角色、权限、知识优先级、生成模式、安全边界、审批闸门、公共响应外壳和通用语言规则；
- **Task Prompt**：单一生成任务的目标、输入要求、任务流程和 `task_output` 结构；
- **Platform Rule**：只适用于特定平台的表达和交付格式。

Base Prompt 可以识别任务类型并实施共同治理，但不得包含候选数量、平台栏目或某个任务的专属输出结构。

## 4. Base Prompt 开发顺序

### 4.1 定义角色与服务对象

- 说明模型是产品内部的生成能力；
- 明确服务对象及内容类型；
- 说明模型协助整理、提炼和表达，不代替专业判断；
- 明确所有生成结果默认是 Review Draft 或审核材料。

### 4.2 定义指令优先级

明确发生冲突时的处理顺序：

1. 系统安全和平台政策；
2. Base Prompt 与不可违反规则；
3. 当前 Task Prompt；
4. 当前请求和 Creator Workspace 材料。

低优先级指令不得覆盖高优先级规则。无法安全执行时，返回限制和待确认项，不得静默改变要求。

### 4.3 定义知识优先级

将知识来源按权威性明确排序，并写明每一类来源能做什么、不能做什么：

1. Creator Doctrine 和 Authority Rule；
2. Confirmed Knowledge Entry；
3. Reference Material；
4. Historical Expression；
5. 模型通用背景。

模型知识不得覆盖 Creator Doctrine；Historical Expression 不得自动升级为 Authority Rule；Proposed Knowledge Entry 不得冒充已确认知识。

### 4.4 定义生成模式

不同任务可以共用 Base Prompt，但必须采用与任务风险相符的共同模式：

- **Exploration Mode**：用于选题发散；模型背景只能形成待确认假设；
- **Grounded Creation Mode**：用于 Content Master 和 Platform Version；专业内容默认依据 Creator Knowledge Base；
- 缺少可靠 Knowledge Trace 或存在冲突的专业主张必须标记为 Unverified Claim。

### 4.5 定义专业与数据边界

至少覆盖：

- 不代替 Creator 作专业判断或独立占断；
- 不增加、补全或改变 Core Interpretation；
- 不虚构 Audience Question、来源、案例或 Creator 观点；
- 不跨 Creator Workspace 混用数据；
- 不自动融合或裁决 Knowledge Conflict；
- 不把生成、复制或导出描述为批准或发布。

### 4.6 定义审批闸门

对每种任务明确上游审批前置条件：

- 选题生成不要求上游审批；
- Content Master 展开要求 Topic Approval；
- 平台文字适配要求 Master Approval；
- 当前生成结果不能继承上游材料的批准状态。

缺少必要审批时，必须返回非生成型阻断响应：

- `task_output` 为 `{}`；
- `display_text` 说明缺少的审批；
- `confirmation_items` 提供明确的下一步；
- 不允许生成“部分成品”绕过审批。

### 4.7 定义隐私与案例规则

- Creator-Interpreted Case 必须先成为 Sanitized Case；
- 必须确认具备公开使用条件；
- 不得增加或改变 Core Interpretation；
- Case Source Record 与公开内容分离；
- 案例事实不得自动进入 Creator Knowledge Base；
- 缺少脱敏或公开许可时返回阻断响应。

### 4.8 定义内容风险规则

- 明确 Blocking Content Risk 的覆盖范围；
- 风险必须进入 `risk_flags`；
- Blocking Content Risk 必须同时出现在完整 `display_text` 中；
- `generation_notes` 只能补充，不能代替面向 Creator 的风险说明；
- 风险解除前不得描述为可批准、已批准或可发布。

### 4.9 定义缺失信息和冲突处理

- 不猜测必要事实来制造貌似完整的输出；
- 一般信息缺失时，只生成有依据的部分并列出待确认项；
- 上游审批缺失时必须完全阻断对应任务；
- Knowledge Conflict 必须保留各方观点、关联来源和确认问题；
- 模型不得自动选择、调和或拼接不同口径。

### 4.10 定义内部工作方法

要求模型在内部依次检查：

1. 任务类型和生成模式；
2. Creator Workspace 边界；
3. 上游审批；
4. 来源权威；
5. 缺失信息；
6. Knowledge Conflict；
7. 案例隐私条件；
8. Blocking Content Risk；
9. Generation Response 完整性。

不得要求或输出隐藏的 chain-of-thought，只提供审核所需的简洁理由、依据、风险与待确认项。

## 5. 公共 Generation Response 设计

### 5.1 先固定顶层外壳

所有任务共享固定顶层字段：

- `prompt_version`
- `generation_task_type`
- `display_text`
- `task_output`
- `source_references`
- `knowledge_conflicts`
- `risk_flags`
- `confirmation_items`
- `generation_notes`

`task_output` 保持可扩展，由下游 Task Prompt 定义；其他字段属于 Base Prompt 的稳定公共协议。

### 5.2 每个字段必须说明

- JSON 类型；
- 是否必填；
- 业务语义；
- 空值表达；
- 枚举值；
- 是否允许 `null`；
- 与其他字段的关系。

默认使用 `[]` 或 `{}` 表达空集合，不使用 `null`。`display_text` 必须非空、完整、可独立审核，应用不得通过拼接结构化字段重建它。

### 5.3 非空元数据必须有最小结构

不能只把字段定义为“对象数组”。至少应固定：

- 每个对象的必填键；
- 响应内唯一标识；
- 稳定枚举；
- 嵌套对象结构；
- 最小数量要求；
- response-local 引用关系；
- 空字符串、空数组和空对象的使用规则。

公共结构稳定后，下游 Task Prompt 才能安全扩展 `task_output`，而不会让应用面对不可预测的元数据形状。

### 5.4 示例必须覆盖非空情况

公共协议至少提供一个合法的非空示例，覆盖：

- SourceReference；
- KnowledgeConflict 及两个以上 ConflictPosition；
- RiskFlag；
- ConfirmationItem；
- GenerationNotes；
- response-local ID 引用。

只提供全部为空的示例无法证明应用能可靠解析真实审核场景。

## 6. 不可违反规则的编写方法

将 Base Prompt 中最重要的约束再整理为独立规则清单，供所有下游 Task Prompt 引用。

每条规则应：

- 使用命令式表达；
- 只表达一个不可绕过的约束；
- 明确禁止行为和必要处理；
- 不保留会削弱规则的模糊例外；
- 对阻断条件说明应返回什么；
- 与 Base Prompt 和公共字段规范保持一致。

重点检查是否出现以下漏洞：

- “除非请求明确要求”之类的越权例外；
- “部分生成”绕过审批；
- 风险只写入机器字段；
- 上游批准状态被当前结果继承；
- 下游 Task Prompt 获得放宽知识依据的权限。

## 7. 静态验证流程

### 7.1 版本与文件检查

- 三份交付物使用同一版本标识；
- 只有计划内文件发生变化；
- 源上下文和 ADR 未被修改；
- Git diff 无尾随空格等格式问题。

### 7.2 顶层协议检查

- 九个字段全部存在；
- 顶层字段数量准确；
- `prompt_version` 为预期固定值；
- `display_text` 非空；
- `task_output` 为对象；
- 公共集合字段类型正确。

### 7.3 语义规则检查

使用精确文本检查确认：

- Topic Approval 和 Master Approval 前置条件存在；
- 缺少审批时明确禁止部分生成；
- 阻断响应要求空 `task_output`；
- Blocking Content Risk 同时进入 `risk_flags` 和 `display_text`；
- Exploration Mode、Grounded Creation Mode、Unverified Claim 等规范术语存在。

### 7.4 任务中立性检查

在 Base Prompt 中反向搜索并禁止：

- 固定候选数量；
- 小红书专属字段；
- 抖音专属字段；
- Content Master 专属输出结构；
- 任何应由 Task Prompt 定义的栏目。

### 7.5 非空结构验证

解析公共 JSON 示例并验证：

- 所有必填键；
- 字段类型；
- 枚举合法性；
- KnowledgeConflict 至少包含两个立场；
- source reference ID 确实存在；
- blocking 字段为布尔值；
- GenerationNotes 的键和 mode 合法；
- 三种 generation task type 均可复用同一顶层外壳。

验证报告必须记录实际执行的完整命令、工作目录和真实输出，不能只记录概括性描述。

## 8. 审阅与修正循环

至少执行两层审阅：

1. **任务级审阅**：逐项检查是否满足计划、接口和不可违反规则；
2. **整分支审阅**：从跨文档一致性、权限漏洞、稳定接口、下游扩展和范围蔓延角度重新检查。

发现问题后的流程：

1. 对照源文档确认问题；
2. 修正 Prompt、字段规范或规则；
3. 运行覆盖该问题的定向验证；
4. 重新审阅；
5. 最后运行一次完整静态验证；
6. 只有验证和审阅都通过后才声明交付物就绪。

## 9. 常见失败及本次经验

### 9.1 误判现有术语为自创概念

开发前必须读取完整上下文，而不是依赖部分片段。删除看似多余的术语前，应再次搜索其定义和引用。

### 9.2 Base Prompt 只引用接口文档

可执行 Prompt 应直接列出公共顶层字段，保持基本自包含；字段文档负责详细类型与子结构。

### 9.3 审批规则只说明“由人工决定”

这不足以形成执行闸门。必须明确哪种任务依赖哪种批准，以及批准缺失时禁止生成什么。

### 9.4 结构化字段只有空示例

空数组只能验证顶层类型，不能验证真实数据形状。必须提供并解析非空示例。

### 9.5 验证报告与实际命令不一致

报告必须保存实际运行的命令和输出。不能用“已验证嵌套结构”代替对应的 `jq` 断言证据。

## 10. Skill 化时建议拆分的能力

后续创建 Prompt 开发 Skill 时，可将本流程拆成以下阶段：

1. `discover_context`：查找术语、范围、ADR 和审批点；
2. `design_prompt_architecture`：划分 Base、Task 与 Platform 层；
3. `draft_base_prompt`：生成共享治理指令；
4. `define_response_contract`：生成公共字段和非空子结构；
5. `extract_non_negotiables`：形成不可违反规则；
6. `validate_prompt_package`：运行版本、语义、结构和中立性检查；
7. `review_and_repair`：处理任务级与整分支审阅；
8. `record_evidence`：记录真实验证命令、输出和版本提交。

Skill 的最终输出应至少包含：

- 版本化 Prompt Definition；
- 公共响应协议；
- 不可违反规则；
- 静态验证证据；
- 已知假设和未决问题。

## 11. 完成标准

只有同时满足以下条件，Prompt 开发任务才算完成：

- Prompt 架构边界清楚；
- 权限、知识、隐私、风险和审批规则不可绕过；
- 公共接口可以被应用稳定解析；
- Base Prompt 不包含下游专属生成逻辑；
- 非空示例通过结构验证；
- 三类任务可以复用同一公共外壳；
- 任务级和整分支审阅无未解决的重要问题；
- 完整静态验证通过；
- 验证报告记录了可复现的实际命令和结果。
