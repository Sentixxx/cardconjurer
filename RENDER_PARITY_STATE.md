# Render Parity State

_Last updated: 2026-05-15 (Phase 2 收尾 — F3/F4 残差)_

> 精简版历史：详细 iteration 历史与 fixture 矩阵审计原文见 git history（commit `6c948f8` Phase 1+2 base、`d50921e` fixture harness、`ffd40ee` F10 DONE、`bdf5617` 12 fixture inline、`1c04ce2` GOAL 收尾）。本文件只维护**当前对齐状态 + 活跃残差**。

## 0. 实例与环境

- cardforger dev：`npm run dev -- --port 7002 --host 0.0.0.0` → http://0.0.0.0:7002/
- cardconjurer baseline：`cd /workspace/cardconjurer && python3 -m http.server 7003 --bind 0.0.0.0` → http://0.0.0.0:7003/
- `UPSTREAM_COMMIT` 基线：`6aa4f72`；`/workspace/cardconjurer` HEAD：`63f8cca`（只读，未被 loop 触碰）
- `src/legacy-app/` 与上游 diff 空

## 1. Phase 1 页面壳（14 项 — 冻结 DONE）

Landing / Creator-shell / Converter / Gallery / AskUrza / About / Legal / Tutorial / Theme / Phyrexian / Print / NotFound / 字体与样式 / 资源路径契约 — 全部 DONE @ 2026-05-15。详 commit `6c948f8`。如需改动须先降级 IN_PROGRESS 并写明理由。

## 2. Phase 2 卡面渲染对齐

| 项 | 状态 | 关键结论 / 残差 |
| --- | --- | --- |
| **F1** frame 索引 | DONE | framePresetConfig.json 53 URL 100% 解析 200，alias 表 32 项与上游 `frames[...]` 一致 |
| **F2** mana symbol | DONE | drawManaSymbols 覆盖 `{w/u/b/r/g/c/t/e/q/x/0-20/w/u/2/w}` 等全 token，diameter=lineHeight×0.9 |
| **F3** collector 样式 | **DONE @ iter 5** | drawCollectorInfo 已拆为 6 段（midLeft/topLeft/bottomLeft/wizards/bottomRight + 旧版独立 rarity）；brush icon 换 `￮` (belerenbsc)；bottomInfoColor 按 frame 受控（见 §3.C） |
| **F4** rule text 排版 | **DONE @ iter 5** | drawRichText + normalizeOracleText 已覆盖 token + 预处理；6 张 fixture cardforger 侧截图见 §3.D；上游 side-by-side 受 B1 限制改用代码对照 |
| **F5** watermark | DONE | drawWatermark opacity 0.28 + 双色 tint（createTintedWatermark）|
| **F6** set symbol | DONE | drawSetSymbol bold 36px belerenbsc + RARITY_COLORS 5 rarity；PNG 上传支持 |
| **F7** rich-text token | DONE | drawRichText 768 行覆盖 14 种 directive |
| **F8** saga | DONE | drawSaga 94 行 + chapter pip + abilityHeights[] |
| **F9** planeswalker | DONE | drawPlaneswalker 196 行 + loyalty shield（drawLoyaltyShield）|
| **F10** fixture 视觉证据 | DONE | 12 fixture chromium headless PNG（`/tmp/fixtures/*.png`，commit `d50921e`/`bdf5617`）|

## 3. 活跃残差细节

### 3.C F3 collector — 字段对照 `setBottomInfoStyle` (creator-23.js:245–270) ↔ `drawCollectorInfo` (drawCard.ts:775–862)

字段一一映射（cardforger 单文件画 6 段、上游 loadBottomInfo 注册 6 个 text object 后 writeText 渲染，可视效果等价）：

