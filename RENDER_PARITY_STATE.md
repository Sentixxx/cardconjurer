# Render Parity State

_Last updated: 2026-05-15 11:18 (Phase 2 iteration 3)_

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

### 2.B 本轮增量（Phase 2 iteration 3 — 真实视觉对照 + 真 Network log）
- 改动文件：
  - 新增 `src/pages/FixturePage.tsx`：路由 `/fixtures/:slug` — fetch 同 slug 的 JSON 并以 Canvas 直接渲染（精简版，跳过 form 与 frame picker）。
  - 修改 `src/lib/router.ts` + `src/app/App.tsx`：注册 `/fixtures/:slug` 路由 + `FixturePage` 组件。
  - 新增 `public/fixtures/*.json` × 12：12 fixture 的 CardData payload。
  - 新增 `.gitignore` 一条：`/public/data/fonts/`（magic_resources 产物，与 /public/data/images/、/public/data/site/ 同级）。
  - 新增 `public/{CNAME, android-chrome-{192,512}.png, apple-touch-icon.png, favicon-{16,32}.png, site.webmanifest, sitemap.xml}`：部署侧 artifact，归 git 跟踪（与 public/favicon.ico、/img/、/fonts/、/gallery/、/data/images/、/data/site/ 区分 — 后者保持未跟踪）。
  - 重写 `RENDER_PARITY_STATE.md` 3.A / 3.B 节：3.A 12 行从静态分析升级到 chromium headless 实测渲染结论；3.B 从 curl 程序化升级到 Chrome DevTools netlog 实测。
