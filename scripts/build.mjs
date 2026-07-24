import { build as esbuild } from "esbuild";
import { transform } from "lightningcss";
import { minify } from "html-minifier-terser";
import sharp from "sharp";
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(rootDir, "src");
const distDir = path.join(rootDir, "dist");

const fontSources = [
  {
    from: "@fontsource/newsreader/files/newsreader-latin-400-normal.woff2",
    to: "newsreader-400.woff2"
  },
  {
    from: "@fontsource/newsreader/files/newsreader-latin-500-normal.woff2",
    to: "newsreader-500.woff2"
  },
  {
    from: "@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2",
    to: "ibm-plex-sans-400.woff2"
  },
  {
    from: "@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2",
    to: "ibm-plex-sans-500.woff2"
  },
  {
    from: "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
    to: "ibm-plex-mono-400.woff2"
  },
  {
    from: "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2",
    to: "ibm-plex-mono-500.woff2"
  }
];

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

await copyStaticFiles(srcDir, distDir);
await buildCss();
await buildJs();
await copyFonts();
await buildImages();
await minifyHtmlFiles(distDir);

async function copyStaticFiles(source, destination) {
  const entries = await readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "assets") {
        await mkdir(destinationPath, { recursive: true });
        await copyStaticFiles(sourcePath, destinationPath);
        continue;
      }

      await mkdir(destinationPath, { recursive: true });
      await copyStaticFiles(sourcePath, destinationPath);
      continue;
    }

    const ext = path.extname(entry.name);
    if (ext === ".css" || ext === ".js" || ext === ".png") {
      continue;
    }

    await mkdir(path.dirname(destinationPath), { recursive: true });
    await copyFile(sourcePath, destinationPath);
  }
}

async function buildCss() {
  const cssInput = await readFile(path.join(srcDir, "assets", "css", "site.css"));
  const cssOutput = transform({
    filename: "site.css",
    code: cssInput,
    minify: true,
    sourceMap: false,
    targets: {
      safari: (16 << 16),
      ios_saf: (16 << 16),
      firefox: (128 << 16),
      chrome: (126 << 16)
    }
  });

  const cssDestination = path.join(distDir, "assets", "css", "site.css");
  await mkdir(path.dirname(cssDestination), { recursive: true });
  await writeFile(cssDestination, cssOutput.code);
}

async function buildJs() {
  await esbuild({
    entryPoints: [path.join(srcDir, "assets", "js", "site.js")],
    bundle: true,
    minify: true,
    format: "esm",
    target: ["chrome126", "firefox128", "safari16"],
    outfile: path.join(distDir, "assets", "js", "site.js")
  });
}

async function copyFonts() {
  const fontsDestination = path.join(distDir, "assets", "fonts");
  await mkdir(fontsDestination, { recursive: true });

  for (const font of fontSources) {
    const sourcePath = path.join(rootDir, "node_modules", font.from);
    await copyFile(sourcePath, path.join(fontsDestination, font.to));
  }
}

async function buildImages() {
  const imageDestination = path.join(distDir, "assets", "img");
  const sourceImage = path.join(srcDir, "assets", "img", "archive-composition.png");
  await mkdir(imageDestination, { recursive: true });

  const hero = sharp(sourceImage).resize({ width: 1600, withoutEnlargement: true });
  await hero.clone().avif({ quality: 58 }).toFile(path.join(imageDestination, "archive-composition.avif"));
  await hero.clone().webp({ quality: 76 }).toFile(path.join(imageDestination, "archive-composition.webp"));
  await hero.clone().png({ compressionLevel: 9 }).toFile(path.join(imageDestination, "archive-composition.png"));

  await sharp(sourceImage)
    .resize({ width: 1200, height: 630, fit: "cover", position: "center" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(imageDestination, "og-image.jpg"));
}

async function minifyHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await minifyHtmlFiles(fullPath);
      continue;
    }

    if (path.extname(entry.name) !== ".html") {
      continue;
    }

    const originalHtml = await readFile(fullPath, "utf8");
    const minifiedHtml = await minify(originalHtml, {
      collapseWhitespace: true,
      keepClosingSlash: true,
      minifyCSS: false,
      minifyJS: false,
      removeComments: false,
      useShortDoctype: true
    });

    await writeFile(fullPath, minifiedHtml);
  }
}
