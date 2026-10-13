# Knowledge Base maintenance guide

这是以后维护 Knowledge Base 的**唯一快速入口**。/ This is the shortest repeatable workflow for adding and maintaining the Knowledge Base.

## 0. The rule / 总规则

**Write one public-safe note → connect it to an existing topic → commit to `main` → wait for Actions → check the live node.**

**写一篇已检查隐私的文章 → 选择已有 topic → commit 到 `main` → 等 Actions 完成 → 检查线上节点。**

The site updates from GitHub commits. It does not read your private Obsidian vault automatically. Keep private drafts and raw source material outside this public repository.

网站由 GitHub commit 更新，不会自动读取你的私人 Obsidian vault。私人草稿和原始资料留在仓库之外。

## 1. Quick capture / 快速记录（推荐，约 3–5 分钟）

Reading themes / 阅读主题：each visit or page reload shows a small arrow pointing to the bottom-right theme button. Click it to cycle **Dark → Light → Paper**. Close the hint with × or Escape; your chosen theme is remembered, but the hint returns next visit. / 每次进入或刷新，箭头提示右下角主题按钮；点击依次切换深色、浅色、纸质。× 或 Escape 关闭提示。主题选择会保留，下次访问仍会出现说明。

Use this for one thought, a study observation or a short daily record. 适合一个想法、学习记录或短篇日常思考。

1. Open GitHub → `content/posts/` → **Add file → Create new file**. 在 GitHub 打开 `content/posts/`，点击 **Add file → Create new file**。
2. Name the file in stable English kebab case, for example `a-question-about-agents.md`. 文件名使用稳定的英文 kebab-case。
3. Copy [`content/new-note.template`](../content/new-note.template), then replace the title, date, summary, tags and body. 复制模板，替换标题、日期、摘要、标签和正文。
4. Keep `## English` first. If the source is Chinese, put the edited Chinese version immediately after the complete English article under `## 中文`. English-only sources do not need that section. `## English` 必须在前；中文来源在完整英文后紧接整理后的 `## 中文`，纯英文来源无需中文段落。
5. Choose an existing tag from [`content/topics.json`](../content/topics.json). Prefer one or two meaningful tags; do not create a new topic for one note. 优先选已有 topic，通常一到两个即可；不要为一篇文章随意新建 topic。
6. Before commit, ask: **Would I be comfortable seeing this in a public portfolio?** If no, remove it or keep it private. commit 前问自己：这段内容公开展示是否舒服？如果不是，删除或留在私下。
7. Click **Commit changes** directly to `main`. 直接 commit 到 `main`。

Minimal example / 最小示例（replace the date with your publication date / 日期换成实际发布日期）：

~~~yaml
---
title: One clear idea
date: 2026-10-12
type: note
public: true
tags: [Thinking]
summary: What this note helps a reader understand.
links: []
---

## English

Write the idea and one concrete example.
~~~

## 2. Connect notes / 建立连接

Use a link only when the article explains a real relationship. 只有文章确实解释了关系时才添加连接。

~~~md
This extends [[model-evaluation|model evaluation]] and contrasts with
[[synthetic-data|synthetic data]].
~~~

The target must be an existing article slug. The build creates the backlink automatically. Shared tags group notes under a topic; they do not invent a direct article-to-article line.

目标必须是已存在的文章 slug。系统会自动生成 backlink。共同 tag 只表示 topic 归属，不会凭空生成文章之间的直接连线。

## 3. Images, audio and video / 图片、音频和视频

Upload a small image to `public/media/` using **Add file → Upload files**. Use an English filename and an accessible caption. 小图片上传到 `public/media/`，文件名使用英文，并写清楚 alt caption：

