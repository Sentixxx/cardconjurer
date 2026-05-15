import { useEffect, useState } from 'react';
import { loadImage } from '@/services/assets';
import { IDLE_IMAGE_ASSET, type AssetUrl, type ImageAssetState } from '@/types/asset';

export function useImageAsset(url: AssetUrl | null): ImageAssetState {
  const [state, setState] = useState<ImageAssetState>(IDLE_IMAGE_ASSET);

  useEffect(() => {
    if (!url) {
      setState(IDLE_IMAGE_ASSET);
      return undefined;
    }
    let cancelled = false;
    setState({ status: 'loading', url, image: null, error: null });
    loadImage(url)
      .then((image) => {
        if (cancelled) return;
        setState({ status: 'ready', url, image, error: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const wrapped = error instanceof Error ? error : new Error(String(error));
        setState({ status: 'error', url, image: null, error: wrapped });
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}
