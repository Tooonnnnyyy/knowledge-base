---
title: "Apple HIG: Principles of Human-Centered Design"
slug: apple-human-interface-guidelines
date: 2026-10-13
updated: 2026-10-13
type: guide
public: true
tags: [UX and UI design]
summary: "Eight Apple design principles, their practical meaning, and a connected route from purpose to layout, interaction and evaluation."
links: [apple-adaptive-layout, apple-design-workflow, apple-accessible-visual-design, apple-design-resources, critical-thinking]
---

## English

### Start with the person and the task

Apple's Human Interface Guidelines (HIG) help designers make experiences that people can understand, control and use in different contexts. Layout, typography, navigation and motion work together to support that purpose.

**Source boundary:** the eight principles below are named in Apple's current [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles). The review questions and knowledge-library examples are an independent interpretation. They are not a description of Apple's internal design process. Sources were checked on October 13, 2026.

![Eight design principles surround a useful human outcome: purpose, agency, responsibility, familiarity, flexibility, simplicity, craft and delight.](https://tooonnnnyyy.github.io/knowledge-base/media/apple-hig/principles.svg)

*Original study diagram. Read it as a set of decisions that support a person, rather than a ranking of principles.*

### Eight principles to use in a design review

| Apple's principle | Practical meaning | A question to ask |
| --- | --- | --- |
| **Purpose** | Focus on what matters to the people using the product. | What useful result can someone achieve here? |
| **Agency** | Give people control, clear feedback and ways to recover. | Can they cancel, go back or undo a mistake? |
| **Responsibility** | Be transparent; protect privacy and handle data with care. | Is every data request necessary and explained? |
| **Familiarity** | Build on recognizable concepts and consistent behavior. | Does an action behave as its appearance suggests? |
| **Flexibility** | Support different abilities, contexts, platforms and inputs. | Can someone use this with larger text or a keyboard? |
| **Simplicity** | Make the important things easy to find and understand. | Can someone identify the next action without guessing? |
| **Craft** | Refine details, test in real settings and keep improving. | Do errors and edge cases receive the same care as the main screen? |
| **Delight** | Choose an appropriate emotional character and express it thoughtfully. | Does this moment help someone feel capable, calm or curious? |

These principles help resolve competing priorities. For example, a sparse toolbar can look calm, but removing every label can make unfamiliar actions hard to discover. A short explanation or a clearly labeled menu may better support both simplicity and familiarity.

### Translate the principles into interface decisions

For a connected reading library, **purpose** is finding and understanding knowledge. A graph can support discovery; search supports a known destination. **Agency** calls for a predictable route back after opening an article. **Flexibility** suggests a searchable article list alongside spatial exploration. **Responsibility** requires a deliberate boundary between private source notes and public writing.

Apple's current [Materials](https://developer.apple.com/design/human-interface-guidelines/materials) guidance describes Liquid Glass as a functional layer for controls and navigation. It recommends restraint and separates that layer from reading content. An interface can apply the underlying hierarchy principles without adopting this particular material.

### Watch: the principles behind the decisions

```video
https://devstreaming-cdn.apple.com/videos/wwdc/2026/250/4/ad804f32-2805-48aa-891c-8c742579acab/downloads/wwdc2026-250_sd.mp4?dl=1
Apple WWDC26 — Principles of great design. Official Apple-hosted video; playback starts only when requested.
```

[Open the official session and available transcript](https://developer.apple.com/videos/play/wwdc2026/250/). While watching, choose one screen and identify a tension between two principles. Write the tradeoff and the user behavior that would help evaluate it.

### Follow the connected learning path

1. [[apple-adaptive-layout|Adaptive layout]] explains hierarchy, grouping, available space and safe areas.
2. [[apple-design-workflow|A practical design workflow]] turns these principles into outputs and review gates.
3. [[apple-accessible-visual-design|Accessible visual design]] connects typography, themes, color and motion.
4. [[apple-design-resources|The resource library]] provides annotated videos, official tools and a study order.

Use [[critical-thinking|critical thinking]] when reviewing a design claim: distinguish what the guideline says, what the designer assumes and what a usability test has actually shown.

## 中文

### 从人的目标出发

Apple 的 Human Interface Guidelines（HIG，人机界面指南）帮助设计师构建易理解、可控制、能适应不同使用情境的体验。布局、字体、导航与动效共同服务于人的任务。

**来源边界：**上表中的八项原则来自 Apple 当前的 [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles)。下面的评审问题、知识库案例与学习路线属于整理者的应用归纳，不代表 Apple 内部 SOP。来源核对日期为 2026 年 10 月 13 日。

### 八项原则如何影响设计

| 官方原则 | 中文理解 | 评审时检查什么 |
| --- | --- | --- |
| **Purpose · 目的** | 优先做好用户真正需要的结果。 | 用户在这里能完成什么有价值的事情？ |
| **Agency · 自主权** | 让用户掌握操作节奏，并能退出、返回、纠错。 | 点错以后能否轻松恢复？ |
| **Responsibility · 责任** | 解释产品行为，保护隐私，谨慎处理数据。 | 索取的数据是否必要、用途是否清楚？ |
| **Familiarity · 熟悉感** | 使用可识别的概念，让外观与行为保持一致。 | 看起来可以点击的东西，是否真的能点击？ |
| **Flexibility · 适应性** | 支持不同能力、设备、输入方式与使用环境。 | 放大文字或只用键盘还能完成任务吗？ |
| **Simplicity · 简明** | 让重要内容和下一步操作容易理解。 | 用户需要猜测按钮的作用吗？ |
| **Craft · 打磨** | 细节、异常状态、真实环境与持续维护同样重要。 | 错误状态是否也经过认真设计？ |
| **Delight · 愉悦** | 根据产品目的形成恰当的情绪体验。 | 这段体验让用户更从容、更好奇，还是更困惑？ |

这些原则用于权衡设计。比如工具栏很简洁，但如果所有陌生操作都只剩图标，用户可能无法理解。保留简短提示或一个明确命名的菜单，可以同时支持简明与熟悉感。

### 用知识阅读产品来理解

知识库的核心目标是发现与理解知识。图谱支持探索，搜索支持明确查找；文章需要稳定的返回路径；不同输入能力的访客也需要找到相同内容。私人原始笔记与公开文章之间，应有明确的内容审查边界。

Apple 的 [Materials](https://developer.apple.com/design/human-interface-guidelines/materials) 指南把 Liquid Glass 用于导航与控件所在的功能层，并强调克制使用。正文首先需要稳定、清晰的阅读表面。理解层级原则以后，再决定材质是否适合产品。

### 视频与下一步

上方可播放 Apple 官方 WWDC26 课程 [Principles of great design](https://developer.apple.com/videos/play/wwdc2026/250/)。学习时选择一个界面，找出两项原则之间的取舍，再写出可以验证取舍的用户行为。

继续阅读：[[apple-adaptive-layout|自适应布局]] → [[apple-design-workflow|设计工作流]] → [[apple-accessible-visual-design|可访问的视觉与动效]] → [[apple-design-resources|官方资源与学习路线]]。结合 [[critical-thinking|批判性思考]]，区分官方建议、设计假设与测试证据。
