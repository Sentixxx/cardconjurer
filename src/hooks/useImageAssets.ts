import { useEffect, useMemo, useState } from 'react';
import { loadImage } from '@/services/assets';
import { IDLE_IMAGE_ASSET, type ImageAssetState } from '@/types/asset';

export function useImageAssets(urls: readonly (string | null | undefined)[]): readonly ImageAssetState[] {
  const key = useMemo(() => urls.map((url) => url ?? '').join('\n'), [urls]);
  const [states, setStates] = useState<readonly ImageAssetState[]>(() => urls.map(() => IDLE_IMAGE_ASSET));

  useEffect(() => {
    let cancelled = false;
    const nextStates = urls.map((url): ImageAssetState => {
      if (!url) return IDLE_IMAGE_ASSET;
      return { status: 'loading', url, image: null, error: null };
    });
    setStates(nextStates);

    urls.forEach((url, index) => {
      if (!url) return;
      loadImage(url)
        .then((image) => {
          if (cancelled) return;
          setStates((current) => current.map((state, i) => (i === index ? { status: 'ready', url, image, error: null } : state)));
        })
        .catch((error: unknown) => {
          if (cancelled) return;
          const wrapped = error instanceof Error ? error : new Error(String(error));
          setStates((current) => current.map((state, i) => (i === index ? { status: 'error', url, image: null, error: wrapped } : state)));
        });
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return states;
}
