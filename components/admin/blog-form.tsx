"use client";

import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RichEditor } from "@/components/admin/rich-editor";
import { uploadBlogImage } from "@/lib/blog-images";
import {
  BLOG_CATEGORIES,
  blogProgress,
  hasDraftContent,
  slugify,
  type Blog,
} from "@/lib/blogs";
import { createClient } from "@/lib/supabase/client";
import {
  publishBlog,
  type BlogActionState,
} from "@/app/admin/dashboard/blogs/actions";

const field =
  "w-full rounded-xl border border-card-border bg-navy/40 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/70 focus:border-accent/50";

const initialState: BlogActionState = {};
const EXCERPT_MAX = 180;

type BlogFormProps = {
  blog?: Blog;
};

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const [id, setId] = useState(blog?.id || "");
  const [title, setTitle] = useState(
    blog?.title === "Untitled draft" ? "" : blog?.title || "",
  );
  const [slug, setSlug] = useState(
    blog?.slug?.startsWith("draft-") && blog?.title === "Untitled draft"
      ? ""
      : blog?.slug || "",
  );
  const [slugTouched, setSlugTouched] = useState(
    Boolean(blog?.slug && !blog.slug.startsWith("draft-")),
  );
  const [excerpt, setExcerpt] = useState(blog?.excerpt || "");
  const [content, setContent] = useState(blog?.content || "");
  const [category, setCategory] = useState(blog?.category || "");
  const [coverImageUrl, setCoverImageUrl] = useState(blog?.cover_image_url || "");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [publishState, publishAction, publishing] = useActionState(
    publishBlog,
    initialState,
  );

  const valuesRef = useRef({
    id,
    title,
    slug,
    excerpt,
    content,
    coverImageUrl,
    category,
  });
  const publishedRef = useRef(false);

  valuesRef.current = {
    id,
    title,
    slug,
    excerpt,
    content,
    coverImageUrl,
    category,
  };

  const progress = useMemo(
    () =>
      blogProgress({
        title,
        slug,
        excerpt,
        content,
        coverImageUrl,
        category,
      }),
    [title, slug, excerpt, content, coverImageUrl, category],
  );

  const persistDraft = useCallback(async () => {
    if (publishedRef.current) return null;

    const current = valuesRef.current;
    if (
      !hasDraftContent({
        title: current.title,
        slug: current.slug,
        excerpt: current.excerpt,
        content: current.content,
        coverImageUrl: current.coverImageUrl,
        category: current.category,
      })
    ) {
      return null;
    }

    const supabase = createClient();
    const fromInput = slugify(current.slug || current.title);
    const nextSlug =
      fromInput ||
      (current.id ? undefined : `draft-${crypto.randomUUID().slice(0, 8)}`);

    const row: Record<string, string | null> = {
      title: current.title || "Untitled draft",
      excerpt: current.excerpt,
      content: current.content,
      cover_image_url: current.coverImageUrl || null,
      category: current.category,
      status: "draft",
      updated_at: new Date().toISOString(),
    };

    if (nextSlug) row.slug = nextSlug;

    if (current.id) {
      const { error } = await supabase.from("blogs").update(row).eq("id", current.id);
      if (error) throw new Error(error.message);
      return current.id;
    }

    if (!row.slug) {
      row.slug = `draft-${crypto.randomUUID().slice(0, 8)}`;
    }

    const { data, error } = await supabase
      .from("blogs")
      .insert(row)
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    valuesRef.current.id = data.id;
    setId(data.id);
    return data.id as string;
  }, []);

  // Only save draft when the user actually leaves the page (not while typing).
  useEffect(() => {
    function onLeave() {
      if (publishedRef.current) return;
      void persistDraft();
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") onLeave();
    }

    window.addEventListener("pagehide", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [persistDraft]);

  async function goBack() {
    setLeaving(true);
    try {
      await persistDraft();
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Draft could not be saved.");
      setLeaving(false);
    }
  }

  async function onCoverChange(file: File | undefined) {
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadBlogImage(file, "covers");
      setCoverImageUrl(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Cover upload failed.");
    } finally {
      setUploadingCover(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.45fr_0.75fr]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
            Post details
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => {
                  const next = e.target.value;
                  setTitle(next);
                  if (!slugTouched) setSlug(slugify(next));
                }}
                className={field}
                placeholder="Write a clear, specific title"
              />
            </div>

            <div>
              <label htmlFor="slug" className="mb-2 block text-sm font-medium">
                Slug
              </label>
              <input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                className={field}
                placeholder="url-friendly-slug"
              />
              <p className="mt-2 text-xs text-muted">/blog/{slug || "your-slug"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
            Content
          </p>
          <p className="mt-2 text-sm text-muted">
            Use headings, lists, quotes, links, and images to structure the article.
          </p>
          <div className="mt-4">
            <RichEditor initialHtml={blog?.content || ""} onChange={setContent} />
          </div>
        </div>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">Progress</p>
            <p className="text-sm font-semibold text-accent">{progress}%</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-end transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-muted">
            Nothing is saved until you publish, or leave with Back.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-card-border bg-card p-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Title image</label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-card-border bg-navy/30 px-4 py-6 text-center transition hover:border-accent/40">
              <span className="text-sm font-medium text-foreground">
                {uploadingCover ? "Uploading…" : "Upload cover image"}
              </span>
              <span className="mt-1 text-xs text-muted">JPG, PNG or WebP</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onCoverChange(e.target.files?.[0])}
              />
            </label>
            {coverImageUrl ? (
              <div className="relative mt-3 overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="h-40 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImageUrl("")}
                  className="absolute right-2 top-2 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  Remove
                </button>
              </div>
            ) : null}
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={field}
            >
              <option value="">Select category</option>
              {BLOG_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label htmlFor="excerpt" className="block text-sm font-medium">
                Short description
              </label>
              <span className="text-xs text-muted">
                {excerpt.length}/{EXCERPT_MAX}
              </span>
            </div>
            <textarea
              id="excerpt"
              value={excerpt}
              maxLength={EXCERPT_MAX}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={4}
              className={`${field} resize-y`}
              placeholder="Shown under the blog title on cards and article pages"
            />
          </div>
        </div>

        {publishState.error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {publishState.error}
          </p>
        ) : null}

        <form
          action={(formData) => {
            publishedRef.current = true;
            publishAction(formData);
          }}
          className="flex gap-3"
        >
          {id ? <input type="hidden" name="id" value={id} /> : null}
          <input type="hidden" name="title" value={title} />
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="excerpt" value={excerpt} />
          <input type="hidden" name="content" value={content} />
          <input type="hidden" name="cover_image_url" value={coverImageUrl} />
          <input type="hidden" name="category" value={category} />
          <button
            type="button"
            onClick={() => void goBack()}
            disabled={leaving || publishing}
            className="rounded-xl border border-card-border px-4 py-3 text-sm font-medium text-foreground transition hover:border-accent/40 disabled:opacity-60"
          >
            {leaving ? "Saving…" : "Back"}
          </button>
          <button
            type="submit"
            disabled={publishing || uploadingCover || leaving || progress < 100}
            className="btn-gradient flex-1 rounded-xl px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {publishing ? "Publishing…" : "Publish"}
          </button>
        </form>
      </aside>
    </div>
  );
}
