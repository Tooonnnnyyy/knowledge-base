---
title: "Random Variables"
slug: random-variables
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Probability]
summary: "A random variable maps the outcome of an experiment to a number or state."
links: [cdf-pdf-pmf, uniform-distribution, inverse-transform-sampling, synthetic-users-kpis, stochastic-simulation-map]
---

## English

A random variable `X` maps the outcome of a random experiment to a number. It can be continuous, such as watch time or an event gap, or discrete, such as a skip, a like or a population count.

### Naming the modeled outcome

- `X_watch`: one watch-time sample.
- `X_tau`: the interval before the next birth event.
- `X_state`: a user's behavioral state, represented by discrete labels or codes.

Naming the variable helps separate what is sampled from the rules and parameters used to sample it.

## 中文

随机变量 `X` 把随机实验的结果映射成数值。它可以是连续的，例如 watch time 或 event gap，也可以是离散的，例如 skip、like 或 population count。

在示例模型中：`X_watch` 是一次观看时长，`X_tau` 是下一次 birth 的时间间隔，`X_state` 是用户行为状态。
