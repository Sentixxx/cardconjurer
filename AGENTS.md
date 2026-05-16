---
title: AGENTS.md（cardforger 协作规则入口）
type: root
status: active
summary: cardforger 协作规则入口索引——七条核心原则的陈述 + 文件定位速查；规则本体在 docs/dev/ 按 owner 矩阵分布
tags: [workflow, navigation, ssot]
related:
  - root/README
  - dev/README
  - dev/standards/doc-ownership
  - dev/standards/pitfalls
---

# AGENTS.md

> 本文件是 cardforger 协作规则的**入口索引**，叠加在 agent 自身的全局规则之上。规则本体在 [`docs/dev/`](docs/dev/) 下按 [doc-ownership 矩阵](docs/dev/standards/doc-ownership.md) 分布；本文件只承载核心原则的陈述与文件定位速查。

## 核心原则（不可违反）

每条原则的本体（理由、判据、Reviewer 拒稿条件）由 owner 文档承载，本文件只列陈述 + 单链接。

1. **中文优先**：所有协作输出（commit / 文档 / 状态文件）默认中文 → [`docs/dev/standards/docs-style.md`](docs/dev/standards/docs-style.md)
2. **上游基线只读**：`/workspace/cardconjurer/` 与 `src/legacy-app/` 不在 cardforger 提交里出现 diff → [`docs/dev/standards/pitfalls.md` §上游基线只读](docs/dev/standards/pitfalls.md#上游基线只读)
3. **三依赖闸**：顶层运行时只允许 `react` / `react-dom` / `wouter`；扩容判据 → [`docs/dev/standards/coding.md` §顶层依赖闸](docs/dev/standards/coding.md#顶层依赖闸)
4. **wouter 单边界**：`from 'wouter'` 字符串只许出现在 `src/lib/router.ts` → [`docs/dev/architecture/dependencies.md` §wouter-单边界](docs/dev/architecture/dependencies.md#wouter-单边界)
5. **资源不入 git**：运行时资源由 `magic_resources` 填充；不跟踪目录清单 → [`docs/dev/spec/assets.md`](docs/dev/spec/assets.md)
6. **上游产物对照**：渲染产物在 parity-check 流程下与上游同卡渲染保持视觉合理范围；字段值以 cardforger 自身 spec 为准，**不以上游 HEAD 为字面量权威** → [`docs/dev/adr/0003-upstream-as-output-reference.md`](docs/dev/adr/0003-upstream-as-output-reference.md)
7. **SSOT**：每条事实只在唯一 owner 定义，其他位置只 link 不复述 → [`docs/dev/standards/doc-ownership.md`](docs/dev/standards/doc-ownership.md)

## 第一次进入项目

按顺序读：

1. [`README.md`](README.md) — 项目栈 / 命令 / 范围决策
2. 本文件 — 协作规则
3. [`docs/dev/README.md`](docs/dev/README.md) — 开发文档目录与判定轴
4. [`docs/dev/architecture/overview.md`](docs/dev/architecture/overview.md) — 模块拓扑与 Canvas pipeline
5. [`docs/dev/standards/pitfalls.md`](docs/dev/standards/pitfalls.md) — 反复踩坑清单
6. 当前任务：[`GOAL.md`](GOAL.md) + [`RENDER_PARITY_STATE.md`](RENDER_PARITY_STATE.md)

## 文件定位速查

| 想做什么 | 先看哪里 |
|---|---|
| 看仓库架构总览 / 模块拓扑 | [`docs/dev/architecture/overview.md`](docs/dev/architecture/overview.md) |
| 看依赖方向 / wouter 边界 / `magic_resources` 资源 | [`docs/dev/architecture/dependencies.md`](docs/dev/architecture/dependencies.md) |
| 看 Canvas 渲染契约（字体 / collector 6 段 / 字号） | [`docs/dev/spec/canvas-render.md`](docs/dev/spec/canvas-render.md) |
| 看 rich-text token / import 预处理规则 | [`docs/dev/spec/text-tokens.md`](docs/dev/spec/text-tokens.md) |
| 看 `public/` 资源路径契约 / `magic_resources` 初始化 | [`docs/dev/spec/assets.md`](docs/dev/spec/assets.md) |
| 看路由清单 / 增减页面 | [`docs/dev/spec/routing.md`](docs/dev/spec/routing.md) |
| 启动 dev / preview / 上游服务（端口 7001–7020） | [`docs/dev/standards/pitfalls.md` §容器与端口](docs/dev/standards/pitfalls.md#容器与端口) |
| 跑 `/goal` 一轮迭代 | [`docs/dev/process/workflow.md`](docs/dev/process/workflow.md) |
| 与上游做同卡截图对照 | [`docs/dev/process/parity-check.md`](docs/dev/process/parity-check.md) |
| 起 ADR / 判 ADR 写法是否合格 | [`docs/dev/adr/README.md`](docs/dev/adr/README.md) + [`docs/dev/adr/template.md`](docs/dev/adr/template.md) |
| 判命名 / 抽象引入 / 注释是否合格 | [`docs/dev/standards/coding.md`](docs/dev/standards/coding.md) |
| 写 / 维护文档（frontmatter / 篇幅 / 中英排） | [`docs/dev/standards/docs-style.md`](docs/dev/standards/docs-style.md) |
| 决定一段内容该住到哪份 owner 文档 | [`docs/dev/standards/doc-ownership.md`](docs/dev/standards/doc-ownership.md) |
| 写 commit message | [`docs/dev/standards/commit-style.md`](docs/dev/standards/commit-style.md) |
| 看测试 / 验证证据策略 | [`docs/dev/testing/strategy.md`](docs/dev/testing/strategy.md) |
| 读 `_deprecated/` 或废文档流程 | [`docs/dev/process/docs-read.md`](docs/dev/process/docs-read.md) |
| 反复踩坑速查（容器 / parity / CDP） | [`docs/dev/standards/pitfalls.md`](docs/dev/standards/pitfalls.md) |

## 渐进披露

不确定一份文档是否相关时，先 `head -10 <path>` 看 frontmatter（`summary` / `related`）判断；命中再决定全读。详 [`docs/dev/process/docs-read.md`](docs/dev/process/docs-read.md)。

## 不做的事

- 不在本文件展开规则本体（只列陈述 + 单链接，规则本体在 owner 文档）
- 不在 owner 文档复述本文件的速查表
- 不在 `/goal` 循环里改本文件（结构变更属于另一项专门任务）
