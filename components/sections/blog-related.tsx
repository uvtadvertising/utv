import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons/arrow";
import { formatBlogDate, type Blog } from "@/lib/blogs";

export function BlogRelated({ blogs }: { blogs: Blog[] }) {
  if (blogs.length === 0) return null;

  return (
    <section className="mt-16 border-t border-card-border pt-12">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
        Related Posts
      </p>
      <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">
        More from this category
      </h2>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.slug}`}
            className="group overflow-hidden rounded-2xl border border-card-border bg-card transition hover:border-accent/35"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-navy/40">
              {blog.cover_image_url ? (
                <Image
                  src={blog.cover_image_url}
                  alt={blog.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : null}
            </div>
            <div className="p-4">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-accent uppercase">
                {blog.category} · {formatBlogDate(blog.created_at)}
              </p>
              <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-foreground transition group-hover:text-accent">
                {blog.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{blog.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                Read article
                <ArrowIcon className="size-3 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
