# 09 目标文件架构

## 目标

当前目录结构是迁移阶段结构，核心价值是保留 legacy public path 和 baseline
验证能力。目标文件架构要在不破坏兼容输出的前提下，把下面几类边界拆清楚：

- 源码边界。
- 运行时边界。
- 资源边界。
- 发布边界。
- 平台/部署边界。
- legacy 兼容边界。

目标不是立即删除 legacy 结构，而是让每个目录的职责单一、可测试、可发布。

## 设计原则

1. `dist/` 继续作为兼容输出全集，但不再等同于线上发布集。
2. legacy public path 是输出契约，不应反向决定源码目录结构。
3. 大资源按冷热分层，不和应用壳同生命周期发布。
4. Creator runtime 按状态、渲染、资源加载、导入、保存、frame catalog 分层。
5. `platform/` 不应默认进入 OSS 主站公开集。
6. 每次移动文件都要有 compatibility adapter 或 build 映射。

## 目标顶层结构

建议目标结构：

```text
cardforger/
  app/                         # Next route handlers，仍可保留
  src/
    shell/                     # 全站 shell、公共导航、HTMX/静态页面外壳
    page-components/           # 静态页面组件；逻辑上对应 pages，避免触发 Next src/pages 约定
    creator/
      ui/                      # Creator 静态/交互 UI 组件
      runtime/                 # Creator 浏览器运行时入口
      state/                   # card model、状态读写、序列化
      canvas/                  # canvas 管理、frame/text/card 绘制
      text/                    # 文本解析和排版
      frames/                  # frame catalog 适配层和数据注册
      imports/                 # Scryfall/MTGCH/local 数据源
      storage/                 # localStorage、保存卡牌、导入导出
      assets/                  # asset URL、预加载、CORS 策略
    legacy/
      app/                     # 尚未迁走的 legacy browser files
      frames/                  # legacy js/frames 兼容脚本
    framework/                 # 迁移期间的 framework route renderer，可逐步并入 shell/pages
  assets/
    public/                    # 主站热资源：icons、symbols、必要 fonts
    thumbnails/                # frame/gallery 缩略图
    frames-hires/              # 高清冷 frame 资源，可独立仓库/对象存储
    gallery-hires/             # gallery 大图，可独立冷资源
  deploy/
    oss/                       # OSS 同步、CDN 刷新、发布过滤规则
    docker/                    # Docker/Nginx 部署
    apache/                    # .htaccess 等兼容配置
    local/                     # launcher、本地运行辅助
  scripts/
    build/                     # 构建和发布脚本
    migration/                 # import-source、baseline、迁移检查
    lib/                       # 脚本共享库
  tests/
    baseline/
    framework/
    creator/
    performance/
    assets/
  docs/
```

这是目标方向，不是一次性改名清单。当前 `src/framework`、`src/app`、`resources`、
`platform` 需要通过阶段迁移到这些边界。

## 兼容输出结构

即使源码结构改变，`dist/` 仍应能生成 legacy-compatible public layout：

```text
dist/
  index.html
  creator/index.html
  gallery/index.html
  css/
  js/
  img/
  fonts/
  data/
  core/
  globalHTML/
```

这层是兼容产物，不是源码组织模型。

## 发布集结构

线上发布不应直接等于完整 `dist/`。建议定义多个发布集。

### 主站发布集

```text
release/site/
  index.html
  about/
  creator/
  gallery/
  converter/
  print/
  legal/
  theme/
  tutorial/
  css/
  js/
  core/
  globalHTML/
  fonts/                       # 必要字体
  img/manaSymbols/
  img/setSymbols/
  img/frames/**/*Thumb.png
```

### 高清资源发布集

```text
release/assets-hires/
  img/frames/**/*.png          # 排除 *Thumb.png
  gallery/img/                 # 视产品决定是否拆出
```

### 平台发布集

