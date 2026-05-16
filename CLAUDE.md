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
