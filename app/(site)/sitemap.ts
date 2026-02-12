// src/app/(site)/sitemap.ts
import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const BASE_URL = "https://bodyfatestimator.ai";

function stripRouteGroups(route: string) {
  // route like "/(general)/about" or "/guides/(body-fat)/bmi-vs-body-fat"
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

export default function sitemap(): MetadataRoute.Sitemap {
  const pagesDirectory = path.join(process.cwd(), "app/(site)");
  const urls: string[] = [];

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

      // build full URL
      const full = route === "/" ? BASE_URL : `${BASE_URL}${route}`;
      urls.push(full);
    });
  }

  readPagesDirectory(pagesDirectory);

  return urls.map((url) => ({
    url,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));
}
