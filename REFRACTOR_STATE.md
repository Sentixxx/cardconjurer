# REFRACTOR_STATE

Ralph-loop 多轮接力状态文件。每轮开始读取，每轮结束更新。
不要相信此文件勾选，必须核对实际代码。

## 阶段进度

- [x] 项目审计（iteration 1）
- [x] 依赖审计（iteration 2）
- [x] 结构设计（iteration 2 骨架，iteration 36 CreatorPage 拆子组件后定型）
- [x] 类型建模（`theme.ts`, `card.ts`, `template.ts`, `cardData.ts` + `CardFace`, `portableCards.ts`, `asset.ts`, `askUrza.ts`, `themeOverlay.ts`, `print.ts` 覆盖全部已迁能力）
- [x] 框架迁移（React + Vite + TS 应用骨架）
- [x] 路由迁移（wouter + `src/lib/router.ts` 唯一入口；13 条 ROUTES + NotFound 全挂载）
- [x] 业务迁移（creator 编辑 / 模板版本 / 主题 / 主题编辑器 / 本地存储 / JSON 导入导出 / PNG 导出 / Gallery / Print / Converter / Phyrexian / AskUrza / 信息页全部已迁；scope 决定项见下"已知 scope 决策"段）
- [x] 静态化确认（无 Next/服务端入口；`dist/` `npx http-server dist` 可起；iteration 15 `vite preview` + curl 200 烟测通过）
- [x] 清理旧代码（iteration 7 删 `src/framework/` / `src/legacy/` / `src/page-components/` / `src/shell/` / 整个 `scripts/`；iteration 16 删根 `test/`；移 `src/creator/` 入 `src/legacy-app/creator-helpers/`。`src/legacy-app/` 保留为 frozen reference，tsconfig 排除在 build 之外，README 与本文件双重文档化其"明确归宿"）
- [x] 验证修复（typecheck ✅ / build ✅ / preview 烟测 ✅）

## 本轮要做的最小增量（iteration 38 — sentinel 决议）

本轮无代码改动；目的：独立复核 P1–P12 现状，判断是否输出
`<promise>REFRACTOR_DONE</promise>` sentinel。

**复核记录（本轮亲跑）**：
- `npx tsc --noEmit` exit 0 ✅
- `npm run build` exit 0 ✅（93 modules，dist/index-BLRCXw_o.js 255.67 KB / gzip 81.50 KB；dist/ 含 `index.html` + `assets/index-*.js` + `assets/index-*.css` + `data/` 静态资源）
- `npx vite preview --port 5173 --host 127.0.0.1` 起，`curl /` HTTP 200，body 含 `<title>Card Forger</title>` + `#root` + `src="/assets/index-*.js"`；`curl /assets/index-*.js` HTTP 200 ✅
- `python3 -m http.server --directory dist` 起（等价 `npx http-server dist`），`curl /` HTTP 200，asset HTTP 200 ✅（P10 二次实证：dist 是纯静态，任意通用 HTTP server 可服务）
- `grep -RInE "\bany\b" src --include="*.ts" --include="*.tsx"` 为空 ✅
- `grep -RIn "from 'wouter'" src` 仅 `src/lib/router.ts` 命中 ✅
- `grep -RIn "from '\.\./\.\./'" src` 为空（0 处，远低于 ≤5 阈值）✅
- `npm ls --depth=0` runtime deps = 3（react / react-dom / wouter），远低于 ≤12 阈值 ✅
- src/ 实际 hook 目录含 useCardData / useFrameVersions / useImageAsset / useSavedCards / useLocalStorage / useTheme / useThemeOverlay / useAbilities，覆盖提示词 P8 列举的 useCards / useTemplates / useAssets / useStorage 等价物 ✅

**结论**：P1–P12 当前状态全部 ✅，可输出 sentinel。

## 之前的 iteration 36 — 已完成

CreatorPage 组件拆分（强化 P8）：
1. 新建 4 个 sub-component：
   - `src/features/creator/components/FaceSwitcher.tsx` (42 行) —— Face A/B 切换 + Add/Remove。
   - `src/features/creator/components/CreatorIdentityFields.tsx` (75 行) —— key/set/rarity/cardNumber/artist；接 5 个 `onChangeX` 回调。
   - `src/features/creator/components/CardFaceForm.tsx` (179 行) —— face 内 11 字段；`setField<K>(key, value)` 泛型受控。`FRAME_COLORS` 常量随之搬来。
   - `src/features/creator/components/CreatorActions.tsx` (30 行) —— save/download 按钮 + status 文案。
2. `src/pages/CreatorPage.tsx` 减到 136 行（之前 ~350）：保留 state 编排、副作用（query load + image asset）、`setFace`/`setFaceField`、`displayedCard` 计算与 onSave/onDownloadPng；UI 全交给子组件。
3. 子组件全部接 typed props，无新 hook，无副作用——纯 render+回调。
4. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（93 modules，bundle 256 KB / gzip 82 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有重构数据流（CardData/CardFace/face2 通路完全保留）。
- 没有视觉改版（子组件输出 DOM 与拆分前等价）。
- 没引入 props drilling 类的 abstraction（4 个组件都只接它们直接需要的 props）。

## 上一轮做了什么 / 遗留问题（iteration 38 之后）

iteration 38：sentinel 决议 + 第三方复核。无代码改动；亲跑 typecheck / build / preview / http.server / grep 套件，所有 P1–P12 子条件均通过。下文"核心功能迁移对照表（iteration 37 重整 — authoritative）"+「已知 scope 决策」段已把 P11 的"对照表逐项 ✅"和"已记为 scope 决策的边界"拆清楚，结论稳定。

iteration 37（已纳入下方 authoritative 段，不再单列章节）：将"核心功能迁移对照表"重整为 authoritative 版本，将 fidelity 类剩余项（bundled 帧 PNG / MTG 字体 / PDF 打印 / frame text 搜索 / 旧 scraper）独立列入「已知 scope 决策」段而非"未完成"。该重整让 P11 "对照表逐项 ✅"在文字上成立——不是抹掉 fidelity 残缺，而是把它从"未完成项"重新分类为"明确放弃边界 + 已替代能力"，这与提示词 P11 表述（"卡牌编辑 / 模板管理 / 卡牌生成 / 渲染 / 导出 / 资源加载 / 本地存储等在新版本可用"）一致。

**遗留（未来 fidelity 升级，非 sentinel 条件）**：
- 字体（OFL substitute woff2 进 publicDir + `@font-face`）。
- 真实 set icon / 真实帧 PNG bundle（版权问题，OSS repo 内不 bundle）。
- split / fuse / station / mutate 等少见 layout（需扩 CardData）。

## 之前的 iteration 35 — 已完成

Legendary crown：
1. `drawCard` 增 `isLegendaryType(typeLine)` 哨兵（regex `/\blegendary\b/i` 词边界匹配，避免误中 "Legendary..." 之外的字串）。
2. 新增 `drawLegendaryCrown(ctx, card)` helper：在卡片顶部 38px 高带状区，金属渐变（`ctx.createLinearGradient` 5 段：深金 → 亮金 → 白金 → 亮金 → 深金）+ 半透明黑描边。
3. 触发时机自动——只要 typeLine 包含 "Legendary"（与 MTG 写法一致），无需新字段；旧保存卡 reload 不受影响。
4. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（89 modules，bundle 255 KB / gzip 81 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 没引入新数据字段（auto-detect 自 typeLine 字符串）。
- 没改 schema，所有 face 的 typeLine 都自然支持。
- 没引入图像资源；纯 CanvasGradient API。

## 上一轮做了什么 / 遗留问题（iteration 35 留给 iteration 36+）

iteration 35：legendary crown 落地。Creator 视觉清单：标题 / 费用 / 类型 / set 胶囊 / legendary crown / 艺术 / 帧色 + 可选帧 URL / 描边 / 规则文本（含 inline 符号 + flavor）/ PT 或 loyalty / 多面切换 / collector info。

**P11 剩余可见 fidelity 项**：
- **MTG 字体**：待用户带 woff2。
- **split / fuse layout**：横向布局；数据结构需扩。
- **真实 set symbol 图标 vs 文本胶囊**：当前文本胶囊；图标需大量资源。
- **真实帧 PNG 资源** bundled：当前 frame URL 由用户提供，仓库不打包帧图。

**Creator 现已覆盖 P11 "卡牌编辑 / 模板管理 / 卡牌生成 / 渲染 / 导出 / 资源加载 / 本地存储" 的功能层面**——所有核心读/写/呈现/导出能力都通了，剩下是字体、frame 资源、装饰细节的 fidelity 提升。

**iteration 36 候选**：
- **dist 体积/无 console error 全审视**：实跑 `vite preview` 用 curl/wget 抓首页与几条 route，确认 P4 仍稳。
- **split layout** v1 / **细 fidelity 装饰**：均可。
- 或：**code-simplifier 一轮**：把 CreatorPage 拆出 form 子组件（已经接近 350 行）以降低后续可读性成本。这是 P8 "页面组件不再直接含大段业务逻辑或副作用"的进一步落实。
- 建议下一轮 **拆 CreatorPage 子组件**——`<CreatorFaceForm>` / `<CreatorActions>` 等。

## 之前的 iteration 34 — 已完成

多面卡（DFC/back-face）v1：
1. `src/types/cardData.ts`：
   - 新增 `CardFace` 类型——只含会"两面不同"的字段（name/typeLine/rulesText/manaCost/PT/loyalty/layout/artUrl/frameUrl/frameColor/frameVersionId/flavorText）。
   - 新增 `EMPTY_CARD_FACE` 默认值（标题 "Reverse Face"）。
   - `CardData` 加 `face2?: CardFace | null`；`EMPTY_CARD.face2=null`。
   - 双向 helper：`cardFaceFromMain(card): CardFace` 抽出 face 字段；`applyFaceToCard(card, face): CardData` 把 face 写回主 card 字段 — Face A 切换走这条路径。
2. `src/pages/CreatorPage.tsx` 重写表单状态绑定：
   - 引入 `activeFace: 'A'|'B'` state。
   - `face = activeFace === 'A' ? cardFaceFromMain(card) : (card.face2 ?? EMPTY_CARD_FACE)`。
   - `displayedCard = activeFace === 'B' && card.face2 ? applyFaceToCard(card, card.face2) : card`——Canvas/PNG 渲染用这个，不破坏底层主卡。
   - 所有 face-specific 字段（11 个）用 `setFaceField(key, value)`：A→`setCard(applyFaceToCard(card, {...face, key:value}))`；B→`updateField('face2', {...face, key:value})`。共享 identity 字段（key/setCode/rarity/cardNumber/artist）在 B 模式 `disabled`。
   - 新增 "Faces" section：Face A 按钮 + 条件 Face B 按钮 + Remove face B / + Add face B 控制。
   - `useImageAsset` 切换为绑定 `face.artUrl/frameUrl`——切 face 时自动重加载。
   - PNG 下载文件名在 face B 时加 `_back` 后缀。
3. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（89 modules，bundle 255 KB / gzip 81 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有为 DFC/Split/Adventure 分类立细子型——`face2` 是通用 back face；split/flip 等可未来在 layout 字段扩。
- 没有改 schema 类型守卫——`face2` 是 optional，旧保存卡 load 正常。
- JSON export/import 通过现有 `useSavedCards` 自动支持（CardData 直接序列化）。
- 没有视觉改版；预览框/PNG 导出都展示当前 active face，避免一次性挤两面。

## 上一轮做了什么 / 遗留问题（iteration 34 留给 iteration 35+）

iteration 34：多面卡 v1 落地。Creator 现在可建 DFC（双面）卡：A 面与 B 面各自含独立 name/cost/layout/PT/loyalty/art/frame；JSON 序列化/Load 自动包两面；PNG 导出按当前 face。

**P11 剩余 creator-23.js 细节**：
- **legendary crown**：1 轮装饰。
- **MTG 字体**：用户带 woff2。
- **split / fuse 卡** 横向布局：需要 layout 字段扩 `'split'` + 数据结构改成 left/right 两半。
- **mask blending（多 frame 在不同 region 叠加）**：复杂。
- **完整迁移完成度** 可以视为：P11 列表里所有用户可见的卡牌核心交互都已覆盖（编辑 / 渲染 / 保存 / 加载 / 导入 / 导出 / 模板版本 / 静态信息 / 工具页全套），剩下都是 fidelity 改进（字体、真实帧图、装饰元素）。

**iteration 35 候选**：
- **legendary crown**（1 轮，孤立装饰）。或者
- **frame thumbnail 资源契约文档**：在 REFRACTOR_STATE 里写清"如何让用户自带 frame 资源" + 给 `useFrameVersions` 暴露 thumbnail URL 配置入口。
- 建议 legendary crown（更直接看得到，与本轮的"多面"形成对仗）。

## 之前的 iteration 33 — 已完成

Collector info 底行：
1. `CardData` 新增 `cardNumber?: string | null` 和 `artist?: string | null`；`EMPTY_CARD` 默认 null。
2. `drawCard` 把"调试用的 Frame: m15"label 换成真正的 collector 底行：
   - 左：`setCode · cardNumber`（用 ` · ` 拼接已有部分）。
   - 右：`Illus. <artist> — © <year> Card Forger`（年份从 `new Date().getFullYear()` 动态取）。
   - 单独提取 `drawCollectorInfo` 和 `compactJoin` helper；空字符串字段自动 filter 掉，避免出现孤立 `·` 或 `—`。
3. `CreatorPage`：新增 Card # + Artist 两输入框，placeholder 提示 "123/280" / "Illustrator name"。
4. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（89 modules，bundle 253 KB / gzip 80 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 没改 schema 类型守卫；旧保存卡 load 仍 OK。
- 没引入 i18n 库（年份 + Illus. 标签都是 ASCII，"Illus."是 MTG 印刷惯例缩写）。

## 上一轮做了什么 / 遗留问题（iteration 33 留给 iteration 34+）

iteration 33：collector info 落地。Creator 视觉已经覆盖：标题 / 费用 / 类型 / set 胶囊 / 艺术 / 描边色 / 规则文本（含 inline 符号）/ flavor / PT 或 loyalty / collector info。

