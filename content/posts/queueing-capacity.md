---
title: "Capacity Is a Product Decision"
slug: queueing-capacity
date: 2026-10-07
updated: 2026-10-10
type: concept
public: true
tags: [Systems, Engineering, Recommendation]
summary: "Behavioral demand and service capacity interact through latency, waiting and abandonment."
links: [queueing-primitives, pure-birth-process, rate-mean-lambda, discrete-event-simulation, stochastic-simulation-map, gillespie-euler, synthetic-users-kpis, social-feed-simulation]
---

## English

### A feed is also a service system

A recommendation feed is both a behavioral system and a service system. Users request content, metadata and video bytes, and servers handle those arrivals with finite capacity. Arrival rate, service rate, queue length and latency can become platform-level KPIs.

### Begin with the right boundary

A minimal pure-birth experiment implements only:

```text
X → X + 1
λ(X) = rX
```

It exercises event timing and amplification. It does not yet describe a real queue. A next version can add departures:

```text
X → X + 1   arrival
X → X − 1   service completion
```

### Connect capacity to behavior

Content quality or virality can change arrivals. A traffic spike can affect cache misses, latency and dropped requests. Latency may then affect watching and churn. This connects the infrastructure loop to the behavioral loop.

### What the toy model cannot establish

A Gillespie pure-birth trajectory is not a real platform's capacity model. Studying queue performance requires server counts, service-time distributions, capacity limits, routing policies and a warm-up or steady-state design.

[[queueing-primitives|Queueing primitives]], [[pure-birth-process|birth processes]], [[rate-mean-lambda|event rates]] and [[discrete-event-simulation|event-driven simulation]] define the next modeling steps.

## 中文

### 建模连接

Feed recommendation 同时是一个 behavioral system 和 service system：用户请求 content、metadata、video bytes，服务端必须在有限容量下处理 arrivals。`arrival rate`、`service rate`、queue length 和 latency 可以成为平台层 KPI。

最小实验只实现了 pure-birth traffic：

```text
X -> X + 1
lambda(X) = rX
```

它用来练习 event timing 和 viral amplification，不足以表示真实 queue。下一步可以加入 service completions：

```text
X -> X + 1  (arrival)
X -> X - 1  (service completion)
```

### 与 recommendation 的关系

- content quality / virality 改变 arrival rate；
- traffic spike 影响 cache miss、latency 和 dropped requests；
- latency 又可能影响 watch time 和 churn；
- 因此可以把 infrastructure loop 与 behavioral loop 连接起来。

### 不能过度解释

Gillespie 的 pure-birth trajectory 不是 TikTok 的真实容量模型。它只验证一个可控机制。若要研究 queue performance，需要 server count、service-time distribution、capacity limit、routing policy 和 warm-up / steady-state 设计。

### 术语连接

- [[queueing-primitives|Queueing Arrival Service]]：arrival、service、capacity 和 latency。
- [[pure-birth-process|Pure-Birth Process]]：当前只有 arrival/birth，没有 service completion。
- [[rate-mean-lambda|Rate Mean Lambda]]：traffic-dependent arrival rate。
- [[discrete-event-simulation|Discrete-Event Simulation]]：请求事件与服务事件。
