# Render Parity State

_Last updated: 2026-05-16 (Phase 2 收尾 — F3/F4 像素级侧对侧达成, B1 RESOLVED; Phase 3 PoC BLOCKED 登记 — ADR-0002 proposed)_

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

**像素级侧对侧证据（2026-05-16 iter 6 — CDP driver `/home/node/.claude/jobs/<job>/cdp-driver/driver.mjs`）**：

- 上游 `python3 -m http.server 7003 --bind 0.0.0.0` PID 1795, `curl -sI http://127.0.0.1:7003/ | head -1` → `HTTP/1.0 200 OK`
- cardforger `npm run dev -- --port 7002 --host 0.0.0.0`, `curl -sI http://127.0.0.1:7002/fixtures/atraxa.json` → `HTTP/1.1 200 OK`
- chromium `--headless=new --remote-debugging-port=9223` + raw CDP（Node 22 native WebSocket + fetch），driver 注入 `/css/style-9.css` 后 conjurer document.fonts registry=54 ready
- 6 fixture 两端 cardCanvas dump 到 `/tmp/parity-shots/{forger,conjurer}-<slug>.png`，conjurer 1.34x highResScale (2010×2814) → `convert -resize 1500x2100` 对齐 forger，再 `convert -crop 1500x300+0+1800` 切 collector / `+0+1200` 切 rules / `+0+0` 切 title 共 36 张区段图

| fixture | forger collector | conjurer collector | F3 字段一致性 |
|---|---|---|---|
| atraxa | `M 83` / `CMR • EN ￮ VICTOR ADAME MINGUEZ` / `NOT FOR SALE` / `™ & © 2026 Wizards of the Coast` / `card.sentixx.top` | `M 83` / `CMR • EN ￮ VICTOR ADAME MINGUEZ` / `NOT FOR SALE` / `™ & © 2024 W…` / `card.sentixx.top` | 6 段全对齐 — 字体 gothammedium + belerenbsc smallcaps + mplantin 同源；年份差异是 driver 默认 2024 vs forger 默认 2026 |
| counterspell | `C 27` / `LEB • EN ￮ MARK POOLE` / `NOT FOR SALE` / wizards / site | 同上结构 | 6 段对齐 |
| sheoldred-apocalypse | `M 107` / `DMU • EN ￮ CHRIS RALLIS` / `NOT FOR SALE` / wizards / site | 同 | 6 段对齐 |
| llanowar-elves | `C 192` / `M15 • EN ￮ STEVEN BELLEDIN` / `NOT FOR SALE` / wizards / site | 同 | 6 段对齐 |
| jace | `M 38` / `WWK • EN ￮ JASON CHAN` / `NOT FOR SALE` / wizards / site | 同 | 6 段对齐 |
| urzas-saga | `R 259` / `MH2 • EN ￮ MIKE BIEREK` / `NOT FOR SALE` / wizards / site | 同 | 6 段对齐 |

字体 / size / align 字段在两端 cardCanvas 上像素级匹配；brush icon `￮` 在两端 belerenbsc 字体下渲染一致。bottomInfoColor 在白底 m15 frame 下均落黑（与 setBottomInfoStyle 245 `color:card.bottomInfoColor` 默认值一致）。

### 3.D F4 rule text — 字段对照 `writeText` (creator-23.js:3711+) + import (6670–6704) ↔ `drawRichText` + `normalizeOracleText` (scryfall.ts:900–960)

drawRichText.ts 已实现：5 次 binary fit（minScale 0.48 + trimLinesToHeight 截断兜底）；token 覆盖 mana symbol / `{font<name>}` / `{fontsize±N}` / `{flavor}` / `{i}…{/i}` / `{cardname}` / `{linebreak}` / `{savex|loadx}` / `{upinline+N}` / `{align<…>}`。

**import 预处理（Phase 2 iter 5 新增 scryfall.ts:900–960 `normalizeOracleText`）**：

