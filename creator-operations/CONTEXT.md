# Creator Operations

面向中国传统文化领域博主及其小型内容团队的社媒账号内容运营领域，首要服务掌握奇门遁甲知识的博主。本上下文独立于 AI Growth Agent。

## Language

**Creator Operations Tool**:
帮助博主及小型内容团队减少社媒账号内容运营中重复劳动的工具；其具体自动化边界将在后续设计中确定。
_Avoid_: AI Growth Agent, 通用增长工具

**Creator**:
以持续发布内容来经营个人或机构影响力的人，是 Creator Operations Tool 的直接使用者。
_Avoid_: AI Tool Founder, Growth Lead, 泛指用户

**Traditional Culture Creator**:
以中国传统文化知识为核心内容、通过持续讲解与传播建立影响力的 Creator，是本产品的目标用户。
_Avoid_: 泛文化博主, 娱乐博主

**Qimen Dunjia Creator**:
掌握奇门遁甲知识并以此作为主要或重要内容领域的 Traditional Culture Creator，是第一版优先服务的细分用户。
_Avoid_: 泛玄学账号, 对奇门遁甲没有专业能力的内容搬运者

**Knowledge Content**:
由博主审核发布、用于讲解传统文化概念、方法、历史或个人见解的传播内容。
_Avoid_: 个性化占断, 无依据的吉凶结论

**Creator-Interpreted Case**:
博主已经亲自完成核心判断的占断案例；工具只整理其材料与表达，不补作或改变博主的原始判断。
_Avoid_: AI 独立解盘, AI 代替博主占断

**Sanitized Case**:
移除非必要身份信息、只保留内容讲解所需事实和盘面信息的 Creator-Interpreted Case，才可进入内容生成流程。
_Avoid_: 含可识别当事人信息的原始案例

**Case Source Record**:
与公开表达稿分开保存的案例来源记录，用于保留博主提供的 Core Interpretation 和必要上下文，不得自动进入 Creator Knowledge Base。
_Avoid_: 可直接发布的案例内容

**Core Interpretation**:
博主基于专业知识对具体案例作出的关键分析和判断，必须来源于博主本人。
_Avoid_: AI 推测, 自动补全结论

**Topic Signal**:
可能启发内容创作、但尚未被确认值得生产的外部信息或博主想法。
_Avoid_: 成熟选题, 发布任务

**Curated Source**:
由博主明确选择、持续提供高相关 Topic Signal 的账号、评论区、关键词、文化日历或公开信息源。
_Avoid_: 无边界的全网抓取

**Audience Question**:
粉丝通过评论、私信或其他互动渠道表达的真实疑问，是默认优先于泛社会热点的 Topic Signal。
_Avoid_: AI 虚构的用户需求

**Submitted Inspiration**:
博主主动提交的链接、截图、语音、文字或临时想法，可被整理为 Topic Signal。
_Avoid_: 未经博主选择的批量网页收藏

**Topic Candidate**:
由 Topic Signal 提炼而成、已具备明确受众问题和内容角度的待评估选题。
_Avoid_: 热点搬运, 模糊灵感

**Topic Discovery Prompt**:
博主为发起选题探索而提交的 Prompt，可包含主题方向、目标受众、平台、时效范围或其他约束。
_Avoid_: 外部平台自动采集任务

**Prompt Definition**:
独立于 Web 应用开发和版本管理的生成指令定义，由应用通过稳定接口调用。
_Avoid_: 散落在页面代码中的硬编码 Prompt

**Prompt Version**:
一次 Text Generation Result 所使用的 Prompt Definition 版本标识，用于追溯采纳表现和生成行为变化。
_Avoid_: 无法追踪的 Prompt 覆盖更新

**Generation Response**:
Prompt 接口返回的版本化结构，包含供博主审核的完整展示文本，以及供 Web 应用入库、展示和追踪状态的结构化字段。
_Avoid_: 仅返回无法可靠解析的自由文本

**Display Text**:
Generation Response 中完整呈现给博主审核的文字，是对应 Text Generation Result 的内容载体。
_Avoid_: 结构化字段的拼接替代品

