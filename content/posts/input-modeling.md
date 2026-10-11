---
title: "Input Modeling and Distribution Calibration"
slug: input-modeling
date: 2026-10-07
updated: 2026-10-10
type: concept
public: true
tags: [Data, Simulation, Probability]
summary: "A simulation is only as credible as its input assumptions and calibration evidence."
links: [cdf-pdf-pmf, exponential-distribution, dirichlet-distribution, probability-expectation-variance, reproducible-simulation, stochastic-simulation-map, inverse-transform-sampling, monte-carlo-uncertainty, dataset-definition, social-feed-simulation]
---

## English

### The output depends on the input assumptions

A simulation's credibility is limited by its input distributions. Define the event or observation unit before estimating arrival, watch-time, service-time or action distributions. A distribution's convenience in code is not evidence that it describes the mechanism.

### A transparent synthetic baseline

| Input | Modeled mechanism |
| --- | --- |
| Preferences | A Dirichlet compositional latent vector |
| Watch time | Alignment-dependent exponential samples capped by video length |
| Arrival gaps | Exponential event gaps in a Gillespie process |
| Like, share and churn | Bounded probability models |
| Behavioral state | A Markov transition matrix |

These are experimental assumptions. When adding MovieLens or Amazon ratings, map rating, timestamp and item metadata into a defined input schema. Document missing values, sampling, filters and transformation lineage.

### Calibration questions

- Do the mean, median and P95 of synthetic watch time suit the target scenario?
- Does the cap create too many full-completion observations?
- Were category proportions made uniform only for convenience?
- Do different user slices have comparable opportunities to be observed?

[[cdf-pdf-pmf|Distribution functions]], [[exponential-distribution|waiting-time assumptions]], [[dirichlet-distribution|preference weights]], [[probability-expectation-variance|moments and spread]] and [[reproducible-simulation|reproducible protocols]] provide the checks.

## 中文

### 作用

Simulation 的输出可信度受输入分布限制。应先定义 event / observation unit，再从数据估计 arrival、watch-time、service-time 或 action probability 的分布；不要因为某个分布方便编码就自动把它当成真实机制。

### 当前 synthetic baseline

- preference：Dirichlet，仅作为可控的 compositional latent state；
- watch time：alignment-dependent exponential，再受 video length cap；
- arrival gap：Gillespie 的 exponential event gap；
- like/share/churn：bounded probability model；
- state：Markov transition matrix。

这些是实验假设。若换成 MovieLens 或 Amazon ratings，应把观测到的 rating / timestamp / item metadata 映射成明确的 input schema，并报告缺失值、sampling、filter 和 transformation lineage。

### 校准问题

- synthetic watch-time 的均值、median、P95 是否符合目标场景？
- truncation 是否制造过多 full-completion？
- category proportions 是否被人为设成均匀？
- 不同 user slices 是否有相同的 observation opportunity？

### 术语连接

- [[cdf-pdf-pmf|CDF PDF PMF]]：检查目标分布与 empirical distribution。
- [[exponential-distribution|Exponential Distribution]]：当前 watch time 和 event gap baseline。
- [[dirichlet-distribution|Dirichlet Distribution]]：当前 preference input model。
- [[probability-expectation-variance|Probability Expectation Variance]]：校准 mean、variance 和 tail。
- [[reproducible-simulation|Monte Carlo Random Seed Reproducibility]]：比较参数前固定 experiment protocol。
