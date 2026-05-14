import { html } from '../../html.mjs';

const legacyNavItems = [
  { label: '主页', href: '/' },
  { label: '制卡器', href: '/creator' },
  { label: '打印工具', href: '/print' },
  { label: 'Ask Urza 2.0', href: '/askurza' },
  { label: '非瑞克西亚文生成器', href: '/phyrexian' },
  { label: '画廊', href: '/gallery' },
  { label: '主题编辑器', href: '/theme' },
  { label: '条款和条件', href: '/legal' },
];

export function LegacyHeadPartial() {
  return html`
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content="mtg, magic, card, creator, custom, maker" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <link rel="stylesheet" href="/css/reset.css" />
      <link rel="stylesheet" href="/css/style-9.css" />
      <link rel="shortcut icon" href="/core/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/core/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/core/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/core/favicon-16x16.png" />
      <link rel="manifest" href="/core/site.webmanifest" />
      <script src="/js/themes.js"></script>
      <script defer src="/js/main-1.js"></script>
    </head>
  `;
}

export function LegacyMenuPartial() {
  return html`
    <div>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xml:space="preserve"
        xmlns:serif="http://www.serif.com/"
        class="hamburger"
        onclick="toggleMenu()"
      >
        <path class="line1" d="M10,18L90,18L10,82"></path>
        <path class="line3" d="M10,82L90,82L10,18"></path>
        <path class="line2" d="M10,50L90,50"></path>
      </svg>
      <div class="circle"></div>
      <div class="menu menu-hidden">
        <div class="main-menu">
          <h2>导航</h2>
          ${legacyNavItems.map((item) => html`
            <h3><a href=${item.href}>${item.label}</a></h3>
          `)}
        </div>
      </div>
      <div class="notification-container"></div>
    </div>
  `;
}
