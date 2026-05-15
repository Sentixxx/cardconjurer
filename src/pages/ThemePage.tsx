import type { JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';
import { useTheme } from '@/hooks/useTheme';
import { useThemeOverlay } from '@/hooks/useThemeOverlay';

export function ThemePage(): JSX.Element {
  const { currentId, palettes, setPalette } = useTheme();
  const { overlay, setHueRotate, setReadableBrightness, reset } = useThemeOverlay();

  return (
    <>
      <Placeholder routeKey="theme" description="Theme picker + custom overlay — palette + hue / brightness adjustments persisted to localStorage." />
      <section>
        <h2>Palettes</h2>
        <ul>
          {palettes.map((palette) => {
            const isActive = palette.id === currentId;
            return (
              <li key={palette.id}>
                <button type="button" onClick={() => setPalette(palette.id)} disabled={isActive}>
                  {palette.label}
                  {isActive ? ' (active)' : ''}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <h2>Custom overlay</h2>
        <p>
          <label>
            Hue rotation: <code>{overlay.hueRotateDeg}°</code>{' '}
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={overlay.hueRotateDeg}
              onChange={(e) => setHueRotate(Number(e.target.value))}
            />
          </label>
        </p>
        <p>
          <label>
            Readable brightness: <code>{overlay.readableBrightness.toFixed(2)}</code>{' '}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={overlay.readableBrightness}
              onChange={(e) => setReadableBrightness(Number(e.target.value))}
            />
          </label>
        </p>
        <button type="button" onClick={reset}>
          Reset overlay
        </button>
      </section>
    </>
  );
}
