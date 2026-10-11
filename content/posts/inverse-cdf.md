---
title: "Inverse CDF and the Percent-Point Function"
slug: inverse-cdf
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Probability]
summary: "Transform a uniform random sample into a sample from a target distribution."
links: [cdf-pdf-pmf, uniform-distribution, exponential-distribution, inverse-transform-sampling, stochastic-simulation-map]
---

## English

Inverse transform sampling applies a target distribution's inverse cumulative distribution function to a uniform sample. Many libraries call the inverse CDF the **PPF**, or percent-point function:

```text
U ~ Uniform(0,1)
X = F⁻¹(U) = PPF(U)
```

For an exponential distribution with mean `m`, `X = −m log(1−U)`. For a Gillespie rate `λ`, the waiting time is `τ = −log(U)/λ`.

### Implementation details that matter

- `log1p(-u)` computes `log(1−u)` stably.
- Clipping or resampling protects against a boundary value that would produce infinity.
- `min(watch_time, video_length)` adds a product constraint. It is separate from the inverse CDF itself.

## 中文

Inverse transform sampling 使用目标分布的 inverse CDF。很多 libraries 把 inverse CDF 叫 `PPF`（percent-point function）：

```text
U ~ Uniform(0,1)
X = F^(-1)(U) = PPF(U)
```

对于 exponential mean `m`：`X = -m log(1-U)`。对于 Gillespie rate `lambda`：`tau = -log(U)/lambda`。

### 函数和代码

- `log1p(-u)` 是数值稳定的 `log(1-u)`；
- `clip` 防止 `u` 取到造成无穷的边界；
- `min(watch_time, video_length)` 是业务约束，不是 inverse CDF 本身。
