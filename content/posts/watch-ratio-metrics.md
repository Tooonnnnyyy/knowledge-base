---
title: "Watch Ratio, Completion and Skip"
slug: watch-ratio-metrics
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Product, Recommendation]
summary: "Thresholds turn watch time into labels, so their definitions must remain visible."
links: [metric-definitions, exponential-distribution, input-modeling, stochastic-simulation-map]
---

## English

`watch_ratio = watch_time / video_length` normalizes watching time across videos of different lengths. Completion and skip are thresholded event labels. Their thresholds are modeling choices, not universal facts.

### Example thresholds

```text
completion: watch_ratio ≥ 0.90
skip:       watch_time < 3.0 seconds
```

These labels can feed like/share probabilities, state transitions and churn. Their definitions must therefore stay visible when comparing outcomes or changing a model.

## 中文

`watch_ratio = watch_time / video_length` 用视频长度对观看时长做归一化。Completion 和 skip 是通过阈值生成的事件标签，阈值是建模选择，不是普遍事实。

### 示例阈值

```text
completion: watch_ratio ≥ 0.90
skip:       watch_time < 3.0 seconds
```

这些标签可以进入点赞/分享概率、状态转移和流失规则，因此比较结果或修改模型时，必须保留清楚的定义。
