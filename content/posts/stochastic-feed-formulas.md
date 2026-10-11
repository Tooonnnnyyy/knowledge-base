---
title: "Formulas for a Stochastic Feed"
slug: stochastic-feed-formulas
date: 2026-10-07
updated: 2026-10-10
type: formula-guide
public: true
tags: [Systems, Simulation, Probability]
summary: "A compact reference for sampling, alignment, state transitions, traffic and simulation metrics."
links: [cdf-pdf-pmf, inverse-cdf, exponential-distribution, rate-mean-lambda, dot-product-alignment, dirichlet-distribution, watch-ratio-metrics, input-modeling, markov-chains, markov-states, pure-birth-process, gillespie-method, time-discretization, gillespie-euler, metric-definitions, empirical-distributions, recommendation-kpis, probability-expectation-variance, reproducible-simulation, monte-carlo-uncertainty, stochastic-simulation-map]
---

## English

This reference gathers the relationships used by a synthetic feed and traffic model. Each equation belongs to a stated mechanism; the set is not a claim about a real platform.

### 1. Exponential CDF and inverse transform

$$
\begin{aligned}
F_X(x) &= P(X \leq x) = 1 - e^{-x/m},\\
X &= F_X^{-1}(U) = -m\log(1-U), \quad U\sim\mathrm{Uniform}(0,1).
\end{aligned}
$$

Here `m` is the mean and `λ = 1/m` is the rate. `np.log1p(-u)` computes `log(1−u)` stably; keep `u` inside the open interval `(0,1)`.

Related: [[cdf-pdf-pmf|CDF, PDF and PMF]], [[inverse-cdf|inverse CDF]], [[exponential-distribution|exponential distribution]], [[rate-mean-lambda|rate and mean]].

### 2. User–content alignment

$$
\mathrm{alignment} = \mathbf p\cdot\mathbf v = \sum_i p_i v_i
$$

`p` is a user preference vector and `v` is a content category vector. With one-hot content, alignment equals the user's weight for that category.

Related: [[dot-product-alignment|dot products]] and [[dirichlet-distribution|Dirichlet vectors]].

### 3. Watch-time model

$$
\begin{aligned}
\mu_{\mathrm{watch}} &= b_0 + L(a+b\cdot\mathrm{alignment}),\\
T_{\mathrm{watch}} &= \min(\mathrm{Exponential}(\mu_{\mathrm{watch}}),L),\\
\mathrm{watch\ ratio} &= T_{\mathrm{watch}}/L.
\end{aligned}
$$

Here `L` is video length and `b₀` is the base watch-time term.

This is a synthetic input model, not a distribution fitted to real platform logs.

Related: [[watch-ratio-metrics|watch metrics]] and [[input-modeling|input calibration]].

### 4. Markov behavior transition

$$
\begin{aligned}
P(S_{t+1}\mid S_t,q_t),\\
q_t = c_1\cdot\mathrm{alignment}+c_2\cdot\mathrm{watch\ ratio}.
\end{aligned}
$$

States are engaged, neutral and dissatisfied. Normalize each transition-matrix row to sum to one.

Related: [[markov-chains|transition matrices]] and [[markov-states|session memory]].

### 5. Pure-birth traffic

$$
\begin{aligned}
X&\longrightarrow X+1, &\lambda(X)&=rX,\\
\mathbb E[X(t)]&=X_0e^{rt}, &\tau&=-\frac{\log U}{\lambda(X)}.
\end{aligned}
$$

Gillespie jumps to the next event. The Euler-like one-event approximation uses `P(birth in dt) ≈ rXdt` on a fixed time grid.

Related: [[pure-birth-process|birth processes]], [[gillespie-method|Gillespie]], [[time-discretization|fixed steps]] and [[gillespie-euler|their comparison]].

### 6. KPI functions

```text
completion_rate = completed_impressions / all_impressions
skip_rate = skipped_impressions / all_impressions
like_rate = liked_impressions / all_impressions
share_rate = shared_impressions / all_impressions
churn_rate = churned_users / users
exposure_share(category) = category_impressions / all_impressions
```

