import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { projectRoot, withServer } from "./shared.mjs";

const pages = [
  "/",
  "/es/",
  "/privacy/",
  "/legal/",
  "/accessibility/",
  "/es/privacidad/",
  "/es/aviso-legal/",
  "/es/accesibilidad/"
];

const minimumScore = 0.95;
const reportsDir = path.join(projectRoot, ".lighthouseci");

await mkdir(reportsDir, { recursive: true });

const failures = [];

await withServer(async (baseUrl) => {
  for (const page of pages) {
    const pageSlug = page === "/" ? "home-en" : page.replaceAll("/", "-").replace(/^-|-$/g, "") || "root";
    let chrome;

    try {
      chrome = await launch({
        chromeFlags: ["--headless=new", "--disable-gpu", "--no-sandbox"]
      });

      const result = await lighthouse(`${baseUrl}${page === "/" ? "" : page}`, {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
        formFactor: "mobile",
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 2.625,
          disabled: false
        }
      });

      if (!result?.lhr) {
        throw new Error(`No Lighthouse result produced for ${page}`);
      }

      await writeFile(path.join(reportsDir, `${pageSlug}.json`), result.report);

      const scores = {
        performance: result.lhr.categories.performance.score ?? 0,
        accessibility: result.lhr.categories.accessibility.score ?? 0,
        "best-practices": result.lhr.categories["best-practices"].score ?? 0,
        seo: result.lhr.categories.seo.score ?? 0
      };

      for (const [category, score] of Object.entries(scores)) {
        if (score < minimumScore) {
          failures.push(`${page} ${category} score ${score.toFixed(2)} is below ${minimumScore.toFixed(2)}`);
        }
      }
    } finally {
      if (chrome) {
        try {
          await chrome.kill();
        } catch {
          // Chrome cleanup can fail intermittently on Windows after results are already written.
        }
      }
    }
  }
});

if (failures.length) {
  throw new Error(`Lighthouse assertions failed:\n${failures.join("\n")}`);
}
