---
title: "Model Evaluation and Decision Thresholds"
slug: model-evaluation
date: 2026-09-30
updated: 2026-10-10
type: concept
public: true
tags: [Data, Model evaluation]
summary: "Choose metrics and thresholds with class balance, error costs and diagnostic slices in view."
links: [stochastic-simulation-map, dataset-definition, safe-model-release]
---

## English

### Start with the confusion matrix

Accuracy measures overall correctness. Precision asks how often a predicted positive is correct. Recall asks how many actual positives were found. F1 combines precision and recall.

```text
Accuracy  = (TP + TN) / N
Precision = TP / (TP + FP)
Recall    = TP / (TP + FN)
F1        = 2TP / (2TP + FP + FN)
```

Here, `TP`, `TN`, `FP` and `FN` are true positives, true negatives, false positives and false negatives. If a denominator is zero, the reporting convention must be stated.

### Thresholds are decisions

Lowering a decision threshold generally produces more positive predictions. Recall tends to rise; precision may fall as more false positives are included. The exact tradeoff depends on the data. Rare positives or unequal false-negative and false-positive costs make accuracy insufficient on its own.

### Use slices to find the problem

Slices make an overall score diagnosable. A rough prioritization measure is:

```text
weighted gap = (HLP − model accuracy) × data percentage
```

Improvement priority also depends on frequency, business harm and whether the gap can realistically be reduced.

## 中文

先画 confusion matrix，再计算指标。Accuracy 是整体正确率；Precision 回答“模型报 positive 时有多少正确”；Recall 回答“真实 positive 抓到了多少”；F1 平衡 precision 与 recall。

```text
Accuracy = (TP + TN) / N
Precision = TP / (TP + FP)
Recall = TP / (TP + FN)
F1 = 2TP / (2TP + FP + FN)
```

降低 threshold 通常会报出更多 positive：recall 往往上升，precision 可能因为增加 false positives 而下降，具体权衡取决于数据。Rare positive class 或 FN/FP 代价不对称时，不能仅凭 accuracy 判断。

Slice 使整体分数可诊断；weighted gap = (HLP − model accuracy) × data percentage。改善优先级还取决于频率、业务损失和可改进空间。
