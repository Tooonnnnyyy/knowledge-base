---
title: "Rate, Mean and Lambda"
slug: rate-mean-lambda
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Probability]
summary: "Keep an event rate, its mean waiting time and one sampled interval distinct."
links: [exponential-distribution, gillespie-euler, queueing-capacity, stochastic-simulation-map]
---

## English

For an exponential distribution:

```text
mean = 1 / λ
```

Keep three quantities distinct:

- **Mean:** the average waiting time or watch time.
- **Lambda, `λ`:** the event rate per unit of time.
- **Tau, `τ`:** one sampled event gap.

In a pure-birth process, `λ(X) = rX` is the total rate associated with the current state. It is not a fixed global average.

## 中文

对于 exponential distribution，`mean = 1/lambda`。

- `mean`：平均等待时间或平均观看时长；
- `lambda`：单位时间事件率；
- `tau`：实际抽到的一次 event gap。

在 pure-birth process 中，`lambda(X) = rX` 是当前 state 相关的 total rate；它不是固定的 global average。
