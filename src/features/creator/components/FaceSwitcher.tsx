import type { JSX } from 'react';

export type FaceSide = 'A' | 'B';

export interface FaceSwitcherProps {
  readonly activeFace: FaceSide;
  readonly hasFaceB: boolean;
  readonly onSelect: (side: FaceSide) => void;
  readonly onAddFaceB: () => void;
  readonly onRemoveFaceB: () => void;
}

export function FaceSwitcher({
  activeFace,
  hasFaceB,
  onSelect,
  onAddFaceB,
  onRemoveFaceB,
}: FaceSwitcherProps): JSX.Element {
  return (
    <section className="compact-section">
      <h2>卡面</h2>
      <button type="button" onClick={() => onSelect('A')} disabled={activeFace === 'A'}>
        正面
      </button>{' '}
      {hasFaceB ? (
        <>
          <button type="button" onClick={() => onSelect('B')} disabled={activeFace === 'B'}>
            背面
          </button>{' '}
          <button type="button" onClick={onRemoveFaceB}>
            移除背面
          </button>
        </>
      ) : (
        <button type="button" onClick={onAddFaceB}>
          + 添加背面
        </button>
      )}
    </section>
  );
}
