# Goal

参考 CardConjurer 已有实现，对齐 cardforger 在渲染时的实现与表现。

目标是让 cardforger 的最终渲染效果与 CardConjurer 保持一致。实现时以 CardConjurer 的现有逻辑、资源和布局为参考；如果 cardforger 的现有实现更合理、效果更好或兼容性更强，则不必为了代码形式一致而修改。

## Repository Context

- `cardforger` 是源码仓库，主要提交应用代码、配置、脚本和文档。
- `magic_resources` 是运行时资源仓库：`https://github.com/Sentixxx/magic_resources`。
- 大型资源不要提交到 `cardforger`。尤其不要提交：
  - `public/img/`
  - `public/fonts/`
  - `public/gallery/`
  - `public/data/images/`
  - `public/data/site/`
  - `public/favicon.ico`
- cardforger 可以继续引用稳定运行时路径，例如 `/img/...`、`/fonts/...`、`/gallery/img/...`、`/data/images/...`。这些文件由资源仓库初始化到 `public/`。

## Resource Repository

`magic_resources` 使用 Git LFS 保存 `.tar.br` 分包，并提供：

- `manifest.json`：记录每个资源包的目标路径、大小和 sha256。
- `scripts/init-assets.mjs`：把资源包解压到指定 cardforger 项目目录。
- `scripts/pack-assets.mjs`：从本地 `resources/` 重新生成资源分包。

初始化资源示例：

```powershell
git lfs install
git lfs pull
node scripts/init-assets.mjs <cardforger-root>
```

重新打包资源示例：

```powershell
$env:CARDFORGER_ROOT="<cardforger-root>"
node scripts/pack-assets.mjs
```

## Resource Packaging Strategy

- `img/frames` 是大量 PNG/JPG：
  - 如果目标是便于单文件更新，可以直接 Git LFS 管理单文件。
  - 如果目标是初始化速度和减少文件数量，按 frame family 打包，例如 `img-frames-m15.tar.br`。
  - 当前资源仓库默认采用 frame family 分包。
- `img/setSymbols`、`img/watermarks`、`img/manaSymbols` 是大量 SVG/小文件：
  - 打包压缩后进 Git LFS。
  - 避免直接提交大量小 LFS pointer。
- `data/images/cardImages`：
  - 按子目录或类别打包。

## Working Rules

- 修改 cardforger 时，不要把资源文件复制进 `public/` 并提交。
- 如果渲染修复需要新增或调整资源，应更新 `magic_resources`，而不是把资源放进源码仓库。
- cardforger 的构建可以在缺少 runtime resources 时通过；完整视觉验证需要先用资源仓库初始化 `public/`。
- 最终验收以渲染效果为准，而不是代码结构与 CardConjurer 完全一致。
