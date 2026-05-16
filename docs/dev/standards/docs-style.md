---
title: 文档形态规范
type: standards
status: active
summary: Frontmatter schema、篇幅、语言、链接格式、代码块用法
tags: [docs, style]
related:
  - dev/standards/doc-ownership
  - dev/README
---

# 文档形态规范

## Frontmatter schema

`docs/` 下所有 active 文档（含 README）顶部必须有 YAML frontmatter：

```yaml
---
title: <标题>
type: architecture | adr | spec | process | standards | testing | index | root
status: active | draft | placeholder | deprecated
summary: <≤120 字一句话>
tags: [...]            # 可选；用于 grep / 后续工具
related: [...]         # 可选；相对 docs/ 的路径，不带后缀
---
```

ADR 文件加 4 个扩展字段：`supersedes` / `superseded_by` / `decided_on`。

frontmatter 字段语义：

- `title` — 用作 H1（H1 与 title 不一致时以 title 为准）
- `type` — 决定该文档落在哪个 owner（不能放错 owner 目录）
- `status` —
  - `active` — 当前有效
  - `draft` — 在写但尚未对齐
  - `placeholder` — 仅占位，等内容
  - `deprecated` — 仅留档，事实可能失效
- `summary` — 给 agent / 人类先扫的一句话；写满信息量，不写"本文介绍 X"
- `related` — 渐进披露用的相邻链接

## 语言

- 当前**中文优先**
- 外部接口名 / 文件路径 / 字段名 / 上游字面量保持英文 / 原貌
- 不机翻、不混排无意义的"&"

## 篇幅

- 每篇至少做到"读完能动手"或"读完能决策"；过长拆成 owner 内的兄弟文件
- README（索引型）保持 ≤ 80 行
- 单个章节超过屏幕（~30 行）考虑拆 H3

## 链接

- 相对路径，带 `.md` 后缀（如 `coding.md` / `../spec/canvas-render.md`），不省略后缀，方便 grep
- 跨 owner 必须走 link，不复述事实
- 锚点用 GFM slug 规则：lowercase + 删除标点（含中文全角括号 / 逗号）+ 空格转 `-` + CJK 字符保留；尽量避免链到含路径 / 反引号 / 冒号 / em-dash 等复杂字符的标题
- 行内提到上游路径用 inline code：`creator-23.js:245`

## 代码块

- 命令块加显式语言：```` ```bash ```` / ```` ```ts ```` / ```` ```json ````
- 字段表优先用 markdown table，不用伪 ASCII
- ASCII 图示（如拓扑）加 ```` ``` ```` 围栏即可（不指定语言）

## 不做的事

- 不在文档里写 emoji（除非用户明确要求）
- 不在 standards 写"何时" / "谁来" 编排（移到 process）
- 不在 spec 写"为什么" 论述（移到 adr）
- 不复制 / 粘贴上游代码大段；引用某一行即可（`creator-23.js:245–270`）
