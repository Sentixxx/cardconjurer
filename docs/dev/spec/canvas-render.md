---
title: Canvas 渲染契约（对上游 CardConjurer）
type: spec
status: active
summary: drawCard 流水线相对上游 creator-23.js 的字段对照——尺寸、字体、字号、collector 6 段、颜色受控
tags: [spec, canvas, parity]
related:
  - dev/architecture/overview
  - dev/spec/text-tokens
  - dev/standards/pitfalls
  - dev/testing/strategy
---

# Canvas 渲染契约

## 上游 ground truth

| 路径 | 状态 | 角色 |
|---|---|---|
| `/workspace/cardconjurer/js/creator-23.js` | 独立 git 仓，只读 | **首要 ground truth**；冲突以此为准 |
| `src/legacy-app/` | 仓内冻结快照 | 便携副本，可能落后于上游 |
| `cardforger/UPSTREAM_COMMIT` | 文本指针 | 记录"我方对齐到上游哪个 commit" |

cardforger 侧的所有字段命名、字号、token 集合、颜色规则**必须可在上游某一行被指出来源**。"凭直觉改良"视为违约。

## 画布尺寸

| 实例 | cardCanvas 实际尺寸 | 备注 |
|---|---|---|
| cardforger | 1500 × 2100 | `drawCard` 的最终合成目标 |
| 上游 conjurer | 2010 × 2814 | 含边距；高分缩放 1.34×（`highResScale`）|
| 上游 previewCanvas | 1005 × 1407 | 仅缩放预览，不作为对照目标 |

跨实例视觉对照时**禁用 `-resize 500`**——必须按相同 gravity / offset 像素 1:1 切片（流程见 [`process/parity-check.md`](../process/parity-check.md)）。

## drawCard 流水线

入口在 `src/features/creator/canvas/drawCard.ts`。调用顺序（每步缺省态等价上游同名函数 / 同段代码）：

1. 底色
2. 框架图（`framePresets.ts` 解析 versionId → URL；alias 表 32 项与上游 `frames[...]` 对齐）
3. 艺术图（`useImageAsset` 异步加载，失败 fallback 占位）
4. mana symbol（`drawManaSymbols`，diameter = lineHeight × 0.9）
5. 标题 / 类型行（`drawRichText` + `{cardname}` token）
6. rules / flavor（`drawRichText` 含 binary-fit 字号缩放）
7. planeswalker / saga 特殊层（loyalty shield / chapter pip）
8. **collector**（`drawCollectorInfo`，详 §collector-6-段）
9. watermark（`drawWatermark`，opacity 0.28，双色 tint）
10. set symbol（`drawSetSymbol`，rarity 颜色映射；PNG 上传可覆盖）

每一步的字号 / 字体 / 对齐方式在上游 `creator-23.js` 的对应函数里有确定字面量；cardforger 侧实现见 `RENDER_PARITY_STATE.md` §2 表格。

## 字体清单（关键，反复踩坑）

| 字体名 | 用途 | 上游来源 |
|---|---|---|
| `gothammedium` | collector 主体（midLeft / topLeft / bottomLeft）| `setBottomInfoStyle()` 主字体 |
| `belerenbsc` | artist 段内联切换 + brush icon `￮` | `setBottomInfoStyle()` `{fontbelerenbsc}` token |
| `mplantin` | wizards 行 + 站点行 + rules / flavor | `setBottomInfoStyle()` wizards / bottomRight |
| `mplantin-i` | flavor italic + reminder text italic | `writeText` 的 `{i}…{/i}` 解析 |
| `gillsansbolditalic` | 旧版 `{oldflavor}` | `writeText` 旧版分支 |

**禁错记忆**：collector 主字体是 `gothammedium`，**不是** `goudymedieval`。

## collector 6 段

对齐上游 `setBottomInfoStyle` 在 `creator-23.js:245–270` 的实现。`drawCollectorInfo` 必须输出 6 个 text object（语义等价于上游 6 个 push 到 `bottomInfo` 的 entry）：

