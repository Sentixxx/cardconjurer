---
title: ADR-0002 canvas-rendering-region-tree
type: adr
status: proposed
summary: 把 drawCard 重构为「region tree 模板 + resolver + walker」三层管线；模板像素一等公民；自研不引库；本 ADR 暂处 proposed 等 6 份 owner 文档承接契约/组合/规则后再升级 accepted
tags: [adr, rendering, template]
related:
  - dev/architecture/overview
  - dev/spec/canvas-render
  - dev/standards/coding
  - dev/standards/pitfalls
supersedes: []
superseded_by: []
decided_on: 2026-05-16
---

# ADR-0002 canvas-rendering-region-tree

> **状态说明**：本 ADR 当前 `proposed`。决策内容已收敛，但按 [`doc-ownership.md`](../standards/doc-ownership.md)，schema 字段定义、模块组合接口、validator 规则本体、CI 操作步骤、devtools 实现路径都不属于 ADR owner——必须先建 6 份 owner 文档（spec×2 / architecture / standards / testing / process）承接，本 ADR 再升级 `accepted`。本文件保留**决策级陈述 + link**，具体本体见各 owner 文档（待建清单见「后果 / 触发新建文档」段）。

## 背景

cardforger 渲染管线当前形态（详 [`architecture/overview.md`](../architecture/overview.md)、`src/features/creator/canvas/drawCard.ts`、`src/services/framePresets.ts`）：

- `drawCard.ts` 1095 行单一过程函数：region 计算、frame layer 合成、文字、特殊版式（saga / planeswalker）、collector info、custom text、guidelines 全部串行写在里面。
- `framePresets.ts` 1756 行：30+ 个 `XXX_LAYOUT_PRESET` 常量散布；每个 preset 声明 9 个 `*Bounds` 字段（art / mana / title / type / rules / pt / loyalty / setSymbol / watermark）+ adventure 四个 + 可见性开关。
- `CardData` 类型上重复声明 9 个 `*Bounds` 字段做 per-card 覆盖；`face2: CardFace` 提供双面卡，face1（主 face）字段铺在 `CardData` 顶层，二者共享同名 `*Bounds` 字段——双面 override 路径目前模糊。
- 特殊版式（planeswalker / saga / adventure）在 drawCard 内 if-else 各开分支；saga 章节高度走 `sagaSettings.abilityHeights[]`、planeswalker 走 `planeswalkerSettings.abilityHeights[]`——同性质"子 region 列表"有三套表达。
- collector info 6 段（midLeft / topLeft / bottomLeft / wizards / bottomRight / note）硬编码在 `drawCollectorInfo()`，常量 `0.0647` / `0.9354` 等；planechase 另起 `drawPlanechaseCollectorInfo`。
- 帧层 mask 合成走 `blendFrameLayerPreservingAlpha`（`getImageData` + 像素循环 + `putImageData`），每次重绘搬运 ~12 MB 像素数据。