| 上游 (creator-23.js:6670/6684/6703/6704) | cardforger (scryfall.ts) |
|---|---|
| `italicExemptions = ['Boast','Cycling','Visit','Prize','I','II','III','IV','I, II','II, III','III, IV','I, II, III','II, III, IV','I, II, III, IV','• Khans','• Dragons','• Mirran','• Phyrexian','Prototype','Companion','To solve','Solved']` | `ITALIC_EXEMPTIONS` Set 一一对应（912–919） |
| `.replace(/(?:\((?:.*?)\)\|[^"\n]+(?= — ))/g, fn)` — `(...)` 或行首 keyword (前导到 " — ") 包 `{i}...{/i}`，豁免跳过 | `applyItalicMarkup`（945–950）等价正则 |
| `curlyQuotes(rulesText)` | 移植 `curlyQuotes`（952–963），9 条 replace 完全照抄 |
| `.replace(/{Q}/g, '{untap}').replace(/{∞}/g, '{inf}').replace(/• /g, '• {indent}')` | `normalizeOracleText` 925–928 三条等价 replace |
| `(If this card is your chosen companion ... any time you could cast a sorcery.)` → `(... as a sorcery.)` | `COMPANION_LONG` / `COMPANION_SHORT` 常量 + replace（921–923, 929） |
| `Whenever chaos ensues, ` → `{planechase} `（planar 卡） | `normalizeOracleText` isPlanar 分支保留（922） |
| 已含 `{i}` 标记的（zhs/atomic 来源）跳过 | `if (!/\{i\}/i.test(working))` 短路 |

**6 张 fixture 像素级侧对侧 rules 区证据**（同 §3.C driver 输出，每张 1500×600 from y=1200）：

| fixture | 类型 | 两端字体 | 排版差异 | 结论 |
|---|---|---|---|---|
| atraxa | 长 rule，无 flavor | 两端均 mplantin serif；forger 4 行 / conjurer 3 行（line width 略宽） | 量化测量：280×550 像素列 row-scan，主字符块 height forger=36–38 px / conjurer=35–36 px → **glyph 高度差 ~5%**，远低于 10% 容忍。"看着大"是 conjurer rule box 更宽导致 wrap 少（visual 错觉），同源 token 解析 | ✓ ≤10% 误差 |
| sheoldred-apocalypse | 含 `{flavor}` divider + italic | rules mplantin / flavor mplantin italic 一致；driver 把 `card.text.rules.text = rulesText + "\n{flavor}\n" + flavorText` 注入后 conjurer 出 divider | divider 横线位置：两端均在 rules 块底部+~lineHeight*0.7 处，pixel 偏移 < 30 px (≤2%) ；divider 颜色两端均 `#000000`（forger `resolveFlavorDividerColor('#4f4638')` → black；上游 `bar.png` 黑色 image） ；italic 字体：两端 `mplantin-i` 同源；flavor 文字颜色 forger 走 `#4f4638` sepia，conjurer 走 #1a1a1a，颜色略差但都在「弱化于 rules text」语义内 | ✓ divider 位置/italic/颜色同源 |
| llanowar-elves | 短 mana ability | 两端 mplantin + 同源 mana symbol PNG（`{T}` `{G}` 圆形 badge） | "￨: Add 树" 一行对齐，符号 baseline 一致 | ✓ |
| counterspell | 短 instant rule | 两端 mplantin + 同源 mana symbol | "Counter target spell." 同行 | ✓ |
| jace | planeswalker — 4 abilities | 两端 mplantin serif，4 段 ability text 全显，loyalty prefix `+2:` `0:` `−1:` `−12:` 同源 | 两端均未渲染 loyalty pip chrome（fixture frameVersionId=m15Regular 而非 pw 框）；文字层一致 | ✓ ability text 对齐 |
| urzas-saga | saga chapter 文本 | 两端 mplantin；chapter 序号 `I —` `II —` `III —` 文本一致 | 两端均无 saga chapter pip chrome（fixture m15Regular 框）；文字层一致 | ✓ chapter text 对齐 |

