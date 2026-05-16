---
title: Commit message 形态
type: standards
status: active
summary: cardforger 当前不强制 Conventional Commits，但要求一行祈使句 + 触达模块前缀
tags: [git, commit]
related:
  - dev/process/workflow
---

# Commit message 形态

## 形态约束

- 第一行 ≤ 72 字符
- 第一行**祈使句**起头（"add" / "fix" / "refactor" / "docs" / "Phase 2 iter N: …"），不带句号
- 触达单一模块时加 scope：`fix(drawCollectorInfo): …`、`docs(architecture): …`
- 触达多模块或属于 `/goal` 迭代节点时用 `Phase <N> iter <M>: <一句话>` 前缀
- 与本轮迭代关联的状态文件改动放同一 commit
- 不写"WIP" / "fix things" / "update"

## 当前仓库已有的范式

观察 `git log` 几条样例足以归纳；不在此复述（信息会腐烂）。复审命令：

```bash
git log --oneline -20
```

## 不做的事

- 不强制 Conventional Commits 全套（cardforger 是单产品，scope 集合有限，无需强制语义版本生成器）
- 不写换行 body 说明上下文——理由属于 ADR / 状态文件，不属于 commit message
- 不把状态文件改动和代码改动分两个 commit（一同迭代节点必须原子）
