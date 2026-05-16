---
title: 上游同卡视觉对照
type: process
status: active
summary: 用 chrome-devtools-mcp 或 raw CDP 驱动上游 fixture 同卡截图、像素级侧对侧切片对照
tags: [process, parity, screenshot, cdp]
related:
  - dev/process/workflow
  - dev/spec/canvas-render
  - dev/standards/pitfalls
  - dev/testing/strategy
---

# 上游同卡视觉对照

视觉对照是 `/goal` 每轮第 2 步（比对）的执行细节。流程编排在这里；fixture 起点 / 数量 / 归档要求归 [`testing/strategy.md`](../testing/strategy.md)；上游 DOM 触发条件 / 字段表归 [`spec/canvas-render.md`](../spec/canvas-render.md)。

## 工具选择顺序

1. **首选：`chrome-devtools-mcp`**（如容器有 X 或 MCP plugin 支持 `--headless`）—— `mcp__plugin_chrome-devtools-mcp_chrome-devtools__*` 一套工具
2. **fallback：raw CDP**（当 MCP 报 `Missing X server`）—— 自起 chromium headless + Node 22 原生 WebSocket + fetch 走 raw protocol

容器环境与已知坑见 [`standards/pitfalls.md` §截图对照](../standards/pitfalls.md#截图对照)。

## fallback：raw CDP

### 启 chromium

```bash
/usr/bin/chromium --headless=new --no-sandbox --disable-gpu \
  --user-data-dir=/tmp/chromium-9223 \
  --remote-debugging-port=9223 \
  about:blank
```

dbus 报错可忽略。

### Node 22 driver 模板

完整范例：`/home/node/.claude/jobs/<job_id>/cdp-driver/conjurer-shot.mjs`（不要重复造轮子；这是 B1 RESOLVED iter 6 的产物）。

### 关键步骤（在 page 上下文执行）

按 [`spec/canvas-render.md` §触发渲染的-dom-条件上游](../spec/canvas-render.md#触发渲染的-dom-条件上游) 完成 5 步：

1. **navigate**：`/creator/index.html?nfs&wizards&copyright` 注入 `/css/style-9.css`（fragment 页本身无 link，conjurer document.fonts registry 需 54 ready 才稳定）
2. **loadScript** + addFrame：上游 frame pack 按需异步装；`loadScript('/js/frames/packM15Regular-1.js')`（注意是 `-1` 后缀，不是 `packM15Regular.js`）→ `selectedFrameIndex=0; await addFrame([])` → 等 `frame.image.onload` ~1.5s
3. **DOM 填写**：`#info-{set,language,artist,number,rarity,year}` + `#extra-info` 全部赋值；flip 4 个 collector checkbox `#enableCollectorInfo` / `#enableNewCollectorStyle` / `#enableCopyright` / `#enableWebsiteInfo`
4. **触发渲染**：`setBottomInfoStyle()` + `bottomInfoEdited()` + `drawTextBuffer()` + `drawCard()`
5. **取 canvas**：cardCanvas 2010×2814 → PNG dataURL ~4.5MB > CDP 单条消息上限，**分两步**——先在 page `window.__dataUrl = cardCanvas.toDataURL('image/png')`，再分块 `window.__dataUrl.slice(off, off+500000)` 拉回，本地拼回再 base64-decode 落盘

直接 `evaluate` 返回 dataURL 会 hang，必踩。

## 像素级侧对侧切片

两端 cardCanvas 尺寸**不一致**：

- forger：1500 × 2100
- conjurer：2010 × 2814（含 margins，`highResScale` 1.34×）

切片前 trim conjurer 边距到 1500×2100：

```bash
convert /tmp/conjurer-<slug>.png -trim -resize 1500x2100 /tmp/conjurer-<slug>-trimmed.png
```

再两边按相同 gravity / offset 切区段：

| 区段 | 命令 |
|---|---|
| collector strip | `convert <in> -gravity south -crop 1500x300+0+0 <side>-<slug>-collector.png` |
| rules 区 | `convert <in> -gravity center -crop 1500x600+0+200 <side>-<slug>-rules.png` |
| title 区 | `convert <in> -gravity north -crop 1500x300+0+0 <side>-<slug>-title.png` |

每个切片独立 PNG，文件名 `<side>-<slug>-<region>.png`。**禁用 `-resize 500`**——会把字糊掉看不清。

## 输出归档（路径约定）

证据"几类、要不要入 git"的规则归 [`testing/strategy.md` §视觉证据归档](../testing/strategy.md#视觉证据归档)；本节落实具体路径与编排：

| 证据 | 路径 |
|---|---|
| 单轮 forger 截图 | `/tmp/forger-<slug>.png` |
| 单轮 conjurer 截图 | `/tmp/conjurer-<slug>.png`（trim 输出落 `/tmp/conjurer-<slug>-trimmed.png`） |
| 单轮区段切片 | `/tmp/parity-shots/<side>-<slug>-<region>.png` |
| 当前 fixture 矩阵结论 | `RENDER_PARITY_STATE.md` §3 |

编排：

- 当轮 PNG 全部落 `/tmp/`，**不入 git**
- transcript 至少 inline 一对（forger + conjurer，同 region），并附结论文字描述
- 结论同步落 `RENDER_PARITY_STATE.md` §3 表格——这是跨轮的永久证据
- milestone 节点（如 F10 fixture baseline）才把代表性 PNG commit 到 git history

## 不做的事

- 不用 `chromium --screenshot`（截 viewport，字体 / 资源未就绪）
- 不用 `previewCanvas` 当对照目标（缩放预览，不是 drawCard 输出）
- 不缩图对照（两端尺寸不一致 + 字号细节会糊）
- 不修改 `/workspace/cardconjurer/` 任何文件来"方便"截图（DOM 通过 driver 在 page 上下文设值，不写盘）
