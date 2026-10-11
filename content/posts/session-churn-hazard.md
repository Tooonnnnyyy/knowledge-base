---
title: "Sessions, Churn, Retention and Hazard"
slug: session-churn-hazard
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Product, Recommendation]
summary: "A session model needs a clear termination event and an observation window."
links: [markov-chains, watch-ratio-metrics, metric-definitions, markov-states, stochastic-simulation-map]
---

## English

A **session** is a sequence of user events within an observation window. **Churn** is the modeled termination event. **Retention** is a survival outcome defined for a chosen time window; it is a complement only when the definitions and population match.

A **hazard** is the conditional event rate given that a session has survived so far.

### A deliberately simple model

Churn probability can increase with poor content alignment, a dissatisfied state and a skip event. This is a discrete approximation of session endings, not a survival model fitted to real behavioral data.

## 中文

**Session** 是观察窗口内的一系列用户事件；**churn** 是模型定义的终止事件。**Retention** 是某个时间窗口内的存续结果，只有定义与总体一致时，才能把它与流失作为互补关系。

**Hazard** 表示 session 已经持续至今的条件下，终止事件的条件发生率。

### 一个有意简化的模型

较差的内容匹配、不满意状态和跳过事件，都可以提高 churn probability。这是 session 终止的离散近似，并不是用真实行为数据拟合的生存模型。
