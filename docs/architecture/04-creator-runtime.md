# 04 Creator 编辑器运行时

## 当前定位

Creator 是项目中最复杂的用户工作流。它不是一个单纯页面，而是一个浏览器端卡牌
编辑器：读取用户输入，加载牌框、字体、符号、卡图和真实卡牌数据，最终在 canvas
中合成并导出卡图。

静态 HTML 已经组件化，但运行时仍主要在：

- `src/app/js/creator-23.js`

这个文件仍是 legacy 全局脚本，约 9k+ 行。部分低风险纯 helper 已开始从单体中抽出，
但公开入口仍保持 `/js/creator-23.js`。

## 为什么它仍然大

`creator-23.js` 同时承担了这些职责：

- 全局 `card` 对象和编辑器状态。
- canvas 初始化、工作 canvas 管理和最终绘制。
- 牌框、蒙版、卡图、系列图标、水印、底部信息的组合。
- 文本布局、inline 标记解析、字号缩放、换行、对齐、描边、阴影。
- mana symbol 渲染和 Safari 特殊处理。
- frame group/pack/version 脚本动态加载。
- 自动选框和多种 frame factory。
- Scryfall、MTGCH、本地 SQLite 数据源导入。
- localStorage 保存/加载。
- 批量下载 ZIP。
- 文件上传、剪贴板、URL 图片加载。
- 各类 DOM 控件绑定和初始化。

所以 creator 大，不是因为 `creator/index.html` 没拆，而是因为运行时领域逻辑还没拆。

## 静态组件边界

静态 UI 已拆到：

- `src/framework/pages/creator/CreatorFrameSections.mjs`
- `src/framework/pages/creator/CreatorTextSections.mjs`
- `src/framework/pages/creator/CreatorArtSections.mjs`
- `src/framework/pages/creator/CreatorSetSymbolSections.mjs`
- `src/framework/pages/creator/CreatorWatermarkSections.mjs`
- `src/framework/pages/creator/CreatorBottomInfoSections.mjs`
- `src/framework/pages/creator/CreatorImportSections.mjs`
- `src/framework/pages/creator/CreatorMenuSections.mjs`
- `src/framework/pages/creator/CreatorControls.mjs`

这些组件目前仍是 legacy runtime 的 DOM provider，而不是状态驱动 UI。

## 运行时状态

核心状态包括：

- `card`：当前卡牌模型，包含尺寸、牌框、卡图、系列图标、水印、版本、mana symbols 等。
- `availableFrames`：当前 frame pack 暴露的可选牌框。
- `selectedFrameIndex`、`selectedMaskIndex`、`selectedTextIndex`。
- `loadedVersions`：避免重复加载特殊版本脚本。
- `replacementMasks`：特定版本的 mask 替换规则。
- 多个 canvas/context 全局变量。
- localStorage 中的用户默认项和保存卡牌。

这说明第一阶段拆分不能先做 UI 重写，应先明确 state ownership。

另一个关键点：`creator-23.js` 顶层会直接访问 DOM 并写值，例如初始化
`#info-year`、获取 `#previewCanvas`。因此脚本执行顺序要求 Creator DOM 已经存在。
这也是它现在作为 fragment 尾部 defer 脚本加载的原因之一。

## DOM 契约

Creator 运行时大量依赖固定 DOM ID 和 inline handler。典型 ID：

- `previewCanvas`
- `selectFrameGroup`
- `selectFramePack`
- `loadFrameVersion`
- `frame-picker`
- `mask-picker`
- `selectedPreview`
- `frame-list`
- `text-editor`
- `import-name`
- `import-index`
- `load-card-options`

`test/creator-contract.test.mjs` 会保护这些契约。

## Frame 脚本机制

frame catalog 不在一个 JSON 数据层里，而是一组动态加载的全局脚本：

- `src/app/js/frames/group*.js`
- `src/app/js/frames/pack*.js`
- `src/app/js/frames/version*.js`
- `src/app/js/frames/manaSymbols*.js`

规模：

- 15 个 group 脚本。
- 372 个 pack 脚本。
- 9 个 version 脚本。
- 14 个 manaSymbols 脚本。
- 总计约 1.48MB。

加载方式：

