import type { JSX, ReactNode } from 'react';
import { Link, NAV_ROUTE_KEYS, ROUTES, useCurrentRouteKey } from '@/lib/router';

export interface AppShellProps {
  readonly children: ReactNode;
}

export function AppShell({ children }: AppShellProps): JSX.Element {
  const currentKey = useCurrentRouteKey();
  return (
    <div>
      <header style={{ padding: '1rem', borderBottom: '1px solid var(--interactable-unselected)' }}>
        <h1 style={{ margin: 0 }}>
          <Link href={ROUTES.home.path}>Card Forger</Link>
        </h1>
        <nav>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', listStyle: 'none', padding: 0, margin: '0.5rem 0 0' }}>
            {NAV_ROUTE_KEYS.map((key) => {
              const isActive = key === currentKey;
              return (
                <li key={key}>
                  {isActive ? (
                    <strong>{ROUTES[key].label}</strong>
                  ) : (
                    <Link href={ROUTES[key].path}>{ROUTES[key].label}</Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>{children}</main>
      <footer style={{ padding: '1rem', borderTop: '1px solid var(--interactable-unselected)', fontSize: '0.9rem' }}>
        <p>
          Card Forger is a TypeScript/React/Vite port of Card Conjurer. Not affiliated with Wizards of the Coast,
          Legend Story Studios, or Scryfall. Fonts, mana symbols, card images, and related artwork are
          trademarks and copyrights of their respective owners.
        </p>
        <p>
          <Link href={ROUTES.legal.path}>Terms &amp; Conditions</Link> · <Link href={ROUTES.about.path}>About</Link>
        </p>
      </footer>
    </div>
  );
}
