---
title: "State Is a Compact Memory"
slug: markov-states
date: 2026-10-07
updated: 2026-10-10
type: concept
public: true
tags: [Systems, Simulation, Recommendation]
summary: "A state model compresses session history into information used by the next transition."
links: [markov-chains, random-variables, dot-product-alignment, metric-definitions, stochastic-simulation-map, synthetic-users-kpis, social-feed-simulation, inverse-transform-sampling]
---

## English

### Compressing a session into state

A user session can be approximated with discrete states such as **engaged**, **neutral** and **dissatisfied**. The next state depends on the current state and the current content quality:

```text
P(S[t+1] | S[t], S[t−1], …) ≈ P(S[t+1] | S[t], quality[t])
```

This does not claim that people have only three mental states. It compresses unobserved attention or satisfaction into a latent state that can be simulated.

### In a feed experiment

Watch ratio and content alignment combine into a quality signal. A transition row samples the next state, and dissatisfaction increases churn probability. The session becomes path-dependent: an earlier experience affects what happens next.

### Diagnosing the model

If nearly every user quickly accumulates in one state, the transition matrix or quality scale may have lost its ability to distinguish experiences. Inspect state occupancy, transition counts and preference slices alongside final churn.

### Connected ideas

- [[markov-chains|Transition matrices]] define conditional next-state probabilities.
- [[random-variables|Random variables]] include discrete behavioral states.
- [[dot-product-alignment|Content alignment]] can enter the quality signal.
- [[metric-definitions|Metric definitions]] make occupancy and churn measurable.

## 中文

### 建模作用

将用户 session 简化为离散状态，例如 `engaged`、`neutral`、`dissatisfied`。下一状态只依赖当前状态和本次 content quality，形成一阶 Markov approximation：

```text
P(S[t+1] | S[t], S[t-1], ...) ≈ P(S[t+1] | S[t], quality[t])
```

这不是说真实人类只有三个状态，而是把无法直接观测的 attention / satisfaction 压缩为可以模拟的 latent state。

### 在 Feed 实验中

- watch ratio 与 alignment 合成为 quality；
- transition row 产生下一状态；
- dissatisfied 状态提高 churn probability；
- session 因此会出现 path dependence：前一次体验会影响后续表现。

### 诊断问题

如果状态分布很快全部吸收到一个 state，说明 transition matrix 或 quality scale 可能失去区分度。应查看 state occupancy、transition counts 和不同 preference slices，而不只看最终 churn。

### 术语连接

- [[markov-chains|Markov Chain Transition Matrix]]：每一行是 conditional transition probabilities。
- [[random-variables|随机变量 Random Variable]]：state 是离散随机变量。
- [[dot-product-alignment|Dot Product Alignment]]：质量分数进入 transition row。
- [[metric-definitions|Experiment KPI Metric Definition]]：state occupancy 与 churn 是输出指标。
