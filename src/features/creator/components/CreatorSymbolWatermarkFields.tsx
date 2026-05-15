import { useState, type ChangeEvent, type DragEvent, type JSX } from 'react';
import {
  M15_SET_SYMBOL_BOUNDS,
  M15_WATERMARK_BOUNDS,
  type CardData,
} from '@/types/cardData';
import type { ImageAssetState } from '@/types/asset';
import { readFileAsDataUrl } from '@/utils/download';
import { CreatorCollapsible } from '@/features/creator/components/CreatorCollapsible';
import {
  DEFAULT_SET_SYMBOL_SOURCE,
  SET_SYMBOL_SOURCES,
  WATERMARK_COLOR_OPTIONS,
  WATERMARK_NONE_VALUE,
  WATERMARK_SELECT_ITEMS,
  buildSetSymbolUrl,
  type SetSymbolSource,
} from '@/services/creatorAssets';

export type SymbolWatermarkSection = 'setSymbol' | 'watermark';

export interface CreatorSymbolWatermarkFieldsProps {
  readonly section: SymbolWatermarkSection;
  readonly card: CardData;
  readonly setSymbol: ImageAssetState;
  readonly watermark: ImageAssetState;
  readonly updateField: <K extends keyof CardData>(key: K, value: CardData[K]) => void;
}

