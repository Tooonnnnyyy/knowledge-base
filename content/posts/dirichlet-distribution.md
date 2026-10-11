---
title: "Dirichlet Distributions and Preference Vectors"
slug: dirichlet-distribution
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [Systems, Probability, Recommendation]
summary: "Nonnegative weights that sum to one provide a transparent model of category preferences."
links: [dot-product-alignment, synthetic-users-kpis, input-modeling, stochastic-simulation-map]
---

## English

A Dirichlet distribution generates nonnegative weights that sum to one. This makes it useful for representing a category preference vector:

```text
p_user = [p_tech, p_comedy, p_cooking, p_fashion]
sum(p_user) = 1
```

The concentration parameters `alpha` control the shape. Symmetric parameters treat categories symmetrically; their total concentration controls how concentrated draws are around the mean. Increasing one category's parameter shifts the expected weight toward that category.

### Preference and exposure are separate

In a random-feed baseline, the vector describes latent user preferences, but the feed does not read it when ranking items. Preferences can affect behavioral responses without silently changing the exposure policy.

## 中文

Dirichlet distribution 生成一组非负权重，且总和为 1。它适合表示类别 preference vector：

```text
p_user = [p_tech, p_comedy, p_cooking, p_fashion]
sum(p_user) = 1
```

`alpha` 控制偏好形状：相同的 alpha 让各类别对称，alpha 总量控制样本围绕均值的集中程度；增大某个类别的 alpha，会把期望权重移向该类别。

### 示例模型

Dirichlet 生成 latent user state，但 random feed 不读取它来排序。这使 preference 可以影响行为结果，却不会偷偷改变 exposure policy。
