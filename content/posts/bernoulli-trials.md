---
title: "Bernoulli Trials and Action Probability"
slug: bernoulli-trials
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Probability]
summary: "A two-outcome trial turns a modeled probability into a sampled action."
links: [uniform-distribution, cdf-pdf-pmf, gillespie-euler, metric-definitions, stochastic-simulation-map]
---

## English

A Bernoulli trial has two outcomes, usually `1` and `0`. The probability of `1` is `p`. One implementation samples `U ~ Uniform(0,1)` and returns `1` when `U < p`.

### In a feed model

Like, share and churn can be noisy Bernoulli-style actions. An Euler-like birth step also uses a one-event coin flip with `p = rate × dt`. A probability must stay between zero and one; this requirement puts a constraint on the time step and event rate.

## 中文

Bernoulli trial 只有两种结果，通常记作 `1` 和 `0`，其中结果为 `1` 的概率是 `p`。一种实现是先抽取 `U ~ Uniform(0,1)`，当 `U < p` 时返回 `1`。

### 在 Feed 模型中

点赞、分享和流失可以建模为带噪声的 Bernoulli 式动作。Euler-like birth step 也用一次事件的“掷硬币”判断，概率为 `p = rate × dt`。概率必须在 0 到 1 之间，因此时间步长与事件率不能任意选择。
