# 07 后续拆分路线图

## 总原则

Creator 和资源体系不能靠一次大重写解决。应按依赖方向逐步拆分：

1. 先稳定资源 URL 和加载策略。
2. 再提取无副作用 helper。
3. 再建立状态边界。
4. 再拆渲染和导入服务。
5. 最后替换 inline handler 和 legacy global script。

每一步都要保留 public path 兼容和测试门禁。

文件目录层面的目标结构和迁移顺序见：

- [09 目标文件架构](09-target-file-architecture.md)
- [10 文件架构迁移计划](10-file-architecture-migration-plan.md)

## 阶段 1：资源 URL 与 CDN 策略

目标：

- 明确主站资源和高清 frame 资源的分层。
- 集中管理 `fixUri` 和 asset base。
- 支持高清 frame 走独立 CDN。
- 保持 canvas CORS 安全。

产出：

- `assetBase` 配置入口。
- frame thumbnail 和 full frame URL 规则。
- CDN/CORS 部署说明。
- 慢网加载反馈和失败重试策略。

当前状态：

- `fixUri()` 已支持 `globalThis.CARD_FORGER_ASSETS`。
- `frameHiresBase` 可将非 `*Thumb.png` 的 `/img/frames/**/*.png` 指向高清资源 CDN。
- `frameThumbnailBase` 和 `assetBase` 已预留，但默认不启用。
- `test/creator-contract.test.mjs` 覆盖默认行为和 split frame asset base 行为。

风险：

- CORS 配错会导致 canvas 导出失败。
- URL 规则分散会导致部分 frame 找不到。

## 阶段 2：纯 helper 提取

优先提取：

- URL helper。
- image preload helper。
- text font helper。
- text parser helper。
- import formatter helper。
- localStorage key helper。

约束：

- 不改变 DOM。
- 不改变全局 `card` 结构。
- 不改变 frame script 加载模型。
- 进入更大运行时拆分时按面向对象边界推进：用 builder/strategy/formatter/mapper 等模式承载
  稳定职责，避免继续把每个微 helper 拆成独立文件；不要把兼容适配层作为新目标。

判断标准：

- 提取前后测试通过。
- 提取模块可以在 Node test 中直接 import。

## 阶段 3：状态边界

目标：

- 把 `card` 的读写路径显式化。
- 识别哪些函数只读状态，哪些函数会修改状态。
- 为后续拆 canvas renderer 和 import service 做准备。

可能产出：

- `creator/state` 模块。
- `createDefaultCard()`。
- `cloneCardForStorage()` 的独立模块化。
- card mutation helper。

暂不做：

- 不引入复杂状态库。
- 不把 Creator UI 改成 React state。

## 阶段 4：Frame catalog 数据化

目标：

- 保留现有 `/js/frames/*.js` public path。
- 生成或维护 frame pack manifest。
- 逐步把 `availableFrames` 构造从脚本副作用转为数据返回。

顺序：

1. 为典型 pack 建等价测试。
2. 把单个低风险 pack 转为数据模块。
3. 生成兼容 wrapper，仍能通过 `loadScript()` 工作。
4. 批量迁移 pack。
5. 最后迁移 group/version/manaSymbols。

风险：

- version 脚本不仅提供数据，还会设置 art bounds、text fields、watermark 等布局。
- 自动选框依赖现有 frame factory。
- 一次性迁移 372 个 pack 风险过高。

## 阶段 5：渲染服务拆分

候选模块：

- canvas manager。
- frame compositor。
- text layout engine。
- symbol renderer。
- export/download service。

建议顺序：

1. canvas 尺寸和 scaling helper。
2. frame image load/composition。
3. export/download。
4. text layout engine。

文本布局最后拆，因为规则最多、回归面最大。

## 阶段 6：导入服务拆分

候选模块：

- Scryfall adapter。
- MTGCH adapter。
- local SQLite adapter。
- imported card normalizer。
- layout-specific parser。

建议：

- 先拆网络 adapter。
- 再拆纯 parser。
- 最后拆和 DOM/card state 绑定的 apply 流程。

## 阶段 7：UI 事件现代化

只有当前面阶段完成后，才考虑：

- 移除 inline handler。
- 把 Creator 控件变成显式事件绑定。
- 减少全局函数暴露。
- 用模块入口初始化页面。

不要在 runtime 单体仍然存在时提前做这一步。否则会同时触碰 DOM contract、事件
模型和全局状态，回归成本很高。

## 优先级建议

近期最高优先级：

1. 高清 frame CDN 分层。
2. frame thumbnail 懒加载/虚拟化。
3. `creator-23.js` 纯 helper 提取。
4. verify 已知 hash mismatch 清理。
5. 资源发布过滤脚本，避免平台文件和冷资源无差别上主站。
6. 文档化并固化线上发布集，区分 `dist` 兼容全集和 OSS 主站公开集。

中期优先级：

1. frame pack manifest。
2. import adapter 拆分。
3. canvas export service。

长期优先级：

1. frame catalog 数据化。
2. text layout engine 模块化。
3. Creator UI 事件模型现代化。

## 不建议现在做的事

- 不要一次性把 `creator-23.js` 拆成多个随意命名文件。
- 不要在 `card` 状态边界明确前引入复杂状态库。
- 不要先移除 inline handler。
- 不要一次性把 372 个 pack 脚本改成新格式。
- 不要盲目把高清 PNG 全转 WebP/AVIF；透明通道、canvas 输出质量和浏览器兼容都要验证。