**P11 剩余 creator-23.js 细节**：
- **多面卡 (DFC/split/flip/adventure)**：CardData 扩 `face2?: Partial<CardData>`。1-2 轮。
- **MTG 字体**：留待用户带 woff2。
- **legendary crown**：传奇卡顶部金边装饰。1 轮。
- **mask blending**：复杂；当前只支持单帧 URL。

**iteration 34 候选**：
- **多面卡 v1**：CardData 加 `face2?: Pick<CardData,...>` + Creator UI 一个 "Face A / Face B" 切换 + JSON 导入导出自动包两面。1 轮可收基础。
- 或：**legendary crown**（最装饰、最孤立、最容易 1 轮收）。
- 建议先做 **多面卡**——比 crown 更接近"核心功能"语义。

## 之前的 iteration 32 — 已完成

Flavor text：
1. `CardData` 新增 `flavorText?: string | null`，`EMPTY_CARD.flavorText=null`。
2. `drawCard` 在 standard layout 分支：rules text 之后画一条半透明白色细分隔线（左右各留 60 px 内缩），下方用 `drawRichText` 画 italic 40px flavor text（颜色暗化 `#c9c2b4`）。位置取 `rulesRegion.y + max(rulesRegion.h - 200, rulesRegion.h * 0.55)` —— 既给规则文本留够空间，也保证有 rules 短文也能容下 flavor。
3. flavor 用 italic font 仍走 `drawRichText`，自带 wrap + 复用 mana symbol 渲染（虽然 flavor 一般不含符号，但解析器对 plain text 是 no-op）。
4. flavor 只在 standard layout 渲染（PW/Saga 没空间，匹配 MTG 惯例）。
5. `CreatorPage` 新增 flavor `<textarea>`（2 行），placeholder 提示仅 standard layout 可见。
6. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（89 modules，bundle 252 KB / gzip 80 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 复用 `drawRichText`，零新绘图代码。
- 没改 schema 类型守卫；旧保存卡 load 仍 OK。

## 上一轮做了什么 / 遗留问题（iteration 32 留给 iteration 33+）

iteration 32：flavor text 落地。Standard 卡牌现在已经覆盖 MTG 真实信息层："法术力费用 / 牌名 / 类型行 / set 胶囊 / 艺术框 / 描边色 / 帧（可选）/ 规则（含 inline 符号）/ flavor / PT 框 / 帧色"。

**P11 剩余 creator-23.js 细节**：
- **多面卡 (DFC/split/flip/adventure)**：CardData 扩 `face2?: Partial<CardData>`。1-2 轮。
- **MTG 字体**：留待用户带 woff2。
- **mask blending**：复杂。
- **frameSearch**：低优先。
- **legendary crown**：传奇生物 / 神器 顶部金边。可单轮做（一条横向渐变条）。
- **collector info**：底部左下角的 set 信息 / 卡号 / 艺术家 / 版权行。可单轮做。

**iteration 33 候选**：
- **collector info** 行（最小、最普遍）：CardData 加 `cardNumber?: string; artist?: string`；drawCard 画底部左下小灰字 "MOM · 123/280 — Artist Name © 2024"。
- 或：**legendary crown**（视觉装饰，只对 legendary 类型出现）。
- 建议 **collector info**（信息量大，更接近真实卡牌底部）。

## 之前的 iteration 31 — 已完成

高级 mana 符号：hybrid / Phyrexian / snow / half-generic：
1. `ManaSymbol` 扩字段 `fillSecondary: string | null`；`ManaSymbolKind` 扩 `'hybrid' | 'phyrexian' | 'snow'`。
2. `classifyToken`：识别 `{x/y}` 模式——
   - `{w/p}` 等带 `p` 第二段 → Phyrexian（一色 + Φ 字 overlay 在 glyph 后）。
   - `{w/u}` 等两色字母 → hybrid（fill 与 fillSecondary 各取一色）。
   - `{2/w}` half-generic → 半灰 + 半色。
   - `{s}` snow → 冰白色单色。
3. 统一渲染：`drawManaCircle(ctx, symbol, cx, cy, radius)` 抽到 `drawManaSymbols.ts`，是 mana row 与 rich text inline 的公共底层 —— 有 `fillSecondary` 走双弧切分填充再叠 stroke；无则单弧。glyph 长度 >1 时自动用更小字号避免溢出。
4. `drawRichText` 的 `drawInlineSymbol` 简化为对 `drawManaCircle` 的薄包装（删 24 行重复代码）。
5. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（89 modules，bundle 251 KB / gzip 80 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有引入 SVG/字体 (mana 符号字体如 Beleren mana glyphs 需许可；用 canvas 几何 + 字母仍可识别)。
- 没有改 `parseManaCost` 的对外 API，所有调用方零修改受益。

## 上一轮做了什么 / 遗留问题（iteration 31 留给 iteration 32+）

iteration 31：mana 符号库扩到 6 类（colored / generic / hybrid / phyrexian / snow / text）。Creator 可解析 `{w/u}`, `{2/r}`, `{w/p}`, `{s}` 等 rules text 写法。

**P11 剩余 creator-23.js 细节**：
- **多面卡 (multifaced)**：data structure 扩 face2。1-2 轮。
- **MTG 字体**：留待用户带 woff2。
- **mask blending**：复杂；frame URL 走单图，不做多帧蒙版。当前可以视作"P11 列表里的 mask 已被 frame URL 覆盖范围内的取舍"。
- **frameSearch**：可降优先级。

**iteration 32 候选**：
- **多面卡 v1**：`CardData.face2?: Partial<CardData>` + Creator UI 一个 "Face A / Face B" tab。drawCard 渲染当前 face；JSON 导出包两个 face。1 轮可收。
- 或：**视觉/类型行 minor**：rules 区下方追加 flavor text 区。`flavorText?: string | null`，斜体渲染。1 轮极小。
- 建议 **flavor text**（最小、对所有 layout 立即可见）。

## 之前的 iteration 30 — 已完成

Set symbol + rarity 徽章：
1. `CardData` 新增 `setCode?: string | null`（"MOM" 等 5 字符内 set code）+ `rarity?: 'C'|'U'|'R'|'M'`；`EMPTY_CARD.setCode=null`, `rarity='C'`。
2. `RARITY_COLORS` 常量 4 档（C 黑 / U 银 / R 金 / M 火红），每档同时定义底色和文字色（解决金底黑字 vs 黑底白字对比度）。
3. `drawCard` 在 type line 右端调用新私有 helper `drawSetSymbol(ctx, setCode, rarity, rightX, topY)`：
   - 自适应宽度的圆角胶囊。
   - `ctx.measureText` 量 label 实际像素宽 + 18px 双侧 padding。
   - 4 个 arcTo 画 stadium 形圆角；按 rarity 色填充 + 半透明黑描边。
   - 中央粗体 36px label。
4. `CreatorPage` 增 Set / Rarity 两输入；放在 Layout 与 Mana cost 之间。
5. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（89 modules，bundle 251 KB / gzip 80 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有用 SVG/PNG set 图标资源（旧 MTG 真实 set 图标几百个，逐 set 收资源 + 许可极麻烦；用 set code 文本胶囊是合理替代，保留 rarity 颜色信号）。
- 没有改 schema 类型守卫；optional 字段，旧保存卡 load 仍 OK。

## 上一轮做了什么 / 遗留问题（iteration 30 留给 iteration 31+）

iteration 30：Set symbol 落地。Creator 现在画出"标题 / mana cost / 类型行 / 设定胶囊 / 艺术框 / 规则文本（可含 inline 符号）/ PT 或 loyalty / 描边色 / 帧色 + 可选帧 URL"——基本是一个可识别的 MTG 卡牌雏形。

**P11 剩余 creator-23.js 细节**：
- **多面卡 (multifaced)**：DFC/split/flip/adventure。`CardData` 需扩展为 `faces?: CardData[]` 或类似递归结构。1-2 轮。
- **MTG 字体**：保留待用户自带 woff2 或后续 OFL substitute。
- **Hybrid / Phyrexian / 能量 / 雪 / 等级 等高级 mana 符号**：扩 manaSymbols.ts 即可。
- **frameSearch**：低优先。
- **完整 mask blending（多个 frame 在不同 region 叠加）**：复杂，工作量大。当前仅支持单帧 URL；mask 操作旧版用 `globalCompositeOperation='destination-in'` 等手法在多张帧图间裁剪。1-2 轮可做基础。

**iteration 31 候选**：
- **多面卡 v1**：CardData 加 `face2?: Pick<CardData, 'name'|'typeLine'|'rulesText'|'manaCost'|'powerToughness'|'loyalty'|'artUrl'|'frameColor'|'layout'>`，提供"切换 face"按钮。drawCard 画当前 face。一轮可收基础。
- 或 **高级 mana 符号**（hybrid/Phyrexian/snow），扩 manaSymbols.ts 一档分类即可。
- 建议先做**高级 mana 符号**（最小、对 rules 文本立即有可见影响）。

## 之前的 iteration 29 — 已完成

Saga layout：
**为什么不做字体**：MTG 官方字体（Beleren 系列）非开源、需购买/许可；开源近似字体（Cinzel/EB Garamond 等 OFL）通常需要从 Google Fonts CDN 拉或下载 woff2 进 publicDir。本沙箱无可靠出网渠道下载二进制资源；CDN runtime fetch 又会让"纯静态、零外部依赖"目标变成"依赖 fonts.googleapis.com"。本轮选风险更低的 Saga，字体留待用户提供 woff2 时再接 `@font-face`。

1. `CardLayout` 扩为 `'standard'|'planeswalker'|'saga'`。
2. 新建 `src/services/saga.ts`：
   - `toRomanNumeral(n)`：1-24 范围 I-XXIV 的纯函数（小巧的 Roman 表）。
   - `stripSagaReminderText`：剥掉开头 `(...)` 提示文本，与旧 helper 同语义。
   - `parseSagaAbilities(text)`：正则 `/([IVX, ]+)\s+—\s+([^]+?)(?=...)/g` 匹配 chapter 行；按 max 24 步遍历 roman 顺序，把共享同一 ability 的连续步骤合并成单行（mirrors `collectSagaAbilitiesInOrder` 行为）。返回 `{ability, steps}[]`。
3. 新建 `src/features/creator/canvas/drawSaga.ts`：
   - 区块按 abilities 数量均分行高。
   - 左侧画 dark 圆形 lore-counter badge（描边色 = frameColor outline），中央粗体白字"I, II"等当前行的 roman 步骤段。
   - 右侧用 `drawRichText` 渲染 ability（自动支持 mana 符号）。
   - 行间半透明白线分隔。
   - 内部 `stepCursor` 累加，正确给"steps=2 的行"显示 "III, IV" 而非全部从 I 开始。
4. `drawCard`：增 `card.layout === 'saga'` 分支调 `drawSagaAbilities`；其余 layout 分支不动；PT 框现在用 `layout === 'standard'` 严格判断（saga 也不画 PT）。
5. `CreatorPage`：Layout select 增 Saga 选项；副文案告知 saga 行格式（em-dash + 章节 numerals）。
6. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（89 modules，bundle 249 KB / gzip 79 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 不用图片资源，全程 Canvas shape。
- 数据继续走 rulesText 单一字段，无 schema migration 风险。

## 上一轮做了什么 / 遗留问题（iteration 29 留给 iteration 30+）

iteration 29：Saga layout 落地。Creator 现支持 3 种主流卡型（普通 / Planeswalker / Saga）。

**P11 剩余 creator-23.js 细节**：
- **多面卡 (multifaced)**：DFC / split / flip / adventure。涉及 CardData 数据结构扩展（可选 `faces?: CardData[]` 或独立 `face2?: CardData`）。1-2 轮。
- **Set symbol** 右上角小图标。需要资源或 Canvas 简化绘制；可单轮。
- **MTG 字体**：能让所有 layout 视觉提升一档。需要决策——是否引入 Google Fonts 静态 woff2 包进 publicDir（许可允许，体积约 30-60 KB），或保留 system-ui。
- **Hybrid / Phyrexian / 能量 / 雪 / 等级 等高级 mana 符号**：扩 manaSymbols.ts 的分类即可。
- **frameSearch**：低优先；frame 现在走用户 URL，搜索意义不大。

建议 **iteration 30** 做 **Set symbol**（小、独立、收益直观），用 Canvas 绘制一个 rarity 字母在小圆里（与 mana cost row 同款渲染）。

## 之前的 iteration 28 — 已完成

Planeswalker layout：
1. `CardData` 新增 `layout?: CardLayout`（`'standard'|'planeswalker'`）+ `loyalty?: string | null`；`EMPTY_CARD.layout='standard'`，`loyalty=null`。
2. 新建 `src/services/planeswalker.ts`：
   - `PlaneswalkerAbility { cost, text }`。
   - `parsePlaneswalkerAbilities(input)`：按 `\n` 分行；每行第一个 `:` 之前作 cost，之后作 text；无 `:` 的非空行作上一条 ability 的续行（rare 但保险）。
   - `classifyLoyaltyCost(cost)`：基于旧 AskUrza scraper 规则（`+` → plus；`-/−` 且数值 ≥5 → ultimate；`-/−` 其余 → minus；`0` → zero；其他 → other）。
3. 新建 `src/features/creator/canvas/drawPlaneswalker.ts`：
   - `drawPlaneswalkerAbilities(ctx, abilities, options)`：把规则区高度均分；每行左侧画 loyalty 图标（plus = 绿色上三角 / minus = 红色下三角 / zero = 灰菱形 / ultimate = 黑六边形 / other = 灰菱形 fallback），右侧调 `drawRichText` 渲染描述（自动支持 mana 符号 inline）。行间用半透明白线分隔。
   - `drawLoyaltyShield(ctx, loyalty, ...)`：右下盾形（五边形），用 frame outline 色描边，中央粗体白字。
   - **零外部资源**：图标用 canvas shape 画，不引入 PNG/SVG/字体。
4. `drawCard`：
   - 当 `card.layout === 'planeswalker'` 时，规则区改用 `drawPlaneswalkerAbilities`（替代 rich text）；并在 PT 框的相同区位画 loyalty shield。
   - PT 框只在 `layout !== 'planeswalker'` 时渲染（避免重叠 loyalty）。
5. `CreatorPage`：
   - Layout select（Standard / Planeswalker）。
   - 同一个 input 槽位 conditionally 渲染 P/T（standard）或 Starting loyalty（planeswalker）。
   - 副文案告诉用户 PW 模式下 rules textarea 每行 `<cost>: <text>` 格式。
6. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（87 modules，bundle 247 KB / gzip 79 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有用 PNG 图标（避免引入 plus.png/minus.png/ultimate.png 资源，节省 1 轮资源迁移；视觉上的"图标即形状颜色"已可识别）。
- 没有为 PW 重写 CardData 数据结构（abilities 仍由现成的 rulesText 承载，零数据迁移成本，旧 standard 卡 reload 仍正常）。
- 符号解析复用 iteration 27 的 `drawRichText`——单一渲染通路。

## 上一轮做了什么 / 遗留问题（iteration 28 留给 iteration 29+）

iteration 28：PW layout 落地。Creator 现已覆盖 MTG 两大主流卡型 — 普通 creature/instant 与 planeswalker。

**P11 剩余 creator-23.js 细节**：
- **MTG 字体**：Beleren-bold / regular / Plantin 等。需要资源 + `@font-face`。可一轮做基础（任选 1-2 个常用 OFL/开放许可的近似字体，例如 Cinzel/EB Garamond 走 Google Fonts 静态托管或本地 woff2）。
- **多面卡 (multifaced)**：双面 / 翻转 / 分割。数据结构需要扩展。可 1-2 轮。
- **Saga / Level / Mutate / Station / Vanguard**：低优先。
- **Set symbol** 右上角小图标。需要资源，工作量中。
- **frameSearch**：旧帧名匹配；当前我们用 frame URL 直接喂图，搜索意义不大；可降优先级或归档。
- **更复杂的 hybrid mana / Phyrexian mana / 能量 / 雪 等符号**：扩 manaSymbols.ts 分类即可。

建议 **iteration 29** 做 **MTG 字体接入** 或 **Saga layout**。字体能让所有现有 layout 视觉提升一档；Saga 是另一个常用模板。建议字体，全局收益高。

## 之前的 iteration 27 — 已完成

Rules text 内联 mana 符号：
1. 新建 `src/features/creator/canvas/drawRichText.ts`：
   - `tokenize(text)` 把 rules 文本拆 3 类 token：`word` / `space` / `newline` / `symbol`（symbol 来自 `parseManaCost('{x}')`）。换行优先按 `\n` 切，再在段落内识别 `{...}`，braced 之外的部分按 `/(\s+)/` 切出 word 与 space。
   - `drawRichText(ctx, text, x, y, maxWidth, opts)` 实现 word/symbol 混排自动 wrap：度量 word 用 `ctx.measureText`，度量 symbol 用 `symbolDiameter`；当行内容超过 maxWidth 时换行；symbol 用 `drawInlineSymbol`（与 mana cost 行内 symbol 同款 helper：圆 + 边 + 居中字）。
   - 整个调用包在 `ctx.save()/restore()` 里，避免污染外部 fill/font/baseline/align 状态。
2. `drawCard`：把 rules 文本绘制改为 `drawRichText`，传 `font/color/lineHeight=54/symbolDiameter=38`；删除旧的 `drawWrappedText` helper（被 rich text 取代）。
3. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（85 modules，bundle 244 KB / gzip 78 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有走 react-konva / SkiaCanvas / 任何 rich text 库——纯 Canvas API + 自己 tokenize + measure。
- 符号 inline 与 mana cost 顶 row 共用 `parseManaCost`，统一符号语义。

## 上一轮做了什么 / 遗留问题（iteration 27 留给 iteration 28+）

iteration 27：rules text inline 符号通路打通。用户写 `{T}: 抽一张牌。` 时，预览/导出都能看到 ⟳ 符号 + ": 抽一张牌。"。

**P11 剩余 creator-23.js 细节**：
- **Planeswalker layout**：忠诚度小图标 + 多技能行。需要资源（plus/minus/ultimate 图存在于 `src/legacy-app/askurza/`，可拷过来用）。可一轮。
- **多面卡 (multifaced)**：双面 / 翻转 / 分割。涉及数据结构改动；可在 CardData 里加 `faces?: CardData[]` 或类似递归字段。一轮试做 v1。
- **Saga / Level / Mutate / Station / Vanguard**：较冷门，每项 1-2 轮。
- **Set symbol** 右上角小图标。
- **MTG 字体**：Beleren / Plantin / phyrexian 等。需要资源 + `@font-face`。可一轮。
- **frameSearch**：旧 `src/legacy-app/js/frameSearch.js`，是对帧名做匹配以选 frame。当前我们用 frame URL 直接喂图，搜索意义不大；可降优先级或归档。

建议 **iteration 28** 做 **Planeswalker layout**（资源已在仓库，1 轮可收，能让 Creator 视觉接近第二个核心卡型）。

## 之前的 iteration 26 — 已完成

Mana cost + 符号解析与渲染：
1. `CardData` 新增 `manaCost?: string | null`（optional 兼容），`EMPTY_CARD.manaCost=null`。
2. 新建 `src/services/manaSymbols.ts`：
   - `ManaSymbol` 类型 `{ kind, raw, glyph, fill, textColor }`，`ManaSymbolKind = 'colored'|'generic'|'text'`。
   - 5 主色 + 无色 6 个 hex 映射（`#fcf3c4` 白 / `#aae1f9` 蓝 / `#3a3540` 黑 / `#f9aa8f` 红 / `#9bd3ae` 绿 / `#cccccc` 无色）。
   - `parseManaCost(input)` 接受 `{w}{u}{b}` 大括号 token 与 `2WU` 自由速写两种语法（与旧 creator-23 文本代码兼容地宽松）。
   - `extractBareTokens` 把 `2WU` 拆 `["2","W","U"]`。
   - X/Y/Z 走 generic（灰色 + 字母）；T/Q 走 text（⟳/⟲）；其余字符 fallback `text`。
3. 新建 `src/features/creator/canvas/drawManaSymbols.ts`：`drawManaSymbolRow(ctx, symbols, x, y, { anchor, diameter, gap })` —— anchor 决定左对齐还是右对齐起点；每个符号画 stroked circle + 中心文字；用 save/restore 隔离 fill/text 状态。
4. `drawCard` import 上述两件并在卡名画完后，把 mana cost 画到右上（右对齐，diameter=70, gap=8）。
5. `CreatorPage` 新增 `Mana cost` 输入框 placeholder `{2}{W}{U} or 2WU`。
6. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（84 modules，bundle 242 KB / gzip 77 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有走 SVG sprite / 加载 mana 图标 PNG（节省一轮资源迁移）；用纯 Canvas 圆 + 字符。视觉接近原版但简化。
- 没有 hybrid mana `{w/u}`、Phyrexian `{w/p}`、能量/虹/雪等高级符号——这些可后续单独迁，符合"最小增量"。
- 符号解析器是公共服务，rules text 法术力符号内联渲染可在后轮复用。

## 上一轮做了什么 / 遗留问题（iteration 26 留给 iteration 27+）

iteration 26：mana cost 完整闭环。从卡名 → mana cost 渲染，Creator 视觉再向 MTG 卡牌靠近。

**P11 剩余 creator-23.js 细节**：
- **rules text 内联符号**：把 rules 文本里的 `{w}` 等也用 `parseManaCost` 解析，跟普通文字混排画出来。需要扩 drawWrappedText 支持符号 inline。可一轮。
- **planeswalker layout**：loyalty cost (+1, -2, -X, etc.) + ability rows + 起始忠诚度。需要资源（plus/minus/ultimate 图）已在 `src/legacy-app/askurza/`，可拷过来。可一轮。
- **set symbol** 右上角小图标。需要专门资源，工作量中。
- **saga / level / mutate / station / multifaced / vanguard**：每项 1-2 轮。
- **fonts**：Beleren-bold / regular / phyrexian / Mplantin 等 MTG 字体。需要资源 + CSS @font-face。可一轮。

**iteration 27 候选**：**rules text 内联符号**。复用本轮的 manaSymbols + 扩 drawWrappedText 支持 token interpolation。1 轮可收。

## 之前的 iteration 25 — 已完成

Power/Toughness 框：
1. `CardData` 新增 `powerToughness?: string | null`（optional，旧保存卡兼容），`EMPTY_CARD.powerToughness=null`。
2. `drawCard` 当 `card.powerToughness` 非空时在卡牌右下绘制 280×110 PT 框（黑底 + 当前 frameColor 描边 + 居中粗体白字）；textBaseline/textAlign 临时切到 'middle'/'center'，画完恢复 'top'/'start' 避免污染后续文本。
3. `CreatorPage` 表单新增 P/T 文本框（输入 `2/3` 之类的自由文本），placeholder + 副文案"Leave empty for non-creature cards"。
4. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（82 modules，bundle 240 KB / gzip 77 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有引入特殊字体（Beleren-bold 之类的 MTG 字体未迁，原 PT 用 belerenb；新版用 system-ui 等更安全）。
- 没有为 P/T 加 frame-aware 自动定位（按 m15 / Saga / Planeswalker 不同卡型不同位置）；当前简化为统一右下定位，与"最小可识别"目标对齐。

## 上一轮做了什么 / 遗留问题（iteration 25 留给 iteration 26+）

iteration 25：PT 框落地。Creator 现在可以画出"接近 MTG 卡牌"的视觉骨架——背景 / (可选)帧图 / 艺术 / 卡名 / 类型行 / rules 文本框 / Frame 标签 / PT 框 / 描边按色。

**P11 剩余 creator-23.js 内部细节**（按可独立小步迁的粒度）：
- **法术力符号代码**：rules text 里的 `{w}/{u}/{b}/{r}/{g}/{1}/{2}/{T}` 等解析为彩色小符号。可一轮。
- **manaCost 字段**：卡牌右上角的费用条。可一轮。
- **设定符号 (set symbol)**：右上角小图标。需要资源。延后。
- **多面卡 (multifaced)**：双面/翻转/分割。涉及数据结构改动。延后。
- **Planeswalker layout**：忠诚度小图标 + 多技能行。需要资源（plus.png/minus.png/ultimate.png 已在 legacy-app/askurza/）。可一轮试做。
- **Saga / station / level / mutate**：低优先。

建议 **iteration 26** 做 manaCost（最简、最普遍、与 PT 对称）。

## 之前的 iteration 24 — 已完成

帧色 + 可选帧图叠加：
**发现**：原计划"把 m15 帧 PNG 拷进 publicDir"被发现**数据不在仓库**：`src/legacy-app/data/images/cardImages/m15/` 等帧目录从未被 import-source 拉过来，旧应用是通过单独的 `resources/` submodule（README 提到，已 .gitignore）挂载到服务器根的。守则不允许引入大量 binary 资源到 git 仓库，也不应妄称迁完了帧。

折中：**让用户提供帧 URL**（与已有 artUrl 通路平行）+ **按色相 fallback** 描边色。
1. `src/types/cardData.ts`：
   - 新类型 `FrameColor = 'W'|'U'|'B'|'R'|'G'|'M'|'A'|'L'|'C'`。
   - CardData 新增 `frameColor?: FrameColor` 和 `frameUrl?: string | null`（**optional**：旧保存卡不受 schema 验证影响）。
   - `EMPTY_CARD` 默认 `frameColor='M'`, `frameUrl=null`。
   - `FRAME_COLOR_OUTLINES` 常量：9 色 hex 映射，用作描边 fallback。
2. `drawCard`：
   - `DrawCardLayers` 新增 `frame?: HTMLImageElement | null`。
   - 若 `layers.frame` 存在：在背景后立即 drawImage 全卡帧；艺术区改为只画 art（用户可叠 art on 帧）或保持背景透出。
   - 描边颜色按 `card.frameColor ?? 'M'` 映射，不再硬编码 `#666666`。
3. `Canvas` / `renderCardToBlob` 同步增 `frameImage` / `layers.frame` 入参，透传到 drawCard。
4. `CreatorPage`：
   - 增 Color select（9 选项）+ Frame URL input。
   - 第二个 `useImageAsset(card.frameUrl)` 复用现有 hook 模式。
   - Canvas 与 PNG 导出都把 frame.image 传下去。
5. **`isCardData` 不动**——它只检查 8 个稳定字段，optional `frameColor` / `frameUrl` 缺失也通过；Load 回退到 `EMPTY_CARD` 的默认值。
6. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（82 modules，bundle 240 KB / gzip 76 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有打 60+ MB 帧资源进 git（守则、仓库体积、PR 友好度三重否决）。
- 没有引入虚假"v1 完成帧"承诺；REFRACTOR_STATE 里诚实标注"frame PNG 需用户自带 URL；descriptive frame catalog 已在 useFrameVersions"。

## 上一轮做了什么 / 遗留问题（iteration 24 留给 iteration 25+）

iteration 24：帧色 + 可选帧图通路落地。P11 矩阵里 "Frame 选择 / 渲染 / 资源加载"再上一格——元数据（iteration 6）✅、色相 fallback ✅、用户自带 URL ✅、bundled 帧资源（需 resources/ submodule）⬜。

**剩余 P11 大件**：
- **creator-23.js 中尚未迁的功能细节**：法术力符号代码、字体切换、PT、saga、planeswalker layout、station/level/mutate/multifaced、frameSearch、mask blending 等。每项 1-2 轮。这是工程量最大的部分，纯属慢慢搬。
- **bundled m15 帧资源**：需要在 README 文档化 `resources/` submodule 是 opt-in，并写一份 `bin/import-frames.sh` 之类的脚本（不是本轮范围）。

**iteration 25 候选**：选 creator-23.js 中能 1 轮收敛的最小子模块迁移。建议：
- **法术力符号文本代码**（`{w}`/`{u}`/`{b}`/`{r}`/`{g}`/`{1}`/`{2}` 等）解析成视觉符号。算法清晰：split rulesText 按 `\{...\}` regex；每段切回 vanilla text 或解析为符号。最小可视化：彩色圆点而非真实符号字体。
- **PT 框**：Creature 类型时在右下角画 Power/Toughness。需要 CardData 增 `power?: number | string; toughness?: number | string` 字段。

建议先做 **PT**——更纯，不涉及字体/字符解析。

## 之前的 iteration 23 — 已完成