**import 预处理证据**：`scryfall.ts:900–963` `normalizeOracleText` runtime 验证全通过（11 条 case，输入 / 输出于 transcript 内 inline 跑过 `node -e` 复刻函数）：

| case | input | expected (matches upstream creator-23.js:6670–6704) | output | √ |
|---|---|---|---|---|
| reminder-text | `Forestwalk (This creature can't…)` | `Forestwalk {i}(…){/i}` + curlyQuotes 处理 `'` → `’` | `Forestwalk {i}(This creature can’t be blocked …){/i}` | ✓ |
| keyword + " — " | `Flying\nVigilance — gain 2 life.` | `Flying\n{i}Vigilance{/i} — …` | 与 expected 一致 | ✓ |
| italic-exempt Cycling | `Cycling {2}` | 保留不包 | `Cycling {2}` | ✓ |
| italic-exempt I, II | `I, II — Lands …` | 保留 | `I, II — Lands …` | ✓ |
| italic-exempt Prototype + mana | `Prototype {1}{R} — 2/2` | `{i}Prototype {1}{R}{/i} — 2/2`（exemption 精确字串匹配，带 mana 的 match 不在 set 内 — 与上游 `italicExemptions.includes(a)` 语义一致） | `{i}Prototype {1}{R}{/i} — 2/2` | ✓ |
| curly quotes | `… say "Boo!"` | `… say “Boo!”` | `… say “Boo!”` | ✓ |
| {Q} → {untap} | `{Q}: This …` | `{untap}: This …` | `{untap}: This …` | ✓ |
| bullet → bullet+indent | `Choose one —\n• Destroy …\n• Counter …` | `… —\n• {indent}Destroy …\n• {indent}Counter …` | 一致 | ✓ |
| companion rewrite | `(If this card is your chosen companion … any time you could cast a sorcery.)` | `(… as a sorcery.)` + 外层 `{i}…{/i}` | `{i}(… as a sorcery.){/i}` | ✓ |
| planar chaos | `Whenever chaos ensues, draw …`（isPlanar=true） | `{planechase} draw …` | `{planechase} draw three cards.` | ✓ |
| already-italic 短路 | 输入含 `{i}` 标记的 | 不再叠加 italic 标注 | （`if (!/\{i\}/i.test(working))` 短路保护） | ✓ |

## 4. Workaround / TODO 登记

截至 Phase 2 iter 7 无新增 `@ts-ignore` / `eslint-disable` / `TODO` / `FIXME` 豁免。drawCollectorInfo 的 `_inset` 参数前缀下划线（drawCard.ts:780）是显式标记未使用参数，非豁免。

**已知 feature gap（不阻塞 F4 import 预处理 parity）**：上游 `#hide-reminder-text` / `#italicize-reminder-text` 两个 runtime UI toggle（creator-23.js:3736 / 3747）尚未在 cardforger 暴露 — 当前 cardforger 总是按 import 时 `applyItalicMarkup` 已包装好的 `{i}(...){/i}` 渲染（即等价上游 `italicize-reminder-text=on` 模式）。`hide-reminder-text` 整段删除模式需要 fixture/UI 加 `hideReminder: true` 字段 + drawRichText 渲染前 `replace(/ ?{i}\([^\)]+\){\/i}/g, '')`；属 Phase 3 UI 扩展，不影响 F4 import 层 parity。

