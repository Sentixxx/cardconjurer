import assert from 'node:assert/strict';
import fsp from 'node:fs/promises';
import path from 'node:path';
import * as parse5 from 'parse5';
import test from 'node:test';
import { buildCreatorCompatPrelude } from '../scripts/lib/creator-compat.mjs';
import { roots } from '../scripts/lib/project.mjs';
import { fixUri as resolveCreatorAssetUrl } from '../src/creator/assets/asset-url.mjs';
import {
  collectFrameAssetSources as collectFrameAssetSourcesFromModule,
  isFrameAssetPreloadable as isFrameAssetPreloadableFromModule,
} from '../src/creator/assets/frame-preload.mjs';
import {
  applyWriteTextBelerenGlyphs as applyWriteTextBelerenGlyphsFromModule,
  applyWriteTextFontState as applyWriteTextFontStateFromModule,
  buildWriteTextFontDeclaration as buildWriteTextFontDeclarationFromModule,
  collectTextObjectFonts as collectTextObjectFontsFromModule,
  collectTextObjectsFonts as collectTextObjectsFontsFromModule,
  endWriteTextBoldFontState as endWriteTextBoldFontStateFromModule,
  endWriteTextItalicFontState as endWriteTextItalicFontStateFromModule,
  fontLoadDeclaration as fontLoadDeclarationFromModule,
  normalizeFontFamilies as normalizeFontFamiliesFromModule,
  resolveWriteTextFontCode as resolveWriteTextFontCodeFromModule,
  startWriteTextBoldFontState as startWriteTextBoldFontStateFromModule,
  startWriteTextItalicFontState as startWriteTextItalicFontStateFromModule,
} from '../src/creator/text/text-fonts.mjs';
import { getSelectedTextField as getSelectedTextFieldFromModule } from '../src/creator/text/text-fields.mjs';
import {
  applyWriteTextReminderOptions as applyWriteTextReminderOptionsFromModule,
  applyWriteTextCopyright as applyWriteTextCopyrightFromModule,
  applyWriteTextFlavorVersion as applyWriteTextFlavorVersionFromModule,
  applyWriteTextFontMarkers as applyWriteTextFontMarkersFromModule,
  applyWriteTextInlineCardName as applyWriteTextInlineCardNameFromModule,
  appendWriteTextVerticalCharacters as appendWriteTextVerticalCharactersFromModule,
  buildWriteTextVerticalTokens as buildWriteTextVerticalTokensFromModule,
  filterWriteTextManaCostTokens as filterWriteTextManaCostTokensFromModule,
  getWriteTextFlavorMarkerIndex as getWriteTextFlavorMarkerIndexFromModule,
  isWriteTextCodeToken as isWriteTextCodeTokenFromModule,
  isWriteTextReminderManagedField as isWriteTextReminderManagedFieldFromModule,
  normalizeWriteTextRawText as normalizeWriteTextRawTextFromModule,
  normalizeWriteTextSeparators as normalizeWriteTextSeparatorsFromModule,
  removeWriteTextEmptyArtistMarker as removeWriteTextEmptyArtistMarkerFromModule,
  shouldUseWriteTextCopyright as shouldUseWriteTextCopyrightFromModule,
  splitWriteTextRulesFlavorText as splitWriteTextRulesFlavorTextFromModule,
  tokenizeWriteTextRawText as tokenizeWriteTextRawTextFromModule,
} from '../src/creator/text/write-text-content.mjs';
import {
  matchesWriteTextConditionalFrameRule as matchesWriteTextConditionalFrameRuleFromModule,
  normalizeWriteTextConditionalToken as normalizeWriteTextConditionalTokenFromModule,
  parseWriteTextConditionalColorParts as parseWriteTextConditionalColorPartsFromModule,
  parseWriteTextConditionalFrameRule as parseWriteTextConditionalFrameRuleFromModule,
  resolveWriteTextConditionalColor as resolveWriteTextConditionalColorFromModule,
} from '../src/creator/text/write-text-conditional-color.mjs';
import {
  applyWriteTextFillColor as applyWriteTextFillColorFromModule,
  applyWriteTextLineContextBaseStyles as applyWriteTextLineContextBaseStylesFromModule,
  applyWriteTextLineStyleState as applyWriteTextLineStyleStateFromModule,
  applyWriteTextShadowState as applyWriteTextShadowStateFromModule,
  getWriteTextInitialColor as getWriteTextInitialColorFromModule,
  getWriteTextOutlineSettings as getWriteTextOutlineSettingsFromModule,
  getWriteTextShadowSettings as getWriteTextShadowSettingsFromModule,
  isWriteTextBottomInfoBorderField as isWriteTextBottomInfoBorderFieldFromModule,
  resolveWriteTextColorCode as resolveWriteTextColorCodeFromModule,
  resolveWriteTextLineStyleCode as resolveWriteTextLineStyleCodeFromModule,
  resolveWriteTextSizeCode as resolveWriteTextSizeCodeFromModule,
  resolveWriteTextShadowCode as resolveWriteTextShadowCodeFromModule,
} from '../src/creator/text/write-text-style.mjs';
import {
  applyWriteTextKerningCode as applyWriteTextKerningCodeFromModule,
  copyManaSymbolShadowSettings as copyManaSymbolShadowSettingsFromModule,
  drawManaSymbolImage as drawManaSymbolImageFromModule,
  drawManaSymbolOutline as drawManaSymbolOutlineFromModule,
  getManaSymbolRenderImages as getManaSymbolRenderImagesFromModule,
  hasManaSymbolOutlines as hasManaSymbolOutlinesFromModule,
  isSafariUserAgent as isSafariUserAgentFromModule,
  renderManaSymbolQueue as renderManaSymbolQueueFromModule,
  resolveWriteTextKerningCode as resolveWriteTextKerningCodeFromModule,
  resolveWriteTextManaColorCode as resolveWriteTextManaColorCodeFromModule,
  shouldUseSafariCombinedManaSymbol as shouldUseSafariCombinedManaSymbolFromModule,
} from '../src/creator/text/write-text-mana.mjs';
import {
  resolveWriteTextPtShiftCode as resolveWriteTextPtShiftCodeFromModule,
  resolveWriteTextTransformCode as resolveWriteTextTransformCodeFromModule,
  shouldApplyWriteTextPtShift as shouldApplyWriteTextPtShiftFromModule,
} from '../src/creator/text/write-text-transform.mjs';
import {
  resolveWriteTextRollCode as resolveWriteTextRollCodeFromModule,
  resolveWriteTextRollColorCode as resolveWriteTextRollColorCodeFromModule,
} from '../src/creator/text/write-text-roll.mjs';
import {
  getWriteTextElemIdSelector as getWriteTextElemIdSelectorFromModule,
  getWriteTextElemIdSetSubstring as getWriteTextElemIdSetSubstringFromModule,
  resolveWriteTextAlignmentCode as resolveWriteTextAlignmentCodeFromModule,
  resolveWriteTextBarCode as resolveWriteTextBarCodeFromModule,
  resolveWriteTextChineseSpacing as resolveWriteTextChineseSpacingFromModule,
  resolveWriteTextElemIdNumberCode as resolveWriteTextElemIdNumberCodeFromModule,
  resolveWriteTextFlowCode as resolveWriteTextFlowCodeFromModule,
  resolveWriteTextPlanechaseCode as resolveWriteTextPlanechaseCodeFromModule,
  shouldApplyWriteTextChineseSpacing as shouldApplyWriteTextChineseSpacingFromModule,
} from '../src/creator/text/write-text-controls.mjs';
import {
  resolveWriteTextIndentCode as resolveWriteTextIndentCodeFromModule,
  resolveWriteTextInsertionCode as resolveWriteTextInsertionCodeFromModule,
  resolveWriteTextPositionCode as resolveWriteTextPositionCodeFromModule,
  resolveWriteTextSavedXCode as resolveWriteTextSavedXCodeFromModule,
} from '../src/creator/text/write-text-positioning.mjs';
import {
  drawWriteTextFinalParagraph as drawWriteTextFinalParagraphFromModule,
  getWriteTextJustifySettings as getWriteTextJustifySettingsFromModule,
  measureWriteTextWordAdvance as measureWriteTextWordAdvanceFromModule,
  resolveWriteTextFinalHorizontalAdjust as resolveWriteTextFinalHorizontalAdjustFromModule,
  resolveWriteTextFinalTargetContext as resolveWriteTextFinalTargetContextFromModule,
  resolveWriteTextHeightOverflow as resolveWriteTextHeightOverflowFromModule,
  resolveWriteTextLineHorizontalAdjust as resolveWriteTextLineHorizontalAdjustFromModule,
  resolveWriteTextOverflow as resolveWriteTextOverflowFromModule,
  resolveWriteTextVerticalAdjust as resolveWriteTextVerticalAdjustFromModule,
  shouldWriteTextWord as shouldWriteTextWordFromModule,
} from '../src/creator/text/write-text-layout.mjs';
import {
  addSavedCardKey as addSavedCardKeyFromModule,
  cloneCardForStorage as cloneCardForStorageFromModule,
  createSavedCardsExportText as createSavedCardsExportTextFromModule,
  getVersionedSavedCardKey as getVersionedSavedCardKeyFromModule,
  parseSavedCardsImport as parseSavedCardsImportFromModule,
} from '../src/creator/storage/saved-card-data.mjs';
import {
  applyScryfallClipboardPt as applyScryfallClipboardPtFromModule,
  buildScryfallClipboardBaseCard as buildScryfallClipboardBaseCardFromModule,
  normalizeScryfallClipboardLines as normalizeScryfallClipboardLinesFromModule,
  parseScryfallClipboardNameLine as parseScryfallClipboardNameLineFromModule,
  parseScryfallClipboardPt as parseScryfallClipboardPtFromModule,
  scryfallCardFromText as scryfallCardFromTextFromModule,
} from '../src/creator/imports/import-clipboard-text.mjs';
import {
  getImportedCardOptionName as getImportedCardOptionNameFromModule,
  shouldRenderImportedCardOption as shouldRenderImportedCardOptionFromModule,
} from '../src/creator/imports/import-options.mjs';
import {
  buildImportSearchOptions as buildImportSearchOptionsFromModule,
  getImportedCardFetchUnique as getImportedCardFetchUniqueFromModule,
} from '../src/creator/imports/import-search-options.mjs';
import {
  buildImportedCollectorSetUrl as buildImportedCollectorSetUrlFromModule,
  buildMtgchCardDetailUrl as buildMtgchCardDetailUrlFromModule,
  buildMtgchSearchUrl as buildMtgchSearchUrlFromModule,
  buildMtgchVersionsUrl as buildMtgchVersionsUrlFromModule,
  buildScryfallCardUrl as buildScryfallCardUrlFromModule,
  buildScryfallSearchUrl as buildScryfallSearchUrlFromModule,
  getScryfallUniqueSearchParam as getScryfallUniqueSearchParamFromModule,
} from '../src/creator/imports/import-url.mjs';
import {
  buildImportedTitleTextFields as buildImportedTitleTextFieldsFromModule,
  buildImportedTitleParts as buildImportedTitlePartsFromModule,
  buildImportedTypeTextFields as buildImportedTypeTextFieldsFromModule,
  formatImportedTypeLine as formatImportedTypeLineFromModule,
  getImportedBaseTextPrefix as getImportedBaseTextPrefixFromModule,
  getImportedCollectorLanguage as getImportedCollectorLanguageFromModule,
  getImportedDisplayName as getImportedDisplayNameFromModule,
  getImportedRulesTextPrefix as getImportedRulesTextPrefixFromModule,
  getImportedStandardTextPrefix as getImportedStandardTextPrefixFromModule,
  isChineseImportLanguage as isChineseImportLanguageFromModule,
} from '../src/creator/imports/import-card-basics.mjs';
import {
  buildImportedArtFields as buildImportedArtFieldsFromModule,
  buildImportedArtImportPlan as buildImportedArtImportPlanFromModule,
  buildImportedCollectorFields as buildImportedCollectorFieldsFromModule,
  buildImportedCollectorNumberUpdate as buildImportedCollectorNumberUpdateFromModule,
  buildImportedCollectorNumberUpdateFromSetResponse as buildImportedCollectorNumberUpdateFromSetResponseFromModule,
  formatImportedCollectorNumber as formatImportedCollectorNumberFromModule,
  buildImportedSetSymbolFields as buildImportedSetSymbolFieldsFromModule,
  buildImportedSetSymbolImportPlan as buildImportedSetSymbolImportPlanFromModule,
  buildImportedSpecialLayoutSetSymbolPlan as buildImportedSpecialLayoutSetSymbolPlanFromModule,
  buildImportedSpecialLayoutMediaPlan as buildImportedSpecialLayoutMediaPlanFromModule,
  getImportedPrintIdentity as getImportedPrintIdentityFromModule,
  shouldImportCollectorInfo as shouldImportCollectorInfoFromModule,
} from '../src/creator/imports/import-printing.mjs';
import {
  collectTextFieldValues as collectTextFieldValuesFromModule,
  extractImportedReminderText as extractImportedReminderTextFromModule,
  shouldPreserveImportedReminderText as shouldPreserveImportedReminderTextFromModule,
} from '../src/creator/imports/import-text-preservation.mjs';
import {
  buildImportedFaceData as buildImportedFaceDataFromModule,
  buildImportedFaceTextFields as buildImportedFaceTextFieldsFromModule,
  buildImportedFrontStatFields as buildImportedFrontStatFieldsFromModule,
  formatImportedFaceRules as formatImportedFaceRulesFromModule,
  isImportedMultiFacedLayout as isImportedMultiFacedLayoutFromModule,
  isImportedTransformVersion as isImportedTransformVersionFromModule,
  shouldImportBackPtToFrontPt2 as shouldImportBackPtToFrontPt2FromModule,
  shouldImportBackType as shouldImportBackTypeFromModule,
  shouldUseBackPtAsReminder as shouldUseBackPtAsReminderFromModule,
} from '../src/creator/imports/import-multi-faced.mjs';
import {
  getImportedUniqueLayouts as getImportedUniqueLayoutsFromModule,
  isImportedUniqueLayout as isImportedUniqueLayoutFromModule,
} from '../src/creator/imports/import-unique-layout.mjs';
import {
  shouldApplyImportedStationLayout as shouldApplyImportedStationLayoutFromModule,
} from '../src/creator/imports/import-station-layout.mjs';
import {
  buildStationPlacementData as buildStationPlacementDataFromModule,
  formatStationPreText as formatStationPreTextFromModule,
  formatStationReminderText as formatStationReminderTextFromModule,
  getStationAbilityPattern as getStationAbilityPatternFromModule,
  getStationPreText as getStationPreTextFromModule,
  isStationOracleText as isStationOracleTextFromModule,
  parseStationAbilities as parseStationAbilitiesFromModule,
  parseStationCard as parseStationCardFromModule,
  splitStationPreText as splitStationPreTextFromModule,
} from '../src/creator/imports/import-station-parser.mjs';
import {
  formatRollAbilityLine as formatRollAbilityLineFromModule,
  getRollOutcomeLines as getRollOutcomeLinesFromModule,
  isRollAbilityText as isRollAbilityTextFromModule,
  parseRollAbilities as parseRollAbilitiesFromModule,
  replaceRollOutcomeLines as replaceRollOutcomeLinesFromModule,
} from '../src/creator/imports/import-roll.mjs';
import {
  buildImportedCaseRulesText as buildImportedCaseRulesTextFromModule,
  buildImportedPokemonFlavorFields as buildImportedPokemonFlavorFieldsFromModule,
  buildImportedPokemonRulesFields as buildImportedPokemonRulesFieldsFromModule,
  buildImportedRulesFlavorText as buildImportedRulesFlavorTextFromModule,
  buildImportedRulesTextFields as buildImportedRulesTextFieldsFromModule,
  buildImportedPtFields as buildImportedPtFieldsFromModule,
  formatImportedFlavorText as formatImportedFlavorTextFromModule,
  formatImportedRulesText as formatImportedRulesTextFromModule,
  getImportedRulesItalicExemptions as getImportedRulesItalicExemptionsFromModule,
  normalizeImportedPtText as normalizeImportedPtTextFromModule,
} from '../src/creator/imports/import-text-fields.mjs';
import {
  buildImportedPlaneswalkerAbilities as buildImportedPlaneswalkerAbilitiesFromModule,
  buildImportedPlaneswalkerFields as buildImportedPlaneswalkerFieldsFromModule,
  collapseImportedPlaneswalkerAbilityLines as collapseImportedPlaneswalkerAbilityLinesFromModule,
  formatImportedLoyaltyAbilityLine as formatImportedLoyaltyAbilityLineFromModule,
  getImportedPlaneswalkerAbilityHeight as getImportedPlaneswalkerAbilityHeightFromModule,
} from '../src/creator/imports/import-planeswalker.mjs';
import {
  buildImportedSagaData as buildImportedSagaDataFromModule,
  buildImportedSagaFields as buildImportedSagaFieldsFromModule,
  buildSagaStepAbilityMap as buildSagaStepAbilityMapFromModule,
  collectSagaAbilitiesInOrder as collectSagaAbilitiesInOrderFromModule,
  getSagaLoreStepOrder as getSagaLoreStepOrderFromModule,
  parseSagaAbilities as parseSagaAbilitiesFromModule,
  stripSagaReminderText as stripSagaReminderTextFromModule,
} from '../src/creator/imports/import-saga.mjs';
import {
  buildImportedClassData as buildImportedClassDataFromModule,
  buildImportedClassFields as buildImportedClassFieldsFromModule,
  collectClassAbilities as collectClassAbilitiesFromModule,
  getClassLevelCost as getClassLevelCostFromModule,
  parseClassAbilities as parseClassAbilitiesFromModule,
  prependClassReminderText as prependClassReminderTextFromModule,
  splitClassOracleText as splitClassOracleTextFromModule,
} from '../src/creator/imports/import-class.mjs';
import {
  buildLevelData as buildLevelDataFromModule,
  buildLevelerData as buildLevelerDataFromModule,
  buildMutateLayoutData as buildMutateLayoutDataFromModule,
  buildPrototypeLayoutData as buildPrototypeLayoutDataFromModule,
  collectLevelSections as collectLevelSectionsFromModule,
  formatLevelUpText as formatLevelUpTextFromModule,
  formatMutateReminderText as formatMutateReminderTextFromModule,
  formatPrototypeReminderText as formatPrototypeReminderTextFromModule,
  getLevelerOracleLines as getLevelerOracleLinesFromModule,
  parseLevelerCard as parseLevelerCardFromModule,
  parseLevelUpLine as parseLevelUpLineFromModule,
  parseMutateLayout as parseMutateLayoutFromModule,
  parseMutateText as parseMutateTextFromModule,
  parsePrototypeLayout as parsePrototypeLayoutFromModule,
  parsePrototypeText as parsePrototypeTextFromModule,
  parseVanguardLayout as parseVanguardLayoutFromModule,
} from '../src/creator/imports/import-unique-layout-parsers.mjs';

function attribute(node, name) {
  return (node?.attrs || []).find((candidate) => candidate.name === name)?.value || '';
}

function hasClass(node, className) {
  return attribute(node, 'class').split(/\s+/).includes(className);
}

function textContent(node) {
  if (!node) {
    return '';
  }

  if (node.nodeName === '#text') {
    return node.value || '';
  }

  return (node.childNodes || []).map(textContent).join('');
}

function findAll(node, predicate, results = []) {
  if (predicate(node)) {
    results.push(node);
  }

  for (const child of node.childNodes || []) {
    findAll(child, predicate, results);
  }

  return results;
}

function byId(root, id) {
  return findAll(root, (node) => attribute(node, 'id') === id)[0] || null;
}

async function creatorFragment() {
  const html = await fsp.readFile(path.join(roots.dist, 'creator', 'index.html'), 'utf8');
  return parse5.parseFragment(html);
}

async function creatorScriptSource() {
  return fsp.readFile(path.join(roots.app, 'js', 'creator-23.js'), 'utf8');
}

async function creatorScriptSources() {
  return Promise.all([
    creatorScriptSource(),
    fsp.readFile(path.join(roots.app, 'js', 'frameSearch.js'), 'utf8'),
  ]);
}

