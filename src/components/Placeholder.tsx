import type { JSX } from 'react';
import { ROUTES, type RouteKey } from '@/lib/router';

export interface PlaceholderProps {
  readonly routeKey: RouteKey;
  readonly description?: string;
}

export function Placeholder({ routeKey, description }: PlaceholderProps): JSX.Element {
  const route = ROUTES[routeKey];
  return (
    <header>
      <h2>{route.label}</h2>
      {description && <p>{description}</p>}
      <p>
        <small>
          Path: <code>{route.path}</code>
        </small>
      </p>
    </header>
  );
}
