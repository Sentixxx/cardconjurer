import { useEffect, useState, type JSX } from 'react';
import { Placeholder } from '@/components/Placeholder';
import { useThemeOverlay } from '@/hooks/useThemeOverlay';

const LOWPOLY_BACKGROUND = '#3a3838 url("/data/images/site/backgrounds/lowpolyDarkGreen.svg") left/cover no-repeat fixed';
const SOLID_BACKGROUND = '#3a3838';

export function ThemePage(): JSX.Element {
  const { overlay, setHueRotate, setReadableBrightness, reset } = useThemeOverlay();
  const [backgroundMode, setBackgroundMode] = useState<'lowpoly' | 'solid'>('lowpoly');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [rainbowSpeed, setRainbowSpeed] = useState(0);

  useEffect(() => {
    const root = document.documentElement.style;
    if (backgroundUrl.trim()) {
      root.setProperty('--site-background', `url("${backgroundUrl.trim()}") center / cover no-repeat fixed`);
    } else {
      root.setProperty('--site-background', backgroundMode === 'solid' ? SOLID_BACKGROUND : LOWPOLY_BACKGROUND);
    }
  }, [backgroundMode, backgroundUrl]);

  useEffect(() => {
    if (rainbowSpeed <= 0) return;
    const timer = window.setInterval(() => {
      setHueRotate((overlay.hueRotateDeg + 1) % 360);
    }, rainbowSpeed);
    return () => window.clearInterval(timer);
  }, [overlay.hueRotateDeg, rainbowSpeed, setHueRotate]);

  const onReset = (): void => {
    setBackgroundMode('lowpoly');
    setBackgroundUrl('');
    setRainbowSpeed(0);
    reset();
  };

  return (
    <>
      <Placeholder routeKey="theme" />
      <section className="input-stack readable-background padding margin-bottom">
        <h5>欢迎使用主题编辑器！</h5>
        <h5>此功能仍在开发中</h5>
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h3>背景</h3>
        <h5>选择背景</h5>
        <select
          aria-label="选择背景"
          value={backgroundMode}
          onChange={(e) => setBackgroundMode(e.target.value === 'solid' ? 'solid' : 'lowpoly')}
        >
          <option value="lowpoly">低多边形</option>
          <option value="solid">纯色</option>
        </select>
        <h5>输入背景图片（仅限URL）</h5>
        <input
          aria-label="输入背景图片（仅限URL）"
          type="url"
          placeholder="输入URL"
          value={backgroundUrl}
          onChange={(e) => setBackgroundUrl(e.target.value)}
        />
        <h5>调整背景色相</h5>
        <input
          aria-label="调整背景色相"
          type="range"
          min={0}
          max={360}
          step={1}
          value={overlay.hueRotateDeg}
          onChange={(e) => setHueRotate(Number(e.target.value))}
        />
        <h5>启用/设置彩虹速度</h5>
        <input
          aria-label="启用/设置彩虹速度"
          type="range"
          min={0}
          max={500}
          step={10}
          value={rainbowSpeed}
          onChange={(e) => setRainbowSpeed(Number(e.target.value))}
        />
      </section>
      <section className="input-stack readable-background padding margin-bottom">
        <h3>可读区域</h3>
        <h5>调整亮度</h5>
        <input
          aria-label="调整亮度"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={overlay.readableBrightness}
          onChange={(e) => setReadableBrightness(Number(e.target.value))}
        />
        <button type="button" onClick={onReset}>
          重置为默认主题
        </button>
      </section>
    </>
  );
}
