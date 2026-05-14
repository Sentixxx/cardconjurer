# 06 测试体系与质量门禁

## 测试目标

测试体系的目标不是追求普通覆盖率，而是守住 legacy 迁移的行为契约：

- 文件分类正确。
- `dist/` 和 legacy source 保持兼容。
- 框架生成的 HTML 和 legacy HTML 等价。
- Creator 的 DOM、脚本、解析器和运行时关键行为不被破坏。
- 性能改动是可验证的。
- public asset 引用能在 `dist/` 中解析。

## 主要命令

- `npm test`
  - 先执行 `npm run build --silent`。
  - 再执行 `node --test`。
  - 会清空并重建 `dist/`、`out/`、`.next`，不是只读检查。

- `npm run verify`
  - 执行 baseline verify。

- `npm run build:release`
  - 从现有 `dist/` 生成 `release/site`、`release/assets-hires` 和
    `release/platform`。
  - 会清空 `release/` 并重写 `manifests/release-manifest.json`。

- `npm run verify:release`
  - 验证 `release/*` 文件列表、体积摘要和发布分类规则与
    `manifests/release-manifest.json` 一致。

- `npm run migration:status`
  - 输出迁移覆盖状态。

- `npm run migration:status:strict`
  - 严格检查迁移是否完整。

## 测试文件职责

| 文件 | 关注点 |
| --- | --- |
| `test/baseline.test.mjs` | separation、manifest、dist hash/equivalence、资源区不含代码文件 |
| `test/framework.test.mjs` | route inventory、framework route 完整性、HTML 等价 |
| `test/creator-contract.test.mjs` | Creator DOM 契约、文本/import/save helper 行为 |
| `test/creator-runtime.test.mjs` | 构建后 Creator 启动、canvas、localStorage 等 runtime 契约 |
| `test/performance.test.mjs` | lazy load、font-display、print debounce、禁止 eval 等性能/安全约束 |
| `test/public-assets.test.mjs` | built HTML/CSS 引用的本地资源能在 `dist` 找到 |
| `test/release-targets.test.mjs` | release 分类规则：平台文件、高清 frame 和主站热资源边界 |

`test/creator-contract.test.mjs` 还覆盖构建期 Creator compatibility prelude：默认
legacy path 不变，配置 `CARD_FORGER_ASSETS.frameHiresBase` 后仅高清 frame PNG 走冷资源
base。该测试会比较 `src/creator/assets/asset-url.mjs`、
`src/creator/assets/frame-preload.mjs`、`src/creator/text/text-fonts.mjs`、
`src/creator/text/write-text-content.mjs`、
`src/creator/text/write-text-conditional-color.mjs`、
`src/creator/text/write-text-style.mjs`、
`src/creator/text/write-text-mana.mjs`、
`src/creator/text/write-text-transform.mjs`、
`src/creator/text/write-text-roll.mjs`、
`src/creator/text/write-text-controls.mjs`、
`src/creator/text/write-text-positioning.mjs`、
`src/creator/text/write-text-layout.mjs`、
`src/creator/storage/saved-card-data.mjs`、`src/creator/imports/import-clipboard-text.mjs`、
`src/creator/imports/import-options.mjs`、
`src/creator/imports/import-search-options.mjs`、
`src/creator/imports/import-url.mjs`、
`src/creator/imports/import-card-basics.mjs`、`src/creator/imports/import-printing.mjs`、
`src/creator/imports/import-text-preservation.mjs`、
`src/creator/imports/import-multi-faced.mjs`、`src/creator/imports/import-unique-layout.mjs`、
`src/creator/imports/import-station-layout.mjs`、`src/creator/imports/import-station-parser.mjs`、
`src/creator/imports/import-roll.mjs`、`src/creator/imports/import-text-fields.mjs`、
`src/creator/imports/import-planeswalker.mjs`、
`src/creator/imports/import-saga.mjs`、`src/creator/imports/import-class.mjs`、
`src/creator/imports/import-unique-layout-parsers.mjs` 和
`scripts/lib/creator-compat.mjs` 生成的 legacy 全局函数，确保 asset URL 解析、frame
preload source 过滤、text fonts declaration/discovery/state、saved-card data/key
clone/export/import/key ordering、Scryfall clipboard text parsing、import option name/eligibility formatting、import
search option/fetch-unique mapping、import request URL builder、import card basics formatting、import
import printing field/number/set-symbol/art/media/print identity plan、import text preservation/reminder extraction、
multi-faced layout/stat/face text formatting、
unique-layout exact layout/version predicate、station-layout oracle/version predicate、station
oracle parser/placement formatting、d20 roll
ability line tokenization、import rules text formatting、import flavor text formatting、
Pokemon-style rules field mapping、import rules/flavor field composition、case rules bar formatting、
power/toughness field formatting、planeswalker ability/field formatting、saga ability/field formatting、
class ability/field formatting、unique layout parser formatting、
selected text-field lookup，以及
write-text content reminder/raw/vertical token 处理、conditional color frame/mask 匹配、
style initial/line/shadow/color/size token 处理、mana color/kerning token 与 symbol render/outline 处理、transform token 处理、roll token/state
处理、controls flow/bar/planechase/elem-id/CStext/alignment token 处理、positioning cursor/cache/inline offset token 处理、
layout overflow shrink/wrap、horizontal/vertical offset、word write/advance 和 final paragraph draw transform 处理一致。

