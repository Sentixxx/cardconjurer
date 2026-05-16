# Goal — Phase 2 收尾: 残差消除（F3 collector + F4 rule text 排版）

Phase 1（页面壳 14 项）+ Phase 2 主体（F1 frame 索引 / F2 mana symbol / F5 watermark / F6 set symbol / F7 rich-text token / F8 saga / F9 planeswalker / F10 12-fixture 视觉证据）均已 DONE 入库（详见 `RENDER_PARITY_STATE.md`）。**剩余残差集中在两处**：

- **F3 collector**：当前 cardforger 用单行 `cardNumber•rarity•SET•EN` + 单独 artist 行 + 单独 copyright 行；上游 `setBottomInfoStyle()` 用 **6 个 text object** + `enableNewCollectorStyle` 双模式，字段顺序、`brush ￮` icon、`bottomInfoColor` 受控切换都没对齐（R11/R12）。
- **F4 rule text 排版**：12 fixture 已截图，但 cardforger 与 `/workspace/cardconjurer` 上游服务的 **side-by-side 像素级对照** 尚未做（B1）；用户反馈 "ruletext 拍板部分仍不对"，需在两端同卡 import 后逐项核对字号 / 行距 / `{flavor}` divider / italic 切换 / planeswalker level / saga chapter 字号。

本文件由 Claude Code 的 `/goal` 命令驱动：复制下文「`/goal` Condition」码块作为参数喂入 `/goal`，evaluator 按 P1–P6 判定是否达成；未达成自动开新一轮。

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
Phase 2 残差收尾：cardforger 与 `/workspace/cardconjurer` 上游侧对侧对照下，F3 collector + F4 rule text 排版与上游肉眼不可见差异。stop after 30 turns。evaluator 只判 transcript 内出现过的证据。

P1（上游服务起来 + 同卡截图）：transcript 含 `/workspace/cardconjurer` 在 7003 端口的启动证据（`curl -sI http://127.0.0.1:7003/ | head -1` 显示 200；或 `ps -ef | grep http.server` 列出 PID），且每轮至少在两端 import 同一张 fixture 后保存截图（如 chromium headless 出 `/tmp/forger-<slug>.png` + `/tmp/conjurer-<slug>.png`），结论落到 `RENDER_PARITY_STATE.md` 第 3 节。若上游服务确实启动不了，必须在第 6 节登记 B1 BLOCKED 并说明已尝试的启动命令，但本轮不得声称对齐完成。

P2（typecheck + build）：transcript 含 `npm run typecheck` 与 `npm run build` 实际输出，退出码均 0；未通过新增 `any` / 放宽 tsconfig / 改 `noEmit` 等手段绕过。

P3（F3 collector 残差清零 — 严格对齐 `creator-23.js:setBottomInfoStyle` 245–270）：cardforger 实现已落到 6 个 text object 且字段与上游一致，第 3.C 节附前后截图对照：
- midLeft：`{set} • {language}  {savex}{fontbelerenbsc}{fontsize+δ}{upinline+δ}￮{savex2}{artist}`，主字体 `gothammedium` size≈0.0171，artist 段内联切 `belerenbsc`；
- topLeft 新版=`{rarity}{kerning3}{number}{kerning0}` 旧版=仅 `{number}` + 独立 rarity object，`gothammedium` 0.0171；
- bottomLeft `NOT FOR SALE` `gothammedium` 0.0143；
- wizards `™ & © {year} Wizards of the Coast` `mplantin` 0.0162 align=right；
- bottomRight 站点署名 `mplantin` 0.0143 align=right；
- `enableNewCollectorStyle` 等价开关两种模式都视觉对照过；
- brush icon 用 `￮`（mtg.ttf）而非 ASCII `✧`（R11 解除）；
- `card.bottomInfoColor` 按 frame 受控（白卡边黑文本 / 黑卡边白文本），不再硬编码 `#f4f4f0`（R12 解除）。
任一字段（字体名、相对字号、align、savex/upinline/kerning token、icon、color 切换）与上游不一致 → 未通过。

