---
title: "Monte Carlo, Random Seeds and Reproducibility"
slug: reproducible-simulation
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Data, Simulation]
summary: "A recorded seed supports repeatability while replications reveal variation."
links: [monte-carlo-uncertainty, probability-expectation-variance, dataset-definition, stochastic-simulation-map]
---

## English

Monte Carlo simulation uses random sampling to approximate a distribution, expectation or system outcome. A random seed fixes a pseudorandom sequence so an experiment can be debugged, reproduced and audited. It does not establish that the model describes reality.

### Repeatable, but still uncertain

An example may begin with `SEED = 42` and use 250 replications with different, reproducible seeds for its feed, Euler and Gillespie experiments. Recording the seed makes inputs traceable; variation across replications is still part of the result.

When comparing policies, decide in advance whether to use matched seeds or independent seeds. Keep that choice visible alongside parameters and metric definitions.

## 中文

Monte Carlo simulation 用随机抽样近似一个 distribution、expectation 或 system outcome。random seed 固定伪随机序列，方便 debug、复现实验和审计；它不会让模型变成现实证据，也不能消除模型中的不确定性。

### 示例模型

`SEED=42` 让 feed、Euler、Gillespie 使用可记录的输入；250 replications 使用不同但可复现的 seed。策略比较应提前决定使用 matched seeds 还是 independent seeds。
