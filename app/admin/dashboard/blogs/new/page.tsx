import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">Add blog</h1>
        <p className="mt-2 text-sm text-muted">
          Publish when ready. If you leave with Back, unfinished work is saved as a draft.
        </p>
      </div>

      <BlogForm />
    </main>
  );
}
