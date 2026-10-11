---
title: What Data Can a Recommendation Study Actually Use?
date: 2026-10-07
type: question
tags: [Data, Recommendation, Model evaluation]
summary: Separate account analytics, consented exports and research datasets before designing an experiment around platform data.
links: [oauth-consent, social-feed-simulation, synthetic-users-kpis, dataset-definition, causal-comparisons, synthetic-data, collaborative-filtering]
public: true
---

## English

“Real platform data” can refer to very different things. Account-level analytics, a consented personal export and a research dataset have different units, permissions and missing information. The experiment should be designed around the data that can actually be obtained.

### Three useful categories

| Category | What it may contain | Access boundary |
| --- | --- | --- |
| Analytics for an authorized account | Historical aggregate reports | Account ownership, OAuth and applicable permissions |
| A user-authorized export | Data included in a portability or export program | Consent, scopes and any provider approval |
| Public research or historical datasets | Ratings, reviews or approved research fields | Dataset terms, eligibility and permitted uses |

Program names such as YouTube Analytics, Instagram Insights or TikTok Research/Data Portability describe possible routes. Their current eligibility, fields and permissions must be checked in the provider documentation before relying on them.

### What should not be assumed

A platform API does not imply access to any ordinary user's personalized feed. Internal ranking features, full watch histories, negative-feedback logs and identifiable cross-platform preference profiles may be unavailable. A public page also does not by itself establish permission for unrestricted collection or reuse.

### Choose a dependable experiment base

A synthetic simulation provides control over the mechanism. MovieLens can provide historical rating preferences; a suitable Amazon review or ratings subset can provide another item-preference setting. These datasets describe their own collection processes and domains. They should not be relabeled as social-feed exposure logs.

Treat platform access that requires review or account eligibility as an extension until access is confirmed. A project can remain useful while that extension is pending if its main research question and baseline data are independently workable.

### Aggregate outcomes are not causal evidence by themselves

An analytics report can describe changes in an account's outcomes. It usually cannot alone establish that a recommendation algorithm changed individual preferences. A causal claim needs a stated treatment, control, observation window, confounder strategy and appropriate consent. Use descriptive or simulation language when the design supports only those conclusions.

### Documentation and datasets

- [YouTube authentication](https://developers.google.com/youtube/v3/guides/authentication) and [Analytics reports](https://developers.google.com/youtube/analytics/reference/reports/query)
- [TikTok Research API](https://developers.tiktok.com/docs/en/research-api-get-started) and [Data Portability](https://developers.tiktok.com/doc/data-portability-api-get-started/)
- [Instagram API](https://developers.facebook.com/docs/instagram-api/) and [Insights](https://developers.facebook.com/docs/instagram-api/reference/ig-user/insights/)
- [MovieLens datasets](https://grouplens.org/datasets/movielens/)
- [Amazon Review Data](https://cseweb.ucsd.edu/~jmcauley/datasets/amazon_v2/)

These are research starting points, not a claim that access has been granted or current provider requirements have been verified here.

## 中文

“真实平台数据”可能指完全不同的东西。账号聚合 analytics、用户授权的个人导出、公共研究数据集，它们的单位、权限和缺失信息都不同。实验应该建立在实际能够获得的数据上。

### 三类有用的数据

| 类别 | 可能包含什么 | 获取边界 |
| --- | --- | --- |
| 已授权账号的 analytics | 历史聚合报告 | 账号所有权、OAuth 和相应权限 |
| 用户授权的数据导出 | Portability 或 export 项目包含的数据 | Consent、scopes 以及可能的服务方审批 |
| 公共研究或历史数据集 | Ratings、reviews 或获批研究字段 | 数据集条款、资格和允许用途 |

YouTube Analytics、Instagram Insights、TikTok Research/Data Portability 等名称代表可能的路线。真正依赖这些路线前，必须查看服务方文档，确认当前资格、字段和权限。

### 不能默认获得什么

存在平台 API，不代表能获得任意普通用户的个性化 feed。内部 ranking features、完整 watch history、negative-feedback logs，以及可识别个人的跨平台 preference profile，可能并不可得。页面公开也不自动意味着可以无限制收集和复用。

### 选择稳定的实验基础

Synthetic simulation 便于控制机制。MovieLens 可以提供历史评分偏好；合适的 Amazon review 或 ratings 子集可以提供另一个 item-preference 场景。但这些数据集有自己的采集过程和领域，不能被重新命名为社交 feed exposure logs。

需要审批或特定账号资格的平台接入，在确认之前应作为扩展。只要主问题和 baseline 数据独立成立，等待扩展权限时项目依然可以产生有用结果。

### 聚合结果本身不构成因果证据

Analytics 报告可以描述账号结果的变化，但通常不能单独证明推荐算法改变了个人偏好。因果判断需要明确 treatment、control、observation window、confounder 策略和适当 consent。如果设计只支持描述或仿真，就使用 descriptive 或 simulation language。

### 文档与数据集

- [YouTube authentication](https://developers.google.com/youtube/v3/guides/authentication) 与 [Analytics reports](https://developers.google.com/youtube/analytics/reference/reports/query)
- [TikTok Research API](https://developers.tiktok.com/docs/en/research-api-get-started) 与 [Data Portability](https://developers.tiktok.com/doc/data-portability-api-get-started/)
- [Instagram API](https://developers.facebook.com/docs/instagram-api/) 与 [Insights](https://developers.facebook.com/docs/instagram-api/reference/ig-user/insights/)
- [MovieLens datasets](https://grouplens.org/datasets/movielens/)
- [Amazon Review Data](https://cseweb.ucsd.edu/~jmcauley/datasets/amazon_v2/)

这些链接是研究入口，不表示已经获得权限，也不表示本文实时核验了服务方当前要求。
