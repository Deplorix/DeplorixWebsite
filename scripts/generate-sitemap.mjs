#!/usr/bin/env node
/**
 * Automatically generates public/sitemap.xml from app routes and divisions.
 * Run via: node scripts/generate-sitemap.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const BASE_URL = "https://deplorixtechnologies.site";
const today = new Date().toISOString().split("T")[0];

const appContent = readFileSync("src/App.tsx", "utf8");
const divisionContent = readFileSync("src/data/divisions.ts", "utf8");

const rawRoutes = [...appContent.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
const divisionIds = [...divisionContent.matchAll(/^\s{4}id: "([^"]+)"/gm)].map((m) => m[1]);

const staticRoutes = rawRoutes.filter(
  (r) => r !== "*" && !r.includes(":") && !r.startsWith("/admin")
);

const allRoutes = new Set([
  ...staticRoutes,
  ...divisionIds.map((id) => `/work/${id}`),
]);

// Route configuration with priority and change frequency
const routeConfigs = {
  "/": { priority: "1.0", changefreq: "weekly", hasImage: true },
  "/about": { priority: "0.9", changefreq: "monthly" },
  "/services": { priority: "0.9", changefreq: "weekly" },
  "/products": { priority: "0.9", changefreq: "monthly" },
  "/internship": { priority: "0.9", changefreq: "weekly" },
  "/internships": { priority: "0.8", changefreq: "weekly" },
  "/internship/apply": { priority: "0.85", changefreq: "weekly" },
  "/contact": { priority: "0.9", changefreq: "monthly" },
  "/explore": { priority: "0.85", changefreq: "monthly" },
  "/learn": { priority: "0.9", changefreq: "weekly" },
  "/work/tech": { priority: "0.85", changefreq: "monthly" },
  "/work/digital": { priority: "0.85", changefreq: "monthly" },
  "/work/projects": { priority: "0.85", changefreq: "monthly" },
  "/work/bps": { priority: "0.85", changefreq: "monthly" },
  "/work/training": { priority: "0.85", changefreq: "monthly" },
  "/terms": { priority: "0.4", changefreq: "yearly" },
};

const entries = [...allRoutes].map((route) => {
  const config = routeConfigs[route] || { priority: "0.7", changefreq: "monthly" };
  const loc = `${BASE_URL}${route === "/" ? "" : route}`;

  let xml = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${config.changefreq}</changefreq>\n    <priority>${config.priority}</priority>`;

  if (config.hasImage) {
    xml += `\n    <image:image>\n      <image:loc>${BASE_URL}/og-image.jpg</image:loc>\n      <image:title>DeploriX Technologies — Software, AI &amp; Web Development Company in Bangalore</image:title>\n    </image:image>`;
  }

  xml += `\n  </url>`;
  return xml;
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", sitemapXml, "utf8");
console.log(`✅ Generated public/sitemap.xml with ${entries.length} URLs (lastmod: ${today})`);
