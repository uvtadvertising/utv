import { createClient } from "@/lib/supabase/server";
import type { Blog } from "@/lib/blogs";

export async function getBlogs(filters?: {
  category?: string;
  q?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("blogs")
    .select(
      "id, title, slug, excerpt, content, cover_image_url, category, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.q) {
    const safe = filters.q.replace(/[%_,.()]/g, " ").trim();
    if (safe) {
      query = query.or(`title.ilike.%${safe}%,excerpt.ilike.%${safe}%`);
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error("getBlogs:", error.message);
    return [] as Blog[];
  }

  return (data || []) as Blog[];
}

export async function getBlogBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, title, slug, excerpt, content, cover_image_url, category, created_at, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getBlogBySlug:", error.message);
    return null;
  }

  return data as Blog | null;
}

export async function getRecentBlogs(excludeSlug: string, limit = 3) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, title, slug, excerpt, content, cover_image_url, category, created_at, updated_at",
    )
    .neq("slug", excludeSlug)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentBlogs:", error.message);
    return [] as Blog[];
  }

  return (data || []) as Blog[];
}

export async function getRelatedBlogs(
  category: string,
  excludeSlug: string,
  limit = 3,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, title, slug, excerpt, content, cover_image_url, category, created_at, updated_at",
    )
    .eq("category", category)
    .neq("slug", excludeSlug)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRelatedBlogs:", error.message);
    return [] as Blog[];
  }

  return (data || []) as Blog[];
}
