import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/portfolio", priority: 0.9 },
    { path: "/automotive", priority: 0.9 },
    { path: "/business-ads", priority: 0.9 },
    { path: "/hunting-outdoor", priority: 0.9 },
    { path: "/about", priority: 0.7 },
    { path: "/reviews", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
    { path: "/cookies", priority: 0.2 },
  ].map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${site.url}/work/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
