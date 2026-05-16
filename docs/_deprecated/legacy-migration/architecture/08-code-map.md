# 08 代码地图与关键文件

## 根文件

| 文件 | 职责 |
| --- | --- |
| `package.json` | 命令入口、Node 版本要求、依赖声明 |
| `next.config.mjs` | Next 静态导出配置 |
| `README.md` | 项目基本说明和命令 |
| `UPSTREAM_COMMIT` | 上游来源记录 |

## 构建与迁移脚本

| 文件 | 职责 |
| --- | --- |
| `scripts/lib/project.mjs` | repo/source 根路径、分类规则、路径工具 |
| `scripts/import-source.mjs` | 从 legacy source 导入并生成 baseline manifest |
| `scripts/build.mjs` | Next build + legacy 文件合成 `dist` |
| `scripts/lib/creator-compat.mjs` | 将 `src/creator` 纯 helper 生成到 classic-script Creator 兼容前导块 |
| `scripts/build-release.mjs` | 从 `dist` 拆分 `release/site`、`release/assets-hires`、`release/platform` 并生成 release manifest |
| `scripts/serve.mjs` | 本地服务 `dist`，也可通过 `--root` 服务 `release/site` 等 repo 内生成目录 |
| `scripts/verify-baseline.mjs` | verify 命令入口 |
| `scripts/verify-release.mjs` | release 产物文件列表、体积摘要和分类规则验证入口 |
| `scripts/lib/verify.mjs` | separation、manifest、dist 三层验证 |
| `scripts/migration-status.mjs` | migration status 命令入口 |
| `scripts/lib/migration-status.mjs` | HTML route 覆盖和迁移完整性判断 |
| `scripts/lib/html-equivalence.mjs` | HTML 结构等价判断 |
| `scripts/lib/gallery-equivalence.mjs` | gallery DOM 等价判断 |
| `scripts/lib/fs.mjs` | 文件遍历、复制、hash、并发工具 |

## Next 与 Framework

| 文件 | 职责 |
| --- | --- |
| `app/**/route.js` | Next App Router 静态 route handler |
| `src/framework/routes.mjs` | 16 个 framework route 的事实源 |
| `src/framework/next-response.mjs` | route outputPath 到 Response 的适配 |
| `src/framework/render-route.mjs` | Preact/component/custom renderer 执行 |
| `src/framework/render-pages.mjs` | framework routes 批量渲染工具 |
| `src/framework/html.mjs` | htm tagged template helper |
| `src/framework/components/AppShell.mjs` | 完整页面外壳、导航、公共 head |
| `src/framework/pages/*.mjs` | 各页面/fragment 的静态组件 |
| `src/framework/pages/creator/*.mjs` | Creator 静态 DOM 组件 |
| `src/framework/data/*.mjs` | 页面数据和选项数据 |
| `src/framework/migration-status.mjs` | framework migration 状态数据 |
| `src/shell/README.md` | 目标 shell 目录边界说明，当前未接入 build |
| `src/page-components/README.md` | 目标 page component 目录边界说明，当前未接入 build；避免触发 Next `src/pages` 约定 |
| `src/legacy/README.md` | 目标 legacy compatibility 目录边界说明，当前未接入 build |

## Creator Runtime

