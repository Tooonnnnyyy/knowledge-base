---
title: "Inverse Transform Sampling and Event Gaps"
slug: inverse-transform-sampling
date: 2026-10-07
updated: 2026-10-10
type: concept
public: true
tags: [Systems, Simulation, Probability]
summary: "The same exponential sampling mechanism can model watch-time samples and event intervals."
links: [gillespie-euler, synthetic-users-kpis, social-feed-simulation, random-variables, cdf-pdf-pmf, uniform-distribution, inverse-cdf, exponential-distribution, rate-mean-lambda, stochastic-simulation-map]
---

## English

### From a uniform draw to an event interval

For an exponential random variable with mean `m`:

```text
F(x) = 1 − exp(−x/m)
F⁻¹(u) = −m log(1−u),  U ~ Uniform(0,1)
```

Writing the same distribution with rate `λ = 1/m` gives:

```text
τ = −log(U) / λ
```

Both `U` and `1−U` are uniform, so the two expressions give the same distribution. Code must avoid `log(0)`, using clipping or resampling.

### Three uses in an experiment

- Generate watch time from a mean that depends on user–content alignment.
- Generate the gap before the next traffic birth in a Gillespie process.
- Aggregate many watch-time samples into mean, P95, completion and churn metrics.

One sample cannot establish a user's preference. Inspect distributions across users and replications, with uncertainty summaries appropriate to the model.

### The distribution is still an assumption

The exponential law has a long right tail. Even a low-alignment item can occasionally receive a long watch-time sample. Applying `min(watch_time, video_length)` is a product constraint, not a new theory of behavior.

If observed data is strongly bimodal or contains session memory, a mixture, log-normal distribution, survival model or state-dependent hazard may be more suitable.

### Further reading

[SimPy documentation](https://simpy.readthedocs.io/en/latest/) provides a process-based discrete-event simulation context.

## 中文

### 核心关系

如果目标随机变量服从 mean 为 `m` 的 exponential distribution：

```text
F(x) = 1 - exp(-x / m)
F^(-1)(u) = -m log(1-u),  U ~ Uniform(0,1)
```

若用 rate `lambda = 1/m` 表示，则同一公式写作：

```text
tau = -log(U) / lambda
```

`u` 和 `1-u` 在 uniform 分布下具有相同分布，因此工程实现常见两种等价写法。实际代码应避免 `log(0)`，用 clipping 或重新抽样。

### 在示例模型中的应用

- `watch_time`：根据 user-content alignment 生成偏斜观看时长；
- `tau`：在 Gillespie 中生成下一次 traffic birth 的事件间隔；
- KPI：由许多随机 watch-time 样本汇总出 mean、P95、completion 和 churn；
- 解释边界：一次样本不能证明用户偏好，需用多用户、多次 replication 看分布和置信区间。

### 重要建模提醒

指数分布有长尾。因此低 alignment 内容也可能偶尔产生很长 watch time；`min(watch_time, video_length)` 是产品约束，不是新的真实行为理论。若经验数据显示强烈的双峰或 session memory，应考虑 mixture、log-normal、survival model 或带状态的 hazard model。

### 与资料连接

- [[gillespie-euler|Gillespie 与 Euler 离散化]]
- [[synthetic-users-kpis|合成用户与 KPI 作为系统输出]]
- [[social-feed-simulation|非个性化社交 Feed 仿真实验]]
