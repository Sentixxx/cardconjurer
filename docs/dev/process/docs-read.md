---
title: 文档读取约定
type: process
status: active
summary: 渐进式披露——按 frontmatter 决定是否全读；归档 / deprecated 文档读取规则
tags: [process, docs]
related:
  - dev/README
  - dev/standards/docs-style
---

# 文档读取约定

`docs/` 文档量虽然不大，但仍按渐进式披露读，避免无关全文进 context。

## 渐进披露三步

1. **不确定文档相关时**先看 frontmatter：

   ```bash
   head -10 docs/dev/<path>.md
   ```

   只读 YAML `summary` + `related` 决定是否全读。

2. **命中相关**：用 `Read` 全文读
3. **顺 `related` 链**探索上下文，必要时回到第 1 步

## 默认与限制

- `docs/dev/` 下 `status: active` 文档 → 直接 `Read`
- `docs/_deprecated/` 下任意文档 → **默认不读**；只在写 ADR 重述历史时引用
- `docs/_deprecated/` 文档的事实**不作为权威**——发现冲突以 `docs/dev/` 当前 owner 为准

## 文档作废流程

要把 `docs/dev/X.md` 作废：

1. 把文件移到 `docs/_deprecated/<topic>/X.md`
2. 改 frontmatter `status: deprecated`
3. 顶部加 banner：`> **DEPRECATED**：当前事实见 [<path>](…)`
4. 如有 `superseded_by` 关系（ADR），填到 frontmatter 对应字段
5. 在 owner 目录（`architecture/` / `spec/` / …）补写当前事实

## 不做的事

- 不在 active 文档引用 `_deprecated/` 当权威
- 不在 `_deprecated/` 维护事实（事实可能腐烂，只保留历史可溯）
- 不为了"留个备份"复制文档；用 git history 溯源即可
