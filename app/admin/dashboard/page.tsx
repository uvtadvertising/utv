import Link from "next/link";
import { logout } from "../actions";
import { createClient } from "@/lib/supabase/server";
import type { Blog } from "@/lib/blogs";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, category, cover_image_url, created_at")
    .order("created_at", { ascending: false });

  const blogs = (data || []) as Pick<
    Blog,
    "id" | "title" | "slug" | "excerpt" | "category" | "cover_image_url" | "created_at"
  >[];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-accent">ADMIN</p>
          <h1 className="mt-3 text-3xl font-extrabold text-foreground">Dashboard</h1>
          <p className="mt-2 text-sm text-muted">Manage blogs stored in Supabase.</p>
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
            Could not load blogs. Run the SQL in <code>supabase/blogs.sql</code> first.
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
              className="flex gap-4 rounded-2xl border border-card-border bg-card p-4"
            >
              {blog.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={blog.cover_image_url}
                  alt=""
                  className="h-20 w-28 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="h-20 w-28 shrink-0 rounded-xl bg-navy/60" />
              )}
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-foreground">{blog.title}</p>
                <p className="mt-1 text-xs text-accent">{blog.category}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{blog.excerpt}</p>
                <p className="mt-2 text-xs text-muted">/{blog.slug}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
