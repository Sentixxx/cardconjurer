import { frameworkRoutes } from './routes.mjs';
import { renderFrameworkRoute } from './render-route.mjs';

const routesByOutputPath = new Map(frameworkRoutes.map((route) => [route.outputPath, route]));

export function frameworkRouteResponse(outputPath) {
  const route = routesByOutputPath.get(outputPath);

  if (!route) {
    throw new Error(`Unknown Next.js framework route: ${outputPath}`);
  }

  return new Response(renderFrameworkRoute(route), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  });
}