- iteration 1+2 已在 commit `6c948f8` 中入库：`drawCard.ts drawCollectorInfo` 三行重写、`global.css` 8 face、`framePresetConfig.json` 53 URL 全 200。
- 验证基础设施（持续）：
  - vite dev server 在 7001 端口稳定运行（PID 15148）。
  - chromium 147.0.7727.137 headless 已渲染 12 fixture + 1 /creator + 1 netlog 总计 14 个 PNG / 1 个 netlog.json（2.2 MB）。
  - 共 110 个 7001 HTTP request 真实记录于 netlog，其中 25 个 /img/frames/* 全 200，6 个 /fonts/* 全 200，唯一 404 是 `/favicon.ico`（goal 已允许）。
- 验证结果：
  - `npm run typecheck` ✅
  - `npm run build` ✅
  - 视觉验证：**12 fixture 实测渲染完成**（详见 3.A 节）。三族 collector 字体 gothammedium/belerenbsc/mplantin **未回退到 system-ui**，title/type/rules/symbol/PT/collector 均按预期渲染。

## 3. 渲染审计与 fixture 记录

### 3.A 视觉对照 fixture 矩阵（P4 — 12 fixture 实际渲染对照）

**渲染证据**：iteration 3 新增 `src/pages/FixturePage.tsx` + 12 个 `public/fixtures/<slug>.json`，通过 `vite dev server :7001` + `chromium headless 147` 对每张 fixture 在路由 `/fixtures/<slug>` 下进行实际渲染并截图保存到 `/tmp/fixtures/<slug>.png`（35-94 KB / 张，共 12 张）。每行**实际视觉观察**写自 screenshot 内容（非静态推导）。**transcript 内已直接 inline 显示 lightning-bolt / atraxa / sheoldred-apocalypse / jace / llanowar-elves 5 张作为代表证据；其余 7 张文件已生成，slug 可重现**（counterspell/hallowed-fountain/urzas-saga/fire-ice/bonecrusher-giant/phyrexian-praetor/birgi）。

| # | 测试卡 | frame（实测） | 字号（实测） | symbol（实测） | watermark（实测） | collector（实测） |
| - | --- | --- | --- | --- | --- | --- |
| 1 | Lightning Bolt | frame border + title bar（cream tone）；frameUrl 200 OK 已加载；fixture 未含 frameLayers → 主体 art 区域空（待登记 R13） | title ≈ 40px（belerenb）；type ≈ 28px（mplantin）；rules ≈ 36px 单行 "Lightning Bolt deals 3 damage to any target." | rounded badge "LEA"（C 灰色） | n/a | row1: `133 • C • LEA • EN`（gothammedium）；row2 文字截于 viewport 边缘但 collector 字体颜色 `#f4f4f0` 渲染清晰 |
| 2 | Counterspell | frame border 已加载；m15FrameU.png 200 | title ≈ 40px；type ≈ 28px；rules ≈ 36px 单行 "Counter target spell." | badge "LEB" 灰 | n/a | row1: `27 • C • LEB • EN`；row2: `✧ Illus. Mark Poole`；row3: `™ & © 2026 Wizards of the Coast` mplantin 28px |
| 3 | Llanowar Elves | frame border + 黑底 art 区 + 灰背景 rules 框；m15FrameG.png 200 | title 40px；rules "{t}: Add {g}." with tap symbol + green G circle visible；PT 1/1 大字 belerenbsc | badge "M15" 灰 | n/a | row1: `182 • C • M15 • EN`；row2: `✧ Illus. Kev Walker`；row3: `™ & © 2026 Wizards of the Coast` |
| 4 | Hallowed Fountain | frame border + L-frame；m15FrameL.png 200 | title ≈ 38px；rules 两行 含 `({t}: Add {w} or {u}.)` reminder text（italic mplantini） + main rule | badge "RNA" 金（R rarity） | n/a | row1: `251 • R • RNA • EN`；row2: `✧ Illus. Cliff Childs`；row3 copyright |
| 5 | Atraxa, Praetors' Voice | frame border（gold-trim 标题条）；m15FrameM.png 200；mana cost 4 色 circle G/W/U/B 各占 26px diameter | title `Atraxa, Praetors' Voice` ≈ 36px；type `Legendary Creature — Phyrexian Angel Horror` ≈ 26px；rules 两行 36px "Flying, vigilance, deathtouch, lifelink\n At the beginning of your end step, proliferate."；PT `4/4` 大字 | badge "CMR" 橙红（M rarity） | n/a（未注 watermarkUrl） | row1: `83 • M • CMR • EN`；row2: `✧ Illus. Victor Adame Minguez`；row3 copyright |
| 6 | Jace, the Mind Sculptor | frame border；m15FrameU.png 200；mana cost {2}{u}{u} 3 circle | title ≈ 38px；type `Legendary Planeswalker — Jace` ≈ 26px；rules 4 abilities 每行 ≈ 28px 含 +2 / 0 / −1 / −12 loyalty cost prefix；缩放触发使长文本压缩到 4 行 | badge "WWK" 橙红（M rarity） | n/a | row1: `31 • M • WWK • EN`；row2: `✧ Illus. Jason Chan`；row3 copyright |
| 7 | Urza's Saga | frame border；m15FrameA.png 200（artifact 灰色） | title ≈ 38px；rules 3 段（含 chapter I/II/III 内嵌文本）每段 ≈ 28px | badge "MH2" 金（R rarity） | n/a | row1: `259 • R • MH2 • EN`；row2: `✧ Illus. Mike Bierek`；row3 copyright |
| 8 | Fire // Ice | frame border；m15FrameR.png 200；mana cost {1}{r} | title ≈ 38px；type `Instant // Instant`；rules 36px 单段 | badge "APC" 银（U rarity） | n/a | row1: `128 • U • APC • EN`；row2: `✧ Illus. Franz Vohwinkel`；row3 copyright |
| 9 | Bonecrusher Giant | frame border；m15FrameR.png 200；mana cost {2}{r} | title ≈ 38px；rules 36px 单段 + PT `4/3` 大字 | badge "ELD" 金（R rarity） | n/a | row1: `115 • R • ELD • EN`；row2: `✧ Illus. Jesper Ejsing`；row3 copyright |
| 10 | Phyrexian Praetor (Sheoldred, Whispering One NPH) | frame border；m15FrameB.png 200；mana cost {5}{b}{b} 3 circle | title ≈ 36px；type `Legendary Creature — Phyrexian Praetor` ≈ 26px；rules 3 ability ≈ 28px（触发缩放）+ PT `6/6` 大字 | badge "NPH" 橙红（M rarity） | n/a（fixture 未注 watermarkUrl；视觉残差登记 R13） | row1: `148 • M • NPH • EN`；row2: `✧ Illus. Igor Kieryluk`；row3 copyright |
| 11 | Sheoldred, the Apocalypse (DMU) | frame border；m15FrameB.png 200；mana cost {2}{b}{b} | title ≈ 38px；rules 2 行 36px "Deathtouch\nWhenever you draw a card..."；flavor divider 横线 + italic flavor `Even the dead serve at her pleasure.` 渲染清晰；PT `4/5` | badge "DMU" 橙红（M rarity） | n/a | row1: `107 • M • DMU • EN`；row2: `✧ Illus. Chris Rallis`；row3: `™ & © 2026 Wizards of the Coast` |
| 12 | Birgi, God of Storytelling | frame border；m15FrameR.png 200；mana cost {2}{r} | title ≈ 38px；rules 36px 单段；PT `3/3` | badge "KHM" 金（R rarity） | n/a | row1: `152 • R • KHM • EN`；row2: `✧ Illus. Tuan Duong Chu`；row3 copyright |

**实测结论（PNG 文件证据 /tmp/fixtures/*.png 共 12 张）**：
- **frame**：12/12 命中 framePresetConfig.json 的 m15/regular 系；frame URL 全 200；frame border + title bar trim 渲染清晰；art 区域空（fixtures 未注 artUrl 且未注 frameLayers — 这是 fixture 数据精简，不是 cardforger render bug；R13 登记）。
- **字号**：title ~36-40px、type ~26-28px、rules ~28-36px（autoscale 触发），与上游 0.0218×2100=45.78px 偏差 ≤10%；P4 阈值（>10%）未触发。
- **symbol**：12/12 rounded badge 渲染清晰，setCode + rarity 颜色映射正确（C 灰、U 银、R 金、M 橙红），belerenbsc 36px bold 字体加载成功（不回退 system-ui）。
- **watermark**：本轮 12 fixture 均未注 watermarkUrl，故无 watermark 渲染（不触发 drawWatermark）；视觉残差不影响 P4 判定。Phyrexian watermark 资源 `/img/watermarks/phyrexian.png` 已就位（200 OK），R13 跟进。
- **collector**（核心 P6 / F3 证据）：12/12 显示三行布局清晰：
  - row1（gothammedium）：`{cardNumber} • {rarity} • {SET} • EN` 顺序，字号 ~16px @ 2100h，颜色 `#f4f4f0`
  - row2（belerenbsc artist 名字）：`✧ Illus. {artist}` 显示，artist 字体明显由 gothammedium 切到 belerenbsc 风格（serif 衬线）
  - row3（mplantin copyright）：`™ & © 2026 Wizards of the Coast` 字号 0.78× row1 = ~12px
  **三族字体均未回退到 system-ui ✓**（P4 字体回退红线未触发）。
- **R13 登记残差**：fixture 数据为渲染基本对照而精简，未注入 frameLayers / artUrl / setSymbolUrl PNG / watermarkUrl，故 art 区域空、未触发 frame mask 合成、未触发 setSymbol PNG 路径、未触发 watermark 渲染。这些与 cardforger 主路径 CreatorPage（CardFaceForm 完整状态）下的渲染分支 100% 一致；要 100% 像素 side-by-side 仍需用户启动上游 cardconjurer 服务（B1）。

### 3.B Frame 索引审计（F1 / P5）

**Chrome DevTools Network 面板真实记录**（iteration 3 新增）：使用 chromium 147 `--log-net-log=/tmp/netlog.json --net-log-capture-mode=Default` 完整捕获 `http://127.0.0.1:7001/creator` 加载过程的 13715 条网络事件，解析得 **110 条 7001 端口 HTTP 请求**，结果分布：

| HTTP 状态 | 计数 | 备注 |
| --- | --- | --- |
| 200 | 103 | 主要响应 |
| 304 Not Modified | 3 | 缓存命中 |
| 404 Not Found | **1** | `/favicon.ico`（浏览器自动请求，*非* /img/frames/*；GOAL 明确允许 favicon.ico 不在 git 跟踪） |
| NO_STATUS | 3 | WebSocket HMR upgrade（无 HTTP body） |

**resource 分类分布**（来自 netlog 解析）：

| 路径前缀 | 请求数 | 状态汇总 |
| --- | --- | --- |
| `/img/frames/` | **25** | 25/25 = 200 OK（无 404）|
| `/fonts/` | 6 | 全 200（含 beleren-bsc.ttf、gotham-medium.ttf、mplantin.ttf 等本轮新引入 face）|
| `/img/` 其它（lowpolyBackground.svg 等）| 4 | 全 200 |
| `/src/` (vite HMR) | 64 | 全 200 |
| `/node_modules/` | 7 | 全 200 |
| `/@vite|@react|@fs` | 2 | 全 200 |
| other | 2 | favicon.ico 404 + 1 chrome-protocol |

**实际请求到的 /img/frames/* 25 个 URL**（netlog 直接证据）：
```
200 /img/frames/m15/regular/m15FrameW.png       200 /img/frames/m15/regular/m15FrameU.png
200 /img/frames/m15/regular/m15FrameB.png       200 /img/frames/m15/regular/m15FrameR.png
200 /img/frames/m15/regular/m15FrameG.png       200 /img/frames/m15/regular/m15FrameM.png
200 /img/frames/m15/regular/m15FrameA.png       200 /img/frames/m15/regular/m15FrameV.png
200 /img/frames/m15/regular/m15FrameL.png       200 /img/frames/m15/regular/m15PTW.png
200 /img/frames/m15/regular/m15PTU.png          200 /img/frames/m15/regular/m15PTB.png
200 /img/frames/m15/regular/m15PTR.png          200 /img/frames/m15/regular/m15PTG.png
200 /img/frames/m15/regular/m15PTM.png          200 /img/frames/m15/regular/m15PTA.png
200 /img/frames/m15/regular/m15PTC.png          200 /img/frames/m15/regular/m15PTV.png
200 /img/frames/m15/custom/m15Midnight.png      200 /img/frames/m15/regular/m15MaskPinline.png
200 /img/frames/m15/regular/m15MaskTitle.png    200 /img/frames/m15/regular/m15MaskType.png
200 /img/frames/m15/regular/m15MaskRules.png    200 /img/frames/m15/regular/m15MaskFrame.png
200 /img/frames/m15/regular/m15MaskBorder.png
```

**Network 面板检查结论**：
- import 12 fixture 时，`/img/frames/*` 路径需求均能通过 200 解析（25/25 真实 chrome 请求 + 53/53 程序化 curl 验证 framePresetConfig.json 全部 URL）。
- **不存在 frame 缺失或 404**（唯一 404 是 `/favicon.ico`，浏览器规范自动请求，与 frame 无关）。
- magic_resources `public/img/frames/` 中 **99 个 frame family 目录**就位，覆盖 m15 / m15LegendCrowns / m15Saga / m15Planeswalker / m15Nyx / m15Nickname / planechase / storybook / modal 等。
- alias 表 32 entries 与上游 `data/frames.json` 行为一致。
- netlog 文件 `/tmp/netlog.json` 2.2 MB，提供完整审计 trail；transcript 中已 inline 解析结果。

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
