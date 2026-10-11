---
title: A Map from Product Idea to Verified Delivery
date: 2026-10-10
type: map
tags: [Product, AI, Engineering]
summary: Connect scope, architecture, implementation, verification and live evidence in one repeatable delivery loop.
links: [ai-product-architecture, release-evidence, browser-stack-research, agent-delivery-reconciliation, agent-trace-replay, agent-change-approval, agent-change-bundles, designing-learning-systems]
public: true
---

## English

A product development loop begins with an observable user result. Scope and architecture make that result concrete; implementation creates a candidate; verification, release and observation establish what actually works. What is learned then changes the next scope.

### 1. Define one useful result

Identify who encounters the problem, in which situation, and what the smallest successful outcome would be. Select a path that can be demonstrated and measured within a short iteration. A vertical slice should connect the user's input to a useful output, rather than completing disconnected layers of a large platform.

### 2. Draw the boundaries before coding

A minimal AI flow can be written as: user → interface → input processing → planner or model → validation → user-controlled action → events → storage → feedback. For each step, decide:

- Does it run in the browser, server, worker or database?
- Which data may leave the device?
- Where is user confirmation needed?
- What happens after a timeout, model failure or invalid target?
- Which dependency may be mocked, and which must be connected for the slice to be valid?

[[ai-product-architecture|The architecture map]] describes the responsibilities of these layers.

### 3. Confirm the source of truth

Before changing an existing project, inspect its actual repository and state:

```bash
pwd
git rev-parse --show-toplevel
git remote -v
git status --short --branch
```

A folder name, old prototype or live URL alone cannot identify the release. Connect source commit → repository → deployment project → released artifact. [[release-evidence|Release evidence]] explains why each link needs a separate check.

### 4. Make implementation handoffs inspectable

An agent or teammate should leave four things: the changed files and purpose; assumptions, mocks and external dependencies; checks run and their results; and the work still unverified. Generated code is a candidate implementation. Acceptance depends on the behavior that was observed.

### 5. Verify at the right levels

| Level | Useful checks |
| --- | --- |
| Static | Types, lint, formatting, diff checks, dependencies and accidental secrets |
| Module | Schemas, validation, model-output parsing and permission boundaries |
| Flow | A real happy path plus error, retry, cancel and recovery states |
| User | Whether someone can finish the task and understand the next action |
| Production | Logs, metrics, migrations, error reporting and rollback |

A page opening, HTTP 200 or the word “done” is only a partial observation. Acceptance should refer to the user's actual outcome.

### 6. Release and verify the live version

Inspect the working tree before staging files. Fetch and review remote changes before deciding whether a merge or rebase is appropriate. A rejected push is evidence of a history difference to understand, not a reason to overwrite it blindly.

After release, verify the relevant objects separately: web resources and cache; extension manifest and package; API authentication and limits; worker behavior; database migrations and recovery; notification receipts. Different products use different stacks, but these delivery boundaries still matter.

### 7. Turn observation into the next question

Record which user task completed, which failure the logs can explain, whether model inputs were minimized and traceable, and whether the system can recover. Then choose the most important bottleneck for the next iteration. [[designing-learning-systems|A connected learning process]] keeps the reusable lessons accessible after the release is over.

## 中文

产品开发循环从一个可以观察的用户结果开始。范围和架构让这个结果具体化；实现产生候选版本；验证、发布和观测说明到底什么能够工作。学到的内容再用于调整下一轮范围。

### 1. 定义一个有用的结果

明确谁在什么情境下遇到什么问题，以及最小成功结果是什么。选择一条能够在较短迭代内演示和测量的路径。Vertical slice 应把用户输入连接到有价值的输出，而不是先完成一个大平台中互相分离的各层。

### 2. 写代码前画清边界

最小 AI 数据流可以写成：用户 → 界面 → 输入处理 → planner 或 model → validation → 用户可控动作 → events → storage → feedback。每个步骤都要回答：

- 运行在浏览器、server、worker 还是数据库？
- 哪些数据可以离开设备？
- 哪一步需要用户确认？
- 超时、模型失败或目标错误后怎么恢复？
- 哪些依赖可以 mock，哪些必须真实连接才能验证这条路径？

[[ai-product-architecture|架构地图]]进一步解释各层责任。

### 3. 确认真正的 source of truth

修改已有项目之前，检查实际仓库与状态：

```bash
pwd
git rev-parse --show-toplevel
git remote -v
git status --short --branch
```

目录名、旧 prototype 或线上 URL，单独都不能确定当前版本。需要把 source commit → repository → deployment project → released artifact 对应起来。[[release-evidence|发布证据]]说明为什么每一段都需要单独核对。

### 4. 让实现交接可以检查

Agent 或 teammate 应留下四件事：改了哪些文件及原因；使用了哪些假设、mock 和外部依赖；跑过什么检查及其结果；哪些工作仍未验证。代码生成只产生候选实现，验收取决于实际观察到的行为。

### 5. 分层验证

| 层级 | 有用的检查 |
| --- | --- |
| 静态 | Types、lint、格式、diff 检查、依赖和意外 secret |
| 模块 | Schema、validation、模型输出解析、权限边界 |
| 流程 | 真实 happy path，以及错误、重试、取消和恢复 |
| 用户 | 能否完成任务，是否理解下一步 |
| 生产 | Logs、metrics、migration、error reporting 和 rollback |

页面能打开、HTTP 200 或“done”都只是部分观察。验收应对应用户实际要完成的结果。

### 6. 发布后验证线上版本

先检查 working tree，再决定 stage 哪些文件。Fetch 并审阅远程变化后，再选择 merge 或 rebase。Push 被拒绝说明需要理解历史差异，不应盲目覆盖。

发布后分别核对相关对象：Web 资源和缓存、扩展 manifest 与 package、API 认证和限流、worker 行为、数据库 migration 与恢复、通知业务收据。不同产品使用不同技术栈，但这些交付边界依然存在。

### 7. 把观察变成下一轮问题

记录哪个用户任务完成了，哪个失败能被日志解释，模型输入是否最小化且可追踪，以及系统是否能够恢复。然后选择下一轮最重要的瓶颈。[[designing-learning-systems|连接式学习流程]]让这些可复用经验在发布结束后仍然可以检索。
