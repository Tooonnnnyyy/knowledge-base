---
title: A Map of Stochastic Feed Simulation
date: 2026-10-07
type: map
tags: [Systems, Simulation, Recommendation, Knowledge practice]
summary: Follow the dependencies from a research question through system structure, probability, implementation and evidence.
links: [social-feed-simulation, synthetic-users-kpis, synthetic-data, recommendation-policy, exposure-feedback, recommendation-kpis, user-item-interaction, dot-product-alignment, watch-ratio-metrics, session-churn-hazard, queueing-capacity, queueing-primitives, pure-birth-process, synthetic-users, stochastic-processes, markov-states, markov-chains, markov-jump-processes, inverse-transform-sampling, gillespie-method, time-discretization, random-variables, cdf-pdf-pmf, probability-expectation-variance, bernoulli-trials, uniform-distribution, exponential-distribution, inverse-cdf, rate-mean-lambda, dirichlet-distribution, stochastic-feed-formulas, discrete-event-simulation, numpy-simulation, metric-definitions, empirical-distributions, monte-carlo-uncertainty, reproducible-simulation, input-modeling, model-evaluation, dataset-definition, multi-armed-bandits, collaborative-filtering, causal-comparisons, oauth-consent, public-data-boundaries]
public: true
---

## English

This map organizes a synthetic-user and random-feed experiment by dependency. A research question, a probability distribution, an algorithm and an evaluation result occupy different levels. Reading them in that order makes the network more useful than treating every term as an equal item in a list.

### The seven levels

| Level | Question | Typical evidence |
| --- | --- | --- |
| 0 · Research question | What should the experiment explain? | Defined scope |
| 1 · System structure | Which entities, policies and feedback loops exist? | Model structure |
| 2 · Random mechanisms | Where does uncertainty enter behavior and traffic? | Synthetic assumptions |
| 3 · Mathematical foundations | What do the variables and distributions mean? | Mathematical definitions |
| 4 · Implementation | How does code execute the model? | Algorithm and implementation checks |
| 5 · Evaluation | How are outputs defined and repeated? | Simulation results |
| 6 · Extensions and boundaries | What would be needed for real data or another policy? | Proposals and external evidence |

### 0. Start with the question

[[social-feed-simulation|The experiment architecture]] defines the random-feed baseline. [[synthetic-users-kpis|Synthetic users and system KPIs]] explains how assumptions become outputs. [[synthetic-data|External validity]] clarifies what those outputs cannot establish about the real world.

### 1. Locate each part of the system

**Feed and exposure:** a [[recommendation-policy|policy]] chooses the item, an [[exposure-feedback|exposure feedback loop]] shapes future observations, and [[recommendation-kpis|KPI selection]] determines what appears to improve.

**User response:** [[user-item-interaction|interaction records]], [[dot-product-alignment|alignment]], [[watch-ratio-metrics|watch ratio]] and [[session-churn-hazard|session termination]] connect the shown item to behavior.

**Traffic and capacity:** [[pure-birth-process|birth-only growth]] is a small traffic model. [[queueing-primitives|Arrival and service]] and [[queueing-capacity|capacity]] describe the additional mechanisms needed for waiting and latency.

### 2. Identify the random mechanisms

[[synthetic-users|Synthetic users]] are controllable inputs. A [[stochastic-processes|stochastic process]] evolves through time or events. [[markov-states|Session state]] compresses history, while a [[markov-chains|transition matrix]] makes the next-state probabilities explicit.

[[inverse-transform-sampling|Inverse transform sampling]] creates waiting-time samples. [[markov-jump-processes|Continuous-time jumps]], [[gillespie-method|Gillespie]] and [[time-discretization|fixed time steps]] describe different views of event execution.

### 3. Resolve the mathematical vocabulary

The first chain is [[random-variables|random variable]] → [[cdf-pdf-pmf|CDF, PDF and PMF]] → [[uniform-distribution|uniform sample]] → [[inverse-cdf|inverse CDF]] → [[exponential-distribution|exponential waiting time]]. Keep [[rate-mean-lambda|rate and mean]] distinct.

For outcomes, use [[bernoulli-trials|Bernoulli trials]] and [[probability-expectation-variance|expectation and variance]]. For preferences, use a [[dirichlet-distribution|Dirichlet vector]] and [[dot-product-alignment|dot product]]. [[stochastic-feed-formulas|The formula guide]] collects the equations in one place.

### 4. Connect formulas to execution

[[discrete-event-simulation|Discrete-event simulation]] advances at events. [[gillespie-method|Gillespie]] samples the next gap; [[time-discretization|fixed-step simulation]] checks changes at a chosen interval. [[numpy-simulation|The NumPy function map]] links mathematical operations to implementation tools.

### 5. Make the results interpretable

Start with [[metric-definitions|metric contracts]]. Inspect [[empirical-distributions|histograms and percentiles]], then use [[monte-carlo-uncertainty|replications]] and a [[reproducible-simulation|seed protocol]] to expose variation. Check [[input-modeling|input calibration]], [[dataset-definition|data definitions]] and [[model-evaluation|diagnostic slices]] before trusting an aggregate result.