**Generated Topic Proposal**:
Agent 根据 Topic Discovery Prompt、Creator Doctrine、历史内容及工作空间已有信息生成的待确认选题提案；博主确认采用后才成为 Topic Candidate。
_Avoid_: 已确认选题, Agent 自动立项

**Topic Proposal Batch**:
一次选题 Generation Response 中展示的 Generated Topic Proposal 集合，默认固定包含 5 个差异明确的候选。
_Avoid_: 通过大量候选提高碰中概率

**Topic Proposal Selection Rate**:
博主确认进入 Topic Library 的 Generated Topic Proposal 数量，占已展示 Generated Topic Proposal 总数的比例。
_Avoid_: Text Output Adoption Rate

**Topic Library**:
持续沉淀 Topic Candidate，并保留其来源、适用受众、内容角度及状态的选题资产集合。
_Avoid_: 临时收藏夹, 链接堆积

**Content Task**:
博主从 Topic Library 中确认进入生产流程的内容单元，可由工具协助展开为 Knowledge Content。
_Avoid_: 未筛选的 Topic Signal

**Primary Platform**:
第一版提供深度运营支持的社媒平台，当前包括小红书与抖音。
_Avoid_: 默认支持所有社媒平台

**Platform Version**:
同一内容主题为特定 Primary Platform 重新组织表达后形成的发布版本。
_Avoid_: 原文复制, 一稿无差别多发

**Content Master**:
经博主确认的跨平台内容基准，记录目标受众、核心问题、博主观点、专业口径、论述结构和表达禁区。
_Avoid_: 平台成稿, 通用 AI 文案

**Platform Adaptation**:
在不改变 Content Master 核心观点和专业口径的前提下，将其重新组织为特定 Primary Platform 的 Platform Version。
_Avoid_: 改变原意, 一稿直接复制

**Creator Knowledge Base**:
由单一博主认可的知识、历史内容、指定资料和专业口径构成的权威内容依据，与其他博主完全隔离。
_Avoid_: 所有博主共用的通用玄学知识库

**Knowledge Source**:
进入 Creator Knowledge Base 的可追溯原始材料，首版包括博主直接填写的专业口径、上传的文本或文档，以及过去审核发布的内容。
_Avoid_: 无来源的模型记忆

**Source Authority**:
博主为 Knowledge Source 指定的权威等级，首版分为权威规则、参考资料和历史表达。
_Avoid_: 默认将所有资料视为同等可信

**Authority Rule**:
博主明确确认的门派口径、专业规则或表达禁区，是最高 Source Authority 的 Knowledge Source。
_Avoid_: 从历史内容中自动推断出的规则

**Reference Material**:
博主认可但不必然代表其最终立场的书籍、讲义、文章或其他资料。
_Avoid_: Creator Doctrine

**Historical Expression**:
博主过去审核或发布的文章、口播稿及案例文本，用于学习其表达与内容习惯，但不自动上升为 Authority Rule。
_Avoid_: 权威专业规则

**Proposed Knowledge Entry**:
系统从 Knowledge Source 中提取、等待博主确认的术语、规则、观点或表达禁区，尚不属于 Creator Doctrine。
_Avoid_: 自动生效的权威规则

**Confirmed Knowledge Entry**:
博主确认或修订后的知识条目，可作为 Creator Doctrine 参与后续内容生成。
_Avoid_: 未审核的文档提取结果

**Creator Voice Profile**:
经博主确认且可编辑的表达规则集合，描述其称呼、语气、常用结构、常用词、禁用词、效果表述边界以及优秀示例与反例。
_Avoid_: 对历史文本的无约束模仿

**Platform Voice Rule**:
Creator Voice Profile 中只适用于特定 Primary Platform 的表达规则，用于区分小红书与抖音的内容风格。
_Avoid_: 改变 Creator Doctrine 的平台话术

**Creator Edit**:
博主对 Text Generation Result 作出的文字修改，是采纳判断和个性化学习的原始反馈证据。
_Avoid_: 自动生效的长期规则

