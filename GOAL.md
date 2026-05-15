# Goal — Phase 2: 卡面渲染深度对齐

Phase 1（页面壳对齐：14 项 DONE — Landing/Creator-shell/Converter/Gallery/AskUrza/About/Legal/Tutorial/Theme/Phyrexian/Print/NotFound/字体与样式/资源路径契约）已通过 `RENDER_PARITY_STATE.md` 记录归档。**Phase 2 的目标是 Creator 画布渲染的逐项保真**：把 cardforger canvas 输出对齐到 CardConjurer 上游的真实渲染效果，以"同卡同貌"为验收标准。

本文件由 Claude Code 的 `/goal` 命令（v2.1.139+）驱动：复制下文「`/goal` Condition」码块作为参数喂入 `/goal`，evaluator（默认 Haiku）会在每轮结束读取本轮 transcript，按 P1–P10 判定是否达成；未达成自动开新一轮，达成自动清除 goal。`/goal` 取代旧的 ralph-loop 触发方式。

调用示例：

```bash
# 交互式：粘贴整个 Condition 码块作为参数
/goal <粘贴下方 Condition>

# 非交互式：把本文档当作驱动文件
claude -p "/goal $(awk '/^```goal-condition/{flag=1;next}/^```$/{flag=0}flag' GOAL.md)"
```

随时 `/goal` 查看状态、`/goal clear` 中断。**`/goal` 的 condition 上限 4000 字符；下文 Condition 块已控制在限内。请勿在 condition 外补充叙述——evaluator 只读 condition + 本轮 transcript，不会读本文档其余部分**；其余章节是供主模型（developer 视角）每轮工作时翻阅的 playbook。

---

## `/goal` Condition

把下面整段（不含围栏）粘到 `/goal` 后面：

````goal-condition
Phase 2 Creator 卡面渲染对齐已收敛：cardforger 的 /creator 输出与本地 cardconjurer 上游实例（位于/workspace/cardconjurer,需要手动启动）在同卡 import 下视觉一致，且本轮 transcript 已展示下列全部证据；否则 stop after 40 turns。每轮必须在本轮 transcript 中显式回显 RENDER_PARITY_STATE.md 全文（Read 工具或 cat），以及下列命令的真实输出，evaluator 只判断 transcript 里出现过的内容。

P1（状态文件完整）：transcript 中可见 RENDER_PARITY_STATE.md 第 2 节 Phase 2 表，F1–F10 行全部为 DONE 并附最近改动日期；Phase 1 表 14 项保持 DONE。

P2（typecheck）：transcript 含 `npm run typecheck` 实际输出，退出码 0，无 error；改动中未通过新增 `any` 或放宽 tsconfig 来绕过。

P3（build）：transcript 含 `npm run build` 实际输出，退出码 0，产出 `dist/`；运行时资源 404（/img、/fonts、/gallery、/data 等）已在状态文件第 5 节登记。

P4（视觉对照）：fixture 列表（Lightning Bolt、Counterspell、Llanowar Elves、Hallowed Fountain、Atraxa Praetors' Voice、Jace the Mind Sculptor、Urza's Saga、Fire // Ice、Bonecrusher Giant、任一 Phyrexian Praetor、Sheoldred the Apocalypse、Birgi God of Storytelling）每张在状态文件第 3 节均有视觉对照条目，写明 frame、字号、symbol、watermark、collector 行的对照结论。任一卡出现字体回退到 system-ui、symbol 错位、frame 缺失、字号偏差 >10% 均视为未通过。

