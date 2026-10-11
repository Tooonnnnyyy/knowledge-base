---
title: "Recommendation Feedback Loops and KPI Choice"
slug: recommendation-kpis
date: 2026-10-07
updated: 2026-10-10
type: concept
public: true
tags: [AI, Recommendation, Model evaluation]
summary: "Evaluate engagement, negative experience and exposure together to understand a feed policy."
links: [exposure-feedback, dot-product-alignment, metric-definitions, oauth-consent, stochastic-simulation-map, synthetic-users-kpis, monte-carlo-uncertainty, input-modeling, social-feed-simulation]
---

## English

### A recommendation system is a loop

```text
policy → exposure → user response → logged data → next policy
```

A policy that repeatedly shows only one content category leaves little evidence about responses to other categories. This is exposure or selection bias. Observed engagement cannot simply be equated with intrinsic preference.

### Isolate the first mechanism

A non-personalized random feed keeps exposure independent of hidden preference. This makes synthetic behavior and the KPI pipeline easier to inspect. A popularity-weighted or preference-aware policy can then be added to study feedback and concentration.

### Read a set of metrics

- **Watch time** can be pulled upward by a long tail.
- **Completion** depends on video length.
- **Skip and churn** describe negative experience.
- **Likes and shares** are explicit but often sparse actions.
- **Exposure share** reveals whether opportunities concentrate.
- **Latency and traffic** connect the infrastructure layer.

Every metric needs a numerator, denominator, window, slice and an account of how the policy influences it.

### The evaluation boundary

Synthetic KPIs can help show whether code implements a predefined mechanism. Comparing real policies requires a controlled experiment, suitable logged-data methods with propensity or counterfactual assumptions, or an explicitly descriptive claim.

[[exposure-feedback|Exposure feedback]], [[dot-product-alignment|affinity]], [[metric-definitions|metric contracts]] and [[oauth-consent|data access]] keep those boundaries visible.

## 中文

### 系统关系

推荐系统不是静态 predictor：

```text
policy -> exposure -> user response -> logged data -> next policy
```

如果 policy 只给某一类内容，未来日志会缺少其他内容的 response。这是 exposure / selection bias；observed engagement 不能直接等于 intrinsic preference。

### 示例实验如何隔离问题

非个性化 random feed 让 content exposure 与 hidden preference 独立，适合先观察 synthetic behavior 和 KPI pipeline。之后增加 popularity-weighted 或 preference-aware policy，才能研究 feedback loop 和 exposure concentration。

### KPI 不能只看一个

- watch time：可能被长尾拉高；
- completion：受 video length 影响；
- skip / churn：体现负面体验；
- like / share：是显式 action，但很稀疏；
- exposure share：检查内容机会是否集中；
- latency / traffic：连接 infrastructure layer。

每个 KPI 需要定义 numerator、denominator、window、slice 和是否受 policy 影响。

### 评估边界

synthetic KPI 只能证明代码实现了预设机制。若要比较真实策略，需要 controlled experiment、历史日志的 propensity / counterfactual 方法，或明确地把结论限制为 descriptive simulation result。

### 术语连接

- [[exposure-feedback|Exposure Feedback Loop]]：policy、exposure、response log 的回路。
- [[dot-product-alignment|Dot Product Alignment]]：user-item affinity 的计算机制。
- [[metric-definitions|Experiment KPI Metric Definition]]：明确每个 KPI 的分母和窗口。
- [[oauth-consent|API OAuth Consent Aggregate Data]]：真实数据扩展的 access boundary。
