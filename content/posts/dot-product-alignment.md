---
title: "Dot Products and Content Alignment"
slug: dot-product-alignment
date: 2026-10-07
updated: 2026-10-10
type: glossary
public: true
tags: [AI, Recommendation]
summary: "A simple vector operation connects a user preference model to content attributes."
links: [dirichlet-distribution, recommendation-kpis, social-feed-simulation, stochastic-simulation-map]
---

## English

The dot product of a user preference vector `p` and a content category vector `v` gives a simple alignment score:

```text
alignment = p · v = Σᵢ pᵢvᵢ
```

For a video with one one-hot category, alignment is the user's weight for that category. A multi-label item can distribute `v` across several categories.

### In a random-feed baseline

Alignment can affect mean watch time, like/share probabilities and the quality signal used by a Markov transition. It does not affect which video is selected in a non-personalized baseline.

## 中文

用户 preference vector `p` 与 video category vector `v` 的 dot product 是：

```text
alignment = p dot v = sum_i p_i v_i
```

对 one-hot category video，alignment 就是用户对该 category 的权重。对多标签 video，`v` 可以是多个类别的权重。

### 示例模型

`alignment` 影响 watch-time mean、like/share probability 和 Markov quality；在 no-personalization baseline 中，它不影响 video selection。
