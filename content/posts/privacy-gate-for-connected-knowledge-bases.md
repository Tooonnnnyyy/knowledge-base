---
title: A Privacy Gate for a Connected Knowledge Base
date: 2026-10-13
type: protocol
tags: [Knowledge practice, Engineering, Product]
summary: Separate private source material from public notes with an explicit consent, redaction and verification gate.
links: [release-evidence, ai-product-architecture, ai-product-development, oauth-consent]
public: true
---

## English

A connected knowledge base becomes easier to maintain when publishing is a deliberate gate rather than an automatic copy from a private source. The graph can stay open and useful while the source material remains private.

### Ask before archiving

At the end of a conversation, ask whether this round should be organized in a private knowledge vault and whether its public-safe portion should update the public wiki. No response is consent. Local-only approval permits a structured private note, but it does not permit a repository push or a website update.

Combined approval permits only the relevant, reviewed scope. It does not authorize unrelated interface changes, other projects or pending releases.

### Separate the two outputs

Keep a private source record and a public article as separate artifacts. Distill the useful idea, remove duplicates, distinguish evidence from assumptions, and connect the result to existing topics. Never copy a private vault wholesale.

Before a public commit, review the article text, filename, metadata, links and query strings, image captions, screenshots, audio, video and generated output. Remove identifiers, private context, credentials, raw logs and unreviewed personal media. Automated scanning is a backstop; reading the final public artifact remains necessary.

### Verify the release chain

A local build proves a local artifact. A remote commit proves a remote reference. A green workflow proves that the hosted build completed. Only a check of the live node and article supports the statement that the public site was updated.

When a live version is intentionally frozen, save approved content on a review branch and keep deployment separate. This preserves a reviewable result without changing the known-good public version.

This gate connects [[release-evidence|release evidence]], [[ai-product-architecture|system boundaries]] and [[oauth-consent|explicit consent]] into one repeatable maintenance habit.

## 中文

当公开发布是一道明确的门禁，而不是从私人来源自动复制时，connected knowledge base 会更容易长期维护。图谱可以保持开放和有用，source material 仍然留在私下。

### 归档前先询问

每轮对话结束时，询问本轮内容是否需要整理进私人知识库，以及其中可公开的部分是否同步到公开 wiki。没有回复不等于同意。只同意本地保存时，可以整理私人笔记，但不能 push repository 或更新网站。

完整同意只覆盖本轮相关且经过审查的范围，不包括无关的界面修改、其他项目或待发布分支。

### 分开两种输出

私人 source record 和公开 article 应该是两个独立工件。提炼有用想法、去重、区分 evidence 与 assumption，再把结果连接到已有 topic。不要把私人 vault 整库复制出去。

公开 commit 前检查正文、文件名、metadata、链接与 query、图片说明、截图、音频、视频和生成输出。移除 identifiers、private context、credentials、raw logs 和未经审查的个人媒体。自动扫描只是 backstop；仍然需要阅读最终的公开工件。

### 核对发布链路

本地 build 只能证明本地工件。远程 commit 只能证明远程引用。绿色 workflow 只能证明托管构建完成。只有实际检查线上 node 和 article 后，才可以说公开网站已经更新。

如果线上版本被有意冻结，已批准的内容先保存到 review branch，发布与审查分开。这样可以保留可 review 的结果，同时不改变已知正常的公开版本。

这条门禁把 [[release-evidence|发布证据]]、[[ai-product-architecture|系统边界]] 和 [[oauth-consent|明确授权]] 连接成可重复的维护习惯。
