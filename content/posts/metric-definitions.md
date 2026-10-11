---
title: "A Metric Needs a Definition"
slug: metric-definitions
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Data, Model evaluation]
summary: "Every KPI needs a numerator, denominator, window, slice and unit of analysis."
links: [synthetic-users-kpis, recommendation-kpis, monte-carlo-uncertainty, stochastic-simulation-map]
---

## English

A KPI is a function of an event log, not a number that exists independently of its definition. Write down at least:

```text
metric = numerator / denominator
observation window
slice or cohort
unit of analysis
```

### Example definitions

| Metric | Definition |
| --- | --- |
| Completion rate | Completed impressions / all impressions |
| Skip rate | Skipped impressions / all impressions |
| Churn rate | Users whose sessions ended through churn / all users |
| Mean session watch | Total watched seconds / all users |
| Exposure share | Impressions in a category / all impressions |

Mean watch time, P95, session length and exposure concentration should be read together. Optimizing a single KPI can hide the tradeoffs in the rest of the system.

## 中文

KPI 不是一个自然存在的数字；它是对 event log 的函数。至少要写清：

```text
metric = numerator / denominator
observation window
slice / cohort
unit of analysis
```

### 当前指标

- completion rate = completed impressions / all impressions；
- skip rate = skipped impressions / all impressions；
- churn rate = users with churn / users；
- mean session watch = total watched seconds / users；
- exposure share = category impressions / all impressions。

mean watch time、P95、session length 和 exposure concentration 应一起看，避免单一 KPI 诱导错误结论。
