---
title: "Time Discretization and Fixed-Step Simulation"
slug: time-discretization
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Simulation]
summary: "A fixed clock step introduces assumptions about how many events can happen within an interval."
links: [gillespie-euler, bernoulli-trials, discrete-event-simulation, stochastic-simulation-map]
---

## English

Time discretization replaces continuous time with a grid of points separated by `dt`. A fixed-step Euler-like stochastic approximation checks event probability during each interval. Its accuracy depends on both the time step and the event rules.

### A birth-process approximation

```text
p = rXdt
```

This simple approximation allows at most one birth in a step. The requirement `p ≤ 1` is necessary, but it does not make a large step accurate. Comparing final-state distributions with the Gillespie method helps reveal the effect of discretization.

## 中文

时间离散化用间隔为 `dt` 的网格替代连续时间。固定步长的 Euler-like 随机近似会在每个时间区间检查事件概率。准确性同时取决于步长和事件规则。

### Birth process 的近似

```text
p = rXdt
```

这个简单模型在一个时间步里最多允许一次 birth。`p ≤ 1` 是必要条件，但并不意味着较大步长足够准确。把最终状态分布与 Gillespie 方法比较，可以发现离散化带来的影响。
