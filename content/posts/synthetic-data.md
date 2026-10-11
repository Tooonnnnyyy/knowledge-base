---
title: "From Synthetic Results to Real-World Evidence"
slug: synthetic-data
date: 2026-10-07
updated: 2026-10-10
type: concept
public: true
tags: [Data, Model evaluation]
summary: "Mechanism checks, simulation results and external validity are separate evidence layers."
links: [oauth-consent, metric-definitions, reproducible-simulation, cdf-pdf-pmf, stochastic-simulation-map, public-data-boundaries, input-modeling, dataset-definition, social-feed-simulation]
---

## English

### Three layers of evidence

1. **Mechanism checks:** does the code follow the stated formulas and state transitions?
2. **Simulation evidence:** across replications, do parameter changes produce the modeled KPI effects?
3. **External validity:** are outputs compatible with distributions observed in the real world or in suitable historical data?

Work at the first two layers does not automatically establish the third. A functioning synthetic system is still a model with assumptions.

### Adding historical data carefully

MovieLens ratings can support user–item preference and ranking baselines. Amazon Review Data can provide items, ratings, review text and product metadata. These can calibrate affinity, but they should not be described as a social platform's watch-time or recommendation logs.

YouTube Analytics and Instagram Insights commonly provide authorized account-level aggregates. Research and data-portability services depend on approval or consent. They are possible extensions with specific access boundaries.

### Language that matches the evidence

Use phrases such as “under this synthetic model,” “the simulation suggests” or “the observed change is consistent with the assumed mechanism.” Avoid turning those results into claims that real users will behave the same way, that production retention improved or that preference has been proved.

### Connected ideas

[[oauth-consent|Data access and consent]] define the available evidence. [[metric-definitions|Comparable metrics]], [[reproducible-simulation|replicable experiments]] and [[cdf-pdf-pmf|distribution comparisons]] help assess it.

## 中文

### 三层证据

1. **mechanism check**：代码是否按公式和状态转移运行；
2. **simulation evidence**：在多次 replication 下，参数改变是否产生预期 KPI 变化；
3. **external validity**：模型输出是否与现实或公开历史数据的分布相容。

完成前两层的一部分，仍不等于具备现实平台的 external validity 证据。

### 如何加入历史数据

MovieLens ratings 可用于 user-item preference 和 ranking baseline；Amazon Review Data 可用于 item、rating、review text 与 product metadata。它们可以校准 preference / item affinity，但不能被包装成 TikTok watch-time 或 platform recommendation logs。

YouTube Analytics / Instagram Insights 通常是授权账号的 aggregate analytics；TikTok Research / Data Portability 受项目审批或用户授权约束。它们可作为 extension data source，而不是无条件的真实用户行为接口。

### 报告措辞

使用：

- “在本 synthetic model 下……”
- “simulation suggests……”
- “the observed change is consistent with the assumed mechanism……”

避免：

- “TikTok users will……”
- “the algorithm improves retention in production……”
- “this proves user preference……”

### 术语连接

- [[oauth-consent|API OAuth Consent Aggregate Data]]：真实平台数据的授权与聚合边界。
- [[metric-definitions|Experiment KPI Metric Definition]]：synthetic 与 historical KPI 要用可比定义。
- [[reproducible-simulation|Monte Carlo Random Seed Reproducibility]]：simulation evidence 的重复性。
- [[cdf-pdf-pmf|CDF PDF PMF]]：比较 empirical distributions，而不是只比较一个 mean。
