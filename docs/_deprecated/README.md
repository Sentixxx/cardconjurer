---
title: 已弃用文档归档
type: index
status: deprecated
summary: 仅用于历史溯源；当前 React 19 + Vite + wouter 架构的文档入口在 docs/dev/
tags: [archive, history]
related:
  - root/AGENTS
  - dev/architecture/overview
---

# 已弃用文档归档

本目录的文档已不反映当前实现。当前架构（React 19 + Vite + wouter 静态 SPA）的入口请看 [`../dev/README.md`](../dev/README.md)。

## 归档原因

- [`legacy-migration/`](legacy-migration/) — 描述项目前一次基于 **Next.js App Router 静态导出 + legacy HTML 复制** 的迁移方案。2026-05-14 起项目改为纯 React 19 + Vite 静态构建，整个 Next.js 静态导出层（`app/**/route.js`、`src/framework/`、`scripts/build.mjs` import-source 流水线、`next.config.mjs`）被移除，对应的 `01-system-context.md`–`10-file-architecture-migration-plan.md` / `modern-framework-migration.md` / `migration-plan.md` / `project-overview.md` 中的事实均已失效。仅保留作为历史溯源。

## 阅读规则

- 默认不读；当前实现请走 `docs/dev/`
- 文档结尾不再维护、不做事实校准
- 新文档不引用本目录任何文件作为权威；如需引用历史决策，写一条 ADR 把背景重述
