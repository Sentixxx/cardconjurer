---
title: ADR-0004 svg-rendering-stack-with-satori
type: adr
status: proposed
summary: 渲染基底由 vanilla canvas 切换到纯 SVG；外层 SVG（含 `<mask>` `<filter>` `<clipPath>`）React 手写，文字 region 经 Satori（HTML/CSS subset → SVG `<path>`）渲染；canvas 仅作 PNG 导出临时画板；三依赖闸扩容收纳 satori 及其传递依赖；本 ADR 暂处 proposed，等 6 份 owner 文档承接契约 / 组合 / 字体 / 验证 / 流程后再升级 accepted
tags: [adr, rendering, svg, satori, dependency-gate]
related:
  - dev/adr/0002-canvas-rendering-region-tree
  - dev/adr/0003-upstream-as-output-reference
  - dev/architecture/overview
  - dev/standards/coding
  - dev/standards/pitfalls
supersedes: [adr/0002-canvas-rendering-region-tree]
superseded_by: []
decided_on: 2026-05-16
---

# ADR-0004 svg-rendering-stack-with-satori

> **状态说明**：本 ADR 当前 `proposed`。决策方向已收敛，但按 [`doc-ownership.md`](../standards/doc-ownership.md)，JSX 模板组件契约、外层 SVG 组合接口、字体加载契约、Satori CSS subset 准入规则、SVG 渲染验证策略、canvas 退场流程都不属于 ADR owner——必须先建 6 份 owner 文档（spec×2 / architecture / standards / testing / process）承接，本 ADR 再升级 `accepted`。本文件保留**决策级陈述 + link**，具体本体见各 owner 文档（待建清单见「后果 / 触发新建文档」段）。

## 背景

cardforger 渲染管线当前形态（详 [`architecture/overview.md`](../architecture/overview.md) + `src/features/creator/canvas/`）：

- `drawCard.ts` 1095 行命令式过程函数，串行处理 region 计算、frame layer 合成、文字、特殊版式、collector、watermark、guidelines。
- `drawRichText.ts` 768 行手写 mini 排版引擎：自己 tokenize、自己 `measureText` 算 wrap、自己 5 次 binary fit 算字号、自己处理 italic/bold/color/outline/shadow/offset/align/divider、自己把 inline mana symbol 塞进 text 流算 baseline。这是 canvas 2D API 只给 `measureText + fillText` 的必然结果——上游 `writeText` 也是同样 3711+ 行规模。
- `drawSaga.ts` 94 行 / `drawPlaneswalker.ts` 196 行 / collector 6 段 ~200 行：同性质"text region 内排版"问题在三种特殊版式中各自重复。
- `blendFrameLayerPreservingAlpha`：`getImageData` + 像素循环 + `putImageData`，每次重绘搬运 ~12 MB 像素数据做 frame layer mask 合成。
- 终极目标是 WYSIWYG 编辑（在卡面上直接点选文字 / 拖动 region），但 canvas 上做 hit-test 需要逆向遍历 region 列表，而 region 列表当前是 drawCard 局部变量、外部不可见。

ADR-0003 已经把上游 conjurer 从「字面量 ground truth」降级为「产物验证参考」——cardforger 渲染字段不再以 `creator-23.js` HEAD 为权威。这解除了"必须用 vanilla canvas 因为要字面量复刻 writeText"的工程惯性约束，渲染栈可重新选型。ADR-0003 §决策第三条明确把"渲染栈本身的取舍另起 ADR-0004 承载"——本 ADR 即承接。

ADR-0002 选项 E（自研 region tree + L1/L2/L3 walker + 自研 schema validator）在 canvas 基底前提下成立——L1/L2/L3 walker 接口、`compositingScope`、NumExpr/CondExpr、custom paint 白名单等决策点都建立在"vanilla canvas + 自研模板编译"路径上。换基底到 SVG 后这些决策点全部失效，本 ADR 取代 ADR-0002。

需要决策的是：cardforger 渲染基底是什么？文字排版能力从哪里来？

## 选项

### 选项 A — 保留 canvas，自研 inline layout engine

