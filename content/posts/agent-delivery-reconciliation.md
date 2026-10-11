---
title: Reconcile the Receipt Before Calling It Done
date: 2026-09-29
type: architecture
tags: [AI, Engineering, Agent systems]
summary: External actions need explicit delivery states, business receipts and an idempotency policy for uncertain outcomes.
links: [ai-product-architecture, ai-product-development, agent-trace-replay, agent-change-bundles, scheduled-automation-gates]
public: true
---

## English

An external notification, write or payment is a state transition that needs a business receipt. Treating it as one function call hides the important distinction between a confirmed result, a rejected action and an unknown outcome.

### The control loop

Start with a task record. Evaluate the intended action and its policy, obtain the required decision, then let the delivery adapter execute the authorized operation. Reconcile the returned receipt before choosing a terminal state or a review path.

A minimal adapter contract identifies the `runId`, `actionHash`, `decisionId` and `idempotencyKey`. The result should be normalized into explicit states:

| Result | Meaning | Next action |
| --- | --- | --- |
| `DELIVERED` | A business-success receipt confirms the action | Record the receipt and completed state |
| `BUSINESS_REJECTED` | The provider explicitly rejects the operation | Stop; do not blindly retry the same rejected action |
| `DELIVERY_UNKNOWN` | Timeout or no verifiable receipt | Lock the same key, reconcile, then review |

HTTP 200 confirms a transport response. It does not necessarily confirm the business operation. The adapter must interpret the provider's documented success and rejection fields, which can differ across services.

### Keep uncertain outcomes recoverable

The model can suggest, classify and summarize. Deterministic code should enforce the state machine, idempotency, retry budget, approval and evidence record. When an operation cannot be safely compensated, an unknown receipt should suspend the next attempt until the outcome is checked.

Four fixture cases make this behavior testable:

1. A business-success receipt reaches `DELIVERED`.
2. An explicit business rejection does not cause an automatic repeat.
3. A timeout enters a review or reconciliation state.
4. Reusing an `idempotencyKey` cannot create a second uncontrolled external call.

These checks provide evidence about the adapter contract and recovery logic. They do not establish a production service-level guarantee. [[agent-trace-replay|Trace replay]] allows the same decisions to be checked without repeating the real action.

## 中文

外部通知、写入或支付，都是需要业务收据的状态转换。如果把它们当成一次普通函数调用，就会隐藏“确认成功”“明确拒绝”和“结果未知”之间的重要区别。

### 控制回路

从 task record 开始，评估动作及其策略，获得所需决策，再让 delivery adapter 执行已授权操作。收到结果后，先核对业务 receipt，再决定进入完成状态还是人工处理路径。

最小 adapter 契约需要明确 `runId`、`actionHash`、`decisionId` 和 `idempotencyKey`。返回值应标准化为以下状态：

| 结果 | 含义 | 下一步 |
| --- | --- | --- |
| `DELIVERED` | 业务成功收据确认动作完成 | 保存收据和完成状态 |
| `BUSINESS_REJECTED` | 服务方明确拒绝操作 | 停止，不盲目重试同一个被拒绝的动作 |
| `DELIVERY_UNKNOWN` | 超时或没有可验证收据 | 锁住相同 key，核对后再处理 |

HTTP 200 只能证明传输层收到了响应，不一定代表业务操作成功。adapter 需要按服务方文档解析业务成功和拒绝字段；不同服务的字段与语义可能不同。

### 让未知结果可以恢复

模型可以负责建议、分类和摘要；确定性代码负责状态机、幂等、重试预算、审批和证据记录。如果动作无法安全补偿，在 receipt 未知时应暂停下一次尝试，先确认结果。

可以用四个 fixture 验证：

1. 业务成功收据才进入 `DELIVERED`。
2. 业务明确拒绝不会引发自动重复执行。
3. Timeout 进入 review 或 reconciliation 状态。
4. 相同 `idempotencyKey` 不会产生第二次失控的外部调用。

这些检查验证的是 adapter 契约和恢复逻辑，不能直接证明生产 SLA。[[agent-trace-replay|Trace replay]]则让同一组决策可以在不重复真实动作的情况下接受检查。
