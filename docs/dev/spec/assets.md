---
title: 资源路径契约
type: spec
status: active
summary: public/ 目录下哪些资源属于 magic_resources 运行时填充、初始化流程、不入 git 的目录清单
tags: [spec, assets, public]
related:
  - dev/architecture/dependencies
  - dev/standards/pitfalls
---

# 资源路径契约

## 来源仓库

[`Sentixxx/magic_resources`](https://github.com/Sentixxx/magic_resources)（Git LFS）。cardforger 的运行时资源**全部**来自这里——cardforger 仓内不跟踪资源文件本身，只跟踪路径契约与初始化脚本。

## 初始化流程

```bash
git clone https://github.com/Sentixxx/magic_resources /workspace/magic_resources
cd /workspace/magic_resources
git lfs install
git lfs pull
TMPDIR=/workspace/.tmp node scripts/init-assets.mjs /workspace/cardforger
```

`TMPDIR=/workspace/.tmp` **必须**：容器 `/tmp` 是 512 MB tmpfs，`img-frames-custom.tar.br`（897 MB）会 ENOSPC。

## 目录契约

| 路径 | 内容 | 不入 git |
|---|---|---|
| `public/img/frames/` | 99 个 frame family，~4.2 GB（最大资源热点） | ✓ |
| `public/img/manaSymbols/` | mana symbol PNG（含 hybrid / phyrexian / snow / 半通用） | ✓ |
| `public/img/watermarks/` | watermark PNG | ✓ |
| `public/img/setSymbols/` | set symbol PNG（按 set code + rarity）| ✓ |
| `public/img/samples/` | 范例艺术图 | ✓ |
| `public/img/tutorial/` | 教程页插图 | ✓ |
| `public/fonts/` | 56 个 @font-face 字体文件 | ✓ |
| `public/gallery/img/` | gallery 图（124 张） | ✓ |
| `public/data/images/` | 数据相关图 | ✓ |
| `public/data/site/` | 站点元数据（含 askUrza 字典等） | ✓ |
| `public/favicon.ico` | favicon | ✓ |
| `public/fixtures/` | parity fixture JSON | **入 git** |
| `public/data/` 其余 | 其它静态文本（如 `abilities.txt`） | **入 git** |

`.gitignore` 已经按上表护住所有 ✓ 项。**禁止 `git add -f` 绕过**。

## 资源 404 行为

- dev / build：404 **不阻塞**（vite build 期会 emit "did not resolve" 警告，dev-only）
- 运行期：浏览器侧 PNG / font 404 表现为占位 / fallback
- 每条**生产**意义上的 404 需在 [`../../../RENDER_PARITY_STATE.md`](../../../RENDER_PARITY_STATE.md) §5 登记

## 字体引入

`public/fonts/` 下 56 face；`global.css` 的 `@font-face` 列表必须与磁盘文件一一对应（路径 / family-name / weight / style）。新增字体需在 `RENDER_PARITY_STATE.md` §5 登记必要性（理由：字体增加 bundle 体积 + license 责任）。

## 不做的事

- 不把资源 stage / commit 到 cardforger 仓
- 不在 cardforger 修改 `magic_resources` 仓（它是独立 upstream）
- 不引入 CDN URL 硬编码（资源走相对 `/img/...` `/fonts/...` 路径，部署期由 host 提供 base）
