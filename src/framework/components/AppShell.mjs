import { html } from '../html.mjs';

const navItems = [
  { label: '主页', hxGet: 'index.html', trigger: 'click' },
  { label: '制卡', hxGet: 'creator/index.html', trigger: 'click, doCreate from:body' },
  { label: '打印工具', hxGet: 'print/index.html', trigger: 'click' },
  { label: '询问克撒 2.0', hxGet: 'askurza/index.html', trigger: 'click' },
  { label: '非瑞克西亚文生成器', hxGet: 'phyrexian/index.html', trigger: 'click' },
  { label: '画廊', hxGet: 'gallery/index.html', trigger: 'click' },
  { label: '主题编辑器', hxGet: 'theme/index.html', trigger: 'click' },
  { label: '条款和条件', hxGet: 'legal/index.html', trigger: 'click' },
];

function Head() {
  return html`
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content="mtg, magic, card, creator, custom, maker" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <link rel="stylesheet" href="css/reset.css" />
      <link rel="stylesheet" href="css/style-9.css" />
      <link rel="shortcut icon" href="core/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="core/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="core/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="core/favicon-16x16.png" />
      <script defer src="js/themes.js"></script>
      <script defer src="js/htmx.min.js"></script>
      <script defer src="js/main-1.js"></script>
    </head>
  `;
}

function Menu() {
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
          ${navItems.map((item) => html`
            <h3>
              <a
                href="#"
                hx-get=${item.hxGet}
                hx-target="#content"
                hx-trigger=${item.trigger}
                onclick="toggleMenu()"
              >
                ${item.label}
              </a>
            </h3>
          `)}
        </div>
      </div>
      <div class="notification-container"></div>
    </div>
  `;
}

export function AppShell({ children }) {
  return html`
    <html>
      <${Head} />
      <body>
        <div class="background"></div>
        <header class="readable-background">
          <h1 class="title center">CARD CONJURER</h1>
        </header>
        <${Menu} />
        ${children}
        <footer>
          <a href="https://beian.miit.gov.cn/" target="_blank">沪ICP备2025112621号-1</a>
        </footer>
      </body>
    </html>
  `;
}
