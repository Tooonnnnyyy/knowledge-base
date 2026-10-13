# Repository map / 仓库与发布边界

## One canonical repository / 唯一正式仓库

**All current and future Knowledge Base work belongs in
[Tooonnnnyyy/knowledge-base](https://github.com/Tooonnnnyyy/knowledge-base).**

全部 Knowledge Base 代码、文章、维护指南与后续 review 分支统一放在此仓库。

| Role / 用途 | Repository or branch / 仓库或分支 | Status / 状态 |
| --- | --- | --- |
| Current public site / 当前线上 | `knowledge-base:main` | Frozen at `6170201`; [website](https://tooonnnnyyy.github.io/knowledge-base/) / 当前版本冻结 |
| New button review / 按钮预览 | `knowledge-base:review/navigation-cta` | Portfolio CTA and recognizable LinkedIn button; not deployed / 只供 review，未上线 |
| Original 3D work / 已发布 3D 工作 | `knowledge-base:feat/immersive-graph` | Included in `main` / 已包含在主分支 |
| Original 2D recovery / 2D 回撤 | `knowledge-base:baseline-2d-e314dca` | Recovery tag retained / 保留 tag |
| Old prototype / 已弃用旧原型 | [tony-knowledge-garden](https://github.com/Tooonnnnyyy/tony-knowledge-garden) | Not used for this website; preserved history / 本站不再使用，保留历史 |

## Integration evidence / 整合依据

Checked on 2026-10-12 (local date): the old repository's only commit is
`d8256de`, which is already an ancestor of current `main`. All 11 old article
paths are present among the current 63 posts. There is no missing legacy
commit or article to merge.

旧仓库唯一 commit 已完整包含在正式仓库历史中，旧版 11 篇文章路径全部保留。
不需要把旧代码再次覆盖到新版本。

The only old-only files are generated `public/data.json` and the obsolete
`scripts/build_content.py`. The current Node content builder replaces them;
the original versions remain recoverable from Git history. The old repository
and its old Pages URL have not been deleted, redirected, or archived remotely.

旧仓库独有的两份文件是旧生成数据及旧 Python 构建脚本，已经被当前构建流程取代，
历史仍可恢复。此次不删除、重定向或归档旧远程仓库；它仅作为不用的历史副本。

## Push routing / 防止推错仓库

Local remotes / 本地远程：

```text
knowledge-base → https://github.com/Tooonnnnyyy/knowledge-base.git
legacy-garden  → https://github.com/Tooonnnnyyy/tony-knowledge-garden.git
remote.pushDefault = knowledge-base
```

Before any push, inspect `git status -sb` and
`git remote get-url --push knowledge-base`. Use an explicit destination branch.
While the live freeze is active, use a review branch only. The Pages workflow
runs on `main` pushes or manual dispatch, not review-branch pushes.

推送前检查工作区、正确 URL 和目标分支。线上冻结期间只推 review 分支，
不 merge 到 `main`、不手动执行部署。需要上线时等待用户明确解除冻结。

## Review evidence / 预览验收

The navigation review changes only the two external link buttons: a filled
**View portfolio** CTA with theme-specific blue, and a recognizable blue/white
LinkedIn mark. The link destinations remain the existing public destinations.
Local `npm test` passed 22/22, production build passed, and `npm run test:browser`
passed 14/14. Installed-Chrome screenshots at 1440 × 960 were checked in all
three themes without runtime errors. This review is saved, not deployed.

按钮预览只改这两个外链按钮，包含三种主题配色；本地 22 项逻辑测试、14 项浏览器
测试与 build 均通过。桌面 Chrome 三主题截图已检查，此预览未部署到正式网站。

See [the GitHub access SOP](GITHUB_ACCESS_SOP.md) and
[the bilingual maintenance guide](MAINTENANCE_GUIDE.md).