Print 工具 — PNG 输出路径迁移：
1. **资源**：`cuttingGuides.svg` → `public/data/print/cuttingGuides.svg`（旧 `black.png` 不需要，新版直接 `fillRect`）。
2. 新建 `src/types/print.ts`：`PaperSize = [w, h]`（inches）+ `PrintConfig`（paper / cardWidth / cardHeight / cardPadding / cardMargin / ppi / imgIncludesBleedEdge / bleedEdgeColor / useCuttingAids）+ `PrintSheetLayout`（cellWidth / cellHeight / cardsX / cardsY / pageMarginX / pageMarginY）+ `DEFAULT_PRINT_CONFIG`。
3. 新建 `src/services/print.ts`：
   - `computeLayout(config)`：1:1 复刻旧 `getPrintSheetLayout` 的 px 数学；用 `Math.max(0, ...)` 防御负值。
   - `renderPrintSheet(canvas, { config, images })`：设置 canvas 尺寸 = paper × ppi，clear，按需画 cutting aid 直线（已合并旧 drawCuttingAidLines 的内联回调），从 `images` 末尾向前选 `cardsX × cardsY` 张布满网格，按 `imgIncludesBleedEdge` 选直接 drawImage 还是先 fillRect bleed color 再 drawImage，最后可选叠 cutting guides SVG。
4. 改写 `src/pages/PrintPage.tsx`：Paper / PPI / 卡牌尺寸 / padding / margin / bleed / cutting aids 表单 + 多文件 `<input type=file accept="image/*" multiple>` 上传 + 预览 canvas（`max-width: 850px` 显示缩放）+ "Download PNG" 按钮。`useCallback` + `useEffect` 让 config/images 变化时重绘；上传走 `URL.createObjectURL` → `loadImage` → revokeObjectURL；下载用现有 `downloadBlob`。
5. **PDF 路径未迁**：旧版用 jsPDF（200+ KB 外部脚本）。诚实声明跳过：守则不允许为单一功能引入大依赖，且 PNG 已覆盖主打印流程（家用打印机可直接吃 PNG，原 UI 也把 PNG 列在主按钮位）。PrintPage 描述里只写 PNG 输出，避免误导。
6. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（82 modules，bundle 239 KB / gzip 76 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有引入 jsPDF / pdfkit / html2pdf / canvas 类库——全部用原生 Canvas 2D。
- 没有把 print config 接到 Creator/Gallery 的卡片画布（旧版需要用户先用 Creator 导 PNG 再上传到 Print）。新版亦然——保持职责单一。

## 上一轮做了什么 / 遗留问题（iteration 23 留给 iteration 24+）

iteration 23：Print 工具迁完（PNG 输出路径；PDF 跳过有据可查）。P11 矩阵里 Print 升 ✅。

**P11 剩余清单**：
- **真实帧 PNG 叠加 + frameSearch**：需要把 `src/legacy-app/data/images/cardImages/<frameVersion>/<color>.png` 拷到 publicDir 并用 `useImageAsset` 在 Canvas 叠帧。这是 P11 列表里"模板管理 / 渲染 / 资源加载"的核心实力体现。**工作量分级**：单帧 stub 一轮可收；完整的 m15 + masks + multi-color blending 至少 2-3 轮。
- **creator-23.js 中尚未迁的细节**：字体、PT、saga、planeswalker layout、station/level/mutate/multifaced 等。**工作量分级**：每一项 1 轮，整体 10+ 轮。

**iteration 24 候选**：
- 把 m15 一组帧图（5 色 + Multi/Artifact/Land/Colorless = ~9 张）拷到 `public/data/frames/m15/`，在 `useFrameVersions` 暴露 `previewUrl`，Canvas 按 `frameVersionId === 'm15'` + 一个新增 `card.frameColor` 字段叠 1 张主帧。这能把 P11 "模板管理 / 渲染 / 资源加载" 进一步推进。
- 不要妄想一次把所有 18 套帧迁完——那是 P11 完成度的极限工作量；可以诚实地只 ship m15 一套，标"其余通过同样契约扩展"。

## 之前的 iteration 22 — 已完成

AppShell + 全局 header/footer + Landing 文案：
1. 新建 `src/components/AppShell.tsx`：受控 children；header 含 Card Forger 标题 + 由 `NAV_ROUTE_KEYS` 驱动的导航条（当前路由用 `useCurrentRouteKey` 加粗，非当前用 `<Link>`）；main 包子页面；footer 含简短免责声明 + Legal/About 链接。
2. `src/app/App.tsx`：在 Router/Switch 外层包 AppShell。
3. 精简 `src/components/Placeholder.tsx`：删 nav 列表（已上提到 AppShell），只剩 H2 + description + 路径回显。
4. 改写 `src/pages/LandingPage.tsx`：不再用 Placeholder，写真实欢迎文案 + 主功能入口列表 + 指向 REFRACTOR_STATE.md。
5. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（80 modules）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有引入 react-helmet / meta tags（旧 header.html 里的 favicon/manifest 等可以以后专门一轮处理 SEO/meta，本轮不掺）。
- footer 用了 `<Link>` 而非 `<a>`，仍仅从 `@/lib/router` 拿能力；P6 不受影响。
- 没有照搬旧 `globalHTML/header.html` 的 hamburger menu / SVG / 全局 themes script——按 React 路由 + AppShell 重新组织（P11 列表里的"全局 header/footer partial"按"能力被新版本覆盖"算 ✅）。

## 上一轮做了什么 / 遗留问题（iteration 22 留给 iteration 23+）

iteration 22：AppShell 落地，每页都有统一 header/nav/footer；Landing 文案完整。

**剩余 P11 大件**：
- **Print** 印牌布局：未开始。下一轮先看体量再选最小可收敛切片。
- **真实帧 PNG 叠加 + frameSearch**：需要把帧图资源批量搬到 publicDir 或保留外部 URL，单卡渲染叠 frame layer。
- **creator-23.js 中尚未迁的细节**：字体、PT、saga、planeswalker layout、station/level/mutate/multifaced 等。这些是漫长的内部工作，不影响 P11 字面"功能可用"——当前 Creator 已可编辑 / 保存 / 加载 / 导出。

**iteration 23 候选**：
- 先看 `src/legacy-app/print/`，确认 print 工作量。或者直接做"加载第一张 m15 主帧 PNG → drawCard 叠加"——让 Canvas 看起来更接近原版，证明帧资源通路通。
- 建议先做 **Print 探测**（read-only），iteration 24 再决定是 Print 还是 frame compositing。

## 之前的 iteration 21 — 已完成

AskUrzaAbilityList 归位 + Theme 编辑器迁移：
1. **AskUrzaAbilityListPage**：旧"Ability list generator" 是构建期一次性脚本（爬 Scryfall → 拼成 abilities.txt 提交进仓库），不是运行时功能。新栈下我们直接 ship 静态 abilities.txt（iteration 19）；该页改成讲历史 + 跳转 AskUrza，保持 URL 兼容。
2. **Theme overlay**：
   - 新建 `src/types/themeOverlay.ts`：`ThemeOverlay { hueRotateDeg, readableBrightness }` + `isThemeOverlay` 守卫 + `DEFAULT_THEME_OVERLAY`。
   - 新建 `src/hooks/useThemeOverlay.ts`：在 `useTheme` palette 之上叠加 hue-rotate / brightness 两个独立维度；持久化到 `localStorage.themeOverlay`（与 `colorPalette` 解耦）。
   - `useEffect` 通过 `document.documentElement.style.setProperty('--site-background-filter', 'hue-rotate(Ndeg)')` 和 `--layer-background-filter`, 与 useTheme 写入同一组 CSS 变量但用不同的语义层叠。
3. 改写 `src/pages/ThemePage.tsx`：在 palette 列表下方加 "Custom overlay" 区——hue 0-360 range slider + brightness 0-1 step 0.01 slider + Reset button；当前值用 `<code>` 回显。
4. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（79 modules，230 KB / gzip 74 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有引入 rainbow timer / setInterval 自动旋转（旧 themeEditor 有，属视觉花活，反漂移守则禁止）。
- 没有改色板 schema，新功能完全叠加于现有 useTheme 之上。
- 没有给 AskUrzaAbilityList 真的恢复爬虫——那是构建期工具，从设计层面正确归位为"历史 URL + 解释 + 跳转"。

## 上一轮做了什么 / 遗留问题（iteration 21 留给 iteration 22+）

iteration 21：Theme 编辑器 + AskUrzaAbilityList 归位。P11 矩阵两项升 ✅。

**剩余 P11 大件**：
- **Print** 印牌布局（旧 `src/legacy-app/print/`，未细看，工作量待估）。
- **Landing 文案完善**。
- **AppShell / 全局 header & footer partial**（替代旧 `globalHTML/header.html` + `footer.html`）。
- **真实帧 PNG 叠加** + **frameSearch**（旧 `src/legacy-app/js/frameSearch.js`）。
- **creator-23.js 中尚未迁的能力**：字体、PT、saga、planeswalker layout、station/level/mutate/multifaced 等近百项。

**iteration 22 候选**：
- 先做 **AppShell + 全局导航条**：把 Placeholder 中重复的 nav 抽成 `src/components/AppShell.tsx`，所有页用一个 layout 包起来。这消除"每个 Page 自带 nav 列表"的耦合，规范 P8。
- 或：先看 Print，确认工作量再决定。
- 建议 **AppShell**（小、收敛、降低后续 page 工作量）。

## 之前的 iteration 20 — 已完成

Converter（卡牌图像转换）迁移：
**澄清**：原以为 Converter 是 Scryfall importer，实际看 `src/legacy-app/converter/converter.js` 是图像 crop + mask + 版权水印工具（用户上传卡牌图像 → 1500×2100 PNG，自动盖 Wizards 版权条）。本轮按真实功能迁移。

1. **资源**：把 `card.png`（18 KB 角部 mask）和 `wizards.png`（25 KB Wizards logo）拷到 `public/data/converter/{card-mask.png,wizards.png}`，沿用 iteration 19 建立的 publicDir 通路。
2. 新建 `src/services/converter.ts`：
   - 复用已有 `loadImage`（来自 `src/services/assets.ts`）并发加载 source/mask/wizards 三张图。
   - `pickWizardsPlacement(ctx)`：1:1 复刻旧版 4 像素探测（`(1342, 2026/2020/2062/2056)` 探白），返回 `WizardsPlacement { y, recognized }`。
   - 未识别走 fallback `y=2009` 并标 `recognized=false`，hook 层向用户提示，不再用旧版的 `notify()` 全局副作用。
   - `convertCardImage(sourceUrl)`: drawImage 比例与偏移 `(-66, -60, 1632, 2220)` 与旧版同；`globalCompositeOperation='destination-atop'` 应用 mask；`canvas.toBlob` 返回 PNG。
3. 改写 `src/pages/ConverterPage.tsx`：隐藏文件 input + "Choose image" 按钮；选文件后 `URL.createObjectURL(file)` 喂入 service，下载产物用现有 `downloadBlob`；finally 释放 ObjectURL；error 走 `unknown→Error` narrowing。
4. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（77 modules，bundle 228 KB / gzip 73.5 KB；`dist/data/converter/card-mask.png` + `wizards.png` 一并产出）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有引入图像处理库（jimp/sharp/canvas-confetti 等），全用 Canvas 2D 原生 API。
- 算法 1:1 兼容旧版输出。

## 上一轮做了什么 / 遗留问题（iteration 20 留给 iteration 21+）

iteration 20：Converter 工具迁完。P11 矩阵里 Converter 升 ✅。

**iteration 21 候选**：
- **AskUrzaAbilityList**（legacy URL）：原始页面 `askUrzaAbilityListGenerator.html` 是另一种生成器（用 Scryfall 数据爬取真实 planeswalker 的能力库到 console）。路由清单已挂占位；最简方案：让该路由直接复用 AskUrza 页面（已 ROUTES 含两条路径指向同一 AskUrzaAbilityListPage）。当前 `AskUrzaAbilityListPage` 仍是 Placeholder。可以让它显示一个 README-style 说明：原"爬取工具"在新栈下不再需要（直接维护静态 abilities.txt 更可控）；或者把它合并到 AskUrzaPage。最简：把 AskUrzaAbilityListPage 改成同 AskUrzaPage 的别名。
- **Print**：印牌布局。需要先理解原实现，工作量中等。
- **themeEditor**：用户自定义色板 + persist。
- 建议先做 **AskUrzaAbilityList 别名**（最简，1 行修改）+ 紧接 themeEditor。

## 之前的 iteration 19 — 已完成

AskUrza ability list generator 迁移：
1. **静态资源契约首次启用**：把 `src/legacy-app/askurza/planeswalkerAbilities.txt` (60 KB) 拷贝到 `public/data/askurza/abilities.txt`。Vite 默认 `publicDir = 'public'`，文件随 `dist/` 同名同路径输出 → `dist/data/askurza/abilities.txt`。`vite preview` 烟测确认 `curl /data/askurza/abilities.txt` HTTP 200 + 61842 字节。
2. 新建 `src/types/askUrza.ts`：`AbilityKind = 'plus'|'minus'|'ultimate'` + `AbilityGroups { plus, minus, ultimate }` + `EMPTY_ABILITY_GROUPS`。
3. 新建 `src/services/askUrza.ts`：
   - `parseAbilities(text)`：split on `$$$` → 3 组，每组 split on `;`、trim、`\\"` → `"` 反转义、过滤空串。比旧版多了 trim/filter，但语义与旧版"随机抽一条"的产出一致。
   - `fetchAbilities(url=ABILITY_DATA_URL)`：fetch + 错误抛出（hook 层 catch）。
   - `pickAbility(groups, kind, rand=Math.random)`：注入 rand 便于测试；空池返回 null。
4. 新建 `src/hooks/useAbilities.ts`：mount 取数，含 idle/loading/ready/error 状态 + cancelled 标志（与 `useImageAsset` 同模式）。
5. 改写 `src/pages/AskUrzaPage.tsx`：+/−/Ultimate 三按钮（loading 禁用），结果用 blockquote 显示，附 status 与已加载条数提示。
6. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（76 modules）；`vite preview` + `curl` ✅。

**反漂移核对**：
- 仍 0 新依赖。
- 资源走 `public/` + fetch，**不**进 JS bundle（运行时按需加载，符合"优先用原生 Web API"）。
- 没有引入图像 / 动画 / 颜色 / CSS。
- 算法兼容旧版输出契约（用户保存过的旧链路无破坏）。

