---
title: Where Should Delegation Stop?
date: 2026-10-10
type: question
tags: [Thinking, AI, Agent systems]
summary: A useful delegation policy must explain who sets the threshold and how that threshold changes with context.
links: [decision-layers, agent-layers, human-value-in-agent-era, critical-thinking, agent-change-approval]
public: true
---

## English

Before delegating decisions to an agent, four questions need answers: what counts as routine, what counts as consequential, who sets that standard, and whether the standard changes by situation. This is a central question of agent governance because it determines who has the right to act.

### Dimensions available now

Risk, scope of impact and difficulty of reversal provide a practical starting point. A decision may also involve ethics, preferences or identity, making numerical cost an incomplete measure. Finally, a system needs a person or role that carries final responsibility.

These dimensions support a discussion; they do not yet supply a calibrated scoring model. Calling a decision “low risk” without specifying the affected people, action and recovery path leaves too much implicit.

### Questions that remain open

| Open question | Why it matters |
| --- | --- |
| How should the dimensions be measured? | Vague labels produce inconsistent delegation. |
| Should each scenario have different thresholds? | A reversible local edit differs from a public commitment. |
| How should personal and organizational policies differ? | Responsibility and effects may be distributed across people. |
| Can a user adjust authority during a task? | New information may change the acceptable scope. |

Three useful next questions follow from this: how to adjust permission thresholds, how to design the approval path, and how an agent should explain its decision basis. Each can become its own focused note or experiment.

[[decision-layers|Decision layers]] offer a provisional structure. [[agent-change-approval|Versioned release approval]] is a concrete engineering pattern for one part of this broader problem; it does not settle every value judgment.

## 中文

把决策权交给 agent 前，至少要回答四个问题：什么算日常决策，什么算高影响决策，由谁制定标准，以及标准是否会随情境变化。这是 agent governance 的核心问题，因为它直接决定了谁有权行动。

### 目前可用的判断维度

风险、影响范围和回撤难度可以作为起点。但有些决策还涉及伦理、偏好或身份，不能只用金钱成本衡量。系统也必须明确最终责任由谁承担。

这些维度可以帮助讨论，但尚未构成经过校准的评分模型。如果没有写清楚动作会影响谁、影响什么、如何恢复，仅仅说“低风险”仍然隐藏了太多判断。

### 尚未解决的问题

| 开放问题 | 为什么重要 |
| --- | --- |
| 如何量化这些维度？ | 模糊标签会造成不一致的授权。 |
| 不同场景是否需要不同阈值？ | 可逆的局部编辑与公开承诺不同。 |
| 个人和组织的标准应如何区分？ | 责任与影响可能分布在多个人之间。 |
| 用户能否在任务中动态调整授权？ | 新信息可能改变可接受的执行范围。 |

可以继续拆出三个子问题：权限阈值如何动态调整、审批链路如何设计、agent 如何解释决策依据。每一个都适合独立研究或实验。

[[decision-layers|决策点分层]]提供了初步结构。[[agent-change-approval|版本化发布批准]]是处理其中一部分问题的具体工程方法，但不能替代所有价值判断。
