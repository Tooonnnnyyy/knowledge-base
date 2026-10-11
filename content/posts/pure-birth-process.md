---
title: "The Pure-Birth Process"
slug: pure-birth-process
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Simulation]
summary: "A minimal growth process permits arrivals without departures or service completions."
links: [gillespie-euler, queueing-capacity, markov-jump-processes, stochastic-simulation-map]
---

## English

A pure-birth process allows its state to increase, with no deaths or service completions. A minimal example is:

```text
X → X + 1
λ(X) = rX
```

This can serve as a toy model of amplified traffic: more existing requests lead to a higher rate of new requests. It is not a complete queueing model for a platform, because it has no mechanism for completing requests or reducing the state.

## 中文

Pure-birth process 只允许 state 增加，不允许 death / service completion。示例实验：

```text
X -> X + 1
lambda(X) = rX
```

它可以作为 viral traffic 的 toy model：已有 requests 越多，新的 requests 越容易到达。它不是完整的 platform queue。
