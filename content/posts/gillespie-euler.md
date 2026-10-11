---
title: "Gillespie and Euler: Two Ways to Simulate Events"
slug: gillespie-euler
date: 2026-10-07
updated: 2026-10-10
type: concept
public: true
tags: [Systems, Simulation]
summary: "Compare fixed steps with event-driven sampling for the same stated birth process."
links: [pure-birth-process, rate-mean-lambda, uniform-distribution, exponential-distribution, markov-jump-processes, discrete-event-simulation, stochastic-simulation-map, inverse-transform-sampling, social-feed-simulation, dataset-definition, model-evaluation]
---

## English

### One process, two simulation methods

Let a population or request count be `X(t)`, with every current individual producing a new birth at rate `r`:

```text
λ(X) = rX
X → X + 1
```

### Euler-like fixed steps

Divide time into intervals of length `dt`. At each step, use a uniform coin flip with:

```text
P(birth in dt) ≈ rXdt
```

This is an approachable approximation, but it permits at most one event per step. A large `dt` can even make the probability exceed one. A very small `dt` spends computation on many intervals in which nothing happens.

### Gillespie event times

Instead, sample the interval to the next event directly:

```text
τ = −log(U) / (rX)
t ← t + τ
X ← X + 1
```

This skips uneventful time and fits the continuous-time Markov jump process. The result is a random trajectory, so policy comparisons still require replications.

### Applying the comparison to traffic

A toy traffic model can treat amplified fetch or view requests as births, with a new-request rate proportional to the current count. Comparing final traffic distributions from both methods reveals discretization effects and computational tradeoffs.

Gillespie models event timing here, not recommendation ranking. “Naive” describes a particular numerical approximation; it does not mean every fixed-step simulation is wrong. Accuracy must be judged against the intended process and acceptable error.

### Connected ideas

- [[pure-birth-process|Pure-birth process]] defines the state transition.
- [[rate-mean-lambda|Rate and mean]] distinguish the total rate from a sampled interval.
- [[uniform-distribution|Uniform sampling]] supplies coin flips and transformed event gaps.
- [[exponential-distribution|Exponential distributions]] give the waiting-time law.
- [[markov-jump-processes|Markov jump processes]] provide the process model.
- [[discrete-event-simulation|Discrete-event simulation]] updates at events instead of every clock tick.

### Further reading

- [Gillespie's direct-method paper](https://doi.org/10.1016/0021-9991(76)90041-3)
- [SimPy documentation](https://simpy.readthedocs.io/en/latest/)

## 中文

### 同一个 birth process

令人口或请求数为 `X(t)`，每个个体以 rate `r` 触发一次 birth：

```text
lambda(X) = r X
X -> X + 1
```

### Euler-like fixed-step

把时间切成 `dt`，每一步用：

```text
P(birth in dt) ≈ r X dt
```

然后用一次 uniform coin flip 决定是否发生 birth。它容易理解，也可以作为近似基线，但会有两个结构性问题：每个时间格最多一次事件；`dt` 太大时概率可能超过 1；`dt` 很小时会浪费大量空步。

### Gillespie direct method

直接抽取下一次事件间隔：

```text
tau = -log(U) / (r X)
t <- t + tau
X <- X + 1
```

它跳过没有事件的时间，适合 continuous-time Markov jump process。算法输出的是一条随机 trajectory，不是 deterministic forecast；要比较策略，仍需多次 replication。

### 在社交 Feed 项目中的应用

把 viral traffic 抽象为 request birth：内容曝光增加后，新的 fetch / view request 以与当前 traffic 成比例的 rate 到达。比较 Euler 和 Gillespie 的 final traffic distribution，可讨论离散化误差和计算效率。

### 不要混淆

- Gillespie 生成的是 traffic event timing，不是 recommendation ranking；
- Euler 的“naive”是数值/概率近似问题，不表示所有 fixed-step simulation 都错误；
- 是否“更准确”要相对目标过程和可接受误差判断。

### 术语连接

- [[pure-birth-process|Pure-Birth Process]]：`X -> X+1` 的系统过程。
- [[rate-mean-lambda|Rate Mean Lambda]]：`lambda(X)=rX` 是 total event rate。
- [[uniform-distribution|Uniform Distribution]]：用于 Euler coin flip 和 event gap。
- [[exponential-distribution|Exponential Distribution]]：Gillespie 的 waiting-time law。
- [[markov-jump-processes|Continuous-Time Markov Jump Process]]：Gillespie 的过程语境。
- [[discrete-event-simulation|Discrete-Event Simulation]]：按事件跳跃而非每个 clock tick 更新。
