# CLAUDE.md — cardforger 常犯错清单

精简版，只列 Claude 反复掉过的坑。详细工作流见 `GOAL.md` / `RENDER_PARITY_STATE.md`。

## 一直犯的错

- **服务器 bind 127.0.0.1**：容器外访问不到。
  - vite dev：`npm run dev -- --port 7002 --host 0.0.0.0`
  - 上游 cardconjurer：`cd /workspace/cardconjurer && python3 -m http.server 7003 --bind 0.0.0.0`
  - 端口只能用 7001–7020，其它（如 7071）不暴露。
- **想 EnterWorktree 隔离改动**：本仓已设 `.claude/settings.local.json` 的 `worktree.bgIsolation: "none"`，所有改动直接落主仓 `cardforger` 分支。不要再调 EnterWorktree，也不要因为 isolation guard 报错就以为非开不可——guard 在本仓不会触发。
- **改 `/workspace/cardconjurer/` 或 `src/legacy-app/`**：两者都是只读参考基线。需要对照就启服务 + 读源码，不要 stage / commit 任何改动。
- **把 `public/img|fonts|gallery|data/images|data/site|favicon.ico` 加进 git**：这些由 `magic_resources` 运行时初始化，**不跟踪**。`.gitignore` 已护住，别手动 `git add` 绕过。
- **解 magic_resources 大 archive 用默认 /tmp**：`/tmp` 是 512 MB tmpfs，`img-frames-custom.tar.br` 897 MB 会 ENOSPC。必须 `TMPDIR=/workspace/.tmp node scripts/init-assets.mjs <root>`。
- **collector 字体记错**：上游 `setBottomInfoStyle()` 主字体是 **`gothammedium`**，artist 段内联切 **`belerenbsc`**，wizards/bottomRight 用 **`mplantin`**。不是 goudymedieval。改 F3 前对照 `/workspace/cardconjurer/js/creator-23.js:245–270`。
- **新增 React/UI/状态/构建依赖**：顶层运行时只允许 `react` / `react-dom` / `wouter`。要加先在 `RENDER_PARITY_STATE.md` 第 5 节登记必要性。
- **`/goal` 循环里输出完成 sentinel**：`<promise>PARITY_DONE</promise>` 这种已废弃，evaluator 自己判完成，假 sentinel 只会污染 transcript。
- **想用 chromium headless screenshot 拿上游对照图**：别走 `chromium --screenshot`（截整个 viewport，字体/异步资源未就绪、卡片可能不在视口里）。也别再手写 CDP driver——`chrome-devtools-mcp` 已经可用，直接调 `mcp__plugin_chrome-devtools-mcp_chrome-devtools__*` 工具：`new_page` 打开上游 7003 → `evaluate_script` 配 fixture → 取 `cardCanvas.toDataURL('image/png')` 写盘。`cardCanvas` 是 drawCard 的最终合成目标（1500×2100），`previewCanvas` (1005×1407) 是缩放预览不是首选。
- **MCP 驱动上游 fixture 同卡**（在 `evaluate_script` 里跑这段编排）：
  1. 上游 frame pack 是按需 `loadScript('/js/frames/pack<Name>.js')`（creator-23.js:573）异步装的，名字带版本后缀，`packM15Regular.js` 不存在，正确文件名是 `packM15Regular-1.js`（对应 creator.html 里 `<option value="M15Regular-1">`）。
  2. 装完 pack → `selectedFrameIndex=0; await addFrame([])` → 等 `frame.image.onload`（~1.5s）才会触发 drawFrames/drawCard。
  3. collector 区默认全部 continue 跳过：`bottomInfoEdited` (creator-23.js:5226+) 必须 `#enableCollectorInfo`+`#enableNewCollectorStyle`+`#enableCopyright`+`#enableWebsiteInfo` 都 checked 才写 wizards/bottomRight；NFS 行需要 url `?nfs` 才出。脚本里强制 flip 这 4 个 checkbox 再调 `setBottomInfoStyle()`+`bottomInfoEdited()` 才能看到 6 段 collector text。
  4. rules/title/type 直接写 `card.text.<key>.text` + `await drawTextBuffer()` 触发 writeText 异步渲染，~3s 后才稳定。
  5. 如果一定要脱 MCP 自己跑，Node 22 内置 `WebSocket`+`fetch` 能走 CDP raw protocol（范例：`/home/node/.claude/jobs/<job_id>/cdp-driver/conjurer-shot.mjs`），但首选 MCP，别重复造轮子。
- **chrome-devtools-mcp 容器里启不来**：MCP `new_page` 报 `Missing X server`。本容器无 X、`xvfb-run` 也没装；MCP plugin 配置写死没传 `--headless`/`--browserUrl`，临时改不了。短路径：自起 `/usr/bin/chromium --headless=new --no-sandbox --disable-gpu --user-data-dir=/tmp/chromium-9223 --remote-debugging-port=9223 about:blank`（dbus 报错可忽略），然后 Node 22 内置 WebSocket+fetch 走 raw CDP。MCP 暂时只能用在有显示器的环境里。
- **CDP 取 cardCanvas 时 `toDataURL` 单条返回会卡死**：cardCanvas 2010×2814 → PNG dataURL ~4.5MB > CDP 默认单条消息上限，evaluate 返回 hang。改成两步：先在 page 里 `window.__dataUrl = cardCanvas.toDataURL(...)`，再分块 `window.__dataUrl.slice(off, off+500000)` 拉回。
- **上游 collector 6 段被关默认 continue**：`bottomInfoEdited` (creator-23.js:5226+) 渲染逻辑要求**全部满足**：(a) 4 个 checkbox `#enableCollectorInfo` / `#enableNewCollectorStyle` / `#enableCopyright` / `#enableWebsiteInfo` 都 checked，(b) URL 带 `?nfs&wizards&copyright` 让 NFS / Wizards / 站点行不进 continue 分支，(c) DOM input `#info-{set,language,artist,number,rarity,year}` + `#extra-info` 都赋值（直接改 `card.infoXxx` 没用，bottomInfoEdited 第一步就从 DOM 重读覆盖）。
- **侧对侧比对禁缩图**：两边 cardCanvas 实际尺寸不一致（cardforger 1500×2100、conjurer 2010×2814 含 margins），`convert -resize 500` 会把字糊掉看不清。改用 `convert -crop` 切 region 1:1 像素对照：先 trim conjurer 边距到 1500×2100，再两边都按相同 gravity/offset 切 collector strip (`-gravity south -crop 1500x300+0+0`) / rules 区 (`-gravity center -crop 1500x600+0+200`) / title 区，每个切片独立 PNG，文件名 `<side>-<slug>-<region>.png`。