Related: [[metric-definitions|metric contracts]], [[empirical-distributions|empirical distributions]] and [[recommendation-kpis|KPI choice]].

### 7. Replication summaries

$$
\overline{K} = \frac{1}{R}\sum_{r=1}^{R}K_r,
\qquad
s_K^2 = \frac{1}{R-1}\sum_{r=1}^{R}(K_r-\overline{K})^2
$$

These summarize simulation replications. They do not automatically estimate a real platform's population parameters.

Related: [[probability-expectation-variance|expectation and variance]], [[reproducible-simulation|seeds and reproducibility]] and [[monte-carlo-uncertainty|replication uncertainty]].

## 中文

这张公式页把示例模型中出现的数学关系集中起来，并链接到对应术语和实验机制。

### 1. Exponential CDF / inverse transform

```text
F_X(x) = P(X <= x) = 1 - exp(-x/m)
X = F_X^(-1)(U) = -m log(1-U),  U ~ Uniform(0,1)
```

`m` 是 mean；`lambda = 1/m` 是 rate。代码用 `np.log1p(-u)` 计算 `log(1-u)`，并先把 `u` 限制在 `(0,1)`。

- [[cdf-pdf-pmf|CDF PDF PMF]]
- [[inverse-cdf|Inverse CDF PPF]]
- [[exponential-distribution|Exponential Distribution]]
- [[rate-mean-lambda|Rate Mean Lambda]]

### 2. User-content alignment

```text
alignment = p dot v = sum_i p_i v_i
```

`p` 是 user preference vector，`v` 是 video category vector。one-hot video 时，alignment 等于用户对该类别的权重。

- [[dot-product-alignment|Dot Product Alignment]]
- [[dirichlet-distribution|Dirichlet Distribution]]

### 3. Watch-time model

```text
mean_watch = base + video_length * (a + b * alignment)
watch_time = min(Exponential(mean_watch), video_length)
watch_ratio = watch_time / video_length
```

这是 synthetic input model，不是从 TikTok 真实 logs 拟合出的 distribution。

- [[watch-ratio-metrics|Watch Ratio Completion Skip]]
- [[input-modeling|输入建模与分布校准]]

### 4. Markov behavior transition

```text
P(S[t+1] | S[t], quality[t])
quality = c1 * alignment + c2 * watch_ratio
```

状态为 engaged、neutral、dissatisfied。transition matrix 每一行归一化为 1。

- [[markov-chains|Markov Chain Transition Matrix]]
- [[markov-states|Markov 状态与用户行为记忆]]

### 5. Pure-birth traffic process

```text
X -> X + 1
lambda(X) = rX
E[X(t)] = X0 exp(rt)
tau = -log(U) / lambda(X)
```

Gillespie 直接跳到下一事件；Euler-like 方法在固定 `dt` 上使用：

```text
P(birth in dt) ≈ rXdt
```

- [[pure-birth-process|Pure-Birth Process]]
- [[gillespie-method|Gillespie Direct Method]]
- [[time-discretization|Euler Method Time Discretization]]
- [[gillespie-euler|Gillespie 与 Euler 离散化]]

### 6. KPI functions

```text
completion_rate = completed_impressions / all_impressions
skip_rate = skipped_impressions / all_impressions
like_rate = liked_impressions / all_impressions
share_rate = shared_impressions / all_impressions
churn_rate = churned_users / users
exposure_share(category) = category_impressions / all_impressions
```

- [[metric-definitions|Experiment KPI Metric Definition]]
- [[empirical-distributions|Empirical Distribution Histogram Percentile]]
- [[recommendation-kpis|推荐反馈回路与 KPI 选择]]

### 7. Replication summaries

```text
sample_mean = (1/R) * sum_r KPI_r
sample_variance = (1/(R-1)) * sum_r (KPI_r - sample_mean)^2
```

这些是 simulation replication 的摘要，不是现实平台总体参数的自动估计。

- [[probability-expectation-variance|Probability Expectation Variance]]
- [[reproducible-simulation|Monte Carlo Random Seed Reproducibility]]
- [[monte-carlo-uncertainty|Monte Carlo 重复实验与不确定性]]
