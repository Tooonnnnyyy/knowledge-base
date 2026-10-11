---
title: A Scheduled Run Can Correctly Do Nothing
date: 2026-10-10
type: protocol
tags: [Engineering, Systems, Agent systems]
summary: Check timezone, execution windows, duplicates and delivery receipts before a scheduled automation creates a side effect.
links: [agent-delivery-reconciliation, agent-change-bundles, agent-trace-replay, ai-product-architecture]
public: true
---

## English

A scheduled trigger does not automatically mean useful work is due. The runner may start before the permitted window, encounter a result that already exists, or run on a machine whose local timezone differs from the schedule's timezone. An explicit gate turns these cases into understandable states.

### The pre-window gate

1. Read the current time in the schedule's configured timezone.
2. Determine which window, if any, is eligible.
3. Confirm that the schedule remains active and check its execution environment.
4. Check the date-and-window key for an existing payload or completion record.
5. If no work is due, write a run record explaining the no-op and stop before generating or sending content.
6. When work is due, validate the payload, execute within the policy, and reconcile its business receipt.

A payload from a previous day must not silently become today's result. The key should identify the intended date and window rather than relying only on the existence of a similarly named file.

### Distinguish execution from delivery

| Observation | What it establishes |
| --- | --- |
| Schedule configuration is active | The configured schedule is enabled |
| Runner started | An execution attempt began |
| Payload is valid | The output format passed its check |
| HTTP response arrived | The transport completed far enough to return a response |
| Business-success receipt received | The provider confirms the operation under its contract |

These are separate facts. A failure or unknown receipt needs the [[agent-delivery-reconciliation|reconciliation policy]], including duplicate protection and a bounded retry decision.

### The execution environment matters

A local runner depends on the local machine being available. A schedule configured on a sleeping or powered-off computer cannot by itself guarantee execution. Moving to an always-on environment changes the operational dependencies: the runner, authorization, secrets and target service must all be configured and tested there.

A correct no-op is useful evidence. It shows that the automation respected its time and duplicate boundaries without manufacturing a result to make the run look busy.

## 中文

定时触发并不代表此刻一定有工作要执行。Runner 可能在允许窗口之前启动，可能发现结果已经存在，也可能运行在与调度时区不同的机器上。明确的 gate 能把这些情况变成可解释的状态。

### 窗口前门禁

1. 按配置的 schedule timezone 读取当前时间。
2. 判断当前是否有 eligible window。
3. 确认调度仍启用，并检查 execution environment。
4. 按日期与窗口组成的 key 检查已有 payload 或完成记录。
5. 没有到期工作时，只写说明原因的 run record，在生成和发送内容之前停止。
6. 到窗口后，校验 payload，按策略执行，并核对 business receipt。

前一天的 payload 不能被悄悄当成今天的结果。Key 应标识目标日期与窗口，不能只依赖某个相似文件名是否存在。

### 区分运行与送达

| 观察结果 | 能证明什么 |
| --- | --- |
| Schedule configuration 是 active | 配置中的调度已启用 |
| Runner 启动 | 一次执行尝试开始 |
| Payload 有效 | 输出格式通过检查 |
| 收到 HTTP response | 传输进行到了返回响应的阶段 |
| 收到业务成功 receipt | 服务方按其契约确认操作完成 |

这是几个独立事实。失败或未知收据需要 [[agent-delivery-reconciliation|reconciliation policy]]，其中包括去重保护和有边界的重试决策。

### 执行环境也是条件

Local runner 依赖本机可用。在睡眠或关机电脑上配置一个 schedule，本身不能保证执行。迁移到常驻环境会改变运行依赖：runner、authorization、secret 和目标服务，都需要在那里配置并验证。

正确的 no-op 也是有用证据。它说明自动化遵守了时间与去重边界，没有为了让记录看起来忙碌而制造结果。
