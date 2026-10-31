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
    <article className="bg-background pb-20 pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8 lg:px-12">
        <Link href="/blog" className="text-sm text-muted hover:text-accent">
          ← Back to blog
        </Link>

        <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="font-semibold tracking-[0.12em] text-accent uppercase">
            {blog.category}
          </span>
          <span className="text-muted">
            {formatBlogDate(blog.created_at)} · {estimateReadTime(blog.content)}{" "}
            MIN READ
          </span>
        </p>

        <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {blog.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
          {blog.excerpt}
        </p>

        {blog.cover_image_url ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-card-border">
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
          <div
            className="blog-content text-base leading-relaxed text-foreground [&_a]:text-accent [&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:border-accent/50 [&_blockquote]:pl-4 [&_blockquote]:text-muted [&_em]:italic [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_hr]:my-8 [&_hr]:border-card-border [&_img]:my-6 [&_img]:max-w-full [&_img]:rounded-xl [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_strong]:font-bold [&_u]:underline [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <BlogSideCards title="Recent Posts" blogs={recent} />
          </aside>
        </div>

        <BlogRelated blogs={related} />
      </div>
    </article>
  );
}