P4（F4 rule text 排版 side-by-side 一致 — 严格对齐 `writeText` 3711+ 与 import 6670–6790）：≥5 张 fixture 在两端截图下排版一致，结论逐张落到第 3.D 节：
- 长 rule（Atraxa）字号 / 行距与上游误差 ≤10%；
- 含 `{flavor}` divider（Sheoldred）divider 横线位置 / italic 字体 / 颜色与上游一致；新版切 `{/indent}{lns}{bar}{lns}{fixtextalign}{i}` + cflavor bar，旧版 `{oldflavor}` 切 `gillsansbolditalic` + `fontsize-20`；
- 含 reminder text（Llanowar Elves / Counterspell）`italicize-reminder-text` 包裹 `(...)`、`removeReminderText` 整段删除两种模式与上游一致；
- planeswalker（Jace）loyalty cost / abilityHeights 字号 / 对齐与上游一致；
- saga（Urza's Saga）chapter pip / ability line 字号与上游一致。
import 预处理证据（在 `src/services/scryfall.ts` 或等价路径）须覆盖 `{Q}→{untap}`、`{∞}→{inf}`、`• →• {indent}`、`curlyQuotes`、companion 文案重写为 "as a sorcery"、keyword italic 豁免列表（Boast/Cycling/Visit/Prize/I–IV 组合/Prototype/Companion/To solve/Solved/`• Khans|Dragons|Mirran|Phyrexian`）。任一字段（字号、行距、italic 切换、divider 位置、token 解析、import 预处理）与上游肉眼可见差异 → 未通过。

P5（基线未被改 + 工作区干净）：transcript 含 `git status` 干净；含 `git -C /workspace/cardconjurer status` 干净；含 `git diff --stat src/legacy-app/` 输出为空。

P6（workaround 登记）：本轮新引入的 `@ts-ignore` / `eslint-disable` / `TODO` / `FIXME` 已在状态文件第 4 节按"文件:行号 — 解除条件"列出；无新增则显式声明"本轮无新增 workaround"。

任一 P 缺证据、未通过或被跳过 → 未达成。evaluator 返回未达成原因时点名编号，引导下一轮补齐。
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

## 3. 本轮聚焦：F3 collector + F4 rule text（剩余两个残差点）

F1（frame 索引）/ F2（mana symbol）/ F5 watermark / F6 set symbol / F7 rich-text token / F8 saga / F9 planeswalker / F10 fixture 视觉证据 **均已 DONE 入库**，详见 `RENDER_PARITY_STATE.md` 第 2.A 表与 3.A–3.E 节。本轮聚焦表如下：

| 项 | 现行实现位置 | 残差与对照点 |
| --- | --- | --- |
| **F3 collector** | `src/features/creator/canvas/drawCard.ts` 的 `drawCollectorInfo`（≈781–825）、`drawRichText.ts` 中 `{savex}/{savex2}/{kerningN}/{upinlineN}/{fontbelerenbsc}` token | **完全照搬 `/workspace/cardconjurer/js/creator-23.js` 中 `setBottomInfoStyle()` 245–270 行**：6 个 text object（midLeft/topLeft/note/bottomLeft/wizards/bottomRight）+ `enableNewCollectorStyle` 双模式开关。主字体 `gothammedium`（**不是** goudymedieval），artist 段内联切 `belerenbsc`，wizards/bottomRight 用 `mplantin`+align=right，相对字号 0.0143/0.0162/0.0171。残差：(1) 当前主行 `cardNumber•rarity•SET•EN` 单行布局 → 必须拆成 midLeft + topLeft；(2) brush icon 改为 `￮`（mtg.ttf），废弃 ASCII `✧`（R11）；(3) `card.bottomInfoColor` 按 frame 受控，停止硬编码 `#f4f4f0`（R12）。 |
| **F4 rule text 排版** | `src/features/creator/canvas/drawRichText.ts`、`drawCard.ts:308-326` 调用点、`src/services/scryfall.ts` import 预处理 | **完全照搬 `/workspace/cardconjurer/js/creator-23.js` 中 `writeText()` 3711+ 行及 import 6670–6790 行**：① binary-fit 字号缩放（递归 `tryFit` -1 fontsize 直到收敛）；② token 解析覆盖 condition P4 列表；③ italic reminder 两种模式（`italicize-reminder-text` 包裹 / `removeReminderText` 删除）；④ `{flavor}` 新版 `{/indent}{lns}{bar}{lns}{fixtextalign}{i}` + cflavor bar vs 旧版 `{oldflavor}` + `gillsansbolditalic` + `fontsize-20`；⑤ import 预处理 `{Q}→{untap}`、`{∞}→{inf}`、`• →• {indent}`、`curlyQuotes`、companion 文案重写、keyword italic 豁免；⑥ planeswalker level / saga 行首 inline `{fontsize+N}` 指令。残差：cardforger fitTextToHeight 当前 `minScale=0.48` + 5 次截断；上游无下限。需在 ≥5 张 fixture 上对照后决定是否对齐上游或保留差异（保留差异必须在状态文件 §3.D 写明理由）。 |