- 描述：把 `drawRichText.ts` 拆成 `layout(tokens) → Line[]` + `paint(ctx, lines)` 两层；layout 阶段无副作用、可测、可复用给 hit-test；保留 canvas 基底其它不动。
- 优点：零新依赖（通过 [`standards/coding.md` §顶层依赖闸](../standards/coding.md#顶层依赖闸)）；像素 parity 自洽；单一渲染路径无跨浏览器风险。
- 缺点：自研 inline formatting context 不轻松（baseline / leading / kerning / softbreak / hardbreak / bidirectional / 多字体内联切换 / inline image baseline 全部要写）；WYSIWYG 不免费——cursor / selection / IME 中文输入仍要自己在 canvas 上画；本质是"重写一遍 drawRichText"，工作量与省下来的相当。

### 选项 B — Hybrid：canvas 渲染 + HTML overlay 编辑

- 描述：canvas 不动；编辑模式下叠一层 absolute HTML overlay（contentEditable），用浏览器 CSS 排版做 WYSIWYG；commit 时写回 token AST，canvas 重绘。
- 优点：保留所有现有 canvas 资产、保留像素 parity；零新依赖；WYSIWYG 编辑体验免费。
- 缺点：HTML 排版 vs canvas 排版不可能 1:1，commit 时会有 1-2 px 视觉跳变；维护两套渲染路径（编辑用 HTML，渲染用 canvas），token AST → CSS 映射 + token AST → ctx 调用要双份维护；canvas drawRichText 768 行**仍然要保留**（编辑提交后画的是 canvas），痛点未消。

### 选项 C — 完全弃 canvas，转纯 SVG，文字手写 `<text>` `<tspan>`

- 描述：整张卡渲染成 SVG；外层用 React 手写 `<svg>` 含 `<image>` / `<mask>` / `<filter>`；文字 region 也用 React 手写 `<text>` `<tspan>`。
- 优点：mask / filter 是 SVG 一等公民，比 `globalCompositeOperation` 声明式 5 倍；矢量导出免费；DOM 可挂 click handler，WYSIWYG 友好。
- 缺点：**SVG `<text>` 不支持自动 wrap**——必须自己写 measure + 断行（回到 drawRichText 60% 工作量）；SVG → PNG 时浏览器需要解析 `@font-face`，Safari/WebKit 对内嵌 SVG 字体加载有历史 bug（外部 URL 因 CORS 屏蔽、data URL 字体在部分版本不生效）；DOM 节点爆炸（200-500/卡）gallery 场景需要降级 raster 缓存。本质是"换基底没解决文字排版痛点"。

### 选项 D — HTML/CSS 整张卡，html2canvas / dom-to-image 导出

- 描述：用 React + HTML/CSS 渲染整张卡（包括 frame，用 `<img>` + CSS `mask-image`）；导出 PNG 用 html2canvas 或 dom-to-image。
- 优点：开发体验最佳；HTML/CSS 排版能力完整；WYSIWYG 天然 DOM。
- 缺点：**WebKit 否决**——html2canvas / dom-to-image / 浏览器把 HTML 转 PNG 在 Safari/WebKit 上常年踩字体加载、tainted canvas、CSS filter 兼容性坑，issue 列表最长。导出 PNG 是 cardforger 核心 use case，不能依赖浏览器把 HTML 转图这条不可靠链路。

### 选项 E — 纯 SVG 渲染基底 + Satori 跑文字层

- 描述：渲染基底切到纯 SVG。外层 `<svg>` 由 React 手写（含 `<defs>` / `<mask>` / `<filter>` / `<clipPath>` / `<image>`）。文字 region（rules / title / type / collector / saga chapter / planeswalker abilities / PT / loyalty）用 JSX (HTML/CSS subset) 写组件，经 [Satori](https://github.com/vercel/satori) 编译为 SVG fragment 后嵌入 outer SVG（通过 `dangerouslySetInnerHTML` 或 React inline SVG node）。canvas 完全退场，仅作为 PNG 导出时把 SVG dataURL → `Image.decode()` → `drawImage` → `toBlob('image/png')` 的临时 raster 画板，不参与渲染逻辑。Satori 内部用 yoga-layout 算 flexbox、opentype.js 把字符 outline 成 SVG `<path>`，输出 SVG **不依赖 @font-face 加载**——这正是绕开 WebKit 字体死穴的关键。
- 优点：(1) 文字排版痛点彻底解决——wrap / inline 多字体切换 / italic / shadow / 颜色 / mana symbol inline 全交给 yoga + flexbox + opentype；(2) WebKit 友好——Satori 输出 `<path>` 而非 `<text>`，字体在编译期 outline 化，PNG 导出走 `Image+drawImage` 跨浏览器稳定；(3) mask / filter 是 SVG 原生，删 `blendFrameLayerPreservingAlpha` 像素循环；(4) 矢量导出免费（用户可下载 .svg 印刷品质）；(5) WYSIWYG 编辑 DOM 友好——SVG 元素可挂 handler；(6) drawCard.ts (1095) + drawRichText.ts (768) + drawSaga.ts (94) + drawPlaneswalker.ts (196) ≈ **2153 行 canvas 代码可删**，换成 React JSX 组件 + 字体 loader ≈ ~700 行净减 ~1450 行；(7) 与 ADR-0003 新原则 6 完全契合——不再追求与上游字面量一致。
- 缺点：(1) **破三依赖闸**——satori (~50 KB gz) + yoga-layout (~120 KB WASM) + opentype.js (~150 KB) 共 ~320 KB gz，需走 [`coding.md §顶层依赖闸`](../standards/coding.md#顶层依赖闸) 扩容评估（本 ADR 即承载该评估）；(2) drawCard pipeline 变 async——每个文字 region `await satori()`，编辑模式高频重渲染需 debounce + per-region SVG cache；(3) Satori CSS 是 Flexbox + Typography subset，不支持 grid / position absolute 部分场景 / cursor / 外部 `<style>` `<link>`——文字 region 内的 JSX 必须 inline style；(4) 字体必须 ArrayBuffer 注入 Satori（不读 @font-face），56 个字体改 fetch + 注入，需 `fontLoader.ts` 管理器（~150 行）+ lazy load 策略；(5) Satori 自研 layout 与浏览器原生有 1-3 px 漂移，ADR-0003 已容忍（不再追字面量），但编辑器若用 DOM 实时预览 + 导出走 Satori 会有 commit 跳变（缓解：编辑器预览也走 Satori，避免双引擎）；(6) DOM 节点数量在 SVG 路径下增加（单卡 SVG 文件含 outline path，CJK 多字 ~50 字符可能 100-500 KB SVG），gallery 场景需 raster 缓存策略；(7) 单卡 SVG 体积比 canvas toDataURL PNG 大，按需走 PNG 缓存。

## 决策

**选择 E**——纯 SVG 渲染基底 + Satori 跑文字层。

下列**决策级陈述**说明"采用什么方向"，**不**复述 JSX 组件契约 / 字段表 / 接口签名 / 规则本体——这些是各 owner 文档的事。每条陈述末标注本体承载位置。

- **渲染基底切换**：canvas 退场，渲染基底统一为 SVG。canvas 仅在 PNG 导出环节作为 raster 临时画板（SVG dataURL → `Image.decode` → `drawImage` → `toBlob`），不承载任何渲染逻辑。本体见 [`architecture/svg-render-pipeline.md`](../architecture/svg-render-pipeline.md)（待建）。
- **外层 SVG 由 React 直接渲染**：包含 `<defs>` / `<mask>` / `<filter>` / `<clipPath>` / `<image>` 等 SVG 一等公民元素；frame layer mask 合成走 SVG `<mask>` 不走 canvas `globalCompositeOperation`；watermark tint 走 SVG `<filter feColorMatrix>` 不走 `getImageData` 像素循环。本体见 [`architecture/svg-render-pipeline.md`](../architecture/svg-render-pipeline.md)（待建）。
- **文字 region 经 Satori 编译**：rules / title / type / collector / saga chapter / planeswalker abilities / PT / loyalty 等所有文字 region 用 JSX (HTML/CSS subset) 写组件，经 satori 编译为 SVG fragment 嵌入 outer SVG；JSX 受 Satori CSS subset 约束（Flexbox + Typography + inline style，禁 grid / cursor / 外部 style / script）。本体见 [`spec/svg-template.md`](../spec/svg-template.md)（待建）+ [`standards/satori-jsx.md`](../standards/satori-jsx.md)（待建）。
- **字体走 ArrayBuffer 注入**：Satori 不读 `@font-face`，所有 cardforger 字体（mplantin / mplantin-italic / mplantin-cjk / belerenbsc / gothammedium 等 56 face）需 fetch → ArrayBuffer → `satori({ fonts })` 注入；策略走按需 lazy load（看 tokens 用到哪些 fontFamily 再 fetch + 缓存）。本体见 [`spec/font-loading.md`](../spec/font-loading.md)（待建）。
- **token AST 不变**：现有 `Token / DrawableToken / AlignToken / BreakToken` 类型（drawRichText.ts:19–29）保留为中间表示；改动的是"输出端"——从 `ctx.fillText` 调用换成 JSX 树构造。import 预处理（`normalizeOracleText` / curly quotes / italic exemption / companion rewrite）完全不动，归 [`spec/text-tokens.md`](../spec/text-tokens.md) 既有 owner。
- **三依赖闸扩容**：顶层运行时依赖由 `react / react-dom / wouter` 三项扩容为四项收纳 `satori`；`yoga-layout` 与 `opentype.js` 作为 satori 的传递依赖一并入树。扩容判据本体见 [`standards/coding.md §顶层依赖闸`](../standards/coding.md#顶层依赖闸)（本 ADR accepted 时需同步增补"satori 例外条目 + 扩容理由"段）。
- **drawCard 异步化**：现有 `drawCard()` 同步 pipeline 改为 `async`，每个文字 region `await satori()`；编辑模式高频重渲染走 debounce + per-region SVG cache（同 tokens 同 fonts 不重算）。本体见 [`architecture/svg-render-pipeline.md`](../architecture/svg-render-pipeline.md)（待建）。
- **导出二路径**：PNG 导出走 SVG → drawImage → toBlob；SVG 矢量导出走 SVG 文件直接 download。两条路径共享同一份 SVG source of truth，不维护双渲染。本体见 [`architecture/svg-render-pipeline.md`](../architecture/svg-render-pipeline.md)（待建）。
- **WYSIWYG 编辑形态独立决策**：本 ADR 决定渲染栈，**不**决定编辑器交互形态（在卡面上直接点选 / region handle 拖动 / contentEditable 等）。SVG 基底使 DOM hit-test 与元素 handler 成为可能，但具体编辑形态由后续 ADR 单独承载（候选 ADR-0005）。
- **灰度切换 + 老路径并存**：实施期 canvas 老路径通过 feature flag (`renderEngine: 'canvas' | 'svg'`) 与 SVG 新路径并存；先以 m15Regular 单 frame 起步，逐 frame 推开 SVG 路径；像素 diff / 视觉对照（按 ADR-0003 口径）验证通过后切默认值；老路径默认关闭 2-4 周观察期后删除。本体见 [`process/canvas-deprecation.md`](../process/canvas-deprecation.md)（待建）。
- **验证策略不再像素 1:1**：SVG 渲染产物的验证按 ADR-0003 「上游产物对照参考」口径——cardforger 自身 spec 定义字段权威，上游 conjurer 同卡产物作为 MTG 卡面视觉合理性的外部锚点之一，1-3 px 漂移不构成违约。本体见 [`testing/svg-render-fixture.md`](../testing/svg-render-fixture.md)（待建）。

## 理由

为什么 E 比其他更合适，挂钩到 cardforger 的具体约束：

1. **ADR-0003 已解除字面量绑架**——选项 A（保留 canvas + 自研 layout）在原"必须字面量复刻 writeText"约束下是无奈最优解；该约束被 ADR-0003 解除后，A 的工程惯性论据失效，重写一遍 drawRichText 的工作量再无产品价值兜底。
2. **WebKit 死穴只有 Satori 路径绕开**——选项 C（手写 SVG `<text>`）和选项 D（html2canvas）都踩 Safari 字体加载 / dom-to-image 兼容性坑；E 的关键技术特性是 Satori 内部用 opentype.js 把字符 outline 成 `<path>`，输出 SVG 不依赖 @font-face，PNG 导出走 `Image+drawImage` 是基础 Web API 跨浏览器稳定。这一点是 cardforger 这种"需要可靠 PNG 导出"产品的硬约束。
3. **mask / filter 是 SVG 强项**——cardforger 30+ frame variant 都靠 mask 合成；canvas 路径下 `blendFrameLayerPreservingAlpha` 写了像素循环（性能差 + 代码量大），SVG 路径下 `<mask href="...">` 一行声明（GPU 加速 + 简洁）。换基底正好把这块从"勉强够用"换到"基底强项"。
4. **文字排版 yoga + opentype 是工业级实现**——自研 inline formatting context（选项 A / 选项 C）只能做简化版（cardforger 不可能投入 HarfBuzz 级 shaping 工程），但 yoga 是 Facebook 用了 10 年的 layout 引擎、opentype.js 是 SVG 输出场景最成熟字形提取工具，质量比自研 300-500 行可控得多。
5. **破三依赖闸有硬理由**——闸是为防"加包成瘾"，不是禁止任何扩容。本 ADR 的扩容（satori + 传递依赖 ~320 KB gz）换来：删 2153 行 canvas 代码、消灭手写排版引擎、WebKit 友好、矢量导出、WYSIWYG 友好。这是闸应允的扩容理由——有质变收益、无 vanilla 等价替代（你不可能用 react + react-dom 实现 yoga + opentype）。
6. **取代 ADR-0002 而非冲突**——ADR-0002 决议在 canvas 基底前提下成立；ADR-0004 换基底后 L1/L2/L3 walker / NumExpr / CondExpr / `compositingScope` / custom paint 白名单等具体决策点全部失效（SVG 路径无需自研 schema 编译器、无需 walker / resolver 三层）。但 ADR-0002 的"声明式描述卡片结构"思想可作为 JSX 组件组织参考。本 ADR `supersedes: [adr/0002-canvas-rendering-region-tree]`。
7. **可分阶段灰度** —— feature flag 控制 canvas vs SVG，先 m15Regular 单 frame 起步，逐 frame 推开；老路径并存到默认切 SVG + 2-4 周观察期；回滚成本 = 切 flag。

## 后果

### 正向后果

- drawCard.ts (1095) + drawRichText.ts (768) + drawSaga.ts (94) + drawPlaneswalker.ts (196) 共 2153 行命令式 canvas 代码退场；换为 React JSX 组件 + 字体 loader ≈ ~700 行，**净减 ~1450 行**。
- 文字排版痛点（wrap / 多字体内联切换 / inline image baseline / 字号 binary fit）由 yoga + flexbox + opentype 自动解决，cardforger 不再维护自研 mini 排版引擎。
- mask / filter 合成由 SVG 原生承担，删 `blendFrameLayerPreservingAlpha` 像素循环；性能 GPU 加速 + 代码简洁。
- 矢量导出（.svg 下载）作为副产品免费获得；用户可印刷品质使用。
- WYSIWYG 编辑器实施门槛降低——SVG DOM 元素可挂 handler，hit-test 不再绕模板格式；具体编辑形态留待 ADR-0005。
- 透明导出顺手解决（SVG 默认透明），不再有"导出 PNG 总带暗底"问题。
- ADR-0003 解除字面量约束后，cardforger 自身 spec 成为单一字段权威，渲染栈也成为 cardforger 独立选型——产品独立性提升。

### 负向后果 / 接受的代价

- 顶层运行时依赖从 3 项扩容为 4 项（加 satori）；bundle 增加 ~320 KB gz；首次加载性能成本由 [`testing/svg-render-fixture.md`](../testing/svg-render-fixture.md)（待建）评估阈值与缓解策略。
- drawCard pipeline 由同步变异步，调用方需适配 `await`；编辑模式高频重渲染需 debounce + cache。
- Satori CSS 是 Flexbox + Typography subset；某些 directive（`{savex}` `{loadx}` `{upinline+N}` 等 canvas 特有内联 cursor 操作）需要在 token AST → JSX 编译期重新设计为 absolute positioning 或 flexbox 表达，而非 1:1 复刻。
- 56 字体改 ArrayBuffer 注入；与浏览器 `@font-face` 加载机制并存，可能双份字体内存（UI shell 仍走 @font-face，Satori 走 ArrayBuffer）；策略由 [`spec/font-loading.md`](../spec/font-loading.md)（待建）承接。
- 单卡 SVG 文件含 CJK glyph outline path，体积可能 100-500 KB（视字符数）；gallery 场景需 PNG 缓存降级策略。
- ADR-0002 决议作废，原 6 份待建 owner 文档（region-tree 体系）不再需要建立；如已写入 backlog 由本 ADR 一并 supersede。
- RENDER_PARITY_STATE.md §3.C / §3.D 现有 6 fixture 像素侧对侧证据按 ADR-0003 已容忍降级，本 ADR 实施后口径整体重写为"语义对齐 + 视觉合理"。
- 现有 `drawManaSymbols.ts` / `drawSetSymbol` / `drawWatermark` 等 canvas-specific 辅助函数需重写为 SVG 元素或 Satori `<img>` inline，具体重写边界由 [`architecture/svg-render-pipeline.md`](../architecture/svg-render-pipeline.md)（待建）承接。

### 触发新建文档

落实本决策需要建以下 6 份 owner 文档（不在本 ADR 内复述本体，留给 owner 各自承载）：

- `docs/dev/spec/svg-template.md` —— JSX 卡片模板组件契约：组件清单（`<Card>` / `<RulesText>` / `<TitleText>` / `<TypeText>` / `<CollectorRegion>` / `<SagaRegion>` / `<PlaneswalkerRegion>` 等）、props 接口、token AST → JSX 映射规则、Satori 友好的 inline style schema
- `docs/dev/spec/font-loading.md` —— 字体 ArrayBuffer 加载契约：fontLoader 接口、字体注册表、lazy load 触发策略、缓存策略、与 @font-face 共存边界
- `docs/dev/architecture/svg-render-pipeline.md` —— 渲染管线组合：外层 React SVG + Satori 文字层注入 + PNG 导出 + 矢量导出；组件 / loader / Satori 调用 / drawImage 边界与依赖方向；mask / filter / clipPath 在 React SVG 中的归位规则；canvas raster 临时画板使用边界
- `docs/dev/standards/satori-jsx.md` —— JSX 写法准入：inline style 强制、Satori CSS subset 白名单（允许的 CSS 属性 / 禁止的 CSS 属性）、字体引用规范、外部资源（`<style>` / `<link>` / `<script>`）禁入、Reviewer 拒稿条件
- `docs/dev/testing/svg-render-fixture.md` —— SVG 渲染验证证据模型：fixture 目录结构、对照样本（cardforger SVG + cardconjurer canvas 同卡 PNG）、判定阈值（按 ADR-0003 "视觉合理范围" 口径）、CJK 体积阈值、性能阈值（p50 / p99 / bundle size）
- `docs/dev/process/canvas-deprecation.md` —— canvas 退场流程编排：feature flag 切换路径、逐 frame 灰度顺序、观察期判据、回滚触发条件、老 canvas 代码删除时机、saved-card schema 兼容性 checklist

按 [`standards/doc-ownership.md`](../standards/doc-ownership.md) 单选规则归位。本 ADR 升级到 `accepted` 必须以上述 6 份 owner 文档均落 `draft` 以上为前提。

### 触发更新现有文档（本 ADR `accepted` 时同 PR 改动，proposed 阶段不动）

- [`CLAUDE.md` §核心原则 3](../../../CLAUDE.md) —— 顶层依赖闸条目从「`react / react-dom / wouter`」扩容为「`react / react-dom / wouter / satori`」，单链接切到本 ADR + `coding.md §顶层依赖闸`。
- [`standards/coding.md §顶层依赖闸`](../standards/coding.md#顶层依赖闸) —— 增补 satori 例外条目段：扩容理由、传递依赖（yoga-layout / opentype.js）入树记录、bundle 阈值。
- [`adr/0002-canvas-rendering-region-tree.md`](0002-canvas-rendering-region-tree.md) —— status 由 `proposed` 改为 `superseded`；`superseded_by: [adr/0004-svg-rendering-stack-with-satori]`；保留文件作为决策 audit trail。
- [`adr/README.md`](README.md) ADR 清单 —— 加入 ADR-0004 行；ADR-0002 行加 `superseded` 标记。
- [`architecture/overview.md`](../architecture/overview.md) Canvas pipeline 段 —— 改名 "Render pipeline"；指向 `architecture/svg-render-pipeline.md`；删 canvas-specific 描述。
- [`architecture/dependencies.md`](../architecture/dependencies.md) —— 顶层依赖图加 satori 节点 + 传递依赖；说明字体由 fontLoader 注入而非 @font-face。
- [`spec/canvas-render.md`](../spec/canvas-render.md) —— 文件改名为 `spec/text-render.md` 或保留兼容（待 owner 文档建立时判定）；字号 / 字体 / token 表迁移到 `spec/svg-template.md` 或 `spec/text-tokens.md`；保留链向新 owner。
- [`RENDER_PARITY_STATE.md`](../../../RENDER_PARITY_STATE.md) §3.C / §3.D —— 6 fixture 像素侧对侧证据按 ADR-0003 + 本 ADR 重写为"语义对齐 + 视觉合理"口径。
- `package.json` —— 顶层 `dependencies` 加 `satori`（传递依赖由 npm 自行解析）。

### Backlog

- **B7**：Satori spike 实测（`scripts/spike-satori.mjs` 独立目录，临时安装不入主 deps）—— 跑 atraxa fixture 验证 WebKit Safari 真机出图 / CJK SVG 体积 / 100 keystroke 性能 / mana symbol `<img>` inline baseline 四件事。承接 owner：[`process/canvas-deprecation.md`](../process/canvas-deprecation.md)（待建）PoC 段。
- **B8**：fontLoader CJK 内存预算与缓存策略——mplantin-cjk 单字体可能 5–10 MB，多卡共享缓存设计。承接 owner：[`spec/font-loading.md`](../spec/font-loading.md)（待建）。
- **B9**：gallery 场景 SVG → PNG raster 缓存策略——detail 视图用 SVG、list 视图用 PNG 缩略图的切换边界。承接 owner：[`architecture/svg-render-pipeline.md`](../architecture/svg-render-pipeline.md)（待建）。
- **B10**：Satori CSS subset 与 cardforger 14 directive 的映射表——`{i}` / `{fontbelerenbsc}` / `{fontsize+δ}` / `{savex}` / `{loadx}` / `{upinline+N}` / `{flavor}` / `{outline}` / `{shadow}` / `{align...}` 各自的 JSX 实现路径；canvas 特有的内联 cursor 操作（savex/loadx/upinline）需重新设计。承接 owner：[`spec/svg-template.md`](../spec/svg-template.md)（待建）+ [`standards/satori-jsx.md`](../standards/satori-jsx.md)（待建）。
- **B11**：编辑器 WYSIWYG 形态决策——是否需要 contentEditable / region handle 拖动 / 在卡面直接点选；独立 ADR-0005 承载，本 ADR 不绑。

## 复审条件

满足下列任一事实出现时本决策应重新评估：

- **WebKit Safari 实测出图失败**：spike (B7) 或正式实施期在真 Safari 上 SVG → drawImage → PNG 出现字体回退 / 渲染错误 / 体积过大无法接受——本 ADR 的核心技术前提（Satori `<path>` 输出绕开 WebKit 字体死穴）不成立。
- **Satori 上游废弃 / 长期失维**：Vercel 停止维护 satori 或安全漏洞长期未修——单点依赖风险触发，需评估自研 fork 或换栈。
- **CJK SVG 体积失控**：mplantin-cjk 单卡 SVG 突破 1 MB 且 PNG 缓存策略无法缓解 gallery 性能——SVG 路径在 CJK 场景下不可用，需局部降级 canvas 或预生成。
- **Satori CSS subset 表达力失败**：cardforger 14 directive 映射期间出现 ≥3 个 directive 无 Satori 友好等价表达（且无法通过 absolute positioning / flex 重新设计绕开）——subset 表达力不足，决策需重审。
- **依赖闸扩容滥用**：顶层依赖突破 5 项——本 ADR 已为闸开了第一个口子，第二次扩容需要重新审视"自研 vs 引库"的成本平衡。
- **WYSIWYG 编辑形态与 SVG 基底冲突**：ADR-0005 编辑形态决议期间发现 SVG 基底无法承载所需交互（如复杂 IME 中文输入、selection range 跨 region 等），需重新评估渲染基底选型。

---

**附**：本决策由用户多轮对话收敛——从「canvas 文字排版很麻烦」起步，依次评估了选项 A（保留 canvas + 自研 layout）、B（hybrid canvas + HTML overlay）、C（完全 SVG 手写 `<text>`）、D（HTML/CSS + html2canvas）、E（SVG + Satori），关键转折点是用户指出「macOS WebKit 对 HTML/CSS 转图片支持差」否决了 D 与 C 的字体 embed 路径，并主动提出 Satori 路径；进一步澄清 Satori 输出 `<path>` 而非 `<text>` 这一特性绕开 WebKit 死穴；最终敲定纯 SVG + Satori 文字层 + canvas 退场。proposed 状态等待 6 份 owner 文档建立后升级 accepted；spike (B7) 与 ADR-0005（编辑形态）作为独立工作项承接。未经 GAN review。
