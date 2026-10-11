---
title: Replay Decisions Without Repeating Side Effects
date: 2026-10-01
type: architecture
tags: [AI, Engineering, Agent systems, Model evaluation]
summary: Redacted traces and injected dependencies make agent regression tests repeatable without repeating real external actions.
links: [agent-delivery-reconciliation, agent-change-approval, agent-change-bundles, ai-product-architecture, ai-product-development]
public: true
---

## English

Testing a new agent version by replaying real external tools can repeat notifications, writes or other side effects. A safer test artifact is a redacted, versioned trace and a replay harness whose dependencies cannot perform production actions.

### What a trace must preserve

A `TraceRecord` needs enough information to compare a decision: `runId`, input hash, `policyVersion`, an optional `promptVersion`, state transitions, redacted evidence references, and the expected state and action hash. It should omit secrets and unnecessary original user content.

The test then follows this sequence:

1. Load an immutable, redacted trace.
2. Inject a fixed clock, fixed fixtures, a fake model and a fake delivery adapter.
3. Run the candidate decision logic against those dependencies.
4. Compare the result and intended action with the expected result.
5. Classify it as `PASS`, `EXPECTED_CHANGE` or `REGRESSION`.

An expected change needs an explicit basis; a difference is not acceptable merely because the new output sounds plausible.

### A shared interface, separate effects

Production and replay adapters can implement the same interface. The replay environment should have no real credentials or required external network access. A fake adapter may record an intended action for comparison, while the count of real external calls remains zero.

```text
replayRun(trace, {
  clock: fixedClock,
  model: fixtureModel,
  delivery: recordingFakeAdapter
})
```

Useful starting fixtures cover a timeout, an explicit business rejection and a success receipt. Also check approval paths. A change from `HUMAN_REVIEW` to `DELIVERED` can be a serious regression even when the final text is unchanged.

### Evidence to retain

Store the fixture hash, policy version, classification and redacted result. This gives a reviewer a repeatable account of how the candidate differs from the baseline. It proves the tested decision behavior, not live delivery or an unmeasured reliability guarantee. [[agent-change-approval|A release gate]] uses this evidence to decide whether a change can proceed.

## 中文

用真实外部工具重放 agent 来测试新版本，可能重复发送通知、写入数据或产生其他副作用。更合适的测试资产是脱敏、版本化的 trace，以及无法执行生产动作的 replay harness。

### Trace 需要保留什么

`TraceRecord` 应保留足以比较决策的信息：`runId`、输入 hash、`policyVersion`、可选 `promptVersion`、状态转换、脱敏 evidence reference，以及期望状态和 action hash。Secret 与不必要的用户原文应被排除。

测试流程可以是：

1. 加载不可变、已脱敏的 trace。
2. 注入固定 clock、fixtures、fake model 和 fake delivery adapter。
3. 使用这些依赖运行候选版本的决策逻辑。
4. 比较实际结果、动作意图和期待结果。
5. 分类为 `PASS`、`EXPECTED_CHANGE` 或 `REGRESSION`。

`EXPECTED_CHANGE` 必须有明确依据，不能因为新输出听起来合理，就默认所有差异可接受。

### 共用接口，隔离副作用

Production adapter 与 replay adapter 可以实现同一个 interface。Replay 环境不应拥有真实 credential，也不应依赖外部网络。Fake adapter 可以记录动作意图用于比较，但真实外部调用次数必须保持为零。

```text
replayRun(trace, {
  clock: fixedClock,
  model: fixtureModel,
  delivery: recordingFakeAdapter
})
```

起步 fixture 可以覆盖 timeout、business rejection 和 success receipt，并补充审批路径。即使最终文案不变，从 `HUMAN_REVIEW` 自动变成 `DELIVERED` 也可能是严重回归。

### 留下什么证据

保留 fixture hash、policy version、分类结论和脱敏结果，让审阅者可以重复验证候选版本与基线的差异。这能证明被测试的决策行为，不能证明 live delivery 或尚未测量的可靠性保证。[[agent-change-approval|发布门禁]]进一步使用这些证据，决定变更是否可以继续。
