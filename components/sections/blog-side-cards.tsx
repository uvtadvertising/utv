import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, type Blog } from "@/lib/blogs";

export function BlogSideCards({
  title,
  blogs,
}: {
  title: string;
  blogs: Blog[];
}) {
  if (blogs.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-3">
        <p className="shrink-0 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
          {title}
        </p>
        <div className="h-px flex-1 bg-card-border" />
      </div>

      <ul className="mt-5 space-y-4">
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link
              href={`/blog/${blog.slug}`}
              className="group flex gap-3 rounded-xl border border-card-border bg-card p-2.5 transition hover:border-accent/35"
            >
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-navy/50">
                {blog.cover_image_url ? (
                  <Image
                    src={blog.cover_image_url}
                    alt=""
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="80px"
                  />
                ) : null}
              </div>
              <div className="min-w-0 py-0.5">
                <p className="text-[10px] font-semibold tracking-[0.12em] text-accent uppercase">
                  {blog.category}
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition group-hover:text-accent">
                  {blog.title}
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  {formatBlogDate(blog.created_at)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
