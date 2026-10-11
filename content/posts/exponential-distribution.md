---
title: "Exponential Distributions and Waiting Times"
slug: exponential-distribution
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Probability]
summary: "A memoryless waiting-time model is useful when its assumptions fit the question."
links: [cdf-pdf-pmf, inverse-cdf, rate-mean-lambda, inverse-transform-sampling, stochastic-simulation-map]
---

## English

Using a mean waiting time `m`, the exponential distribution is:

```text
CDF:  F(x) = 1 − exp(−x/m), x ≥ 0
PDF:  f(x) = (1/m) exp(−x/m)
Rate: λ = 1/m
```

It is often used for memoryless waiting times. Real watch times need not follow an exponential law; the distribution is a transparent, controllable baseline assumption. Capping samples at the video length also changes the observed distribution.

### Two uses of the same law

- Watch-time sampling: `watch_time = −m log(1−U)`.
- Gillespie event gaps: `τ = −log(U)/λ`.
- A long right tail means even a low-alignment item can occasionally produce a long viewing sample.

## 中文

若使用 mean `m`：

```text
CDF: F(x) = 1 - exp(-x/m), x >= 0
PDF: f(x) = (1/m) exp(-x/m)
rate: lambda = 1/m
```

它常用于 memoryless waiting time。真实观看时长不一定服从 exponential；这里是透明、可控的 baseline。视频长度 cap 会截断样本。

### 示例模型

- `watch_time = -m log(1-U)`；
- Gillespie 的 `tau = -log(U)/lambda`；
- 长尾意味着低 alignment 内容也可能偶尔有长观看。
