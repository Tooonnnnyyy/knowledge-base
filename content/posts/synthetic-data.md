---
title: Synthetic Data Is a Hypothesis, Not Reality
date: 2026-10-04
type: note
tags: [AI, Data, Research]
summary: Synthetic users are useful for testing mechanisms, but external validation still needs real evidence.
links: [monte-carlo-uncertainty, reproducible-simulation]
---
# Synthetic Data Is a Hypothesis, Not Reality

## English

Synthetic data is valuable when the question is about a mechanism: how a system behaves under controlled inputs, how a queue fills, or how a recommendation policy changes exposure. It lets a team repeat an experiment and inspect edge cases without exposing real people.

The boundary is just as important. A synthetic result can show that an implementation behaves consistently under its assumptions. It cannot, by itself, prove that those assumptions describe a real population or that a product improves a real outcome.

The honest workflow is to label what is simulated, preserve the assumptions, and plan the smallest external check that could challenge them.

## 中文

当问题关注机制时，合成数据很有价值：系统如何对受控输入作出反应、队列如何增长、推荐策略如何改变曝光。它让团队可以重复实验并检查边界情况，同时不暴露真实用户。

边界同样重要。合成结果可以说明实现会在给定假设下保持一致，但不能单独证明这些假设代表真实人群，也不能证明产品改善了真实结果。

更诚实的工作流是标记哪些内容是模拟的、保留假设，并设计最小的外部验证去挑战这些假设。
