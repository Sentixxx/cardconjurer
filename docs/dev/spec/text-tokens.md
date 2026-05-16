---
title: 富文本 token 与 import 预处理
type: spec
status: active
summary: drawRichText 支持的 directive 集合 + scryfall.ts normalizeOracleText 的 import 预处理规则——对齐 writeText 与 import 6670–6790
tags: [spec, text, parity]
related:
  - dev/spec/canvas-render
  - dev/standards/pitfalls
---

# 富文本 token 与 import 预处理

## 上游对照点

- 渲染：`creator-23.js:3711+ writeText()`
- import：`creator-23.js:6670–6790`

cardforger 实现：

- 渲染：`src/features/creator/canvas/drawRichText.ts`
- import 预处理：`src/services/scryfall.ts` 的 `normalizeOracleText`

## 渲染 directive 集合

drawRichText 必须解析下列 token（与上游 `writeText` 等价）：

| 类别 | token | 行为 |
|---|---|---|
| mana symbol | `{w}` `{u}` `{b}` `{r}` `{g}` `{c}` `{t}` `{e}` `{q}` `{x}` `{0–20}` `{w/u}` `{2/w}` `{untap}` `{inf}` `{planechase}` 等 | 解析为 mana symbol PNG（diameter 与 layout 见 [`canvas-render.md` §drawCard 流水线](canvas-render.md#drawcard-流水线)） |
| 字体切换 | `{font<name>}` | 切到 [`canvas-render.md` §字体清单](canvas-render.md#字体清单关键反复踩坑)中任一 face |
| 字号相对调整 | `{fontsize±N}` | 当前 fontSize 加 / 减 N |
| flavor 段 | `{flavor}` | 新版：切 `{/indent}{lns}{bar}{lns}{fixtextalign}{i}` + cflavor bar；旧版：`{oldflavor}` 切 `gillsansbolditalic` + `fontsize-20` |
| italic | `{i}` `{/i}` | 切 italic 字体（多用于 reminder text） |
| 卡名引用 | `{cardname}` | 替换为 `card.name` |
| 换行 | `{linebreak}` | 强制换行（不参与 wrap） |
| 水平定位 | `{savex}` `{savex2}` `{loadx}` | save / restore 当前 cursor X |
| 垂直微调 | `{upinline+N}` | 当前行 baseline 上移 N |
| 对齐 | `{align<left/center/right>}` | 切换 textAlign |
| 字距 | `{kerningN}` | 调整字符间距（topLeft 新版 `{rarity}{kerning3}{number}` 用） |
| 缩进 | `{indent}` `{/indent}` | bullet line 缩进控制 |

font fitting：drawRichText 用 binary fit 算字号——递归 `tryFit`，5 次截断兜底 `minScale=0.48`。上游 `writeText` 无下限。**这是已知偏离**：在 ≥5 张 fixture 上验证后视觉无显著差异，保留差异以避免极端长 rule 把 cardforger 字号缩到不可读。

## import 预处理（`normalizeOracleText`）

scryfall API 拉到的 `oracle_text` 必须经过下列等价上游 `creator-23.js:6670–6704` 的链式处理：

| 步骤 | 上游 | cardforger 等价 |
|---|---|---|
| 已含 `{i}` 标记 | 跳过整个 italic 加工 | `if (!/\{i\}/i.test(working))` 短路 |
| 卡名替换 | `replace(card.name, '{cardname}')` | 同 |
| `{Q}` → `{untap}` | `.replace(/{Q}/g, '{untap}')` | 同 |
| `{∞}` → `{inf}` | `.replace(/{∞}/g, '{inf}')` | 同 |
| bullet 缩进 | `.replace(/• /g, '• {indent}')` | 同 |
| 智能引号 | `curlyQuotes(rulesText)` | `curlyQuotes`（9 条 replace 完全照抄） |
| companion 文案重写 | 长串 `(If this card is your chosen companion …)` → `(… as a sorcery.)` | `COMPANION_LONG` / `COMPANION_SHORT` 常量 + replace |
| planar chaos | `Whenever chaos ensues, ` → `{planechase} `（仅 isPlanar） | `normalizeOracleText` isPlanar 分支 |
| reminder text italic | 正则 `(?:\((?:.*?)\)\|[^"\n]+(?= — ))` 包 `{i}…{/i}` | `applyItalicMarkup` 等价正则 |

## italic 豁免列表

下列字串**不**被 `applyItalicMarkup` 包 `{i}…{/i}`：

```
'Boast', 'Cycling', 'Visit', 'Prize',
'I', 'II', 'III', 'IV',
'I, II', 'II, III', 'III, IV',
'I, II, III', 'II, III, IV', 'I, II, III, IV',
'• Khans', '• Dragons', '• Mirran', '• Phyrexian',
'Prototype', 'Companion',
'To solve', 'Solved'
```

匹配语义是 `italicExemptions.includes(a)` —— **精确字串相等**，"Prototype {1}{R}" 这种带 mana 的不在 set 内仍会被包 italic（这是上游行为，不是 bug）。

## 模式开关（尚未在 cardforger UI 暴露）

- `hide-reminder-text`：整段删除 reminder。当前 cardforger 始终视为 `italicize-reminder-text=on`。UI 加该开关时需要 fixture / drawRichText 渲染前 `replace(/ ?{i}\([^\)]+\){\/i}/g, '')`。属 Phase 3 UI 扩展。
- `italicize-reminder-text`：cardforger 当前**总是开启**（import 时已包 `{i}…{/i}`，渲染层无需再开关）。

## fixture 起点

12 张代表性 fixture（用于覆盖各 token 路径）：

```
Lightning Bolt · Counterspell · Llanowar Elves · Hallowed Fountain ·
Atraxa Praetors' Voice · Jace the Mind Sculptor · Urza's Saga ·
Fire // Ice · Bonecrusher Giant · 任一 Phyrexian Praetor ·
Sheoldred the Apocalypse · Birgi God of Storytelling
```

JSON 位于 `public/fixtures/<slug>.json`；通过 `/fixtures/:slug` 路由渲染。
