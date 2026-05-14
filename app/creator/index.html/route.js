import { frameworkRouteResponse } from '../../../src/framework/next-response.mjs';

export const dynamic = 'force-static';

export function GET() {
  return frameworkRouteResponse('creator/index.html');
}
