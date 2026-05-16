---
title: architecture/ 索引
type: index
status: active
summary: 组合事实——cardforger 模块拓扑、依赖方向、Canvas 渲染流水线
tags: [architecture, navigation]
related:
  - dev/architecture/overview
  - dev/architecture/dependencies
---

# `architecture/`

承载**组合事实**：代码模块怎么组合、依赖怎么走、数据流怎么串。**不承载**契约定义（→ `spec/`）、决策论述（→ `adr/`）、价值标准（→ `standards/`）。

- [`overview.md`](overview.md) — 模块拓扑 + Canvas pipeline + 主要数据流
- [`dependencies.md`](dependencies.md) — 顶层运行时依赖闸 + wouter 单边界 + 资源契约