```js
loadScript("/js/frames/group" + value + ".js")
loadScript("/js/frames/pack" + value + ".js")
```

这些脚本通过全局变量和 DOM 副作用工作，例如：

- 设置 `availableFrames`。
- 调用 `loadFramePack()`。
- 设置 `#loadFrameVersion` 的 onclick。
- 修改 `card.version`、art bounds、text fields 等。

因此，frame catalog 迁移要先生成等价数据，再替换执行模型。

三类代表文件：

- `src/app/js/frames/groupStandard-3.js`：调用 `loadFramePacks([...])` 注册 pack 下拉。
- `src/app/js/frames/packM15Regular-1.js`：设置 `availableFrames`，并绑定
  `#loadFrameVersion.onclick`。
- `src/app/js/frames/versionPlaneswalker.js`：特殊版本脚本，会追加 DOM、创建 canvas、
  修改 `card.planeswalker`，不是纯数据。

## 文本渲染

文本系统是高风险区域。它包含：

- 自定义 inline 代码解析。
- mana symbol token 渲染。
- italic/bold/font/color/size/shadow/outline/kerning 等状态。
- 中文标点和间距处理。
- rules/flavor reminder 处理。
- overflow shrink、one-line、justify、arc text 等布局规则。

大量单元测试已经围绕这些 helper 建立，后续拆分应优先抽纯函数并保持测试。

## 导入与保存

导入系统包含：

- Scryfall 远程请求。
- MTGCH 搜索、详情、版本映射和 fallback image。
- 本地 SQLite 搜索，按需加载 sql.js。
- 多语言处理。
- 多面牌、saga、class、leveler、prototype、mutate、vanguard、station 等特殊布局解析。

保存系统包含：

- localStorage 卡牌保存。
- 卡牌列表维护。
- 保存卡牌导入/导出。
- 批量 ZIP 下载，按需加载 JSZip。

导入和保存逻辑可拆，但要避免同时改动 UI、网络和解析行为。

## 近期已改的加载体验

当前 `creator-23.js` 已加入高清 frame asset 的预热和加载反馈：

- 选中 frame/mask 后后台预热当前高清素材。
- 点击添加时并发等待 frame + mask 资源。
- 加载慢时提示用户。
- 加载失败时不把半加载 frame 插入卡片。

这解决的是慢网感知问题，不等于资源体系已经完成拆分。

## Asset URL 与 CDN 配置

Asset URL 策略已先抽出纯模块：

- `src/creator/assets/asset-url.mjs`
- `src/creator/assets/frame-preload.mjs`
- `src/creator/text/text-fonts.mjs`
- `src/creator/text/write-text-content.mjs`
- `src/creator/text/write-text-conditional-color.mjs`
- `src/creator/text/write-text-style.mjs`
- `src/creator/text/write-text-mana.mjs`
- `src/creator/text/write-text-transform.mjs`
- `src/creator/text/write-text-roll.mjs`
- `src/creator/text/write-text-controls.mjs`
- `src/creator/text/write-text-positioning.mjs`
- `src/creator/text/write-text-layout.mjs`
- `src/creator/storage/saved-card-data.mjs`
- `src/creator/imports/import-clipboard-text.mjs`
- `src/creator/imports/import-options.mjs`
- `src/creator/imports/import-search-options.mjs`
- `src/creator/imports/import-url.mjs`
- `src/creator/imports/import-card-basics.mjs`
- `src/creator/imports/import-printing.mjs`
- `src/creator/imports/import-text-preservation.mjs`
- `src/creator/imports/import-multi-faced.mjs`
- `src/creator/imports/import-unique-layout.mjs`
- `src/creator/imports/import-station-layout.mjs`
- `src/creator/imports/import-station-parser.mjs`
- `src/creator/imports/import-roll.mjs`
- `src/creator/imports/import-text-fields.mjs`
- `src/creator/imports/import-planeswalker.mjs`
- `src/creator/imports/import-saga.mjs`
- `src/creator/imports/import-class.mjs`
- `src/creator/imports/import-unique-layout-parsers.mjs`
- `src/creator/text/text-fields.mjs`

