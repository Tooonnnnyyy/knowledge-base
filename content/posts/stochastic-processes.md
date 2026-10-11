---
title: "Stochastic Processes"
slug: stochastic-processes
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Simulation]
summary: "Known transition rules can still generate unpredictable trajectories."
links: [random-variables, markov-chains, markov-jump-processes, synthetic-users-kpis, stochastic-simulation-map]
---

## English

A stochastic process is a collection of random variables indexed by time or event order, such as `X(t)`. A state can be unpredictable even when its transition rules are known.

### Two examples at different levels

User session states evolve after each impression. Viral traffic evolves through birth events. Writing their transition assumptions explicitly helps keep a sampled trajectory in its proper role: one possible outcome of a model, not a deterministic forecast.

## 中文

随机过程（stochastic process）是一组由时间或事件顺序索引的随机变量，例如 `X(t)`。即使转移规则已知，具体状态仍可能不可预测。

### 不同层次的两个例子

用户 session state 在每次曝光后变化；传播流量则通过 birth event 增长。明确写出转移假设，可以让随机轨迹保留正确含义：它是模型的一种可能结果，而不是确定性预测。
