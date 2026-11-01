"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BLOG_CATEGORIES, slugify, type BlogStatus } from "@/lib/blogs";

export type BlogActionState = {
  error?: string;
  id?: string;
  savedAs?: BlogStatus;
};

type BlogPayload = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: string;
};

function readPayload(formData: FormData): BlogPayload {
  return {
    title: String(formData.get("title") || "").trim(),
    slug: String(formData.get("slug") || "").trim(),
    excerpt: String(formData.get("excerpt") || "").trim(),
    content: String(formData.get("content") || "").trim(),
    coverImageUrl: String(formData.get("cover_image_url") || "").trim(),
    category: String(formData.get("category") || "").trim(),
  };
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function draftSlug(title: string, slugInput: string) {
  const fromInput = slugify(slugInput || title);
  if (fromInput) return fromInput;
  return `draft-${crypto.randomUUID().slice(0, 8)}`;
}

export async function saveDraft(
  _prev: BlogActionState,
  formData: FormData,
): Promise<BlogActionState> {
  const id = String(formData.get("id") || "").trim() || undefined;
  const payload = readPayload(formData);
  const { supabase, user } = await requireUser();

  if (!user) return { error: "You must be signed in." };

  const row = {
    title: payload.title || "Untitled draft",
    slug: draftSlug(payload.title, payload.slug),
    excerpt: payload.excerpt,
    content: payload.content,
    cover_image_url: payload.coverImageUrl || null,
    category: payload.category,
    status: "draft" as const,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("blogs").update(row).eq("id", id);
    if (error) {
      if (error.code === "23505") {
        return { error: "This slug is already used. Change the title or slug." };
      }
      return { error: error.message };
    }
    revalidatePath("/admin/dashboard");
    revalidatePath("/blog");
    return { id, savedAs: "draft" };
  }

  const { data, error } = await supabase
    .from("blogs")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "This slug is already used. Change the title or slug." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/dashboard");
  return { id: data.id, savedAs: "draft" };
}

export async function publishBlog(
  _prev: BlogActionState,
  formData: FormData,
): Promise<BlogActionState> {
  const id = String(formData.get("id") || "").trim() || undefined;
  const payload = readPayload(formData);
  const slug = slugify(payload.slug || payload.title);

  if (
    !payload.title ||
    !slug ||
    !payload.excerpt ||
    !payload.content ||
    !payload.coverImageUrl ||
    !payload.category
  ) {
    return { error: "Please fill all fields before publishing." };
  }

  if (!BLOG_CATEGORIES.includes(payload.category as (typeof BLOG_CATEGORIES)[number])) {
    return { error: "Please select a valid category." };
  }

  const { supabase, user } = await requireUser();
  if (!user) return { error: "You must be signed in." };

  const row = {
    title: payload.title,
    slug,
    excerpt: payload.excerpt,
    content: payload.content,
    cover_image_url: payload.coverImageUrl,
    category: payload.category,
    status: "published" as const,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("blogs").update(row).eq("id", id);
    if (error) {
      if (error.code === "23505") {
        return { error: "This slug is already used. Change the title or slug." };
      }
      return { error: error.message };
    }
  } else {
    const { error } = await supabase.from("blogs").insert(row);
    if (error) {
      if (error.code === "23505") {
        return { error: "This slug is already used. Change the title or slug." };
      }
      return { error: error.message };
    }
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/blog");
  redirect("/admin/dashboard");
}

export async function deleteBlog(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  if (!id) return;

  const { supabase, user } = await requireUser();
  if (!user) return;

  await supabase.from("blogs").delete().eq("id", id);
  revalidatePath("/admin/dashboard");
  revalidatePath("/blog");
  redirect("/admin/dashboard");
}
