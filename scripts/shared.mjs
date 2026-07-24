import { createServer } from "node:http";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

export const rootDir = new URL("..", import.meta.url);
export const projectRoot = path.resolve(fileURLToPath(rootDir));
export const distDir = path.join(projectRoot, "dist");

export async function withServer(callback) {
  const server = createServer(async (req, res) => {
    const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
    const relativePath = (pathname.endsWith("/") ? `${pathname}index.html` : pathname).replace(/^\/+/, "");
    const filePath = path.join(distDir, relativePath);

    try {
      const file = await readFile(filePath);
      res.statusCode = 200;
      res.setHeader("Content-Type", contentTypeFor(filePath));
      res.end(file);
    } catch {
      try {
        const fallback = await readFile(path.join(distDir, "404.html"));
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(fallback);
      } catch {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Server error");
      }
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, resolve);
  });

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 4173;

  try {
    return await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

export async function freshTempDir(prefix) {
  return mkdtemp(path.join(os.tmpdir(), prefix));
}

export async function copyRecursive(source, destination) {
  await cp(source, destination, { recursive: true });
}

export async function removeIfExists(targetPath) {
  await rm(targetPath, { recursive: true, force: true });
}

function contentTypeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".woff2": "font/woff2",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif"
  };

  return types[extension] ?? "application/octet-stream";
}