`src/app/js/creator-23.js` 源文件不再重复实现这些 helper。构建时
`scripts/lib/creator-compat.mjs` 会读取登记的 `src/creator/*` 纯模块，把
`export function` 形式的函数转成 classic-script 兼容前导块，并由 `scripts/build.mjs`
写入 `dist/js/creator-23.js` 的开头。

因此浏览器中仍存在 legacy 全局函数名，例如 `fixUri()`、`isFrameAssetPreloadable()` 和
`collectFrameAssetSources()`；源码中的行为事实源则是 `src/creator/`。默认不设置配置时，
`/img/...`、`/js/...` 等路径仍按原 public path 输出。

可选配置需要在 `/js/creator-23.js` 执行前注入：

```html
<script>
globalThis.CARD_FORGER_ASSETS = {
  frameHiresBase: 'https://assets.example.com',
  frameThumbnailBase: 'https://static.example.com',
  assetBase: 'https://site.example.com'
};
</script>
```

当前规则：

- `frameHiresBase`：只作用于 `/img/frames/**/*.png` 中非 `*Thumb.png` 的高清 frame。
- `frameThumbnailBase`：只作用于 `/img/frames/**/*Thumb.png`。
- `assetBase`：作为其他绝对 public path 的可选 fallback。
- `http(s):`、`data:`、`blob:` URL 不会再被加 base。

生产上优先只配置 `frameHiresBase`，让高清 frame 指向 `release/assets-hires` 对应的
CORS-enabled CDN；缩略图、脚本和 SVG frame 暂留 `release/site`，直到后续热资源域
和真实 CDN 导出验证完成。

这一步没有改变 Creator 页面脚本加载方式：`/js/creator-23.js` 仍是兼容入口，没有新增
公开 JS path。后续继续拆 helper 时，应优先把纯函数放入 `src/creator/`，再通过同一
build-time compat 机制保持 legacy 全局名。

Text font helper 已聚合到 `src/creator/text/text-fonts.mjs`：
`fontLoadDeclaration()`、`normalizeFontFamilies()`、`collectTextObjectFonts()`、
`collectTextObjectsFonts()`、`buildWriteTextFontDeclaration()`、
`startWriteTextItalicFontState()`、`endWriteTextItalicFontState()`、
`startWriteTextBoldFontState()`、`endWriteTextBoldFontState()`、
`applyWriteTextFontState()`、`resolveWriteTextFontCode()` 和
`applyWriteTextBelerenGlyphs()` 由 build-time compat 前导块提供 legacy 全局名。它们处理
font load declaration、text-object font discovery、font 字符串、italic/bold 状态、
font code 解析和 Beleren glyph 替换；`ensureFontsReady()` 和 `ensureTextFontsReady()`
仍留在 `creator-23.js`，因为它们直接依赖浏览器 `document.fonts` 和绘制流程。
`getSelectedTextField()` 也已拆到 `src/creator/text/text-fields.mjs`，用来继续保护
text field 插入顺序和可变引用契约。

Write-text content 处理已聚合到 `src/creator/text/write-text-content.mjs`：
`isWriteTextReminderManagedField()`、`getWriteTextFlavorMarkerIndex()`、
`splitWriteTextRulesFlavorText()`、`applyWriteTextReminderOptions()`、
`shouldUseWriteTextCopyright()`、`applyWriteTextCopyright()`、
`applyWriteTextInlineCardName()`、`removeWriteTextEmptyArtistMarker()`、
`normalizeWriteTextSeparators()`、`applyWriteTextFlavorVersion()`、
`applyWriteTextFontMarkers()`、`normalizeWriteTextRawText()`、
`tokenizeWriteTextRawText()`、`filterWriteTextManaCostTokens()`、
`isWriteTextCodeToken()`、`appendWriteTextVerticalCharacters()` 和
`buildWriteTextVerticalTokens()` 由 build-time compat 前导块提供 legacy 全局名。它们处理
rules/flavor 边界、reminder 选项、raw text 归一化、flavor/copyright marker、
tokenization、mana-cost token 过滤和竖排 token 展开。

