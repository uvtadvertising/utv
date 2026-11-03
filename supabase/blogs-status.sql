-- Run in Supabase SQL Editor (for existing blogs table)

alter table public.blogs
  add column if not exists status text not null default 'published'
  check (status in ('draft', 'published'));

update public.blogs set status = 'published' where status is null;

-- Public site: only published posts
drop policy if exists "Public can read blogs" on public.blogs;

create policy "Anon can read published blogs"
  on public.blogs for select
  to anon
  using (status = 'published');

create policy "Authenticated can read all blogs"
  on public.blogs for select
  to authenticated
  using (true);
