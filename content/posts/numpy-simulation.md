---
title: "NumPy Tools for a Simulation"
slug: numpy-simulation
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Engineering, Simulation]
summary: "Sampling and aggregation functions implement a model without replacing its assumptions."
links: [reproducible-simulation, uniform-distribution, recommendation-policy, dirichlet-distribution, markov-chains, inverse-cdf, stochastic-feed-formulas, metric-definitions, empirical-distributions, stochastic-simulation-map, social-feed-simulation, dataset-definition]
---

## English

These functions are tools for implementing a mathematical model. They do not replace the model's assumptions.

| Function | Role in the example | Related idea |
| --- | --- | --- |
| `np.random.default_rng(seed)` | Create a reproducible generator | [[reproducible-simulation]] |
| `rng.random()` | Draw `U ~ Uniform(0,1)` | [[uniform-distribution]] |
| `rng.integers()` | Select a random video or category | [[recommendation-policy]] |
| `rng.dirichlet()` | Generate a preference vector | [[dirichlet-distribution]] |
| `rng.choice(..., p=row)` | Sample a next state | [[markov-chains]] |
| `np.log1p(-u)` | Compute `log(1−u)` stably | [[inverse-cdf]] |
| `np.clip()` | Protect the logarithm's boundary | [[inverse-cdf]] |
| `np.minimum()` | Apply a video-length cap | [[stochastic-feed-formulas]] |
| `np.bincount()` | Aggregate category impressions | [[metric-definitions]] |
| `np.percentile()` | Calculate a P95 statistic | [[empirical-distributions]] |
| `np.exp()` | Compute a pure-birth expectation | [[stochastic-feed-formulas]] |
| `plt.hist()` / `plt.bar()` | Plot empirical outcomes | [[empirical-distributions]] |

### The evidence boundary

The pseudorandom sequence from `np.random` is not an observation of a real random process. A seed improves reproducibility, not external validity.

## 中文

这些函数是实现数学模型的工具；它们不替代模型假设。

| Function | 在示例模型中的作用 | 连接 |
| --- | --- | --- |
| `np.random.default_rng(seed)` | 创建可复现的 generator | [[reproducible-simulation]] |
| `rng.random()` | 产生 `U ~ Uniform(0,1)` | [[uniform-distribution]] |
| `rng.integers()` | 随机选 video / category | [[recommendation-policy]] |
| `rng.dirichlet()` | 生成 preference vector | [[dirichlet-distribution]] |
| `rng.choice(..., p=row)` | 按 transition row 抽 next state | [[markov-chains]] |
| `np.log1p(-u)` | 稳定计算 `log(1-u)` | [[inverse-cdf]] |
| `np.clip()` | 防止 `u` 到达 log 的边界 | [[inverse-cdf]] |
| `np.minimum()` | 施加 video length cap | [[stochastic-feed-formulas]] |
| `np.bincount()` | 聚合 impressions / category counts | [[metric-definitions]] |
| `np.percentile()` | 计算 P95 tail KPI | [[empirical-distributions]] |
| `np.exp()` | pure-birth theoretical expectation | [[stochastic-feed-formulas]] |
| `plt.hist()` / `plt.bar()` | 显示 empirical KPI distributions | [[empirical-distributions]] |

### 代码边界

`np.random` 的 pseudo-random sequence 不是现实随机过程的直接观测。seed 只能提高 reproducibility；它不增加 external validity。