export function CreatorSymbolWatermarkFields(props: CreatorSymbolWatermarkFieldsProps): JSX.Element {
  const { section, card, updateField } = props;
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [setSymbolSource, setSetSymbolSource] = useState<SetSymbolSource>(DEFAULT_SET_SYMBOL_SOURCE);
  const [setSymbolCode, setSetSymbolCode] = useState('');
  const [setSymbolRarity, setSetSymbolRarity] = useState('');
  const [dragSetSymbolMode, setDragSetSymbolMode] = useState(false);
  const [lockSetCode, setLockSetCode] = useState(false);
  const [lockSetSymbolUrl, setLockSetSymbolUrl] = useState(false);

  const onImageFile = async (
    field: 'setSymbolUrl' | 'watermarkUrl',
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    await setImageFile(field, file);
  };

  const setImageFile = async (field: 'setSymbolUrl' | 'watermarkUrl', file: File): Promise<void> => {
    try {
      updateField(field, await readFileAsDataUrl(file));
      setUploadError(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : '无法读取图片文件。');
    }
  };

  const onImageDrop = async (field: 'setSymbolUrl' | 'watermarkUrl', event: DragEvent<HTMLElement>): Promise<void> => {
    event.preventDefault();
    const file = firstDroppedFile(event);
    if (file) {
      await setImageFile(field, file);
    }
  };

  if (section === 'setSymbol') {
    return (
      <>
        <section className="input-stack readable-background padding margin-bottom">
          <h5>选择/上传你的系列图标</h5>
          <div className="input-grid">
            <div
              className="padding drop-area"
              onDragOver={preventDropDefaults}
              onDrop={(event) => void onImageDrop('setSymbolUrl', event)}
            >
              <h5 className="margin-bottom padding input-description">拖放</h5>
              <input
                type="file"
                multiple
                accept=".png,.svg,.jpg,.jpeg,.bmp,.webp"
                onChange={(e) => void onImageFile('setSymbolUrl', e)}
              />
            </div>
            <div>
              <input
                aria-label="Via URL"
                type="url"
                value={card.setSymbolUrl ?? ''}
                placeholder="Via URL"
                disabled={lockSetSymbolUrl}
                onChange={(e) => updateField('setSymbolUrl', e.target.value || null)}
              />
            </div>
          </div>
          <h5>或输入一个系列代码/稀有度</h5>
          <div className="input-grid">
            <input
              aria-label="系列代码"
              type="text"
              value={setSymbolCode}
              placeholder="系列代码"
              disabled={lockSetCode}
              onChange={(e) => {
                const nextSetCode = e.target.value;
                setSetSymbolCode(nextSetCode);
                if (!lockSetSymbolUrl) {
                  updateField('setSymbolUrl', buildSetSymbolUrl(setSymbolSource, nextSetCode, setSymbolRarity));
                }
              }}
            />
            <input
              aria-label="稀有度"
              type="text"
              value={setSymbolRarity}
              placeholder="稀有度"
              onChange={(e) => {
                const next = e.target.value;
                setSetSymbolRarity(next);
                if (!lockSetSymbolUrl) {
                  updateField('setSymbolUrl', buildSetSymbolUrl(setSymbolSource, setSymbolCode, next));
                }
              }}
            />
          </div>
          <h5>从以下位置加载系列图标：</h5>
          <div className="input-grid">
            <select
              value={setSymbolSource}
              aria-label="Set symbol source"
              onChange={(e) => {
                const nextSource = e.target.value as SetSymbolSource;
                setSetSymbolSource(nextSource);
                if (!lockSetSymbolUrl) {
                  updateField('setSymbolUrl', buildSetSymbolUrl(nextSource, setSymbolCode, setSymbolRarity));
                }
              }}
            >
              {SET_SYMBOL_SOURCES.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.label}
                </option>
              ))}
            </select>
          </div>
          <SetCodeHelp />
          {uploadError && <p>{uploadError}</p>}
        </section>
        <section className="input-stack readable-background padding margin-bottom">
          <h5>位置/缩放你的系列图标 (X, Y, 缩放)</h5>
          <div className="input-grid">
          <input
            aria-label="Set Symbol X Position"
            type="number"
            value={card.setSymbolOffsetX ?? 0}
            onChange={(e) => updateField('setSymbolOffsetX', Number(e.target.value) || 0)}
          />
          <input
            aria-label="Set Symbol Y Position"
            type="number"
            value={card.setSymbolOffsetY ?? 0}
            onChange={(e) => updateField('setSymbolOffsetY', Number(e.target.value) || 0)}
          />
          <input
            aria-label="Set Symbol Scale"
            type="number"
            min={0}
            step={0.1}
            value={Math.round((card.setSymbolScale ?? 1) * 1000) / 10}
            onChange={(e) => updateField('setSymbolScale', Math.max(0, Number(e.target.value) || 0) / 100)}
          />
          </div>
          <button
            type="button"
            onClick={() => {
              updateField('setSymbolOffsetX', 0);
              updateField('setSymbolOffsetY', 0);
              updateField('setSymbolScale', 1);
              updateField('setSymbolBounds', M15_SET_SYMBOL_BOUNDS);
            }}
          >
            重置系列图标
          </button>
        </section>
        <section className="input-stack readable-background padding margin-bottom">
          <h5>清除系列图标，使其变为空白</h5>
          <button type="button" onClick={() => updateField('setSymbolUrl', null)}>
            清除系列图标
          </button>
        </section>
        <section className="input-stack readable-background padding margin-bottom">
          <h5>Click and drag to move set symbol instead of art (hold shift to zoom)</h5>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={dragSetSymbolMode}
              onChange={(e) => setDragSetSymbolMode(e.target.checked)}
            />
            Click and drag to move set symbol instead of art
          </label>
        </section>
        <section className="input-stack readable-background padding">
          <h5>锁定系列代码（在重新加载时保存）</h5>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={lockSetCode}
              onChange={(e) => setLockSetCode(e.target.checked)}
            />
            锁定系列代码
          </label>
          <h5>锁定系列图标URL（在重新加载时保存）</h5>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={lockSetSymbolUrl}
              onChange={(e) => setLockSetSymbolUrl(e.target.checked)}
            />
            锁定系列图标URL
          </label>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>选择/上传你的水印</h5>
        <div className="input-grid">
          <div
            className="padding drop-area"
            onDragOver={preventDropDefaults}
            onDrop={(event) => void onImageDrop('watermarkUrl', event)}
          >
            <h5 className="margin-bottom padding input-description">拖放</h5>
            <input
              type="file"
              multiple
              accept=".png,.svg,.jpg,.jpeg,.bmp,.webp"
              onChange={(e) => void onImageFile('watermarkUrl', e)}
            />
          </div>
          <div>
            <input
              aria-label="Via URL"
              type="url"
              value={card.watermarkUrl ?? ''}
              placeholder="Via URL"
              onChange={(e) => updateField('watermarkUrl', e.target.value || null)}
            />
            <input
              aria-label="Via Set Code"
              type="text"
              placeholder="Via Set Code"
              onChange={(e) => updateField('watermarkUrl', e.target.value ? `/img/watermarks/${e.target.value.toLowerCase()}.svg` : null)}
            />
          </div>
        </div>
        <h5>选择基于lore的水印</h5>
        <select
          aria-label="Select lore-based watermarks"
          value={getWatermarkSelectValue(card.watermarkUrl)}
          onChange={(e) => {
            if (e.target.value === WATERMARK_NONE_VALUE || e.target.value.startsWith('separator:')) return;
            updateField('watermarkUrl', e.target.value);
          }}
        >
          {WATERMARK_SELECT_ITEMS.map((item) =>
            item.kind === 'separator' ? (
              <option key={item.value ?? item.label} value={item.value ?? `separator:${item.label}`} disabled>
                {item.label}
              </option>
            ) : (
              <option key={item.url} value={item.url}>
                {item.label}
              </option>
            ),
          )}
        </select>
        <SetCodeHelp />
        {uploadError && <p>{uploadError}</p>}
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>选择水印颜色（左，右）</h5>
        <div className="input-grid">
        <select
          value={card.watermarkLeftColor ?? '#b79d58'}
          onChange={(e) => updateField('watermarkLeftColor', e.target.value)}
        >
          {WATERMARK_COLOR_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={card.watermarkRightColor ?? 'none'}
          onChange={(e) => updateField('watermarkRightColor', e.target.value)}
        >
          {WATERMARK_COLOR_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        </div>
        <h5>或者手动选择（左，右）</h5>
        <div className="input-grid">
        <input
          type="color"
          value={watermarkColorInputValue(card.watermarkLeftColor, '#b79d58')}
          onChange={(e) => updateField('watermarkLeftColor', e.target.value)}
        />
        <input
          type="color"
          value={watermarkColorInputValue(card.watermarkRightColor, '#000000')}
          onChange={(e) => updateField('watermarkRightColor', e.target.value)}
        />
        </div>
        <h5>并输入一个不透明度</h5>
        <input
          aria-label="Watermark opacity"
          type="number"
          min={0}
          max={100}
          step={1}
          value={Math.round((card.watermarkOpacity ?? 0.28) * 100)}
          onChange={(e) => updateField('watermarkOpacity', Math.min(100, Math.max(0, Number(e.target.value) || 0)) / 100)}
        />
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>位置/缩放你的水印 (X, Y, 缩放)</h5>
        <div className="input-grid">
        <input
          aria-label="Watermark X Position"
          type="number"
          value={card.watermarkOffsetX ?? 0}
          onChange={(e) => updateField('watermarkOffsetX', Number(e.target.value) || 0)}
        />
        <input
          aria-label="Watermark Y Position"
          type="number"
          value={card.watermarkOffsetY ?? 0}
          onChange={(e) => updateField('watermarkOffsetY', Number(e.target.value) || 0)}
        />
        <input
            aria-label="Watermark Scale"
            type="number"
          min={0}
          step={0.1}
          value={Math.round((card.watermarkScale ?? 1) * 1000) / 10}
          onChange={(e) => updateField('watermarkScale', Math.max(0, Number(e.target.value) || 0) / 100)}
        />
        </div>
        <button
          type="button"
          onClick={() => {
            updateField('watermarkOffsetX', 0);
            updateField('watermarkOffsetY', 0);
            updateField('watermarkOpacity', 0.4);
            updateField('watermarkScale', 1);
            updateField('watermarkBounds', M15_WATERMARK_BOUNDS);
            updateField('watermarkLeftColor', '#b79d58');
            updateField('watermarkRightColor', 'none');
          }}
        >
          重置水印
        </button>
      </section>
      <section className="input-stack readable-background padding">
        <h5>清除水印，使其变为空白</h5>
        <button type="button" onClick={() => updateField('watermarkUrl', null)}>
          去除水印
        </button>
      </section>
    </>
  );
}

