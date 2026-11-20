import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogRelated } from "@/components/sections/blog-related";
import { BlogSideCards } from "@/components/sections/blog-side-cards";
import { estimateReadTime, formatBlogDate } from "@/lib/blogs";
import {
  getBlogBySlug,
  getRecentBlogs,
  getRelatedBlogs,
} from "@/lib/get-blogs";

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Blog | UVT Advertising" };

  return {
    title: `${blog.title} | UVT Advertising`,
    description: blog.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const [recent, related] = await Promise.all([
    getRecentBlogs(blog.slug, 3),
    getRelatedBlogs(blog.category, blog.slug, 3),
  ]);

  return (
    <article className="relative overflow-hidden bg-background pb-20 pt-28 md:pb-24 md:pt-32">
      <div className="pointer-events-none absolute -left-24 top-40 size-[380px] rounded-full bg-accent/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 top-[28rem] size-[320px] rounded-full bg-accent-end/10 blur-[110px]" />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8 lg:px-12">
        <Link href="/blog" className="text-sm text-muted transition hover:text-accent">
          ← Back to blog
        </Link>

        <header className="mt-8 max-w-4xl">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 font-semibold tracking-[0.12em] text-accent uppercase">
              {blog.category}
            </span>
            <span className="text-muted">
              {formatBlogDate(blog.created_at)} · {estimateReadTime(blog.content)}{" "}
              MIN READ
            </span>
          </p>

          <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-[3.1rem]">
            {blog.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
            {blog.excerpt}
          </p>
        </header>

        {blog.cover_image_url ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-card-border shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
            <Image
              src={blog.cover_image_url}
              alt={blog.title}
              width={1400}
              height={720}
              className="aspect-[16/8] w-full object-cover"
              priority
            />
          </div>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          <div className="rounded-2xl border border-card-border bg-card/40 p-5 sm:p-7 lg:p-8">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <BlogSideCards title="Recent Posts" blogs={recent} />
          </aside>
        </div>

        <BlogRelated blogs={related} />
      </div>
    </article>
  );
}