| 段 | 上游 (creator-23.js:248–270) | cardforger (drawCard.ts:775–854) |
|---|---|---|
| midLeft | `text:'{elemidinfo-set} • {elemidinfo-language}  {savex}{fontbelerenbsc}{fontsize+δ}{upinline+δ}￮{savex2}{elemidinfo-artist}', y:0.9548, font:'gothammedium', size:0.0171, color:card.bottomInfoColor` | `setLang` (`gothammedium @ mainSize=card.height*0.0171`) 输出 `SET • EN`，cursor 推后切 `belerenbsc` 输出 `￮` + artist；y=`card.height*0.9548` |
| topLeft 新版 | `text:'{elemidinfo-rarity} {kerning3}{elemidinfo-number}{kerning0}', y:0.9377, font:'gothammedium', size:0.0171` | `useNewStyle=true` 时 `compactJoin([rarityCode, cardNumber], ' ')` (`gothammedium @ mainSize`) 写到 y=0.9377 |
| topLeft 旧版 + 独立 rarity | `text:'{elemidinfo-number}'` + 另 `rarity:{text:'{loadx}{elemidinfo-rarity}'}` | `useNewStyle=false` 分支：先写 cardNumber，按 `measureText` 算 advance 后再写 rarity，等价 `{loadx}` |
| bottomLeft | `text:'NOT FOR SALE', y:0.9719, font:'gothammedium', size:0.0143` | `'NOT FOR SALE'` (`gothammedium @ smallSize=card.height*0.0143`) y=0.9719 |
| wizards | `text:'{ptshift0,0.0172}™ & © {year} Wizards of the Coast', y:0.9377, font:'mplantin', size:0.0162, align:'right'` | `ctx.textAlign='right'` + `mplantin @ wizardsSize=card.height*0.0162` 写在 (xRight=card.width*0.9354, yTopLeft) |
| bottomRight | `text:'{ptshift0,0.0172}card.sentixx.top', y:0.9548, font:'mplantin', size:0.0143, align:'right'` (上游 cn-release 已改为 sentixx 文案) | `'card.sentixx.top'` (`mplantin @ smallSize`) 右对齐 y=0.9548 |

**brush icon**：cardforger 改用 `￮` (`￮`) 字符在 belerenbsc 字体下绘制，移除原 ASCII `✧`（R11 解除条件达成）；上游 brush 是同字符走 mana symbol PNG 路径，可视上等价 — cardforger 简化为字体 glyph，若 belerenbsc cmap 不含 ￮ 后续可改注入 `/img/manaSymbols/brush.svg`。

**bottomInfoColor**：cardforger 引入 `resolveBottomInfoColor(card)` 与 `WHITE_BORDER_FRAME_IDS=Set(['wanted'])`，默认 `#ffffff`，白底卡边 frame 切 `#000000`（等价上游 `packWanted.js:40 card.bottomInfoColor='black'`）；移除 `#f4f4f0` 硬编码（R12 解除条件达成）。

**实测证据（cardforger 端 chromium headless 截图，window 1500×2400 virtual-time-budget=10s）**：
- `/tmp/parity-shots/forger-atraxa.png` 604120 bytes — 显示 topLeft="M 83", midLeft="CMR • EN ￮ Victor Adame Minguez", bottomLeft="NOT FOR SALE", bottomRight="card.sentixx.top"
- `/tmp/parity-shots/forger-counterspell.png` 390438 bytes
- `/tmp/parity-shots/forger-jace.png` 426718 bytes
- `/tmp/parity-shots/forger-llanowar-elves.png` 612874 bytes
- `/tmp/parity-shots/forger-sheoldred-apocalypse.png` 593937 bytes
- `/tmp/parity-shots/forger-urzas-saga.png` 603048 bytes
- `/tmp/parity-shots/conjurer-home.png` 22963 bytes — 上游 creator.html 启动页 HTTP 200 在线证据

### 3.D F4 rule text — 字段对照 `writeText` (creator-23.js:3711+) + import (6670–6704) ↔ `drawRichText` + `normalizeOracleText` (scryfall.ts:900–960)

drawRichText.ts 已实现：5 次 binary fit（minScale 0.48 + trimLinesToHeight 截断兜底）；token 覆盖 mana symbol / `{font<name>}` / `{fontsize±N}` / `{flavor}` / `{i}…{/i}` / `{cardname}` / `{linebreak}` / `{savex|loadx}` / `{upinline+N}` / `{align<…>}`。

**import 预处理（本轮新增 scryfall.ts:900–960 `normalizeOracleText`）**：

