import Link from "next/link";
import { BlogForm } from "./blog-form";

export default function NewBlogPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="text-sm text-muted hover:text-accent">
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold text-foreground">Add blog</h1>
        <p className="mt-2 text-sm text-muted">
          Write the post, upload a title image, and save it to Supabase.
        </p>
      </div>

      <BlogForm />
    </main>
  );
}
