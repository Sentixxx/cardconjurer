---
title: /goal 多轮工作流
type: process
status: active
summary: 每轮迭代的执行顺序——环境就绪 / 体检 / 比对 / 最小增量 / 验证 / 落盘 / 自检
tags: [process, goal-loop, workflow]
related:
  - dev/process/parity-check
  - dev/standards/pitfalls
  - dev/testing/strategy
---

# `/goal` 多轮工作流

cardforger 的主体推进由 `/goal` 多轮循环驱动。每一轮的步骤、状态文件落盘、自检条款都在这里编排；什么算合格 / 不合格的判据归 `standards/`，证据形态归 `testing/`。

## 触发方式

`/goal` 的 Condition 由 [`GOAL.md`](../../../GOAL.md) 同根目录维护，粘贴整段 Condition 到 `/goal` 命令后启动。命令本体见 GOAL.md 顶部说明。

## 每轮执行顺序

### 0. 环境就绪 + transcript 自证

- cardforger dev 起在 7002？`npm run dev -- --port 7002 --host 0.0.0.0`
- 上游 cardconjurer 起在 7003？`cd /workspace/cardconjurer && python3 -m http.server 7003 --bind 0.0.0.0 &` + `curl -sI http://127.0.0.1:7003/ | head -1` 验证 200
- `public/img/`、`public/fonts/`、`public/gallery/`、`public/data/images/` 是否齐？缺则按 [`spec/assets.md`](../spec/assets.md) 初始化
- 把启动状态、URL 写到 `RENDER_PARITY_STATE.md` §0
- **每轮必须 Read 一次完整的 `RENDER_PARITY_STATE.md`** 让其文本落到 transcript（evaluator 只能看到 transcript 内容）

### 1. 体检

从 `RENDER_PARITY_STATE.md` §2 表格 / §3 活跃残差挑**最小、最独立**的一项作为本轮目标。

### 2. 比对（视觉证据）

在 cardforger（`/fixtures/<slug>` 或 `/creator` import）和 cardconjurer 上游各跑同一张 fixture，分别截图到 `/tmp/forger-<slug>.png` 与 `/tmp/conjurer-<slug>.png`。截图编排详 [`parity-check.md`](parity-check.md)。

transcript 至少 inline 显示其中一对 + 文字描述差异。

### 3. 最小增量

只改与本轮目标相关的文件。

按 [`standards/coding.md` §抽象引入](../standards/coding.md#抽象引入)判定要不要新建文件。禁止顺手 refactor / 改格式 / 改命名 / 动无关页面。

### 4. 验证（命令输出留在 transcript）

```bash
npm run typecheck
npm run build
git status
git -C /workspace/cardconjurer status
git diff --stat src/legacy-app/
```

后三条必须干净 / 空。

浏览器刷新后再截一次图，确认变化方向正确。

### 5. 落盘

更新 `RENDER_PARITY_STATE.md`：

- 本项状态、日期、改动概要
- 遗留问题
- 新增 workaround → §4

### 6. 自检 P1–P6

照 `GOAL.md` Condition 中的 P1–P6 自查。**不输出任何完成 sentinel**——`<promise>PARITY_DONE</promise>` 等已废弃，evaluator 决定。

## 不变量

每轮严格保持：

```
工作区干净 → 单次小步推进 → 工作区干净
```

跨轮维护：

- `/workspace/cardconjurer` 与 `src/legacy-app/` 在 cardforger 提交里 **0 diff**
- `tsc --noEmit` 退出码 0
- `vite build` 退出码 0
- 顶层运行时依赖数 ≤ 3（按 [`architecture/dependencies.md`](../architecture/dependencies.md) 的闸）

## 不做的事

- 不在 `/goal` 循环里做仓库重组（目录搬迁 / 重命名）
- 不在循环里改 `tsconfig*.json` / `vite.config.ts` / `package.json` 而不先在状态文件 §3 说明本轮为什么需要碰构建配置
- 不修改 `/workspace/cardconjurer/` 或 `src/legacy-app/`
- 不引入新顶层依赖而不先在 §5 登记
