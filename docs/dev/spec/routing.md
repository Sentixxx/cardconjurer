---
title: 路由清单契约
type: spec
status: active
summary: wouter 路由权威清单——src/lib/router.ts 的 ROUTES 与各路由对应的页面组件
tags: [spec, routing, wouter]
related:
  - dev/architecture/overview
  - dev/architecture/dependencies
---

# 路由清单契约

## 单一权威

```
src/lib/router.ts  →  export const ROUTES
src/app/App.tsx    →  <Switch><Route … /></Switch>
```

`ROUTES` 是路由清单的**单一信息源**。任何新增页面必须：

1. 在 `router.ts` 的 `ROUTES` 对象添加一条 `{ key, path, label }`
2. 在 `App.tsx` 的 `<Switch>` 加对应 `<Route component={…} />`
3. 路由组件文件放 `src/pages/<Name>Page.tsx`

## 当前路由清单

| key | path | label | 组件 | 备注 |
|---|---|---|---|---|
| `home` | `/` | 主页 | `CreatorPage` | 与 `creator` 同组件，路由别名 |
| `creator` | `/creator` | 制卡 | `CreatorPage` | 主功能页 |
| `legal` | `/legal` | 条款和条件 | `LegalPage` | 静态信息页 |
| `fixture` | `/fixtures/:slug` | Fixture | `FixturePage` | parity 视觉证据专用，从 `public/fixtures/<slug>.json` 反序列化 |
| _(fallback)_ | * | — | `NotFoundPage` | 404 catch-all |

`NAV_ROUTE_KEYS = ['home', 'creator', 'legal']` 是导航栏可见路由集合（`AppShell` 消费）；`fixture` 不在导航出现。

## URL 工具

- `routePath(key)` — 直接读路径
- `buildRoutePath(key, query?)` — 加 query string
- `useNavigate()` — 返回 `(key, query?) => void` 的导航函数
- `readQueryParam(name)` — SSR-safe 读 query
- `useCurrentRouteKey()` — 反查当前 location 命中哪个 RouteKey

页面层**禁止**直接调用 `window.location` 写跳转；必须经 `useNavigate` 或 `<Link href={routePath('xxx')}>`。

## 与上游路由的关系

CardConjurer 上游有 10+ 路由（gallery / converter / phyrexian / print / askurza / theme / tutorial / about / …）。cardforger 当前**只实现 creator + legal**——其余页面要么已被 git 删除（见仓库 status 中的 `D pages/...`），要么属于 Phase 3 范围。

新增页面前应先确认：

1. 是否真的需要（[`adr/`](../adr/) 走决策）
2. 路由命名是否对齐上游（保持 `/converter` `/gallery` `/print` 这种字面量）
3. `legacy-app/` 是否有现成参考可借用渲染逻辑

## 不做的事

- 不在 `pages/` 之外暴露 `wouter` 类型（路由组件用 `useLocation` / `useRoute` 必须从 `@/lib/router` 导出）
- 不为路由参数（如 `:slug`）建独立 schema 文件——直接用 `useRoute` 返回的 params 即可
- 不引入嵌套路由库（cardforger 是平铺路由，无嵌套需求）