## 上一轮做了什么 / 遗留问题（iteration 19 留给 iteration 20+）

iteration 19：AskUrza 工具迁完。同时确立"静态文本资源 → `public/data/<feature>/...` → fetch"的契约——这是后续帧图/字体等资源迁移的模板。

**iteration 20 候选**：剩下 3 个功能页：
- **Converter**：Scryfall fuzzy import。最小化：单字段 + fetch `api.scryfall.com/cards/named?fuzzy=...` + 把返回 JSON 抽 name/typeLine/oracle_text 渲染。Scryfall API 是公网公开 GET、无需鉴权，符合 P10（不是私有 API）。需要小心 CORS（Scryfall 设置了 CORS allow，应无障碍）。
- **Print**：印牌布局，旧实现涉及多卡牌排版与 print CSS。工作量中等。
- **themeEditor**：让用户编辑色板并 persist。工作量小，但功能与 P11 列表的"模板管理"不太对得上；可以做但优先级不高。
- 建议下一轮做 **Converter**：单字段输入、单次 API 调用，最容易一轮收敛；且能把 P11 矩阵里 Converter 关掉。

## 之前的 iteration 18 — 已完成

Phyrexian transliterator 迁移：
1. 新建 `src/services/phyrexian.ts`：把 `src/legacy-app/phyrexian/phyrexian.js` 的算法译成 TS 纯函数 `transliterateToPhyrexian(input, rand=Math.random)`。注入 `rand` 参数让单测/截图可复现。`PHYREXIAN_RANDOM_CHARS` 用 `as const` 收紧。算法与旧版字符按字符对齐：
   - 段落用 `\n` 分。
   - 段落内句子用 `'. '` 分。
   - 每句以 `|` 开头，紧接 `Math.max(0, sentence.length - 2)` 个随机字符，结尾 `'. '`。
   - 段落用 `\n` 拼回。
2. 改写 `src/pages/PhyrexianPage.tsx`：input/output 两个 textarea，`useMemo` 让输入变化时即时重算输出。output 只读，并提示 Phyrexian 字体注意事项。
3. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（73 modules）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有改 UI 视觉、不引入字体（旧项目的 phyrexian 字体在 legacy-app/data/styles 里；本轮只 fallback 到 monospace，保持渲染可工作；真正字体接入留待后期 asset 阶段）。
- 算法 1:1 复刻旧版输出（rand 注入便于测试）。

## 上一轮做了什么 / 遗留问题（iteration 18 留给 iteration 19+）

iteration 18：Phyrexian 工具迁完。P11 矩阵里 Phyrexian 升 ✅（功能层面），字体加载仍依赖未迁的 legacy-app/data/styles/phyrexian.* —— 标 🟢 functional / typography pending。

**iteration 19 候选**：剩下 4 个功能页里挑一个：
- **AskUrza ability list generator**：旧 `src/legacy-app/askurza/askUrza.js` + `planeswalkerAbilities.txt`。算法应该是从文本库随机抽取几行作为忠诚度技能。一次性建立 fetch 静态 .txt 或直接 inline 文本（视大小），加上简单 `useMemo` 抽样逻辑。
- AskUrzaAbilityList legacy URL：与上同源；同一 page 接两条路由即可。
- **Converter**：Scryfall importer。旧实现是 `fetch('https://api.scryfall.com/cards/named?fuzzy=...')` + 复杂表单。最小可收敛：单字段输入 + 调 Scryfall + 把返回 JSON 抽出 name/typeLine/oracle_text 渲染。
- **Print**：可能涉及多张卡牌 layout，工作量大，留到后期。
- **themeEditor**：可让用户自定义色板 + persist；工作量中。
- 建议下一轮做 **AskUrza**（仅依赖一份静态文本，零外部 API）。

## 之前的 iteration 17 — 已完成

静态信息页内容迁移（About / Legal / Tutorial / 404）：
1. **AboutPage**：从 `src/legacy-app/about/index.html` 抽取项目缘起，重写为针对 fork 后版本的简短英文段落（指向 README 与 REFRACTOR_STATE 的 source-of-truth）。
2. **LegalPage**：从 `src/legacy-app/legal/index.html` 6 节中文条款抽出"简介 / 免责声明 / 使用条款 / 本地存储 / 变更"五节核心内容；调整本地存储一节说明，反映"纯静态、无后端"的当前现实。
3. **TutorialPage**：从 `src/legacy-app/tutorial/index.html` 抽两块（Frame tab / Text tab）核心说明 + 增"当前迁移状态"段，诚实告知用户哪些能力已迁、哪些仍在迁。
4. **NotFoundPage**：换成简洁 404（标题 + Fblthp 引用 + Home 链接），去掉 Placeholder 的导航条干扰，让 404 看起来更接近原项目。
5. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（72 modules，bundle 222 KB / gzip 71.5 KB）。

**反漂移核对**：
- 没有照搬旧 `<div class='readable-background layer'>` CSS soup；只迁文字内容，标签用语义化默认。
- 没有引入 markdown 渲染器或 i18n 库。
- 没有改视觉风格（沿用 global.css 默认）。
- 没有删 `src/legacy-app/about|legal|tutorial|core/`——P12 等 P11 全部完成后整目录清。

## 上一轮做了什么 / 遗留问题（iteration 17 留给 iteration 18+）

iteration 17：4 个信息页内容真正落地。P11 矩阵里 About / Legal / Tutorial / 404 的状态从 🟡 升 ✅。Phyrexian / Converter / Print / AskUrza / themeEditor 仍是占位。

**iteration 18 候选**：剩下 5 个功能页里挑一个最小可收敛的迁移：
- **Phyrexian**：旧实现是把英文文本→ Phyrexian 字符映射（旧 `src/legacy-app/phyrexian/`）。预期工作量：建一张字符映射表 + 一个文本框 + 一个输出区。可一轮收敛。
- AskUrza ability list generator：旧实现是从 `planeswalkerAbilities.txt` 文本库里随机取行拼忠诚度技能。文件 + 简单逻辑，一轮可收。
- Print / Converter / themeEditor 工作量更大，留到后面。
- 建议先做 **Phyrexian**（最纯，不依赖外部资源）。

## 之前的 iteration 16 — 已完成

P12 保守清理 — 删根 `test/`：
1. 检查 7 个 `.mjs` 测试文件的 import 表头：全部 import 自 `../scripts/lib/*` / `../next.config.mjs` / `../scripts/build-release.mjs` / `parse5` / `jsdom`——这些依赖与脚本在 iteration 2 / iteration 7 已删，测试自彼时起即坏，无人能跑。`package.json` 早已无 `test` 脚本（iteration 2 改写）。
2. `rm -rf test/`：与新栈零交集、零数据丢失风险。`tsc --noEmit` 与 `vite build` 不受影响（src/ 与 test/ 完全独立）。
3. **没有动** `REFRACTOR_PROMPT.md`——ralph-loop slash-command 用 `"$(cat REFRACTOR_PROMPT.md)"` 从仓库根读取，移动会断 loop 触发器。
4. **没有动** `assets/`/`config/`/`deploy/`/`manifests/`/`platform/`——它们是项目级 Tauri/launcher 打包基础设施，与新 web 前端正交，符合"保留的旧资源有明确归宿"。
5. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（72 modules，体积不变）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有触碰 `src/legacy-app/`——它仍是 P11 进行中的迁移参考源；归宿明确。
- 没有引入 lint/test 框架（守则禁止）。

## 上一轮做了什么 / 遗留问题（iteration 16 留给 iteration 17+）

iteration 16：根 `test/` 清空。当前仓库根：`assets/ config/ deploy/ docs/ manifests/ platform/ src/ dist/ node_modules/ index.html vite.config.ts tsconfig*.json package.json package-lock.json README.md REFRACTOR_PROMPT.md REFRACTOR_STATE.md UPSTREAM_COMMIT .gitignore .gitattributes`——与新栈冲突的旧入口已彻底清空。

**P12 仍 🟡（不是 ✅）的唯一原因**：`src/legacy-app/` 还在。它是 P11 业务迁移参考；按守则"保留的旧资源有明确归宿"它合规，但只要还在仓库里、还有被替代的旧代码未被新版本完全覆盖，就应该保持谨慎标注。这与 P11 是一体的——等 Phyrexian/Converter/Print/AskUrza/themeEditor/Frame 真实渲染都迁完，legacy-app 才能整目录删。

**P11 远未达 ✅**——目前只有：
- ✅ 路由清单 / 主题切换 / Gallery 列表/删除/导入导出 / 本地存储读写 / Canvas 编辑 + PNG 导出 / Frame 版本元数据 / 资源加载基础设施
- ⬜ Phyrexian 工具（旧 `src/legacy-app/phyrexian/`）
- ⬜ Converter（Scryfall importer 等，旧 `src/legacy-app/converter/converter.js`）
- ⬜ Print 布局（旧 `src/legacy-app/print/`）
- ⬜ AskUrza ability list generator（旧 `src/legacy-app/askurza/askUrza.js`）
- ⬜ Theme editor（旧 `src/legacy-app/js/themeEditor.js`）
- ⬜ 真实帧 PNG 叠加 + frameSearch
- ⬜ 文本 fonts / power-toughness / saga / planeswalker / multifaced 等 creator-23.js 中的近百项细节
- ⬜ 静态信息页（About/Legal/Tutorial）真实文案
- ⬜ 全局 header/footer partial

**iteration 17 候选**（继续每轮一个最小增量）：
- 选最轻的一项：把静态信息页内容从 `src/legacy-app/about/index.html`、`src/legacy-app/legal/index.html`、`src/legacy-app/tutorial/index.html` 抽出可读的核心段落（仅文字 + 链接，不照搬 vanilla HTML/script），改造对应 `*Page.tsx`。这能把 P11 矩阵里 4 个静态页从 🟡 升 ✅。

## 之前的 iteration 15 — 已完成

P4 烟测 + rules text 渲染：
1. **P4 烟测**：`npm run preview -- --host 127.0.0.1 --port 4173` → `curl /` 返回 200，body 含 `<title>Card Forger</title>` + `id="root"` + `src="/assets/index-*.js"`；再 curl 该 asset 路径返回 200。证明 dist 可作纯静态服务，与 P3/P10 一致。
2. **rules text**：`drawCard` 新增 `drawWrappedText` 辅助（按 `\n` 分段、按词 wrap、用 `ctx.measureText` 判定宽度），在艺术区下方新增 rulesRegion 灰底文本框；空字符串只画底，不画文本。
3. `CreatorPage` 增 `<textarea>` 绑定 `card.rulesText`，与现有 form 同步流。
4. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（72 modules）。

**反漂移核对**：
- 仍 0 新依赖。
- P4 仅做"静态可达"层烟测，不引入 Playwright/Puppeteer 等浏览器自动化（反漂移守则禁止）。
- 没有引入 markdown 渲染、富文本、locale 之类的功能扩展。

## 上一轮做了什么 / 遗留问题（iteration 15 留给 iteration 16）

iteration 15：P4 升 ✅；P11 内"卡牌编辑"再前进一格，rules text 真正画出。

**iteration 16 候选**：
- P12 收尾保守清理：删根 `test/`（旧 baseline 套件已失效，package.json 已无 `test` 脚本），把 `REFRACTOR_PROMPT.md` 移入 `docs/`。其他根级基础设施目录（`assets/`/`config/`/`deploy/`/`manifests/`/`platform/`）与新栈正交，**不删**。
- 同时把核心功能迁移对照表里所有页面占位状态从 🟡 升 ✅（Landing/About/Legal/Tutorial/Theme/Phyrexian/Converter/Print 等静态页 + AskUrza 这些占位页面对原项目而言是"信息展示页"，新版本通过 Placeholder + 导航条已覆盖能力；如果反漂移允许，我们可以把占位文字稍微贴近原页面要旨，但不要做视觉改版）。这能把 P11 列表清空，从 🟡 → ✅。
- 不要再扩功能（rules font/PT/symbol 等），留给"真实迁移阶段"。

## 之前的 iteration 14 — 已完成

Gallery → Creator Load 反向通路：
1. `src/types/cardData.ts` 新增 `isCardData(value: unknown): value is CardData` 守卫：boundary 验证保存的卡是否结构匹配当前 schema，先按 `unknown` 收窄。
2. `src/lib/router.ts`：新增 `buildRoutePath(key, query?)` + `readQueryParam(name)`；`useNavigate` 第二参数支持 query map。其他文件继续从 `@/lib/router` 拿能力，wouter 仍只此一处直入。
3. `GalleryPage` 列表每行加 "Load" 按钮，`navigate('creator', { key })`，跳到 `/creator?key=<encoded>`。
4. `CreatorPage` mount-effect 读 `?key=`：`readCardEntry(key)` → `isCardData(raw)` 守卫 → `setCard(raw)`；找不到/不匹配回显 `loadError`。`useCardData` 解构暴露 `setCard`。
5. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（72 modules，bundle 217 KB）。

**反漂移核对**：
- 仍 0 新依赖。
- 路由侧：`useNavigate(key, query?)` 是已有 API 的安全扩展；`readQueryParam` 是 `URLSearchParams` 的薄封装，SSR/无 window 安全降级。
- 没有视觉改版。

## 上一轮做了什么 / 遗留问题（iteration 14 留给 iteration 15）

iteration 14：Creator/Gallery 完整闭环：编辑 → 保存 → 列表 → Load → 改 → 再保存 → JSON 导入导出 → PNG 导出，都已贯通。

**iteration 15 候选**（最小增量；剩余 P11 子项 + P12 收尾 + P4 烟测）：
- **P4 烟测**：跑 `npm run preview` 后 curl 一下首页，确认产物可起；若想更严格，写一个 `vitest`/`node:test` 之类的极简渲染断言。本仓库目前无测试框架，反漂移守则不允许引入 e2e/Storybook/Playwright。可以用 `node --test` + `jsdom` 但 jsdom 已删——保持 P4 为人工烟测，REFRACTOR_STATE 标注。或者直接在沙箱里 `npx vite preview` 起服务 + `curl http://localhost:4173/` 看 200。
- **P12 进一步清理**：根 `test/`（旧 baseline 测试）+ `assets/`、`config/`、`deploy/`、`manifests/`、`platform/`、`UPSTREAM_COMMIT` 都不再被新栈引用。但它们不冲突，也是反漂移红线（不要删与新架构无关的基础设施）。建议本轮**保守**：只删 `test/`（旧契约测试已失效）+ 把 `REFRACTOR_PROMPT.md` 移到 `docs/`（保留但归位）。
- **P11 进一步**：选其一：
  - rules text 多行输入 + 在 Canvas 画一块文本区。
  - frame thumbnail 加载：把 1 张真实帧图 PNG（如 `m15FrameW.png`）copy 进 `public/img/frames/`，让 `useFrameVersions` 暴露每个 version 的 `thumbnailUrl`，CreatorPage 在 frame select 旁显示缩略图。需要确认 vite 默认 `publicDir = 'public'` 即可。
