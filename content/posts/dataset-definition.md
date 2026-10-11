---
title: "Define the Dataset Before Training"
slug: dataset-definition
date: 2026-09-30
updated: 2026-10-10
type: concept
public: true
tags: [Data, Model evaluation]
summary: "Prediction units, labels, splits and transformation lineage determine what a model learns."
links: [stochastic-simulation-map, model-evaluation, safe-model-release]
---

## English

### Define the prediction problem

Before training, specify the **prediction unit**, input `x`, target `y`, label rules and metadata. When annotators disagree, a majority vote is not an automatic solution. First check whether the target is ambiguous, the input lacks necessary information or the case itself is uncertain.

### Human performance and traceability

Human-level performance, or **HLP**, is useful only when a person can reasonably infer the same target from the same input. It can help estimate room for improvement. It does not prove production safety or business value.

A reproducible pipeline preserves sources, validation, deterministic preprocessing, label versions, metadata and transformation lineage.

### Split the evidence correctly

Training data fits the model. Development data selects the approach. Test data defines the final evidence boundary. Related examples crossing splits create leakage—for example, nearly identical photos of the same phone appearing in both training and test data.

## 中文

在训练前定义 prediction unit、input x、target y、label rule 和 metadata。标签分歧不是自动多数投票的理由：应判断是 y 模糊、x 不足，还是案例本身确实不确定。

HLP 只在 human 可根据同一 x 合理判断 y 时有用；它能估计 improvement room，不能证明生产安全或商业效果。可复现 pipeline 必须保留 source、validation、deterministic preprocessing、label version、metadata 与 transformation lineage。

Train 用于拟合，dev 用于选择方案，test 是最终证据边界。相关样本跨 split 会造成 leakage，例如同一部手机的近似照片同时进入 train/test。
