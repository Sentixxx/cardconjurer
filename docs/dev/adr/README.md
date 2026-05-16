---
title: adr/ 索引
type: index
status: active
summary: 架构决策记录——为什么这么做、考虑过什么替代方案
tags: [adr, navigation]
related:
  - dev/adr/template
  - dev/standards/doc-ownership
---

# `adr/`

承载**决策依据**：为什么选 X 不选 Y。**不承载**契约定义、组合事实、流程编排。

当前已有 ADR 见下方清单；后续重大取舍继续补 ADR（栈本身已固定：React 19 + Vite + wouter + Canvas 2D；资源走 `magic_resources` Git LFS submodule）。

## 编号与流程

- 文件名：`NNNN-slug.md`，从 `0001` 起，顺次累加，不重用
- 模板：[`template.md`](template.md)
- 已废弃的 ADR 移到 `deprecated/`（保留编号）

## 当前 ADR 清单

- `0001`（保留）—— 留给"为什么 React + Vite 而非保留 Next.js"的历史决策归档
- [`0002-canvas-rendering-region-tree.md`](0002-canvas-rendering-region-tree.md)（`proposed`）—— drawCard 重构为 region tree 模板 + 三层渲染管线；自研不引库；PoC 限定 m15Regular；升级 `accepted` 前依赖 6 份 owner 文档承接契约