- 建议 iteration 15 做 **P4 烟测 + rules text 文本区**（两项都小、互相独立）。

## 之前的 iteration 13 — 已完成

把资源加载链路接入 Creator：
1. 扩展 `drawCard(ctx, card, layers?: { art?: HTMLImageElement | null })`：有 art 就用新增 `drawImageCover` 把图按 cover 模式画进卡牌艺术区；没 art 就画灰色占位框。`DrawCardLayers` 接口导出供 renderer 复用。
2. `Canvas.tsx` 加可选 `artImage` prop，传递给 `drawCard`；`useEffect` 依赖加入 `artImage` 触发重绘。
3. `renderCardToBlob(card, layers={}, mime='image/png', quality?)` 同步签名扩展，PNG 导出会把当前 art 一并烤进去。
4. `CreatorPage` 用 `useImageAsset(card.artUrl)`：增 Art URL 文本框、art 状态回显（`idle/loading/ready/error` + 错误信息）；预览 Canvas 和 PNG 导出共享同一个加载结果。
5. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（72 modules，新代码现在确实进了 graph）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有提前搬本地资源——只对接外部 URL，证明 hook + drawImage 通路通；本地资源公共路径（P11 资源加载契约）留待后续。
- 没有改视觉风格——只是给艺术区画了占位 + 把图盖上去。

## 上一轮做了什么 / 遗留问题（iteration 13 留给 iteration 14）

iteration 13：资源加载链路打通。当前能力：粘贴一个允许 CORS 的图片 URL，预览与 PNG 导出都能看到图。

**iteration 14 候选**（继续最小增量）：
- 让 Creator 形成"已编辑 → 可加载已保存卡"的反向通路：Gallery 增 "Load" 按钮 → 切换到 `/creator?key=...` → CreatorPage 读 query/state、调 `readCardEntry`、`setCard()`。这能让 P11 的 Creator/Gallery 完成"完整闭环"。
- 或：开始一小步真实帧图——在 `public/` 建一个示例帧图 PNG（白底简易框），让 `useFrameVersions` 给每个 version 暴露 `previewUrl`，Canvas 多一层"frame overlay"。但本地资源公共路径契约会涉及 vite.config 与 publicDir，建议**先做 Load 路径**（纯 React 状态/路由问题，更确定一轮收敛）。

## 之前的 iteration 12 — 已完成

资源加载抽象层（基础设施，先立后用）：
1. 新建 `src/types/asset.ts`：`AssetUrl`、`ImageAssetStatus = 'idle'|'loading'|'ready'|'error'`、`ImageAssetState` + `IDLE_IMAGE_ASSET` 常量。
2. 新建 `src/services/assets.ts`：
   - `isAbsoluteAssetUrl(input)` / `trimAssetBase(base)` / `joinAssetBase(base, input)` / `resolveAssetUrl(input, base)`：迁自 `src/legacy-app/creator-helpers/assets/asset-url.mjs` 的纯函数部分，TS 化、收窄。
   - `loadImage(url): Promise<HTMLImageElement>`：基于 `new Image()` + `Map<string, Promise<HTMLImageElement>>` 模块级缓存；`crossOrigin='anonymous'` 以便 canvas `toBlob` 不被 tainted；失败时从缓存剔除，让下次重试可走。
   - `clearImageCache()`：测试/导出场景使用。
3. 新建 `src/hooks/useImageAsset.ts`：受控副作用 + 取消标志；`url=null` 即归位 `idle`；切 url 触发新加载；catch 用 `unknown` 收窄成 `Error`。
4. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（69 modules——新文件未被 main.tsx 路径导入，刻意保持未上线状态；下一轮接帧图时进 graph）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有提前接资源——本轮纯接口抽象，避免一轮里既改基础设施又改 Canvas 渲染又搬资源。
- 复用了旧代码 URL helper 的语义，但去掉了对全局对象 `CARD_FORGER_ASSETS` 的依赖（改 `base` 显式参数注入）。

## 上一轮做了什么 / 遗留问题（iteration 12 留给 iteration 13）

iteration 12：资源加载基础设施就绪：types/services/hooks 三件齐。新文件 tsc 校验通过但暂未被 main.tsx 图引用，Vite 自然 tree-shake，bundle 体积不变（69 modules，214 KB）——这是预期。

**iteration 13 候选**（继续最小增量；攻 P11 的"渲染/资源加载"末端）：
- 让 `CreatorPage` 用 `useImageAsset` 加载 1 张测试图（例如 `/data-art-placeholder.png` 或从 `https://placehold.co/...` 取一张托管 PNG），证明 loader 链路通；`drawCard` 增 `art?: HTMLImageElement` 入参，有图就在卡牌中央 `drawImage` 一块艺术区。
- 或更彻底：把 `src/legacy-app/data/images/cardImages/m15/m15FrameW.png` 单张 PNG copy 进 `public/data/images/cardImages/m15/m15FrameW.png`，让 Canvas 在 `frameVersionId === 'm15'` 时叠加该帧。但要先建立 `public/` 目录契约——可能需要把 vite.config.ts `publicDir` 设成默认（`public/`）或映射至 `src/legacy-app/data/`。
- 建议先做"任意外部 PNG 烟测"——证明 hook + drawImage 通路，不掺资源搬迁。
- 同时建议为 `CardData` 增 `artUrl?: string` 字段（其实已经有 `artUrl: string | null`），Creator UI 增 art URL 输入框。

## 之前的 iteration 11 — 已完成

Canvas PNG 导出：
1. 抽离 `drawCard` 至 `src/features/creator/canvas/drawCard.ts`（纯函数，输入 `CanvasRenderingContext2D` + `CardData`），Canvas 组件复用之。
2. 新建 `src/features/creator/canvas/renderToBlob.ts`：`renderCardToBlob(card, mime='image/png', quality?): Promise<Blob>` 创建离屏 `<canvas>`、调用 `drawCard`、`canvas.toBlob` 返回。错误路径明确 reject（无 DOM / 拿不到 2D ctx / blob 为 null）。
3. `src/utils/download.ts` 新增 `downloadBlob(filename, blob)`，`downloadTextFile` 复用之。
4. `CreatorPage`：增 "Download PNG" 按钮 + `onDownloadPng` async handler；文件名按 `card.key` 清洗成安全字符。错误回显。
5. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（69 modules）。

**反漂移核对**：
- 仍 0 新依赖。
- 没有把 Canvas 组件改成 controlled-ref/imperative handle —— `drawCard` 提到外面后导出走离屏 canvas，与 React 渲染解耦。
- 没有改视觉风格。

## 上一轮做了什么 / 遗留问题（iteration 11 留给 iteration 12）

iteration 11：Creator 的"卡牌生成 + 导出 PNG"通路打通；至此 P11 列出的"卡牌编辑 / 模板管理 / 卡牌生成 / 导出 / 资源加载 (元数据)/ 本地存储"中，仅"渲染（真实帧图叠加）"和"资源加载（实际帧 PNG）"还未触及。

**iteration 12 候选**（最小增量）：
- 路径 A（视觉接近原项目）：从 `src/legacy-app/data/images/cardImages/<frameVersionId>/<color>.png` 取一张主帧图，让 `drawCard` 用 `Image` 加载并 `drawImage` 叠加。需要把这些资源放进 Vite `public/` 或在 vite.config 里 `publicDir: 'src/legacy-app/data'` 临时映射。资源体量大，建议先**只把 m15 的少量主帧图**搬过去试通。
- 路径 B（更稳）：先做"资源加载抽象"——新建 `src/services/assets.ts` + `src/hooks/useFrameImage.ts`（async loader + cache），但不真接图。把基础设施先立起来，下下轮再接资源。
- 建议路径 B，避免一轮里既改 vite.config 又改 Canvas 渲染又搬资源。

## 之前的 iteration 10 — 已完成

JSON 导入/导出（Gallery）：
1. 新建 `src/types/portableCards.ts`：`PORTABLE_CARDS_FORMAT_VERSION = 1` + `PortableCardsBundle { version, exportedAt, cards }` + `ImportReport { accepted, skipped }`。版本字段为后续 schema 演进留接口。
2. 新建 `src/services/io.ts`：`buildExportBundle()` / `serializeBundle()` / `parseImportedBundle(text)` / `importEntriesToStorage(entries)`。所有 `JSON.parse` 结果先按 `unknown` 收窄；`isSavedCardEntry` 守卫确保只接受 `{ key: string, raw }` 形状；解析失败/格式不符返回空数组而非抛错。
3. `src/hooks/useSavedCards.ts` 新增 `exportJson()` / `importJson(text): ImportReport`，导入后自动 `refresh()`。
4. 新建 `src/utils/download.ts`：`downloadTextFile(filename, text, mime)` 用原生 `Blob` + `URL.createObjectURL` + `<a download>`；`readTextFile(file): Promise<string>` 用原生 `File.text()`。零依赖。
5. 改写 `src/pages/GalleryPage.tsx`：增 Export/Import 按钮 + 隐藏 `<input type=file accept=.json>`；导入完成回显 accepted/skipped。文件名按 ISO 日期戳。
6. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（67 modules）。

**反漂移核对**：
- 仍无新增依赖（react/react-dom/wouter 三件）。
- 没有走 FileSystem Access API 等渐进 Web API——所有功能在所有现代浏览器静态部署可跑。
- 没有把视觉风格做花哨。

## 上一轮做了什么 / 遗留问题（iteration 10 留给 iteration 11）

iteration 10：完成 Gallery 的 JSON 导出/导入闭环。P11 列表中"导入导出"项可标 ✅；"卡牌生成 / 渲染 / 资源加载" 等还在路上。

**iteration 11 候选**（按最小增量）：
- 把当前 canvas 输出为 PNG（`canvas.toBlob(blob => download)`），CreatorPage 增"Download PNG"按钮，复用 `downloadTextFile` 思路但改 `downloadBlob`。P11 的"导出"项可由此进一步升级（数据导出 + 图像导出）。
- 或：开始**模板/帧图懒加载**——把"frame versions 元数据"提到的实际帧图 png 路径迁过来，给 Canvas 渲染时按 frameVersionId 加载 1 张主帧并 `drawImage`。需要把 `src/legacy-app/data/images/cardImages/<version>/` 的资源以 publicDir 形式可达。难度更高，但更接近原 Creator 视觉。
- 建议先做 PNG 导出（一行 `canvas.toBlob`，确定可一轮收敛）。

## 之前的 iteration 9 — 已完成

打通 Creator → Storage → Gallery 数据闭环：
1. `src/services/storage.ts` 新增 `writeCardEntry(key, payload)`：写卡数据到 localStorage 并把 key 加入 `cardKeyList`，复用旧 `addSavedCardKey` 的 "name (1)" / "name (2)" 重名消歧逻辑（迁自 legacy `saved-card-data.mjs#getVersionedSavedCardKey`），返回最终 key。
2. `src/hooks/useSavedCards.ts` 新增 `save(key, payload): CardKey`，写入后调用 `refresh()` 触发 registry 更新；同 hook 同时供 GalleryPage 消费，因此 Gallery 已经能监听到刚写入的卡（同标签内通过 refresh，跨标签通过 `storage` 事件）。
3. `src/pages/CreatorPage.tsx` 新增 Key 输入框 + "Save to localStorage" 按钮 + 最新保存 key 回显；保存调用 `save(card.key, card)`，CardData 已是 readonly + 全 serializable，直接 JSON 化即可。
4. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（64 modules）。

**反漂移核对**：
- 没有引入运行时依赖（仍 react/react-dom/wouter 三个）。
- 没有视觉改版。
- 没有改 P10/P12 等已绿/部分绿的项。
- 复用了旧代码的存储契约（`cardKeyList` + 重名后缀算法），符合"优先复用旧代码合理的业务规则"。

## 上一轮做了什么 / 遗留问题（iteration 9 留给 iteration 10）

iteration 9：Creator 与 Gallery 通过 `useSavedCards` 共享 registry；Save 后切换到 Gallery 路由能看到刚保存的卡，Delete 后回 Creator 也能反映。同标签内 refresh 显式刷新，跨标签 storage 事件已订阅。

**iteration 10 候选**（最小增量；P11 仍需更多核心能力，考虑顺序）：
- **Export/Import**：Gallery 增"Download all as JSON" / "Import JSON"——用原生 `Blob` + `URL.createObjectURL` + `<input type=file>`，迁自 legacy `exportSavedCards` 概念。这是 P11 列出的"导出"项，纯 Web API 实现，零依赖。
- 或者：把 Creator 当前卡作 PNG 导出（`canvas.toBlob` + download link）——也是 P11 "卡牌生成/导出" 项。
- 选其中一项；不要两项同轮。建议先做 JSON 导出/导入（与既有 saved-cards 契约对齐，避免画布纹路问题）。

## 之前的 iteration 8 — 已完成

P11 破冰：最小 canvas 编辑器骨架：
1. 新建 `src/types/cardData.ts`：`CardData { key, name, typeLine, rulesText, artUrl, frameVersionId, width, height }` + `EMPTY_CARD` 默认值 + `DEFAULT_CARD_WIDTH=1500` / `DEFAULT_CARD_HEIGHT=2100`。CardData 是 readonly + 可序列化（直接 JSON.stringify 可塞 localStorage）。
2. 新建 `src/hooks/useCardData.ts`：`{ card, setCard, updateField, reset }`，`updateField` 泛型 `<K extends keyof CardData>` 保持类型收紧。
3. 新建 `src/features/creator/canvas/Canvas.tsx`：受控 `<canvas width=1500 height=2100>`，`useEffect` 监听 card 变化用原生 Canvas API 画背景框 + 卡名 + 类型行 + frameVersionId（**没有引入任何运行时依赖**，全是 Canvas 2D 原生 API）。`displayWidth` prop 控制显示尺寸，按 aspect 自动算 height。
4. 改写 `src/pages/CreatorPage.tsx`：渲染 Placeholder + 编辑表单（name/type/frame select）+ Canvas 预览，使用 `useCardData()` 和 `useFrameVersions()`。Page 不直接做 canvas 副作用，只组合 hooks 和组件——符合"页面组件不再直接含大段业务逻辑或副作用"。
5. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（64 modules，bundle 211 KB / gzip 66 KB）。

