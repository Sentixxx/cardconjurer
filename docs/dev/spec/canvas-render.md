---
title: Canvas 渲染契约
type: spec
status: active
summary: drawCard 流水线的字段表——尺寸、字体、字号、collector 6 段、颜色受控；字段权威由本文件承载
tags: [spec, canvas, parity]
related:
  - dev/architecture/overview
  - dev/spec/text-tokens
  - dev/standards/pitfalls
  - dev/testing/strategy
---

# Canvas 渲染契约

## 上游产物对照参考

> [`adr/0003-upstream-as-output-reference.md`](../adr/0003-upstream-as-output-reference.md) 生效后，上游 conjurer 已从「字面量 ground truth」降级为「产物验证参考」——下表角色相应改写。字段命名 / 字号 / token / 颜色规则的权威由本文件承载，**不以上游 HEAD 为准**。

| 路径 | 状态 | 角色 |
|---|---|---|
| `/workspace/cardconjurer/js/creator-23.js` | 独立 git 仓，只读 | 产物对照参考（同卡 fixture 视觉合理性锚点）；字段冲突时以本文件为准 |
| `src/legacy-app/` | 仓内冻结快照 | 历史快照，便携翻阅；非权威 |
| `cardforger/UPSTREAM_COMMIT` | 文本指针 | 记录上次对照流程指向的上游 commit（已无 "对齐到哪个 commit" 含义）|

cardforger 侧字段允许与上游同名字段不一致，**前提是本文件已显式登记当前值**。在 [`process/parity-check.md`](../process/parity-check.md) 流程下：**字段值差异本身不构成 reviewer 拒稿条件**；但产物明显超出 MTG 卡面视觉合理范围（错版 / 重叠 / 不可读 / 错位）可拒稿或要求调查。具体判据归 [`testing/strategy.md`](../testing/strategy.md) 或后续 GOAL.md 重写承接。

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

每一步的字号 / 字体 / 对齐方式以下面各表为权威；历史溯源可参考上游 `creator-23.js` 对应函数（见各表"历史溯源"列）。cardforger 侧实现位置见 `RENDER_PARITY_STATE.md` §2 表格。

## 字体清单（关键，反复踩坑）

| 字体名 | 用途 | 历史溯源（参考） |
|---|---|---|
| `gothammedium` | collector 主体（midLeft / topLeft / bottomLeft）| `setBottomInfoStyle()` 主字体 |
| `belerenbsc` | artist 段内联切换 + brush icon `￮` | `setBottomInfoStyle()` `{fontbelerenbsc}` token |
| `mplantin` | wizards 行 + 站点行 + rules / flavor | `setBottomInfoStyle()` wizards / bottomRight |
| `mplantin-i` | flavor italic + reminder text italic | `writeText` 的 `{i}…{/i}` 解析 |
| `gillsansbolditalic` | 旧版 `{oldflavor}` | `writeText` 旧版分支 |

**禁错记忆**：collector 主字体是 `gothammedium`，**不是** `goudymedieval`。

## collector 6 段

本节定义 collector 6 段当前规定（cardforger 权威值）。历史溯源：上游 `setBottomInfoStyle` (`creator-23.js:245–270`)。`drawCollectorInfo` 输出 6 个 text object：

| 段 | 内容（节选） | 字体 | 相对字号 | 对齐 | y 比例 |
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

- 不"统一"字号到整数像素（cardforger 采用相对小数：0.0143 / 0.0162 / 0.0171 / 0.0172）
- 不为了"好看"调整 collector y 比例（0.9377 / 0.9548 / 0.9719 是本 spec 当前规定值，改动需先动 spec）
- 不重命名 `drawCollectorInfo` / `drawRichText` 的字段保持项目内一致性（重命名要走 ADR）
- 新增渲染字段必须先在本 spec（或未来的 `spec/template-schema.md`）登记，再落代码

## 受控偏离登记

任何已知偏离须在 `RENDER_PARITY_STATE.md` §3 / §6 写明：差异、cardforger 当前值、理由、解除条件。**当前活跃偏离**（[`ADR-0003`](../adr/0003-upstream-as-output-reference.md) 生效后，"偏离"语义已从"偏离上游"转为"偏离本 spec 早期 baseline 或仍待登记的字段"）：

- **R2**：split / fuse / aftermath / flip / levelers / conspiracy / colorshifted 等小众 frame 通过 alias 降级 m15，不像素级 1:1
- **R7**：cardforger `h2=2.1rem` / `h3=1.55rem`；`--font-color: #efefef`（早期 baseline 残留，未登记成正式 spec 值）
- **R10**：storybook frame 字体（souvenir / Aniron）未引入 @font-face