Write-text conditional color 也已拆到 `src/creator/text/write-text-conditional-color.mjs`：
`normalizeWriteTextConditionalToken()`、`parseWriteTextConditionalColorParts()`、
`parseWriteTextConditionalFrameRule()`、`matchesWriteTextConditionalFrameRule()` 和
`resolveWriteTextConditionalColor()` 由 build-time compat 前导块提供 legacy 全局名。
依赖这些函数的旧源码 helper 继续留在 `creator-23.js`，并通过 compat 前导块获得同名全局
函数。

Write-text style 处理已聚合到 `src/creator/text/write-text-style.mjs`：
`getWriteTextInitialColor()`、`getWriteTextShadowSettings()`、
`isWriteTextBottomInfoBorderField()`、`getWriteTextOutlineSettings()`、
`applyWriteTextLineContextBaseStyles()`、`resolveWriteTextLineStyleCode()`、
`applyWriteTextLineStyleState()`、`resolveWriteTextShadowCode()`、
`applyWriteTextShadowState()`、`resolveWriteTextColorCode()`、
`applyWriteTextFillColor()` 和 `resolveWriteTextSizeCode()` 由 build-time compat 前导块提供
legacy 全局名。它们处理初始 fill/shadow/outline 状态、outline/line cap/join token、
shadow token、conditional/font color 和 fontsize token，继续复用 conditional color helper，
并保持 `scaleWidth()`/`scaleHeight()` 全局尺寸换算契约。

Write-text mana 处理已聚合到 `src/creator/text/write-text-mana.mjs`：
`resolveWriteTextManaColorCode()`、`resolveWriteTextKerningCode()` 和
`applyWriteTextKerningCode()`、
`isSafariUserAgent()`、`getManaSymbolRenderImages()`、`drawManaSymbolImage()`、
`drawManaSymbolOutline()` 和 `renderManaSymbolQueue()` 等由 build-time compat 前导块提供
legacy 全局名。它们处理 mana symbol color/letter-spacing token、Safari SVG 合成、
outline canvas 绘制和 mana symbol 队列渲染；kerning 仍保留旧的 `lineContext.font` 刷新副作用，
`writeText()` 的 token 循环、队列填充和文本布局主流程仍留在 `creator-23.js`。

Write-text transform 处理已拆到 `src/creator/text/write-text-transform.mjs`：
`shouldApplyWriteTextPtShift()`、`resolveWriteTextPtShiftCode()` 和
`resolveWriteTextTransformCode()` 由 build-time compat 前导块提供 legacy 全局名。它们只解析
pt-shift、perma-shift、arc radius/start 和 rotation token，并继续保持 `scaleWidth()`/
`scaleHeight()` 全局尺寸换算契约。

Write-text roll 处理已拆到 `src/creator/text/write-text-roll.mjs`：
`resolveWriteTextRollColorCode()` 和 `resolveWriteTextRollCode()` 由 build-time compat
前导块提供 legacy 全局名。它们只解析 roll color 和 d20 roll state token，不接触 DOM
或 canvas 绘制。

Write-text controls 处理已聚合到 `src/creator/text/write-text-controls.mjs`：
`resolveWriteTextFlowCode()`、`resolveWriteTextBarCode()`、
`resolveWriteTextPlanechaseCode()`、`getWriteTextElemIdSelector()`、
`getWriteTextElemIdSetSubstring()`、`resolveWriteTextElemIdNumberCode()`、
`shouldApplyWriteTextChineseSpacing()`、`resolveWriteTextChineseSpacing()` 和
`resolveWriteTextAlignmentCode()` 由 build-time compat 前导块提供 legacy 全局名。它们处理
line/lns/linenospace、linespacing、bullet、flavor bar、planechase chaos symbol、
elem-id selector/set/language/number、CStext 中文标点 spacing，以及 text align/justify/
fixtextalign restore token，并继续保持 `scaleWidth()`/`scaleHeight()` 全局尺寸换算契约。

Write-text positioning 处理已聚合到 `src/creator/text/write-text-positioning.mjs`：
`resolveWriteTextSavedXCode()`、`resolveWriteTextIndentCode()`、
`resolveWriteTextInsertionCode()` 和 `resolveWriteTextPositionCode()` 由 build-time
compat 前导块提供 legacy 全局名。它们处理 savex/loadx 光标缓存、indent、inline
insertion 和 up/down/left/right cursor offset token，并保留旧的宽松比较、
`parseInt()` 截断和无效数值回落行为。

