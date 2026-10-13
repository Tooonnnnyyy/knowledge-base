---
title: "Accessible Visual Design: Type, Color, Materials and Motion"
slug: apple-accessible-visual-design
date: 2026-10-13
updated: 2026-10-13
type: concept
public: true
tags: [UX and UI design]
summary: "Apply Apple's visual guidance to readable typography, consistent color meaning, restrained materials and motion that people can control."
links: [apple-human-interface-guidelines, apple-adaptive-layout, apple-design-workflow, apple-design-resources]
---

## English

### Visual design supports comprehension and control

Apple describes accessible interfaces as **intuitive, perceivable and adaptable**. This connects visual decisions to real abilities and circumstances: a person may enlarge text, use a keyboard, read in strong light or choose to reduce motion.

This note summarizes official [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [Typography](https://developer.apple.com/design/human-interface-guidelines/typography), [Color](https://developer.apple.com/design/human-interface-guidelines/color), [Materials](https://developer.apple.com/design/human-interface-guidelines/materials) and [Motion](https://developer.apple.com/design/human-interface-guidelines/motion) guidance, checked on October 13, 2026. Theme and graph examples are independent applications.

![Three reading themes retain the same content hierarchy and labeled category meaning. A separate example shows full motion and reduced motion communicating the same selection.](https://tooonnnnyyy.github.io/knowledge-base/media/apple-hig/visual-system.svg)

*Original concept illustration, not a contrast certification or an Apple color specification.*

### Typography: preserve hierarchy as text grows

Choose legible sizes and weights, minimize unnecessary typeface changes and distinguish headings from body text. Apple recommends system text styles and Dynamic Type where available. A custom typeface still needs equivalent accessibility behavior.

At larger sizes, allow containers to grow and adjacent elements to stack. Avoid hiding important text through truncation. Test actual paragraphs and long labels, not only short placeholder content. On the web, browser zoom and text resizing require their own implementation and checks.

### Color: give it a stable meaning

Use color consistently: a color used for an interactive action should not simultaneously suggest that unrelated static text is clickable. Apple recommends semantic system colors on its platforms because their appearance adapts to context and accessibility settings.

For a custom web system, define roles such as **background, reading surface, primary text, secondary text, link, focus and selected item**. Supply suitable values in each theme and test every relevant foreground/background combination. A warm paper-colored theme is an optional product choice; its tint alone does not establish readability or an eye-health benefit.

Never make color the only way to communicate a category or status. Pair it with a readable label, shape, icon or equivalent text. In a graph, topic color can stay consistent across themes while labels and a topic list provide additional ways to understand it.

### Materials: keep the content easy to read

Apple describes Liquid Glass as a distinct layer for navigation and controls, and recommends using it sparingly. Content backgrounds use appropriate standard materials instead. If a translucent control floats over moving or colorful content, check its legibility in those actual conditions.

### Motion: communicate a change without taking control

Apple recommends purposeful, brief and precise motion, realistic feedback and ways to cancel or avoid animation. Do not require people to wait through repeated transitions before continuing their task.

For a connected graph, one consistent motion rule can describe movement along every edge. The meaning needs to be explicit: a visual pulse does not prove that live data is being transmitted. If edges mean association, a one-way pulse must not imply a causal or dependency direction that the data does not contain. A reduced-motion state should preserve the connections, selected node and relationship information without relying on continuous movement. These are application recommendations derived from the HIG, not Apple graph specifications.

### Review checklist

- Can a person complete the main task with a keyboard and visible focus?
- Do icon-only controls have clear accessible names and helpful contextual labels?
- Is information understandable without distinguishing colors?
- Do larger text and zoom preserve content and available actions?
- Have contrast and legibility been checked in each supported theme?
- Can automatic movement be reduced, with the same information still available?
- Do video and audio have user controls and an appropriate text alternative?

### Watch: making text adaptable

```video
https://devstreaming-cdn.apple.com/videos/wwdc/2024/10074/4/3CB84B8B-3CC6-4EAB-AA46-E9FD7D160048/downloads/wwdc2024-10074_sd.mp4?dl=1
Apple WWDC24 — Get started with Dynamic Type. Official guidance for text that responds to people's preferred size.
```

[Official session and available transcript](https://developer.apple.com/videos/play/wwdc2024/10074/). Compare a default-size screen with its largest supported text setting and list what must reflow.

For spatial experiences, [Design considerations for vision and motion](https://developer.apple.com/videos/play/wwdc2023/10078/) discusses visionOS comfort. Its platform-specific details should not be treated as universal browser requirements. See [[apple-design-resources|the annotated resource library]] for typography and materials sessions.

Use these checks inside [[apple-design-workflow|the design workflow]], alongside [[apple-adaptive-layout|layout adaptation]] and [[apple-human-interface-guidelines|the principles of agency and flexibility]].

## 中文

### 视觉设计要支持理解与控制

Apple 将可访问的界面概括为 **Intuitive、Perceivable、Adaptable**：容易理解，信息能够被感知，并能适应用户的使用方式。大字、键盘、强光或减少动态效果，都是实际使用情境。

本篇依据官方 [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)、[Typography](https://developer.apple.com/design/human-interface-guidelines/typography)、[Color](https://developer.apple.com/design/human-interface-guidelines/color)、[Materials](https://developer.apple.com/design/human-interface-guidelines/materials) 与 [Motion](https://developer.apple.com/design/human-interface-guidelines/motion) 整理，核对日期为 2026 年 10 月 13 日。主题与图谱案例是应用建议。

### 字体：放大后仍能读懂层级

选择清晰的字号与字重，减少无必要的字体混用，让标题与正文各有作用。Apple 原生平台可使用系统文字样式与 Dynamic Type；自定义字体也需要对应的适应能力。

大字模式下，容器可以变高，横向元素可以堆叠，重要文字应尽量避免截断。用真实段落和长标题检查，不能只依赖短占位文本。Web 的浏览器缩放与文字放大，需要单独实现和验证。

### 颜色：保持语义稳定

颜色应保持一致含义。如果一种颜色表示可操作状态，就要避免让相近的静态文字看起来也可点击。Apple 推荐使用能够适应环境的 semantic system colors（语义系统色）。

Web 可以按 **背景、阅读表面、主文字、次文字、链接、焦点、选中项** 定义角色，再分别配置各主题的数值。纸质暖色主题属于产品选择，暖色本身不能证明可读性，也不能据此宣称有护眼疗效。

Topic 颜色可以跨主题保持对应关系，但还需要名称、图标、形状或列表，让不能区分颜色的访客也能理解内容。

### 材质：正文需要稳定的阅读表面

Apple 把 Liquid Glass 定位为导航与操作所在的功能层，并建议克制使用。正文背景使用适合阅读的表面。半透明控件如果覆盖彩色或移动内容，就需要在这些真实背景上检查文字和图标是否清楚。

### 动效：解释变化，让用户掌握节奏

Motion 指南强调有目的、简短、准确、符合预期，并允许取消或减少动画。重复操作不应总被长动画阻塞。

图谱可以让每条连接采用统一的动态规则。但动态含义必须清楚：光点移动不代表正在真实传输数据；如果连接只表示相关性，单向运动也不应暗示不存在的因果或依赖方向。Reduce Motion 模式应保留节点关系与选中反馈，而不依赖持续移动。这些是从 HIG 推导的应用建议，不是 Apple 的图谱规范。

### 评审清单

- 键盘能否完成主要任务，焦点是否可见？
- 纯图标控件是否有清楚的无障碍名称与必要提示？
- 不区分颜色时，信息是否仍然可理解？
- 文字放大后，内容与操作是否完整？
- 每个主题是否分别检查了对比度与可读性？
- 减少动态效果以后，相同信息是否仍然存在？
- 多媒体是否可由用户控制，并有适当文字替代？

### 视频与关联内容

上方 [Get started with Dynamic Type](https://developer.apple.com/videos/play/wwdc2024/10074/) 可配合练习：比较默认字号和最大支持字号，列出需要重排的元素。

[Design considerations for vision and motion](https://developer.apple.com/videos/play/wwdc2023/10078/) 讨论 visionOS 视觉舒适度；平台专属细节不能直接当成全部网页的要求。更多视频见 [[apple-design-resources|资源库]]。将清单放入 [[apple-design-workflow|设计流程]]，与 [[apple-adaptive-layout|布局]]、[[apple-human-interface-guidelines|自主权和适应性原则]] 一起评审。
