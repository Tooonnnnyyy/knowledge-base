---
title: "Probability, Expectation and Variance"
slug: probability-expectation-variance
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Probability]
summary: "An expected outcome is a long-run average, not the guarantee for one trajectory."
links: [cdf-pdf-pmf, monte-carlo-uncertainty, reproducible-simulation, stochastic-simulation-map]
---

## English

- **Probability**, `P(A)`, expresses how likely an event is.
- **Expectation**, `E[X]`, is the long-run average across repeated outcomes.
- **Variance**, `Var(X) = E[(X−E[X])²]`, describes how dispersed those outcomes are.

A theoretical expectation is not the result of every trajectory. A pure-birth process has expected population `E[X(t)] = X₀ exp(rt)`, but an individual Euler or Gillespie trajectory can lie above or below it.

### Reporting an outcome

Report a distribution, P95 or replication spread alongside a KPI mean. One random run cannot turn uncertainty into certainty.

## 中文

- probability `P(A)`：事件发生的可能性；
- expectation `E[X]`：很多次重复后的长期平均；
- variance `Var(X)=E[(X-E[X])^2]`：随机结果的分散程度。

理论期望不等于某一条 trajectory 的结果。pure-birth process 的期望 population 是 `E[X(t)] = X0 exp(rt)`，但单次 Euler 或 Gillespie trajectory 可以高于或低于它。

### 示例模型

报告 KPI mean 时，同时报告 distribution、P95、replication spread，避免把一次随机结果当成 certainty。
