---
title: A Small Architecture for AI Products
date: 2026-10-10
type: architecture
tags: [AI, Engineering, Product]
summary: Clear responsibilities for the client, API, model, workers, data and release make an AI product easier to understand and recover.
links: [ai-product-development, agent-delivery-reconciliation, agent-change-bundles, release-evidence, oauth-consent]
public: true
---

## English

An AI product becomes easier to reason about when each layer answers one question. The interface gathers input and communicates status; the API checks who may do what; the model produces a suggestion; a controlled action changes the world. These steps need explicit boundaries even in a small prototype.

### Give each layer one responsibility

| Layer | Question | Typical responsibilities |
| --- | --- | --- |
| Client | What can the user see and do? | Input, feedback, accessibility, confirmation |
| API | Who may call which operation? | Authentication, validation, authorization, rate limits, consistent errors |
| Model | How is a suggestion produced? | Prompt, output schema, fallback, cost and latency |
| Worker | What can run asynchronously? | Summaries, notifications, retries, scheduled work |
| Database | Which facts must persist? | Events, settings, migrations, retention |
| Observability | How will a failure be understood? | Structured logs, metrics, traces, alerts |
| Deployment | How does a version reach users? | Build, environment, release, rollback |

A minimal data flow is: user input → API validation → model or rule → action validation → user-controlled action → event record. A worker can later aggregate events for a dashboard or notification. The database stores the product's facts; the model response is an input to a decision, with its own confidence and status.

### Make the important decisions visible

- Decide whether the model may only advise or may execute an operation. An action with consequences needs an explicit authority boundary.
- Minimize and redact input before deciding whether it should leave the device.
- Keep provider credentials on the server, outside browser bundles and extension packages.
- Define the source of truth and its retention policy. An analytics cache and a business record have different roles.
- Design a recoverable state for API failure. The user needs the next action, while internal diagnostics belong in logs.
- Tie a deployment to its source commit, configuration version and migration state.

### Failure patterns to watch

An old landing page may no longer reflect the current implementation. A model returning “done” does not prove that an action occurred. An API route does not prove that a production database is connected. A successful request does not prove a business outcome. Test timeouts, invalid targets, permission failures and recovery alongside the happy path.

Continue with [[ai-product-development|the development lifecycle]] for the delivery sequence and [[agent-delivery-reconciliation|receipt reconciliation]] for external actions.

## 中文

把 AI 产品拆成每层只回答一个问题的结构，会更容易理解和排查。界面收集输入、展示状态；API 检查谁可以做什么；模型产生建议；受控动作改变外部世界。即使是小原型，这些步骤也需要明确边界。

### 每一层负责什么

| 层 | 核心问题 | 典型责任 |
| --- | --- | --- |
| Client | 用户看见什么、操作什么？ | 输入、反馈、可访问性、确认 |
| API | 谁可以调用什么？ | 认证、校验、授权、限流、统一错误格式 |
| Model | 如何产生建议？ | Prompt、输出 schema、fallback、成本和延迟 |
| Worker | 哪些工作可以异步？ | 汇总、通知、重试、定时任务 |
| Database | 什么事实需要保存？ | Events、settings、migration、retention |
| Observability | 失败后如何知道原因？ | 结构化日志、metrics、traces、alerts |
| Deployment | 版本如何到用户？ | Build、环境、release、rollback |

一个最小数据流可以是：用户输入 → API 校验 → 模型或规则 → 动作校验 → 用户可控的执行 → 事件记录。Worker 可以随后把事件汇总成 dashboard 或通知。数据库保存产品事实；模型返回值则是决策的一个输入，应该有独立的状态与可信度说明。

### 把关键判断说清楚

- 明确模型只给建议，还是可以执行操作。有后果的动作需要明确的决策权限。
- 页面数据离开设备前，先最小化和脱敏，再决定是否发送。
- Provider credential 放在服务端，不放进浏览器 bundle 或扩展包。
- 定义 source of truth 和 retention。分析缓存与业务事实的责任不同。
- API 失败时提供可恢复状态。用户需要知道下一步，内部错误细节留在日志。
- 让 deployment 对应到 source commit、配置版本和 migration 状态。

### 常见失控点

旧 landing page 可能已经不能代表当前实现。模型返回“done”不能证明外部动作发生。存在 API route 不能证明生产数据库已经连接。请求成功也不能证明业务结果成功。除了 happy path，还应验证超时、错误目标、权限失败和恢复流程。

[[ai-product-development|产品开发流程]]说明交付顺序；[[agent-delivery-reconciliation|业务收据核对]]进一步解释如何处理外部动作。