Write-text layout 处理已聚合到 `src/creator/text/write-text-layout.mjs`：
`resolveWriteTextOverflow()`、`resolveWriteTextHeightOverflow()`、
`resolveWriteTextLineHorizontalAdjust()`、`resolveWriteTextFinalHorizontalAdjust()`、
`resolveWriteTextVerticalAdjust()`、`shouldWriteTextWord()`、
`getWriteTextJustifySettings()`、`measureWriteTextWordAdvance()`、
`resolveWriteTextFinalTargetContext()` 和 `drawWriteTextFinalParagraph()` 由 build-time
compat 前导块提供 legacy 全局名。它们处理 width/height overflow 缩字和换行决策、
horizontal/vertical offset、word 是否写入和 advance 测量，以及最终 paragraph canvas
draw/rotate/translate 调用；`writeText()` 的主循环和状态推进仍留在 `creator-23.js`。

保存卡牌的 data/key helper 已拆到 `src/creator/storage/saved-card-data.mjs`：
`cloneCardForStorage()`、`createSavedCardsExportText()`、`parseSavedCardsImport()`、
`getVersionedSavedCardKey()` 和 `addSavedCardKey()` 由 build-time compat 前导块提供
legacy 全局名。localStorage、确认弹窗、下载触发、文件上传和保存列表刷新流程仍留在
`creator-23.js`，避免同一步改变存储副作用和 UI 行为。

Scryfall 剪贴板文本 parser helper 已拆到
`src/creator/imports/import-clipboard-text.mjs`：`normalizeScryfallClipboardLines()`、
`parseScryfallClipboardNameLine()`、`buildScryfallClipboardBaseCard()`、
`parseScryfallClipboardPt()`、`applyScryfallClipboardPt()` 和 `scryfallCardFromText()`
由 build-time compat 前导块提供 legacy 全局名。它们只处理剪贴板文本到 imported-card
对象的解析；剪贴板读取、导入调用、日志和 notify 仍留在 `creator-23.js`。

导入 option helper 已拆到 `src/creator/imports/import-options.mjs`：
`getImportedCardOptionName()` 和 `shouldRenderImportedCardOption()` 由 build-time compat
前导块提供 legacy 全局名。它们只处理导入候选项显示名和是否渲染的判断；读取
`#importAllPrints`、创建 `<option>`、修改 select 和触发导入流程仍留在 `creator-23.js`。

导入 search-options helper 已拆到 `src/creator/imports/import-search-options.mjs`：
`buildImportSearchOptions()` 和 `getImportedCardFetchUnique()` 由 build-time compat
前导块提供 legacy 全局名。它们只处理 `importAllPrints`、`datasource`、`cardName`
到 request option/fetch unique 的映射；DOM 控件读取、datasource fetcher 选择和 fetch
分派仍留在 `creator-23.js`。

导入请求的纯 URL builder 已拆到 `src/creator/imports/import-url.mjs`，覆盖 Scryfall、
MTGCH 和 collector metadata URL。实际 `XMLHttpRequest`/fetch、日志、notify 和 DOM
读取仍留在 `creator-23.js`。

导入基础字段 helper 已聚合到 `src/creator/imports/import-card-basics.mjs`：
`getImportedDisplayName()`、`buildImportedTitleParts()`、`buildImportedTitleTextFields()`、
`isChineseImportLanguage()`、`getImportedRulesTextPrefix()`、
`getImportedBaseTextPrefix()`、`getImportedStandardTextPrefix()` 和
`getImportedCollectorLanguage()`、`formatImportedTypeLine()` 和
`buildImportedTypeTextFields()` 由 build-time compat 前导块提供 legacy 全局名。它们处理
display name、wanted title/subtitle、title/type text field、中文导入判断、字体前缀、
collector language 和中文 type separator；实际写入 `cardObject.text`、DOM 更新和导入流程仍留在
`creator-23.js`。

