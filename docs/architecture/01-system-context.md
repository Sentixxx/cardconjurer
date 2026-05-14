# 01 系统上下文

## 项目定位

Card Forger 是 Card Conjurer 的迁移工作区。它不是从零重写的新前端，而是在保留
legacy 公开路径和行为的前提下，逐步把项目拆成更清晰的源码、资源、平台和现代
框架层。

项目的核心约束是兼容：

- 历史路径如 `/img/...`、`/fonts/...`、`/js/...`、`/creator/index.html` 要继续可用。
- legacy HTML 入口要被现代框架覆盖，但输出仍写回历史 `dist/` 路径。
- 迁移时要通过 baseline 测试证明差异是有意的、等价的，或者被明确记录。

## 运行形态

生产形态是静态站点：

- 没有长期运行的前端端口。
- 没有应用后端 API。
- 页面交互由浏览器 JavaScript 执行。
- 卡牌渲染依赖 canvas。
- 导入真实卡牌依赖浏览器直接请求外部数据源。
- 保存依赖浏览器 localStorage。
- 批量导出依赖浏览器端 JSZip。
- 本地数据库导入按需加载 sql.js 和静态 SQLite 文件。

## 主要参与者

- 用户浏览器：加载静态页面、执行 editor runtime、请求图片素材、执行 canvas 导出。
- OSS/CDN：托管 `dist/` 静态输出，负责缓存、压缩、HTTPS 和大资源分发。
- legacy source：只读来源树，用于导入和 baseline 对比。
- Card Forger repo：迁移后的工作区和构建源码。
- 外部卡牌数据源：Scryfall、MTGCH、本地 SQLite 数据文件。

## 目录职责

| 目录 | 职责 | 是否源码 |
| --- | --- | --- |
| `src/app/` | legacy 浏览器应用文件、JS、CSS、HTML fragment、部分 gallery 图 | 是 |
| `src/framework/` | 现代 HTML 渲染层、页面组件、路由清单 | 是 |
| `app/` | Next.js App Router route handler | 是 |
| `resources/` | 字体、图片、牌框、符号、local art 等静态资源 | 是 |
| `platform/` | Docker、Nginx、launcher、上传脚本等平台文件 | 是 |
| `scripts/` | 导入、构建、验证、本地 serve、迁移状态脚本 | 是 |
| `test/` | 测试和迁移门禁 | 是 |
| `dist/` | 生成的兼容公开输出 | 否 |
| `out/` | Next.js 静态导出中间产物 | 否 |
| `.next/` | Next.js 构建中间产物 | 否 |
| `manifests/` | 导入 baseline manifest | 生成/受控输入 |

## 数据流总览

```text
legacy source tree
  │
  │ npm run import:source
  ▼
src/app/ + resources/ + platform/ + manifests/source-baseline.json
  │
  │ npm run build
  ├── Next.js static export -> out/
  └── legacy-compatible copy/overlay
  ▼
dist/
  │
  │ upload/sync
  ▼
OSS + CDN
  │
  ▼
browser runtime + canvas editor
```

## 兼容边界

当前最重要的边界不是“React/Next 组件边界”，而是 public path 兼容边界。

这意味着：

- `dist/` 必须长得像历史站点。
- `src/framework` 可以现代化 HTML 生成方式，但不能随意改变 DOM 契约。
- `creator-23.js` 和 `js/frames/*.js` 仍依赖大量全局函数、DOM ID 和 inline handler。
- 资源 URL 改造必须优先保持 `/img/...` 等历史路径可解释，或集中走 `fixUri` 类策略。

