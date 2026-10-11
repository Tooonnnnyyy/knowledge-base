---
title: "APIs, OAuth and the Boundary of Consent"
slug: oauth-consent
date: 2026-10-07
updated: 2026-10-10
type: concept
public: true
tags: [Data, Product]
summary: "Data access depends on consent, scope and the distinction between aggregate analytics and event logs."
links: [public-data-boundaries, synthetic-data, dataset-definition, stochastic-simulation-map]
---

## English

### Four different boundaries

- An **API** is an interface for reading or writing service resources programmatically.
- **OAuth** lets a person grant an application limited access without handing the application their password.
- **Consent** is informed permission for specific data scopes and purposes.
- **Aggregate data** summarizes activity by day, channel, account or category. It is not a per-user event log.

YouTube Analytics, Instagram Professional Insights, TikTok Research and data-portability services expose different data. Approval, scope, account type and regional eligibility need to be checked for each platform.

### In a simulation study

A real API can be an extension to a synthetic-user experiment. It does not replace a clear model or automatically provide a user's recommendation history. Account-level aggregate analytics and individual exposure histories answer different questions.

## 中文

- API：程序化读取或写入服务资源的接口；
- OAuth：用户把限定 scope 的访问授权给 app，而不把密码交给 app；
- consent：用户对具体 data scope 和用途的知情授权；
- aggregate data：按日、频道、账号或类别汇总后的统计，不等于逐用户 event log。

YouTube Analytics、Instagram Professional Insights、TikTok Research / Data Portability 的数据边界不同；审批、scope、账号类型和地区要求需要逐个平台核实。

### 示例模型

真实 API 是可选 extension；synthetic user simulation 是主实验。不要把 aggregate account analytics 误称为任意用户的 recommendation history。
