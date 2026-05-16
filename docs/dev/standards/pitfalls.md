---
title: 反复踩坑清单
type: standards
status: active
summary: Claude 在 cardforger 上反复掉过的坑——容器环境、上游对照、Canvas parity 三类禁区
tags: [pitfalls, standards]
related:
  - dev/spec/canvas-render
  - dev/spec/text-tokens
  - dev/spec/assets
  - dev/process/parity-check
---

# 反复踩坑清单

每一条都是真踩过、被纠正过的坑。本文是 `CLAUDE.md` 的实质内容；`CLAUDE.md`（→ `AGENTS.md` 软链）只承载入口索引。

## 容器与端口

- **`bind 127.0.0.1` 容器外访问不到**。dev / preview / 上游对照必须 `--host 0.0.0.0`：
  - cardforger dev：`npm run dev -- --port 7002 --host 0.0.0.0`
  - 上游 cardconjurer：`cd /workspace/cardconjurer && python3 -m http.server 7003 --bind 0.0.0.0`
  - 端口只能用 **7001–7020**，其它（如 7071）不暴露
- **`/tmp` 是 512 MB tmpfs**。解 `magic_resources` 大 archive（`img-frames-custom.tar.br` 897 MB）必须 `TMPDIR=/workspace/.tmp node scripts/init-assets.mjs /workspace/cardforger`
- **想 EnterWorktree 隔离改动**：本仓 `.claude/settings.local.json` 已设 `worktree.bgIsolation: "none"`，所有改动直接落主仓 `cardforger` 分支。不要再调 EnterWorktree，guard 报错也不必慌

## 上游基线（只读）

- **改 `/workspace/cardconjurer/` 或 `src/legacy-app/` 任意文件**：禁止。两者都是只读参考基线。要对照就启服务 + 读源码，不要 stage / commit 任何 diff
- **`src/legacy-app/` 与上游字面量冲突时**：以 `/workspace/cardconjurer/` 实际渲染为准（legacy-app 可能落后）

## 资源不入 git

运行时资源由 `magic_resources` 填充，`.gitignore` 已护住，**不要 `git add -f` 绕过**。完整目录清单与契约 → [`spec/assets.md`](../spec/assets.md)。

## Canvas parity 字段反例（只点错误对的反面，正例字段表见 spec）

- **collector 主字体**：**不是** `goudymedieval`。正确字体名与 6 段字段表 → [`spec/canvas-render.md` §字体清单](../spec/canvas-render.md#字体清单关键反复踩坑)
- **brush icon**：**不是** ASCII `✧`。正确字符 / 字体 → [`spec/canvas-render.md` §brush-icon](../spec/canvas-render.md#brush-icon)
- **bottomInfoColor**：**不要硬编码** `#f4f4f0`。受控规则 → [`spec/canvas-render.md` §bottominfocolor](../spec/canvas-render.md#bottominfocolor)
- **上游 collector 6 段默认全 continue**：直接 import 后截图会全空——4 个 checkbox / URL query / DOM input 三类前置条件全缺一不可。正例字段表 → [`spec/canvas-render.md` §触发渲染的-dom-条件上游](../spec/canvas-render.md#触发渲染的-dom-条件上游)

## 截图对照

本节只点坑名 + link 到详细编排；具体命令 / 步骤见 [`process/parity-check.md`](../process/parity-check.md)。

- **截上游图别走 `chromium --screenshot`**：字体 / 异步资源未就绪、卡片不在 viewport
- **MCP 容器里启不来时走 raw CDP**：不要再手写 driver——CLAUDE.md 时代已经造过轮子。详 [`process/parity-check.md`](../process/parity-check.md)
- **CDP `toDataURL` 单条会 hang**：dataURL ~4.5MB > CDP 单条消息上限，必须分块拉
- **侧对侧禁缩图**：两端 cardCanvas 尺寸不一致，`-resize` 把字糊掉；必须用 `-crop` 按相同 gravity / offset 切 region 1:1
- **frame pack 文件名带版本后缀**：`packM15Regular.js` 不存在，要用 `packM15Regular-1.js`。完整 pack 名 → 上游 `creator.html`

完整命令、步骤、等待时长、DOM 写入顺序 → [`process/parity-check.md`](../process/parity-check.md)；上游 DOM 触发条件 → [`spec/canvas-render.md` §触发渲染的-dom-条件上游](../spec/canvas-render.md#触发渲染的-dom-条件上游)

## 流程红线

- **`/goal` 循环里输出完成 sentinel**：`<promise>PARITY_DONE</promise>` 等已废弃，evaluator 自己判完成，假 sentinel 只污染 transcript
- **新增 React / UI / 状态 / 构建依赖**：顶层运行时只允许 `react` / `react-dom` / `wouter`。先在 `RENDER_PARITY_STATE.md` §5 登记必要性

## 关联文档

- 渲染契约本体 → [`spec/canvas-render.md`](../spec/canvas-render.md)
- token 与 import 预处理 → [`spec/text-tokens.md`](../spec/text-tokens.md)
- 资源路径 → [`spec/assets.md`](../spec/assets.md)
- 上游同卡 fixture 流程编排 → [`process/parity-check.md`](../process/parity-check.md)
