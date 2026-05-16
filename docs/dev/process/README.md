---
title: process/ 索引
type: index
status: active
summary: 编排事实——何时做、谁负责、按哪份 standards 检查、失败如何处理
tags: [process, navigation]
related:
  - dev/process/workflow
  - dev/process/parity-check
---

# `process/`

承载**流程编排**。**不承载**价值标准本体（→ `standards/`）、契约（→ `spec/`）、决策（→ `adr/`）。checklist 项只能写"按 `standards/X.md` 检查 Y"，不复述 X 的合格条件。

- [`workflow.md`](workflow.md) — `/goal` 多轮循环每轮的工作流、端口约定、状态文件落盘
- [`parity-check.md`](parity-check.md) — 上游同卡 fixture 对照流程（CDP driver / 区段切图）
- [`docs-read.md`](docs-read.md) — 渐进式文档披露与作废文档读取规则

commit message 形态约束在 [`../standards/commit-style.md`](../standards/commit-style.md)（属价值标准，不属编排）；何时打 commit / 提交节奏目前没有独立的 process 文档，跟在 [`workflow.md`](workflow.md) §5 落盘步骤里。
