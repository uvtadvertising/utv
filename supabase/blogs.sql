-- Run in Supabase SQL Editor

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blogs enable row level security;

create policy "Public can read blogs"
  on public.blogs for select
  to anon, authenticated
  using (true);

create policy "Authenticated can insert blogs"
  on public.blogs for insert
  to authenticated
  with check (true);

create policy "Authenticated can update blogs"
  on public.blogs for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete blogs"
  on public.blogs for delete
  to authenticated
  using (true);

-- Storage bucket for cover + inline images
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "Public can read blog images"
  on storage.objects for select
  to public
  using (bucket_id = 'blog-images');

create policy "Authenticated can upload blog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images');

create policy "Authenticated can update blog images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-images');

create policy "Authenticated can delete blog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images');
