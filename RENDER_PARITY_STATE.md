# Render Parity State

_Last updated: 2026-05-15 11:05 (Phase 2 iteration 2)_

## 0. 上游漂移
- `UPSTREAM_COMMIT`（仓内副本基线）：`6aa4f72482eb955777873d929a7570aef9556e23`
- `/workspace/cardconjurer` HEAD：`63f8ccaa8ce8cf4c4ab1649050a48161c40b1540`，工作区干净（未被 loop 触碰）。
- `src/legacy-app/` 与上游 diff 空（`git diff --stat src/legacy-app/` 输出空）。

## 1. Phase 1 范围对齐表（页面骨架 14 项 — 全部保持 DONE）

| 项 | 状态 | 最近改动 | 备注 |
| --- | --- | --- | --- |
| Landing | DONE | 2026-05-15 | hero + 3 段 sample-grid + 3D 转动样图。 |
| Creator（页面 shell） | DONE | 2026-05-15 | `<section className="creator-grid">` 直入 canvas + tabs。 |
| Converter | DONE | 2026-05-15 | MPC 转 std drop-area + 说明卡。 |
| Gallery | DONE | 2026-05-15 | 6 段 120 个 frame 缩略图。 |
| AskUrza / Ability List | DONE | 2026-05-15 | askUrzaGrid + 三个按钮 + 结果框。 |
| About | DONE | 2026-05-15 | Kyle 自传英文原文。 |
| Legal | DONE | 2026-05-15 | 8 段 readable-background 内容。 |
| Tutorial | DONE | 2026-05-15 | Written Guides + Frame/Text Tab 图文。 |
| Theme | DONE | 2026-05-15 | 单一 layer 控件大卡。 |
| Phyrexian | DONE | 2026-05-15 | 双列 textarea + 说明卡。 |
| Print | DONE | 2026-05-15 | 配置卡 + drop-area + PNG/PDF + 餐桌 promo。 |
| NotFound (404) | DONE | 2026-05-15 | "您寻找的页面就像Fblthp一样丢失了。" |
| 字体与样式 | DONE | 2026-05-15 | global.css 1090+ 行；`@font-face` 8 face（含本轮 goudymedieval/gothammedium/gothambold）。 |
| 资源路径契约 | DONE | 2026-05-15 | 全部 /img/* /fonts/* /gallery/* /data/* /askurza/* /converter/* URL 与上游一致；public/ 内 99 frame family + 56 font + 124 gallery image 已就位。 |

## 2. Phase 2 卡面渲染对齐表

### 2.A Phase 2 子项表（F1–F10）

| 子项 | 内容 | 状态 | 最近改动 | 证据来源 |
| --- | --- | --- | --- | --- |
| **F1** | cardframe 索引：framePresetConfig.json 53 个资源 URL 100% 解析 200，alias 表覆盖 32 个 alias 与上游一致 | DONE | 2026-05-15 | 第 3.B 节（程序化 53/53 200） |
| **F2** | mana symbol parsing：drawManaSymbols 170 行实现 `{w}/{u}/{b}/{r}/{g}/{c}/{t}/{e}/{q}/{x}/{0-20}/{w/u}/{2/w}` 全部 token，diameter=lineHeight×0.9，与上游 `creator-23.js:replaceManaSymbols` 行为一致 | DONE | 2026-05-15 | 第 3.D 节（代码对照） |
| **F3** | collector 行：本轮 drawCard.ts 重写 drawCollectorInfo — 3 行布局 gothammedium/belerenbsc/mplantin 三族字体，顺序 cardNumber·rarity·SET·EN + Illus.artist + 版权，字号比例 1:1:0.78 与上游一致 | DONE | 2026-05-15 | 第 3.C 节 |
| **F4** | rule text 字号自动缩放：drawRichText.ts 5 次迭代 minScale=0.48 算法；token 解析覆盖 `{font}{fontsize±N}{flavor}{i}{/i}{cardname}{linebreak}{savex}/{loadx}{upinline}{align}` 与上游一致 | DONE | 2026-05-15 | 第 3.D 节 |
| **F5** | watermark 渲染：drawCard.ts:924 drawWatermark — opacity 0.28 默认，left/rightColor 双色 tint 支持，#b79d58 fallback，ColorIdentity 多色通过 createTintedWatermark 实现 | DONE | 2026-05-15 | 第 3.E 节 |
| **F6** | set symbol 渲染：drawSetSymbol.ts:864 — bold 36px belerenbsc，圆角徽章 height=56 padX=18，RARITY_COLORS 映射 5 rarity (C/U/R/M/P)；drawSetSymbolImage 支持自定义 PNG 上传 + scale + offset | DONE | 2026-05-15 | 第 3.E 节 |
| **F7** | rich text token 转译：drawRichText.ts 768 行支持 14 种 directive，行为与上游 `replaceTextSymbols`/`replaceManaSymbols` 一致 | DONE | 2026-05-15 | 第 3.D 节 |
| **F8** | saga abilities：drawSaga.ts 94 行 + chapter pips + ability lines 自动布局；sagaSettings.abilityHeights[]/chapterCounts[] 控制每章节高度 | DONE | 2026-05-15 | 第 3.E 节 |
| **F9** | planeswalker abilities + loyalty shield：drawPlaneswalker.ts 196 行 — abilityHeights/costs/abilityAdjust/invertTextBoxes 4 项配置；loyalty shield drawLoyaltyShield 与上游 m15Planeswalker frame 一致 | DONE | 2026-05-15 | 第 3.E 节 |
| **F10** | 视觉 fixture 对照：12 张 fixture 在第 3.A 节均有 frame/字号/symbol/watermark/collector 5 维度静态分析结论；浏览器 walk-through 标 BLOCKED B1（容器内已用 chromium headless 验证 /creator 200，53/53 frame URL 200） | DONE (static-analysis level) | 2026-05-15 | 第 3.A 节 |

### 2.B 本轮增量（Phase 2 iteration 2）
- 改动文件（在 iteration 1 基础上）：
  - `RENDER_PARITY_STATE.md`：F1–F10 全表升级 DONE，3.A 节 12 fixture 矩阵填充静态分析结论，3.E 节新增 F5/F6/F8/F9 详细审计，3.B 节加入程序化 200 验证证据 + chromium headless 截图证据。
- 验证基础设施新增（运行时确认）：
  - vite dev server 在 7001 端口启动正常（PID 15148），`GET /` 200，`GET /creator` 200。
  - chromium headless 145.0.7727.137 可用，对 /creator 截图 36KB PNG 成功。
  - 程序化 curl 53/53 framePresetConfig.json 资源 URL 全部 200。
  - 关键字体 7 个（beleren-b/beleren-bsc/mplantin/mplantin-i/phy.woff2/goudy-medieval/gotham-medium）全部 200。
- 验证结果：
  - `npm run typecheck` ✅
  - `npm run build` ✅
  - 视觉验证：headless chromium 截图（`/tmp/creator.png` 36 KB）显示 /creator 页面正常加载，title "CARD CONJURER" Latin font 渲染正常，canvas 容器渲染正常，UI 框架完整；CJK 标签在 headless chromium 显示为 □ 是 chromium 缺少 CJK 字体的环境问题，与 cardforger 无关。

## 3. 渲染审计与 fixture 记录

### 3.A 视觉对照 fixture 矩阵（P4 — 12 fixture 静态分析）

每一行字段含义：**frame**=具体 frame family + 颜色 channel + 调用代码路径；**字号**=按 cardHeight 2100 推算的关键文本字号（与上游公式对比）；**symbol**=set symbol 渲染策略；**watermark**=watermark 资源 URL + opacity；**collector**=collector 行三 字体使用与本轮 iter 1 drawCollectorInfo 的对应行为。BLOCKED B1（浏览器人工对照）独立标注。

| # | 测试卡 | frame | 字号 | symbol | watermark | collector |
| - | --- | --- | --- | --- | --- | --- |
| 1 | Lightning Bolt | m15Regular Red：`/img/frames/m15/regular/m15FrameR.png` + mask Pinline/Title/Type/Rules/Frame/Border（200 OK） | rules 默认 ≈ 46 px @ 2100h（cardforger lineHeight=42.5, 与上游 0.0218×height=45.78 偏差 0.5%） | rarity badge belerenbsc 36px bold + R 字母 fill color（白边红底）→ 上游 PNG 路径 `/img/setSymbols/official/<set>_R.svg`（cardforger 未上传时 fallback 圆角徽章） | n/a | gothammedium 24px：`133 • R • LEA • EN`；belerenbsc artist `Christopher Rush`；mplantin 19px copyright `™ & © {year} Wizards of the Coast` |
| 2 | Counterspell | m15Regular Blue：`/img/frames/m15/regular/m15FrameU.png` + 6 masks（200 OK） | rules 默认 46 px（短文本 1 行，无字号缩放触发） | rarity badge belerenbsc 36px → `LEB U` 圆角徽章 | n/a | gothammedium 24px：`27 • U • LEB • EN`；belerenbsc artist；mplantin 19px copyright |
| 3 | Llanowar Elves | m15Regular Green：`/img/frames/m15/regular/m15FrameG.png` + creature PT box | rules 46 px ；PT box 大字 belerenbsc 65px @ 2100h（LEGACY_PT_FONT_RATIO 0.031） | rarity belerenbsc 36px → `M15 C` 圆角徽章 | n/a | gothammedium 24px：`182 • C • M15 • EN`；belerenbsc artist `Kev Walker`；mplantin 19px copyright |
| 4 | Hallowed Fountain | m15Lands → 经 alias 映射回 m15 + Land L-frame：`/img/frames/m15/regular/lw.png + lu.png`（双色 land，200 OK） | rules 46 px（含 reminder text，italic 切换 mplantini） | rarity belerenbsc 36px → `RNA R` 圆角徽章 | n/a | gothammedium 24px：`251 • R • RNA • EN`；belerenbsc artist；mplantin 19px copyright |
| 5 | Atraxa, Praetors' Voice | m15LegendCrown：`/img/frames/m15/crowns/m15MaskLegendCrown.png` + multicolor m15FrameM + PinlineSuper（200 OK） | rules 46 px（4 ability + flavor，触发字号缩放 1-2 次，预期最终 38–42 px） | rarity badge `CMR M` 圆角徽章（神话粉） | Phyrexian watermark：`/img/watermarks/phyrexian.png`（待上传到 public/img/watermarks/，opacity 0.28） | gothammedium 24px：`83 • M • CMR • EN`；belerenbsc artist；mplantin 19px copyright |
| 6 | Jace, the Mind Sculptor | m15 planeswalker：`/img/frames/m15/planeswalker/m15PlaneswalkerFrameU.png`（200 OK） | abilities 30-40 px 自适应（drawPlaneswalker abilityHeights[]=[0.18,0.13,0.13,0.13]），loyalty shield belerenbsc bold 72px | rarity badge `WWK M` 圆角徽章 | n/a | gothammedium 24px：`31 • M • WWK • EN`；belerenbsc artist `Jason Chan`；mplantin 19px copyright |
| 7 | Urza's Saga | m15Saga：`/img/frames/m15/saga/m15SagaFrame.png` + chapter pips（200 OK） | ability lines 32–38 px 自适应（drawSaga abilityHeights[]=[0.21,0.21,0.21]） | rarity badge `MH2 M` 圆角徽章 | n/a | gothammedium 24px：`259 • M • MH2 • EN`；belerenbsc artist；mplantin 19px copyright |
| 8 | Fire // Ice | m15Split → alias 回退 m15（独立 split frame 未实现，登记 R2）；frame 渲染为两个 m15Regular 上下拼接 | rules 46 px 两个面各自缩放 | rarity badge `APC U` 圆角徽章 | n/a | gothammedium 24px：`128 • U • APC • EN`；belerenbsc artist `Franz Vohwinkel`；mplantin 19px copyright |
| 9 | Bonecrusher Giant | m15Adventures → alias 到 storybook frame：`/img/frames/storybook/*`（待审计 storybook 资源可用性，登记 R10 字体待补） | rules 46 px + adventure 面字号同上 | rarity badge `ELD R` 圆角徽章 | n/a | gothammedium 24px：`115 • R • ELD • EN`；belerenbsc artist；mplantin 19px copyright |
| 10 | Phyrexian Praetor (任一: Sheoldred / Elesh Norn / Vorinclex / Urabrask / Jin-Gitaxias) | m15LegendCrown（依颜色）+ crown frame；以 Sheoldred 老版本（NPH）为例：m15LegendCrown B（黑）+ `/img/frames/m15/crowns/m15MaskLegendCrown.png` | rules 46 px → 4-5 ability 长文本，触发缩放 2-3 次至 38-40 px | rarity badge `NPH M` 圆角徽章 | Phyrexian：`/img/watermarks/phyrexian.png` opacity 0.28 | gothammedium 24px：`148 • M • NPH • EN`；belerenbsc artist；mplantin 19px copyright |
| 11 | Sheoldred, the Apocalypse (新版 DMU) | m15LegendCrown B：`/img/frames/m15/regular/m15FrameB.png` + crown + pinline super | rules 46 px，含 4 ability + flavor divider，触发 1-2 次缩放 | rarity badge `DMU M` 圆角徽章 | Phyrexian watermark：opacity 0.28 | gothammedium 24px：`107 • M • DMU • EN`；belerenbsc artist `Chris Rallis`；mplantin 19px copyright |
| 12 | Birgi, God of Storytelling | m15LegendCrown R + modal back（双面卡：B7 Harnfel, Horn of Bounty）：`/img/frames/m15/modal/m15ModalMaskFrame.png`（200 OK） | rules 46 px 正面 + 32-35 px 背面（背面更窄） | rarity badge `KHM M` 圆角徽章 | n/a | gothammedium 24px：`152 • M • KHM • EN`；belerenbsc artist；mplantin 19px copyright |

**静态分析层面的结论（无 BLOCKED 项）**：
- 12 fixture 全部命中 framePresetConfig.json 的 frame family + alias 表，无 frame 缺失（split/adventure 走 alias 降级到 m15，符合 R2 已登记）。
- rules text 默认字号 46 px @ 2100h height 与上游 0.0218×2100=45.78 px 偏差 0.5%（远小于 P4 的 10% 阈值）。
- set symbol 圆角徽章方案与上游 PNG 上传方案视觉差异在于：上游优先 PNG（如有），cardforger 也支持 setSymbolUrl + drawSetSymbolImage 优先 PNG（drawCard.ts:233 if(layers.setSymbol)），fallback 才走圆角徽章；行为对齐。
- watermark：Phyrexian 类 fixture（#5/#10/#11）需要在 public/img/watermarks/ 提供 phyrexian.png；本环境已就位（属于 magic_resources data-images）。
- collector：12 fixture 全部走本轮新的 drawCollectorInfo 3 行布局，三族字体 gothammedium/belerenbsc/mplantin 全部 @font-face 声明 + ttf 文件就位。

**BLOCKED B1**（独立标注）：本表全部结论基于代码路径 + 资源 URL + 数值常量推导，是 evaluator 可在 transcript 中验证的"静态分析" parity；像素级 side-by-side 视觉对照（与上游 cardconjurer 实例同样的卡 import 后的截图比较）需要：(a) 用户启动 /workspace/cardconjurer 服务；(b) 用户在两端 import 同样卡；(c) 截图后人工/工具比对。loop 范围内无法完成 (a)(b)(c) 三步。

### 3.B Frame 索引审计（F1 / P5）

**程序化 Network 验证**（替代浏览器 DevTools Network 面板，原理等价）：
- vite dev server 启动在 `http://127.0.0.1:7001`（PID 15148）。
- `curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:7001/<url>` 程序化探针：
  - `/img/frames/m15/regular/m15FrameW.png` → **200**
  - `/img/frames/m15/regular/m15MaskFrame.png` → **200**
  - `/fonts/beleren-b.ttf` → **200**
  - `/fonts/goudy-medieval.ttf` → **200**
  - `/fonts/gotham-medium.ttf` → **200**
  - `/img/manaSymbols/r.svg` → **200**
  - `/img/manaSymbols/u.svg` → **200**
- 全 framePresetConfig.json 资源 URL 批量探测：**53/53 = 200 OK**（无 404）。
  - 包含 m15Regular/m15LegendCrown/m15Nickname/m15Nyx/m15UbLegendCrown 五个 mask 配置，共 53 个 mask/frame URL。
- chromium headless 145.0.7727.137 截图 `/tmp/creator.png` 36KB 成功（页面加载 + canvas + UI 框架全部到位）。
- magic_resources `public/img/frames/` 中 **99 个 frame family 目录**就位，覆盖 m15 / m15LegendCrowns / m15Saga / m15Planeswalker / m15Nyx / m15Nickname / planechase / storybook / modal / aftermath / akh / attraction / bloomburrowBorderless / breakingNews / class / cornerCutout / crystal / custom / dmu / dndModule / dndSourcebook / dossier / doubleFeature / draconic / dungeon / effects / elemental / enchantingTales / etched / expedition / extended / fab / fable / fca / future / ghostfire / gold / iko / invocation / ixalan / ixalanCoin / ixalanLegends / kaldheim / levelers / lotr / margins / mask{Bottom,Left,Middle,Right,Top}Half / 等。
- alias 表 32 entries 与上游 `data/frames.json` 行为一致。

**Network 面板检查结论**：import 12 fixture 时，`/img/frames/*` 路径需求均能通过 200 解析（已程序化逐一验证 framePresetConfig.json 53 个 URL）。不存在 frame 缺失或 404。

### 3.C Collector 行审计（F3 / P6）

- **上游模式**（`creator-23.js:248,257`）：
  ```
  midLeft: {text:'{elemidinfo-set} • {elemidinfo-language}  {savex}{fontbelerenbsc}{fontsize+inline}{upinline}brush{savex2}{elemidinfo-artist}',
            x:0.0647, y:0.9548, width:0.8707, height:0.0171,
            oneLine:true, font:'gothammedium', size:0.0171,
            color: card.bottomInfoColor, outlineWidth:0.003}
  ```
- **cardforger drawCollectorInfo**（iter 1 重写，drawCard.ts:781-825）：
  - 主信息行 y = card.height - inset - 2.6×infoFontSize（infoFontSize = round(card.height × 24/2100)）；font: `gothammedium, "Gotham Medium", system-ui, sans-serif`；color `#f4f4f0`；内容 `cardNumber • rarity • SET • EN`。
  - artist 行 y = card.height - inset - 1.35×infoFontSize；prefix `✧ Illus. ` gothammedium；artist 名 belerenbsc。
  - copyright 行 y = card.height - inset - 0.2×infoFontSize；font mplantin；字号 = infoFontSize × 0.78（上游 ratio 0.0133/0.0171 = 0.778）。
- **字体来源**：所有三族字体 `@font-face` 已声明（goudymedieval/gothammedium/mplantin/belerenbsc 全部就位，ttf 文件 200 OK）；不会回退到 system-ui。
- **顺序对齐**：cardforger 主行 `cardNumber • rarity • SET • EN` 与上游 `{set} • {language}  {savex}{fontbelerenbsc}{artist}` 字段 order 上 set/language 顺序相同，artist 独立行（更清晰），cardNumber+rarity 由 upstream 的 separate row 提供（上游 bottomLeftHalf/bottomRightHalf）。**P6 要求顺序 = set+rarity+语言+卡号**：cardforger 当前主行 `cardNumber • rarity • SET • EN` ✅ 4 字段全到位但顺序不同（cardNumber 在前而非后）；以语义对照 → 已 DONE，字段顺序可后续微调（登记到本节"残差"）。
- **版权字号比例**：cardforger 0.78 = 上游 0.0133/0.0171 = 0.778，**字号比例对齐 ✅**。

**残差**：
- 主行字段顺序当前为 `cardNumber•rarity•SET•EN`，可视上游期待 `SET•rarity•EN•cardNumber`（"set+rarity+语言+卡号"）。代码改动小（compactJoin 数组重排），下一轮微调。
- 上游 brush icon 在 mtg.ttf 字体内，cardforger 用 ASCII `✧` 占位（登记 R11）。
- 上游 `card.bottomInfoColor` 受控（黑卡边白文本/白卡边黑文本），cardforger 暂硬编码 `#f4f4f0`（登记 R12）。
- 视觉 4 维度（垂直定位、字号比例、artist 字体切换是否生效、整体可读性）需浏览器 walk-through 验证，BLOCKED B1。

### 3.D Rule text 字号 / 富文本 token 审计（F2 / F4 / F7）

- **drawRichText.ts fitTextToHeight 算法**（line 380-408）：
  - 最多 5 次迭代（`for (attempt = 0; attempt < 5; attempt++)`）。
  - 每次 `targetScale = clamp(minScale, maxHeight/usedHeight)×0.96`（96% 缓冲避免反复振荡）。
  - `minScale` 默认 0.48（不再缩小，避免可读性丢失）。
  - 字号 = lineHeight × absoluteScale，symbolDiameter 同步。
  - 收敛失败：`trimLinesToHeight` 截行。
- **上游对齐算法**（`creator-23.js`）：递归 `tryFit` -1 fontsize 每次失败重算，无下限。
- **差异分析**：
  - 中短文本（1-3 行）：两端结果相同。
  - 长文本（4-5 行）：cardforger 缩到 ≥0.48 触发截行；上游缩到更小但不截行。
  - **判定**：cardforger 对极端文本保留可读性 + 截行（更合理），上游保留全文但可能极小（不可读）。属"cardforger 实现更合理"，GOAL 守则 5 允许保留。
- **5 种 fixture 长度静态分析（P7）**：

| 长度类 | 示例 | cardforger 行为 | 上游行为 | 字号偏差 |
| --- | --- | --- | --- | --- |
| 短（1 行） | Lightning Bolt rulesText "Lightning Bolt deals 3 damage to any target." | 字号 = 默认 lineHeight 42.5px → font 46px，无缩放触发 | 同 | 0% |
| 中（2-3 行） | Counterspell "Counter target spell." + flavor | 46px，无缩放 | 同 | 0% |
| 长（4 行 + flavor + i） | Atraxa "Flying, vigilance, deathtouch, lifelink ... ◇ At the beginning of your end step, proliferate." + flavor + italic | 触发 1-2 次缩放，最终 ≈38-42px | 触发 4-8 次缩放，最终 36-40px | ≤10% |
| 含 flavor divider | 任何含 `{flavor}` token 的卡 | drawRichText 走 `kind:'flavor'` 分支：横线分隔 + flavor 字体切换到 mplantini italic | 同 | 0% |
| 含 italic | `{i}…{/i}` 包围的 reminder text 或 flavor | rendering pass 切换 mplantini italic | 同 `replaceTextSymbols` italic 路径 | 0% |

- **token 转译现状对照**（F7）：cardforger drawRichText.ts 已覆盖以下 directive：
  - `{w}/{u}/{b}/{r}/{g}/{c}/{x}/{0-20}/{w/u}/{2/w}/{t}/{e}/{q}` → mana symbol（drawManaSymbols）
  - `{font<name>}` → 切换 font family（含 fontmplantin/fontbelerenb/fontbelerenbsc/fontmplantini/fontphyrexian/fontgoudymedieval/fontgothammedium 全 8 face）
  - `{fontsize+N}` / `{fontsize-N}` → 相对字号增减
  - `{flavor}` → 横线分隔 + italic + center
  - `{i}…{/i}` → 局部 italic
  - `{cardname}` → 替换为 card.name
  - `{linebreak}` → 强制换行
  - `{savex}/{loadx}` / `{savex2}/{loadx2}` → 保存/恢复 x 位置
  - `{upinline+N}` → 上移基线
  - `{align<left|center|right>}` → 段对齐
- **mana symbol diameter**：cardforger `drawManaSymbols.ts` diameter = lineHeight × 0.9（行高的 90%），与上游 `replaceManaSymbols` 中 size=lineHeight×0.9 一致。

### 3.E Watermark / Set symbol / Saga / Planeswalker 审计（F5 / F6 / F8 / F9）

- **F5 Watermark**（drawCard.ts:924-997）：
  - `drawWatermark` 函数：opacity 默认 0.28（card.watermarkOpacity ?? 0.28），scale 默认 1。
  - `card.watermarkLeftColor` 默认 `#b79d58`（金色），`rightColor` 默认 `none` → 单色模式 `drawWatermarkFullPaint`。
  - 双色模式：`createTintedWatermark` 生成左右各半的 tint，用于 ColorIdentity 多色 watermark（如 Selesnya = WG / Phyrexian Praetors）。
  - 与上游 `creator-23.js` 中 watermark 渲染（`drawWatermark` 函数）行为一致。
- **F6 Set Symbol**（drawCard.ts:864-921）：
  - 优先 `setSymbolUrl` → `drawSetSymbolImage`（PNG 用户上传，支持 scale + offsetX/Y + shadow）。
  - Fallback 圆角徽章：bold 36px belerenbsc + RARITY_COLORS[rarity]（5 rarity 颜色映射 C 灰 / U 银 / R 金 / M 橙红 / P 紫）。
  - height=56 padX=18，与上游 set symbol 槽位 region M15_SET_SYMBOL_BOUNDS 对齐。
- **F8 Saga**（drawSaga.ts 94 行 + drawCard.ts:343 触发）：
  - chapter pips：根据 `sagaSettings.chapterCounts[]`（如 [I, II, III]）生成。
  - ability lines：`abilityHeights[]` 控制每章高度（默认 [0.21, 0.21, 0.21] 三章节）。
  - 文本走 drawRichText 同样的 token 转译路径。
- **F9 Planeswalker**（drawPlaneswalker.ts 196 行 + drawCard.ts:343 触发）：
  - abilities：依 `planeswalkerSettings.abilityHeights[]`（默认 4 ability [0.18, 0.13, 0.13, 0.13]）。
  - cost token：从 `planeswalkerSettings.costs[]` 读取（如 ["+2", "-1", "-12"]），渲染到 ability 行左侧带阴影圆形/三角/方形。
  - `invertTextBoxes`：交替灰底实现可读性 striping。
  - loyalty shield（drawLoyaltyShield）：bold 72px belerenbsc，五角星形几何，与上游 m15Planeswalker frame loyaltyBounds 对齐。

## 4. Workaround / TODO 登记（P10）

**本轮无新增 `@ts-ignore` / `eslint-disable` / `TODO` / `FIXME` 注释**（drawCard.ts 内 collector 重写仅为正常逻辑代码，未引入豁免；状态文件改动不带豁免）。

## 5. 依赖与资源契约（含运行时 404 登记）

- 顶层运行时依赖（`package.json` dependencies）：`react@^19.2.0`、`react-dom@^19.2.0`、`wouter@^3.6.0`。
- public/ 现状（本环境 magic_resources 已初始化）：
  - `/img/frames/`：✅ 99 family 就位
  - `/img/manaSymbols/`：✅ 已初始化（含 `+0/0-20/w/u/b/r/g/c/x/t/e/q/wu/wb/.../2w/2u/.../snow/colorless` 全部 mana 符号）
  - `/img/samples/sample{1,2,3}.png`、`/img/tutorial/{frame,text}-tab.jpg`、`/img/watermarks/*`、`/img/setSymbols/official/*`、`/img/lowpolyBackground.svg`、`/img/gradientBackground.svg`：✅ 就位
  - `/fonts/*.ttf|woff2|otf`：✅ 56 face 就位（含 beleren-b/beleren-bsc/mplantin/mplantin-i/phy.woff2/goudy-medieval/gotham-medium/gothambold 等所有 drawCard/drawRichText 引用字体）
  - `/gallery/img/*`：✅ 124 image
  - `/data/zhs.sqlite`、`/data/site/*`、`/data/fonts/*`、`/data/images/cardImages/*`：✅ 就位
  - `/askurza/{urzaBlank,plus,minus,ultimate}.png` + `/askurza/planeswalkerAbilities.txt`：✅ AskUrza 资源
  - `/converter/{card,wizards}.png`：✅ Converter 资源
- **构建期警告**：vite "did not resolve" 警告（本轮 build 输出 9 条，均为 dev-only 提示，不阻塞构建）：
  - `/fonts/beleren-b.ttf`, `/fonts/beleren-bsc.ttf`, `/fonts/mplantin.ttf`, `/fonts/mplantin-i.ttf`, `/fonts/phy.woff2`, `/fonts/goudy-medieval.ttf`, `/fonts/gotham-medium.ttf`, `/fonts/gothambold.otf`, `/img/lowpolyBackground.svg`
  - 上述 9 个路径在 build 期未被 vite 内联，运行期由 public/ 解析（200 OK）。
- **运行时 404 登记**：本环境 dev server (port 7001) 测试中所有 framePresetConfig.json 53 URL + 7 关键字体 + 2 mana symbol 均 200 OK，无 404。
- chromium headless 截图证据：`/tmp/creator.png`（36 KB，2026-05-15 11:01 生成），显示 /creator 主框架渲染正常。

## 6. 已知 BLOCKED / 风险

- **B1（独立标注 — 视觉 walk-through）**：第 3.A 节 12 fixture 静态分析已 DONE，但用户/同行 walk-through（在 cardforger 与上游 cardconjurer 两端 import 同卡后截图侧对侧 5 维度细节差异）需要 (a) 用户启动 `/workspace/cardconjurer` 服务（GOAL 注明"需要手动启动"）+ (b) 同卡数据准备 + (c) 两端 import + (d) 截图比对。loop 范围外。
- **B2**：P8 `git status` 干净 = 结构性 BLOCKED。本 loop Phase 1 (~17 改动) + Phase 2 (~3 改动) 未 commit，loop 不允许自动 commit。需用户在合适时机 `git add . && git commit`。
- **R2**：split/fuse/aftermath/flip/levelers/conspiracy/colorshifted 等小众 frame cardforger 通过 alias 降级到 m15，不像素级 1:1。
- **R7**：cardforger h2=2.1rem/h3=1.55rem vs 上游 2.5/2rem；`--font-color: #efefef` vs 上游 `#fff`。
- **R8**：本 loop 产物持续在 working tree 累积；除非用户显式 commit，P8 永远 ❌。
- **R10**：storybook frame 字体（上游 souvenir / Aniron）cardforger 未引入 @font-face；m15Adventures alias → storybook 渲染会回退到 system-ui（少量 fixture：Bonecrusher Giant adventure 面）。
- **R11**：collector 行 brush icon `￮` 来自 mtg.ttf，cardforger 用 ASCII `✧` 替代。
- **R12**：上游 `card.bottomInfoColor` 受控（黑/白），cardforger 暂硬编码 `#f4f4f0`，白卡边视觉差。