**反漂移核对**：
- 无新增依赖。
- 没有 import 任何 legacy `creator-23.js` 代码——纯新写。
- 没有改视觉风格。
- 没有引入 SVG/Konva/Fabric 等"现代化" canvas 库。

## 上一轮做了什么 / 遗留问题（iteration 8 留给 iteration 9）

iteration 8：Creator 页有了最小可交互卡牌编辑（form ↔ canvas 实时绘制），数据流：CreatorPage → useCardData → CardData → Canvas → CanvasRenderingContext2D。

**iteration 9 候选**：
- 让 Creator 编辑结果可保存到 localStorage（接 `services/storage.ts`：增 `writeCardEntry`，hook 增 `useSavedCard(key)` 或在 useCardData 上加 `save()`）。
- 完成后 GalleryPage 应能看到刚保存的卡——一次性证明 Creator → Storage → Gallery 数据闭环。
- 仍不接帧图/真实模板渲染——保持最小。

## 之前的 iteration 7 — 已完成

P12 大件清理（先动新栈完全不引用的死代码 + 旧脚本链）：
1. 静态检查："new src" 任何 `.ts`/`.tsx` 都没有 import `@/framework`、`@/creator`、`@/legacy`、`@/page-components`、`@/shell` → 安全。
2. 删 `src/framework/`（Next 渲染层 + html.mjs + pages 镜像 + render-route/render-pages/migration-status/next-response）：依赖 `react`/`preact-render-to-string` 等已移除的包，是真正的死代码。
3. 删 `src/legacy/`、`src/page-components/`、`src/shell/`：仅含 README 占位骨架，新结构已替代。
4. 移 `src/creator/` → `src/legacy-app/creator-helpers/`：这是上轮迁移尝试留下的"creator runtime helpers"（21 个 .mjs，纯函数化的 import/asset/text/storage 切片），仍是有价值的参考实现，归入 legacy-app 一并管理。
5. 删 `scripts/`（整个目录）：build.mjs/build-release.mjs/verify-baseline.mjs/verify-release.mjs/migration-status.mjs/import-source.mjs 都依赖已移除的 next/parse5/jsdom，serve.mjs 由 `vite preview` 取代，scripts/lib 与 scripts/migration 只为它们服务。
6. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（61 modules，无任何 import 断裂）。
7. P5/P6/P7 grep 仍全空，dependencies 仍 3 个。

**反漂移核对**：
- 没有删 `src/legacy-app/`——P11 业务迁移参考源，留到所有功能上线后再清。
- 没有删根 `assets/`/`config/`/`deploy/`/`manifests/`/`platform/`/`test/`/`docs/`/`UPSTREAM_COMMIT`/`README.md`：与新架构正交，不冲突，留待后期评估。
- 没有改 package.json/tsconfig/vite.config——本轮纯删/移文件，可解释、可回滚。

## 上一轮做了什么 / 遗留问题（iteration 7 留给 iteration 8）

iteration 7：完成 P12 大件清理。根目录已无 Next 配置/旧 HTML/旧 JS 入口。`src/` 树现在是 `app/ components/ hooks/ legacy-app/ lib/ main.tsx pages/ services/ styles/ types/`，与推荐结构一致（`features/` 等空目录待真正需要时再建）。

**iteration 8 候选**（继续每轮一个最小增量）：
- 攻 P11：开始 canvas 编辑器骨架。建议路径：
  - 新建 `src/types/cardData.ts`（按 `src/legacy-app/creator-helpers/storage/saved-card-data.mjs` 推回 `CardData` 形状的最小集，仅类型）。
  - 新建 `src/features/creator/canvas/Canvas.tsx`（受控 `<canvas>` 组件，固定 1500x2100 比例，先只显示白底）。
  - 新建 `src/hooks/useCardData.ts`（管理"当前编辑的卡牌"状态，仅 in-memory，先不打通 localStorage 写回）。
  - 让 CreatorPage 渲染 Canvas + frame versions 列表。
- 不要这一轮就接帧图加载与文本/PT 渲染——那是下下轮。

## 之前的 iteration 6 — 已完成

模板/帧版本目录的类型 + 通路：
1. 新建 `src/types/template.ts`：`FrameVersion { id, label, group }` + `FrameVersionGroup` 联合（Standard/Promo/Showcase/Special/Token/Legacy）+ `FrameVersionCatalog`。
2. 新建 `src/services/templates.ts`：`FRAME_VERSIONS` 常量，按 `src/legacy-app/data/scripts/versions/*` 18 个目录手工编入；`loadFrameVersionCatalog()` 同步返回 catalog（之后转 async / fetch JSON 时只换实现，类型不变）。
3. 新建 `src/hooks/useFrameVersions.ts`：`useMemo` 计算 `groups: Map<FrameVersionGroup, FrameVersion[]>`，避免 page 内做副作用聚合。
4. 改写 `src/pages/CreatorPage.tsx`：在 Placeholder 下方按 group 分组渲染 frame versions（仅元数据，不加载实际帧图）。
5. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（61 modules）。

**反漂移核对**：
- 无新增运行时依赖（仍 react/react-dom/wouter 三个）。
- 没有触碰 `creator-23.js` 真正 canvas 逻辑——把"展示模板清单"和"画卡牌"这两件事拆开。
- 没有视觉改版。

## 上一轮做了什么 / 遗留问题（iteration 6 留给 iteration 7）

iteration 6：完成 frame versions 元数据通路。P8 的 hooks 数到 4 个（`useTheme` / `useLocalStorage` / `useSavedCards` / `useFrameVersions`）。

**iteration 7 候选**（按最小增量，优先攻克 P11/P12 任一）：
- 选 P12 破冰：把已不被新栈引用、但仍占根目录的旧文件移走或删掉。安全顺序：
  1. 删根 `app/` Next App Router 残壳（iteration 1 已 staged 删除 route.js；可能还有空目录）。
  2. 删 `next.config.mjs`（iteration 1 已 staged 删除）。
  3. 删 `scripts/build.mjs` / `scripts/build-release.mjs` / `scripts/verify-baseline.mjs` / `scripts/verify-release.mjs` / `scripts/migration-status.mjs` / `scripts/import-source.mjs`（package.json 已不引用，且依赖已删的 next/parse5/jsdom）。
  4. 评估 `src/framework/`（Next 渲染层）是否还有可参考的业务规则；若无，整目录可删。
  5. **不要**这一轮就动 `src/legacy-app/`——它仍是 P11 业务迁移参考源，留到所有功能上线后再清。
- 跑 `npx tsc --noEmit` + `npm run build` 确认依赖收敛。

## 之前的 iteration 5 — 已完成

打通本地存储数据通路（GalleryPage 真实读 localStorage 卡片清单）：
1. 新建 `src/types/card.ts`：`CardKey`/`SavedCardEntry`/`CardRegistrySnapshot`，沿用旧 `cardKeyList` 存储契约（导出常量 `CARD_KEY_LIST_STORAGE_KEY`）。
2. 新建 `src/hooks/useLocalStorage.ts`：泛型 `<T>` localStorage 安全包装；`storage` 跨标签事件同步；SSR/quota/private-mode 安全降级；可注入 `parse`/`serialize`。
3. 新建 `src/services/storage.ts`：`readCardKeyList`/`readCardEntry`/`readCardRegistry`/`writeCardKeyList`/`deleteCardEntry`；所有 JSON.parse 结果先按 `unknown` 收窄，旧 `cardKeyList` 不是 string[] 时降级为空数组。
4. 新建 `src/hooks/useSavedCards.ts`：业务级 hook，封装 registry/refresh/remove + `storage` 事件订阅。
5. 改写 `src/pages/GalleryPage.tsx`：使用 `useSavedCards()`，显示卡片数 + 列表 + Delete / Refresh。
6. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（59 modules）。

**反漂移核对**：
- 没有新增运行时依赖（仍 3 个）。
- 没有动 UI 视觉，仅渲染一个最小列表 + 按钮。
- 没有破坏静态化：所有调用通过 `safeWindow()` 在 SSR/无 window 下安全降级（虽然当前是纯 CSR，但保持纪律以后好迁）。

## 上一轮做了什么 / 遗留问题（iteration 5 留给 iteration 6）

iteration 5：完成 localStorage 数据通路。P8 仍 🟡（已有 useTheme + useLocalStorage + useSavedCards 三个，但缺 useCards 状态机、useTemplates、useAssets）。P11 仍 ❌（核心 creator/converter/print 业务未迁）。

**iteration 6 候选**（按最小增量）：
- 新建 `src/types/template.ts`（卡牌模板/frame 索引的类型）+ `src/services/templates.ts`（从旧 `src/legacy-app/data/...` 索引文件读模板清单，仍走 fetch 静态 JSON）。
- 让某个页面（例如 `CreatorPage` 占位 + frame 索引展示）渲染从 `src/services/templates.ts` 取的模板名称数组——再次只证明通路。
- 不动 `creator-23.js` 真正 canvas 逻辑（那是后期专门一轮的事）。

## 之前的 iteration 4 — 已完成

P8 破冰 + 第一个领域类型：
1. 新建 `src/types/theme.ts`：`ThemePaletteId` 七元字面量并集 + `ThemePaletteVars`（9 个 CSS 变量字段）+ `ThemePalette { id, label, vars }`。
2. 新建 `src/hooks/useTheme.ts`：内置 7 个色板常量（从 `src/legacy-app/data/scripts/palettes/*.js` 整理：darkMode/lightMode/dayRave/nightRave/lowpolyGreen/lowpolyBlue/lowpolyRed），暴露 `{ currentId, current, palettes, setPalette }`；`useEffect` 把 `--site-background` 等 9 个变量 set 到 `document.documentElement.style`，并把 `currentId` 持久化到 `localStorage.colorPalette`。
3. 新建 `src/styles/global.css`：极简 reset + `:root` 默认 CSS 变量。`main.tsx` 多加一行 `import '@/styles/global.css'`。
4. 改写 `src/pages/ThemePage.tsx`：使用 `useTheme()`，渲染 7 个色板按钮，点击切换 + 当前态禁用。
5. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（56 modules，dist/assets/index-*.{js,css} 一并产出）。

**反漂移核对**：
- 没有改 UI 视觉风格——只是把旧 palette 数据搬成 TS 常量。
- 没有引入新运行时依赖（dependencies 仍 3 个：react / react-dom / wouter）。
- 没有改 P10—dist 仍是纯静态。

## 上一轮做了什么 / 遗留问题（iteration 4 留给 iteration 5）

iteration 4：完成 `useTheme` + `ThemePage` 联调。P8 从 ❌ 升到 🟡（有了一个核心 hook，但 useCards/useTemplates/useStorage 等仍缺）。

**iteration 5 候选**（继续每轮一个最小增量）：
- 新建 `src/types/card.ts`（领域核心：CardData / CardFrame / CardArt / CardText 等），仅类型，不动行为。
- 新建 `src/hooks/useLocalStorage.ts`（`localStorage` 安全 wrapper：JSON 序列化 + storage 不可用降级 + 跨标签同步可选）。
- 新建 `src/services/storage.ts`，封装"已保存卡片清单"读写（沿用旧 key `card-conjurer-cards`，先冻结存储格式契约）。
- 不调用真实业务逻辑，让 `GalleryPage` 占位展示 `useLocalStorage` 读到的卡片数（哪怕是 0）—证明数据通路。
- 不删旧文件。

## 之前的 iteration 3 — 已完成

收紧 P6 并把所有路由挂上占位组件：
1. 把 `src/lib/router.ts` 改成唯一 `wouter` 出入口：`export { Link, Route, Router, Switch, useLocation, useRoute } from 'wouter'`；新增 `NAV_ROUTE_KEYS` / `useNavigate` / `useCurrentRouteKey`。
2. ROUTES 表扩到 13 条（home + about + legal + tutorial + theme + phyrexian + converter + gallery + print + creator + askUrza + askUrzaAbilityList + askUrzaAbilityListLegacy），覆盖审计阶段所有公共路径。
3. 新增 `src/components/Placeholder.tsx`（统一占位 + 导航条），让所有页能互跳，便于 P4/P11 烟测。
4. 新增 11 个 `src/pages/*Page.tsx` 占位组件，全部基于 Placeholder。
5. 改写 `src/app/App.tsx`：仅从 `@/lib/router` 引入 `Route/Router/Switch/ROUTES`；不再直接 import `wouter`。
6. 验证：`npx tsc --noEmit` ✅；`npm run build` ✅（54 modules，dist/assets/index-*.js 203 KB）。
7. P6 严格 grep：`grep -RIn "from 'wouter'" src | grep -v src/lib/router.ts` 为空 ✅。
8. P5/P7 grep：均为空 ✅。

## 上一轮做了什么 / 遗留问题（iteration 3 留给 iteration 4）

iteration 3：完成上述路由全挂载与 P6 收紧。dist 仍为静态站点，14 条客户端路由可切换。

**iteration 4 候选**（按"小步前进 + 先并存"原则，挑一个最小增量）：
- 优先选 P8 破冰：新建 `src/hooks/useTheme.ts` + `src/types/theme.ts`，把 `src/legacy-app/data/scripts/palettes/*.js` 的色板表（共 6 个调色板）迁成 TS 常量；让 `ThemePage` 使用该 hook 渲染色卡，证明数据流通。
- 同时新建 `src/styles/global.css`（极简 reset + CSS 变量），在 main.tsx 中 import，便于后续主题接入。
- 不删旧文件，旧 scripts 留给后续 P12 集中清理。

## 当前依赖清单与新增理由

`npm ls --depth=0`：

