---
title: A Small Architecture for AI Products
date: 2026-10-05
type: architecture
tags: [AI, Product, Engineering]
summary: A durable AI product needs a source of truth, explicit boundaries, evaluation, and a human decision loop.
links: [critical-thinking, human-value-in-agent-era, oauth-consent]
---
# A Small Architecture for AI Products

## English

A useful AI product architecture can be described as a loop: input, evidence, model or rule, human decision, output, and evaluation. Each boundary should be visible enough that a person can explain what happened and recover from a bad result.

The source of truth should be explicit. Data needs a defined shape, permissions need a clear owner, and generated output needs a status that distinguishes a draft from an approved action. Observability belongs in the first design rather than after the first incident.

This structure is intentionally small. It gives a prototype a path toward a product without hiding uncertainty behind a chat interface.

## 中文

一个实用的 AI 产品架构可以看成一个循环：输入、证据、模型或规则、人工决策、输出和评估。每个边界都应该足够清楚，让人能够解释发生了什么，并在结果错误时恢复。

系统必须有明确的 source of truth。数据要有定义，权限要有负责人，生成结果要区分草稿和已批准动作。可观测性应该从第一版设计开始，而不是等事故发生后再补。

这个结构刻意保持小而清晰，让原型可以走向产品，同时不把不确定性藏在聊天界面后面。
