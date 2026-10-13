# Cross-project privacy and Wiki sync SOP / 跨项目隐私与 Wiki 同步流程

This is the public, reusable version of the privacy gate used before any
project content is copied into the Knowledge Base. It applies to prose,
filenames, metadata, links, screenshots and media. It does not expose a
private source vault or a conversation transcript.

这是发布到 Knowledge Base 前使用的公开版隐私门禁。它同时适用于正文、文件名、metadata、链接、截图和媒体；不公开私人 vault 或对话原文。

## 1. Ask once at the end of a conversation / 每轮结束只询问一次

Use this reminder:

> 这轮内容需要整理进 Obsidian，并将可公开部分同步到个人 Wiki 吗？

No reply is not consent. / 没有回复不等于同意。

| Approval / 授权 | Allowed / 可做 | Not allowed / 不可做 |
| --- | --- | --- |
| No answer / no | Nothing is archived or published | Do not infer consent |
| Obsidian only / 仅 Obsidian | Organize a private local note and verify its links | Do not push or update the public site |
| Obsidian + public Wiki / 两者 | Distill, deduplicate, redact, link, test and push the reviewed public-safe scope | Do not bundle unrelated UI or other project work |

## 2. Filter before writing / 写入前过滤

Keep a private source and a separate public article. Never copy a vault
wholesale. Remove or keep local-only:

- email, phone, address, identity numbers or combinations that identify a person;
- passwords, tokens, API keys, webhooks, recovery codes and private configuration;
- raw conversations, terminal logs, private project paths and unreviewed exports;
- course or assignment identifiers and private work context;
- recordings, faces, private conversations or account screenshots that were not reviewed.

保留私人 source 和公开 article 两份输出；不要整库复制。敏感内容只留在本地或删除，不能进入公开仓库。

## 3. Shape the public note / 整理公开文章

1. Reuse an existing English slug and topic when the idea already exists.
2. Write the complete English article first.
3. Put an edited Chinese version immediately after it when the source is Chinese.
4. Add only links that describe a real relationship; backlinks are generated.
5. Review front matter, filenames, external URL query strings, alt text and media captions.
6. Check whether the article would be comfortable in a public portfolio.

1. 已有概念优先复用稳定 English slug 和 topic。
2. 完整 English 在前；中文来源在后面紧接整理后的 `## 中文`。
3. 只添加真实关系的连接；系统会生成 backlinks。
4. 检查 front matter、文件名、外链 query、alt text 和媒体说明。
5. 公开前确认内容适合展示在 portfolio 中。

## 4. Verify the repository boundary / 核对仓库边界

The canonical repository is
[`Tooonnnnyyy/knowledge-base`](https://github.com/Tooonnnnyyy/knowledge-base/).
The old `tony-knowledge-garden` repository is historical and is not the
publishing destination. The current live version is frozen during review; save
new approved content on a review branch until deployment is explicitly
resumed. Do not force-push, rewrite public history or manually dispatch Pages
as part of a content sync.

正式仓库是 `Tooonnnnyyy/knowledge-base`；旧仓库只保留历史，不能作为发布目标。线上冻结时，内容先进入 review branch；不能 force-push、改写公开历史或手动触发 Pages。

## 5. Run checks and report evidence / 检查并报告证据

Before calling a change published:

```sh
npm test
npm run build
npm run test:browser
```

Then verify the intended remote commit, the matching Actions run and the live
node/article/media. A local build proves only the local artifact. A pushed
commit proves only the remote ref. Say “published” only after the hosted
workflow and live behavior are checked.

本地 build、远程 commit、Actions 和线上行为分别记录；没有线上证据就只称为 local/review output。

## 6. Report findings safely / 安全报告问题

If an exposure is found, report its category and location without repeating
the sensitive value. Correct local settings when safe. Do not rewrite public
Git history or alter a frozen deployment without explicit direction.

发现暴露时只说明类别和位置，不复述敏感值。安全时可修正本地设置；公开历史和冻结部署需要单独明确指示。

## Related guides / 相关指南

- [Bilingual maintenance guide](MAINTENANCE_GUIDE.md)
- [Content workflow](CONTENT_WORKFLOW.md)
- [Repository and release boundary](REPOSITORIES.md)
