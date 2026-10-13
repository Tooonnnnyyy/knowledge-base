# Apple HIG collection maintenance / Apple HIG 内容维护

This file is the long-term maintenance record for the Apple UX/UI collection in
the public Knowledge Base. It is deliberately separate from the private source
notes. / 这份文件是 Knowledge Base 中 Apple UX/UI 内容的长期维护记录，和私人原始笔记分开保存。

## Current snapshot / 当前快照

- Collection branch / 内容分支: `review/apple-hig-guide`
- Collection commit / 内容 commit: `ea45a512a9d3b5be0ee4d3d087112e36f327ef14`
- Backup tag / 备份 tag: create and push one new `backup/apple-hig-guide-YYYY-MM-DD` tag after each accepted collection update.
- Live `main` is frozen during review. This collection is not published to the live Pages site until the owner explicitly resumes deployment. / 当前线上 `main` 处于冻结状态；没有明确恢复发布前，本文档不会进入线上版本。

The current collection contains five bilingual articles, one `Product → UX and
UI design` topic, five original SVG study diagrams and links to nine official
Apple design sessions. Three sessions are embedded as user-controlled video
players; Apple-hosted preview images and videos remain external links. / 当前内容包含五篇双语文章、一个 `Product → UX and UI design` 主题、五张原创 SVG 说明图，以及九个 Apple 官方设计课程链接。其中三个课程以可控播放器嵌入；Apple 托管的预览图和视频仍使用外部链接。

## Source boundary / 来源边界

Apple's HIG pages and Apple Developer sessions are the primary sources for the
claims. The seven-step workflow, examples for a connected library, SVG diagrams
and review questions are an independent synthesis. Never present that synthesis
as Apple's internal process. Recheck the official HIG page and its change log
before changing a claim, especially after a platform or design-system update.

Apple HIG 页面和 Apple Developer 课程是事实主来源。七步流程、知识库示例、SVG 图和评审问题是独立整理，不能写成 Apple 内部流程。修改事实前先复核官方 HIG 页面与 change log，尤其是平台或 design system 更新之后。

## Update workflow / 更新流程

1. **Check the source. / 核对来源。** Open the relevant HIG page, official session page and `What's new in design`. Record the checked date in the article when a claim materially changes.
2. **Reuse the structure. / 复用结构。** Keep English complete under `## English`; place an edited Chinese version immediately afterwards under `## 中文` when the source or audience needs it. Keep the existing stable slug.
3. **Choose the taxonomy. / 选择分类。** Reuse `UX and UI design`, `Product` or another existing topic when it fits. Add a topic only when several future notes genuinely need it; define its parent, description and color in `content/topics.json`.
4. **Make real links. / 建立真实连接。** Use a wikilink only when the article explains the relationship. Shared tags group articles but do not justify an article-to-article edge.
5. **Add media safely. / 安全加入媒体。** Keep original explanatory SVGs in `public/media/apple-hig/`. For Apple videos and preview images, prefer the official page or stable Apple-hosted URL; do not copy Apple media into the repository. Every image needs descriptive alt text. Every player needs a caption and an official session link beside it.
6. **Run the gate. / 运行门禁。** From the repository root run `npm test`, `npm run build`, and `npm run test:browser`. For a content-only change, the browser suite still confirms that the graph, article reader, 2D/3D switch, themes and full-page reader remain usable.
7. **Review privacy. / 复核隐私。** Inspect prose, filenames, frontmatter, alt text, image content, captions, URLs and Git author/committer metadata. Exclude private vault exports, raw conversations, local paths, identity details, credentials, private screenshots and unreviewed recordings. The `public: true` field is not encryption.
8. **Commit and backup. / 提交并备份。** Use one focused Conventional Commit. Before pushing an accepted collection update, create an annotated tag such as `backup/apple-hig-guide-2026-10-13` pointing to that commit and push both the review branch and tag. Never force-push.
9. **Verify the release boundary. / 核对发布边界。** While `main` is frozen, push only `review/apple-hig-guide` (or a new review branch). After an explicit unfreeze, open the review diff, merge normally, wait for the matching Pages Actions run, then check the live graph node, article, image and every new media link.

## File map / 文件地图

| Purpose / 用途 | Source of truth / 源文件 |
| --- | --- |
| Principles | `content/posts/apple-human-interface-guidelines.md` |
| Layout | `content/posts/apple-adaptive-layout.md` |
| Workflow | `content/posts/apple-design-workflow.md` |
| Accessible visual design | `content/posts/apple-accessible-visual-design.md` |
| Official resources and learning path | `content/posts/apple-design-resources.md` |
| Topic hierarchy and colors | `content/topics.json` |
| Original diagrams | `public/media/apple-hig/*.svg` |
| Phone-friendly editing | `docs/MAINTENANCE_GUIDE.md` |
| Detailed media and content rules | `docs/CONTENT_WORKFLOW.md` |
| Repository and branch boundary | `docs/REPOSITORIES.md` |

Generated files in `public/data.json`, `public/articles/`, `public/notes/`,
`public/feed.xml` and `public/sitemap.xml` are build output. Edit the Markdown,
topic configuration or source SVG instead of editing generated output by hand.

`public/data.json`、`public/articles/`、`public/notes/`、`public/feed.xml` 和
`public/sitemap.xml` 都是生成结果。应修改 Markdown、topic 配置或源 SVG，不要手动编辑生成文件。

## Refresh cadence / 更新节奏

- **Before each new article:** check the relevant official page and its change log.
- **When Apple updates guidance:** update the affected article's `updated` date, preserve the old claim only when it remains useful, and add a short note explaining the change.
- **Every content batch:** run the full checks and create a dated backup tag.
- **Before live publication:** verify the review branch SHA, the merge SHA, the matching Actions run and the hosted content separately. A local build or pushed branch alone is not a deployment.

- **每篇新文章前：**核对对应官方页面和 change log。
- **Apple 更新指南时：**更新文章的 `updated` 日期；旧说法仍有价值时保留，并简短说明变化。
- **每批内容：**跑完整检查并创建日期 backup tag。
- **正式上线前：**分别核对 review SHA、merge SHA、Actions 和线上内容；本地 build 或推送分支都不等于部署完成。

## Recovery / 回滚

Use the dated backup tag to inspect or restore the collection. Restore a file
through GitHub History or create a normal `git revert`; preserve the shared
history and never force-push. If a 3D interaction regression appears, use the
existing 2D toggle first, then follow `docs/IMMERSIVE_REVIEW.md` for the code
baseline. Content slugs should remain stable so graph positions and links keep
working after an editorial revision.

用日期 backup tag 检查或恢复内容。通过 GitHub History 恢复单个文件，或用普通 `git revert`，保留共享历史，禁止 force-push。若 3D 交互出现回归，先使用现有 2D 切换，再按 `docs/IMMERSIVE_REVIEW.md` 回到代码基线。文章 slug 要保持稳定，以便编辑后图谱位置和连接仍然有效。
