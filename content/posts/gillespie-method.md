---
title: "The Gillespie Direct Method"
slug: gillespie-method
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Simulation]
summary: "Sample the next event time from the current total rate, then sample the event."
links: [gillespie-euler, inverse-cdf, markov-jump-processes, discrete-event-simulation, stochastic-simulation-map]
---

## English

The Gillespie direct method first samples the next event time from an exponential distribution using the current total propensity. It then samples which event occurs.

A pure-birth process has only one event type:

```text
τ = −log(U) / (rX)
X ← X + 1
```

The method is exact for the specified continuous-time Markov jump process. That mathematical property does not automatically make the process a faithful model of a real platform.

## 中文

Gillespie direct method 先根据当前 total propensity，从指数分布中抽取下一次事件发生时间，再抽取具体发生的事件类型。

对于只有一种事件类型的 pure-birth process：

```text
τ = −log(U) / (rX)
X ← X + 1
```

这种方法对所指定的连续时间 Markov jump process 是精确的，但数学上的精确不等于它能自动忠实描述真实平台。
