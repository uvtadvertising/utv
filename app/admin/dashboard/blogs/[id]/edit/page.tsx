import { notFound } from "next/navigation";
import { BlogForm } from "@/components/admin/blog-form";
import { createClient } from "@/lib/supabase/server";
import type { Blog } from "@/lib/blogs";

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("blogs").select("*").eq("id", id).maybeSingle();

  if (!data) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">Edit blog</h1>
        <p className="mt-2 text-sm text-muted">
          Publish when ready. Back saves unfinished changes as a draft.
        </p>
      </div>

      <BlogForm blog={data as Blog} />
    </main>
  );
}
