---
title: Layers of Multi-Agent Coordination
date: 2026-10-10
type: architecture
tags: [AI, Systems, Agent systems]
summary: Execution, coordination and human oversight need different contexts, permissions and evidence.
links: [decision-layers, decision-delegation, human-value-in-agent-era, agent-change-approval, agent-trace-replay]
public: true
---

## English

Multiple agents can cooperate by dividing work according to capability, context and permission. A useful starting structure has an execution layer, a coordination layer and human oversight. More agents alone do not create a better system; the division must make responsibilities clearer.

### Three layers

| Layer | Responsibilities | Important boundary |
| --- | --- | --- |
| Execution agents | Repetitive, local and low-risk tasks | Act within a narrow task and tool scope |
| Coordination agents | Gather information, route tasks, manage shared context | Explain dependencies and resolve handoffs |
| Human oversight | High-impact decisions, correction, permission and direction | Grant, change or revoke authority |

In an organization, a workflow agent might route a request to a database agent and collect its result for a person to review. In daily planning, separate agents might handle travel, meals or a calendar. Both settings require an explicit decision about what each agent may read, propose and change.

### The hard questions are at the boundaries

- **Communication:** what information does another agent need, and what should stay outside its context?
- **Visibility:** can the person see the current task, its status and the evidence behind a recommendation?
- **Permission:** how is authority delegated, narrowed and withdrawn?
- **Recovery:** which records explain the action, and what can actually be rolled back?

This architecture depends on adequate understanding of the user, a useful classification of scenarios, [[decision-layers|decision authority]] and workable approval and recovery mechanisms. It is a design hypothesis, not a claim that every task benefits from multiple agents.

Use [[agent-trace-replay|trace replay]] to test how a change affects decisions, and [[agent-change-approval|change approval]] to decide whether a version may gain real-world exposure.

## 中文

多个 agent 可以按能力、场景和权限分工协作。一个可用的起点是执行层、协调层与人工监督。agent 数量增加本身并不会让系统更好；分层的价值在于让责任更清楚。

### 三个层级

| 层级 | 责任 | 重要边界 |
| --- | --- | --- |
| 执行层 agent | 重复、局部、低风险的任务 | 在有限任务和工具权限内行动 |
| 协调层 agent | 汇总信息、路由任务、管理共享上下文 | 说明依赖关系，处理任务交接 |
| 人工监督层 | 高影响决策、纠偏、授权和方向 | 授予、调整或撤销决策权限 |

在组织中，workflow agent 可以把请求交给 database agent，并整理结果供人审阅。在日常安排中，也可能由不同 agent 处理出行、饮食或日程。这两种场景都必须明确：每个 agent 可以读取、建议和修改什么。

### 难点主要在边界

- **通信：**另一个 agent 完成任务需要哪些信息？哪些内容不应进入它的上下文？
- **可见性：**人能否看到当前任务、状态以及建议背后的证据？
- **权限：**授权如何下放、收窄和收回？
- **恢复：**哪些记录能够解释动作？哪些影响可以真正回撤？

这个架构依赖足够好的用户建模、场景分类、[[decision-layers|决策权分层]]，以及可执行的审批与恢复机制。它是一种设计假设，并不意味着所有工作都适合拆成多个 agent。

[[agent-trace-replay|Trace replay]]可以测试变更如何影响决策；[[agent-change-approval|变更批准]]则用于决定一个版本能否进入真实执行环境。