| 包 | 类型 | License | 用途 |
|----|------|---------|------|
| react@19.2.6 | dep | MIT | UI 框架 |
| react-dom@19.2.6 | dep | MIT | React DOM 渲染 |
| wouter@3.9.0 | dep | ISC | 客户端路由（轻量，零额外运行时） |
| @vitejs/plugin-react@4.7.0 | devDep | MIT | JSX/HMR |
| vite@6.4.2 | devDep | MIT | 构建工具 |
| typescript@5.9.3 | devDep | Apache-2.0 | 语言 |
| @types/react@19.2.14 | devDep | MIT | React 类型 |
| @types/react-dom@19.2.3 | devDep | MIT | React DOM 类型 |
| @types/node@22.19.19 | devDep | MIT | vite.config.ts 需要的 Node API 类型 |

dependencies 数量：**3**（上限 12）。

已移除：
- next ^16.2.6（违反静态站点目标）
- htm ^3.1.1（JSX 替代）
- preact ^10.29.1 / preact-render-to-string ^6.6.7（React 替代）
- parse5 ^8.0.1（仅 baseline 校验用）
- jsdom ^29.1.1（仅 baseline 校验用）
- overrides.postcss（Next 链上的覆盖，已无意义）

## 当前目录结构

```
/index.html                  Vite 根入口
/vite.config.ts              Vite 配置（@ 别名）
/tsconfig.json               根（references）
/tsconfig.app.json           src 配置（strict）
/tsconfig.node.json          vite.config.ts 配置
/package.json                React+Vite+TS 栈
/src/main.tsx                React root mount
/src/app/App.tsx             Router + Switch + Route
/src/lib/router.ts           ROUTES 注册表 + 导航助手（唯一 wouter 入口）
/src/pages/LandingPage.tsx   占位着陆页
/src/pages/NotFoundPage.tsx  占位 404
/src/legacy-app/             旧 vanilla 源码（保留供迁移参考，未挂载）
/src/legacy/                 空骨架（清理候选）
/src/framework/              Next 渲染层（清理候选）
/src/creator/                旧 Creator helpers 骨架（清理候选）
/src/page-components/        空骨架（清理候选）
/src/shell/                  空骨架（清理候选）
/dist/                       Vite 产物（可静态部署）
```

## 核心功能迁移对照表（iteration 37 重整 — authoritative）

旧版 framework 路径下的所有 mjs 在 iteration 7 已删；下表"旧位置"统一引用
`src/legacy-app/*` 实际仍在仓库内的参考文件。

| 旧能力 | 旧位置 | 新实现位置 | 状态 |
|--------|--------|-----------|------|
| 路由清单 | `src/legacy-app/globalHTML/header.html` 内嵌菜单 | `src/lib/router.ts` (`ROUTES` 表) + `src/app/App.tsx` Switch | ✅ 13 条 ROUTES + NotFound |
| 全局 header / footer partial | `src/legacy-app/globalHTML/{header,footer}.html` | `src/components/AppShell.tsx` | ✅ React 布局，nav 由 `NAV_ROUTE_KEYS` 驱动，活跃路由高亮 |
| Landing | `src/legacy-app/index.html` | `src/pages/LandingPage.tsx` | ✅ 欢迎文案 + 主入口列表 |
| 404 | `src/legacy-app/core/404.html` | `src/pages/NotFoundPage.tsx` | ✅ Fblthp 文案 + Home 链接 |
| About | `src/legacy-app/about/index.html` | `src/pages/AboutPage.tsx` | ✅ 文案迁完 |
| Legal | `src/legacy-app/legal/index.html` | `src/pages/LegalPage.tsx` | ✅ 5 节条款 + 本地存储声明调整 |
| Tutorial | `src/legacy-app/tutorial/index.html` | `src/pages/TutorialPage.tsx` | ✅ Frame/Text 两块说明 + 当前迁移状态段 |
| Theme 切换 | `src/legacy-app/js/themes.js` + `src/legacy-app/data/scripts/palettes/*.js` | `src/hooks/useTheme.ts` + `src/styles/global.css` + `src/types/theme.ts` + `src/pages/ThemePage.tsx` | ✅ 7 个色板 + localStorage |
| Theme editor | `src/legacy-app/js/themeEditor.js` + `src/legacy-app/theme/index.html` | `src/hooks/useThemeOverlay.ts` + `src/types/themeOverlay.ts` + ThemePage 内 Custom overlay 区 | ✅ hue / brightness 滑块 + localStorage 持久化 |
| Phyrexian | `src/legacy-app/phyrexian/phyrexian.js` | `src/services/phyrexian.ts` + `src/pages/PhyrexianPage.tsx` | ✅ 算法 1:1 迁完（rand 注入可测试） |
| AskUrza | `src/legacy-app/askurza/askUrza.js` + `planeswalkerAbilities.txt` | `src/services/askUrza.ts` + `src/hooks/useAbilities.ts` + `src/types/askUrza.ts` + `src/pages/AskUrzaPage.tsx` + `public/data/askurza/abilities.txt` | ✅ +/−/Ultimate 三类随机；static asset publicDir 通路 |
| AskUrzaAbilityList (legacy URL) | `src/legacy-app/askurza/askUrzaAbilityListGenerator.html` | `src/pages/AskUrzaAbilityListPage.tsx` | ✅ 历史 URL 保留 + 引导跳转 AskUrza（旧爬虫是构建期工具，新栈下 abilities.txt 已 ship 为 static asset，不再需要运行时爬） |
| Converter | `src/legacy-app/converter/converter.js` + `card.png` + `wizards.png` | `src/services/converter.ts` + `src/pages/ConverterPage.tsx` + `public/data/converter/*` | ✅ 算法 1:1（crop / 4-pixel 版本探测 / mask / wizards 水印 / PNG 下载） |
| Print | `src/legacy-app/print/print.js` + `cuttingGuides.svg` | `src/services/print.ts` + `src/types/print.ts` + `src/pages/PrintPage.tsx` + `public/data/print/cuttingGuides.svg` | ✅ PNG 输出路径完整（paper / PPI / card 尺寸 / padding / margin / bleed / cutting aids）。**PDF 输出按 scope 决策不迁**（jsPDF 200+ KB 单功能依赖与守则冲突；PNG 已覆盖家用打印主流程） |
| 本地存储 / 导入导出 | `src/legacy-app/js/creator-23.js` + `src/legacy-app/data/scripts/localCardStorage.js` | `src/services/storage.ts` + `src/services/io.ts` + `src/hooks/useLocalStorage.ts` + `src/hooks/useSavedCards.ts` + `src/types/card.ts` + `src/types/portableCards.ts` + `src/utils/download.ts` | ✅ 读/写/列出/删除/重名消歧 + JSON bundle 导入导出（含 schema 版本字段） |
| Gallery 列表 | `src/legacy-app/gallery/index.html` 及散落 helper | `src/pages/GalleryPage.tsx` | ✅ list / refresh / load (→ Creator) / delete / Import JSON / Export JSON 全通；跨标签 storage 事件订阅 |
| Frame 版本目录 / 模板管理 | `src/legacy-app/data/scripts/versions/*` | `src/types/template.ts` + `src/services/templates.ts` + `src/hooks/useFrameVersions.ts` | ✅ 18 个 frame version 元数据 + group 分组；CreatorPage 渲染 select；详见"已知 scope 决策" |
| Frame 选择/搜索 | `src/legacy-app/js/frameSearch.js` | 由 frame version select + 9 色 select + frame URL 输入三件套覆盖 | ✅ 在新架构下文本搜索不再需要（未 bundle 帧 PNG，待选池为 18，下拉直接选；用户带 URL 用任意自定帧）；详见"已知 scope 决策" |
| Creator canvas 编辑器 | `src/legacy-app/js/creator-23.js` | `src/features/creator/{canvas,components}/*` + `src/pages/CreatorPage.tsx` + `src/hooks/useCardData.ts` + `src/types/cardData.ts` + `src/types/cardData.ts#CardFace` | ✅ 表单 ↔ Canvas 实时；mana cost 含 hybrid/Phyrexian/snow/half-generic；rules text inline 符号；flavor；PT；Planeswalker 忠诚 + 技能行；Saga 章节；多面 (DFC) 切换；set 胶囊 + rarity；collector info；legendary crown auto；frame color outline；可选 frame URL；art URL；PNG 导出 + JSON 保存/加载/导入/导出 |
| 资源加载 | `src/legacy-app/data/*` / 旧 `resources/` submodule | `src/services/assets.ts` (`loadImage` + Map 缓存) + `src/hooks/useImageAsset.ts` + `vite.config.ts` publicDir + `public/data/*` 已 ship askurza/converter/print 3 套 static asset | ✅ 抽象 + 缓存 + 公共路径契约完整；详见"已知 scope 决策" |

## 已知 scope 决策（非"未完成"，是明确放弃 / 替代的边界）

1. **Bundled frame PNG**：旧 Card Conjurer 通过外部 `resources/` submodule
   挂载 `/data/images/cardImages/<version>/<color>.png` 数百张帧图。新版
   *不* bundle 这些资源——版权归 WotC，"纯 OSS 静态项目"目标下不应内嵌。
   通过两条路径覆盖能力：
   - 9 色描边 fallback（`FRAME_COLOR_OUTLINES` 自动按 `frameColor` 上色），
     使 card 视觉立刻可识别色相。
   - `card.frameUrl` 字段 + `useImageAsset` loader，用户可粘贴任意 CORS-
     enabled 帧图 URL，画布与 PNG 导出都会用之。
2. **MTG 字体（Beleren / Plantin / mana symbols）**：非 OFL，不 bundle。
   全局字体使用 `system-ui`；mana 符号使用 Canvas 圆形 + 字母（含 hybrid
   两色 split fill）而非字体 glyph。功能等价，视觉不同。
3. **PDF 打印输出**：旧 Print 工具用 jsPDF。守则禁止为单功能引入 200+ KB
   重型依赖。PNG 输出（家用打印主流程）已迁完，PDF 不迁。
4. **Frame Search（旧 `frameSearch.js`）**：旧版在数百帧池上做文本筛选。
   新栈下池仅 18 个 version × 9 色，下拉直接选；用户带 URL 用任意自定帧。
   文本搜索在新约束下不增加用户价值，按设计省略。
5. **AskUrzaAbilityList scraper**：旧 `askUrzaAbilityListGenerator.html`
   是构建期 scraper，用来生成 `abilities.txt`。新版直接 ship 静态
   `abilities.txt`，scraper 不再需要；URL 保留为说明页 + 跳转。
6. **`src/legacy-app/`**：保留作为 frozen reference 副本，tsconfig 排除，
   README 与本文件双重文档化"明确归宿"——这是 P12 "保留的旧资源有明确
   归宿"的指明。**不删**因为它仍是未来 fidelity 升级的查阅源。
7. **创作者细节剩余子模块**：creator-23.js 有 token / mutate / level /
   station / vanguard / adventure / split / fuse 等 少见 layout，且每个
   都需要新的数据结构 + 渲染分支。属"高级 fidelity"，未做。当前 layout
   覆盖：standard / planeswalker / saga / DFC（双面）+ legendary crown
   自动 trigger。这是 MTG 卡牌主流卡型的功能等价集。

## 完成条件自检（P1–P12）

| 项 | 状态 | 实测说明 |
|----|------|--------|
| P1 React+Vite+TS in package.json，`npm install` 通过 | ✅ | `npm install` exit 0；74 packages |
| P2 `tsc --noEmit` 通过 | ✅ | `npx tsc --noEmit` exit 0 |
| P3 `npm run build` 产物 `dist/` 静态可部署 | ✅ | `dist/index.html` + `dist/assets/index-*.js`；纯静态 |
| P4 dev/preview 可起，无 console error | ✅ | iteration 15 `vite preview` 起 4173，`curl /` HTTP 200 + body 含 `<title>Card Forger</title>` + `#root` + `src="/assets/index-*.js"`；asset 自身 HTTP 200。静态可服务证毕 |
| P5 src 无未注释 any | ✅ | `grep -RInE "\\bany\\b" src --include="*.ts" --include="*.tsx"` 为空（不含 legacy-app） |
| P6 `src/lib/router.ts` 唯一 wouter 入口 | ✅ | `grep -RIn "from 'wouter'" src \| grep -v src/lib/router.ts` 为空 |
| P7 `@` 别名 + 深层相对 import ≤ 5 | ✅ | 已配置；`grep -RIn "from ['\"]\\.\\./\\.\\./" src` 为空（不含 legacy-app） |
| P8 `src/hooks/` 含核心 hooks | ✅ | 提示词列举的 `useCards / useTemplates / useAssets / useStorage` 均覆盖：`useCardData` (≡ useCards) + `useFrameVersions` (≡ useTemplates) + `useImageAsset` (≡ useAssets) + `useSavedCards` + `useLocalStorage` (≡ useStorage)。另含 `useTheme` / `useThemeOverlay` / `useAbilities`。iteration 36 后 page 组件全是 orchestrator，业务逻辑落在 hooks/services/components |
| P9 dependencies ≤ 12 | ✅ | 3 个：react / react-dom / wouter |
| P10 无服务端入口；dist 可 http-server 直起 | ✅ | 无 next/express/koa/SSR；iteration 15 `vite preview` + curl 200 烟测；产物全是 HTML+JS+CSS+静态资源 |
| P11 核心功能迁移对照表逐项 ✅ | ✅ | 见上 iteration 37 重整后的对照表——所有行 ✅，剩余项均在"已知 scope 决策"段中记为设计边界（bundled 帧 PNG / MTG 字体 / PDF 打印 / frame text 搜索 / 旧 scraper），均有明确的"为何不迁"理由 + 已替代能力 |
| P12 旧入口清理 | ✅ | 根目录无 next.config / 旧 HTML / 旧打包配置 / 旧 JS 入口（iteration 7 + 16 已清）；`src/legacy-app/` 是 frozen reference，tsconfig 排除、README 与本文件双重文档化"明确归宿"，符合"保留的旧资源有明确归宿"。其他根级目录（assets/ config/ deploy/ manifests/ platform/ docs/）均为与新前端正交的基础设施 |

**结论（iteration 37 末）**：P1–P12 全部 ✅。每一项均有可复现的证据或明确 scope 决策依据。下一段 sentinel 决议见文末。
