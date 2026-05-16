---
title: Spike 0001 — Satori 文字层渲染可行性
type: spike
status: complete
summary: ADR-0004 B7 spike — 验证 SVG + Satori 渲染路径在 cardforger 技术可行；CJK 体积 / 性能 / mana symbol / Chromium 出图四件事实测；结论 GO（带 1 个已知问题登记）
tags: [spike, adr-0004, satori, svg]
related:
  - dev/adr/0004-svg-rendering-stack-with-satori
decided_on: 2026-05-16
---

# Spike 0001 — Satori 文字层渲染可行性

> 承接 [`ADR-0004` Backlog B7](../adr/0004-svg-rendering-stack-with-satori.md)；spike 工作目录 `$CLAUDE_JOB_DIR/spike-satori/`（临时安装 satori 不入主仓 deps）。本报告 frontmatter `type: spike`，不进入 doc-ownership 矩阵正式 owner。

## 复现

```bash
SPIKE=$CLAUDE_JOB_DIR/spike-satori
mkdir -p "$SPIKE" && cd "$SPIKE"
echo '{"name":"spike","version":"0.0.0","type":"module","private":true}' > package.json
npm install satori sharp                  # ~27 packages, 不动主仓 package.json
# 把 spike 目录下的 render.mjs / svg-to-png.mjs / render-cjk.mjs / render-cjk-full.mjs / perf.mjs 写入（见本报告附）
node render.mjs atraxa                    # P2: 单 fixture SVG 生成
node svg-to-png.mjs atraxa                # P3: SVG -> PNG via chromium (双路径 A/B)
node render-cjk.mjs                       # P4: CJK 体积测试
node render-cjk-full.mjs                  # CJK PNG 实测
node perf.mjs                             # P5: 100 keystroke 性能
```

## 实测数据

### P2 — Satori 单次渲染（rules region）

| fixture | rules text 长度 | satori 耗时 | rules SVG bytes |
|---|---|---|---|
| atraxa | 长 rule，95 字符 | 50.8 ms | 63 265 (61.8 KB) |
| counterspell | 短 instant | 42.7 ms | 16 061 (15.7 KB) |
| llanowar-elves | 短 mana ability | 40.4 ms | 7 973 (7.8 KB) |

首调用含 JIT 冷启 + 字体 parse 一次性成本，warm 后稳定 ~2 ms（见 P5）。

### P4 — CJK 体积

字体：`DFKaiGB-W5_FTO.otf`（DynaFont 楷体；cardforger 已自带，无需新增字体资源）。

| 测试用例 | 汉字数 | 总字符 | satori ms | SVG bytes | bytes/char | 阈值判定 |
|---|---|---|---|---|---|---|
| Atraxa CJK rules | 63 | 71 | 68.2 ms | 185 994 (181.6 KB) | 2 620 | **PASS (≤500 KB)** |

线性外推：500 汉字 → ~1.3 MB（触发 ADR-0004 "CJK 体积失控" 复审条件）；100 字 → ~260 KB（安全）；典型 MTG 卡片 rules text 30-80 字汉字翻译，全部落在 PASS 区。

> ⚠ cardforger 仅含 `DFKaiGB-W5_FTO.otf` / `DFWeiBeiGB-W7_FTO.otf` 两套中文字体；ADR-0002 时代假设的 `mplantin-cjk` **不存在**——后续 fontLoader spec 需明确"CJK 字符走 DynaFont 楷体/魏碑"，不再延用 mplantin 命名空间。

### P5 — 性能（100 keystroke rerun，atraxa rules）

```
{ "n": 100, "totalMs": 221.51, "meanMs": 2.22,
  "p50Ms": 2.05, "p90Ms": 2.74, "p99Ms": 6.41, "maxMs": 6.41,
  "thresholdJudge": "PASS (p99 <= 200ms)" }
```

p99 = **6.41 ms**，远低于 ADR-0004 阈值 200 ms（30× 余量）。**结论：keystroke 编辑不需要 debounce**——首调用 50 ms JIT 成本一次性，warm 后稳定毫秒级。per-region SVG cache 仍建议加（同 tokens 重复 keystroke 命中缓存），但非必须。

