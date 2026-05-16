# 03 前端框架与页面渲染

## 框架定位

项目使用 Next.js App Router 做静态 HTML 导出，但没有把应用改造成典型的 Next
客户端应用。Next 在这里的角色是“静态 HTML 生成器”和“路由清单校验边界”。

关键配置位于 `next.config.mjs`：

- `output: 'export'`
- `trailingSlash: true`
- `images.unoptimized: true`

## 路由调用链

```text
app/**/route.js
  -> frameworkRouteResponse(outputPath)
  -> routesByOutputPath 查找 src/framework/routes.mjs
  -> renderFrameworkRoute(route)
  -> Preact render(component) 或 route.render()
  -> Next static export 到 out/
  -> scripts/build.mjs 覆盖回 dist/历史路径
```

关键文件：

- `app/**/route.js`
- `src/framework/next-response.mjs`
- `src/framework/render-route.mjs`
- `src/framework/render-pages.mjs`
- `src/framework/routes.mjs`

每个 `app/**/route.js` 都很薄，通常只做：

```js
import { frameworkRouteResponse } from '.../src/framework/next-response.mjs';

export const dynamic = 'force-static';

export function GET() {
  return frameworkRouteResponse('creator/index.html');
}
```

## 路由清单

`src/framework/routes.mjs` 是路由事实源。当前覆盖 16 个 legacy HTML 入口。

路由类型：

- `html-equivalent`：框架输出应和 legacy HTML 在规范化后等价。
- `gallery-dom-equivalent`：gallery 允许 DOM 等价，不要求 byte/hash 等价。
- `performance-override`：为性能目的允许有意差异，需由测试和 override 记录约束。

当前 `performance-override`：

- `index.html`
- `creator/index.html`

按输出形态还可以分为：

- 完整文档：`index.html`、两个 Ask Urza ability generator HTML。
- HTMX fragment：`about`、`askurza`、`converter`、`creator`、`gallery`、
  `legal`、`phyrexian`、`print`、`theme`、`tutorial`、`core/404.html`。
- 兼容 partial：`globalHTML/header.html`、`globalHTML/footer.html`。

## AppShell

`src/framework/components/AppShell.mjs` 负责完整文档外壳：

- `<head>` 基础 meta。
- CSS 引用：`css/reset.css`、`css/style-9.css`。
- favicon 和 touch icon。
- defer 加载 `js/themes.js`、`js/htmx.min.js`、`js/main-1.js`。
- 顶部标题。
- hamburger 导航。
- notification container。
- footer 备案链接。

这个 shell 仍保留 htmx 导航和 legacy 全局脚本调用方式。

## 页面组件

`src/framework/pages/` 下的页面组件把 legacy HTML 拆成可维护的静态结构：

- `LandingPage.mjs`
- `CreatorPage.mjs`
- `GalleryPage.mjs`
- `PrintPage.mjs`
- `ThemePage.mjs`
- `ConverterPage.mjs`
- `AskUrzaPage.mjs`
- `PhyrexianPage.mjs`
- `LegalPage.mjs`
- `TutorialPage.mjs`
- `NotFoundPage.mjs`
- `GlobalHtmlPartials.mjs`

数据常量集中在 `src/framework/data/`。例如 creator 的选项数据拆到
`src/framework/data/creator/*.mjs`。

## Creator 页面边界

`src/framework/pages/CreatorPage.mjs` 只负责生成 creator fragment：

- editor 弹窗。
- preview canvas。
- creator menu 和各功能 panel。
- defer 加载 `/js/creator-23.js`。
- defer 加载 `/js/frameSearch.js`。

`src/framework/pages/creator/*.mjs` 已把静态表单结构拆成多个组件，但仍保留：

- DOM ID。
- inline event handler。
- legacy class 名称。
- legacy 文案结构。

这是为了继续满足 `creator-23.js` 和测试中的 DOM 契约。

## 兼容策略

框架层迁移遵循两个原则：

1. HTML 生成方式可以现代化。
2. public path、DOM contract、script contract 不能无计划改变。

因此，短期内不要把 creator 的 inline handler 全部替换成 React/Preact state。
运行时没有先拆出来之前，这会造成大范围行为回归。

更多兼容细节：

- `outputPath` 精确对应历史 HTML 文件路径和最终 `dist` 路径。
- `publicPath` 保留 `/creator`、`/print` 这类 clean URL。
- AppShell 中使用历史相对资源路径，例如 `css/style-9.css`、`js/main-1.js`。
- fragment 页面倾向使用绝对脚本路径，例如 `/js/creator-23.js`，避免 HTMX
  在嵌套路由替换时解析错误。
- `globalHTML/footer.html` 保持 legacy partial 边界，包含关闭文档的结构契约。
- 构建时先复制 legacy 静态文件，再用 Next 导出的 16 个 HTML 覆盖对应路径。
