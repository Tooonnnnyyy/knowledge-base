---
title: "Markov Chains and Transition Matrices"
slug: markov-chains
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Probability]
summary: "Transition probabilities make an explicit model of how a state changes."
links: [markov-states, markov-jump-processes, synthetic-users-kpis, stochastic-simulation-map]
---

## English

A discrete Markov chain describes states and the probabilities of moving between them:

```text
P(S[t+1] | S[t], S[t−1], …) = P(S[t+1] | S[t])
```

Each row of the transition matrix gives the probabilities of the next states, conditional on the current state. Every row must sum to one.

### In a session model

States such as **engaged**, **neutral** and **dissatisfied** provide a controllable approximation of session memory. A content-quality signal can adjust the transition row. The choice of states and transition rules remains a modeling assumption.

## 中文

离散 Markov chain 用 state 和 transition probability 描述：

```text
P(S[t+1] | S[t], S[t-1], ...) = P(S[t+1] | S[t])
```

transition matrix 的每一行是当前 state 下到各 next state 的概率，行和为 1。

### 示例模型

state 是 engaged、neutral、dissatisfied；quality 对 transition row 做调整。它是用户 session memory 的可控近似。
