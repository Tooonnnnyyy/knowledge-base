---
title: Consent Is a Product Boundary
date: 2026-09-29
type: principle
tags: [Privacy, AI, Product]
summary: Data access is trustworthy when people can understand what is requested, why it is needed, and how to revoke it.
links: [ai-product-architecture, synthetic-data]
---
# Consent Is a Product Boundary

## English

OAuth is not just a technical handshake. It is a product boundary where a person decides whether an application may access a specific scope of data.

A clear consent experience explains the purpose, limits the scope, avoids surprising aggregation, and makes revocation discoverable. The system should preserve the permission decision as evidence instead of treating it as an invisible implementation detail.

When the product cannot explain what it will do with the data, the correct response is to narrow the request or stop.

## 中文

OAuth 不只是技术握手，它也是一个产品边界：用户决定应用是否可以访问特定范围的数据。

清晰的 consent 体验应该说明用途、限制范围、避免意外的数据聚合，并让撤销权限变得容易找到。系统应保存这个权限决定作为证据，而不是把它藏在实现细节里。

如果产品无法解释会怎样使用数据，正确做法是缩小请求范围或停止。