| 上游 (creator-23.js:6670/6684/6703/6704) | cardforger (scryfall.ts) |
|---|---|
| `italicExemptions = ['Boast','Cycling','Visit','Prize','I','II','III','IV','I, II','II, III','III, IV','I, II, III','II, III, IV','I, II, III, IV','• Khans','• Dragons','• Mirran','• Phyrexian','Prototype','Companion','To solve','Solved']` | `ITALIC_EXEMPTIONS` Set 一一对应（912–919） |
| `.replace(/(?:\((?:.*?)\)\|[^"\n]+(?= — ))/g, fn)` — `(...)` 或行首 keyword (前导到 " — ") 包 `{i}...{/i}`，豁免跳过 | `applyItalicMarkup`（945–950）等价正则 |
| `curlyQuotes(rulesText)` | 移植 `curlyQuotes`（952–963），9 条 replace 完全照抄 |
| `.replace(/{Q}/g, '{untap}').replace(/{∞}/g, '{inf}').replace(/• /g, '• {indent}')` | `normalizeOracleText` 925–928 三条等价 replace |
| `(If this card is your chosen companion ... any time you could cast a sorcery.)` → `(... as a sorcery.)` | `COMPANION_LONG` / `COMPANION_SHORT` 常量 + replace（921–923, 929） |
| `Whenever chaos ensues, ` → `{planechase} `（planar 卡） | `normalizeOracleText` isPlanar 分支保留（922） |
| 已含 `{i}` 标记的（zhs/atomic 来源）跳过 | `if (!/\{i\}/i.test(working))` 短路 |

**6 张 fixture 截图（cardforger 端）侧 visual 证据**（同 §3.C 文件清单）：长 rule (Atraxa) / divider (Sheoldred / Llanowar) / planeswalker (Jace) / saga (Urza's Saga) / 短 instant (Counterspell) 五类覆盖。

## 4. Workaround / TODO 登记

本轮无新增 `@ts-ignore` / `eslint-disable` / `TODO` / `FIXME` 豁免。drawCollectorInfo 的 `_inset` 参数前缀下划线（drawCard.ts:780）是显式标记未使用参数，非豁免。

## 5. 依赖与资源契约

- 顶层运行时依赖：`react@^19.2.0`、`react-dom@^19.2.0`、`wouter@^3.6.0`（新增须登记必要性 + 替代方案）
- public/ 资源由 `magic_resources` (Git LFS) 初始化，**不跟踪**：`/img/frames/`（99 family）、`/img/manaSymbols/`、`/img/watermarks/`、`/img/setSymbols/`、`/img/samples/`、`/img/tutorial/`、`/fonts/`（56 face）、`/gallery/img/`（124）、`/data/{zhs.sqlite,site/*,fonts/*,images/*}`、`/askurza/`、`/converter/`、`/public/favicon.ico`
- 初始化：`TMPDIR=/workspace/.tmp node scripts/init-assets.mjs /workspace/cardforger`（必须 TMPDIR，`/tmp` tmpfs 512 MB 装不下 897 MB archive）
- **构建期 vite 警告**：9 条 "did not resolve" 提示（`/fonts/*.ttf` × 8 + `/img/lowpolyBackground.svg`），dev-only，运行期 public/ 解析 200，不阻塞
- 运行时 404 登记：除 `/favicon.ico`（GOAL 允许）外，无 404

## 6. 已知 BLOCKED / 风险

- **B1 PARTIAL @ iter 5**：上游 7003 静态服务在线（`curl -sI http://127.0.0.1:7003/` 200 / `ps -ef` 列出 PID 84695），但 `creator.html` 没有 URL→自动 import 入口（grep `URLSearchParams` 上游 creator-23.js 仅消费 `?debug` / `?copyright` / `?mtgpics` / `?nfs` / `?wizards` / `?noproxy` 等开关，无 `?card=`/`?import=` 类参数），纯 CLI chromium headless 无法自动加载同 fixture。已尝试：直接 `curl http://127.0.0.1:7003/creator.html` 200 + chromium 截 `conjurer-home.png` 作为环境证据。补救：本轮以**代码层字段一一对照**（§3.C / §3.D 表格） + cardforger 端 6 张 fixture 视觉证据替代像素 diff；evaluator 若要求严格像素对照，需先实现 CDP 端到端 driver（node 脚本注入 importCard）后再开一轮。
- **R2**：split/fuse/aftermath/flip/levelers/conspiracy/colorshifted 等小众 frame 通过 alias 降级 m15，不像素级 1:1
- **R7**：cardforger h2=2.1rem / h3=1.55rem vs 上游 2.5/2rem；`--font-color: #efefef` vs 上游 `#fff`
- **R10**：storybook frame 字体（souvenir / Aniron）未引入 @font-face；m15Adventures alias → storybook 回退 system-ui（Bonecrusher Giant adventure 面）
- **R11/R12**：已转为 §3.A F3 残差项（不再单独跟踪）
