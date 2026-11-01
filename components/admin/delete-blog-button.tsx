"use client";

import { deleteBlog } from "@/app/admin/dashboard/blogs/actions";

export function DeleteBlogButton({ id }: { id: string }) {
  return (
    <form action={deleteBlog}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("Delete this blog permanently?")) {
            e.preventDefault();
          }
        }}
        className="rounded-xl border border-red-500/30 px-3.5 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
      >
        Delete
      </button>
    </form>
  );
}
