---
title: "An Apple-Informed UX and UI Design Workflow"
slug: apple-design-workflow
date: 2026-10-13
updated: 2026-10-13
type: practice
public: true
tags: [UX and UI design, Product]
summary: "Move from a user task to information architecture, an interactive prototype, usability evidence and a maintainable release."
links: [apple-human-interface-guidelines, apple-adaptive-layout, apple-accessible-visual-design, apple-design-resources, ai-product-development, release-evidence]
---

## English

### A practical workflow, with an explicit source boundary

Apple's [Design foundations from idea to interface](https://developer.apple.com/videos/play/wwdc2025/359/) works through **structure, navigation, content and visual design**. Its [Design Pathway](https://developer.apple.com/design/get-started/) also directs learners to prototyping, tools and developer examples.

The seven-step workflow below combines that public guidance with practical research and delivery checkpoints. It is an independent synthesis, not an official Apple internal SOP. Sources were checked on October 13, 2026; suggested exercises are not validated research findings.

![A design loop moves from task to structure, flow, prototype, testing, delivery and observation. Observations feed the next design question.](https://tooonnnnyyy.github.io/knowledge-base/media/apple-hig/workflow.svg)

*Original workflow diagram. Return to the relevant earlier step when evidence changes the decision.*

### Seven steps, seven inspectable outputs

| Step | Work to do | Output and review gate |
| --- | --- | --- |
| **1. Define the task** | Understand who needs what outcome, in which context. Examine real behavior where possible. | A task statement, evidence and assumptions. Someone can explain why it matters. |
| **2. Organize information** | Inventory content and actions; remove duplication; group and name concepts. | An information map. Primary destinations are distinct and understandable. |
| **3. Design the flow** | Choose navigation and place actions where they are needed. Include back, cancel, errors and recovery. | A flow and state map. Each screen answers where I am, what I can do and where I can go next. |
| **4. Build a small prototype** | Start with layout and real content; add hierarchy, typography, color and interaction. | One complete task can be tried. Unimplemented behavior is clearly identified. |
| **5. Test and revise** | Observe task completion, hesitation, errors and recovery. Include large text, keyboard and relevant window sizes. | A short findings list with observed evidence, severity and the next change. |
| **6. Implement and verify** | Reuse appropriate components; document states and acceptance criteria; check the built result. | A tested implementation and explicit remaining limitations. |
| **7. Observe and maintain** | Recheck important tasks after release; learn from support and behavior. | A prioritized next question and an updated decision record. |

Accessibility and privacy belong in every step. A functional prototype is also useful early: it exposes navigation and state problems that a static mockup may hide.

### A lightweight research plan

For an initial exploratory round, recruit a few people who resemble the intended audience. Ask them to complete a realistic task without describing the controls in advance. This is a qualitative learning exercise, not a representative measurement of the whole audience.

Capture four things: the outcome, a moment of hesitation, the person's interpretation and whether they recovered. Separate observation from interpretation. For example, “three participants searched for a back control after opening a note” is an observation; “all visitors prefer a permanent sidebar” is a broader claim that this evidence does not establish.

### Example: exploring a connected library

**Task:** find a note about a subject, understand one related idea and return to the starting view.

Prototype the entire path: search or select a topic → open a note → follow one meaningful relationship → return. Review whether the original selection, position and reading context remain understandable. Test both an explicit search destination and open-ended exploration.

Treat delight as a testable supporting decision. A transition can explain how a note expands, but a long camera movement may delay reading. Compare the behavior with a reduced-motion version and use the results to refine the interaction.

### Watch: a worked example

```video
https://devstreaming-cdn.apple.com/videos/wwdc/2025/359/4/5ad3ea3a-0dda-4b07-bdc3-c638d2a8f709/downloads/wwdc2025-359_sd.mp4?dl=1
Apple WWDC25 — Design foundations from idea to interface. A worked example covering structure, navigation, content and visual design.
```

[Official session, chapters and transcript](https://developer.apple.com/videos/play/wwdc2025/359/): **01:11 Structure · 04:55 Navigation · 08:19 Content · 13:28 Visual Design**.

For a fast prototype exercise, use [60-Second Prototyping](https://developer.apple.com/videos/play/wwdc2017/818/). It is an older session; use the method while checking current components in the HIG.

### A handoff that keeps the reasoning

Record: **task → evidence → decision → states → acceptance criteria → unresolved question**. This makes the workflow connect naturally to [[ai-product-development|product development]] and [[release-evidence|release verification]]. Keep [[apple-adaptive-layout|layout]], [[apple-accessible-visual-design|visual accessibility]] and [[apple-human-interface-guidelines|the design principles]] available during review; choose further study from [[apple-design-resources|the resource library]].

## 中文

### 可执行流程与来源边界

Apple 的 [Design foundations from idea to interface](https://developer.apple.com/videos/play/wwdc2025/359/) 按 **Structure、Navigation、Content、Visual Design** 展开案例。[Design Pathway](https://developer.apple.com/design/get-started/) 则连接原则、工具、原型与开发者实践。

下面的七步流程根据这些公开材料加入研究和交付检查，是可复用的方法归纳，不代表 Apple 内部 SOP。来源核对日期为 2026 年 10 月 13 日；示例练习不等于已经验证的研究结论。

### 每一步都留下可检查的产物

| 步骤 | 做什么 | 产物与通过条件 |
| --- | --- | --- |
| **1. 明确任务** | 理解谁在什么情境下需要什么结果，尽量观察真实行为。 | 任务描述、证据、假设；能够解释为什么值得做。 |
| **2. 整理信息架构** | 列出内容与操作，去重、分组、命名。 | 信息地图；主要入口职责清楚。 |
| **3. 设计操作路径** | 确定导航、上下文操作、返回、取消、错误与恢复。 | Flow 和 state map；每屏都能回答位置、操作与下一步。 |
| **4. 做最小原型** | 用真实内容验证布局，再加入字体、颜色和交互。 | 一条完整任务能够试用，未实现行为有明确标注。 |
| **5. 测试与修改** | 观察任务完成、犹豫、误操作、恢复及无障碍场景。 | 按严重程度整理问题，记录证据与下一次改动。 |
| **6. 实现与验证** | 选用合适组件，明确状态与验收条件，检查实际构建。 | 可验证的实现与尚未验证的限制。 |
| **7. 上线后学习** | 复查关键任务，分析支持反馈与行为。 | 下一轮问题和持续更新的决策记录。 |

可访问性与隐私贯穿全部步骤。可操作原型可以更早暴露导航和状态问题，因此不必等到视觉稿全部精修完才尝试交互。

### 一个简单的研究方法

初期可以邀请少量接近目标用户的人，完成真实任务；开始前不讲解具体按钮。这样获得的是探索性、定性证据，不能直接代表全部用户。

记录四件事：任务结果、犹豫发生的位置、参与者如何理解、遇到问题能否恢复。把观察与推断分开：“三位参与者打开文章后寻找返回按钮”是观察，“所有访客都偏好永久侧栏”则是证据尚不能支持的广泛结论。

### 知识库案例

任务：找到一个主题的文章，理解一个相关概念，再返回起点。

原型应覆盖完整路径：搜索或选 topic → 打开文章 → 跟随有意义的连接 → 返回。检查原来的选中项、图谱位置与阅读上下文是否容易恢复；分别尝试明确查找和自由探索。

动效同样需要评估。展开动画可以解释空间关系，过长的镜头移动也可能拖慢阅读。与减少动态效果的版本比较后，再判断哪种体验更适合任务。

### 对应视频与交接格式

上方 WWDC25 视频的章节为：**01:11 Structure、04:55 Navigation、08:19 Content、13:28 Visual Design**。原型练习可参考 [60-Second Prototyping](https://developer.apple.com/videos/play/wwdc2017/818/)；旧课程适合学习方法，具体组件应核对当前 HIG。

交接时按 **任务 → 证据 → 决策 → 状态 → 验收条件 → 未解决问题** 记录。结合 [[ai-product-development|产品开发流程]]、[[release-evidence|发布证据]]、[[apple-adaptive-layout|布局原则]] 与 [[apple-accessible-visual-design|可访问的视觉设计]]，将设计意图连接到实际结果。[[apple-human-interface-guidelines|原则地图]] 和 [[apple-design-resources|资源库]] 提供学习入口。
