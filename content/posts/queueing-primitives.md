---
title: "Arrival, Service and Queueing Capacity"
slug: queueing-primitives
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Engineering]
summary: "A service model needs both incoming work and a mechanism for completing it."
links: [queueing-capacity, pure-birth-process, rate-mean-lambda, stochastic-simulation-map]
---

## English

A service system usually needs five descriptions:

- **Arrival rate:** how quickly requests arrive.
- **Service rate:** how quickly servers complete requests.
- **Queue length:** the amount of work waiting.
- **Capacity or server count:** how much work can be processed concurrently.
- **Latency:** the time from arrival to completion.

A pure-birth baseline models only arrivals or births. Without service completion, it cannot directly produce meaningful latency or dropped-request KPIs.

### The next modeling step

Add a service event `X → X−1`, multiple servers, a service-time distribution and a capacity limit before studying queue performance.

## 中文

service system 通常需要描述：

- arrival rate：请求到达速度；
- service rate：服务器完成请求的速度；
- queue length：等待中的请求；
- capacity / server count：可并行处理能力；
- latency：从请求到完成的时间。

当前 pure-birth baseline 只有 arrival / birth，没有 service completion，所以不能直接推出 latency 或 dropped-request KPI。

### 下一步扩展

加入 `X -> X-1` 的 service event、多个 servers、service-time distribution 和 capacity limit，才可以研究 queue performance。
