---
title: "Synthetic Users and KPIs as System Outputs"
slug: synthetic-users-kpis
date: 2026-10-07
updated: 2026-10-10
type: concept
public: true
tags: [Data, Simulation, Recommendation]
summary: "A controlled user model connects preferences, exposure, responses and aggregate metrics."
links: [dataset-definition, model-evaluation, safe-model-release, dirichlet-distribution, dot-product-alignment, markov-chains, metric-definitions, reproducible-simulation, stochastic-simulation-map, inverse-transform-sampling, social-feed-simulation, public-data-boundaries]
---

## English

### A controlled input, not evidence of a population

Synthetic users make it possible to fix seeds, vary one parameter and repeat an experiment. They help test a mechanism before deciding whether historical or real-world data is needed.

### The smallest useful state model

```text
hidden preference vector
→ content alignment
→ watch time
→ state transition
→ churn or action
```

A Dirichlet vector can create preference weights for four content categories. The feed still selects content randomly. Preference affects the response, not ranking, preserving a clear non-personalized baseline.

### Add session memory

A simplified user moves among engaged, neutral and dissatisfied states. Current state and content quality jointly affect the next transition. This introduces memory rather than drawing every response independently, while remaining a research assumption.

### KPIs are system outputs

| Perspective | Example outputs |
| --- | --- |
| Engagement | Mean watch time, session impressions, completion rate |
| Negative experience | Skip rate, churn rate |
| Social action | Like rate, share rate |
| Exposure | Category exposure share compared with catalog share |
| Infrastructure | Final traffic state, event count, replication variance |

These metrics describe the simulation, not platform performance. Define numerator, denominator, observation window and churn before comparing conditions.

### Connections to model operations

Preserve seeds, schemas, parameters, generation versions and data lineage. Use slices and replications instead of a single aggregate KPI. Shadow and canary ideas may help compare policies in a real product, but simulation results alone are not production-safety evidence.

[[dirichlet-distribution|Preference weights]], [[dot-product-alignment|alignment]], [[markov-chains|state transitions]], [[metric-definitions|metric definitions]] and [[reproducible-simulation|replications]] are the connected mechanisms.

## 中文

### 为什么使用合成用户

合成用户不是现实用户的证据，而是可控的实验输入。它允许固定 seed、改变单一参数、重复运行，并观察 system-level KPI 的变化。这样可以先验证机制，再决定是否需要真实或公开历史数据。

### 最小用户状态

```text
hidden preference vector -> content alignment -> watch time -> state transition -> churn/action
```

示例模型用 Dirichlet vector 生成四个类别的偏好权重。Feed policy 仍然随机选内容，所以偏好不参与排序；它只改变行为结果。这保持了“无个性化 baseline”的清晰对照。

### Markov behavior

用户状态可以简化为：`engaged`、`neutral`、`dissatisfied`。下一状态由当前状态和当前内容质量共同决定，因此系统有 memory；这比每次独立抽样更接近 session dynamics，但仍是研究假设。

### KPI 层

- engagement：mean watch time、session impressions、completion rate；
- negative experience：skip rate、churn rate；
- social action：like rate、share rate；
- exposure：各 category exposure share 与 catalog share；
- infrastructure：traffic final state、event count、replication variance。

KPI 是仿真模型的 output，不是“平台真实表现”。首先写清楚 numerator、denominator、observation window 和 churn definition，再比较不同实验条件。

### 与 MLOps 连接

- [[dataset-definition|数据定义与可复现性]]：保留 seed、schema、参数、生成版本和 data lineage；
- [[model-evaluation|模型评估与阈值]]：不要只看单一 aggregate KPI，要做 slices 和重复实验；
- [[safe-model-release|安全发布与监控]]：真实产品中可用 shadow / canary 思路比较新旧策略，但仿真结果不是生产安全证据。

### 术语连接

- [[dirichlet-distribution|Dirichlet Distribution]]：生成 compositional preference vector。
- [[dot-product-alignment|Dot Product Alignment]]：计算 user-content match。
- [[markov-chains|Markov Chain Transition Matrix]]：更新用户行为 state。
- [[metric-definitions|Experiment KPI Metric Definition]]：定义 numerator、denominator 和 window。
- [[reproducible-simulation|Monte Carlo Random Seed Reproducibility]]：重复运行并记录 seed。
