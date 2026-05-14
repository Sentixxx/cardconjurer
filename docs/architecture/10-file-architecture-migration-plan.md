# 10 文件架构迁移计划

## 迁移目标

把当前“迁移兼容结构”推进到“目标源码结构 + 多发布集结构”，同时保持：

- legacy public path 可生成。
- baseline 验证可运行。
- Creator 行为不被一次性破坏。
- OSS/CDN 发布更轻、更可控。

## 总体顺序

```text
先分发布集
  -> 再分资源冷热
  -> 再加兼容映射
  -> 再拆 Creator runtime
  -> 最后移动 legacy public path 源码
```

不要先大规模移动文件。当前测试和 build 都依赖 public relative path，先移动会导致
大量噪音和回归。

## Phase 0：冻结当前事实

目标：

- 明确当前结构是迁移态。
- 固化文档和验证命令。
- 清理当前 verify 已知 mismatch。

任务：

1. 处理 `img/setSymbols/official/mom-*`、`one-*`、`upload.bat` 的 hash mismatch。
2. 明确 `README.md` 中的资源仓库/子模块说明是否保留。
3. 将本架构文档作为后续改造依据。
4. 每次结构性改动前记录 `npm run migration:status` 和 `npm run verify` 结果。

完成标准：

- `npm run migration:status:strict` 通过。
- `npm run verify` 没有未解释失败。

## Phase 1：拆发布集，不动源码路径

目标：

- 不改变 `src/app`、`resources`、`platform`。
- 新增 release 生成逻辑，把线上发布集从 `dist` 中筛出来。

任务：

1. 增加发布清单配置，例如 `config/release-targets.json`。
2. 增加脚本，例如 `scripts/build-release.mjs`。
3. 从 `dist/` 生成：
   - `release/site/`
   - `release/assets-hires/`
   - `release/platform/`
4. 排除主站不需要公开的文件：
   - launcher。
   - Docker 文件。
   - upload 脚本。
   - ignore 文件。
5. 记录每个 release 产物的文件数、体积和 hash manifest。

完成标准：

- `dist/` 仍和 baseline 兼容。
- `release/site/` 可本地静态服务。
- `release/site/` 不包含平台文件和高清冷资源。

当前状态：

- 已新增 `config/release-targets.json` 和 `scripts/build-release.mjs`。
- 已新增 `npm run build:release`。
- 已新增 `npm run verify:release` 和 `npm run serve:release`，用于验证发布集和本地服务
  `release/site`。
- 已新增 `deploy/oss/release-policy.json`，把 OSS/CDN cache、CORS 和过滤规则固化为
  可版本化策略。
- 当前输出：
  - `release/site`: 10395 files，约 781.15MB。
  - `release/assets-hires`: 5136 files，约 4.05GB。
  - `release/platform`: 16 files，约 26.78MB。
- `release/site` 已排除 `upload.bat`、launcher、Docker/Nginx 平台文件，以及
  `img/frames/**/*.png` 中非 `*Thumb.png` 的高清 frame。
- 当前 `gallery/img` 暂留 `release/site`，因为 Gallery 页面仍直接引用
  `/gallery/img/...`；后续如要冷资源化，应先为 Gallery 明确 asset base 和兼容策略。

## Phase 2：资源冷热分层

目标：

- 明确 thumbnails、symbols、fonts、hires frames 的部署位置。
- 为资源 CDN 引入可配置 asset base。

任务：

1. 集中 `fixUri` / asset URL 策略。
2. 增加高清 frame asset base 配置。
3. 保持 `/img/frames/**/*Thumb.png` 在主站或热资源 CDN。
4. 将非 Thumb 高清 frame 放入 `release/assets-hires/`。
5. 配置并文档化 CORS。
6. 为慢网加载、失败重试和预热策略增加测试或手工验证清单。

完成标准：

- 主站包体积显著下降。
- Creator 添加高清 frame 仍能 canvas 导出。
- CDN 资源缺 CORS 时有明确排查文档。

当前状态：

- `release/assets-hires` 已承载非缩略图高清 frame PNG。
- 构建后的 `/js/creator-23.js` 中 `fixUri()` 已支持
  `globalThis.CARD_FORGER_ASSETS.frameHiresBase`，默认不设置时 legacy path 行为不变。
- `src/creator/assets/asset-url.mjs` 已作为可 Node import 的纯 helper 落地，测试会和
  构建期生成的 legacy `fixUri()` 对齐。
- `src/creator/assets/frame-preload.mjs` 已作为可 Node import 的纯 helper 落地，测试会和
  构建期生成的 legacy frame preload helper 对齐。
