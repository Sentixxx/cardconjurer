---
title: 依赖方向与边界
type: architecture
status: active
summary: 顶层运行时依赖闸、wouter 单边界、src/ 目录间允许 import 方向、magic_resources 资源契约
tags: [architecture, dependencies, boundaries]
related:
  - dev/architecture/overview
  - dev/spec/assets
  - dev/standards/coding
---

# 依赖方向与边界

## 顶层运行时依赖（当前组合事实）

`package.json` 的 `dependencies` 字段当前是：

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "wouter": "^3.6.0"
}
```

理由：cardforger 是面向静态托管的小型 SPA，bundle 体积与边界面积都是产品价值的一部分；上游 CardConjurer 同样是零运行时依赖。

**新增依赖的扩容判据**（什么算合格、要登记什么）见 [`standards/coding.md` §顶层依赖闸](../standards/coding.md#顶层依赖闸)。`devDependencies` 不受此闸约束。

## wouter 单边界

整个 `src/` 中 **`from 'wouter'`** 的字符串只能出现在一个文件：

```
src/lib/router.ts
```

`router.ts` 重新导出 `Link / Route / Router / Switch / useLocation / useRoute`，并提供 `ROUTES` / `useNavigate` / `buildRoutePath` 等封装。所有其他文件 import 必须走 `@/lib/router`。

校验：

```bash
grep -RIn "from 'wouter'" src | grep -v src/lib/router.ts
```

输出必须为空。`process/workflow.md` 把这条 grep 列入每轮自检（具体编排在 process）。

## `src/` 目录间允许的 import 方向

```
app → pages → features → services → hooks → types
           ↘              ↘
            components     utils
```

允许：

- 上层 import 下层
- 同层之间允许（如 `services/` 内部互引）
- `hooks/` 可以 import `services/` + `types/`
- `features/creator/canvas/*` 可以 import `services/` + `types/`（但**不**可以 import `components/` 或 `pages/`）

禁止：

- 反向 import（如 `services/` import `pages/` / `hooks/`）
- `components/` 与 `pages/` 互 import（`components/` 是跨页 primitive）
- `types/` 引入任何运行时依赖（**纯类型**）

校验相对路径地狱：

```bash
grep -RIn "from '\\.\\./\\.\\./'" src
```

输出必须为空（路径回跳 2 层以上一律改 `@/` 绝对别名；别名见 `vite.config.ts` 与 `tsconfig.app.json`）。

## `magic_resources` 资源契约

cardforger 源码仓**不跟踪**任何运行时资源（图片 / 字体 / gallery / data）。它们由独立仓库 [`Sentixxx/magic_resources`](https://github.com/Sentixxx/magic_resources)（Git LFS）通过 `scripts/init-assets.mjs` 解压填充。

完整目录清单、初始化流程、`.gitignore` 边界、404 登记规则见 [`spec/assets.md`](../spec/assets.md)。

## 不做的事

- 不引入 UI 库（MUI / antd / chakra）—— 现有 `global.css` + Canvas 已覆盖
- 不引入状态管理库（Redux / Zustand / Jotai）—— `useState` + `useReducer` + service 已覆盖
- 不引入 CSS-in-JS / 预处理器 —— 一个 `global.css` + CSS 变量就够
- 不引入 fetch SDK / GraphQL client —— Scryfall API 用原生 `fetch`
- 不在 `dependencies` 加 `lodash` / `date-fns` / `moment` —— 用原生 `Date` / `Intl` / `Array.prototype.*`
