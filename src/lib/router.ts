import { useLocation } from 'wouter';

export { Link, Route, Router, Switch, useLocation, useRoute } from 'wouter';

export interface RouteDescriptor {
  readonly key: string;
  readonly path: string;
  readonly label: string;
}

export const ROUTES = {
  home: { key: 'home', path: '/', label: '主页' },
  about: { key: 'about', path: '/about', label: '关于' },
  legal: { key: 'legal', path: '/legal', label: '条款和条件' },
  tutorial: { key: 'tutorial', path: '/tutorial', label: '教程' },
  theme: { key: 'theme', path: '/theme', label: '主题编辑器' },
  phyrexian: { key: 'phyrexian', path: '/phyrexian', label: '非瑞克西亚文生成器' },
  converter: { key: 'converter', path: '/converter', label: '转换器' },
  gallery: { key: 'gallery', path: '/gallery', label: '画廊' },
  print: { key: 'print', path: '/print', label: '打印工具' },
  creator: { key: 'creator', path: '/creator', label: '制卡' },
  askUrza: { key: 'askUrza', path: '/askurza', label: '询问克撒 2.0' },
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
  fixture: { key: 'fixture', path: '/fixtures/:slug', label: 'Fixture' },
} as const satisfies Record<string, RouteDescriptor>;

export type RouteKey = keyof typeof ROUTES;

export const NAV_ROUTE_KEYS: readonly RouteKey[] = [
  'home',
  'creator',
  'print',
  'askUrza',
  'phyrexian',
  'gallery',
  'theme',
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