| 文件 | 职责 |
| --- | --- |
| `src/app/js/creator-23.js` | Creator 核心运行时单体源码，依赖 build 注入的 legacy helper 全局名 |
| `src/creator/assets/asset-url.mjs` | Creator asset URL/base 纯 helper，构建到兼容前导块中的 `fixUri()` |
| `src/creator/assets/frame-preload.mjs` | Creator frame preload source 过滤/收集纯 helper，构建到兼容前导块 |
| `src/creator/text/text-fonts.mjs` | Creator font load declaration、text-object font discovery、write-text font state、font-code parsing 和 Beleren glyph helper，构建到兼容前导块 |
| `src/creator/text/text-fields.mjs` | Creator selected text-field lookup 纯 helper，构建到兼容前导块 |
| `src/creator/text/write-text-content.mjs` | Creator reminder、raw text normalization/tokenization 和 vertical token expansion helper，构建到兼容前导块 |
| `src/creator/text/write-text-conditional-color.mjs` | Creator conditional text color frame/mask matching 纯 helper，构建到兼容前导块 |
| `src/creator/text/write-text-style.mjs` | Creator initial style、line style、shadow、fill color 和 font size token helper，构建到兼容前导块 |
| `src/creator/text/write-text-mana.mjs` | Creator mana symbol color/kerning、Safari 合成、outline 和队列绘制 helper，构建到兼容前导块 |
| `src/creator/text/write-text-transform.mjs` | Creator pt-shift 和 arc/rotation transform token 纯 helper，构建到兼容前导块 |
| `src/creator/text/write-text-roll.mjs` | Creator roll color 和 d20 roll state token 纯 helper，构建到兼容前导块 |
| `src/creator/text/write-text-controls.mjs` | Creator line flow、flavor bar、planechase、elem-id、CStext spacing 和 alignment control helper，构建到兼容前导块 |
| `src/creator/text/write-text-positioning.mjs` | Creator saved cursor、indent、inline insertion 和 cursor offset token helper，构建到兼容前导块 |
| `src/creator/text/write-text-layout.mjs` | Creator overflow、adjustment、word measurement 和 final paragraph draw transform helper，构建到兼容前导块 |
| `src/creator/storage/saved-card-data.mjs` | Creator saved-card data clone/export/import 和 key helper，构建到兼容前导块 |
| `src/creator/imports/import-clipboard-text.mjs` | Creator Scryfall clipboard text parser 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-options.mjs` | Creator imported-card option name/eligibility 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-search-options.mjs` | Creator import search option/fetch-unique 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-url.mjs` | Creator Scryfall/MTGCH/collector URL builder 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-card-basics.mjs` | Creator imported-card display name、title/subtitle、language/font-prefix 和 type-line 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-printing.mjs` | Creator imported-card collector info/number、set-symbol、art/media plan 和 print identity 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-text-preservation.mjs` | Creator imported-card text preservation 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-multi-faced.mjs` | Creator imported-card multi-faced layout/face 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-unique-layout.mjs` | Creator imported-card unique-layout predicate 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-station-layout.mjs` | Creator imported-card station-layout predicate 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-station-parser.mjs` | Creator imported-card station oracle parser/placement 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-roll.mjs` | Creator imported-card d20 roll ability parser 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-text-fields.mjs` | Creator imported-card rules/flavor、Pokemon rules fields、case-layout rules 和 power/toughness 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-planeswalker.mjs` | Creator imported-card planeswalker ability/field formatter 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-saga.mjs` | Creator imported-card saga ability/field formatter 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-class.mjs` | Creator imported-card class ability/field formatter 纯 helper，构建到兼容前导块 |
| `src/creator/imports/import-unique-layout-parsers.mjs` | Creator imported-card leveler/prototype/mutate/vanguard parser 纯 helper，构建到兼容前导块 |
| `src/creator/README.md` | Creator 目标运行时目录说明 |
| `src/app/js/frameSearch.js` | frame 搜索 |
| `src/app/js/frames/group*.js` | frame group -> pack 下拉注册 |
| `src/app/js/frames/pack*.js` | frame pack 数据和版本初始化过程 |
| `src/app/js/frames/version*.js` | 特殊卡牌版本运行时扩展 |
| `src/app/js/frames/manaSymbols*.js` | mana symbol 扩展 |
| `src/app/creator/index.html` | legacy Creator 静态页面来源 |
| `src/framework/pages/CreatorPage.mjs` | framework Creator fragment 入口 |
| `src/framework/pages/creator/CreatorFrameSections.mjs` | frame 面板静态组件代表 |
| `src/framework/data/creator/frame-options.mjs` | frame 面板选项数据 |

## 资源与部署

| 文件/目录 | 职责 |
| --- | --- |
| `resources/img/frames` | 高清牌框和缩略图，最大资源热点 |
| `resources/img/manaSymbols` | mana 符号 |
| `resources/img/setSymbols` | 系列符号 |
| `resources/fonts` | 主站字体 |
| `resources/data/images` | legacy data 图片资源 |
| `resources/data/fonts` | legacy data 字体资源 |
| `src/app/gallery/img` | gallery 展示图 |
| `platform/app.conf` | Nginx 静态服务配置 |
| `platform/docker/app.conf` | Docker Nginx 配置副本 |
| `platform/.htaccess` | Apache 兼容缓存/错误页配置 |
| `platform/Dockerfile` | Nginx 镜像构建 |
| `platform/docker-compose.yml` | 本地 Docker 运行 |
| `platform/upload.bat` | OSS 上传辅助脚本 |
| `config/release-targets.json` | release 分类配置，定义平台文件和高清 frame 冷资源规则 |
| `deploy/oss/release-policy.json` | OSS/CDN cache、CORS、过滤规则策略 |
| `deploy/oss/README.md` | release target 发布顺序和 OSS/CDN 应用说明 |
| `assets/README.md` | 目标资源所有权边界说明，当前未接入 build |

## 测试

| 文件 | 职责 |
| --- | --- |
| `test/baseline.test.mjs` | baseline、manifest、dist 和 override 精确性 |
| `test/framework.test.mjs` | framework route 和 HTML 等价 |
| `test/creator-contract.test.mjs` | Creator DOM 和业务 helper 契约 |
| `test/creator-runtime.test.mjs` | jsdom runtime 启动契约 |
| `test/performance.test.mjs` | 性能、安全和懒加载约束 |
| `test/public-assets.test.mjs` | `dist` 中 public asset 引用可解析 |
| `test/release-targets.test.mjs` | release 分类规则不把平台文件或高清 frame 放入主站集 |

## 生成物

| 路径 | 说明 |
| --- | --- |
| `dist/` | 兼容 public output，可部署但建议过滤 |
| `release/site` | 生成的 OSS 主站发布集 |
| `release/assets-hires` | 生成的高清 frame 冷资源发布集 |
| `release/platform` | 生成的平台/部署辅助文件发布集 |
| `deploy/` | 部署策略源码，不进入当前 `dist` 兼容输出 |
| `out/` | Next static export 中间产物 |
| `.next/` | Next build 中间产物 |
| `manifests/source-baseline.json` | import-source 生成的 source baseline |
| `manifests/release-manifest.json` | build-release 生成的发布集 hash manifest |
