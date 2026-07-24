import { readFile } from "node:fs/promises";
import path from "node:path";
import { distDir } from "./shared.mjs";

const roots = ["/", "/es/"];
const canonicalHosts = new Set(["2morrow.land", "www.2morrow.land"]);
const queue = [...roots];
const visited = new Set();
const failures = [];

while (queue.length) {
  const route = queue.shift();
  if (!route || visited.has(route)) {
    continue;
  }

  visited.add(route);

  const filePath = routeToFilePath(route);
  let html;

  try {
    html = await readFile(filePath, "utf8");
  } catch {
    failures.push(`Missing page for route ${route}`);
    continue;
  }

  for (const target of extractTargets(html)) {
    if (target.startsWith("mailto:") || target.startsWith("tel:") || target.startsWith("#")) {
      continue;
    }

    const normalized = normalizeTarget(target);
    if (!normalized) {
      continue;
    }

    if (!(await pathExists(routeToFilePath(normalized)))) {
      failures.push(`Broken internal target ${target} referenced from ${route}`);
      continue;
    }

    if (normalized.endsWith("/")) {
      queue.push(normalized);
    }
  }
}

if (failures.length) {
  throw new Error(failures.join("\n"));
}

function extractTargets(html) {
  const targets = new Set();
  const attributePattern = /\b(?:href|src|content)="([^"]+)"/g;
  const srcsetPattern = /\bsrcset="([^"]+)"/g;

  for (const match of html.matchAll(attributePattern)) {
    targets.add(match[1]);
  }

  for (const match of html.matchAll(srcsetPattern)) {
    for (const candidate of match[1].split(",")) {
      const [url] = candidate.trim().split(/\s+/);
      if (url) {
        targets.add(url);
      }
    }
  }

  return targets;
}

function normalizeTarget(target) {
  if (target.startsWith("http://") || target.startsWith("https://")) {
    const url = new URL(target);
    if (!canonicalHosts.has(url.hostname)) {
      return null;
    }

    return normalizePathname(url.pathname);
  }

  if (target.startsWith("/")) {
    return normalizePathname(target);
  }

  return null;
}

function normalizePathname(pathname) {
  if (pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname : pathname;
}

function routeToFilePath(route) {
  const relativePath = route === "/" ? "index.html" : route.endsWith("/") ? `${route.slice(1)}index.html` : route.slice(1);
  return path.join(distDir, relativePath.replaceAll("/", path.sep));
}

async function pathExists(filePath) {
  try {
    await readFile(filePath);
    return true;
  } catch {
    return false;
  }
}
