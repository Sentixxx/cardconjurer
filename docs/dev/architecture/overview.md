---
title: 架构总览
type: architecture
status: active
summary: cardforger 的模块拓扑（app / pages / features / services / hooks / lib）与 Canvas 渲染流水线
tags: [architecture, modules, canvas]
related:
  - dev/architecture/dependencies
  - dev/spec/canvas-render
  - dev/spec/routing
  - dev/spec/assets
---

# 架构总览

## 定位

cardforger 是 **CardConjurer**（`/workspace/cardconjurer`）的 TypeScript / React / Vite 静态实现。它不是：

- 不是后端服务（**纯浏览器**：Canvas 2D / `localStorage` / `fetch` / `Blob` URL）
- 不是 monorepo（**单 package**：`src/` 一层目录树 + 3 个顶层运行时依赖）
- 不是 CardConjurer 的 fork（`/workspace/cardconjurer` 是只读 ground truth；`src/legacy-app/` 是冻结快照）

## 顶层栈

| 层 | 内容 |
|---|---|
| 运行时依赖 | `react@^19.2`、`react-dom@^19.2`、`wouter@^3.6` —— **三个**，详 [`dependencies.md`](dependencies.md) |
| 构建工具 | Vite 6 + `@vitejs/plugin-react`；`npm run build` = `tsc --noEmit && vite build` |
| 类型系统 | TypeScript 5.6 strict；零 `any`（出现需在 `RENDER_PARITY_STATE.md` §4 登记）|
| 路由 | `wouter`，**唯一**导入点是 `src/lib/router.ts` |
| 资源 | `magic_resources` Git LFS 仓库运行时填充 `public/`，**不入 git** |

## 模块拓扑

```
              src/main.tsx
                    │ ReactDOM.createRoot
                    ▼
              src/app/App.tsx
              （Router + Switch 装配）
                    │
        ┌───────────┼────────────┐
        ▼           ▼            ▼
   src/components  src/pages    src/lib/router.ts
   （AppShell）   （4 路由页）  （wouter 单边界）
                    │
                    ▼
         src/features/creator/
         ├── components/   表单 / Collapsible / FaceSwitcher
         └── canvas/       drawCard 流水线
                                │
                                ▼
                          src/services/
                          （状态 + I/O + 资源 + token 解析）
                                │
                                ▼
                            src/hooks/
                          （React 包装层）
                                │
                                ▼
                            src/types/
                       （领域 schema：CardData / CardFace / …）
```

依赖方向单向向下：`app → pages → features → services → hooks → types`。`utils/` 是叶子。`styles/global.css` 由 CSS 变量驱动主题，无 JS 依赖。

`src/legacy-app/`（如存在）是 CardConjurer 上游冻结快照，**不属于构建**（tsconfig exclude），只读参考。

### 各目录职责

- **`app/`** — React 根 + `<App>` 路由装配
- **`components/`** — 跨页 UI primitive（当前只有 `AppShell`）
- **`pages/`** — 路由级组件，与 `router.ts` 的 `ROUTES` 一一对应
- **`features/creator/`** — Canvas 卡面渲染 + 编辑器子组件
  - `canvas/` —— `drawCard` / `drawRichText` / `drawManaSymbols` / `drawPlaneswalker` / `drawSaga` / `renderToBlob`
  - `components/` —— `CardFaceForm` + 字段分组 + DFC 切换
- **`hooks/`** — 自定义 hook：`useCardData` / `useSavedCards` / `useFrameVersions` / `useImageAsset(s)`
- **`lib/`** — 受控边界，**只有** `router.ts`（wouter 唯一导入点）
- **`services/`** — 业务逻辑与 I/O：`storage` / `io` / `assets` / `creatorAssets` / `framePresets` / `manaSymbols` / `planeswalker` / `saga` / `scryfall` / `templates` / `autoFrame`
- **`types/`** — 领域类型：`card` / `cardData` / `asset` / `template` / `portableCards`
- **`styles/`** — `global.css`（CSS 变量主题）
- **`utils/`** — `download.ts` 等小工具

具体路由清单见 [`spec/routing.md`](../spec/routing.md)；资源路径与初始化见 [`spec/assets.md`](../spec/assets.md)。

## 数据流

### 卡面编辑（用户输入 → 画布）

```
CardFaceForm 字段
       │ onChange
       ▼
useCardData (CardData state)
       │
       ▼
Canvas.tsx 监听 cardData / 主题 / 资源
       │
       ▼
drawCard(ctx, cardData, assets)
       ▼
HTMLCanvasElement (1500×2100)
```

`drawCard`（`src/features/creator/canvas/drawCard.ts`）是渲染流水线主入口；各 sub-renderer 是同目录的 `drawRichText` / `drawManaSymbols` / `drawPlaneswalker` / `drawSaga`。**流水线步骤顺序与每步对上游契约**见 [`spec/canvas-render.md` §drawCard 流水线](../spec/canvas-render.md#drawcard-流水线)——本文不展开步骤清单（属契约事实）。

### 持久化（保存 / 加载）

- `localStorage` ←→ `services/storage.ts`（key prefix 命名见 storage 模块）
- 导入 / 导出 JSON ←→ `services/io.ts` + `types/portableCards.ts`
- PNG 下载 ←→ `features/creator/canvas/renderToBlob.ts` → `utils/download.ts`

### Fixture 视觉证据（parity loop 专用）

`/fixtures/:slug` 路由把 `public/fixtures/<slug>.json` 反序列化为 `CardData` 喂给 Canvas，专供 [`process/parity-check.md`](../process/parity-check.md) 描述的 CDP driver 截图对照。**非生产功能**——属于 `process/parity-check.md` 编排下的视觉验证支撑。

## 强约束

1. **wouter 单边界**：`from 'wouter'` 只能出现在 `src/lib/router.ts`；其他位置必须 `from '@/lib/router'`。判据 / 修补流程见 [`standards/coding.md` §wouter 单边界](../standards/coding.md#wouter-单边界)。
2. **顶层依赖闸**：`package.json` `dependencies` 不得超过 `react` / `react-dom` / `wouter` 三项；扩容前在 `RENDER_PARITY_STATE.md` §5 登记理由 + 替代方案。
3. **上游基线只读**：`/workspace/cardconjurer/` 与 `src/legacy-app/` 不允许在 cardforger 的提交里出现 diff。
4. **资源不入 git**：运行时资源由 `magic_resources` 初始化，`.gitignore` 已护住，禁止 `git add` 绕过；完整目录清单与初始化流程见 [`spec/assets.md`](../spec/assets.md)。
5. **渲染字段权威单源**：字段命名 / 字号 / token 集合以 cardforger 自身 spec 为权威（[`spec/canvas-render.md`](../spec/canvas-render.md)、未来 `spec/template-schema.md`），不以上游 `creator-23.js` HEAD 为锚；上游 conjurer 是产物对照参考，不是字面量权威——详 [`adr/0003-upstream-as-output-reference.md`](../adr/0003-upstream-as-output-reference.md) + [`standards/coding.md` §上游产物对照](../standards/coding.md#上游产物对照)。改字段值必须先动 spec 文档，"凭直觉改良"违约。

## 不做的事

- 不引入 SSR / 服务端 API / Node 运行时
- 不替换 `wouter` 或拆开它的单边界
- 不把渲染逻辑下沉到 `services/`（services 只做数据 / I/O，不持 `CanvasRenderingContext2D`）
- 不在 `pages/` 直接用 `wouter` 导出（必须走 `@/lib/router`）
- 不把 `magic_resources` 资源 stage / commit 到 cardforger
