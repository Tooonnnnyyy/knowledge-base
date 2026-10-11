---
title: An Auditable Gate for Agent Changes
date: 2026-10-02
type: architecture
tags: [AI, Engineering, Agent systems, Model evaluation]
summary: Replay differences become release decisions only after their risk, authority and recovery conditions are explicit.
links: [agent-trace-replay, agent-change-bundles, agent-delivery-reconciliation, decision-layers, ai-product-development]
public: true
---

## English

[[agent-trace-replay|Trace replay]] reveals how a candidate differs from a baseline. Change approval asks whether that difference has a justified business purpose and an acceptable boundary for release. A passing test suite is one input to that decision.

### From a difference to a release decision

The sequence is: version the change, run replay fixtures, classify the differences, apply a risk policy, obtain the required approval, release within a defined scope, then monitor the result. A rejection or pending decision blocks promotion. A breached rollback condition starts recovery.

A minimal, redacted change record contains:

- A `changeId`, baseline and candidate `policyVersion`, and optional `promptVersion`.
- Fixture differences: expected and actual states, `actionHash`, tool scope, cost and latency budgets, and external-call counts.
- An understandable business rubric explaining which changes are acceptable.
- A risk tier, decision state, approver reference and rollback rule.

### Classify risk with explicit rules

Unknown differences deserve investigation. Expanded tool authority, a new external-action intention, a budget breach, or a transition from `HUMAN_REVIEW` to `DELIVERED` should not pass merely because CI is green.

| Difference | Possible gate treatment |
| --- | --- |
| Approved wording adjustment with the same action and scope | Allow under the documented low-risk policy |
| New automatic external action | Block pending the required review |
| Wider permissions or target scope | Block pending the required review |
| Cost or latency beyond the agreed budget | Block or hold according to the policy |
| Unclassified behavior change | Hold until it can be explained |

The model may summarize a diff. Deterministic code enforces budgets, state transitions and the gate itself. A responsible person makes the business judgment when the policy requires one. The record should identify the exact evidence on which that judgment depended.

### Start with a small, inspectable gate

A practical first version can use three fixed fixtures, a Markdown change bundle and tests for the key allow/block conditions. Include one intentional regression to show that the gate rejects it. Define what monitoring would trigger a rollback before the release happens.

This pattern provides an auditable engineering process. It does not itself establish a production SLA. [[agent-change-bundles|Versioned change bundles]] strengthen the contract by binding approval to the actual inputs of a release.

## 中文

[[agent-trace-replay|Trace replay]]可以显示候选版本与基线的差异。Change approval 要进一步判断：这些差异是否有合理的业务目的，以及能否在明确边界内发布。测试通过只是这项判断的一个输入。

### 从差异到发布决定

流程是：版本化变更、运行 replay fixtures、分类差异、应用风险策略、获取所需批准、在限定范围内发布，然后监测结果。拒绝或待定决策会阻止 promotion；达到回滚条件后则进入恢复流程。

最小的脱敏变更记录应包含：

- `changeId`、baseline 与 candidate 的 `policyVersion`，以及可选 `promptVersion`。
- Fixture 差异：期待和实际状态、`actionHash`、tool scope、成本与延迟预算、外部调用计数。
- 可以解释的 business rubric，说明什么变化可接受。
- 风险等级、批准状态、批准人引用和 rollback rule。

### 用明确规则分类风险

未知差异需要调查。工具权限扩大、新增外部动作意图、预算越界，或 `HUMAN_REVIEW` 变成 `DELIVERED`，都不能仅因 CI 通过而放行。

| 差异 | 可能的门禁处理 |
| --- | --- |
| 已批准的文案调整，动作与权限范围不变 | 按已定义的低风险策略放行 |
| 新增自动外部动作 | 阻止，等待所需审阅 |
| 权限或目标范围扩大 | 阻止，等待所需审阅 |
| 成本或延迟超过约定预算 | 按策略阻止或暂停 |
| 无法分类的行为变化 | 暂停，直到可以解释 |

模型可以协助总结 diff。确定性代码负责预算、状态转换与门禁执行。需要业务取舍时，由承担责任的人作出判断。记录还应明确这次判断依赖的具体证据。

### 从小而可检查的门禁开始

第一版可以只有三个固定 fixture、一份 Markdown change bundle，以及几条核心 allow/block 测试。故意放入一次 regression，展示门禁能够拒绝它。发布前就定义好什么监控信号会触发回滚。

这套方法证明的是可审计的工程过程，并不自动证明生产 SLA。[[agent-change-bundles|版本化 change bundle]]进一步把批准绑定到实际发布输入，强化这份契约。
