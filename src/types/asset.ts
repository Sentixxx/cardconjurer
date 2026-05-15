export type AssetUrl = string;

export type ImageAssetStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface ImageAssetState {
  readonly status: ImageAssetStatus;
  readonly url: AssetUrl | null;
  readonly image: HTMLImageElement | null;
  readonly error: Error | null;
}

export const IDLE_IMAGE_ASSET: ImageAssetState = {
  status: 'idle',
  url: null,
  image: null,
  error: null,
};
