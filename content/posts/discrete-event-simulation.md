---
title: "Discrete-Event Simulation"
slug: discrete-event-simulation
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Simulation]
summary: "Advance a simulation when an event changes its state, skipping uneventful time."
links: [gillespie-euler, markov-jump-processes, queueing-primitives, stochastic-simulation-map]
---

## English

Discrete-event simulation, or **DES**, updates a system when an event occurs: an arrival, a birth, a service completion or a session ending. It can skip intervals in which nothing changes.

A fixed-step Euler-like method checks the system on regular clock ticks. The Gillespie direct method is event-driven and exact for the specified continuous-time jump process.

### Keep mechanisms distinct

Feed impressions, churn and viral traffic can all be represented as events. A useful example keeps the user feed loop and the traffic process separate, so behavior and capacity are not accidentally treated as the same mechanism.

## 中文

DES 只在事件发生时更新 system state，例如 arrival、birth、service completion、session churn；事件之间可以跳过没有变化的时间。

Euler-like 方法按固定 clock tick 检查；Gillespie 是 event-driven 的 exact direct method for the specified process。

### 示例模型

Feed impression、churn 和 viral traffic 都可以表示成 events，但示例模型把 user feed loop 与 traffic process 分开，避免把行为机制和容量机制混为一谈。
