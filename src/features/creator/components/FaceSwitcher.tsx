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
    <section>
      <h2>Faces</h2>
      <button type="button" onClick={() => onSelect('A')} disabled={activeFace === 'A'}>
        Face A
      </button>{' '}
      {hasFaceB ? (
        <>
          <button type="button" onClick={() => onSelect('B')} disabled={activeFace === 'B'}>
            Face B
          </button>{' '}
          <button type="button" onClick={onRemoveFaceB}>
            Remove face B
          </button>
        </>
      ) : (
        <button type="button" onClick={onAddFaceB}>
          + Add face B
        </button>
      )}
    </section>
  );
}