```text
release/platform/
  Dockerfile
  docker-compose.yml
  app.conf
  launcher.exe
  launcher-linux
  launcher-macos
  upload.bat
```

平台发布集不应默认出现在 OSS 主站根目录。

## 当前目录到目标目录映射

| 当前目录 | 目标方向 | 说明 |
| --- | --- | --- |
| `src/framework/` | `src/shell/` + `src/page-components/` | 当前是现代 HTML 生成层，可逐步拆成 shell 和 page components |
| `app/` | `app/` 或 `src/routes/` | Next route handler 很薄，可保留 |
| `src/app/js/creator-23.js` | `src/creator/runtime/*` | 分阶段拆，不直接整文件搬迁 |
| `src/app/js/frames/` | `src/creator/frames/` + `src/legacy/frames/` | 先保留兼容脚本，再数据化 |
| `src/app/creator/index.html` | `src/legacy/app/creator/` | 作为 legacy reference，不作为主编辑入口 |
| `src/app/gallery/img` | `assets/gallery-hires/` 或 `assets/public/gallery/` | 需要按展示策略拆冷热 |
| `resources/img/frames/*Thumb.png` | `assets/thumbnails/frames/` | 热资源 |
| `resources/img/frames` 非 Thumb | `assets/frames-hires/` | 冷资源 |
| `resources/fonts` | `assets/public/fonts/` | 按实际使用再子集化 |
| `resources/data` | `assets/public/data/` 或数据包 | 需要区分本地 DB、legacy data images、fonts |
| `platform/` | `deploy/*` | 不应默认进入主站 public output |
| `scripts/` | `scripts/build` + `scripts/migration` | 当前可先保持，后续按职责拆 |
| `test/` | `tests/*` | 当前可保持，迁移时按领域拆分 |

## Creator 目标边界

Creator 目标结构应围绕领域职责，而不是围绕旧 UI tab：

```text
src/creator/
  runtime/
    bootstrap.js
    globals-compat.js
  state/
    card-model.js
    serialization.js
    preferences.js
  assets/
    asset-url.js
    preload.js
    cors-policy.md
  frames/
    catalog.js
    pack-registry.js
    legacy-pack-loader.js
    version-registry.js
  canvas/
    canvas-manager.js
    frame-compositor.js
    card-renderer.js
    export-image.js
  text/
    parser.js
    layout.js
    mana-symbol-renderer.js
  imports/
    scryfall.js
    mtgch.js
    local-db.js
    normalize-card.js
  storage/
    saved-cards.js
    bulk-download.js
  ui/
    controls/
    panels/
```

短期必须保留 `globals-compat.js` 一类兼容层，把 legacy inline handler 需要的函数挂回
`window`，直到 UI 事件模型完成迁移。

## Frame Catalog 目标边界

当前 `js/frames/*.js` 是数据和副作用混合。目标应拆成：

- frame group registry：只描述 group 和 pack 列表。
- frame pack data：只描述 frames、masks、bounds、asset src。
- version initializer：描述 art/text/watermark/bottomInfo 等版本初始化过程。
- legacy wrapper：生成或维护旧 `/js/frames/*.js`，兼容当前 loader。

迁移期间可以同时存在：

```text
src/creator/frames/data/*.js
src/legacy/frames/*.js
dist/js/frames/*.js
```

最终目标是让 `pack*.js` 不再直接改 DOM 和全局状态。

## 资源目标边界

资源应按访问模式拆，不按 legacy 路径简单堆放：

- 热资源：首屏和常用 UI 必需。
- 温资源：用户进入某功能后高概率使用。
- 冷资源：用户明确选择后才需要，例如高清 frame。
- 平台资源：部署和本地运行工具，不是 Web public asset。

资源路径可以通过 build manifest 映射回 legacy public path，而不是源码目录直接等于
public path。

## 构建目标

目标构建应生成多个产物：

