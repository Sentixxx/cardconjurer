---
title: ADR-0003 upstream-as-output-reference
type: adr
status: proposed
summary: 上游 CardConjurer 从「字面量 ground truth」降级为「产物验证参考」；cardforger 渲染字段不再以 `creator-23.js` HEAD 为权威，差异判定改为同卡产物对照
tags: [adr, parity, upstream, posture]
related:
  - dev/adr/0002-canvas-rendering-region-tree
  - dev/spec/canvas-render
  - dev/standards/coding
  - dev/process/parity-check
supersedes: []
superseded_by: []
decided_on: 2026-05-16
---

# ADR-0003 upstream-as-output-reference

## 背景

cardforger 自 Phase 1 起以 [`CLAUDE.md` §核心原则 6](../../../CLAUDE.md)「上游字面量对齐」为协作硬约束：所有渲染相关字段（字号、字体名、token、颜色规则、collector 6 段顺序、frame alias 等）必须可在 `/workspace/cardconjurer/js/creator-23.js` HEAD 的某一行被指出来源，"凭直觉改良"视为违约（旧版段名 `spec/canvas-render.md §上游 ground truth`、`standards/coding.md §上游字面量对齐`——本 ADR 生效后段名已迁到 [`#上游产物对照参考`](../spec/canvas-render.md#上游产物对照参考) 与 [`#上游产物对照`](../standards/coding.md#上游产物对照)）。`/goal` 循环每轮 P3/P4 验收条件、`RENDER_PARITY_STATE.md` 表头都建立在这个前提上。

该 posture 起初的作用：把"渲染对不对"问题从"自己拍脑袋"还原为"对照上游某一行"，避免迁移期主观漂移。

但项目目标已转向独立产品形态，不再追随上游演化：

- 上游 conjurer 的渲染选择（vanilla Canvas 2D、collector 6 段顺序、token 集合、字号配比）来自其历史路径与 jQuery 时代约束，**对 cardforger 不构成产品级硬约束**——尤其在 WYSIWYG 编辑器、用户层 customTextLayers、saved-card schema v1 等场景下，cardforger 与上游分歧只会更大。
- 字面量级别对齐要求每动一处渲染相关字段都必须先定位上游对应行——这在 cardforger 已经开始引入"上游没有"的概念（如 `regionOverrides`、模板 schema v1）后变得既无法满足也无意义。
- parity 维护成本（双端启服务、同卡 fixture 截图、side-by-side 像素核对）随着 cardforger 偏离上游的扩大持续上升，但产出的是**已知会偏离**的差异列表，决策价值递减。

需要决策的是：上游的角色应该从"权威字面量来源"降级为什么？

## 选项

### 选项 A — 保留现状（上游 = 字面量 ground truth）

- 描述：维持 [核心原则 6] 不变；任何渲染字段偏离上游需在 `RENDER_PARITY_STATE.md` §3 / §6 登记理由。
- 优点：现有 `/goal` 验收条件 / `spec/canvas-render.md` 字段表 / `process/parity-check.md` 流程不需改动；reviewer 拒稿条件最锋利（指上游某一行即可）。
- 缺点：与"独立产品、不追随上游"的项目方向冲突；cardforger 已经出现的非上游概念（regionOverrides、模板 schema、saved-card v1）没有 owner 锚点；维护 parity 表的工作消耗持续递增但产出价值递减。

### 选项 B — 上游降级为产物验证参考（本 ADR 选项）

- 描述：上游 conjurer 仍保留只读 / 工作树干净 / 不入 cardforger diff 的边界（[核心原则 2](../../../CLAUDE.md) 不动）；但其**字段级字面量不再是 cardforger 渲染字段的权威来源**。上游降级为"渲染产物对照参考"——同卡 fixture 渲染产物在 [`process/parity-check.md`](../process/parity-check.md) 流程下作为参考样本，但具体字段（字号、字体、token、collector 顺序）由 cardforger 自身的 spec 文档承载，可以与上游不同。`/goal` 不再以"对齐上游"作为验收。保留 live parity-check（端口 7003 上游实例）是本 ADR 阶段选择；是否进一步降级为 frozen golden / 按需触发，留作后续 ADR（候选 ADR-0004 / -0005）。
- 优点：与项目独立产品方向一致；cardforger 自身 spec（`spec/canvas-render.md` / 未来的 `spec/template-schema.md`）成为唯一字段权威，消除"字段冲突时是看上游还是看自己"的模糊；解放维护负担。
- 缺点：必须改 [核心原则 6]、`spec/canvas-render.md` §上游产物对照参考（旧 §上游 ground truth）、`standards/coding.md` §上游产物对照（旧 §上游字面量对齐）、ADR-0002 §理由 #2 四处 load-bearing 引用；`/goal` GOAL.md 的 P3/P4 验收语义全部需要重写（属任务级，本 ADR 不承载，留作后续工作）；早期偏离上游的视觉差异失去"对齐上游某一行即可证明对"的兜底，reviewer 拒稿条件更依赖 cardforger 自己的 spec 完整度。

### 选项 C — 完全脱离，废止 parity-check 流程

- 描述：在 B 的基础上再退一步：上游不再作为任何参考；`process/parity-check.md` 整套流程废止；上游 conjurer 不再起服务对照。
- 优点：维护负担最小；项目完全独立。
- 缺点：**过激**——上游同卡产物作为"用户期望的 MTG 卡面视觉锚点"仍然有参考价值（尤其在新功能 / 新 frame 视觉合理性体检阶段）；废止 parity-check 会让"我做出来的卡和典型 MTG 卡是否在合理范围"失去任何外部锚点，回退成 cardforger 自闭。

## 决策

**选择 B**——上游降级为产物验证参考。

陈述层面四条钉死：

- **字段权威来源**：渲染相关字段（字号、字体名、token 集合、颜色规则、collector 段顺序、frame alias 等）的权威由 cardforger 自身 spec 文档承载（当前 [`spec/canvas-render.md`](../spec/canvas-render.md)、未来的 `spec/template-schema.md`）。与上游 `creator-23.js` 同名字段值不一致**不构成违约**，前提是 cardforger spec 已显式登记当前值。
- **上游角色**：`/workspace/cardconjurer/` 与 `src/legacy-app/` 保留只读边界（[核心原则 2] 不动）；作用降级为"产物对照参考"——对照流程 [`process/parity-check.md`](../process/parity-check.md) 保留，但用途从"证明 cardforger 字段对了"转为"作为 MTG 卡面视觉合理性的外部锚点之一"。
- **渲染选型独立**：本 ADR **不**决定 Canvas vs DOM/CSS vs 其它栈。ADR-0002 region-tree PoC 继续走 vanilla canvas（基于 mask 合成 / rich-text directive 的工程惯性，不再以 parity 为论据）。渲染栈本身的取舍另起 ADR-0004 承载。
- **既有偏离自动免责**：本 ADR 生效前 `RENDER_PARITY_STATE.md` §3 / §6 登记的"已知偏离上游"项不再视为 workaround，相关行可在下一次状态更新时清理。

## 理由

为什么 B 比 A / C 合适，挂钩到 cardforger 的具体约束：

1. **项目方向已变**——用户已明确"不准备追随上游，上游只作为产物的验证"；A 是直接违反这条方向，C 是过激切断。
2. **字段权威单源**——cardforger 已有 [`spec/canvas-render.md`](../spec/canvas-render.md) 承载渲染契约本体；按 [`standards/doc-ownership.md`](../standards/doc-ownership.md) SSOT 规则，同一事实不能既以 spec 为权威又以上游某一行为权威。降级是消除双 owner 冲突，不是新增 owner。
3. **维护负担与产出价值**——cardforger 已经出现的非上游概念（regionOverrides、模板 schema v1、saved-card migration、customTextLayers 用户层）按字面量对齐口径无法 anchor 到上游任何一行；继续维护 parity 表的 ROI 已经负值。
4. **不与 ADR-0002 冲突**——ADR-0002 §理由 #2 把"上游字面量对齐路径不变"列为选 E 的论据之一，但选 E 还有 §理由 #1（三依赖闸）、#3（L1/L2/L3 解耦）、#5（零新依赖）、#6（可分阶段并存）独立成立。删掉 #2 后选 E 仍然是 ADR-0002 的最优解；本 ADR 不影响 ADR-0002 的决策方向。
5. **保留对照流程**——C 选项废止 `process/parity-check.md` 会丧失"用户做出的卡和典型 MTG 卡视觉是否合理"的唯一外部锚点；B 保留流程但改用途，是 cost / value 平衡点。

## 后果

### 正向后果

- cardforger 渲染字段权威单源化（cardforger 自身 spec），消除"上游字面量 vs cardforger spec 冲突时看哪边"的歧义。
- `/goal` 循环不再以"对齐上游"为验收，verifier 拒稿条件改为 cardforger 自身 spec 的内部一致性 +（必要时）parity-check 产物在 MTG 卡面视觉合理范围内。**字段值差异本身不构成拒稿**；产物明显超出合理范围（错版 / 重叠 / 不可读 / 错位）可拒稿或要求调查。具体判据由 GOAL.md 重写承接，不在本 ADR 内枚举。
- cardforger 独立产品方向上的非上游概念（regionOverrides、模板 schema、用户层）获得正当 owner 锚点，不再以"上游没有所以暂时违约"形式存在。
- 维护 `RENDER_PARITY_STATE.md` parity 表 + 双端 fixture 同卡截图的成本下降；状态文件后续可以重构为"cardforger 自身已知问题 / blocker"而非"对齐上游残差"。

### 负向后果 / 接受的代价

- [核心原则 6] / `spec/canvas-render.md`（原 §上游 ground truth → §上游产物对照参考） / `standards/coding.md`（原 §上游字面量对齐 → §上游产物对照） / ADR-0002 §理由 #2 四处需要同步修订（联动改动属本 ADR 的"触发更新现有文档"段，下面列出）。
- GOAL.md 当前 Phase 2 收尾的整套 P3/P4 验收条件以"严格对齐 `creator-23.js:setBottomInfoStyle` 245–270"等字面量为锚——本 ADR 生效后这些条款语义失效，但 GOAL.md 重写属任务级工作，本 ADR 不承载；旧 GOAL.md 在重写完成前保留，按"任务已超出本 ADR 范围"处理。
- 早期偏离上游的视觉差异不再有"对齐上游某一行即可证明对"的兜底；reviewer 拒稿要更多依赖 cardforger 自身 spec 完整度——这是接受 cardforger 独立产品方向的成本，不可避免。
- 上游 conjurer 服务（端口 7003）仍然由 [`process/parity-check.md`](../process/parity-check.md) 流程使用，本 ADR 不删；后续若该流程也被废，由 ADR-0005 承载。

### 触发更新现有文档

下列文档随本 ADR 同 PR / 同任务一并改动（本 ADR 生效 = 这些文档的对应段已更新）：

- [`CLAUDE.md` §核心原则 6](../../../CLAUDE.md)——条目陈述从「上游字面量对齐：渲染相关字段以 `creator-23.js` 当前 HEAD 为权威」改为「上游产物对照：渲染产物在 parity-check 流程下与上游同卡渲染保持视觉合理范围，但字段不以上游 HEAD 为权威」；单链接切到本 ADR + `coding.md §上游产物对照`。
- [`spec/canvas-render.md`](../spec/canvas-render.md) §上游产物对照参考（原 §上游 ground truth）——表头"首要 ground truth；冲突以此为准"降级为"产物对照参考；字段冲突时以 cardforger spec 为准"；删除"必须可在上游某一行被指出来源"硬约束。同段并明示"字段值差异本身不构成拒稿；产物明显超出视觉合理范围可拒稿"的统一表述。本轮联动还包括：title / summary 去"对上游"措辞、字体清单"上游来源"列改名"历史溯源（参考）"、collector 6 段开头改"本节定义当前规定"、§不允许的偏离 / §受控偏离登记 去除"上游字面量"锚定。
- [`standards/coding.md`](../standards/coding.md) §上游产物对照（原 §上游字面量对齐）——节名 + 正文重写，与 §上游产物对照参考表述对齐。
- [`adr/0002-canvas-rendering-region-tree.md`](0002-canvas-rendering-region-tree.md) §理由 #2——加 amend note 说明 #2 不再 load-bearing（parity 已撤），但选 E 由 #1/#3/#5/#6 独立成立，决策方向不变。
- [`adr/README.md`](README.md) ADR 清单——加入 ADR-0003 行。

下列文档**本 ADR 不直接重写**，但已在本轮加入"强制性已松绑"注释，正式表述重写留作后续任务：

- `RENDER_PARITY_STATE.md`——表头 / §3 / §6 全套以 parity 为锚的字段需要重新组织；属 `/goal` 循环外的状态文件重写，另起任务。
- `GOAL.md`——Phase 2 P3/P4 验收条件需重写；属任务级工作。
- [`testing/strategy.md`](../testing/strategy.md) §闸 3 + §归档表——本轮已加"强制性已松绑"注 + "跨轮永久"→"按需 / milestone"，正式松绑（验收条件 / 强制度）等 GOAL.md 重写承接。
- [`process/parity-check.md`](../process/parity-check.md)——本轮已加"按需触发"注 + "跨轮永久证据"→"按任务需要登记 / milestone 同步"；流程动作不变，仅用途与触发条件含义变；正式重写等 GOAL.md 重写承接。
- [`process/workflow.md`](../process/workflow.md) §步骤 2 比对——本轮已把"每轮必跑两端截图"降级为"按任务需要触发"；workflow.md 是 `/goal` process owner，正式步骤重写等 GOAL.md 重写承接。

### 触发新建文档

无。本 ADR 的决策本体（字段权威单源 / 上游角色降级）已落到上面列出的 5 处现有 owner 文档；不新增 owner。

## 复审条件

满足下列任一事实出现时本决策应重新评估：

- **上游恢复跟随**：cardforger 项目方向重新改为"追随上游 conjurer 演化"——本 ADR 的前提（独立产品形态）不成立。
- **上游服务被废**：`process/parity-check.md` 流程废止 / 端口 7003 上游实例不再启动——本 ADR §决策中"上游降级为产物对照参考"的"对照"动作消失，需要重新评估上游 directory 是否还有保留必要。
- **字段 spec 双 owner 复发**：cardforger 自身 spec 与上游 `creator-23.js` 同名字段出现冲突且无法判定时（例如 reviewer 拒稿理由开始引用上游某一行作为权威），说明字段权威单源化未落实，需要复审实施细节。
- **产物对照判据失效**：parity-check 流程的产物对照在多次任务中均无法判定视觉合理性（无 owner 阈值 / 无可重复计数口径 / 同一类问题反复需要讨论才能定结论），说明上游降级后的"视觉合理范围"兜底定义太弱，需要补充对照判据 owner（候选 owner：[`testing/strategy.md`](../testing/strategy.md) 或 GOAL.md 重写承接）。判定为定性而非量化阈值——本 ADR 不维护连续次数计数。

---

**附**：本决策由单轮对话收敛——用户明确「不准备追随上游，上游只作为产物的验证」+ 主对话 1 次 scope 确认（确定为「新建 ADR-0003 + 联动现有 owner」+「渲染选型留作后续 ADR」），未经 GAN review。后续 review 发现的修订点可作为 amend 或新版 ADR 承载。
