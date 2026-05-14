import fsp from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { assertInsideRepo, repoRoot, roots, toNativePath } from './lib/project.mjs';
import { pathExists } from './lib/fs.mjs';

const requestedPort = Number.parseInt(process.env.PORT || '4242', 10);
const host = process.env.HOST || '127.0.0.1';
const rootArgIndex = process.argv.indexOf('--root');

if (rootArgIndex !== -1 && !process.argv[rootArgIndex + 1]) {
  throw new Error('Missing value for --root');
}

const serveRoot = rootArgIndex === -1
  ? roots.dist
  : assertInsideRepo(path.resolve(repoRoot, process.argv[rootArgIndex + 1]), 'serve root');
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.svg', 'image/svg+xml'],
  ['.ico', 'image/x-icon'],
  ['.ttf', 'font/ttf'],
  ['.otf', 'font/otf'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

if (!(await pathExists(serveRoot))) {
  throw new Error(`Missing serve root: ${serveRoot}`);
}

function resolveRequest(url) {
  const parsed = new URL(url, `http://${host}:${requestedPort}`);
  let pathname = decodeURIComponent(parsed.pathname);

  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }

  const normalized = path.normalize(pathname).replace(/^([/\\])+/, '');
  const filePath = path.join(serveRoot, toNativePath(normalized));
  const relative = path.relative(serveRoot, filePath);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }

  return filePath;
}

const server = http.createServer(async (request, response) => {
  const filePath = resolveRequest(request.url || '/');

  if (!filePath) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const stats = await fsp.stat(filePath);
    const finalPath = stats.isDirectory() ? path.join(filePath, 'index.html') : filePath;
    const body = await fsp.readFile(finalPath);
    response.writeHead(200, {
      'content-type': mimeTypes.get(path.extname(finalPath).toLowerCase()) || 'application/octet-stream',
    });
    response.end(body);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

server.listen(requestedPort, host, () => {
  const address = server.address();
  console.log(`Serving ${serveRoot} at http://${host}:${address.port}/`);
});
