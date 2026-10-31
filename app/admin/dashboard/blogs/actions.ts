"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BLOG_CATEGORIES, slugify } from "@/lib/blogs";

export type CreateBlogState = {
  error?: string;
};

export async function createBlog(
  _prev: CreateBlogState,
  formData: FormData,
): Promise<CreateBlogState> {
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") || "").trim();
  const category = String(formData.get("category") || "").trim();

  const slug = slugify(slugInput || title);

  if (!title || !slug || !excerpt || !content || !coverImageUrl || !category) {
    return { error: "Please fill all fields before publishing." };
  }

  if (!BLOG_CATEGORIES.includes(category as (typeof BLOG_CATEGORIES)[number])) {
    return { error: "Please select a valid category." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase.from("blogs").insert({
    title,
    slug,
    excerpt,
    content,
    cover_image_url: coverImageUrl,
    category,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "This slug is already used. Change the title or slug." };
    }
    return { error: error.message };
  }

  redirect("/admin/dashboard");
}
