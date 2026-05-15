import { useCallback, useEffect, useRef, useState, type ChangeEvent, type JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';
import { loadImage } from '@/services/assets';
import { renderPrintSheet } from '@/services/print';
import { DEFAULT_PRINT_CONFIG, type PrintConfig } from '@/types/print';
import { downloadBlob } from '@/utils/download';

export function PrintPage(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [config, setConfig] = useState<PrintConfig>(DEFAULT_PRINT_CONFIG);
  const [images, setImages] = useState<readonly HTMLImageElement[]>([]);
  const [status, setStatus] = useState<string | null>(null);

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
      setImages((prev) => [...prev, ...loaded]);
      setStatus(`Loaded ${loaded.length} image(s).`);
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

  return (
    <>
      <Placeholder
        routeKey="print"
        description="Print sheet — arrange up to (cardsX × cardsY) images onto a single page at the configured PPI, then download as PNG."
      />
      <section>
        <h2>Page</h2>
        <label>
          Paper{' '}
          <select
            value={config.paper.join(',')}
            onChange={(e) => {
              const [w, h] = e.target.value.split(',').map(Number);
              if (Number.isFinite(w) && Number.isFinite(h)) updateConfig('paper', [w, h]);
            }}
          >
            <option value="8.5,11">Letter (8.5 × 11)</option>
            <option value="8.2667,11.6934">A4</option>
            <option value="11,8.5">Letter landscape</option>
          </select>
        </label>{' '}
        <label>
          PPI{' '}
          <input
            type="number"
            min={72}
            max={2400}
            value={config.ppi}
            onChange={(e) => updateConfig('ppi', Number(e.target.value) || 1)}
          />
        </label>
      </section>
      <section>
        <h2>Card</h2>
        <label>
          Width{' '}
          <input
            type="number"
            value={config.cardWidth}
            onChange={(e) => updateConfig('cardWidth', Number(e.target.value) || 1)}
          />
        </label>{' '}
        <label>
          Height{' '}
          <input
            type="number"
            value={config.cardHeight}
            onChange={(e) => updateConfig('cardHeight', Number(e.target.value) || 1)}
          />
        </label>{' '}
        <label>
          Padding{' '}
          <input
            type="number"
            min={0}
            value={config.cardPadding}
            onChange={(e) => updateConfig('cardPadding', Math.max(0, Number(e.target.value) || 0))}
          />
        </label>{' '}
        <label>
          Margin{' '}
          <input
            type="number"
            min={0}
            value={config.cardMargin}
            onChange={(e) => updateConfig('cardMargin', Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
      </section>
      <section>
        <h2>Edges</h2>
        <label>
          <input
            type="checkbox"
            checked={config.imgIncludesBleedEdge}
            onChange={(e) => updateConfig('imgIncludesBleedEdge', e.target.checked)}
          />{' '}
          Image already has bleed edge
        </label>{' '}
        <label>
          Bleed color{' '}
          <input
            type="color"
            value={config.bleedEdgeColor}
            onChange={(e) => updateConfig('bleedEdgeColor', e.target.value)}
          />
        </label>{' '}
        <label>
          <input
            type="checkbox"
            checked={config.useCuttingAids}
            onChange={(e) => updateConfig('useCuttingAids', e.target.checked)}
          />{' '}
          Cutting guides
        </label>
      </section>
      <section>
        <h2>Images ({images.length})</h2>
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          Add images…
        </button>{' '}
        <button type="button" onClick={onClearImages} disabled={images.length === 0}>
          Clear
        </button>{' '}
        <button type="button" onClick={onDownloadPng}>
          Download PNG
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
        {status && (
          <p>
            <small>{status}</small>
          </p>
        )}
      </section>
      <section>
        <h2>Preview</h2>
        <canvas ref={canvasRef} style={{ maxWidth: '850px', width: '100%', height: 'auto', background: '#fff' }} />
      </section>
    </>
  );
}
