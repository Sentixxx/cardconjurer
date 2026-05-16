---
title: 测试策略
type: testing
status: active
summary: 三道闸（typecheck / build / fixture 视觉证据）+ fixture 起点 + 视觉证据归档
tags: [testing, strategy, gates]
related:
  - dev/process/workflow
  - dev/process/parity-check
  - dev/spec/canvas-render
---

# 测试策略

cardforger 当前**没有单元测试 / e2e 测试**——产品价值集中在视觉对齐，单测对 Canvas 像素难以建模。验证证据由下列三道闸 + 视觉对照承担。

## 三道闸

### 闸 1：`npm run typecheck`

```bash
npm run typecheck   # = tsc --noEmit
```

退出码 0。strict 模式不允许任何 `any` / `@ts-ignore` 绕过，详 [`standards/coding.md` §typescript](../standards/coding.md#typescript)。

### 闸 2：`npm run build`

```bash
npm run build       # = tsc --noEmit && vite build
```

退出码 0；产物在 `dist/`。允许的 build 警告：

- 9 条 vite "did not resolve" 警告（`/fonts/*.ttf` × 8 + `/img/lowpolyBackground.svg`）—— dev-only，运行期由 `magic_resources` 填充
- 其他警告需在 `RENDER_PARITY_STATE.md` §5 登记

### 闸 3：fixture 视觉证据

每个 `/goal` 轮次至少在两端（forger / conjurer）跑同一张 fixture 截图。流程编排见 [`process/parity-check.md`](../process/parity-check.md)。

## fixture 起点

```
Lightning Bolt · Counterspell · Llanowar Elves · Hallowed Fountain ·
Atraxa Praetors' Voice · Jace the Mind Sculptor · Urza's Saga ·
Fire // Ice · Bonecrusher Giant · 任一 Phyrexian Praetor ·
Sheoldred the Apocalypse · Birgi God of Storytelling
```

共 12 张，覆盖：

- 短 / 长 rule text（Lightning Bolt vs Atraxa）
- mana ability 符号渲染（Llanowar Elves）
- 多色 / 混合 mana（Hallowed Fountain / Counterspell）
- flavor divider（Sheoldred）
- planeswalker loyalty（Jace）
- saga chapter（Urza's Saga）
- DFC / split / adventure（Fire // Ice / Bonecrusher Giant）
- Phyrexian / 上游 cn-release（Phyrexian Praetor / Birgi）

JSON 位于 `public/fixtures/<slug>.json`；通过 `/fixtures/:slug` 路由（详 [`spec/routing.md`](../spec/routing.md)）反序列化为 `CardData`。

## 视觉证据归档

证据类型与"是否入 git"的判据（具体路径与编排详见 [`process/parity-check.md` §输出归档](../process/parity-check.md#输出归档路径约定)）：

| 证据类型 | 入 git？ | 理由 |
|---|---|---|
| 单轮 transcript 截图（forger / conjurer 全图） | 否 | tmpfs 临时产物 |
| 单轮区段切片（collector / rules / title） | 否 | 同上；每轮重新生成 |
| milestone fixture 基线 PNG | 是（少量） | 代表性轮次留 git history 作可视回溯 |
| 当前 fixture 矩阵结论 | 是 | 落 `RENDER_PARITY_STATE.md` §3，跨轮永久 |

判据要点：

- 当轮产物默认不 commit——`RENDER_PARITY_STATE.md` §3 文字结论已足以让 evaluator + 下轮接手 agent 复原状态
- 只在 milestone 节点才 commit PNG（如 F10 fixture baseline，commit `d50921e` / `bdf5617`）

## 不做的事

- 不写 Jest / Vitest 单测覆盖 Canvas 渲染像素（成本 / 价值比差）
- 不引入 Playwright / Cypress 当下（cardforger 没有 e2e 流；fixture 截图已覆盖）
- 不在测试里 mock `localStorage` / `fetch`——服务层直接调原生 API，集成验证够用
- 不把 `/tmp/parity-shots/` 入 git（用 RENDER_PARITY_STATE.md 描述结论 + git history 留 milestone 即可）
