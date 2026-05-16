---
title: 代码规范
type: standards
status: active
summary: TypeScript strict / 顶层依赖闸 / wouter 单边界 / 命名 / 抽象引入 / 注释判据
tags: [code, standards]
related:
  - dev/architecture/dependencies
  - dev/spec/canvas-render
  - dev/standards/pitfalls
---

# 代码规范

## TypeScript

- `tsconfig.app.json` `strict: true`，不允许放宽
- 不写 `any`（含 `as any`、`Record<string, any>`、隐式 `any`）
- 不写 `@ts-ignore` / `@ts-expect-error`；确属临时豁免在 [`../../../RENDER_PARITY_STATE.md`](../../../RENDER_PARITY_STATE.md) §4 登记
- 不使用 `noImplicitAny: false` / `skipLibCheck` 等放宽手段绕过 `npm run typecheck`
- 公共导出加显式返回类型（函数 `: T`，组件 `: JSX.Element`）

## 顶层依赖闸

当前 `dependencies` 的具体包名与版本见 [`architecture/dependencies.md`](../architecture/dependencies.md)——本节只承载扩容判据：

- 任何新增 `dependencies` 项**必须**先在 [`../../../RENDER_PARITY_STATE.md`](../../../RENDER_PARITY_STATE.md) §5 登记：(a) 必要性、(b) 替代方案评估、(c) 计划解除条件
- 未登记直接 `npm install` 加包，PR / commit 应被拒
- "上游 CardConjurer 用 vanilla JS 能做到的事，cardforger 加包做到"——通常算不合格，必须在登记理由里反驳

`devDependencies` 不受此闸限制。但任何 devDep 引入都要回答："npm 装完后 `node_modules/` 是否增加 >10 MB？跑 build 时是否被打入 dist？"

## wouter 单边界

`from 'wouter'` 字符串只允许出现在 `src/lib/router.ts`。理由与校验见 [`architecture/dependencies.md` §wouter 单边界](../architecture/dependencies.md#wouter-单边界)。

## 路径别名

- 跨目录 import 用 `@/` 绝对别名（指向 `src/`）
- 同目录或下一级用相对路径 `./xxx` `./sub/xxx`
- 禁止 `../../` 或更深的回跳

## 命名

| 类型 | 形态 | 示例 |
|---|---|---|
| 类型 / 接口 | PascalCase | `CardData`、`FramePreset` |
| React 组件 | PascalCase | `CardFaceForm`、`AppShell` |
| Hook | camelCase + `use` 前缀 | `useCardData`、`useFrameVersions` |
| Service 函数 | camelCase 动词 | `normalizeOracleText`、`resolveBottomInfoColor` |
| 文件名 | 与默认导出对齐 | `CardFaceForm.tsx` ↔ `export function CardFaceForm` |
| 常量 / 字面量集 | SCREAMING_SNAKE | `ROUTES`、`RARITY_COLORS`、`ITALIC_EXEMPTIONS` |

## 抽象引入

引入新函数 / 文件 / 模块前，做一次 deletion test：

> 如果把这层抽象删掉，谁会哭？

没人哭就不要引入。两段相似代码 ≠ 应抽象；三段以上 + 后续 ≥1 处可预见复用，才考虑提取。

## 注释

默认**不写**注释。**只**为下列情形写一行：

- 隐藏约束（"上游 `creator-23.js:245` 字面量，禁止改"）
- 反直觉的 workaround（"CDP toDataURL 单条 >500K 会 hang，分块拉"）
- 性能 / 数值临界（"binary fit minScale=0.48 是经验值"）

**禁止**：

- 解释代码"做什么"（命名应当自明）
- 引用任务编号 / PR 号（信息会腐烂）
- "added for X flow" 之类调用方信息（信息会腐烂）

## 错误处理

- 不写"以防万一"的 try / catch
- 系统边界（用户输入、`fetch`、`localStorage.getItem`、`Image.onerror`）才需要处理失败分支
- 内部纯函数信任入参（用类型系统兜底）

## 上游产物对照

> 由 [`adr/0003-upstream-as-output-reference.md`](../adr/0003-upstream-as-output-reference.md) 决策——上游 conjurer 是「产物验证参考」，不是「字面量权威」。

任何渲染相关的字段（字号、字体名、token 名、y 比例、颜色规则）的权威值由 [`spec/canvas-render.md`](../spec/canvas-render.md) 与未来的 `spec/template-schema.md` 承载，**不以上游 `creator-23.js` HEAD 为准**。
- 与上游同名字段不一致**不构成违约**，前提是 cardforger spec 已显式登记当前值
- "凭直觉改良"仍然违约——改字段值必须先动 spec 文档
- 同卡产物对照在 [`process/parity-check.md`](../process/parity-check.md) 流程下：**字段值差异本身不是 reviewer 拒稿条件**；产物明显超出 MTG 卡面视觉合理范围（错版 / 重叠 / 不可读 / 错位）可拒稿或要求调查。具体判据归 [`testing/strategy.md`](../testing/strategy.md) 或后续 GOAL.md 重写承接
- 偏离登记不再以"对齐上游"为锚；本节生效前 `RENDER_PARITY_STATE.md` §3 / §6 残留的"已知偏离上游"项可在下一次状态更新时清理
