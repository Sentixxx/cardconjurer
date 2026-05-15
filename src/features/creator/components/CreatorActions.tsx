import type { JSX } from 'react';

export interface CreatorActionsProps {
  readonly lastSavedKey: string | null;
  readonly loadError: string | null;
  readonly exportError: string | null;
  readonly roundedCorners: boolean;
  readonly onSave: () => void;
  readonly onDownloadPng: () => void;
  readonly onDownloadJpeg?: () => void;
  readonly onDownloadJson?: () => void;
  readonly onImportJsonClick?: () => void;
  readonly onRoundedCornersChange: (value: boolean) => void;
}

export function CreatorActions(props: CreatorActionsProps): JSX.Element {
  return (
    <section className="compact-section">
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={props.roundedCorners}
          onChange={(event) => props.onRoundedCornersChange(event.target.checked)}
        />
        下载时圆角
      </label>
      <button type="button" onClick={props.onSave}>
        保存到画廊
      </button>{' '}
      <button type="button" onClick={props.onDownloadPng}>
        下载 PNG
      </button>
      {props.onDownloadJpeg && (
        <>
          {' '}
          <button type="button" onClick={props.onDownloadJpeg}>
            下载 JPEG
          </button>
        </>
      )}
      {props.onDownloadJson && (
        <>
          {' '}
          <button type="button" onClick={props.onDownloadJson}>
            导出当前 JSON
          </button>
        </>
      )}
      {props.onImportJsonClick && (
        <>
          {' '}
          <button type="button" onClick={props.onImportJsonClick}>
            导入当前 JSON
          </button>
        </>
      )}
      {props.lastSavedKey && (
        <span>
          {' '}
          已保存为：<code>{props.lastSavedKey}</code>
        </span>
      )}
      {props.loadError && <p>{props.loadError}</p>}
      {props.exportError && <p>{props.exportError}</p>}
    </section>
  );
}
