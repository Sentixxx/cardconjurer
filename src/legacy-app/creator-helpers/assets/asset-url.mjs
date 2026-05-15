export function getCardForgerAssetConfig(globalObject = globalThis) {
  return globalObject.CARD_FORGER_ASSETS || {};
}

export function isAbsoluteAssetUrl(input) {
  return /^(?:https?:|data:|blob:)/i.test(input);
}

export function trimAssetBase(base) {
  return (base || '').replace(/\/+$/, '');
}

export function isFrameThumbnailAsset(input) {
  return input.startsWith('/img/frames/') && input.endsWith('Thumb.png');
}

export function isFrameHiresAsset(input) {
  return input.startsWith('/img/frames/') && input.toLowerCase().endsWith('.png') && !isFrameThumbnailAsset(input);
}

export function joinAssetBase(base, input) {
  const cleanBase = trimAssetBase(base);
  return cleanBase ? cleanBase + '/' + input.replace(/^\/+/, '') : input;
}

export function getAssetBaseForInput(input, config = getCardForgerAssetConfig()) {
  if (isFrameHiresAsset(input)) {
    return config.frameHiresBase || config.assetBase || '';
  }

  if (isFrameThumbnailAsset(input)) {
    return config.frameThumbnailBase || config.assetBase || '';
  }

  if (input.startsWith('/')) {
    return config.assetBase || '';
  }

  return '';
}

export function fixUri(input, config = getCardForgerAssetConfig()) {
  const fixedInput = input.replace('+', '%2B');

  if (isAbsoluteAssetUrl(fixedInput)) {
    return fixedInput;
  }

  return joinAssetBase(getAssetBaseForInput(fixedInput, config), fixedInput);
}
