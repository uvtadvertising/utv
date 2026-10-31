"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { RichEditor } from "@/components/admin/rich-editor";
import { uploadBlogImage } from "@/lib/blog-images";
import { BLOG_CATEGORIES, blogProgress, slugify } from "@/lib/blogs";
import { createBlog, type CreateBlogState } from "../actions";

const field =
  "w-full rounded-xl border border-card-border bg-navy/40 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/70 focus:border-accent/50";

const initialState: CreateBlogState = {};
const EXCERPT_MAX = 180;

export function BlogForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [state, formAction, pending] = useActionState(createBlog, initialState);

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
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1.45fr_0.75fr]">
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="cover_image_url" value={coverImageUrl} />

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
                name="title"
                value={title}
                onChange={(e) => {
                  const next = e.target.value;
                  setTitle(next);
                  if (!slugTouched) setSlug(slugify(next));
                }}
                className={field}
                placeholder="Write a clear, specific title"
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="mb-2 block text-sm font-medium">
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                className={field}
                placeholder="url-friendly-slug"
                required
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
            <RichEditor onChange={setContent} />
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
            Fill title, slug, content, cover, category, and short description.
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
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={field}
              required
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
              name="excerpt"
              value={excerpt}
              maxLength={EXCERPT_MAX}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={4}
              className={`${field} resize-y`}
              placeholder="Shown under the blog title on cards and article pages"
              required
            />
          </div>
        </div>

        {state.error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {state.error}
          </p>
        ) : null}

        <div className="flex gap-3">
          <Link
            href="/admin/dashboard"
            className="rounded-xl border border-card-border px-4 py-3 text-sm font-medium text-foreground transition hover:border-accent/40"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending || uploadingCover || progress < 100}
            className="btn-gradient flex-1 rounded-xl px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save blog"}
          </button>
        </div>
      </aside>
    </form>
  );
}
