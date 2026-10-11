---
title: "Recommendation Policies and Exposure"
slug: recommendation-policy
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [AI, Recommendation]
summary: "The selection rule and the response to a shown item are different parts of a feed."
links: [exposure-feedback, recommendation-kpis, social-feed-simulation, stochastic-simulation-map]
---

## English

A recommendation policy maps the current context to an item-selection rule. **Exposure** is the content actually shown to a user. A random feed can be a baseline; a popularity-weighted or preference-aware policy can be a later comparison condition.

### Separate selection from response

The baseline samples a video independently of a user's hidden preferences. Preferences can still affect the response after exposure. Separating these mechanisms makes it easier to study a feedback loop when a more adaptive policy is introduced.

## 中文

Recommendation policy 把当前上下文映射为物品选择规则。**Exposure** 是用户实际看到的内容。随机 Feed 可以作为基线，流行度加权或偏好感知策略则可以作为后续比较条件。

### 将选择与反应分开

基线选择视频时不读取用户的潜在偏好，但偏好仍可以影响曝光之后的行为反应。先把这两个机制拆开，后续引入更自适应的策略时，才更容易研究反馈回路。