P5（cardframe 索引）：状态文件第 3 节包含浏览器 Network 面板检查记录，import 测试卡时无 /img/frames/* 404（除非该 frame 在上游本身也不存在并已在状态文件登记）；framePresetConfig.json 已枚举 magic_resources 现有 frame family。

P6（collector 行）：F3 collector 渲染（artist 用 goudymedieval/mplantin/belerenbsc、set+rarity+语言+卡号顺序、版权行字号）已在状态文件第 3 节登记并与上游一致。

P7（rule text）：F4 rule text 在短/中/长/含 flavor divider/含 italic 五种长度下自动字号缩放与上游一致；{w}/{u}/{flavor}/{i}/{cardname} 等 token 渲染正确，状态文件第 3 节附对应 fixture 证据。

P8（仓库干净）：transcript 含 `git status` 输出，工作区干净；public/img、public/fonts、public/gallery、public/data/images、public/data/site、public/favicon.ico 均未被 git 跟踪。

P9（基线未被改）：transcript 含 `git -C /workspace/cardconjurer status` 输出且工作区干净；含 `git diff --stat src/legacy-app/` 输出且为空。

P10（workaround 已登记）：新引入的 @ts-ignore / eslint-disable / TODO / FIXME 已在状态文件第 4 节按"文件:行号 — 解除条件"逐条列出；若本轮未引入此类条目，transcript 须显式声明"本轮无新增 workaround"。

任一 P 条目缺少证据、未通过、或被跳过 → 未达成。evaluator 返回未达成原因时应点名具体编号，引导下一轮补齐。
````

`/goal` 自身判断完成，**不需要、也禁止**在回复中输出诸如 `<promise>PARITY_DONE</promise>` 之类的 sentinel——旧机制已废弃。

---

## 1. 参考基线与目标产物

- **首要参考（ground truth）**：本地启动的 **CardConjurer 实例**（见第 4 节工作流第 0 步）。源码位于 `/workspace/cardconjurer/`（独立 git 仓库；如目录为空，按 README/UPSTREAM_COMMIT 指引重新 clone 后再起服务）。**只读**，禁止改动。
- **仓内便携副本**：`src/legacy-app/`（README.md:53 所述 "Frozen reference copy"，对应 cardforger 根目录 `UPSTREAM_COMMIT` 文件记录的上游 commit）。允许快速参考，但**可能落后于上游**——冲突时以 `/workspace/cardconjurer/` 实际渲染为准。仓内只读。
- **目标产物**：`src/features/creator/canvas/`、`src/services/creatorAssets.ts`、`src/services/framePresets.ts`、`src/services/manaSymbols.ts`、`src/services/saga.ts`、`src/services/planeswalker.ts`、`src/services/templates.ts`、`src/services/scryfall.ts`、`src/services/creatorAssetConfig.json`、`src/services/framePresetConfig.json`，以及与 Creator 渲染相关的 `src/styles/global.css` 片段、`src/features/creator/components/CardFaceForm.tsx` 等。
- **不改动**：Phase 1 已 DONE 的页面壳（Landing/Converter/Gallery/AskUrza/About/Legal/Tutorial/Theme/Phyrexian/Print/NotFound）非渲染逻辑部分。如必须改动，先把对应 DONE 项降级为 IN_PROGRESS 并写明原因。

## 2. 仓库上下文与运行时

- `cardforger` 是源码仓库；`magic_resources`（`https://github.com/Sentixxx/magic_resources`，Git LFS）负责所有运行时资源。
- **本地端口**：dev/preview/对照实例都使用 **7001–7020** 范围（容器只暴露这一段）：
  - `7002`：cardforger dev server（`npm run dev -- --port 7002 --host 0.0.0.0`）
  - `7003`：CardConjurer 上游静态实例（`cd /workspace/cardconjurer && python -m http.server 7003 --bind 0.0.0.0` 或同等命令）
- **资源初始化**（Phase 1 已经做过；如 `public/` 不完整需要重做）：

  ```bash
  git clone https://github.com/Sentixxx/magic_resources /workspace/magic_resources
  cd /workspace/magic_resources
  git lfs install
  git lfs pull
  TMPDIR=/workspace/.tmp node scripts/init-assets.mjs /workspace/cardforger
  ```

  `TMPDIR=/workspace/.tmp` 必须，因为 `/tmp` 是 512 MB tmpfs，遇到大 archive（如 `img-frames-custom.tar.br` 897 MB）会 ENOSPC。
- 不要把资源（`public/img/`、`public/fonts/`、`public/gallery/`、`public/data/images/`、`public/data/site/`、`public/favicon.ico`）提交到 cardforger。
- 不引入新顶层运行时依赖（已有：`react`、`react-dom`、`wouter`）。Scryfall API 调用走 fetch，不需要新 SDK。

---

## 3. Phase 2 对齐范围（Creator 渲染细项）

每项在 `RENDER_PARITY_STATE.md` 中记录状态。**比对方法**：两侧本地实例都打开 `/creator`，**用同一张 Scryfall 卡 import**（推荐先准备一个 8–12 张代表卡的 fixture 列表，覆盖 normal / planeswalker / saga / 双面 / split / 多色 / 无色 / land 等典型场景），逐项 diff。

| 项 | 现行实现位置 | 关注点 |
| --- | --- | --- |
| **F1 字体渲染模式** | `src/styles/global.css` 的 `@font-face`、`drawCard.ts` 的 `ctx.font` 拼接、字体回退链 | 是否所有 canvas 文字（name / type / rules / flavor / power-toughness / collector）都用对了 face；上游 49 个未声明 @font-face 是否在本轮目标内（按 frame 实际触发情况补）。比对：同卡 name/type 字形、粗细、字距、上下行高。 |
| **F2 缺失 cardframe 索引** | `src/services/framePresetConfig.json`、`src/services/creatorAssetConfig.json`、`src/services/templates.ts` | `magic_resources` 现在解出 99 个 `public/img/frames/*` 子目录，cardforger 配置里只索引了 ≈20 个 preset。逐 family 加索引，参考上游 `js/creator-23.js` 中 `frames[...]` 定义。 |
| **F3 collector 信息样式** | `drawCard.ts` 底栏（artist / set code / rarity / language / number / 版权行）、`drawRichText.ts` 中相关 token | 字体（goudymedieval / mplantin / belerenbsc）、字号、位置、与 set symbol 对齐方式。比对：同卡底栏完整一行 vs 上游。 |
| **F4 rule text 渲染** | `src/features/creator/canvas/drawRichText.ts`（768 行）、`drawCard.ts:308-326` 调用点 | 自动字号缩放、换行、`{w}/{u}/{flavor}/{i}/{b}/{cardname}` 等 token 解析、flavor divider、italic 切换。比对：长 rule（如 Atraxa, Praetors' Voice）vs 上游字号、行距、对齐、divider 位置。 |
| **F5 mana symbol 渲染** | `src/features/creator/canvas/drawManaSymbols.ts`、`src/services/manaSymbols.ts`、`/img/manaSymbols/*` | 形状、阴影、混合色（hybrid/phyrexian/X/T/Q）、name line 中嵌入的代价 token。比对：复杂 cost（如 `{X}{R/W}{R/W}`）vs 上游。 |
| **F6 set symbol 渲染** | `src/features/creator/canvas/drawCard.ts` 中 set symbol 绘制、`creatorAssetConfig.json` 中的 set 列表 | 位置、缩放、稀有度着色（common 黑 / uncommon 银 / rare 金 / mythic 橘）、混合色处理。 |
| **F7 watermark 渲染** | `drawCard.ts` watermark layer | 透明度（默认 ~40%）、blend mode、定位（rules box 居中）、缩放。 |
| **F8 special layout** | `drawSaga.ts`、`drawPlaneswalker.ts`、双面/split/fuse/flip/aftermath/adventure 等分支 | 每种 layout 至少 1 张 fixture 卡 import 对照。 |
| **F9 Scryfall import 行为** | `src/services/scryfall.ts`、`src/pages/CreatorPage.tsx` 中 import 调用链 | 同一张卡 import 后两侧自动选 frame / 字段映射结果是否一致；不一致先记录差异再决定是否修。 |
| **F10 资源路径与 manifest 一致性** | `creatorAssetConfig.json` + `framePresetConfig.json` 引用的所有 URL 应与 `magic_resources/manifest.json` 目标路径吻合 | 每加一个 frame preset 都顺手核对 `magic_resources` 里对应路径是否真存在，避免 404 silent fail。 |

未覆盖的 frame family / 特殊 layout 默认不属于本轮目标；如发现 fixture 触发了未实现路径，先在 `RENDER_PARITY_STATE.md` 第 3 节登记理由再动手。

### Scryfall fixture 起点（自由扩充）

每个 fixture 名后括号是 layout / 关键特性。两侧实例都用 Creator → "Import from Scryfall" 输入同名导入：

- `Lightning Bolt` — 最基础 instant，红色 mana
- `Counterspell` — 蓝色 instant，多色 mana
- `Llanowar Elves` — 绿色 creature with P/T
- `Hallowed Fountain` — 双色 land
- `Atraxa, Praetors' Voice` — 长 rule text + 多色 mana + 神器生物
- `Jace, the Mind Sculptor` — planeswalker
- `Urza's Saga` — saga
- `Fire // Ice` — split
- `Bonecrusher Giant` — adventure
- `Phyrexian Praetors` 任一 — phyrexian
- `Sheoldred, the Apocalypse` — modern legendary
- `Birgi, God of Storytelling` — modal DFC

---

## 4. 每轮工作流（必须按序执行）

0. **环境就绪 + transcript 自证**（每轮快速核对，不重复初始化）：
   - cardforger dev 已起在 7002？没起就 `npm run dev -- --port 7002 --host 0.0.0.0`。
   - cardconjurer 实例已起在 7003？`/workspace/cardconjurer/` 是否非空、index.html 存在？如缺，先按第 2 节流程 clone + LFS pull 后启服务。
   - `public/img/`、`public/fonts/`、`public/gallery/`、`public/data/images/` 是否齐？缺则按第 2 节 init-assets。
   - 把启动状态、URL 写到 `RENDER_PARITY_STATE.md` 第 0 节。
   - **每轮必须 Read 一次完整的 `RENDER_PARITY_STATE.md` 让其文本落到 transcript**——`/goal` evaluator 只能看到 transcript 内容，不读文件系统。
1. **体检**：基于刚回显的 `RENDER_PARITY_STATE.md`，挑出当前状态为 `TODO` 或 `BLOCKED` 中**最小、最独立**的一项（F1–F10 之一的子片段，例如"F2: m15Modern 这一 family"）作为本轮目标。
2. **比对**：在两侧实例上 import 同一张 fixture 卡，截图或记录 DOM 差异。把差异落到状态文件本轮增量里。
3. **最小增量**：只改与本轮目标相关的文件。禁止顺手 refactor、改格式、改命名、动无关页面。
4. **验证并把命令输出留在 transcript**：
   - 运行 `npm run typecheck`，输出必须出现在 transcript 中且退出码 0。
   - 运行 `npm run build`，输出必须出现在 transcript 中且退出码 0。
   - 运行 `git status`、`git -C /workspace/cardconjurer status`、`git diff --stat src/legacy-app/`，三条输出都要留在 transcript。
   - 浏览器刷新 cardforger，重新 import 同一张 fixture，确认渲染变化方向正确并在状态文件中文字描述对照结论。
5. **落盘**：更新 `RENDER_PARITY_STATE.md` 中本项的状态、日期、改动概要、遗留问题；若发现新阻塞项，新增 `BLOCKED` 条目并说明依赖；任何 workaround 进第 4 节。
6. **自检 P1–P10**：照下文 condition 中 P1–P10 自查；缺哪条证据就在本轮补出来。**不要在回复中输出任何"完成 sentinel"，是否达成由 `/goal` evaluator 决定**。

每轮严格保持「工作区干净 → 单次小步推进 → 工作区干净」。不允许跨轮残留半成品。

---

## 5. 状态文件 `RENDER_PARITY_STATE.md`

放在仓库根目录，是 `/goal` 多轮之间唯一的进度记忆。**每轮必须被 Read 到 transcript 一次**，否则 evaluator 看不到 P1。最小字段：

```markdown
# Render Parity State

_Last updated: YYYY-MM-DD HH:MM_

## 0. 实例与环境
- cardforger dev：http://0.0.0.0:7002/ (PID …)
- cardconjurer baseline：http://0.0.0.0:7003/ (PID …)
- public 资源完整度：…
- /workspace/cardconjurer commit：…

## 1. Phase 1 范围对齐表（冻结，不再变更）
| 项 | 状态 | 最近改动 |
| --- | --- | --- |
| Landing | DONE | 2026-05-15 |
| …（14 项 Phase 1 全部 DONE）

## 2. Phase 2 范围对齐表
| 项 | 状态 | 最近改动 | 备注 |
| --- | --- | --- | --- |
| F1 字体渲染模式 | TODO / IN_PROGRESS / DONE / BLOCKED | YYYY-MM-DD | … |
| F2 cardframe 索引 | … | … | … |
| F3 collector 样式 | … | … | … |
| F4 rule text 渲染 | … | … | … |
| F5 mana symbol | … | … | … |
| F6 set symbol | … | … | … |
| F7 watermark | … | … | … |
| F8 special layout | … | … | … |
| F9 Scryfall import | … | … | … |
| F10 资源路径一致性 | … | … | … |

## 3. 本轮增量
- 目标项：F? — …
- fixture 卡：…
- 改动文件：…
- 改动概要：…
- 验证结果：typecheck ✅ / build ✅ / 视觉对照 ✅/未做（原因）
- 视觉对照逐卡条目：每张 fixture 卡一行，写明 frame、字号、symbol、watermark、collector 对照结论

## 4. 遗留问题与阻塞 / Workaround
- BLOCKED：…
- workaround：`<file>:<line>` — `@ts-ignore` / `eslint-disable` / `TODO` —— 解除条件：…

## 5. 依赖与资源契约
- 顶层运行时依赖：react, react-dom, wouter（新增需在此登记并说明）
- 引用的 runtime 资源路径：/img/..., /fonts/..., /gallery/img/..., /data/images/...
- 已登记的 404：…

## 6. 已知风险
- …（继承 Phase 1 的 R2/R4/R5/R7/R8 + B6/B7，新增项追加在后）
```

允许扩展字段，但禁止删除已有字段。

---

## 6. 反漂移守则

- 不做视觉"改良"或品牌化（颜色、字号、动效）—— 对齐 = 像，不是好看。
- 不重写已经 `DONE` 的 Phase 1 页面壳"以求统一风格"。要改 DONE 项，必须先把它降级为 `IN_PROGRESS` 并写明原因。
- 不替换 `wouter`、不切换路由方案、不拆/合 `src/pages` 与 `src/features` 的边界。
- 不在 `/goal` 循环中做仓库重组（搬目录、改文件名）。结构变更属于另一项专门任务。
- 不修改、不 stage、不 commit `/workspace/cardconjurer/` 和 `src/legacy-app/` 任何文件——它们是参考基线。
- 新增运行时依赖、UI 库、CSS 框架、状态管理库、构建插件之前，先在 `RENDER_PARITY_STATE.md` 第 5 节登记必要性与替代方案评估。
- 修改 `vite.config.ts`、`tsconfig*.json`、`package.json` 之前，先在状态文件第 3 节写明本轮目标为何需要碰构建配置；改后跟着 `npm run build` 验证。
- 不在回复结尾输出任何完成 sentinel（`<promise>...</promise>` 等）——`/goal` evaluator 自己判完成，伪 sentinel 既无效也会污染 transcript。