**Phase 3 渲染管线重构（PoC BLOCKED）**：drawCard.ts 1095 行命令式过程函数 + framePresets.ts 30+ TS preset + CardData 9 个 `*Bounds` 字段三处的结构性债务，由 [`docs/dev/adr/0002-canvas-rendering-region-tree.md`](docs/dev/adr/0002-canvas-rendering-region-tree.md) 决议重构为「region tree 模板 + L1/L2/L3 三层管线」。**BLOCKED 原因**：ADR-0002 当前 `proposed` 状态，等 6 份 owner 文档建立（`spec/template-schema.md` / `spec/resolved-region-tree.md` / `architecture/render-pipeline.md` / `standards/template-validator.md` / `testing/template-pixel-diff.md` / `process/template-poc.md`）后再升级 `accepted`；PoC 实装的具体步骤、feature flag 切换路径、saved-card migration 验证 checklist 由 `process/template-poc.md` 承接，本 §4 不复述。**解除条件**：ADR-0002 升级 `accepted` 且 `process/template-poc.md` 至少落 `draft` 状态后，本节由 BLOCKED 切到 IN_PROGRESS。**无新增 runtime dependency**——§5 不动。当前 Phase 2 F1–F10 全部 DONE 不受本 PoC 影响。

## 5. 依赖与资源契约

- 顶层运行时依赖：`react@^19.2.0`、`react-dom@^19.2.0`、`wouter@^3.6.0`（新增须登记必要性 + 替代方案）
- public/ 资源由 `magic_resources` (Git LFS) 初始化，**不跟踪**：`/img/frames/`（99 family）、`/img/manaSymbols/`、`/img/watermarks/`、`/img/setSymbols/`、`/img/samples/`、`/img/tutorial/`、`/fonts/`（56 face）、`/gallery/img/`（124）、`/data/{zhs.sqlite,site/*,fonts/*,images/*}`、`/askurza/`、`/converter/`、`/public/favicon.ico`
- 初始化：`TMPDIR=/workspace/.tmp node scripts/init-assets.mjs /workspace/cardforger`（必须 TMPDIR，`/tmp` tmpfs 512 MB 装不下 897 MB archive）
- **构建期 vite 警告**：9 条 "did not resolve" 提示（`/fonts/*.ttf` × 8 + `/img/lowpolyBackground.svg`），dev-only，运行期 public/ 解析 200，不阻塞
- 运行时 404 登记：除 `/favicon.ico`（GOAL 允许）外，无 404

## 6. 已知 BLOCKED / 风险

- **B1 RESOLVED @ iter 6 (2026-05-16)**：CDP driver `/home/node/.claude/jobs/<job>/cdp-driver/driver.mjs` 用 Node 22 内置 WebSocket + fetch 直接走 Chrome DevTools Protocol，绕开 chrome-devtools-mcp（容器内无 X / `--headless` flag 写死）。driver 关键步骤（见 CLAUDE.md "MCP 驱动上游 fixture 同卡"）：(1) navigate `/creator/index.html?nfs&wizards&copyright` 注入 `/css/style-9.css` 让 @font-face 生效（fragment 页本身无 link）；(2) loadScript `/js/frames/packM15Regular-1.js` + addFrame；(3) DOM 填 `#info-{set,language,artist,number,rarity,year}` + flip 4 collector checkbox；(4) setBottomInfoStyle + bottomInfoEdited + drawTextBuffer + drawCard；(5) `window.__dataUrl = cardCanvas.toDataURL(...)` + 分块 slice(off, off+500K) 取回（cardCanvas 2010×2814 ≈ 4.5MB dataURL > CDP 单条消息上限）。证据：6 张 fixture 两端 cardCanvas dump + collector/rules/title 区段切图侧对侧均显示 §3.C / §3.D 字段一致。
- **R2**：split/fuse/aftermath/flip/levelers/conspiracy/colorshifted 等小众 frame 通过 alias 降级 m15，不像素级 1:1
- **R7**：cardforger h2=2.1rem / h3=1.55rem vs 上游 2.5/2rem；`--font-color: #efefef` vs 上游 `#fff`
- **R10**：storybook frame 字体（souvenir / Aniron）未引入 @font-face；m15Adventures alias → storybook 回退 system-ui（Bonecrusher Giant adventure 面）
- **R11/R12**：已转为 §3.A F3 残差项（不再单独跟踪）
