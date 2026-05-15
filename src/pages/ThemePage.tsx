import { useEffect, useState, type JSX } from 'react';
import { useThemeOverlay } from '@/hooks/useThemeOverlay';

const LOWPOLY_BACKGROUND_URL = '/img/lowpolyBackground.svg';
const GRADIENT_BACKGROUND_URL = '/img/gradientBackground.svg';

function backgroundCss(url: string): string {
  return `url("${url}") center / cover no-repeat fixed`;
}

export function ThemePage(): JSX.Element {
  const { overlay, setHueRotate, setReadableBrightness, reset } = useThemeOverlay();
  const [backgroundUrl, setBackgroundUrl] = useState(LOWPOLY_BACKGROUND_URL);
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState('');
  const [rainbowSpeed, setRainbowSpeed] = useState(0);

  useEffect(() => {
    const root = document.documentElement.style;
    const target = customBackgroundUrl.trim() || backgroundUrl;
    root.setProperty('--site-background', backgroundCss(target));
  }, [backgroundUrl, customBackgroundUrl]);

  useEffect(() => {
    if (rainbowSpeed <= 0) return;
    const intervalMs = Math.max(20, 1000 / rainbowSpeed);
    const timer = window.setInterval(() => {
      setHueRotate((overlay.hueRotateDeg + 1) % 360);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [overlay.hueRotateDeg, rainbowSpeed, setHueRotate]);

  const onReset = (): void => {
    setBackgroundUrl(LOWPOLY_BACKGROUND_URL);
    setCustomBackgroundUrl('');
    setRainbowSpeed(0);
    reset();
  };

  return (
    <>
      <h2 className="readable-background header-extension title center">主题编辑器</h2>
      <div className="layer center" />
      <div className="layer center">
        <h1 className="margin-bottom">欢迎使用主题编辑器！</h1>
        <h5>此功能仍在开发中</h5>
      </div>
      <div className="layer" />
      <div className="layer readable-background margin-bottom-large">
        <h3>背景</h3>
        <h4>选择背景</h4>
        <select
          className="input"
          aria-label="选择背景"
          value={backgroundUrl}
          onChange={(e) => setBackgroundUrl(e.target.value)}
        >
          <option value={LOWPOLY_BACKGROUND_URL}>低多边形</option>
          <option value={GRADIENT_BACKGROUND_URL}>纯色</option>
        </select>
        <h4>输入背景图片（仅限URL）</h4>
        <input
          className="input"
          aria-label="输入背景图片（仅限URL）"
          type="url"
          placeholder="输入URL"
          value={customBackgroundUrl}
          onChange={(e) => setCustomBackgroundUrl(e.target.value)}
        />
        <h4>调整背景色相</h4>
        <input
          className="input"
          aria-label="调整背景色相"
          type="range"
          min={0}
          max={360}
          step={1}
          value={overlay.hueRotateDeg}
          onChange={(e) => setHueRotate(Number(e.target.value))}
        />
        <h4>启用/设置彩虹速度</h4>
        <input
          className="input"
          aria-label="启用/设置彩虹速度"
          type="range"
          min={0}
          max={200}
          step={1}
          value={rainbowSpeed}
          onChange={(e) => setRainbowSpeed(Number(e.target.value))}
        />
        <h3 className="margin-top">可读区域</h3>
        <h4>调整亮度</h4>
        <input
          className="input"
          aria-label="调整亮度"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={overlay.readableBrightness}
          onChange={(e) => setReadableBrightness(Number(e.target.value))}
        />
        <button type="button" className="input margin-top" onClick={onReset}>
          重置为默认主题
        </button>
      </div>
    </>
  );
}
