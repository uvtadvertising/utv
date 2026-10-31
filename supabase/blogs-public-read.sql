-- If you already created the blogs table earlier, run this so the public site can read posts:

create policy "Public can read blogs"
  on public.blogs for select
  to anon, authenticated
  using (true);
