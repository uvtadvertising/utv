import { ArrowIcon } from "@/components/icons/arrow";

type BlogHeroProps = {
  q?: string;
  category?: string;
};

export function BlogHero({ q = "", category }: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-24 top-20 size-[420px] rounded-full bg-accent/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-[360px] rounded-full bg-accent-end/10 blur-[100px]" />

      <div className="relative mx-auto max-w-4xl px-5 pb-14 pt-28 text-center md:px-8 md:pb-16 md:pt-32 lg:px-16">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-accent">
          INSIGHTS & RESOURCES
        </p>

        <h1 className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
          Marketing insights for your next stage of{" "}
          <span className="text-accent">growth.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-[17px]">
          Practical articles on SEO, paid ads, websites, and digital strategy —
          written for businesses that want clearer next steps.
        </p>

        <form
          action="/blog"
          method="get"
          className="mx-auto mt-9 flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-card-border bg-card p-2 shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
        >
          {category ? <input type="hidden" name="category" value={category} /> : null}
          <span className="pl-3 text-muted" aria-hidden>
            <svg viewBox="0 0 24 24" className="size-5" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search articles, topics or marketing tips..."
            className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-foreground outline-none placeholder:text-muted/70"
            aria-label="Search blogs"
          />
          <button
            type="submit"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition hover:brightness-110"
            aria-label="Search"
          >
            <ArrowIcon className="size-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
}
