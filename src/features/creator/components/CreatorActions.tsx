import type { JSX } from 'react';

export interface CreatorActionsProps {
  readonly lastSavedKey: string | null;
  readonly loadError: string | null;
  readonly exportError: string | null;
  readonly onSave: () => void;
  readonly onDownloadPng: () => void;
}

export function CreatorActions(props: CreatorActionsProps): JSX.Element {
  return (
    <section>
      <button type="button" onClick={props.onSave}>
        Save to localStorage
      </button>{' '}
      <button type="button" onClick={props.onDownloadPng}>
        Download PNG
      </button>
      {props.lastSavedKey && (
        <span>
          {' '}
          Saved as: <code>{props.lastSavedKey}</code>
        </span>
      )}
      {props.loadError && <p>{props.loadError}</p>}
      {props.exportError && <p>{props.exportError}</p>}
    </section>
  );
}
