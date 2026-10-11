---
title: "Empirical Distributions, Histograms and Percentiles"
slug: empirical-distributions
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Data, Probability]
summary: "Distributions reveal skew and long tails that a single mean can conceal."
links: [cdf-pdf-pmf, probability-expectation-variance, monte-carlo-uncertainty, stochastic-simulation-map]
---

## English

An empirical distribution is built from observed or simulated samples. A histogram groups observations into bins. The 95th percentile, **P95**, marks a value at or below which roughly 95% of the samples fall.

### Why the shape matters

Watch-time and session-length histograms, together with P95 watch time, expose skew and long tails that a mean alone can hide. Inspecting these distributions helps distinguish a widespread improvement from a small number of unusually large outcomes.

## 中文

经验分布（empirical distribution）由实际观察或仿真的样本构成。Histogram 把样本分组放进区间；第 95 百分位数 **P95** 表示约 95% 样本不超过的值。

### 为什么要看分布形状

观看时长和 session length 的直方图，再加上 P95 watch time，能揭示均值隐藏的偏斜和长尾。它们帮助区分普遍改善与少量极端大值造成的表面提升。
