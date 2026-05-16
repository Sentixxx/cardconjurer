---
title: 架构文档索引（已弃用）
type: index
status: deprecated
summary: Next.js 静态导出方案的历史架构索引；当前实现已切换为 React 19 + Vite，事实失效
tags: [deprecated, history]
related:
  - root/AGENTS
  - dev/architecture/overview
---

# 架构文档索引

> **DEPRECATED**：本目录描述 Next.js 静态导出 + legacy HTML 复制方案，已被 React 19 + Vite SPA 取代。当前架构看 [`docs/dev/architecture/overview.md`](../../../dev/architecture/overview.md)。

更新时间：2026-05-14

本目录用于承载 Card Forger 的中文架构文档。文档目标是让后续改造有共同语境：
哪些目录是源码、哪些目录是生成物、哪些兼容契约不能破坏，以及为什么 Creator
编辑器需要按阶段拆分。

## 阅读顺序

1. [系统上下文](01-system-context.md)
2. [构建、导入与迁移流水线](02-build-and-migration.md)
3. [前端框架与页面渲染](03-frontend-framework.md)
4. [Creator 编辑器运行时](04-creator-runtime.md)
5. [静态资源、OSS 与 CDN 部署](05-assets-and-deployment.md)
6. [测试体系与质量门禁](06-testing-and-quality-gates.md)
7. [后续拆分路线图](07-refactor-roadmap.md)
8. [代码地图与关键文件](08-code-map.md)
9. [目标文件架构](09-target-file-architecture.md)
10. [文件架构迁移计划](10-file-architecture-migration-plan.md)

## 架构分层

```text
┌─────────────────────────────────────────────────────────────┐
│ OSS/CDN 静态托管                                             │
│   dist/ 兼容公开路径输出                                      │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ scripts/build.mjs
┌─────────────────────────────┴─────────────────────────────┐
│ Next 静态导出 out/ + legacy 文件复制                         │
└─────────────────────────────┬─────────────────────────────┘
                              ▲
             ┌────────────────┼────────────────┐
             │                │                │
       src/framework       src/app          resources/platform
       现代 HTML 层        legacy 运行时     静态资源和平台文件
```

## 当前事实摘要

- 项目要求 Node.js `>=22`。
- 生产输出是静态文件，不依赖 Node 服务端运行时。
- 当前 baseline manifest 计数为 `app: 693`、`resources: 14838`、`platform: 16`。
- `src/framework/routes.mjs` 覆盖 16 个 legacy HTML 入口。
- `creator/index.html` 是 `performance-override` 路由，HTML 结构已组件化。
- `src/app/js/creator-23.js` 仍是 Creator 的核心运行时单体。
- `resources/img/frames` 是最大资源热点，约 4.22GB。
- 迁移门禁以只读 legacy source 为基准，允许少量 documented overrides 和框架等价输出。
- 当前目录结构是迁移兼容结构，不是目标文件架构。