终极目标是所见即所得（WYSIWYG）、编辑时渲染。要在上述结构里加 hit-test / in-place 文本编辑 / resize handle 几乎必然要先把渲染逻辑做扁、把 region 列表显式化。同时 [`docs/dev/standards/coding.md` §顶层依赖闸](../standards/coding.md#顶层依赖闸) 限制顶层 `dependencies` 只允许 `react` / `react-dom` / `wouter`，「上游用 vanilla JS 能做的事，cardforger 加包做」不合格。

## 选项

### 选项 A — 继续命令式 drawCard，按需局部重构

- 描述：保留 drawCard 单文件结构，按需加 layer cache / `requestAnimationFrame` 节流 / contentEditable 浮层。
- 优点：迁移代价最低；可保持当前像素 parity 不动；不引入新概念。
- 缺点：WYSIWYG 编辑需要 hit-test 反向 walk region 列表，但 region 列表当前是 drawCard 局部变量，外部不可见；要让外部可见就得部分重构成 region 列表；半路重构留下混合形态，比一次性更乱。30+ frame 变体的位置关系仍然要靠 spread 继承平铺，新增 frame 仍然需要重写 9 个 bounds。

### 选项 B — 引入 react-konva / fabric.js / Pixi 等 canvas scene graph 库

- 描述：用现成 scene graph 库承担 region tree 运行时 + 内置 transformer / hit-test。
- 优点：scene graph、hit-test、resize handle、layer cache 都是开箱即用。
- 缺点：**直接违反三依赖闸**——上游 conjurer 用 vanilla canvas 把所有事情做完了，cardforger 加 react-konva (~80 KB gzipped) 不通过 [`docs/dev/standards/coding.md` §顶层依赖闸](../standards/coding.md#顶层依赖闸)。另：mask 合成（`destination-in` 合 `m15MaskPinline.png`）和 rich text directive（`{i}` / `{W}` / `{fontcolor#...}`）这两块本来就要绕过库 API 退回 `ctx` 原生（`sceneFunc` 或自定义 Shape），"现成"的部分享受不到。

### 选项 C — SVG 模板 + 浏览器原生渲染

- 描述：把 region tree 编码成 SVG 文档，浏览器原生渲染 + `<foreignObject>` 嵌 HTML 处理文本换行。
- 优点：原生可声明，零新依赖。
- 缺点：MTG frame 本质是 raster PNG（贴图、纹理、color overlay 都是位图），SVG 矢量优势用不上；mask 合成要拆 `<mask>` + `<filter>` + 多层 `<g>`，比 vanilla canvas `globalCompositeOperation` 长 3 倍且跨浏览器一致性差；`<text>` 不支持自动换行，要么 `<tspan>` 手工断行（要先在 JS 测宽度——绕回 Canvas）要么 `<foreignObject>` 嵌 HTML（字体回退不一致）。raster-heavy 场景是负优化。

### 选项 D — Jinja 风格文本模板 + 数据注入

- 描述：用 nunjucks / 类似引擎渲染 SVG / HTML 字符串。
- 优点：声明式作者体验。
- 缺点：方向错——Jinja 是"数据 → 字符串"一次性文本生成器，编辑器需要双向（画布拖动写回模板），文本逆向 parse 几乎做不了；且 nunjucks 是新增 runtime dep，违三依赖闸。

### 选项 E — 自研 region tree 模板 + canvas walker

- 描述：模板是声明式 schema（PoC 阶段 `framePresets.ts` 内存 derive，未来 JSON 落盘）；resolver 一次性求值出绝对像素 tree；walker 按 layer 顺序在 vanilla canvas 上绘；编辑器只读 resolved tree。
- 优点：零新依赖（通过三依赖闸）；mask 合成、rich text directive 这些重头戏继续走 vanilla canvas 主场；layer cache / hit-test / resize handle 自研可控；字段权威由 cardforger 自身 spec 承载（[`ADR-0003`](0003-upstream-as-output-reference.md) 决策后不再以上游为锚）。
- 缺点：需要自研 schema 验证器、表达式求值器、L1/L2/L3 三层契约。是单点大重构（虽然可以 m15Regular 一个 frame 起步逐步并存）。模块预算见后续 [`process/template-poc.md`](../process/template-poc.md)（待建）。

## 决策

**选择 E**——自研 region tree 模板 + canvas walker。

落地分三层（L1 / L2 / L3），耦合方向钉死：

```
L1: Template（静态描述，PoC 内存 derive）
     ↓ resolve(template, card, activeFace)
L2: ResolvedRegionTree（绝对像素 + binding 求值结果 + interaction caps）
     ↓
L3: Canvas walker + Editor（不知道 L1 存在）
```

下列**决策级陈述**说明"采用什么方向"，**不**复述字段表 / 接口签名 / 规则本体——这些是各 owner 文档的事。每条陈述末标注本体承载位置。

- **图层三档分类**：layer 强类型分 `art / frame / text` 三档，跨档顺序固定不可调，档内可调。源自 MTG 印刷工艺约束（art 垫底 / frame 镂空透出 art / text 写在 frame 上）。本体见 [`spec/template-schema.md`](../spec/template-schema.md)（待建）+ [`standards/template-validator.md`](../standards/template-validator.md)（待建）。
- **数据绑定与可见性分离**：region 节点的"数据从哪里读"由 `binding` 表达；"在哪里出现"由 `visibleWhen` 表达；"继承期是否结构删除"由 `$merge` 表达——三种语义不混。本体见 [`spec/template-schema.md`](../spec/template-schema.md)（待建）。
- **像素一等公民**：rect 字段允许纯数字字面量、字符串表达式、混合数组三种形态；约束式表达仅作为可选语法糖。
- **表达式两套**：
  - **NumExpr**（几何算术，开放结构 / 任意 binop 组合）走字符串 + AST 白名单。
  - **CondExpr**（显隐条件，封闭谓词白名单）走结构化 AST，不走字符串。
  - 两套均禁函数调用 / 属性链 / `eval` / `Function`。本体见 [`spec/template-schema.md`](../spec/template-schema.md)（待建）。
- **继承 merge 字段级策略**：对象默认 deep-merge；数组按字段类型走 byId / byKey / replace 三类，禁默认 concat；显式 `$merge: "replace"` / `$insertAfter` / `$insertBefore` 表达插入位置。本体见 [`spec/template-schema.md`](../spec/template-schema.md)（待建）。
- **per-card override 收口为 face-level**：`CardFace.regionOverrides: Record<RegionPath, PartialRegion>` 取代当前散在 `CardData` 和 `CardFace` 两侧的 9 个并排 `*Bounds`。所有 override（包括 card-scope binding 的 region）一律挂在 face 下；运行时 resolver 通过 binding.scope 把 card-level 数据 路回 card 取值。理由：face2 切换时 override 视角应跟随当前 face，不污染另一 face。
- **face identity 抽象沿用 A/B**：resolver 输入 `activeFace: "A" | "B"`，不为 PoC 新增 `side: "primary" | "secondary" | "back"` 枚举（沿用 [`CreatorPage`](../../../src/pages/CreatorPage.tsx) 的 `activeFace` state）；CondExpr 谓词 `isFaceSide(activeFace, "A" | "B")`。如未来需要更细的 side 语义（token back / showcase back / transform back 等），由后续 ADR 单独决策。
- **L2 contract face 表达**：单画布渲染一次 = 渲染一个 active face；split / aftermath / transform-MDFC 等多 face 联合视图由 L3（导出 / 双面对照预览）调用 resolver 两次完成，L2 自身仍只承担单 face。
- **资源层用户层与模板静态层合并**：模板 base layers（class=frame）+ face-level 用户层（`face.frameLayers` / `face.customTextLayers`）由 resolver 在 L1→L2 阶段合并到统一 `ResolvedLayer[]`；用户层运行时挂在 face，不进模板源。
- **mask / blend 归 walker**：composite layouter **只**输出几何 child regions，不接 `ctx`；mask / `globalCompositeOperation` / 像素隔离合成由 walker 配合 layer 的 `compositingScope` 完成；frameLayer mask 合成走 custom paint 白名单。本体见 [`architecture/render-pipeline.md`](../architecture/render-pipeline.md)（待建）。
- **walker 入口默认透明**：永远 `ctx.clearRect`；不画 background fill；空模板输出全透明 PNG。preview 用的暗背景由 `Canvas.tsx` 的 CSS `style.background` 提供，不是 walker 责任。
- **模板 owner 阶段化**：
  - **PoC 阶段**：`framePresets.ts` 仍是 owner；region tree 由 `getRegionTemplate(frameVersionId)` 在内存里 derive；**不生成 JSON 文件**；region tree 单向 read（WYSIWYG 编辑只写 `face.regionOverrides`，不修改模板本身）。
  - **切换阶段**：JSON 落盘成 owner，TS 收为兼容 adapter；validator 断言同一 frame id 不能两边都定义。
  - **移除阶段**：删 TS adapter，保留 `getFrameLayoutPreset` 函数签名兼容外部 API。
- **卡型 coverage**：PoC 只承诺 m15Regular。后续按机制分 4 档 phase（纯 region / 需要 composite layouter / 需要 custom paint / 需要横版旋转多 face 联合）。具体分档表归 [`process/template-poc.md`](../process/template-poc.md)（待建）。
- **Pixel diff CI**：采用 repo 内冻结 golden + 离线 chrome-devtools-mcp 截图，不动态启动上游 conjurer——符合 [`pitfalls.md` §上游基线只读](../standards/pitfalls.md#上游基线只读)。具体目录结构、meta 字段、CI 行为、更新流程归 [`testing/template-pixel-diff.md`](../testing/template-pixel-diff.md)（待建）+ [`process/template-poc.md`](../process/template-poc.md)（待建）。
- **Devtools dev-only**：Frame Ruler / Overlay 调试视图需要存在（让模板作者批量量像素 + 调试 resolved 视图），但零新依赖、prod 不出现。具体路径、DEV gate、文件 API 选择归 [`architecture/render-pipeline.md`](../architecture/render-pipeline.md)（待建）+ [`process/template-poc.md`](../process/template-poc.md)（待建）。
- **Validator 自研**：不引 `zod`（违三依赖闸）；具体校验规则本体归 [`standards/template-validator.md`](../standards/template-validator.md)（待建）。

## 理由

为什么 E 比其他更合适，挂钩到 cardforger 的具体约束：

1. **三依赖闸是硬约束**（[CLAUDE.md §核心原则 3](../../../CLAUDE.md)）——B / D 直接被排除；C 不加包但 raster mask 合成场景仍是负优化，技术理由独立成立。
2. **vanilla canvas 工程惯性**（原写作"上游字面量对齐路径不变"——已被 [`ADR-0003`](0003-upstream-as-output-reference.md) 撤销 parity 论据，此条降级为非 load-bearing；保留是因为 vanilla canvas 仍是 mask 合成（`globalCompositeOperation`）/ rich-text directive / 高分辨率位图导出的工程主场，选 E 在该栈上落地的边际成本最低；frame mask / rich text directive / collector info 6 段的实现可继续沿用当前工程惯性，但**不再以"对齐上游某一行"为论据**）。
3. **WYSIWYG 编辑器和模板格式必须解耦**——L1 不进 React 组件 props 这一约束（L3 只读 L2）切断了"编辑器 UI 改一次、模板 schema 改一次"的双向耦合，未来 schema 演化不会回 head-of-line 阻塞 UI 改动。
4. **图层分类的物理对应**——art < frame < text 是 MTG 30 年印刷工艺约定（art 垫底，frame PNG 镂空透出 art，text 写在 frame 提供的 bar 上），不是 cardforger 的发明；把它编码进 schema 让 validator 强制比靠注释提示稳定得多。
5. **NumExpr 字符串 vs CondExpr 结构化的不对称**——表面不一致，但根源是表达式**结构开放性**的差异：NumExpr 是开放结构（任意 binop / region ref / var ref 组合），字符串紧凑且符合数学直觉（`art.bottom + 60`），改写成结构化 AST `{ op: "add", args: [{ ref: "art.bottom" }, 60] }` 在 TS derive 里需要长链 builder helper，调试时也要在 AST 里跳 hop；CondExpr 是封闭谓词白名单（`hasSupertype / isFaceSide / ...`），本质已是 AST，序列化成字符串再 parse 回来是无意义工作。NumExpr 调试问题用 parser 单测 + 错误定位（行列号）+ 友好报错信息兜底（见 backlog）。
5. **零新依赖**——E 是唯一能在不动 `RENDER_PARITY_STATE.md` §5 的前提下完成的方案。新建 spec/architecture/standards 文档不算依赖扩容。
6. **可分阶段并存**——PoC 阶段 drawCard.ts 内加 `renderRegionTree(ctx, tree)` 分支，按 frame id 切到新路径只承接 m15Regular，老分支并存；像素 diff 验证通过后逐 frame 推开。回滚成本 = 删一个 if 分支。

## 后果

### 正向后果

- drawCard.ts 从 1095 行命令式过程函数拆为按 walker / resolver / region renderers / composite layouter / validator / parser 分文件实现，单元可测，逐项替换。具体模块预算与拆分见 [`process/template-poc.md`](../process/template-poc.md)（待建）。
- `CardFace` 9 个并排 `*Bounds` 收口为单一 `regionOverrides`，per-face 覆盖路径只剩一条；face2 切换时 override 视角跟随 face。
- 加 hit-test / in-place 文本编辑 / resize handle 不再绕模板格式——直接读 L2 的 `ResolvedRegionTree`。
- 帧层 mask 合成隔离明示（`compositingScope: "isolated"`），后续可以把"该 layer 缓存到 offscreen canvas、内容不变则跳过"作为单独优化展开，不再需要每次重绘搬 12 MB 像素。
- 透明输出（walker 默认 `clearRect` + 不画 background fill）顺手修了"导出 PNG 总带 `#1d1d1d` 暗底无法透明"的现有问题。

### 负向后果 / 接受的代价

- 现有 30+ frame preset 不能一次性迁完——PoC 只承诺 m15Regular；其它 frame 在 Phase 2/3/4 按 coverage matrix 推进；迁移期间 drawCard 老分支并存约半年。
- 新增 region renderer / composite layouter 必须按 walker 接口编写（不能 `ctx.translate`），现有 `drawSaga` / `drawPlaneswalkerAbilities` / `drawCollectorInfo` 等需要按新接口重写。
- 6 份 owner 文档（清单见下段）建立前 ADR 维持 `proposed` 状态，PoC 实装等 owner 文档承接契约后才能启动。
- backlog 项作为已知债务，由后续工作承接。

### 触发新建文档

落实本决策需要建以下 owner 文档（不在本 ADR 内复述本体，留给 owner 各自承载）：

- `docs/dev/spec/template-schema.md` —— region template L1 字段定义、`kind` 枚举、layer class 强制语义、`binding` / `visibleWhen` / `$merge` 三分立、表达式语法、mergePolicy 表
- `docs/dev/spec/resolved-region-tree.md` —— L2 数据结构契约（`ResolvedRegion` / `ResolvedLayer` 字段集）
- `docs/dev/architecture/render-pipeline.md` —— L1 → L2 → L3 三层组合，walker / resolver / region renderer / composite layouter 接口签名与边界硬约束；Frame Ruler / Overlay devtools 路径与 DEV gate 方式
- `docs/dev/standards/template-validator.md` —— validator 校验规则本体（discriminated by kind、layer class 顺序、mergePolicy 表、表达式白名单）
- `docs/dev/testing/template-pixel-diff.md` —— golden 目录结构、meta 字段、CI 行为、阈值、上游对照流程
- `docs/dev/process/template-poc.md` —— PoC 实装顺序、feature flag 切换、像素 diff 验证流程、模块预算、Frame Ruler 最低 spec、saved-card migration 验证 checklist

按 [`standards/doc-ownership.md`](../standards/doc-ownership.md) 单选规则归位。本 ADR 升级到 `accepted` 必须以上述 6 份 owner 文档均落 `draft` 以上为前提（6 份口径在 summary / 状态说明 / 负向后果 / 触发更新现有文档段保持一致）。

### Saved-card Migration 范围

PoC 启动时必须实现的 migration（具体映射规则与 fixture 验证归 [`process/template-poc.md`](../process/template-poc.md) checklist 段）：

**版本判别**——`CardData` 加 `schemaVersion?: number` 字段。未设视为 v0（旧扁平 `*Bounds`）；新 schema 都标 v1。`portable bundle`（`saved-cards.cardconjurer` 导出 JSON 顶层的 `version` 字段）只标导出包格式，不等于单张 saved-card schema，二者**独立**。

**migration 函数签名**：

```ts
// 输入可能是 v0 或 v1；输出统一 v1；幂等（v1 输入直接返回不再处理）
function migrateCardData(raw: unknown): CardData;
```

**字段映射**：

- 主 face 9 个 `*Bounds`（artBounds / manaBounds / titleBounds / typeBounds / rulesBounds / powerToughnessBounds / loyaltyBounds / setSymbolBounds / watermarkBounds）→ `face.regionOverrides[<path>].layout.rect`
- `face2.*Bounds`（同 9 个）→ `face2.regionOverrides[<path>].layout.rect`
- `customTextLayers[].bounds` → `regionOverrides` 内 custom-text group children（path 含数组 index）
- `frameLayers[].bounds` → `regionOverrides` 内 frame-layer group children（path 含数组 index）
- art transform 标量 `artOffsetX / artOffsetY / artZoom / artRotation` → `face.regionOverrides["art"].transform`
- set symbol 标量 `setSymbolOffsetX / setSymbolOffsetY / setSymbolScale` → `face.regionOverrides["setSymbol"].transform`
- watermark 标量 `watermarkOffsetX / watermarkOffsetY / watermarkScale` → `face.regionOverrides["watermark"].transform`

**触发点**（基于当前实际 API，详 `src/services/storage.ts` / `src/hooks/useSavedCards.ts` / `src/hooks/useCardData.ts`）：

- `storage.readCardEntry(key)` 内部：读完 raw 立即跑 `migrateCardData(raw)` 再返回——单点 hot-path，hooks 上层永远看到 v1
- `useSavedCards.importJson` 内部：解析 portable bundle 后对每条 entry 跑 `migrateCardData`
- `useCardData.setCard` 外部调用方（如 `CreatorPage` 通过 `?key=` 查询参数加载、未来导入 raw JSON）负责 migrate；hook 内部假设入参已是 v1
- 写入端 `storage.writeCardEntry` 总是写 v1（含 `schemaVersion: 1`），旧字段一律 omit

**防双写**：drawCard 不直读旧 `*Bounds`；ESLint 自定义规则禁止 `src/` 内其它代码引用旧 `*Bounds`。

### 触发更新现有文档

- [`RENDER_PARITY_STATE.md`](../../../RENDER_PARITY_STATE.md) §4 登记当前 PoC BLOCKED 状态（等 ADR-0002 升级 accepted + 6 份 owner 文档建立），§5 **不动**（无新增 runtime dependency）。
- [`architecture/overview.md`](../architecture/overview.md) 在 Canvas pipeline 段补一句"PoC 路径走 region tree walker（详 [`architecture/render-pipeline.md`](../architecture/render-pipeline.md)）"。
- [`spec/canvas-render.md`](../spec/canvas-render.md) 字号 / 字体 / token 表保持不变；增加一行链向 `template-schema.md` 说明字段最终承载位置。

### Backlog

- **B6**：renderer / resolver / parser 单元测试策略——验证 walker 不 leak `ctx.save/restore` 配对、resolver 输出 idempotent。测试本体归 [`testing/template-pixel-diff.md`](../testing/template-pixel-diff.md)（待建）测试段或独立测试文档。
- parser / validator 的 diagnostic 必须包含 **template path**（如 `regions.title.layout.rect.x`）+ 行列号——inline 字符串的 line/column 单独不够。承接 owner：[`standards/template-validator.md`](../standards/template-validator.md)（待建）。
- "PoC 任一 fixture 需要绕过 schema 直接画 canvas" 复审条件的判定方式——lint 限制 `CanvasRenderingContext2D` 只能出现在 walker / custom paint 白名单目录 + PR checklist 要求登记。承接 owner：[`process/template-poc.md`](../process/template-poc.md)（待建）。
- "总行数突破 baseline 2153 行" 复审条件的 baseline 更新规则——本 ADR `accepted` 后 baseline 冻结；`accepted` 前若 `drawCard.ts` / `drawSaga.ts` / `drawPlaneswalker.ts` / `drawRichText.ts` 四个旧文件实质变动，随同 PR 更新 baseline。承接 owner：[`process/template-poc.md`](../process/template-poc.md)（待建）。
- 其它 backlog（renderer 接口静态化 / pixel diff 阈值校准 / NumExpr 字符串 authoring sugar / `hasKeyword` 等扩展谓词 / validator 禁止未知结构性 array 实现 / Frame Ruler 最低 spec / saved-card migration 验证）由 [`process/template-poc.md`](../process/template-poc.md)（待建）的 PoC checklist 承接，不在 ADR 内枚举。

## 复审条件

满足下列任一事实出现时本决策应重新评估：

- **依赖闸扩容**：顶层运行时依赖突破 3 个，触发依赖闸扩容评估时，需要重新比较"自研 + 维护成本"与"引一个 scene graph 库"的现实成本。
- **上游栈切换**：cardconjurer 改用 WebGL / OffscreenCanvas / 全新 rendering primitive（`creator-23.js` rendering 部分被替换）；当前决策建立在"上游 vanilla Canvas 2D"的前提上。
- **PoC 早期表达力失败**：PoC m15Regular 任一 fixture 需要绕过 schema 直接画 canvas（绕过 = schema 表达力不足的早期信号），决策必须重审而不是默默加 escape hatch。
- **Escape hatch 滥用**：custom paint 白名单出现第三个条目（当前为 `frameLayerMaskComposite` / `watermarkGradientTint` 两条）——说明 region kind 抽象表达不下复杂渲染。
- **半年内破坏性 schema 迁移**：ADR 升级到 accepted 后半年内 `spec/template-schema.md` 出现破坏性字段迁移，说明第一版 schema 漏关键场景，决策的「decisions 已收敛」前提不成立。
- **总行数突破 baseline**：`src/features/creator/render-region-tree/**` 目录（非测试源码）总行数超过当前 `drawCard.ts` + `drawSaga.ts` + `drawPlaneswalker.ts` + `drawRichText.ts` 总和（2153 行）——说明抽象未带来净简化，要考虑回退选项 A。
- **L1/L2/L3 耦合被破坏**：WYSIWYG 编辑场景下检测到模板 schema 信息泄漏进 React 组件 props，需要立刻补审。
- **Pixel diff 阈值频繁误报**：CI golden 比对一周内 ≥ 3 次非语义变化触发误报，需要重审 golden 维护流程是否成立（具体阈值定义见 [`testing/template-pixel-diff.md`](../testing/template-pixel-diff.md)）。

---

**附**：本决策由 7 轮主对话设计讨论 + 3 轮 GAN 模式对抗 review 收敛得出（codex 作为独立 reviewer，22/22 主 issue 全 accept 修复，含 1 处 developer accept-flip：CondExpr 表达式形式由字符串撤回改为结构化 AST）。后续一轮 GAN review 又发现 ADR 越权 + face2 模型缺失等 18 项，导致状态由 `accepted` 回退至 `proposed`，依赖 owner 文档承接契约后再升级。完整 audit trail 不入 repo（属临时 session 产物），关键收敛点已内化进本 ADR 的「决策」与「理由」段。