未覆盖的 frame family / 特殊 layout 默认不属于本轮目标。fixture 起点：Lightning Bolt / Counterspell / Llanowar Elves / Hallowed Fountain / Atraxa, Praetors' Voice / Jace, the Mind Sculptor / Urza's Saga / Fire // Ice / Bonecrusher Giant / 任一 Phyrexian Praetor / Sheoldred, the Apocalypse / Birgi, God of Storytelling — 与 Phase 2 主体阶段使用的 12 张一致，复用 `public/fixtures/*.json` + `/fixtures/:slug` 路由。

---

## 4. 每轮工作流（必须按序执行）

0. **环境就绪 + transcript 自证**：
   - cardforger dev 起在 7002？没起就 `npm run dev -- --port 7002 --host 0.0.0.0`。
   - **`/workspace/cardconjurer` 起在 7003**？没起就 `cd /workspace/cardconjurer && python3 -m http.server 7003 --bind 0.0.0.0 &`，并用 `curl -sI http://127.0.0.1:7003/ | head -1` 验证 200；若启不来（目录空、依赖缺等）按第 2 节流程恢复或写入第 6 节 BLOCKED。
   - `public/img/`、`public/fonts/`、`public/gallery/`、`public/data/images/` 是否齐？缺则按第 2 节 init-assets。
   - 把启动状态、URL 写到 `RENDER_PARITY_STATE.md` 第 0 节。
   - **每轮必须 Read 一次完整的 `RENDER_PARITY_STATE.md` 让其文本落到 transcript**——`/goal` evaluator 只能看到 transcript 内容。
1. **体检**：从 §3 表格 F3 / F4 残差里挑**最小、最独立**的一项作为本轮目标。
2. **比对**：在 cardforger（`/fixtures/<slug>` 或 `/creator` import）和 cardconjurer 上游各跑同一张 fixture，分别 chromium headless 截图到 `/tmp/forger-<slug>.png` 与 `/tmp/conjurer-<slug>.png`；transcript 中至少 inline 显示其中一对，并文字描述差异。
3. **最小增量**：只改与本轮目标相关的文件。禁止顺手 refactor、改格式、改命名、动无关页面。
4. **验证并把命令输出留在 transcript**：`npm run typecheck`、`npm run build`、`git status`、`git -C /workspace/cardconjurer status`、`git diff --stat src/legacy-app/`；浏览器刷新后再截一次图，确认变化方向正确。
5. **落盘**：更新 `RENDER_PARITY_STATE.md` 中本项的状态、日期、改动概要、遗留问题；workaround 进第 4 节。
6. **自检 P1–P6**：照下文 condition 中 P1–P6 自查。**不输出任何完成 sentinel**，evaluator 决定。

每轮严格保持「工作区干净 → 单次小步推进 → 工作区干净」。

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

## 2. Phase 2 范围对齐表（F1/F2/F5–F10 维持 DONE；本轮聚焦 F3/F4）
| 项 | 状态 | 最近改动 | 备注 |
| --- | --- | --- | --- |
| F1 frame 索引 | DONE | … | 53/53 URL 200 |
| F2 mana symbol | DONE | … | drawManaSymbols 行为对齐 |
| F3 collector 样式 | IN_PROGRESS | YYYY-MM-DD | 6 text object / brush icon / bottomInfoColor |
| F4 rule text 排版 | IN_PROGRESS | YYYY-MM-DD | side-by-side 对照中 |
| F5 watermark | DONE | … | drawWatermark + 双色 tint |
| F6 set symbol | DONE | … | rarity 颜色映射 + image upload |
| F7 rich-text token | DONE | … | 14 directive |
| F8 saga | DONE | … | chapter pip + ability lines |
| F9 planeswalker | DONE | … | loyalty cost + shield |
| F10 fixture 视觉证据 | DONE | … | 12 PNG 已 inline |

## 3. 本轮增量
- 目标项：F3 或 F4 的子片段 — …
- fixture 卡：…（至少 1 对 forger/conjurer 截图）
- 改动文件：…
- 改动概要：…
- 验证结果：typecheck ✅ / build ✅ / side-by-side 截图对照 ✅
- 两端截图对照逐卡条目：每张 fixture 一行，cardforger vs cardconjurer 的字号 / 位置 / 字体 / divider / italic 差异结论

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
