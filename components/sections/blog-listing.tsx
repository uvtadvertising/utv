import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons/arrow";
import {
  BLOG_CATEGORIES,
  BLOG_PAGE_SIZE,
  estimateReadTime,
  formatBlogDate,
  type Blog,
} from "@/lib/blogs";

type BlogListingProps = {
  blogs: Blog[];
  category?: string;
  q?: string;
  page: number;
};

function buildHref(params: {
  category?: string;
  q?: string;
  page?: number;
}) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.q) search.set("q", params.q);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const value = search.toString();
  return value ? `/blog?${value}` : "/blog";
}

function Meta({ blog }: { blog: Blog }) {
  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      <span className="font-semibold tracking-[0.12em] text-accent uppercase">
        {blog.category}
      </span>
      <span className="text-muted">
        {formatBlogDate(blog.created_at)} · {estimateReadTime(blog.content)} MIN
        READ
      </span>
    </p>
  );
}

export function BlogListing({ blogs, category, q, page }: BlogListingProps) {
  const featured = blogs[0] ?? null;
  const rest = blogs.slice(1);
  const totalPages = Math.max(1, Math.ceil(rest.length / BLOG_PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * BLOG_PAGE_SIZE;
  const pageItems = rest.slice(start, start + BLOG_PAGE_SIZE);

  return (
    <div className="bg-background pb-20 md:pb-24">
      {featured ? (
        <section className="mx-auto max-w-7xl px-5 md:px-8 lg:px-16">
          <div className="flex items-center gap-4">
            <p className="shrink-0 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
              Featured Insight
            </p>
            <div className="h-px flex-1 bg-card-border" />
          </div>

          <article className="mt-8">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl border border-card-border">
                {featured.cover_image_url ? (
                  <Image
                    src={featured.cover_image_url}
                    alt={featured.title}
                    width={1400}
                    height={720}
                    className="aspect-[16/8] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    priority
                  />
                ) : (
                  <div className="aspect-[16/8] w-full bg-card" />
                )}
                <span className="absolute left-4 top-4 rounded-md bg-navy/90 px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-foreground uppercase">
                  Featured
                </span>
              </div>

              <Meta blog={featured} />
              <h2 className="mt-3 max-w-4xl text-2xl font-extrabold leading-tight tracking-tight text-foreground transition group-hover:text-accent sm:text-3xl lg:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
                {featured.excerpt}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                Read featured article
                <ArrowIcon className="size-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          </article>
        </section>
      ) : null}

      <section className="mx-auto mt-16 max-w-7xl px-5 md:mt-20 md:px-8 lg:px-16">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
          Our Latest Thinking
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Explore our latest insights
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Straightforward advice to help you make smarter marketing decisions.
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link
            href={buildHref({ q })}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              !category
                ? "bg-accent text-white"
                : "border border-card-border bg-card text-muted hover:border-accent/40 hover:text-foreground"
            }`}
          >
            All Articles
          </Link>
          {BLOG_CATEGORIES.map((item) => (
            <Link
              key={item}
              href={buildHref({ category: item, q })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                category === item
                  ? "bg-accent text-white"
                  : "border border-card-border bg-card text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        {pageItems.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-card-border bg-card px-5 py-8 text-sm text-muted">
            {blogs.length === 0
              ? "No blogs published yet."
              : "No more articles in this view."}
          </p>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-12">
            {pageItems.map((blog) => (
              <article key={blog.id} className="group">
                <Link href={`/blog/${blog.slug}`} className="block">
                  <div className="overflow-hidden rounded-2xl border border-card-border">
                    {blog.cover_image_url ? (
                      <Image
                        src={blog.cover_image_url}
                        alt={blog.title}
                        width={800}
                        height={500}
                        className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="aspect-[16/10] w-full bg-card" />
                    )}
                  </div>
                  <Meta blog={blog} />
                  <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-foreground transition group-hover:text-accent">
                    {blog.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                    {blog.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Read article
                    <ArrowIcon className="size-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <nav
            className="mt-14 flex flex-wrap items-center justify-center gap-2"
            aria-label="Blog pagination"
          >
            <Link
              href={buildHref({
                category,
                q,
                page: Math.max(1, currentPage - 1),
              })}
              aria-disabled={currentPage === 1}
              className={`rounded-full border border-card-border px-4 py-2 text-sm ${
                currentPage === 1
                  ? "pointer-events-none text-muted/40"
                  : "text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              Previous
            </Link>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={buildHref({ category, q, page: n })}
                className={`inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold ${
                  n === currentPage
                    ? "bg-accent text-white"
                    : "border border-card-border text-muted hover:border-accent/40 hover:text-foreground"
                }`}
              >
                {n}
              </Link>
            ))}

            <Link
              href={buildHref({
                category,
                q,
                page: Math.min(totalPages, currentPage + 1),
              })}
              aria-disabled={currentPage === totalPages}
              className={`rounded-full border border-card-border px-4 py-2 text-sm ${
                currentPage === totalPages
                  ? "pointer-events-none text-muted/40"
                  : "text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              Next
            </Link>
          </nav>
        ) : null}
      </section>
    </div>
  );
}
