---
title: Card Forger 项目总览（已弃用）
type: index
status: deprecated
summary: 旧 Next.js 迁移期总览；当前总览入口在 docs/dev/architecture/overview.md
tags: [deprecated, history]
---

> **DEPRECATED**：本文档地图指向旧 architecture/01–10 分册（Next.js 静态导出），均已归档。当前总览见 [`docs/dev/architecture/overview.md`](../../dev/architecture/overview.md)。

# Card Forger 项目总览

更新时间：2026-05-14

这份文档是项目架构入口。完整分册位于 `docs/architecture/`。

## 文档地图

- [架构文档索引](architecture/README.md)
- [01 系统上下文](architecture/01-system-context.md)
- [02 构建、导入与迁移流水线](architecture/02-build-and-migration.md)
- [03 前端框架与页面渲染](architecture/03-frontend-framework.md)
- [04 Creator 编辑器运行时](architecture/04-creator-runtime.md)
- [05 静态资源、OSS 与 CDN 部署](architecture/05-assets-and-deployment.md)
- [06 测试体系与质量门禁](architecture/06-testing-and-quality-gates.md)
- [07 后续拆分路线图](architecture/07-refactor-roadmap.md)
- [08 代码地图与关键文件](architecture/08-code-map.md)
- [09 目标文件架构](architecture/09-target-file-architecture.md)
- [10 文件架构迁移计划](architecture/10-file-architecture-migration-plan.md)

## 一句话定位

Card Forger 是一个面向静态部署的 Card Conjurer 迁移工作区。项目保留旧站点的
公开路径布局作为兼容契约，同时把可编辑代码、静态资源、平台文件和现代框架
渲染层拆开管理。

生产形态不是后端服务，而是静态文件：

```text
只读 legacy source
  -> import-source 分类导入
  -> src/app + resources + platform
  -> next build 静态导出
  -> scripts/build.mjs 生成 dist
  -> scripts/build-release.mjs 从 dist 拆出 release/site + release/assets-hires + release/platform
  -> OSS/CDN 托管
```

## 当前结论

- HTML 路由层已经完成现代框架迁移：16 个 legacy HTML 入口均由
  `src/framework/routes.mjs` 和 `app/**/route.js` 覆盖。
- 当前 source baseline 计数为 `app: 693`、`resources: 14838`、`platform: 16`。
- `creator/index.html` 的静态页面结构已经组件化，核心编辑器运行时仍集中在
  `src/app/js/creator-23.js`；asset URL、frame preload、text fonts、text-field
  lookup、write-text content、write-text conditional color、write-text style、
  write-text mana、write-text transform、write-text roll、write-text controls、write-text positioning、write-text layout、
  saved-card data/key、import option helper、import search-options helper、import URL、import card basics、import printing、import text-preservation、import multi-faced、
  import clipboard-text parser、import unique-layout、import station-layout、import station parser、import roll parser、import text fields、import planeswalker、import saga、import class、
  import unique-layout parsers 纯 helper 已先移到
  `src/creator/`，再由 build 注入到兼容 `/js/creator-23.js`。
- 项目的最大体验瓶颈不是 JS 体积，而是 `resources/img/frames` 下 4GB 级别的
  高清牌框素材。
- `dist/` 是生成兼容输出，不应作为源码手工编辑。
- `release/site` 是 OSS 主站发布集，不再等同于完整 `dist/`；高清 frame 和平台文件被拆到
  独立 release target。
- 当前目录结构是迁移阶段结构，不是目标结构；目标结构应区分源码、运行时、
  资源、发布和平台边界。
- OSS 部署应优先采用“应用壳 + 缩略图 + 冷高清资源 CDN”的资源分层策略。
- `npm test` 会先重建 `dist/`、`out/`、`.next`，不是只读检查命令。

## 关键目录

- `src/app/`：浏览器应用代码和 legacy 前端文件。
- `src/creator/`：Creator 目标运行时模块边界，目前先放 asset URL、frame preload、
  text fonts、text-field lookup、write-text content、write-text conditional color、
  write-text style、write-text mana、write-text transform、write-text roll、write-text controls、write-text positioning、write-text layout、write-text
  saved-card data/key、import clipboard-text parser、import option helper、import search-options helper、import URL、import card basics、import printing、import
  text-preservation、import multi-faced、import unique-layout、import station-layout、import
  station parser、import roll parser、import text fields、
  import planeswalker、import saga、import class、import unique-layout parsers 纯 helper 和 README。
- `src/shell/`、`src/page-components/`、`src/legacy/`：目标源码目录骨架，目前只记录边界，不参与构建。
- `src/framework/`：Preact/Next 静态渲染使用的现代页面组件和路由清单。
- `app/`：Next.js App Router route handler，薄封装到 `src/framework`。
- `resources/`：字体、图片、牌框、符号、本地素材等大资源。
- `assets/`：目标资源边界骨架，目前不参与构建；现有 public asset 仍在 `resources/`。
- `platform/`：Docker、Nginx、launcher、上传脚本等平台文件。
- `deploy/`：部署策略源码，目前包含 OSS/CDN release policy。
- `scripts/`：导入、构建、验证、迁移状态和本地静态服务脚本。
- `test/`：baseline、framework、creator、性能和 public asset 测试。
- `dist/`：生成的历史公开路径兼容输出。
- `release/`：生成的发布集输出，包含 `site`、`assets-hires` 和 `platform`。

## 立刻相关的风险

- `creator-23.js` 仍是全局脚本，承担状态、渲染、导入、保存和资源加载等多类职责；
  后续拆分必须继续保持 build 生成的 `/js/creator-23.js` 兼容入口。
- `js/frames/*.js` 是动态加载的全局脚本，不是 ES module 数据层。
- 高清 PNG 进入 canvas，跨域资源域名必须正确配置 CORS。
- 当前 `npm run verify` 应通过；此前的 `mom-*`、`one-*` SVG newline mismatch 已对齐，
  `upload.bat` 已登记为有意差异。
- `npm run build:release` 已可从当前 `dist/` 生成分层发布集；部署主站时不要把完整
  `dist/` 直接同步到 OSS 根目录。
