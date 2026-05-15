import type { JSX } from 'react';
import { ROUTES, type RouteKey } from '@/lib/router';

export interface PlaceholderProps {
  readonly routeKey: RouteKey;
  readonly description?: string;
}

export function Placeholder({ routeKey, description }: PlaceholderProps): JSX.Element {
  const route = ROUTES[routeKey];
  return (
    <section className="page-heading readable-background">
      <h1>{route.label}</h1>
      {description && <p className="input-description">{description}</p>}
    </section>
  );
}
