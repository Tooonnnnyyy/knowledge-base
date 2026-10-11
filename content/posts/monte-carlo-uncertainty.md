---
title: "Repetition Makes Uncertainty Visible"
slug: monte-carlo-uncertainty
date: 2026-10-07
updated: 2026-10-10
type: concept
public: true
tags: [Data, Simulation]
summary: "Repeated runs separate one plausible trajectory from the distribution of possible outcomes."
links: [reproducible-simulation, probability-expectation-variance, metric-definitions, cdf-pdf-pmf, stochastic-simulation-map, synthetic-users-kpis, model-evaluation, social-feed-simulation]
---

## English

### One trajectory is one sample

A simulation trajectory is a random sample. Answering how a policy performs on average requires independent replications and a summary of their mean, quantiles, standard deviation or interval.

There are different sources of randomness. User-level draws vary each impression's behavior; replication-level draws vary entire system outcomes. An example can compare Euler and Gillespie final-state distributions over 250 traffic replications.

### Experimental discipline

- Record seeds so debugging and reproduction are possible.
- Declare whether a policy comparison uses matched or independent seeds.
- Change one parameter at a time when isolating a mechanism.
- Define the observation window and denominator before computing a KPI.
- Keep uncertainty within a synthetic model separate from confidence about a real platform.

### Read several views of the outcome

A few long sessions can pull up mean watch time. Read the median, P95, completion and churn alongside it. Exposure concentration should accompany engagement so that a policy's apparent gain does not conceal a narrowing of content opportunities.

### Connected ideas

[[reproducible-simulation|Seeds and reproducibility]], [[probability-expectation-variance|expectation and variance]], [[metric-definitions|metric contracts]] and [[cdf-pdf-pmf|distribution functions]] work together to make the result inspectable.

## 中文

### 核心判断

一次 simulation trajectory 只是随机样本。要回答“策略平均表现如何”，需要 independent replications，并报告均值、分位数、标准差或区间。

在示例模型中：

- user-level randomness 产生每次 impression 的行为波动；
- replication-level randomness 产生不同系统运行结果；
- 250 次 traffic replications 用于比较 Euler / Gillespie final-state distribution。

### 实验纪律

- 固定 seed 让调试和复现成为可能；
- 比较两个策略时使用 matched seeds 或预先声明独立 seeds；
- 一次只改变一个参数；
- 先定义 KPI 的 observation window 和 denominator；
- 不把 synthetic KPI 的窄区间写成现实平台置信度。

### 推荐系统场景

`mean watch time` 可能被少数长尾 session 拉高，因此同时看 median、P95、completion 和 churn。Exposure concentration 也应和 engagement 一起看，避免单一 KPI 导致策略把内容集中到少数类别。

### 术语连接

- [[reproducible-simulation|Monte Carlo Random Seed Reproducibility]]：seed、replication 和 reproducibility。
- [[probability-expectation-variance|Probability Expectation Variance]]：均值、期望和 spread。
- [[metric-definitions|Experiment KPI Metric Definition]]：对每次 replication 使用相同 metric contract。
- [[cdf-pdf-pmf|CDF PDF PMF]]：用 empirical distribution 检查结果形状。
