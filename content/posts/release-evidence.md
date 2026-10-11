---
title: A Commit Is One Link in the Release Evidence
date: 2026-10-10
type: protocol
tags: [Engineering, Product]
summary: Match the source commit, remote repository, deployment and observed user behavior before claiming a release is complete.
links: [ai-product-development, ai-product-architecture, agent-change-bundles, safe-model-release, browser-stack-research]
public: true
---

## English

A terminal record can prove that a Git command ran and that a remote accepted a push. It cannot, by itself, prove that a site deployed, a database migrated or a user flow worked. Release evidence is a chain of related checks.

### Name the artifact at each step

| Step | Evidence to record | What remains to verify |
| --- | --- | --- |
| Working tree | Repository root, branch and changed files | Whether the intended change is complete |
| Commit | Commit identifier and reviewed diff | Whether that commit reached the remote |
| Remote | Repository, branch and remote commit | Whether hosting built this version |
| Deployment | Build result and deployed artifact/version | Whether live routing and configuration work |
| User flow | Observed behavior against acceptance criteria | Other flows and untested environments |

A directory with a familiar name may be an old checkout. A live page may be serving a cached or earlier build. The source commit, repository, deployment project and release artifact need an explicit correspondence.

### A small Git inspection routine

```bash
pwd
git rev-parse --show-toplevel
git status --short --branch
git remote -v
git diff --check
```

Use this information before staging or pulling. Stage intended files deliberately. If a push is rejected because the remote has advanced, fetch and inspect the divergence, then choose a merge or rebase that preserves the work. A force push is not a substitute for understanding the history.

### State evidence precisely

“Built locally” describes a local artifact. “Pushed successfully” describes a remote update. “Deployment succeeded” describes a hosting result. “Verified live” should name the actual behavior checked in the deployed environment.

This precision is useful during handoff because the next person can see what is established and what still needs checking. Keep the evidence concise and sanitized: commit identifiers and public deployment references can be useful, while credentials, recovery codes and private configuration do not belong in a release record.

## 中文

Terminal 记录可以证明 Git 命令执行过，以及远程接受过一次 push。但它本身不能证明网站部署完成、数据库 migration 成功，或用户流程可用。发布证据是由多个相关检查组成的链路。

### 每一步对应具体工件

| 步骤 | 应记录的证据 | 仍需验证什么 |
| --- | --- | --- |
| Working tree | 仓库根目录、branch 和改动文件 | 目标修改是否完整 |
| Commit | Commit 标识和已审阅 diff | 该 commit 是否到达远程 |
| Remote | 仓库、branch 和远程 commit | Hosting 是否构建了这个版本 |
| Deployment | Build 结果和部署工件/版本 | 线上 routing 与配置是否工作 |
| 用户流程 | 按验收条件观察到的行为 | 其他流程和未测试环境 |

名字熟悉的目录可能是旧 checkout，线上页面可能仍在提供缓存或较早版本。Source commit、repository、deployment project 和 release artifact，需要建立明确对应关系。

### 一个小型 Git 检查流程

```bash
pwd
git rev-parse --show-toplevel
git status --short --branch
git remote -v
git diff --check
```

Stage 或 pull 之前先看这些信息，有意识地选择要提交的文件。如果远程领先导致 push 被拒绝，先 fetch 并理解分叉，再选择能保留工作的 merge 或 rebase。Force push 不能代替对历史的理解。

### 准确描述证据

“本地 build 通过”描述本地工件；“push 成功”描述远程更新；“deployment 成功”描述 hosting 结果；“线上已验证”则应该说明在部署环境中实际检查了什么行为。

这种准确性有助于交接，让后续人员知道哪些事实已经成立，哪些仍需核验。证据应简洁且脱敏：commit 标识和公开部署引用可能有用，credential、recovery code 和私人配置不属于发布记录。