- 已增加 Creator asset URL helper 测试，覆盖默认路径、高清 frame CDN、缩略图 CDN、
  通用 `assetBase` 和外部 URL 不加 base。
- CORS 和缓存要求已记录在 `05-assets-and-deployment.md`。

剩余：

- 在真实 OSS/CDN 环境验证 `frameHiresBase` 下的 canvas 导出。
- 决定是否把 `frameThumbnailBase` 或 gallery 大图也纳入独立热/冷资源域。
- 如果需要默认生产配置，后续再增加显式配置注入点，不在本阶段硬编码 CDN。

## Phase 3：引入目标源码目录但保留兼容入口

目标：

- 新增目标目录，不立即删除旧目录。
- 通过 re-export、wrapper、copy mapping 逐步迁移。

任务：

1. 新增目录骨架：

```text
src/creator/
src/shell/
src/page-components/              # 物理目录名，避免触发 Next src/pages 约定
src/legacy/
assets/
deploy/
scripts/build/
scripts/migration/
```

2. 先移动纯文档/配置，不移动 runtime。
3. 把 `src/framework` 的页面组件逐步映射到 `src/page-components` 或 `src/shell`。
4. 保留 `src/framework/routes.mjs` 作为 route manifest，直到新 route manifest 成熟。
5. 构建脚本支持从新旧目录共同生成 `dist`。

完成标准：

- 新目录存在并有 README。
- build 输出不变或差异已记录。
- route inventory 不变。

当前状态：

- `src/creator/` 已建立 README。
- `src/creator/assets/` 已建立 README、`asset-url.mjs` 和 `frame-preload.mjs`。
- `src/creator/text/` 已建立 README、`text-fonts.mjs`、`text-fields.mjs`、
  `write-text-content.mjs`、`write-text-conditional-color.mjs` 和
  `write-text-style.mjs`、`write-text-mana.mjs`、`write-text-transform.mjs`、
  `write-text-roll.mjs`、`write-text-controls.mjs`、`write-text-positioning.mjs`、
  `write-text-layout.mjs`。
- `src/creator/storage/` 已建立 README 和 `saved-card-data.mjs`。
- `src/creator/imports/` 已建立 README、`import-clipboard-text.mjs`、`import-options.mjs`、
  `import-search-options.mjs`、`import-url.mjs` 和
  `import-card-basics.mjs`、`import-printing.mjs`、
  `import-text-preservation.mjs`、`import-multi-faced.mjs`、`import-unique-layout.mjs`、
  `import-station-layout.mjs`、`import-station-parser.mjs`、`import-roll.mjs`、`import-text-fields.mjs`、`import-planeswalker.mjs`、
  `import-saga.mjs`、`import-class.mjs`、`import-unique-layout-parsers.mjs`。
- `deploy/` 已建立，包含 OSS/CDN 发布策略。
- `src/shell/`、`src/page-components/`、`src/legacy/`、`assets/`、`scripts/build/` 和
  `scripts/migration/` 已建立 README 骨架。
- 这些目录尚未接入 build 输入；当前阶段只记录目标边界，不移动源码。
- 未创建物理 `src/pages/`，因为当前 Next `app/` 位于 repo root，`src/pages/` 会被 Next
  识别为 Pages Router root 并使 build 失败；后续若迁移到真正 `src/pages/`，必须先调整
  Next 目录布局或配置。

## Phase 4：Creator helper 模块化

目标：

- 拆 `creator-23.js` 中低风险纯 helper。
- 不改变全局函数名和 DOM 契约。

优先顺序：

1. asset URL 和 image preload。
2. text font helper。
3. saved-card data/key helper。
4. import clipboard-text parser helper。
5. import option helper。
6. import search-options helper。
7. import URL builder。
8. import card basics helper。
9. import printing helper。
10. import text-preservation helper。
11. import multi-faced helper。
12. import unique-layout predicate helper。
13. import station-layout predicate helper。
14. import station parser helper。
15. import roll parser helper。
16. import text fields helper。
17. import planeswalker helper。
18. import saga helper。
19. import class helper。
20. import unique-layout parsers helper。
21. 其他已有测试覆盖的 text parser/helper 聚合模块。

迁移方式：

- 新模块放 `src/creator/*`，但文件粒度按领域和共用逻辑聚合；不要为每个微 helper
  单独建文件。
- 继续拆 runtime 时优先识别稳定角色并用面向对象边界承载状态和策略；例如导入流程适合
  formatter/mapper/builder/strategy。不要再新增兼容适配层；现有 build-time
  compat 只维持未迁出入口的当前行为。