| 段 | 上游字段（节选） | 字体 | 相对字号 | 对齐 | y 比例 |
|---|---|---|---|---|---|
| midLeft | `{set} • {language}  {savex}{fontbelerenbsc}{fontsize+δ}{upinline+δ}￮{savex2}{artist}` | gothammedium → belerenbsc | 0.0171 | left | 0.9548 |
| topLeft（新版） | `{rarity}{kerning3}{number}{kerning0}` | gothammedium | 0.0171 | left | 0.9377 |
| topLeft（旧版） | `{number}` + 独立 `rarity:{text:'{loadx}{rarity}'}` | gothammedium | 0.0171 | left | 0.9377 |
| bottomLeft | `NOT FOR SALE` | gothammedium | 0.0143 | left | 0.9719 |
| wizards | `{ptshift0,0.0172}™ & © {year} Wizards of the Coast` | mplantin | 0.0162 | **right** | 0.9377 |
| bottomRight | `{ptshift0,0.0172}card.sentixx.top` | mplantin | 0.0143 | **right** | 0.9548 |

`enableNewCollectorStyle` 等价开关控制 topLeft 新 / 旧版二选一。

### brush icon

字符 `￮` 在 belerenbsc 字体下渲染（不是 ASCII `✧`）。上游同字符走 mana symbol PNG 路径，可视等价；cardforger 简化为字体 glyph（若 belerenbsc cmap 不含 ￮ 可后续改注入 `/img/manaSymbols/brush.svg`）。

### bottomInfoColor

`card.bottomInfoColor` 由 `resolveBottomInfoColor(card)` 推导：

- 默认 `#ffffff`
- 白底 frame（如 `wanted` family）→ `#000000`（等价上游 `packWanted.js:40 card.bottomInfoColor='black'`）

**禁止硬编码** `#f4f4f0`（已废 R12）。

## 触发渲染的 DOM 条件（上游）

`bottomInfoEdited()`（`creator-23.js:5226+`）要求**同时**满足：

1. 4 个 checkbox checked：`#enableCollectorInfo` / `#enableNewCollectorStyle` / `#enableCopyright` / `#enableWebsiteInfo`
2. URL 含 query：`?nfs&wizards&copyright`（NFS / Wizards / 站点行不进 `continue` 分支）
3. DOM input 全部赋值：`#info-{set,language,artist,number,rarity,year}` + `#extra-info`

cardforger 侧不通过 DOM，直接读 `card.infoXxx`；但**驱动上游 fixture 同卡**时必须按上述 3 条 flip checkbox + 赋值 + 调 `setBottomInfoStyle()` + `bottomInfoEdited()` + `drawTextBuffer()` + `drawCard()`，否则截图里 6 段全空。流程详见 [`process/parity-check.md`](../process/parity-check.md)。

## 不允许的偏离

- 不重命名 `drawCollectorInfo` / `drawRichText` 的字段使其偏离上游术语
- 不在 cardforger 侧增设上游没有的字段（如 "subtitle"）
- 不"统一"字号到整数像素（上游用相对小数：0.0143 / 0.0162 / 0.0171 / 0.0172）
- 不为了"好看"调整 collector y 比例（0.9377 / 0.9548 / 0.9719 是上游字面量）

## 受控偏离登记

任何已知偏离须在 `RENDER_PARITY_STATE.md` §3 / §6 写明：差异、上游字面量、cardforger 字面量、理由、解除条件。当前活跃偏离：

- **R2**：split / fuse / aftermath / flip / levelers / conspiracy / colorshifted 等小众 frame 通过 alias 降级 m15，不像素级 1:1
- **R7**：cardforger `h2=2.1rem` / `h3=1.55rem` vs 上游 2.5/2rem；`--font-color: #efefef` vs 上游 `#fff`
- **R10**：storybook frame 字体（souvenir / Aniron）未引入 @font-face
