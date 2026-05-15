import { useCallback, useEffect, useRef, useState, type ChangeEvent, type JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';
import { loadImage } from '@/services/assets';
import { renderPrintSheet } from '@/services/print';
import { DEFAULT_PRINT_CONFIG, type PrintConfig } from '@/types/print';
import { downloadBlob } from '@/utils/download';

const PRINT_CONFIG_STORAGE_KEY = 'cardforger.print.config';
const MAX_PRINT_IMAGES = 9;

export function PrintPage(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [config, setConfig] = useState<PrintConfig>(DEFAULT_PRINT_CONFIG);
  const [images, setImages] = useState<readonly HTMLImageElement[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(PRINT_CONFIG_STORAGE_KEY);
      if (!saved) return;
      setConfig({ ...DEFAULT_PRINT_CONFIG, ...JSON.parse(saved) as Partial<PrintConfig> });
    } catch {
      setStatus('无法加载保存的打印配置。');
    }
  }, []);

  const redraw = useCallback(async (): Promise<void> => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    await renderPrintSheet(canvas, { config, images });
  }, [config, images]);

  useEffect(() => {
    void redraw();
  }, [redraw]);

  const updateConfig = <K extends keyof PrintConfig>(key: K, value: PrintConfig[K]): void => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    event.target.value = '';
    if (!files || files.length === 0) return;
    setStatus(`Loading ${files.length} image(s)…`);
    try {
      const loaded = await Promise.all(
        Array.from(files).map(async (file) => {
          const url = URL.createObjectURL(file);
          try {
            return await loadImage(url);
          } finally {
            URL.revokeObjectURL(url);
          }
        }),
      );
      setImages((prev) => [...prev, ...loaded].slice(0, MAX_PRINT_IMAGES));
      setStatus(`Loaded ${Math.min(loaded.length, MAX_PRINT_IMAGES)} image(s).`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to load images');
    }
  };

  const onDownloadPng = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) {
        setStatus('canvas.toBlob returned null');
        return;
      }
      downloadBlob('print.png', blob);
    }, 'image/png');
  };

  const onClearImages = (): void => setImages([]);

  const onSaveConfig = (): void => {
    window.localStorage.setItem(PRINT_CONFIG_STORAGE_KEY, JSON.stringify(config));
    setStatus('打印配置已保存。');
  };

  const onToggleOrientation = (): void => {
    updateConfig('paper', [config.paper[1], config.paper[0]]);
  };

  const onDownloadPdf = (): void => {
    setStatus('请在打印对话框中选择“另存为 PDF”。');
    window.print();
  };

  return (
    <>
      <Placeholder routeKey="print" />
      <section className="input-stack readable-background padding margin-bottom">
        <h5>配置页面设置</h5>
        <h5>选择纸张大小</h5>
        <div className="input-grid">
          <select
            aria-label="选择纸张大小"
            value={config.paper.join(',')}
            onChange={(e) => {
              const [w, h] = e.target.value.split(',').map(Number);
              if (Number.isFinite(w) && Number.isFinite(h)) updateConfig('paper', [w, h]);
            }}
          >
            <option value="8.5,11">信纸 (8.5 x 11)</option>
            <option value="8.2667,11.6934">A4纸</option>
          </select>
        </div>
        <h5>切换纸张方向（纵向/横向）</h5>
        <button type="button" onClick={onToggleOrientation}>
          切换方向
        </button>
        <h5>选择默认卡牌尺寸</h5>
        <select
          aria-label="选择默认卡牌尺寸"
          value={getCardSizePreset(config)}
          onChange={(e) => setConfig((prev) => ({ ...prev, ...cardSizePresetToConfig(e.target.value, prev.ppi) }))}
        >
          <option value="inches">2.5 x 3.5 英寸</option>
          <option value="millimeters">63 x 88 毫米</option>
          <option value="custom">自定义</option>
        </select>
        <h5>或输入自定义卡牌尺寸</h5>
        <div className="input-grid">
          <input
            aria-label="卡牌宽度"
            type="number"
            value={config.cardWidth}
            onChange={(e) => updateConfig('cardWidth', Number(e.target.value) || 1)}
          />
          <input
            aria-label="卡牌高度"
            type="number"
            value={config.cardHeight}
            onChange={(e) => updateConfig('cardHeight', Number(e.target.value) || 1)}
          />
        </div>
        <h5>输入出血边缘厚度（像素）</h5>
        <input
          aria-label="输入出血边缘厚度（像素）"
          type="number"
          min={0}
          value={config.cardPadding}
          onChange={(e) => updateConfig('cardPadding', Math.max(0, Number(e.target.value) || 0))}
        />
        <h5>输入卡牌之间的间距（像素）</h5>
        <input
          aria-label="输入卡牌之间的间距（像素）"
          type="number"
          min={0}
          value={config.cardMargin}
          onChange={(e) => updateConfig('cardMargin', Math.max(0, Number(e.target.value) || 0))}
        />
        <h5>设置PPI（每英寸像素数）</h5>
        <input
          aria-label="设置PPI（每英寸像素数）"
          type="number"
          min={72}
          max={2400}
          value={config.ppi}
          onChange={(e) => updateConfig('ppi', Number(e.target.value) || 1)}
        />
        <h5>包含裁切辅助线（帮助引导裁切的彩色标记；预览中可能不可见）</h5>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={config.useCuttingAids}
            onChange={(e) => updateConfig('useCuttingAids', e.target.checked)}
          />
          裁切辅助线
        </label>
        <h5>图像已包含出血边缘</h5>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={config.imgIncludesBleedEdge}
            onChange={(e) => updateConfig('imgIncludesBleedEdge', e.target.checked)}
          />
          图像已包含出血边缘
        </label>
        <h5>出血边缘颜色</h5>
        <input
          aria-label="出血边缘颜色"
          type="color"
          value={config.bleedEdgeColor}
          onChange={(e) => updateConfig('bleedEdgeColor', e.target.value)}
        />
        <h5>将当前配置保存为默认设置</h5>
        <button type="button" onClick={onSaveConfig}>
          保存配置
        </button>
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>上传您想打印的图片，或直接拖放文件</h5>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => void onFileChange(event)}
        />
        <button type="button" onClick={onClearImages} disabled={images.length === 0}>
          清空
        </button>
        <small>已选择 {images.length} / {MAX_PRINT_IMAGES} 张图片。</small>
        {status && (
          <p>
            <small>{status}</small>
          </p>
        )}
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>下载打印页面 (PNG)</h5>
        <h5>（可能需要几秒钟）</h5>
        <button type="button" onClick={onDownloadPng}>
          下载打印页面 (PNG)
        </button>
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>下载打印页面 (PDF)</h5>
        <h5>（警告：这可能需要约15秒...）</h5>
        <button type="button" onClick={onDownloadPdf}>
          下载打印页面 (PDF)
        </button>
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h5>想在餐桌上看到您的自制卡牌吗？</h5>
        <h5>上传最多九张图片，它们将自动排列在8.5&quot; x 11&quot;的打印页面上，这样您就可以在家用最高600PPI的分辨率打印它们。</h5>
      </section>
      <section className="input-stack readable-background padding">
        <h5>预览</h5>
        <canvas ref={canvasRef} style={{ maxWidth: '850px', width: '100%', height: 'auto', background: '#fff' }} />
      </section>
    </>
  );
}

function getCardSizePreset(config: PrintConfig): string {
  const inchWidth = Math.round(2.5 * config.ppi);
  const inchHeight = Math.round(3.5 * config.ppi);
  const mmWidth = Math.round((63 / 25.4) * config.ppi);
  const mmHeight = Math.round((88 / 25.4) * config.ppi);
  if (config.cardWidth === inchWidth && config.cardHeight === inchHeight) return 'inches';
  if (config.cardWidth === mmWidth && config.cardHeight === mmHeight) return 'millimeters';
  return 'custom';
}

function cardSizePresetToConfig(value: string, ppi: number): Pick<PrintConfig, 'cardWidth' | 'cardHeight'> {
  if (value === 'millimeters') {
    return {
      cardWidth: Math.round((63 / 25.4) * ppi),
      cardHeight: Math.round((88 / 25.4) * ppi),
    };
  }
  if (value === 'inches') {
    return {
      cardWidth: Math.round(2.5 * ppi),
      cardHeight: Math.round(3.5 * ppi),
    };
  }
  return {
    cardWidth: DEFAULT_PRINT_CONFIG.cardWidth,
    cardHeight: DEFAULT_PRINT_CONFIG.cardHeight,
  };
}
