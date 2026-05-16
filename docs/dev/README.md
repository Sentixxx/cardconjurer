---
title: 开发文档中心
type: index
status: active
summary: cardforger 开发文档六类子目录（architecture/adr/spec/process/testing/standards）的索引与判定轴
tags: [navigation, dev-docs]
related:
  - root/AGENTS
  - dev/architecture/overview
  - dev/standards/doc-ownership
---

# 开发文档中心

面向实现者。cardforger 是单页 React 应用而非多模块项目，但文档仍按 owner 类型分层，避免「契约 / 决策 / 编排 / 价值标准」混在一起腐烂。

## 目录与主判定轴

| 目录 | 主判定轴 | 读者核心问题 |
|---|---|---|
| [`architecture/`](architecture/) | 组合事实 | 模块怎么组合？依赖怎么走？Canvas pipeline 怎么串？ |
| [`adr/`](adr/) | 决策依据 | 为什么这么做？考虑过什么替代方案？ |
| [`spec/`](spec/) | 契约事实 | 和 CardConjurer 上游 / `magic_resources` / 浏览器 API 之间承诺了什么？ |
| [`process/`](process/) | 编排事实 | 什么时候做？谁负责？门禁怎么触发？ |
| [`testing/`](testing/) | 验证证据模型 | 用什么测试 / 截图 / fixture 证明对齐成立？ |
| [`standards/`](standards/) | 静态产物形态 | 代码、文档、commit、命名应该怎么写？什么算合格？ |

冲突时按 [`standards/doc-ownership.md`](standards/doc-ownership.md) 的 owner 矩阵裁决。每条事实只在一个 owner 定义，其他位置只 link 不复述。

## YAML Frontmatter

所有 active 文档顶部必须有 frontmatter，方便先扫元信息再决定是否全读：

```yaml
---
title: <标题>
type: architecture | adr | spec | process | standards | testing | index | root
status: active | draft | placeholder | deprecated
summary: <≤120 字一句话>
tags: [...]
related: [...]    # 相对 docs/ 的路径
---
```

强制规则见 [`standards/docs-style.md`](standards/docs-style.md)。

## 推荐阅读顺序

### 第一次进入项目

1. [`architecture/overview.md`](architecture/overview.md) — 拓扑 + Canvas pipeline
2. [`architecture/dependencies.md`](architecture/dependencies.md) — 三依赖闸 + wouter 单边界
3. [`spec/canvas-render.md`](spec/canvas-render.md) — 渲染契约（对上游 `setBottomInfoStyle` / `writeText`）
4. [`process/workflow.md`](process/workflow.md) — `/goal` 多轮循环
5. [`standards/pitfalls.md`](standards/pitfalls.md) — 反复踩坑清单

### 改 Canvas 渲染前

1. [`spec/canvas-render.md`](spec/canvas-render.md) — 字体 / 字号 / token / collector 字段表
2. [`spec/text-tokens.md`](spec/text-tokens.md) — rich-text directive 与 import 预处理
3. [`process/parity-check.md`](process/parity-check.md) — CDP driver + side-by-side 流程
4. [`testing/strategy.md`](testing/strategy.md) — 验证证据要求

### 改架构 / 引入新依赖前

1. [`adr/README.md`](adr/README.md) + [`adr/template.md`](adr/template.md) — 起新 ADR
2. [`architecture/dependencies.md`](architecture/dependencies.md) — 依赖闸是否要改
3. [`../../RENDER_PARITY_STATE.md`](../../RENDER_PARITY_STATE.md) §5 — 登记必要性与替代方案

## 目录间引用规则

跨目录引用与冲突裁决统一见 [`standards/doc-ownership.md`](standards/doc-ownership.md) §引用规则 / §冲突裁决——本文不重述。

## 不做的事

- 不在 `dev/` 写最终用户手册
- 不在 `architecture/` 写完整代码片段（写伪代码 / 字段表 / 文件路径）
- 不在 `spec/` 预设具体语言实现（spec 以上游行为 + 我方表现承诺为准）
- 不在 `process/` 复述 `standards/` 的合格条件
