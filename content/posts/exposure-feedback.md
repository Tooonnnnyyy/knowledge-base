---
title: "Exposure, Feedback and Selection Bias"
slug: exposure-feedback
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [AI, Recommendation]
summary: "A policy shapes what is shown, what gets measured and what the next policy can learn."
links: [recommendation-kpis, dot-product-alignment, social-feed-simulation, stochastic-simulation-map]
---

## English

A recommendation policy determines exposure. Exposure determines which user responses get recorded. Those logs may then train or guide the next policy:

```text
policy → exposure → response log → next policy
```

If an item category is rarely shown, there may be too little observed feedback to judge its quality independently of exposure. This is selection or exposure bias.

### A baseline before feedback

A random feed keeps category exposure independent of preference. Adding a popularity-weighted or preference-aware policy later makes it possible to study feedback and exposure concentration as separate changes.

## 中文

推荐 policy 决定 exposure；exposure 决定哪些 user responses 被记录；这些 logs 又可能被用于下一轮 policy：

```text
policy -> exposure -> response log -> next policy
```

如果某类 item 很少被展示，就没有足够 observed feedback 判断它的 intrinsic quality。这是 selection / exposure bias。

### 示例模型

random feed 作为 baseline，先让 category exposure 不依赖 preference。未来加入 popularity-weighted 或 preference-aware policy，才研究反馈回路和 exposure concentration。
