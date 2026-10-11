---
title: "CDF, PDF and PMF"
slug: cdf-pdf-pmf
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Probability]
summary: "Cumulative probability, continuous density and discrete probability answer different questions."
links: [exponential-distribution, inverse-cdf, random-variables, probability-expectation-variance, stochastic-simulation-map]
---

## English

### CDF: cumulative probability

The cumulative distribution function is `F_X(x) = P(X ≤ x)`: the probability that a random variable does not exceed `x`. A CDF is nondecreasing and ranges from zero to one. Inverse transform sampling starts with `U ~ Uniform(0,1)` and applies `X = F_X⁻¹(U)`.

### PDF: continuous density

A continuous variable is described by a density `f_X(x)`. A PDF's value at a single point is not the probability of that point. Probability over an interval comes from integrating the density:

```text
P(a ≤ X ≤ b) = ∫[a,b] f_X(x) dx
```

### PMF: discrete probability

A probability mass function is `p_X(x) = P(X = x)`. It applies to discrete outcomes, such as whether a birth occurs or whether a state is engaged or neutral.

### In a simulation

A watch-time model can use an exponential CDF, while an Euler-like step uses a discrete birth probability. Aggregating the sampled outcomes produces an empirical distribution of KPIs.

## 中文

### CDF（Cumulative Distribution Function）

`F_X(x) = P(X <= x)`，表示随机变量不超过 `x` 的累计概率。CDF 一定不下降，范围从 0 到 1。逆变换采样就是先取 `U ~ Uniform(0,1)`，再求 `X = F_X^{-1}(U)`。

### PDF（Probability Density Function）

连续变量用 density `f_X(x)` 描述。单点的 PDF 值不是单点概率；区间概率要对 density 积分：`P(a <= X <= b) = integral_a^b f_X(x) dx`。

### PMF（Probability Mass Function）

离散变量用 `p_X(x) = P(X=x)` 描述，例如一次 birth 是否发生、state 是 engaged 还是 neutral。

### 示例模型

watch time 使用 exponential CDF；Euler 使用离散 birth probability；KPI 是由这些随机结果聚合出的 empirical distribution。
