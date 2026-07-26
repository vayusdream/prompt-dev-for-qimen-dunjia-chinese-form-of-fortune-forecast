# 以单次文本生成结果衡量内容采纳

Creator Operations Tool 以“一次 Prompt 对应的一次完整文字回复”作为内容采纳的唯一计数单位，重新生成和继续追问产生的新回复分别计数，不以边界较大的内容包作为分母。每个 Text Generation Result 必须记录 Generation Task Type 和 Adoption Decision，以便同时衡量整体采纳率、有效采纳率及不同创作任务的表现；系统内部草稿、未展示结果和待判断结果不进入采纳率。