```text
dist/                         # legacy-compatible full output for verification
release/site/                 # OSS 主站发布集
release/assets-hires/         # 高清资源发布集
release/platform/             # 平台包
manifests/
  source-baseline.json
  asset-manifest.json
  release-manifest.json
```

`dist/` 继续服务 baseline，`release/*` 服务实际部署。

## 当前落地状态

Phase 1 已先在不移动源码路径的前提下落地发布集生成：

- 配置：`config/release-targets.json`
- 脚本：`scripts/build-release.mjs`
- 命令：`npm run build:release`
- 输出：
  - `release/site`
  - `release/assets-hires`
  - `release/platform`
  - `manifests/release-manifest.json`

当前规则只从 `dist/` 复制并分流文件，不改变 legacy public path，也不改
`src/app/js/creator-23.js`。高清 frame 在 `release/assets-hires` 中仍保留
`img/frames/...` public path，后续可由同根挂载或 CORS-enabled CDN 承载。

部署边界也已开始落地：

- `deploy/oss/release-policy.json` 记录 OSS/CDN cache、CORS 和过滤规则。
- `deploy/oss/README.md` 记录 release target 发布顺序。

Creator 目标目录也已开始落地：

- `src/creator/README.md`
- `src/creator/assets/asset-url.mjs`
- `src/creator/assets/frame-preload.mjs`
- `src/creator/text/text-fonts.mjs`
- `src/creator/text/text-fields.mjs`
- `src/creator/text/write-text-content.mjs`
- `src/creator/text/write-text-conditional-color.mjs`
- `src/creator/text/write-text-style.mjs`
- `src/creator/text/write-text-mana.mjs`
- `src/creator/text/write-text-transform.mjs`
- `src/creator/text/write-text-roll.mjs`
- `src/creator/text/write-text-controls.mjs`
- `src/creator/text/write-text-positioning.mjs`
- `src/creator/text/write-text-layout.mjs`
- `src/creator/storage/saved-card-data.mjs`
- `src/creator/imports/import-options.mjs`
- `src/creator/imports/import-search-options.mjs`
- `src/creator/imports/import-url.mjs`
- `src/creator/imports/import-card-basics.mjs`
- `src/creator/imports/import-printing.mjs`
- `src/creator/imports/import-text-preservation.mjs`
- `src/creator/imports/import-multi-faced.mjs`
- `src/creator/imports/import-unique-layout.mjs`
- `src/creator/imports/import-station-layout.mjs`
- `src/creator/imports/import-station-parser.mjs`
- `src/creator/imports/import-roll.mjs`
- `src/creator/imports/import-text-fields.mjs`
- `src/creator/imports/import-planeswalker.mjs`
- `src/creator/imports/import-saga.mjs`
- `src/creator/imports/import-class.mjs`
- `src/creator/imports/import-unique-layout-parsers.mjs`
- `src/creator/imports/import-clipboard-text.mjs`

当前只抽出纯 helper 和文档边界，未改变 `/js/creator-23.js` public path；legacy
global `fixUri()`、frame preload helper、text font helper、selected text-field helper、
write-text content helper、write-text conditional color helper、
write-text style helper、write-text mana helper、write-text transform helper、
write-text roll helper、write-text controls helper、write-text positioning helper、write-text layout helper、saved-card data/key helper、import clipboard-text parser helper、import option helper、import search-options helper、import URL builder、import card basics helper、import printing helper、import text-preservation helper、import multi-faced helper、import unique-layout helper、import station-layout helper、import station parser helper、import roll parser helper、import text fields helper、import planeswalker helper、import saga helper、import class helper 和 import unique-layout parsers helper 由
build-time compat 前导块生成。

目标目录骨架已先用 README 形式落地，尚未接入 build 输入：

- `src/shell/`
- `src/page-components/`（物理目录名；逻辑目标仍是 page components，避免触发 Next `src/pages` 约定）
- `src/legacy/`
- `assets/`
- `scripts/build/`
- `scripts/migration/`
