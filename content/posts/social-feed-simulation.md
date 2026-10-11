---
title: A Synthetic Social Feed Experiment
date: 2026-10-07
type: experiment
tags: [Systems, Simulation, Recommendation]
summary: A random feed connects modeled preferences, watch time, session state and traffic events to measurable synthetic outputs.
links: [stochastic-simulation-map, stochastic-feed-formulas, synthetic-users-kpis, dirichlet-distribution, dot-product-alignment, inverse-transform-sampling, markov-states, gillespie-euler, pure-birth-process, public-data-boundaries, synthetic-data]
public: true
---

## English

This experiment turns stochastic mechanisms into measurable system behavior. Its baseline is a non-personalized feed: the next video is selected randomly, and a user's hidden preference does not change the probability of exposure. Preferences affect the modeled response after exposure.

The setup is a mechanism experiment. It does not replicate a production recommendation system or establish how real people behave.

### Baseline inputs

| Input | Setting |
| --- | --- |
| Synthetic users | 1,000 |
| Synthetic videos | 400 |
| Content categories | Technology, comedy, cooking, fashion |
| Maximum impressions per user | 50 |
| Reproducibility seed | 42 |
| Exposure policy | Random selection without personalization |

### From assumptions to outputs

1. Sample a hidden category-preference vector for each user using a [[dirichlet-distribution|Dirichlet distribution]].
2. Select a video using the random feed policy.
3. Use the [[dot-product-alignment|dot product]] between user preference and content representation to calculate alignment.
4. Generate watch time with inverse exponential sampling.
5. Let watch ratio and alignment influence noisy like and share outcomes.
6. Update the session's engaged, neutral or dissatisfied [[markov-states|Markov state]].
7. Sample a churn event to decide whether the session ends.
8. Separately model traffic growth as a [[pure-birth-process|pure-birth process]], using fixed-step and Gillespie methods for comparison.

These mechanisms connect hidden preference → alignment → watch behavior → state transition → session outcome → aggregate KPI. The traffic model adds an event-timing experiment. A birth-only model does not yet contain departures, service completion or a full queue.

### What to inspect

A useful output set includes watch-time and session-length histograms, exposure share compared with catalog share, completion/like/share/churn rates, and a parameter record. For traffic, compare one illustrative trajectory and the final-traffic distribution over 250 replications. One trajectory alone cannot establish whether two stochastic methods agree.

Every metric should use an explicit numerator, denominator and observation window. These are **synthetic KPIs produced under the chosen assumptions**.

### Next experiment matrix

| Factor | Baseline | Comparison | Observe |
| --- | --- | --- | --- |
| Feed policy | Random | Popularity-weighted or preference-aware | Watch time, churn, exposure concentration |
| Churn sensitivity | Current setting | Lower and higher values | Session length and retention |
| Watch-time model | Exponential | Log-normal or mixture | Tail percentiles and completion |
| Fixed time step | `dt = 0.02` | `0.1` and `0.01` | Final-traffic bias and runtime |
| Event method | Fixed step | Gillespie | Event timing and output distribution |

The parameter values define comparisons to run; they are not measured conclusions. A syntax check of an implementation is also not a numerical validation. [[synthetic-data|The synthetic-to-real evidence boundary]] remains separate from whether the simulation executes correctly.

## 中文

这个实验把随机机制转化为可以测量的系统行为。Baseline 是非个性化 feed：每次随机选择视频，用户的隐藏 preference 不改变曝光概率。Preference 只影响曝光之后的模拟反应。

这是一个 mechanism experiment，不是在复制生产推荐系统，也不能证明现实用户的行为。

### 基线输入

| 输入 | 设置 |
| --- | --- |
| 合成用户 | 1,000 |
| 合成视频 | 400 |
| 内容类别 | 科技、喜剧、烹饪、时尚 |
| 每个用户最大曝光数 | 50 |
| 可复现 seed | 42 |
| 曝光策略 | 随机选择，不做个性化 |

### 从假设到输出

1. 用 [[dirichlet-distribution|Dirichlet distribution]] 为每个用户生成隐藏的类别 preference vector。
2. 按 random feed policy 选择视频。
3. 用用户偏好与内容表示的 [[dot-product-alignment|dot product]] 计算 alignment。
4. 用 inverse exponential sampling 生成 watch time。
5. 让 watch ratio 和 alignment 影响带有噪声的 like、share 行为。
6. 更新 engaged、neutral、dissatisfied 三种 [[markov-states|Markov 状态]]。
7. 抽取 churn event，决定 session 是否结束。
8. 单独用 [[pure-birth-process|pure-birth process]] 模拟流量增长，对比 fixed-step 和 Gillespie 方法。

这条链连接隐藏偏好 → alignment → 观看行为 → 状态转移 → session 结果 → 聚合 KPI。流量模型补充事件时间实验。只有 birth 的模型还没有 departure、service completion 或完整 queue。

### 应该观察什么

输出可以包含 watch-time 与 session-length histogram、exposure share 与 catalog share 对照、completion/like/share/churn rate，以及参数记录。流量实验同时观察一条示例轨迹和 250 次重复实验的 final-traffic distribution。单条轨迹不能证明两个随机方法是否一致。

每个指标都需要明确 numerator、denominator 和 observation window。这些是**在给定假设下产生的合成 KPI**。

### 下一轮实验矩阵

| 因素 | 基线 | 对照 | 观察内容 |
| --- | --- | --- | --- |
| Feed policy | Random | Popularity-weighted 或 preference-aware | Watch time、churn、exposure concentration |
| Churn sensitivity | 当前值 | 更低和更高 | Session length、retention |
| Watch-time model | Exponential | Log-normal 或 mixture | 长尾分位数、completion |
| 固定时间步 | `dt = 0.02` | `0.1`、`0.01` | Final-traffic bias、运行时间 |
| Event method | Fixed step | Gillespie | Event timing、输出分布 |

这些参数定义的是待运行的比较，不是已经测得的结论。实现通过 syntax check 也不等于数值验证。[[synthetic-data|合成到真实的证据边界]]与仿真程序是否正确运行，是两个独立问题。
