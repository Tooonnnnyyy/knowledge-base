---
title: Define the Dataset Before Training
date: 2026-09-28
type: note
tags: [Data, Engineering, AI]
summary: Prediction unit, input window, target, and leakage rules define what a model is actually learning.
links: [reproducible-simulation, synthetic-data]
---
# Define the Dataset Before Training

## English

Before training a model, define the prediction unit, input window, target, and the moment when the prediction is allowed to exist. These choices determine whether a feature is available at decision time.

A field that appears predictive can still be invalid if it contains information from the future. Writing the data contract first makes training-serving skew and leakage easier to detect.

The model is only one part of the system. The dataset definition is where the meaning of the prediction begins.

## 中文

训练模型前，要先定义 prediction unit、input window、target，以及预测可以发生的时间点。这些选择决定某个 feature 在真实决策时是否可用。

一个看似有预测力的字段，如果包含未来信息，仍然是不合法的。先写数据契约，能更容易发现 training-serving skew 和 leakage。

模型只是系统的一部分，预测的意义从数据定义开始。