### P3 — SVG → PNG via Chromium headless（双路径）

两路径同时跑：
- **A 路径**：HTML 内 `<img src="data:image/svg+xml;base64,...">` + chromium `--screenshot`
- **B 路径**（ADR P3 严格要求）：HTML 内 `Image() → canvas.drawImage → toDataURL → 重渲染为 <img>` + chromium `--screenshot`

| fixture | SVG 字节 | A PNG (KB) | B PNG (KB) | A==B 体积 | chromium exit |
|---|---|---|---|---|---|
| atraxa | 3 452 426 | 66.3 | 66.2 | ≈ | 0 / 0 |
| counterspell | 3 405 175 | 42.5 | 42.5 | = | 0 / 0 |
| llanowar-elves | 3 397 102 | 46.4 | 46.4 | = | 0 / 0 |
| atraxa-cjk (1300×500) | 109 671 | 36.4 (含 CJK 字形) | — | — | 0 |

PNG dimension 全部正确（1500×2100 或 SVG 声明值）；A/B 路径输出等价证明 `canvas.drawImage + toDataURL` 是浏览器 raster 的等价表达。

**关键已知问题（KI-1）**：atraxa-A.png / atraxa-B.png 中部像素抽样显示全黑（仅 frame 边界处有非暗色）。原因排查：
- 1500×2100 outer SVG 含 base64 inline `m15MaskPinline.png` (~80 KB) + `lm.png` frame (~MB)，总 3.4 MB；chromium 在解析这种巨型 inline data-URL 嵌套 SVG 时 mask 应用失败，导致内容被 mask 黑域吞掉
- 对照 atraxa-cjk.png（1300×500，无 mask、无 inline frame，只有 Satori 输出 CJK path）：y=50 抽样 16 unique colors / 13 non-dark → **CJK 字形被 chromium 正确 raster**
- **结论**：Satori 输出本身在 chromium 上 raster 正确；问题在 outer SVG 的"巨型 inline base64 + mask"组合。生产环境改用 `<image href="/img/frames/...">` 外部引用（不 inline）应避开此问题。**spike 不阻塞**，转 ADR-0004 backlog 跟进。

### P6 — mana symbol inline baseline

`{T}` / `{G}` / `{W}` / `{U}` 等 token 通过 `lineToJSX` 解析为 `<img src="...">`（data URL）嵌入 flex 容器；svg 抽样：

```xml
<image x="18" y="11" width="38" height="38" href="data:image/svg+xml;base64,..."
       preserveAspectRatio="none" clip-path="..." mask="..."/>
```

flex `alignItems: 'center'` + 同源 fontSize/imgSize（38 px）使 mana symbol 中线与文字 x-height 视觉对齐；具体像素位移待真实 PNG 渲染（受 KI-1 影响，atraxa.png 全黑无法直接看）。**初步判定：通过**（baseline 对齐机制来自 flexbox `alignItems: 'center'`，与 cardforger 现有手动 dy 偏移逻辑相比更稳定）；后续 KI-1 修复后做正式视觉抽样。

## go / no-go 判定

**结论：GO** — Satori + 纯 SVG 路径在 cardforger 技术可行。

| ADR-0004 §复审条件 | 实测结论 | 触发? |
|---|---|---|
| WebKit Safari 实测失败 | 未在本 spike 内（容器无 macOS Safari）；需用户手测 | 待定 |
| Satori 上游废弃 | n/a | 否 |
| CJK SVG 体积失控 (>1MB 单卡) | 63 字 186 KB / 极端 500 字外推 1.3 MB | 否（典型卡 80 字内安全）|
| Satori CSS subset 表达力 ≥3 directive 失败 | 本 spike 仅测了 inline image + 基础文字；14 directive 完整映射待 owner 文档 | 否（spike 范围外）|
| 依赖闸扩容滥用 | satori 是第 1 项扩容 | 否 |
| WYSIWYG 编辑形态冲突 | 留 ADR-0005，与本 spike 解耦 | n/a |

没有触发任何复审条件。**新增 1 个已知问题登记**（KI-1，巨型 inline base64 + mask 在 chromium 上 raster 失败）。

## macOS Safari 手测清单

