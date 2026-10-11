---
title: "Treatment, Control and Counterfactuals"
slug: causal-comparisons
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Data, Model evaluation, Recommendation]
summary: "A comparison becomes causal only when the design supports the missing alternative outcome."
links: [recommendation-kpis, synthetic-data, exposure-feedback, stochastic-simulation-map]
---

## English

A **treatment** is an assigned policy or intervention. A **control** is the comparison condition. A **counterfactual** asks what the same unit would have experienced under another policy.

Recommendation logs usually show only the action or item that was exposed. The unobserved alternative is missing, so descriptive KPI comparisons alone cannot establish a causal effect.

### The boundary of a baseline

A random feed is a baseline condition. It does not prove anything causal about a real platform. A future simulation can compare random and preference-aware policies with matched seeds and explicit assumptions, while keeping claims limited to the modeled system.

## 中文

**Treatment** 是被分配的策略或干预，**control** 是用于比较的条件，**counterfactual** 则追问同一个对象在另一种策略下会经历什么。

推荐日志通常只记录实际曝光的动作或内容，另一种可能结果并没有被观察到。因此，仅比较描述性 KPI，无法自动建立因果关系。

### 基线的证据边界

随机 Feed 是一种基线条件，不能证明真实平台上的因果效果。后续仿真可以用 matched seeds 与明确的假设，比较随机策略和偏好感知策略，但结论仍需要限定在所建模的系统内。