~~~md
![A short description](https://tooonnnnyyy.github.io/knowledge-base/media/example.jpg)
~~~

For audio or video, use a direct public HTTPS file URL. No sign-in, credentials, autoplay or raw HTML/iframe. 音视频使用公开 HTTPS 直链，不放 token，不自动播放，不使用 raw HTML/iframe：

~~~~md
```video
https://media.example.com/demo.mp4
A short caption
```
~~~~

`audio` works the same way. Supported video: `.mp4`, `.webm`, `.ogg`. Supported audio: `.mp3`, `.m4a`, `.wav`, `.ogg`. 媒体下面最好加 transcript / 文字说明。

Never upload personal recordings, faces, private conversations or account screenshots without reviewing them first. 上传前检查是否包含个人录音、脸部、私人对话或账号截图。

## 4. Topics and colors / 主题与颜色

First reuse a topic. Add one only when several future notes will use it. Put its `parent`, `description` and `color` in `content/topics.json`. 优先复用已有 topic，只有未来会有多篇文章使用时才新增，并写入 `parent`、`description` 和 `color`。

~~~json
{
  "id": "New topic",
  "label": "New topic",
  "parent": "Thinking",
  "color": "#9c81ad",
  "description": "A short public explanation."
}
~~~

Use a related shade for a child topic. Do not change node positions or graph code by hand; the build recalculates the graph and preserves saved positions. 子 topic 使用父主题的相近色；不要手动改 graph code 或节点位置。

## 5. Publish and check / 发布与检查

After **Commit changes** / 提交之后：

1. Open **Actions** and wait for `build` and `deploy` to turn green. 两个任务都变绿再认为发布成功。
2. Open <https://tooonnnnyyy.github.io/knowledge-base/>. 打开线上地址。
3. Search the new title, click its node, inspect links and media. 搜索标题，点击节点，检查连接和媒体。
4. If the page is stale, wait a few minutes and hard-refresh. If Actions is red, open its log before another commit. 页面旧时等待并强制刷新；Actions 失败先看日志。

Expected pipeline / 自动流程：

~~~text
Markdown + topics.json → privacy/content validation → graph + backlinks + article pages → browser checks → GitHub Pages
~~~

## 6. Fix or rollback / 修改与回撤

- Typo: edit the same `.md` file and commit again. 保持文件名和 slug 不变。
- Wrong content: use the file's **History**, restore known-good text, and commit. 内容错误时从 History 复制正确版本再提交。
- 3D feels wrong: click the graph's cube/plane icon to use 2D immediately. 觉得 3D 不合适时，点击 cube/plane icon 立即切回 2D。
- Full code recovery: follow [`IMMERSIVE_REVIEW.md`](IMMERSIVE_REVIEW.md), which records `baseline-2d-e314dca`. 完整回撤步骤见该文档。

Do not force-push or hand-edit generated `dist/`, `public/data.json`, `public/articles/` or `public/notes/`.

## 7. Simple workflow evaluation / 流程评估

This is a walkthrough estimate, not a timed usability study. The 3–5 minute estimate assumes a short draft is already written and excludes translation, media hosting and deployment waiting. / 以下为流程推演，不是实测；3–5 分钟只针对已写好的短文，翻译、媒体托管和部署等待另计。

| Task | Steps | Maintenance load |
| --- | ---: | --- |
| Short thought | 7 | Low / 低 |
| Long bilingual article | 7 + writing | Medium / 中 |
| Add image | 1 upload + 1 Markdown line | Low / 低 |
| Add audio/video | 1 public URL block after hosting | Low with an existing URL; medium if uploading first / 已有直链低，否则中 |
| New category | 1 topic config entry | Medium / 中 |
| Roll back a typo | History → edit → commit | Low / 低 |

The deliberate tradeoff is one manual privacy check before every commit. It keeps the public site safe without a database, CMS, Obsidian sync or separate admin panel.

每次 commit 前保留一次人工隐私检查。这比维护数据库、CMS、Obsidian 同步服务或独立后台更简单，也更适合长期运行。

## One-screen checklist / 一屏检查清单

~~~text
[ ] Public-safe? / 没有隐私？
[ ] English first? / English 在前？
[ ] Existing topic? / 复用已有 topic？
[ ] Real links only? / 只加真实连接？
[ ] Media public and stable? / 媒体公开且稳定？
[ ] Commit to main / 提交 main
[ ] Actions green / Actions 变绿
[ ] Check node on Pages / 在线点开节点
~~~

## GitHub access problems / GitHub 连接异常

Follow the [two-minute GitHub connection SOP](GITHUB_ACCESS_SOP.md): network → identity → repository permission → push. Reuse the saved login; do not repeatedly sign in or assume an expired token when the network is blocked.

连接异常按 SOP 两分钟定位：网络 → 身份 → 仓库权限 → 推送。复用已有认证；同样的错误不反复尝试，网络失败不等于 token 过期。日常 GitHub 网页写作仍按上面的短流程。

For the longer explanation, see [`CONTENT_WORKFLOW.md`](CONTENT_WORKFLOW.md). 如需完整说明，继续阅读 `CONTENT_WORKFLOW.md`。
