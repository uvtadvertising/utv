export const BLOG_CATEGORIES = [
  "Digital Marketing",
  "SEO",
  "Web Design",
  "Paid Ads",
  "Business Growth",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: string;
  created_at: string;
  updated_at: string;
};

export const BLOG_PAGE_SIZE = 6;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatBlogDate(value: string) {
  return new Date(value)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

export function estimateReadTime(html: string) {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function blogProgress(fields: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: string;
}) {
  const checks = [
    fields.title.trim().length > 0,
    fields.slug.trim().length > 0,
    fields.excerpt.trim().length > 0,
    fields.content.replace(/<[^>]*>/g, "").trim().length > 0 ||
      fields.content.includes("<img"),
    fields.coverImageUrl.trim().length > 0,
    fields.category.trim().length > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
