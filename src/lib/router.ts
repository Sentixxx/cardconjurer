import { useLocation } from 'wouter';

export { Link, Route, Router, Switch, useLocation, useRoute } from 'wouter';

export interface RouteDescriptor {
  readonly key: string;
  readonly path: string;
  readonly label: string;
}

export const ROUTES = {
  home: { key: 'home', path: '/', label: 'Home' },
  about: { key: 'about', path: '/about', label: 'About' },
  legal: { key: 'legal', path: '/legal', label: 'Legal' },
  tutorial: { key: 'tutorial', path: '/tutorial', label: 'Tutorial' },
  theme: { key: 'theme', path: '/theme', label: 'Theme' },
  phyrexian: { key: 'phyrexian', path: '/phyrexian', label: 'Phyrexian' },
  converter: { key: 'converter', path: '/converter', label: 'Converter' },
  gallery: { key: 'gallery', path: '/gallery', label: 'Gallery' },
  print: { key: 'print', path: '/print', label: 'Print' },
  creator: { key: 'creator', path: '/creator', label: 'Creator' },
  askUrza: { key: 'askUrza', path: '/askurza', label: 'Ask Urza' },
  askUrzaAbilityList: {
    key: 'askUrzaAbilityList',
    path: '/askurza/askUrzaAbilityListGenerator.html',
    label: 'Ask Urza Ability List',
  },
  askUrzaAbilityListLegacy: {
    key: 'askUrzaAbilityListLegacy',
    path: '/data/site/other/askUrza/askUrzaAbilityListGenerator.html',
    label: 'Ask Urza Ability List (legacy URL)',
  },
} as const satisfies Record<string, RouteDescriptor>;

export type RouteKey = keyof typeof ROUTES;

export const NAV_ROUTE_KEYS: readonly RouteKey[] = [
  'home',
  'creator',
  'gallery',
  'print',
  'converter',
  'theme',
  'phyrexian',
  'askUrza',
  'tutorial',
  'about',
  'legal',
];

export function routePath(key: RouteKey): string {
  return ROUTES[key].path;
}

export function buildRoutePath(key: RouteKey, query?: Readonly<Record<string, string>>): string {
  const base = ROUTES[key].path;
  if (!query) return base;
  const params = new URLSearchParams(query);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function useNavigate(): (key: RouteKey, query?: Readonly<Record<string, string>>) => void {
  const [, setLocation] = useLocation();
  return (key, query) => setLocation(buildRoutePath(key, query));
}

export function readQueryParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(name);
}

export function useCurrentRouteKey(): RouteKey | null {
  const [location] = useLocation();
  for (const route of Object.values(ROUTES)) {
    if (location === route.path) {
      return route.key as RouteKey;
    }
  }
  return null;
}
