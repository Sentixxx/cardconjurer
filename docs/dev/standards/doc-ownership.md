---
title: 文档事实归属
type: standards
status: active
summary: docs/dev/ 下各 owner 类型的事实容纳标准与跨 owner 冲突裁决
tags: [docs, layering, ssot]
related:
  - dev/standards/docs-style
  - dev/README
---

# 文档事实归属

按**内容约束的对象**判定 owner，不按内容出现的场景判定。

## Owner 矩阵

| 目录 | 容纳的事实类型 | 禁入类型 |
|---|---|---|
| **adr/** | 决策依据：**为什么**选 X 不选 Y | 契约定义、组合关系、流程编排、规则本体 |
| **spec/** | 契约事实：对上游 / 资源 / URL 承诺**是什么** | 决策论述、组合关系、产物形态规范 |
| **architecture/** | 组合事实：模块、依赖、数据流**怎么组合** | 契约定义、决策论述、流程编排 |
| **testing/** | 验证证据模型：用什么测试 / 截图 / fixture 证明对齐 | 契约定义、决策论述、组合关系、流程编排 |
| **standards/** | 价值标准：好与不好、准入与禁入、产物形态、规则本体 | 决策论述、流程编排（"何时检查 / 谁检查 / 失败处理"） |
| **process/** | 流程编排：何时做、谁负责、按哪份 standards 检查、门禁如何触发、失败如何处理 | 价值标准本体（"做 / 不做对照"、禁入清单、准入条件） |

`process/` 可以列 checklist，但 checklist 项只能写"按 `standards/X.md` 检查 Y"，不能复述 X 的标准本体。

## 判定流程

写一段内容前，按顺序问自己：

1. 它在解释**为什么选 X**吗？→ adr
2. 它在定义**承诺是什么**吗？→ spec
3. 它在说明**模块如何组合**吗？→ architecture
4. 它在定义**验证证据模型**吗？→ testing
5. 它在定义**什么算合格 / 不合格**吗？→ standards
6. 它在编排**何时做 / 谁做 / 按哪份 standards 检查 / 失败如何处理**吗？→ process

**强制单选**：一段内容只能命中一个问题。同时像两层（如"为什么 + 是什么"），把它拆成两段分别落到两层，互相 link，**不要在同一层写两段**。

## 冲突裁决

| 冲突 | 裁决 |
|---|---|
| `process` vs `standards` | 价值标准归 `standards`；`process` 写何时检查 / 谁检查 / 失败处理 |
| `process` vs `testing` | 测试触发 / 门禁归 `process`；验证证据模型归 `testing` |
| `standards` vs `spec` | 系统对外承诺归 `spec`；产物形态判据归 `standards` |
| `architecture` vs `spec` | 组合事实归 `architecture`；契约事实归 `spec` |
| `adr` vs 任意 | 决策理由归 `adr`；决策后的事实 / 标准 / 编排归对应 owner |

## 引用规则

跨目录引用统一：**只 link，不复述**。

允许：

- 指向 owner 文档或章节的链接
- 单词级术语提及（读者无法仅凭该句还原完整事实）

禁止：

- 在非 owner 文档展开定义、字段表、字面量
- 用改写后的自然语言在非 owner 文档复述同一事实

判据：读者从这一句能否独立得出该事实的完整内容；能 → 复述；不能 → 提及。

## Reviewer 拒稿条件

PR 里出现下列模式直接退回：

- 非 owner 文档出现可独立还原的事实定义 → 改成 owner 链接
- `process/` 出现禁入清单 / 准入条件 → 拆到 `standards/`
- `standards/` 出现"何时检查 / 谁负责" → 拆到 `process/`
- 接口字段 / 字面量出现在 ADR / architecture → 拆到 `spec/`
- 决策论述出现在 spec / architecture / standards → 拆到 `adr/`
- 同一事实在两个文件可独立成立 → 保留 owner 定义，其他改 link
