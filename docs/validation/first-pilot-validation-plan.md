# 首轮单博主验证方案

## 验证目的

第一轮由 1 位真实奇门遁甲博主参与，用于判断 Creator Operations Tool 是否能改善该博主的真实内容工作流。结果不能用于推断所有奇门遁甲博主或传统文化博主的普遍需求。

## 验证范围

首轮只将以下三类 Core Generation Task 纳入成功判定：

1. 根据 Topic Discovery Prompt 生成 Generated Topic Proposal，并由博主确认是否采用；
2. 将博主确认的 Topic Candidate 展开为 Content Master；
3. 将 Content Master 适配为小红书或抖音文字。

标题微调、评论回复、案例整理及其他生成任务可以记录，但不计入首轮成功判定。

## 计数单位

一次 Prompt 对应的一次完整文字回复计为 1 个 Text Generation Result。重新生成和继续追问产生的新回复分别计数；系统内部草稿、未展示结果和生成失败不进入内容采纳率。

每个结果必须记录：

- Pilot Creator；
- Generation Task Type；
- 是否为 Production Prompt；
- Generation Session；
- 生成时间；
- Adoption Decision；
- 未采纳或修改原因。

只有 Production Prompt 进入首轮采纳率统计。围绕同一主题的连续生成仍保留为不同 Text Generation Result，但通过 Generation Session 标识其相关性，分析时不得将其解释为完全独立的创作需求。

## 采纳状态

- **直接采纳**：输出主体可以直接使用，只进行错字、语气或局部句序调整；
- **编辑后采纳**：主要观点或表达进入最终内容，但经过明显编辑；
- **部分采纳**：只采用明确的局部内容；
- **未采纳**：没有进入最终内容，或核心观点、专业口径、主体结构需要重做；
- **待判断**：尚未完成审核，不进入采纳率分母。

## 指标

- **文本输出采纳率** =（直接采纳 + 编辑后采纳 + 部分采纳）÷ 已完成判断的 Text Generation Result；
- **有效文本采纳率** =（直接采纳 + 编辑后采纳）÷ 已完成判断的 Text Generation Result；
- **直接采纳率** = 直接采纳 ÷ 已完成判断的 Text Generation Result。
- **候选选题选择率** = 被博主确认进入 Topic Library 的 Generated Topic Proposal ÷ 已展示的 Generated Topic Proposal。

总体数据必须按 Core Generation Task 分拆查看，避免用较容易采纳的短文本掩盖复杂任务表现。

每次选题生成默认展示 5 个差异明确的候选。采用多个候选时，对应 Text Generation Result 可记为直接采纳或编辑后采纳；仅采用 1 个时记为部分采纳；一个都未采用时记为未采纳。候选选择率作为选题任务的诊断指标单独观察，不能替代文本采纳率。

## 验证节奏

1. 第一周按真实工作节奏使用，建立 Observed Baseline，不设最低生成次数；
2. 基线建立后，观察是否连续两周达到：
   - 文本输出采纳率 ≥ 75%；
   - 有效文本采纳率 ≥ 60%；
   - 直接采纳率 ≥ 30%；
3. 每类 Core Generation Task 至少累计 20 个已判断的 Production Prompt 样本，样本门槛不要求在两周内强行完成；
4. 不得为满足样本数而制造无真实创作需求的 Prompt。

## 结论分级

- **未达趋势门槛**：连续两周的任一核心比例低于目标；
- **趋势达标、证据不足**：连续两周达到比例目标，但至少一类 Core Generation Task 未满 20 个已判断样本；
- **首轮初步成功**：连续两周达到全部比例目标，且三类 Core Generation Task 分别累计至少 20 个已判断的 Production Prompt 样本。

任何首轮结论都仅适用于 Pilot Creator。验证跨博主的普遍价值需要后续独立样本。

## 失真控制

- 测试 Prompt 与 Production Prompt 分开记录；
- 不因验证期限而要求博主增加不必要的生成；
- 待判断结果不进入分母，但需要监控其长期积压，防止通过不作判断美化指标；
- 复制、导出、重新生成或放弃时触发 Adoption Prompt，未立即判断的结果进入 Adoption Backlog；
- 系统可以根据编辑幅度推荐采纳状态，但只有博主确认的 Adoption Decision 才进入指标；
- 生成失败单独进入生成成功率，不进入内容采纳率；
- 保留修改和未采纳原因，用于区分专业错误、风格不符、结构问题、平台适配问题及需求本身变化；
- Adoption Reason 采用预设多选并允许补充文字；Demand Change 仍按未采纳进入主指标，但质量诊断时单独展示；
- 同一 Generation Session 内的密集改写需要单独观察，避免把高度相关的结果错误解释为大量独立证据。
