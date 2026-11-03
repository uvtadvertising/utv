import type { MetadataRoute } from "next";
import { getBlogs } from "@/lib/get-blogs";
import { siteConfig } from "@/lib/site";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/portfolio",
  "/blog",
  "/faq",
  "/contact",
  "/stoke-on-trent",
  "/staffordshire",
  "/privacy",
  "/terms",
  "/cookies",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/blog" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/blog" || path === "/services" ? 0.8 : 0.6,
  }));

  const blogs = await getBlogs();
  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${siteConfig.url}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at || blog.created_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...blogPages];
}
