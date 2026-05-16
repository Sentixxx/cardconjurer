---
title: 文档总导航
type: index
status: active
summary: cardforger 文档入口与阅读顺序——开发文档为主线，旧迁移文档归档
tags: [navigation]
related:
  - root/AGENTS
  - dev/README
---

# 文档总导航

cardforger 是 React 19 + Vite + wouter 静态实现的 MTG 卡面生成器。起源参考自 [CardConjurer](https://cardconjurer.com)，但本项目方向是独立产品（详 [`dev/adr/0003-upstream-as-output-reference.md`](dev/adr/0003-upstream-as-output-reference.md)）；上游 conjurer 仅作产物对照参考，渲染字段以 cardforger 自身 spec 为权威。

文档分为两个区：

| 目录 | 用途 | 状态 |
|---|---|---|
| [`dev/`](dev/) | 面向实现者（人/agent）的开发文档主线 | **active** |
| [`_deprecated/`](_deprecated/) | 已弃用历史方案（旧 Next.js 静态导出迁移期） | 仅归档 |

未来如果出现面向最终用户的使用手册，再开 `product/`；面向运维的 runbook，再开 `ops/`。**当前阶段只维护 `dev/`**。

## 第一次进入项目

按顺序读：

1. 仓库根 [`README.md`](../README.md) — 项目栈 / 命令 / 范围决策
2. 仓库根 [`AGENTS.md`](../AGENTS.md) — 协作规则入口 + 文件定位速查
3. [`dev/README.md`](dev/README.md) — 开发文档目录与判定轴
4. [`dev/architecture/overview.md`](dev/architecture/overview.md) — 当前架构总览
5. [`dev/standards/pitfalls.md`](dev/standards/pitfalls.md) — Claude 反复踩坑清单（容器 + render parity 专属）
6. 主线任务：[`../GOAL.md`](../GOAL.md) + [`../RENDER_PARITY_STATE.md`](../RENDER_PARITY_STATE.md)

## 文档风格

- 中文优先；外部接口名 / 文件路径 / 字段保持英文原貌
- 每篇有 YAML frontmatter；schema 见 [`dev/standards/docs-style.md`](dev/standards/docs-style.md)
- 单一信息源（SSOT）：一条事实只有一个 owner，其他位置只 link 不复述；归属规则见 [`dev/standards/doc-ownership.md`](dev/standards/doc-ownership.md)
