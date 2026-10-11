---
title: "Bandits, Exploration and Exploitation"
slug: multi-armed-bandits
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [AI, Recommendation]
summary: "Learning about uncertain actions competes with choosing the actions that already look promising."
links: [recommendation-policy, exposure-feedback, recommendation-kpis, synthetic-data, stochastic-simulation-map]
---

## English

A multi-armed bandit treats each action or item as an arm with an uncertain reward. **Exploration** gathers information about under-tested arms; **exploitation** selects arms already believed to perform well. Thompson sampling and UCB are common policies.

### A proposed extension

A random non-personalized feed does not implement a bandit. A bandit can be a later treatment, using watch time or a bounded engagement reward. Its selections would create exposure feedback, so evaluating it requires care about both reward and what remains unseen.

## 中文

Multi-armed bandit 把每个动作或物品看作一个奖励尚不确定的“臂”。**Exploration** 收集尚未充分测试的选项的信息；**exploitation** 选择目前被认为表现更好的选项。Thompson sampling 和 UCB 是常见策略。

### 一种待扩展方向

随机、非个性化的 Feed 并没有实现 bandit。后续可以用 watch time 或有界 engagement reward，把 bandit 作为另一种实验条件。但它的选择会制造曝光反馈，因此评估时需要同时考虑奖励和未被观察到的内容。
