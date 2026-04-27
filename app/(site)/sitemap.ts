// src/app/(site)/sitemap.ts
import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { toolCategoryArray } from "./(tools)/tools";

const BASE_URL = "https://aicaloriecounter.ai";
const LEGAL_ROUTES = new Set([
  "/privacy",
  "/terms",
  "/cookies",
  "/security",
  "/subprocessors",
]);
const UTILITY_ROUTES = new Set(["/sitemap-html"]);

function stripRouteGroups(route: string) {
  // route like "/(general)/about" or "/blog/(body-fat)/bmi-vs-body-fat"
  const cleaned =
    "/" +
    route
      .split("/")
      .filter(Boolean)
      .filter((seg) => !(seg.startsWith("(") && seg.endsWith(")")))
      .join("/");

  // root should be "/"
  return cleaned === "/" ? "/" : cleaned.replace(/\/+$/g, "");
}

function isDynamicRoute(route: string) {
  return route.split("/").some((segment) => segment.includes("[") && segment.includes("]"));
}

type SitemapEntry = {
  url: string;
  route: string;
  absolutePath: string;
  lastModified: Date;
};

function getRouteSignals(
  route: string,
  absolutePath: string
): Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority"> {
  if (route === "/") {
    return { changeFrequency: "weekly", priority: 1 };
  }

  if (route === "/estimate") {
    return { changeFrequency: "weekly", priority: 0.95 };
  }

  if (route === "/tools" || route === "/blog") {
    return { changeFrequency: "weekly", priority: 0.9 };
  }

  if (absolutePath.includes(`${path.sep}(tools)${path.sep}`)) {
    return { changeFrequency: "weekly", priority: 0.85 };
  }

  if (absolutePath.includes(`${path.sep}blog${path.sep}`)) {
    return { changeFrequency: "monthly", priority: 0.8 };
  }

  if (LEGAL_ROUTES.has(route)) {
    return { changeFrequency: "yearly", priority: 0.2 };
  }

  if (route === "/about" || route === "/contact") {
    return { changeFrequency: "monthly", priority: 0.4 };
  }

  return { changeFrequency: "monthly", priority: 0.5 };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pagesDirectory = path.join(process.cwd(), "app/(site)");
  const entries: SitemapEntry[] = [];

  function readPagesDirectory(directory: string) {
    fs.readdirSync(directory).forEach((file) => {
      const absolutePath = path.join(directory, file);
      const stat = fs.statSync(absolutePath);

      if (stat.isDirectory()) {
        readPagesDirectory(absolutePath);
        return;
      }

      const isPage =
        absolutePath.endsWith(`${path.sep}page.tsx`) ||
        absolutePath.endsWith("/page.tsx");

      const isExcluded =
        absolutePath.includes(`${path.sep}api${path.sep}`) ||
        absolutePath.includes(`${path.sep}layout.tsx`) ||
        absolutePath.includes("[...not-found]");

      if (!isPage || isExcluded) return;

      // Convert file path -> route path
      let route = absolutePath
        .replace(pagesDirectory, "")
        .replace(/\\/g, "/")
        .replace(/\/page\.tsx$/, "");

      route = stripRouteGroups(route);
      if (isDynamicRoute(route)) return;

      if (UTILITY_ROUTES.has(route)) return;

      // build full URL
      const full = route === "/" ? BASE_URL : `${BASE_URL}${route}`;
      entries.push({
        url: full,
        route,
        absolutePath,
        lastModified: stat.mtime,
      });
    });
  }

  readPagesDirectory(pagesDirectory);

  const toolsConfigPath = path.join(process.cwd(), "app/(site)/(tools)/tools.ts");
  const categoryMTime = fs.existsSync(toolsConfigPath)
    ? fs.statSync(toolsConfigPath).mtime
    : new Date();
  const categoryTemplatePath = path.join(
    process.cwd(),
    "app/(site)/(tools)/tools/[category]/page.tsx"
  );

  toolCategoryArray().forEach((category) => {
    entries.push({
      url: `${BASE_URL}/tools/${category.slug}`,
      route: `/tools/${category.slug}`,
      absolutePath: categoryTemplatePath,
      lastModified: categoryMTime,
    });
  });

  const dedupedEntries = Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());

  return dedupedEntries.map((entry) => {
    const signals = getRouteSignals(entry.route, entry.absolutePath);
    return {
      url: entry.url,
      lastModified: entry.lastModified,
      changeFrequency: signals.changeFrequency,
      priority: signals.priority,
    };
  });
}