导入 printing helper 已聚合到 `src/creator/imports/import-printing.mjs`：
`shouldImportCollectorInfo()`、`buildImportedCollectorFields()`、
`formatImportedCollectorNumber()`、`buildImportedCollectorNumberUpdate()` 和
`buildImportedCollectorNumberUpdateFromSetResponse()`、
`buildImportedSetSymbolFields()`、`buildImportedSetSymbolImportPlan()` 和
`buildImportedSpecialLayoutSetSymbolPlan()`、
`buildImportedArtFields()`、`buildImportedArtImportPlan()` 和
`buildImportedSpecialLayoutMediaPlan()`、`getImportedPrintIdentity()` 由 build-time compat
前导块提供 legacy 全局名。它们处理 collector 字段与编号格式、set symbol 导入计划、
art/media 导入计划和 PLST print identity 拆分；XHR、DOM 写入、`getSetSymbol()`、
`uploadArt()`、`fetchScryfallData()`、`changeArtIndex()`、`artistEdited()`、
`bottomInfoEdited()` 和实际修改 `cardToImport` 的流程仍保留在 `creator-23.js`。

导入 text-preservation helper 已拆到 `src/creator/imports/import-text-preservation.mjs`：
`collectTextFieldValues()`、`shouldPreserveImportedReminderText()` 和
`extractImportedReminderText()` 由 build-time compat 前导块提供 legacy 全局名。它们只负责
收集需要保留的 text field 值、判断 fuse/room reminder 保留规则和提取第一段 reminder；
`clearTextFieldValuesPreserving()`、`resetTextFieldFontSizes()` 和
`prepareImportedCardTextFields()` 仍保留在 `creator-23.js`，因为它们会修改传入对象或参与
导入准备流程。

导入 multi-faced helper 已拆到 `src/creator/imports/import-multi-faced.mjs`：
`isImportedMultiFacedLayout()`、`isImportedTransformVersion()`、`shouldImportBackType()`、
`shouldImportBackPtToFrontPt2()`、`shouldUseBackPtAsReminder()`、
`buildImportedFrontStatFields()`、`buildImportedFaceData()`、`formatImportedFaceRules()` 和
`buildImportedFaceTextFields()` 由 build-time compat 前导块提供 legacy 全局名。它们只处理
layout/version 判定、front/back stat 字段、face 数据归一化和 text field 格式化；
`parseMultiFacedCards()` 仍留在 `creator-23.js`，因为 battle face fallback 会读取全局
`scryfallCard` 并记录错误；`applyImportedMultiFacedCard()` 也继续保留在 legacy runtime，
因为它修改 `cardObject`、触发 media/set-symbol 副作用和 `textEdited()`。

导入 unique-layout predicate helper 已拆到 `src/creator/imports/import-unique-layout.mjs`：
`getImportedUniqueLayouts()` 和 `isImportedUniqueLayout()` 由 build-time compat 前导块提供
legacy 全局名。它们只判断 Scryfall layout 和当前 frame version 是否属于 leveler/prototype/
mutate/vanguard 的精确匹配；`getImportedUniqueLayoutParser()`、`parseImportedUniqueLayout()` 和
`applyImportedUniqueLayoutCard()` 仍留在 `creator-23.js`，因为它们会引用各类 legacy parser
或修改 `cardObject` 并触发 media/set-symbol/textEdited 副作用。

导入 station-layout predicate helper 已拆到 `src/creator/imports/import-station-layout.mjs`：
`shouldApplyImportedStationLayout()` 由 build-time compat 前导块提供 legacy 全局名。它只判断
导入 oracle text 是否包含 `Station` 且当前 frame version 是否包含 `station`；`applyImportedLayoutSpecificCard()`
和 `applyImportedStationCard()` 仍留在 `creator-23.js`，因为它们负责 layout 分派、
`cardObject` 修改和 station 专用 text field 写入。

导入 station parser helper 已拆到 `src/creator/imports/import-station-parser.mjs`：
`formatStationReminderText()`、`isStationOracleText()`、`getStationAbilityPattern()`、
`parseStationAbilities()`、`getStationPreText()`、`formatStationPreText()`、
`splitStationPreText()`、`buildStationPlacementData()` 和 `parseStationCard()` 由 build-time
compat 前导块提供 legacy 全局名。它们只处理 station oracle text、reminder formatting、
ability badge 和 ability text placement；station text field 写入、badge input 更新、
`setTimeout` 和 `stationEdited()` 调用仍留在 `creator-23.js`。

