---
title: spec/ 索引
type: index
status: active
summary: 契约事实——与 CardConjurer 上游、magic_resources 资源、wouter 路由、浏览器 API 之间的承诺
tags: [spec, navigation]
related:
  - dev/spec/canvas-render
  - dev/spec/text-tokens
  - dev/spec/assets
  - dev/spec/routing
---

# `spec/`

承载**契约事实**：cardforger 对外（上游 baseline / 资源仓 / 浏览器 / URL）承诺**是什么**。**不承载**决策论述（→ `adr/`）、组合事实（→ `architecture/`）、产物形态（→ `standards/`）。

cardforger 不是多模块产品，没有内部跨包接口；这里的 spec 全部是**外向**契约——

- [`canvas-render.md`](canvas-render.md) — `drawCard` 流水线字段表（字体 / 字号 / collector 6 段 / 渲染流水线）；字段权威由本文件承载（详 [`adr/0003-upstream-as-output-reference.md`](../adr/0003-upstream-as-output-reference.md)）
- [`text-tokens.md`](text-tokens.md) — `drawRichText` 支持的 directive 集合 + import 预处理规则
- [`assets.md`](assets.md) — `public/` 资源路径契约 + `magic_resources` 初始化流程 + 不入 git 的目录清单
- [`routing.md`](routing.md) — `wouter` route manifest（`src/lib/router.ts` 是单一权威）
