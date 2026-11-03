import Link from "next/link";
import { DeleteBlogButton } from "@/components/admin/delete-blog-button";
import { logout } from "../actions";
import { createClient } from "@/lib/supabase/server";
import type { Blog } from "@/lib/blogs";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, title, slug, excerpt, category, cover_image_url, status, created_at, updated_at",
    )
    .order("updated_at", { ascending: false });

  const blogs = (data || []) as Pick<
    Blog,
    | "id"
    | "title"
    | "slug"
    | "excerpt"
    | "category"
    | "cover_image_url"
    | "status"
    | "created_at"
    | "updated_at"
  >[];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-accent">ADMIN</p>
          <h1 className="mt-3 text-3xl font-extrabold text-foreground">Dashboard</h1>
          <p className="mt-2 text-sm text-muted">Manage published posts and drafts.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/blogs/new"
            className="btn-gradient rounded-xl px-4 py-2.5 text-sm"
          >
            Add blog
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-xl border border-card-border bg-navy/40 px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-accent/40"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground">Blogs</h2>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Could not load blogs. If status column is missing, run{" "}
            <code>supabase/blogs-status.sql</code>.
            {error.message ? ` (${error.message})` : ""}
          </p>
        ) : null}

        {!error && blogs.length === 0 ? (
          <p className="mt-4 rounded-xl border border-card-border bg-card px-4 py-6 text-sm text-muted">
            No blogs yet. Click Add blog to create the first one.
          </p>
        ) : null}

        <ul className="mt-4 space-y-3">
          {blogs.map((blog) => (
            <li
              key={blog.id}
              className="flex flex-col gap-4 rounded-2xl border border-card-border bg-card p-4 sm:flex-row sm:items-center"
            >
              {blog.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={blog.cover_image_url}
                  alt=""
                  className="h-20 w-full shrink-0 rounded-xl object-cover sm:w-28"
                />
              ) : (
                <div className="h-20 w-full shrink-0 rounded-xl bg-navy/60 sm:w-28" />
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-base font-semibold text-foreground">
                    {blog.title}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase ${
                      blog.status === "published"
                        ? "bg-accent/15 text-accent"
                        : "bg-white/10 text-muted"
                    }`}
                  >
                    {blog.status || "published"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-accent">{blog.category || "No category"}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{blog.excerpt || "No excerpt yet"}</p>
                <p className="mt-2 text-xs text-muted">/{blog.slug}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/dashboard/blogs/${blog.id}/edit`}
                  className="rounded-xl border border-card-border px-3.5 py-2 text-sm font-medium text-foreground transition hover:border-accent/40"
                >
                  Edit
                </Link>
                <DeleteBlogButton id={blog.id} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