导入 roll parser helper 已拆到 `src/creator/imports/import-roll.mjs`：
`formatRollAbilityLine()`、`isRollAbilityText()`、`getRollOutcomeLines()`、
`replaceRollOutcomeLines()` 和 `parseRollAbilities()` 由 build-time compat 前导块提供
legacy 全局名。它们只处理 Scryfall oracle text 中 `Roll a d20` 结果行到 `{roll...}`
inline token 的转换。

导入 text fields helper 已聚合到 `src/creator/imports/import-text-fields.mjs`：
`getImportedRulesItalicExemptions()`、`formatImportedRulesText()`、
`formatImportedFlavorText()`、`buildImportedRulesFlavorText()`、
`buildImportedPokemonFlavorFields()`、`buildImportedPokemonRulesFields()`、
`buildImportedRulesTextFields()`、`buildImportedCaseRulesText()`、
`normalizeImportedPtText()` 和 `buildImportedPtFields()` 由 build-time compat 前导块提供
legacy 全局名。它们处理 oracle rules/flavor 格式化、Pokemon rules/flavor 字段映射、
case layout rules token 转换和 power/toughness 字段格式化；实际 text field 写入仍留在
`creator-23.js`。

导入 planeswalker helper 已拆到 `src/creator/imports/import-planeswalker.mjs`：
`formatImportedLoyaltyAbilityLine()`、`collapseImportedPlaneswalkerAbilityLines()`、
`buildImportedPlaneswalkerAbilities()`、`getImportedPlaneswalkerAbilityHeight()` 和
`buildImportedPlaneswalkerFields()` 由 build-time compat 前导块提供 legacy 全局名。它只处理
loyalty ability 字符串、超过 4 行的折叠、ability height 和字段对象生成；实际 DOM 写入和
`planeswalkerEdited()` 调用仍留在 `creator-23.js`。

导入 saga helper 已拆到 `src/creator/imports/import-saga.mjs`：
`stripSagaReminderText()`、`buildSagaStepAbilityMap()`、`parseSagaAbilities()`、
`formatImportedAbilityText()`、`buildImportedSagaData()` 和 `buildImportedSagaFields()` 等
纯函数由 build-time compat 前导块提供 legacy 全局名。它只处理 Saga oracle text 的章节解析、
rules2/reminder/ability 字段对象和 `cardObject.saga` 元数据；实际 text field 写入和
`updateAbilityHeights()` 调用仍留在 `creator-23.js`。`formatImportedAbilityText()` 也被仍在
legacy runtime 中的 class 导入 helper 复用。

导入 class helper 已拆到 `src/creator/imports/import-class.mjs`：
`splitClassOracleText()`、`getClassLevelCost()`、`parseClassAbilities()`、
`buildImportedClassData()` 和 `buildImportedClassFields()` 等纯函数由 build-time compat 前导块提供
legacy 全局名。它只处理 class oracle text 的等级解析、level field 对象和 `cardObject.class`
元数据；实际 text field 写入仍留在 `creator-23.js`。

导入 unique-layout parser helper 已拆到
`src/creator/imports/import-unique-layout-parsers.mjs`：`parseLevelerCard()`、
`parsePrototypeLayout()`、`parseMutateLayout()`、`parseVanguardLayout()` 和共享 layout base
helper 由 build-time compat 前导块提供 legacy 全局名。它只处理 leveler、prototype、mutate
和 vanguard 的 imported card 数据解析；`getImportedUniqueLayoutParser()`、text field 写入、
媒体导入和 set-symbol 副作用仍留在 `creator-23.js`。

## 拆分风险排序

低风险起点：

- URL/asset helper。
- text font helper。
- 已有测试覆盖的纯文本 parser helper。
- 已有测试覆盖的 import formatter helper。
- 下载/外部脚本 lazy-load helper。

中风险：

- localStorage save/load。
- Scryfall/MTGCH fetch adapter。
- frame asset loading 和 thumbnail loading。

高风险：

- canvas draw pipeline。
- text layout engine。
- frame catalog 执行模型。
- 全局 `card` 状态结构。
- inline event handler 替换。
