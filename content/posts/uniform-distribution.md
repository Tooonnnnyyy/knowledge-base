---
title: "Uniform Distributions"
slug: uniform-distribution
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Probability]
summary: "Uniform random numbers are the starting point for many sampling mechanisms."
links: [inverse-cdf, exponential-distribution, gillespie-euler, reproducible-simulation, stochastic-simulation-map]
---

## English

`U ~ Uniform(0,1)` gives equal probability to equal-length intervals between zero and one. Pseudorandom generators commonly provide approximately uniform samples that can then be transformed into a target distribution.

### Three uses in an example model

- Inverse transform sampling starts with `U`.
- An Euler-like birth step tests `U < p` as a Bernoulli-style coin flip.
- Like, share and churn actions can test `U < probability` to produce Boolean outcomes.

A boundary value can produce `log(0)` in a later transformation. Clipping or resampling avoids this numerical failure.

## 中文

`U ~ Uniform(0,1)` 表示 `[0,1]` 区间内每个等长度区间有相同概率。伪随机数生成器通常先提供近似 uniform 的 `U`，再用 transformation 生成目标分布。

### 示例模型

- inverse transform 的输入是 `U`；
- Euler birth step 用 `U < p` 做一次 Bernoulli-style coin flip；
- like、share、churn 也用 `U < probability` 生成布尔 action。

`U=0` 或 `U=1` 可能导致 `log(0)`，代码使用 clipping 避免数值错误。
