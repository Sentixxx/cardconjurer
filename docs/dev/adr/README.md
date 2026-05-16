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
- [`0002-canvas-rendering-region-tree.md`](0002-canvas-rendering-region-tree.md)（`proposed`）—— drawCard 重构为 region tree 模板 + 三层渲染管线；自研不引库；PoC 限定 m15Regular；升级 `accepted` 前依赖 6 份 owner 文档承接契约。**注**：本 ADR 决议建立在 canvas 基底前提下；ADR-0004 提出换基底到 SVG 后，本 ADR 决策点（L1/L2/L3 walker / NumExpr / CondExpr / custom paint 白名单）失效，待 ADR-0004 `accepted` 时同步改 `superseded`
- [`0003-upstream-as-output-reference.md`](0003-upstream-as-output-reference.md)（`proposed`）—— 上游 conjurer 从「字面量 ground truth」降级为「产物验证参考」；cardforger 字段权威收归自身 spec；渲染选型（Canvas vs DOM）留作后续 ADR
- [`0004-svg-rendering-stack-with-satori.md`](0004-svg-rendering-stack-with-satori.md)（`proposed`）—— 渲染基底由 vanilla canvas 切换到纯 SVG；外层 SVG（含 `<mask>` `<filter>` `<clipPath>`）React 手写，文字 region 经 Satori（HTML/CSS subset → SVG `<path>`）渲染；canvas 仅作 PNG 导出临时画板；三依赖闸扩容收纳 satori；supersedes ADR-0002；升级 `accepted` 前依赖 6 份 owner 文档承接契约
