# GitHub connection SOP / GitHub 连接维护流程

**Purpose / 目的:** reuse the saved GitHub login and identify a blocker within
two minutes before a publishing task. Reconnection and user sign-in time are
separate. / 复用已有登录，发布前两分钟内定位阻碍；重新连接和人工登录时间另计。

Daily writing still uses [the maintenance guide](MAINTENANCE_GUIDE.md).
日常写作不需要跑命令；仅代理或本机发布工具连接异常时使用本 SOP。

## 1. Check in order / 按顺序检查

Run from the repository root. Stop at the first failed step; cancel any command
waiting after 20 seconds. Do not print tokens or credential files. / 在仓库目录执行，
第一项失败就停止；单个命令超过 20 秒取消，不输出 token 或凭证文件。

| Step / 步骤 | Command / 命令 | Evidence / 通过标准 |
| --- | --- | --- |
| Network / 网络 | `curl -fsSI --connect-timeout 5 --max-time 10 https://api.github.com` | HTTP response; DNS/TLS/timeout is a connection issue. / 收到响应；DNS、TLS、超时归类为连接问题。 |
| Identity / 身份 | `gh api user --jq .login` | `Tooonnnnyyy`; never infer expired credentials from a failed connection. / 确认账号；网络失败不能证明 token 过期。 |
| Repository / 仓库 | `gh api repos/Tooonnnnyyy/knowledge-base --jq '{repository: .full_name, can_push: .permissions.push}'` | Correct repository and `can_push: true`. / 正确仓库且有写入权限。 |
| Git route / Git 路径 | `git remote get-url --push knowledge-base` | `https://github.com/Tooonnnnyyy/knowledge-base.git`; `origin` is an older repository. / 必须使用 knowledge-base remote。 |

Before an authorized push, run `git push --dry-run knowledge-base HEAD:main`.
This checks Git authentication and the proposed ref update without publishing;
branch protection can still reject a real push. Public `git ls-remote` success
alone proves neither login nor write access.

在已获授权推送时再 dry-run；它不发布内容，也不能保证分支保护允许实际推送。
公开仓库 `git ls-remote` 成功不等于登录成功或有写权限。

## 2. Act on the cause / 根据原因处理

| Result / 结果 | Next action / 下一步 |
| --- | --- |
| DNS / timeout / no HTTP response | Keep credentials. If the agent sandbox blocks the network, use the normal approved network route once. / 保留凭证；沙箱限制时只尝试一次标准审批网络路径。 |
| Automatic approval review disconnects before execution | Record **not executed**. Stop retrying the same action. Do not bypass review or ask repeatedly for permission already granted. Resume after service recovery or a user-run Terminal result. / 记录未执行，停止重复请求；服务恢复或用户本机反馈后继续。 |
| HTTP 401 from authenticated API after network works | Renew through official browser login below. / 网络正常且认证 API 明确返回 401，再重新登录。 |
| HTTP 403 / 404 or `can_push: false` | Check account, repository access, SSO or rate-limit response; do not automatically invalidate the token or add broad scopes. / 检查账号、权限、SSO 或限流，不直接认定 token 过期。 |
| Push rejected as non-fast-forward | Fetch and inspect new remote commits; integrate them, never force-push. / 获取远端改动后合并，不强推。 |

One retry is enough unless new evidence changes the diagnosis. Complete local
work and retain commits while blocked. / 无新证据不重复重试，先完成本地工作并保存提交。

## 3. Renew only when needed / 仅在需要时更新认证

```sh
gh auth login --hostname github.com --git-protocol https --web
gh api user --jq .login
gh auth setup-git --hostname github.com
```

Finish the official browser sign-in, confirm the intended account, then let Git
use GitHub CLI's saved credential. Keep it in the OS credential store when
available. Do not use `--insecure-storage`, paste tokens into chat, commit a
token, or set a long-lived token in shell startup files. If secure storage is
unavailable, report that instead of claiming secure persistent access.

完成官方浏览器登录，确认账号，再让 Git 复用 CLI 保存的凭证。优先使用系统安全凭证
存储；不明文存 token、不发到 chat、不写入仓库或 shell 启动文件。安全存储不可用时
如实说明。不要每次启动新会话就 logout / login。

## 4. Finish the original task / 恢复后完成原任务

1. Verify account + `can_push`, fetch remote changes, and inspect the diff.
   验证身份和权限，获取远端更新并核对差异。
2. Run required checks, then push the authorized branch and recovery tag.
   完成必要验证，再推送已授权版本和回撤 tag。
3. Compare local and remote commit SHA. A commit existing locally is not a push.
   对比本地/远端 SHA，不能把本地提交当成推送完成。
4. Check the matching Actions run and live Pages content before claiming deployment.
   核对该 commit 的 Actions 和线上内容后才说已部署。

For a blocked handoff, record only: failing stage, error category, whether the
action executed, saved commit, and next recovery step. Never store credentials.
交接只记录阶段、错误类别、是否执行、本地 commit 和下一步，不记录凭证。

## Current evidence / 当前证据

The owner manually opened and accepted the offline 3D preview and authorized
storing/pushing it. Source `77206d1` and guide `32b2078` are committed locally.
The latest remote read observed `main` at `e314dca`; later network/API calls
failed and approval review disconnected before execution. **Push/deployment
remain unverified; credential expiry is unconfirmed.** This is a dated incident
record, not a permanent statement about access.

用户已打开并接受本地 3D 预览，授权保存与推送。以上 commit 已在本地；最后一次远程读取
见到 `main=e314dca`。随后网络/API 失败，审批服务在执行前断开。**未确认推送或部署；
不能确认凭证过期。**记录日期：2026-10-12，后续以现场检查为准。