### 6. Extend without overstating

[[multi-armed-bandits|Bandits]] and [[collaborative-filtering|collaborative filtering]] are possible recommendation extensions. [[causal-comparisons|Causal comparisons]] require a design that supports the missing alternative outcome. For external data, begin with [[oauth-consent|consent and scopes]] and [[public-data-boundaries|data availability]]. These extensions do not automatically exist in the baseline experiment.

A useful reading route is architecture → formulas → unfamiliar foundations → implementation → metrics → evidence boundaries. Return to the map whenever a term's role in the system becomes unclear.

## 中文

这张地图按依赖关系组织合成用户与 random feed 实验。研究问题、概率分布、算法和评估结果属于不同层级。按顺序理解它们，比把所有术语当成同一层级的清单更有用。

### 七个层级

| Level | 回答的问题 | 典型证据 |
| --- | --- | --- |
| 0 · 研究问题 | 实验要解释什么？ | 明确范围 |
| 1 · 系统结构 | 有哪些实体、策略和反馈回路？ | 模型结构 |
| 2 · 随机机制 | 不确定性如何进入行为和流量？ | 合成假设 |
| 3 · 数学基础 | 变量和分布是什么意思？ | 数学定义 |
| 4 · 实现方法 | 代码如何执行模型？ | 算法与实现检查 |
| 5 · 输出评估 | 如何定义并重复测量输出？ | 仿真结果 |
| 6 · 扩展与边界 | 接真实数据或其他策略需要什么？ | 提案与外部证据 |

### 0. 从研究问题进入

[[social-feed-simulation|实验架构]]定义 random feed baseline。[[synthetic-users-kpis|合成用户与系统 KPI]]说明假设如何变成输出。[[synthetic-data|外部有效性]]说明这些输出不能证明什么现实结论。

### 1. 找到每个系统部分

**Feed 与曝光：**[[recommendation-policy|policy]]选择 item，[[exposure-feedback|exposure feedback loop]]影响后续观测，[[recommendation-kpis|KPI 选择]]决定什么看起来像改进。

**用户反应：**[[user-item-interaction|interaction records]]、[[dot-product-alignment|alignment]]、[[watch-ratio-metrics|watch ratio]] 和 [[session-churn-hazard|session termination]]把已展示内容连接到行为。

**流量与容量：**[[pure-birth-process|只有 birth 的增长]]是最小流量模型。[[queueing-primitives|Arrival 与 service]]以及 [[queueing-capacity|capacity]]说明等待和延迟还需要哪些机制。

### 2. 识别随机机制

[[synthetic-users|Synthetic users]]是可控输入。[[stochastic-processes|Stochastic process]]随时间或事件变化。[[markov-states|Session state]]压缩历史，[[markov-chains|transition matrix]]明确下一状态的概率。

[[inverse-transform-sampling|Inverse transform sampling]]产生等待时间样本。[[markov-jump-processes|连续时间跳跃]]、[[gillespie-method|Gillespie]] 和 [[time-discretization|固定时间步]]提供事件执行的不同视角。

### 3. 理清数学词汇

第一条链是 [[random-variables|random variable]] → [[cdf-pdf-pmf|CDF、PDF、PMF]] → [[uniform-distribution|uniform sample]] → [[inverse-cdf|inverse CDF]] → [[exponential-distribution|exponential waiting time]]。同时区分 [[rate-mean-lambda|rate 与 mean]]。

行为结果可以用 [[bernoulli-trials|Bernoulli trial]]以及 [[probability-expectation-variance|expectation、variance]]理解。Preference 使用 [[dirichlet-distribution|Dirichlet vector]] 和 [[dot-product-alignment|dot product]]。[[stochastic-feed-formulas|公式指南]]集中整理方程。

### 4. 从公式走向执行

[[discrete-event-simulation|Discrete-event simulation]]在事件发生时前进。[[gillespie-method|Gillespie]]抽取下一次 gap；[[time-discretization|fixed-step simulation]]在选定间隔检查变化。[[numpy-simulation|NumPy 函数地图]]把数学运算映射到实现工具。

### 5. 让输出可以解释

先定义 [[metric-definitions|metric contract]]，再检查 [[empirical-distributions|histogram 和 percentile]]。使用 [[monte-carlo-uncertainty|重复实验]]和 [[reproducible-simulation|seed protocol]]展示变化。在信任 aggregate 结果前，检查 [[input-modeling|input calibration]]、[[dataset-definition|数据定义]]和 [[model-evaluation|diagnostic slices]]。

### 6. 扩展时保留证据边界

[[multi-armed-bandits|Bandit]] 和 [[collaborative-filtering|collaborative filtering]]是可能的推荐扩展。[[causal-comparisons|因果比较]]需要能支持反事实判断的实验设计。外部数据则从 [[oauth-consent|consent 与 scope]]和 [[public-data-boundaries|数据可得性]]开始。这些扩展并不自动存在于 baseline 实验中。

建议阅读路径是：架构 → 公式 → 不熟悉的基础 → 实现 → 指标 → 证据边界。当某个术语在系统里的角色不清楚时，再回到这张地图。
