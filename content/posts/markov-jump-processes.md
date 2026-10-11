---
title: "Continuous-Time Markov Jump Processes"
slug: markov-jump-processes
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Simulation]
summary: "A system stays in one state until a sampled event moves it to another."
links: [gillespie-euler, rate-mean-lambda, pure-birth-process, discrete-event-simulation, stochastic-simulation-map]
---

## English

A continuous-time Markov jump process remains in one state until an event occurs and moves it to another. Every possible transition has a propensity or rate. The next event time is typically sampled from an exponential waiting-time distribution using the total rate.

### The minimal example

A Gillespie pure-birth process has one transition:

```text
X → X + 1
total rate = rX
```

This traffic-timing process and a user's Markov state describe different levels of a system. One models when platform traffic events happen; the other models behavioral state.

## 中文

状态在连续时间中保持不变，直到一次 event 发生并跳到新 state。每个可能 transition 有 propensity / rate；下一事件时间通常由 total rate 的 exponential waiting time 产生。

### 示例模型

Gillespie birth process 是最小的 jump-process：`X -> X+1`，total rate 是 `rX`。它与用户 Markov state 是不同层次：前者模拟 platform traffic timing，后者模拟 behavior state。
