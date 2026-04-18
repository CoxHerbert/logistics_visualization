import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import http from 'node:http';

import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.argv.includes('--prod') || process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 5173);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

async function serveStaticFile(res, filePath) {
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    send(res, 200, data, { 'Content-Type': contentType });
    return true;
  } catch {
    return false;
  }
}

async function createServer() {
  let vite;
  let template;
  let render;

  if (!isProd) {
    vite = await createViteServer({
      appType: 'custom',
      server: { middlewareMode: true },
    });
  } else {
    template = await fs.readFile(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8');
    const entry = await import(pathToFileURL(path.resolve(__dirname, 'dist/server/entry-server.js')).href);
    render = entry.render;
  }

  const server = http.createServer(async (req, res) => {
    const reqUrl = req.url || '/';
    const url = reqUrl.split('?')[0] || '/';

    try {
      if (!isProd) {
        vite.middlewares(req, res, async () => {
          const rawTemplate = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
          const transformedTemplate = await vite.transformIndexHtml(url, rawTemplate);
          const entry = await vite.ssrLoadModule('/src/entry-server.ts');
          const appHtml = await entry.render(reqUrl);
          const html = transformedTemplate.replace('<!--app-html-->', appHtml);
          send(res, 200, html, { 'Content-Type': 'text/html; charset=utf-8' });
        });
        return;
      }

      const distClientRoot = path.resolve(__dirname, 'dist/client');
      const safePath = path.normalize(url).replace(/^([.][.][/\\])+/, '');
      const staticFilePath = path.join(distClientRoot, safePath);
      if (url !== '/' && path.extname(url)) {
        const served = await serveStaticFile(res, staticFilePath);
        if (served) return;
      }

      const appHtml = await render(reqUrl);
      const html = template.replace('<!--app-html-->', appHtml);
      send(res, 200, html, { 'Content-Type': 'text/html; charset=utf-8' });
    } catch (error) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(error);
      }
      console.error(error);
      send(res, 500, 'Internal Server Error', { 'Content-Type': 'text/plain; charset=utf-8' });
    }
  });

  server.listen(port, () => {
    const mode = isProd ? 'production' : 'development';
    console.log(`[SSR] ${mode} server running: http://localhost:${port}`);
  });
}

createServer();