## Baseline 验证

`scripts/lib/verify.mjs` 提供三类验证：

1. `verifySeparation()`
   - 检查导入区域和分类规则一致。
   - 检查没有重复 public path。

2. `verifyManifest()`
   - 检查 manifest 文件集、size、hash 和 area。

3. `verifyDist()`
   - 检查 `dist/` 文件集和 legacy source。
   - hash 不同则尝试：
     - intentional override。
     - framework HTML equivalence。
     - gallery DOM equivalence。

## Intentional Overrides

有意差异记录在：

- `config/intentional-overrides.json`

当前包括：

- `index.html`
- `creator/index.html`
- `css/style-9.css`
- `data/styles/main.css`
- `js/creator-23.js`
- `js/frames/versionStation.js`
- `print/print.js`
- `upload.bat`

每个 override 都应有明确原因。新增 override 前应先判断是否能用等价测试覆盖。

## Creator 测试策略

Creator 当前不能大范围直接重写。测试已经覆盖大量纯 helper 和 DOM contract。

拆分时建议：

- 先把已有测试覆盖的 helper 提取到模块。
- 提取后继续让测试从源码读取相同函数或更新测试入口。
- 每次只移动一类职责。
- 避免同时改变 DOM、全局状态和渲染行为。

## 当前已知失败

当前 `npm run verify` 应通过。此前的 `img/setSymbols/official/mom-*` 和
`img/setSymbols/official/one-*` mismatch 已按 legacy source 字节对齐；`upload.bat`
是有意差异，已补充到 `config/intentional-overrides.json`。

## 门禁解读

- `migration:status` 通过：说明 HTML 入口和 route handler 覆盖完整。
- `verify` 通过：说明当前 `dist` 与 legacy source 的兼容关系干净。
- `npm test` 通过：说明重建后的输出和 runtime/helper 契约通过测试。

这三者不能互相替代。当前状态应保持迁移状态完整且 verify 干净；任一失败都要先解释
或修复，再继续扩大架构改动。

## 提交流程建议

每次架构或 runtime 改造前后至少运行：

```powershell
npm run build
npm run migration:status:strict
```

涉及 public output 或资源变更时运行：

```powershell
npm run verify
```

涉及 OSS/CDN 发布集过滤时运行：

```powershell
npm run build:release
npm run verify:release
node --test test/release-targets.test.mjs
```

涉及 Creator 行为时运行：

```powershell
npm test
```