- 旧 `creator-23.js` 继续作为 bundle/compat 入口。
- 必要时 build 时合并，或先通过普通 `<script>` 顺序加载。
- 对 inline handler 依赖的函数继续挂 `window`。

完成标准：

- `npm test` 通过。
- `creator-23.js` 职责减小。
- 新模块可被 Node 测试直接 import。

当前状态：

- Asset URL helper 已有 `src/creator/assets/asset-url.mjs`。
- Frame preload source helper 已有 `src/creator/assets/frame-preload.mjs`。
- Text font helper 已有 `src/creator/text/text-fonts.mjs`，聚合 font load
  declaration、text-object font discovery、write-text font state、font-code parsing
  和 Beleren glyph helper。
- Selected text-field lookup helper 已有 `src/creator/text/text-fields.mjs`。
- Write-text content helper 已有 `src/creator/text/write-text-content.mjs`。
- Write-text conditional color frame/mask helper 已有
  `src/creator/text/write-text-conditional-color.mjs`。
- Write-text style helper 已有
  `src/creator/text/write-text-style.mjs`。
- Write-text mana helper 已有
  `src/creator/text/write-text-mana.mjs`。
- Write-text transform helper 已有
  `src/creator/text/write-text-transform.mjs`。
- Write-text roll helper 已有
  `src/creator/text/write-text-roll.mjs`。
- Write-text controls helper 已有
  `src/creator/text/write-text-controls.mjs`。
- Write-text positioning helper 已有
  `src/creator/text/write-text-positioning.mjs`。
- Write-text layout helper 已有
  `src/creator/text/write-text-layout.mjs`。
- Saved-card data/key clone/export/import helper 已有 `src/creator/storage/saved-card-data.mjs`。
- Import clipboard-text parser helper 已有 `src/creator/imports/import-clipboard-text.mjs`。
- Import option helper 已有 `src/creator/imports/import-options.mjs`。
- Import search-options helper 已有 `src/creator/imports/import-search-options.mjs`。
- Import request URL builder 已有 `src/creator/imports/import-url.mjs`。
- Import card basics helper 已有 `src/creator/imports/import-card-basics.mjs`，聚合 display name、title/subtitle、language/font-prefix 和 type-line helper。
- Import printing helper 已有 `src/creator/imports/import-printing.mjs`，聚合 collector info/number、set-symbol、art/media plan 和 print identity helper。
- Import text-preservation helper 已有 `src/creator/imports/import-text-preservation.mjs`。
- Import multi-faced helper 已有 `src/creator/imports/import-multi-faced.mjs`。
- Import unique-layout predicate helper 已有 `src/creator/imports/import-unique-layout.mjs`。
- Import station-layout predicate helper 已有 `src/creator/imports/import-station-layout.mjs`。
- Import station parser helper 已有 `src/creator/imports/import-station-parser.mjs`。
- Import roll parser helper 已有 `src/creator/imports/import-roll.mjs`。
- Import text fields helper 已有 `src/creator/imports/import-text-fields.mjs`，聚合 rules/flavor、Pokemon rules fields、case-layout rules 和 power/toughness helper。
- Import planeswalker helper 已有 `src/creator/imports/import-planeswalker.mjs`。
- Import saga helper 已有 `src/creator/imports/import-saga.mjs`。
- Import class helper 已有 `src/creator/imports/import-class.mjs`。
- Import unique-layout parsers helper 已有 `src/creator/imports/import-unique-layout-parsers.mjs`。
- 已新增 `scripts/lib/creator-compat.mjs`，由 `scripts/build.mjs` 在构建时把这些纯
  helper 合并到 `dist/js/creator-23.js` 的 classic-script 兼容前导块。
- `src/app/js/creator-23.js` 已移除 asset URL、frame preload、text fonts、selected
  text-field lookup、write-text content、write-text conditional color、
  write-text style、
  write-text mana、write-text transform、write-text roll、write-text controls、
  write-text positioning、write-text layout、saved-card data/key、import clipboard-text parser helper、import option helper、import search-options helper、import URL builder、import card basics helper、import printing helper、import text-preservation helper、
  import multi-faced helper、import unique-layout predicate helper、import station-layout predicate
  helper、import station parser helper、import roll parser helper、import text fields helper、import planeswalker helper、import saga helper、import class helper、
  import unique-layout parsers helper
  的重复实现；公开
  `/js/creator-23.js` 路径和 legacy 全局函数名保持不变。
- `npm test`、`npm run verify`、`npm run verify:release` 和
  `npm run migration:status:strict` 已在 asset/preload、text font helper、saved-card data/key
  helper、import URL builder、selected text-field helper 和 write-text content helper
  步骤通过；write-text conditional color helper 步骤也已通过完整门禁。
