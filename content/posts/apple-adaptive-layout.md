---
title: "Apple HIG Layout: Hierarchy, Space and Adaptation"
slug: apple-adaptive-layout
date: 2026-10-13
updated: 2026-10-13
type: concept
public: true
tags: [UX and UI design]
summary: "Use visual hierarchy, progressive disclosure and available space to make a layout remain understandable as its context changes."
links: [apple-human-interface-guidelines, apple-design-workflow, apple-accessible-visual-design, apple-design-resources]
---

## English

### Layout communicates how the product works

Apple's [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) guidance describes layout as the structure that helps people understand content from the moment they open an app. The relationships between content and controls should make features recognizable and discoverable.

**Source boundary:** the principles below summarize the official page, checked on October 13, 2026. The illustrated reading app and browser examples are independent applications, not Apple component specifications.

![A wide reading layout places an index beside an article. A narrower layout moves the index behind a visible control while keeping reading and navigation available.](https://tooonnnnyyy.github.io/knowledge-base/media/apple-hig/adaptive-layout.svg)

*Original study illustration: the available space changes the arrangement; the underlying task remains available.*

### Six decisions that make hierarchy clear

| Decision | HIG guidance | Example for a reading product |
| --- | --- | --- |
| Order | Place important content where people naturally begin reading. | Put the article identity and opening explanation before secondary metadata. |
| Alignment | Use alignment to aid scanning and indentation to signal subordination. | Align related controls; indent child topics beneath their parent. |
| Grouping | Use space, containers or separators to express relationships. | Keep reading actions together and graph navigation together. |
| Progressive disclosure | Start with useful essentials; reveal more when relevant. | Select a topic to reveal its articles without displaying every detail at once. |
| Controls and content | Make functional controls distinct from the content they operate on. | An article paragraph and its close button should not compete visually. |
| Adaptation | Respond to space, text size, localization and system conditions. | Stack adjacent elements when enlarged text no longer fits comfortably. |

Progressive disclosure needs a discoverable entry point. If an important function disappears into an unexplained gesture, the layout has shifted the burden onto the user.

### Design for available space

In iOS and iPadOS, **size classes** describe horizontal and vertical space as compact or regular. Apple recommends making layout decisions from this available space rather than assuming that a device name or orientation tells the whole story.

When space changes, functionality should remain available. A sidebar can become a clearly labeled navigation control; secondary actions can move into an overflow menu. People should recognize the relationship between the two arrangements.

For a website, the transferable principle is to respond to the actual viewport or container. CSS breakpoints are a web implementation choice; they are not Apple's native size-class API.

### Safe areas and reading width

Safe areas keep essential content clear of hardware cutouts and system or app controls. Background artwork can extend to an edge while important text and buttons remain unobstructed. Layout guides and margins also help constrain long text to a comfortable reading measure.

For a graph reader, test the article at both its side-panel width and expanded width. A full-window reading view can still keep paragraphs in a narrower central column. Enlarging the container does not require stretching every line across the display.

### Review the extremes first

- Open the narrowest and widest supported windows.
- Increase the text size; check wrapping, overlapping and truncated labels.
- Try short and long content, empty states and translated labels.
- Check that fixed toolbars do not cover content or the last interactive element.
- Navigate into detail and back; preserve a recognizable position and context.

These are review prompts, not a claim that a particular product has passed them. Feed failures into [[apple-design-workflow|the design workflow]] and pair layout checks with [[apple-accessible-visual-design|typography and accessibility checks]].

### Watch with a specific question

In [Design foundations from idea to interface](https://developer.apple.com/videos/play/wwdc2025/359/), start at **08:19 — Content** for grouping and progressive disclosure, then **13:28 — Visual Design** for hierarchy and adaptation. Ask why a list works better than a grid for the example's structured content.

For implementation-oriented context, see [Compose custom layouts with SwiftUI](https://developer.apple.com/videos/play/wwdc2022/10056/), which the Layout page links as a further resource. Return to [[apple-human-interface-guidelines|the principles map]] or [[apple-design-resources|the resource library]] for the broader route.

## 中文

### 布局在解释产品怎样工作

Apple 的 [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) 指南强调：用户打开界面时，就应该能通过内容与控件之间的关系理解结构。排版的作用包括建立优先级、帮助扫描，以及让功能容易发现。

**来源边界：**以下原则整理自官方页面，核对日期为 2026 年 10 月 13 日。配图中的阅读产品与浏览器案例属于应用示例，不是 Apple 的组件尺寸规范。

### 六个关键判断

| 判断 | 原则 | 阅读产品中的例子 |
| --- | --- | --- |
| 阅读顺序 | 重要内容放在自然阅读的起点。 | 先看清文章和核心内容，再看次要 metadata。 |
| 对齐与缩进 | 对齐表达关联，缩进表达从属。 | 子 topic 在父 topic 下方缩进。 |
| 分组 | 用间距、容器或分隔线表达关系。 | 阅读操作与图谱操作分别组成清楚的组。 |
| 渐进披露 | 先呈现必要内容，在相关时机展开细节。 | 先选 topic，再看其文章与相关概念。 |
| 控件与内容 | 操作层要容易识别。 | 关闭按钮不应像正文的一部分。 |
| 自适应 | 响应空间、文字大小、语言与系统条件。 | 大字模式下，把横向元素改为纵向堆叠。 |

Progressive disclosure（渐进披露）需要一个可发现的入口。重要功能如果只能靠猜测手势才能找到，会增加用户负担。

### 根据可用空间决定结构

iOS/iPadOS 的 **size classes** 用 compact、regular 描述横向与纵向可用空间。设备型号、横竖屏名称不能完整说明一个窗口实际有多大。

空间变化时，功能仍然要可达。侧边栏可以收进导航入口，次要操作可以放入菜单，但用户应能理解新旧布局之间的关系。迁移到 Web 时，可以通过 viewport、container 和 CSS 断点实现这个原则；网页断点不等于原生 size-class API。

### 安全区域与阅读宽度

Safe areas（安全区域）防止关键内容被硬件开孔、工具栏或其他界面遮挡。背景可以延伸到边缘，重要文字与操作则保持可见。

全屏阅读仍然可以使用居中的正文列，让一行文字保持舒适长度。图谱阅读器至少需要分别检查侧栏宽度与展开宽度。

### 先测极端状态

- 最窄与最宽的支持窗口。
- 大字模式下是否换行合理、有无重叠或截断。
- 空内容、短内容、长标题与翻译后的标签。
- 固定工具栏是否遮住正文或最后一个操作。
- 进入文章再返回后，是否保留位置与上下文。

这些是评审方法，不代表某个产品已经通过测试。发现的问题可以进入 [[apple-design-workflow|设计工作流]]，并结合 [[apple-accessible-visual-design|字体、主题与可访问性]] 一起检查。

### 对应视频

[Design foundations from idea to interface](https://developer.apple.com/videos/play/wwdc2025/359/) 的 **08:19 — Content** 讲分组与渐进披露，**13:28 — Visual Design** 讲层级与适应性。观看时思考：示例中的列表为什么比网格更适合表达结构化信息？

实现层可继续看 [Compose custom layouts with SwiftUI](https://developer.apple.com/videos/play/wwdc2022/10056/)。通过 [[apple-human-interface-guidelines|设计原则地图]] 和 [[apple-design-resources|资源库]] 继续扩展。