function getWatermarkSelectValue(watermarkUrl: string | null | undefined): string {
  if (!watermarkUrl) return WATERMARK_NONE_VALUE;
  return WATERMARK_SELECT_ITEMS.some((item) => item.kind === 'preset' && item.url === watermarkUrl)
    ? watermarkUrl
    : WATERMARK_NONE_VALUE;
}

function SetCodeHelp(): JSX.Element {
  return (
    <CreatorCollapsible title="如何找到系列代码">
      <h5>系列代码是代表系列的两个或三个字符组合。对于2015年之后发布的系列，可以在左下角找到三字符系列代码。</h5>
      <h5>对于较早的系列，代码可能因使用情况而有所不同：</h5>
      <p>
        系列图标图像使用与
        <a className="underline" href="https://scryfall.com/sets" target="_blank" rel="noopener noreferrer">
          Scryfall
        </a>
        相同的代码命名。
      </p>
      <p>
        对于水印，请参考
        <a className="underline" href="https://keyrune.andrewgioia.com/icons.html" target="_blank" rel="noopener noreferrer">
          Keyrune
        </a>
        。
      </p>
    </CreatorCollapsible>
  );
}

function watermarkColorInputValue(value: string | null | undefined, fallback: string): string {
  return value?.startsWith('#') ? value : fallback;
}

function preventDropDefaults(event: DragEvent<HTMLElement>): void {
  event.preventDefault();
}

function firstDroppedFile(event: DragEvent<HTMLElement>): File | null {
  return event.dataTransfer.files?.[0] ?? null;
}
