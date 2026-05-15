import { fixUri } from './asset-url.mjs';

export function isFrameAssetPreloadable(src) {
  return Boolean(src) && !src.includes('/img/blank.png') && !src.startsWith('data:');
}

export function collectFrameAssetSources(frame, resolveAssetUrl = fixUri) {
  const sources = [];

  if (frame?.src) {
    sources.push(frame.src);
  }

  if (Array.isArray(frame?.masks)) {
    frame.masks.forEach((mask) => {
      if (mask?.src) {
        sources.push(mask.src);
      }
    });
  }

  return [...new Set(sources.map((source) => resolveAssetUrl(source)).filter(isFrameAssetPreloadable))];
}
