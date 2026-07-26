# 将 Prompt 定义与 Web 应用解耦

Creator Operations Tool 不在页面或业务流程代码中硬编码生成 Prompt，而是通过稳定的生成接口调用独立开发、独立版本管理的 Prompt Definition。每个 Text Generation Result 必须记录 Prompt Version，使 Prompt 可以在不重写 Web 工作流的情况下迭代，并让采纳率变化能够追溯到具体版本。

接口返回版本化的 Generation Response，同时包含供博主审核的完整 Display Text，以及供 Web 应用展示、入库和追踪状态的结构化字段。我们不采用仅返回自由文本并由 Web 应用二次解析的方案，因为该方案会使选题卡片、知识依据、风险标记和采纳数据依赖脆弱的文本解析。

选题生成响应默认返回包含 5 个差异明确候选的 Topic Proposal Batch。候选数量作为接口配置显式记录，避免通过返回大量候选提高碰中概率并扭曲采纳表现。