**Learning Suggestion**:
系统根据 Creator Edit 识别出的潜在长期规律，可建议加入 Creator Voice Profile、Creator Doctrine 或表达禁区，但必须经博主确认。
_Avoid_: 静默修改知识库或风格档案

**One-off Edit**:
只适用于当前内容、不应沉淀为长期规则的 Creator Edit。
_Avoid_: 可复用的表达或专业规则

**Creator Doctrine**:
博主明确采用的术语、规则、门派口径和表达禁区；当其他资料与之冲突时，它具有最高优先级。
_Avoid_: 模型默认知识, 未经确认的网络说法

**Knowledge Conflict**:
候选内容所依据的资料之间存在无法自动消解的观点、术语或规则差异，必须交由博主判断。
_Avoid_: AI 自动拼接不同门派结论

**Knowledge Trace**:
Text Generation Result 中关键专业主张与其 Confirmed Knowledge Entry、Reference Material、Historical Expression 或模型补充背景之间的可查看关联。
_Avoid_: 无法说明依据的专业结论

**Unverified Claim**:
缺少可靠 Knowledge Trace 或与现有资料存在冲突的专业主张，必须标记并交由博主确认。
_Avoid_: 静默包装为确定性结论

**Exploration Mode**:
用于生成选题方向的发散模式，可使用模型通用背景知识扩展角度，但产出只代表待确认假设，不代表博主专业立场。
_Avoid_: 权威专业内容生成

**Grounded Creation Mode**:
用于生成 Content Master 和 Platform Version 的约束模式，专业内容默认必须依据 Creator Knowledge Base；模型补充内容作为 Unverified Claim 处理。
_Avoid_: 无依据的自由扩写

**Blocking Content Risk**:
涉及医疗诊断或治疗承诺、具体金融或赌博指令、法律结果保证、死亡灾祸或怀孕等恐吓式断言、绝对效果承诺或诱导高额付费的内容风险；解除前不得通过 Platform Approval。
_Avoid_: 可忽略的普通提醒

**Review Draft**:
工具已经完成内容母版或平台适配、但尚未获得博主最终批准的内容版本。
_Avoid_: 可直接发布的成稿

**Publication Approval**:
博主对特定 Platform Version 作出的最终公开发布授权；未经授权，工具不得发布内容。
_Avoid_: 生成完成, 默认同意

**Topic Approval**:
博主确认 Generated Topic Proposal 值得进入 Topic Library 并开展后续创作的人工决定。
_Avoid_: Agent 自动选择选题

**Master Approval**:
博主确认 Content Master 的核心观点、专业口径和结构，可以进入 Platform Adaptation 的人工决定。
_Avoid_: 草稿生成完成

**Platform Approval**:
博主对单一 Platform Version 作出的可拍摄或可排版确认；小红书与抖音必须分别判断。
_Avoid_: Master Approval, 跨平台默认通过

**Content Export**:
博主将已审核内容按完整文本或结构化区块复制、或导出为 Markdown 的动作。
_Avoid_: Publication Approval, 已发布, 已采纳

**Publishing Authority**:
博主保留的公开发布决定权，包括确认专业口径、风险表达和最终平台版本。
_Avoid_: Agent 自主发布

**Publishable Content Package**:
经博主审核后即可进入拍摄或排版环节的内容交付物，包含平台文案、结构提示、依据、风险提示和待确认项。
_Avoid_: 完整成片, 已自动发布的内容

**Xiaohongshu Package**:
面向小红书的 Publishable Content Package，可包含标题候选、封面文案、图文卡片逐页文案、正文、话题标签及口播稿。
_Avoid_: 未适配平台的通用文案

**Douyin Package**:
面向抖音的 Publishable Content Package，可包含前三秒钩子、口播稿、分镜与画面提示、字幕重点、标题及互动引导。
_Avoid_: 自动生成的完整视频