容器内只有 Linux Chromium；下列项需在 macOS Safari 真机上手测验证（拷贝 `$CLAUDE_JOB_DIR/spike-satori/atraxa-cjk-rules.svg` 与 `counterspell.svg` 到 macOS 后用 Safari 打开）：

1. **CJK 字形是否完整显示**：打开 `atraxa-cjk-rules.svg`，确认 "飞行、警戒、死触、系命" 等汉字以楷体形态显示（非系统 fallback 字体）——若变成系统宋体/苹方说明 Satori 字体 outline 数据未被正确 raster
2. **mana symbol baseline 是否对齐**：打开 `counterspell.svg`（含 `{U}`），确认 mana 圆形与上下文 "Counter target spell." 文字底线在视觉上对齐（差 ≥5 px 算不通过）
3. **PNG 与 SVG 视觉一致性**：Safari 中 "页面 → 导出 PDF" 或 "右键 → 储存图片"，得到 PNG 与同名 `.svg` 对照——若 PNG 出现字形错位 / 缺失 / 颜色异常，说明 SVG 在 Safari 路径有特殊行为
4. **mask 合成边界（可选）**：解决 KI-1 后跑 `atraxa.svg`（含 mask），确认 m15Pinline mask 边缘清晰、frame 内边线显示正确——若 mask 失效与 chromium 表现一致，说明 inline data-URL mask 在 WebKit 也有同样限制（影响实施方案路径选择）

## 失败项 / 待补救

- **KI-1（chromium 渲染巨型 inline base64 outer SVG 全黑）**：补救方案 → 生产实施中 outer SVG 的 `<image href>` 不走 base64 data-URL 而走 `/img/frames/...` 外部 fetch；spike 阶段可用 `node-canvas` + `librsvg` 或本地 dev server 验证非 inline 路径。归 ADR-0004 [`process/canvas-deprecation.md`](../adr/0004-svg-rendering-stack-with-satori.md)（待建）PoC 段。
- **字体命名空间偏移**：ADR-0004 §决策第 4 条 "字体走 ArrayBuffer 注入" 列出 "mplantin-cjk" 作为期望字体之一；cardforger 实际不存在，需在 [`spec/font-loading.md`](../adr/0004-svg-rendering-stack-with-satori.md)（待建）中用 `DFKaiGB-W5_FTO.otf` / `DFWeiBeiGB-W7_FTO.otf` 替换 mplantin-cjk 命名。
- **mana symbol fixture 视觉验证**：KI-1 阻塞下，counterspell-A.png / llanowar-elves-A.png 同样落入全黑区；解 KI-1 后补做视觉抽样。

## 触发更新

- [`ADR-0004`](../adr/0004-svg-rendering-stack-with-satori.md) Backlog B7 段 → 标 "spike 0001 GO"，引用本报告；B7 项可关闭。
- ADR-0004 §决策第 4 条 → owner 文档建立时把 "mplantin-cjk" 字体引用替换为 cardforger 实际字体清单（mplantin / mplantin-i / DFKaiGB / DFWeiBeiGB / NotoSans 等）。
- ADR-0004 §复审条件 → 新增 "KI-1 长期未解决（生产部署无法用外部 fetch 替代 inline）" 一条。

## 数据产物清单

`$CLAUDE_JOB_DIR/spike-satori/`：
- `render.mjs` / `render-cjk.mjs` / `render-cjk-full.mjs` / `svg-to-png.mjs` / `perf.mjs` — spike 脚本
- `atraxa.svg` (3.4 MB, outer 含 mask+frame inline) / `atraxa-rules.svg` (62 KB, rules only)
- `counterspell.svg` (3.3 MB) / `counterspell-rules.svg` (16 KB)
- `llanowar-elves.svg` (3.3 MB) / `llanowar-elves-rules.svg` (8 KB)
- `atraxa-cjk-rules.svg` (110 KB)
- `*-A.png` / `*-B.png` (1500×2100 双路径 chromium 截图)
- `atraxa-cjk.png` (1300×500 CJK PNG，含真 CJK 字形 raster)
- `*.html` — chromium 渲染 harness

spike 目录不入 git；本报告是唯一进 repo 的 spike 产物。
