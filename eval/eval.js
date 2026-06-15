import { Eval } from "braintrust";
import { ExactMatch } from "autoevals";
import { readFileSync } from "fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css  = (() => { try { return readFileSync(new URL("../src/css/main.css", import.meta.url), "utf8"); } catch { return ""; } })();
const vj   = (() => { try { return readFileSync(new URL("../vercel.json", import.meta.url), "utf8"); } catch { return ""; } })();

Eval("brt-inc-site-quality", {
  data: () => [
    { input: "has-bento-grid",         expected: "true",  metadata: { category: "layout" } },
    { input: "has-theme-toggle",       expected: "true",  metadata: { category: "ux" } },
    { input: "has-spaceX-dark",        expected: "true",  metadata: { category: "design-tokens" } },
    { input: "has-light-palette",      expected: "true",  metadata: { category: "design-tokens" } },
    { input: "has-midnight-palette",   expected: "true",  metadata: { category: "design-tokens" } },
    { input: "no-unsafe-inline-script",expected: "true",  metadata: { category: "security" } },
    { input: "has-manifest",           expected: "true",  metadata: { category: "pwa" } },
    { input: "has-sitemap-link",       expected: "true",  metadata: { category: "seo" } },
    { input: "has-space-grotesk",      expected: "true",  metadata: { category: "typography" } },
    { input: "has-lucide",             expected: "true",  metadata: { category: "icons" } },
    { input: "css-uses-layers",        expected: "true",  metadata: { category: "css-architecture" } },
    { input: "video-preload-fixed",    expected: "true",  metadata: { category: "performance" } },
  ],
  task: async (check) => {
    const checks = {
      "has-bento-grid":          () => String(html.includes("bento-grid")),
      "has-theme-toggle":        () => String(html.includes("theme-toggle")),
      "has-spaceX-dark":         () => String(css.includes("#0B0B0C") || html.includes("#0B0B0C")),
      "has-light-palette":       () => String(css.includes("[data-theme=\"light\"]") || html.includes("[data-theme=\"light\"]")),
      "has-midnight-palette":    () => String(css.includes("[data-theme=\"midnight\"]") || html.includes("[data-theme=\"midnight\"]")),
      "no-unsafe-inline-script": () => {
        const csp = vj.match(/"Content-Security-Policy"\s*,\s*"value"\s*:\s*"([^"]+)"/)?.[1] ?? "";
        const scriptSrc = csp.match(/script-src([^;]*)/)?.[1] ?? "";
        return String(!scriptSrc.includes("'unsafe-inline'"));
      },
      "has-manifest":            () => String(html.includes("manifest.json")),
      "has-sitemap-link":        () => String(html.includes("sitemap") || readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8").length > 0),
      "has-space-grotesk":       () => String(html.includes("Space+Grotesk") || html.includes("Space Grotesk")),
      "has-lucide":              () => String(html.includes("lucide")),
      "css-uses-layers":         () => String(css.includes("@layer")),
      "video-preload-fixed":     () => String(!html.includes('preload="auto"')),
    };
    return checks[check]?.() ?? "false";
  },
  scores: [ExactMatch],
});