function extractFunctionSource(source, name) {
  const start = source.indexOf(`function ${name}`);
  assert.notEqual(start, -1);

  const bodyStart = source.indexOf('{', start);
  assert.notEqual(bodyStart, -1);

  let depth = 0;
  let quote = null;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;
  for (let index = bodyStart; index < source.length; index += 1) {
    const character = source[index];
    const nextCharacter = source[index + 1];

    if (inLineComment) {
      if (character === '\n') {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      if (character === '*' && nextCharacter === '/') {
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (character === '/' && nextCharacter === '/') {
      inLineComment = true;
      index += 1;
      continue;
    }

    if (character === '/' && nextCharacter === '*') {
      inBlockComment = true;
      index += 1;
      continue;
    }

    if (character === '"' || character === "'" || character === '`') {
      quote = character;
      continue;
    }

    if (character === '{') {
      depth += 1;
    } else if (character === '}') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  throw new Error(`Could not extract function ${name}`);
}

async function loadCreatorFunctions(functionNames, returnExpression) {
  const source = await creatorScriptSource();
  const functionSources = functionNames.map((name) => extractFunctionSource(source, name));
  return Function([...functionSources, `return ${returnExpression};`].join('\n'))();
}

async function loadCreatorCompatFunctions(functionNames, returnExpression) {
  const source = await buildCreatorCompatPrelude();
  for (const name of functionNames) {
    assert.match(source, new RegExp(`function\\s+${name}\\b`));
  }
  return Function(`${source}\nreturn ${returnExpression};`)();
}

async function loadCreatorFunctionsWithCompat(functionNames, returnExpression) {
  const source = await creatorScriptSource();
  const compatSource = await buildCreatorCompatPrelude();
  const functionSources = functionNames.map((name) => extractFunctionSource(source, name));
  return Function(`${compatSource}\n${functionSources.join('\n')}\nreturn ${returnExpression};`)();
}

test('creator fragment preserves preview canvas contract', async () => {
  const fragment = await creatorFragment();
  const canvas = byId(fragment, 'previewCanvas');

  assert.equal(canvas?.tagName, 'canvas');
  assert.equal(attribute(canvas, 'width'), '1005');
  assert.equal(attribute(canvas, 'height'), '1407');
  assert.equal(hasClass(canvas, 'creator-canvas'), true);
});

test('creator fragment preserves main menu tab contract', async () => {
  const fragment = await creatorFragment();
  const tabs = byId(fragment, 'creator-menu-tabs');
  const tabLabels = findAll(tabs, (node) => node.tagName === 'h3').map((node) => textContent(node).trim());

  assert.deepEqual(tabLabels, [
    '牌框',
    '文本',
    '卡图',
    '系列图标',
    '水印',
    '收藏家信息',
    '导入/保存',
    '教程',
  ]);

  for (const tab of findAll(tabs, (node) => node.tagName === 'h3')) {
    assert.match(attribute(tab, 'onclick'), /toggleCreatorTabs/);
  }
});

test('creator fragment preserves frame controls and upload drop handlers', async () => {
  const fragment = await creatorFragment();

  assert.match(attribute(byId(fragment, 'selectFrameGroup'), 'onchange'), /group/);
  assert.match(attribute(byId(fragment, 'selectFramePack'), 'onchange'), /pack/);
  assert.equal(byId(fragment, 'loadFrameVersion')?.tagName, 'button');
  assert.equal(byId(fragment, 'frame-picker')?.tagName, 'div');
  assert.equal(byId(fragment, 'mask-picker')?.tagName, 'div');
  assert.equal(byId(fragment, 'frame-list')?.tagName, 'div');

  const dropInputs = findAll(fragment, (node) => node.tagName === 'input' && attribute(node, 'data-dropfunction'));
  const dropFunctions = dropInputs.map((node) => attribute(node, 'data-dropfunction')).sort();

  assert.deepEqual([...new Set(dropFunctions)], [
    'uploadArt',
    'uploadFrameOption',
    'uploadMaskOption',
    'uploadSetSymbol',
    'uploadWatermark',
  ]);
});

test('creator fragment preserves text, import, and saved-card controls', async () => {
  const fragment = await creatorFragment();

  assert.equal(byId(fragment, 'text-editor')?.tagName, 'textarea');
  assert.match(attribute(byId(fragment, 'text-editor'), 'oninput'), /textEdited/);
  assert.equal(byId(fragment, 'import-name')?.tagName, 'input');
  assert.equal(byId(fragment, 'import-index')?.tagName, 'select');
  assert.equal(byId(fragment, 'load-card-options')?.tagName, 'select');

  const datasource = byId(fragment, 'datasource');
  const datasourceOptions = findAll(datasource, (node) => node.tagName === 'option').map((node) => attribute(node, 'value'));

  assert.deepEqual(datasourceOptions, ['scryfall', 'mtgch', 'local']);
});

test('creator fragment preserves script and download contracts', async () => {
  const fragment = await creatorFragment();
  const scriptSources = findAll(fragment, (node) => node.tagName === 'script').map((node) => attribute(node, 'src'));

  assert.deepEqual(scriptSources, ['/js/creator-23.js', '/js/frameSearch.js']);
  assert.match(textContent(byId(fragment, 'downloadJpg')), /JPEG/);
  assert.match(attribute(byId(fragment, 'downloadJpg'), 'onclick'), /downloadCard\(false, true\)/);
  assert.match(attribute(byId(fragment, 'downloadAlt'), 'onclick'), /downloadCard\(true\)/);
});

test('creator asset URL helper preserves defaults and supports split frame asset bases', async () => {
  const { fixUri } = await loadCreatorCompatFunctions([
    'getCardForgerAssetConfig',
    'isAbsoluteAssetUrl',
    'trimAssetBase',
    'isFrameThumbnailAsset',
    'isFrameHiresAsset',
    'joinAssetBase',
    'getAssetBaseForInput',
    'fixUri',
  ], '{ fixUri }');
  const previousConfig = globalThis.CARD_FORGER_ASSETS;

  try {
    delete globalThis.CARD_FORGER_ASSETS;

    for (const [input, expected] of [
      ['/img/frames/m15/regular/w.png', '/img/frames/m15/regular/w.png'],
      ['/img/frames/m15/regular/wThumb.png', '/img/frames/m15/regular/wThumb.png'],
      ['/img/setSymbols/official/one-c.svg', '/img/setSymbols/official/one-c.svg'],
      ['/img/frames/name+plus.png', '/img/frames/name%2Bplus.png'],
      ['https://cdn.example.test/img/frames/w.png', 'https://cdn.example.test/img/frames/w.png'],
      ['data:image/png;base64,abc+def', 'data:image/png;base64,abc%2Bdef'],
    ]) {
      assert.equal(fixUri(input), expected);
      assert.equal(resolveCreatorAssetUrl(input), expected);
    }

    globalThis.CARD_FORGER_ASSETS = {
      assetBase: 'https://site.example.test/root/',
      frameHiresBase: 'https://assets.example.test/hires/',
      frameThumbnailBase: 'https://hot.example.test/thumbs/',
    };

    for (const [input, expected] of [
      ['/img/frames/m15/regular/w.png', 'https://assets.example.test/hires/img/frames/m15/regular/w.png'],
      ['/img/frames/m15/regular/wThumb.png', 'https://hot.example.test/thumbs/img/frames/m15/regular/wThumb.png'],
      ['/img/setSymbols/official/one-c.svg', 'https://site.example.test/root/img/setSymbols/official/one-c.svg'],
      ['/js/frames/packM15Regular-1.js', 'https://site.example.test/root/js/frames/packM15Regular-1.js'],
    ]) {
      assert.equal(fixUri(input), expected);
      assert.equal(resolveCreatorAssetUrl(input), expected);
    }
  } finally {
    if (previousConfig === undefined) {
      delete globalThis.CARD_FORGER_ASSETS;
    } else {
      globalThis.CARD_FORGER_ASSETS = previousConfig;
    }
  }
});

test('creator frame preload helpers preserve source filtering and URL resolution', async () => {
  const { collectFrameAssetSources, isFrameAssetPreloadable } = await loadCreatorCompatFunctions([
    'getCardForgerAssetConfig',
    'isAbsoluteAssetUrl',
    'trimAssetBase',
    'isFrameThumbnailAsset',
    'isFrameHiresAsset',
    'joinAssetBase',
    'getAssetBaseForInput',
    'fixUri',
    'isFrameAssetPreloadable',
    'collectFrameAssetSources',
  ], '{ collectFrameAssetSources, isFrameAssetPreloadable }');
  const previousConfig = globalThis.CARD_FORGER_ASSETS;
  const frame = {
    src: '/img/frames/m15/regular/w.png',
    masks: [
      { src: '/img/frames/m15/regular/mask.png' },
      { src: '/img/frames/m15/regular/mask.png' },
      { src: '/img/blank.png' },
      { src: 'data:image/png;base64,abc' },
      {},
    ],
  };

  try {
    globalThis.CARD_FORGER_ASSETS = {
      frameHiresBase: 'https://assets.example.test/hires',
    };

    assert.equal(isFrameAssetPreloadable('/img/frames/m15/regular/w.png'), true);
    assert.equal(isFrameAssetPreloadable('/img/blank.png'), false);
    assert.equal(isFrameAssetPreloadable('data:image/png;base64,abc'), false);
    assert.equal(isFrameAssetPreloadableFromModule('/img/frames/m15/regular/w.png'), true);
    assert.equal(isFrameAssetPreloadableFromModule('/img/blank.png'), false);
    assert.equal(isFrameAssetPreloadableFromModule('data:image/png;base64,abc'), false);

    assert.deepEqual(collectFrameAssetSources(frame), [
      'https://assets.example.test/hires/img/frames/m15/regular/w.png',
      'https://assets.example.test/hires/img/frames/m15/regular/mask.png',
    ]);
    assert.deepEqual(collectFrameAssetSourcesFromModule(frame), collectFrameAssetSources(frame));
    assert.deepEqual(collectFrameAssetSources(null), []);
    assert.deepEqual(collectFrameAssetSourcesFromModule(null), []);
  } finally {
    if (previousConfig === undefined) {
      delete globalThis.CARD_FORGER_ASSETS;
    } else {
      globalThis.CARD_FORGER_ASSETS = previousConfig;
    }
  }
});

test('text font helper preserves load declarations and font discovery', async () => {
  const {
    collectTextObjectFonts,
    collectTextObjectsFonts,
    fontLoadDeclaration,
    normalizeFontFamilies,
  } = await loadCreatorCompatFunctions([
    'fontLoadDeclaration',
    'normalizeFontFamilies',
    'getCreatorCardVersion',
    'collectTextObjectFonts',
    'collectTextObjectsFonts',
  ], '{ collectTextObjectFonts, collectTextObjectsFonts, fontLoadDeclaration, normalizeFontFamilies }');
  const previousCard = globalThis.card;
  const fontInputs = [
    ['mplantin', '12px mplantin'],
    [' Font Family ', '12px "Font Family"'],
    ['Font"Back\\Slash', '12px "Font\\"Back\\\\Slash"'],
  ];
  const rawFonts = [' mplantin ', 'belerenb', 'mplantin', '', null, ' gillsans '];
  const rulesText = {
    font: 'mplantin',
    text: 'Rules {fontbeleren} {fontcolorred} {fontsize+2} {i} {flavor}',
  };
  const saloonText = {
    font: 'saloongirl',
    text: 'Showdown *',
  };

  try {
    globalThis.card = { version: 'pokemon' };

    for (const [input, expected] of fontInputs) {
      assert.equal(fontLoadDeclaration(input), expected);
      assert.equal(fontLoadDeclarationFromModule(input), expected);
    }

    assert.deepEqual(normalizeFontFamilies(rawFonts), ['mplantin', 'belerenb', 'gillsans']);
    assert.deepEqual(normalizeFontFamiliesFromModule(rawFonts), normalizeFontFamilies(rawFonts));

    assert.deepEqual([...collectTextObjectFonts(rulesText)], [
      'mplantin',
      'beleren',
      'mplantini',
      'gillsansbolditalic',
    ]);
    assert.deepEqual([...collectTextObjectFontsFromModule(rulesText)], [...collectTextObjectFonts(rulesText)]);

    assert.deepEqual([...collectTextObjectFonts(saloonText)], [
      'saloongirl',
      'belerenbsc',
    ]);
    assert.deepEqual([...collectTextObjectFontsFromModule(saloonText)], [...collectTextObjectFonts(saloonText)]);

    assert.deepEqual([...collectTextObjectsFonts([rulesText, saloonText, { text: '{fontcustom}' }])], [
      'mplantin',
      'beleren',
      'mplantini',
      'gillsansbolditalic',
      'saloongirl',
      'belerenbsc',
      'custom',
    ]);
    assert.deepEqual(
      [...collectTextObjectsFontsFromModule([rulesText, saloonText, { text: '{fontcustom}' }])],
      [...collectTextObjectsFonts([rulesText, saloonText, { text: '{fontcustom}' }])],
    );
  } finally {
    if (previousCard === undefined) {
      delete globalThis.card;
    } else {
      globalThis.card = previousCard;
    }
  }
});

test('creator fragment preserves statically referenced script DOM ids', async () => {
  const fragment = await creatorFragment();
  const domIds = new Set(findAll(fragment, (node) => attribute(node, 'id')).map((node) => attribute(node, 'id')));
  const scriptSources = await creatorScriptSources();
  const referencedIds = new Set();
  const optionalGeneratedIds = new Set([
    'high-res',
    'preview',
    'station-disable-first-ability',
    'station-square-height-1',
    'station-square-y',
  ]);
  const patterns = [
    /querySelector\(\s*(['"])#([A-Za-z][\w:-]*)\1\s*\)/g,
    /getElementById\(\s*(['"])([A-Za-z][\w:-]*)\1\s*\)/g,
  ];

  for (const source of scriptSources) {
    for (const pattern of patterns) {
      for (const match of source.matchAll(pattern)) {
        referencedIds.add(match[2]);
      }
    }
  }

  assert.equal(referencedIds.has('previewCanvas'), true);
  assert.equal(referencedIds.has('text-editor'), true);
  assert.equal(referencedIds.has('load-card-options'), true);

  const missingIds = [...referencedIds]
    .filter((id) => !domIds.has(id) && !optionalGeneratedIds.has(id))
    .sort((left, right) => left.localeCompare(right, 'en'));

  assert.deepEqual(missingIds, []);
});

test('scryfall clipboard text parser preserves card field extraction', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'normalizeScryfallClipboardLines',
    'parseScryfallClipboardNameLine',
    'buildScryfallClipboardBaseCard',
    'parseScryfallClipboardPt',
    'applyScryfallClipboardPt',
    'scryfallCardFromText',
  ], '{ normalizeScryfallClipboardLines, parseScryfallClipboardNameLine, buildScryfallClipboardBaseCard, parseScryfallClipboardPt, applyScryfallClipboardPt, scryfallCardFromText }');

  for (const {
    normalizeScryfallClipboardLines,
    parseScryfallClipboardNameLine,
    buildScryfallClipboardBaseCard,
    parseScryfallClipboardPt,
    applyScryfallClipboardPt,
    scryfallCardFromText,
  } of [
    compatHelpers,
    {
      normalizeScryfallClipboardLines: normalizeScryfallClipboardLinesFromModule,
      parseScryfallClipboardNameLine: parseScryfallClipboardNameLineFromModule,
      buildScryfallClipboardBaseCard: buildScryfallClipboardBaseCardFromModule,
      parseScryfallClipboardPt: parseScryfallClipboardPtFromModule,
      applyScryfallClipboardPt: applyScryfallClipboardPtFromModule,
      scryfallCardFromText: scryfallCardFromTextFromModule,
    },
  ]) {
    assert.deepEqual(normalizeScryfallClipboardLines('\n Lightning Bolt {R} \n\n Instant \n'), [
      'Lightning Bolt {R}',
      'Instant',
    ]);
    assert.deepEqual(parseScryfallClipboardNameLine('Lightning Bolt {R}'), {
      name: 'Lightning Bolt',
      manaCost: '{R}',
    });
    assert.deepEqual(parseScryfallClipboardNameLine('{R} Leading Brace'), {
      name: '{R} Leading Brace',
    });
    assert.deepEqual(buildScryfallClipboardBaseCard({
      name: 'Lightning Bolt',
      manaCost: '{R}',
    }), {
      name: 'Lightning Bolt',
      lang: 'en',
      mana_cost: '{R}',
    });
    assert.deepEqual(parseScryfallClipboardPt('2/3'), {
      power: '2',
      toughness: '3',
    });
    assert.equal(parseScryfallClipboardPt('No stats'), null);

    const cardWithStats = {};
    const remainingLines = ['Rules text', '2/3'];
    assert.equal(applyScryfallClipboardPt(cardWithStats, remainingLines), true);
    assert.deepEqual(cardWithStats, { power: '2', toughness: '3' });
    assert.deepEqual(remainingLines, ['Rules text']);

    assert.deepEqual(scryfallCardFromText(''), {});
    assert.deepEqual(scryfallCardFromText('Lightning Bolt'), {
      name: 'Lightning Bolt',
      lang: 'en',
    });
    assert.deepEqual(scryfallCardFromText('Lightning Bolt {R}\nInstant\nLightning Bolt deals 3 damage to any target.'), {
      name: 'Lightning Bolt',
      lang: 'en',
      mana_cost: '{R}',
      type_line: 'Instant',
      oracle_text: 'Lightning Bolt deals 3 damage to any target.',
    });
    assert.deepEqual(scryfallCardFromText('Grizzly Bears {1}{G}\nCreature — Bear\n2/2'), {
      name: 'Grizzly Bears',
      lang: 'en',
      mana_cost: '{1}{G}',
      type_line: 'Creature — Bear',
      power: '2',
      toughness: '2',
    });
  }
});

test('clipboard card import helpers preserve parsed card import and failure notification', async () => {
  const originals = {
    scryfallCardFromText: globalThis.scryfallCardFromText,
    importCard: globalThis.importCard,
    notify: globalThis.notify,
    log: console.log,
    error: console.error,
  };
  const parsedCard = { name: 'Lightning Bolt', type_line: 'Instant' };
  const calls = [];
  globalThis.scryfallCardFromText = (text) => {
    calls.push(['parse', text]);
    return parsedCard;
  };
  globalThis.importCard = (cards) => calls.push(['import', cards]);
  globalThis.notify = (message) => calls.push(['notify', message]);
  console.log = (...args) => calls.push(['log', ...args]);
  console.error = (...args) => calls.push(['error', ...args]);

  try {
    const {
      importCardFromClipboardText,
      notifyPasteCardTextFailure,
    } = await loadCreatorFunctions([
      'importCardFromClipboardText',
      'notifyPasteCardTextFailure',
    ], '{ importCardFromClipboardText, notifyPasteCardTextFailure }');

    assert.equal(importCardFromClipboardText('Lightning Bolt'), parsedCard);
    assert.deepEqual(calls, [
      ['log', 'Lightning Bolt'],
      ['parse', 'Lightning Bolt'],
      ['import', [parsedCard]],
    ]);

    const error = new Error('denied');
    calls.length = 0;
    notifyPasteCardTextFailure(error);
    assert.deepEqual(calls, [
      ['error', 'Failed to read clipboard text: ', error],
      ['notify', 'Clipboard access failed. Did you click the button?'],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (name === 'log') {
        console.log = value;
      } else if (name === 'error') {
        console.error = value;
      } else if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('selected text field helper preserves insertion order and mutable reference', async () => {
  const { getSelectedTextField } = await loadCreatorCompatFunctions([
    'getSelectedTextField',
  ], '{ getSelectedTextField }');
  const textFields = {
    title: {
      text: 'A-Title',
    },
    rules: {
      text: 'B-Rules',
    },
  };

  const selected = getSelectedTextField(textFields, 1);

  assert.equal(selected, textFields.rules);
  assert.equal(getSelectedTextFieldFromModule(textFields, 1), textFields.rules);
  selected.fontSize = '12';
  assert.equal(textFields.rules.fontSize, '12');
});

test('write text content helper preserves reminder rules and flavor boundaries', async () => {
  const {
    isWriteTextReminderManagedField,
    getWriteTextFlavorMarkerIndex,
    splitWriteTextRulesFlavorText,
    applyWriteTextReminderOptions,
  } = await loadCreatorCompatFunctions([
    'isWriteTextReminderManagedField',
    'getWriteTextFlavorMarkerIndex',
    'splitWriteTextRulesFlavorText',
    'applyWriteTextReminderOptions',
  ], '{ isWriteTextReminderManagedField, getWriteTextFlavorMarkerIndex, splitWriteTextRulesFlavorText, applyWriteTextReminderOptions }');

  for (const helpers of [
    {
      isWriteTextReminderManagedField,
      getWriteTextFlavorMarkerIndex,
      splitWriteTextRulesFlavorText,
      applyWriteTextReminderOptions,
    },
    {
      isWriteTextReminderManagedField: isWriteTextReminderManagedFieldFromModule,
      getWriteTextFlavorMarkerIndex: getWriteTextFlavorMarkerIndexFromModule,
      splitWriteTextRulesFlavorText: splitWriteTextRulesFlavorTextFromModule,
      applyWriteTextReminderOptions: applyWriteTextReminderOptionsFromModule,
    },
  ]) {
    assert.equal(helpers.isWriteTextReminderManagedField({ name: 'Rules' }), true);
    assert.equal(helpers.isWriteTextReminderManagedField({ name: 'Title' }), false);
    assert.equal(helpers.isWriteTextReminderManagedField({}), false);

    assert.equal(helpers.getWriteTextFlavorMarkerIndex('Rules{flavor}Flavor'), 5);
    assert.equal(helpers.getWriteTextFlavorMarkerIndex('Rules///Flavor'), 5);
    assert.equal(helpers.getWriteTextFlavorMarkerIndex('{flavor}Only flavor'), 0);
    assert.deepEqual(helpers.splitWriteTextRulesFlavorText('Rules///Flavor'), {
      rulesText: 'Rules',
      flavorText: '///Flavor',
    });
    assert.deepEqual(helpers.splitWriteTextRulesFlavorText('Rules only'), {
      rulesText: 'Rules only',
      flavorText: '',
    });

    assert.equal(
      helpers.applyWriteTextReminderOptions('Flying {i}(Reminder text.){/i}{flavor}Flavor (kept).', { name: 'Rules' }, true, false),
      'Flying{flavor}Flavor (kept).',
    );
    assert.equal(
      helpers.applyWriteTextReminderOptions('Flying (Reminder text.)///Flavor (kept).', { name: 'Rules' }, false, true),
      'Flying {i}(Reminder text.){/i}///Flavor (kept).',
    );
    assert.equal(
      helpers.applyWriteTextReminderOptions('Name (not rules).', { name: 'Title' }, true, true),
      'Name (not rules).',
    );
  }
});

test('write text conditional color helpers preserve frame and mask matching', async () => {
  const {
    normalizeWriteTextConditionalToken,
    parseWriteTextConditionalColorParts,
    parseWriteTextConditionalFrameRule,
    matchesWriteTextConditionalFrameRule,
    resolveWriteTextConditionalColor,
  } = await loadCreatorCompatFunctions([
    'normalizeWriteTextConditionalToken',
    'parseWriteTextConditionalColorParts',
    'parseWriteTextConditionalFrameRule',
    'matchesWriteTextConditionalFrameRule',
    'resolveWriteTextConditionalColor',
  ], '{ normalizeWriteTextConditionalToken, parseWriteTextConditionalColorParts, parseWriteTextConditionalFrameRule, matchesWriteTextConditionalFrameRule, resolveWriteTextConditionalColor }');
  const frames = [
    {
      name: 'M15 Nyx',
      masks: [
        { name: 'Legendary Crown' },
        { name: 'Snow Frame' },
      ],
    },
    {
      name: 'Borderless',
      masks: [],
    },
  ];

  for (const helpers of [
    {
      normalizeWriteTextConditionalToken,
      parseWriteTextConditionalColorParts,
      parseWriteTextConditionalFrameRule,
      matchesWriteTextConditionalFrameRule,
      resolveWriteTextConditionalColor,
    },
    {
      normalizeWriteTextConditionalToken: normalizeWriteTextConditionalTokenFromModule,
      parseWriteTextConditionalColorParts: parseWriteTextConditionalColorPartsFromModule,
      parseWriteTextConditionalFrameRule: parseWriteTextConditionalFrameRuleFromModule,
      matchesWriteTextConditionalFrameRule: matchesWriteTextConditionalFrameRuleFromModule,
      resolveWriteTextConditionalColor: resolveWriteTextConditionalColorFromModule,
    },
  ]) {
    assert.equal(helpers.normalizeWriteTextConditionalToken('m15_nyx'), 'm15 nyx');
    assert.deepEqual(helpers.parseWriteTextConditionalColorParts('m15_nyx*legendary*!extended,borderless:gold'), {
      tagParts: ['m15_nyx*legendary*!extended', 'borderless'],
      colorToApply: 'gold',
    });
    assert.deepEqual(helpers.parseWriteTextConditionalColorParts('conditionalcolor:m15_nyx*legendary:blue'), {
      tagParts: ['m15_nyx*legendary'],
      colorToApply: 'blue',
    });
    assert.deepEqual(helpers.parseWriteTextConditionalFrameRule('m15_nyx*legendary*!extended'), {
      frameName: 'm15 nyx',
      positiveMasks: ['legendary'],
      negativeMasks: ['extended'],
    });

    assert.equal(helpers.matchesWriteTextConditionalFrameRule(frames[0], helpers.parseWriteTextConditionalFrameRule('m15_nyx*legendary')), true);
    assert.equal(helpers.matchesWriteTextConditionalFrameRule(frames[0], helpers.parseWriteTextConditionalFrameRule('m15_nyx*!snow')), false);
    assert.equal(helpers.matchesWriteTextConditionalFrameRule(frames[1], helpers.parseWriteTextConditionalFrameRule('borderless*!missing')), true);

    assert.equal(helpers.resolveWriteTextConditionalColor('black', 'm15_nyx*legendary*!extended:gold', frames), 'gold');
    assert.equal(helpers.resolveWriteTextConditionalColor('black', 'm15_nyx*missing:gold', frames), 'black');
    assert.equal(helpers.resolveWriteTextConditionalColor('black', 'conditionalcolor:m15_nyx*legendary:blue', frames), 'blue');
  }
});

test('write text mana symbol render helpers preserve safari and outline drawing', async () => {
  const originalDocument = globalThis.document;
  const compatHelpers = await loadCreatorCompatFunctions([
    'isSafariUserAgent',
    'shouldUseSafariCombinedManaSymbol',
    'createSafariCombinedManaSymbolCanvas',
    'getManaSymbolRenderImages',
    'drawManaSymbolImage',
    'drawManaSymbolOutline',
    'copyManaSymbolShadowSettings',
    'hasManaSymbolOutlines',
    'renderSimpleManaSymbolQueue',
    'renderOutlinedManaSymbolQueue',
    'renderManaSymbolQueue',
  ], '{ isSafariUserAgent, shouldUseSafariCombinedManaSymbol, getManaSymbolRenderImages, drawManaSymbolImage, drawManaSymbolOutline, copyManaSymbolShadowSettings, hasManaSymbolOutlines, renderManaSymbolQueue }');
  const image = { src: 'symbol.svg' };
  const backImage = { src: 'back.svg' };
  const symbolData = {
    symbol: { image, backs: 1 },
    backImage,
    x: 1,
    y: 2,
    width: 10,
    height: 12,
    radius: 0,
    arcStart: 0.5,
    currentX: 3,
    color: null,
    hasOutline: false,
    outlineWidth: 4,
  };

  try {
    for (const helpers of [
      compatHelpers,
      {
        isSafariUserAgent: isSafariUserAgentFromModule,
        shouldUseSafariCombinedManaSymbol: shouldUseSafariCombinedManaSymbolFromModule,
        getManaSymbolRenderImages: getManaSymbolRenderImagesFromModule,
        drawManaSymbolImage: drawManaSymbolImageFromModule,
        drawManaSymbolOutline: drawManaSymbolOutlineFromModule,
        copyManaSymbolShadowSettings: copyManaSymbolShadowSettingsFromModule,
        hasManaSymbolOutlines: hasManaSymbolOutlinesFromModule,
        renderManaSymbolQueue: renderManaSymbolQueueFromModule,
      },
    ]) {
      const combinedDraws = [];
      globalThis.document = {
        createElement(tagName) {
          assert.equal(tagName, 'canvas');
          return {
            label: 'combined',
            width: 0,
            height: 0,
            getContext(contextType) {
              assert.equal(contextType, '2d');
              return {
                drawImage: (...args) => combinedDraws.push(args),
              };
            },
          };
        },
      };

      assert.equal(helpers.isSafariUserAgent('Version/17.0 Safari/605.1.15'), true);
      assert.equal(helpers.isSafariUserAgent('Chrome/120 Safari/537.36'), false);
      assert.equal(helpers.shouldUseSafariCombinedManaSymbol(symbolData, true), true);

      const safariImages = helpers.getManaSymbolRenderImages(symbolData, true);
      assert.equal(safariImages.imageToUse.label, 'combined');
      assert.equal(safariImages.backImageToUse, null);
      assert.deepEqual(combinedDraws, [
        [backImage, 0, 0, 10, 12],
        [image, 0, 0, 10, 12],
      ]);

      const calls = [];
      const targetContext = {
        drawImage: (...args) => calls.push(['drawImage', ...args]),
        drawImageArc: (...args) => calls.push(['drawImageArc', ...args]),
        fillImage: (...args) => calls.push(['fillImage', ...args]),
      };
      helpers.drawManaSymbolImage(targetContext, { ...symbolData, radius: 5 }, false);
      assert.deepEqual(calls, [
        ['drawImageArc', backImage, 1, 2, 10, 12, 5, 0.5, 3],
        ['drawImageArc', image, 1, 2, 10, 12, 5, 0.5, 3],
      ]);

      calls.length = 0;
      helpers.drawManaSymbolImage(targetContext, { ...symbolData, radius: 0, color: 'white' }, false);
      assert.deepEqual(calls, [
        ['fillImage', image, 1, 2, 10, 12, 'white'],
      ]);

      const outlineCalls = [];
      const outlineContext = {
        beginPath: () => outlineCalls.push(['beginPath']),
        arc: (...args) => outlineCalls.push(['arc', ...args]),
        fill: () => outlineCalls.push(['fill']),
      };
      helpers.drawManaSymbolOutline(outlineContext, { ...symbolData, hasOutline: true });
      assert.deepEqual(outlineCalls, [
        ['beginPath'],
        ['arc', 6, 8, 8, 0, 2 * Math.PI],
        ['fill'],
      ]);

      const shadowTarget = {};
      helpers.copyManaSymbolShadowSettings(shadowTarget, {
        shadowColor: 'black',
        shadowOffsetX: 1,
        shadowOffsetY: 2,
        shadowBlur: 3,
      });
      assert.deepEqual(shadowTarget, {
        shadowColor: 'black',
        shadowOffsetX: 1,
        shadowOffsetY: 2,
        shadowBlur: 3,
      });

      const renderCalls = [];
      const makeContext = (label) => ({
        shadowColor: 'black',
        shadowOffsetX: 1,
        shadowOffsetY: 2,
        shadowBlur: 3,
        drawImage: (...args) => renderCalls.push([label, 'drawImage', args[0].label || args[0], ...args.slice(1)]),
        drawImageArc: (...args) => renderCalls.push([label, 'drawImageArc', ...args]),
        fillImage: (...args) => renderCalls.push([label, 'fillImage', ...args]),
        clearRect: (...args) => renderCalls.push([label, 'clearRect', ...args]),
        beginPath: () => renderCalls.push([label, 'beginPath']),
        arc: (...args) => renderCalls.push([label, 'arc', ...args]),
        fill: () => renderCalls.push([label, 'fill']),
      });
      let cloneIndex = 0;
      const cloneLabels = ['outlineCanvas', 'symbolCanvas', 'tempCanvas'];
      const lineCanvas = {
        label: 'lineCanvas',
        width: 20,
        height: 30,
        cloneNode() {
          const label = cloneLabels[cloneIndex];
          cloneIndex += 1;
          return {
            label,
            getContext: () => makeContext(label),
          };
        },
      };
      const lineContext = makeContext('line');
      const outlinedSymbol = { ...symbolData, hasOutline: true, backImage: null, symbol: { image } };

      assert.equal(helpers.hasManaSymbolOutlines([symbolData]), false);
      assert.equal(helpers.hasManaSymbolOutlines([outlinedSymbol]), true);
      assert.deepEqual(helpers.renderManaSymbolQueue(lineContext, lineCanvas, [outlinedSymbol], 'Chrome/120 Safari/537.36'), []);
      assert.deepEqual(renderCalls.filter(call => call[0] === 'line' && call[1] === 'drawImage').map(call => call[2]), [
        'outlineCanvas',
        'tempCanvas',
        'symbolCanvas',
      ]);
    }
  } finally {
    if (originalDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = originalDocument;
    }
  }
});

test('write text content helper preserves normalization and tokenization order', async () => {
  const {
    shouldUseWriteTextCopyright,
    applyWriteTextCopyright,
    applyWriteTextInlineCardName,
    removeWriteTextEmptyArtistMarker,
    normalizeWriteTextSeparators,
    applyWriteTextFlavorVersion,
    applyWriteTextFontMarkers,
    normalizeWriteTextRawText,
    tokenizeWriteTextRawText,
    filterWriteTextManaCostTokens,
  } = await loadCreatorCompatFunctions([
    'shouldUseWriteTextCopyright',
    'applyWriteTextCopyright',
    'applyWriteTextInlineCardName',
    'removeWriteTextEmptyArtistMarker',
    'normalizeWriteTextSeparators',
    'applyWriteTextFlavorVersion',
    'applyWriteTextFontMarkers',
    'normalizeWriteTextRawText',
    'tokenizeWriteTextRawText',
    'filterWriteTextManaCostTokens',
  ], '{ shouldUseWriteTextCopyright, applyWriteTextCopyright, applyWriteTextInlineCardName, removeWriteTextEmptyArtistMarker, normalizeWriteTextSeparators, applyWriteTextFlavorVersion, applyWriteTextFontMarkers, normalizeWriteTextRawText, tokenizeWriteTextRawText, filterWriteTextManaCostTokens }');
  const artistMarker = '\uFFEE{savex2}{elemidinfo-artist}';

  for (const helpers of [
    {
      shouldUseWriteTextCopyright,
      applyWriteTextCopyright,
      applyWriteTextInlineCardName,
      removeWriteTextEmptyArtistMarker,
      normalizeWriteTextSeparators,
      applyWriteTextFlavorVersion,
      applyWriteTextFontMarkers,
      normalizeWriteTextRawText,
      tokenizeWriteTextRawText,
      filterWriteTextManaCostTokens,
    },
    {
      shouldUseWriteTextCopyright: shouldUseWriteTextCopyrightFromModule,
      applyWriteTextCopyright: applyWriteTextCopyrightFromModule,
      applyWriteTextInlineCardName: applyWriteTextInlineCardNameFromModule,
      removeWriteTextEmptyArtistMarker: removeWriteTextEmptyArtistMarkerFromModule,
      normalizeWriteTextSeparators: normalizeWriteTextSeparatorsFromModule,
      applyWriteTextFlavorVersion: applyWriteTextFlavorVersionFromModule,
      applyWriteTextFontMarkers: applyWriteTextFontMarkersFromModule,
      normalizeWriteTextRawText: normalizeWriteTextRawTextFromModule,
      tokenizeWriteTextRawText: tokenizeWriteTextRawTextFromModule,
      filterWriteTextManaCostTokens: filterWriteTextManaCostTokensFromModule,
    },
  ]) {
    let inlineCalls = 0;
    const getInlineCardNameValue = () => {
      inlineCalls += 1;
      return 'Card Name';
    };

    assert.equal(helpers.shouldUseWriteTextCopyright({ name: 'copyright' }, 'Custom copyright', false), true);
    assert.equal(helpers.shouldUseWriteTextCopyright({ name: 'Rules' }, 'Custom copyright', true), false);
    assert.equal(helpers.shouldUseWriteTextCopyright({ name: 'wizards' }, '', false), false);
    assert.equal(helpers.applyWriteTextCopyright('Original', { name: 'wizards' }, 'none', false), '');
    assert.equal(helpers.applyWriteTextCopyright('Original', { name: 'copyright' }, 'Custom copyright', false), 'Custom copyright');

    assert.equal(helpers.applyWriteTextInlineCardName('No marker.', getInlineCardNameValue), 'No marker.');
    assert.equal(inlineCalls, 0);
    assert.equal(helpers.applyWriteTextInlineCardName('~ and {CARDNAME}', getInlineCardNameValue), 'Card Name and Card Name');
    assert.equal(inlineCalls, 1);

    assert.equal(helpers.removeWriteTextEmptyArtistMarker(`Text${artistMarker}`, false), 'Text');
    assert.equal(helpers.removeWriteTextEmptyArtistMarker(`Text${artistMarker}`, true), `Text${artistMarker}`);
    assert.equal(helpers.normalizeWriteTextSeparators('Rules///Flavor//Line'), 'Rules{flavor}Flavor{lns}Line');
    assert.equal(helpers.applyWriteTextFlavorVersion('A{flavor}b', 'pokemon', true), 'A{oldflavor}{fontsize-20}{fontgillsansbolditalic}b');
    assert.equal(helpers.applyWriteTextFlavorVersion('A{flavor}b', 'dossier', true), 'A{/indent}{lns}{bar}{lns}{fixtextalign}B');
    assert.equal(helpers.applyWriteTextFlavorVersion('A{flavor}b', 'm15', false), 'A{oldflavor}b');
    assert.equal(helpers.applyWriteTextFontMarkers('A - *', { font: 'saloongirl' }), 'A \u2014 {fontbelerenbsc}*{fontsaloongirl}');

    assert.equal(helpers.normalizeWriteTextRawText(`~///Flavor - *${artistMarker}`, {
      textObject: { name: 'Rules', font: 'saloongirl' },
      textAllCaps: false,
      copyrightText: null,
      hasMargins: false,
      getInlineCardNameValue,
      hasArtist: false,
      cardVersion: 'm15',
      showsFlavorBar: false,
    }), 'Card Name{oldflavor}Flavor \u2014 {fontbelerenbsc}*{fontsaloongirl}');

    assert.deepEqual(helpers.tokenizeWriteTextRawText('A B\n{-}{divider}{flavor}{oldflavor}中', '|'), [
      'A',
      ' ',
      'B',
      '{line}',
      '\u2014',
      '{/indent}',
      '{lns}',
      '{bar}',
      '{lns}',
      '{fixtextalign}',
      '{/indent}',
      '{lns}',
      '{bar}',
      '{lns}',
      '{fixtextalign}',
      '{i}',
      '{/indent}',
      '{lns}',
      '{lns}',
      '{up30}',
      '{i}',
      '中',
    ]);
    assert.deepEqual(helpers.filterWriteTextManaCostTokens(['{w}', ' ', '{u}'], true), ['{w}', '{u}']);
    assert.deepEqual(helpers.filterWriteTextManaCostTokens(['{w}', ' ', '{u}'], false), ['{w}', ' ', '{u}']);
  }
});

test('write text content helper preserves vertical code spaces apostrophes and mana cost endings', async () => {
  const {
    isWriteTextCodeToken,
    appendWriteTextVerticalCharacters,
    buildWriteTextVerticalTokens,
  } = await loadCreatorCompatFunctions([
    'isWriteTextCodeToken',
    'appendWriteTextVerticalCharacters',
    'buildWriteTextVerticalTokens',
  ], '{ isWriteTextCodeToken, appendWriteTextVerticalCharacters, buildWriteTextVerticalTokens }');

  for (const helpers of [
    {
      isWriteTextCodeToken,
      appendWriteTextVerticalCharacters,
      buildWriteTextVerticalTokens,
    },
    {
      isWriteTextCodeToken: isWriteTextCodeTokenFromModule,
      appendWriteTextVerticalCharacters: appendWriteTextVerticalCharactersFromModule,
      buildWriteTextVerticalTokens: buildWriteTextVerticalTokensFromModule,
    },
  ]) {
    const verticalTokens = [];

    assert.equal(helpers.isWriteTextCodeToken('{lns}'), true);
    assert.equal(helpers.isWriteTextCodeToken('plain'), false);

    helpers.appendWriteTextVerticalCharacters(verticalTokens, 'A\u2019B', 0, 1, false, 10);
    assert.deepEqual(verticalTokens, [
      'A',
      '{lns}',
      '{right6}',
      '\u2019',
      '{lns}',
      '{up7.5}',
      'B',
      '{lns}',
    ]);

    assert.deepEqual(helpers.buildWriteTextVerticalTokens(['{w}', ' ', 'A\u2019B'], false, 10, 2), [
      '{w}',
      '{lns}',
      '{down2}',
      'A',
      '{lns}',
      '{right6}',
      '\u2019',
      '{lns}',
      '{up7.5}',
      'B',
      '{lns}',
    ]);
    assert.deepEqual(helpers.buildWriteTextVerticalTokens(['A', 'BC'], true, 10, 2), [
      'A',
      '{lns}',
      'B',
      'C',
    ]);
  }
});

test('write text style helper preserves color shadow outline and context setup', async () => {
  const originals = {
    scaleWidth: globalThis.scaleWidth,
    scaleHeight: globalThis.scaleHeight,
  };
  globalThis.scaleWidth = (value = 0) => Number(value) * 10;
  globalThis.scaleHeight = (value = 0) => Number(value) * 100;

  try {
    const {
      getWriteTextInitialColor,
      getWriteTextShadowSettings,
      isWriteTextBottomInfoBorderField,
      getWriteTextOutlineSettings,
      applyWriteTextLineContextBaseStyles,
    } = await loadCreatorCompatFunctions([
      'getWriteTextInitialColor',
      'getWriteTextShadowSettings',
      'isWriteTextBottomInfoBorderField',
      'getWriteTextOutlineSettings',
      'applyWriteTextLineContextBaseStyles',
    ], '{ getWriteTextInitialColor, getWriteTextShadowSettings, isWriteTextBottomInfoBorderField, getWriteTextOutlineSettings, applyWriteTextLineContextBaseStyles }');
    const frames = [{ name: 'M15 Nyx', masks: [{ name: 'Legendary Crown' }] }];

    for (const helpers of [
      {
        getWriteTextInitialColor,
        getWriteTextShadowSettings,
        isWriteTextBottomInfoBorderField,
        getWriteTextOutlineSettings,
        applyWriteTextLineContextBaseStyles,
      },
      {
        getWriteTextInitialColor: getWriteTextInitialColorFromModule,
        getWriteTextShadowSettings: getWriteTextShadowSettingsFromModule,
        isWriteTextBottomInfoBorderField: isWriteTextBottomInfoBorderFieldFromModule,
        getWriteTextOutlineSettings: getWriteTextOutlineSettingsFromModule,
        applyWriteTextLineContextBaseStyles: applyWriteTextLineContextBaseStylesFromModule,
      },
    ]) {
      assert.equal(helpers.getWriteTextInitialColor({
        color: 'black',
        conditionalColor: 'm15_nyx*legendary:gold',
      }, frames), 'gold');
      assert.equal(helpers.getWriteTextInitialColor({}, frames), 'black');
      assert.deepEqual(helpers.getWriteTextShadowSettings({
        shadow: 'blue',
        shadowX: 0.2,
        shadowY: 0.03,
        shadowBlur: 0.04,
      }), {
        color: 'blue',
        offsetX: 2,
        offsetY: 3,
        blur: 4,
      });
      assert.equal(helpers.isWriteTextBottomInfoBorderField({ name: 'midLeft' }), true);
      assert.equal(helpers.isWriteTextBottomInfoBorderField({ name: 'rules' }), false);
      assert.deepEqual(helpers.getWriteTextOutlineSettings({
        name: 'midLeft',
        outlineWidth: 0.02,
        lineCap: 'square',
        lineJoin: 'bevel',
        outlineColor: 'red',
      }, { hideBottomInfoBorder: true }), {
        width: 0,
        lineCap: 'square',
        lineJoin: 'bevel',
        strokeStyle: 'red',
      });
      assert.deepEqual(helpers.getWriteTextOutlineSettings({
        name: 'rules',
        outlineWidth: 0.02,
      }, { hideBottomInfoBorder: true }), {
        width: 2,
        lineCap: 'round',
        lineJoin: 'round',
        strokeStyle: 'black',
      });

      const lineContext = {};
      helpers.applyWriteTextLineContextBaseStyles(lineContext, {
        font: 'italic 20px mplantin',
        fillStyle: 'green',
        shadow: {
          color: 'blue',
          offsetX: 2,
          offsetY: 3,
          blur: 4,
        },
        outline: {
          width: 2,
          lineCap: 'round',
          lineJoin: 'bevel',
          strokeStyle: 'red',
        },
      });
      assert.deepEqual(lineContext, {
        font: 'italic 20px mplantin',
        fillStyle: 'green',
        shadowColor: 'blue',
        shadowOffsetX: 2,
        shadowOffsetY: 3,
        shadowBlur: 4,
        strokeStyle: 'red',
        lineWidth: 2,
        lineCap: 'round',
        lineJoin: 'bevel',
      });
    }
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('text font helper preserves write-text declarations and style tokens', async () => {
  const {
    buildWriteTextFontDeclaration,
    startWriteTextItalicFontState,
    endWriteTextItalicFontState,
    startWriteTextBoldFontState,
    endWriteTextBoldFontState,
    applyWriteTextFontState,
    resolveWriteTextFontCode,
    applyWriteTextBelerenGlyphs,
  } = await loadCreatorCompatFunctions([
    'buildWriteTextFontDeclaration',
    'startWriteTextItalicFontState',
    'endWriteTextItalicFontState',
    'startWriteTextBoldFontState',
    'endWriteTextBoldFontState',
    'applyWriteTextFontState',
    'resolveWriteTextFontCode',
    'applyWriteTextBelerenGlyphs',
  ], '{ buildWriteTextFontDeclaration, startWriteTextItalicFontState, endWriteTextItalicFontState, startWriteTextBoldFontState, endWriteTextBoldFontState, applyWriteTextFontState, resolveWriteTextFontCode, applyWriteTextBelerenGlyphs }');

  for (const helpers of [
    {
      buildWriteTextFontDeclaration,
      startWriteTextItalicFontState,
      endWriteTextItalicFontState,
      startWriteTextBoldFontState,
      endWriteTextBoldFontState,
      applyWriteTextFontState,
      resolveWriteTextFontCode,
      applyWriteTextBelerenGlyphs,
    },
    {
      buildWriteTextFontDeclaration: buildWriteTextFontDeclarationFromModule,
      startWriteTextItalicFontState: startWriteTextItalicFontStateFromModule,
      endWriteTextItalicFontState: endWriteTextItalicFontStateFromModule,
      startWriteTextBoldFontState: startWriteTextBoldFontStateFromModule,
      endWriteTextBoldFontState: endWriteTextBoldFontStateFromModule,
      applyWriteTextFontState: applyWriteTextFontStateFromModule,
      resolveWriteTextFontCode: resolveWriteTextFontCodeFromModule,
      applyWriteTextBelerenGlyphs: applyWriteTextBelerenGlyphsFromModule,
    },
  ]) {
    assert.equal(helpers.buildWriteTextFontDeclaration('italic ', 20, 'mplantin', 'i'), 'italic 20px mplantini');
    assert.equal(helpers.applyWriteTextBelerenGlyphs(null, '12px belerenb'), null);
    assert.equal(helpers.applyWriteTextBelerenGlyphs('f h m n k x staff', '12px mplantin'), 'f h m n k x staff');
    assert.equal(
      helpers.applyWriteTextBelerenGlyphs('f h m n k x staff', '12px belerenb'),
      '\ue006\ue007\ue008\ue009\ue00ax staf\ue006',
    );
    assert.equal(helpers.applyWriteTextBelerenGlyphs('safe', '12px belerenb'), 'safe');
    assert.equal(helpers.resolveWriteTextFontCode('{colorred}', 'colorred', null), null);
    assert.deepEqual(helpers.resolveWriteTextFontCode('{fontbeleren}', 'fontbeleren', null), {
      textFont: 'beleren',
      textFontExtension: '',
      textFontStyle: '',
      savedFont: null,
      wordToWrite: null,
    });
    assert.deepEqual(helpers.resolveWriteTextFontCode('Roll text', 'roll text', 'belerenb'), {
      textFont: 'belerenb',
      textFontExtension: '',
      textFontStyle: '',
      savedFont: null,
      wordToWrite: 'Roll text',
    });
    assert.deepEqual(helpers.resolveWriteTextFontCode('{fontmplantin}', 'fontmplantin', 'belerenb'), {
      textFont: 'belerenb',
      textFontExtension: '',
      textFontStyle: '',
      savedFont: null,
      wordToWrite: '{fontmplantin}',
    });
    assert.deepEqual(helpers.startWriteTextItalicFontState('gilllsans', 'bold '), {
      fontStyle: 'bold ',
      fontExtension: 'italic',
    });
    assert.deepEqual(helpers.startWriteTextItalicFontState('neosans', ''), {
      fontStyle: '',
      fontExtension: 'italic',
    });
    assert.deepEqual(helpers.startWriteTextItalicFontState('mplantin', 'italic bold '), {
      fontStyle: 'bold ',
      fontExtension: 'i',
    });
    assert.deepEqual(helpers.startWriteTextItalicFontState('custom', 'bold '), {
      fontStyle: 'bold italic ',
      fontExtension: '',
    });
    assert.deepEqual(helpers.startWriteTextItalicFontState('custom', 'italic '), {
      fontStyle: 'italic ',
      fontExtension: '',
    });
    assert.deepEqual(helpers.endWriteTextItalicFontState('bold italic '), {
      fontStyle: 'bold ',
      fontExtension: '',
    });
    assert.deepEqual(helpers.startWriteTextBoldFontState('gillsans', 'italic ', 'i'), {
      fontStyle: 'italic ',
      fontExtension: 'bold',
    });
    assert.deepEqual(helpers.startWriteTextBoldFontState('custom', 'italic ', 'i'), {
      fontStyle: 'italic bold ',
      fontExtension: 'i',
    });
    assert.deepEqual(helpers.startWriteTextBoldFontState('custom', 'bold ', 'i'), {
      fontStyle: 'bold ',
      fontExtension: 'i',
    });
    assert.deepEqual(helpers.endWriteTextBoldFontState('gillsans', 'italic ', 'bold'), {
      fontStyle: 'italic ',
      fontExtension: '',
    });
    assert.deepEqual(helpers.endWriteTextBoldFontState('custom', 'italic bold ', 'i'), {
      fontStyle: 'italic ',
      fontExtension: 'i',
    });

    const lineContext = {};
    helpers.applyWriteTextFontState(lineContext, 'bold ', 12, 'custom', '');
    assert.deepEqual(lineContext, { font: 'bold 12px custom' });
  }
});

test('write text layout helper preserves wrap and shrink decisions', async () => {
  const {
    resolveWriteTextOverflow,
    resolveWriteTextHeightOverflow,
  } = await loadCreatorCompatFunctions([
    'resolveWriteTextOverflow',
    'resolveWriteTextHeightOverflow',
  ], '{ resolveWriteTextOverflow, resolveWriteTextHeightOverflow }');

  for (const helpers of [
    {
      resolveWriteTextOverflow,
      resolveWriteTextHeightOverflow,
    },
    {
      resolveWriteTextOverflow: resolveWriteTextOverflowFromModule,
      resolveWriteTextHeightOverflow: resolveWriteTextHeightOverflowFromModule,
    },
  ]) {
    assert.equal(helpers.resolveWriteTextOverflow('', 20, 0, 10, 0, false, 12), null);
    assert.equal(helpers.resolveWriteTextOverflow('word', 9, 0, 10, 0, false, 12), null);
    assert.equal(helpers.resolveWriteTextOverflow('word', 10, 0, 10, 1, false, 12), null);
    assert.equal(helpers.resolveWriteTextOverflow('word', Number.NaN, 0, 10, 0, false, 12), null);
    assert.deepEqual(helpers.resolveWriteTextOverflow('word', 10, 0, 10, 0, true, 12), {
      newLine: false,
      startingTextSize: 11,
      retryOuterLoop: true,
    });
    assert.deepEqual(helpers.resolveWriteTextOverflow('word', 10, 0, 10, 0, true, 1), {
      newLine: true,
      startingTextSize: 1,
      retryOuterLoop: false,
    });
    assert.deepEqual(helpers.resolveWriteTextOverflow('word', 8, 3, 10, '0', false, 12), {
      newLine: true,
      startingTextSize: 12,
      retryOuterLoop: false,
    });

    assert.equal(helpers.resolveWriteTextHeightOverflow(10, 10, true, false, 12, 0), null);
    assert.equal(helpers.resolveWriteTextHeightOverflow(11, 10, false, false, 12, 0), null);
    assert.equal(helpers.resolveWriteTextHeightOverflow(11, 10, true, true, 12, 0), null);
    assert.equal(helpers.resolveWriteTextHeightOverflow(11, 10, true, false, 1, 0), null);
    assert.equal(helpers.resolveWriteTextHeightOverflow(11, 10, true, false, 12, 1), null);
    assert.deepEqual(helpers.resolveWriteTextHeightOverflow(11, 10, true, false, 12, '0'), {
      startingTextSize: 11,
      retryOuterLoop: true,
    });
  }
});

test('write text layout helper preserves line and final offsets', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'resolveWriteTextLineHorizontalAdjust',
    'resolveWriteTextFinalHorizontalAdjust',
    'resolveWriteTextVerticalAdjust',
  ], '{ resolveWriteTextLineHorizontalAdjust, resolveWriteTextFinalHorizontalAdjust, resolveWriteTextVerticalAdjust }');

  for (const helpers of [
    compatHelpers,
    {
      resolveWriteTextLineHorizontalAdjust: resolveWriteTextLineHorizontalAdjustFromModule,
      resolveWriteTextFinalHorizontalAdjust: resolveWriteTextFinalHorizontalAdjustFromModule,
      resolveWriteTextVerticalAdjust: resolveWriteTextVerticalAdjustFromModule,
    },
  ]) {
    const {
      resolveWriteTextLineHorizontalAdjust,
      resolveWriteTextFinalHorizontalAdjust,
      resolveWriteTextVerticalAdjust,
    } = helpers;

    assert.equal(resolveWriteTextLineHorizontalAdjust('left', 100, 40), 0);
    assert.equal(resolveWriteTextLineHorizontalAdjust('center', 100, 40), 30);
    assert.equal(resolveWriteTextLineHorizontalAdjust('right', 100, 40), 60);
    assert.equal(resolveWriteTextLineHorizontalAdjust('justify', 100, 40), 0);

    assert.equal(resolveWriteTextFinalHorizontalAdjust('left', 'left', 100, 40), 0);
    assert.equal(resolveWriteTextFinalHorizontalAdjust('right', 'left', 100, 40), 60);
    assert.equal(resolveWriteTextFinalHorizontalAdjust('right', 'center', 100, 40), 30);
    assert.equal(resolveWriteTextFinalHorizontalAdjust('right', 'right', 100, 40), 0);
    assert.equal(resolveWriteTextFinalHorizontalAdjust('center', 'left', 100, 40), 30);
    assert.equal(resolveWriteTextFinalHorizontalAdjust('center', 'right', 100, 40), -30);
    assert.equal(resolveWriteTextFinalHorizontalAdjust('center', 'center', 100, 40), 0);

    assert.equal(resolveWriteTextVerticalAdjust(false, 100, 40, 20), 31.5);
    assert.equal(resolveWriteTextVerticalAdjust(undefined, 100, 40, 20), 31.5);
    assert.equal(resolveWriteTextVerticalAdjust(true, 100, 40, 20), 0);
    assert.equal(resolveWriteTextVerticalAdjust('yes', 100, 40, 20), 0);
  }
});

test('write text layout helper preserves write and advance decisions', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'shouldWriteTextWord',
    'getWriteTextJustifySettings',
    'measureWriteTextWordAdvance',
  ], '{ shouldWriteTextWord, getWriteTextJustifySettings, measureWriteTextWordAdvance }');

  for (const helpers of [
    compatHelpers,
    {
      shouldWriteTextWord: shouldWriteTextWordFromModule,
      getWriteTextJustifySettings: getWriteTextJustifySettingsFromModule,
      measureWriteTextWordAdvance: measureWriteTextWordAdvanceFromModule,
    },
  ]) {
    const {
      shouldWriteTextWord,
      getWriteTextJustifySettings,
      measureWriteTextWordAdvance,
    } = helpers;

    assert.equal(shouldWriteTextWord('', 10, 0, false), false);
    assert.equal(shouldWriteTextWord(' ', 0, 0, false), false);
    assert.equal(shouldWriteTextWord(' ', 1, 0, false), true);
    assert.equal(shouldWriteTextWord('word', 0, 0, false), true);
    assert.equal(shouldWriteTextWord('word', 0, 0, true), false);
    assert.equal(shouldWriteTextWord('word', '0', 0, false), true);

    const justifySettings = getWriteTextJustifySettings();
    assert.deepEqual(justifySettings, {
      maxSpaceSize: 6,
      minSpaceSize: 0,
    });

    const calls = [];
    const lineContext = {
      measureText(text) {
        calls.push(['measureText', text]);
        return { width: 13 };
      },
      measureJustifiedText(text, width, settings) {
        calls.push(['measureJustifiedText', text, width, settings]);
        return 21;
      },
    };
    assert.equal(measureWriteTextWordAdvance(lineContext, 'word', false, 100, justifySettings), 13);
    assert.equal(measureWriteTextWordAdvance(lineContext, 'word', true, 100, justifySettings), 21);
    assert.deepEqual(calls, [
      ['measureText', 'word'],
      ['measureJustifiedText', 'word', 100, justifySettings],
    ]);
  }
});

test('write text layout helper preserves target and draw transforms', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'resolveWriteTextFinalTargetContext',
    'drawWriteTextFinalParagraph',
  ], '{ resolveWriteTextFinalTargetContext, drawWriteTextFinalParagraph }');

  for (const helpers of [
    compatHelpers,
    {
      resolveWriteTextFinalTargetContext: resolveWriteTextFinalTargetContextFromModule,
      drawWriteTextFinalParagraph: drawWriteTextFinalParagraphFromModule,
    },
  ]) {
    const {
      resolveWriteTextFinalTargetContext,
      drawWriteTextFinalParagraph,
    } = helpers;

    const targetContext = { name: 'target' };
    const prePTContext = { name: 'prePT' };
    assert.equal(resolveWriteTextFinalTargetContext(targetContext, false, prePTContext), targetContext);
    assert.equal(resolveWriteTextFinalTargetContext(targetContext, true, prePTContext), prePTContext);

    const paragraphCanvas = { name: 'paragraphCanvas' };
    const calls = [];
    const context = {
      save() {
        calls.push(['save']);
      },
      translate(x, y) {
        calls.push(['translate', x, y]);
      },
      rotate(angle) {
        calls.push(['rotate', angle]);
      },
      drawImage(...args) {
        calls.push(['drawImage', ...args]);
      },
      restore() {
        calls.push(['restore']);
      },
    };
    const drawState = {
      textRotation: 0,
      textX: 100,
      textY: 200,
      ptShift: [2, 3],
      permaShift: [11, 13],
      canvasMargin: 30,
      finalHorizontalAdjust: 7,
      verticalAdjust: 5,
    };

    drawWriteTextFinalParagraph(context, paragraphCanvas, drawState);
    assert.deepEqual(calls, [
      ['drawImage', paragraphCanvas, 90, 191],
    ]);

    calls.length = 0;
    drawWriteTextFinalParagraph(context, paragraphCanvas, {
      ...drawState,
      textRotation: 90,
    });
    assert.deepEqual(calls[0], ['save']);
    assert.deepEqual(calls[1], ['translate', 102, 203]);
    assert.equal(calls[2][0], 'rotate');
    assert.ok(Math.abs(calls[2][1] - Math.PI / 2) < 1e-12);
    assert.deepEqual(calls[3], ['drawImage', paragraphCanvas, -12, -12]);
    assert.deepEqual(calls[4], ['restore']);
  }
});

test('write text positioning helper preserves inline insertion x shifts', async () => {
  const compatResolveWriteTextInsertionCode = await loadCreatorCompatFunctions(
    ['resolveWriteTextInsertionCode'],
    'resolveWriteTextInsertionCode',
  );

  for (const resolveWriteTextInsertionCode of [
    compatResolveWriteTextInsertionCode,
    resolveWriteTextInsertionCodeFromModule,
  ]) {
    assert.deepEqual(resolveWriteTextInsertionCode('{Lins}', 100, 20), {
      currentX: 102,
    });
    assert.deepEqual(resolveWriteTextInsertionCode('{Rins}', 100, 20), {
      currentX: 98,
    });
    assert.equal(resolveWriteTextInsertionCode('{lins}', 100, 20), null);
    assert.equal(resolveWriteTextInsertionCode('word', 100, 20), null);
    assert.deepEqual(resolveWriteTextInsertionCode('{Lins}', '100', 20), {
      currentX: '1002',
    });
  }
});

test('write text controls helper preserves CStext punctuation adjustments', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'shouldApplyWriteTextChineseSpacing',
    'resolveWriteTextChineseSpacing',
  ], '{ shouldApplyWriteTextChineseSpacing, resolveWriteTextChineseSpacing }');

  for (const helpers of [
    compatHelpers,
    {
      shouldApplyWriteTextChineseSpacing: shouldApplyWriteTextChineseSpacingFromModule,
      resolveWriteTextChineseSpacing: resolveWriteTextChineseSpacingFromModule,
    },
  ]) {
    const {
      shouldApplyWriteTextChineseSpacing,
      resolveWriteTextChineseSpacing,
    } = helpers;

    assert.equal(shouldApplyWriteTextChineseSpacing(false, undefined), false);
    assert.equal(shouldApplyWriteTextChineseSpacing(true, 'plain text'), false);
    assert.equal(shouldApplyWriteTextChineseSpacing(true, 'prefix CStext suffix'), true);

    assert.deepEqual(resolveWriteTextChineseSpacing('字', '）', 100, 0, 20, false), {
      currentX: 90,
      lastWord: '字',
    });
    assert.deepEqual(resolveWriteTextChineseSpacing('）', '。', 100, 0, 20, false), {
      currentX: 90,
      lastWord: '）',
    });
    assert.deepEqual(resolveWriteTextChineseSpacing('字', '：', 100, 0, 20, false), {
      currentX: 95,
      lastWord: '字',
    });
    assert.deepEqual(resolveWriteTextChineseSpacing('：', '字', 100, 0, 20, false), {
      currentX: 105,
      lastWord: '：',
    });
    assert.deepEqual(resolveWriteTextChineseSpacing('（', '。', 100, 0, 20, false), {
      currentX: 80,
      lastWord: '（',
    });
    assert.deepEqual(resolveWriteTextChineseSpacing('「', '字', 100, 0, 20, false), {
      currentX: 90,
      lastWord: '「',
    });
    assert.deepEqual(resolveWriteTextChineseSpacing('：', '；', 100, 0, 20, false), {
      currentX: 100,
      lastWord: '：',
    });
    assert.deepEqual(resolveWriteTextChineseSpacing('（', '。', 100, 0, 20, true), {
      currentX: 100,
      lastWord: '（',
    });
    assert.deepEqual(resolveWriteTextChineseSpacing('（', '。', '0', 0, 20, false), {
      currentX: '0',
      lastWord: '（',
    });
  }
});

test('write text controls helper preserves alignment justify and restore codes', async () => {
  const compatResolveWriteTextAlignmentCode = await loadCreatorCompatFunctions(
    ['resolveWriteTextAlignmentCode'],
    'resolveWriteTextAlignmentCode',
  );

  for (const resolveWriteTextAlignmentCode of [
    compatResolveWriteTextAlignmentCode,
    resolveWriteTextAlignmentCodeFromModule,
  ]) {
    assert.deepEqual(resolveWriteTextAlignmentCode('left', 'center', 'right', 'right'), {
      textAlign: 'left',
      textJustify: 'right',
    });
    assert.deepEqual(resolveWriteTextAlignmentCode('center', 'left', 'right', 'right'), {
      textAlign: 'center',
      textJustify: 'right',
    });
    assert.deepEqual(resolveWriteTextAlignmentCode('right', 'left', 'center', 'center'), {
      textAlign: 'right',
      textJustify: 'center',
    });
    assert.deepEqual(resolveWriteTextAlignmentCode('justify-left', 'right', 'center', 'left'), {
      textAlign: 'right',
      textJustify: 'left',
    });
    assert.deepEqual(resolveWriteTextAlignmentCode('justify-center', 'right', 'left', 'left'), {
      textAlign: 'right',
      textJustify: 'center',
    });
    assert.deepEqual(resolveWriteTextAlignmentCode('justify-right', 'center', 'left', 'left'), {
      textAlign: 'center',
      textJustify: 'right',
    });
    assert.deepEqual(resolveWriteTextAlignmentCode('fixtextalign', 'right', 'center', 'left'), {
      textAlign: 'left',
      textJustify: 'center',
    });
    assert.deepEqual(resolveWriteTextAlignmentCode('prefix-fixtextalign', 'right', 'center', 'left'), {
      textAlign: 'left',
      textJustify: 'center',
    });
    assert.equal(resolveWriteTextAlignmentCode('left12', 'right', 'center', 'left'), null);
    assert.equal(resolveWriteTextAlignmentCode('fontcolorred', 'right', 'center', 'left'), null);
  }
});

test('write text positioning helper preserves inline and cursor offsets', async () => {
  const compatResolveWriteTextPositionCode = await loadCreatorCompatFunctions(
    ['resolveWriteTextPositionCode'],
    'resolveWriteTextPositionCode',
  );

  for (const resolveWriteTextPositionCode of [
    compatResolveWriteTextPositionCode,
    resolveWriteTextPositionCodeFromModule,
  ]) {
    assert.deepEqual(resolveWriteTextPositionCode('upinline7.5', 10, 20, 30), {
      lineY: 3,
      currentY: 20,
      currentX: 30,
    });
    assert.deepEqual(resolveWriteTextPositionCode('up12', 10, 20, 30), {
      lineY: 10,
      currentY: 8,
      currentX: 30,
    });
    assert.deepEqual(resolveWriteTextPositionCode('down5', 10, 20, 30), {
      lineY: 10,
      currentY: 25,
      currentX: 30,
    });
    assert.deepEqual(resolveWriteTextPositionCode('left6', 10, 20, 30), {
      lineY: 10,
      currentY: 20,
      currentX: 24,
    });
    assert.deepEqual(resolveWriteTextPositionCode('right6.5', 10, 20, 30), {
      lineY: 10,
      currentY: 20,
      currentX: 36,
    });
    assert.deepEqual(resolveWriteTextPositionCode('downbad', 10, 20, 30), {
      lineY: 10,
      currentY: 20,
      currentX: 30,
    });
    assert.equal(resolveWriteTextPositionCode('up', 10, 20, 30), null);
    assert.equal(resolveWriteTextPositionCode('fontcolorred', 10, 20, 30), null);
  }
});

test('write text style helper preserves shadow token parsing and context sync', async () => {
  const {
    resolveWriteTextShadowCode,
    applyWriteTextShadowState,
  } = await loadCreatorCompatFunctions([
    'resolveWriteTextShadowCode',
    'applyWriteTextShadowState',
  ], '{ resolveWriteTextShadowCode, applyWriteTextShadowState }');
  const currentState = {
    color: 'black',
    offsetX: 1,
    offsetY: 2,
    blur: 3,
  };

  for (const helpers of [
    {
      resolveWriteTextShadowCode,
      applyWriteTextShadowState,
    },
    {
      resolveWriteTextShadowCode: resolveWriteTextShadowCodeFromModule,
      applyWriteTextShadowState: applyWriteTextShadowStateFromModule,
    },
  ]) {
    assert.equal(helpers.resolveWriteTextShadowCode('fontcolorred', currentState), null);
    assert.deepEqual(helpers.resolveWriteTextShadowCode('shadowcolorblue', currentState), {
      color: 'blue',
      offsetX: 1,
      offsetY: 2,
      blur: 3,
    });
    assert.deepEqual(helpers.resolveWriteTextShadowCode('shadowblur7.5', currentState), {
      color: 'black',
      offsetX: 1,
      offsetY: 2,
      blur: 7,
    });
    assert.deepEqual(helpers.resolveWriteTextShadowCode('shadowx-3', currentState), {
      color: 'black',
      offsetX: -3,
      offsetY: 2,
      blur: 3,
    });
    assert.deepEqual(helpers.resolveWriteTextShadowCode('shadowy4', currentState), {
      color: 'black',
      offsetX: 1,
      offsetY: 4,
      blur: 3,
    });
    assert.deepEqual(helpers.resolveWriteTextShadowCode('shadow6', currentState), {
      color: 'black',
      offsetX: 6,
      offsetY: 6,
      blur: 3,
    });
    assert.deepEqual(helpers.resolveWriteTextShadowCode('shadowbad', currentState), {
      color: 'black',
      offsetX: 0,
      offsetY: 0,
      blur: 3,
    });

    const lineContext = {};
    helpers.applyWriteTextShadowState(lineContext, {
      color: 'green',
      offsetX: 4,
      offsetY: 5,
      blur: 6,
    });
    assert.deepEqual(lineContext, {
      shadowColor: 'green',
      shadowOffsetX: 4,
      shadowOffsetY: 5,
      shadowBlur: 6,
    });
  }
});

test('write text style helper preserves outline and cap join parsing', async () => {
  const {
    resolveWriteTextLineStyleCode,
    applyWriteTextLineStyleState,
  } = await loadCreatorCompatFunctions([
    'resolveWriteTextLineStyleCode',
    'applyWriteTextLineStyleState',
  ], '{ resolveWriteTextLineStyleCode, applyWriteTextLineStyleState }');
  const currentState = {
    strokeStyle: 'black',
    lineWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
  };

  for (const helpers of [
    {
      resolveWriteTextLineStyleCode,
      applyWriteTextLineStyleState,
    },
    {
      resolveWriteTextLineStyleCode: resolveWriteTextLineStyleCodeFromModule,
      applyWriteTextLineStyleState: applyWriteTextLineStyleStateFromModule,
    },
  ]) {
    assert.equal(helpers.resolveWriteTextLineStyleCode('fontcolorred', currentState), null);
    assert.deepEqual(helpers.resolveWriteTextLineStyleCode('outlinecolorblue', currentState), {
      strokeStyle: 'blue',
      lineWidth: 2,
      lineCap: 'round',
      lineJoin: 'round',
    });
    assert.deepEqual(helpers.resolveWriteTextLineStyleCode('outline7.5', currentState), {
      strokeStyle: 'black',
      lineWidth: 7,
      lineCap: 'round',
      lineJoin: 'round',
    });
    assert.deepEqual(helpers.resolveWriteTextLineStyleCode('linecap square ', currentState), {
      strokeStyle: 'black',
      lineWidth: 2,
      lineCap: 'square',
      lineJoin: 'round',
    });
    assert.deepEqual(helpers.resolveWriteTextLineStyleCode('linejoin bevel ', currentState), {
      strokeStyle: 'black',
      lineWidth: 2,
      lineCap: 'round',
      lineJoin: 'bevel',
    });

    const invalidOutlineState = helpers.resolveWriteTextLineStyleCode('outlinebad', currentState);
    assert.equal(invalidOutlineState.strokeStyle, 'black');
    assert.equal(Number.isNaN(invalidOutlineState.lineWidth), true);
    assert.equal(invalidOutlineState.lineCap, 'round');
    assert.equal(invalidOutlineState.lineJoin, 'round');

    const lineContext = {};
    helpers.applyWriteTextLineStyleState(lineContext, {
      strokeStyle: 'red',
      lineWidth: 4,
      lineCap: 'butt',
      lineJoin: 'miter',
    });
    assert.deepEqual(lineContext, {
      strokeStyle: 'red',
      lineWidth: 4,
      lineCap: 'butt',
      lineJoin: 'miter',
    });
  }
});

test('write text style helper preserves fill and font size parsing', async () => {
  const {
    resolveWriteTextColorCode,
    applyWriteTextFillColor,
    resolveWriteTextSizeCode,
  } = await loadCreatorCompatFunctions([
    'resolveWriteTextColorCode',
    'applyWriteTextFillColor',
    'resolveWriteTextSizeCode',
  ], '{ resolveWriteTextColorCode, applyWriteTextFillColor, resolveWriteTextSizeCode }');
  const frames = [
    {
      name: 'M15 Nyx',
      masks: [{ name: 'Legendary Crown' }],
    },
  ];

  for (const helpers of [
    {
      resolveWriteTextColorCode,
      applyWriteTextFillColor,
      resolveWriteTextSizeCode,
    },
    {
      resolveWriteTextColorCode: resolveWriteTextColorCodeFromModule,
      applyWriteTextFillColor: applyWriteTextFillColorFromModule,
      resolveWriteTextSizeCode: resolveWriteTextSizeCodeFromModule,
    },
  ]) {
    assert.equal(helpers.resolveWriteTextColorCode('fontsize4', 'black', frames), null);
    assert.equal(helpers.resolveWriteTextColorCode('fontcolorred', 'black', frames), 'red');
    assert.equal(helpers.resolveWriteTextColorCode('fontcolor', 'black', frames), '');
    assert.equal(helpers.resolveWriteTextColorCode('conditionalcolor:m15_nyx*legendary:gold', 'black', frames), 'gold');
    assert.equal(helpers.resolveWriteTextColorCode('conditionalcolor:m15_nyx*missing:gold', 'black', frames), 'black');

    const lineContext = {};
    helpers.applyWriteTextFillColor(lineContext, 'blue');
    assert.deepEqual(lineContext, { fillStyle: 'blue' });

    assert.equal(helpers.resolveWriteTextSizeCode('fontcolorred', 20), null);
    assert.equal(helpers.resolveWriteTextSizeCode('fontsize4', 20), 24);
    assert.equal(helpers.resolveWriteTextSizeCode('fontsize-3', 20), 17);
    assert.equal(helpers.resolveWriteTextSizeCode('fontsize18pt', 20), 150);
    assert.equal(helpers.resolveWriteTextSizeCode('fontsizebad', 20), 20);
    assert.equal(helpers.resolveWriteTextSizeCode('fontsizebadpt', 20), 0);
  }
});

test('write text mana color and kerning helpers preserve token parsing', async () => {
  const {
    resolveWriteTextManaColorCode,
    resolveWriteTextKerningCode,
    applyWriteTextKerningCode,
  } = await loadCreatorCompatFunctions([
    'resolveWriteTextManaColorCode',
    'resolveWriteTextKerningCode',
    'applyWriteTextKerningCode',
  ], '{ resolveWriteTextManaColorCode, resolveWriteTextKerningCode, applyWriteTextKerningCode }');

  for (const helpers of [
    {
      resolveWriteTextManaColorCode,
      resolveWriteTextKerningCode,
      applyWriteTextKerningCode,
    },
    {
      resolveWriteTextManaColorCode: resolveWriteTextManaColorCodeFromModule,
      resolveWriteTextKerningCode: resolveWriteTextKerningCodeFromModule,
      applyWriteTextKerningCode: applyWriteTextKerningCodeFromModule,
    },
  ]) {
    assert.equal(helpers.resolveWriteTextManaColorCode('fontcolorred'), null);
    assert.deepEqual(helpers.resolveWriteTextManaColorCode('manacolordefault'), { manaSymbolColor: null });
    assert.deepEqual(helpers.resolveWriteTextManaColorCode('manacolorblue'), { manaSymbolColor: 'blue' });
    assert.deepEqual(helpers.resolveWriteTextManaColorCode('manacolor'), { manaSymbolColor: 'white' });

    assert.equal(helpers.resolveWriteTextKerningCode('fontcolorred'), null);
    assert.equal(helpers.resolveWriteTextKerningCode('kerning3'), '3px');
    assert.equal(helpers.resolveWriteTextKerningCode('kerning0'), '0px');
    assert.equal(helpers.resolveWriteTextKerningCode('kerning-2'), '-2px');

    const lineContext = { font: 'italic 20px mplantin' };
    helpers.applyWriteTextKerningCode(lineContext, '4px');
    assert.deepEqual(lineContext, {
      font: 'italic 20px mplantin',
      letterSpacing: '4px',
    });
  }
});

test('write text transform helpers preserve pt shift and geometry parsing', async () => {
  const originals = {
    scaleWidth: globalThis.scaleWidth,
    scaleHeight: globalThis.scaleHeight,
  };
  globalThis.scaleWidth = (value = 0) => Number(value) * 10;
  globalThis.scaleHeight = (value = 0) => Number(value) * 100;

  try {
    const {
      shouldApplyWriteTextPtShift,
      resolveWriteTextPtShiftCode,
      resolveWriteTextTransformCode,
    } = await loadCreatorCompatFunctions([
      'shouldApplyWriteTextPtShift',
      'resolveWriteTextPtShiftCode',
      'resolveWriteTextTransformCode',
    ], '{ shouldApplyWriteTextPtShift, resolveWriteTextPtShiftCode, resolveWriteTextTransformCode }');
    const normalCard = { frames: [{ name: 'M15' }], version: 'normal' };
    const powerToughnessCard = { frames: [{ name: 'Power/Toughness Box' }], version: 'normal' };
    const planeswalkerCard = { frames: [], version: 'classicplaneswalker' };
    const specialVersionCard = { frames: [], version: 'commanderLegends' };
    const transformState = {
      permaShift: [1, 2],
      textArcRadius: 3,
      textArcStart: 4,
      textRotation: 5,
    };

    for (const helpers of [
      {
        shouldApplyWriteTextPtShift,
        resolveWriteTextPtShiftCode,
        resolveWriteTextTransformCode,
      },
      {
        shouldApplyWriteTextPtShift: shouldApplyWriteTextPtShiftFromModule,
        resolveWriteTextPtShiftCode: resolveWriteTextPtShiftCodeFromModule,
        resolveWriteTextTransformCode: resolveWriteTextTransformCodeFromModule,
      },
    ]) {
      assert.equal(helpers.shouldApplyWriteTextPtShift(normalCard), false);
      assert.equal(helpers.shouldApplyWriteTextPtShift(powerToughnessCard), true);
      assert.equal(helpers.shouldApplyWriteTextPtShift(planeswalkerCard), true);
      assert.equal(helpers.shouldApplyWriteTextPtShift(specialVersionCard), true);
      assert.equal(helpers.resolveWriteTextPtShiftCode('fontcolorred', powerToughnessCard), null);
      assert.equal(helpers.resolveWriteTextPtShiftCode('ptshift0.1,0.2', normalCard), null);
      assert.deepEqual(helpers.resolveWriteTextPtShiftCode('ptshift0.1,0.2', powerToughnessCard), [1, 20]);
      const invalidPtShift = helpers.resolveWriteTextPtShiftCode('ptshiftbad,0.2', powerToughnessCard);
      assert.equal(Number.isNaN(invalidPtShift[0]), true);
      assert.equal(invalidPtShift[1], 20);

      assert.equal(helpers.resolveWriteTextTransformCode('fontcolorred', transformState), null);
      assert.deepEqual(helpers.resolveWriteTextTransformCode('permashift0.2,-0.3', transformState), {
        permaShift: [0.2, -0.3],
        textArcRadius: 3,
        textArcStart: 4,
        textRotation: 5,
      });
      assert.deepEqual(helpers.resolveWriteTextTransformCode('arcradius7.5', transformState), {
        permaShift: [1, 2],
        textArcRadius: 7,
        textArcStart: 4,
        textRotation: 5,
      });
      assert.deepEqual(helpers.resolveWriteTextTransformCode('arcstart1.25', transformState), {
        permaShift: [1, 2],
        textArcRadius: 3,
        textArcStart: 1.25,
        textRotation: 5,
      });
      assert.deepEqual(helpers.resolveWriteTextTransformCode('rotate450', transformState), {
        permaShift: [1, 2],
        textArcRadius: 3,
        textArcStart: 4,
        textRotation: 90,
      });
      assert.equal(helpers.resolveWriteTextTransformCode('arcradiusbad', transformState).textArcRadius, 0);
      assert.equal(helpers.resolveWriteTextTransformCode('arcstartbad', transformState).textArcStart, 0);
      assert.equal(Number.isNaN(helpers.resolveWriteTextTransformCode('rotatebad', transformState).textRotation), true);
    }
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('write text roll helpers preserve d20 state parsing', async () => {
  const {
    resolveWriteTextRollColorCode,
    resolveWriteTextRollCode,
  } = await loadCreatorCompatFunctions([
    'resolveWriteTextRollColorCode',
    'resolveWriteTextRollCode',
  ], '{ resolveWriteTextRollColorCode, resolveWriteTextRollCode }');

  for (const helpers of [
    {
      resolveWriteTextRollColorCode,
      resolveWriteTextRollCode,
    },
    {
      resolveWriteTextRollColorCode: resolveWriteTextRollColorCodeFromModule,
      resolveWriteTextRollCode: resolveWriteTextRollCodeFromModule,
    },
  ]) {
    assert.equal(helpers.resolveWriteTextRollColorCode('fontcolorred'), null);
    assert.equal(helpers.resolveWriteTextRollColorCode('rollcolorred'), 'red');
    assert.equal(helpers.resolveWriteTextRollColorCode('rollcolor'), 'black');
    assert.equal(helpers.resolveWriteTextRollColorCode('prefixrollcolorblue'), 'prefixblue');

    assert.equal(helpers.resolveWriteTextRollCode('fontcolorred', 7, null, 'mplantin'), null);
    assert.equal(helpers.resolveWriteTextRollCode('rollcolorred', 7, null, 'mplantin'), null);
    assert.deepEqual(helpers.resolveWriteTextRollCode('roll20', 7, null, 'mplantin'), {
      drawTextBetweenFrames: true,
      redrawFrames: true,
      drawToPrePTCanvas: true,
      savedRollYPosition: 7,
      savedFont: 'mplantin',
      wordToWrite: '20',
    });
    assert.deepEqual(helpers.resolveWriteTextRollCode('roll', 7, 3, 'beleren'), {
      drawTextBetweenFrames: true,
      redrawFrames: true,
      drawToPrePTCanvas: true,
      savedRollYPosition: -1,
      savedFont: 'beleren',
      wordToWrite: '',
    });
    assert.equal(helpers.resolveWriteTextRollCode('rollable', 7, undefined, 'mplantin').savedRollYPosition, 7);
  }
});

test('write text controls helper preserves line spacing and bullet parsing', async () => {
  const { resolveWriteTextFlowCode } = await loadCreatorCompatFunctions(
    ['resolveWriteTextFlowCode'],
    '{ resolveWriteTextFlowCode }',
  );

  for (const helper of [
    resolveWriteTextFlowCode,
    resolveWriteTextFlowCodeFromModule,
  ]) {
    assert.equal(helper('fontcolorred', 20), null);
    assert.deepEqual(helper('line', 20), {
      newLine: true,
      startingCurrentX: 0,
      newLineSpacing: 7,
      linespacing: null,
      wordToWrite: null,
    });
    assert.deepEqual(helper('lns', 20), {
      newLine: true,
      startingCurrentX: null,
      newLineSpacing: null,
      linespacing: null,
      wordToWrite: null,
    });
    assert.deepEqual(helper('linenospace', 20), {
      newLine: true,
      startingCurrentX: null,
      newLineSpacing: null,
      linespacing: null,
      wordToWrite: null,
    });
    assert.deepEqual(helper('bullet', 20), {
      newLine: null,
      startingCurrentX: null,
      newLineSpacing: null,
      linespacing: null,
      wordToWrite: '•',
    });
    assert.deepEqual(helper('•', 20), {
      newLine: null,
      startingCurrentX: null,
      newLineSpacing: null,
      linespacing: null,
      wordToWrite: '•',
    });
    assert.deepEqual(helper('linespacing#0.5', 20), {
      newLine: null,
      startingCurrentX: null,
      newLineSpacing: 10,
      linespacing: 10,
      wordToWrite: null,
    });
    const invalidSpacing = helper('linespacing0.5', 20);
    assert.equal(Number.isNaN(invalidSpacing.newLineSpacing), true);
    assert.equal(Number.isNaN(invalidSpacing.linespacing), true);
  }
});

test('write text controls helper preserves normal and cartoony bar geometry', async () => {
  const originals = {
    scaleWidth: globalThis.scaleWidth,
    scaleHeight: globalThis.scaleHeight,
  };
  globalThis.scaleWidth = (value = 0) => Number(value) * 10;
  globalThis.scaleHeight = (value = 0) => Number(value) * 100;

  try {
    const { resolveWriteTextBarCode } = await loadCreatorCompatFunctions(
      ['resolveWriteTextBarCode'],
      '{ resolveWriteTextBarCode }',
    );
    const assertNearlyEqual = (actual, expected) => {
      assert.equal(Math.abs(actual - expected) < 0.0000001, true);
    };

    for (const helper of [
      resolveWriteTextBarCode,
      resolveWriteTextBarCodeFromModule,
    ]) {
      assert.equal(helper('fontcolorred', 80, 20, 'center', 'normal'), null);
      assert.deepEqual(helper('bar', 80, 20, 'center', 'normal'), {
        barWidth: 76.8,
        barHeight: 3,
        barImageName: 'bar',
        barDistance: 0,
        realTextAlign: 'center',
        textAlign: 'left',
        textSize: 20,
        newLineSpacing: null,
      });

      const cartoonyBar = helper('bar', 80, 20, 'right', 'cartoony');
      assertNearlyEqual(cartoonyBar.barWidth, 8.547);
      assertNearlyEqual(cartoonyBar.barHeight, 4.58);
      assert.equal(cartoonyBar.barImageName, 'cflavor');
      assert.equal(cartoonyBar.barDistance, -0.23);
      assert.equal(cartoonyBar.realTextAlign, 'right');
      assert.equal(cartoonyBar.textAlign, 'left');
      assertNearlyEqual(cartoonyBar.textSize, 19.14);
      assertNearlyEqual(cartoonyBar.newLineSpacing, -4.6);
    }
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('write text positioning helper preserves cursor cache parsing', async () => {
  const { resolveWriteTextSavedXCode } = await loadCreatorCompatFunctions(
    ['resolveWriteTextSavedXCode'],
    '{ resolveWriteTextSavedXCode }',
  );

  for (const helper of [
    resolveWriteTextSavedXCode,
    resolveWriteTextSavedXCodeFromModule,
  ]) {
    assert.equal(helper('fontcolorred', 10, 20, 30), null);
    assert.deepEqual(helper('savex', 10, 20, 30), {
      currentX: 10,
      savedTextXPosition: 10,
      savedTextXPosition2: 30,
    });
    assert.deepEqual(helper('loadx', 10, 20, 30), {
      currentX: 20,
      savedTextXPosition: 20,
      savedTextXPosition2: 30,
    });
    assert.deepEqual(helper('loadx', 25, 20, 30), {
      currentX: 25,
      savedTextXPosition: 20,
      savedTextXPosition2: 30,
    });
    assert.deepEqual(helper('savex2', 10, 20, 30), {
      currentX: 10,
      savedTextXPosition: 20,
      savedTextXPosition2: 10,
    });
    assert.deepEqual(helper('loadx2', 10, 20, 30), {
      currentX: 30,
      savedTextXPosition: 20,
      savedTextXPosition2: 30,
    });
    assert.deepEqual(helper('loadx2', 35, 20, 30), {
      currentX: 35,
      savedTextXPosition: 20,
      savedTextXPosition2: 30,
    });
  }
});

test('write text positioning helper preserves indent cursor state parsing', async () => {
  const { resolveWriteTextIndentCode } = await loadCreatorCompatFunctions(
    ['resolveWriteTextIndentCode'],
    '{ resolveWriteTextIndentCode }',
  );

  for (const helper of [
    resolveWriteTextIndentCode,
    resolveWriteTextIndentCodeFromModule,
  ]) {
    assert.equal(helper('fontcolorred', 4, 9, 30), null);
    assert.deepEqual(helper('indent', 4, 9, 30), {
      startingCurrentX: 13,
      currentY: 20,
    });
    assert.deepEqual(helper('/indent', 4, 9, 30), {
      startingCurrentX: 0,
      currentY: 30,
    });
  }
});

test('write text controls helper preserves planechase chaos symbol geometry', async () => {
  const { resolveWriteTextPlanechaseCode } = await loadCreatorCompatFunctions(
    ['resolveWriteTextPlanechaseCode'],
    '{ resolveWriteTextPlanechaseCode }',
  );

  for (const helper of [
    resolveWriteTextPlanechaseCode,
    resolveWriteTextPlanechaseCodeFromModule,
  ]) {
    assert.equal(helper('fontcolorred', 20, 5, 2), null);
    assert.deepEqual(helper('planechase', 20, 5, 2), {
      imageX: 5,
      imageWidth: 43.199999999999996,
      imageHeight: 36,
      currentX: 51.800000000000004,
      startingCurrentX: 48.800000000000004,
    });
  }
});

test('write text controls helper preserves elem-id selector and number parsing', async () => {
  const {
    getWriteTextElemIdSelector,
    getWriteTextElemIdSetSubstring,
    resolveWriteTextElemIdNumberCode,
  } = await loadCreatorCompatFunctions([
    'getWriteTextElemIdSelector',
    'getWriteTextElemIdSetSubstring',
    'resolveWriteTextElemIdNumberCode',
  ], '{ getWriteTextElemIdSelector, getWriteTextElemIdSetSubstring, resolveWriteTextElemIdNumberCode }');

  for (const helpers of [
    {
      getWriteTextElemIdSelector,
      getWriteTextElemIdSetSubstring,
      resolveWriteTextElemIdNumberCode,
    },
    {
      getWriteTextElemIdSelector: getWriteTextElemIdSelectorFromModule,
      getWriteTextElemIdSetSubstring: getWriteTextElemIdSetSubstringFromModule,
      resolveWriteTextElemIdNumberCode: resolveWriteTextElemIdNumberCodeFromModule,
    },
  ]) {
    assert.equal(helpers.getWriteTextElemIdSelector('{elemidinfo-set}'), '#info-set');
    assert.equal(helpers.getWriteTextElemIdSelector('{elemidinfo-number}'), '#info-number');
    assert.equal(helpers.getWriteTextElemIdSelector('{Elemidinfo-set}'), '#{Elemidinfo-set');
    assert.equal(
      helpers.getWriteTextElemIdSetSubstring('{elemidinfo-set} - {elemidinfo-language}  {savex}{fontnamebeleren}',
        'MOM',
        'EN',
      ),
      'MOM - EN',
    );
    assert.equal(helpers.getWriteTextElemIdSetSubstring('{elemidinfo-set} {elemidinfo-language}', 'MOM', 'EN'), '');
    assert.equal(
      helpers.getWriteTextElemIdSetSubstring('{elemidinfo-set}-{elemidinfo-language}  {savex}', 0, null),
      '-',
    );
    assert.equal(helpers.resolveWriteTextElemIdNumberCode('{elemidinfo-set}', '12/34', 'normal'), null);
    assert.equal(helpers.resolveWriteTextElemIdNumberCode('{elemidinfo-number}', '1234', 'normal'), null);
    assert.deepEqual(helpers.resolveWriteTextElemIdNumberCode('{elemidinfo-number}', '12/34', 'normal'), {
      fillJustify: true,
      wordToWrite: '1 2 / 3 4',
    });
    assert.equal(helpers.resolveWriteTextElemIdNumberCode('{elemidinfo-number}', '12/34', 'pokemon'), null);
    assert.equal(helpers.resolveWriteTextElemIdNumberCode('{elemidinfo-number}', '12/34', '8thPlaytest'), null);
    assert.throws(() => helpers.resolveWriteTextElemIdNumberCode('{elemidinfo-number}', null, 'normal'), TypeError);
  }
});

test('import display name preserves printed names and alchemy prefixes', async () => {
  const compatGetImportedDisplayName = await loadCreatorCompatFunctions(
    ['getImportedDisplayName'],
    'getImportedDisplayName',
  );

  for (const getImportedDisplayName of [
    compatGetImportedDisplayName,
    getImportedDisplayNameFromModule,
  ]) {
    assert.equal(getImportedDisplayName({}), '');
    assert.equal(getImportedDisplayName({ name: 'A-Goldspan Dragon' }), '{alchemy}Goldspan Dragon');
    assert.equal(getImportedDisplayName({
      name: 'Lightning Bolt',
      printed_name: 'Relámpago',
    }), 'Relámpago');
  }
});

test('import option helpers render eligible cards with source indexes', async () => {
  const originalDocument = globalThis.document;
  const importAllPrintsControl = { checked: false };
  globalThis.document = {
    querySelector(selector) {
      assert.equal(selector, '#importAllPrints');
      return importAllPrintsControl;
    },
    createElement(tagName) {
      assert.equal(tagName, 'option');
      return {
        innerHTML: '',
        value: '',
      };
    },
  };

  try {
    const compatOptionHelpers = await loadCreatorCompatFunctions([
      'getImportedCardOptionName',
      'shouldRenderImportedCardOption',
    ], '{ getImportedCardOptionName, shouldRenderImportedCardOption }');
    const {
      getImportedCardOptionName,
      buildImportedCardOptionTitle,
      shouldRenderImportedCardOption,
      renderImportedCardOptions,
    } = await loadCreatorFunctionsWithCompat([
      'buildImportedCardOptionTitle',
      'createImportedCardOption',
      'populateImportedCardOptions',
      'ensureImportedCardOptionSelected',
      'renderImportedCardOptions',
    ], '{ getImportedCardOptionName, buildImportedCardOptionTitle, shouldRenderImportedCardOption, renderImportedCardOptions }');
    const importedCards = [
      { name: 'Rules Card', type_line: 'Card' },
      { name: 'Lightning Bolt', type_line: 'Instant', set: 'clu', collector_number: '141' },
      { name: 'Missing Type' },
      { name: 'Printed Name', printed_name: 'Nombre Impreso', type_line: 'Creature — Wizard', set: 'abc', collector_number: '7' },
      { name: 'Flavor Source', flavor_name: 'Secret Identity', type_line: 'Planeswalker', set: 'xyz', collector_number: '9' },
    ];
    const importIndex = {
      value: '',
      selectedIndex: -1,
      options: [{ innerHTML: 'old' }],
      appendChild(option) {
        this.options.push(option);
      },
    };
    let innerHTMLValue = 'old';
    Object.defineProperty(importIndex, 'innerHTML', {
      get() {
        return innerHTMLValue;
      },
      set(value) {
        innerHTMLValue = value;
        importIndex.options.length = 0;
      },
    });

    for (const helpers of [
      compatOptionHelpers,
      {
        getImportedCardOptionName: getImportedCardOptionNameFromModule,
        shouldRenderImportedCardOption: shouldRenderImportedCardOptionFromModule,
      },
    ]) {
      assert.equal(helpers.getImportedCardOptionName(importedCards[3]), 'Nombre Impreso (Printed Name)');
      assert.equal(helpers.getImportedCardOptionName(importedCards[4]), 'Flavor Source (Secret Identity)');
      assert.equal(helpers.shouldRenderImportedCardOption(importedCards[0]), false);
      assert.equal(helpers.shouldRenderImportedCardOption(importedCards[1]), true);
      assert.equal(helpers.shouldRenderImportedCardOption(importedCards[2]), undefined);
    }
    assert.equal(getImportedCardOptionName(importedCards[3]), 'Nombre Impreso (Printed Name)');
    assert.equal(shouldRenderImportedCardOption(importedCards[1]), true);
    assert.equal(buildImportedCardOptionTitle(importedCards[1]), 'Lightning Bolt (Instant)');
    importAllPrintsControl.checked = true;
    assert.equal(buildImportedCardOptionTitle(importedCards[1]), 'Lightning Bolt (CLU #141)');
    importAllPrintsControl.checked = false;

    renderImportedCardOptions(importIndex, importedCards);

    assert.equal(importIndex.innerHTML, null);
    assert.equal(importIndex.selectedIndex, 0);
    assert.deepEqual(importIndex.options, [
      { innerHTML: 'Lightning Bolt (Instant)', value: 1 },
      { innerHTML: 'Nombre Impreso (Printed Name) (Creature — Wizard)', value: 3 },
      { innerHTML: 'Flavor Source (Secret Identity) (Planeswalker)', value: 4 },
    ]);
  } finally {
    if (originalDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = originalDocument;
    }
  }
});

test('import card entrypoint preserves imported list setup and option rendering order', async () => {
  const originals = {
    document: globalThis.document,
    scryfallCard: globalThis.scryfallCard,
    renderImportedCardOptions: globalThis.renderImportedCardOptions,
    changeCardIndex: globalThis.changeCardIndex,
    log: console.log,
  };
  const importedCards = [
    { name: 'Lightning Bolt', type_line: 'Instant' },
  ];
  const importIndex = { id: 'import-index' };
  const calls = [];
  globalThis.document = {
    querySelector(selector) {
      calls.push(['query', selector]);
      assert.equal(selector, '#import-index');
      return importIndex;
    },
  };
  globalThis.renderImportedCardOptions = (targetIndex, cardObjects) => {
    calls.push(['render', targetIndex, cardObjects]);
  };
  globalThis.changeCardIndex = () => calls.push(['change']);
  console.log = (...args) => calls.push(['log', ...args]);

  try {
    const {
      setImportedCards,
      getImportIndexControl,
      loadImportedCardOptions,
      importCard,
    } = await loadCreatorFunctions([
      'setImportedCards',
      'getImportIndexControl',
      'loadImportedCardOptions',
      'importCard',
    ], '{ setImportedCards, getImportIndexControl, loadImportedCardOptions, importCard }');

    assert.equal(setImportedCards(importedCards), importedCards);
    assert.equal(globalThis.scryfallCard, importedCards);
    assert.equal(getImportIndexControl(), importIndex);
    assert.deepEqual(calls, [
      ['query', '#import-index'],
    ]);

    calls.length = 0;
    assert.equal(loadImportedCardOptions(importedCards), importIndex);
    assert.deepEqual(calls, [
      ['query', '#import-index'],
      ['render', importIndex, importedCards],
    ]);

    calls.length = 0;
    importCard(importedCards);
    assert.equal(globalThis.scryfallCard, importedCards);
    assert.deepEqual(calls, [
      ['log', 'Import card called with:', importedCards],
      ['query', '#import-index'],
      ['render', importIndex, importedCards],
      ['change'],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (name === 'log') {
        console.log = value;
      } else if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('import search options and datasource fetch dispatch preserve request shape', async () => {
  const originals = {
    document: globalThis.document,
    fetchLocalData: globalThis.fetchLocalData,
    fetchMtgchData: globalThis.fetchMtgchData,
    fetchScryfallData: globalThis.fetchScryfallData,
    importCard: globalThis.importCard,
  };
  const controls = new Map([
    ['#importAllPrints', { checked: true }],
    ['#datasource', { value: 'mtgch' }],
    ['#import-name', { value: 'Lightning Bolt' }],
  ]);
  const calls = [];
  function localFetcher(...args) {
    calls.push(['local', ...args]);
  }
  function mtgchFetcher(...args) {
    calls.push(['mtgch', ...args]);
  }
  function scryfallFetcher(...args) {
    calls.push(['scryfall', ...args]);
  }
  function importCardCallback() {}

  globalThis.document = {
    querySelector(selector) {
      const control = controls.get(selector);
      assert.ok(control, `unexpected selector ${selector}`);
      return control;
    },
  };
  globalThis.fetchLocalData = localFetcher;
  globalThis.fetchMtgchData = mtgchFetcher;
  globalThis.fetchScryfallData = scryfallFetcher;
  globalThis.importCard = importCardCallback;

  try {
    const compatSearchHelpers = await loadCreatorCompatFunctions([
      'buildImportSearchOptions',
      'getImportedCardFetchUnique',
    ], '{ buildImportSearchOptions, getImportedCardFetchUnique }');
    const {
      buildImportSearchOptions,
      getImportSearchOptions,
      getImportedCardDataFetcher,
      getImportedCardFetchUnique,
      fetchImportedCardData,
    } = await loadCreatorFunctionsWithCompat([
      'getImportSearchOptions',
      'getImportedCardDataFetcher',
      'fetchImportedCardData',
    ], '{ buildImportSearchOptions, getImportSearchOptions, getImportedCardDataFetcher, getImportedCardFetchUnique, fetchImportedCardData }');

    for (const helpers of [
      compatSearchHelpers,
      {
        buildImportSearchOptions: buildImportSearchOptionsFromModule,
        getImportedCardFetchUnique: getImportedCardFetchUniqueFromModule,
      },
    ]) {
      assert.deepEqual(helpers.buildImportSearchOptions(false, 'scryfall', 'Counterspell'), {
        cardName: 'Counterspell',
        datasource: 'scryfall',
        unique: '',
      });
      assert.equal(helpers.getImportedCardFetchUnique({ datasource: 'local', unique: '' }), true);
      assert.equal(helpers.getImportedCardFetchUnique({ datasource: 'mtgch', unique: 'prints' }), 'prints');
    }
    assert.deepEqual(buildImportSearchOptions(false, 'scryfall', 'Counterspell'), {
      cardName: 'Counterspell',
      datasource: 'scryfall',
      unique: '',
    });
    assert.deepEqual(getImportSearchOptions(), {
      cardName: 'Lightning Bolt',
      datasource: 'mtgch',
      unique: 'prints',
    });
    assert.equal(getImportedCardDataFetcher('local'), localFetcher);
    assert.equal(getImportedCardDataFetcher('mtgch'), mtgchFetcher);
    assert.equal(getImportedCardDataFetcher('scryfall'), scryfallFetcher);
    assert.equal(getImportedCardDataFetcher('unknown'), scryfallFetcher);
    assert.equal(getImportedCardFetchUnique({ datasource: 'local', unique: '' }), true);
    assert.equal(getImportedCardFetchUnique({ datasource: 'mtgch', unique: 'prints' }), 'prints');

    fetchImportedCardData({ datasource: 'local', cardName: 'Island', unique: '' });
    fetchImportedCardData({ datasource: 'mtgch', cardName: 'Mountain', unique: 'prints' });
    fetchImportedCardData({ datasource: 'scryfall', cardName: 'Forest', unique: '' });

    assert.deepEqual(calls, [
      ['local', 'Island', importCardCallback, true],
      ['mtgch', 'Mountain', importCardCallback, 'prints'],
      ['scryfall', 'Forest', importCardCallback, ''],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('saved card request helpers preserve prompt conflict and storage data behavior', async () => {
  const originals = {
    getCardName: globalThis.getCardName,
    prompt: globalThis.prompt,
    confirm: globalThis.confirm,
    card: globalThis.card,
  };
  let promptReturn = 'Manual Key';
  let confirmReturn = true;
  const clonedCard = { cloned: true, frames: [] };
  const fileCard = { fromFile: true };

  globalThis.getCardName = () => 'Default Card';
  globalThis.prompt = (message, defaultValue) => {
    assert.equal(message, 'Enter the name you would like to save your card under:');
    assert.equal(defaultValue, 'Default Card');
    return promptReturn;
  };
  globalThis.confirm = (message) => {
    assert.match(message, /Would you like to overwrite/);
    return confirmReturn;
  };
  globalThis.card = clonedCard;

  try {
    const compatKeyHelpers = await loadCreatorCompatFunctions([
      'getVersionedSavedCardKey',
    ], '{ getVersionedSavedCardKey }');
    const {
      getRequestedSavedCardKey,
      getVersionedSavedCardKey,
      resolveSavedCardKey,
      getSavedCardData,
      resolveSavedCardRequest,
    } = await loadCreatorFunctionsWithCompat([
      'getRequestedSavedCardKey',
      'resolveSavedCardKey',
      'getSavedCardData',
      'resolveSavedCardRequest',
    ], '{ getRequestedSavedCardKey, getVersionedSavedCardKey, resolveSavedCardKey, getSavedCardData, resolveSavedCardRequest }');

    assert.equal(getRequestedSavedCardKey({ key: 'Imported Key' }), 'Imported Key');
    assert.equal(getRequestedSavedCardKey(), 'Manual Key');
    promptReturn = '';
    assert.equal(getRequestedSavedCardKey(), null);
    promptReturn = 'Manual Key';

    for (const helper of [
      getVersionedSavedCardKey,
      compatKeyHelpers.getVersionedSavedCardKey,
      getVersionedSavedCardKeyFromModule,
    ]) {
      assert.equal(helper('Saved', ['Saved', 'Saved (1)']), 'Saved (2)');
    }
    assert.equal(resolveSavedCardKey(' Saved ', ['Saved']), 'Saved');
    confirmReturn = false;
    assert.equal(resolveSavedCardKey(' Saved ', ['Saved', 'Saved (1)']), 'Saved (2)');

    assert.equal(getSavedCardData({ data: fileCard }), fileCard);
    assert.deepEqual(getSavedCardData(), clonedCard);

    promptReturn = null;
    assert.equal(resolveSavedCardRequest(undefined, []), null);
    promptReturn = 'Saved';
    assert.deepEqual(resolveSavedCardRequest(undefined, ['Saved']), {
      cardKey: 'Saved (1)',
      cardData: clonedCard,
    });
    assert.deepEqual(resolveSavedCardRequest({ key: 'Imported Key', data: fileCard }, ['Imported Key']), {
      cardKey: 'Imported Key (1)',
      cardData: fileCard,
    });
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('saved card key refresh only stores newly added sorted keys', async () => {
  const originals = {
    storeSavedCardKeys: globalThis.storeSavedCardKeys,
    loadAvailableCards: globalThis.loadAvailableCards,
  };
  const calls = [];
  globalThis.storeSavedCardKeys = (cardKeys) => calls.push(['store', [...cardKeys]]);
  globalThis.loadAvailableCards = (cardKeys) => calls.push(['load', [...cardKeys]]);

  try {
    const compatKeyHelpers = await loadCreatorCompatFunctions([
      'addSavedCardKey',
    ], '{ addSavedCardKey }');
    const { addSavedCardKey, refreshSavedCardKeys } = await loadCreatorFunctionsWithCompat([
      'refreshSavedCardKeys',
    ], '{ addSavedCardKey, refreshSavedCardKeys }');

    for (const helper of [
      addSavedCardKey,
      compatKeyHelpers.addSavedCardKey,
      addSavedCardKeyFromModule,
    ]) {
      const cardKeys = ['Gamma', 'Omega'];
      assert.equal(helper('Alpha', cardKeys), true);
      assert.deepEqual(cardKeys, ['Alpha', 'Gamma', 'Omega']);
      assert.equal(helper('Gamma', cardKeys), false);
      assert.deepEqual(cardKeys, ['Alpha', 'Gamma', 'Omega']);
    }

    const cardKeys = ['Alpha', 'Gamma', 'Omega'];
    refreshSavedCardKeys('Beta', cardKeys);
    refreshSavedCardKeys('Beta', cardKeys);

    assert.deepEqual(cardKeys, ['Alpha', 'Beta', 'Gamma', 'Omega']);
    assert.deepEqual(calls, [
      ['store', ['Alpha', 'Beta', 'Gamma', 'Omega']],
      ['load', ['Alpha', 'Beta', 'Gamma', 'Omega']],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('saved card removal updates keys and storage refresh order', async () => {
  const originals = {
    storeSavedCardKeys: globalThis.storeSavedCardKeys,
    localStorage: globalThis.localStorage,
    loadAvailableCards: globalThis.loadAvailableCards,
  };
  const calls = [];
  globalThis.storeSavedCardKeys = (cardKeys) => calls.push(['store', [...cardKeys]]);
  globalThis.localStorage = {
    removeItem: (cardKey) => calls.push(['remove', cardKey]),
  };
  globalThis.loadAvailableCards = (cardKeys) => calls.push(['load', [...cardKeys]]);

  try {
    const { removeCardKeyFromSavedList, removeSavedCard } = await loadCreatorFunctions([
      'removeCardKeyFromSavedList',
      'removeSavedCard',
    ], '{ removeCardKeyFromSavedList, removeSavedCard }');
    const cardKeys = ['Gamma', 'Alpha', 'Beta'];

    assert.equal(removeCardKeyFromSavedList('Gamma', cardKeys), cardKeys);
    assert.deepEqual(cardKeys, ['Alpha', 'Beta']);

    removeSavedCard('Alpha', cardKeys);

    assert.deepEqual(cardKeys, ['Beta']);
    assert.deepEqual(calls, [
      ['store', ['Beta']],
      ['remove', 'Alpha'],
      ['load', ['Beta']],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('saved card clearing removes storage before resetting available keys', async () => {
  const originals = {
    storeSavedCardKeys: globalThis.storeSavedCardKeys,
    localStorage: globalThis.localStorage,
    loadAvailableCards: globalThis.loadAvailableCards,
  };
  const calls = [];
  globalThis.storeSavedCardKeys = (cardKeys) => calls.push(['store', [...cardKeys]]);
  globalThis.localStorage = {
    removeItem: (cardKey) => calls.push(['remove', cardKey]),
  };
  globalThis.loadAvailableCards = (cardKeys) => calls.push(['load', [...cardKeys]]);

  try {
    const { removeAllSavedCardStorageEntries, clearSavedCards } = await loadCreatorFunctions([
      'removeAllSavedCardStorageEntries',
      'clearSavedCards',
    ], '{ removeAllSavedCardStorageEntries, clearSavedCards }');
    const cardKeys = ['Beta', 'Alpha'];

    removeAllSavedCardStorageEntries(cardKeys);
    assert.deepEqual(calls, [
      ['remove', 'Beta'],
      ['remove', 'Alpha'],
    ]);

    calls.length = 0;
    clearSavedCards(cardKeys);

    assert.deepEqual(calls, [
      ['remove', 'Beta'],
      ['remove', 'Alpha'],
      ['store', []],
      ['load', []],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('saved card JSON helpers preserve storage clone and import text parsing', async () => {
  const {
    cloneCardForStorage,
    createSavedCardsExportText,
    parseSavedCardsImport,
  } = await loadCreatorCompatFunctions([
    'getCreatorStorageCard',
    'cloneCardForStorage',
    'createSavedCardsExportText',
    'parseSavedCardsImport',
  ], '{ cloneCardForStorage, createSavedCardsExportText, parseSavedCardsImport }');
  const previousCard = globalThis.card;
  const cardToClone = {
    frames: [
      {
        id: 'frame-a',
        image: { runtime: true },
        masks: [
          { id: 'mask-a', image: { runtime: true } },
          { id: 'mask-b', image: { runtime: true } },
        ],
      },
    ],
    text: {
      title: { text: 'Alpha' },
    },
  };
  const savedCards = [
    { key: 'Alpha', data: { name: 'Alpha Card' } },
    { key: 'Beta', data: { name: 'Beta Card' } },
  ];
  const expectedClone = {
    frames: [
      {
        id: 'frame-a',
        masks: [
          { id: 'mask-a' },
          { id: 'mask-b' },
        ],
      },
    ],
    text: {
      title: { text: 'Alpha' },
    },
  };

  try {
    globalThis.card = cardToClone;

    assert.deepEqual(cloneCardForStorage(cardToClone), expectedClone);
    assert.deepEqual(cloneCardForStorage(), expectedClone);
    assert.deepEqual(cloneCardForStorageFromModule(cardToClone), expectedClone);

    assert.equal(createSavedCardsExportText(savedCards), JSON.stringify(savedCards));
    assert.equal(createSavedCardsExportTextFromModule(savedCards), createSavedCardsExportText(savedCards));
    assert.deepEqual(parseSavedCardsImport(JSON.stringify(savedCards)), savedCards);
    assert.deepEqual(parseSavedCardsImportFromModule(JSON.stringify(savedCards)), savedCards);
  } finally {
    if (previousCard === undefined) {
      delete globalThis.card;
    } else {
      globalThis.card = previousCard;
    }
  }
});

test('saved card export helpers preserve storage payload and download dispatch', async () => {
  const originals = {
    localStorage: globalThis.localStorage,
    getSavedCardsExportData: globalThis.getSavedCardsExportData,
    createSavedCardsDownloadUrl: globalThis.createSavedCardsDownloadUrl,
    triggerDownloadLink: globalThis.triggerDownloadLink,
  };
  const storedCards = {
    Alpha: { name: 'Alpha Card' },
    Beta: { name: 'Beta Card' },
  };
  const calls = [];
  globalThis.localStorage = {
    getItem: (cardKey) => {
      calls.push(['get', cardKey]);
      return JSON.stringify(storedCards[cardKey]);
    },
  };

  try {
    const getSavedCardsExportData = await loadCreatorFunctions([
      'getSavedCardsExportData',
    ], 'getSavedCardsExportData');

    assert.deepEqual(getSavedCardsExportData(['Beta', 'Alpha']), [
      { key: 'Beta', data: storedCards.Beta },
      { key: 'Alpha', data: storedCards.Alpha },
    ]);
    assert.deepEqual(calls, [
      ['get', 'Beta'],
      ['get', 'Alpha'],
    ]);

    calls.length = 0;
    globalThis.getSavedCardsExportData = (cardKeys) => {
      calls.push(['export', [...cardKeys]]);
      return [{ key: 'Alpha', data: storedCards.Alpha }];
    };
    globalThis.createSavedCardsDownloadUrl = (savedCards) => {
      calls.push(['url', savedCards]);
      return 'blob:saved-cards';
    };
    globalThis.triggerDownloadLink = (href, downloadName) => {
      calls.push(['download', href, downloadName]);
      return Promise.resolve('downloaded');
    };

    const downloadSavedCardsExport = await loadCreatorFunctions([
      'downloadSavedCardsExport',
    ], 'downloadSavedCardsExport');

    assert.equal(await downloadSavedCardsExport(['Alpha']), 'downloaded');
    assert.deepEqual(calls, [
      ['export', ['Alpha']],
      ['url', [{ key: 'Alpha', data: storedCards.Alpha }]],
      ['download', 'blob:saved-cards', 'saved-cards.cardconjurer'],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('saved card import helpers parse exported cards and save in order', async () => {
  const originals = {
    saveCard: globalThis.saveCard,
  };
  const savedCards = [
    { key: 'Alpha', data: { name: 'Alpha Card' } },
    { key: 'Beta', data: { name: 'Beta Card' } },
  ];
  const calls = [];
  globalThis.saveCard = (savedCard) => calls.push(savedCard);

  try {
    const {
      parseSavedCardsImport,
      importSavedCardItems,
      importSavedCardsFromText,
    } = await loadCreatorFunctionsWithCompat([
      'importSavedCardItems',
      'importSavedCardsFromText',
    ], '{ parseSavedCardsImport, importSavedCardItems, importSavedCardsFromText }');

    assert.deepEqual(parseSavedCardsImport(JSON.stringify(savedCards)), savedCards);

    importSavedCardItems(savedCards);
    assert.deepEqual(calls, savedCards);

    calls.length = 0;
    importSavedCardsFromText(JSON.stringify(savedCards));
    assert.deepEqual(calls, savedCards);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('loaded card info restoration still applies selected text controls', async () => {
  const originals = {
    document: globalThis.document,
    card: globalThis.card,
    date: globalThis.date,
    selectedTextIndex: globalThis.selectedTextIndex,
    artistEdited: globalThis.artistEdited,
    getSelectedTextField: globalThis.getSelectedTextField,
    loadTextOptions: globalThis.loadTextOptions,
  };
  const controls = Object.fromEntries([
    '#info-number',
    '#info-rarity',
    '#info-set',
    '#info-language',
    '#info-note',
    '#info-year',
    '#text-editor',
    '#text-editor-font-size',
  ].map((selector) => [selector, { value: null }]));
  const calls = [];
  let selectedTextField = { text: 'Rules text' };

  globalThis.document = {
    querySelector: (selector) => {
      assert.ok(controls[selector], `unexpected selector ${selector}`);
      return controls[selector];
    },
  };
  globalThis.card = {
    infoNumber: '007',
    infoRarity: 'rare',
    infoSet: 'tst',
    infoLanguage: 'zhs',
    infoNote: 'note',
    infoYear: '',
    infoArtist: 'Artist Name',
    text: { rules: { text: 'stored' } },
  };
  globalThis.date = { getFullYear: () => 2042 };
  globalThis.selectedTextIndex = 'rules';
  globalThis.artistEdited = (artist) => calls.push(['artist', artist]);
  globalThis.getSelectedTextField = (text, selectedIndex) => {
    calls.push(['selectedText', text, selectedIndex]);
    return selectedTextField;
  };
  globalThis.loadTextOptions = (text) => calls.push(['loadTextOptions', text]);

  try {
    const { restoreLoadedCardTextControls, restoreLoadedCardInfoFields } = await loadCreatorFunctions([
      'restoreLoadedCardTextControls',
      'restoreLoadedCardInfoFields',
    ], '{ restoreLoadedCardTextControls, restoreLoadedCardInfoFields }');

    restoreLoadedCardTextControls();
    assert.equal(controls['#text-editor'].value, 'Rules text');
    assert.equal(controls['#text-editor-font-size'].value, 0);
    assert.deepEqual(calls, [
      ['selectedText', globalThis.card.text, 'rules'],
      ['loadTextOptions', globalThis.card.text],
    ]);

    calls.length = 0;
    selectedTextField = { text: 'Sized text', fontSize: 9 };
    restoreLoadedCardInfoFields();

    assert.equal(controls['#info-number'].value, '007');
    assert.equal(controls['#info-rarity'].value, 'rare');
    assert.equal(controls['#info-set'].value, 'tst');
    assert.equal(controls['#info-language'].value, 'zhs');
    assert.equal(controls['#info-note'].value, 'note');
    assert.equal(controls['#info-year'].value, 2042);
    assert.equal(controls['#text-editor'].value, 'Sized text');
    assert.equal(controls['#text-editor-font-size'].value, 9);
    assert.deepEqual(calls, [
      ['artist', 'Artist Name'],
      ['selectedText', globalThis.card.text, 'rules'],
      ['loadTextOptions', globalThis.card.text],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('loaded card media control restoration shares offset position math', async () => {
  const originals = {
    document: globalThis.document,
    card: globalThis.card,
    scaleX: globalThis.scaleX,
    scaleY: globalThis.scaleY,
    scaleWidth: globalThis.scaleWidth,
    scaleHeight: globalThis.scaleHeight,
    uploadArt: globalThis.uploadArt,
    uploadSetSymbol: globalThis.uploadSetSymbol,
    uploadWatermark: globalThis.uploadWatermark,
  };
  const controls = Object.fromEntries([
    '#art-x',
    '#art-y',
    '#art-zoom',
    '#art-rotate',
    '#setSymbol-x',
    '#setSymbol-y',
    '#setSymbol-zoom',
    '#watermark-x',
    '#watermark-y',
    '#watermark-zoom',
    '#watermark-opacity',
  ].map((selector) => [selector, { value: null }]));
  const roundedCorners = { checked: null };
  const calls = [];

  globalThis.document = {
    querySelector: (selector) => {
      assert.ok(controls[selector], `unexpected selector ${selector}`);
      return controls[selector];
    },
    getElementById: (id) => {
      assert.equal(id, 'rounded-corners');
      return roundedCorners;
    },
  };
  globalThis.card = {
    marginX: 2,
    marginY: 3,
    artX: 5,
    artY: 7,
    artZoom: 1.5,
    artSource: 'art.png',
    setSymbolX: 8,
    setSymbolY: 9,
    setSymbolZoom: 0.2,
    setSymbolSource: 'set.svg',
    watermarkX: 4,
    watermarkY: 6,
    watermarkZoom: 0.75,
    watermarkOpacity: 0.4,
    watermarkSource: 'watermark.png',
    noCorners: false,
  };
  globalThis.scaleX = (value) => value * 10;
  globalThis.scaleY = (value) => value * 20;
  globalThis.scaleWidth = (value) => value * 2;
  globalThis.scaleHeight = (value) => value * 3;
  globalThis.uploadArt = (source) => calls.push(['art', source]);
  globalThis.uploadSetSymbol = (source) => calls.push(['setSymbol', source]);
  globalThis.uploadWatermark = (source) => calls.push(['watermark', source]);

  try {
    const {
      getLoadedCardOffsetPosition,
      restoreLoadedCardArtControls,
      restoreLoadedCardSetSymbolControls,
      restoreLoadedCardWatermarkControls,
    } = await loadCreatorFunctions([
      'getLoadedCardOffsetPosition',
      'restoreLoadedCardArtControls',
      'restoreLoadedCardSetSymbolControls',
      'restoreLoadedCardWatermarkControls',
    ], '{ getLoadedCardOffsetPosition, restoreLoadedCardArtControls, restoreLoadedCardSetSymbolControls, restoreLoadedCardWatermarkControls }');

    assert.deepEqual(getLoadedCardOffsetPosition(5, 7), { x: 46, y: 131 });

    restoreLoadedCardArtControls();
    assert.equal(controls['#art-x'].value, 46);
    assert.equal(controls['#art-y'].value, 131);
    assert.equal(controls['#art-zoom'].value, 150);
    assert.equal(controls['#art-rotate'].value, 0);

    restoreLoadedCardSetSymbolControls();
    assert.equal(controls['#setSymbol-x'].value, 76);
    assert.equal(controls['#setSymbol-y'].value, 171);
    assert.equal(controls['#setSymbol-zoom'].value, 20);

    restoreLoadedCardWatermarkControls();
    assert.equal(controls['#watermark-x'].value, 36);
    assert.equal(controls['#watermark-y'].value, 111);
    assert.equal(controls['#watermark-zoom'].value, 75);
    assert.equal(controls['#watermark-opacity'].value, 40);
    assert.equal(roundedCorners.checked, true);
    assert.deepEqual(calls, [
      ['art', 'art.png'],
      ['setSymbol', 'set.svg'],
      ['watermark', 'watermark.png'],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('loaded card canvas resize helpers preserve target size checks', async () => {
  const originals = {
    card: globalThis.card,
    window: globalThis.window,
    canvasList: globalThis.canvasList,
    sizeCanvas: globalThis.sizeCanvas,
  };
  const resized = [];

  globalThis.card = {
    width: 100,
    height: 200,
    marginX: 0.25,
    marginY: 0.5,
  };
  globalThis.window = {
    previewCanvas: { width: 125, height: 300 },
    printCanvas: { width: 100, height: 300 },
    artCanvas: { width: 125, height: 200 },
  };
  globalThis.canvasList = ['preview', 'print', 'art'];
  globalThis.sizeCanvas = (name) => resized.push(name);

  try {
    const {
      getLoadedCardCanvasSize,
      shouldResizeLoadedCanvas,
      resizeLoadedCardCanvases,
    } = await loadCreatorFunctions([
      'getLoadedCardCanvasSize',
      'shouldResizeLoadedCanvas',
      'resizeLoadedCardCanvases',
    ], '{ getLoadedCardCanvasSize, shouldResizeLoadedCanvas, resizeLoadedCardCanvases }');

    assert.deepEqual(getLoadedCardCanvasSize(), { width: 125, height: 300 });
    assert.equal(shouldResizeLoadedCanvas('preview'), false);
    assert.equal(shouldResizeLoadedCanvas('print'), true);
    assert.equal(shouldResizeLoadedCanvas('art'), true);
    assert.equal(resizeLoadedCardCanvases(), true);
    assert.deepEqual(resized, ['print', 'art']);

    resized.length = 0;
    globalThis.window.printCanvas.width = 125;
    globalThis.window.artCanvas.height = 300;
    assert.equal(resizeLoadedCardCanvases(), false);
    assert.deepEqual(resized, []);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('loaded card script loading preserves onload wait before mana symbols', async () => {
  const originals = {
    card: globalThis.card,
    loadScript: globalThis.loadScript,
  };
  const calls = [];
  let resolveOnload;
  const neverResolve = new Promise(() => {});

  globalThis.card = {
    onload: 'onload.js',
    manaSymbols: ['w.js', 'u.js'],
  };
  globalThis.loadScript = (source) => {
    calls.push(source);
    if (source === 'onload.js') {
      return new Promise((resolve) => {
        resolveOnload = resolve;
      });
    }
    return neverResolve;
  };

  try {
    const {
      loadSavedCardOnloadScript,
      loadSavedCardManaSymbolScripts,
      loadSavedCardScripts,
    } = await loadCreatorFunctions([
      'loadSavedCardOnloadScript',
      'loadSavedCardManaSymbolScripts',
      'loadSavedCardScripts',
    ], '{ loadSavedCardOnloadScript, loadSavedCardManaSymbolScripts, loadSavedCardScripts }');

    const scriptPromise = loadSavedCardScripts();
    assert.deepEqual(calls, ['onload.js']);
    resolveOnload();
    await scriptPromise;
    assert.deepEqual(calls, ['onload.js', 'w.js', 'u.js']);

    calls.length = 0;
    globalThis.card.onload = '';
    await loadSavedCardOnloadScript();
    assert.deepEqual(calls, []);

    loadSavedCardManaSymbolScripts();
    assert.deepEqual(calls, ['w.js', 'u.js']);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('loaded card resize redraw helpers preserve redraw order and condition', async () => {
  const originals = {
    drawTextBuffer: globalThis.drawTextBuffer,
    drawFrames: globalThis.drawFrames,
    bottomInfoEdited: globalThis.bottomInfoEdited,
    watermarkEdited: globalThis.watermarkEdited,
    resizeLoadedCardCanvases: globalThis.resizeLoadedCardCanvases,
    redrawLoadedCardAfterResize: globalThis.redrawLoadedCardAfterResize,
  };
  const calls = [];
  let resized = true;

  globalThis.drawTextBuffer = () => calls.push('text');
  globalThis.drawFrames = () => calls.push('frames');
  globalThis.bottomInfoEdited = () => calls.push('bottom');
  globalThis.watermarkEdited = () => calls.push('watermark');
  globalThis.resizeLoadedCardCanvases = () => resized;

  try {
    const { redrawLoadedCardAfterResize } = await loadCreatorFunctions([
      'redrawLoadedCardAfterResize',
    ], '{ redrawLoadedCardAfterResize }');
    globalThis.redrawLoadedCardAfterResize = redrawLoadedCardAfterResize;
    const { redrawLoadedCardIfCanvasResized } = await loadCreatorFunctions([
      'redrawLoadedCardIfCanvasResized',
    ], '{ redrawLoadedCardIfCanvasResized }');

    redrawLoadedCardAfterResize();
    assert.deepEqual(calls, ['text', 'frames', 'bottom', 'watermark']);

    calls.length = 0;
    assert.equal(redrawLoadedCardIfCanvasResized(), true);
    assert.deepEqual(calls, ['text', 'frames', 'bottom', 'watermark']);

    calls.length = 0;
    resized = false;
    assert.equal(redrawLoadedCardIfCanvasResized(), false);
    assert.deepEqual(calls, []);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('loaded card frame restoration preserves reverse load order and stored order', async () => {
  const originals = {
    card: globalThis.card,
    addFrame: globalThis.addFrame,
  };
  const calls = [];

  globalThis.card = {
    frames: ['front', 'middle', 'back'],
  };
  globalThis.addFrame = (additionalMasks, frame) => {
    calls.push(['addFrame', [...additionalMasks], frame, [...globalThis.card.frames]]);
  };

  try {
    const {
      forEachLoadedCardFrameInRestoreOrder,
      restoreLoadedCardFrames,
    } = await loadCreatorFunctions([
      'forEachLoadedCardFrameInRestoreOrder',
      'restoreLoadedCardFrames',
    ], '{ forEachLoadedCardFrameInRestoreOrder, restoreLoadedCardFrames }');

    forEachLoadedCardFrameInRestoreOrder((frame) => {
      calls.push(['visit', frame, [...globalThis.card.frames]]);
    });

    assert.deepEqual(calls, [
      ['visit', 'back', ['back', 'middle', 'front']],
      ['visit', 'middle', ['back', 'middle', 'front']],
      ['visit', 'front', ['back', 'middle', 'front']],
    ]);
    assert.deepEqual(globalThis.card.frames, ['front', 'middle', 'back']);

    calls.length = 0;
    await restoreLoadedCardFrames();

    assert.deepEqual(calls, [
      ['addFrame', [], 'back', ['back', 'middle', 'front']],
      ['addFrame', [], 'middle', ['back', 'middle', 'front']],
      ['addFrame', [], 'front', ['back', 'middle', 'front']],
    ]);
    assert.deepEqual(globalThis.card.frames, ['front', 'middle', 'back']);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('saved card reader parses storage data and updates current card', async () => {
  const originals = {
    card: globalThis.card,
    localStorage: globalThis.localStorage,
  };
  const storedCard = { name: 'Stored Card', frames: [] };
  const calls = [];

  globalThis.card = { existing: true };
  globalThis.localStorage = {
    getItem: (cardKey) => {
      calls.push(['get', cardKey]);
      if (cardKey === 'Stored') {
        return JSON.stringify(storedCard);
      }
      return null;
    },
  };

  try {
    const { loadSavedCardData, readSavedCard } = await loadCreatorFunctions([
      'loadSavedCardData',
      'readSavedCard',
    ], '{ loadSavedCardData, readSavedCard }');

    assert.deepEqual(loadSavedCardData('Stored'), storedCard);
    assert.deepEqual(readSavedCard('Stored'), storedCard);
    assert.deepEqual(globalThis.card, storedCard);
    assert.equal(readSavedCard('Missing'), null);
    assert.equal(globalThis.card, null);
    assert.deepEqual(calls, [
      ['get', 'Stored'],
      ['get', 'Stored'],
      ['get', 'Missing'],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('loaded card control restoration preserves section order', async () => {
  const originals = {
    restoreLoadedCardInfoFields: globalThis.restoreLoadedCardInfoFields,
    restoreLoadedCardArtControls: globalThis.restoreLoadedCardArtControls,
    restoreLoadedCardSetSymbolControls: globalThis.restoreLoadedCardSetSymbolControls,
    restoreLoadedCardWatermarkControls: globalThis.restoreLoadedCardWatermarkControls,
    restoreLoadedCardSerialControls: globalThis.restoreLoadedCardSerialControls,
  };
  const calls = [];
  globalThis.restoreLoadedCardInfoFields = () => calls.push('info');
  globalThis.restoreLoadedCardArtControls = () => calls.push('art');
  globalThis.restoreLoadedCardSetSymbolControls = () => calls.push('setSymbol');
  globalThis.restoreLoadedCardWatermarkControls = () => calls.push('watermark');
  globalThis.restoreLoadedCardSerialControls = () => calls.push('serial');

  try {
    const { getLoadedCardControlRestorers, restoreLoadedCardControls } = await loadCreatorFunctions([
      'getLoadedCardControlRestorers',
      'restoreLoadedCardControls',
    ], '{ getLoadedCardControlRestorers, restoreLoadedCardControls }');

    const restorers = getLoadedCardControlRestorers();
    assert.equal(restorers.length, 5);
    restorers.forEach((restoreControls) => restoreControls());
    assert.deepEqual(calls, ['info', 'art', 'setSymbol', 'watermark', 'serial']);

    calls.length = 0;
    restoreLoadedCardControls();
    assert.deepEqual(calls, ['info', 'art', 'setSymbol', 'watermark', 'serial']);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('loaded saved card workflow helpers preserve preparation and restore order', async () => {
  const originals = {
    clearLoadedCardFrames: globalThis.clearLoadedCardFrames,
    readSavedCard: globalThis.readSavedCard,
    restoreLoadedCardControls: globalThis.restoreLoadedCardControls,
    applyLoadedCardEffects: globalThis.applyLoadedCardEffects,
  };
  const calls = [];
  globalThis.clearLoadedCardFrames = () => calls.push('clear');
  globalThis.readSavedCard = (cardKey) => {
    calls.push(['read', cardKey]);
    return { cardKey };
  };
  globalThis.restoreLoadedCardControls = () => calls.push('restoreControls');
  globalThis.applyLoadedCardEffects = () => {
    calls.push('effects');
    return Promise.resolve('effects complete');
  };

  try {
    const { prepareLoadedSavedCard, restoreLoadedSavedCard } = await loadCreatorFunctions([
      'prepareLoadedSavedCard',
      'restoreLoadedSavedCard',
    ], '{ prepareLoadedSavedCard, restoreLoadedSavedCard }');

    assert.deepEqual(prepareLoadedSavedCard('Stored'), { cardKey: 'Stored' });
    assert.deepEqual(calls, ['clear', ['read', 'Stored']]);

    calls.length = 0;
    const restorePromise = restoreLoadedSavedCard();
    assert.equal(typeof restorePromise.then, 'function');
    assert.equal(await restorePromise, 'effects complete');
    assert.deepEqual(calls, ['restoreControls', 'effects']);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('import title parts preserve wanted subtitle splitting', async () => {
  const compatBuildImportedTitleParts = await loadCreatorCompatFunctions(
    ['buildImportedTitleParts'],
    'buildImportedTitleParts',
  );

  for (const buildImportedTitleParts of [
    compatBuildImportedTitleParts,
    buildImportedTitlePartsFromModule,
  ]) {
    assert.deepEqual(buildImportedTitleParts('Lightning Bolt', 'm15'), {
      title: 'Lightning Bolt',
    });
    assert.deepEqual(buildImportedTitleParts('Satoru, the Infiltrator', 'wanted'), {
      title: 'Satoru,',
      subtitle: 'the Infiltrator',
    });
    assert.deepEqual(buildImportedTitleParts('No Subtitle', 'wanted'), {
      title: 'No Subtitle',
      subtitle: '',
    });
  }
});

test('import title text fields preserve prefixing and wanted subtitle formatting', async () => {
  const originalCurlyQuotes = globalThis.curlyQuotes;
  globalThis.curlyQuotes = (text) => `curly:${text}`;
  try {
    const compatBuildImportedTitleTextFields = await loadCreatorCompatFunctions([
      'buildImportedTitleTextFields',
    ], 'buildImportedTitleTextFields');

    for (const buildImportedTitleTextFields of [
      compatBuildImportedTitleTextFields,
      buildImportedTitleTextFieldsFromModule,
    ]) {
      assert.deepEqual(buildImportedTitleTextFields('Lightning Bolt', 'm15', '{fontphyrexian}'), {
        title: '{fontphyrexian}curly:Lightning Bolt',
      });
      assert.deepEqual(buildImportedTitleTextFields('Satoru, the Infiltrator', 'wanted', ''), {
        title: 'curly:Satoru,',
        subtitle: 'curly:the Infiltrator',
      });
      assert.deepEqual(buildImportedTitleTextFields('No Subtitle', 'wanted', '{fontCStitle}'), {
        title: '{fontCStitle}curly:No Subtitle',
        subtitle: '',
      });
    }
  } finally {
    globalThis.curlyQuotes = originalCurlyQuotes;
  }
});

test('import type line formatting preserves localized separator handling', async () => {
  const compatFormatImportedTypeLine = await loadCreatorCompatFunctions([
    'formatImportedTypeLine',
  ], 'formatImportedTypeLine');

  for (const formatImportedTypeLine of [
    compatFormatImportedTypeLine,
    formatImportedTypeLineFromModule,
  ]) {
    assert.equal(formatImportedTypeLine('Creature — Wizard', 'en'), 'Creature — Wizard');
    assert.equal(formatImportedTypeLine('传奇生物 — 人类／忍者', 'zhs'), '传奇生物～人类／忍者');
    assert.equal(formatImportedTypeLine('传奇生物～人类／忍者', 'cs'), '传奇生物～人类／忍者');
  }
});

test('import type text fields preserve formatted type line and prefix', async () => {
  const compatBuildImportedTypeTextFields = await loadCreatorCompatFunctions([
    'buildImportedTypeTextFields',
  ], 'buildImportedTypeTextFields');

  for (const buildImportedTypeTextFields of [
    compatBuildImportedTypeTextFields,
    buildImportedTypeTextFieldsFromModule,
  ]) {
    assert.deepEqual(buildImportedTypeTextFields('Creature — Wizard', 'en', '{fontphyrexian}'), {
      typeLine: 'Creature — Wizard',
      text: '{fontphyrexian}Creature — Wizard',
    });
    assert.deepEqual(buildImportedTypeTextFields('传奇生物 — 人类／忍者', 'zhs', '{fontCStitle}'), {
      typeLine: '传奇生物～人类／忍者',
      text: '{fontCStitle}传奇生物～人类／忍者',
    });
  }
});

test('import language helpers preserve Chinese import handling', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'isChineseImportLanguage',
    'getImportedRulesTextPrefix',
    'getImportedBaseTextPrefix',
    'getImportedStandardTextPrefix',
    'getImportedCollectorLanguage',
  ], '{ isChineseImportLanguage, getImportedRulesTextPrefix, getImportedBaseTextPrefix, getImportedStandardTextPrefix, getImportedCollectorLanguage }');
  const moduleHelpers = {
    isChineseImportLanguage: isChineseImportLanguageFromModule,
    getImportedRulesTextPrefix: getImportedRulesTextPrefixFromModule,
    getImportedBaseTextPrefix: getImportedBaseTextPrefixFromModule,
    getImportedStandardTextPrefix: getImportedStandardTextPrefixFromModule,
    getImportedCollectorLanguage: getImportedCollectorLanguageFromModule,
  };

  for (const {
    isChineseImportLanguage,
    getImportedRulesTextPrefix,
    getImportedBaseTextPrefix,
    getImportedStandardTextPrefix,
    getImportedCollectorLanguage,
  } of [compatHelpers, moduleHelpers]) {
    assert.equal(isChineseImportLanguage('cs'), true);
    assert.equal(isChineseImportLanguage('zhs'), true);
    assert.equal(isChineseImportLanguage('en'), false);
    assert.equal(getImportedRulesTextPrefix('zhs', '{fontFallback}'), '{fontCStext}');
    assert.equal(getImportedRulesTextPrefix('en', '{fontFallback}'), '{fontFallback}');
    assert.equal(getImportedBaseTextPrefix('ph'), '{fontphyrexian}');
    assert.equal(getImportedBaseTextPrefix('en'), '');
    assert.equal(getImportedStandardTextPrefix('zhs', '{fontFallback}'), '{fontCStitle}{fontsize+14}');
    assert.equal(getImportedStandardTextPrefix('en', '{fontFallback}'), '{fontFallback}');
    assert.equal(getImportedCollectorLanguage('zhs'), 'CS');
    assert.equal(getImportedCollectorLanguage('en'), 'EN');
    assert.equal(getImportedCollectorLanguage(undefined), '');
  }
});

test('import URL builders preserve Scryfall and MTGCH request URLs', async () => {
  const {
    buildImportedCollectorSetUrl,
    buildMtgchCardDetailUrl,
    buildMtgchSearchUrl,
    buildMtgchVersionsUrl,
    buildScryfallCardUrl,
    buildScryfallSearchUrl,
    getScryfallUniqueSearchParam,
  } = await loadCreatorCompatFunctions([
    'buildImportedCollectorSetUrl',
    'buildScryfallCardUrl',
    'buildMtgchCardDetailUrl',
    'buildMtgchVersionsUrl',
    'buildMtgchSearchUrl',
    'getScryfallUniqueSearchParam',
    'buildScryfallSearchUrl',
  ], '{ buildImportedCollectorSetUrl, buildMtgchCardDetailUrl, buildMtgchSearchUrl, buildMtgchVersionsUrl, buildScryfallCardUrl, buildScryfallSearchUrl, getScryfallUniqueSearchParam }');

  const cases = [
    [buildImportedCollectorSetUrl, buildImportedCollectorSetUrlFromModule, ['dmu'], 'https://api.scryfall.com/sets/dmu'],
    [buildScryfallCardUrl, buildScryfallCardUrlFromModule, ['DMU', '123 a'], 'https://api.scryfall.com/cards/dmu/123%20a'],
    [buildMtgchCardDetailUrl, buildMtgchCardDetailUrlFromModule, ['card id'], 'https://mtgch.com/api/v1/card/card%20id/'],
    [buildMtgchVersionsUrl, buildMtgchVersionsUrlFromModule, ['card id'], 'https://mtgch.com/api/v1/versions/card%20id/'],
    [
      buildMtgchSearchUrl,
      buildMtgchSearchUrlFromModule,
      ['闪电击', false],
      'https://mtgch.com/api/v1/result?q=%E9%97%AA%E7%94%B5%E5%87%BB&page=1&order=-released_at&priority_chinese=true&view=0&unique=oracle_id',
    ],
    [
      buildScryfallSearchUrl,
      buildScryfallSearchUrlFromModule,
      ['Lightning Bolt', 'en', 'prints'],
      'https://api.scryfall.com/cards/search?order=released&include_extras=true&unique=prints&q=name%3D%22Lightning%20Bolt%22%20lang%3Aen',
    ],
  ];

  for (const [compatBuilder, moduleBuilder, args, expected] of cases) {
    assert.equal(compatBuilder(...args), expected);
    assert.equal(moduleBuilder(...args), expected);
  }

  assert.equal(buildScryfallCardUrl('', '123'), null);
  assert.equal(buildScryfallCardUrlFromModule('', '123'), null);
  assert.equal(buildMtgchCardDetailUrl(null), null);
  assert.equal(buildMtgchCardDetailUrlFromModule(null), null);
  assert.equal(getScryfallUniqueSearchParam(''), '');
  assert.equal(getScryfallUniqueSearchParamFromModule(''), '');
  assert.equal(getScryfallUniqueSearchParam('art'), '&unique=art');
  assert.equal(getScryfallUniqueSearchParamFromModule('art'), '&unique=art');
});

test('import collector fields preserve number rarity set and language mapping', async () => {
  const {
    shouldImportCollectorInfo,
    buildImportedCollectorSetUrl,
    buildImportedCollectorFields,
  } = await loadCreatorCompatFunctions([
    'buildImportedCollectorSetUrl',
    'shouldImportCollectorInfo',
    'buildImportedCollectorFields',
  ], '{ shouldImportCollectorInfo, buildImportedCollectorSetUrl, buildImportedCollectorFields }');

  assert.equal(buildImportedCollectorSetUrl('dmu'), 'https://api.scryfall.com/sets/dmu');

  for (const helpers of [
    { shouldImportCollectorInfo, buildImportedCollectorFields },
    {
      shouldImportCollectorInfo: shouldImportCollectorInfoFromModule,
      buildImportedCollectorFields: buildImportedCollectorFieldsFromModule,
    },
  ]) {
    assert.equal(helpers.shouldImportCollectorInfo('true'), true);
    assert.equal(helpers.shouldImportCollectorInfo('false'), false);
    assert.deepEqual(helpers.buildImportedCollectorFields({
      collector_number: '123',
      rarity: 'rare',
      set: 'dmu',
      lang: 'en',
    }), {
      number: '123',
      rarity: 'R',
      setCode: 'DMU',
      language: 'EN',
    });
    assert.deepEqual(helpers.buildImportedCollectorFields({
      collector_number: '42',
      rarity: 'mythic',
      set: 'fin',
      lang: 'zhs',
    }), {
      number: '42',
      rarity: 'M',
      setCode: 'FIN',
      language: 'CS',
    });
  }
});

test('import collector number formatter preserves legacy and new style padding', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'formatImportedCollectorNumber',
    'buildImportedCollectorNumberUpdate',
    'buildImportedCollectorNumberUpdateFromSetResponse',
  ], '{ formatImportedCollectorNumber, buildImportedCollectorNumberUpdate, buildImportedCollectorNumberUpdateFromSetResponse }');
  const moduleHelpers = {
    formatImportedCollectorNumber: formatImportedCollectorNumberFromModule,
    buildImportedCollectorNumberUpdate: buildImportedCollectorNumberUpdateFromModule,
    buildImportedCollectorNumberUpdateFromSetResponse: buildImportedCollectorNumberUpdateFromSetResponseFromModule,
  };

  for (const {
    formatImportedCollectorNumber,
    buildImportedCollectorNumberUpdate,
    buildImportedCollectorNumberUpdateFromSetResponse,
  } of [compatHelpers, moduleHelpers]) {
    assert.equal(formatImportedCollectorNumber('7', undefined, true), '0007');
    assert.equal(formatImportedCollectorNumber('7', undefined, false), null);
    assert.equal(formatImportedCollectorNumber('7', '99', false), '007/099');
    assert.equal(formatImportedCollectorNumber('7', 99, false), '007/99');
    assert.equal(formatImportedCollectorNumber('120', '99', false), '120');
    assert.deepEqual(buildImportedCollectorNumberUpdate('7', '99', false), {
      number: '007/099',
      shouldUpdate: true,
    });
    assert.deepEqual(buildImportedCollectorNumberUpdate('7', undefined, false), {
      number: null,
      shouldUpdate: false,
    });
    assert.deepEqual(buildImportedCollectorNumberUpdateFromSetResponse('7', '{"printed_size":"99"}', false), {
      number: '007/099',
      shouldUpdate: true,
    });
  }
});

test('import set symbol fields preserve set code and rarity initial', async () => {
  const compatBuildImportedSetSymbolFields = await loadCreatorCompatFunctions([
    'buildImportedSetSymbolFields',
  ], 'buildImportedSetSymbolFields');

  for (const buildImportedSetSymbolFields of [
    compatBuildImportedSetSymbolFields,
    buildImportedSetSymbolFieldsFromModule,
  ]) {
    assert.deepEqual(buildImportedSetSymbolFields({
      set: 'dmu',
      rarity: 'rare',
    }), {
      code: 'dmu',
      rarity: 'r',
    });
    assert.deepEqual(buildImportedSetSymbolFields({
      set: 'fin',
      rarity: 'mythic',
    }), {
      code: 'fin',
      rarity: 'm',
    });
  }
});

test('import set symbol plan preserves lock decisions', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'buildImportedSetSymbolImportPlan',
    'buildImportedSpecialLayoutSetSymbolPlan',
  ], '{ buildImportedSetSymbolImportPlan, buildImportedSpecialLayoutSetSymbolPlan }');
  const moduleHelpers = {
    buildImportedSetSymbolImportPlan: buildImportedSetSymbolImportPlanFromModule,
    buildImportedSpecialLayoutSetSymbolPlan: buildImportedSpecialLayoutSetSymbolPlanFromModule,
  };
  const importedCard = {
    set: 'dmu',
    rarity: 'rare',
  };

  for (const {
    buildImportedSetSymbolImportPlan,
    buildImportedSpecialLayoutSetSymbolPlan,
  } of [compatHelpers, moduleHelpers]) {
    assert.deepEqual(buildImportedSetSymbolImportPlan(importedCard, false, false), {
      code: 'dmu',
      rarity: 'r',
      shouldFetch: true,
    });
    assert.deepEqual(buildImportedSetSymbolImportPlan(importedCard, true, false), {
      code: null,
      rarity: 'r',
      shouldFetch: true,
    });
    assert.deepEqual(buildImportedSetSymbolImportPlan(importedCard, false, true), {
      code: 'dmu',
      rarity: 'r',
      shouldFetch: false,
    });

    assert.deepEqual(buildImportedSpecialLayoutSetSymbolPlan(importedCard, false, false), {
      code: 'dmu',
      rarity: 'r',
      shouldFetch: true,
    });
    assert.deepEqual(buildImportedSpecialLayoutSetSymbolPlan(importedCard, true, false), {
      code: null,
      rarity: null,
      shouldFetch: false,
    });
    assert.deepEqual(buildImportedSpecialLayoutSetSymbolPlan(importedCard, false, true), {
      code: 'dmu',
      rarity: 'r',
      shouldFetch: false,
    });
  }
});

test('import art fields preserve datasource-specific search names', async () => {
  const compatBuildImportedArtFields = await loadCreatorCompatFunctions([
    'buildImportedArtFields',
  ], 'buildImportedArtFields');
  const importedCard = {
    name: 'Lightning Bolt',
    en_name: 'Lightning Bolt EN',
    image_uris: {
      art_crop: 'https://example.test/bolt.jpg',
    },
  };

  for (const buildImportedArtFields of [
    compatBuildImportedArtFields,
    buildImportedArtFieldsFromModule,
  ]) {
    assert.deepEqual(buildImportedArtFields(importedCard, 'scryfall'), {
      name: 'Lightning Bolt',
      cropUrl: 'https://example.test/bolt.jpg',
      fetchName: 'Lightning Bolt',
    });
    assert.deepEqual(buildImportedArtFields(importedCard, 'mtgch'), {
      name: 'Lightning Bolt',
      cropUrl: 'https://example.test/bolt.jpg',
      fetchName: 'Lightning Bolt EN',
    });
    assert.deepEqual(buildImportedArtFields(importedCard, 'local'), {
      name: 'Lightning Bolt',
      cropUrl: 'https://example.test/bolt.jpg',
      fetchName: null,
    });
  }
});

test('import art plan preserves datasource fields and all-prints index sync', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'buildImportedArtFields',
    'buildImportedArtImportPlan',
    'buildImportedSpecialLayoutMediaPlan',
  ], '{ buildImportedArtImportPlan, buildImportedSpecialLayoutMediaPlan }');
  const moduleHelpers = {
    buildImportedArtImportPlan: buildImportedArtImportPlanFromModule,
    buildImportedSpecialLayoutMediaPlan: buildImportedSpecialLayoutMediaPlanFromModule,
  };
  const importedCard = {
    name: 'Lightning Bolt',
    en_name: 'Lightning Bolt EN',
    artist: 'Christopher Rush',
    image_uris: {
      art_crop: 'https://example.test/bolt.jpg',
    },
  };

  for (const {
    buildImportedArtImportPlan,
    buildImportedSpecialLayoutMediaPlan,
  } of [compatHelpers, moduleHelpers]) {
    assert.deepEqual(buildImportedArtImportPlan(importedCard, 'mtgch', true, '3'), {
      name: 'Lightning Bolt',
      cropUrl: 'https://example.test/bolt.jpg',
      fetchName: 'Lightning Bolt EN',
      artIndex: '3',
    });
    assert.deepEqual(buildImportedArtImportPlan(importedCard, 'local', false, '3'), {
      name: 'Lightning Bolt',
      cropUrl: 'https://example.test/bolt.jpg',
      fetchName: null,
      artIndex: null,
    });
    assert.deepEqual(buildImportedSpecialLayoutMediaPlan(importedCard), {
      artist: 'Christopher Rush',
      cropUrl: 'https://example.test/bolt.jpg',
    });
  }
});

test('import print identity preserves PLST collector split', async () => {
  const compatGetImportedPrintIdentity = await loadCreatorCompatFunctions([
    'getImportedPrintIdentity',
  ], 'getImportedPrintIdentity');

  for (const getImportedPrintIdentity of [
    compatGetImportedPrintIdentity,
    getImportedPrintIdentityFromModule,
  ]) {
    assert.deepEqual(getImportedPrintIdentity({
      set: 'plst',
      collector_number: 'dmu-123',
    }), {
      set: 'dmu',
      collector_number: '123',
    });
    assert.deepEqual(getImportedPrintIdentity({
      set: 'dmu',
      collector_number: '123',
    }), {
      set: 'dmu',
      collector_number: '123',
    });
  }
});

test('import text preservation helpers keep descriptive fields and first reminder', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'collectTextFieldValues',
    'shouldPreserveImportedReminderText',
    'extractImportedReminderText',
  ], '{ collectTextFieldValues, shouldPreserveImportedReminderText, extractImportedReminderText }');
  const moduleHelpers = {
    collectTextFieldValues: collectTextFieldValuesFromModule,
    shouldPreserveImportedReminderText: shouldPreserveImportedReminderTextFromModule,
    extractImportedReminderText: extractImportedReminderTextFromModule,
  };

  for (const {
    collectTextFieldValues,
    shouldPreserveImportedReminderText,
    extractImportedReminderText,
  } of [compatHelpers, moduleHelpers]) {
    assert.deepEqual(collectTextFieldValues({
      left: { text: 'Left reminder' },
      right: { text: 'Right reminder' },
      title: { text: 'Card Name' },
      empty: { text: '' },
    }, ['left', 'right', 'empty', 'missing']), {
      left: 'Left reminder',
      right: 'Right reminder',
    });

    assert.equal(shouldPreserveImportedReminderText('fuse'), true);
    assert.equal(shouldPreserveImportedReminderText('room'), true);
    assert.equal(shouldPreserveImportedReminderText('transform'), false);

    assert.equal(
      extractImportedReminderText('Ward {2} (Whenever this becomes targeted, counter it unless they pay {2}.)\nDraw a card.'),
      '(Whenever this becomes targeted, counter it unless they pay {2}.)',
    );
    assert.equal(extractImportedReminderText('Draw a card.'), '');
    assert.equal(extractImportedReminderText(undefined), '');
  }

  const {
    clearTextFieldValuesPreserving,
    resetTextFieldFontSizes,
  } = await loadCreatorFunctionsWithCompat([
    'clearTextFieldValuesPreserving',
    'resetTextFieldFontSizes',
  ], '{ clearTextFieldValuesPreserving, resetTextFieldFontSizes }');

  const textFields = {
    left: { text: 'Left reminder' },
    right: { text: 'Right reminder' },
    title: { text: 'Card Name' },
    empty: { text: '' },
  };
  assert.deepEqual(clearTextFieldValuesPreserving(textFields, ['left', 'right', 'empty']), {
    left: 'Left reminder',
    right: 'Right reminder',
  });
  assert.deepEqual(textFields, {
    left: { text: 'Left reminder' },
    right: { text: 'Right reminder' },
    title: { text: '' },
    empty: { text: '' },
  });

  const fontSizeFields = {
    title: { text: 'Card Name', fontSize: 14 },
    rules: { text: 'Rules', fontSize: 9 },
  };
  resetTextFieldFontSizes(fontSizeFields);
  assert.deepEqual(fontSizeFields, {
    title: { text: 'Card Name', fontSize: 0 },
    rules: { text: 'Rules', fontSize: 0 },
  });
});

test('import text preparation normalizes print identity and restores preserved reminder text', async () => {
  const prepareImportedCardTextFields = await loadCreatorFunctionsWithCompat([
    'applyImportedPrintIdentity',
    'clearTextFieldValuesPreserving',
    'prepareImportedCardTextFields',
  ], 'prepareImportedCardTextFields');
  const cardToImport = {
    set: 'plst',
    collector_number: 'dmu-123',
    oracle_text: 'Draw a card. (Imported reminder.)',
  };
  const cardObject = {
    version: 'fuse',
    text: {
      left: { text: 'Left text' },
      right: { text: 'Right text' },
      title: { text: 'Old title' },
      rules: { text: 'Old rules' },
      reminder: { text: 'Saved reminder' },
    },
  };

  prepareImportedCardTextFields(cardToImport, cardObject);

  assert.equal(cardToImport.set, 'dmu');
  assert.equal(cardToImport.collector_number, '123');
  assert.deepEqual(cardObject.text, {
    left: { text: 'Left text' },
    right: { text: 'Right text' },
    title: { text: '' },
    rules: { text: '' },
    reminder: { text: '(Imported reminder.)' },
  });

  const roomCardObject = {
    version: 'room',
    text: {
      left: { text: '' },
      right: { text: '' },
      reminder: { text: 'Saved room reminder' },
      rules: { text: 'Old room rules' },
    },
  };
  prepareImportedCardTextFields({
    set: 'dsk',
    collector_number: '99',
    oracle_text: 'No imported reminder.',
  }, roomCardObject);

  assert.equal(roomCardObject.text.reminder.text, 'Saved room reminder');
  assert.equal(roomCardObject.text.rules.text, '');
});

test('import card follow-ups apply standard text collector and media in order', async () => {
  const originals = {
    getImportedStandardTextPrefix: globalThis.getImportedStandardTextPrefix,
    applyImportedStandardText: globalThis.applyImportedStandardText,
    applyImportedCollectorInfo: globalThis.applyImportedCollectorInfo,
    applyImportedCardMedia: globalThis.applyImportedCardMedia,
  };
  const calls = [];
  const cardToImport = { lang: 'zhs' };
  const cardObject = { text: {} };

  globalThis.getImportedStandardTextPrefix = (lang, fallbackTextPrefix) => {
    calls.push(['prefix', lang, fallbackTextPrefix]);
    return '{fontCStitle}{fontsize+14}';
  };
  globalThis.applyImportedStandardText = (importedCard, targetCard, textPrefix, textIndex) => {
    calls.push(['standard', importedCard, targetCard, textPrefix, textIndex]);
  };
  globalThis.applyImportedCollectorInfo = (importedCard) => {
    calls.push(['collector', importedCard]);
  };
  globalThis.applyImportedCardMedia = (importedCard) => {
    calls.push(['media', importedCard]);
  };

  try {
    const applyImportedCardFollowUps = await loadCreatorFunctions([
      'applyImportedCardFollowUps',
    ], 'applyImportedCardFollowUps');

    applyImportedCardFollowUps(cardToImport, cardObject, '{fallback}', 2);

    assert.deepEqual(calls, [
      ['prefix', 'zhs', '{fallback}'],
      ['standard', cardToImport, cardObject, '{fontCStitle}{fontsize+14}', 2],
      ['collector', cardToImport],
      ['media', cardToImport],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('import layout dispatcher preserves multi unique station routing and abort result', async () => {
  const originals = {
    applyImportedMultiFacedCard: globalThis.applyImportedMultiFacedCard,
    applyImportedUniqueLayoutCard: globalThis.applyImportedUniqueLayoutCard,
    applyImportedStationCard: globalThis.applyImportedStationCard,
  };
  const calls = [];
  const {
    applyImportedLayoutSpecificCard,
  } = await loadCreatorFunctionsWithCompat([
    'applyImportedLayoutSpecificCard',
  ], '{ applyImportedLayoutSpecificCard }');
  const compatShouldApplyImportedStationLayout = await loadCreatorCompatFunctions([
    'shouldApplyImportedStationLayout',
  ], 'shouldApplyImportedStationLayout');
  const transformCardObject = { version: 'transform' };
  const prototypeCardObject = { version: 'prototype' };
  const stationCardObject = { version: 'station' };

  globalThis.applyImportedMultiFacedCard = (importedCard, targetCard, textPrefix) => {
    calls.push(['multi', importedCard.layout, targetCard.version, textPrefix]);
    return importedCard.shouldApply;
  };
  globalThis.applyImportedUniqueLayoutCard = (importedCard, targetCard, textPrefix) => {
    calls.push(['unique', importedCard.layout, targetCard.version, textPrefix]);
  };
  globalThis.applyImportedStationCard = (importedCard, targetCard, textPrefix) => {
    calls.push(['station', importedCard.layout, targetCard.version, textPrefix]);
  };

  try {
    for (const shouldApplyImportedStationLayout of [
      compatShouldApplyImportedStationLayout,
      shouldApplyImportedStationLayoutFromModule,
    ]) {
      assert.equal(shouldApplyImportedStationLayout({
        oracle_text: 'Station (Tap a creature.)',
      }, stationCardObject), true);
      assert.equal(shouldApplyImportedStationLayout({
        oracle_text: 'Draw a card.',
      }, stationCardObject), false);
      assert.equal(shouldApplyImportedStationLayout({
        oracle_text: 'Station (Tap a creature.)',
      }, { version: 'normal' }), false);
    }

    assert.equal(applyImportedLayoutSpecificCard({
      layout: 'transform',
      shouldApply: false,
    }, transformCardObject, '{base}'), false);
    assert.equal(applyImportedLayoutSpecificCard({
      layout: 'prototype',
      oracle_text: 'Station text should not be reached.',
    }, prototypeCardObject, '{base}'), true);
    assert.equal(applyImportedLayoutSpecificCard({
      layout: 'normal',
      oracle_text: 'Station (Tap a creature.)',
    }, stationCardObject, '{base}'), true);
    assert.equal(applyImportedLayoutSpecificCard({
      layout: 'normal',
      oracle_text: 'Draw a card.',
    }, stationCardObject, '{base}'), true);

    assert.deepEqual(calls, [
      ['multi', 'transform', 'transform', '{base}'],
      ['unique', 'prototype', 'prototype', '{base}'],
      ['station', 'normal', 'station', '{base}'],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('import card application helper skips follow-ups when layout aborts', async () => {
  const originals = {
    applyImportedLayoutSpecificCard: globalThis.applyImportedLayoutSpecificCard,
    applyImportedCardFollowUps: globalThis.applyImportedCardFollowUps,
  };
  const calls = [];
  const importedCard = { name: 'Imported Card' };
  const cardObject = { version: 'normal' };
  globalThis.applyImportedLayoutSpecificCard = (cardToImport, targetCard, textPrefix) => {
    calls.push(['layout', cardToImport, targetCard, textPrefix]);
    return cardToImport.shouldApply;
  };
  globalThis.applyImportedCardFollowUps = (cardToImport, targetCard, textPrefix, textIndex) => {
    calls.push(['followUps', cardToImport, targetCard, textPrefix, textIndex]);
  };

  try {
    const applyImportedCardWithFollowUps = await loadCreatorFunctions([
      'applyImportedCardWithFollowUps',
    ], 'applyImportedCardWithFollowUps');

    assert.equal(applyImportedCardWithFollowUps({
      ...importedCard,
      shouldApply: false,
    }, cardObject, '{base}', 4), false);
    assert.equal(applyImportedCardWithFollowUps({
      ...importedCard,
      shouldApply: true,
    }, cardObject, '{base}', 4), true);

    assert.deepEqual(calls, [
      ['layout', { ...importedCard, shouldApply: false }, cardObject, '{base}'],
      ['layout', { ...importedCard, shouldApply: true }, cardObject, '{base}'],
      ['followUps', { ...importedCard, shouldApply: true }, cardObject, '{base}', 4],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('selected imported card helpers preserve selection logging and application order', async () => {
  const originals = {
    document: globalThis.document,
    scryfallCard: globalThis.scryfallCard,
    log: console.log,
    prepareImportedCardTextFields: globalThis.prepareImportedCardTextFields,
    getImportedBaseTextPrefix: globalThis.getImportedBaseTextPrefix,
    applyImportedCardWithFollowUps: globalThis.applyImportedCardWithFollowUps,
  };
  const selectedCard = { layout: 'normal', lang: 'zhs' };
  const targetCard = { version: 'm15', text: {} };
  const calls = [];
  globalThis.document = {
    querySelector(selector) {
      assert.equal(selector, '#import-index');
      return { value: '1' };
    },
  };
  globalThis.scryfallCard = [
    { layout: 'prototype', lang: 'en' },
    selectedCard,
  ];
  console.log = (...args) => calls.push(['log', ...args]);
  globalThis.prepareImportedCardTextFields = (cardToImport, cardObject) => {
    calls.push(['prepare', cardToImport, cardObject]);
  };
  globalThis.getImportedBaseTextPrefix = (lang) => {
    calls.push(['prefix', lang]);
    return '{fontCStitle}{fontsize+14}';
  };
  globalThis.applyImportedCardWithFollowUps = (cardToImport, cardObject, textPrefix, textIndex) => {
    calls.push(['apply', cardToImport, cardObject, textPrefix, textIndex]);
    return true;
  };

  try {
    const {
      getSelectedImportedCard,
      logImportedCardSelection,
      applySelectedImportedCard,
    } = await loadCreatorFunctions([
      'getSelectedImportedCard',
      'logImportedCardSelection',
      'applySelectedImportedCard',
    ], '{ getSelectedImportedCard, logImportedCardSelection, applySelectedImportedCard }');

    assert.equal(getSelectedImportedCard(), selectedCard);

    logImportedCardSelection(selectedCard, targetCard);
    assert.deepEqual(calls, [
      ['log', 'Card layout:', 'normal'],
      ['log', 'Card version:', 'm15'],
    ]);

    calls.length = 0;
    assert.equal(applySelectedImportedCard(selectedCard, targetCard, 3), true);
    assert.deepEqual(calls, [
      ['prepare', selectedCard, targetCard],
      ['prefix', 'zhs'],
      ['apply', selectedCard, targetCard, '{fontCStitle}{fontsize+14}', 3],
    ]);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (name === 'log') {
        console.log = value;
      } else if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('import template wait helper preserves default initialization retry and abort behavior', async () => {
  const originals = {
    document: globalThis.document,
    setTimeout: globalThis.setTimeout,
    warn: console.warn,
    error: console.error,
  };
  const calls = {
    frameClicks: 0,
    loadClicks: 0,
    retries: [],
    delays: [],
    warnings: [],
    errors: [],
  };
  const framePicker = {
    children: [
      {
        click() {
          calls.frameClicks += 1;
        },
      },
    ],
  };
  const loadFrameVersionButton = {
    click() {
      calls.loadClicks += 1;
    },
  };

  globalThis.document = {
    querySelector(selector) {
      if (selector === '#frame-picker') return framePicker;
      if (selector === '#loadFrameVersion') return loadFrameVersionButton;
      assert.fail(`unexpected selector ${selector}`);
    },
  };
  globalThis.setTimeout = (callback, delay) => {
    calls.delays.push(delay);
    callback();
    return 0;
  };
  console.warn = (...args) => calls.warnings.push(args);
  console.error = (...args) => calls.errors.push(args);

  try {
    const {
      shouldInitializeImportedTemplate,
      initializeImportedTemplateFrameControls,
      scheduleImportedTemplateRetry,
      notifyImportedTemplateAbort,
      waitForImportedTemplateReady,
    } = await loadCreatorFunctions([
      'shouldInitializeImportedTemplate',
      'initializeImportedTemplateFrameControls',
      'scheduleImportedTemplateRetry',
      'notifyImportedTemplateAbort',
      'waitForImportedTemplateReady',
    ], '{ shouldInitializeImportedTemplate, initializeImportedTemplateFrameControls, scheduleImportedTemplateRetry, notifyImportedTemplateAbort, waitForImportedTemplateReady }');
    const cardToImport = { name: 'Waiting Card' };

    assert.equal(shouldInitializeImportedTemplate({ version: '' }, 0), true);
    assert.equal(shouldInitializeImportedTemplate({}, 0), true);
    assert.equal(shouldInitializeImportedTemplate({ version: 'normal' }, 0), false);
    assert.equal(shouldInitializeImportedTemplate({ version: '' }, 1), false);

    initializeImportedTemplateFrameControls();
    assert.equal(calls.frameClicks, 1);
    assert.equal(calls.loadClicks, 1);
    assert.deepEqual(calls.warnings.map(([message]) => message), [
      '[mtgch-import] changeCardIndex selecting default frame option',
      '[mtgch-import] changeCardIndex forcing frame version initialization',
    ]);

    calls.frameClicks = 0;
    calls.loadClicks = 0;
    calls.warnings.length = 0;
    scheduleImportedTemplateRetry(cardToImport, { version: 'normal' }, 2, (nextRetry) => calls.retries.push(nextRetry));
    assert.deepEqual(calls.retries, [3]);
    assert.deepEqual(calls.delays, [100]);
    assert.deepEqual(calls.warnings[0], [
      '[mtgch-import] changeCardIndex waiting for template initialization',
      {
        retryCount: 2,
        cardVersion: 'normal',
        cardState: { version: 'normal' },
        cardToImport,
      },
    ]);

    calls.retries.length = 0;
    calls.delays.length = 0;
    calls.warnings.length = 0;
    notifyImportedTemplateAbort(cardToImport, { version: 'normal' });
    assert.deepEqual(calls.errors[0], [
      '[mtgch-import] changeCardIndex aborted: card.text is missing after retries',
      {
        cardVersion: 'normal',
        cardState: { version: 'normal' },
        cardToImport,
      },
    ]);

    calls.errors.length = 0;
    assert.equal(waitForImportedTemplateReady(cardToImport, {
      version: 'normal',
      text: {},
    }, 0, () => calls.retries.push('unexpected')), true);

    assert.equal(waitForImportedTemplateReady(cardToImport, {
      version: '',
    }, 0, (nextRetry) => calls.retries.push(nextRetry)), false);

    assert.equal(calls.frameClicks, 1);
    assert.equal(calls.loadClicks, 1);
    assert.deepEqual(calls.retries, [1]);
    assert.deepEqual(calls.delays, [100]);
    assert.deepEqual(calls.warnings.map(([message]) => message), [
      '[mtgch-import] changeCardIndex selecting default frame option',
      '[mtgch-import] changeCardIndex forcing frame version initialization',
      '[mtgch-import] changeCardIndex waiting for template initialization',
    ]);
    assert.deepEqual(calls.warnings[2][1], {
      retryCount: 0,
      cardVersion: '',
      cardState: { version: '' },
      cardToImport,
    });

    assert.equal(waitForImportedTemplateReady(cardToImport, {
      version: 'normal',
    }, 30, (nextRetry) => calls.retries.push(nextRetry)), false);
    assert.equal(calls.errors.length, 1);
    assert.equal(calls.errors[0][0], '[mtgch-import] changeCardIndex aborted: card.text is missing after retries');
    assert.deepEqual(calls.errors[0][1], {
      cardVersion: 'normal',
      cardState: { version: 'normal' },
      cardToImport,
    });
  } finally {
    if (originals.document === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = originals.document;
    }
    if (originals.setTimeout === undefined) {
      delete globalThis.setTimeout;
    } else {
      globalThis.setTimeout = originals.setTimeout;
    }
    console.warn = originals.warn;
    console.error = originals.error;
  }
});

test('import multi-faced layout predicate preserves source and frame matching', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'isImportedMultiFacedLayout',
    'isImportedTransformVersion',
    'buildImportedFrontStatFields',
    'shouldImportBackType',
    'shouldImportBackPtToFrontPt2',
    'shouldUseBackPtAsReminder',
  ], '{ isImportedMultiFacedLayout, isImportedTransformVersion, buildImportedFrontStatFields, shouldImportBackType, shouldImportBackPtToFrontPt2, shouldUseBackPtAsReminder }');
  const moduleHelpers = {
    isImportedMultiFacedLayout: isImportedMultiFacedLayoutFromModule,
    isImportedTransformVersion: isImportedTransformVersionFromModule,
    buildImportedFrontStatFields: buildImportedFrontStatFieldsFromModule,
    shouldImportBackType: shouldImportBackTypeFromModule,
    shouldImportBackPtToFrontPt2: shouldImportBackPtToFrontPt2FromModule,
    shouldUseBackPtAsReminder: shouldUseBackPtAsReminderFromModule,
  };

  for (const {
    isImportedMultiFacedLayout,
    isImportedTransformVersion,
    buildImportedFrontStatFields,
    shouldImportBackType,
    shouldImportBackPtToFrontPt2,
    shouldUseBackPtAsReminder,
  } of [compatHelpers, moduleHelpers]) {
    assert.equal(isImportedMultiFacedLayout('modal_dfc', 'modal'), true);
    assert.equal(isImportedMultiFacedLayout('transform', 'transform legendary'), true);
    assert.equal(isImportedMultiFacedLayout('adventure', 'showcase adventure'), true);
    assert.equal(isImportedMultiFacedLayout('normal', 'transform'), false);
    assert.equal(isImportedMultiFacedLayout('split', 'normal'), false);
    assert.equal(isImportedTransformVersion('Transform showcase'), true);
    assert.equal(isImportedTransformVersion('prototype'), false);
    assert.deepEqual(buildImportedFrontStatFields('battle', {defense: '7', pt: '4/4'}), {defense: '7'});
    assert.deepEqual(buildImportedFrontStatFields('transform', {defense: '7', pt: '4/4'}), {pt: '4/4'});
    assert.equal(shouldImportBackType('Battle — Siege'), true);
    assert.equal(shouldImportBackType('Enchantment — Room'), false);
    assert.equal(shouldImportBackPtToFrontPt2('battle'), true);
    assert.equal(shouldImportBackPtToFrontPt2('modal'), false);
    assert.equal(shouldUseBackPtAsReminder('transform', '4/4'), true);
    assert.equal(shouldUseBackPtAsReminder('transform', ''), false);
  }
});

test('import face rules formatter preserves prefix and flavor marker', async () => {
  const originalCurlyQuotes = globalThis.curlyQuotes;
  globalThis.curlyQuotes = (text) => `curly:${text}`;
  try {
    const compatFormatImportedFaceRules = await loadCreatorCompatFunctions([
      'formatImportedFaceRules',
    ], 'formatImportedFaceRules');

    for (const formatImportedFaceRules of [
      compatFormatImportedFaceRules,
      formatImportedFaceRulesFromModule,
    ]) {
      assert.equal(formatImportedFaceRules({
        rules: 'Flying',
      }, '{fontphyrexian}'), '{fontphyrexian}Flying');
      assert.equal(formatImportedFaceRules({
        rules: 'Draw a card.',
        flavor: 'A first line.\nA second line.',
      }, ''), 'Draw a card.{flavor}curly:A first line.{lns}A second line.');
    }
  } finally {
    globalThis.curlyQuotes = originalCurlyQuotes;
  }
});

test('import face text field builder preserves prefixed face values', async () => {
  const originalCurlyQuotes = globalThis.curlyQuotes;
  globalThis.curlyQuotes = (text) => `curly:${text}`;
  try {
    const compatBuildImportedFaceTextFields = await loadCreatorCompatFunctions([
      'formatImportedFaceRules',
      'buildImportedFaceTextFields',
    ], 'buildImportedFaceTextFields');

    for (const buildImportedFaceTextFields of [
      compatBuildImportedFaceTextFields,
      buildImportedFaceTextFieldsFromModule,
    ]) {
      assert.deepEqual(buildImportedFaceTextFields({
        name: 'Front Name',
        type: 'Creature — Wizard',
        rules: 'Flying',
        flavor: 'A line.',
        mana: '{1}{U}',
        pt: '2/2',
      }, '{fontphyrexian}'), {
        title: '{fontphyrexian}Front Name',
        type: '{fontphyrexian}Creature — Wizard',
        rules: '{fontphyrexian}Flying{flavor}curly:A line.',
        mana: '{1}{U}',
        pt: '2/2',
      });
    }
  } finally {
    globalThis.curlyQuotes = originalCurlyQuotes;
  }
});

test('import unique layout predicate preserves exact source and frame matching', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'getImportedUniqueLayouts',
    'isImportedUniqueLayout',
  ], '{ getImportedUniqueLayouts, isImportedUniqueLayout }');
  const moduleHelpers = {
    getImportedUniqueLayouts: getImportedUniqueLayoutsFromModule,
    isImportedUniqueLayout: isImportedUniqueLayoutFromModule,
  };

  for (const {
    getImportedUniqueLayouts,
    isImportedUniqueLayout,
  } of [compatHelpers, moduleHelpers]) {
    assert.deepEqual(getImportedUniqueLayouts(), ['leveler', 'prototype', 'mutate', 'vanguard']);
    assert.equal(isImportedUniqueLayout('leveler', 'leveler'), true);
    assert.equal(isImportedUniqueLayout('prototype', 'prototype'), true);
    assert.equal(isImportedUniqueLayout('mutate', 'mutate'), true);
    assert.equal(isImportedUniqueLayout('vanguard', 'vanguard'), true);
    assert.equal(isImportedUniqueLayout('prototype', 'prototype showcase'), false);
    assert.equal(isImportedUniqueLayout('normal', 'leveler'), false);
  }
});

test('import unique layout parser dispatches to matching parser', async () => {
  const {
    getImportedUniqueLayoutParser,
    parseImportedUniqueLayout,
  } = await loadCreatorFunctionsWithCompat([
    'getImportedUniqueLayoutParser',
    'parseImportedUniqueLayout',
  ], '{ getImportedUniqueLayoutParser, parseImportedUniqueLayout }');

  assert.equal(getImportedUniqueLayoutParser('normal'), null);
  assert.equal(getImportedUniqueLayoutParser('prototype').name, 'parsePrototypeLayout');
  assert.deepEqual(parseImportedUniqueLayout({
    layout: 'prototype',
    name: 'Arcane Proxy',
    type_line: 'Artifact Creature — Wizard',
    mana_cost: '{7}',
    power: '4',
    toughness: '3',
    oracle_text: 'Prototype {1}{U}{U} — 2/1 (You may cast this spell with different mana cost, color, and size. It keeps its abilities and types.)\nWhen Arcane Proxy enters, copy target instant card.',
  }), {
    layout: 'prototype',
    name: 'Arcane Proxy',
    type: 'Artifact Creature — Wizard',
    mana: '{7}',
    basePT: '4/3',
    rules: 'When Arcane Proxy enters, copy target instant card.',
    prototype: {
      cost: '{1}{U}{U}',
      pt: '2/1',
      reminderText: 'Prototype {1}{U}{U} — 2/1 {i}(You may cast this spell with different mana cost, color, and size. It keeps its abilities and types.){/i}',
    },
  });
  assert.equal(parseImportedUniqueLayout({
    layout: 'normal',
  }), null);
});

test('unique layout importer applies prototype fields and media side effects', async () => {
  const originals = {
    artistEdited: globalThis.artistEdited,
    uploadArt: globalThis.uploadArt,
    fetchSetSymbol: globalThis.fetchSetSymbol,
    textEdited: globalThis.textEdited,
    document: globalThis.document,
  };
  const domFields = new Map([
    ['#lockSetSymbolCode', { checked: false }],
    ['#lockSetSymbolURL', { checked: false }],
    ['#set-symbol-code', { value: '' }],
    ['#set-symbol-rarity', { value: '' }],
  ]);
  const calls = {
    artists: [],
    uploads: [],
    fetchSetSymbol: 0,
    textEdited: 0,
  };

  globalThis.artistEdited = (artist) => calls.artists.push(artist);
  globalThis.uploadArt = (url, mode) => calls.uploads.push([url, mode]);
  globalThis.fetchSetSymbol = () => {
    calls.fetchSetSymbol += 1;
  };
  globalThis.textEdited = () => {
    calls.textEdited += 1;
  };
  globalThis.document = {
    querySelector(selector) {
      const field = domFields.get(selector);
      assert.ok(field, `unexpected selector ${selector}`);
      return field;
    },
  };

  try {
    const {
      parseImportedUniqueLayout,
      applyImportedUniqueTextFields,
      applyImportedUniqueLayoutCard,
    } = await loadCreatorFunctionsWithCompat([
      'applyImportedSpecialLayoutMedia',
      'applyImportedSpecialLayoutSetSymbol',
      'getImportedUniqueLayoutParser',
      'parseImportedUniqueLayout',
      'applyImportedUniqueBaseFields',
      'applyImportedLevelerFields',
      'applyImportedPrototypeFields',
      'applyImportedMutateFields',
      'applyImportedVanguardFields',
      'applyImportedUniqueTextFields',
      'applyImportedUniqueLayoutCard',
    ], '{ parseImportedUniqueLayout, applyImportedUniqueTextFields, applyImportedUniqueLayoutCard }');
    const cardToImport = {
      layout: 'prototype',
      name: 'Arcane Proxy',
      type_line: 'Artifact Creature — Wizard',
      mana_cost: '{7}',
      power: '4',
      toughness: '3',
      set: 'bro',
      rarity: 'rare',
      artist: 'Card Artist',
      image_uris: {
        art_crop: 'https://example.test/prototype.jpg',
      },
      oracle_text: 'Prototype {1}{U}{U} — 2/1 (You may cast this spell with different mana cost, color, and size. It keeps its abilities and types.)\nWhen Arcane Proxy enters, copy target instant card.',
    };
    const directTextCardObject = {
      text: {
        title: { text: '' },
        type: { text: '' },
        mana: { text: '' },
        pt: { text: '' },
        rules2: { text: '' },
        prototype: { text: '' },
        mana2: { text: '' },
        pt2: { text: '' },
      },
    };
    applyImportedUniqueTextFields(parseImportedUniqueLayout(cardToImport), directTextCardObject, '{fontphyrexian}');
    assert.deepEqual(directTextCardObject.text, {
      title: { text: '{fontphyrexian}Arcane Proxy' },
      type: { text: '{fontphyrexian}Artifact Creature — Wizard' },
      mana: { text: '{7}' },
      pt: { text: '4/3' },
      rules2: { text: '{fontphyrexian}When Arcane Proxy enters, copy target instant card.' },
      prototype: { text: '{fontphyrexian}Prototype {1}{U}{U} — 2/1 {i}(You may cast this spell with different mana cost, color, and size. It keeps its abilities and types.){/i}' },
      mana2: { text: '{1}{U}{U}' },
      pt2: { text: '2/1' },
    });
    const cardObject = {
      text: {
        title: { text: '' },
        type: { text: '' },
        mana: { text: '' },
        pt: { text: '' },
        rules2: { text: '' },
        prototype: { text: '' },
        mana2: { text: '' },
        pt2: { text: '' },
      },
    };

    applyImportedUniqueLayoutCard(cardToImport, cardObject, '{fontphyrexian}');

    assert.deepEqual(cardObject.text, {
      title: { text: '{fontphyrexian}Arcane Proxy' },
      type: { text: '{fontphyrexian}Artifact Creature — Wizard' },
      mana: { text: '{7}' },
      pt: { text: '4/3' },
      rules2: { text: '{fontphyrexian}When Arcane Proxy enters, copy target instant card.' },
      prototype: { text: '{fontphyrexian}Prototype {1}{U}{U} — 2/1 {i}(You may cast this spell with different mana cost, color, and size. It keeps its abilities and types.){/i}' },
      mana2: { text: '{1}{U}{U}' },
      pt2: { text: '2/1' },
    });
    assert.deepEqual(calls.artists, ['Card Artist']);
    assert.deepEqual(calls.uploads, [['https://example.test/prototype.jpg', 'autoFit']]);
    assert.equal(calls.fetchSetSymbol, 1);
    assert.equal(calls.textEdited, 1);
    assert.equal(domFields.get('#set-symbol-code').value, 'bro');
    assert.equal(domFields.get('#set-symbol-rarity').value, 'r');
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('class oracle parser preserves level ability extraction', async () => {
  const compatClassHelpers = await loadCreatorCompatFunctions([
    'splitClassOracleText',
    'getClassLevelCost',
    'collectClassAbilities',
    'prependClassReminderText',
    'parseClassAbilities',
  ], '{ splitClassOracleText, getClassLevelCost, collectClassAbilities, prependClassReminderText, parseClassAbilities }');
  const classHelperImplementations = [
    compatClassHelpers,
    {
      splitClassOracleText: splitClassOracleTextFromModule,
      getClassLevelCost: getClassLevelCostFromModule,
      collectClassAbilities: collectClassAbilitiesFromModule,
      prependClassReminderText: prependClassReminderTextFromModule,
      parseClassAbilities: parseClassAbilitiesFromModule,
    },
  ];

  const classText = [
    '(Gain the next level as a sorcery to add its ability.)',
    'When Ranger Class enters, create a 2/2 green Wolf creature token.',
    '{1}{G}: Level 2',
    'Whenever you attack, put a +1/+1 counter on target attacking creature.',
    '{3}{G}: Level 3',
    'You may look at the top card of your library any time.',
  ].join('\n');

  for (const {
    splitClassOracleText,
    getClassLevelCost,
    collectClassAbilities,
    prependClassReminderText,
    parseClassAbilities,
  } of classHelperImplementations) {
    assert.deepEqual(splitClassOracleText(classText), {
      reminderText: '(Gain the next level as a sorcery to add its ability.)',
      lines: [
        'When Ranger Class enters, create a 2/2 green Wolf creature token.',
        '{1}{G}: Level 2',
        'Whenever you attack, put a +1/+1 counter on target attacking creature.',
        '{3}{G}: Level 3',
        'You may look at the top card of your library any time.',
      ],
    });
    assert.equal(getClassLevelCost('{1}{G}: Level 2'), '{1}{G}:');
    assert.equal(getClassLevelCost('When Ranger Class enters, create a 2/2 green Wolf creature token.'), '');
    assert.deepEqual(collectClassAbilities([
      'When Ranger Class enters, create a 2/2 green Wolf creature token.',
      '{1}{G}: Level 2',
      'Whenever you attack, put a +1/+1 counter on target attacking creature.',
    ]), [
      {
        cost: '',
        ability: 'When Ranger Class enters, create a 2/2 green Wolf creature token.',
      },
      {
        cost: '{1}{G}:',
        ability: 'Whenever you attack, put a +1/+1 counter on target attacking creature.',
      },
    ]);
    assert.deepEqual(prependClassReminderText('Reminder.', [{ cost: '', ability: 'First ability.' }]), [
      {
        cost: '',
        ability: 'Reminder.{lns}{bar}{lns}First ability.',
      },
    ]);
    assert.deepEqual(parseClassAbilities(classText), [
      {
        cost: '',
        ability: '(Gain the next level as a sorcery to add its ability.){lns}{bar}{lns}When Ranger Class enters, create a 2/2 green Wolf creature token.',
      },
      {
        cost: '{1}{G}:',
        ability: 'Whenever you attack, put a +1/+1 counter on target attacking creature.',
      },
      {
        cost: '{3}{G}:',
        ability: 'You may look at the top card of your library any time.',
      },
    ]);
  }
});

test('class import data builder preserves level field formatting', async () => {
  const compatBuildImportedClassData = await loadCreatorCompatFunctions([
    'splitClassOracleText',
    'getClassLevelCost',
    'collectClassAbilities',
    'prependClassReminderText',
    'parseClassAbilities',
    'buildImportedClassData',
  ], 'buildImportedClassData');

  for (const buildImportedClassData of [
    compatBuildImportedClassData,
    buildImportedClassDataFromModule,
  ]) {
    assert.deepEqual(buildImportedClassData({
      flavor_text: 'A class flavor line.',
      oracle_text: [
        '(Gain the next level as a sorcery to add its ability.)',
        'When Ranger Class enters, create a 2/2 green Wolf creature token.',
        '{1}{G}: Level 2',
        'Whenever you attack, target creature (gets +1/+1).',
        '{−3}{G}: Level 3',
        'You may look at the top card of your library any time.',
      ].join('\n'),
    }), {
      flavor: 'A class flavor line.',
      levels: [
        {
          cost: '',
          levelLabel: '',
          text: '{i}(Gain the next level as a sorcery to add its ability.){/i}{lns}{bar}{lns}When Ranger Class enters, create a 2/2 green Wolf creature token.',
        },
        {
          cost: '{1}{G}:',
          levelLabel: 'Level 2',
          text: 'Whenever you attack, target creature {i}(gets +1/+1){/i}.',
        },
        {
          cost: '{-3}{G}:',
          levelLabel: 'Level 3',
          text: 'You may look at the top card of your library any time.',
        },
      ],
      class: {
        abilities: ['', '{1}{G}:', '{−3}{G}:', ''],
        count: 3,
      },
    });
  }
});

test('class import fields preserve level text field mapping', async () => {
  const compatBuildImportedClassFields = await loadCreatorCompatFunctions([
    'splitClassOracleText',
    'getClassLevelCost',
    'collectClassAbilities',
    'prependClassReminderText',
    'parseClassAbilities',
    'buildImportedClassData',
    'buildImportedClassFields',
  ], 'buildImportedClassFields');

  for (const buildImportedClassFields of [
    compatBuildImportedClassFields,
    buildImportedClassFieldsFromModule,
  ]) {
    assert.deepEqual(buildImportedClassFields({
      flavor_text: 'A class flavor line.',
      oracle_text: [
        '(Gain the next level as a sorcery to add its ability.)',
        'When Ranger Class enters, create a 2/2 green Wolf creature token.',
        '{1}{G}: Level 2',
        'Whenever you attack, target creature (gets +1/+1).',
      ].join('\n'),
    }), {
      flavor: 'A class flavor line.',
      levels: [
        {
          costField: 'level0a',
          cost: '',
          levelField: 'level0b',
          levelLabel: '',
          textField: 'level0c',
          text: '{i}(Gain the next level as a sorcery to add its ability.){/i}{lns}{bar}{lns}When Ranger Class enters, create a 2/2 green Wolf creature token.',
        },
        {
          costField: 'level1a',
          cost: '{1}{G}:',
          levelField: 'level1b',
          levelLabel: 'Level 2',
          textField: 'level1c',
          text: 'Whenever you attack, target creature {i}(gets +1/+1){/i}.',
        },
      ],
      class: {
        abilities: ['', '{1}{G}:', '', ''],
        count: 2,
      },
    });
  }
});

test('special layout parsers preserve prototype and mutate extraction', async () => {
  const compatSpecialLayoutHelpers = await loadCreatorCompatFunctions([
    'getLayoutIdentityFields',
    'getLayoutCardBase',
    'getRulesAfterFirstLine',
    'hasLayoutOracleText',
    'parsePrototypeText',
    'formatPrototypeReminderText',
    'buildPrototypeLayoutData',
    'parsePrototypeLayout',
    'parseMutateText',
    'formatMutateReminderText',
    'buildMutateLayoutData',
    'parseMutateLayout',
  ], '{ parsePrototypeText, formatPrototypeReminderText, buildPrototypeLayoutData, parsePrototypeLayout, parseMutateText, formatMutateReminderText, buildMutateLayoutData, parseMutateLayout }');
  const specialLayoutHelperImplementations = [
    compatSpecialLayoutHelpers,
    {
      parsePrototypeText: parsePrototypeTextFromModule,
      formatPrototypeReminderText: formatPrototypeReminderTextFromModule,
      buildPrototypeLayoutData: buildPrototypeLayoutDataFromModule,
      parsePrototypeLayout: parsePrototypeLayoutFromModule,
      parseMutateText: parseMutateTextFromModule,
      formatMutateReminderText: formatMutateReminderTextFromModule,
      buildMutateLayoutData: buildMutateLayoutDataFromModule,
      parseMutateLayout: parseMutateLayoutFromModule,
    },
  ];

  const prototypeText = 'Prototype {1}{U}{U} — 2/1 (You may cast this spell with different mana cost, color, and size. It keeps its abilities and types.)\nWhen Arcane Proxy enters, if you cast it, exile target instant or sorcery card with mana value less than or equal to Arcane Proxy\'s power from your graveyard. Copy that card.';
  const prototypeCard = {
    layout: 'prototype',
    name: 'Arcane Proxy',
    type_line: 'Artifact Creature — Wizard',
    mana_cost: '{7}',
    power: '4',
    toughness: '3',
    oracle_text: prototypeText,
  };
  const prototypeData = {
    cost: '{1}{U}{U}',
    power: '2',
    toughness: '1',
    pt: '2/1',
    reminder: 'You may cast this spell with different mana cost, color, and size. It keeps its abilities and types.',
  };
  const expectedPrototypeLayout = {
    layout: 'prototype',
    name: 'Arcane Proxy',
    type: 'Artifact Creature — Wizard',
    mana: '{7}',
    basePT: '4/3',
    rules: 'When Arcane Proxy enters, if you cast it, exile target instant or sorcery card with mana value less than or equal to Arcane Proxy\'s power from your graveyard. Copy that card.',
    prototype: {
      cost: '{1}{U}{U}',
      pt: '2/1',
      reminderText: 'Prototype {1}{U}{U} — 2/1 {i}(You may cast this spell with different mana cost, color, and size. It keeps its abilities and types.){/i}',
    },
  };

  const mutateText = 'Mutate {2}{G} (If you cast this spell for its mutate cost, put it over or under target non-Human creature you own.)\nWhenever this creature mutates, search your library for a basic land card, put it onto the battlefield tapped, then shuffle.';
  const mutateCard = {
    layout: 'mutate',
    name: 'Migratory Greathorn',
    type_line: 'Creature — Beast',
    mana_cost: '{3}{G}',
    power: '3',
    toughness: '4',
    oracle_text: mutateText,
  };
  const mutateData = {
    cost: '{2}{G}',
    reminder: 'If you cast this spell for its mutate cost, put it over or under target non-Human creature you own.',
  };
  const expectedMutateLayout = {
    layout: 'mutate',
    name: 'Migratory Greathorn',
    type: 'Creature — Beast',
    mana: '{3}{G}',
    basePT: '3/4',
    rules: 'Whenever this creature mutates, search your library for a basic land card, put it onto the battlefield tapped, then shuffle.',
    mutate: {
      cost: '{2}{G}',
      reminderText: 'Mutate {2}{G} {i}(If you cast this spell for its mutate cost, put it over or under target non-Human creature you own.){/i}',
    },
  };

  for (const {
    parsePrototypeText,
    formatPrototypeReminderText,
    buildPrototypeLayoutData,
    parsePrototypeLayout,
    parseMutateText,
    formatMutateReminderText,
    buildMutateLayoutData,
    parseMutateLayout,
  } of specialLayoutHelperImplementations) {
    assert.deepEqual(parsePrototypeText(prototypeText), prototypeData);
    assert.equal(formatPrototypeReminderText(prototypeData), 'Prototype {1}{U}{U} — 2/1 {i}(You may cast this spell with different mana cost, color, and size. It keeps its abilities and types.){/i}');
    assert.deepEqual(buildPrototypeLayoutData(prototypeCard, prototypeData), expectedPrototypeLayout);
    assert.deepEqual(parsePrototypeLayout(prototypeCard), expectedPrototypeLayout);
    assert.deepEqual(parseMutateText(mutateText), mutateData);
    assert.equal(formatMutateReminderText(mutateData), 'Mutate {2}{G} {i}(If you cast this spell for its mutate cost, put it over or under target non-Human creature you own.){/i}');
    assert.deepEqual(buildMutateLayoutData(mutateCard, mutateData), expectedMutateLayout);
    assert.deepEqual(parseMutateLayout(mutateCard), expectedMutateLayout);
  }
});

test('leveler parser preserves level ranges and base card fields', async () => {
  const compatLevelerHelpers = await loadCreatorCompatFunctions([
    'getLayoutIdentityFields',
    'getLayoutCardBase',
    'collectLevelSections',
    'buildLevelData',
    'getLevelerOracleLines',
    'parseLevelUpLine',
    'formatLevelUpText',
    'buildLevelerData',
    'hasLayoutOracleText',
    'parseLevelerCard',
  ], '{ getLevelerOracleLines, parseLevelUpLine, formatLevelUpText, collectLevelSections, buildLevelData, buildLevelerData, parseLevelerCard }');
  const levelerHelperImplementations = [
    compatLevelerHelpers,
    {
      getLevelerOracleLines: getLevelerOracleLinesFromModule,
      parseLevelUpLine: parseLevelUpLineFromModule,
      formatLevelUpText: formatLevelUpTextFromModule,
      collectLevelSections: collectLevelSectionsFromModule,
      buildLevelData: buildLevelDataFromModule,
      buildLevelerData: buildLevelerDataFromModule,
      parseLevelerCard: parseLevelerCardFromModule,
    },
  ];

  const levelerText = [
    'Level up {W} ({W}: Put a level counter on this. Level up only as a sorcery.)',
    'LEVEL 2-6',
    'First strike',
    '3/3',
    'LEVEL 7+',
    'Double strike',
    '4/4',
  ].join('\n');
  const levelerCard = {
    layout: 'leveler',
    name: 'Student of Warfare',
    type_line: 'Creature — Human Knight',
    mana_cost: '{W}',
    power: '1',
    toughness: '1',
    oracle_text: levelerText,
  };
  const expectedLevelerData = {
    layout: 'leveler',
    name: 'Student of Warfare',
    type: 'Creature — Human Knight',
    mana: '{W}',
    basePT: '1/1',
    levelUpCost: '{W}',
    levelUpText: 'Level up {W} {i}({W}: Put a level counter on this. Level up only as a sorcery.){/i}',
    levels: [
      {
        range: '2-6',
        pt: '3/3',
        abilities: ['First strike'],
        rulesText: 'First strike',
      },
      {
        range: '7+',
        pt: '4/4',
        abilities: ['Double strike'],
        rulesText: 'Double strike',
      },
    ],
  };

  for (const {
    getLevelerOracleLines,
    parseLevelUpLine,
    formatLevelUpText,
    collectLevelSections,
    buildLevelData,
    buildLevelerData,
    parseLevelerCard,
  } of levelerHelperImplementations) {
    const levelerLines = getLevelerOracleLines(levelerText);
    const levelSections = collectLevelSections(levelerLines);
    assert.deepEqual(levelerLines, [
      'Level up {W} ({W}: Put a level counter on this. Level up only as a sorcery.)',
      'LEVEL 2-6',
      'First strike',
      '3/3',
      'LEVEL 7+',
      'Double strike',
      '4/4',
    ]);
    assert.deepEqual(parseLevelUpLine(levelerLines[0]), {
      cost: '{W}',
      reminder: '{W}: Put a level counter on this. Level up only as a sorcery.',
    });
    assert.equal(formatLevelUpText({
      cost: '{W}',
      reminder: '{W}: Put a level counter on this. Level up only as a sorcery.',
    }), 'Level up {W} {i}({W}: Put a level counter on this. Level up only as a sorcery.){/i}');
    assert.deepEqual(levelSections, [
      {
        levelRange: '2-6',
        content: ['First strike', '3/3'],
      },
      {
        levelRange: '7+',
        content: ['Double strike', '4/4'],
      },
    ]);
    assert.deepEqual(buildLevelData(levelSections[0]), {
      range: '2-6',
      pt: '3/3',
      abilities: ['First strike'],
      rulesText: 'First strike',
    });
    assert.deepEqual(buildLevelerData(levelerCard, levelerLines), expectedLevelerData);
    assert.deepEqual(parseLevelerCard(levelerCard), expectedLevelerData);
  }
});

test('vanguard parser preserves identity and modifier fields', async () => {
  const compatParseVanguardLayout = await loadCreatorCompatFunctions([
    'getLayoutIdentityFields',
    'hasLayoutOracleText',
    'parseVanguardLayout',
  ], 'parseVanguardLayout');

  for (const parseVanguardLayout of [
    compatParseVanguardLayout,
    parseVanguardLayoutFromModule,
  ]) {
    assert.deepEqual(parseVanguardLayout({
      layout: 'vanguard',
      name: 'Serra',
      type_line: 'Vanguard',
      oracle_text: 'Creatures you control get +0/+2.',
      flavor_text: 'Her grace shields the faithful.',
      hand_modifier: '+1',
      life_modifier: '+7',
    }), {
      layout: 'vanguard',
      name: 'Serra',
      type: 'Vanguard',
      rules: 'Creatures you control get +0/+2.',
      flavor: 'Her grace shields the faithful.',
      handModifier: '+1',
      lifeModifier: '+7',
    });
  }
});

test('station parser preserves reminder formatting and ability extraction', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'formatStationReminderText',
    'isStationOracleText',
    'getStationAbilityPattern',
    'parseStationAbilities',
    'getStationPreText',
    'formatStationPreText',
    'splitStationPreText',
    'buildStationPlacementData',
    'parseStationCard',
  ], '{ formatStationReminderText, isStationOracleText, getStationAbilityPattern, parseStationAbilities, getStationPreText, formatStationPreText, parseStationCard, splitStationPreText, buildStationPlacementData }');

  for (const {
    formatStationReminderText,
    isStationOracleText,
    getStationAbilityPattern,
    parseStationAbilities,
    getStationPreText,
    formatStationPreText,
    parseStationCard,
    splitStationPreText,
    buildStationPlacementData,
  } of [
    compatHelpers,
    {
      formatStationReminderText: formatStationReminderTextFromModule,
      isStationOracleText: isStationOracleTextFromModule,
      getStationAbilityPattern: getStationAbilityPatternFromModule,
      parseStationAbilities: parseStationAbilitiesFromModule,
      getStationPreText: getStationPreTextFromModule,
      formatStationPreText: formatStationPreTextFromModule,
      parseStationCard: parseStationCardFromModule,
      splitStationPreText: splitStationPreTextFromModule,
      buildStationPlacementData: buildStationPlacementDataFromModule,
    },
  ]) {
    assert.equal(parseStationCard('This has no station text.'), null);
    const stationText = [
      'Station (Tap another creature you control: Put charge counters on this Spacecraft equal to its power. Station only as a sorcery.)',
      'STATION 6+',
      '6+ | This Spacecraft becomes an artifact creature.',
      'STATION 12+',
      '12+ | Whenever this Spacecraft attacks, draw two cards.',
    ].join('\n');

    assert.equal(formatStationReminderText('Station (Tap another creature you control.)'), 'Station {i}(Tap another creature you control.){/i}');
    assert.equal(isStationOracleText('This has no station text.'), false);
    assert.equal(isStationOracleText(stationText), true);
    assert.deepEqual([...stationText.matchAll(getStationAbilityPattern())].map(match => [match[1], match[2]]), [
      ['6+', 'This Spacecraft becomes an artifact creature.'],
      ['12+', 'Whenever this Spacecraft attacks, draw two cards.'],
    ]);
    assert.deepEqual(parseStationAbilities(stationText), [
      {
        number: '6+',
        text: 'This Spacecraft becomes an artifact creature.',
      },
      {
        number: '12+',
        text: 'Whenever this Spacecraft attacks, draw two cards.',
      },
    ]);
    assert.equal(getStationPreText(stationText), 'Station (Tap another creature you control: Put charge counters on this Spacecraft equal to its power. Station only as a sorcery.)');
    assert.equal(formatStationPreText(stationText), 'Station {i}(Tap another creature you control: Put charge counters on this Spacecraft equal to its power. Station only as a sorcery.){/i}');
    assert.deepEqual(splitStationPreText(''), { preText: '', reminderText: '' });
    assert.deepEqual(splitStationPreText('Before launch.\nStation (Tap another creature you control.)'), {
      preText: 'Before launch.',
      reminderText: 'Station {i}(Tap another creature you control.){/i}',
    });
    assert.deepEqual(splitStationPreText('Station {i}(Already formatted.){/i}'), {
      preText: '',
      reminderText: 'Station {i}(Already formatted.){/i}',
    });
    assert.deepEqual(parseStationCard(stationText), {
      preStationText: 'Station {i}(Tap another creature you control: Put charge counters on this Spacecraft equal to its power. Station only as a sorcery.){/i}',
      stationAbilities: [
        {
          number: '6+',
          text: 'This Spacecraft becomes an artifact creature.',
        },
        {
          number: '12+',
          text: 'Whenever this Spacecraft attacks, draw two cards.',
        },
      ],
    });
    assert.deepEqual(buildStationPlacementData({
      preStationText: 'Station {i}(Tap another creature you control.){/i}',
      stationAbilities: [{ number: '6+', text: 'This Spacecraft becomes an artifact creature.' }],
    }), {
      abilityTexts: [
        '',
        'Station {i}(Tap another creature you control.){/i}',
        'This Spacecraft becomes an artifact creature.',
      ],
      badges: [null, '6+'],
      hasPreText: false,
      shouldDisableFirstSquare: true,
    });
    assert.deepEqual(buildStationPlacementData({
      preStationText: 'Crew arrives.\nStation {i}(Tap another creature you control.){/i}',
      stationAbilities: [
        { number: '6+', text: 'This Spacecraft becomes an artifact creature.' },
        { number: '12+', text: 'Whenever this Spacecraft attacks, draw two cards.' },
      ],
    }), {
      abilityTexts: [
        'Crew arrives.\nStation {i}(Tap another creature you control.){/i}',
        'This Spacecraft becomes an artifact creature.',
        'Whenever this Spacecraft attacks, draw two cards.',
      ],
      badges: ['6+', '12+'],
      hasPreText: true,
      shouldDisableFirstSquare: false,
    });
    assert.equal(buildStationPlacementData({
      preStationText: 'Station {i}(Tap another creature you control.){/i}',
      stationAbilities: [],
    }), null);
  }
});

test('station importer applies text fields and scheduled station settings', async () => {
  const originals = {
    curlyQuotes: globalThis.curlyQuotes,
    document: globalThis.document,
    setTimeout: globalThis.setTimeout,
    stationEdited: globalThis.stationEdited,
    textEdited: globalThis.textEdited,
  };
  const domFields = new Map([
    ['#station-disable-first-ability', { checked: false }],
    ['#station-square-y', { value: '' }],
    ['#station-square-height-1', { value: '' }],
    ['#station-badge-value-1', { value: 'old-1' }],
    ['#station-badge-value-2', { value: 'old-2' }],
  ]);
  const calls = {
    delays: [],
    stationEdited: 0,
    textEdited: 0,
  };

  globalThis.curlyQuotes = (text) => `curly:${text}`;
  globalThis.document = {
    querySelector(selector) {
      const field = domFields.get(selector);
      assert.ok(field, `unexpected selector ${selector}`);
      return field;
    },
  };
  globalThis.setTimeout = (callback, delay) => {
    calls.delays.push(delay);
    callback();
    return 0;
  };
  globalThis.stationEdited = () => {
    calls.stationEdited += 1;
  };
  globalThis.textEdited = () => {
    calls.textEdited += 1;
  };

  try {
    const applyImportedStationCard = await loadCreatorFunctionsWithCompat([
      'clearImportedStationFields',
      'applyImportedStationBasicFields',
      'applyImportedStationAbilityFields',
      'scheduleImportedStationSettings',
      'applyImportedStationCard',
    ], 'applyImportedStationCard');
    const cardObject = {
      version: 'station-special',
      text: {
        title: { text: '' },
        type: { text: '' },
        mana: { text: '' },
        pt: { text: '' },
        ability0: { text: 'old ability 0' },
        ability1: { text: 'old ability 1' },
        ability2: { text: 'old ability 2' },
      },
      station: {
        badgeValues: { 1: 'old-1', 2: 'old-2' },
        disableFirstAbility: false,
        importSettings: {
          singleAbility: {
            yOffset: 100,
            height1: 200,
          },
          versionOverrides: {
            'station-special': {
              yOffset: 135,
              height1: 246,
            },
          },
        },
        squares: {
          1: {
            y: 0,
            height: 0,
          },
        },
      },
    };

    applyImportedStationCard({
      printed_name: 'Launch Platform',
      name: 'Launch Platform',
      type_line: 'Artifact — Spacecraft',
      mana_cost: '{3}',
      power: '2',
      toughness: '4',
      oracle_text: [
        'Station (Tap another creature you control: Put charge counters on this Spacecraft equal to its power. Station only as a sorcery.)',
        'STATION 6+',
        '6+ | This Spacecraft becomes an artifact creature.',
      ].join('\n'),
    }, cardObject, '{fontphyrexian}');

    assert.deepEqual(cardObject.text, {
      title: { text: '{fontphyrexian}curly:Launch Platform' },
      type: { text: '{fontphyrexian}Artifact — Spacecraft' },
      mana: { text: '{fontphyrexian}{3}' },
      pt: { text: '{fontphyrexian}2/4' },
      ability0: { text: '' },
      ability1: { text: '{fontphyrexian}Station {i}(Tap another creature you control: Put charge counters on this Spacecraft equal to its power. Station only as a sorcery.){/i}' },
      ability2: { text: '{fontphyrexian}This Spacecraft becomes an artifact creature.' },
    });
    assert.deepEqual(calls.delays, [100, 50]);
    assert.equal(calls.textEdited, 1);
    assert.equal(calls.stationEdited, 1);
    assert.equal(domFields.get('#station-disable-first-ability').checked, true);
    assert.equal(domFields.get('#station-square-y').value, 135);
    assert.equal(domFields.get('#station-square-height-1').value, 246);
    assert.equal(domFields.get('#station-badge-value-1').value, '');
    assert.equal(domFields.get('#station-badge-value-2').value, '6+');
    assert.deepEqual(cardObject.station.badgeValues, { 1: '', 2: '6+' });
    assert.equal(cardObject.station.disableFirstAbility, true);
    assert.equal(cardObject.station.squares[1].y, 211);
    assert.equal(cardObject.station.squares[1].height, 246);
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});

test('roll parser preserves d20 ability tag conversion', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'formatRollAbilityLine',
    'isRollAbilityText',
    'getRollOutcomeLines',
    'replaceRollOutcomeLines',
    'parseRollAbilities',
  ], '{ formatRollAbilityLine, isRollAbilityText, getRollOutcomeLines, replaceRollOutcomeLines, parseRollAbilities }');
  const moduleHelpers = {
    formatRollAbilityLine: formatRollAbilityLineFromModule,
    isRollAbilityText: isRollAbilityTextFromModule,
    getRollOutcomeLines: getRollOutcomeLinesFromModule,
    replaceRollOutcomeLines: replaceRollOutcomeLinesFromModule,
    parseRollAbilities: parseRollAbilitiesFromModule,
  };

  const rollText = [
    'Roll a d20.',
    '1—9 | Create a Treasure token.',
    '10—19 | Create two Treasure tokens.',
    '20 | Create three Treasure tokens.',
  ].join('\n');

  for (const {
    formatRollAbilityLine,
    isRollAbilityText,
    getRollOutcomeLines,
    replaceRollOutcomeLines,
    parseRollAbilities,
  } of [compatHelpers, moduleHelpers]) {
    assert.equal(formatRollAbilityLine('1—9 | Create a Treasure token.'), '{roll1—9} Create a Treasure token.');
    assert.equal(formatRollAbilityLine('Draw a card.'), null);
    assert.equal(isRollAbilityText('Draw a card.'), false);
    assert.equal(isRollAbilityText(rollText), true);
    assert.deepEqual(getRollOutcomeLines(rollText), [
      '1—9 | Create a Treasure token.',
      '10—19 | Create two Treasure tokens.',
      '20 | Create three Treasure tokens.',
    ]);
    assert.equal(replaceRollOutcomeLines(rollText), [
      'Roll a d20.',
      '{roll1—9} Create a Treasure token.',
      '{roll10—19} Create two Treasure tokens.',
      '{roll20} Create three Treasure tokens.',
    ].join('\n'));
    assert.equal(parseRollAbilities('Draw a card.'), null);
    assert.equal(parseRollAbilities(rollText), [
      'Roll a d20.',
      '{roll1—9} Create a Treasure token.',
      '{roll10—19} Create two Treasure tokens.',
      '{roll20} Create three Treasure tokens.',
    ].join('\n'));
  }
});

test('import rules text formatter preserves oracle text conversions', async () => {
  const compatHelpers = await loadCreatorCompatFunctions([
    'getImportedRulesItalicExemptions',
    'formatImportedRulesText',
  ], '{ getImportedRulesItalicExemptions, formatImportedRulesText }');
  const moduleHelpers = {
    getImportedRulesItalicExemptions: getImportedRulesItalicExemptionsFromModule,
    formatImportedRulesText: formatImportedRulesTextFromModule,
  };

  const previousCurlyQuotes = globalThis.curlyQuotes;
  globalThis.curlyQuotes = (input) => input;
  try {
    for (const {
      getImportedRulesItalicExemptions,
      formatImportedRulesText,
    } of [compatHelpers, moduleHelpers]) {
      assert.equal(getImportedRulesItalicExemptions().includes('Companion'), true);
      assert.equal(formatImportedRulesText({}), '');
      assert.equal(formatImportedRulesText({
        oracle_text: [
          'Choose one — Draw a card.',
          '[−2]: Create a token.',
          '{Q}: Untap this.',
          '• First mode.',
        ].join('\n'),
      }), [
        '{i}Choose one{/i} — Draw a card.',
        '{-2}: Create a token.',
        '{untap}: Untap this.',
        '• {indent}First mode.',
      ].join('\n'));
      assert.equal(formatImportedRulesText({
        oracle_text: '+ {1} — Draw a card.',
        keywords: ['Spree'],
      }), '+ {1} — Draw a card.');
      assert.equal(formatImportedRulesText({
        oracle_text: 'Cleave [−2] from the text.',
        keywords: ['Cleave'],
      }), 'Cleave [−2] from the text.');
      assert.equal(formatImportedRulesText({
        oracle_text: [
          'Roll a d20.',
          '1—9 | Create a Treasure token.',
        ].join('\n'),
      }), [
        'Roll a d20.',
        '{roll1—9} Create a Treasure token.',
      ].join('\n'));
    }
  } finally {
    if (previousCurlyQuotes === undefined) {
      delete globalThis.curlyQuotes;
    } else {
      globalThis.curlyQuotes = previousCurlyQuotes;
    }
  }
});

test('pokemon import rules fields preserve type-specific destinations and stat labels', async () => {
  const compatBuildImportedPokemonRulesFields = await loadCreatorCompatFunctions([
    'buildImportedPokemonRulesFields',
  ], 'buildImportedPokemonRulesFields');

  for (const buildImportedPokemonRulesFields of [
    compatBuildImportedPokemonRulesFields,
    buildImportedPokemonRulesFieldsFromModule,
  ]) {
    assert.deepEqual(buildImportedPokemonRulesFields({
      type_line: 'Creature — Wizard',
    }, 'Flying', '{fontphyrexian}'), {
      rules: '{fontphyrexian}Flying',
      rulesnoncreature: '',
      middleStatTitle: 'power',
      rightStatTitle: 'toughness',
    });
    assert.deepEqual(buildImportedPokemonRulesFields({
      type_line: 'Planeswalker — Jace',
      loyalty: '5',
    }, 'Draw a card.', ''), {
      rules: 'Draw a card.',
      rulesnoncreature: '',
      pt: '{5',
      middleStatTitle: '',
      rightStatTitle: 'loyalty',
    });
    assert.deepEqual(buildImportedPokemonRulesFields({
      type_line: 'Battle — Siege',
      defense: '7',
    }, 'Protect it.', ''), {
      rules: 'Protect it.',
      rulesnoncreature: '',
      pt: '{7',
      middleStatTitle: '',
      rightStatTitle: 'defense',
    });
    assert.deepEqual(buildImportedPokemonRulesFields({
      type_line: 'Artifact',
    }, 'Tap: Add {C}.', '{fontCStext}'), {
      rules: '',
      rulesnoncreature: '{fontCStext}Tap: Add {C}.',
      middleStatTitle: '',
      rightStatTitle: '',
    });
  }
});

test('import flavor text formatter preserves legacy marker conversions', async () => {
  const compatFormatImportedFlavorText = await loadCreatorCompatFunctions([
    'formatImportedFlavorText',
  ], 'formatImportedFlavorText');

  for (const formatImportedFlavorText of [
    compatFormatImportedFlavorText,
    formatImportedFlavorTextFromModule,
  ]) {
    assert.equal(formatImportedFlavorText(''), '');
    assert.equal(formatImportedFlavorText('*Bold* "Quote"\nNext'), '{/i}Bold{i} “Quote”{lns}Next');
    assert.equal(formatImportedFlavorText('"Only quoted"'), '“Only quoted”');
    assert.equal(formatImportedFlavorText('Line one\nLine two\nLine three'), 'Line one{lns}Line two\nLine three');
  }
});

test('import flavor appenders preserve regular and pokemon destinations', async () => {
  const originalCurlyQuotes = globalThis.curlyQuotes;
  globalThis.curlyQuotes = (text) => `curly:${text}`;
  try {
    const compatHelpers = await loadCreatorCompatFunctions([
      'buildImportedRulesFlavorText',
      'buildImportedPokemonFlavorFields',
    ], '{ buildImportedRulesFlavorText, buildImportedPokemonFlavorFields }');
    const moduleHelpers = {
      buildImportedRulesFlavorText: buildImportedRulesFlavorTextFromModule,
      buildImportedPokemonFlavorFields: buildImportedPokemonFlavorFieldsFromModule,
    };

    for (const {
      buildImportedRulesFlavorText,
      buildImportedPokemonFlavorFields,
    } of [compatHelpers, moduleHelpers]) {
      assert.equal(buildImportedRulesFlavorText('A line.', 'en'), '{flavor}curly:A line.');
      assert.equal(buildImportedRulesFlavorText('A line.', 'zhs'), '{flavor}{fontCSflavor}curly:A line.');
      assert.deepEqual(buildImportedPokemonFlavorFields('Creature — Wizard', 'A line.'), {
        rules: '{flavor}curly:A line.',
        rulesnoncreature: '',
      });
      assert.deepEqual(buildImportedPokemonFlavorFields('Artifact', 'A line.'), {
        rules: '{flavor}',
        rulesnoncreature: 'curly:A line.',
      });
    }
  } finally {
    globalThis.curlyQuotes = originalCurlyQuotes;
  }
});

test('import rules text fields preserve regular and pokemon flavor composition', async () => {
  const originalCurlyQuotes = globalThis.curlyQuotes;
  globalThis.curlyQuotes = (text) => `curly:${text}`;
  try {
    const compatBuildImportedRulesTextFields = await loadCreatorCompatFunctions([
      'buildImportedRulesTextFields',
    ], 'buildImportedRulesTextFields');

    for (const buildImportedRulesTextFields of [
      compatBuildImportedRulesTextFields,
      buildImportedRulesTextFieldsFromModule,
    ]) {
      assert.deepEqual(buildImportedRulesTextFields({
        type_line: 'Instant',
      }, 'm15', 'Draw a card.', '{fontphyrexian}'), {
        rules: '{fontphyrexian}Draw a card.',
      });
      assert.deepEqual(buildImportedRulesTextFields({
        type_line: 'Instant',
        flavor_text: 'A line.',
        lang: 'zhs',
      }, 'm15', 'Draw a card.', '{fontCStext}'), {
        rules: '{fontCStext}Draw a card.{flavor}{fontCSflavor}curly:A line.',
      });
      assert.deepEqual(buildImportedRulesTextFields({
        type_line: 'Creature — Wizard',
        flavor_text: 'A line.',
      }, 'pokemon', 'Flying', ''), {
        rules: 'Flying{flavor}curly:A line.',
        rulesnoncreature: '',
        middleStatTitle: 'power',
        rightStatTitle: 'toughness',
      });
      assert.deepEqual(buildImportedRulesTextFields({
        type_line: 'Artifact',
        flavor_text: 'A line.',
      }, 'pokemon', 'Tap: Add {C}.', ''), {
        rules: '{flavor}',
        rulesnoncreature: 'Tap: Add {C}.curly:A line.',
        middleStatTitle: '',
        rightStatTitle: '',
      });
    }
  } finally {
    globalThis.curlyQuotes = originalCurlyQuotes;
  }
});

test('case import rules text preserves bar-separated line breaks', async () => {
  const compatBuildImportedCaseRulesText = await loadCreatorCompatFunctions([
    'buildImportedCaseRulesText',
  ], 'buildImportedCaseRulesText');

  for (const buildImportedCaseRulesText of [
    compatBuildImportedCaseRulesText,
    buildImportedCaseRulesTextFromModule,
  ]) {
    assert.equal(
      buildImportedCaseRulesText('Line one\nLine two\r\nLine three', '{fontphyrexian}'),
      '{fontphyrexian}Line one//{bar}//Line two//{bar}//Line three',
    );
  }
});

test('import power/toughness fields preserve legacy version formatting', async () => {
  const compatBuildImportedPtFields = await loadCreatorCompatFunctions([
    'normalizeImportedPtText',
    'buildImportedPtFields',
  ], 'buildImportedPtFields');

  for (const buildImportedPtFields of [
    compatBuildImportedPtFields,
    buildImportedPtFieldsFromModule,
  ]) {
    assert.deepEqual(buildImportedPtFields({ power: '2', toughness: '3' }, 'm15'), { pt: '2/3' });
    assert.deepEqual(buildImportedPtFields({ power: '2', toughness: '3' }, 'invocation'), { pt: '2\n3' });
    assert.deepEqual(buildImportedPtFields({ power: '2', toughness: '3' }, 'pokemon'), {
      middleStat: '{2}',
      pt: '{3}',
    });
    assert.deepEqual(buildImportedPtFields({}, 'm15'), { pt: '' });
    assert.deepEqual(buildImportedPtFields({}, 'invocation'), { pt: '' });
    assert.deepEqual(buildImportedPtFields({}, 'pokemon'), {
      middleStat: '',
      pt: '',
    });
    assert.deepEqual(buildImportedPtFields({ toughness: '3' }, 'm15'), { pt: 'undefined/3' });
  }
  assert.equal(normalizeImportedPtTextFromModule('2/3'), '2/3');
});

test('planeswalker import parser preserves loyalty ability formatting', async () => {
  const compatBuildImportedPlaneswalkerAbilities = await loadCreatorCompatFunctions([
    'formatImportedLoyaltyAbilityLine',
    'collapseImportedPlaneswalkerAbilityLines',
    'buildImportedPlaneswalkerAbilities',
  ], 'buildImportedPlaneswalkerAbilities');

  for (const buildImportedPlaneswalkerAbilities of [
    compatBuildImportedPlaneswalkerAbilities,
    buildImportedPlaneswalkerAbilitiesFromModule,
  ]) {
    assert.deepEqual(buildImportedPlaneswalkerAbilities([
      '[+1]: Draw a card.',
      '[−2]: Target creature (gains flying).',
      'This line has no cost.',
      '[-7]: You get an emblem.',
      '[+0]: Scry 1.',
    ].join('\n')), [
      {
        cost: '{+1}',
        text: 'Draw a card.',
      },
      {
        cost: '{-2}',
        text: 'Target creature {i}(gains flying){/i}.',
      },
      {
        cost: '',
        text: 'This line has no cost.',
      },
      {
        cost: '{-7}',
        text: 'You get an emblem.\n{+0}: Scry 1.',
      },
    ]);
  }
  assert.equal(formatImportedLoyaltyAbilityLineFromModule('[−2]'), '{-2}');
  assert.deepEqual(collapseImportedPlaneswalkerAbilityLinesFromModule(['a', 'b', 'c', 'd', 'e']), [
    'a',
    'b',
    'c',
    'd\ne',
  ]);
});

test('planeswalker import ability height preserves frame-specific scale', async () => {
  const originalScaleHeight = globalThis.scaleHeight;
  globalThis.scaleHeight = (scale) => scale * 1000;
  try {
    const compatGetImportedPlaneswalkerAbilityHeight = await loadCreatorCompatFunctions([
      'getImportedPlaneswalkerAbilityHeight',
    ], 'getImportedPlaneswalkerAbilityHeight');

    for (const getImportedPlaneswalkerAbilityHeight of [
      compatGetImportedPlaneswalkerAbilityHeight,
      getImportedPlaneswalkerAbilityHeightFromModule,
    ]) {
      assert.equal(getImportedPlaneswalkerAbilityHeight('planeswalkerTall', 3), 119);
      assert.equal(getImportedPlaneswalkerAbilityHeight('planeswalkerCompleated', 4), 89);
      assert.equal(getImportedPlaneswalkerAbilityHeight('planeswalker', 2), 146);
    }
  } finally {
    globalThis.scaleHeight = originalScaleHeight;
  }
});

test('planeswalker import fields preserve loyalty, row data, and missing-cost behavior', async () => {
  const originalScaleHeight = globalThis.scaleHeight;
  globalThis.scaleHeight = (scale) => scale * 1000;
  try {
    const compatBuildImportedPlaneswalkerFields = await loadCreatorCompatFunctions([
      'formatImportedLoyaltyAbilityLine',
      'collapseImportedPlaneswalkerAbilityLines',
      'buildImportedPlaneswalkerAbilities',
      'getImportedPlaneswalkerAbilityHeight',
      'buildImportedPlaneswalkerFields',
    ], 'buildImportedPlaneswalkerFields');

    for (const buildImportedPlaneswalkerFields of [
      compatBuildImportedPlaneswalkerFields,
      buildImportedPlaneswalkerFieldsFromModule,
    ]) {
      assert.deepEqual(buildImportedPlaneswalkerFields({
        loyalty: '5',
        oracle_text: [
          '[+1]: Draw a card.',
          '[−2]: Target creature (gains flying).',
        ].join('\n'),
      }, 'planeswalkerTall'), {
        loyalty: '5',
        abilities: [
          { text: 'Draw a card.', cost: '{+1}', height: 179 },
          { text: 'Target creature {i}(gains flying){/i}.', cost: '{-2}', height: 179 },
          { text: '', height: 0 },
          { text: '', height: 0 },
        ],
      });
    }
  } finally {
    globalThis.scaleHeight = originalScaleHeight;
  }
});

test('saga import data builder preserves rules and step metadata', async () => {
  const compatSagaHelpers = await loadCreatorCompatFunctions([
    'stripSagaReminderText',
    'getSagaAbilityPattern',
    'buildSagaStepAbilityMap',
    'getSagaLoreStepOrder',
    'collectSagaAbilitiesInOrder',
    'parseSagaAbilities',
    'extractSagaReminderText',
    'formatImportedAbilityText',
    'buildImportedSagaData',
  ], '{ stripSagaReminderText, buildSagaStepAbilityMap, getSagaLoreStepOrder, collectSagaAbilitiesInOrder, parseSagaAbilities, buildImportedSagaData }');
  const sagaHelperImplementations = [
    compatSagaHelpers,
    {
      stripSagaReminderText: stripSagaReminderTextFromModule,
      buildSagaStepAbilityMap: buildSagaStepAbilityMapFromModule,
      getSagaLoreStepOrder: getSagaLoreStepOrderFromModule,
      collectSagaAbilitiesInOrder: collectSagaAbilitiesInOrderFromModule,
      parseSagaAbilities: parseSagaAbilitiesFromModule,
      buildImportedSagaData: buildImportedSagaDataFromModule,
    },
  ];

  const previousRomanNumeral = globalThis.romanNumeral;
  globalThis.romanNumeral = (number) => [
    'I', 'II', 'III', 'IV', 'V', 'VI',
    'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
    'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII',
    'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV',
  ][number - 1];
  try {
    const sagaText = [
      '(As this Saga enters and after your draw step, add a lore counter.)',
      'I, II — Create a 1/1 token.',
      'III — Return target card (from your graveyard) to your hand.',
    ].join('\n');

    for (const {
      stripSagaReminderText,
      buildSagaStepAbilityMap,
      getSagaLoreStepOrder,
      collectSagaAbilitiesInOrder,
      parseSagaAbilities,
      buildImportedSagaData,
    } of sagaHelperImplementations) {
      assert.equal(stripSagaReminderText(sagaText), [
        'I, II — Create a 1/1 token.',
        'III — Return target card (from your graveyard) to your hand.',
      ].join('\n'));
      assert.deepEqual(buildSagaStepAbilityMap(sagaText), {
        I: 'Create a 1/1 token.',
        II: 'Create a 1/1 token.',
        III: 'Return target card (from your graveyard) to your hand.',
      });
      assert.deepEqual(getSagaLoreStepOrder(4), ['I', 'II', 'III', 'IV']);
      assert.deepEqual(collectSagaAbilitiesInOrder({
        III: 'Third ability.',
        I: 'First ability.',
        II: 'First ability.',
      }, ['I', 'II', 'III']), [
        { ability: 'First ability.', steps: 2 },
        { ability: 'Third ability.', steps: 1 },
      ]);
      assert.deepEqual(parseSagaAbilities(sagaText), [
        { ability: 'Create a 1/1 token.', steps: 2 },
        { ability: 'Return target card (from your graveyard) to your hand.', steps: 1 },
      ]);

      assert.deepEqual(buildImportedSagaData({
        oracle_text: sagaText,
        flavor_text: 'Saga flavor.',
        keywords: ['Read ahead'],
      }), {
        rules2: 'Saga flavor.\nRead ahead',
        abilityTexts: [
          'Create a 1/1 token.',
          'Return target card {i}(from your graveyard){/i} to your hand.',
        ],
        reminderText: '{i}(As this Saga enters and after your draw step, add a lore counter.){/i}',
        saga: {
          abilities: [2, 1, 0, 0],
          count: 2,
        },
      });
    }
  } finally {
    if (previousRomanNumeral === undefined) {
      delete globalThis.romanNumeral;
    } else {
      globalThis.romanNumeral = previousRomanNumeral;
    }
  }
});

test('saga import fields preserve ability text field mapping', async () => {
  const compatBuildImportedSagaFields = await loadCreatorCompatFunctions([
    'stripSagaReminderText',
    'getSagaAbilityPattern',
    'buildSagaStepAbilityMap',
    'getSagaLoreStepOrder',
    'collectSagaAbilitiesInOrder',
    'parseSagaAbilities',
    'extractSagaReminderText',
    'formatImportedAbilityText',
    'buildImportedSagaData',
    'buildImportedSagaFields',
  ], 'buildImportedSagaFields');

  const previousRomanNumeral = globalThis.romanNumeral;
  globalThis.romanNumeral = (number) => ['I', 'II', 'III', 'IV'][number - 1] || String(number);
  try {
    for (const buildImportedSagaFields of [
      compatBuildImportedSagaFields,
      buildImportedSagaFieldsFromModule,
    ]) {
      assert.deepEqual(buildImportedSagaFields({
        oracle_text: [
          '(As this Saga enters and after your draw step, add a lore counter.)',
          'I — Create a 1/1 token.',
          'II — Return target card (from your graveyard) to your hand.',
        ].join('\n'),
        flavor_text: 'Saga flavor.',
        keywords: ['Read ahead'],
      }), {
        rules2: 'Saga flavor.\nRead ahead',
        abilities: [
          { field: 'ability0', text: 'Create a 1/1 token.' },
          { field: 'ability1', text: 'Return target card {i}(from your graveyard){/i} to your hand.' },
        ],
        reminder: '{i}(As this Saga enters and after your draw step, add a lore counter.){/i}',
        saga: {
          abilities: [1, 1, 0, 0],
          count: 2,
        },
      });
    }
  } finally {
    if (previousRomanNumeral === undefined) {
      delete globalThis.romanNumeral;
    } else {
      globalThis.romanNumeral = previousRomanNumeral;
    }
  }
});

test('multi-faced parser preserves front and back face field mapping', async () => {
  const parseMultiFacedCards = await loadCreatorFunctionsWithCompat([
    'parseMultiFacedCards',
  ], 'parseMultiFacedCards');

  assert.deepEqual(buildImportedFaceDataFromModule({
    name: 'Sample Face',
    type_line: 'Creature',
    oracle_text: 'Flying',
    mana_cost: '{U}',
    power: '1',
    toughness: '2',
    flavor_text: 'Wind.',
  }), {
    name: 'Sample Face',
    type: 'Creature',
    rules: 'Flying',
    mana: '{U}',
    pt: '1/2',
    defense: '',
    flavor: 'Wind.',
  });

  assert.deepEqual(parseMultiFacedCards({
    card_faces: [
      {
        name: 'Growing Rites of Itlimoc',
        type_line: 'Legendary Enchantment',
        oracle_text: 'When Growing Rites enters, look at the top four cards of your library.',
        mana_cost: '{2}{G}',
        flavor_text: 'The jungle was alive with magic.',
      },
      {
        name: 'Itlimoc, Cradle of the Sun',
        type_line: 'Legendary Land',
        oracle_text: '{T}: Add {G}.',
        defense: '7',
      },
    ],
  }), {
    front: {
      name: 'Growing Rites of Itlimoc',
      type: 'Legendary Enchantment',
      rules: 'When Growing Rites enters, look at the top four cards of your library.',
      mana: '{2}{G}',
      pt: '',
      defense: '',
      flavor: 'The jungle was alive with magic.',
    },
    back: {
      name: 'Itlimoc, Cradle of the Sun',
      type: 'Legendary Land',
      rules: '{T}: Add {G}.',
      mana: '',
      pt: '',
      defense: '7',
      flavor: '',
    },
  });
});

test('multi-faced importer applies face text media and transform reminder fields', async () => {
  const originals = {
    artistEdited: globalThis.artistEdited,
    uploadArt: globalThis.uploadArt,
    fetchSetSymbol: globalThis.fetchSetSymbol,
    textEdited: globalThis.textEdited,
    curlyQuotes: globalThis.curlyQuotes,
    document: globalThis.document,
  };
  const domFields = new Map([
    ['#lockSetSymbolCode', { checked: false }],
    ['#lockSetSymbolURL', { checked: false }],
    ['#set-symbol-code', { value: '' }],
    ['#set-symbol-rarity', { value: '' }],
  ]);
  const calls = {
    artists: [],
    uploads: [],
    fetchSetSymbol: 0,
    textEdited: 0,
  };

  globalThis.artistEdited = (artist) => calls.artists.push(artist);
  globalThis.uploadArt = (url, mode) => calls.uploads.push([url, mode]);
  globalThis.fetchSetSymbol = () => {
    calls.fetchSetSymbol += 1;
  };
  globalThis.textEdited = () => {
    calls.textEdited += 1;
  };
  globalThis.curlyQuotes = (text) => `curly:${text}`;
  globalThis.document = {
    querySelector(selector) {
      const field = domFields.get(selector);
      assert.ok(field, `unexpected selector ${selector}`);
      return field;
    },
  };

  try {
    const applyImportedMultiFacedCard = await loadCreatorFunctionsWithCompat([
      'applyImportedSpecialLayoutMedia',
      'applyImportedSpecialLayoutSetSymbol',
      'parseMultiFacedCards',
      'applyImportedMultiFacedCard',
    ], 'applyImportedMultiFacedCard');
    const cardObject = {
      version: 'transform',
      text: {
        title: { text: '' },
        type: { text: '' },
        rules: { text: '' },
        mana: { text: '' },
        pt: { text: '' },
        title2: { text: '' },
        type2: { text: '' },
        rules2: { text: '' },
        mana2: { text: '' },
        pt2: { text: '' },
        reminder: { text: '' },
      },
    };

    assert.equal(applyImportedMultiFacedCard({
      layout: 'transform',
      type_line: 'Creature — Wizard',
      set: 'abc',
      rarity: 'rare',
      artist: 'Card Artist',
      image_uris: {
        art_crop: 'https://example.test/art.jpg',
      },
      card_faces: [
        {
          name: 'Front Face',
          type_line: 'Creature — Wizard',
          oracle_text: 'Flying',
          mana_cost: '{1}{U}',
          power: '2',
          toughness: '3',
          flavor_text: 'A first line.',
        },
        {
          name: 'Back Face',
          type_line: 'Creature — Dragon',
          oracle_text: 'Trample',
          mana_cost: '{3}{R}',
          power: '4',
          toughness: '4',
        },
      ],
    }, cardObject, '{fontphyrexian}'), true);

    assert.deepEqual(cardObject.text, {
      title: { text: '{fontphyrexian}Front Face' },
      type: { text: '{fontphyrexian}Creature — Wizard' },
      rules: { text: '{fontphyrexian}Flying{flavor}curly:A first line.' },
      mana: { text: '{1}{U}' },
      pt: { text: '2/3' },
      title2: { text: '{fontphyrexian}Back Face' },
      type2: { text: '{fontphyrexian}Creature — Dragon' },
      rules2: { text: '{fontphyrexian}Trample' },
      mana2: { text: '{3}{R}' },
      pt2: { text: '4/4' },
      reminder: { text: '4/4' },
    });
    assert.deepEqual(calls.artists, ['Card Artist']);
    assert.deepEqual(calls.uploads, [['https://example.test/art.jpg', 'autoFit']]);
    assert.equal(calls.fetchSetSymbol, 1);
    assert.equal(calls.textEdited, 1);
    assert.equal(domFields.get('#set-symbol-code').value, 'abc');
    assert.equal(domFields.get('#set-symbol-rarity').value, 'r');
  } finally {
    for (const [name, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[name];
      } else {
        globalThis[name] = value;
      }
    }
  }
});
