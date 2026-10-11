---
title: Layers of Decision Authority
date: 2026-10-10
type: architecture
tags: [AI, Thinking, Agent systems]
summary: Delegation depends on impact, reversibility and responsibility as well as an agent's ability to perform a task.
links: [decision-delegation, agent-layers, critical-thinking, human-value-in-agent-era, agent-change-approval]
public: true
---

## English

Not every decision deserves the same amount of human attention. A useful agent architecture separates routine execution from decisions that change a direction, commit resources or require a value judgment. The boundary concerns authority as much as capability.

### A working distinction

| Routine decisions | Consequential decisions |
| --- | --- |
| Low risk and frequent | High impact or unusual |
| Easy to reverse | Difficult to reverse |
| Limited local effects | Changes resources or a long-term path |
| Operates within an agreed rule | Requires preferences, values or accountability |

For example, formatting a draft within an agreed style is usually a local, reversible action. Choosing whether that draft should become a public commitment can involve reputation, timing and responsibility. The same piece of work therefore contains several decision points with different authority requirements.

### Evaluate the decision point

Ask about the scope of impact, reversibility, cost, time sensitivity, value trade-offs and the person who carries responsibility. These dimensions should be recorded where an action is proposed, so an execution agent can stay inside the authority it has received.

This remains a working framework. There is no universal number that cleanly divides “low” and “high” decisions. A routine action can become consequential when its scale, context or reversibility changes. A useful design leaves room for escalation and for the person to revise or revoke the delegation.

[[decision-delegation|The open questions around delegation]] examine how thresholds might change by context. [[agent-layers|Agent coordination layers]] place these authority boundaries into a system.

## 中文

并不是每个决策都需要同样多的人工注意力。一个实用的 agent 架构，会把日常执行与改变方向、投入资源、涉及价值判断的决策区分开。这条边界既是能力问题，也是权限问题。

### 一个初步区分

| 日常决策 | 高影响决策 |
| --- | --- |
| 低风险、高频 | 高影响或不常见 |
| 容易回撤 | 难以回撤 |
| 影响局限在局部 | 改变资源配置或长期路径 |
| 在已约定规则内执行 | 涉及偏好、价值取舍或最终责任 |

例如，按约定风格整理草稿，通常是局部、可逆的动作。决定是否把这份草稿作为公开承诺发布，则可能涉及声誉、时机和责任。同一项工作里，会有多个权限要求不同的决策点。

### 判断一个决策点

可以依次检查影响范围、可逆性、成本、时间敏感性、价值取舍以及由谁承担责任。提出动作时就记录这些维度，执行型 agent 才能判断自己是否仍在已获授权的范围内。

这还是一个初步框架。不存在一个适用于所有情境的数字，把“低级”和“高级”决策彻底分开。日常动作的规模、上下文或回撤条件变化后，也可能变得重要。因此，系统需要升级处理机制，也需要让人可以调整或撤销授权。

[[decision-delegation|决策授权的开放问题]]进一步讨论阈值如何随场景变化；[[agent-layers|多代理协作层级]]则把这些权限边界放进系统结构。