- Write-text content helper 已由 reminder、raw text 与 vertical token 过细模块合并，并已通过完整门禁。
- Text font helper 已由字体加载与 write-text font-state 过细模块合并，并已通过完整门禁。
- Write-text style helper 已由 initial style、line style、shadow 与 color/size 过细模块合并，并已通过完整门禁。
- Write-text mana helper 已由 color/kerning 与 render 过细模块合并，并已通过完整门禁。
- Write-text transform helper 步骤也已通过完整门禁。
- Write-text roll helper 步骤也已通过完整门禁。
- Write-text controls helper 已由 flow、bar、planechase、elem-id、Chinese spacing 与 alignment 过细模块合并，并已通过完整门禁。
- Write-text positioning helper 已由 saved-x、indent、insertion 与 position 过细模块合并，并已通过完整门禁。
- Write-text layout helper 已由 overflow、adjustment、word drawing 与 final paragraph 过细模块合并，并已通过完整门禁。
- Saved-card data/key helper 步骤也已通过完整门禁。
- Import card basics helper 已由 display-name、title、language 与 type-line 过细模块合并，并已通过完整门禁。
- Import printing helper 已由 collector、set-symbol、art/media 和 print-identity 过细模块合并，并已通过完整门禁。
- Import text-preservation helper 步骤也已通过完整门禁。
- Import multi-faced helper 步骤也已通过完整门禁。
- Import unique-layout predicate helper 步骤也已通过完整门禁。
- Import station-layout predicate helper 步骤也已通过完整门禁。
- Import station parser helper 步骤也已通过完整门禁。
- Import roll parser helper 步骤也已通过完整门禁。
- Import text fields helper 已由 rules-text、flavor-text、pokemon-rules-fields、rules-fields、case-rules-text 和 pt-fields 过细模块合并，并已通过完整门禁。
- Import planeswalker helper 步骤也已通过完整门禁。
- Import saga helper 步骤也已通过完整门禁。
- Import class helper 步骤也已通过完整门禁。
- Import unique-layout parsers helper 步骤也已通过完整门禁。
- Import clipboard-text parser helper 步骤也已通过完整门禁。
- Import option helper 步骤也已通过完整门禁。
- Import search-options helper 步骤也已通过完整门禁。

## Phase 5：Frame catalog 数据化

目标：

- 逐步把 `js/frames/*.js` 从副作用脚本转为数据和初始化函数。

任务：

1. 为一个低风险 pack 建等价测试。
2. 把该 pack 的 `availableFrames` 提取为数据模块。
3. 生成 legacy wrapper，仍暴露原 `/js/frames/pack*.js` 行为。
4. 重复迁移 group、pack、version。
5. 对 version 脚本单独建 initializer registry。

完成标准：

- 旧 loader 仍可工作。
- 新 registry 可直接查询 pack 数据。
- 至少一个 group/pack/version 完成端到端迁移样板。

## Phase 6：Creator state 和 canvas 边界

目标：

- 明确 `card` 模型和 canvas renderer 的职责。
- 降低后续 UI 迁移风险。

任务：

1. 提取 `createDefaultCard()`。
2. 提取 card serialization / deserialization。
3. 提取 canvas manager。
4. 提取 frame compositor。
5. 提取 export/download service。
6. 文本 layout engine 最后处理。

完成标准：

- 保存/加载卡牌兼容旧 localStorage 数据。
- canvas 输出和现有测试一致。
- Creator runtime 入口只做 bootstrap 和 wiring。

## Phase 7：UI 事件模型现代化

目标：

- 移除 inline handler。
- 减少全局函数。
- 让 Creator UI 组件从“静态 DOM provider”转为“runtime UI boundary”。

前置条件：

- `card` 状态边界清楚。
- frame catalog 已有 registry。
- 核心 renderer 已模块化。
- 旧 inline handler 有兼容层。

任务：

1. 为每个 panel 建 bootstrap。
2. 把 inline handler 替换成显式事件绑定。
3. 缩小 `window` 暴露面。
4. 删除 legacy compat 层中不再使用的函数。

完成标准：

- `creator-23.js` 不再是全局单体。
- Creator 页面仍通过 build 生成兼容 HTML。
- 测试覆盖主要交互契约。

## 每阶段必须避免

- 不要把源码移动和行为重构混在一个提交里。
- 不要在 verify 不干净时继续扩大结构改动。
- 不要把 `dist` 当源码编辑。
- 不要让 OSS 发布脚本直接同步完整 `dist` 而不做过滤。
- 不要在 CORS 未验证时切换高清资源域名。
