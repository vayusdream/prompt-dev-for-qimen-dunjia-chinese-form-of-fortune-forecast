# Creator Operations Tool MVP

## 产品形态

首版是服务单一 Pilot Creator 的独立 Web 应用，不开发原生 App，不提供团队协作、多客户管理或复杂角色权限。Agent 作为应用内部的生成能力存在，Prompt Definition 独立开发并通过版本化接口接入。

## 目标用户

首要用户是掌握奇门遁甲知识的中国传统文化博主。首轮验证仅由 1 位真实博主参与，验证结论只适用于该博主的工作流。

## 首版工作流

1. 博主输入自由 Topic Discovery Prompt，可选填目标受众、平台、内容目的、专业口径和重复限制；
2. Agent 默认生成 5 个差异明确的 Generated Topic Proposal；
3. 博主确认采用的提案进入 Topic Library；
4. 工具协助展开 Content Master；
5. 工具将 Content Master 分别适配为小红书或抖音文字；
6. 博主编辑、审核并作出 Adoption Decision；
7. 系统根据 Creator Edit 生成 Learning Suggestion，由博主决定是否沉淀；
8. 首版交付止于可拍、可排版的文字内容，不生成完整视频，不自动发布。

## 人工闸门

内容生命周期设置三个强制人工闸门：

1. **Topic Approval**：Generated Topic Proposal 必须经博主确认后才能进入 Topic Library；
2. **Master Approval**：Content Master 必须经博主确认核心观点、专业口径和结构后，才能生成 Platform Version；
3. **Platform Approval**：小红书版和抖音版必须分别确认，才能标记为可拍摄或可排版。

在每个闸门内部，博主可以连续追问、重新生成和编辑，不要求对每次操作单独确认。一个平台通过不代表另一个平台通过。

## 一级模块

### 选题

- 输入自由 Prompt，并按需添加结构化条件；
- 展示默认 5 个候选选题；
- 确认候选并进入 Topic Library；
- 管理选题状态、来源和重复关系。

### 创作

- 从确认选题生成 Content Master；
- 生成小红书平台文字；
- 生成抖音平台文字；
- 展示知识依据、风险标记和待确认项。
- 关键专业主张在审核界面提供 Knowledge Trace；公开内容是否附带引用由博主选择；
- Creator-Interpreted Case 必须先完成脱敏和公开使用确认，才能进入生成；
- 原始 Case Source Record 与公开表达稿分开保存，个人事实不得进入 Creator Knowledge Base。

### 审核

- 编辑 Text Generation Result；
- 记录直接采纳、编辑后采纳、部分采纳、未采纳或待判断；
- 记录修改和未采纳原因；
- 查看同一 Generation Session 内的版本。
- 在复制、导出、重新生成或放弃时触发轻量 Adoption Prompt；
- 集中处理 Adoption Backlog；
- 系统可根据编辑幅度推荐状态，但 Adoption Decision 必须由博主确认。
- 检查 Blocking Content Risk；风险解除前不得通过 Platform Approval。

Adoption Reason 使用预设多选并允许补充文字，首版包括：

- 专业知识错误；
- 与博主门派或口径冲突；
- 依据不足或来源不可信；
- 观点太泛、缺少洞察；
- 不像博主的表达；
- 结构或篇幅不合适；
- 不适合目标平台；
- 与历史内容重复；
- 没有理解 Prompt；
- Demand Change；
- 其他。

Demand Change 仍保留其未采纳状态，但在质量诊断中单独观察。

Blocking Content Risk 包括医疗诊断或治疗承诺、具体金融或赌博指令、法律结果保证、对死亡灾祸或怀孕等敏感事项的恐吓式断言、绝对效果承诺，以及利用个性化占断诱导高额付费。

### 知识与风格

- 维护 Creator Doctrine、专业规则和表达禁区；
- 上传纯文本、Markdown、Word 或 PDF；
- 管理 Proposed Knowledge Entry、Confirmed Knowledge Entry 和 Knowledge Conflict；
- 维护 Creator Voice Profile 与 Platform Voice Rule；
- 审核由 Creator Edit 产生的 Learning Suggestion。

### 数据

- 查看 Text Output Adoption Rate、Effective Text Adoption Rate 和直接采纳率；
- 按 Core Generation Task、平台、Prompt Version 和时间拆分；
- 查看 Topic Proposal Selection Rate；
- 查看各类任务的样本进度及待判断积压。

## 内容导出

首版不对接平台发布，只提供：

- 一键复制完整内容；
- 按标题、正文、口播稿、标签等区块复制；
- 导出 Markdown；
- 保留小红书图文卡片结构；
- 保留抖音口播、分镜和字幕重点结构；
- 选择是否包含知识依据、风险提示和内部备注。

Content Export 可以被记录，但不等同于采纳、Publication Approval 或已经发布。

## 首页

首页只聚合下一步需要处理的事项，例如待确认选题、待审核内容、待确认知识条目、Knowledge Conflict 和 Learning Suggestion，不增加独立的复杂仪表盘。

## 首版明确不做

- 原生 App；
- 小红书或抖音账号授权；
- 自动采集平台内容或评论；
- 自动发布；
- Word、PDF 或平台草稿箱导出；
- 完整视频生成、数字人、配音或剪辑；
- AI 独立解盘；
- 团队协作和角色权限；
- 多博主共享知识库。
