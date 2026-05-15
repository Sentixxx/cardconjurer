import { useState, type JSX } from 'react';
import { DEFAULT_COLLECTOR_YEAR, type CardData, type Rarity } from '@/types/cardData';

export interface CreatorIdentityFieldsProps {
  readonly card: CardData;
  readonly disabled: boolean;
  readonly onChangeKey: (value: string) => void;
  readonly onChangeSet: (value: string | null) => void;
  readonly onChangeRarity: (value: Rarity) => void;
  readonly onChangeCardNumber: (value: string | null) => void;
  readonly onChangeArtist: (value: string | null) => void;
}

export function CreatorIdentityFields(props: CreatorIdentityFieldsProps): JSX.Element {
  const { card, disabled } = props;
  const [language, setLanguage] = useState('EN');
  const [note, setNote] = useState('');
  const [year, setYear] = useState(DEFAULT_COLLECTOR_YEAR);
  const [extraInfo, setExtraInfo] = useState('card.sentixx.top');
  const [enableImport, setEnableImport] = useState(false);
  const [enableCopyright, setEnableCopyright] = useState(false);
  const [enableExtraInfo, setEnableExtraInfo] = useState(false);
  const [enableArtistImport, setEnableArtistImport] = useState(false);
  const [useNewCollectorStyle, setUseNewCollectorStyle] = useState(false);
  const [showCollectorInfo, setShowCollectorInfo] = useState(true);
  const [serialNumber, setSerialNumber] = useState('');
  const [collectorTotal, setCollectorTotal] = useState('');
  const [serialX, setSerialX] = useState(172);
  const [serialY, setSerialY] = useState(1383);
  const [serialScale, setSerialScale] = useState(1);
  const [starMode, setStarMode] = useState(false);

  return (
    <>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>输入卡牌编号、稀有度、系列代码、语言和艺术家名称</h5>
        <div className="input-grid">
        <input
          aria-label="Number"
          type="text"
          value={card.cardNumber ?? ''}
          disabled={disabled}
          placeholder="Number"
          onChange={(e) => props.onChangeCardNumber(e.target.value || null)}
        />
        <input
          aria-label="Rarity"
          type="text"
          value={card.rarity ?? 'C'}
          disabled={disabled}
          placeholder="Rarity"
          onChange={(e) => {
            const next = e.target.value.toUpperCase();
            if (next === 'C' || next === 'U' || next === 'R' || next === 'M' || next === 'P') {
              props.onChangeRarity(next as Rarity);
            }
          }}
        />
        <input
          aria-label="Note"
          type="text"
          value={note}
          disabled={disabled}
          placeholder="Note"
          onChange={(e) => setNote(e.target.value)}
        />
        <input
          aria-label="Set"
          type="text"
          value={card.setCode ?? ''}
          disabled={disabled}
          placeholder="Set"
          onChange={(e) => props.onChangeSet(e.target.value || null)}
        />
        <input
          aria-label="Language"
          type="text"
          value={language}
          disabled={disabled}
          placeholder="Language"
          onChange={(e) => setLanguage(e.target.value)}
        />
        <input
          aria-label="Artist"
          type="text"
          value={card.artist ?? ''}
          disabled={disabled}
          placeholder="Artist"
          onChange={(e) => props.onChangeArtist(e.target.value || null)}
        />
        <input
          aria-label="0"
          type="number"
          value={year}
          disabled={disabled}
          placeholder="0"
          onChange={(e) => setYear(e.target.value)}
        />
        </div>
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>收藏信息设置</h5>
        <label className="checkbox-row">
          <input type="checkbox" checked={enableImport} onChange={(e) => setEnableImport(e.target.checked)} />
          启用导入
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={enableCopyright} onChange={(e) => setEnableCopyright(e.target.checked)} />
          启用版权
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={enableExtraInfo} onChange={(e) => setEnableExtraInfo(e.target.checked)} />
          启用额外信息
        </label>
        {enableExtraInfo && (
          <input
            aria-label="额外信息"
            type="text"
            value={extraInfo}
            disabled={disabled}
            placeholder="额外信息"
            onChange={(e) => setExtraInfo(e.target.value)}
          />
        )}
        <label className="checkbox-row">
          <input type="checkbox" checked={enableArtistImport} onChange={(e) => setEnableArtistImport(e.target.checked)} />
          启用艺术家导入
        </label>
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>收藏信息样式</h5>
        <label className="checkbox-row">
          <input type="checkbox" checked={useNewCollectorStyle} onChange={(e) => setUseNewCollectorStyle(e.target.checked)} />
          使用新的（后ONE）收藏信息样式
        </label>
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>显示收藏信息</h5>
        <label className="checkbox-row">
          <input type="checkbox" checked={showCollectorInfo} onChange={(e) => setShowCollectorInfo(e.target.checked)} />
          显示收藏信息（取消选中以隐藏）
        </label>
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>编号（留空以隐藏）</h5>
        <div className="input-grid">
        <input
          type="text"
          value={serialNumber}
          disabled={disabled}
          placeholder="001"
          onChange={(e) => setSerialNumber(e.target.value)}
        />
        <input
          type="text"
          value={collectorTotal}
          disabled={disabled}
          placeholder="500"
          onChange={(e) => setCollectorTotal(e.target.value)}
        />
        </div>
        <h5>位置（X, Y, 缩放）</h5>
        <div className="input-grid">
        <input
          aria-label="Serial Number X Position"
          type="number"
          value={serialX}
          disabled={disabled}
          onChange={(e) => setSerialX(Number(e.target.value) || 0)}
        />
        <input
          aria-label="Serial Number Y Position"
          type="number"
          value={serialY}
          disabled={disabled}
          onChange={(e) => setSerialY(Number(e.target.value) || 0)}
        />
        <input
          aria-label="Serial Number Scale"
          type="number"
          min={0.05}
          step={0.05}
          value={serialScale}
          disabled={disabled}
          onChange={(e) => setSerialScale(Math.max(0.05, Number(e.target.value) || 1))}
        />
        </div>
        <button
          type="button"
          onClick={() => {
            setSerialX(172);
            setSerialY(1383);
            setSerialScale(1);
          }}
        >
          重置编号位置
        </button>
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>在星号（在闪卡上可见）和点号（在普通卡上可见）之间切换</h5>
        <button type="button" onClick={() => setStarMode((value) => !value)}>
          切换星号/点号
        </button>
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>保存当前收藏信息作为默认值</h5>
        <button type="button" disabled={disabled}>
          保存为默认值
        </button>
        <h5>清除你的保存默认收藏信息</h5>
        <button type="button" disabled={disabled}>
          清除保存的默认值
        </button>
      </section>
      <input type="hidden" value={starMode ? 'star' : 'dot'} readOnly />
    </>
  );
}