**Text Generation Result**:
博主提交一次 Prompt 后，工具返回的一次完整且可审核的文字回复，是内容采纳率的唯一计数单位；重新生成或继续追问产生的新回复分别计数，并记录对应 Prompt Version。
_Avoid_: 内容包数量, 内部草稿, 单个候选标题数量

**Generation Task Type**:
Text Generation Result 所服务的具体创作任务，例如选题提炼、标题、内容母版、正文、口播稿、钩子、分镜提示或互动文案。
_Avoid_: 将不同复杂度的生成任务混合比较

**Adoption Decision**:
博主对 Text Generation Result 作出的使用判断，分为直接采纳、编辑后采纳、部分采纳、未采纳或待判断；待判断结果不进入采纳率分母。

**Adoption Prompt**:
在复制、导出、重新生成或放弃等关键动作后出现的轻量反馈请求，用于请博主确认 Adoption Decision。
_Avoid_: 每次生成后的强制弹窗

**Adoption Backlog**:
尚未完成 Adoption Decision、需要博主后续集中处理的 Text Generation Result 集合。
_Avoid_: 默认未采纳

**Adoption Reason**:
博主为 Creator Edit 或未采纳结果选择的一个或多个诊断原因，可补充自由文字。

**Demand Change**:
创作需求在生成后发生变化、并非 Text Generation Result 质量造成的未采纳原因；仍保留原 Adoption Decision，但诊断时单独观察。
_Avoid_: 生成质量问题

**Text Output Adoption Rate**:
直接采纳、编辑后采纳或部分采纳的 Text Generation Result 数量，占已完成 Adoption Decision 的 Text Generation Result 数量的比例。
_Avoid_: 内容包采纳率, 将待判断结果计入分母

**Effective Text Adoption Rate**:
直接采纳或编辑后采纳的 Text Generation Result 数量，占已完成 Adoption Decision 的 Text Generation Result 数量的比例。
_Avoid_: 将仅采用零散片段的结果算作有效采纳

**Observed Baseline**:
第一周人工工作流中实际测得的各 Generation Task Type 采纳表现，用于判断后续自动化是否带来改善。
_Avoid_: 未经真实数据验证的行业平均值

**Initial Validation Threshold**:
产品在 Observed Baseline 建立后达到的初步成功门槛：连续两周 Text Output Adoption Rate 不低于 75%，Effective Text Adoption Rate 不低于 60%，直接采纳率不低于 30%，且每种 Core Generation Task 至少累计 20 个真实生产中的已判断样本。时间趋势与样本充足性必须分别判断。
_Avoid_: Observed Baseline, 长期产品承诺

**Pilot Creator**:
第一轮验证中唯一参与的真实 Qimen Dunjia Creator，其使用数据用于验证个人工作流价值，不用于推断所有同类博主的普遍表现。
_Avoid_: 代表性用户群, 多用户市场验证

**Core Generation Task**:
第一轮纳入成功判定的高频 Generation Task Type，限定为 Prompt 驱动的选题生成、内容母版展开和平台文字适配。
_Avoid_: 标题微调, 评论回复, 案例整理, 所有可生成任务

**Production Prompt**:
Pilot Creator 为完成真实内容工作而提交的 Prompt，可进入首轮采纳率统计。
_Avoid_: 为凑样本而设计的测试 Prompt

**Generation Session**:
围绕同一主题连续生成、追问或改写的一组 Text Generation Result，用于识别样本之间的相关性。
_Avoid_: 将同一轮密集改写视为完全独立的创作需求

**Creator Workspace**:
Creator 在独立 Web 应用中管理选题、知识、生成任务、审核反馈和验证数据的持久化工作空间。
_Avoid_: 一次性聊天窗口, Skill 作为最终用户界面

**Workspace Owner**:
唯一拥有并使用 Creator Workspace 的 Creator；首版一个账号只对应一个 Workspace Owner。
_Avoid_: 团队成员, 客户账号

**Workspace Data**:
归属于单一 Creator Workspace 的选题、知识、生成记录、审核反馈和指标数据，不得与其他博主工作空间混合。
_Avoid_: 跨博主共享的生成历史
