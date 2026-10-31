import type { Metadata } from "next";
import { BlogHero } from "@/components/sections/blog-hero";
import { BlogListing } from "@/components/sections/blog-listing";
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
    q?: string;
    page?: string;
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const category = BLOG_CATEGORIES.includes(
    params.category as (typeof BLOG_CATEGORIES)[number],
  )
    ? params.category
    : undefined;
  const page = Number(params.page) || 1;

  const blogs = await getBlogs({ category, q });

  return (
    <>
      <BlogHero q={q} category={category} />
      <BlogListing blogs={blogs} category={category} q={q} page={page} />
    </>
  );
}
