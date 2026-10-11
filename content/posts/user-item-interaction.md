---
title: "User–Item Interactions"
slug: user-item-interaction
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Data, Recommendation]
summary: "An interaction records a response under a particular exposure policy."
links: [dot-product-alignment, metric-definitions, exposure-feedback, stochastic-simulation-map]
---

## English

A user–item interaction records a response to an item: watch time, a rating, a click, a skip, a like, a share or a purchase. In recommendation work, the response depends on both the item and the policy that exposed it.

### What an event log says

An example event row can contain user, video, category, alignment, watch time and actions. This supports descriptive KPI analysis. It does not imply that the same response would have occurred under every other exposure policy.

## 中文

User–item interaction 记录用户对物品的反应，例如观看时长、评分、点击、跳过、点赞、分享或购买。在推荐系统中，这个反应同时受到物品本身和曝光策略的影响。

### Event log 能说明什么

一个示例事件行可以包含用户、视频、类别、匹配度、观看时长和动作。这适合用于描述性 KPI 分析，但不能证明在其他曝光策略下也一定会发生相同反应。
