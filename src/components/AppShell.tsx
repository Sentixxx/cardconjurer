import { useState, type JSX, type ReactNode } from 'react';
import { Link, NAV_ROUTE_KEYS, ROUTES, useCurrentRouteKey } from '@/lib/router';

export interface AppShellProps {
  readonly children: ReactNode;
}

export function AppShell({ children }: AppShellProps): JSX.Element {
  const currentKey = useCurrentRouteKey();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-root">
      <div className="background" aria-hidden="true" />
      <header className="site-header readable-background">
        <h1 className="title center">
          <Link href={ROUTES.home.path}>CARD CONJURER</Link>
        </h1>
      </header>

      <button
        type="button"
        className={`hamburger ${menuOpen ? 'opened' : ''}`}
        aria-label={menuOpen ? '关闭导航' : '打开导航'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
      <button
        type="button"
        className={`menu-backdrop ${menuOpen ? 'menu-visible' : ''}`}
        aria-label="关闭导航"
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      />
      <nav className={`menu ${menuOpen ? 'menu-visible' : 'menu-hidden'}`} aria-label="主导航">
        <div className="main-menu readable-background">
          <h2>导航</h2>
          {NAV_ROUTE_KEYS.map((key) => {
            const isActive = key === currentKey;
            return (
              <h3 key={key} className={isActive ? 'selected-nav-item' : undefined}>
                <Link href={ROUTES[key].path} onClick={() => setMenuOpen(false)}>
                  {ROUTES[key].label}
                </Link>
              </h3>
            );
          })}
        </div>
      </nav>

      <main id="content" className="main-content">
        {children}
      </main>
      <footer className="site-footer readable-background">
        <p>
          本项目不隶属于 Wizards of the Coast、Legend Story Studios 或 Scryfall。字体、法术力符号、卡牌图像和相关素材归各自权利人所有。
        </p>
        <p>
          <Link href={ROUTES.legal.path}>条款和条件</Link> · <Link href={ROUTES.about.path}>关于</Link>
        </p>
      </footer>
    </div>
  );
}
