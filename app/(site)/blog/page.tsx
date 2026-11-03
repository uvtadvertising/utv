import type { Metadata } from "next";
import { BlogPageView } from "@/components/sections/blog-page-view";
import { BLOG_CATEGORIES } from "@/lib/blogs";
import { getBlogs } from "@/lib/get-blogs";

export const metadata: Metadata = {
  title: "Blog | UVT Advertising",
  description:
    "Marketing insights on SEO, paid ads, web design, and growth for Stoke-on-Trent and Staffordshire businesses.",
};

type BlogPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const category = BLOG_CATEGORIES.includes(
    params.category as (typeof BLOG_CATEGORIES)[number],
  )
    ? params.category
    : undefined;

  const blogs = await getBlogs();

  return <BlogPageView blogs={blogs} initialCategory={category} />;
}
