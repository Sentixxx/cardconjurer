import type { AssetUrl } from '@/types/asset';

const imageCache = new Map<AssetUrl, Promise<HTMLImageElement>>();

const ABSOLUTE_URL_RE = /^(?:https?:|data:|blob:)/i;

export function isAbsoluteAssetUrl(input: AssetUrl): boolean {
  return ABSOLUTE_URL_RE.test(input);
}

export function trimAssetBase(base: string): string {
  return base.replace(/\/+$/, '');
}

export function joinAssetBase(base: string, input: AssetUrl): AssetUrl {
  if (isAbsoluteAssetUrl(input)) return input;
  const cleaned = trimAssetBase(base);
  return cleaned ? `${cleaned}/${input.replace(/^\/+/, '')}` : input;
}

export function resolveAssetUrl(input: AssetUrl, base = ''): AssetUrl {
  return joinAssetBase(base, input);
}

export function loadImage(url: AssetUrl): Promise<HTMLImageElement> {
  const cached = imageCache.get(url);
  if (cached) return cached;
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    if (typeof Image === 'undefined') {
      reject(new Error('loadImage requires a DOM environment'));
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
  imageCache.set(url, promise);
  promise.catch(() => imageCache.delete(url));
  return promise;
}

export function clearImageCache(): void {
  imageCache.clear();
}
