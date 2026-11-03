"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowIcon } from "@/components/icons/arrow";
import {
  BLOG_CATEGORIES,
  BLOG_PAGE_SIZE,
  estimateReadTime,
  formatBlogDate,
  type Blog,
} from "@/lib/blogs";

type BlogPageViewProps = {
  blogs: Blog[];
  initialCategory?: string;
};

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

function matchesQuery(blog: Blog, query: string) {
  if (!query) return true;
  const haystack = [
    blog.title,
    blog.excerpt,
    blog.category,
    blog.slug,
    blog.content.replace(/<[^>]*>/g, " "),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function BlogPageView({ blogs, initialCategory }: BlogPageViewProps) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(initialCategory || "");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return blogs.filter((blog) => {
      if (category && blog.category !== category) return false;
      return matchesQuery(blog, query);
    });
  }, [blogs, category, q]);

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);
  const totalPages = Math.max(1, Math.ceil(rest.length / BLOG_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = rest.slice(
    (currentPage - 1) * BLOG_PAGE_SIZE,
    currentPage * BLOG_PAGE_SIZE,
  );

  function setFilterCategory(next: string) {
    setCategory(next);
    setPage(1);
  }

  return (
    <>
      <section className="relative overflow-hidden bg-background">
        <div className="pointer-events-none absolute -left-24 top-20 size-[420px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-16 bottom-0 size-[360px] rounded-full bg-accent-end/10 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl px-5 pb-14 pt-28 text-center md:px-8 md:pb-16 md:pt-32 lg:px-16">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-accent">
            INSIGHTS & RESOURCES
          </p>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            Marketing insights for your next stage of{" "}
            <span className="text-accent">growth.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-[17px]">
            Practical articles on SEO, paid ads, websites, and digital strategy —
            written for businesses that want clearer next steps.
          </p>

          <div className="mx-auto mt-9 flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-card-border bg-card p-2 shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
            <span className="pl-3 text-muted" aria-hidden>
              <svg viewBox="0 0 24 24" className="size-5" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
                <path
                  d="M20 20l-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search articles, topics or marketing tips..."
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-foreground outline-none placeholder:text-muted/70"
              aria-label="Search blogs"
            />
            <button
              type="button"
              onClick={() => setPage(1)}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition hover:brightness-110"
              aria-label="Search"
            >
              <ArrowIcon className="size-3.5" />
            </button>
          </div>
        </div>
      </section>

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
            <button
              type="button"
              onClick={() => setFilterCategory("")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                !category
                  ? "bg-accent text-white"
                  : "border border-card-border bg-card text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              All Articles
            </button>
            {BLOG_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilterCategory(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === item
                    ? "bg-accent text-white"
                    : "border border-card-border bg-card text-muted hover:border-accent/40 hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-card-border bg-card px-5 py-8 text-sm text-muted">
              {blogs.length === 0
                ? "No blogs published yet."
                : "No articles match your search."}
            </p>
          ) : pageItems.length === 0 && !featured ? (
            <p className="mt-10 rounded-2xl border border-card-border bg-card px-5 py-8 text-sm text-muted">
              No more articles in this view.
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
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`rounded-full border border-card-border px-4 py-2 text-sm ${
                  currentPage === 1
                    ? "cursor-not-allowed text-muted/40"
                    : "text-muted hover:border-accent/40 hover:text-foreground"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold ${
                    n === currentPage
                      ? "bg-accent text-white"
                      : "border border-card-border text-muted hover:border-accent/40 hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`rounded-full border border-card-border px-4 py-2 text-sm ${
                  currentPage === totalPages
                    ? "cursor-not-allowed text-muted/40"
                    : "text-muted hover:border-accent/40 hover:text-foreground"
                }`}
              >
                Next
              </button>
            </nav>
          ) : null}
        </section>
      </div>
    </>
  );
}
