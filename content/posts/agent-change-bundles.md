---
title: Version the Whole Agent Release
date: 2026-10-04
type: architecture
tags: [AI, Engineering, Agent systems, Model evaluation]
summary: A release bundle binds source, policy, model settings, fixtures and approval to one verifiable version.
links: [agent-change-approval, agent-trace-replay, agent-delivery-reconciliation, ai-product-development, release-evidence]
public: true
---

## English

An agent release contains more than a prompt or a code commit. Code, policy, model configuration, fixtures and adapter behavior can all affect an external action. A change bundle records these inputs together so the release decision refers to an exact, reviewable version.

### Separate runtime decisions from promotion

At runtime, an agent decides what a task should do under its current policy. At release time, a promotion process decides which version may become active. Keeping these paths separate makes approval and rollback easier to explain.

A bundle pins `sourceVersion`, `policyVersion`, model and prompt configuration, fixture hashes, an evaluation summary and the adapter contract version. A deterministic hash of the constrained inputs becomes the `bundleHash`. When one of those inputs changes, the hash changes and an approval for the old bundle no longer applies.

The bundle normally moves through these states:

`DRAFT → EVALUATED → APPROVED → CANARY → PROMOTED`

An evaluation regression, expired approval, canary anomaly or inconsistent receipt can place it on `HOLD` or trigger `ROLLED_BACK`, as appropriate to its stage. Rolling back switches the active promotion pointer. It does not replay or resend historical side effects.

### Keep four assets small and explicit

| Asset | Purpose | Check |
| --- | --- | --- |
| Immutable bundle manifest | Pin versions, fixtures, risk and approval | Changing a constrained input changes the hash |
| Replay harness | Exercise timeout, rejection and success decisions without real side effects | Real external-call count remains zero |
| Promotion registry | Identify the currently accepted version | A rollback changes the pointer without resending actions |
| Evidence log | Preserve hash, result, time and a redacted summary | Exclude credentials and full user content |

A high-risk change can involve a classification threshold, external tool call, permission or automatic-send policy. Its approval must match the bundle hash and remain valid. A documented low-risk wording path can be faster while still keeping version and smoke-evaluation evidence.

### What this avoids

A free-text “approved” message cannot reliably tell a machine which artifact it covers. A canary without receipts, stop conditions and a recovery path only reduces the size of an uncontrolled exposure. A bundle filled with raw logs makes review harder and may retain unnecessary private content.

The useful artifact is a concise manifest plus reproducible evidence: the evaluation result, one rejected regression, the risk rationale, and the rollback decision. [[agent-change-approval|The release gate]] uses that record; [[agent-delivery-reconciliation|receipt reconciliation]] monitors actual outcomes afterward.

## 中文

Agent 的发布单位不只有 prompt 或一次代码 commit。代码、policy、模型配置、fixtures 和 adapter 行为，都可能改变外部动作。Change bundle 把这些输入一起版本化，让发布决定对应到一个准确、可审阅的版本。

### 区分运行时决策和发布时 promotion

运行时，agent 根据当前策略决定任务如何执行。发布时，promotion 流程决定哪个版本可以成为当前版本。将两条路径分开后，批准与回滚会更容易解释。

Bundle 固定 `sourceVersion`、`policyVersion`、模型和 prompt 配置、fixture hash、eval summary 以及 adapter contract version。对受约束输入计算确定性 hash，得到 `bundleHash`。任意输入变化都会改变 hash，原 bundle 的批准便不再适用。

典型状态顺序是：

`DRAFT → EVALUATED → APPROVED → CANARY → PROMOTED`

Eval 回归、批准过期、canary 异常或 receipt 不一致，可以按当前阶段进入 `HOLD` 或触发 `ROLLED_BACK`。回滚切换当前 promotion pointer，不会重新执行或重发历史副作用。

### 四项小而明确的资产

| 资产 | 作用 | 检查 |
| --- | --- | --- |
| 不可变 bundle manifest | 固定版本、fixture、风险和批准 | 受约束输入变化会改变 hash |
| Replay harness | 无真实副作用地检查超时、拒绝和成功决策 | 真实外部调用次数保持为零 |
| Promotion registry | 指向当前认可版本 | 回滚切换 pointer，不重发动作 |
| Evidence log | 保存 hash、结论、时间和脱敏摘要 | 排除 credential 和完整用户内容 |

分类阈值、外部工具调用、权限或自动发送策略，都可能构成高风险变更。批准必须与 bundle hash 匹配且仍在有效期。文案调整可以有预定义的低风险快速路径，同时保留版本与 smoke eval 证据。

### 避免什么问题

一句自由文本“approved”很难让机器准确判断批准覆盖哪个工件。没有 receipt、停止条件和恢复路径的 canary，只是缩小了一次不可控曝光。把 bundle 变成原始日志倾倒处，会增加审阅难度，也可能保留多余的私人内容。

有价值的资产是一份简洁 manifest 加上可重复证据：eval 结果、一次被拒绝的 regression、风险依据和 rollback 决策。[[agent-change-approval|发布门禁]]使用这份记录；[[agent-delivery-reconciliation|业务收据核对]]在发布后检查实际结果。
